require('dotenv').config();

const {execSync} = require("child_process");

const response = execSync('curl --location "http://localhost:3000/api/v1/openapi.json"').toString();

const jsonResponse = JSON.parse(response);

const componentSchemas = jsonResponse.components?.schemas || {};
const endpointPaths = jsonResponse.paths || {};

module.exports = { componentSchemas, endpointPaths };