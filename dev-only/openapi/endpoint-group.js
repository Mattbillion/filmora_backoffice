const changeCase = require('change-case-all');
const {endpointPaths, componentSchemas} = require('./openapi-curl');
const {findValueByKey, openApiToZodString, pointToSchema, modifyRouteParamsWithType} = require('./helpers');

// Group paths by their first segment after /api/v1/dashboard
const pathGroups = Object.entries(endpointPaths)
	.filter(([path]) => path.startsWith('/api/v1/dashboard'))
	.reduce((acc, [path, methods]) => {
		let pathObj = {...acc};
		// Clean the path
		const cleanPath = path
			.replace('/api/v1/dashboard/', '')   // remove prefix
			.replace(/\{[^}]+}/g, '')          // remove path params
			.replace(/\/+/g, '/')               // replace multiple slashes with single slash
			.replace(/\/$/, '');                // remove trailing slash
		const existedPath = pathObj[cleanPath] || [];

		const [root, ...childRoutes] = cleanPath.split('/').filter(Boolean);


		const modifiedMethods = Object.entries(methods).map(([m,r]) => {
			const {pathArgs, queryArg, route} = modifyRouteParamsWithType({...r, route: path.replace('/api/v1/dashboard', '')});
			const methodObj = {
				...r,
				summary: changeCase.camelCase(r.summary),
				route,
				method: changeCase.upperCase(m)
			};

			if(queryArg) methodObj.queryArg = queryArg;
			if(pathArgs) methodObj.pathArgs = pathArgs;

			return methodObj;
		})

		if (childRoutes.length > 0) {
			pathObj[root] = Array.from(new Set([
				...(pathObj[root] || []),
				...modifiedMethods,
			]))
		} else {
			pathObj[cleanPath] = Array.from(new Set([
				...existedPath,
				...modifiedMethods,
			]));
		}

		return pathObj;
	}, {});

// Recursively point to schema for each method
Object.values(pathGroups).forEach((methods) => {
	methods.map((method) => {
		if (method.responses) {
			Object.entries(method.responses).forEach(([status, resp]) => {
				if (Number(status) < 400 && resp.content && resp.content['application/json']) {
					method.schema = pointToSchema(resp.content['application/json'].schema);
				}
			});
		}
		if(method.requestBody) {
			method.bodySchema = pointToSchema(findValueByKey(method.requestBody, 'schema'));
			method.contentType = Object.keys(findValueByKey(method.requestBody, 'content'));
		}
		delete method.requestBody;
		delete method.responses;
		delete method.tags;
		delete method.operationId;
		delete method.security;
		delete method.description;
		delete method.parameters;
	})
});

let dashboardPaths = {};

Object.entries(pathGroups).forEach(([service, method]) => {
	const schemas = Array.from(
		new Set([
				...Object.values(method)
				.map((c) => (
					typeof c.schema === 'string' ?
						c.schema
						:
						undefined
				))
				.filter(Boolean),
			...Object.values(method)
				.map((c) => (
					typeof c.bodySchema === 'string' ?
						c.bodySchema
						:
						undefined
				))
				.filter(Boolean)
		])
	).map(c => ({
		schemaName: changeCase.camelCase(c),
		schemaString: openApiToZodString(componentSchemas[c], componentSchemas, c),
		schemaObject: Object.fromEntries(
			Object.entries(
				findValueByKey(componentSchemas[c] || {}, 'properties')
			).filter(([key]) => !['id', 'created_at', 'updated_at', 'created_employee'].includes(key))
		),
	}))
	dashboardPaths[service] = {
		schemas,
		endpoints: Object.values(method),
	}
})


module.exports = { dashboardPaths }