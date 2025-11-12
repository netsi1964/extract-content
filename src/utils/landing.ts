/**
 * Generate HTML landing page with documentation and examples
 */
export function generateLandingPage(baseUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>extract-content - Web Scraping API</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      border-radius: 10px;
      margin-bottom: 30px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    h1 { font-size: 2.5em; margin-bottom: 10px; }
    .subtitle { font-size: 1.2em; opacity: 0.9; }
    .section {
      background: white;
      padding: 30px;
      margin-bottom: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h2 {
      color: #667eea;
      margin-bottom: 20px;
      font-size: 1.8em;
      border-bottom: 2px solid #667eea;
      padding-bottom: 10px;
    }
    h3 {
      color: #764ba2;
      margin: 20px 0 10px 0;
      font-size: 1.3em;
    }
    .endpoint {
      background: #f8f9fa;
      padding: 15px;
      margin: 15px 0;
      border-left: 4px solid #667eea;
      border-radius: 5px;
    }
    code {
      background: #f4f4f4;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      color: #e83e8c;
    }
    pre {
      background: #2d2d2d;
      color: #f8f8f2;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      margin: 10px 0;
    }
    pre code {
      background: none;
      color: #f8f8f2;
      padding: 0;
    }
    .example {
      background: #e3f2fd;
      padding: 15px;
      margin: 15px 0;
      border-radius: 5px;
      border-left: 4px solid #2196f3;
    }
    .try-link {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 8px 16px;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 10px;
      transition: background 0.3s;
    }
    .try-link:hover {
      background: #5568d3;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background: #667eea;
      color: white;
    }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      background: #28a745;
      color: white;
      border-radius: 3px;
      font-size: 0.85em;
      font-weight: bold;
    }
    .badge.optional { background: #6c757d; }
    footer {
      text-align: center;
      padding: 30px;
      color: #666;
      margin-top: 40px;
    }
    .resources {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin: 15px 0;
    }
    .resource-link {
      display: inline-block;
      padding: 8px 12px;
      background: #764ba2;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-size: 0.9em;
      transition: background 0.3s;
    }
    .resource-link:hover {
      background: #5a3680;
    }
  </style>
</head>
<body>
  <header>
    <h1>🚀 extract-content</h1>
    <p class="subtitle">A lightweight web scraping API that extracts data from any website using CSS selectors</p>
  </header>

  <div class="section">
    <h2>📖 Resources</h2>
    <div class="resources">
      <a href="https://codepen.io/netsi1964/pen/XEYggj/" class="resource-link" target="_blank">Interactive Demo</a>
      <a href="https://medium.com/@netsi1964/lets-build-a-content-extract-endpoint-part-1-27d0aceda31" class="resource-link" target="_blank">Tutorial Series</a>
      <a href="https://codepen.io/netsi1964/details/mxLqPG/" class="resource-link" target="_blank">Example Pen</a>
      <a href="https://github.com/netsi1964/extract-content" class="resource-link" target="_blank">GitHub Repo</a>
    </div>
  </div>

  <div class="section">
    <h2>📡 API Endpoints</h2>

    <div class="endpoint">
      <h3>GET / - Extract Text Content</h3>
      <p>Extracts <strong>text content</strong> from HTML elements using CSS selectors.</p>
      <table>
        <tr>
          <th>Parameter</th>
          <th>Description</th>
          <th>Required</th>
        </tr>
        <tr>
          <td><code>from</code></td>
          <td>URL to fetch content from</td>
          <td><span class="badge">Yes</span></td>
        </tr>
        <tr>
          <td><code>extract</code></td>
          <td>JSON object mapping names to selectors</td>
          <td><span class="badge">Yes</span></td>
        </tr>
      </table>
    </div>

    <div class="endpoint">
      <h3>GET /html - Extract HTML Content</h3>
      <p>Extracts <strong>HTML markup</strong> or returns raw HTML from a page.</p>
      <table>
        <tr>
          <th>Parameter</th>
          <th>Description</th>
          <th>Required</th>
        </tr>
        <tr>
          <td><code>from</code></td>
          <td>URL to fetch content from</td>
          <td><span class="badge">Yes</span></td>
        </tr>
        <tr>
          <td><code>extract</code></td>
          <td>JSON object mapping names to selectors</td>
          <td><span class="badge optional">No</span></td>
        </tr>
      </table>
    </div>

    <div class="endpoint">
      <h3>GET /raw - Raw Proxy</h3>
      <p>Returns the raw HTML from the target URL (acts as a simple proxy).</p>
      <table>
        <tr>
          <th>Parameter</th>
          <th>Description</th>
          <th>Required</th>
        </tr>
        <tr>
          <td><code>from</code></td>
          <td>URL to fetch content from</td>
          <td><span class="badge">Yes</span></td>
        </tr>
      </table>
    </div>
  </div>

  <div class="section">
    <h2>💡 Examples</h2>

    <div class="example">
      <h3>Example 1: Extract Wikipedia Article Title and First Paragraph</h3>
      <pre><code>const extract = {
  "title": "h1",
  "intro": ".mw-parser-output > p"
};</code></pre>
      <a href="${baseUrl}/?from=https://en.wikipedia.org/wiki/Deno_(software)&extract=%7B%22title%22%3A%22h1%22%2C%22intro%22%3A%22.mw-parser-output%20%3E%20p%22%7D" class="try-link" target="_blank">Try it →</a>
    </div>

    <div class="example">
      <h3>Example 2: Extract GitHub Repository Info</h3>
      <pre><code>const extract = {
  "repoName": "h1 strong a",
  "description": "p.f4",
  "stars": "#repo-stars-counter-star"
};</code></pre>
      <a href="${baseUrl}/?from=https://github.com/denoland/deno&extract=%7B%22repoName%22%3A%22h1%20strong%20a%22%2C%22description%22%3A%22p.f4%22%2C%22stars%22%3A%22%23repo-stars-counter-star%22%7D" class="try-link" target="_blank">Try it →</a>
    </div>

    <div class="example">
      <h3>Example 3: Extract Stack Overflow Question</h3>
      <pre><code>const extract = {
  "question": "h1 a",
  "votes": ".js-vote-count",
  "tags": ".post-tag"
};</code></pre>
      <a href="${baseUrl}/?from=https://stackoverflow.com/questions/1&extract=%7B%22question%22%3A%22h1%20a%22%2C%22votes%22%3A%22.js-vote-count%22%2C%22tags%22%3A%22.post-tag%22%7D" class="try-link" target="_blank">Try it →</a>
    </div>

    <div class="example">
      <h3>Example 4: Extract Hacker News Headlines</h3>
      <pre><code>const extract = {
  "headlines": ".titleline > a",
  "scores": ".score"
};</code></pre>
      <a href="${baseUrl}/?from=https://news.ycombinator.com&extract=%7B%22headlines%22%3A%22.titleline%20%3E%20a%22%2C%22scores%22%3A%22.score%22%7D" class="try-link" target="_blank">Try it →</a>
    </div>

    <div class="example">
      <h3>Example 5: Extract Reddit Post Titles</h3>
      <pre><code>const extract = {
  "titles": ".title > a",
  "domain": ".domain"
};</code></pre>
      <a href="${baseUrl}/?from=https://old.reddit.com/r/programming&extract=%7B%22titles%22%3A%22.title%20%3E%20a%22%2C%22domain%22%3A%22.domain%22%7D" class="try-link" target="_blank">Try it →</a>
    </div>

    <div class="example">
      <h3>Example 6: Extract HTML Instead of Text</h3>
      <p>Get the actual HTML markup of specific elements:</p>
      <a href="${baseUrl}/html?from=https://en.wikipedia.org/wiki/Web_scraping&extract=%7B%22infobox%22%3A%22.infobox%22%2C%22firstPara%22%3A%22.mw-parser-output%20%3E%20p%22%7D" class="try-link" target="_blank">Try it →</a>
    </div>

    <div class="example">
      <h3>Example 7: Get Entire Page HTML</h3>
      <p>No extraction, just fetch the raw HTML:</p>
      <a href="${baseUrl}/html?from=https://example.com" class="try-link" target="_blank">Try it →</a>
    </div>

    <div class="example">
      <h3>Example 8: Use Raw Proxy</h3>
      <p>Bypass CORS and fetch any page:</p>
      <a href="${baseUrl}/raw?from=https://example.com" class="try-link" target="_blank">Try it →</a>
    </div>
  </div>

  <div class="section">
    <h2>🛠️ Building Extract URLs</h2>

    <h3>JavaScript Helper Function</h3>
    <pre><code>function buildExtractUrl(baseUrl, from, extract) {
  const params = new URLSearchParams({
    from: from,
    extract: JSON.stringify(extract)
  });
  return \`\${baseUrl}?\${params.toString()}\`;
}

// Usage
const url = buildExtractUrl(
  '${baseUrl}',
  'https://github.com/denoland/deno',
  { stars: '#repo-stars-counter-star' }
);</code></pre>

    <h3>Command Line (curl)</h3>
    <pre><code># Extract title from Wikipedia
curl "${baseUrl}/?from=https://en.wikipedia.org/wiki/Deno_(software)&extract=%7B%22title%22%3A%22h1%22%7D"

# Get raw HTML
curl "${baseUrl}/raw?from=https://example.com"</code></pre>
  </div>

  <div class="section">
    <h2>🔧 Response Format</h2>

    <h3>Single Element</h3>
    <p>If a selector matches <strong>one element</strong>, returns a string:</p>
    <pre><code>{
  "title": "Deno - A modern runtime for JavaScript and TypeScript"
}</code></pre>

    <h3>Multiple Elements</h3>
    <p>If a selector matches <strong>multiple elements</strong>, returns an array:</p>
    <pre><code>{
  "headlines": [
    "First headline",
    "Second headline",
    "Third headline"
  ]
}</code></pre>

    <h3>No Match</h3>
    <p>If a selector matches <strong>no elements</strong>, returns an empty string:</p>
    <pre><code>{
  "missing": ""
}</code></pre>
  </div>

  <footer>
    <p>Created by <a href="https://twitter.com/netsi1964" target="_blank">@netsi1964</a>, March 2018</p>
    <p>Powered by Deno 🦕 | <a href="https://github.com/netsi1964/extract-content" target="_blank">View on GitHub</a></p>
  </footer>
</body>
</html>`;
}
