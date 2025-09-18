import { revalidate, revalidateClient } from './actions';

export type FILMORARevalidateParams = {
  path?: string;
  type?: 'page' | 'layout';
  tag?: string;
};

export function getOrigin() {
  const isClient = typeof window !== 'undefined';
  const isProd = isClient
    ? window.location.host.includes('filmora.mn')
    : process.env.NODE_ENV === 'production';

  return isProd ? 'filmora' : 'vercel';
}

export function executeRevalidate(
  revalidations: (FILMORARevalidateParams | string)[],
) {
  try {
    const filmoraOrigin = getOrigin();
    Promise.any(
      revalidations.map((c) => (typeof c === 'string' ? revalidate(c) : false)),
    );
    revalidateClient(filmoraOrigin);
  } catch (revalidateError) {
    console.error('Revalidation failed:', revalidateError);
  }
}

export function isRedirectLike(e: unknown): boolean {
  return (
    typeof e === 'object' &&
    e !== null &&
    'message' in e &&
    (e as any).message === 'NEXT_REDIRECT'
  );
}
