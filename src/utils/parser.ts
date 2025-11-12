import { type Document, DOMParser, type Element } from "@deno-dom";

/**
 * Parse HTML string into a Document object
 */
export function parseHtml(html: string): Document {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  if (!doc) {
    throw new Error("Failed to parse HTML");
  }

  return doc;
}

/**
 * Extract text content from elements matching a CSS selector
 * Returns single string if one element, array if multiple, empty string if none
 */
export function extractText(doc: Document, selector: string): string | string[] {
  const elements = doc.querySelectorAll(selector);

  if (elements.length === 0) {
    return "";
  }

  const texts = Array.from(elements).map((el) => el.textContent?.trim() || "");

  return texts.length === 1 ? texts[0] : texts;
}

/**
 * Extract HTML content (outerHTML) from elements matching a CSS selector
 * Returns single string if one element, array if multiple, empty string if none
 */
export function extractHtml(doc: Document, selector: string): string | string[] {
  const elements = doc.querySelectorAll(selector);

  if (elements.length === 0) {
    return "";
  }

  const htmls = Array.from(elements).map((el) => {
    // deno-dom Element has outerHTML property
    return (el as Element & { outerHTML: string }).outerHTML || "";
  });

  return htmls.length === 1 ? htmls[0] : htmls;
}
