import { assertEquals } from "jsr:@std/assert@^1.0.10";
import { errorResponse, jsonResponse, textResponse } from "../../src/utils/response.ts";

Deno.test("jsonResponse - creates valid JSON response", () => {
  const data = { foo: "bar", count: 42 };
  const response = jsonResponse(data);

  assertEquals(response.status, 200);
  assertEquals(response.headers.get("content-type"), "application/json");
});

Deno.test("jsonResponse - supports custom status code", () => {
  const data = { error: true };
  const response = jsonResponse(data, 404);

  assertEquals(response.status, 404);
});

Deno.test("errorResponse - creates plain text error", () => {
  const response = errorResponse("Something went wrong");

  assertEquals(response.status, 404);
  assertEquals(response.headers.get("content-type"), "text/plain");
});

Deno.test("errorResponse - supports custom status code", () => {
  const response = errorResponse("Server error", 500);

  assertEquals(response.status, 500);
});

Deno.test("textResponse - creates plain text response", () => {
  const response = textResponse("Hello world");

  assertEquals(response.status, 200);
  assertEquals(response.headers.get("content-type"), "text/plain");
});
