const {variables, items} = require("./postman-data");
const changeCase = require('change-case-all');

const objToQs = (arr) => arr.map(c => `${encodeURIComponent(c.key)}=${encodeURIComponent(c.value)}`).join('&');

const getEndpoints = () => {
	const requests = [];
	const unavailableRequests = [];
	for (let i = 0; i < items.length; i++) {
		let routeGroup = items[i];

		for (let j = 0; j < routeGroup.item.length; j++) {
			let reqItem = routeGroup.item[j];
			if(!reqItem.request.url?.path?.length) unavailableRequests.push(reqItem.name);
			if(reqItem?.request?.method === 'GET' && !!reqItem.request.url?.path?.length) {
				let queryArr = [
					{
						"key": "page",
						"value": "1"
					},
					{
						"key": "page_size",
						"value": "1"
					}
				].concat(
					reqItem.request.url.query?.filter(c => !["page", "page_size"].includes(c.key)) || []
				);
				requests.push(
					{
						name: changeCase.camelCase(reqItem.request.url.path[0] + (reqItem.request.url.path.length > 1 ? " detail" : "")),
						endpoint: [variables.base_url, ...reqItem.request.url.path].join("/") + "?" + objToQs(queryArr)
					}
				);
			}
		}
	}
	console.log('endpoints available: \n', requests.map(c => `${c.name}: ${c.endpoint}`));
	console.error('endpoints unavailable: \n', unavailableRequests);
	return requests;
}

module.exports = { endpoints: getEndpoints() }
