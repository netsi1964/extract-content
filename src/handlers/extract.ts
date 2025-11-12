import type { ExtractResult, ExtractSelectors } from "../types/index.ts";
import { fetchUrl } from "../utils/fetcher.ts";
import { extractText, parseHtml } from "../utils/parser.ts";
import { errorResponse, jsonResponse } from "../utils/response.ts";

/**
 * Handler for GET / - Extract text content using CSS selectors
 *
 * Required query parameters:
 * - from: URL to fetch HTML from
 * - extract: JSON string mapping names to CSS selectors
 *
 * Returns JSON object with extracted text content
 */
export async function handleExtract(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const extractParam = url.searchParams.get("extract");

  console.log(`Extract request: from=${from}, extract=${extractParam}`);

  // Validate required parameters
  if (!from || !extractParam) {
    return errorResponse("Please supply from and extract parameters", 404);
  }

  try {
    // Fetch HTML from target URL
    const response = await fetchUrl(from);
    const html = await response.text();

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

    // Extract content for each selector
    const result: ExtractResult = {};
    for (const [key, selector] of Object.entries(selectors)) {
      result[key] = extractText(doc, selector);
    }

    return jsonResponse(result);
  } catch (error) {
    console.error("Extract error:", error);
    return errorResponse(
      `${
        error instanceof Error ? error.message : "Unknown error"
      }\nfrom=${from}\nextract=${extractParam}`,
      404,
    );
  }
}
