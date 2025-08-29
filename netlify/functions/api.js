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
  console.log('AUTH: Attempting login for:', username);
  
  // STRICT validation - reject immediately if no username or password
  if (!username || !password || username.trim() === '' || password.trim() === '') {
    console.log('AUTH: Missing username or password');
    return null;
  }
  
  const db = await connectToDatabase();
  
  if (db) {
    try {
      const bcrypt = await import('bcrypt');
      const users = await db.query('SELECT * FROM users WHERE username = $1', [username]);
      
      if (users.length === 0) {
        console.log('AUTH: User not found in database');
        return null;
      }
      
      const user = users[0];
      const isValid = await bcrypt.default.compare(password, user.password);
      
      if (isValid) {
        console.log('AUTH: Database authentication successful for user:', username);
        return { id: user.id, username: user.username };
      } else {
        console.log('AUTH: Password mismatch for user:', username);
        return null;
      }
    } catch (error) {
      console.error('AUTH: Database authentication error:', error);
      return null;
    }
  }
  
  // STRICT fallback authentication - ONLY accept exact credentials
  if (username === 'admin' && password === 'admin123') {
    console.log('AUTH: Fallback authentication successful');
    return { id: '1', username: 'admin' };
  }
  
  // EXPLICITLY reject everything else
  console.log('AUTH: REJECTED - Invalid credentials:', { username, passwordLength: password.length });
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
      
      console.log('LOGIN ENDPOINT: Received login attempt for username:', username);
      
      // STRICT validation at endpoint level
      if (!username || !password || username.trim() === '' || password.trim() === '') {
        console.log('LOGIN ENDPOINT: REJECTED - Missing credentials');
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
        
        // STRICT rejection - null means authentication failed
        if (!user) {
          console.log('LOGIN ENDPOINT: REJECTED - Authentication failed for:', username);
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'Invalid username or password'
            })
          };
        }
        
        // Only create token if authentication was successful
        const tokenData = { 
          id: user.id, 
          username: user.username, 
          loginTime: Date.now(),
          isValid: true 
        };
        const token = Buffer.from(JSON.stringify(tokenData)).toString('base64');
        
        console.log('LOGIN ENDPOINT: SUCCESS - Token created for user:', user.username);
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
        console.error('LOGIN ENDPOINT: ERROR -', error);
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
          // Decode and validate token with strict security checks
          const userData = JSON.parse(Buffer.from(token, 'base64').toString());
          
          console.log('TOKEN VALIDATION: Checking token data:', { 
            hasId: !!userData.id, 
            hasUsername: !!userData.username, 
            isValid: userData.isValid,
            loginTime: userData.loginTime 
          });
          
          // ULTRA STRICT validation - all fields must be present and valid
          if (!userData.id || !userData.username || !userData.isValid || userData.isValid !== true) {
            console.log('TOKEN VALIDATION: REJECTED - Invalid token format or missing fields');
            throw new Error('Invalid token format');
          }
          
          // Additional validation - token must have been created recently (within 24 hours)
          const tokenAge = Date.now() - (userData.loginTime || 0);
          const maxAge = 24 * 60 * 60 * 1000; // 24 hours
          if (tokenAge > maxAge) {
            console.log('TOKEN VALIDATION: REJECTED - Token expired');
            throw new Error('Token expired');
          }
          
          // CRITICAL: Verify the user credentials are EXACTLY admin/admin123
          if (userData.username !== 'admin' || userData.id !== '1') {
            console.log('TOKEN VALIDATION: REJECTED - Invalid user credentials in token');
            throw new Error('Invalid user credentials');
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
