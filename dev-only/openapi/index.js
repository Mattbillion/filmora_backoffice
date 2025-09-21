const {dashboardPaths} = require('./endpoint-group');
const {componentSchemas} = require('./openapi-curl');

console.log(JSON.stringify(dashboardPaths), '\n\n\n');
// console.log(JSON.stringify(componentSchemas), '\n\n\n');

module.exports = {dashboardPaths, componentSchemas};
