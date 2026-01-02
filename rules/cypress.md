# Cypress Testing Guidelines for a Vue 3 + TypeScript File Manager (dendrite-pulse REST backend)

This document adapts general Cypress best practices to a **web-based file & command manager** SPA built
with **Vue 3 + TypeScript**, talking to a **REST backend** (dendrite-pulse).

---

## Goals

- Tests are **stable** (low flakiness)
- Tests are **readable** (clear intent)
- Tests are **maintainable** (refactors don’t cause mass failures)
- Tests provide **fast feedback** (component tests for logic, E2E for key flows)

---

## Recommended test split (what to test where)

### Cypress Component Tests

Use for complex UI behavior without full app setup:

- File list row rendering (icons, size formatting, permissions badge)
- Selection logic (single, multi-select, shift-select)
- Context menus
- Rename/move/copy dialogs validation
- Keyboard shortcuts (arrow navigation, enter to open, delete, F2 rename)

### Cypress E2E Tests

Use for a small set of critical user journeys:

- Login → browse folder → open file preview
- Upload → verify file appears → download
- Rename → verify list updates → persists after reload
- Run command → stream/output panel updates → command history entry

Rule of thumb: **Prefer component tests first.** Add E2E only when multiple parts must work together.

---

## Top 5 Do’s and Don’ts (project-specific)
<!-- markdownlint-disable MD024 -->

## 1) Stable selectors

### ✅ Do

- Use a consistent attribute naming scheme:
  - `data-cy="file-row"`
  - `data-cy="file-name"`
  - `data-cy="toolbar-upload"`
  - `data-cy="dialog-rename"`
- Keep selectors **semantic**, not presentational.

### ❌ Don’t

- Select by class names, DOM depth, or Tailwind classes.
- Couple selectors to “how it looks” instead of “what it is”.

**Convention recommendation:** Reserve `data-cy` only for Cypress. Avoid reusing it for styling or app logic.

---

## 2) Make network the synchronization point (avoid timing)

### ✅ Do

- Treat backend calls as the primary “done” signal:
  - `cy.intercept('GET', '/api/files*').as('listFiles')`
  - `cy.wait('@listFiles')`
- Assert on response bodies when useful (e.g., count, filenames) to diagnose failures faster.

### ❌ Don’t

- Use fixed waits like `cy.wait(2000)` to “stabilize”.
- Assume rendering finishes within a timeframe.

---

## 3) Control app state (repeatable tests)

### ✅ Do

- Prefer **programmatic login** or token injection (faster, less brittle).
- Seed server data through an API endpoint if available (or a dedicated test mode).
- Reset between tests:
  - clear cookies/localStorage/sessionStorage
  - reset backend test data if possible

### ❌ Don’t

- Rely on previous tests to create data.
- Depend on execution order.

**If the backend is not in “test mode”:** Use `cy.intercept()` to stub responses for most tests and keep E2E against a
controlled staging dataset only.

---

## 4) Test user-visible behavior, not Vue internals

### ✅ Do

- Assert what a user can see:
  - the file appears in the list
  - rename dialog shows validation error
  - output panel contains the expected command result
- Assert accessibility-related states where practical:
  - focus moves correctly when using keyboard navigation
  - buttons are disabled/enabled correctly

### ❌ Don’t

- Assert Pinia store contents in E2E tests.
- Assert component refs or internal computed values.

---

## 5) Keep tests small, expressive, and DRY (but not over-abstracted)

### ✅ Do

- Extract repeated sequences into:
  - `cy.login()` custom command
  - `cy.createTestFile()` (backend seed helper)
  - “page object”-style helpers sparingly (for stable screens like login)
- Keep helpers **thin** and readable.

### ❌ Don’t

- Build large, generic abstractions that hide intent.
- Create helpers that perform many unrelated steps.

---

## Suggested folder structure

```text
cypress/
  e2e/
    auth.cy.ts
    files-browse.cy.ts
    files-upload.cy.ts
    files-rename.cy.ts
    commands-run.cy.ts
  component/
    FileRow.cy.ts
    FileList.cy.ts
    RenameDialog.cy.ts
    CommandOutput.cy.ts
  fixtures/
    files.root.json
    files.docs.json
    command.ls.json
  support/
    commands.ts
    e2e.ts
```

---

## Naming and organization conventions

### Spec file naming

- E2E: `feature-action.cy.ts` (e.g., `files-rename.cy.ts`)
- Component: component name (e.g., `RenameDialog.cy.ts`)

### Test naming

- Use: **`should <user outcome>`**
  - `should rename a file and show the new name in the list`
  - `should show an error when renaming to an existing filename`

---

## Recommended Cypress patterns for this app

## Programmatic login (concept)

- Prefer a login that avoids the UI where possible:
  - Call backend auth endpoint and set token in local storage / cookie
  - Or use a backend “test token” in local dev (only in test environment)

Benefits:

- Faster tests
- Less flakiness
- Avoids UI changes breaking auth tests

Keep **one** UI login E2E test (smoke test) to validate login page.

---

## Intercept patterns (REST backend)

Use intercepts with clear aliases:

- `@listFiles`
- `@uploadFile`
- `@renameFile`
- `@runCommand`

Assert:

- HTTP status
- request payload correctness for write operations (rename/move)
- minimal response correctness for diagnosis

---

## Fixtures strategy

- Use fixtures to cover edge cases:
  - empty directory
  - long filenames
  - unicode filenames
  - large file sizes / sorting edge cases
  - permission denied indicators

Keep fixtures small and intentionally named:

- `files.empty.json`
- `files.mixed-sizes.json`
- `files.unicode.json`

---

## Common file-manager edge cases worth testing

- Selection:
  - shift-select range
  - ctrl/cmd multi-select
  - selection persists across re-render
- Sorting:
  - name/size/date toggles
  - stable ordering for equal keys
- Renaming:
  - invalid characters
  - duplicate names
  - optimistic update vs server rejection
- Upload:
  - progress indicator
  - duplicate name conflict
  - network failure recovery
- Commands:
  - streaming output or polling behavior
  - cancellation
  - error output display

---

## Minimal E2E suite recommendation (keep it lean)

1. **auth.cy.ts**
    - UI login works and reaches app shell

2. **files-browse.cy.ts**
    - list root → open folder → list updates

3. **files-upload.cy.ts**
    - upload file → appears → download works (optional)

4. **files-rename.cy.ts**
    - rename → list shows new name → reload persists

5. **commands-run.cy.ts**
    - run command → output shown → history entry created

---

## Final guideline

> Prefer **clear intent** over clever abstractions.  
> Optimize for a future teammate understanding a failing test in 60 seconds.
