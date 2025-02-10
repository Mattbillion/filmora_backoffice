// const { execSync } = require("child_process");
const {routeActions} = require("./route/plop-actions");
const {fetchZodSchema} = require("../fetch-zod-schema");
// const dashboardSrc = '../../app/(dashboard)';
const fs = require('fs');
const path = require('path');

module.exports = function (
  /** @type {import('plop').NodePlopAPI} */
  plop
) {
  plop.setActionType('fetchSchema', async function (answers, config, plop) {
    const { templateFile, path: outputPath } = config;

    const zodSchema = fetchZodSchema(answers.endpoint, answers['route-name']);

    const template = fs.readFileSync(path.resolve(__dirname, templateFile), 'utf8');

    const rendered = plop.renderString(template, { ...answers, zodSchema });

    fs.writeFileSync(path.resolve(__dirname, outputPath), rendered);

    return `Generated file at ${outputPath} \n schema: ${zodSchema}`;
  });

  plop.setGenerator("route", {
    description: "Generate a next.js route with actions, schema, page, layout, loading, create-dialog.tsx, update-dialog.tsx",
    prompts: [
      {
        type: "input",
        name: "route-name",
        message: "Enter the route alias (e.g., 'company', 'banners', company/[id] as companyDetail):",
      },
      {
        type: "input",
        name: "endpoint",
        message: "Enter the API endpoint (e.g., 'companies', 'banners'):",
      },
      {
        type: "input",
        name: "path",
        message: "Enter the path (e.g., 'companies', 'banners', 'company/[id]'):"
      }
    ],
    actions: (data) => routeActions(data['route-name'], data['endpoint'], data['path']),
  });
  plop.setGenerator("routes", {
    description: "Generate multiple next.js routes with actions, schema, page, layout, loading, create-dialog.tsx, update-dialog.tsx",
    prompts: [
      {
        type: "input",
        name: "routes",
        message: "Enter the routes in the format 'alias:endpoint:path' (e.g., 'company:companies:company companyDetail:company:company/[id] banner:banners:banner category:category:cats'):",
      }
    ],
    actions: (data) => {
      const routeArray = data?.routes?.split(" ");

      const actions = [];
      for (const route of routeArray) {
        const [routeName, endpoint, path] = route.split(":");

        if (!routeName || !endpoint || !path) {
          actions.push({
            type: "abort",
            message: `Invalid route format: '${route}'. Please provide the input in the alias:endpoint:path format.`
          });
          continue;
        }

        actions.push(...routeActions(routeName, endpoint, path));
      }

      return actions;
    }
  });
};