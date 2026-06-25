---
description: Fix GitHub PR review comments using GitHub MCP (fetch, fix, commit, push)
---

# /snap/fix-pr-reviews - MCP-First PR Review Fixer

## User Input

```
$ARGUMENTS
```

---

## Purpose

Handle GitHub PR review comments end-to-end using **GitHub MCP Server** for GitHub data and **Cursor** for code edits and git operations.

**Usage:**

```
/snap/fix-pr-reviews <pr-number> [options]
```

**Required:**
- `<pr-number>` — Pull request number

**Optional:**
- `--dry-run` — Fetch and analyze comments only (no edits)

> ℹ️ **Auto-commit is the default behavior.**  
> Changes will be committed and pushed automatically unless `--dry-run` is specified.

---

## Step 0: Preconditions

Before proceeding, ensure:
- Current directory is a git repository
- No uncommitted local changes
- You have push access to the PR branch

**If uncommitted local changes are detected, DO NOT abort immediately.**

Instead, prompt the user to choose one of the following actions:

1. **Commit the current changes**
   - Commit all existing local changes with a user-approved commit message
   - Then proceed with fixing the specified PR

2. **Stash the changes**
   - Stash all uncommitted changes
   - Proceed with fixing the PR
   - Restore the stashed changes after PR fixes are completed

3. **Discard the changes**
   - Permanently discard all uncommitted local changes
   - Proceed with fixing the PR

4. **Proceed anyway**
   - Override the precondition
   - Continue without modifying or stashing existing changes
   - User assumes full responsibility for potential conflicts

**⚠️ CRITICAL**: If the user does not explicitly select one of the provided options, the workflow MUST pause and wait for input.

---

## Step 1: Fetch PR Metadata (MCP)

Use GitHub MCP to fetch pull request details.

**Required data:**
- PR title
- Head branch
- Base branch
- PR state

❌ Abort if PR is not `OPEN`.

---

## Step 2: Fetch Unresolved Review Threads (MCP)

### 2.1 Fetch Reviews

Fetch all PR reviews and keep only:
- `CHANGES_REQUESTED`
- `COMMENTED`

### 2.2 Fetch Review Comments

Fetch all inline review comments.

For each comment, extract:
- `thread_id` ✅ (mandatory)
- `path`
- `original_line`
- `diff_hunk`
- `body`
- `resolved`

Filter:
- `resolved == false`
- `path != null`

### 2.3 Display Summary (Read-Only)

Example:

```
PR #123 — Review comments found

src/foo.ts:42
"Add null guard before accessing user.id"

src/bar.ts:88
"This function name is misleading"
```

If no unresolved threads are found, exit successfully.

### 2.4 Classify Threads by Fix Scope

For each unresolved review thread, classify it as one of:

**LOCAL_FIX** — Fully solvable within the referenced file and hunk

**ARCHITECTURAL_CHANGE** — Requires:
- Changes in multiple files, OR
- Public API redesign, OR
- Shared abstraction refactor, OR
- Behavior changes outside the reviewed hunk

This step is read-only.
No code changes are allowed here.

### 2.5 Approval Gate for Architectural Threads (MANDATORY)

If any thread is classified as ARCHITECTURAL_CHANGE:

#### 2.5.1 Display Approval Request

Display the following blocking prompt:

```
⚠️ Architectural / Cross-File Review Comments Detected

The following review threads require changes beyond the local diff scope:

[2] src/auth/user.ts:88
"Move this logic to a shared validator used by all auth flows"

[5] src/api/foo.ts:41
"This should be enforced at the service layer, not the controller"

Choose how to proceed for EACH index:
- approve <index> — Allow architectural changes for this thread
- skip <index> — Skip this thread (will be reported as skipped)
- abort — Stop the entire workflow
```

#### 2.5.2 Blocking Behavior (MANDATORY)

❌ DO NOT proceed automatically
❌ DO NOT guess intent
❌ DO NOT partially fix

