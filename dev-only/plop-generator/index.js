const { routeActions, serviceActions, computePaths } = require('./route/plop-actions');
const { fetchZodSchema } = require('../fetch-zod-schema');
const {registerFormPartials} = require('./route/hbs-partials/form-items');
const fs = require('fs');
const path = require('path');
const { endpointRequestPartials, endpointRequestHelpers } = require("./route/hbs-partials/endpoint-request");

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
  plop.setHelper('getNameField', (dataKeys = []) => dataKeys.find(c => c.includes('_name') || c.includes('title')) || dataKeys[0] || 'no_name');
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

    const absOut = path.resolve(__dirname, outputPath);
    fs.mkdirSync(path.dirname(absOut), { recursive: true });
    fs.writeFileSync(absOut, rendered);

    return `Generated file at ${outputPath} \n schema: ${zodSchema}`;
  });

  // Route generator that auto-creates service if missing
  plop.setGenerator('route', {
    description:
      'Generate a Next.js route (page, columns, layout, loading, dialogs). Auto-generates service if missing.',
    prompts: [
      { type: 'input', name: 'route-name', message: "Enter the route alias (e.g., 'genres'):" },
      { type: 'input', name: 'endpoint', message: "Enter the API endpoint base (e.g., 'genres'):" },
      { type: 'input', name: 'path', message: "Enter the dashboard path (e.g., 'genres' or 'genres/[id]'):" },
    ],
    actions: (data) => {
      const routeName = data['route-name'];
      const endpoint = data['endpoint'];
      const pathStr = data['path'];

      // Check if service exists
      const { serviceDir } = computePaths(routeName, routeName);
      const absServiceDir = path.resolve(__dirname, serviceDir);
      const serviceExists = fs.existsSync(absServiceDir) && fs.existsSync(path.join(absServiceDir, 'service.ts')) && fs.existsSync(path.join(absServiceDir, 'schema.ts'));

      const actions = [];
      if (!serviceExists) {
        actions.push(...serviceActions(routeName, endpoint));
      }
      actions.push(...routeActions(routeName, endpoint, pathStr));
      return actions;
    },
  });
};
