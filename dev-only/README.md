# dev-only: Postman-driven route generator

Developer-only tooling to scaffold Next.js dashboard routes using a shared services layer and Postman collection + live API samples.

- Inputs: Postman collection (with base URL and token variables) + API endpoints
- Output:
  - Service modules under `services/{entity}`: `schema.ts`, `service.ts`, `index.ts`
  - Route modules under `app/(dashboard)/...` using the service functions

Quick links (click to open):
- fetch-zod-schema
  - [fetch-zod-schema/index.js](fetch-zod-schema/index.js)
  - [postman/postman-collection.json](fetch-zod-schema/postman/postman-collection.json)
  - [postman/postman-data.js](fetch-zod-schema/postman/postman-data.js)
  - [postman/endpoints.js](fetch-zod-schema/postman/endpoints.js)
  - [postman/generated-routes.js](fetch-zod-schema/postman/generated-routes.js)
- plop-generator
  - [plop-generator/index.js](plop-generator/index.js)
  - [route/plop-actions.js](plop-generator/route/plop-actions.js)
  - Templates: [route/layout.tsx.hbs](plop-generator/route/layout.tsx.hbs), [route/loading.tsx.hbs](plop-generator/route/loading.tsx.hbs), [route/page.tsx.hbs](plop-generator/route/page.tsx.hbs), [route/columns.tsx.hbs](plop-generator/route/columns.tsx.hbs)
  - Service templates: [route/schema.ts.hbs](plop-generator/route/services/schema.ts.hbs), [route/services/service.ts.hbs](plop-generator/route/services/service.ts.hbs), [route/services/index.ts.hbs](plop-generator/route/services/index.ts.hbs)
  - Partials: [route/hbs-partials/form-items.js](plop-generator/route/hbs-partials/form-items.js), [route/hbs-partials/endpoint-request.js](plop-generator/route/hbs-partials/endpoint-request.js)

Tip: In GitHub or VS Code, the links above are clickable.

## Structure

- fetch-zod-schema/
  - index.js: Fetches sample data via curl, infers Zod schema, returns endpoint metadata
  - postman/
    - postman-collection.json: Your Postman export (must include variables like `base` and `token`)
    - postman-data.js: Loads variables, reads config, and builds the curl command
    - endpoints.js: Flattens the collection into grouped endpoints for generation
    - generated-routes.js: Lists current top-level routes under `app/(dashboard)`
- plop-generator/
  - index.js: Plop setup, helpers, and generators (`route`, `routes`)
  - route/
    - plop-actions.js: Generates service files under `services/{entity}` and route files under `app/(dashboard)/{path}`
    - *.hbs: Handlebars templates for page, columns, components and service modules
    - hbs-partials/: Reusable template bits (form fields, request actions)

## Configuration (dev-only/config.js)

Set your config once in [dev-only/config.js](config.js). Keys in use:
- FILMORA_DOMAIN: API base URL used to call endpoints during generation.
- TOKEN: Optional Bearer token override. If null, token comes from Postman collection variables.
- POSTMAN_COLLECTION_PATH: Path to the Postman JSON collection used for endpoints and variables.
- CACHE_TTL_SECONDS: Cache TTL (seconds) for fetched sample responses used in schema inference.
- DEFAULT_PAGE, DEFAULT_PAGE_SIZE: Pagination defaults injected into GET list endpoint queries.
- DASHBOARD_DIR: Path to the Next.js dashboard root where files are generated and discovered.
- SERVICES_DIR: Path to the services root where per-entity service modules are generated.
- ENABLE_FORMAT, FORMAT_COMMAND: Run formatting after generation (default: Prettier write).
- ENABLE_LINT, LINT_COMMAND: Run lint fixes after generation (default: ESLint --fix).

Example:

```js
// dev-only/config.js
const path = require('path');
module.exports = {
  FILMORA_DOMAIN: process.env.FILMORA_DOMAIN,
  TOKEN: null,
  POSTMAN_COLLECTION_PATH: path.join('dev-only', 'fetch-zod-schema', 'postman', 'postman-collection.json'),
  CACHE_TTL_SECONDS: 10,
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 1,
  DASHBOARD_DIR: path.join('app', '(dashboard)'),
  SERVICES_DIR: path.join('services'),
  ENABLE_FORMAT: true,
  FORMAT_COMMAND: 'npx prettier --write',
  ENABLE_LINT: true,
  LINT_COMMAND: 'npx eslint --fix',
};
```

## Contracts and assumptions

- List responses (GET collection): `{ data: T[], total_count: number }`
- Detail responses (GET detail): `{ data: T }`
- Auth is a Bearer token set in the Postman variables or provided via config override
- GET list endpoints accept `page` and `page_size`; fetcher injects `?page=1&page_size=1` by default (configurable)

## Generation flow (service-based)

1) Parse Postman collection
- endpoints.js walks folders and requests, yielding:
  - name: derived from method + path (e.g., `getMovies`, `getMovieDetail`)
  - method: `GET|POST|PUT|DELETE`
  - endpoint: "/path" with injected query for GET lists
  - pathList: normalized segments; numeric parts replaced by `{param}`
  - base: first path segment (grouping key)
- generated-routes.js logs what routes already exist in `app/(dashboard)`

2) Fetch sample and build schema
- fetch-zod-schema/index.js:
  - selects a suitable GET endpoint for the base
  - calls the API via curl using base URL + Authorization
  - extracts a representative item (first element if `data` is an array)
  - strips meta fields
  - converts the payload to a Zod schema (`json-to-zod`)
  - returns `rawData`, `dataKeys`, `zodSchema` string, `endpointList`

3) Render templates
- plop-generator/route/plop-actions.js:
  - Writes service files to `services/{entity}`: schema.ts, service.ts, index.ts
  - Writes route files under `app/(dashboard)/{path}`: layout.tsx, loading.tsx, page.tsx, columns.tsx, components/
  - Route files import from `@/services/{entity}`
  - Runs Prettier and ESLint if enabled

## What gets generated

Under `services/{entity}`:
- schema.ts (Zod schema, types, cache key; imports shared types from `services/api/types`)
- service.ts (CRUD functions using `services/api/actions` and revalidation helpers)
- index.ts (barrel export)

Under `app/(dashboard)/{path}`:
- layout.tsx, loading.tsx
- page.tsx (uses `get{Entity}` from services)
- columns.tsx (uses `{Entity}ItemType` and delete function from services)
- components/
  - index.ts
  - create-dialog.tsx, update-dialog.tsx (forms using service schema/types and service actions)

## Usage

Prerequisites:
- Export your Postman collection to the path in POSTMAN_COLLECTION_PATH
- Ensure collection variables:
  - base: if not using FILMORA_DOMAIN override
  - token: valid Bearer token (unless TOKEN override is set)

Commands (package.json scripts may expose these):
- Generate a single route: `pnpm gen:route`
- Generate multiple routes: `pnpm gen:routes`

## Troubleshooting

- No endpoints found: ensure the base group matches the first path segment in the Postman collection
- Empty data error: list GET should return a non-empty `data` array
- 401/403: confirm token via Postman variable or config override
