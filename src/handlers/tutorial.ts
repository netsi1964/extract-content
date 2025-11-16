/**
 * Handler for GET /tutorial - Serve the interactive tutorial page
 */
export async function handleTutorial(_req: Request): Promise<Response> {
  try {
    // Read the tutorial HTML file
    const tutorialHtml = await Deno.readTextFile("./tutorial.html");

    return new Response(tutorialHtml, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Tutorial error:", error);
    return new Response("Tutorial not found", {
      status: 404,
      headers: {
        "content-type": "text/plain",
      },
    });
  }
}
