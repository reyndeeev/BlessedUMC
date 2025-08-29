// Simplified serverless function with database support
// Import only what we need for the serverless environment

let dbConnection = null;

async function connectToDatabase() {
  if (dbConnection) return dbConnection;
  
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.log('No DATABASE_URL configured, using fallback auth');
    return null;
  }
  
  try {
    // Use dynamic imports for serverless compatibility
    const { Pool, neonConfig } = await import('@neondatabase/serverless');
    const { drizzle } = await import('drizzle-orm/neon-serverless');
    const { eq } = await import('drizzle-orm');
    
    neonConfig.webSocketConstructor = WebSocket;
    const pool = new Pool({ connectionString: DATABASE_URL });
    
    // Create a simple query function
    dbConnection = {
      pool,
      query: async (sql, params = []) => {
        const client = await pool.connect();
        try {
          const result = await client.query(sql, params);
          return result.rows;
        } finally {
          client.release();
        }
      }
    };
    
    console.log('Database connection established');
    return dbConnection;
  } catch (error) {
    console.error('Database connection failed:', error);
    return null;
  }
}

async function authenticateUser(username, password) {
  const db = await connectToDatabase();
  
  if (db) {
    try {
      const bcrypt = await import('bcrypt');
      const users = await db.query('SELECT * FROM users WHERE username = $1', [username]);
      
      if (users.length === 0) {
        console.log('User not found in database');
        return null;
      }
      
      const user = users[0];
      const isValid = await bcrypt.default.compare(password, user.password);
      
      if (isValid) {
        console.log('Database authentication successful');
        return { id: user.id, username: user.username };
      } else {
        console.log('Password mismatch');
        return null;
      }
    } catch (error) {
      console.error('Database authentication error:', error);
      return null;
    }
  }
  
  // Fallback authentication
  if (username === 'admin' && password === 'admin123') {
    console.log('Fallback authentication successful');
    return { id: '1', username: 'admin' };
  }
  
  return null;
}

// Serverless function for Netlify with Neon database
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
      
      try {
        const user = await authenticateUser(username, password);
        
        if (!user) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'Invalid username or password'
            })
          };
        }
        
        // Create token
        const tokenData = { id: user.id, username: user.username, loginTime: Date.now() };
        const token = Buffer.from(JSON.stringify(tokenData)).toString('base64');
        
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
        
      } catch (error) {
        console.error('Authentication error:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Authentication service error'
          })
        };
      }
    }

    // Handle auth/me endpoint
    if (path === '/auth/me' && method === 'GET') {
      const authHeader = event.headers.authorization || event.headers.Authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '');
        
        try {
          // Decode and validate token
          const userData = JSON.parse(Buffer.from(token, 'base64').toString());
          
          if (!userData.id || !userData.username) {
            throw new Error('Invalid token format');
          }
          
          const db = await connectToDatabase();
          if (db) {
            // Verify user still exists in database
            const users = await db.query('SELECT * FROM users WHERE id = $1', [userData.id]);
            
            if (users.length === 0 || users[0].username !== userData.username) {
              console.log('User not found or username mismatch');
              return {
                statusCode: 401,
                headers,
                body: JSON.stringify({
                  success: false,
                  message: 'Invalid or expired token'
                })
              };
            }
            
            const user = users[0];
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify({
                success: true,
                user: { id: user.id, username: user.username }
              })
            };
          } else {
            // Fallback validation
            if (userData.username === 'admin') {
              return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                  success: true,
                  user: { id: userData.id, username: userData.username }
                })
              };
            }
          }
          
        } catch (error) {
          console.error('Token validation error:', error);
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'Invalid or expired token'
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
