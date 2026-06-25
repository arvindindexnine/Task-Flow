---
description: Verify implementation completeness and mark feature as complete
---

# /snap/verify - Verify Feature Implementation

## User Input

```
$ARGUMENTS
```

---

## Purpose

This command verifies that a feature implementation is complete, correct, and ready for deployment. It performs evidence-based verification that cannot be skipped or faked.

**⚠️ CRITICAL**: This command MUST be run after `/snap/implement` before considering a feature complete.

---

## Step 1: Identify Feature

**Option A - Feature name provided in arguments:**
- Use `$ARGUMENTS` as the feature name
- Convert to kebab-case if not already

**Option B - No arguments (auto-detect):**
1. Check current directory - if in `specs/[feature-name]/`, use that feature name
2. If not in a feature directory, list available features: `ls specs/`
3. Ask user: "Which feature do you want to verify? Available: [list]"

---

## Step 2: Load Context

Read the following files:
1. `specs/[feature-name]/spec.md` - Feature requirements
2. `specs/[feature-name]/plan.md` - Implementation plan
3. `.snap/spec-kit/constitution.md` - Quality standards
4. `.cursor/rules/*.mdc` - All cursor rules (for compliance check)

**Extract from spec.md:**
- All functional requirements
- All user stories with acceptance criteria
- All edge cases

**Extract from plan.md:**
- All tasks
- All checkpoints (from Implementation Progress section)

---

## Step 3: Run Evidence-Based Verification

**⚠️ You MUST provide actual evidence for each check. You CANNOT just say "yes" without proof.**

### ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
### CHECK 1: TEST SUITE VERIFICATION
### ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**ACTION:** Run the full test suite

```bash
npm test
```

**PASTE THE COMPLETE OUTPUT HERE:**
```
[Paste actual test output showing all results]
```

**VERIFY THE OUTPUT SHOWS:**
- [ ] Total number of tests run (e.g., "X tests passed")
- [ ] ZERO tests failed
- [ ] ZERO tests skipped or pending
- [ ] No error messages or stack traces
- [ ] All test suites passed

