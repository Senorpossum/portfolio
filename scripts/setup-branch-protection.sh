#!/usr/bin/env bash
# scripts/setup-branch-protection.sh
# Automates or verifies GitHub Branch Protection and Deletion Prevention
# Repository: Senorpossum/portfolio

set -euo pipefail

REPO_OWNER="Senorpossum"
REPO_NAME="portfolio"
DEFAULT_BRANCH="main"

API_BASE="https://api.github.com"
TOKEN="${GITHUB_TOKEN:-${GH_TOKEN:-}}"

show_help() {
  cat << 'EOF'
Usage: ./scripts/setup-branch-protection.sh [OPTIONS]

Options:
  --verify        Check and report current protection status on GitHub
  --dry-run       Display the GitHub API payloads without sending requests
  --classic       Apply classic branch protection rules instead of rulesets
  --help          Show this help message

Environment:
  GITHUB_TOKEN or GH_TOKEN   GitHub Personal Access Token with repo/admin permissions
EOF
}

VERIFY_ONLY=0
DRY_RUN=0
USE_CLASSIC=0

for arg in "$@"; do
  case "$arg" in
    --verify)
      VERIFY_ONLY=1
      ;;
    --dry-run)
      DRY_RUN=1
      ;;
    --classic)
      USE_CLASSIC=1
      ;;
    --help)
      show_help
      exit 0
      ;;
    *)
      echo "Unknown option: $arg" >&2
      show_help
      exit 1
      ;;
  esac
done

echo "================================================================================"
echo "🛡️  GitHub Branch Protection & Anti-Deletion Manager"
echo "   Repository: $REPO_OWNER/$REPO_NAME | Branch: $DEFAULT_BRANCH"
echo "================================================================================"

# Verify mode can query public repo endpoints without token
if [[ "$VERIFY_ONLY" == "1" ]]; then
  echo ""
  echo "🔍 Checking current branch protection status on GitHub..."
  AUTH_HEADER=()
  if [[ -n "$TOKEN" ]]; then
    AUTH_HEADER=(-H "Authorization: Bearer $TOKEN")
    echo "🔑 Using provided GitHub token for authenticated check."
  else
    echo "ℹ️  No GITHUB_TOKEN provided; querying public API endpoints."
  fi

  BRANCH_JSON=$(curl -s "${AUTH_HEADER[@]}" \
    -H "Accept: application/vnd.github+json" \
    "$API_BASE/repos/$REPO_OWNER/$REPO_NAME/branches/$DEFAULT_BRANCH")

  IS_PROTECTED=$(echo "$BRANCH_JSON" | grep -o '"protected": [a-z]*' | head -n 1 || echo '"protected": unknown')
  echo "📊 Branch '$DEFAULT_BRANCH' protection state: $IS_PROTECTED"

  RULESETS_JSON=$(curl -s "${AUTH_HEADER[@]}" \
    -H "Accept: application/vnd.github+json" \
    "$API_BASE/repos/$REPO_OWNER/$REPO_NAME/rulesets")

  COUNT=$(echo "$RULESETS_JSON" | grep -c '"id"' 2>/dev/null || true)
  COUNT=$(echo "$COUNT" | tr -d '[:space:]')
  COUNT=${COUNT:-0}
  echo "📋 Active Repository Rulesets count: $COUNT"

  if [[ "$IS_PROTECTED" == *"false"* && "$COUNT" -eq 0 ]]; then
    echo ""
    echo "⚠️  WARNING: '$DEFAULT_BRANCH' is currently UNPROTECTED on GitHub."
    echo "   Anyone with push access could delete or force-push to '$DEFAULT_BRANCH'."
    echo "   Run this script with GITHUB_TOKEN to apply protection, or follow docs/BRANCH_PROTECTION.md."
  else
    echo ""
    echo "✅ Remote protection or rulesets detected."
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
  "name": "Protect Main - Block Deletions and Force Push",
  "target": "branch",
  "enforcement": "active",
  "conditions": {
    "ref_name": {
      "include": ["~DEFAULT_BRANCH"],
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
  echo "❌ Error: GITHUB_TOKEN or GH_TOKEN is required to apply protection rules." >&2
  echo "" >&2
  echo "To run:" >&2
  echo "  export GITHUB_TOKEN=\"ghp_yourPersonalAccessTokenHere\"" >&2
  echo "  $0" >&2
  echo "" >&2
  echo "Or configure via GitHub UI using docs/BRANCH_PROTECTION.md" >&2
  exit 1
fi

echo ""
echo "🚀 Applying Branch Protection & Anti-Deletion Rules to GitHub..."

if [[ "$USE_CLASSIC" == "1" ]]; then
  echo "Applying Classic Branch Protection on '$DEFAULT_BRANCH'..."
  HTTP_STATUS=$(curl -s -o /tmp/gh_resp.json -w "%{http_code}" \
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
  echo "Applying Modern GitHub Ruleset on '$DEFAULT_BRANCH'..."
  HTTP_STATUS=$(curl -s -o /tmp/gh_resp.json -w "%{http_code}" \
    -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "$API_BASE/repos/$REPO_OWNER/$REPO_NAME/rulesets" \
    -d '{
      "name": "Protect Main - Block Deletions and Force Push",
      "target": "branch",
      "enforcement": "active",
      "conditions": {
        "ref_name": {
          "include": ["~DEFAULT_BRANCH"],
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
  cat /tmp/gh_resp.json | grep -E '"name"|"id"|"enforcement"' || true
else
  echo "❌ GitHub API request failed with HTTP status: $HTTP_STATUS" >&2
  cat /tmp/gh_resp.json >&2
  echo "" >&2
  echo "Please check token permissions (must have repository administration read/write)." >&2
  exit 1
fi
