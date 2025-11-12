/**
 * Fetch a URL with timeout and user-agent header
 */
export async function fetchUrl(url: string, timeout = 10000): Promise<Response> {
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "extract-content-service/2.0 (Deno)",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw new Error(`Failed to fetch URL: ${error.message}`);
    }
    throw new Error("Failed to fetch URL: Unknown error");
  } finally {
    clearTimeout(timeoutId);
  }
}
