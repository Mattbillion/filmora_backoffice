import { revalidate } from './actions';

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

export async function executeRevalidate(
  revalidations: (FILMORARevalidateParams | string)[],
) {
  try {
    const _filmoraOrigin = getOrigin();
    await Promise.all(
      revalidations.map((c) =>
        typeof c === 'string' ? revalidate(c) : Promise.resolve(),
      ),
    );
    // revalidateClient(_filmoraOrigin);
  } catch (revalidateError) {
    console.error('Revalidation failed:', revalidateError);
  }
}

export function isRedirectLike(e: unknown): boolean {
  return (
    typeof e === 'object' &&
    e !== null &&
    'message' in e &&
    (e as { message: string }).message === 'NEXT_REDIRECT'
  );
}
