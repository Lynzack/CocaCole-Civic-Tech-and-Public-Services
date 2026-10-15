---
name: git-precommit-audit-pr-generator
description: >-
  Specialized skill for conducting deep workspace audits on staged and modified files to detect accidental inclusion of environment variables, credentials, private keys, package manifests, or sensitive system configurations, followed by generating conventional, copy-paste-ready commit and pull request messages.
---

# Agent Skill: Git Pre-Commit Secret & Config Audit with PR Message Generator

## Description
Specialized agent capability for conducting deep workspace audits on staged and modified files to detect accidental inclusion of environment variables, credentials, private keys, package manifests, or sensitive system configurations. Upon completing the audit, the agent generates a clean, conventional, copy-paste-ready pull request commit message summarizing safe changes.

---

## Core Capabilities

1. **Sensitive File & Pattern Interception**
   - Intercept and scan git staged areas (`git diff --staged`) and working trees for restricted file types, hidden configs, and secret signatures.
   - Detect both exact file matches (e.g., `.env`, `id_rsa`) and high-entropy secret patterns (e.g., API keys, auth tokens, private certificates).

2. **Package Manifest & Lockfile Guardrails**
   - Check if `package.json`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, or equivalent manifests are modified.
   - Verify that dependency modifications were explicitly requested, flagging unintentional lockfile drift or unvetted dependency additions.

3. **Copy-Paste PR & Commit Formatter**
   - Automatically compile a standardized, production-ready Conventional Commit message and accompanying Pull Request description directly derived from verified, clean file changes.

---

## Targeted Audit Patterns

The agent scans staged diffs against this strict watchlist:

| Category | Targeted Files / Patterns | Risk Level |
|---|---|---|
| **Environment & Secrets** | `.env*` (except `.env.example`), `*.key`, `*.pem`, `*.crt`, `*.p12` | Critical (Block) |
| **Credentials & Auth** | `id_rsa*`, `id_ed25519*`, `*.pem`, `known_hosts`, `credentials.json` | Critical (Block) |
| **Cloud & Tool Configs** | `.aws/*`, `.gcp/*`, `kubeconfig*`, `.dockercfg`, `.npmrc` (with auth tokens) | Critical (Block) |
| **System & Local State** | `.DS_Store`, `Thumbs.db`, `.idea/*`, `.vscode/*` (with local settings) | Low (Exclude) |
| **Manifests & Locks** | `package.json`, `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock` | Warning (Verify Intent) |

---

## Audit Workflow

1. **Inspection & Diff Extraction:**
   - Inspect git status (`git status --porcelain`) and staged modifications (`git diff --staged`).
   - Identify newly added untracked files and staged file paths.

2. **Watchlist Matching & Content Entropy Scan:**
   - Match all staged file paths against the targeted watchlist above.
   - Scan diff contents for common token prefixes, high-entropy strings, passwords, private keys (`BEGIN PRIVATE KEY`), or hardcoded API credentials.

3. **Manifest & Dependency Validation:**
   - If `package.json` or package lockfiles have been modified, verify whether dependency changes were requested as part of the task.
   - Flag any unexpected additions or discrepancies between manifests and lockfiles.

4. **Security Finding Triage:**
   - **Critical Blockers Detected:** Immediately alert the user, halt commit generation, and provide explicit unstage/removal commands (e.g., `git reset HEAD <sensitive-file>` and `.gitignore` recommendation).
   - **Safe & Verified:** Proceed to commit and pull request message generation.

5. **PR & Commit Message Generation:**
   - Synthesize safe changes into a standardized Conventional Commit (`type(scope): summary`).
   - Generate an exportable, copy-paste-ready Pull Request template detailing:
     - Title and commit subject
     - Type of change (`feat`, `fix`, `refactor`, `docs`, `chore`, etc.)
     - Summary of changes
     - Affected components / modules
     - Verification / testing steps performed

---

## Safety Boundaries & Execution Constraints

> **CRITICAL EXECUTION RULES**

- **Never Auto-Commit Secrets:**
  - If a secret or sensitive config file is detected, the agent MUST NOT proceed with committing or push operations.
  
- **Do Not Alter User Staging Silently:**
  - Never run unstaging or destructive git commands (`git reset --hard`, `git checkout --`, `git restore`) without user confirmation. Always suggest the safe command for the user to approve or execute.

- **Strict Adherence to Conventional Commits:**
  - All generated commit messages must follow standard Conventional Commit conventions (`feat:`, `fix:`, `refactor:`, `chore:`, etc.) and remain concise and accurate.
