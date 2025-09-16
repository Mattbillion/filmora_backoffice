const path = require('path');
const config = require('../../config');

const collectionPath = path.isAbsolute(config.POSTMAN_COLLECTION_PATH)
  ? config.POSTMAN_COLLECTION_PATH
  : path.resolve(process.cwd(), config.POSTMAN_COLLECTION_PATH);

const collectionJson = require(collectionPath);
const variables = collectionJson.variable.reduce(
  (acc, cur) => ({ ...acc, [cur.key]: cur.value }),
  {},
);

// Override base and token from config when provided
variables.base = config.FILMORA_DOMAIN || variables.base;
if (config.TOKEN) variables.token = config.TOKEN;

module.exports = {
  variables,
  items: collectionJson.item?.filter(c => !!c.item?.length) || [],
  curlCommand: (location) => `curl --location "${(config.FILMORA_DOMAIN || variables.base) + location}" \
      --header "Authorization: Bearer ${variables.token}"`,
};
