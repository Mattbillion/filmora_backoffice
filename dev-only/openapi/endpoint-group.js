const changeCase = require('change-case-all');
const {endpointPaths, componentSchemas} = require('./openapi-curl');

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

		if (childRoutes.length > 0) {
			pathObj[root] = Array.from(new Set([
				...(pathObj[root] || []),
				...Object.entries(methods).map(([m,r]) => (
					{
						...r,
						summary: changeCase.camelCase(r.summary),
						route: path.replace('/api/v1/dashboard', ''),
						method: m
					}
				)),
			]))
		} else {
			pathObj[cleanPath] = Array.from(new Set([
				...existedPath,
				...Object.entries(methods).map(([m,r]) => (
					{
						...r,
						summary: changeCase.camelCase(r.summary),
						route: path.replace('/api/v1/dashboard', ''),
						method: m
					}
				)),
			]));
		}

		return pathObj;
	}, {});

// Recursive function to find a key in a nested object
function findValueByKey(obj, targetKey) {
	if (obj === null || typeof obj !== "object") return undefined;

	if (targetKey in obj) {
		return obj[targetKey];
	}

	for (const key in obj) {
		if (typeof obj[key] === "object") {
			const found = findValueByKey(obj[key], targetKey);
			if (found !== undefined) {
				return found;
			}
		}
	}

	return undefined;
}

// Function to resolve $ref to actual schema or return the ref name
const pointToSchema = (schema) => {
	if (!schema) return {};

	const schemaRef = findValueByKey(schema, '$ref');
	if (schemaRef) {
		const refName = schemaRef.replace("#/components/schemas/", "");
		const sch = componentSchemas[refName] || {};

		if(findValueByKey(sch, '$ref'))
			return pointToSchema(componentSchemas[refName] || {});
		return refName;
	}

	return schema;
}

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
	)
	dashboardPaths[service] = {
		schemas,
		endpoints: Object.values(method),
	}
})


module.exports = { dashboardPaths }