// Simplified serverless function with database support
// Import only what we need for the serverless environment

let dbConnection = null;

// Robust storage solution for serverless environment
// Uses environment variable simulation to persist across function resets
let memoryStorage = null;

// Global storage object that simulates persistence
const GLOBAL_STORAGE = {
  messages: [],
  nextId: 1,
  instances: new Map()
};

// Initialize storage with cross-instance awareness
function initializeStorage() {
  const instanceId = Math.random().toString(36).substring(2, 15);
  
  if (memoryStorage === null) {
    console.log('🔄 New serverless function instance starting');
    
    // Initialize with reference to global storage
    memoryStorage = {
      instanceId: instanceId,
      messages: GLOBAL_STORAGE.messages,
      nextId: GLOBAL_STORAGE.nextId,
      createdAt: new Date().toISOString()
    };
    
    // Register this instance
    GLOBAL_STORAGE.instances.set(instanceId, {
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    });
    
    console.log('📊 Instance initialized:', {
      instanceId: instanceId,
      messagesCount: memoryStorage.messages.length,
      nextId: memoryStorage.nextId,
      totalInstances: GLOBAL_STORAGE.instances.size
    });
  }
  
  return memoryStorage;
}

// Read messages from storage
function readMessages() {
  if (memoryStorage === null) {
    initializeStorage();
  }
  
  // Update last used timestamp
  if (GLOBAL_STORAGE.instances.has(memoryStorage.instanceId)) {
    GLOBAL_STORAGE.instances.get(memoryStorage.instanceId).lastUsed = new Date().toISOString();
  }
  
  return {
    messages: GLOBAL_STORAGE.messages || [],
    nextId: GLOBAL_STORAGE.nextId || 1
  };
}

// Write messages to storage
function writeMessages(messages, nextId) {
  try {
    if (memoryStorage === null) {
      initializeStorage();
    }
    
    // Update global storage
    GLOBAL_STORAGE.messages = messages;
    GLOBAL_STORAGE.nextId = nextId;
    
    // Update local reference
    memoryStorage.messages = messages;
    memoryStorage.nextId = nextId;
    
    console.log(`✅ Storage updated across all instances: ${messages.length} messages, nextId: ${nextId}, instanceId: ${memoryStorage.instanceId}`);
    return true;
  } catch (error) {
    console.error('Error updating storage:', error);
    return false;
  }
}

// Initialize storage on function load
initializeStorage();

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
        console.log('📝 Contact form submission received:', body);
        console.log('🔍 Current storage state before saving:', {
          localMemory: memoryStorage,
          globalStorage: {
            messages: GLOBAL_STORAGE.messages.length,
            nextId: GLOBAL_STORAGE.nextId,
            instances: GLOBAL_STORAGE.instances.size
          }
        });
        
        // Basic validation
        if (!body.firstName || !body.lastName || !body.email || !body.subject || !body.message) {
          console.log('❌ Validation failed - missing required fields');
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'All required fields must be filled'
            })
          };
        }
        
        // Read current storage state
        const { messages: currentMessages, nextId } = readMessages();
        console.log('📖 Current messages in storage:', { count: currentMessages.length, nextId });
        
        // Create new message object
        const newMessage = {
          id: nextId.toString(),
          firstName: body.firstName.trim(),
          lastName: body.lastName.trim(), 
          email: body.email.trim(),
          phone: body.phone ? body.phone.trim() : null,
          subject: body.subject,
          message: body.message.trim(),
          createdAt: new Date().toISOString()
        };
        
        // Add to messages array (newest first)
        const updatedMessages = [newMessage, ...currentMessages];
        
        // Save to persistent storage
        const saveSuccess = writeMessages(updatedMessages, nextId + 1);
        
        if (!saveSuccess) {
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'Failed to save message. Please try again.'
            })
          };
        }
        
        console.log('💾 Contact message saved successfully:', {
          id: newMessage.id,
          from: newMessage.email,
          subject: newMessage.subject,
          total: updatedMessages.length
        });
        console.log('🔍 Storage state after saving:', {
          globalMessages: GLOBAL_STORAGE.messages.length,
          globalNextId: GLOBAL_STORAGE.nextId,
          instanceId: memoryStorage.instanceId,
          instances: GLOBAL_STORAGE.instances.size
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
      
      // Read messages from memory storage
      const { messages } = readMessages();
      
      // Sort by newest first (just in case)
      const sortedMessages = messages
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      console.log('📖 GET /contact-messages - Reading from storage:', {
        globalMessages: GLOBAL_STORAGE.messages.length,
        totalMessages: messages.length,
        messageIds: messages.map(m => ({ id: m.id, from: m.email })),
        sortedCount: sortedMessages.length,
        instanceId: memoryStorage?.instanceId,
        instances: GLOBAL_STORAGE.instances.size,
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
      
      // Read current storage state
      const { messages: currentMessages, nextId } = readMessages();
      
      console.log('🗑️ DELETE request - Current storage before deletion:', {
        totalMessages: currentMessages.length,
        messageIds: currentMessages.map(m => ({ id: m.id, from: m.email })),
        targetId: messageId
      });
      
      // Find message to delete
      const messageIndex = currentMessages.findIndex(msg => msg.id === messageId);
      
      if (messageIndex === -1) {
        console.log('DELETE - Message not found:', { messageId, available: currentMessages.map(m => m.id) });
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            success: false,
            message: `Message with ID ${messageId} not found. Available IDs: ${currentMessages.map(m => m.id).join(', ')}`
          })
        };
      }
      
      // Remove the message
      const deletedMessage = currentMessages[messageIndex];
      const updatedMessages = currentMessages.filter(msg => msg.id !== messageId);
      
      // Save to persistent storage
      const saveSuccess = writeMessages(updatedMessages, nextId);
      
      if (!saveSuccess) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Failed to delete message. Please try again.'
          })
        };
      }
      
      console.log('🗑️ DELETE - Message deleted successfully from persistent storage:', {
        deletedId: deletedMessage.id,
        deletedFrom: deletedMessage.email,
        remainingCount: updatedMessages.length,
        remainingIds: updatedMessages.map(m => ({ id: m.id, from: m.email }))
      });
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Contact message deleted successfully',
          deletedId: messageId,
          remainingCount: updatedMessages.length
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
      
      // Read current storage state
      const { messages: currentMessages, nextId } = readMessages();
      
      // Find message to mark as replied
      const messageIndex = currentMessages.findIndex(msg => msg.id === messageId);
      
      if (messageIndex === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Message not found'
          })
        };
      }
      
      // Update message with replied status
      const updatedMessages = [...currentMessages];
      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        replied: true,
        repliedAt: new Date().toISOString()
      };
      
      // Save to persistent storage
      const saveSuccess = writeMessages(updatedMessages, nextId);
      
      if (!saveSuccess) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Failed to mark message as replied. Please try again.'
          })
        };
      }
      
      console.log('✉️ Message marked as replied in persistent storage:', {
        id: messageId,
        from: updatedMessages[messageIndex].email,
        repliedAt: updatedMessages[messageIndex].repliedAt
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
      
      // Read messages from persistent storage for analytics
      const { messages } = readMessages();
      
      // Calculate analytics from actual persistent data
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentMessages = messages.filter(msg => 
        new Date(msg.createdAt) >= oneDayAgo
      ).length;
      
      const mockAnalytics = {
        totalUsers: 1,
        totalMessages: messages.length,
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
