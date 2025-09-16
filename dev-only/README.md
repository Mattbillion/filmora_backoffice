# dev-only: Postman-driven route generator

Tooling to scaffold Next.js dashboard routes using a shared services layer from a Postman collection and live API samples.

## Quick start (configure and run first)

1) Configure once
- Edit [dev-only/config.js](config.js)
  - FILMORA_DOMAIN: API base URL used during generation
  - TOKEN: optional override for Postman token (leave null to use collection variable)
  - POSTMAN_COLLECTION_PATH: path to your exported Postman collection JSON
  - DASHBOARD_DIR: route output root (default: [app/(dashboard)](../app/(dashboard)/))
  - SERVICES_DIR: service output root (default: [services](../services/))

2) Prepare Postman collection
- Put it at the configured path: [fetch-zod-schema/postman/postman-collection.json](fetch-zod-schema/postman/postman-collection.json)
- Ensure variables exist in the collection (unless overridden in config):
  - base (API base) and token (Bearer)

3) Generate
- Generate service only

```bash
pnpm gen:service
```

  - Prompts: route-name (alias), endpoint (base path)
- Generate multiple services

```bash
pnpm gen:services
```

  - Input: alias:endpoint (space-separated)
  - Example: genres:genres movies:movies
- Generate route (service auto-created if missing)

```bash
pnpm gen:route
```

  - Prompts: route-name, endpoint, path
  - Example: route-name=genres, endpoint=genres, path=genres
- Generate multiple routes (services auto-created if missing)

```bash
pnpm gen:routes
```

  - Input: alias:endpoint:path (space-separated)
  - Example: genres:genres:genres movies:movies:movies

Tip: All links below are clickable in GitHub/VS Code.

## What gets generated

Under [services/{entity}](../services/):
- schema.ts (Zod schema, types; imports shared types from [services/api/types.ts](../services/api/types.ts))
- service.ts (CRUD using [services/api/actions.ts](../services/api/actions.ts) + revalidation helpers)
- index.ts (barrel export)

Under [app/(dashboard)/{path}](../app/(dashboard)/):
- layout.tsx, loading.tsx
- page.tsx (uses service get-list)
- columns.tsx (uses ItemType and delete from service)
- components/
  - index.ts
  - create-dialog.tsx, update-dialog.tsx (forms using service schema/types and actions)

## Structure (for reference)

- [fetch-zod-schema/](fetch-zod-schema/)
  - [index.js](fetch-zod-schema/index.js): fetch sample via curl, infer Zod, return endpoint metadata
  - [postman/](fetch-zod-schema/postman/)
    - [postman-collection.json](fetch-zod-schema/postman/postman-collection.json)
    - [postman-data.js](fetch-zod-schema/postman/postman-data.js)
    - [endpoints.js](fetch-zod-schema/postman/endpoints.js)
    - [generated-routes.js](fetch-zod-schema/postman/generated-routes.js)
- [plop-generator/](plop-generator/)
  - [index.js](plop-generator/index.js): defines generators (service, services, route, routes)
  - [route/](plop-generator/route/)
    - [plop-actions.js](plop-generator/route/plop-actions.js)
    - Templates: [layout.tsx.hbs](plop-generator/route/layout.tsx.hbs), [loading.tsx.hbs](plop-generator/route/loading.tsx.hbs), [page.tsx.hbs](plop-generator/route/page.tsx.hbs), [columns.tsx.hbs](plop-generator/route/columns.tsx.hbs)
    - Service templates: [schema.ts.hbs](plop-generator/route/schema.ts.hbs), [services/service.ts.hbs](plop-generator/route/services/service.ts.hbs), [services/index.ts.hbs](plop-generator/route/services/index.ts.hbs)
    - Partials: [hbs-partials/form-items.js](plop-generator/route/hbs-partials/form-items.js), [hbs-partials/endpoint-request.js](plop-generator/route/hbs-partials/endpoint-request.js)

## Generation flow (how it works)

1) Parse Postman collection
- [endpoints.js](fetch-zod-schema/postman/endpoints.js) walks folders and requests, yielding:
  - name (getX, getXDetail, createX, patchXDetail, deleteXDetail)
  - method: GET|POST|PUT|DELETE
  - endpoint: "/path" (+ default query for GET lists)
  - pathList: normalized segments (numeric → {param})
  - base: first path segment (group key)
- [generated-routes.js](fetch-zod-schema/postman/generated-routes.js) lists current folders under [app/(dashboard)](../app/(dashboard)/)

2) Fetch sample + build schema
- [index.js](fetch-zod-schema/index.js):
  - picks a suitable GET list endpoint for the base
  - calls the API via curl (base + token)
  - extracts first item from data[], strips meta, converts to Zod (json-to-zod)
  - returns rawData, dataKeys, zodSchema, endpointList (used by templates)

3) Render templates
- [plop-actions.js](plop-generator/route/plop-actions.js):
  - Service outputs → [services/{entity}](../services/)
  - Route outputs → [app/(dashboard)/{path}](../app/(dashboard)/)
  - Runs Prettier/ESLint if enabled in [config.js](config.js)

## Configuration (details)

Edit [dev-only/config.js](config.js):
- FILMORA_DOMAIN: API base URL
- TOKEN: optional token override (null → use Postman variable)
- POSTMAN_COLLECTION_PATH: path to collection JSON
- CACHE_TTL_SECONDS: schema fetch cache TTL (seconds)
- DEFAULT_PAGE, DEFAULT_PAGE_SIZE: injected defaults for GET list
- DASHBOARD_DIR: dashboard root (default: app/(dashboard))
- SERVICES_DIR: services root (default: services)
- ENABLE_FORMAT/FORMAT_COMMAND, ENABLE_LINT/LINT_COMMAND

## Contracts and assumptions

- List GET: `{ data: T[], total_count: number }`
- Detail GET: `{ data: T }`
- Auth: Bearer token from Postman variables (or TOKEN override)
- GET list accepts `page` and `page_size`; injector uses `?page=1&page_size=1` by default

## Troubleshooting

- No endpoints found
  - Ensure the base group matches the first path segment in Postman
  - Items should be inside folders in the collection
- Empty data error
  - Ensure the GET list returns non-empty `data` array (seed or adjust query)
- 401/403
  - Verify collection token or TOKEN override
- Path conflicts
  - If a route folder exists, adjust path or remove existing files before re-gen
