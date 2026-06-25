---
description: Create an implementation plan from a feature specification
---

# /snap/plan - Create Implementation Plan

## User Input

```
$ARGUMENTS
```

---

## Instructions

You are creating an implementation plan for a Snap feature. This plan MUST follow the constitution and cursor rules.

### Step 1: Identify Feature

**Option A - Feature name provided in arguments:**
- Use `$ARGUMENTS` as the feature name
- Convert to kebab-case if not already

**Option B - No arguments (auto-detect):**
1. Check current directory - if in `specs/[feature-name]/`, use that feature name
2. If not in a feature directory, list available features: `ls specs/`
3. Ask user: "Which feature do you want to plan? Available: [list]"

### Step 2: Locate and Read Specification

1. Read `specs/[feature-name]/spec.md`
2. If file doesn't exist, error: "Specification not found. Run `/snap/specify` first."
3. Extract from spec:
   - Feature name and overview
   - Functional requirements
   - User stories and acceptance criteria
   - Edge cases

### Step 3: Load Constitution and Rules

1. Read `.snap/spec-kit/constitution.md`
2. Note all cursor rules referenced in constitution (`.cursor/rules/*.mdc`)
3. Understand:
   - Non-functional requirements (performance, security, scalability)
   - TDD requirements
   - Code quality standards
   - Project structure rules

**CRITICAL**: The plan MUST comply with ALL constitutional principles and cursor rules.

### Step 4: Create Implementation Plan

1. Read template from `.snap/spec-kit/templates/plan.md`
2. Create `specs/[feature-name]/plan.md` based on template
3. Fill out ALL sections:

#### Tasks Section
- Break down the feature into 5-10 high-level tasks
- Each task MUST be numbered sequentially (1, 2, 3, ..., N)
- Each task should be substantial and meaningful
- Each task should be detailed enough to guide implementation
- Follow logical implementation order
- Consider TDD workflow: tests first, then implementation
- Format: `1. [ ] [Detailed task description with specific implementation details]`
- Example tasks:
  - "1. [ ] Design and create database schema with migrations - Create User entity with fields (id, email, password, role), add TypeORM migrations"
  - "2. [ ] Implement repository layer with unit tests - Create UserRepository with findByEmail, create, update methods following TDD"
  - "3. [ ] Implement service layer with business logic and unit tests - Create UserService with registration, login, password validation using TDD approach"
  - "4. [ ] Create API endpoints with DTOs and validation - Implement UserController with POST /users/register, POST /users/login endpoints, create DTOs with class-validator"
  - "5. [ ] Add integration tests for end-to-end flows - Test complete registration and login flows with database and API layer"
  - "6. [ ] Add error handling and logging - Implement BusinessException handling, add logging for critical operations"
  - "7. [ ] Update API documentation - Add Swagger/OpenAPI documentation for all endpoints"

#### Technical Notes Section

**Architecture Approach:**
- Describe how this feature integrates with existing system
- Identify architectural patterns to use (refer to cursor rules)
- Define component responsibilities
- Outline data flow

**Integration Points:**
- List modules/services this feature interacts with
- Identify APIs being consumed or provided
- Note external dependencies (databases, third-party services)

**Technical Decisions:**
- Document key technical choices
- Explain rationale for decisions
- Note any trade-offs considered
- Highlight performance or security considerations

**Data Model (if applicable):**
- Describe entities and their relationships
- List key fields and validation rules
- Note any database considerations

**Mermaid Diagrams (if needed):**
- Add architecture diagrams for complex features
- Include sequence diagrams for multi-step flows
- Use entity-relationship diagrams for data models
- Embed diagrams directly in Technical Notes section

### Step 5: Constitutional Compliance Check

Verify the plan adheres to:
- [ ] TDD approach (tests first, then implementation)
- [ ] Cursor rules for project structure
- [ ] Cursor rules for naming conventions
- [ ] Cursor rules for testing standards
- [ ] Security requirements from constitution
- [ ] Performance considerations from constitution
- [ ] Code quality standards

If any violations are necessary, document them with clear justification.

### Step 6: Validate Plan Quality

Ensure:
- [ ] Tasks are clear and actionable
- [ ] Technical approach is sound
- [ ] All cursor rules are considered
- [ ] Integration points are identified
- [ ] Data model is well-defined (if applicable)
- [ ] Plan is detailed enough to implement

### Step 7: Report Completion

Output a summary:

```
✅ Implementation plan created successfully!

Feature: [Feature Name]
Location: specs/[feature-name]/plan.md

Plan includes:
- [X] numbered tasks (1-N) with detailed descriptions
- Architecture approach: [brief summary]
- Integration points: [X modules/services]
- [Mermaid diagrams included / No diagrams needed]

Constitutional Compliance:
✓ Follows TDD approach
✓ Adheres to cursor rules
✓ Meets security requirements
✓ Considers performance and scalability

Next steps:
1. Review the plan in specs/[feature-name]/plan.md
2. Verify technical approach aligns with team standards
3. Run /snap/implement to begin full implementation
4. Or run /snap/implement [task-numbers] to implement specific tasks
   Examples:
   - /snap/implement 1,3,5    (implement tasks 1, 3, and 5)
   - /snap/implement 1-3      (implement tasks 1 through 3)
   - /snap/implement all      (implement all tasks)
```

---

## Important Guidelines

### Planning Principles

- **Constitution First**: Every decision must align with `.snap/spec-kit/constitution.md`
- **Cursor Rules Second**: Check ALL relevant rules in `.cursor/rules/*.mdc`
- **TDD Always**: Plan must reflect test-first development
- **Think Ahead**: Anticipate integration challenges and technical debt
- **Be Specific**: Vague plans lead to vague implementations

### Common Cursor Rules to Check

Based on the rules in `.cursor/rules/`, ensure the plan addresses:
- **auth-security.mdc**: Authentication and authorization strategy
- **controller.mdc**: API endpoint design patterns
- **core-naming.mdc**: Naming conventions for files and components
- **entity.mdc**: Data model design standards
- **exception-handling.mdc**: Error handling approach
- **project-structure.mdc**: Where files should be organized
- **repository.mdc**: Data access patterns
- **unit-testing.mdc**: Testing strategy and standards

### When to Use Mermaid Diagrams

Include diagrams for:
- Complex architecture with multiple components
- Multi-step user flows or business processes
- Data models with multiple entities and relationships
- Sequence diagrams for API interactions
- State transitions for stateful features

Skip diagrams for:
- Simple CRUD operations
- Straightforward single-component features
- Features with minimal integration points

---

## Reference

- Constitution: `.snap/spec-kit/constitution.md`
- Cursor Rules: `.cursor/rules/*.mdc`
- Template: `.snap/spec-kit/templates/plan.md`
- Specification: `specs/[feature-name]/spec.md`
