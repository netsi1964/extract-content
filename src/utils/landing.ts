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
      max-width: 1000px;
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
    .playground {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 20px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #333;
    }
    input, textarea {
      width: 100%;
      padding: 12px;
      border: 2px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
      font-family: 'Courier New', monospace;
      transition: border-color 0.3s;
    }
    input:focus, textarea:focus {
      outline: none;
      border-color: #667eea;
    }
    textarea {
      min-height: 100px;
      resize: vertical;
    }
    .btn {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      font-size: 16px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.3s;
      margin-right: 10px;
    }
    .btn:hover {
      background: #5568d3;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    .btn:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
    }
    .btn-small {
      padding: 6px 14px;
      font-size: 14px;
    }
    .btn-secondary {
      background: #764ba2;
    }
    .btn-secondary:hover {
      background: #5a3680;
    }
    .response-container {
      margin-top: 20px;
      display: none;
    }
    .response-container.active {
      display: block;
    }
    .response-box {
      background: #2d2d2d;
      color: #f8f8f2;
      padding: 20px;
      border-radius: 5px;
      overflow-x: auto;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.5;
      max-height: 500px;
      overflow-y: auto;
    }
    .response-box pre {
      margin: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .loading {
      display: none;
      color: #667eea;
      font-weight: 600;
      margin-top: 10px;
    }
    .loading.active {
      display: block;
    }
    .error {
      background: #fee;
      border-left: 4px solid #f44;
      padding: 15px;
      margin-top: 20px;
      border-radius: 5px;
      color: #c33;
      display: none;
    }
    .error.active {
      display: block;
    }
    .curl-container {
      background: #2d2d2d;
      border-radius: 5px;
      padding: 15px;
      margin-top: 20px;
      display: none;
      position: relative;
    }
    .curl-container.active {
      display: block;
    }
    .curl-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .curl-title {
      color: #f8f8f2;
      font-weight: 600;
      font-size: 0.9em;
    }
    .copy-btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.85em;
      font-weight: 600;
      transition: all 0.2s;
    }
    .copy-btn:hover {
      background: #5568d3;
    }
    .copy-btn.copied {
      background: #28a745;
    }
    .curl-code {
      color: #f8f8f2;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.6;
      word-wrap: break-word;
      white-space: pre-wrap;
    }
    .curl-code .curl-method {
      color: #a6e22e;
    }
    .curl-code .curl-url {
      color: #e6db74;
    }
    .example {
      background: #e3f2fd;
      padding: 20px;
      margin: 15px 0;
      border-radius: 5px;
      border-left: 4px solid #2196f3;
    }
    .example-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
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
    .endpoint {
      background: #f8f9fa;
      padding: 15px;
      margin: 15px 0;
      border-left: 4px solid #667eea;
      border-radius: 5px;
    }
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
    .json-key { color: #a6e22e; }
    .json-string { color: #e6db74; }
    .json-number { color: #ae81ff; }
    .json-boolean { color: #66d9ef; }
    .json-null { color: #f92672; }
  </style>
</head>
<body>
  <header>
    <h1>🚀 extract-content</h1>
    <p class="subtitle">A lightweight web scraping API powered by Deno that extracts data from any website using CSS selectors</p>
    <div style="margin-top: 20px;">
      <a href="/tutorial" style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(249, 115, 22, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(249, 115, 22, 0.3)'">
        📚 View Interactive Tutorial
      </a>
    </div>
  </header>

  <div class="section playground">
    <h2 style="color: #333; border-color: #333;">🎮 Interactive Playground</h2>
    <form id="playgroundForm">
      <div class="form-group">
        <label for="fromUrl">From URL:</label>
        <input
          type="text"
          id="fromUrl"
          placeholder="https://en.wikipedia.org/wiki/Web_scraping"
          value="https://en.wikipedia.org/wiki/Deno_(software)"
        >
      </div>
      <div class="form-group">
        <label for="extractJson">Extract (JSON):</label>
        <textarea
          id="extractJson"
          placeholder='{"title": "h1", "intro": ".mw-parser-output > p"}'
        >{"title": "h1", "intro": ".mw-parser-output > p"}</textarea>
      </div>
      <div class="form-group">
        <label>Response Format:</label>
        <div style="display: flex; gap: 20px; padding: 10px 0;">
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="radio" name="format" value="text" checked style="width: auto; padding: 0; cursor: pointer;">
            <span>📝 Text (JSON)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="radio" name="format" value="html" style="width: auto; padding: 0; cursor: pointer;">
            <span>🏷️ HTML Markup</span>
          </label>
        </div>
      </div>
      <button type="submit" class="btn" id="tryBtn">Try It Now</button>
      <button type="button" class="btn btn-secondary" onclick="clearPlayground()">Clear</button>
      <button type="button" class="btn btn-secondary" onclick="generateBookmarklet()" style="background: #f97316;">🔖 Get Scriptlet Link</button>
      <div class="loading" id="playgroundLoading">⏳ Fetching data...</div>
      <div class="error" id="playgroundError"></div>
    </form>
    <div class="curl-container" id="playgroundCurl">
      <div class="curl-header">
        <div class="curl-title">📋 cURL Command:</div>
        <button class="copy-btn" id="copyCurlBtn" onclick="copyCurl()">Copy</button>
      </div>
      <div class="curl-code" id="curlCode"></div>
    </div>
    <div class="curl-container" id="bookmarkletContainer">
      <div class="curl-header">
        <div class="curl-title">🔖 Bookmarklet:</div>
        <button class="copy-btn" id="copyBookmarkletBtn" onclick="copyBookmarklet()">Copy Link</button>
      </div>
      <div style="margin-bottom: 15px; color: #f8f8f2; font-size: 0.9em;">
        Drag this link to your bookmarks bar:
        <a href="#" id="bookmarkletLink" style="display: inline-block; margin-top: 8px; padding: 8px 16px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: 600;">📌 Extract Content</a>
      </div>
      <div style="color: #a0a0a0; font-size: 0.85em; line-height: 1.5;">
        💡 <strong>How to use:</strong><br>
        1. Drag the link above to your bookmarks bar<br>
        2. Visit any webpage<br>
        3. Click the bookmark to fetch and display content
      </div>
    </div>
    <div class="response-container" id="playgroundResponse">
      <h3 style="color: #333;">Response:</h3>
      <div class="response-box" id="playgroundResponseBox"></div>
    </div>
  </div>

  <div class="section">
    <h2>📖 Resources</h2>
    <div class="resources">
      <a href="https://codepen.io/netsi1964/pen/XEYggj/" class="resource-link" target="_blank">Interactive Demo</a>
      <a href="https://medium.com/@netsi1964/lets-build-a-content-extract-endpoint-part-1-27d0aceda31" class="resource-link" target="_blank">Tutorial Series</a>
      <a href="https://codepen.io/netsi1964/full/mxLqPG" class="resource-link" target="_blank">Example Pen</a>
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
      <div class="example-header">
        <h3 style="margin: 0;">Example 1: Wikipedia Article</h3>
        <button class="btn btn-small btn-secondary" onclick="runExample(1, 'https://en.wikipedia.org/wiki/Deno_(software)', {title: 'h1', intro: '.mw-parser-output > p'})">Try It</button>
      </div>
      <pre><code>const extract = {
  "title": "h1",
  "intro": ".mw-parser-output > p"
};</code></pre>
      <div class="response-container" id="response1">
        <div class="response-box" id="responseBox1"></div>
      </div>
    </div>

    <div class="example">
      <div class="example-header">
        <h3 style="margin: 0;">Example 2: GitHub Repository</h3>
        <button class="btn btn-small btn-secondary" onclick="runExample(2, 'https://github.com/denoland/deno', {repoName: 'h1 strong a', description: 'p.f4', stars: '#repo-stars-counter-star'})">Try It</button>
      </div>
      <pre><code>const extract = {
  "repoName": "h1 strong a",
  "description": "p.f4",
  "stars": "#repo-stars-counter-star"
};</code></pre>
      <div class="response-container" id="response2">
        <div class="response-box" id="responseBox2"></div>
      </div>
    </div>

    <div class="example">
      <div class="example-header">
        <h3 style="margin: 0;">Example 3: Stack Overflow</h3>
        <button class="btn btn-small btn-secondary" onclick="runExample(3, 'https://stackoverflow.com/questions/1', {question: 'h1 a', votes: '.js-vote-count', tags: '.post-tag'})">Try It</button>
      </div>
      <pre><code>const extract = {
  "question": "h1 a",
  "votes": ".js-vote-count",
  "tags": ".post-tag"
};</code></pre>
      <div class="response-container" id="response3">
        <div class="response-box" id="responseBox3"></div>
      </div>
    </div>

    <div class="example">
      <div class="example-header">
        <h3 style="margin: 0;">Example 4: Hacker News</h3>
        <button class="btn btn-small btn-secondary" onclick="runExample(4, 'https://news.ycombinator.com', {headlines: '.titleline > a', scores: '.score'})">Try It</button>
      </div>
      <pre><code>const extract = {
  "headlines": ".titleline > a",
  "scores": ".score"
};</code></pre>
      <div class="response-container" id="response4">
        <div class="response-box" id="responseBox4"></div>
      </div>
    </div>

    <div class="example">
      <div class="example-header">
        <h3 style="margin: 0;">Example 5: Reddit Posts</h3>
        <button class="btn btn-small btn-secondary" onclick="runExample(5, 'https://old.reddit.com/r/programming', {titles: '.title > a', domain: '.domain'})">Try It</button>
      </div>
      <pre><code>const extract = {
  "titles": ".title > a",
  "domain": ".domain"
};</code></pre>
      <div class="response-container" id="response5">
        <div class="response-box" id="responseBox5"></div>
      </div>
    </div>

    <div class="example">
      <div class="example-header">
        <h3 style="margin: 0;">Example 6: Extract HTML Markup</h3>
        <button class="btn btn-small btn-secondary" onclick="runExample(6, 'https://en.wikipedia.org/wiki/Web_scraping', {infobox: '.infobox', firstPara: '.mw-parser-output > p'}, '/html')">Try It</button>
      </div>
      <p>Get the actual HTML markup instead of text:</p>
      <pre><code>const extract = {
  "infobox": ".infobox",
  "firstPara": ".mw-parser-output > p"
};</code></pre>
      <div class="response-container" id="response6">
        <div class="response-box" id="responseBox6"></div>
      </div>
    </div>
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
    <p>Created by <a href="https://twitter.com/netsi1964" target="_blank">@netsi1964</a>, March 2018, updated Nov 2025</p>
    <p>Powered by Deno 🦕 | <a href="https://github.com/netsi1964/extract-content" target="_blank">View on GitHub</a></p>
  </footer>

  <script>
    const BASE_URL = '${baseUrl}';

    let currentCurlCommand = '';

    // Build cURL command
    function buildCurl(url) {
      return \`curl -k -X GET "\${url}"\`;
    }

    // Display cURL command with syntax highlighting
    function displayCurl(url) {
      const curlContainer = document.getElementById('playgroundCurl');
      const curlCode = document.getElementById('curlCode');

      currentCurlCommand = buildCurl(url);

      // First escape HTML, then apply syntax highlighting
      const escaped = currentCurlCommand
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // Format with syntax highlighting
      const formatted = escaped
        .replace(/curl/g, '<span class="curl-method">curl</span>')
        .replace(/"([^"]*)"/g, '<span class="curl-url">"$1"</span>');

      curlCode.innerHTML = formatted;
      curlContainer.classList.add('active');
    }

    // Copy cURL to clipboard
    function copyCurl() {
      navigator.clipboard.writeText(currentCurlCommand).then(() => {
        const btn = document.getElementById('copyCurlBtn');
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copied');

        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('copied');
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
      });
    }

    // Format JSON with syntax highlighting
    function formatJSON(obj) {
      const json = JSON.stringify(obj, null, 2);
      return json
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
        .replace(/: "([^"]*)"/g, ': <span class="json-string">"$1"</span>')
        .replace(/: (\\d+)/g, ': <span class="json-number">$1</span>')
        .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>')
        .replace(/: null/g, ': <span class="json-null">null</span>');
    }

    // Build API URL
    function buildUrl(from, extract, endpoint = '/') {
      const params = new URLSearchParams({
        from: from,
        extract: JSON.stringify(extract)
      });
      return \`\${BASE_URL}\${endpoint}?\${params.toString()}\`;
    }

    // Fetch and display data
    async function fetchData(url, responseBoxId, loadingId, errorId) {
      const responseBox = document.getElementById(responseBoxId);
      const loading = loadingId ? document.getElementById(loadingId) : null;
      const error = errorId ? document.getElementById(errorId) : null;

      if (loading) {
        loading.classList.add('active');
      }
      if (error) {
        error.classList.remove('active');
      }
      if (responseBox.parentElement) {
        responseBox.parentElement.classList.remove('active');
      }

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (loading) {
          loading.classList.remove('active');
        }

        responseBox.innerHTML = '<pre>' + formatJSON(data) + '</pre>';
        responseBox.parentElement.classList.add('active');
      } catch (err) {
        if (loading) {
          loading.classList.remove('active');
        }
        if (error) {
          error.textContent = 'Error: ' + err.message;
          error.classList.add('active');
        }
        responseBox.innerHTML = '<pre style="color: #f44;">Error: ' + err.message + '</pre>';
        responseBox.parentElement.classList.add('active');
      }
    }

    // Run example
    async function runExample(num, from, extract, endpoint = '/') {
      const url = buildUrl(from, extract, endpoint);
      await fetchData(url, \`responseBox\${num}\`, null, null);
    }

    // Playground form
    document.getElementById('playgroundForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const fromUrl = document.getElementById('fromUrl').value;
      const extractJson = document.getElementById('extractJson').value;
      const format = document.querySelector('input[name="format"]:checked').value;

      if (!fromUrl || !extractJson) {
        const error = document.getElementById('playgroundError');
        error.textContent = 'Please fill in both fields';
        error.classList.add('active');
        return;
      }

      try {
        const extract = JSON.parse(extractJson);
        const endpoint = format === 'html' ? '/html' : '/';
        const url = buildUrl(fromUrl, extract, endpoint);

        // Display cURL command
        displayCurl(url);

        // Fetch data
        await fetchData(url, 'playgroundResponseBox', 'playgroundLoading', 'playgroundError');
      } catch (err) {
        const error = document.getElementById('playgroundError');
        error.textContent = 'Invalid JSON: ' + err.message;
        error.classList.add('active');
      }
    });

    // Clear playground
    function clearPlayground() {
      document.getElementById('fromUrl').value = '';
      document.getElementById('extractJson').value = '';
      document.querySelector('input[name="format"][value="text"]').checked = true;
      document.getElementById('playgroundCurl').classList.remove('active');
      document.getElementById('playgroundResponse').classList.remove('active');
      document.getElementById('playgroundError').classList.remove('active');
      document.getElementById('bookmarkletContainer').classList.remove('active');
      currentCurlCommand = '';
    }

    // Generate bookmarklet
    function generateBookmarklet() {
      const fromUrl = document.getElementById('fromUrl').value;
      const extractJson = document.getElementById('extractJson').value;
      const error = document.getElementById('playgroundError');

      if (!fromUrl || !extractJson) {
        error.textContent = 'Please fill in both URL and Extract fields';
        error.classList.add('active');
        return;
      }

      try {
        const extract = JSON.parse(extractJson);
        const apiUrl = buildUrl(fromUrl, extract, '/');

        // Create the bookmarklet code
        const bookmarkletCode = \`(function(){
          const apiUrl = '\${apiUrl.replace(/'/g, "\\\\'")}';

          fetch(apiUrl)
            .then(r => r.json())
            .then(data => {
              // Remove existing overlay if present
              const existing = document.getElementById('extract-content-overlay');
              if (existing) existing.remove();

              // Create overlay
              const overlay = document.createElement('div');
              overlay.id = 'extract-content-overlay';
              overlay.style.cssText = 'position:fixed;top:20px;right:20px;width:400px;max-height:80vh;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:20px;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.3);z-index:999999;overflow-y:auto;font-family:system-ui,-apple-system,sans-serif;';

              // Create close button
              const closeBtn = document.createElement('button');
              closeBtn.textContent = '×';
              closeBtn.style.cssText = 'position:absolute;top:10px;right:10px;background:rgba(255,255,255,0.2);border:none;color:white;font-size:24px;cursor:pointer;border-radius:50%;width:30px;height:30px;line-height:24px;padding:0;';
              closeBtn.onclick = () => overlay.remove();

              // Create title
              const title = document.createElement('h3');
              title.textContent = '📊 Extracted Content';
              title.style.cssText = 'margin:0 0 15px 0;font-size:18px;';

              // Create content list
              const list = document.createElement('div');
              list.style.cssText = 'background:rgba(255,255,255,0.1);padding:15px;border-radius:8px;';

              Object.entries(data).forEach(([key, value]) => {
                const item = document.createElement('div');
                item.style.cssText = 'margin-bottom:15px;padding-bottom:15px;border-bottom:1px solid rgba(255,255,255,0.2);';

                const label = document.createElement('div');
                label.textContent = key;
                label.style.cssText = 'font-weight:700;margin-bottom:8px;text-transform:uppercase;font-size:11px;letter-spacing:1px;opacity:0.8;';

                const content = document.createElement('div');
                content.style.cssText = 'font-size:14px;line-height:1.5;';

                if (Array.isArray(value)) {
                  const ul = document.createElement('ul');
                  ul.style.cssText = 'margin:0;padding-left:20px;';
                  value.forEach(v => {
                    const li = document.createElement('li');
                    li.textContent = v;
                    li.style.cssText = 'margin:4px 0;';
                    ul.appendChild(li);
                  });
                  content.appendChild(ul);
                } else {
                  content.textContent = value;
                }

                item.appendChild(label);
                item.appendChild(content);
                list.appendChild(item);
              });

              overlay.appendChild(closeBtn);
              overlay.appendChild(title);
              overlay.appendChild(list);
              document.body.appendChild(overlay);
            })
            .catch(err => {
              alert('Error fetching content: ' + err.message);
            });
        })();\`;

        // Encode as bookmarklet URL
        const bookmarkletUrl = 'javascript:' + encodeURIComponent(bookmarkletCode);

        // Update link
        const link = document.getElementById('bookmarkletLink');
        link.href = bookmarkletUrl;

        // Show container
        document.getElementById('bookmarkletContainer').classList.add('active');
        error.classList.remove('active');

      } catch (err) {
        error.textContent = 'Invalid JSON: ' + err.message;
        error.classList.add('active');
      }
    }

    // Copy bookmarklet
    function copyBookmarklet() {
      const link = document.getElementById('bookmarkletLink');
      const href = link.href;

      navigator.clipboard.writeText(href).then(() => {
        const btn = document.getElementById('copyBookmarkletBtn');
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copied');

        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('copied');
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard. Try dragging the link instead.');
      });
    }
  </script>
</body>
</html>`;
}
