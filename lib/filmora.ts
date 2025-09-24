import { revalidate } from './functions';

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
