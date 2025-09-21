const changeCase = require('change-case-all');
const {execSync} = require("child_process");

function loadDashboardPaths() {
  const { dashboardPaths } = require('./endpoint-group');
  return dashboardPaths;
}

function loadSchemas() {
  const { schemas } = require('./endpoint-group');
  return schemas;
}

const dashboardPaths = loadDashboardPaths();
const schemas = loadSchemas();

const execEslint = (service) => {
  try {
    execSync(`npx eslint --fix "services/${service}.ts"`);

    return `ESLint fixes applied successfully: "services/${service}.ts"`;
  } catch (error) {
    return `"services/${service}.ts" Failed to apply ESLint fixes. Check for unresolved lint errors.`;
  }
}
const execPrettier = (service) => {
  try {
    execSync(
      `npx prettier --write "services/${service}.ts"`,
    );

    return `Formatted with Prettier: services/${service}.ts`;
  } catch (error) {
    return `Failed to format "services/${service}.ts"`;
  }
}

module.exports = function (plop) {
  // helpers
  plop.setHelper('eq', (a, b) => String(a) === String(b));
  plop.setHelper('or', (a, b) => a || b);
  plop.setHelper('pascalCase', (s) => changeCase.pascalCase(String(s || '')));
  plop.setHelper('camelCase', (s) => changeCase.camelCase(String(s || '')));
  plop.setHelper('kebabCase', (s) => changeCase.paramCase(String(s || '')));
  plop.setHelper('constantCase', (s) => changeCase.constantCase(String(s || '')));

  plop.setGenerator('gen-openapi-services', {
    description: 'Generate API services from OpenAPI (dashboardPaths) without prompts',
    prompts: [],
    actions: function () {
      const services = Object.keys(dashboardPaths);
      const actions = [
        {
          type: 'add',
          path: `../../services/rvk.ts`,
          templateFile: './services/rvk.ts.hbs',
          data: { revalidationKeys: services },
          force: true,
        },
        () => execPrettier('rvk'),
        () => execEslint('rvk')
      ];

      services.forEach((service) => {
        const serviceSchemaImports = Array.from(
          new Set(
            dashboardPaths[service].endpoints
              .map((endpoint) => endpoint.schemaImports)
              // Joining "comma,seperated,string" by comma to avoid nested arrays after flat
              .join(', ')
              // Resplitting by comma and filtering out empty strings
              .split(',')
              .filter(Boolean)
          )
        )
        const data = {
          service,
          rvkConst: changeCase.constantCase(service),
          schemas: dashboardPaths[service].schemas,
          endpointList: dashboardPaths[service].endpoints.map(endpoint => ({
            ...endpoint,
            shouldRevalidate: endpoint.method?.toLowerCase() !== 'get' && endpoint.pathArgs,
            detailTag: endpoint.pathArgs?.split(',')
              .map((arg) => {
                const argName = arg.split(':')[0];
                return argName + '_' + '$' + '{' + `${argName}}`
              }) || []
          })),
          isFormData: dashboardPaths[service].contentType?.includes('form-data'),
          schemaImports: serviceSchemaImports
        };

        // actions.push({
        //   type: 'add',
        //   path: `../../services/${service}/index.ts`,
        //   templateFile: './services/index.ts.hbs',
        //   force: true,
        // });
        // actions.push({
        //   type: 'add',
        //   path: `../../services/${service}/schema.ts`,
        //   templateFile: './services/schema.ts.hbs',
        //   data,
        //   force: true,
        // });
        actions.push({
          type: 'add',
          path: `../../services/${service}.ts`,
          templateFile: './services/service.ts.hbs',
          data,
          force: true,
        });
        actions.push(() => execPrettier(service));
        actions.push(() => execEslint(service));
      });

      actions.push(...[
        {
          type: 'add',
          path: `../../services/schema.ts`,
          templateFile: './services/schema.ts.hbs',
          data: { schemas },
          force: true,
        },
        () => execPrettier('schema'),
        () => execEslint('schema')
      ])

      return actions;
    },
  });
};