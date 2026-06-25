---
description: Implement a feature using Test-Driven Development following spec and plan
---

# /snap/implement - Full Feature Implementation

## User Input

```
$ARGUMENTS
```

---

## Instructions

You are implementing a complete, production-ready feature for the Snap platform using Test-Driven Development (TDD).

**CRITICAL REQUIREMENTS:**
- ✅ Follow TDD strictly: Write tests FIRST, then implementation
- ✅ Follow ALL cursor rules in `.cursor/rules/*.mdc` without exception
- ✅ Follow ALL constitutional principles in `.snap/spec-kit/constitution.md`
- ✅ Implement COMPLETE, functional code - no stubs, no TODOs
- ✅ Do NOT stop until implementation is fully complete and verified
- ✅ Update plan.md with status as you progress

---

## Step 1: Parse Arguments and Identify Feature

### 1.1 Parse Task Selection (if provided)

Arguments can be in the following formats:
- **Feature only**: `feature-name` - implements all tasks
- **Feature with tasks**: `feature-name 1,3,5` - implements specific tasks
- **Feature with range**: `feature-name 1-3` - implements tasks 1 through 3
- **Feature with all**: `feature-name all` - explicitly implements all tasks
- **No arguments**: Auto-detect feature, then prompt for task selection

**Parse logic:**
1. Split `$ARGUMENTS` by space
2. First part is feature name (or empty for auto-detect)
3. Second part (if exists) is task selection string
4. Store task selection for later use

Examples:
- `user-authentication` → feature: "user-authentication", tasks: all
- `user-authentication 1,3,5` → feature: "user-authentication", tasks: [1, 3, 5]
- `user-authentication 1-3` → feature: "user-authentication", tasks: [1, 2, 3]
- `user-authentication all` → feature: "user-authentication", tasks: all
- `` (empty) → auto-detect feature, then prompt for tasks

### 1.2 Identify Feature Name

**Option A - Feature name provided in arguments:**
- Use first part of `$ARGUMENTS` as the feature name
- Convert to kebab-case if not already

**Option B - No arguments (auto-detect):**
1. Check current directory - if in `specs/[feature-name]/`, use that feature name
2. If not in a feature directory, list available features: `ls specs/`
3. Ask user: "Which feature do you want to implement? Available: [list]"

---

## Step 2: Load All Context

