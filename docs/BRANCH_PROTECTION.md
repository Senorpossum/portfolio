# GitHub Branch Protection & Anti-Deletion Guide

This guide details the branch protection architecture for the **Senorpossum/portfolio** repository, preventing branch deletion, accidental history overwrites, and unverified direct pushes.

---

## 1. Current Status & Security Baseline

| Layer | Component | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Local Git** | Pre-Push Hook (`.githooks/pre-push`) | **Active** | Blocks `git push origin --delete main` and `--force` |
| **Local Git** | Pre-Commit Hook (`.githooks/pre-commit`) | **Active** | Guards direct commits to `main` |
| **CI/CD** | GitHub Actions (`.github/workflows/ci.yml`) | **Configured** | Runs `npm run lint` and `npm run build` |
| **Remote GitHub** | Branch Protection / Rulesets | **Action Required** | Remote repository currently has `"protected": false` |

> [!IMPORTANT]
> Git hooks run client-side to prevent local accidents. Complete protection against unauthorized deletion on `github.com` requires enabling GitHub's remote Branch Ruleset or Branch Protection Rule as detailed below.

---

## 2. Remote GitHub Configuration (Web UI)

You can configure protection on GitHub in 2 minutes using either Modern Rulesets (recommended) or Classic Branch Protection.

### Option A: Modern Repository Ruleset (Recommended)

1. Open your repository on GitHub:
   [https://github.com/Senorpossum/portfolio/settings/rules](https://github.com/Senorpossum/portfolio/settings/rules)
2. Click **New ruleset** -> **New branch ruleset**.
3. Fill in the following settings:
   - **Ruleset Name**: `Protect Main - Block Deletions`
   - **Enforcement status**: **Active**
4. Under **Target branches**:
   - Click **Add target** -> Select **Include default branch** (targets `main`).
5. Under **Branch rules**, enable:
   - ✅ **Restrict deletions** *(Guarantees that no collaborator can delete `main` on GitHub)*
   - ✅ **Block force pushes** *(Guarantees that no history rewrites or `--force` pushes can happen)*
   - ✅ **Require a pull request before merging**:
     - *Required approvals*: `1` (or `0` if you work solo but want a clean PR log)
     - *Dismiss stale pull request approvals when new commits are pushed*: Checked
     - *Require conversation resolution before merging*: Checked
   - ✅ **Require status checks to pass before merging**:
     - *Require branches to be up to date before merging*: Checked
     - Search and add: `Lint and Build` (provided by `.github/workflows/ci.yml`)
6. Click **Create** at the bottom of the page.

---

### Option B: Classic Branch Protection Rule

1. Open repository settings:
   [https://github.com/Senorpossum/portfolio/settings/branches](https://github.com/Senorpossum/portfolio/settings/branches)
2. In the **Branch protection rules** section, click **Add branch protection rule**.
3. Set **Branch name pattern** to `main`.
4. Check the following options:
   - ✅ **Require a pull request before merging**
   - ✅ **Require status checks to pass before merging**:
     - Check **Require branches to be up to date before merging**
     - Select **Lint and Build**
   - ✅ **Do not allow force pushes**
   - ✅ **Do not allow deletions**
5. Click **Create** (or **Save changes**).

---

## 3. Programmatic Configuration (CLI & REST API)

A helper script is provided in `scripts/setup-branch-protection.sh`.

### Verification (No Token Required)

Verify the current status on GitHub:
```bash
./scripts/setup-branch-protection.sh --verify
```

### Applying Rules with a Personal Access Token

Generate a GitHub Personal Access Token (PAT) with `repo` administration rights at [github.com/settings/tokens](https://github.com/settings/tokens):

```bash
export GITHUB_TOKEN="ghp_yourPersonalAccessTokenHere"
./scripts/setup-branch-protection.sh
```

Or via direct `curl`:
```bash
curl -X POST \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/Senorpossum/portfolio/rulesets \
  -d '{
    "name": "Protect Main - Block Deletions",
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
  }'
```

---

## 4. Local Git Protection Hooks

The repository includes pre-push and pre-commit hooks located in `.githooks/`:

- **`.githooks/pre-push`**:
  - Intercepts all outgoing pushes.
  - Automatically terminates with exit code 1 if a remote delete (`git push origin --delete main` or `git push origin :main`) is attempted.
  - Terminates with exit code 1 if a non-fast-forward force-push (`git push --force origin main`) is attempted.
- **`.githooks/pre-commit`**:
  - Warns developers when committing directly to `main`.
  - If `STRICT_BRANCH_PROTECTION=1` is set in the shell environment, prevents committing directly to `main`, requiring feature branches.

### Activating Hooks

Hooks are automatically configured via `npm install` (triggered by the `prepare` script in `package.json`).
To manually activate at any time:

```bash
git config core.hooksPath .githooks
```
