#!/usr/bin/env bash
# scripts/setup-branch-protection.sh
# Automates or verifies GitHub Branch Protection and Deletion Prevention
# Repository: Senorpossum/portfolio

set -euo pipefail

REPO_OWNER="Senorpossum"
REPO_NAME="portfolio"
DEFAULT_BRANCH="main"

API_BASE="${API_BASE:-https://api.github.com}"
TOKEN="${GITHUB_TOKEN:-${GH_TOKEN:-}}"

show_help() {
  cat << 'EOF'
Usage: ./scripts/setup-branch-protection.sh [OPTIONS]

Options:
  --verify            Check and report current protection status on GitHub and local git
  --dry-run           Display the GitHub API payloads without sending requests
  --classic           Apply classic branch protection rules instead of modern rulesets
  --token, -t <tok>   Provide GitHub Personal Access Token (or set GITHUB_TOKEN)
  --install-hooks     Configure local git hooks (core.hooksPath .githooks)
  --help, -h          Show this help message

Environment:
  GITHUB_TOKEN or GH_TOKEN   GitHub Personal Access Token with repo/admin permissions
EOF
}

VERIFY_ONLY=0
DRY_RUN=0
USE_CLASSIC=0
INSTALL_HOOKS=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --verify)
      VERIFY_ONLY=1
      shift
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    --classic)
      USE_CLASSIC=1
      shift
      ;;
    --token|-t)
      if [[ -n "${2:-}" ]]; then
        TOKEN="$2"
        shift 2
      else
        echo "Error: --token requires a token argument" >&2
        exit 1
      fi
      ;;
    --install-hooks)
      INSTALL_HOOKS=1
      shift
      ;;
    --help|-h)
      show_help
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      show_help
      exit 1
      ;;
  esac
done

# Safe tempfile management
RESP_FILE=$(mktemp)
trap 'rm -f "$RESP_FILE"' EXIT

echo "================================================================================"
echo "🛡️  GitHub Branch Protection & Anti-Deletion Manager"
echo "   Repository: $REPO_OWNER/$REPO_NAME | Default Branch: $DEFAULT_BRANCH"
echo "================================================================================"