The workflow MUST pause until the user responds.

#### 2.5.3 Approval Recording

For each approved index, record:

```
thread_id: <id>
approval: granted
scope: architectural
```

Unapproved threads MUST be marked as skipped with reason:

```
reason: Requires architectural or cross-file change without approval
```

---

## Step 3: Fix Review Comments (Cursor Only)

Process **one review thread at a time**.

**Threads classified as ARCHITECTURAL_CHANGE:**
- ❌ MUST NOT be processed without approval
- ✅ MAY be processed ONLY if explicitly approved

**Approved architectural threads:**
- MAY modify multiple files
- MUST still:
  - Implement the reviewer's request exactly
  - Pass runtime sanity checks
  - Be logged explicitly as architectural fixes

### 3.1 Load Context

For each thread:
- Open the referenced file
- Load ±20 lines around the commented line
- Use `diff_hunk` to identify exact scope

### 3.2 Understand Intent

Classify the comment:
- Bug fix
- Naming / clarity
- Safety (null checks)
- Style
- Minor refactor

**⚠️ CRITICAL**: Every unresolved review thread MUST be resolved through a real, functional code change.

The fix MUST:
- Change program behavior
- Correct the exact issue described by the reviewer
- Fully satisfy the review comment as written

It is NOT acceptable to:
- Silence the issue
- Work around the issue
- Guard against the issue
- Explain the issue
- Document the issue

**If the review comment describes a problem, the problem itself must be fixed.**

### 3.3 Apply Minimal Fix

**Constraints:**
- Edit only the referenced file
- Modify only lines within or immediately adjacent to the `diff_hunk`
- No formatting-only changes
- No unrelated refactors

**⚠️ CRITICAL**: The applied change MUST fix the root cause identified in the review comment.

Rules:
- Do NOT introduce alternative behavior
- Do NOT introduce safety-only logic
- Do NOT weaken correctness
- Do NOT defer correctness

The reviewer's requested change must be observable in the code's logic, not just its structure.

### 3.4 Enforce Scope Guard (MANDATORY)

After each fix:

1. Generate diff
2. Validate:
   - Only one file changed
   - Changed lines intersect the review hunk

❌ If scope is violated:
- Revert changes
- Skip the thread

**For approved architectural threads ONLY:**

Scope guard expands to:
- Files explicitly required to satisfy the reviewer request

Any additional file changes:
- MUST be directly justified by the review comment
- MUST be listed in the fix log

Unapproved architectural changes still fail scope validation.

**After applying a fix, re-read the review comment verbatim and verify:**
- The described problem no longer exists
- The requested change is clearly implemented
- The code would not re-trigger the same review comment

If any of the above is false:
- The fix is invalid
- The change MUST be revised
- The thread MUST NOT be skipped

### 3.5 Track Fixes

Maintain a log:

```
thread_id: <id>
file: src/foo.ts
summary: Added null guard for user.id
```

Each fix log entry MUST explicitly show how the reviewer's request was implemented.

Example:

```
thread_id: <id>
file: src/foo.ts
review_comment: "This function name is misleading"
implementation: "Renamed function to reflect actual side effect and updated its internal logic accordingly"
```

### 3.6 Runtime Sanity Check (Fast & Generic)

Before committing any changes, perform a **fast, non-destructive runtime sanity check** to detect obvious runtime or configuration errors introduced by the applied fixes.

This sanity check must be:
- Framework-agnostic
- Fast (no full dependency installation by default)
- Safe (no file mutations)
- Focused on catching new breakages caused by SNAP.PR_FIXER

#### 3.6.1 Detect Project Runtime Context

Identify the project runtime environment using repository signals:

- `package.json` → JavaScript / Node.js project
- `requirements.txt` or `pyproject.toml` → Python project
- `go.mod` → Go project
- `pom.xml` or `build.gradle` → Java project

If no recognizable runtime environment is detected:
- Skip this step safely
- Proceed to commit

