# Testing Specification: Extract Content Service

## Overview

This document outlines the comprehensive testing strategy for the Deno 2.5 implementation of the
extract-content service, including unit tests, integration tests, and manual testing procedures.

## Testing Philosophy

### Goals

1. **Confidence**: Ensure all endpoints work correctly
2. **Reliability**: Catch regressions before deployment
3. **Documentation**: Tests serve as living documentation
4. **Speed**: Fast test execution for rapid feedback

### Principles

- Test behavior, not implementation
- Write tests before or alongside code
- Keep tests simple and readable
- Mock external dependencies when appropriate
- Test edge cases and error conditions

## Testing Stack

### Deno Native Testing

```typescript
import { assertEquals, assertExists, assertRejects } from "jsr:@std/assert";
```

**Advantages:**

- Built into Deno runtime
- No additional dependencies
- Fast execution
- TypeScript support out of the box

### Test Runner

```bash
# Run all tests
deno test

# Run with permissions
deno test --allow-net --allow-env

# Run specific test file
deno test tests/unit/parser_test.ts

# Run with coverage
deno test --coverage=coverage

# Watch mode for development
deno test --watch
```

## Test Structure

### Directory Organization

```
tests/
├── unit/                       # Unit tests
│   ├── fetcher_test.ts        # HTTP fetcher utilities
│   ├── parser_test.ts         # HTML parsing logic
│   ├── response_test.ts       # Response builders
│   └── router_test.ts         # Routing logic
├── integration/               # Integration tests
│   ├── extract_test.ts        # Full extract endpoint tests
│   ├── html_test.ts           # Full html endpoint tests
│   ├── raw_test.ts            # Full raw endpoint tests
│   └── server_test.ts         # Server-level tests
├── fixtures/                  # Test data
│   ├── sample.html           # Sample HTML documents
│   └── expected.json         # Expected results
└── helpers/                   # Test utilities
    ├── mock_server.ts        # Mock HTTP server for testing
    └── test_utils.ts         # Common test utilities
```

### Test File Naming

- Pattern: `{module}_test.ts`
- Location: Mirror source structure in `tests/` directory
- Example: `src/utils/parser.ts` → `tests/unit/parser_test.ts`

## Unit Tests

### Purpose

Test individual functions and utilities in isolation

### Coverage Areas

#### 1. Parser Utility Tests (tests/unit/parser_test.ts)

```typescript
import { assertEquals } from "jsr:@std/assert";
import { extractHtml, extractText, parseHtml } from "../../src/utils/parser.ts";

Deno.test("parseHtml - creates valid document from HTML string", () => {
  const html = "<html><body><h1>Test</h1></body></html>";
  const doc = parseHtml(html);

  assertEquals(doc.querySelector("h1")?.textContent, "Test");
});

Deno.test("extractText - single element returns string", () => {
  const html = "<html><body><p>Hello World</p></body></html>";
  const doc = parseHtml(html);
  const result = extractText(doc, "p");

  assertEquals(result, "Hello World");
});

Deno.test("extractText - multiple elements returns array", () => {
  const html = "<html><body><p>First</p><p>Second</p></body></html>";
  const doc = parseHtml(html);
  const result = extractText(doc, "p");

  assertEquals(result, ["First", "Second"]);
});

Deno.test("extractText - no match returns empty string", () => {
  const html = "<html><body></body></html>";
  const doc = parseHtml(html);
  const result = extractText(doc, "p");

  assertEquals(result, "");
});

Deno.test("extractText - trims whitespace", () => {
  const html = "<html><body><p>  Trimmed  </p></body></html>";
  const doc = parseHtml(html);
  const result = extractText(doc, "p");

  assertEquals(result, "Trimmed");
});

Deno.test("extractHtml - returns outerHTML", () => {
  const html = "<html><body><div class='test'>Content</div></body></html>";
  const doc = parseHtml(html);
  const result = extractHtml(doc, "div.test");

  assertEquals(result, "<div class='test'>Content</div>");
});
```

#### 2. Fetcher Utility Tests (tests/unit/fetcher_test.ts)

```typescript
import { assertEquals, assertRejects } from "jsr:@std/assert";
import { fetchUrl } from "../../src/utils/fetcher.ts";

Deno.test("fetchUrl - successful fetch returns response", async () => {
  // Using a real URL for simplicity, could use mock server
  const response = await fetchUrl("https://example.com");

  assertEquals(response.ok, true);
  assertEquals(response.status, 200);
});

Deno.test("fetchUrl - invalid URL throws error", async () => {
  await assertRejects(
    async () => await fetchUrl("not-a-valid-url"),
    Error,
    "Invalid URL",
  );
});

Deno.test("fetchUrl - timeout after 10 seconds", async () => {
  // Mock a slow server or use a test timeout endpoint
  await assertRejects(
    async () => await fetchUrl("https://httpbin.org/delay/15"),
    Error,
    "timeout",
  );
});
```

