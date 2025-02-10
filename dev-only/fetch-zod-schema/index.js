const { endpoints } = require('./postman/endpoints');
const { execSync } = require('child_process');
const { jsonToZod } = require('json-to-zod');
const { curlCommand } = require('./postman/postman-data');
const changeCase = require('change-case-all');

function schemaFallback(name) {
	return `
		lorem	// TODO: fake schema (generated), please check it
		const ${name}Schema = z.object({
			${changeCase.snakeCase(name)}_name: z.string().min(2, {
				message: 'Name must be at least 2 characters.',
			}),
			${changeCase.snakeCase(name)}_desc: z.string().min(2, {
				message: 'Body must be at least 2 characters.',
			}),
			${changeCase.snakeCase(name)}_logo: z.string().optional(),
			status: z.boolean(),
		});
	`
}

module.exports = {
	fetchZodSchema: (path, name) => {
		const obj = endpoints.find(endpoint => endpoint.name === changeCase.camelCase(path));

		try {
			if(!obj) throw Error(`${path} doesn't exist, check endpoint`);
			const response = execSync(curlCommand(obj.endpoint)).toString();

			const jsonResponse = JSON.parse(response);
			if(!jsonResponse.data?.length) throw Error(`${obj.endpoint || path} endpoint returns nothing :(`);

			return jsonToZod(jsonResponse.data[0], changeCase.camelCase((name || obj.name) + "Schema"));
		} catch (error) {
			console.error(`Error:`, error.message);
			return schemaFallback(name || path);
		}
	}
}
