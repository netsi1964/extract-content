# Architecture Specification: Deno 2.5 Implementation

## Overview

This document defines the technical architecture for the extract-content service implemented using
Deno 2.5+ with native web standards and modern TypeScript patterns.

## Technology Stack

### Runtime & Language

- **Deno**: 2.5+ (latest stable release)
- **TypeScript**: Strict mode enabled
- **Target**: ES2022+ for modern JavaScript features

### Key Dependencies

- **deno-dom**: `jsr:@b-fuze/deno-dom` - DOM parsing and CSS selector queries
- **std/assert**: Deno standard library for testing (future)

### Web Standards Used

- Native `fetch()` API for HTTP requests
- Native `URL` and `URLSearchParams` for URL parsing
- `Request` and `Response` objects (Web API standard)
- `Headers` API for header management

## Project Structure

```
extract-content/
├── deno.json                 # Deno configuration and import maps
├── main.ts                   # Application entry point
├── src/
│   ├── server.ts            # HTTP server setup with Deno.serve()
│   ├── router.ts            # Request routing logic
│   ├── middleware/
│   │   ├── cors.ts          # CORS middleware
│   │   └── logger.ts        # Request logging (optional)
│   ├── handlers/
│   │   ├── extract.ts       # Text extraction handler
│   │   ├── html.ts          # HTML extraction handler
│   │   └── raw.ts           # Raw proxy handler
│   ├── utils/
│   │   ├── fetcher.ts       # HTTP fetch utilities
│   │   ├── parser.ts        # HTML parsing utilities
│   │   └── response.ts      # Response builder utilities
│   └── types/
│       └── index.ts         # TypeScript type definitions
├── tests/
│   ├── integration/         # Integration tests
│   └── unit/                # Unit tests
├── .env.example             # Environment variable template
├── .gitignore
├── README.md
├── CLAUDE.md                # Claude Code instructions
└── specs/                   # Specification documents (these files)
    ├── MIGRATION_SPEC.md
    ├── API_SPEC.md
    ├── ARCHITECTURE_SPEC.md
    ├── DEPLOYMENT_SPEC.md
    └── TESTING_SPEC.md
```

## Core Components

### 1. Application Entry Point (main.ts)

**Purpose:** Bootstrap the application and start the HTTP server

**Responsibilities:**

- Load environment variables
- Import and initialize the server
- Handle graceful shutdown signals
- Set default port configuration

**Example Structure:**

```typescript
import { serve } from "./src/server.ts";

const port = Number(Deno.env.get("PORT")) || 8000;

console.log(`Starting extract-content service on port ${port}`);
await serve(port);
```

### 2. HTTP Server (src/server.ts)

**Purpose:** Configure and start Deno.serve() with middleware chain

**Responsibilities:**

- Initialize Deno.serve() with options
- Apply CORS middleware
- Route requests to appropriate handlers
- Handle server lifecycle

**Key API:**

```typescript
Deno.serve({
  port: number,
  hostname?: string,
  onListen?: (params: { hostname: string; port: number }) => void,
}, handler: (req: Request) => Response | Promise<Response>)
```

### 3. Router (src/router.ts)

**Purpose:** Map URL paths to handler functions

**Responsibilities:**

- Parse request URL pathname
- Match routes to handlers
- Return 404 for unknown routes
- Extract URL parameters if needed

**Routing Strategy:**

- Simple pattern matching on pathname
- No complex routing library needed (only 3 routes)

**Routes:**

- `GET /` → extract handler
- `GET /html` → html handler
- `GET /raw` → raw handler

### 4. CORS Middleware (src/middleware/cors.ts)

**Purpose:** Add CORS headers to all responses

**Headers to Add:**

```typescript
{
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
  "Access-Control-Allow-Methods": "GET, OPTIONS"
}
```

**Pattern:** Middleware wrapper function

### 5. Handlers (src/handlers/*.ts)

#### Extract Handler (extract.ts)

**Input:**

- `from`: URL to fetch (required)
- `extract`: JSON string mapping names to CSS selectors (required)

**Process:**

1. Validate query parameters
2. Fetch HTML from target URL using fetch()
3. Parse HTML with deno-dom
4. For each selector in extract object:
   - Query elements using `document.querySelectorAll()`
   - Extract `textContent` and trim whitespace
   - Return array if multiple elements, string if one, empty string if none
5. Return JSON response

**Error Cases:**

- Missing parameters → 404
- Fetch failure → 404 with error message
- JSON parse error → 404 with error message

#### HTML Handler (html.ts)

**Input:**

- `from`: URL to fetch (required)
- `extract`: JSON string mapping names to CSS selectors (optional)

**Process:**

