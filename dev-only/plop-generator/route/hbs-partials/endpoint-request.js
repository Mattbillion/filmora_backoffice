// New: Service-based request partials using shared API actions
const SVC_GET_REQUEST = `
export const {{name}} = async (searchParams?: QueryParams) => {
  try {
    const res = await actions.get<
							PaginatedResType< {{pascalCase route-name}}ItemType[] >
					>(
      '{{genRequestEndpoint pathList}}',
      {
        searchParams,
        next: { tags: [RVK_{{constantCase route-name}}] },
      },
    );
    const { body, error } = res;
    if (error) throw new Error(error);
    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error(\`Error fetching {{genRequestEndpoint pathList}}:\`, error);
    return { data: { data: [], total_count: 0 }, error };
  }
};
`;

const SVC_GET_DETAIL_REQUEST = `
export const {{name}} = async ({{genRequestParam pathList}}, returnColumns: {{pascalCase route-name}}QueryParams['return_columns']) => {
  try {
    const res = await actions.get<{ data: {{pascalCase route-name}}ItemType }>(
      \`{{genRequestEndpoint pathList}}\`,
				{
				...(returnColumns
          ? { searchParams: { return_columns: returnColumns } }
          : {}),
				next: { tags: [\`\${RVK_{{constantCase route-name}} }_{{genRequestCacheKey pathList}}\`] },
		});
    const { body, error } = res;
    if (error) throw new Error(error);
    return { data: body };
  } catch (error) {
    console.error(\`Error fetching {{genRequestEndpoint pathList}}:\`, error);
    return { data: null, error };
  }
};
`;

const SVC_DELETE_REQUEST = `
export const {{name}} = async ({{genRequestParam pathList}}) => {
  const res = await actions.destroy(\`{{genRequestEndpoint pathList}}\`);
  const { body, error } = res;
  if (error) throw new Error(error);
  executeRevalidate([RVK_{{constantCase route-name}}, \`\${RVK_{{constantCase route-name}} }_{{genRequestCacheKey pathList}}\`]);
  return { data: body, error: null };
};
`;

const SVC_CREATE_REQUEST = `
export const {{name}} = async (bodyData: {{pascalCase route-name}}BodyType) => {
  const res = await actions.post(\`{{genRequestEndpoint pathList}}\`, bodyData);
  const { body, error } = res;
  if (error) throw new Error(error);
  executeRevalidate([RVK_{{constantCase route-name}}]);
  return { data: body, error: null };
};
`;

const SVC_UPDATE_REQUEST = `
export const {{name}} = async ({ id: param1, ...bodyData }: {{pascalCase route-name}}BodyType & { id: ID }) => {
  const res = await actions.put<{ data: {{pascalCase route-name}}ItemType }>(
    \`{{genRequestEndpoint pathList}}\`,
    bodyData,
  );
  const { body, error } = res;
  if (error) throw new Error(error);
  executeRevalidate([RVK_{{constantCase route-name}}, \`\${RVK_{{constantCase route-name}} }_{{genRequestCacheKey pathList}}\`]);
  return { data: body, error: null };
};
`;

export const endpointRequestPartials = (plop) => {
  // Register service-based partials
  plop.setPartial('svcGetRequest', SVC_GET_REQUEST);
  plop.setPartial('svcGetDetailRequest', SVC_GET_DETAIL_REQUEST);
  plop.setPartial('svcDeleteRequest', SVC_DELETE_REQUEST);
  plop.setPartial('svcCreateRequest', SVC_CREATE_REQUEST);
  plop.setPartial('svcUpdateRequest', SVC_UPDATE_REQUEST);
}

export const endpointRequestHelpers = (plop) => {
	plop.setHelper('isGetRequest', (method, name) => method === 'GET' && !name.includes('Detail'));
	plop.setHelper('isGetDetailRequest', (method, name) => method === 'GET' && name.includes('Detail'));
	plop.setHelper('isPostRequest', (method) => method === 'POST');
	plop.setHelper('isPutRequest', (method) => method === 'PUT');
	plop.setHelper('isDeleteRequest', (method) => method === 'DELETE');
	plop.setHelper('genRequestParam', (pathList) => {
		return pathList.filter(c => c === '{param}').map((c, idx) => `param${idx + 1}: string | ID`).join(',');
	});
	plop.setHelper('genRequestEndpoint', (pathList) => {
		let count = 0;
		return '/' + pathList.map((c) => c === '{param}' ? '${param' + `${count += 1}}` : c).join('/');
	});
	plop.setHelper('genRequestCacheKey', (pathList) => {
		return pathList.filter(c => c === '{param}').map((c, idx) => '${param' + `${idx + 1}}`).join('_');
	});
	plop.setHelper('getRequestNameByMethod', (endpointList, method) => endpointList.find(c => c.method === method)?.name || endpointList[0]?.name);
}
