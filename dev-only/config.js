require('dotenv').config();

const path = require('path');

module.exports = {
  // API & Postman
  // Base URL for API requests
  FILMORA_DOMAIN: process.env.FILMORA_DOMAIN,
  // Optional override for Postman variables.token; leave null to use Postman value
  TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZWJmMzAzNS00M2E4LTQwNjUtYTc4My0xZGQ1N2I0OTZjNjYiLCJyb2xlIjoiZW1wbG95ZWUiLCJleHAiOjE3NTgwOTE1Mjh9.eT_NsvxmkuoK39Il8VAa18AwZjBzAu2fceKUUiOCjwA',
  POSTMAN_COLLECTION_PATH: path.join('dev-only', 'fetch-zod-schema', 'postman', 'postman-collection.json'),

  // Fetching & schema
  // Cache TTL for schema fetcher
  CACHE_TTL_SECONDS: 10,

  // Endpoint & query defaults
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 1,

  // Directories & tools
  // Dashboard root for reading/writing
  DASHBOARD_DIR: path.join('app', '(dashboard)'),
  // Whether to enable formatting and linting on generated files
  ENABLE_FORMAT: true,
  // Prettier command; ensure you have it installed locally or globally
  FORMAT_COMMAND: 'npx prettier --write',
  // Enable ESLint fixing on generated files
  ENABLE_LINT: true,
  // ESLint command; ensure you have it installed locally or globally
  LINT_COMMAND: 'npx eslint --fix',
};

