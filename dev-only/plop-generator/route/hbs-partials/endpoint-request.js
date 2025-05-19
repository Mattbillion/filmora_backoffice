const GET_REQUEST = `
	export const {{name}} = async (searchParams?: QueryParams) => {
			try {
					const { body, error } = await xooxFetch<
							PaginatedResType< {{pascalCase route-name}}ItemType[] >
					>('{{genRequestEndpoint pathList}}', {
							method: '{{method}}',
							searchParams,
							next: { tags: [RVK_{{constantCase route-name}}] },
					});
	
					if (error) throw new Error(error);
	
					return { data: body, total_count: body.total_count };
			} catch (error) {
					console.error(\`Error fetching {{genRequestEndpoint pathList}}:\`, error);
					return { data: { data: [], total_count: 0 }, error };
			}
	};
`;

const GET_DETAIL_REQUEST = `
	export const {{name}} = async ({{genRequestParam pathList}}) => {
			try {
					const { body, error } = await xooxFetch<{ data: {{pascalCase route-name}}ItemType }>(
							\`{{genRequestEndpoint pathList}}\`,
							{
									method: '{{method}}',
									next: { tags: [\`\${RVK_{{constantCase route-name}} }_{{genRequestCacheKey pathList}}\`] },
							},
					);
	
					if (error) throw new Error(error);
	
					return { data: body };
			} catch (error) {
					console.error(\`Error fetching {{genRequestEndpoint pathList}}:\`, error);
					return { data: null, error };
			}
	};
`;

const DELETE_REQUEST = `
	export const {{name}} = async ({{genRequestParam pathList}}) => {
			const { body, error } = await xooxFetch(\`{{genRequestEndpoint pathList}}\`, {
					method: '{{method}}',
					cache: 'no-store',
			});
	
			if (error) throw new Error(error);
	
			executeRevalidate([RVK_{{constantCase route-name}}, \`\${RVK_{{constantCase route-name}} }_{{genRequestCacheKey pathList}}\`]);
			return { data: body, error: null };
	};
`;

const CREATE_REQUEST = `
	export const {{name}} = async (bodyData: {{pascalCase route-name}}BodyType) => {
			const { body, error } = await xooxFetch(\`{{genRequestEndpoint pathList}}\`, {
					method: '{{method}}',
            body: bodyData,
            cache: 'no-store',
			});
	
			if (error) throw new Error(error);
	
			executeRevalidate([RVK_{{constantCase route-name}}]);
			return { data: body, error: null };
	};
`;

const UPDATE_REQUEST = `
	export const {{name}} = async ({
			id: param1,
			...bodyData
	}: {{pascalCase route-name}}BodyType & { id: ID }) => {
			const { body, error } = await xooxFetch<{ data: {{pascalCase route-name}}ItemType }>(
					\`{{genRequestEndpoint pathList}}\`,
					{
							method: '{{method}}',
							body: bodyData,
							cache: 'no-store',
					},
			);
	
			if (error) throw new Error(error);
	
			executeRevalidate([RVK_{{constantCase route-name}}, \`\${RVK_{{constantCase route-name}} }_{{genRequestCacheKey pathList}}\`]);
			return { data: body, error: null };
	};
`;

export const endpointRequestPartials = (plop) => {
	plop.setPartial('getRequest', GET_REQUEST);
	plop.setPartial('getDetailRequest', GET_DETAIL_REQUEST);
	plop.setPartial('deleteRequest', DELETE_REQUEST);
	plop.setPartial('createRequest', CREATE_REQUEST);
	plop.setPartial('updateRequest', UPDATE_REQUEST);
}

export const endpointRequestHelpers = (plop) => {
	plop.setHelper('isGetRequest', (method, name) => method === 'GET' && !name.includes('Detail'));
	plop.setHelper('isGetDetailRequest', (method, name) => method === 'GET' && name.includes('Detail'));
	plop.setHelper('isPostRequest', (method) => method === 'POST');
	plop.setHelper('isPutRequest', (method) => method === 'PUT');
	plop.setHelper('isDeleteRequest', (method) => method === 'DELETE');
	plop.setHelper('genRequestParam', (pathList) => {
		return pathList.filter(c => c === '{param}').map((c, idx) => `param${idx+1}: string | ID`).join(',');
	});
	plop.setHelper('genRequestEndpoint', (pathList) => {
		let count = 0;
		return '/' + pathList.map((c) => c === '{param}' ? '${param' + `${count+=1}}` : c).join('/');
	});
	plop.setHelper('genRequestCacheKey', (pathList) => {
		return pathList.filter(c => c === '{param}').map((c, idx) => '${param' + `${idx+1}}`).join('_');
	});
	plop.setHelper('getRequestNameByMethod', (endpointList, method) => endpointList.find(c => c.method === method)?.name || endpointList[0]?.name);
}
