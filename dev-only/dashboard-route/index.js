const fs = require('fs');
const path = require('path');
const changeCase = require('change-case');
const {findValueByKey} = require("../openapi/helpers");
const {execSync} = require("child_process");

const loadDashboardPaths = () => {
	try {
		const { dashboardPaths } = require('../openapi/endpoint-group');
		return dashboardPaths;
	} catch (error) {
		console.error('Error loading dashboard paths:', error);
		return {};
	}
};

const loadServiceSchema = () => {
	try {
		const { schemas } = require('../openapi/endpoint-group');
		return schemas;
	} catch (error) {
		console.error('Error loading schemas:', error);
		return {};
	}
};

const dashboardPaths = loadDashboardPaths();
const schemas = loadServiceSchema();

function categorizeEndpoints(endpoints) {
	const result = {
		list: [],
		detail: [],
		create: [],
		update: [],
		remove: [],
	};

	endpoints.forEach((ep) => {
		const name = ep.summary.toLowerCase();

		if (name.startsWith("get") && ep.method.toLowerCase() === "get") {
			// If route has params, assume detail, else list
			if (!ep.schema.toLowerCase().includes("list")) {
				result.detail.push(ep);
			} else {
				result.list.push(ep);
			}
		} else if (name.includes("create") || ep.method.toLowerCase() === "post") {
			result.create.push(ep);
		} else if (name.includes("update") || ep.method.toLowerCase() === "put") {
			result.update.push(ep);
		} else if (name.includes("delete") || ep.method.toLowerCase() === "destroy") {
			result.remove.push(ep);
		} else {
			// fallback: log unknown
			console.warn("Unknown endpoint type:", JSON.stringify(ep));
		}
	});

	return result;
}

function getEndpointLastSchema(endpoint = {}) {
	const {schemaTypeName} = endpoint;
	const schema = schemas.find(c => c.schemaTypeName === schemaTypeName + 'Type');

	function findSchemaRecursive(schemaObj) {
		const schemaRef = changeCase.pascalCase(findValueByKey(schemaObj, '$ref')?.replace('#/components/schemas/', '') || '');
		if (schemaRef) {
			const sch = schemas.find(c => c.schemaTypeName === schemaRef + 'Type');
			const nestedRefName = changeCase.pascalCase(findValueByKey(sch, '$ref')?.replace('#/components/schemas/', '') || '');
			if(nestedRefName) return findSchemaRecursive(sch);
			return sch;
		}
		return schemaObj;
	}

	return findSchemaRecursive(schema);
}

function getEndpointSchemaFields(schema = {}) {
	return Object.entries(schema?.schemaObject?.properties || {}).map(([field,value]) => {
		const val = (value.anyOf || value.oneOf || value.allOf || [value])[0];

		function handleVal() {
			if(findValueByKey(val, 'items')) return 'array';
			if(findValueByKey(val, '$ref')) return 'ref';
			return val.format || val.type || 'string';
		}

		return {
			field,
			type: handleVal()
		}
	});
}


const execEslint = (service) => {
	try {
		console.log('eslint dir:', path.posix.join(path.join('app', '(dashboard)'), service, '**').replace(/\\/g, '/'))
		execSync(`npx eslint --fix "${path.posix.join(path.join('app', '(dashboard)'), service, '**').replace(/\\/g, '/')}"`);

		return `ESLint fixes applied successfully: "app/(dashboard)/${service}/**"`;
	} catch (error) {
		return `"app/(dashboard)/${service}/**" Failed to apply ESLint fixes. Check for unresolved lint errors.`;
	}
}
const execPrettier = (service) => {
	try {
		console.log('prettier dir:', path.posix.join(path.join('app', '(dashboard)'), service).replace(/\\/g, '/'))
		execSync(
			`npx prettier --write "${path.posix.join(path.join('app', '(dashboard)'), service).replace(/\\/g, '/')}"`,
		);

		return `Formatted with Prettier: app/(dashboard)/${service}/**`;
	} catch (error) {
		return `Failed to format "app/(dashboard)/${service}/**"` + String(error.message);
	}
}

