# dev-only: Postman-driven route generator

Developer-only tooling to scaffold Next.js dashboard routes (pages, actions, schemas, columns, and dialogs) from a Postman collection and live API sample responses.

- Inputs: Postman collection (with base URL and token variables) + API endpoints
- Output: Route modules under `app/(dashboard)/...`

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
  - Templates: [route/layout.tsx.hbs](plop-generator/route/layout.tsx.hbs), [route/loading.tsx.hbs](plop-generator/route/loading.tsx.hbs), [route/page.tsx](plop-generator/route/page.tsx.hbs), [route/actions.ts.hbs](plop-generator/route/actions.ts.hbs), [route/schema.ts.hbs](plop-generator/route/schema.ts.hbs), [route/columns.tsx.hbs](plop-generator/route/columns.tsx.hbs)
  - Partials: [route/hbs-partials/form-items.js](plop-generator/route/hbs-partials/form-items.js), [route/hbs-partials/endpoint-request.js](plop-generator/route/hbs-partials/endpoint-request.js)

Tip: In GitHub or VS Code, the links above are clickable and will navigate to the file.

## Structure

- [fetch-zod-schema](fetch-zod-schema)/
  - [index.js](fetch-zod-schema/index.js): Fetches sample data via curl, infers Zod schema, returns endpoint metadata
  - [postman](fetch-zod-schema/postman)/
    - [postman-collection.json](fetch-zod-schema/postman/postman-collection.json): Your Postman export (must include variables like `base` and `token`)
    - [postman-data.js](fetch-zod-schema/postman/postman-data.js): Loads variables, reads config, and builds the curl command
    - [endpoints.js](fetch-zod-schema/postman/endpoints.js): Flattens the collection into grouped endpoints for generation
    - [generated-routes.js](fetch-zod-schema/postman/generated-routes.js): Lists current top-level routes under `config.DASHBOARD_DIR`
- [plop-generator](plop-generator)/
  - [index.js](plop-generator/index.js): Plop setup, helpers, and generators (`route`, `routes`)
  - [route](plop-generator/route)/
    - [plop-actions.js](plop-generator/route/plop-actions.js): Per-route action list (creates files, formats, lints)
    - *.hbs: Handlebars templates for [schema](plop-generator/route/schema.ts.hbs), [actions](plop-generator/route/actions.ts.hbs), [page](plop-generator/route/page.tsx.hbs), [columns](plop-generator/route/columns.tsx.hbs), [layout](plop-generator/route/layout.tsx.hbs), [loading](plop-generator/route/loading.tsx.hbs), and [components](plop-generator/route/components)
    - [hbs-partials](plop-generator/route/hbs-partials)/: Reusable template bits (form fields, request actions)

## Configuration (dev-only/config.js)

Set your config once in [dev-only/config.js](config.js). Keys in use:
- [FILMORA_DOMAIN](./config.js): API base URL used to call endpoints during generation.
- [TOKEN](./config.js): Optional Bearer token override. If null, token comes from Postman collection variables.
- [POSTMAN_COLLECTION_PATH](./config.js): Path to the Postman JSON collection used for endpoints and variables.
- [CACHE_TTL_SECONDS](./config.js): Cache TTL (seconds) for fetched sample responses used in schema inference.
- [DEFAULT_PAGE](./config.js), [DEFAULT_PAGE_SIZE](./config.js): Pagination defaults injected into GET list endpoint queries.
- [DASHBOARD_DIR](./config.js): Path to the Next.js dashboard root where files are generated and discovered.
- [ENABLE_FORMAT](./config.js), [FORMAT_COMMAND](./config.js): Run formatting after generation (default: Prettier write).
- [ENABLE_LINT](./config.js), [LINT_COMMAND](./config.js): Run lint fixes after generation (default: ESLint --fix).

Example:

```js
// dev-only/config.js
const path = require('path');
module.exports = {
  FILMORA_DOMAIN: 'https://api.example.com',
  TOKEN: null,
  POSTMAN_COLLECTION_PATH: path.join('dev-only', 'fetch-zod-schema', 'postman', 'postman-collection.json'),
  CACHE_TTL_SECONDS: 10,
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 1,
  DASHBOARD_DIR: path.join('app', '(dashboard)'),
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

## Generation flow

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
- plop-generator/index.js registers helpers and a `fetchSchema` action that renders templates using fetched data
- route/plop-actions.js writes files to `app/(dashboard)/{path}`, then runs Prettier and ESLint (configurable)

## What gets generated

Under `app/(dashboard)/{path}`:
- layout.tsx, loading.tsx
- schema.ts (Zod schema, types, cache key)
- actions.ts (list/detail/create/update/delete based on Postman endpoints)
- page.tsx (table page consuming list action)
- columns.tsx (auto-inferred table columns)
- components/
  - index.ts
  - create-dialog.tsx, update-dialog.tsx (forms using schema/rawData)

## Usage

Prerequisites:
- Export your Postman collection to the path in POSTMAN_COLLECTION_PATH
- Ensure collection variables:
  - base: if not using FILMORA_DOMAIN override
  - token: valid Bearer token (unless TOKEN override is set)

Commands (package.json scripts may expose these):
- Generate a single route: 
  ```bash 
  pnpm gen:route
  ```
  - Prompts:
    - route-name: human alias (e.g., `movies`)
    - endpoint: Postman base group (first path segment, e.g., `movies`)
    - path: dashboard path (e.g., `movies` or `movies/[id]`)
- Generate multiple routes: `pnpm gen:routes`
  - Input format: `alias:endpoint:path` (space-separated)
  - Example: `movies:movies:movies categories:categories:categories`

## Naming and path rules

- Path kebab-casing preserves brackets/segments:
  - `movies/[id]` stays `movies/[id]`
  - nested groups allowed (e.g., `movies/reviews`)
- Endpoint base matches the first segment in Postman paths:
  - E.g., `/movies`, `/movies/{id}`, `/movies/{id}/reviews` → base: `movies`
- Action names derive from method + path:
  - GET list: `getMovies`
  - GET detail: `getMovieDetail`
  - POST: `createMovies`
  - PUT: `patchMovieDetail`
  - DELETE: `deleteMovieDetail`

## Troubleshooting

- No endpoints found
  - Ensure the `endpoint` (group base) matches the first path segment in the Postman collection
  - Check that items are inside folders (generator reads foldered items)
- Empty data error
  - The GET list should return a non-empty `data` array; seed your API or adjust the query
- 401/403
  - Confirm the token is valid (Postman variable or config override)
- Wrong action mapping
  - Numeric segments become `{param}` and mark requests as “Detail”; ensure path patterns are realistic

## Known limitations

- Requires live API access during generation (coupled to network and token)
- Assumes list endpoints return `data` arrays; adjust the fetcher if your API differs
- Only top-level dashboard folders are considered “generated” in the availability log
- Multiple GETs under the same base may not pick the intended list endpoint; verify logs

## Maintenance

- Keep your Postman collection up to date with the latest endpoints and variables
- Rotate tokens regularly; avoid committing real tokens
- Adjust templates/partials to fit evolving UI/UX conventions