#### 3.6.2 Validate Configuration Consistency (No Execution)

Statically analyze configuration files affected by the fixes, such as:
- Build configuration files
- Tooling configuration files
- Runtime configuration files

Check for:
- Invalid or missing configuration fields
- Incompatible version relationships
- Broken references caused by dependency changes
- Obvious misconfigurations introduced by SNAP.PR_FIXER

No commands should be executed in this step.

#### 3.6.3 Validate Dependency Resolution (No Install)

If a dependency lockfile exists (e.g., `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`):

- Perform a dry dependency resolution check
- Detect:
  - Invalid or non-existent dependency versions
  - Peer dependency conflicts
  - Broken dependency graphs

Do NOT install dependencies.
Do NOT modify lockfiles.

#### 3.6.4 Optional Lightweight Verification (Only If Safe)

If:
- Dependencies are already installed (`node_modules`, virtualenv, etc.)
- AND a lightweight verification command exists

Then optionally run the lightest available check, such as:
- Build
- Lint
- Type check

If dependencies are NOT installed:
- Skip execution
- Do NOT install automatically

#### 3.6.5 Failure Handling (MANDATORY)

If any runtime or configuration issue is detected:

- ❌ STOP the workflow
- ❌ Do NOT commit
- ❌ Do NOT push

Report the failure clearly:

```
❌ Runtime Sanity Check Failed

An issue was detected after applying review fixes.

Category: Runtime / Configuration Error
Likely cause: Changes introduced by SNAP.PR_FIXER

What happened:
<Concise description of the error>

Why this matters:
This issue would cause runtime or build failures

What you should do next:
- Review and fix the reported issue manually
- Re-run the command with --dry-run to analyze without committing
- Re-run SNAP.PR_FIXER after resolving the issue
```

SNAP.PR_FIXER must never commit or push code that fails this sanity check.

#### 3.6.6 Success Handling

If no issues are detected:

```
✅ Runtime Sanity Check Passed

No runtime or configuration issues detected.
Proceeding to commit and push changes.
```

---

## Step 4: Commit & Push (Cursor Native)

### 4.1 Review Changes

Show:
- Diff
- Summary of fixed review threads

### 4.2 Commit (Deterministic, Shell-Safe)

**⚠️ CRITICAL**: Commits MUST use cmd or git bash (NOT PowerShell) with the exact format below.

**Commit using cmd or git bash:**

```bash
git commit -m "snap/fix-pr-reviews: address review comments - Added null guard in src/foo.ts - Renamed misleading function in src/bar.ts"
```

**Commit message structure:**

```
snap/fix-pr-reviews: address review comments - [change 1] - [change 2] - [change 3]
```

**Rules:**
- Use single-line format with `git commit -m "message"`
- Use cmd or git bash shell (NOT PowerShell)
- Start with `snap/fix-pr-reviews: address review comments`
- Follow with dash-separated list of changes
- Each change should be a brief, actionable description
- Include file names where relevant
- Keep total message under 200 characters if possible

**Example messages:**

```bash
git commit -m "snap/fix-pr-reviews: address review comments - Added null check in user.service.ts - Fixed async handling in auth.controller.ts"

git commit -m "snap/fix-pr-reviews: address review comments - Renamed getUserData to fetchUserProfile in api.ts"

git commit -m "snap/fix-pr-reviews: address review comments - Refactored validation logic in signup.ts - Added error handling in login.ts"
```

**How to execute:**

When committing, use the Shell tool with cmd or git bash:

```bash
# Use cmd or git bash (NOT PowerShell)
git commit -m "snap/fix-pr-reviews: address review comments - [list of changes]"
```

**⚠️ DO NOT:**
- Use PowerShell for commits
- Use heredocs or multi-line strings
- Try different commit message formats
- Use `git commit` without the full message in one line

Ask for confirmation unless `--auto-commit` is provided.

### 4.3 Push Changes

Push to the PR head branch.

