# API Specification: Extract Content Service

## Service Overview

The extract-content service provides HTTP endpoints for extracting data from websites using CSS
selectors. It acts as a web scraping proxy with HTML parsing capabilities.

## Base URL

- Development: `http://localhost:8000`
- Production: `https://your-app.deno.dev` (or custom domain)

## Common Behavior

### CORS Headers

All endpoints return the following CORS headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept
```

### Error Responses

All endpoints return errors in plain text format with appropriate HTTP status codes:

- `404`: Request errors, invalid URLs, missing parameters
- `500`: Server errors, parsing failures

Error response body format:

```
Error message here
```

## Endpoints

### 1. Extract Text Content

**Endpoint:** `GET /`

**Description:** Fetches HTML from a target URL and extracts text content using CSS selectors.

**Query Parameters:**

- `from` (required): The target URL to fetch HTML from
- `extract` (required): JSON object mapping field names to CSS selectors

**Example Request:**

```
GET /?from=https://example.com&extract={"title":"h1","links":"a"}
```

**Example with URL encoding:**

```
GET /?from=https://example.com&extract=%7B%22title%22%3A%22h1%22%7D
```

**Success Response:**

- Status: `200 OK`
- Content-Type: `application/json`
- Body: JSON object with extracted text content

**Example Success Response:**

```json
{
  "title": "Example Domain",
  "links": [
    "More information...",
    "Contact Us"
  ]
}
```

**Behavior:**

- If a selector matches multiple elements, returns an array of text values
- If a selector matches one element, returns a single text value (string)
- If a selector matches no elements, returns an empty string
- Text content is trimmed (leading/trailing whitespace removed)
- Uses `textContent` to extract text (no HTML tags)

**Error Responses:**

```
404: Please supply from and extract parameters
404: Could not fetch data from {url}
404: {JSON parse error message}
```

### 2. Extract HTML Content

**Endpoint:** `GET /html`

**Description:** Fetches HTML from a target URL and extracts HTML markup using CSS selectors. If no
extract parameter provided, returns raw HTML wrapped in JSON.

**Query Parameters:**

- `from` (required): The target URL to fetch HTML from
- `extract` (optional): JSON object mapping field names to CSS selectors

**Example Request with selectors:**

```
GET /html?from=https://example.com&extract={"header":"header","nav":"nav"}
```

**Example Request without selectors:**

```
GET /html?from=https://example.com
```

**Success Response (with extract):**

- Status: `200 OK`
- Content-Type: `application/json`
- Body: JSON object with extracted HTML markup

**Example Success Response (with extract):**

```json
{
  "header": "<header><h1>Title</h1></header>",
  "nav": [
    "<nav><a href='/'>Home</a></nav>",
    "<nav><a href='/about'>About</a></nav>"
  ]
}
```

**Success Response (without extract):**

```json
{
  "html": "<!DOCTYPE html><html>...</html>"
}
```

**Behavior:**

- If a selector matches multiple elements, returns an array of HTML strings
- If a selector matches one element, returns a single HTML string
- If a selector matches no elements, returns an empty string
- Uses `outerHTML` to extract HTML (includes the matched element)
- If no extract parameter provided, returns entire HTML in `html` field

**Error Responses:**

```
404: Please supply from and extract parameters
404: Could not fetch data from {url}
404: {JSON parse error message}
```

### 3. Raw HTML Proxy

**Endpoint:** `GET /raw`

**Description:** Simple proxy that fetches and returns the raw HTML from a target URL without any
processing.

**Query Parameters:**

- `from` (required): The target URL to fetch HTML from

**Example Request:**

```
GET /raw?from=https://example.com
```

**Success Response:**

- Status: `200 OK`
- Content-Type: Inherited from target URL (typically `text/html`)
- Body: Raw HTML as received from target URL

**Example Success Response:**

```html
<!DOCTYPE html>
<html>
  <head><title>Example</title></head>
  <body>...</body>
</html>
```

**Behavior:**

- No parsing or transformation
- Returns exact HTML response from target URL
- Acts as a pure proxy

**Error Responses:**

```
404: Please supply from parameter
404: Could not fetch data from {url}
```

## Request Flow

### For all endpoints:

1. Validate required query parameters
2. Fetch HTML from `from` URL using HTTP client
3. Process HTML according to endpoint type
4. Return JSON or HTML response
5. Handle and return errors with appropriate status codes

## Content Types

- Request: `application/x-www-form-urlencoded` (query parameters)
- Response (`/` and `/html`): `application/json`
- Response (`/raw`): Content type from target URL

## Rate Limiting

**Not currently implemented** - Consider adding in future iterations

## Authentication

**Not currently implemented** - Service is publicly accessible

## Security Considerations

### Current Limitations

1. No URL validation - can fetch from any URL
2. No rate limiting - potential for abuse
3. No request size limits
4. No timeout configuration
5. CORS allows all origins (*)

### Recommended Future Enhancements

1. Whitelist/blacklist for allowed domains
2. Rate limiting per IP
3. Request timeout (e.g., 10 seconds)
4. Maximum response size limit
5. Input validation for `from` parameter
6. Sanitization of extracted HTML content

## Examples

### Extract article title and paragraphs

```bash
curl "http://localhost:8000/?from=https://example.com/article&extract=%7B%22title%22%3A%22h1%22%2C%22content%22%3A%22p%22%7D"
```

### Get navigation HTML

```bash
curl "http://localhost:8000/html?from=https://example.com&extract=%7B%22nav%22%3A%22nav%22%7D"
```

### Proxy raw HTML

```bash
curl "http://localhost:8000/raw?from=https://example.com"
```

## Backward Compatibility

This Deno implementation maintains 100% API compatibility with the Node.js version. All existing
clients should continue to work without modifications.

## Future API Considerations

1. POST endpoint for complex extraction rules
2. Batch extraction from multiple URLs
3. WebSocket support for real-time scraping
4. JSON schema validation for extract parameter
5. Custom headers support for authenticated scraping
6. Response caching
7. Webhook notifications for async scraping
