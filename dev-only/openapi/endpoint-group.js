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
					const methodSchema = pointToSchema(resp.content['application/json'].schema);
					method.schema = methodSchema;
					const schemaImports = new Set([]);

					function addImportsFromSchema(schemaName) {
						if(!schemaImports.has(schemaName)) schemaImports.add(changeCase.camelCase(schemaName));
						const nestedRef = findValueByKey(componentSchemas[schemaName], '$ref')?.replace("#/components/schemas/", "");
						if(nestedRef) addImportsFromSchema(nestedRef);
					}

					if(typeof methodSchema === 'string') addImportsFromSchema(methodSchema);

					method.schemaImports = Array.from(schemaImports).map(c => c + 'Schema');
				}
			});
		}
		if(method.requestBody) {
			method.bodySchema = pointToSchema(findValueByKey(method.requestBody, 'schema'));
			method.contentType = Object.keys(findValueByKey(method.requestBody, 'content'))[0];
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

Object.entries(pathGroups).forEach(([service, methods]) => {
	const schemas = new Set();

	function addToSchemas(schemaName) {
		const key = changeCase.camelCase(schemaName);
		if(!schemas.has(key)) {
			const schemaObject = componentSchemas[schemaName] || {};


			const schemaRef = findValueByKey(schemaObject, '$ref');
			if (schemaRef) addToSchemas(schemaRef.replace("#/components/schemas/", ""));

			schemas.add({
				schemaName: key + 'Schema',
				schemaTypeName: changeCase.pascalCase(key) + 'Type',
				schemaString: openApiToZodString(componentSchemas[schemaName]),
				schemaObject,
				schemaEntries:
					Object.keys(findValueByKey(schemaObject, 'properties') || {})
						.filter((k) => !['id', 'created_at', 'updated_at', 'created_employee'].includes(k))
			});
		}
	}

	Object.values(methods).forEach(method => {
		if(typeof method.schema === 'string') {
			addToSchemas(method.schema)
		}
		if(typeof method.schema === 'object' && !!method.schema) schemas.add(method.schema)
		if(typeof method.bodySchema === 'object' && !!method.bodySchema) schemas.add(method.bodySchema)

		if(typeof method.bodySchema === 'string') {
			addToSchemas(method.bodySchema)
		}
	})

	dashboardPaths[service] = {
		schemas: Array.from(schemas),
		endpoints: Object.values(methods),
	}
})

/**
 *
 * @return {{dashboardPaths: {
 *   [x: string]: {
 *     schemas: {schemaName: string, schemaTypeName: string, schemaString: string, schemaObject: object, schemaEntries: [string, string][]}[],
 *     endpoints: {summary: string, route: string, method: string, schema?: string, bodySchema?: string, contentType?: string, pathArgs?: string, queryArg?: string, schemaImports: string[]}[]
 *   }
 * }} An object containing grouped dashboard paths with their schemas and endpoints.
* */
module.exports = { dashboardPaths }