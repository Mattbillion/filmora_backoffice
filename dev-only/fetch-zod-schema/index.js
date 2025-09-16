const { execSync } = require('child_process');
const { jsonToZod } = require('json-to-zod');
const changeCase = require('change-case-all');
const NodeCache = require('node-cache');
const config = require('../config');

const { endpoints } = require('./postman/endpoints');
const { curlCommand } = require('./postman/postman-data');

const cache = new NodeCache({ stdTTL: Number(config.CACHE_TTL_SECONDS) || 10 }); // by seconds

module.exports = {
  fetchZodSchema: (path, name) => {
    try {
      const [endpointPrefix, endpointList] = Object.entries(endpoints).find(
        ([baseEndpoint]) => baseEndpoint === changeCase.snakeCase(path) || baseEndpoint === changeCase.kebabCase(path),
      );

      if (!endpointList?.length) throw Error(`${endpointPrefix} doesn't exist, check endpoint`);
      const fetchable = endpointList.find(cc => cc.method === 'GET');

      const cacheKey = fetchable.endpoint;
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        console.log('\x1b[34m', `Serving from cache: ${cacheKey}`);
        return cachedData;
      }

      const response = execSync(curlCommand(fetchable.endpoint)).toString();

      const jsonResponse = JSON.parse(response);

      let responseItem;
      if(typeof jsonResponse.data === 'object' && jsonResponse.data?.id) {
        responseItem = jsonResponse.data;
      } else if (Array.isArray(jsonResponse.data)) {
        responseItem = jsonResponse.data[0];
      } else {
        console.error(
          '\x1b[31m%s\x1b[0m',
          'Fetch failed, here is "BOLDOO - ((uulee * dambii) / dashka)" type shit response :)))) ---> ',
          jsonResponse
        );
        throw Error(`${fetchable.endpoint || path} endpoint returns nothing :(`);
      }

      const { id, created_at, updated_at, created_employee, ...itemData } = responseItem;

      const data = {
        rawData: Object.entries(itemData).map(([key,value]) => ({ key, value })),
        dataKeys: Object.keys(itemData),
        schema: jsonToZod(
          itemData,
          changeCase.camelCase((name || path) + 'Schema'),
        ),
        endpointList
      };

      cache.set(cacheKey, data);
      console.log(`Cached response for: ${cacheKey}`, JSON.stringify(responseItem, null, 2));

      return data;
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', `Error:`, error.message);

      return {
        rawData: [],
        dataKeys: [],
        endpointList: [],
        schema: `const ${name || path}Schema = z.object({});`,
      };
    }
  },
};
