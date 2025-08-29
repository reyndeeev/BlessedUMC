
// Ultra-simple serverless function for Netlify
let sql = null;

// Initialize database connection only when needed
async function initDB() {
  if (!sql) {
    const DATABASE_URL = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
    if (!DATABASE_URL) {
      throw new Error('Database URL not found. Please set NETLIFY_DATABASE_URL in Netlify environment variables.');
    }
    
    // Dynamic import to avoid bundling issues
    const postgres = (await import('postgres')).default;
    sql = postgres(DATABASE_URL);
  }
  return sql;
}

export const handler = async (event, context) => {
  console.log('Serverless function started');
  console.log('Event:', JSON.stringify(event, null, 2));
  
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
    const sql = await initDB();
    console.log('Database connection initialized');
    const path = event.path.replace('/.netlify/functions/api', '');
    const method = event.httpMethod;

    console.log(`${method} ${path}`);

    // Login endpoint
    if (method === 'POST' && path === '/auth/login') {
      const { username, password } = JSON.parse(event.body);
      
      if (!username || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            success: false, 
            message: 'Username and password are required' 
          })
        };
      }

      // Initialize database connection
      const db = await initDB();
      console.log('Database initialized');
      
      // Find user
      const result = await db`
        SELECT id, username, password FROM users WHERE username = ${username}
      `;
      
      console.log('Query result:', result.length, 'users found');
      
      if (result.length === 0) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ 
            success: false, 
            message: 'Invalid username or password' 
          })
        };
      }

      const user = result[0];
      console.log('User found:', user.username);
      
      // Simple password verification (direct comparison)
      // Note: In production with hashed passwords, you would use bcrypt here
      const isValidPassword = password === user.password;
      console.log('Password comparison result:', isValidPassword);
      
      if (!isValidPassword) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ 
            success: false, 
            message: 'Invalid username or password' 
          })
        };
      }

      // Create simple token (base64 encoded user info)
      const token = Buffer.from(JSON.stringify({ id: user.id, username: user.username })).toString('base64');

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Login successful',
          user: { id: user.id, username: user.username },
          token: token
        })
      };
    }

    // Default response for unmatched routes
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'API endpoint not found',
        path,
        method
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