1. Validate required parameter (from)
2. Fetch HTML from target URL
3. If extract provided:
   - Parse HTML with deno-dom
   - Extract `outerHTML` for matched elements
   - Return JSON with extracted HTML
4. If no extract:
   - Return JSON with `{ html: rawHtmlString }`
5. Return JSON response

#### Raw Handler (raw.ts)

**Input:**

- `from`: URL to fetch (required)

**Process:**

1. Validate parameter
2. Fetch HTML from target URL using fetch()
3. Return raw response body as-is
4. Preserve content-type from original response

### 6. Utilities

#### Fetcher (src/utils/fetcher.ts)

**Purpose:** Centralized HTTP fetch logic with error handling

**Functions:**

```typescript
async function fetchUrl(url: string): Promise<Response>;
```

**Features:**

- Timeout handling (10 seconds default)
- User-agent header
- Error wrapping
- Response validation

#### Parser (src/utils/parser.ts)

**Purpose:** HTML parsing utilities using deno-dom

**Functions:**

```typescript
function parseHtml(html: string): Document;
function extractText(doc: Document, selector: string): string | string[];
function extractHtml(doc: Document, selector: string): string | string[];
```

**Implementation Details:**

- Use `DOMParser` from deno-dom
- Implement consistent single/multiple element logic
- Trim text content
- Handle null/empty results

#### Response Builder (src/utils/response.ts)

**Purpose:** Create standardized Response objects

**Functions:**

```typescript
function jsonResponse(data: unknown, status = 200): Response;
function errorResponse(message: string, status = 404): Response;
function textResponse(text: string, status = 200): Response;
```

## Data Flow Diagrams

### Extract Endpoint Flow

```
Client Request (GET /?from=URL&extract=JSON)
    ↓
Router (match "/")
    ↓
Extract Handler
    ↓
Validate Parameters → [Error] → 404 Response
    ↓
Fetch HTML from URL → [Error] → 404 Response
    ↓
Parse HTML with deno-dom
    ↓
Parse extract JSON → [Error] → 404 Response
    ↓
For each selector:
    - querySelectorAll(selector)
    - extract textContent
    - trim and format
    ↓
Build JSON response
    ↓
Apply CORS headers
    ↓
Return 200 Response
```

### HTML Endpoint Flow

```
Client Request (GET /html?from=URL&extract=JSON?)
    ↓
Router (match "/html")
    ↓
HTML Handler
    ↓
Validate Parameters → [Error] → 404 Response
    ↓
Fetch HTML from URL → [Error] → 404 Response
    ↓
If extract provided:
    Parse HTML with deno-dom
    Parse extract JSON
    Extract outerHTML
    Return JSON { key: html }
Else:
    Return JSON { html: rawHtml }
    ↓
Apply CORS headers
    ↓
Return 200 Response
```

### Raw Endpoint Flow

```
Client Request (GET /raw?from=URL)
    ↓
Router (match "/raw")
    ↓
Raw Handler
    ↓
Validate Parameters → [Error] → 404 Response
    ↓
Fetch HTML from URL → [Error] → 404 Response
    ↓
Return raw response body
    ↓
Apply CORS headers
    ↓
Return 200 Response
```

## Configuration Management

### deno.json Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "lib": ["deno.window", "deno.ns"],
    "types": []
  },
  "imports": {
    "@deno-dom": "jsr:@b-fuze/deno-dom@^0.1.48"
  },
  "tasks": {
    "start": "deno run --allow-net --allow-env main.ts",
    "dev": "deno run --allow-net --allow-env --watch main.ts",
    "test": "deno test --allow-net --allow-env",
    "check": "deno check main.ts"
  },
  "fmt": {
    "semiColons": true,
    "lineWidth": 100
  },
  "lint": {
    "rules": {
      "tags": ["recommended"]
    }
  }
}
```

### Environment Variables

```bash
PORT=8000                    # Server port (default: 8000)
DENO_DEPLOYMENT_ID=...       # Auto-set by Deno Deploy
```

## Type Definitions

### Main Types (src/types/index.ts)

```typescript
// Request handler type
export type Handler = (req: Request) => Response | Promise<Response>;

// Extract query parameters
export interface ExtractQuery {
  from: string;
  extract: string;
}

// HTML query parameters
export interface HtmlQuery {
  from: string;
  extract?: string;
}

// Raw query parameters
export interface RawQuery {
  from: string;
}

// Extract selectors (parsed JSON)
export type ExtractSelectors = Record<string, string>;

// Extract results
export type ExtractResult = Record<string, string | string[]>;