#### 3. Response Builder Tests (tests/unit/response_test.ts)

```typescript
import { assertEquals } from "jsr:@std/assert";
import { errorResponse, jsonResponse, textResponse } from "../../src/utils/response.ts";

Deno.test("jsonResponse - creates JSON response with correct headers", () => {
  const data = { message: "Hello" };
  const response = jsonResponse(data);

  assertEquals(response.status, 200);
  assertEquals(response.headers.get("content-type"), "application/json");
});

Deno.test("jsonResponse - accepts custom status code", () => {
  const response = jsonResponse({ error: "Not Found" }, 404);

  assertEquals(response.status, 404);
});

Deno.test("errorResponse - creates error response", () => {
  const response = errorResponse("Something went wrong", 500);

  assertEquals(response.status, 500);
});

Deno.test("textResponse - creates text response", () => {
  const response = textResponse("Plain text");

  assertEquals(response.status, 200);
  assertEquals(response.headers.get("content-type"), "text/plain");
});
```

#### 4. Router Tests (tests/unit/router_test.ts)

```typescript
import { assertEquals } from "jsr:@std/assert";
import { route } from "../../src/router.ts";

Deno.test("route - matches root path", () => {
  const req = new Request("http://localhost/");
  const handler = route(req);

  assertExists(handler);
});

Deno.test("route - matches /html path", () => {
  const req = new Request("http://localhost/html");
  const handler = route(req);

  assertExists(handler);
});

Deno.test("route - matches /raw path", () => {
  const req = new Request("http://localhost/raw");
  const handler = route(req);

  assertExists(handler);
});

Deno.test("route - returns 404 handler for unknown path", async () => {
  const req = new Request("http://localhost/unknown");
  const handler = route(req);
  const response = await handler(req);

  assertEquals(response.status, 404);
});
```

## Integration Tests

### Purpose

Test complete request/response flows through the application

### Test Server Setup (tests/helpers/test_server.ts)

```typescript
import { serve } from "../../src/server.ts";

export async function startTestServer(port = 8001): Promise<Deno.HttpServer> {
  return serve(port);
}

export async function stopTestServer(server: Deno.HttpServer) {
  await server.shutdown();
}
```

### Mock HTML Server (tests/helpers/mock_server.ts)

```typescript
// Simple mock server for testing fetch operations
export function createMockServer(port = 8002): Deno.HttpServer {
  return Deno.serve({ port }, (req) => {
    const url = new URL(req.url);

    if (url.pathname === "/sample") {
      return new Response(
        `
        <html>
          <head><title>Test Page</title></head>
          <body>
            <h1>Main Heading</h1>
            <p class="intro">First paragraph</p>
            <p class="content">Second paragraph</p>
            <a href="/link1">Link 1</a>
            <a href="/link2">Link 2</a>
          </body>
        </html>
      `,
        { headers: { "content-type": "text/html" } },
      );
    }

    return new Response("Not Found", { status: 404 });
  });
}
```

### Extract Endpoint Integration Tests (tests/integration/extract_test.ts)

```typescript
import { assertEquals, assertExists } from "jsr:@std/assert";
import { createMockServer } from "../helpers/mock_server.ts";

Deno.test("Extract endpoint - extracts text from single element", async () => {
  const mockServer = createMockServer(8002);

  try {
    const extract = encodeURIComponent(JSON.stringify({ title: "h1" }));
    const response = await fetch(
      `http://localhost:8000/?from=http://localhost:8002/sample&extract=${extract}`,
    );

    assertEquals(response.status, 200);

    const data = await response.json();
    assertEquals(data.title, "Main Heading");
  } finally {
    await mockServer.shutdown();
  }
});

Deno.test("Extract endpoint - extracts multiple elements as array", async () => {
  const mockServer = createMockServer(8002);

  try {
    const extract = encodeURIComponent(JSON.stringify({ links: "a" }));
    const response = await fetch(
      `http://localhost:8000/?from=http://localhost:8002/sample&extract=${extract}`,
    );

    const data = await response.json();
    assertEquals(Array.isArray(data.links), true);
    assertEquals(data.links.length, 2);
    assertEquals(data.links[0], "Link 1");
  } finally {
    await mockServer.shutdown();
  }
});

