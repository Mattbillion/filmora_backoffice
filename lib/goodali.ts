import {revalidate, revalidateGoodali} from './functions';

export type GoodaliRevalidateParams = {path?: string; type?: "page" | "layout"; tag?: string};

export function getOrigin() {
  const isClient = typeof window !== "undefined";
  const isProd = isClient ? window.location.host.includes("xoox.mn") : process.env.NODE_ENV === "production";

  return isProd ? "xoox" : "vercel";
}

export function executeRevalidate(revalidations: (GoodaliRevalidateParams | string)[]) {
  try {
    const xooxOrigin = getOrigin();
    Promise.any(revalidations.map((c) => typeof c === "string" ? revalidate(c) : revalidateGoodali(c, xooxOrigin)));
  } catch (revalidateError) {
    console.error("Revalidation failed:", revalidateError);
  }
}
