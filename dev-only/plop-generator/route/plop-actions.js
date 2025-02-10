const { execSync } = require('child_process');
// const { fetchZodSchema } = require("../../fetch-zod-schema");
const dashboardSrc = '../../app/(dashboard)';
const changeCase = require('change-case-all');

const routeActions = (routeName, endpoint, path) => {
  // const zodSchema = fetchZodSchema(endpoint, routeName);
  const templateData = { 'route-name': routeName, endpoint, path };
  const directory = `${dashboardSrc}/${changeCase.kebabCase(path)}`;

  return [
    {
      type: 'add',
      path: `${directory}/actions.ts`,
      templateFile: './route/actions.ts.hbs',
      data: templateData,
    },
    {
      type: 'add',
      path: `${directory}/columns.tsx`,
      templateFile: './route/columns.tsx.hbs',
      data: templateData,
    },
    {
      type: 'add',
      path: `${directory}/layout.tsx`,
      templateFile: './route/layout.tsx.hbs',
      data: templateData,
    },
    {
      type: 'add',
      path: `${directory}/loading.tsx`,
      templateFile: './route/loading.tsx.hbs',
      data: templateData,
    },
    {
      type: 'add',
      path: `${directory}/page.tsx`,
      templateFile: './route/page.tsx.hbs',
      data: templateData,
    },
    {
      type: 'add',
      path: `${directory}/components/index.ts`,
      templateFile: './route/components/index.ts.hbs',
      data: templateData,
    },
    {
      type: 'fetchSchema',
      path: `${directory}/schema.ts`,
      templateFile: './route/schema.ts.hbs',
      data: templateData,
    },
    {
      type: 'fetchSchema',
      path: `${directory}/components/create-dialog.tsx`,
      templateFile: './route/components/create-dialog.tsx.hbs',
      data: templateData,
    },
    {
      type: 'fetchSchema',
      path: `${directory}/components/update-dialog.tsx`,
      templateFile: './route/components/update-dialog.tsx.hbs',
      data: templateData,
    },
    () => {
      try {
        execSync(
          `npx prettier --write "app/(dashboard)/${changeCase.kebabCase(path)}"`,
        );
        // execSync(`npx eslint --fix ${dir}`);
        return 'Formatted with Prettier';
      } catch (error) {
        return 'Failed to format files.';
      }
    },
  ];
};

module.exports = { routeActions };