Deno.test("Extract endpoint - returns 404 for missing parameters", async () => {
  const response = await fetch("http://localhost:8000/");

  assertEquals(response.status, 404);

  const text = await response.text();
  assertExists(text.match(/from.*extract/i));
});

Deno.test("Extract endpoint - includes CORS headers", async () => {
  const response = await fetch("http://localhost:8000/");

  assertEquals(response.headers.get("access-control-allow-origin"), "*");
});
```

### HTML Endpoint Integration Tests (tests/integration/html_test.ts)

```typescript
import { assertEquals, assertExists } from "jsr:@std/assert";
import { createMockServer } from "../helpers/mock_server.ts";

Deno.test("HTML endpoint - extracts HTML with selectors", async () => {
  const mockServer = createMockServer(8002);

  try {
    const extract = encodeURIComponent(JSON.stringify({ heading: "h1" }));
    const response = await fetch(
      `http://localhost:8000/html?from=http://localhost:8002/sample&extract=${extract}`,
    );

    assertEquals(response.status, 200);

    const data = await response.json();
    assertExists(data.heading.match(/<h1>.*<\/h1>/));
  } finally {
    await mockServer.shutdown();
  }
});

Deno.test("HTML endpoint - returns full HTML without extract", async () => {
  const mockServer = createMockServer(8002);

  try {
    const response = await fetch(
      `http://localhost:8000/html?from=http://localhost:8002/sample`,
    );

    assertEquals(response.status, 200);

    const data = await response.json();
    assertExists(data.html);
    assertExists(data.html.match(/<html>/));
  } finally {
    await mockServer.shutdown();
  }
});
```

### Raw Endpoint Integration Tests (tests/integration/raw_test.ts)

```typescript
import { assertEquals, assertExists } from "jsr:@std/assert";
import { createMockServer } from "../helpers/mock_server.ts";

Deno.test("Raw endpoint - returns HTML as-is", async () => {
  const mockServer = createMockServer(8002);

  try {
    const response = await fetch(
      `http://localhost:8000/raw?from=http://localhost:8002/sample`,
    );

    assertEquals(response.status, 200);

    const html = await response.text();
    assertExists(html.match(/<html>/));
    assertExists(html.match(/<h1>Main Heading<\/h1>/));
  } finally {
    await mockServer.shutdown();
  }
});

Deno.test("Raw endpoint - returns 404 for missing parameter", async () => {
  const response = await fetch("http://localhost:8000/raw");

  assertEquals(response.status, 404);
});
```

## Manual Testing

### Test Cases

#### Test Case 1: Basic Text Extraction

```bash
# Request
curl "http://localhost:8000/?from=https://example.com&extract=%7B%22title%22%3A%22h1%22%7D"

# Expected: 200 OK
# Response: {"title":"Example Domain"}
```

#### Test Case 2: Multiple Elements

```bash
# Request
curl "http://localhost:8000/?from=https://example.com&extract=%7B%22paragraphs%22%3A%22p%22%7D"

# Expected: 200 OK
# Response: {"paragraphs":["This domain...", "More information..."]}
```

#### Test Case 3: HTML Extraction

```bash
# Request
curl "http://localhost:8000/html?from=https://example.com&extract=%7B%22header%22%3A%22h1%22%7D"

# Expected: 200 OK
# Response: {"header":"<h1>Example Domain</h1>"}
```

#### Test Case 4: Raw Proxy

```bash
# Request
curl "http://localhost:8000/raw?from=https://example.com"

# Expected: 200 OK
# Response: Full HTML document
```

#### Test Case 5: Missing Parameters

```bash
# Request
curl "http://localhost:8000/"

# Expected: 404 Not Found
# Response: "Please supply from and extract parameters"
```

#### Test Case 6: Invalid URL

```bash
# Request
curl "http://localhost:8000/?from=not-a-url&extract=%7B%22title%22%3A%22h1%22%7D"

# Expected: 404 Not Found
# Response: Error message about fetch failure
```

#### Test Case 7: CORS Headers

```bash
# Request
curl -I "http://localhost:8000/"