# Local hooks installer
if [[ "$INSTALL_HOOKS" == "1" ]]; then
  echo ""
  echo "🔧 Installing and activating local git hooks..."
  git config core.hooksPath .githooks
  chmod +x .githooks/* 2>/dev/null || true
  mkdir -p .git/hooks
  cp .githooks/* .git/hooks/ 2>/dev/null || true
  echo "✅ Local git hooks successfully installed in .githooks and synchronized to .git/hooks."
  if [[ "$VERIFY_ONLY" == "0" && "$DRY_RUN" == "0" && -z "$TOKEN" ]]; then
    exit 0
  fi
fi

# Verify mode
if [[ "$VERIFY_ONLY" == "1" ]]; then
  echo ""
  echo "🔍 Checking branch protection status on GitHub and local environment..."
  
  # Local hooks verification
  HOOKS_PATH=$(git config core.hooksPath 2>/dev/null || echo "")
  if [[ "$HOOKS_PATH" == ".githooks" && -x ".githooks/pre-push" ]]; then
    echo "🔒 Local Pre-Push Deletion Protection: ACTIVE (core.hooksPath=.githooks)"
  else
    echo "⚠️  Local Pre-Push Deletion Protection: INACTIVE (Run with --install-hooks to activate)"
  fi

  AUTH_HEADER=()
  if [[ -n "$TOKEN" ]]; then
    AUTH_HEADER=(-H "Authorization: Bearer $TOKEN")
    echo "🔑 Using provided GitHub token for authenticated check."
  else
    echo "ℹ️  No GITHUB_TOKEN provided; querying public API endpoints."
  fi

  # 1. Query branch protection state
  HTTP_CODE=$(curl -s -o "$RESP_FILE" -w "%{http_code}" "${AUTH_HEADER[@]}" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "$API_BASE/repos/$REPO_OWNER/$REPO_NAME/branches/$DEFAULT_BRANCH")

  IS_PROTECTED="unknown"
  BRANCH_API_ERROR=""

  if [[ "$HTTP_CODE" == "200" ]]; then
    if command -v jq >/dev/null 2>&1; then
      IS_PROTECTED=$(jq -r '.protected // false' "$RESP_FILE")
    elif command -v node >/dev/null 2>&1; then
      IS_PROTECTED=$(node -e 'const fs=require("fs"); const d=JSON.parse(fs.readFileSync(process.argv[1],"utf8")); console.log(d.protected);' "$RESP_FILE" 2>/dev/null || echo "unknown")
    else
      IS_PROTECTED=$(grep -o '"protected": [a-z]*' "$RESP_FILE" | head -n 1 | awk '{print $2}' || echo "unknown")
    fi
    echo "📊 Branch '$DEFAULT_BRANCH' protection flag: $IS_PROTECTED"
  else
    API_MSG=""
    if command -v jq >/dev/null 2>&1; then
      API_MSG=$(jq -r '.message // ""' "$RESP_FILE" 2>/dev/null || true)
    fi
    echo "⚠️  Could not fetch branch protection status (HTTP $HTTP_CODE${API_MSG:+: $API_MSG})"
    BRANCH_API_ERROR="HTTP $HTTP_CODE"
  fi

  # 2. Query Repository Rulesets
  RULESETS_HTTP_CODE=$(curl -s -o "$RESP_FILE" -w "%{http_code}" "${AUTH_HEADER[@]}" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "$API_BASE/repos/$REPO_OWNER/$REPO_NAME/rulesets")

  ACTIVE_RULESETS=0
  TOTAL_RULESETS=0
  RULESET_NAMES=""

  if [[ "$RULESETS_HTTP_CODE" == "200" ]]; then
    if command -v jq >/dev/null 2>&1; then
      TOTAL_RULESETS=$(jq 'if type=="array" then length else 0 end' "$RESP_FILE")
      ACTIVE_RULESETS=$(jq 'if type=="array" then [.[] | select(.enforcement == "active")] | length else 0 end' "$RESP_FILE")
      RULESET_NAMES=$(jq -r 'if type=="array" then [.[] | select(.enforcement == "active") | .name] | join(", ") else "" end' "$RESP_FILE")
    elif command -v node >/dev/null 2>&1; then
      TOTAL_RULESETS=$(node -e 'const fs=require("fs"); const d=JSON.parse(fs.readFileSync(process.argv[1],"utf8")); console.log(Array.isArray(d) ? d.length : 0);' "$RESP_FILE" 2>/dev/null || echo 0)
      ACTIVE_RULESETS=$(node -e 'const fs=require("fs"); const d=JSON.parse(fs.readFileSync(process.argv[1],"utf8")); console.log(Array.isArray(d) ? d.filter(r => r.enforcement === "active").length : 0);' "$RESP_FILE" 2>/dev/null || echo 0)
    fi
    echo "📋 Repository Rulesets: $ACTIVE_RULESETS active (of $TOTAL_RULESETS total)"
    if [[ -n "$RULESET_NAMES" ]]; then
      echo "   Active Rulesets: $RULESET_NAMES"
    fi
  else
    API_MSG=""
    if command -v jq >/dev/null 2>&1; then
      API_MSG=$(jq -r '.message // ""' "$RESP_FILE" 2>/dev/null || true)
    fi
    echo "⚠️  Could not fetch rulesets (HTTP $RULESETS_HTTP_CODE${API_MSG:+: $API_MSG})"
  fi

  echo ""
  if [[ "$IS_PROTECTED" == "true" || "$ACTIVE_RULESETS" -gt 0 ]]; then
    echo "✅ Remote protection is ACTIVE on GitHub."
  elif [[ "$IS_PROTECTED" == "false" && "$ACTIVE_RULESETS" -eq 0 && -z "$BRANCH_API_ERROR" ]]; then
    echo "⚠️  WARNING: '$DEFAULT_BRANCH' is currently UNPROTECTED on GitHub."
    echo "   Anyone with push access could delete or force-push to '$DEFAULT_BRANCH'."
    echo "   To apply protection:"
    echo "     1. Set GITHUB_TOKEN and run: $0"
    echo "     2. Or configure via GitHub Web UI following docs/BRANCH_PROTECTION.md"
  else
    echo "ℹ️  Could not reliably confirm remote protection status due to API errors."
    echo "   If you hit rate limits or authentication errors, pass a token with --token or set GITHUB_TOKEN."
  fi
  exit 0
fi

# Dry run mode
if [[ "$DRY_RUN" == "1" ]]; then
  echo ""
  echo "🧪 [DRY RUN] Showing configuration payloads:"
  echo ""
  echo "--- 1. Modern Repository Ruleset Payload (POST /repos/$REPO_OWNER/$REPO_NAME/rulesets) ---"
  cat << 'PAYLOAD'
{
  "name": "Protect Branches - Block Deletion & Force Push",
  "target": "branch",
  "enforcement": "active",
  "conditions": {
    "ref_name": {
      "include": [
        "~DEFAULT_BRANCH",
        "refs/heads/master",
        "refs/heads/production",
        "refs/heads/release/*"
      ],
      "exclude": []
    }
  },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    {
      "type": "pull_request",
      "parameters": {
        "required_approving_review_count": 0,
        "dismiss_stale_reviews_on_push": true,
        "require_code_owner_review": false,
        "require_last_push_approval": false,
        "required_review_thread_resolution": true
      }
    },
    {
      "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": true,
        "required_status_checks": [
          { "context": "Lint and Build" }
        ]
      }
    }
  ]
}
PAYLOAD
  echo ""
  echo "--- 2. Classic Branch Protection Payload (PUT /repos/$REPO_OWNER/$REPO_NAME/branches/$DEFAULT_BRANCH/protection) ---"
  cat << 'PAYLOAD_CLASSIC'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["Lint and Build"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 0,
    "require_last_push_approval": false
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_linear_history": false
}
PAYLOAD_CLASSIC
  echo ""
  echo "Dry run complete."
  exit 0
fi

# Applying changes requires a token
if [[ -z "$TOKEN" ]]; then
  echo "" >&2
  echo "❌ Error: GITHUB_TOKEN, GH_TOKEN, or --token is required to apply protection rules." >&2
  echo "" >&2
  echo "To run:" >&2
  echo "  export GITHUB_TOKEN=\"ghp_yourPersonalAccessTokenHere\"" >&2
  echo "  $0" >&2
  echo "Or:" >&2
  echo "  $0 --token \"ghp_yourPersonalAccessTokenHere\"" >&2
  echo "" >&2
  echo "Or configure via GitHub UI using docs/BRANCH_PROTECTION.md" >&2
  exit 1
fi

echo ""
echo "🚀 Applying Branch Protection & Anti-Deletion Rules to GitHub..."

if [[ "$USE_CLASSIC" == "1" ]]; then
  echo "Applying Classic Branch Protection on '$DEFAULT_BRANCH'..."
  HTTP_STATUS=$(curl -s -o "$RESP_FILE" -w "%{http_code}" \
    -X PUT \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "$API_BASE/repos/$REPO_OWNER/$REPO_NAME/branches/$DEFAULT_BRANCH/protection" \
    -d '{
      "required_status_checks": {
        "strict": true,
        "contexts": ["Lint and Build"]
      },
      "enforce_admins": false,
      "required_pull_request_reviews": {
        "dismiss_stale_reviews": true,
        "require_code_owner_reviews": false,
        "required_approving_review_count": 0,
        "require_last_push_approval": false
      },
      "restrictions": null,
      "allow_force_pushes": false,
      "allow_deletions": false,
      "block_creations": false,
      "required_linear_history": false
    }')
else
  echo "Applying Modern GitHub Ruleset for protected branches..."
  HTTP_STATUS=$(curl -s -o "$RESP_FILE" -w "%{http_code}" \
    -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "$API_BASE/repos/$REPO_OWNER/$REPO_NAME/rulesets" \
    -d '{
      "name": "Protect Branches - Block Deletion & Force Push",
      "target": "branch",
      "enforcement": "active",
      "conditions": {
        "ref_name": {
          "include": [
            "~DEFAULT_BRANCH",
            "refs/heads/master",
            "refs/heads/production",
            "refs/heads/release/*"
          ],
          "exclude": []
        }
      },
      "rules": [
        { "type": "deletion" },
        { "type": "non_fast_forward" },
        {
          "type": "pull_request",
          "parameters": {
            "required_approving_review_count": 0,
            "dismiss_stale_reviews_on_push": true,
            "require_code_owner_review": false,
            "require_last_push_approval": false,
            "required_review_thread_resolution": true
          }
        },
        {
          "type": "required_status_checks",
          "parameters": {
            "strict_required_status_checks_policy": true,
            "required_status_checks": [
              { "context": "Lint and Build" }
            ]
          }
        }
      ]
    }')
fi

if [[ "$HTTP_STATUS" =~ ^2 ]]; then
  echo "✅ Success! Branch protection and anti-deletion configured (HTTP $HTTP_STATUS)."
  if command -v jq >/dev/null 2>&1; then
    jq -r '{id: .id, name: .name, enforcement: .enforcement}' "$RESP_FILE" 2>/dev/null || true
  else
    grep -E '"name"|"id"|"enforcement"' "$RESP_FILE" || true
  fi
else
  echo "❌ GitHub API request failed with HTTP status: $HTTP_STATUS" >&2
  cat "$RESP_FILE" >&2
  echo "" >&2
  echo "Please check token permissions (must have repository administration read/write)." >&2
  exit 1
fi
