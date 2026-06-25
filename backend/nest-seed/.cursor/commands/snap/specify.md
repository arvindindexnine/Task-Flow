---
description: Create a feature specification from a natural language description
---

# /snap/specify - Create Feature Specification

## User Input

```
$ARGUMENTS
```

---

## Instructions

You are creating a feature specification for the Snap platform. Follow these steps carefully:

### Step 1: Extract Feature Description

The user's feature description is in `$ARGUMENTS`. If empty, respond with:
"Please provide a feature description. Usage: `/snap/specify [feature description]`"

### Step 2: Generate Feature Name

Analyze the feature description and create a concise feature name:
- Use 2-4 words that capture the essence of the feature
- Convert to kebab-case (e.g., "user-authentication", "export-reports")
- Use action-noun format when possible (e.g., "add-user-auth", "fix-payment-bug")
- Keep technical terms intact (e.g., "oauth2-integration", "jwt-validation")

**Examples:**
- "Add user authentication with email and password" → `user-authentication`
- "Create a dashboard for analytics" → `analytics-dashboard`
- "Fix the payment processing timeout issue" → `fix-payment-timeout`
- "Implement OAuth2 for the API" → `oauth2-api-integration`

### Step 3: Create Feature Directory

1. Check if `specs/[feature-name]/` already exists
2. If it exists, ask user: "Feature '[feature-name]' already exists. Do you want to overwrite it? (yes/no)"
3. If it doesn't exist, create the directory: `specs/[feature-name]/`

### Step 4: Create Specification

1. Read the template from `.snap/spec-kit/templates/spec.md`
2. Create `specs/[feature-name]/spec.md` based on the template
3. Fill out ALL sections based on the user's feature description:

**Guidelines for filling the spec:**

- **Feature Name**: Use a clear, descriptive title (not kebab-case)
- **Overview**: Write 2-3 sentences explaining what the feature does and why it's valuable
- **Functional Requirements**: Extract concrete, testable requirements from the description
  - Each requirement should start with what the system MUST do
  - Be specific and measurable
  - Focus on WHAT, not HOW
- **User Stories**: Create 2-5 user stories that cover the main user journeys
  - Use the "As a... I want... So that..." format
  - Include clear acceptance criteria with Given-When-Then format
  - Each story should deliver independent value
- **Edge Cases**: Identify potential error scenarios, boundary conditions, and exceptional cases
  - Think about what could go wrong
  - Consider data validation, concurrency, failures
  - Ask "what happens when..." questions
- **Clarifications Needed**: Only include if there are genuinely unclear aspects
  - Make reasonable assumptions where possible
  - Only ask for clarification on critical decisions
  - Limit to 2-3 most important questions

### Step 5: Validate Specification

Review the created specification and ensure:
- [ ] All sections are filled with concrete content (no placeholders)
- [ ] Requirements are clear and testable
- [ ] User stories have proper acceptance criteria
- [ ] Edge cases are identified
- [ ] No implementation details leaked (no mention of specific technologies, frameworks, databases)

### Step 6: Report Completion

Output a summary:

```
✅ Feature specification created successfully!

Feature: [Feature Name]
Location: specs/[feature-name]/spec.md

Summary:
- [X] functional requirements defined
- [X] user stories created
- [X] edge cases identified
- Clarifications needed: [X items / None]

Next steps:
1. Review the specification in specs/[feature-name]/spec.md
2. [If clarifications exist] Resolve clarifications
3. Run /snap/plan to create the implementation plan
```

---

## Important Notes

- **Focus on WHAT, not HOW**: The spec should describe functionality, not implementation
- **Be thorough**: Better to over-specify than under-specify
- **Make informed assumptions**: Don't ask for clarification on everything - use industry best practices
- **Stay technology-agnostic**: No mention of programming languages, frameworks, or tools
- **Think like a product manager**: Write for stakeholders, not developers

---

## Reference

- Constitution: `.snap/spec-kit/constitution.md`
- Template: `.snap/spec-kit/templates/spec.md`
