# **/specify — Final Polished Command (v2)**
A complete, minimal, streamlined specification-generation workflow with built-in test case rules, i18n text-replacement handling, and strict clarifying-question enforcement.

---

## **Description**
Generate a complete, minimal, accurate specification from the feature name, user answers, and uploaded visuals. Handles:

- Initialization  
- Requirement gathering  
- Visual analysis  
- Reusable component detection  
- Test case generation  
- i18n text-rule enforcement  
- Creation of `spec.md`  

---

## **Workflow (Simplified & Clean)**

---

## **Step 1 — Request Visual Upload (Mandatory)**

```

Please upload the design (images/screenshots) before we continue.
A visual is mandatory for a precise, minimal specification.

```

Stop execution until visuals are uploaded.

---

## **Step 2 — Initialize Spec Folder**

- Read `feature_name`
- Convert feature name to **kebab-case**
- Create folder structure:

```

specs/<feature-name>/
└─ visuals/

```

- **Save uploaded visual(s) into:**

```

specs/<feature-name>/visuals/

```

**Image Saving Instructions:**
- If image file is accessible: Save the image file(s) directly to `specs/<feature-name>/visuals/` retaining original filenames

- Ensure the visuals folder exists before attempting to save files
// Check if visual file(s) are attached in the prompt
// If yes, save each image to specs/<feature-name>/visuals/, retaining the original filenames

// Pseudocode logic (for implementer to adapt to actual agent runtime):
// - Ensure target directory exists (specs/<feature-name>/visuals/)
// - For each uploaded/attached image:
//      - Save image file to specs/<feature-name>/visuals/<original-filename>
//      - Confirm that file is present (optionally output relative path for confirmation)

Example implementation steps:
1. Create (if not exists): specs/<feature-name>/visuals/
2. For each attached image in the prompt, copy/save it to: specs/<feature-name>/visuals/<original-filename>

NOTE: Do not continue to spec creation or requirements steps until ALL visual files are correctly saved to the folder.

---

## **Step 3 — Ask Minimal High-Value Clarifying Questions**

Ask **only 3–4 essential questions**:

```

1. What is the exact user action or flow we must support?
2. Should the component follow an existing UI pattern or introduce a new one?
3. What is the expected data input/output?
4. Any constraints or exclusions (functional, technical, UX)?

Existing Code Reuse:
List components or logic we should reuse.

i18n Requirement:
Specify languages to support and any dynamic text requirements.

Visual Upload (Required):
Ensure mockups/wireframes/screenshots are uploaded.

```

Stop and wait for responses.

---

## **Step 4 — Analyze Visuals**

For each uploaded visual:

- Identify layout + structure  
- Extract displayed text → **mark as i18n keys**  
- Identify data inputs/outputs  
- Identify repeated UI or UX patterns  
- Detect reusable components  
- Identify interactions & transitions  

---

## **Step 5 — Generate Requirements Summary**

Summarize:

- User description  
- Clarifying question answers  
- Visual insights  
- i18n requirements  
- Reusability opportunities  

---

## **Step 6 — Insert Required Core Actions**

Always include:

```

✔ Analyze the attached design. Identify & list all reusable components.
✔ Generate component(s) from the design.
✔ Refactor the component(s) to make them faster & more efficient.
✔ Apply i18n: extract all visible strings into language files.
✔ Write test cases for components, API flows, and business logic.

```

---

## **Step 7 — Add Test Case Rules (Mandatory)**

### **Unit Tests**
- Component renders  
- Props & events  
- State change logic  
- i18n text validation (default + alternate languages)  
- Edge-case inputs  

### **Integration Tests**
- Data flow (inputs → actions → outputs)  
- API response handling  
- Error & empty-state rendering  

### **Visual / UI Tests**
- Layout consistency  
- Component reuse detection  
- Accessibility validation  

### **Flow Tests**
- Entire user action flow from start → end  

---

## **Step 8 — Create `spec.md` (Minimal Format)**

Generated file uses:

```

# Specification: [Feature Name]

## Goal

1–2 sentences.

## User Stories

* As a user, I want to… so that…

## Requirements

* Core flow
* Component responsibilities
* Data needs
* i18n rules (all text must be externalized)
* Reusable components detected

## Visual Insights

* Key UI elements
* Patterns
* Interactions
* Screens & text extracted for i18n

## Performance & Refactoring Notes

* Optimization opportunities
* Reuse patterns

## Test Cases

### Unit

* …

### Integration

* …

### Flow Tests

* …

### UI / Visual Tests

* …

## Required Actions

* Analyze reusable components
* Generate components from design
* Refactor for performance
* Apply i18n text rules
* Write full test coverage

## Out of Scope

* Anything explicitly excluded

```

---

## **Step 9 — Output Completion Message**

```

Spec created at: specs/[feature-name]/spec.md
Review and confirm.

```

---

# ✔ Your create-spec.md is ready.
```
