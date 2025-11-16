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
 * Parse selector to check for attribute extraction syntax (selector@attribute)
 */
function parseSelector(selector: string): { selector: string; attribute?: string } {
  const match = selector.match(/^(.+)@(\w+)$/);
  if (match) {
    return {
      selector: match[1].trim(),
      attribute: match[2],
    };
  }
  return { selector };
}

/**
 * Extract text content from elements matching a CSS selector
 * Supports attribute extraction with @attribute syntax (e.g., "a@href", "img@src")
 * Returns single string if one element, array if multiple, empty string if none
 */
export function extractText(doc: Document, selector: string): string | string[] {
  const { selector: cssSelector, attribute } = parseSelector(selector);

  const elements = doc.querySelectorAll(cssSelector);

  if (elements.length === 0) {
    return "";
  }

  const texts = Array.from(elements).map((el) => {
    if (attribute) {
      // Extract attribute value
      return (el as Element).getAttribute(attribute) || "";
    }
    // Extract text content
    return el.textContent?.trim() || "";
  });

  return texts.length === 1 ? texts[0] : texts;
}

/**
 * Extract HTML content (outerHTML) from elements matching a CSS selector
 * Supports attribute extraction with @attribute syntax (e.g., "a@href", "img@src")
 * Returns single string if one element, array if multiple, empty string if none
 */
export function extractHtml(doc: Document, selector: string): string | string[] {
  const { selector: cssSelector, attribute } = parseSelector(selector);

  const elements = doc.querySelectorAll(cssSelector);

  if (elements.length === 0) {
    return "";
  }

  const htmls = Array.from(elements).map((el) => {
    if (attribute) {
      // Extract attribute value
      return (el as Element).getAttribute(attribute) || "";
    }
    // Extract outerHTML
    // deno-dom Element has outerHTML property
    return (el as Element & { outerHTML: string }).outerHTML || "";
  });

  return htmls.length === 1 ? htmls[0] : htmls;
}
