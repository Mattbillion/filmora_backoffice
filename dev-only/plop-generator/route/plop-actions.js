const { execSync } = require('child_process');
const path = require('path');
const config = require('../../config');
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

const routeActions = (routeName, endpoint, pathStr) => {
  const templateData = { 'route-name': routeName, endpoint, path: pathStr };

  // Compute dashboard base path relative to dev-only/plop-generator (index.js resolves outputs relative to its __dirname)
  const dashboardBaseRelToPlop = path.relative(
    path.resolve(__dirname, '..'),
    path.resolve(process.cwd(), config.DASHBOARD_DIR),
  );

  const dirPath = pathStr
    .split('/')
    .map(p => kebabWithPreservedBrackets(p))
    .join('/');
  const directory = `${dashboardBaseRelToPlop}/${dirPath}`;

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
        if (config.ENABLE_FORMAT) {
          execSync(
            `${config.FORMAT_COMMAND} "${path.posix.join(config.DASHBOARD_DIR.replace(/\\/g, '/'), dirPath)}"`,
          );
        }
        return 'Formatted with Prettier';
      } catch (error) {
        return 'Failed to format files.';
      }
    },
    () => {
      try {
        if (config.ENABLE_LINT) {
          execSync(
            `${config.LINT_COMMAND} "${path.posix.join(config.DASHBOARD_DIR.replace(/\\/g, '/'), dirPath)}"`,
          );
        }
        return 'ESLint fixes applied successfully';
      } catch (error) {
        return 'Failed to apply ESLint fixes. Check for unresolved lint errors.';
      }
    },
  ];
};

module.exports = { routeActions };
