const { execSync } = require("child_process");
const dashboardSrc = '../../app/(dashboard)';

module.exports = function (
  /** @type {import('plop').NodePlopAPI} */
  plop
) {
  plop.setGenerator("route", {
    description: "Generate a CRUD route",
    prompts: [
      {
        type: "input",
        name: "route-name",
        message: "Enter the route name (e.g., 'company', 'banners'):",

      },
      {
        type: "input",
        name: "endpoint",
        message: "Enter the API endpoint (e.g., 'companies', 'banners'):",
      }
    ],
    actions: [
      {
        type: "add",
        path: `${dashboardSrc}/{{lowerCase route-name}}/actions.ts`,
        templateFile: "./route/actions.ts.hbs"
      },
      {
        type: "add",
        path: `${dashboardSrc}/{{lowerCase route-name}}/columns.tsx`,
        templateFile: "./route/columns.tsx.hbs"
      },
      {
        type: "add",
        path: `${dashboardSrc}/{{lowerCase route-name}}/layout.tsx`,
        templateFile: "./route/layout.tsx.hbs"
      },
      {
        type: "add",
        path: `${dashboardSrc}/{{lowerCase route-name}}/loading.tsx`,
        templateFile: "./route/loading.tsx.hbs"
      },
      {
        type: "add",
        path: `${dashboardSrc}/{{lowerCase route-name}}/page.tsx`,
        templateFile: "./route/page.tsx.hbs"
      },
      {
        type: "add",
        path: `${dashboardSrc}/{{lowerCase route-name}}/schema.ts`,
        templateFile: "./route/schema.ts.hbs"
      },
      {
        type: "add",
        path: `${dashboardSrc}/{{lowerCase route-name}}/components/index.ts`,
        templateFile: "./route/components/index.ts.hbs"
      },
      {
        type: "add",
        path: `${dashboardSrc}/{{lowerCase route-name}}/components/create-dialog.tsx`,
        templateFile: "./route/components/create-dialog.tsx.hbs"
      },
      {
        type: "add",
        path: `${dashboardSrc}/{{lowerCase route-name}}/components/update-dialog.tsx`,
        templateFile: "./route/components/update-dialog.tsx.hbs"
      },
      (answers) => {
        try {
          execSync(`npx prettier --write "app/(dashboard)/${answers["route-name"].toLowerCase()}"`);
          // execSync(`npx eslint --fix ${dir}`);
          return "Formatted with Prettier";
        } catch (error) {
          return "Failed to format files.";
        }
      },
    ],
  });
};