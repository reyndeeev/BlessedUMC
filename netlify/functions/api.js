
// Ultra-simple serverless function for Netlify
// Using basic fetch for database queries to avoid module compatibility issues

async function queryDatabase(query, params = []) {
  const DATABASE_URL = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error('Database URL not found. Please set DATABASE_URL in Netlify environment variables.');
  }
  
  // Simple HTTP-based database query using fetch
  // This is a simplified version for Netlify compatibility
  // In a real deployment, you'd use a proper database client
  throw new Error('Database connection not available in serverless environment. Please use the main application.');
}

export const handler = async (event, context) => {
  console.log('Serverless function started');
  
  // Set headers for CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'OK' })
    };
  }

  try {
    const path = event.path.replace('/.netlify/functions/api', '');
    const method = event.httpMethod;

    console.log(`${method} ${path}`);

    // For Netlify deployment, redirect to main application
    // The serverless function is provided for basic compatibility but
    // the main application should be used for full functionality
    return {
      statusCode: 302,
      headers: {
        ...headers,
        'Location': '/'
      },
      body: JSON.stringify({ 
        success: false, 
        message: 'Please use the main application for full functionality',
        redirect: '/'
      })
    };

  } catch (error) {
    console.error('Serverless function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};
