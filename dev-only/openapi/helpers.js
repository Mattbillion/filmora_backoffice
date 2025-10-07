const changeCase = require('change-case-all');

// Recursive function to find a key in a nested object
const {componentSchemas} = require("./openapi-curl");

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

const pointToSchemaRecursive = (schema, cb) => {
	if (!schema) return {};

	const schemaRef = findValueByKey(schema, '$ref');
	if (schemaRef) {
		const refName = schemaRef.replace("#/components/schemas/", "");
		const sch = componentSchemas[refName] || {};
		const nestedRefName = findValueByKey(sch, '$ref');
		if(nestedRefName) cb(pointToSchemaRecursive(sch, cb));
		return sch;
	}

	return schema;
}

// Function to resolve $ref to actual schema or return the ref name
const pointToSchema = (schema) => {
	if (!schema) return null;

	const schemaRef = findValueByKey(schema, '$ref');
	if (schemaRef) return schemaRef.replace("#/components/schemas/", "");

	return schema;
}

// Convert OpenAPI schema to Zod schema string
function openApiToZodString(schema) {
	if (!schema) return "z.any()";

	if (schema.enum) return `z.enum(${JSON.stringify(schema.enum)})`;

	if(schema.$ref) return changeCase.camelCase(schema.$ref.replace("#/components/schemas/", "")) + 'Schema';

	function handleStrType(schema) {

		function handleByFormat() {
			switch (schema.format) {
				case 'date-time':
					return "z.iso.datetime()";
				case 'date':
					return "z.string().date()";
				case 'email':
					return "z.email()";
				case 'uuid':
					return "z.uuid()";
				case 'url':
					return "z.string().url()";
				case 'binary':
					return "z.instanceof(Blob)"; // Safe for browser and Node.js
				default:
					return "z.string()"; // fallback for unknown formats
			}
		}
		if (schema.maxLength || schema.minLength) {
			let str = handleByFormat();
			if (schema.maxLength) str += `.max(${schema.maxLength})`;
			if (schema.minLength) str += `.min(${schema.minLength})`;
			return str;
		}
		return handleByFormat();
	}

	function handleIntegerType(schema) {
		let num = "z.number().int()";
		if(schema.minimum !== undefined) num += `.min(${schema.minimum})`;
		if(schema.maximum !== undefined) num += `.max(${schema.maximum})`;
		return num;
	}

	function handleNumberType(schema) {
		let num = "z.number()";
		if(schema.minimum !== undefined) num += `.min(${schema.minimum})`;
		if(schema.maximum !== undefined) num += `.max(${schema.maximum})`;
		return num;
	}

	switch (schema.type) {
		case "undefined":
			return "";
		case "null":
			return "";
		case "string":
			return handleStrType(schema);
		case "integer":
			return handleIntegerType(schema);
		case "number":
			return handleNumberType(schema);
		case "boolean":
			return "z.boolean()";
		case "array":
			return `z.array(${openApiToZodString(schema.items)})`;
		case "object": {
			const shape = Object.entries(schema.properties || {})
				.map(([key, value]) => {
					let field = openApiToZodString(value);

					// mark as optional if not required
					if (!(schema.required || []).includes(key)) field += ".optional()";

					return `  ${JSON.stringify(key)}: ${field}`;
				})
				.join(",\n");
			return `z.object({\n${shape}\n})`;
		}
	}

	if (schema.anyOf || schema.oneOf) {
		const shape = (schema.anyOf || schema.oneOf)
			.map((s) => openApiToZodString(s))
			.filter(Boolean);
		if(shape.length === 1) return shape; // no need for union if only one type
		return `z.union([${shape.join(", ")}])`;
	}

	if (schema.allOf) {
		return schema.allOf
			.map((s) => `(${openApiToZodString(s)})`)
			.filter(Boolean)
			.join(".and");
	}

	return "z.any()"; // fallback
}

function mapSchemaToTs(schema) {
	if (!schema) return "any";

	if (schema.type === "string") return "string";
	if (schema.type === "integer") return "number";
	if (schema.type === "boolean") return "boolean";
	if (schema.type === "null") return "";

	if (schema.anyOf) return schema.anyOf.map(mapSchemaToTs).filter(Boolean).join(" | ")

	return "any";
}

function modifyRouteParamsWithType(def) {
	const pathParams = def.parameters?.filter(p => p.in === "path") || [];
	const queryParams = def.parameters?.filter(p => p.in === "query") || [];

	// Build TS param signatures
	const pathArgs = pathParams.map(p => `${changeCase.camelCase(p.name)}: ${mapSchemaToTs(p.schema)}`).join(", ");
	const queryArg = queryParams.length ? `{\n${queryParams
		.map(p => `  ${p.name}${!p.required ? '?' : ''}: ${mapSchemaToTs(p.schema)}`)
		.join(";\n")}\n}` : "";
	const routeExpr = "`" + def.route.replace(/\{(\w+)\}/g, (_, name) => `\${${changeCase.camelCase(name)}}`) + "`";

	return {
		pathArgs,
		queryArg,
		route: routeExpr
	}
}

module.exports = { findValueByKey, pointToSchema, openApiToZodString, modifyRouteParamsWithType, pointToSchemaRecursive };