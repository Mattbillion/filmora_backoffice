// const { execSync } = require("child_process");
const { routeActions } = require('./route/plop-actions');
const { fetchZodSchema } = require('../fetch-zod-schema');
const {registerFormPartials} = require('./route/hbs-partials/form-items');
// const dashboardSrc = '../../app/(dashboard)';
const fs = require('fs');
const path = require('path');
const {endpointRequestPartials, endpointRequestHelpers} = require("./route/hbs-partials/endpoint-request");

module.exports = function (
  /** @type {import('plop').NodePlopAPI} */
  plop,
) {
  plop.setHelper('isBoolean', (value) => typeof value === 'boolean');
  plop.setHelper('isNumber', (value) => typeof value === 'number');
  plop.setHelper('isString', (value) => typeof value === 'string');
  plop.setHelper('containsDesc', (key) => {
    const v = String(key).toLowerCase();
    return typeof v === 'string' && (v.includes('desc') || v.includes('body'));
  });
  plop.setHelper('isImage', (value) => typeof value === 'string' && ['.jpg', '.jpeg', '.png', '.webp'].some(ext => value.toLowerCase().endsWith(ext)));
  plop.setHelper('isID', (key) => String(key).toLowerCase().endsWith('_id'));
  plop.setHelper('isCurrency', (key) => /(price|sale)/g.test(key));
  plop.setHelper('isArray', (value) => Array.isArray(value));
  plop.setHelper('canFetchData', (dataKeys = []) => dataKeys.some(c => c.endsWith('_id')));
  plop.setHelper('getNameField', (dataKeys = []) => dataKeys.find(c => c.includes('_name') || c.includes('title')));
  plop.setHelper('canSort', (key, value) => {
    const isImage = typeof value === 'string' && ['.jpg', '.jpeg', '.png', '.webp'].some(ext => value.toLowerCase().endsWith(ext));
    const isHtml = typeof key === 'string' && (key.includes('desc') || key.includes('body'));
    const isBool = typeof value === 'boolean';
    const isArray = Array.isArray(value);

    return !isImage && !isHtml && !isBool && !isArray;
  });
  plop.setHelper('canFilter', (key, value) => {
    const isImage = typeof value === 'string' && ['.jpg', '.jpeg', '.png', '.webp'].some(ext => value.toLowerCase().endsWith(ext));
    const isHtml = typeof key === 'string' && (key.includes('desc') || key.includes('body'));
    const isArray = Array.isArray(value);

    return !isImage && !isHtml && !isArray;
  });
  registerFormPartials(plop);
  endpointRequestPartials(plop);
  endpointRequestHelpers(plop);

  plop.setActionType('fetchSchema', async function (answers, config, plop) {
    const { templateFile, path: outputPath } = config;

    const { rawData, schema: zodSchema, dataKeys, endpointList } = fetchZodSchema(
      answers.endpoint,
      answers['route-name'],
    );

    const template = fs.readFileSync(
      path.resolve(__dirname, templateFile),
      'utf8',
    );

    const rendered = plop.renderString(template, {
      ...answers,
      zodSchema,
      rawData,
      dataKeys,
      endpointList
    });

    fs.writeFileSync(path.resolve(__dirname, outputPath), rendered);

    return `Generated file at ${outputPath} \n schema: ${zodSchema}`;
  });

  plop.setGenerator('route', {
    description:
      'Generate a next.js route with actions, schema, page, layout, loading, create-dialog.tsx, update-dialog.tsx',
    prompts: [
      {
        type: 'input',
        name: 'route-name',
        message:
          "Enter the route alias (e.g., 'company', 'banners', company/[id] as companyDetail):",
      },
      {
        type: 'input',
        name: 'endpoint',
        message: "Enter the API endpoint (e.g., 'companies', 'banners'):",
      },
      {
        type: 'input',
        name: 'path',
        message:
          "Enter the path (e.g., 'companies', 'banners', 'company/[id]'):",
      },
    ],
    actions: (data) =>
      routeActions(data['route-name'], data['endpoint'], data['path']),
  });
  plop.setGenerator('routes', {
    description:
      'Generate multiple next.js routes with actions, schema, page, layout, loading, create-dialog.tsx, update-dialog.tsx',
    prompts: [
      {
        type: 'input',
        name: 'routes',
        message:
          "Enter the routes in the format 'alias:endpoint:path' (e.g., 'company:companies:company companyDetail:company:company/[id] banner:banners:banner category:category:cats'):",
      },
    ],
    actions: (data) => {
      const routeArray = data?.routes?.split(' ');

      const actions = [];
      for (const route of routeArray) {
        const [routeName, endpoint, path] = route.split(':');

        if (!routeName || !endpoint || !path) {
          actions.push({
            type: 'abort',
            message: `Invalid route format: '${route}'. Please provide the input in the alias:endpoint:path format.`,
          });
          continue;
        }

        actions.push(...routeActions(routeName, endpoint, path));
      }

      return actions;
    },
  });
};
