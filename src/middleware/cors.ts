import type { Handler } from "../types/index.ts";

/**
 * CORS headers to add to all responses
 */
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

/**
 * Add CORS headers to a response
 */
export function addCorsHeaders(response: Response): Response {
  const headers = new Headers(response.headers);

  // Add CORS headers
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    headers.set(key, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * CORS middleware wrapper for handlers
 */
export function withCors(handler: Handler): Handler {
  return async (req: Request): Promise<Response> => {
    // Handle OPTIONS preflight requests
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    // Process request with handler
    const response = await handler(req);

    // Add CORS headers to response
    return addCorsHeaders(response);
  };
}
