const fs = require('fs');
const path = require('path');

const dashboardDir = path.resolve(__dirname, '../../../app/(dashboard)');
const generatedRoutes = fs
  .readdirSync(dashboardDir)
  .filter((file) => fs.statSync(path.join(dashboardDir, file)).isDirectory());

console.log('Generated routes: \n', generatedRoutes);

module.exports = { generatedRoutes };
