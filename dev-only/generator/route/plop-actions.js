const { execSync } = require("child_process");
const dashboardSrc = '../../app/(dashboard)';

const routeActions = (routeName, endpoint, path) => [
	{
		type: "add",
		path: `${dashboardSrc}/${path.toLowerCase()}/actions.ts`,
		templateFile: "./route/actions.ts.hbs",
		data: { 'route-name': routeName, endpoint, path }
	},
	{
		type: "add",
		path: `${dashboardSrc}/${path.toLowerCase()}/columns.tsx`,
		templateFile: "./route/columns.tsx.hbs",
		data: { 'route-name': routeName, endpoint, path }
	},
	{
		type: "add",
		path: `${dashboardSrc}/${path.toLowerCase()}/layout.tsx`,
		templateFile: "./route/layout.tsx.hbs",
		data: { 'route-name': routeName, endpoint, path }
	},
	{
		type: "add",
		path: `${dashboardSrc}/${path.toLowerCase()}/loading.tsx`,
		templateFile: "./route/loading.tsx.hbs",
		data: { 'route-name': routeName, endpoint, path }
	},
	{
		type: "add",
		path: `${dashboardSrc}/${path.toLowerCase()}/page.tsx`,
		templateFile: "./route/page.tsx.hbs",
		data: { 'route-name': routeName, endpoint, path }
	},
	{
		type: "add",
		path: `${dashboardSrc}/${path.toLowerCase()}/schema.ts`,
		templateFile: "./route/schema.ts.hbs",
		data: { 'route-name': routeName, endpoint, path }
	},
	{
		type: "add",
		path: `${dashboardSrc}/${path.toLowerCase()}/components/index.ts`,
		templateFile: "./route/components/index.ts.hbs",
		data: { 'route-name': routeName, endpoint, path }
	},
	{
		type: "add",
		path: `${dashboardSrc}/${path.toLowerCase()}/components/create-dialog.tsx`,
		templateFile: "./route/components/create-dialog.tsx.hbs",
		data: { 'route-name': routeName, endpoint, path }
	},
	{
		type: "add",
		path: `${dashboardSrc}/${path.toLowerCase()}/components/update-dialog.tsx`,
		templateFile: "./route/components/update-dialog.tsx.hbs",
		data: { 'route-name': routeName, endpoint, path }
	},
	() => {
		try {
			execSync(`npx prettier --write "app/(dashboard)/${path.toLowerCase()}"`);
			// execSync(`npx eslint --fix ${dir}`);
			return "Formatted with Prettier";
		} catch (error) {
			return "Failed to format files.";
		}
	},
]

module.exports = { routeActions };
