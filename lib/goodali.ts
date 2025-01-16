import {revalidate, revalidateGoodali} from './functions';

export type GoodaliRevalidateParams = {path?: string; type?: "page" | "layout"; tag?: string};

export function getOrigin() {
  const isClient = typeof window !== "undefined";
  const isProd = isClient ? window.location.host.includes("goodali.mn") : process.env.NODE_ENV === "production";

  return isProd ? "goodali" : "vercel";
}

export function executeRevalidate(revalidations: (GoodaliRevalidateParams | string)[]) {
  try {
    const goodaliOrigin = getOrigin();
    Promise.any(revalidations.map((c) => typeof c === "string" ? revalidate(c) : revalidateGoodali(c, goodaliOrigin)));
  } catch (revalidateError) {
    console.error("Revalidation failed:", revalidateError);
  }
}