// Router map
export type RouteMap = Map<string, Handler>;
```

## Error Handling Strategy

### Error Types

1. **Validation Errors**: Missing or invalid parameters
2. **Fetch Errors**: Network issues, timeout, invalid URL
3. **Parse Errors**: Invalid JSON, HTML parsing failures
4. **System Errors**: Unexpected runtime errors

### Error Response Format

- Status Code: 404 (for client errors), 500 (for server errors)
- Body: Plain text error message
- CORS headers still applied

### Error Handling Pattern

```typescript
try {
  // operation
} catch (error) {
  console.error(`Error in handler:`, error);
  return errorResponse(error.message, 404);
}
```

## Performance Considerations

### Optimization Strategies

1. **Minimal Dependencies**: Only deno-dom, no heavy frameworks
2. **Streaming Responses**: Use native Response API efficiently
3. **No State**: Stateless handlers for horizontal scaling
4. **Efficient Parsing**: deno-dom is lightweight and fast
5. **Connection Reuse**: fetch() handles connection pooling

### Expected Performance

- Cold start: < 100ms (Deno Deploy optimized)
- Warm response: < 50ms + target fetch time
- Memory: < 50MB per instance

## Security Considerations

### Current Security Posture

- No URL validation (open proxy risk)
- No rate limiting
- No authentication
- CORS allows all origins

### Recommended Future Enhancements

1. **URL Validation**: Whitelist/blacklist for allowed domains
2. **Rate Limiting**: Implement request limits per IP
3. **Timeouts**: Hard timeout on fetch operations (10s)
4. **Input Sanitization**: Validate and sanitize extract JSON
5. **Request Size Limits**: Limit response body size from target URLs

### Permissions Required

```bash
--allow-net      # Required for HTTP server and fetching URLs
--allow-env      # Required for PORT environment variable
```

## Deployment Architecture

### Deno Deploy Infrastructure

- **Edge Runtime**: Deployed globally on Deno Deploy edge network
- **Scaling**: Automatic horizontal scaling based on traffic
- **Regions**: Multi-region deployment (automatic)
- **Cold Starts**: Optimized by Deno Deploy platform

### GitHub Integration

- Automatic deployment on push to `deno-deploy-version` branch
- GitHub Actions workflow for CI/CD
- Environment variable management via Deno Deploy dashboard

## Monitoring & Observability

### Logging Strategy

- Console logs captured by Deno Deploy
- Request/response logging (optional middleware)
- Error logging to console

### Metrics to Track

1. Request count per endpoint
2. Response times (p50, p95, p99)
3. Error rates by endpoint
4. Fetch failure rates
5. Deployment success/failure

### Access Logs

Available via Deno Deploy dashboard:

```bash
deno deploy logs --project=extract-content
```

## Testing Strategy

See [TESTING_SPEC.md](./TESTING_SPEC.md) for complete testing strategy.

### Test Types

1. Unit tests for utilities and handlers
2. Integration tests for full request flow
3. Manual testing for deployment verification

## Related Documentation

See also:

- [API_SPEC.md](./API_SPEC.md) - API endpoint specifications
- [DEPLOYMENT_SPEC.md](./DEPLOYMENT_SPEC.md) - Deployment guide
- [TESTING_SPEC.md](./TESTING_SPEC.md) - Testing strategy
- [MIGRATION_SPEC.md](./MIGRATION_SPEC.md) - Migration plan

## Future Enhancements

### Potential Features

1. **Caching Layer**: Cache fetched HTML for repeated requests
2. **Webhook Support**: Async scraping with webhooks
3. **Batch Processing**: Multiple URLs in single request
4. **Custom Headers**: Allow custom headers for authenticated scraping
5. **Response Transformation**: JSON/XML output formats
6. **WebSocket Support**: Real-time scraping updates

### Architecture Evolution

- Consider adding queue system for long-running scrapes
- Implement distributed caching with Deno KV
- Add authentication layer with JWT tokens
- Create admin dashboard for monitoring

## Comparison: Node.js vs Deno Architecture

| Aspect        | Node.js (Current)    | Deno 2.5 (New)            |
| ------------- | -------------------- | ------------------------- |
| HTTP Server   | Express (framework)  | Deno.serve() (native)     |
| Routing       | Express Router       | Custom lightweight router |
| HTTP Client   | request (deprecated) | fetch() (web standard)    |
| HTML Parsing  | jsdom (heavy)        | deno-dom (lightweight)    |
| Module System | CommonJS             | ES Modules                |
| Type Safety   | None                 | TypeScript strict mode    |
| Configuration | package.json         | deno.json                 |
| Dependencies  | npm (node_modules)   | URLs + import maps        |
| Deployment    | Heroku (legacy)      | Deno Deploy (modern edge) |
| Cold Start    | 500ms+               | <100ms                    |
| Bundle Size   | ~50MB                | ~5MB                      |
