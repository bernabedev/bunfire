import { serve } from "bun";
import { join } from "path";
import ReactDOMServer from "react-dom/server";
import { getLayouts } from "./utils/layout";
import { getRoutes } from "./utils/routes";

type ServerOptions = {
  port?: number;
  dir?: string;
};
export const startServer = (opts: ServerOptions = {}) => {
  const { port = 3000, dir = join(import.meta.dir) } = opts;
  // Define routes for pages and APIs
  const pageRoutes = getRoutes(`${dir}/pages`, "", "page");
  const apiRoutes = getRoutes(`${dir}/api`, "/api", "api");

  // Merge all routes
  const routes = [...pageRoutes, ...apiRoutes];

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
        const layouts = getLayouts(`${dir}/pages`);

        const applicableLayouts = layouts
          .filter((layout) => {
            // Convert file system path to route path
            const routePath = layout.path
              .replace(`${dir}/pages`, "") // Remove the base directory
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
    port: port,
  });

  console.log("Bunfire is running on http://localhost:3000");
};
