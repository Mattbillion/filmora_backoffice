const { execSync } = require('child_process');
const { jsonToZod } = require('json-to-zod');
const changeCase = require('change-case-all');
const NodeCache = require('node-cache');

const { endpoints } = require('./postman/endpoints');
const { curlCommand } = require('./postman/postman-data');

const cache = new NodeCache({ stdTTL: 10 }); // by seconds

module.exports = {
  fetchZodSchema: (path, name) => {
    const obj = endpoints.find(
      (endpoint) => endpoint.name === changeCase.camelCase(path),
    );

    try {
      if (!obj) throw Error(`${path} doesn't exist, check endpoint`);

      const cacheKey = obj.endpoint;
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        console.log(`Serving from cache: ${cacheKey}`);
        return cachedData;
      }

      const response = execSync(curlCommand(obj.endpoint)).toString();

      const jsonResponse = JSON.parse(response);
      if (!jsonResponse.data?.length)
        throw Error(`${obj.endpoint || path} endpoint returns nothing :(`);

      const { id, created_at, updated_at, created_employee, ...itemData } =
        jsonResponse.data[0];

      const data = {
        rawData: Object.entries(itemData).map(([key,value]) => ({ key, value })),
        schema: jsonToZod(
          itemData,
          changeCase.camelCase((name || obj.name) + 'Schema'),
        ),
      };

      cache.set(cacheKey, data);
      console.log(`Cached response for: ${cacheKey}`);

      return data;
    } catch (error) {
      console.error(`Error:`, error.message);

      return {
        rawData: [],
        schema: `const ${name || path}Schema = z.object({});`,
      };
    }
  },
};
