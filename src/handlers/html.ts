import type { ExtractResult, ExtractSelectors } from "../types/index.ts";
import { fetchUrl } from "../utils/fetcher.ts";
import { extractHtml, parseHtml } from "../utils/parser.ts";
import { errorResponse, jsonResponse } from "../utils/response.ts";

/**
 * Handler for GET /html - Extract HTML content using CSS selectors
 *
 * Required query parameters:
 * - from: URL to fetch HTML from
 *
 * Optional query parameters:
 * - extract: JSON string mapping names to CSS selectors
 *
 * If extract is provided: Returns JSON with extracted outerHTML for each selector
 * If extract is not provided: Returns JSON with { html: rawHtml }
 */
export async function handleHtml(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const extractParam = url.searchParams.get("extract");

  console.log(`HTML request: from=${from}, extract=${extractParam}`);

  // Validate required parameters
  if (!from) {
    return errorResponse("Please supply from parameter", 404);
  }

  try {
    // Fetch HTML from target URL
    const response = await fetchUrl(from);
    const html = await response.text();

    // If no extract parameter, return raw HTML
    if (!extractParam) {
      return jsonResponse({ html });
    }

    // Parse extract JSON
    let selectors: ExtractSelectors;
    try {
      selectors = JSON.parse(extractParam);
    } catch (error) {
      return errorResponse(
        `Invalid extract JSON: ${error instanceof Error ? error.message : "Unknown error"}`,
        404,
      );
    }

    // Parse HTML
    const doc = parseHtml(html);

    // Extract HTML for each selector
    const result: ExtractResult = {};
    for (const [key, selector] of Object.entries(selectors)) {
      result[key] = extractHtml(doc, selector);
    }

    return jsonResponse(result);
  } catch (error) {
    console.error("HTML error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Unknown error",
      404,
    );
  }
}
