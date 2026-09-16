#!/usr/bin/env bash
# scripts/test-branch-protection.sh
# Comprehensive test suite for branch protection hooks and scripts.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PRE_PUSH="$REPO_DIR/.githooks/pre-push"
PRE_COMMIT="$REPO_DIR/.githooks/pre-commit"
SETUP_SCRIPT="$REPO_DIR/scripts/setup-branch-protection.sh"

PASSED=0
FAILED=0

assert_exit() {
  local test_name="$1"
  local expected_exit="$2"
  shift 2
  local actual_exit=0
  "$@" >/dev/null 2>&1 || actual_exit=$?

  if [[ "$actual_exit" -eq "$expected_exit" ]]; then
    echo "  ✅ PASS: $test_name (exit $actual_exit as expected)"
    PASSED=$((PASSED + 1))
  else
    echo "  ❌ FAIL: $test_name (expected exit $expected_exit, got $actual_exit)"
    FAILED=$((FAILED + 1))
  fi
}

echo "================================================================================"
echo "🧪 Running Branch Protection & Security Verification Tests"
echo "================================================================================"

echo ""
echo "--- 1. Testing .githooks/pre-push (Branch Deletion & History Rewrites) ---"

# Deletion of protected branches
assert_exit "Block deletion of 'main'" 1 \
  bash -c "printf '(delete) 0000000000000000000000000000000000000000 refs/heads/main 1111111111111111111111111111111111111111\n' | bash '$PRE_PUSH'"

assert_exit "Block deletion of 'main' without trailing newline (EOF edge case)" 1 \
  bash -c "printf '(delete) 0000000000000000000000000000000000000000 refs/heads/main 1111111111111111111111111111111111111111' | bash '$PRE_PUSH'"

assert_exit "Block deletion of 'master'" 1 \
  bash -c "printf '(delete) 0000000000000000000000000000000000000000 refs/heads/master 1111111111111111111111111111111111111111\n' | bash '$PRE_PUSH'"

assert_exit "Block deletion of 'production'" 1 \
  bash -c "printf '(delete) 0000000000000000000000000000000000000000 refs/heads/production 1111111111111111111111111111111111111111\n' | bash '$PRE_PUSH'"

assert_exit "Block deletion of 'release/v1.0.0'" 1 \
  bash -c "printf '(delete) 0000000000000000000000000000000000000000 refs/heads/release/v1.0.0 1111111111111111111111111111111111111111\n' | bash '$PRE_PUSH'"

# Allow deletion of non-protected branches
assert_exit "Allow deletion of feature branch 'feature/awesome-ui'" 0 \
  bash -c "printf '(delete) 0000000000000000000000000000000000000000 refs/heads/feature/awesome-ui 1111111111111111111111111111111111111111\n' | bash '$PRE_PUSH'"

# Non-branch refs (tags) must not be blocked
assert_exit "Allow tag operations with name 'refs/tags/release'" 0 \
  bash -c "printf '(delete) 0000000000000000000000000000000000000000 refs/tags/release 1111111111111111111111111111111111111111\n' | bash '$PRE_PUSH'"

assert_exit "Allow tag operations with name 'refs/tags/v1.0.0'" 0 \
  bash -c "printf '(delete) 0000000000000000000000000000000000000000 refs/tags/v1.0.0 1111111111111111111111111111111111111111\n' | bash '$PRE_PUSH'"

# Fast-forward push to main
HEAD_SHA=$(git -C "$REPO_DIR" rev-parse HEAD)
PARENT_SHA=$(git -C "$REPO_DIR" rev-parse HEAD~1 2>/dev/null || echo "$HEAD_SHA")
assert_exit "Allow fast-forward push to 'main'" 0 \
  bash -c "printf 'refs/heads/main $HEAD_SHA refs/heads/main $PARENT_SHA\n' | bash '$PRE_PUSH'"

# Force push (inverted ancestry) to main
if [[ "$HEAD_SHA" != "$PARENT_SHA" ]]; then
  assert_exit "Block force-push / history overwrite to 'main'" 1 \
    bash -c "printf 'refs/heads/main $PARENT_SHA refs/heads/main $HEAD_SHA\n' | bash '$PRE_PUSH'"
fi

# Strict branch protection mode
assert_exit "Block direct push to 'main' when STRICT_BRANCH_PROTECTION=1" 1 \
  bash -c "printf 'refs/heads/main $HEAD_SHA refs/heads/main $PARENT_SHA\n' | STRICT_BRANCH_PROTECTION=1 bash '$PRE_PUSH'"

