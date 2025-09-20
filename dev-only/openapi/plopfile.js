const changeCase = require('change-case-all');
const fs = require('fs');
const path = require('path');

function loadDashboardPaths() {
  const { dashboardPaths } = require('./endpoint-group');
  return dashboardPaths;
}

const dashboardPaths = loadDashboardPaths();

module.exports = function (plop) {
  // helpers
  plop.setHelper('eq', (a, b) => String(a) === String(b));
  plop.setHelper('or', (a, b) => a || b);
  plop.setHelper('pascalCase', (s) => changeCase.pascalCase(String(s || '')));
  plop.setHelper('camelCase', (s) => changeCase.camelCase(String(s || '')));
  plop.setHelper('kebabCase', (s) => changeCase.paramCase(String(s || '')));
  plop.setHelper('constantCase', (s) => changeCase.constantCase(String(s || '')));

  function pickContentType(arr) {
    if (!arr || !Array.isArray(arr) || !arr.length) return undefined;
    return String(arr[0]);
  }

  function findTypeNameForRef(service, refName) {
    if (!refName) return undefined;
    const camel = changeCase.camelCase(refName);
    const typeName = changeCase.pascalCase(camel);
    // Ensure it exists in schemas; if not, still return for external/global refs
    return typeName;
  }

  function buildEndpoints(service) {
    const svc = dashboardPaths[service];
    const usedNames = new Set();

    return (svc.endpoints || []).map((ep) => {
      const method = ep.method.toLowerCase();
      const route = ep.route; // starts with '/'
      const contentType = pickContentType(ep.contentType);

      // function name from summary or fallback
      let baseName = ep.summary ? changeCase.camelCase(ep.summary) : `${method} ${route}`;
      baseName = changeCase.camelCase(baseName.replace(/[^a-zA-Z0-9]+/g, ' '));
      let fnName = baseName;
      let i = 2;
      while (usedNames.has(fnName)) {
        fnName = `${baseName}${i++}`;
      }
      usedNames.add(fnName);

      // detail tag param (first path param)
      const m = route.match(/\{([^}]+)\}/);
      const detailTag = m ? m[1] : undefined;

      const bodyTypeName = findTypeNameForRef(service, ep.bodySchema);
      const responseTypeName = findTypeNameForRef(service, ep.schema);
      const shouldRevalidate = method !== 'get';

      return {
        fnName,
        route,
        method,
        contentType: contentType || '',
        detailTag,
        bodyTypeName,
        responseTypeName,
        shouldRevalidate,
      };
    });
  }

  plop.setGenerator('get-openapi-services', {
    description: 'Generate API services from OpenAPI (dashboardPaths) without prompts',
    prompts: [],
    actions: function () {
      const services = Object.keys(dashboardPaths);
      const actions = [];

      services.forEach((service) => {
        const data = {
          service,
          rvkConst: changeCase.constantCase(service),
          schemas: dashboardPaths[service].schema,
          endpointList: buildEndpoints(service),
        };

        actions.push({
          type: 'add',
          path: `services/api/${service}/schema.ts`,
          templateFile: 'dev-only/openapi/services/schema.ts.hbs',
          data,
          force: true,
        });
        actions.push({
          type: 'add',
          path: `services/api/${service}/service.ts`,
          templateFile: 'dev-only/openapi/services/service.ts.hbs',
          data,
          force: true,
        });
        actions.push({
          type: 'add',
          path: `services/api/${service}/index.ts`,
          templateFile: 'dev-only/openapi/services/index.ts.hbs',
          data,
          force: true,
        });
      });

      return actions;
    },
  });
};