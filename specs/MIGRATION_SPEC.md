# Migration Specification: Node.js to Deno Deploy

## Overview

This document outlines the migration strategy for converting the extract-content service from
Node.js/Express to Deno Deploy using native Deno APIs.

## Migration Goals

1. Full migration to Deno native APIs (no Node.js compatibility mode)
2. Modern, performant implementation using web standards
3. Smaller bundle size and faster cold starts
4. Maintain API compatibility with existing consumers
5. Improve error handling and logging
6. Enable easy deployment to Deno Deploy

## Current Stack vs Target Stack

### Current (Node.js)

- Runtime: Node.js
- Framework: Express 4.16.3
- HTTP Client: request 2.85.0 (deprecated)
- HTML Parser: jsdom 11.6.2
- Middleware: body-parser 1.18.2

### Target (Deno)

- Runtime: Deno 2.5+ (latest stable)
- Framework: Native Deno.serve() HTTP server
- HTTP Client: Native fetch API (web standard)
- HTML Parser: deno-dom (@b-fuze/deno-dom from JSR)
- Middleware: Custom middleware using native APIs
- Configuration: deno.json for project configuration

## Migration Strategy

### Phase 1: Specification (Current)

- [x] Define migration approach
- [x] Create specification documents
- [ ] Review and approve specifications
- [ ] Answer clarification questions

### Phase 2: Core Infrastructure

- [ ] Set up Deno project structure
- [ ] Create main.ts entry point with native HTTP server
- [ ] Implement CORS middleware
- [ ] Implement request routing system
- [ ] Set up import maps for dependencies

### Phase 3: Module Migration

- [ ] Migrate extract.js to extract.ts
  - Replace request with fetch
  - Replace jsdom with deno-dom
  - Modernize error handling
- [ ] Migrate html.js to html.ts
  - Same replacements as extract
- [ ] Migrate raw.js to raw.ts
  - Replace request with fetch

### Phase 4: Configuration & Deployment

- [ ] Create deno.json configuration file
- [ ] Configure import maps in deno.json
- [ ] Set up environment variable handling
- [ ] Create GitHub Actions workflow for auto-deployment
- [ ] Configure Deno Deploy project settings

### Phase 5: Testing & Documentation

- [ ] Create test suite
- [ ] Update README with Deno instructions
- [ ] Create deployment guide
- [ ] Performance testing

### Phase 6: Deployment

- [ ] Deploy to Deno Deploy
- [ ] Verify all endpoints
- [ ] Monitor performance
- [ ] Document any issues

## Key Technical Changes

### 1. Module System

- **From:** CommonJS (`require`, `module.exports`)
- **To:** ES Modules (`import`, `export`)

### 2. HTTP Server

- **From:** Express framework with app.listen()
- **To:** Deno.serve() with native request handlers (modern Deno 2.x API)
- **Example:**
  ```typescript
  Deno.serve({ port: 8000 }, (req: Request) => {
    return new Response("Hello");
  });
  ```

### 3. HTTP Requests

- **From:** request library (callback-based)
- **To:** fetch API (Promise-based)

### 4. HTML Parsing

- **From:** jsdom
- **To:** deno-dom (import from jsr:@b-fuze/deno-dom)
- **Note:** Fully compatible querySelector/querySelectorAll API

### 5. Query Parameter Parsing

- **From:** Express req.query
- **To:** URL.searchParams or URLPattern

### 6. Response Handling

- **From:** Express res.status().send()
- **To:** new Response() with proper headers

## Breaking Changes

**None expected** - The API surface should remain identical from the consumer perspective.

## Risks & Mitigation

### Risk 1: deno-dom Compatibility

- **Risk:** deno-dom might not support all jsdom features
- **Mitigation:** Test CSS selector queries thoroughly; jsdom API is well-standardized

### Risk 2: Fetch API Limitations

- **Risk:** Different error handling than request library
- **Mitigation:** Comprehensive error handling with try-catch and proper status codes

### Risk 3: Cold Start Performance

- **Risk:** Deno Deploy cold starts might be slower
- **Mitigation:** Deno Deploy is optimized for this; benchmark and monitor

### Risk 4: Deployment Learning Curve

- **Risk:** Team unfamiliar with Deno Deploy
- **Mitigation:** Detailed documentation and deployment guides in specs

## Success Criteria

1. All three endpoints (/, /html, /raw) function identically to Node.js version
2. No breaking changes to API contract
3. Successful deployment to Deno Deploy
4. Response times within 10% of current implementation
5. Clear documentation for deployment and maintenance

## Timeline

- Specification: 1 day
- Implementation: 2-3 days
- Testing: 1 day
- Deployment: 1 day
- **Total:** ~1 week

## Rollback Plan

If migration fails:

1. Keep master branch with Node.js version intact
2. Deno version in separate branch (deno-deploy-version)
3. Can abandon or iterate without affecting production
4. No deployment until fully tested and verified

## Questions for Review

1. Should we maintain backward compatibility with old jsdom version behavior, or can we modernize?
2. Do we need request/response logging middleware?
3. Should we add rate limiting or request validation?
4. Do we want to add TypeScript strict mode?
5. Should we implement request timeouts?
