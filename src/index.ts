import { serve } from "bun";
import { readdirSync, statSync } from "fs";
import { basename, extname, join } from "path";
import ReactDOMServer from "react-dom/server";
import { getLayouts } from "./utils/layout";
// Define the type for a route
interface Route {
  path: string;
  handler: string;
  type: "page" | "api";
}

// Allowed extensions for pages and APIs
const PAGE_EXTENSIONS = [".tsx", ".jsx"];
const API_EXTENSIONS = [".ts", ".js"];

// Function to recursively scan directories and map routes
function getRoutes(
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

// Define routes for pages and APIs
const pageRoutes: Route[] = getRoutes(
  join(import.meta.dir, "/pages"),
  "",
  "page"
);
const apiRoutes: Route[] = getRoutes(
  join(import.meta.dir, "/api"),
  "/api",
  "api"
);

// Merge all routes
const routes: Route[] = [...pageRoutes, ...apiRoutes];

// Start the Bun server
serve({
  fetch(req) {
    const url = new URL(req.url);

    // Match the current request with the defined routes
    const route = routes.find(
      (r) => r.path === url.pathname || r.path === `${url.pathname}/`
    );

    if (route && route.type === "page") {
      const handler = require(route.handler).default;
      // Normalize layout.path to get relative route path
      const layouts = getLayouts(join(import.meta.dir, "/pages"));

      const applicableLayouts = layouts
        .filter((layout) => {
          // Convert file system path to route path
          const routePath = layout.path
            .replace(join(import.meta.dir, "/pages"), "") // Remove the base directory
            .replace(/\\/g, "/"); // Normalize Windows paths to use "/"

          // Ensure the root layout is matched for "/"
          return (
            url.pathname.startsWith(routePath) ||
            (routePath === "" && url.pathname === "/")
          );
        })
        .sort((a, b) => b.path.length - a.path.length); // Sort by specificity

      // Render the page content
      let content = "";

      if (layouts.length === 0) {
        content = ReactDOMServer.renderToString(handler(req));
      }

      // Wrap content with applicable layouts
      for (const layout of applicableLayouts) {
        const layoutHandler = require(layout.handler).default;
        content = ReactDOMServer.renderToString(
          layoutHandler({ children: handler(req) })
        );
      }

      return new Response(`<!DOCTYPE html>${content}`, {
        headers: { "Content-Type": "text/html" },
      });
    }

    if (route && route.type === "api") {
      const handler = require(route.handler).default;
      return handler(req);
    }

    // Return 404 if no route is matched
    return new Response("Not Found", { status: 404 });
  },
  port: 3000,
});

console.log("Bunfire is running on http://localhost:3000");
