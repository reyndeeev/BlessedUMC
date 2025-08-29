
// Ultra-simple serverless function for Netlify
// Handles authentication and basic API endpoints

export const handler = async (event, context) => {
  console.log('Serverless function called:', event.httpMethod, event.path);
  
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
    
    console.log(`Processing: ${method} ${path}`);

    // Handle authentication endpoints
    if (path === '/auth/login' && method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { username, password } = body;
      
      // Simple hardcoded admin check for demo
      if (username === 'admin' && password === 'password') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Login successful',
            user: { id: '1', username: 'admin' },
            token: 'demo-token-' + Date.now()
          })
        };
      } else {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Invalid credentials'
          })
        };
      }
    }

    // Handle auth/me endpoint
    if (path === '/auth/me' && method === 'GET') {
      const authHeader = event.headers.authorization || event.headers.Authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            user: { id: '1', username: 'admin' }
          })
        };
      } else {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Not authenticated'
          })
        };
      }
    }

    // Handle other API endpoints with basic responses
    if (path.startsWith('/')) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'API endpoint placeholder',
          data: []
        })
      };
    }

    // Default response for unhandled paths
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Endpoint not found'
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
