# extract-content

A lightweight web scraping service that extracts data from any website using CSS selectors.
Available in both Node.js and Deno versions.

## 🚀 Quick Start

### Deno Version (Recommended)

```bash
# Start the server
deno task start

# Or with hot reload for development
deno task dev

# Run tests
deno test --allow-net --allow-env
```

### Node.js Version (Legacy)

```bash
npm start
```

## 📖 Resources

- **Interactive Demo**: [Try it on CodePen](https://codepen.io/netsi1964/pen/XEYggj/)
- **Tutorial Series**:
  [Building a content extraction endpoint](https://medium.com/@netsi1964/lets-build-a-content-extract-endpoint-part-1-27d0aceda31)
- **Example Pen**: [See it in action](https://codepen.io/netsi1964/details/mxLqPG/)

## 📡 API Endpoints

### `GET /` - Extract Text Content

Extracts **text content** from HTML elements using CSS selectors.

**Parameters:**

| Parameter | Description                            | Required |
| --------- | -------------------------------------- | -------- |
| `from`    | URL to fetch content from              | Yes      |
| `extract` | JSON object mapping names to selectors | Yes      |

**Response:** JSON object with extracted text

### `GET /html` - Extract HTML Content

Extracts **HTML markup** or returns raw HTML from a page.

**Parameters:**

| Parameter | Description                            | Required |
| --------- | -------------------------------------- | -------- |
| `from`    | URL to fetch content from              | Yes      |
| `extract` | JSON object mapping names to selectors | No       |

**Response:** JSON object with extracted HTML (or `{ html: rawHtml }` if no extract parameter)

### `GET /raw` - Raw Proxy

Returns the raw HTML from the target URL (acts as a simple proxy).

**Parameters:**

| Parameter | Description               | Required |
| --------- | ------------------------- | -------- |
| `from`    | URL to fetch content from | Yes      |

**Response:** Raw HTML content

## 💡 Examples

All examples below use `localhost:8000`. Start the server first with `deno task dev` or
`deno task start`.

> **Note:** The `extract` parameter must be URL-encoded. Use `encodeURIComponent()` in JavaScript or
> any URL encoder.

### Example 1: Extract Wikipedia Article Title and First Paragraph

Extract the title and introduction from a Wikipedia article:

```javascript
// What we want to extract
const extract = {
  "title": "h1",
  "intro": ".mw-parser-output > p",
};

// URL-encode it
const encoded = encodeURIComponent(JSON.stringify(extract));
// Result: %7B%22title%22%3A%22h1%22%2C%22intro%22%3A%22.mw-parser-output%20%3E%20p%22%7D
```

**Try it:**
[Extract from Wikipedia - Deno](http://localhost:8000/?from=https://en.wikipedia.org/wiki/Deno_(software)&extract=%7B%22title%22%3A%22h1%22%2C%22intro%22%3A%22.mw-parser-output%20%3E%20p%22%7D)

### Example 2: Extract GitHub Repository Info

Get repository name, description, and star count:

```javascript
const extract = {
  "repoName": "h1 strong a",
  "description": "p.f4",
  "stars": "#repo-stars-counter-star",
};
```

**Try it:**
[Extract from GitHub - Deno Repo](http://localhost:8000/?from=https://github.com/denoland/deno&extract=%7B%22repoName%22%3A%22h1%20strong%20a%22%2C%22description%22%3A%22p.f4%22%2C%22stars%22%3A%22%23repo-stars-counter-star%22%7D)

### Example 3: Extract Stack Overflow Question

Get question title, votes, and tags:

```javascript
const extract = {
  "question": "h1 a",
  "votes": ".js-vote-count",
  "tags": ".post-tag",
};
```

**Try it:**
[Extract from Stack Overflow](http://localhost:8000/?from=https://stackoverflow.com/questions/1&extract=%7B%22question%22%3A%22h1%20a%22%2C%22votes%22%3A%22.js-vote-count%22%2C%22tags%22%3A%22.post-tag%22%7D)

### Example 4: Extract News Headlines

Get all headlines from a news site (returns an array):

```javascript
const extract = {
  "headlines": "h2 a",
  "timestamps": "time",
};
```

**Try it:**
[Extract from Hacker News](http://localhost:8000/?from=https://news.ycombinator.com&extract=%7B%22headlines%22%3A%22.titleline%20%3E%20a%22%2C%22scores%22%3A%22.score%22%7D)

### Example 5: Extract HTML Instead of Text

Get the actual HTML markup of specific elements:

**Try it:**
[Extract HTML from Wikipedia](http://localhost:8000/html?from=https://en.wikipedia.org/wiki/Web_scraping&extract=%7B%22infobox%22%3A%22.infobox%22%2C%22firstPara%22%3A%22.mw-parser-output%20%3E%20p%22%7D)

### Example 6: Get Entire Page HTML

No extraction, just fetch the raw HTML:

**Try it:** [Get raw HTML from example.com](http://localhost:8000/html?from=https://example.com)

### Example 7: Use Raw Proxy

Bypass CORS and fetch any page:

**Try it:** [Proxy example.com](http://localhost:8000/raw?from=https://example.com)

### Example 8: Extract Reddit Post Info

```javascript
const extract = {
  "title": "h1",
  "author": "[data-testid='post-author']",
  "upvotes": "[data-testid='vote-button-up']",
};
```

**Try it:**
[Extract from Reddit](http://localhost:8000/?from=https://old.reddit.com/r/programming&extract=%7B%22titles%22%3A%22.title%20%3E%20a%22%2C%22domain%22%3A%22.domain%22%7D)

## 🔧 Response Format

### Single Element

If a selector matches **one element**, returns a string:

```json
{
  "title": "Deno - A modern runtime for JavaScript and TypeScript"
}
```

### Multiple Elements

If a selector matches **multiple elements**, returns an array:

```json
{
  "headlines": [
    "First headline",
    "Second headline",
    "Third headline"
  ]
}
```

### No Match

If a selector matches **no elements**, returns an empty string:

```json
{
  "missing": ""
}
```

## 🛠️ Building Extract URLs

### JavaScript Helper Function

```javascript
function buildExtractUrl(baseUrl, from, extract) {
  const params = new URLSearchParams({
    from: from,
    extract: JSON.stringify(extract),
  });
  return `${baseUrl}?${params.toString()}`;
}

// Usage
const url = buildExtractUrl(
  "http://localhost:8000",
  "https://github.com/denoland/deno",
  { stars: "#repo-stars-counter-star" },
);
```

### Command Line (curl)

```bash
# Extract title from Wikipedia
curl "http://localhost:8000/?from=https://en.wikipedia.org/wiki/Deno_(software)&extract=%7B%22title%22%3A%22h1%22%7D"

# Get raw HTML
curl "http://localhost:8000/raw?from=https://example.com"
```

## 📚 Documentation

For complete documentation, see the `specs/` directory:

- **[API Specification](specs/API_SPEC.md)** - Complete API documentation
- **[Architecture](specs/ARCHITECTURE_SPEC.md)** - Technical architecture
- **[Deployment](specs/DEPLOYMENT_SPEC.md)** - Deployment guide
- **[Testing](specs/TESTING_SPEC.md)** - Testing strategy

## 🤝 Contributing

This project follows **Specification-Driven Development** (SDD). Please review the specs before
contributing.

## 📄 License

Created by Sten Hougaard, March 2018. [@netsi1964](https://twitter.com/netsi1964)
