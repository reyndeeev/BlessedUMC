import serverless from 'serverless-http';
import express from 'express';
import { registerRoutes } from '../../server/routes.js';

// Set up database URL from Netlify environment variable
if (process.env.NETLIFY_DATABASE_URL && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.NETLIFY_DATABASE_URL;
}

// Create Express app
const app = express();

// Set up basic Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register API routes
async function setupApp() {
  try {
    await registerRoutes(app);
    return app;
  } catch (error) {
    console.error('Failed to register routes:', error);
    // Return basic app with error handling
    app.use('*', (req, res) => {
      res.status(500).json({ 
        error: 'Server configuration error',
        message: error.message 
      });
    });
    return app;
  }
}

// Export serverless handler
export const handler = async (event, context) => {
  try {
    const app = await setupApp();
    const serverlessHandler = serverless(app);
    return await serverlessHandler(event, context);
  } catch (error) {
    console.error('Serverless function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};