const { execSync } = require('child_process');
const path = require('path');
const config = require('../../config');
const changeCase = require('change-case-all');

function kebabWithPreservedBrackets(input) {
  return input.replace(/(\[[^\]]*]|\([^)]*\)|[^\/]+)/g, (match) => {
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

function executePrettier(baseDir, dir) {
  try {
    if (config.ENABLE_FORMAT) {
      execSync(
        `${config.FORMAT_COMMAND} "${path.posix.join(baseDir.replace(/\\/g, '/'), dir)}"`,
      );
    }
    return 'Formatted with Prettier:' + dir;
  } catch (error) {
    return 'Failed to format files:' + dir;
  }
}

function executeESLint(baseDir, dir) {
  try {
    if (config.ENABLE_LINT) {
      execSync(
        `${config.LINT_COMMAND} "${path.posix.join(baseDir.replace(/\\/g, '/'), dir)}"`,
      );
    }
    return 'ESLint fixes applied:' + dir;
  } catch (error) {
    return 'Failed to apply ESLint fixes:.' + dir;
  }
}

const computePaths = (routeName, pathStr) => {
  const dashboardBaseRelToPlop = path.relative(
    path.resolve(__dirname, '..'),
    path.resolve(process.cwd(), config.DASHBOARD_DIR),
  );
  const servicesBaseRelToPlop = path.relative(
    path.resolve(__dirname, '..'),
    path.resolve(process.cwd(), config.SERVICES_DIR),
  );
  const dirPath = pathStr
    .split('/')
    .map((p) => kebabWithPreservedBrackets(p))
    .join('/');
  const directory = `${dashboardBaseRelToPlop}/${dirPath}`;
  const serviceDir = `${servicesBaseRelToPlop}/${changeCase.kebabCase(routeName)}`;
  return { dashboardBaseRelToPlop, servicesBaseRelToPlop, dirPath, directory, serviceDir };
};

const serviceActions = (routeName, endpoint) => {
  const { serviceDir } = computePaths(routeName, routeName);
  const templateData = { 'route-name': routeName, endpoint, path: routeName };

  return [
    {
      type: 'fetchSchema',
      path: `${serviceDir}/schema.ts`,
      templateFile: './route/services/schema.ts.hbs',
      data: templateData,
    },
    {
      type: 'fetchSchema',
      path: `${serviceDir}/service.ts`,
      templateFile: './route/services/service.ts.hbs',
      data: templateData,
    },
    {
      type: 'add',
      path: `${serviceDir}/index.ts`,
      templateFile: './route/services/index.ts.hbs',
      data: templateData,
    },
    () => executePrettier(config.SERVICES_DIR,changeCase.kebabCase(routeName)),
    () => executeESLint(config.SERVICES_DIR,changeCase.kebabCase(routeName)),
  ];
};

const routeActions = (routeName, endpoint, pathStr) => {
  const templateData = { 'route-name': routeName, endpoint, path: pathStr };
  const { dirPath, directory } = computePaths(routeName, pathStr);

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
    () => executePrettier(config.DASHBOARD_DIR,dirPath),
    () => executeESLint(config.DASHBOARD_DIR,dirPath),
  ];
};

module.exports = { routeActions, serviceActions, computePaths };
