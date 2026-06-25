# Snap Spec Constitution

## Overview

This constitution defines the development standards and workflow for the Snap platform. All features must follow this spec-driven development approach.

---

## Spec-Driven Development Workflow

Snap uses a streamlined 4-step development process:

### 1. **Specify** (`/snap/specify`)
Create a clear, functional specification that defines:
- What the feature does (not how)
- User stories and acceptance criteria
- Functional requirements
- Edge cases to handle

### 2. **Plan** (`/snap/plan`)
Generate an implementation plan that includes:
- High-level tasks
- Technical approach and architecture decisions
- Integration points and dependencies
- Must follow constitution and cursor rules

### 3. **Implement** (`/snap/implement`)
Execute the feature using Test-Driven Development:
- Write tests first, then implementation
- Follow all cursor rules strictly
- Complete full functional implementation
- Process one checkpoint at a time
- Mark status as "Needs Verification"

### 4. **Verify** (`/snap/verify`)
Verify implementation completeness with evidence:
- Run full test suite (paste output)
- Map every requirement to code
- Check for incomplete code (TODOs, FIXMEs)
- Confirm all tasks/checkpoints complete
- Mark feature "Completed ✅" if all pass

---

## Non-Functional Requirements

### Performance
- Response times must be optimal for user experience
- System must handle expected load without degradation
- Database queries must be efficient and indexed appropriately

### Security
- All endpoints must have proper authentication and authorization
- Input validation is mandatory for all user inputs
- Sensitive data must be encrypted and handled securely
- Follow security best practices defined in cursor rules

### Code Quality
- Code must be readable, maintainable, and well-documented
- Follow consistent naming conventions and file organization
- All code must pass linting and formatting checks
- Comprehensive test coverage is required

### Scalability
- Architecture must support future growth
- Design for modularity and separation of concerns
- Avoid tight coupling between components

---

## Cursor Rules Reference

**CRITICAL**: All implementations MUST strictly follow the cursor rules located in `.cursor/rules/*.mdc`

### Active Rules Files

- **`auth-security.mdc`** - Authentication, authorization, and security standards
- **`controller.mdc`** - Controller layer patterns and best practices
- **`core-naming.mdc`** - Naming conventions for variables, functions, classes, and files
- **`entity.mdc`** - Entity and data model guidelines
- **`exception-handling.mdc`** - Error handling and exception management
- **`gloabal.mdc`** - Global project standards and configurations
- **`project-structure.mdc`** - Project organization and file structure rules
- **`repository.mdc`** - Data access layer patterns
- **`snap-framework.mdc`** - Snap framework-specific guidelines
- **`specify-rules.mdc`** - Specification and documentation standards
- **`unit-testing.mdc`** - Testing standards and TDD practices

**⚠️ Important**: Before implementing any feature, review the relevant cursor rules. During implementation, explicitly verify compliance with these rules.

---

## Development Standards

### Test-Driven Development (TDD)
1. Write failing tests first
2. Implement minimum code to pass tests
3. Refactor while keeping tests green
4. Maintain high test coverage

### Code Review
- All code must be reviewed before merging
- Reviewers must verify:
  - Compliance with cursor rules
  - Adherence to spec and plan
  - Test coverage and quality
  - Code readability and maintainability

### Documentation
- Specs must be kept up-to-date with changes
- Implementation plans should reflect actual implementation
- Code comments should explain "why", not "what"
- API documentation must be comprehensive

---

## Quality Gates

### Before Planning
- [ ] Specification is complete and clear
- [ ] All clarifications have been resolved
- [ ] Functional requirements are testable

### Before Implementation
- [ ] Plan follows constitution and cursor rules
- [ ] Technical approach is sound and validated
- [ ] All dependencies are identified

### Before Completion
- [ ] All tests pass (unit, integration, e2e)
- [ ] Code follows all cursor rules
- [ ] Implementation matches spec and plan
- [ ] Code review is complete
- [ ] Documentation is updated

---

## Enforcement

This constitution is binding for all development work. Deviations must be:
1. Documented with clear justification
2. Approved by technical leadership
3. Recorded in the implementation plan

Regular audits will ensure compliance with constitutional principles.

---

**Version**: 1.0.0
**Created**: 2025-11-19
**Last Updated**: 2025-11-19
