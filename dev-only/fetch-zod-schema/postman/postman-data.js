const collectionJson = require('./postman-collection.json');
const variables = collectionJson.variable.reduce(
  (acc, cur) => ({ ...acc, [cur.key]: cur.value }),
  {},
);

module.exports = {
  variables,
  items: collectionJson.item?.filter(c => !!c.item?.length) || [],
  curlCommand: (location) => `curl --location "${location}" \
      --header "Authorization: Bearer ${variables.token}"`,
};
