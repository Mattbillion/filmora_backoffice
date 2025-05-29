const { execSync } = require('child_process');
// const { fetchZodSchema } = require("../../fetch-zod-schema");
const dashboardSrc = '../../app/(dashboard)';
const changeCase = require('change-case-all');

function kebabWithPreservedBrackets(input) {
  return input.replace(/(\[.*?\]|\(.*?\)|[^\/]+)/g, (match) => {
    // If it's a bracketed part, preserve brackets and kebab inner content
    if (match.startsWith('[') && match.endsWith(']')) {
      const inner = match.slice(1, -1);
      return `[${changeCase.kebabCase(inner)}]`;
    }
    if (match.startsWith('(') && match.endsWith(')')) {
      const inner = match.slice(1, -1);
      return `(${changeCase.kebabCase(inner)})`;
    }
    // Else, kebab-case normally
    return changeCase.kebabCase(match);
  });
}

const routeActions = (routeName, endpoint, path) => {
  // const zodSchema = fetchZodSchema(endpoint, routeName);
  const templateData = { 'route-name': routeName, endpoint, path };
  const dirPath = path
    .split('/')
    .map(p => kebabWithPreservedBrackets(p))
    .join('/');
  const directory = `${dashboardSrc}/${dirPath}`;

  return [
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
      path: `${directory}/components/index.ts`,
      templateFile: './route/components/index.ts.hbs',
      data: templateData,
    },
    {
      type: 'fetchSchema',
      path: `${directory}/page.tsx`,
      templateFile: './route/page.tsx.hbs',
      data: templateData,
    },
    {
      type: 'fetchSchema',
      path: `${directory}/actions.ts`,
      templateFile: './route/actions.ts.hbs',
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
      path: `${directory}/columns.tsx`,
      templateFile: './route/columns.tsx.hbs',
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
          `npx prettier --write "app/(dashboard)/${dirPath}"`,
        );

        return 'Formatted with Prettier';
      } catch (error) {
        return 'Failed to format files.';
      }
    },
    () => {
      try {
        execSync(
          `npx eslint --fix "app/(dashboard)/${dirPath}"`,
        );

        return 'ESLint fixes applied successfully';
      } catch (error) {
        return 'Failed to apply ESLint fixes. Check for unresolved lint errors.';
      }
    },
  ];
};

module.exports = { routeActions };