# Expected: Headers include
# Access-Control-Allow-Origin: *
# Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept
```

### Browser Testing

**Test Page (tests/manual/test.html):**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Extract Content Test Page</title>
  </head>
  <body>
    <h1>Extract Content Service - Manual Test</h1>

    <h2>Test 1: Extract Text</h2>
    <button onclick="testExtract()">Run Test</button>
    <pre id="result1"></pre>

    <h2>Test 2: Extract HTML</h2>
    <button onclick="testHtml()">Run Test</button>
    <pre id="result2"></pre>

    <h2>Test 3: Raw Proxy</h2>
    <button onclick="testRaw()">Run Test</button>
    <pre id="result3"></pre>

    <script>
      const baseUrl = "http://localhost:8000";

      async function testExtract() {
        const extract = encodeURIComponent(JSON.stringify({ title: "h1" }));
        const url = `${baseUrl}/?from=https://example.com&extract=${extract}`;

        try {
          const response = await fetch(url);
          const data = await response.json();
          document.getElementById("result1").textContent = JSON.stringify(data, null, 2);
        } catch (error) {
          document.getElementById("result1").textContent = `Error: ${error.message}`;
        }
      }

      async function testHtml() {
        const extract = encodeURIComponent(JSON.stringify({ header: "h1" }));
        const url = `${baseUrl}/html?from=https://example.com&extract=${extract}`;

        try {
          const response = await fetch(url);
          const data = await response.json();
          document.getElementById("result2").textContent = JSON.stringify(data, null, 2);
        } catch (error) {
          document.getElementById("result2").textContent = `Error: ${error.message}`;
        }
      }

      async function testRaw() {
        const url = `${baseUrl}/raw?from=https://example.com`;

        try {
          const response = await fetch(url);
          const html = await response.text();
          document.getElementById("result3").textContent = html.substring(0, 500) + "...";
        } catch (error) {
          document.getElementById("result3").textContent = `Error: ${error.message}`;
        }
      }
    </script>
  </body>
</html>
```

## Test Coverage

### Coverage Goals

- **Unit Tests**: 80%+ coverage for utilities
- **Integration Tests**: 100% endpoint coverage
- **Edge Cases**: All error conditions tested

### Measuring Coverage

```bash
# Generate coverage report
deno test --coverage=coverage

# View coverage summary
deno coverage coverage

# Generate HTML report
deno coverage coverage --html

# View report in browser
open coverage/html/index.html
```

### Coverage Metrics

- **Lines**: Percentage of lines executed
- **Functions**: Percentage of functions called
- **Branches**: Percentage of conditional branches taken
- **Statements**: Percentage of statements executed

## Continuous Integration

### GitHub Actions Test Job

```yaml
- name: Run tests
  run: deno test --allow-net --allow-env --coverage=coverage

- name: Generate coverage report
  run: deno coverage coverage --lcov --output=coverage.lcov

- name: Upload coverage to Codecov (optional)
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage.lcov
```

## Performance Testing

### Load Testing (Optional)

**Using wrk:**

```bash
# Install wrk
brew install wrk  # macOS

# Basic load test
wrk -t4 -c100 -d30s "http://localhost:8000/?from=https://example.com&extract=%7B%22title%22%3A%22h1%22%7D"

# Results to track:
# - Requests/sec
# - Latency (avg, p50, p99)
# - Transfer/sec
```

**Using Deno Bench (Future):**

```typescript
Deno.bench("extract endpoint performance", async () => {
  await fetch(
    "http://localhost:8000/?from=https://example.com&extract=%7B%22title%22%3A%22h1%22%7D",
  );
});
```

## Test Maintenance

### Best Practices

1. **Keep tests updated** with code changes
2. **Run tests before commit**: `deno test`
3. **Fix failing tests immediately**
4. **Add tests for bugs**: When fixing a bug, add a test case
5. **Review test coverage**: Regularly check coverage reports

### Test Review Checklist

- [ ] All tests pass locally
- [ ] New features have tests
- [ ] Edge cases covered
- [ ] Error conditions tested
- [ ] CORS headers verified
- [ ] Performance acceptable

## Future Testing Enhancements

### Potential Additions

1. **End-to-End Tests**: Full deployment testing on Deno Deploy
2. **Visual Regression Tests**: Screenshot comparison for HTML extraction
3. **Security Tests**: Input validation, injection attempts
4. **Stress Tests**: High concurrency, large payloads
5. **Chaos Engineering**: Failure injection, network issues

### Tools to Consider

- **Playwright**: Browser automation for E2E tests
- **K6**: Load and performance testing
- **Deno Bench**: Official benchmarking tool (when stable)

## Quick Reference

### Run All Tests

```bash
deno test --allow-net --allow-env
```

### Run Specific Test File

```bash
deno test tests/unit/parser_test.ts
```

### Run Tests in Watch Mode

```bash
deno test --watch --allow-net --allow-env
```

### Run with Coverage

```bash
deno test --coverage=coverage && deno coverage coverage
```

### Test Before Commit

```bash
deno fmt && deno lint && deno check main.ts && deno test --allow-net --allow-env
```