### 2.1 Read Specification
- Read `specs/[feature-name]/spec.md`
- Extract and understand:
  - Feature requirements (WHAT to build)
  - User stories (HOW users will interact)
  - Acceptance criteria (WHEN it's done correctly)
  - Edge cases (WHAT could go wrong)

### 2.2 Read Implementation Plan
- Read `specs/[feature-name]/plan.md`
- Extract and understand:
  - High-level tasks
  - Technical approach and architecture
  - Integration points
  - Data model design

### 2.3 Read Constitution
- Read `.snap/spec-kit/constitution.md`
- Note ALL requirements:
  - TDD workflow (mandatory)
  - Quality standards
  - Security requirements
  - Performance expectations
  - Code review criteria

### 2.4 Read ALL Relevant Cursor Rules
- Read `.cursor/rules/*.mdc` files
- Pay special attention to:
  - **`unit-testing.mdc`** - Testing standards (CRITICAL for TDD)
  - **`project-structure.mdc`** - Where to place files
  - **`core-naming.mdc`** - Naming conventions
  - **`auth-security.mdc`** - Security implementation
  - **`controller.mdc`** - API endpoint patterns
  - **`entity.mdc`** - Data model implementation
  - **`repository.mdc`** - Data access patterns
  - **`exception-handling.mdc`** - Error handling
  - Any other relevant rules based on feature type

**⚠️ ABSOLUTE REQUIREMENT**: You MUST follow these cursor rules throughout implementation. Non-compliance is not acceptable.

---

## Step 3: Select Tasks to Implement

### 3.1 Determine Task Selection

**If task selection was provided in arguments (Step 1.1):**
- Use the parsed task selection
- Skip to Step 3.3

**If NO task selection provided:**
- Proceed to Step 3.2 for interactive selection

### 3.2 Interactive Task Selection

1. **Read all tasks from plan.md** (from the Tasks section)
2. **Display tasks to user:**
   ```
   Available tasks for [feature-name]:

   1. [ ] Task 1 description
   2. [ ] Task 2 description
   3. [ ] Task 3 description
   4. [ ] Task 4 description
   5. [ ] Task 5 description

   Which tasks would you like to implement?

   Options:
   - Enter task numbers (e.g., 1,3,5)
   - Enter a range (e.g., 1-3)
   - Enter 'all' to implement all tasks
   - Press Enter to implement all tasks
   ```

3. **Parse user input:**
   - `1,3,5` → tasks: [1, 3, 5]
   - `1-3` → tasks: [1, 2, 3]
   - `all` or empty → tasks: all
   - Invalid input → show error and ask again

### 3.3 Validate Task Numbers

1. Verify all selected task numbers exist in plan.md
2. If invalid task numbers found:
   - Show error: "Invalid task number(s): [X, Y]. Available tasks: 1-[N]"
   - For interactive mode: ask again
   - For argument mode: exit with error

3. Store validated task list for implementation

### 3.4 Confirm Task Selection

Display confirmation:
```
✓ Tasks selected for implementation:
  - Task 1: [description]
  - Task 3: [description]
  - Task 5: [description]

Proceeding with implementation...
```

---

## Step 4: Update Implementation Status

Update `specs/[feature-name]/plan.md`:
- Set Status to "In Progress"
- Add Started date (today's date) if not already set
- Keep plan.md open for continuous status updates

---

## Step 5: Create Implementation Checkpoints

Before starting implementation, create a structured checkpoint system for the SELECTED tasks.

### 5.1 Map Selected Tasks to Checkpoints

1. **Read all tasks from plan.md** (from the Tasks section)
2. **Filter tasks** - Only include tasks selected in Step 3
3. **Create checkpoint structure** - Each selected task becomes a checkpoint
4. **Use TodoWrite tool** to track selected checkpoints throughout implementation

Example checkpoint structure (if tasks 1, 3, 5 selected):
```
- [ ] Task 1: Set up database schema and migrations
- [ ] Task 3: Implement service layer with business logic and tests
- [ ] Task 5: Add integration tests for end-to-end flows
```

### 5.2 Verify Implementation Progress Section

Check the "Implementation Progress" section in `specs/[feature-name]/plan.md`:
- Ensure all tasks (numbered 1-N) have entries
- Tasks not selected should remain ⏸️ Pending
- Tasks selected for implementation will be updated as they progress

**⚠️ CRITICAL**: You will update this section after EACH task completion. Do not skip task tracking.

### 5.3 Task Implementation Commitment

Before proceeding to implementation, acknowledge:
- ✅ I have created checkpoints for SELECTED tasks only
- ✅ I will complete tasks ONE AT A TIME in numerical order
- ✅ I will NOT skip task verification
- ✅ I will NOT proceed to next task until current is verified
- ✅ I will update plan.md after each task completion
- ✅ I will NOT stop until ALL SELECTED tasks are completed

---

## Step 6: Implement Using Test-Driven Development

Follow the TDD cycle strictly for EVERY component:

### TDD Workflow (Red-Green-Refactor)

```
For each selected task:
  1. RED: Write a failing test that defines desired behavior
  2. GREEN: Write minimum code to make the test pass
  3. REFACTOR: Improve code while keeping tests green
  4. REPEAT: Continue until task is complete
```

### 6.1 Task-Based Implementation

⚠️ **CRITICAL**: You MUST process ONE task at a time. Do NOT skip ahead or work on multiple tasks simultaneously.

**For EACH task in your selected task list (in numerical order):**

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ TASK START: Task [N]: [Task Name]                        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

STEP 1: Update plan.md Implementation Progress
  → Open specs/[feature-name]/plan.md
  → Find "Task [N]" in "Implementation Progress" section
  → Change status from ⏸️ Pending to 🔄 In Progress
  → Add Started date (today's date in YYYY-MM-DD format)
  → Save file

STEP 2: Update TodoWrite
  → Mark this task as "in_progress"

STEP 3: Implement Using TDD
  → Write tests FIRST (Red phase)
  → Run tests and watch them FAIL
  → Write minimum code to pass (Green phase)
  → Refactor while keeping tests green
  → Follow ALL cursor rules during implementation
  → Handle edge cases from spec.md
  → Implement error handling per cursor rules

STEP 4: Verify Task Completion
  Run through this checklist:

  □ All tests for this task are written
  □ All tests for this task PASS
  □ No TODOs, FIXMEs, or stubs in code
  □ Code follows all relevant cursor rules
  □ Requirements related to this task are met
  □ Edge cases are handled
  □ Error handling is in place
  □ Code is documented

  ⚠️ IF ANY ITEM UNCHECKED → GO BACK AND FIX
  ⚠️ DO NOT PROCEED until all items are checked

STEP 5: Update plan.md Implementation Progress (Milestone Update)
  → Open specs/[feature-name]/plan.md
  → Find "Task [N]" in "Implementation Progress" section
  → Change status from 🔄 In Progress to ✅ Completed
  → Add Completed date (today's date in YYYY-MM-DD format)
  → Under "Tests Added", list all test files (e.g., user.service.spec.ts, user.controller.spec.ts)
  → Under "Files Created/Modified", list all implementation files created or modified
  → Under "Verification Notes", add brief summary (e.g., "Implemented user registration with password hashing. All tests passing.")
  → Save file

STEP 6: Check and Update Task Checkbox in Tasks Section
  → Open specs/[feature-name]/plan.md
  → Find "Task [N]" in the "Tasks" section (top of file)
  → Change from `[N]. [ ]` to `[N]. [x]` to mark as complete
  → Save file

STEP 7: Update TodoWrite
  → Mark this task as "completed"

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ TASK COMPLETE: Task [N]: [Task Name]                     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

ONLY NOW proceed to the next task.
REPEAT this entire process for EVERY selected task.
```

**⚠️ ABSOLUTE RULE**: You CANNOT skip to the next task without completing verification and updating plan.md. This is NON-NEGOTIABLE.

### 6.2 Typical Implementation Order

While you must follow the specific numbered tasks in plan.md, here's a typical sequence for reference:

**Task 1: Foundation / Data Layer**
- Set up file structure per cursor rules
- Create entities/models with tests
- Create database migrations (if applicable)
- Create repositories with tests
- Verify data layer works correctly

**Task 2: Business Logic / Service Layer**
- Write service tests for requirements
- Implement business logic
- Handle edge cases from spec.md
- Implement validation and error handling
- Verify services work correctly

**Task 3: API / Interface Layer**
- Write controller/API tests
- Implement endpoints with proper routing
- Create DTOs with validation
- Apply security and authentication
- Verify API layer works correctly

**Task 4: Integration**
- Write end-to-end test scenarios
- Test all user stories from spec.md
- Test all acceptance criteria
- Verify complete flows work

**Task 5: Quality Assurance**
- Run full test suite
- Check code coverage
- Verify all cursor rules followed
- Add logging and monitoring
- Update documentation

**Note**: Your actual tasks come from plan.md. Follow them in numerical order based on your selection.

### 6.3 Test-First Guidelines

**Before writing ANY production code:**
1. Write the test that describes the behavior
2. Run the test and watch it FAIL (Red)
3. Write the simplest code to make it pass (Green)
4. Refactor if needed while keeping tests green
5. Move to next test

**Testing Standards** (from `unit-testing.mdc`):
- Use proper mocking libraries as specified in cursor rules
- Test business logic, conditionals, error handling
- DO NOT test simple pass-through functions
- Focus on behavior, not implementation details
- Maintain high code coverage (aim for >80%)

### 6.4 Cursor Rules Compliance Verification

After each task completion, verify:
- [ ] File is in correct location per `project-structure.mdc`
- [ ] Names follow `core-naming.mdc` conventions
- [ ] Security implemented per `auth-security.mdc` (if applicable)
- [ ] Error handling follows `exception-handling.mdc`
- [ ] Tests follow `unit-testing.mdc` standards
- [ ] Code is clean, readable, and well-documented

---

## Step 7: Continuous Verification

As you implement, continuously check:

### Against Specification
- [ ] All functional requirements implemented
- [ ] All user stories have working code
- [ ] All acceptance criteria met
- [ ] All edge cases handled

### Against Plan
- [ ] Technical approach followed
- [ ] Architecture decisions implemented correctly
- [ ] Integration points working
- [ ] Data model matches design

### Against Constitution
- [ ] TDD followed throughout
- [ ] Security requirements met
- [ ] Performance considerations addressed
- [ ] Code quality standards maintained

### Against Cursor Rules
- [ ] Every relevant rule has been followed
- [ ] No shortcuts or rule violations
- [ ] Code would pass code review

**⚠️ If you find conflicts or issues, STOP and document them. Do not proceed with non-compliant code.**

---

## Step 8: Run Full Test Suite

Before marking as complete:

1. **Run all tests:**
   ```bash
   # Run unit tests
   npm test

   # Run with coverage
   npm run test:coverage

   # Run integration tests (if separate)
   npm run test:integration
   ```

2. **Verify results:**
   - [ ] All tests pass (100% pass rate required)
   - [ ] Code coverage meets standards (>80%)
   - [ ] No warnings or errors in test output

3. **If tests fail:**
   - Fix the failing code (not the tests!)
   - Re-run tests
   - Do not proceed until all tests pass

---

## Step 9: Final Verification

### 7.1 Specification Compliance Checklist

Go through spec.md and verify:
- [ ] Every functional requirement has working code
- [ ] Every user story can be executed end-to-end
- [ ] Every acceptance criterion is met
- [ ] Every edge case is handled

### 7.2 Plan Compliance Checklist

Go through plan.md and verify:
- [ ] All tasks completed
- [ ] Technical approach implemented as designed
- [ ] All integration points working
- [ ] Architecture matches plan

### 7.3 Cursor Rules Final Check

Review ALL cursor rule files one more time:
- [ ] `unit-testing.mdc` - Tests are comprehensive and follow standards
- [ ] `project-structure.mdc` - All files in correct locations
- [ ] `core-naming.mdc` - All names follow conventions
- [ ] `auth-security.mdc` - Security properly implemented
- [ ] `controller.mdc` - Controllers follow patterns
- [ ] `entity.mdc` - Entities follow standards
- [ ] `repository.mdc` - Data access follows patterns
- [ ] `exception-handling.mdc` - Errors handled correctly
- [ ] Any other applicable rules

### 7.4 Constitution Final Check

- [ ] TDD was followed throughout (tests written first)
- [ ] Code quality meets standards (readable, maintainable)
- [ ] Security requirements met
- [ ] Performance considerations addressed
- [ ] Documentation is complete

---

## Step 10: Update Implementation Status

Update `specs/[feature-name]/plan.md`:

1. **Verify all selected tasks are marked as completed:**
   - In the Tasks section, ensure selected tasks show [x] (e.g., `1. [x] Task description`)
   - In the Implementation Progress section, ensure selected tasks show ✅ Completed
   - Tasks NOT selected should remain with [ ] and ⏸️ Pending status

2. **Update Implementation Status section (if ALL tasks are now complete):**
   ```markdown
   ## Implementation Status

   - **Status**: Needs Verification ⚠️
   - **Started**: [existing date]
   - **Completed**: [today's date]
   - **Last Updated**: [today's date]
   ```

   **If only SOME tasks were completed (partial implementation):**
   ```markdown
   ## Implementation Status

   - **Status**: In Progress (Tasks [X, Y, Z] completed)
   - **Started**: [existing date]
   - **Completed**: [leave empty or show "Partial"]
   - **Last Updated**: [today's date]
   ```

3. **Add implementation notes:**
   - Which tasks were completed in this session
   - Any deviations from original plan (with justification)
   - Challenges encountered and how they were solved
   - Any follow-up items or future improvements
   - Remaining tasks to be implemented (if partial)

**⚠️ IMPORTANT**:
- Status is "Needs Verification ⚠️" ONLY if ALL tasks are complete
- Status remains "In Progress" if only some tasks are complete
- Feature is not complete until `/snap/verify` passes

---

## Step 11: Report Implementation Completion

Provide a comprehensive summary based on what was implemented:

### If ALL Tasks Were Completed:

```
✅ Implementation phase completed!

Feature: [Feature Name]
Location: specs/[feature-name]/

Implementation Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Implementation Progress:
   ✓ All tasks completed ([X/X])
   ✓ Task 1: [description] ✅
   ✓ Task 2: [description] ✅
   ✓ Task 3: [description] ✅
   ... [list all tasks]

   ✓ All code written with TDD approach
   ✓ All cursor rules followed

🧪 Testing:
   ✓ [X] unit tests written
   ✓ [X] integration tests written
   ✓ Tests passing locally

📂 Files Created/Modified:
   [List all files that were created or modified]

⚠️ Implementation Notes:
   [Any important notes, deviations, or challenges encountered]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ NEXT STEP REQUIRED ⚠️

The implementation is complete, but the feature is NOT yet
verified. You MUST run the verification command:

   /snap/verify

This will:
- Verify all tests pass
- Verify all requirements are implemented
- Check for incomplete code
- Confirm all tasks complete
- Mark feature as "Completed ✅" if all checks pass

DO NOT skip verification. The feature is not complete
until /snap/verify passes all checks.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### If PARTIAL Tasks Were Completed:

```
✅ Selected tasks implemented!

Feature: [Feature Name]
Location: specs/[feature-name]/

Implementation Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Tasks Completed:
   ✓ Task [N]: [description] ✅
   ✓ Task [N]: [description] ✅
   ✓ Task [N]: [description] ✅

📋 Tasks Remaining:
   ⏸️ Task [N]: [description] (Pending)
   ⏸️ Task [N]: [description] (Pending)

🧪 Testing:
   ✓ [X] unit tests written
   ✓ [X] integration tests written (if applicable)
   ✓ Tests passing locally

📂 Files Created/Modified:
   [List all files that were created or modified]

⚠️ Implementation Notes:
   [Any important notes, deviations, or challenges encountered]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ NEXT STEPS ⚠️

To continue implementation of remaining tasks, run:
   /snap/implement [task-numbers]

Examples:
   /snap/implement 4,5,6     (implement specific remaining tasks)
   /snap/implement all       (implement all remaining tasks)

Once ALL tasks are complete, run:
   /snap/verify

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Critical Reminders

### ✅ ALWAYS DO:
- ✅ Write tests FIRST, always (Red-Green-Refactor)
- ✅ Follow EVERY cursor rule without exception
- ✅ Implement COMPLETE, production-ready code
- ✅ Process ONE task at a time in numerical order
- ✅ Update plan.md Implementation Progress after EVERY task
- ✅ Update plan.md Tasks checkbox after EVERY task
- ✅ Use TodoWrite to track task progress
- ✅ Verify task completion before moving to next
- ✅ Handle ALL edge cases from spec
- ✅ Run tests frequently during implementation
- ✅ Document your code as you write it
- ✅ Think about security and performance
- ✅ Complete ALL selected tasks before Step 10
- ✅ Mark status correctly based on full/partial completion
- ✅ Tell user next steps (continue implementation or verify)

### ❌ NEVER DO:
- ❌ Skip writing tests
- ❌ Write production code before tests
- ❌ Violate cursor rules (even "just this once")
- ❌ Leave TODOs, FIXMEs, or stubs in code
- ❌ Skip tasks or work on multiple simultaneously
- ❌ Skip task verification
- ❌ Proceed to next task without completing current
- ❌ Skip updating plan.md task status
- ❌ Skip updating plan.md task checkbox
- ❌ Stop implementation before ALL selected tasks complete
- ❌ Mark feature as "Completed ✅" (that's /snap/verify's job)
- ❌ Skip edge case handling
- ❌ Ignore errors or warnings
- ❌ Rush through without verification

### ⚠️ ABSOLUTE RULES (NON-NEGOTIABLE):

1. **ONE TASK AT A TIME**: You MUST complete current task fully before starting next
2. **UPDATE PLAN.MD ALWAYS**: Every task completion MUST be recorded in both:
   - Implementation Progress section (detailed milestone)
   - Tasks section checkbox (mark as [x])
3. **COMPLETE ALL SELECTED TASKS**: You CANNOT skip any selected task or leave work incomplete
4. **CORRECT STATUS MARKING**:
   - "Needs Verification ⚠️" if ALL tasks complete
   - "In Progress" if only SOME tasks complete
5. **NO PARTIAL TASK IMPLEMENTATIONS**: Each selected task must be 100% complete with working code
6. **VERIFICATION IS SEPARATE**: Do NOT verify here - that's /snap/verify's job

---

## Reference

- Specification: `specs/[feature-name]/spec.md`
- Plan: `specs/[feature-name]/plan.md`
- Constitution: `.snap/spec-kit/constitution.md`
- Cursor Rules: `.cursor/rules/*.mdc`
- Templates: `.snap/spec-kit/templates/`

---

---

**⚠️ FINAL REMINDER:**

This is NOT a planning phase. This is FULL IMPLEMENTATION.

- Write REAL, WORKING, TESTED code
- Complete ONE task at a time in numerical order
- Update plan.md after EVERY task (both Progress and Tasks sections)
- DO NOT STOP until ALL selected tasks complete

**Implementation session is complete when:**
1. ✅ All selected tasks show ✅ Completed in Implementation Progress
2. ✅ All selected tasks show [x] in Tasks section
3. ✅ All TodoWrite tasks marked complete
4. ✅ Every requirement/story related to selected tasks has code
5. ✅ All tests written and passing locally
6. ✅ No TODOs, FIXMEs, or stubs remain in implemented code
7. ✅ All cursor rules followed
8. ✅ Status marked correctly:
   - "Needs Verification ⚠️" if ALL tasks complete
   - "In Progress" if only SOME tasks complete

**Then tell user:**
- If ALL tasks complete: run `/snap/verify`
- If SOME tasks complete: can continue with `/snap/implement [remaining-tasks]` or run `/snap/verify` if ready

The feature is NOT fully complete until /snap/verify passes.
Your job in /snap/implement is to write complete, working code.
Verification happens in /snap/verify.
