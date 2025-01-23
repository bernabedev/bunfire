import { readdirSync, statSync } from "fs";
import { basename, extname, join } from "path";
import type { Route } from "../types";

const PAGE_EXTENSIONS = [".tsx", ".jsx"];
const API_EXTENSIONS = [".ts", ".js"];

export function getRoutes(
  directory: string,
  baseRoute: string = "",
  type: "page" | "api"
): Route[] {
  const routes: Route[] = [];
  const entries = readdirSync(directory);

  for (const entry of entries) {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      // Recursively scan subdirectories
      routes.push(...getRoutes(fullPath, `${baseRoute}/${entry}`, type));
    } else {
      // Filter by type and extension
      const isPage =
        type === "page" && PAGE_EXTENSIONS.includes(extname(entry));
      const isAPI = type === "api" && API_EXTENSIONS.includes(extname(entry));

      if (isPage || isAPI) {
        const route =
          baseRoute +
          (basename(entry, extname(entry)) === "index"
            ? "/"
            : `/${basename(entry, extname(entry))}`);
        routes.push({ path: route, handler: fullPath, type });
      }
    }
  }

  return routes;
}
