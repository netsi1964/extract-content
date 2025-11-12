import { fetchUrl } from "../utils/fetcher.ts";
import { errorResponse } from "../utils/response.ts";

/**
 * Handler for GET /raw - Proxy endpoint that returns raw HTML
 *
 * Required query parameters:
 * - from: URL to fetch HTML from
 *
 * Returns raw response body with original content-type
 */
export async function handleRaw(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const from = url.searchParams.get("from");

  console.log(`Raw request: from=${from}`);

  // Validate required parameters
  if (!from) {
    return errorResponse("Please supply from parameter", 404);
  }

  try {
    // Fetch HTML from target URL
    const response = await fetchUrl(from);
    const body = await response.text();

    // Get content-type from original response, default to text/html
    const contentType = response.headers.get("content-type") || "text/html";

    // Return raw body with original content-type
    return new Response(body, {
      status: 200,
      headers: {
        "content-type": contentType,
      },
    });
  } catch (error) {
    console.error("Raw error:", error);
    return errorResponse(
      `${error instanceof Error ? error.message : "Unknown error"}\nfrom=${from}`,
      404,
    );
  }
}
