import type { Handler, RouteMap } from "./types/index.ts";
import { errorResponse } from "./utils/response.ts";
import { handleExtract } from "./handlers/extract.ts";
import { handleHtml } from "./handlers/html.ts";
import { handleRaw } from "./handlers/raw.ts";
import { handleTutorial } from "./handlers/tutorial.ts";

/**
 * Route map - maps URL paths to handler functions
 */
const routes: RouteMap = new Map([
  ["/", handleExtract],
  ["/html", handleHtml],
  ["/raw", handleRaw],
  ["/tutorial", handleTutorial],
]);

/**
 * Main router function
 * Matches request URL to handler or returns 404
 */
export function route(req: Request): Response | Promise<Response> {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // Find matching handler
  const handler: Handler | undefined = routes.get(pathname);

  if (handler) {
    return handler(req);
  }

  // No route matched - return 404
  return errorResponse("Not Found", 404);
}
