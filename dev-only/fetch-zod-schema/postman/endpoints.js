const { variables, items } = require('./postman-data');
const { generatedRoutes } = require('./generated-routes');
const changeCase = require('change-case-all');

const objToQs = (arr) =>
  arr
    .map((c) => `${encodeURIComponent(c.key)}=${encodeURIComponent(c.value)}`)
    .join('&');

const injectSearchQuery = (reqItem) => {
  let query = '';
  if(reqItem?.request?.method === 'GET' && !!reqItem.request.url?.path?.length) {
    query += `?${
        objToQs([
          {
            key: 'page',
            value: '1',
          },
          {
            key: 'page_size',
            value: '1',
          },
        ].concat(
            reqItem.request.url.query?.filter(
                (c) => !['page', 'page_size'].includes(c.key) && !c.disabled,
            ) || [],
        ))
    }`;
  }
  return query;
}

const endpointLoop = (routeGroup, cb) => {
  for (let j = 0; j < routeGroup.item.length; j++) {
    let reqItem = routeGroup.item[j];
    if (!!reqItem.request?.url?.path?.length) {
      cb({
        name: changeCase.camelCase(
          [
            {
              GET: 'get',
              POST: 'create',
              PUT: 'patch',
              DELETE: 'delete',
            }[reqItem.request.method],
            ...reqItem.request.url.path
          ].map(c => !/(\w+\d|\d)/g.test(c) ? c : 'detail').join(' ')
        ),
        method: reqItem.request.method,
        endpoint: ['', ...reqItem.request.url.path].join('/') + injectSearchQuery(reqItem),
        pathList: reqItem.request.url.path.map(c => !/(\w+\d|\d)/g.test(c) ? c : '{param}'),
        base: reqItem.request.url.path[0],
      });
    } else if(reqItem.item) {
      endpointLoop(reqItem, cb);
    }
  }
}

const getEndpoints = () => {
  const requests = [];

  for (let i = 0; i < items.length; i++) {
    let routeGroup = items[i];
    if(routeGroup.item) endpointLoop(routeGroup, (endpointObj) => requests.push(endpointObj));
  }

  const groupedEndpoints = requests.reduce((acc, curr) => ({...acc, [curr.base]: [...(acc[curr.base] || []), curr]}), ({}));

  console.log( 'endpoint groups: \n', groupedEndpoints);

  console.log(
    'available endpoints (Please check before generate!): \n',
    Object.keys(groupedEndpoints)
      .filter(
        (c) =>
          !generatedRoutes.find(
            (cc) =>
              changeCase.kebabCase(c).includes(cc),
          ),
      )
      .map((c) => changeCase.kebabCase(c)),
  );

  return groupedEndpoints;
};

module.exports = { endpoints: getEndpoints() };
