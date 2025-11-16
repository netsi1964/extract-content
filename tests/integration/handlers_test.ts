import { assertEquals } from "jsr:@std/assert@^1.0.10";
import { withCors } from "../../src/middleware/cors.ts";
import { route } from "../../src/router.ts";

// Wrap router with CORS for testing
const handler = withCors(route);

Deno.test("GET / - returns HTML landing page when missing parameters", async () => {
  const req = new Request("http://localhost:8000/");
  const res = await handler(req);

  assertEquals(res.status, 200);
  assertEquals(res.headers.get("content-type"), "text/html; charset=utf-8");
  const html = await res.text();
  assertEquals(html.includes("<!DOCTYPE html>"), true);
  assertEquals(html.includes("extract-content"), true);
});

Deno.test("GET /html - returns 404 when missing from parameter", async () => {
  const req = new Request("http://localhost:8000/html");
  const res = await handler(req);

  assertEquals(res.status, 404);
});

Deno.test("GET /raw - returns 404 when missing from parameter", async () => {
  const req = new Request("http://localhost:8000/raw");
  const res = await handler(req);

  assertEquals(res.status, 404);
});

Deno.test("GET /unknown - returns 404", async () => {
  const req = new Request("http://localhost:8000/unknown");
  const res = await handler(req);

  assertEquals(res.status, 404);
  assertEquals(await res.text(), "Not Found");
});

Deno.test("CORS headers are present", async () => {
  const req = new Request("http://localhost:8000/unknown");
  const res = await handler(req);

  assertEquals(res.headers.get("Access-Control-Allow-Origin"), "*");
  assertEquals(
    res.headers.get("Access-Control-Allow-Methods"),
    "GET, OPTIONS",
  );
});

Deno.test("OPTIONS request returns 204", async () => {
  const req = new Request("http://localhost:8000/", { method: "OPTIONS" });
  const res = await handler(req);

  assertEquals(res.status, 204);
  assertEquals(res.headers.get("Access-Control-Allow-Origin"), "*");
});

// URL Validation Security Tests
Deno.test("GET /raw - blocks localhost URLs (SSRF protection)", async () => {
  const req = new Request("http://localhost:8000/raw?from=http://localhost:3000");
  const res = await handler(req);

  assertEquals(res.status, 404);
  const text = await res.text();
  assertEquals(text.includes("private IP addresses"), true);
});

Deno.test("GET /raw - blocks 127.0.0.1 URLs (SSRF protection)", async () => {
  const req = new Request("http://localhost:8000/raw?from=http://127.0.0.1:8080");
  const res = await handler(req);

  assertEquals(res.status, 404);
  const text = await res.text();
  assertEquals(text.includes("private IP addresses"), true);
});

Deno.test("GET /raw - blocks AWS metadata URL (SSRF protection)", async () => {
  const req = new Request(
    "http://localhost:8000/raw?from=http://169.254.169.254/latest/meta-data/",
  );
  const res = await handler(req);

  assertEquals(res.status, 404);
  const text = await res.text();
  assertEquals(text.includes("private IP addresses"), true);
});

Deno.test("GET /raw - blocks private Class A network (10.x.x.x)", async () => {
  const req = new Request("http://localhost:8000/raw?from=http://10.0.0.1");
  const res = await handler(req);

  assertEquals(res.status, 404);
  const text = await res.text();
  assertEquals(text.includes("private IP addresses"), true);
});

Deno.test("GET /raw - blocks private Class B network (172.16-31.x.x)", async () => {
  const req = new Request("http://localhost:8000/raw?from=http://172.16.0.1");
  const res = await handler(req);

  assertEquals(res.status, 404);
  const text = await res.text();
  assertEquals(text.includes("private IP addresses"), true);
});

Deno.test("GET /raw - blocks private Class C network (192.168.x.x)", async () => {
  const req = new Request("http://localhost:8000/raw?from=http://192.168.1.1");
  const res = await handler(req);

  assertEquals(res.status, 404);
  const text = await res.text();
  assertEquals(text.includes("private IP addresses"), true);
});

Deno.test("GET /raw - blocks file:// protocol", async () => {
  const req = new Request(
    "http://localhost:8000/raw?from=file:///etc/passwd",
  );
  const res = await handler(req);

  assertEquals(res.status, 404);
  const text = await res.text();
  assertEquals(text.includes("Unsupported protocol"), true);
});

Deno.test("GET /raw - rejects invalid URL format", async () => {
  const req = new Request("http://localhost:8000/raw?from=not-a-valid-url");
  const res = await handler(req);

  assertEquals(res.status, 404);
  const text = await res.text();
  assertEquals(text.includes("Invalid URL format"), true);
});
