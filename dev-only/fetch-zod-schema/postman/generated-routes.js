const fs = require('fs');
const path = require('path');
const config = require('../../config');

const dashboardDir = path.resolve(process.cwd(), config.DASHBOARD_DIR);
const generatedRoutes = fs
  .readdirSync(dashboardDir)
  .filter((file) => fs.statSync(path.join(dashboardDir, file)).isDirectory());

console.log('Generated routes: \n', generatedRoutes);

module.exports = { generatedRoutes };