assert_exit "Allow push to 'feature/fix' when STRICT_BRANCH_PROTECTION=1" 0 \
  bash -c "printf 'refs/heads/feature/fix $HEAD_SHA refs/heads/feature/fix $PARENT_SHA\n' | STRICT_BRANCH_PROTECTION=1 bash '$PRE_PUSH'"

echo ""
echo "--- 2. Testing .githooks/pre-commit ---"

assert_exit "Allow commit on main in standard mode (with advisory info)" 0 \
  bash "$PRE_COMMIT"

assert_exit "Block direct commit on main when STRICT_BRANCH_PROTECTION=1" 1 \
  bash -c "STRICT_BRANCH_PROTECTION=1 bash '$PRE_COMMIT'"

echo ""
echo "--- 3. Testing scripts/setup-branch-protection.sh ---"

assert_exit "Display help message with --help" 0 \
  "$SETUP_SCRIPT" --help

# Validate JSON schema in dry-run
DRY_RUN_OUTPUT=$("$SETUP_SCRIPT" --dry-run)
assert_exit "Dry-run output contains valid Modern Ruleset JSON" 0 \
  bash -c "echo '$DRY_RUN_OUTPUT' | sed -n '/--- 1. Modern/,/--- 2. Classic/p' | sed '1d;\$d' | jq ."

assert_exit "Dry-run output contains valid Classic Protection JSON" 0 \
  bash -c "echo '$DRY_RUN_OUTPUT' | sed -n '/--- 2. Classic/,/Dry run complete/p' | sed '1d;\$d' | jq ."

# Test error handling when unauthenticated API call fails (no false positive)
assert_exit "Verify mode handles 403 Rate Limit without false positive 'Active' report" 0 \
  python3 -c '
import http.server, socketserver, threading, subprocess, sys, os
class H(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(403)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(b"{\"message\": \"rate limit\"}")
    def log_message(self, *a): pass
socketserver.TCPServer.allow_reuse_address = True
s = socketserver.TCPServer(("127.0.0.1", 0), H)
port = s.server_address[1]
t = threading.Thread(target=s.serve_forever)
t.daemon = True
t.start()
res = subprocess.run([sys.argv[1], "--verify"], env=dict(os.environ, API_BASE=f"http://127.0.0.1:{port}"), capture_output=True, text=True)
s.shutdown()
s.server_close()
if "Remote protection is ACTIVE" in res.stdout:
    sys.exit(1)
sys.exit(0)
' "$SETUP_SCRIPT"

# Test verification when active ruleset is present
assert_exit "Verify mode correctly identifies active remote rulesets" 0 \
  python3 -c '
import http.server, socketserver, threading, subprocess, sys, os, json
class H(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        if "branches" in self.path:
            self.wfile.write(json.dumps({"name": "main", "protected": False}).encode())
        elif "rulesets" in self.path:
            self.wfile.write(json.dumps([{"id": 101, "name": "Protect Branches", "enforcement": "active"}]).encode())
        else:
            self.wfile.write(b"{}")
    def log_message(self, *a): pass
socketserver.TCPServer.allow_reuse_address = True
s = socketserver.TCPServer(("127.0.0.1", 0), H)
port = s.server_address[1]
t = threading.Thread(target=s.serve_forever)
t.daemon = True
t.start()
res = subprocess.run([sys.argv[1], "--verify"], env=dict(os.environ, API_BASE=f"http://127.0.0.1:{port}"), capture_output=True, text=True)
s.shutdown()
s.server_close()
if "Remote protection is ACTIVE" not in res.stdout:
    sys.exit(1)
sys.exit(0)
' "$SETUP_SCRIPT"

echo ""
echo "--- 4. Real Git Invocations (Dry-Run Against Remote) ---"

assert_exit "git push --dry-run origin --delete main intercepted by pre-push" 1 \
  git -C "$REPO_DIR" push --dry-run origin --delete main

assert_exit "git push --dry-run origin :main intercepted by pre-push" 1 \
  git -C "$REPO_DIR" push --dry-run origin :main

assert_exit "git push --dry-run origin main allowed by pre-push" 0 \
  git -C "$REPO_DIR" push --dry-run origin main

echo ""
echo "================================================================================"
echo "📊 Results: $PASSED passed, $FAILED failed"
echo "================================================================================"

if [[ "$FAILED" -gt 0 ]]; then
  exit 1
fi
