import { serve } from "./src/server.ts";

// Get port from environment variable or default to 8000
const port = Number(Deno.env.get("PORT")) || 8000;

// Start the server
console.log(`Starting extract-content service on port ${port}...`);
await serve(port);
