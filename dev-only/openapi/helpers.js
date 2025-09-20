
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

// Convert OpenAPI schema to Zod schema string
function openApiToZodString(schema, components = {}, nameHint = "Schema") {
	if (!schema) return "z.any()";

	if (schema.enum) return `z.enum(${JSON.stringify(schema.enum)})`;

	switch (schema.type) {
		case "string":
			return "z.string()";
		case "integer":
		case "number":
			return "z.number()";
		case "boolean":
			return "z.boolean()";
		case "array":
			return `z.array(${openApiToZodString(schema.items, components, nameHint + "Item")})`;
		case "object": {
			const shape = Object.entries(schema.properties || {})
				.filter(([key]) => !['id', 'created_at', 'updated_at', 'created_employee'].includes(key))
				.map(([key, value]) => {
					let field = openApiToZodString(value, components, key);

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
			.map((s, i) => openApiToZodString(s, components, nameHint + i))
			.join(", ");
		return `z.union([${shape}])`;
	}

	if (schema.allOf) {
		return schema.allOf
			.map((s, i) => `(${openApiToZodString(s, components, nameHint + i)})`)
			.join(".and");
	}

	return "z.any()"; // fallback
}

module.exports = { findValueByKey, pointToSchema, openApiToZodString };