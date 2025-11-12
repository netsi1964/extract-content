import { assertEquals } from "jsr:@std/assert@^1.0.10";
import { extractHtml, extractText, parseHtml } from "../../src/utils/parser.ts";

Deno.test("parseHtml - parses valid HTML", () => {
  const html = "<html><body><h1>Test</h1></body></html>";
  const doc = parseHtml(html);

  assertEquals(doc.querySelector("h1")?.textContent, "Test");
});

Deno.test("extractText - single element returns string", () => {
  const html = "<html><body><h1>Hello World</h1></body></html>";
  const doc = parseHtml(html);
  const result = extractText(doc, "h1");

  assertEquals(result, "Hello World");
});

Deno.test("extractText - multiple elements return array", () => {
  const html = "<html><body><p>First</p><p>Second</p><p>Third</p></body></html>";
  const doc = parseHtml(html);
  const result = extractText(doc, "p");

  assertEquals(result, ["First", "Second", "Third"]);
});

Deno.test("extractText - no match returns empty string", () => {
  const html = "<html><body><h1>Test</h1></body></html>";
  const doc = parseHtml(html);
  const result = extractText(doc, "p");

  assertEquals(result, "");
});

Deno.test("extractText - trims whitespace", () => {
  const html = "<html><body><p>  Hello  </p></body></html>";
  const doc = parseHtml(html);
  const result = extractText(doc, "p");

  assertEquals(result, "Hello");
});

Deno.test("extractHtml - single element returns string", () => {
  const html = "<html><body><h1>Test</h1></body></html>";
  const doc = parseHtml(html);
  const result = extractHtml(doc, "h1");

  assertEquals(result, "<h1>Test</h1>");
});

Deno.test("extractHtml - multiple elements return array", () => {
  const html = "<html><body><p>First</p><p>Second</p></body></html>";
  const doc = parseHtml(html);
  const result = extractHtml(doc, "p");

  assertEquals(result, ["<p>First</p>", "<p>Second</p>"]);
});

Deno.test("extractHtml - no match returns empty string", () => {
  const html = "<html><body><h1>Test</h1></body></html>";
  const doc = parseHtml(html);
  const result = extractHtml(doc, "p");

  assertEquals(result, "");
});
