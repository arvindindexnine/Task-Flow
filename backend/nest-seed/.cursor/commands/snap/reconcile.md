---
description: Reconcile implemented code with feature specification to update spec.md
---

# /snap/reconcile - Reconcile Code with Specification

## User Input

```
$ARGUMENTS
```

---

## Instructions

You are reconciling implemented code with the feature specification. This is a **ONE-WAY reconciliation** from Code → Spec to update `spec.md` based on actual implementation.

### Step 1: Identify Feature and Specification

**Option A - Feature name provided in arguments:**

- Use `$ARGUMENTS` as the feature name
- Convert to kebab-case if not already

**Option B - Spec reference from chat context:**

- Check if feature spec was referenced in current chat
- Extract feature name from context

**Option C - No arguments (auto-detect):**

1. Check current directory - if in `specs/[feature-name]/`, use that feature name
2. If not in a feature directory, list available features: `ls specs/`
3. Ask user: "Which feature do you want to reconcile? Available: [list]"

### Step 2: Load Current Specification

1. Read `specs/[feature-name]/spec.md`
2. If file doesn't exist, error: "Specification not found. Cannot reconcile without existing spec."
3. Extract from current spec:
   - Functional requirements
   - User stories and acceptance criteria
   - Expected behaviors and flows
   - Business rules and constraints

### Step 3: Identify Implementation Scope

**Option A - Analyze uncommitted code:**

1. Run `git status` to identify modified/new files
2. Ask user: "Should I analyze these uncommitted changes? [list files]"
3. If yes, focus analysis on these files

**Option B - Use plan.md to locate code:**

1. Read `specs/[feature-name]/plan.md` if exists
2. Extract file paths and modules mentioned in the plan
3. Analyze those specific implementation files

**Option C - User-specified files:**

- Ask user: "Please specify the files/directories to analyze for this feature"

### Step 4: Analyze Functional Implementation

**FOCUS: Functional behavior only, NOT technical implementation details**

Analyze the code for:

#### A. Functional Requirements Compliance

- Compare each functional requirement in spec vs. actual behavior
- Identify requirements that have **changed behavior**
- Note requirements that work **differently** than specified

#### B. User Stories Implementation

- Check if user stories are implemented as described
- Identify stories with **modified acceptance criteria**
- Find stories that deliver **different value** than specified

#### C. Business Logic Drift

- Compare business rules in spec vs. code logic
- Identify **changed business flows** or decision points
- Note **different validation rules** or constraints

#### D. Missing Implementations

- Identify functional requirements **not implemented**
- Find user stories **completely missing** from code
- Note **incomplete implementations** of specified behaviors

**IGNORE:** Technical details like:

- Database schema differences
- API endpoint structures
- Framework choices
- Performance optimizations
- Security implementations
- Code organization

### Step 5: Categorize Drift Types

Classify findings into:

#### 🔄 **Changed Behaviors**

- Requirements that work differently than spec
- Modified business logic or flows
- User stories with different outcomes

#### ❌ **Missing Implementations**

- Functional requirements not implemented
- User stories not built
- Business rules not enforced

#### ➕ **New Functionality**

- Features implemented but not in spec
- Additional business rules added
- Extra user capabilities provided

### Step 6: Update Specification

**ONLY modify spec.md - DO NOT touch plan.md**

For each drift category:

#### For Changed Behaviors:

1. Update the relevant sections in spec.md to reflect actual implementation
2. Modify functional requirements to match current behavior
3. Update user stories and acceptance criteria to reflect reality
4. Add notes about the change: `<!-- Updated from reconciliation [date] -->`

#### For Missing Implementations:

1. Keep original requirements but add status notes
2. Mark as: `<!-- NOT IMPLEMENTED - identified in reconciliation [date] -->`
3. Create a summary section of missing features

#### For New Functionality:

1. Add new functional requirements for undocumented features
2. Create new user stories for additional capabilities
3. Mark as: `<!-- Added from reconciliation [date] -->`

### Step 7: Create Reconciliation Report

Generate a detailed report:

```
🔄 Specification Reconciliation Complete

Feature: [Feature Name]
Spec Location: specs/[feature-name]/spec.md
Analysis Scope: [files analyzed]

📊 Drift Analysis:
🔄 Changed Behaviors: [X items]
  - [Brief description of key changes]

❌ Missing Implementations: [X items]
  - [Brief description of what's not implemented]

➕ New Functionality: [X items]
  - [Brief description of undocumented features]

📝 Spec Updates Applied:
✓ [X] functional requirements updated
✓ [X] user stories modified
✓ [X] new sections added
✓ [X] missing items marked

⚠️ Action Items:
- Review updated spec for accuracy
- [If missing implementations exist] Plan implementation of missing features
- [If new functionality exists] Validate if new features align with product goals

Updated Specification: specs/[feature-name]/spec.md
```

### Step 8: Validation and Quality Check

Ensure:

- [ ] All functional changes are captured in spec
- [ ] Missing implementations are clearly marked
- [ ] New functionality is properly documented
- [ ] Spec remains technology-agnostic
- [ ] Business focus is maintained (no technical drift captured)
- [ ] Original spec structure is preserved

---

## Important Guidelines

### Reconciliation Principles

- **Functional Focus**: Only capture business/functional drift, never technical
- **Code Wins**: When behavior differs, update spec to match actual implementation
- **One-Way Only**: Never suggest changing code to match spec
- **Preserve Intent**: Keep original business intent while updating details
- **Document Changes**: Mark all updates with reconciliation timestamps

### What to Capture

**✅ DO Capture:**

- Changed business rules or validation logic
- Modified user workflows or processes
- Different functional outcomes than specified
- Missing functional requirements
- New business capabilities not documented

**❌ DON'T Capture:**

- Database schema changes
- API response formats
- Framework or library choices
- Performance improvements
- Security implementation details
- Code structure or architecture changes

### Spec Update Strategy

**Modify Existing Sections:**

- Update functional requirements to match reality
- Revise user stories to reflect actual implementation
- Adjust business rules to current logic

**Add New Sections:**

- Document undocumented functionality
- Add new user stories for additional features
- Include new business rules discovered in code

**Mark Missing Items:**

- Keep original requirements but flag as unimplemented
- Maintain visibility of planned vs. actual scope

---

## Reference

- Current Specification: `specs/[feature-name]/spec.md`
- Implementation Plan: `specs/[feature-name]/plan.md`
- Constitution: `.snap/spec-kit/constitution.md`