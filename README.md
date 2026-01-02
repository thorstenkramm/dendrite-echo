# dendrite-echo

dendrite-echo is a single-page application written in Vue.js
that acts as a frontend for the
[dendrite-pulse backend](https://github.com/thorstenkramm/dendrite-pulse).

dendrite-echo is based on Vue 3,
[TypeScript](https://vuejs.org/guide/typescript/overview.html),
Tailwind CSS, and
[Shadcn UI for Vue](https://www.shadcn-vue.com/).

## Folder Structure

```text
dendrite-echo/
├── public/                 # Static files (favicon, robots.txt)
├── src/
│   ├── assets/             # Images, fonts, global CSS
│   ├── components/
│   │   ├── ui/             # Shadcn UI components
│   │   └── ...             # App components (UserCard, NavBar)
│   ├── composables/        # Shared logic (useAuth, useForm)
│   ├── stores/             # Pinia stores (useUserStore)
│   ├── views/              # Page-level components mapped to routes
│   ├── router/             # Vue Router config
│   ├── types/              # TypeScript types
│   ├── lib/                # Pure utilities
│   ├── App.vue             # Root component
│   └── main.ts             # App entry point
├── tests/                  # Unit tests (*.spec.ts)
└── cypress/
    ├── e2e/              # E2E test specs
    ├── component/        # Component test specs
    ├── fixtures/         # Test data fixtures
    └── support/          # Custom commands and setup
```

### What Goes Where

- `components/ui/`: Shadcn components installed via CLI. Do not
  edit directly.
- `components/`: Custom components, PascalCase names like
  `UserCard.vue`.
- `composables/`: Shared logic extracted into `useX` functions.
- `stores/`: Pinia stores following `useXStore`, one per domain.
- `views/`: Page components that correspond to routes. Keep them
  thin.
- `types/`: Shared TypeScript interfaces and type aliases.
- `lib/`: Pure utility functions with no Vue dependencies.

## Development

### Prerequisites

- Node.js v24
- npm

### Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open your browser at the URL shown in the terminal (typically
   <http://localhost:5173>)

### API Proxy (Development)

During development, the backend API runs on its own web server at
<http://localhost:3000>. The Vite dev server proxies all `/api`
requests to that backend, so the frontend can call `/api/v1/*`
without changing hosts. If your backend uses a different port,
update `vite.config.ts`.

Run both services in separate terminals:

1. Backend:

   ```bash
   go run cmd/dendrite/main.go run \
     --file-root /:/tmp/
   ```

2. Frontend:

   ```bash
   npm run dev
   ```

Once both are running, verify the proxy with:

```bash
curl http://localhost:5173/api/v1/ping
```

### Available Scripts

- `npm run dev`: Start the Vite development server.
- `npm run build`: Build for production.
- `npm run preview`: Preview the production build.
- `npm run test:unit`: Run unit tests with Vitest.
- `npm run test:e2e`: Run Cypress tests headless.
- `npm run test:e2e:open`: Open the Cypress UI runner.
- `npm run lint`: Lint and fix files with ESLint.
- `npm run type-check`: Run TypeScript type checking.

### Cypress E2E

Cypress tests expect the dev server at <http://127.0.0.1:5173>
and the `/api` proxy to be active.

#### Cypress Prerequisites

- Run `npm install` to download the Cypress binary.
- Install a local browser such as Chrome or Firefox. Electron is
  bundled with Cypress.

#### Running Cypress

- Headless runs: `npm run test:e2e -- --browser chrome` or
  `npm run test:e2e -- --browser firefox`.
- Headless with Electron: `npm run test:e2e -- --browser electron`.
- Headed runs: `npm run test:e2e:open -- --browser chrome` or
  `npm run test:e2e:open -- --browser firefox`.
- Headed with Electron: `npm run test:e2e:open -- --browser electron`.

## Issues and feature requests

- The project uses git and [GitHub](https://github.com/thorstenkramm/dendrite-echo) as VCS.
- Issues and feature requests are tracked via [GitHub Issues](https://github.com/thorstenkramm/dendrite-echo/issues).
- The command line utility `gh` can be used to interact with GitHub. Issues may contain images or references to images
  with mockups, wireframes, or other visualizations to express a desired outcome.
