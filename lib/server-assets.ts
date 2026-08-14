import fs from "fs";
import path from "path";

/**
 * Server-only. Checks whether a public asset has actually been supplied yet, so
 * components can fall back to an on-brand placeholder instead of a broken image
 * and automatically pick up the real file the moment it is added to /public.
 * Must only be imported from Server Components — never from a "use client" tree.
 */
export function publicAssetExists(publicPath: string): boolean {
  try {
    const clean = publicPath.startsWith("/") ? publicPath.slice(1) : publicPath;
    return fs.existsSync(path.join(process.cwd(), "public", clean));
  } catch {
    return false;
  }
}
