
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
      
      console.log('Login attempt:', { username, passwordProvided: !!password });
      
      // Validate credentials - must be exactly admin/admin123
      if (username === 'admin' && password === 'admin123') {
        const token = 'blessed-admin-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        console.log('Login successful for admin');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Login successful',
            user: { id: '1', username: 'admin' },
            token: token
          })
        };
      } else {
        console.log('Login failed - invalid credentials');
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Invalid username or password'
          })
        };
      }
    }

    // Handle auth/me endpoint
    if (path === '/auth/me' && method === 'GET') {
      const authHeader = event.headers.authorization || event.headers.Authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '');
        
        // Validate token format - should start with 'blessed-admin-'
        if (token.startsWith('blessed-admin-')) {
          console.log('Valid token provided for auth check');
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              user: { id: '1', username: 'admin' }
            })
          };
        } else {
          console.log('Invalid token format');
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'Invalid token'
            })
          };
        }
      } else {
        console.log('No authorization header provided');
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'No token provided'
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
