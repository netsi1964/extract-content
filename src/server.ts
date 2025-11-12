import { withCors } from "./middleware/cors.ts";
import { route } from "./router.ts";

/**
 * Start the HTTP server with Deno.serve()
 */
export async function serve(port: number): Promise<void> {
  console.log(`🚀 extract-content service starting...`);
  console.log(`📡 Server listening on http://localhost:${port}`);

  // Create CORS-wrapped handler
  const handler = withCors(route);

  // Start Deno.serve() with handler
  await Deno.serve({
    port,
    onListen: ({ hostname, port }) => {
      console.log(`✅ Server running on http://${hostname}:${port}`);
    },
  }, handler);
}
