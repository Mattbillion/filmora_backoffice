import {
  FetchClient,
  FetchClientConfig,
  FetchOptions,
} from '@interpriz/lib/services';

const endpoint = process.env.FILMORA_DOMAIN!;

type ErrorType = {
  loc: (string | number)[];
  msg: string;
  type: string;
}[];

type AdditionalResults = {
  detail?: ErrorType;
  error?: string;
  success?: boolean;
  message?: string;
  status?: string;
  total_count?: number;
};

export class ExtendedFetchClient extends FetchClient<AdditionalResults> {
  constructor(config: Omit<FetchClientConfig, 'baseUrl'> = {}) {
    super({ ...config, baseUrl: endpoint });
  }

  protected override handleError(error: any, url: string, opts: FetchOptions) {
    const errorMessage =
      (error?.message || String(error))?.toLowerCase?.() || '';
    const isUnauthorized =
      error?.status === 401 ||
      errorMessage.includes('not authenticated') ||
      errorMessage.includes('unauthorized') ||
      errorMessage.includes('invalid token') ||
      errorMessage.includes('хүчингүй токен');

    if (isUnauthorized) {
      throw new Error('Unauthorized');
    }
    return super.handleError(error, url, opts);
  }

  protected override createError(body: any, response: Response) {
    const propperError = body?.detail?.[0]?.msg;
    let errorMsg = '';

    if (propperError)
      errorMsg = propperError + `: ${body?.detail?.[0]?.loc?.join('.')}`;
    else
      errorMsg =
        body?.error ||
        (body as any)?.message ||
        (typeof body?.detail === 'string' ? body?.detail : undefined) ||
        String(response.status);

    return new Error(errorMsg);
  }
}
