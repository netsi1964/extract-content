# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Project Overview

Extract-content is a web scraping service that provides endpoints for extracting data from websites
using CSS selectors. The service acts as a web scraping proxy that fetches HTML from URLs and
extracts specific content based on provided selectors.

## Branches

### master (Node.js Version)

The original Node.js/Express implementation. Stable and production-ready.

### deno-deploy-version (Deno 2.5 Version)

**Active Development Branch** - Modern rewrite using Deno 2.5+ with native web standards.

**Important:** When working on this branch, always use Context7 MCP to ensure you're using the
latest Deno 2.5+ APIs and documentation.

## Commands

### Node.js Version (master branch)

- `npm start` - Start the server (runs on port 3000 or PORT env variable)
- `node app.js` - Alternative way to start the server

### Deno Version (deno-deploy-version branch)

- `deno task start` - Start the Deno server (production mode)
- `deno task dev` - Start with hot reload (development mode)
- `deno task test` - Run test suite
- `deno task check` - Type check the code
- `deno fmt` - Format code
- `deno lint` - Lint code

## Architecture

### Node.js Version (master branch)

The application follows a simple modular structure:

- `app.js` - Main application entry point, sets up Express server with CORS headers and body parsing
- `routes/routes.js` - Route definitions mapping HTTP endpoints to handler modules
- `modules/` - Handler modules for each endpoint:
  - `extract.js` - Main extraction endpoint (`/`) that extracts text content using CSS selectors
  - `html.js` - HTML extraction endpoint (`/html`) that returns HTML markup instead of text
  - `raw.js` - Raw proxy endpoint (`/raw`) that returns the full HTML without extraction

**Key Dependencies:**

- `express` - Web framework
- `jsdom` - DOM manipulation for HTML parsing and selector queries
- `request` - HTTP client for fetching external URLs
- `body-parser` - Request body parsing middleware

### Deno Version (deno-deploy-version branch)

Modern TypeScript implementation using Deno 2.5+ and web standards:

- `main.ts` - Application entry point, bootstraps the server
- `src/server.ts` - HTTP server using native `Deno.serve()` API
- `src/router.ts` - Request routing logic
- `src/middleware/` - Middleware components (CORS, logging)
- `src/handlers/` - Handler modules for each endpoint:
  - `extract.ts` - Text extraction using CSS selectors
  - `html.ts` - HTML extraction endpoint
  - `raw.ts` - Raw proxy endpoint
- `src/utils/` - Shared utilities (fetcher, parser, response builders)
- `src/types/` - TypeScript type definitions
- `deno.json` - Deno configuration and import maps

**Key Dependencies:**

- **Runtime:** Deno 2.5+ (native)
- **HTTP Server:** Native `Deno.serve()` API
- **HTTP Client:** Native `fetch()` API (web standard)
- **HTML Parser:** deno-dom (`jsr:@b-fuze/deno-dom`)
- **No external frameworks** - Uses native web standards

## API Endpoints

- `GET /` - Extract text content using CSS selectors (requires `from` URL and `extract` JSON
  parameters)
- `GET /html` - Extract HTML content using CSS selectors (requires `from` URL, `extract` JSON is
  optional)
- `GET /raw` - Proxy endpoint that returns raw HTML (requires only `from` URL parameter)

## Data Flow

1. Client makes request with `from` (target URL) and optionally `extract` (JSON with name:selector
   pairs)
2. Service fetches HTML from the target URL using the `request` library
3. HTML is parsed using JSDOM to create a queryable document
4. CSS selectors are applied to extract specific content
5. Results are returned as JSON with the specified names as keys

## Error Handling

All modules include error handling for invalid URLs, network failures, and JSON parsing errors.
Error responses include relevant context about the failure point and input parameters.

## Deno Migration (deno-deploy-version branch)

### Specification-Driven Development

This branch follows a spec-driven development approach. All specifications are located in the
`specs/` directory:

- **specs/MIGRATION_SPEC.md** - Migration strategy from Node.js to Deno 2.5
- **specs/API_SPEC.md** - Complete API endpoint specifications
- **specs/ARCHITECTURE_SPEC.md** - Technical architecture and design decisions
- **specs/DEPLOYMENT_SPEC.md** - Deployment guide for Deno Deploy
- **specs/TESTING_SPEC.md** - Comprehensive testing strategy

**Important:** Always review these specs before implementing features or making changes.

### Development Guidelines for Deno Version

1. **Use Context7 MCP Server:** Always use Context7 to get latest Deno 2.5+ documentation
   - Query for `/websites/deno` for runtime APIs
   - Query for `/websites/deno_deploy` for deployment info
   - Query for `/websites/jsr_io_b-fuze_deno-dom` for DOM parsing

2. **Follow Web Standards:**
   - Use native `fetch()` for HTTP requests
   - Use `Request` and `Response` objects
   - Use `URL` and `URLSearchParams` for URL parsing
   - Use native `Headers` API

3. **TypeScript Strict Mode:**
   - All code must pass `deno check`
   - Use proper type definitions
   - No `any` types unless absolutely necessary

4. **Testing:**
   - Write tests alongside code
   - Run `deno test` before committing
   - Maintain test coverage above 80%

5. **Code Quality:**
   - Run `deno fmt` before committing
   - Run `deno lint` and fix all issues
   - Follow project conventions in ARCHITECTURE_SPEC.md

### Deployment

- **Platform:** Deno Deploy
- **Method:** GitHub integration (automatic deployment on push)
- **CI/CD:** GitHub Actions workflow in `.github/workflows/deploy.yml`
- **Monitoring:** Deno Deploy dashboard at https://dash.deno.com

### Migration Status

- [x] Specifications complete
- [ ] Implementation in progress
- [ ] Testing in progress
- [ ] Deployment pending
- [ ] Production migration pending
