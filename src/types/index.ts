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
