# Repository Guidelines

This repository hosts the dendrite-echo frontend. Keep changes
aligned with the Vue 3, TypeScript, and Tailwind stack described
in `README.md` and `rules/vue.md`.

## Project Structure & Module Organization

- `README.md` summarizes the app purpose and stack.
- `rules/markdown.md` and `rules/vue.md` define documentation and coding standards.
- `LICENSE` contains licensing terms.
- `src/` contains application source code
- `tests/` contains unit tests
- `cypress/` contains E2E tests
- `public/` contains static assets

## Build, Test, and Development Commands

Scripts should live in `package.json` (not present yet). When
adding the Vue scaffold, keep this list in sync and prefer
create-vue defaults.

- `npm install` installs dependencies (Node 24 and npm).
- `npm run dev` starts the Vite dev server for local work.
- `npm run build` creates a production build (default output
  `dist/`).
- `npm run lint` runs ESLint with `eslint-plugin-vue`.
- `npm run test:unit` runs Vitest with Vue Test Utils.
- `npm run test:e2e` runs Cypress browser tests.

## Coding Style & Naming Conventions

- Follow the official Vue style guide and keep ESLint clean.
- Indent with 2 spaces; no tabs.
- Use PascalCase for components (e.g., `UserCard.vue`), `useX`
  for composables, and `useXStore` for Pinia stores.
- Prefer camelCase for props and kebab-case for emitted events.

## Testing Guidelines

Unit tests use Vitest + Vue Test Utils, and end-to-end tests use
Cypress. There is no formal coverage threshold yet; aim for
meaningful coverage on stores, composables, and critical views.

- Place unit tests in `tests/unit` or alongside components as `*.spec.ts`.
- Place Cypress specs in `cypress/` with `*.cy.ts`, and keep
  fixtures in `cypress/fixtures/`.

## Commit & Pull Request Guidelines

Git history is minimal (only "Initial commit"), so no fixed
commit convention exists yet. Use short imperative subjects and
add a body when context helps.

- PRs include a concise summary and a testing note (what you ran or why not).
- Link related issues and backend changes (dendrite-pulse) when relevant.
- Include UI screenshots or short clips for visual changes.

## Documentation & Linting

- Follow `rules/markdown.md` and the repository's markdownlint
  configuration for line length and heading usage.
- Run `npx markdownlint --fix AGENTS.md` (and other markdown
  files) before committing docs.
