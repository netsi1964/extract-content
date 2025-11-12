/**
 * Create a JSON response with appropriate headers
 */
export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json",
    },
  });
}

/**
 * Create an error response with plain text message
 */
export function errorResponse(message: string, status = 404): Response {
  return new Response(message, {
    status,
    headers: {
      "content-type": "text/plain",
    },
  });
}

/**
 * Create a text response
 */
export function textResponse(text: string, status = 200): Response {
  return new Response(text, {
    status,
    headers: {
      "content-type": "text/plain",
    },
  });
}