module.exports = function (
	/** @type {import('plop').NodePlopAPI} */
	plop,
) {

	plop.setHelper('eq', (a, b) => String(a) === String(b));
	plop.setHelper('or', (a, b) => a || b);
	plop.setHelper('and', (a, b) => a && b);
	plop.setHelper('pascalCase', (s) => changeCase.pascalCase(String(s || '')));
	plop.setHelper('camelCase', (s) => changeCase.camelCase(String(s || '')));
	plop.setHelper('kebabCase', (s) => changeCase.paramCase(String(s || '')));
	plop.setHelper('constantCase', (s) => changeCase.constantCase(String(s || '')));
	plop.setHelper('containsDesc', (key) => {
		const v = String(key).toLowerCase();
		return typeof v === 'string' && (v.includes('desc') || v.includes('body'));
	});
	plop.setHelper('isImage', (key) => typeof key === 'string' && ['img', 'image', 'post','bann'].some(ext => key.toLowerCase().includes(ext)));
	plop.setHelper('isID', (key) => String(key).toLowerCase().includes('_id'));
	plop.setHelper('isCurrency', (key) => /(price|sale|total)/g.test(key));
	plop.setHelper('isArray', (value) => Array.isArray(value));
	plop.setHelper('canFetchData', (dataKeys = []) => dataKeys.some(c => c.endsWith('_id')));
	plop.setHelper('getNameField', (dataKeys = []) => dataKeys.find(c => c.includes('_name') || c.includes('title')) || dataKeys[0] || 'no_name');
	plop.setHelper('canSort', (key, value) => {
		const isImage = typeof value === 'string' && ['.jpg', '.jpeg', '.png', '.webp'].some(ext => value.toLowerCase().endsWith(ext));
		const isHtml = typeof key === 'string' && (key.includes('desc') || key.includes('body'));
		const isBool = typeof value === 'boolean';
		const isArray = Array.isArray(value);

		return !isImage && !isHtml && !isBool && !isArray;
	});
	plop.setHelper('canFilter', (key, value) => {
		const isImage = typeof value === 'string' && ['.jpg', '.jpeg', '.png', '.webp'].some(ext => value.toLowerCase().endsWith(ext));
		const isHtml = typeof key === 'string' && (key.includes('desc') || key.includes('body'));
		const isArray = Array.isArray(value);

		return !isImage && !isHtml && !isArray;
	});
	plop.setHelper('getEndpointLastSchema', getEndpointLastSchema);
	plop.setHelper('getEndpointSchemaFields', (endpoint) => getEndpointLastSchema(getEndpointLastSchema(endpoint)));

	plop.setGenerator('route', {
		description:
			'Generate a Next.js route (page, columns, layout, loading, dialogs).',
		prompts: [
			{
				type: 'rawlist',
				name: 'service',
				message: "Select service:",
				choices: () => Object.keys(
					Object.fromEntries(
						Object.entries(dashboardPaths)
							.filter(([serviceName,service]) => service.endpoints?.find(endpoint => endpoint.method === 'get'))
					)
				)
			},
			{
				type: 'rawlist',
				name: 'pathType',
				message: () => `Select path type:`,
				choices: (answers) => {
					const endpoints = dashboardPaths[answers.service].endpoints.filter(endpoint => endpoint.method === 'get');
					const options = [
						{value: 'all-in-one', name: 'All-in-one: create, update, delete operations will be done in a sheet or modal.', short: 'All-in-one' },
					];
					if(endpoints.length > 0){
						options.push({value: 'detailed', name: 'Detailed: create, update, delete operations will be done in separate pages.', short: 'Detailed' })
					}
					return options;
				}
			},
		],
		actions: (answers) => {
			const {service, pathType} = answers;
			const rawEndpoints = dashboardPaths[service].endpoints;
			const categorizedEndpoints = categorizeEndpoints(rawEndpoints);

			const serviceSchemaImports = rawEndpoints.map(endpoint => endpoint.schemaImports).join(', ').split(',')
			const serviceSchemas = serviceSchemaImports.map(
				(schemaName) => schemas.find(
					(schema) => schema.schemaName === schemaName.trim() || schema.schemaTypeName === schemaName.trim()
				)
			)
				.filter(Boolean)
				.map((schema) => {
					let c = {...schema};
					delete c.schemaEntries;
					delete c.schemaString;
					c.schemaObject = schema.schemaObject.properties;
					return c;
				});

			console.log('\n serviceSchemas \n',JSON.stringify(serviceSchemas), '\n\n\n');
			console.log('\n serviceSchemaImports \n',JSON.stringify(serviceSchemaImports), '\n\n\n');
			console.log('\n rawEndpoints \n',JSON.stringify(rawEndpoints), '\n\n\n');
			console.log('\n categorizedEndpoints \n',JSON.stringify(categorizedEndpoints), '\n\n\n');
			console.log('\n getEndpointSchemaFields \n',JSON.stringify(getEndpointSchemaFields(categorizedEndpoints.list[0])), '\n\n\n');


			const data = {
				service,
				endpoints: categorizedEndpoints,
				pathType,
				columnFields: getEndpointSchemaFields(getEndpointLastSchema(categorizedEndpoints.list[0])),
				columnSchema: getEndpointLastSchema(categorizedEndpoints.list[0])
			}

			const actions = [
				{
					type: 'add',
					path: `../../app/(dashboard)/${service}/loading.tsx`,
					templateFile: './templates/loading.tsx.hbs',
					force: true,
				},
				{
					type: 'add',
					path: `../../app/(dashboard)/${service}/layout.tsx`,
					templateFile: './templates/layout.tsx.hbs',
					force: true,
				},
				{
					type: 'add',
					path: `../../app/(dashboard)/${service}/columns.tsx`,
					templateFile: './templates/columns.tsx.hbs',
					data,
					force: true,
				},
				{
					type: 'add',
					path: `../../app/(dashboard)/${service}/page.tsx`,
					templateFile: './templates/page.tsx.hbs',
					data,
					force: true,
				},
				() => execPrettier(service),
				() => execEslint(service),
			];

			// console.log('\x1b[31m%s\x1b[0m','Yuu ch hiidgvimaa ene generator')

			return actions;
		},
	});
};
