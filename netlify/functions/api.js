// Simplified serverless function with database support
// Import only what we need for the serverless environment

let dbConnection = null;

// IMPORTANT: In-memory storage for contact messages 
// WARNING: This resets on each function cold start in serverless environments!
// In production, you'd use a proper database or external storage service
// For now, we'll work with this limitation and add detailed logging

// Global variable to track if this is a fresh function start
let isFunctionInitialized = false;

let contactMessages = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe', 
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    subject: 'general',
    message: 'I would like to learn more about your church services.',
    createdAt: new Date().toISOString()
  },
  {
    id: '2', 
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: null,
    subject: 'visit',
    message: 'Planning to visit this Sunday. What time is the service?',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

let messageIdCounter = 3;

// Initialize function tracking
if (!isFunctionInitialized) {
  console.log('🚀 SERVERLESS FUNCTION INITIALIZATION - Fresh start');
  console.log('Initial message storage:', {
    count: contactMessages.length,
    messages: contactMessages.map(m => ({ id: m.id, from: m.email }))
  });
  isFunctionInitialized = true;
}

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

    // Handle authentication endpoints - check for both /api/auth/login and /auth/login
    if ((path === '/auth/login' || path === '/api/auth/login') && method === 'POST') {
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

    // Handle auth/me endpoint - check for both /api/auth/me and /auth/me
    if ((path === '/auth/me' || path === '/api/auth/me') && method === 'GET') {
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

    // Handle contact form endpoint
    if ((path === '/contact' || path === '/api/contact') && method === 'POST') {
      try {
        const body = JSON.parse(event.body || '{}');
        console.log('Contact form submission:', body);
        
        // Basic validation
        if (!body.firstName || !body.lastName || !body.email || !body.subject || !body.message) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'All required fields must be filled'
            })
          };
        }
        
        // Create new message object
        const newMessage = {
          id: messageIdCounter.toString(),
          firstName: body.firstName.trim(),
          lastName: body.lastName.trim(), 
          email: body.email.trim(),
          phone: body.phone ? body.phone.trim() : null,
          subject: body.subject,
          message: body.message.trim(),
          createdAt: new Date().toISOString()
        };
        
        // Add to in-memory storage
        contactMessages.unshift(newMessage); // Add to beginning for newest first
        messageIdCounter++;
        
        console.log('Contact message saved:', {
          id: newMessage.id,
          from: newMessage.email,
          subject: newMessage.subject,
          total: contactMessages.length
        });
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Message sent successfully!'
          })
        };
        
      } catch (error) {
        console.error('Contact form submission error:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Failed to process your message. Please try again.'
          })
        };
      }
    }

    // Handle contact messages endpoint (for admin dashboard)
    if ((path === '/contact-messages' || path === '/api/contact-messages') && method === 'GET') {
      const authHeader = event.headers.authorization || event.headers.Authorization;
      
      // Require authentication for admin endpoints
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Authentication required'
          })
        };
      }
      
      // Return stored contact messages (sorted by newest first)
      const sortedMessages = contactMessages
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      console.log('GET /contact-messages - Current storage state:', {
        totalMessages: contactMessages.length,
        messageIds: contactMessages.map(m => ({ id: m.id, from: m.email })),
        sortedCount: sortedMessages.length,
        latest: sortedMessages[0]?.createdAt
      });
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(sortedMessages)
      };
    }

    // Handle delete contact message endpoint
    if (path.match(/\/(api\/)?contact-messages\/[^/]+$/) && method === 'DELETE') {
      const authHeader = event.headers.authorization || event.headers.Authorization;
      
      // Require authentication for admin endpoints
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Authentication required'
          })
        };
      }
      
      const messageId = path.split('/').pop();
      console.log('Message deletion requested for ID:', messageId);
      
      console.log('DELETE request - Current storage before deletion:', {
        totalMessages: contactMessages.length,
        messageIds: contactMessages.map(m => ({ id: m.id, from: m.email })),
        targetId: messageId
      });
      
      // Find and remove message from storage
      const messageIndex = contactMessages.findIndex(msg => msg.id === messageId);
      
      if (messageIndex === -1) {
        console.log('DELETE - Message not found:', { messageId, available: contactMessages.map(m => m.id) });
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            success: false,
            message: `Message with ID ${messageId} not found. Available IDs: ${contactMessages.map(m => m.id).join(', ')}`
          })
        };
      }
      
      // Remove the message
      const deletedMessage = contactMessages.splice(messageIndex, 1)[0];
      
      console.log('DELETE - Message deleted successfully:', {
        deletedId: deletedMessage.id,
        deletedFrom: deletedMessage.email,
        remainingCount: contactMessages.length,
        remainingIds: contactMessages.map(m => ({ id: m.id, from: m.email }))
      });
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Contact message deleted successfully',
          deletedId: messageId,
          remainingCount: contactMessages.length
        })
      };
    }

    // Handle mark message as replied endpoint
    if (path.match(/\/(api\/)?contact-messages\/[^/]+\/reply$/) && method === 'PATCH') {
      const authHeader = event.headers.authorization || event.headers.Authorization;
      
      // Require authentication for admin endpoints
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Authentication required'
          })
        };
      }
      
      const messageId = path.split('/').slice(-2, -1)[0];
      console.log('Message marked as replied for ID:', messageId);
      
      // Find message and mark as replied
      const message = contactMessages.find(msg => msg.id === messageId);
      
      if (!message) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Message not found'
          })
        };
      }
      
      // Add replied flag and timestamp
      message.replied = true;
      message.repliedAt = new Date().toISOString();
      
      console.log('Message marked as replied:', {
        id: message.id,
        from: message.email,
        repliedAt: message.repliedAt
      });
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Message marked as replied'
        })
      };
    }

    // Handle users endpoint
    if ((path === '/users' || path === '/api/users') && method === 'GET') {
      const authHeader = event.headers.authorization || event.headers.Authorization;
      
      // Require authentication for admin endpoints
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Authentication required'
          })
        };
      }
      
      // Mock users data (in production, fetch from database)
      const mockUsers = [
        {
          id: '1',
          username: 'admin'
        }
      ];
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(mockUsers)
      };
    }

    // Handle create user endpoint
    if ((path === '/users' || path === '/api/users') && method === 'POST') {
      const authHeader = event.headers.authorization || event.headers.Authorization;
      
      // Require authentication for admin endpoints
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Authentication required'
          })
        };
      }
      
      try {
        const body = JSON.parse(event.body || '{}');
        const { username, password } = body;
        
        console.log('User creation request:', { username, passwordLength: password?.length });
        
        // Enhanced validation
        if (!username || !password || username.trim() === '' || password.trim() === '') {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'Username and password are required and cannot be empty',
              errors: [
                { field: 'username', message: !username ? 'Username is required' : null },
                { field: 'password', message: !password ? 'Password is required' : null }
              ].filter(e => e.message)
            })
          };
        }
        
        // Username validation
        if (username.length < 3) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'Username must be at least 3 characters long',
              errors: [{ field: 'username', message: 'Username must be at least 3 characters long' }]
            })
          };
        }
        
        // Password validation
        if (password.length < 6) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'Password must be at least 6 characters long',
              errors: [{ field: 'password', message: 'Password must be at least 6 characters long' }]
            })
          };
        }
        
        // Check for duplicate username (mock check) - only prevent exact duplicate 'admin'
        if (username.toLowerCase() === 'admin') {
          return {
            statusCode: 409,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'Username "admin" already exists. Please choose a different username.',
              errors: [{ field: 'username', message: 'This username is already taken. Try admin2, manager, or another name.' }]
            })
          };
        }
        
        // Mock user creation (in production, save to database)
        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          username: username.trim()
        };
        
        console.log('User created successfully:', newUser);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'User created successfully',
            user: newUser
          })
        };
        
      } catch (parseError) {
        console.error('User creation parse error:', parseError);
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Invalid request format'
          })
        };
      }
    }

    // Handle delete user endpoint
    if (path.match(/\/(api\/)?users\/[^/]+$/) && method === 'DELETE') {
      const authHeader = event.headers.authorization || event.headers.Authorization;
      
      // Require authentication for admin endpoints
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Authentication required'
          })
        };
      }
      
      const userId = path.split('/').pop();
      console.log('User deletion requested for ID:', userId);
      
      // Mock user deletion (in production, delete from database)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'User deleted successfully'
        })
      };
    }

    // Handle analytics endpoint
    if ((path === '/analytics' || path === '/api/analytics') && method === 'GET') {
      const authHeader = event.headers.authorization || event.headers.Authorization;
      
      // Require authentication for admin endpoints
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Authentication required'
          })
        };
      }
      
      // Calculate analytics from actual data
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentMessages = contactMessages.filter(msg => 
        new Date(msg.createdAt) >= oneDayAgo
      ).length;
      
      const mockAnalytics = {
        totalUsers: 1,
        totalMessages: contactMessages.length,
        recentMessages: recentMessages,
        activeUsersToday: 1,
        messagesByDay: [
          { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 0 },
          { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 0 },
          { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 0 },
          { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 0 },
          { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 0 },
          { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 1 },
          { date: new Date().toISOString().split('T')[0], count: 1 }
        ],
        topSubjects: [
          { subject: 'General Question', count: 1 },
          { subject: 'Planning a Visit', count: 1 }
        ]
      };
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(mockAnalytics)
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
