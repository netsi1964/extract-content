/**
 * Validates that a URL is safe to fetch
 * Blocks private IP ranges and unsupported protocols to prevent SSRF attacks
 */
function validateUrl(urlString: string): URL {
  let url: URL;

  try {
    url = new URL(urlString);
  } catch {
    throw new Error("Invalid URL format");
  }

  // Only allow HTTP and HTTPS protocols
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error(`Unsupported protocol: ${url.protocol}`);
  }

  // Block private/internal IP ranges
  const hostname = url.hostname;
  const privatePatterns = [
    /^localhost$/i,
    /^127\.0\.0\.1$/,
    /^::1$/,
    /^169\.254\./, // AWS metadata
    /^10\./, // Private class A
    /^172\.(1[6-9]|2[0-9]|3[01])\./, // Private class B
    /^192\.168\./, // Private class C
    /^0\.0\.0\.0$/,
  ];

  for (const pattern of privatePatterns) {
    if (pattern.test(hostname)) {
      throw new Error(`Access to private IP addresses is not allowed: ${hostname}`);
    }
  }

  return url;
}

/**
 * Fetch a URL with timeout and user-agent header
 */
export async function fetchUrl(url: string, timeout = 10000): Promise<Response> {
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // Validate URL before fetching
    const validUrl = validateUrl(url);

    const response = await fetch(validUrl.toString(), {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
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