❌ If push fails, stop immediately and report the failure.

---

## Step 5: Final Verification (MCP)

Re-fetch unresolved review threads.

Report:
- Threads that were fixed
- Architectural threads that were fixed
- Threads that were skipped (with reasons)

> ℹ️ **Note:**  
> Review threads are **not resolved automatically** because GitHub MCP does not currently expose a thread-resolution capability.

---

## Step 6: Report Completion

```
✅ PR Review Comments Processed

PR: #123
Fixed Threads: 2
Skipped Threads: 0

Commit: abc123
Branch: feature/foo
```

---

## Critical Rules

### ✅ ALWAYS DO:
- Use GitHub MCP tools for all GitHub API operations
- Use Cursor tools for all code edits
- Use Cursor tools for all git operations
- Use cmd or git bash for all git commits (NOT PowerShell)
- Use single-line commit format: `git commit -m "snap/fix-pr-reviews: address review comments - [changes]"`
- Group and process comments by review thread
- Only modify code within review comment scope
- Validate scope after each fix
- Track all fixes in a log
- Push changes after committing
- Implement the reviewer's request exactly as written
- Fix the root cause, not just symptoms
- Verify the fix resolves the issue completely
- Perform runtime sanity checks before committing
- Wait for explicit user selection when handling uncommitted changes

### ❌ NEVER DO:
- Use `gh` CLI or direct GitHub API calls
- Use PowerShell for git commits
- Use multi-line commit messages or heredocs
- Use inconsistent commit message formats
- Modify code outside review comment scope
- Skip scope validation
- Make formatting-only changes
- Perform unrelated refactors
- Claim review threads were resolved automatically
- Skip a review comment for any reason
- Claim a comment is "architectural" without implementing a local mitigation
- Resolve a thread without a corresponding code change
- Add TODOs or follow-up notes
- Add comments instead of fixing behavior
- Add defensive guards instead of fixing root cause
- Add fallback logic to avoid fixing the issue
- Add clarifying or explanatory comments
- Apply partial mitigations
- Defer correctness to future work
- Automatically commit, stash, or discard uncommitted changes without explicit user selection
- Commit or push changes that fail runtime sanity checks
- Proceed without architectural approval when required

### ⚠️ ABSOLUTE RULES:

1. **MCP ONLY FOR GITHUB**: All GitHub operations MUST use GitHub MCP tools
2. **CURSOR FOR CODE**: All code changes MUST use Cursor tools
3. **CURSOR FOR GIT**: All git operations MUST use Cursor tools
4. **THREADS FOR GROUPING ONLY**: Review threads are used for grouping and tracking only; they are NOT resolved automatically
5. **SCOPE ENFORCEMENT**: Only modify code within review comment scope
6. **VALIDATION REQUIRED**: Validate scope after each fix
7. **COMMIT SHELL**: All commits MUST use cmd or git bash (NOT PowerShell) with single-line `git commit -m "message"` format
8. **COMMIT MESSAGE FORMAT**: Message must follow structure: `snap/fix-pr-reviews: address review comments - [change 1] - [change 2]`
9. **PUSH BEFORE RESOLVE**: Push changes before resolving threads
10. **NO REVIEW COMMENT MAY BE SKIPPED**: Every review comment must result in a functional code fix
11. **CHANGES MUST DIRECTLY IMPLEMENT THE REVIEWER'S REQUEST AS WRITTEN**: No workarounds or alternatives
12. **USER CONSENT IS REQUIRED BEFORE HANDLING UNCOMMITTED CHANGES**: Must pause and wait for explicit selection
13. **ARCHITECTURAL CHANGES REQUIRE EXPLICIT APPROVAL**: Cannot proceed automatically for cross-file changes
14. **RUNTIME SANITY CHECK FAILURES BLOCK COMMIT**: Must not commit code that fails sanity checks

---

## Reference

- GitHub MCP Server documentation
- Cursor custom command execution model
- GitHub Pull Request Review API
