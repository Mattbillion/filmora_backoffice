# dev-only: Postman-driven route generator

Developer-only tooling to scaffold Next.js dashboard routes (pages, actions, schemas, columns, and dialogs) from a Postman collection and live API sample responses.

- Inputs: Postman collection (with base URL and token variables) + API endpoints
- Output: Route modules under `app/(dashboard)/...`

## Structure

- `fetch-zod-schema/`
  - `index.js`: Fetches sample data via curl, infers Zod schema, returns endpoint metadata
  - `postman/`
    - `postman-collection.json`: Your Postman export (must include `variables.base` and `variables.token`)
    - `postman-data.js`: Loads variables and builds the curl command
    - `endpoints.js`: Flattens the collection into grouped endpoints for generation
    - `generated-routes.js`: Lists current top-level routes under `app/(dashboard)`
- `plop-generator/`
  - `index.js`: Plop setup, helpers, and generators (`route`, `routes`)
  - `route/`
    - `plop-actions.js`: Per-route action list (creates files, formats, lints)
    - `*.hbs`: Handlebars templates for schema, actions, page, columns, layout, loading, and components
    - `hbs-partials/`: Reusable template bits (form fields, request actions)

## Contracts and assumptions

- API list responses (GET collection): `{ data: T[], total_count: number }`
- API detail responses (GET detail): `{ data: T }`
- Auth is a Bearer token set in the Postman variables
- GET list endpoints accept `page` and `page_size`; fetcher injects `?page=1&page_size=1` by default

## Generation flow

1) Parse Postman collection
- `endpoints.js` walks folders and requests, yielding:
  - `name`: derived from method + path (e.g., `getMovies`, `getMovieDetail`)
  - `method`: `GET|POST|PUT|DELETE`
  - `endpoint`: "/path" with injected query for GET lists
  - `pathList`: normalized segments; numeric parts replaced by `{param}`
  - `base`: first path segment (grouping key)
- `generated-routes.js` logs what routes already exist in `app/(dashboard)`

2) Fetch sample and build schema
- `fetch-zod-schema/index.js`:
  - selects a suitable GET endpoint for the base
  - calls the API via curl using `variables.base` and `variables.token`
  - extracts a representative item (first element if `data` is an array)
  - strips meta fields (`id`, `created_at`, `updated_at`, `created_employee`)
  - converts the payload to a Zod schema (`json-to-zod`)
  - returns `rawData`, `dataKeys`, `zodSchema` string, `endpointList`

3) Render templates
- `plop-generator/index.js` registers helpers and a `fetchSchema` action that renders templates using fetched data
- `route/plop-actions.js` writes files to `app/(dashboard)/{path}`, then runs Prettier and ESLint

## What gets generated

Under `app/(dashboard)/{path}`:
- `layout.tsx`, `loading.tsx`
- `schema.ts` (Zod schema, types, cache key)
- `actions.ts` (list/detail/create/update/delete based on Postman endpoints)
- `page.tsx` (table page consuming list action)
- `columns.tsx` (auto-inferred table columns)
- `components/`
  - `index.ts`
  - `create-dialog.tsx`, `update-dialog.tsx` (forms using schema/rawData)

## Usage

Prerequisites:
- Export your Postman collection to `dev-only/fetch-zod-schema/postman/postman-collection.json`
- Ensure collection `variables`:
  - `base`: e.g., `https://api.example.com`
  - `token`: valid Bearer token

Commands:

```bash
pnpm gen:route
```
- Prompts:
  - `route-name`: human alias (e.g., `movies`)
  - `endpoint`: Postman base group (first path segment, e.g., `movies`)
  - `path`: dashboard path (e.g., `movies` or `movies/[id]`)

```bash
pnpm gen:routes
```
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

## Helpers and partials (overview)

- Request partials (`endpoint-request`):
  - `getRequest`: GET list with `searchParams`, tags
  - `getDetailRequest`: GET detail with param-derived tag
  - `createRequest`: POST with body
  - `updateRequest`: PUT with body and param
  - `deleteRequest`: DELETE with param
- Form partials (`form-items`):
  - Text/number inputs, boolean selects, WYSIWYG, image upload, numeric select (placeholder options)
- Utility helpers:
  - Type guards for fields (`isImage`, `isBoolean`, `isArray`, `containsDesc`)
  - Sorting/filtering heuristics for columns
  - Dynamic endpoint/param string builders for actions

## Troubleshooting

- No endpoints found
  - Ensure the `endpoint` (group base) matches the first path segment in the Postman collection
  - Check that items are inside folders (generator reads foldered items)
- Empty data error
  - The GET list should return a non-empty `data` array; seed your API or adjust the query
- 401/403
  - Confirm `variables.token` in the Postman collection is valid
- Wrong action mapping
  - Numeric segments become `{param}` and mark requests as “Detail”; ensure your Postman path patterns are realistic

## Known limitations

- Requires live API access during generation (coupled to network and token)
- Assumes list endpoints return `data` arrays; if your API wraps differently, adjust the fetcher
- Only top-level dashboard folders are considered “generated” in the availability log
- Multiple GETs under the same base may not pick the intended list endpoint; verify logs

## Maintenance tips

- Keep `postman-collection.json` up to date with the latest endpoints and variables
- Rotate tokens regularly; avoid committing real tokens to source control
- Adjust templates/partials to fit evolving UI/UX conventions

