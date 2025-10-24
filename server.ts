import "./loadEnv.js";
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server';

const app = new Hono();

app.use('*', cors())

app.post('_api/ai/chat',async c => {
  try {
    const { handle } = await import("./endpoints/ai/chat_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message,  500)
  }
})
const port = process.env.PORT || 3344;
serve({ fetch: app.fetch, port: Number(port) });
console.log(`API server running on port ${port}`)
      