import { FetchClient, FetchClientConfig } from '@interpriz/lib/services';

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
  data?: any;
  status?: string;
  total_count?: number;
};

export class ExtendedFetchClient extends FetchClient<AdditionalResults> {
  constructor(config: Omit<FetchClientConfig, 'baseUrl'> = {}) {
    super({ ...config, baseUrl: endpoint });
  }
  // Example: override error handling to auto-refresh tokens or reshape errors
  // private async handleAuthFailure(): Promise<boolean> {
  //   try {
  //     // Replace with your refresh logic
  //     const refreshed = await tryRefreshAccessToken();
  //     if (!refreshed) {
  //       redirectToLogin();
  //     }
  //     return refreshed;
  //   } catch {
  //     redirectToLogin();
  //     return false;
  //   }
  // }
  /**
   * Override base error handler to intercept auth failures and retry.
   */
  // protected override async handleError(error: any, url: string, opts: FetchOptions) {
  //   const errorMessage = error?.message?.toLowerCase?.() || '';
  //   const isUnauthorized = error?.status === 401 ||
  //     errorMessage.includes('unauthorized') || errorMessage.includes('invalid token');
  //   if (isUnauthorized) {
  //     const recovered = await this.handleAuthFailure();
  //     if (recovered) return await super.request(url, opts);
  //   }
  //   return super.handleError(error, url, opts);
  // }
  /**
   * Override to shape custom error objects
   */
  // protected override createError(body: any, response: Response) {
  //   let message = 'Unexpected error occurred';
  //   if (body?.error) message = body.error;
  //   else if (body?.message) message = body.message;
  //   const err = new Error(message);
  //   (err as any).status = response.status;
  //   return err;
  // }
}