**IF TESTS FAIL:**
1. Note which tests failed
2. Fix the failing code (DO NOT change tests unless they're wrong)
3. Re-run verification from CHECK 1
4. DO NOT PROCEED to CHECK 2

**RESULT:** [ ] CHECK 1 PASSED / [ ] CHECK 1 FAILED

---

### ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
### CHECK 2: REQUIREMENTS COVERAGE
### ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**ACTION:** Map EVERY requirement from spec.md to implementation

Open `specs/[feature-name]/spec.md` and list EVERY functional requirement.

For EACH requirement, show:
1. The requirement text
2. WHERE it's implemented (file path and line numbers)
3. WHERE it's tested (test file path and line numbers)

**FORMAT:**
```
Requirement 1: [Full requirement text from spec.md]
→ Implemented in: src/path/to/file.ts:45-78
→ Tested in: src/path/to/file.spec.ts:12-34

Requirement 2: [Full requirement text from spec.md]
→ Implemented in: src/path/to/file.ts:82-120
→ Tested in: src/path/to/file.spec.ts:45-67

[Continue for ALL requirements]
```

**VERIFY:**
- [ ] EVERY requirement from spec.md is listed above
- [ ] EVERY requirement has an implementation file:line
- [ ] EVERY requirement has a test file:line
- [ ] No requirements are missing
- [ ] No requirements show "TODO" or "not implemented"

**IF ANY REQUIREMENT MISSING:**
1. Implement the missing requirement
2. Write tests for it
3. Re-run verification from CHECK 1
4. DO NOT PROCEED to CHECK 3

**RESULT:** [ ] CHECK 2 PASSED / [ ] CHECK 2 FAILED

---

### ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
### CHECK 3: CODE COMPLETENESS
### ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**ACTION:** Search for incomplete code markers

Run these commands and paste results:

**Search for TODOs:**
```bash
grep -r "TODO" src/ --exclude-dir=node_modules --exclude-dir=dist
```

**PASTE RESULTS:**
```
[Paste grep output - should be empty]
```

**Search for FIXMEs:**
```bash
grep -r "FIXME" src/ --exclude-dir=node_modules --exclude-dir=dist
```

**PASTE RESULTS:**
```
[Paste grep output - should be empty]
```

**Search for stubs/placeholders:**
```bash
grep -r "stub\|placeholder" src/ --exclude-dir=node_modules --exclude-dir=dist
```

**PASTE RESULTS:**
```
[Paste grep output - should be empty]
```

**VERIFY:**
- [ ] NO TODOs found in source code
- [ ] NO FIXMEs found in source code
- [ ] NO stubs or placeholders found
- [ ] All searches return zero results

**ACCEPTABLE EXCEPTIONS:**
- TODOs in comments explaining future enhancements (not current feature)
- TODOs in documentation files (not code files)

**IF INCOMPLETE CODE FOUND:**
1. Complete the TODO/FIXME/stub
2. Re-run verification from CHECK 1
3. DO NOT PROCEED to CHECK 4

**RESULT:** [ ] CHECK 3 PASSED / [ ] CHECK 3 FAILED

---

### ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
### CHECK 4: PLAN COMPLETION
### ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**ACTION:** Verify all tasks and checkpoints are complete

Open `specs/[feature-name]/plan.md`

**Check Tasks Section:**
List all tasks from the Tasks section and their completion status:
```
Task 1: [Task name] - [✓ Complete / ✗ Incomplete]
Task 2: [Task name] - [✓ Complete / ✗ Incomplete]
[List all tasks]
```

**Check Implementation Progress Section:**
List all checkpoints and their status:
```
Checkpoint 1: [Name] - [✅ Completed / 🔄 In Progress / ⏸️ Pending]
Checkpoint 2: [Name] - [✅ Completed / 🔄 In Progress / ⏸️ Pending]
[List all checkpoints]
```

**VERIFY:**
- [ ] ALL tasks show ✓ Complete
- [ ] ALL checkpoints show ✅ Completed
- [ ] NO tasks are incomplete
- [ ] NO checkpoints show ⏸️ Pending or 🔄 In Progress
- [ ] Each checkpoint has Started date
- [ ] Each checkpoint has Completed date
- [ ] Each checkpoint lists Tests Added
- [ ] Each checkpoint lists Files Created/Modified

**IF ANY TASK/CHECKPOINT INCOMPLETE:**
1. Go back and complete the incomplete task/checkpoint
2. Re-run verification from CHECK 1
3. DO NOT PROCEED to Step 4

**RESULT:** [ ] CHECK 4 PASSED / [ ] CHECK 4 FAILED

---

## Step 4: Final Verification Summary

After completing all 4 checks, summarize the results:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERIFICATION RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ CHECK 1: TEST SUITE .............. [PASSED / FAILED]
✓ CHECK 2: REQUIREMENTS COVERAGE ... [PASSED / FAILED]
✓ CHECK 3: CODE COMPLETENESS ....... [PASSED / FAILED]
✓ CHECK 4: PLAN COMPLETION ......... [PASSED / FAILED]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**IF ALL 4 CHECKS PASSED:**
- ✅ Proceed to Step 5

**IF ANY CHECK FAILED:**
- ❌ DO NOT PROCEED to Step 5
- ❌ Fix the failures
- ❌ Re-run `/snap/verify` from the beginning
- ❌ DO NOT mark feature as complete

---

## Step 5: Update Implementation Status

**ONLY execute this step if ALL 4 checks in Step 4 PASSED.**

Update `specs/[feature-name]/plan.md`:

1. **Update Implementation Status section:**
   ```markdown
   ## Implementation Status

   - **Status**: Completed ✅
   - **Started**: [existing date]
   - **Completed**: [today's date]
   - **Verified**: [today's date]
   - **Last Updated**: [today's date]
   ```

2. **Add Verification Results section** (at the end of the file):
   ```markdown
   ## Verification Results

   **Verified on:** [today's date]
   **Verified by:** /snap/verify command

   ### Test Suite
   - Total tests: [number]
   - Pass rate: 100%
   - Coverage: [percentage from test output]

   ### Requirements Coverage
   - Total requirements: [number]
   - All requirements implemented: ✓
   - All requirements tested: ✓

   ### Code Quality
   - No TODOs: ✓
   - No FIXMEs: ✓
   - No stubs: ✓

   ### Completion
   - All tasks complete: ✓
   - All checkpoints complete: ✓
   ```

---

## Step 6: Report Completion

Provide a comprehensive summary:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ FEATURE VERIFICATION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Feature: [Feature Name]
Location: specs/[feature-name]/

VERIFICATION SUMMARY:
✓ All tests passing ([X] tests)
✓ All requirements implemented and tested ([X] requirements)
✓ No incomplete code (TODOs/FIXMEs/stubs)
✓ All tasks and checkpoints complete ([X] tasks, [X] checkpoints)

Status: READY FOR DEPLOYMENT ✅

Next steps:
1. Review plan.md for verification details
2. Create pull request (if using git)
3. Deploy feature

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Optional: Automated Preflight Check

If you want faster verification, you can create a preflight script that runs before this command.

Create `.snap/scripts/preflight.sh`:

```bash
#!/bin/bash
echo "🔍 Running Snap Preflight Checks..."

# Run tests
echo "→ Running tests..."
npm test || { echo "❌ Tests failed"; exit 1; }

# Check for TODOs
echo "→ Checking for TODOs..."
if grep -r "TODO" src/ --exclude-dir=node_modules --exclude-dir=dist 2>/dev/null | grep -v "^$"; then
    echo "❌ Found TODOs in code"
    exit 1
fi

# Run linter
echo "→ Running linter..."
npm run lint || { echo "❌ Linting failed"; exit 1; }

# Check coverage
echo "→ Checking test coverage..."
npm run test:coverage || { echo "❌ Coverage check failed"; exit 1; }

echo "✅ All preflight checks passed!"
```

Make it executable:
```bash
chmod +x .snap/scripts/preflight.sh
```

Then run before verification:
```bash
.snap/scripts/preflight.sh && /snap/verify
```

---

## Critical Rules

### ✅ ALWAYS DO:
- Run ALL 4 checks without skipping
- Provide actual evidence (paste outputs)
- Map EVERY requirement to code
- Fix failures immediately
- Re-run from CHECK 1 after any fix
- Only mark complete if all checks pass

### ❌ NEVER DO:
- Skip checks or say "I'll do it later"
- Mark checks passed without evidence
- Proceed to next check if current failed
- Mark feature complete if any check fails
- Assume requirements are covered without checking
- Ignore TODOs or incomplete code

### ⚠️ ABSOLUTE RULES:

1. **EVIDENCE REQUIRED**: You MUST paste actual command outputs, not just say you ran them
2. **NO SKIPPING CHECKS**: All 4 checks are mandatory
3. **FIX THEN RE-VERIFY**: If any check fails, fix and re-run ALL checks
4. **ALL OR NOTHING**: Feature is only complete if ALL 4 checks pass

---

## Reference

- Specification: `specs/[feature-name]/spec.md`
- Plan: `specs/[feature-name]/plan.md`
- Constitution: `.snap/spec-kit/constitution.md`
- Cursor Rules: `.cursor/rules/*.mdc`
