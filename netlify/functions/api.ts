import serverless from "serverless-http";
import { createApp } from "../../server/index.netlify";

let cachedHandler: ReturnType<typeof serverless> | null = null;

export const handler = async (event: any, context: any) => {
  // Lazy initialization - create app only once and reuse across invocations
  if (!cachedHandler) {
    console.log("Initializing Express app for Netlify Functions...");
    const app = await createApp();
    cachedHandler = serverless(app, {
      binary: ['image/*', 'application/pdf', 'application/octet-stream']
    });
  }

  // Invoke the serverless handler
  return cachedHandler(event, context);
};
