// Simplified serverless function with database support
// Import only what we need for the serverless environment

let dbConnection = null;

// Netlify-compatible storage using a simple approach
// Since serverless functions are stateless, we'll use a basic approach that works within the request lifecycle

class NetlifyStorage {
  constructor() {
    this.messages = [];
    this.nextId = 1;
    this.initialized = false;
    this.instanceId = Math.random().toString(36).substring(2, 15);
    console.log(`🆔 New storage instance created: ${this.instanceId}`);
  }

  init() {
    if (!this.initialized) {
      console.log(`🔄 Initializing storage instance: ${this.instanceId}`);
      this.initialized = true;
      this.createdAt = new Date().toISOString();
    }
  }

  getMessages() {
    this.init();
    console.log(`📖 Getting messages from instance ${this.instanceId}: ${this.messages.length} messages`);
    return {
      messages: [...this.messages],
      nextId: this.nextId
    };
  }

  saveMessages(messages, nextId) {
    this.init();
    this.messages = [...messages];
    this.nextId = nextId;
    console.log(`💾 Saved ${this.messages.length} messages to instance ${this.instanceId}, nextId: ${this.nextId}`);
    return true;
  }

  getStatus() {
    return {
      instanceId: this.instanceId,
      initialized: this.initialized,
      messageCount: this.messages.length,
      nextId: this.nextId,
      createdAt: this.createdAt
    };
  }
}

// Create storage instance
const storage = new NetlifyStorage();

// Database operations for contact messages
async function saveContactMessageToDatabase(messageData) {
  const db = await connectToDatabase();
  if (!db) {
    console.log('❌ No database connection, using fallback storage');
    return null;
  }

  try {
    console.log('💾 Saving contact message to Neon database:', {
      firstName: messageData.firstName,
      lastName: messageData.lastName,
      email: messageData.email,
      subject: messageData.subject
    });
    
    // Use simpler INSERT without explicit created_at (let database handle it)
    const result = await db.query(`
      INSERT INTO contact_messages (first_name, last_name, email, phone, subject, message)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, first_name as "firstName", last_name as "lastName", 
               email, phone, subject, message, created_at as "createdAt"
    `, [
      messageData.firstName,
      messageData.lastName,
      messageData.email,
      messageData.phone || null,
      messageData.subject,
      messageData.message
    ]);
    
    if (result.length === 0) {
      console.error('❌ INSERT returned no rows');
      return null;
    }
    
    const savedMessage = result[0];
    console.log('✅ Contact message saved to database successfully:', {
      id: savedMessage.id,
      from: savedMessage.email,
      subject: savedMessage.subject,
      createdAt: savedMessage.createdAt
    });
    
    // Verify the message was actually saved by reading it back
    const verifyResult = await db.query('SELECT id FROM contact_messages WHERE id = $1', [savedMessage.id]);
    if (verifyResult.length === 0) {
      console.error('❌ Message save verification failed - record not found after INSERT');
      return null;
    }
    
    console.log('✅ Message save verified successfully');
    return savedMessage;
  } catch (error) {
    console.error('❌ Database save error:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint,
      table: error.table
    });
    return null;
  }
}

async function getContactMessagesFromDatabase() {
  const db = await connectToDatabase();
  if (!db) {
    console.log('❌ No database connection, using fallback storage');
    const fallbackData = storage.getMessages().messages;
    console.log('📊 Fallback storage data:', {
      count: fallbackData.length,
      messages: fallbackData.map(m => ({ id: m.id, from: m.email || m.firstName }))
    });
    return fallbackData;
  }

  try {
    console.log('📖 Fetching contact messages from Neon database');
    
    // First check if table exists and has any data
    const countResult = await db.query('SELECT COUNT(*) as count FROM contact_messages');
    console.log('📊 Database row count:', countResult[0]?.count || 0);
    
    const messages = await db.query(`
      SELECT id, first_name as "firstName", last_name as "lastName", 
             email, phone, subject, message, created_at as "createdAt"
      FROM contact_messages
      ORDER BY created_at DESC
    `);
    
    console.log(`✅ Retrieved ${messages.length} messages from database:`, 
      messages.map(m => ({ id: m.id, from: m.email, subject: m.subject, createdAt: m.createdAt }))
    );
    return messages;
  } catch (error) {
    console.error('❌ Database read error:', {
      message: error.message,
      code: error.code,
      detail: error.detail
    });
    console.log('🔄 Falling back to memory storage due to database error');
    return storage.getMessages().messages;
  }
}

async function deleteContactMessageFromDatabase(messageId) {
  const db = await connectToDatabase();
  if (!db) {
    console.log('No database connection, using fallback storage');
    return false;
  }

  try {
    console.log('🗑️ Deleting contact message from database:', messageId);
    const result = await db.query('DELETE FROM contact_messages WHERE id = $1 RETURNING id', [messageId]);
    
    if (result.length > 0) {
      console.log('✅ Contact message deleted from database successfully:', messageId);
      return true;
    } else {
      console.log('❌ Contact message not found in database:', messageId);
      return false;
    }
  } catch (error) {
    console.error('❌ Database delete error:', error);
    return false;
  }
}

// Wrapper functions for backward compatibility
function initializeStorage() {
  storage.init();
}

function readMessages() {
  return storage.getMessages();
}

function writeMessages(messages, nextId) {
  return storage.saveMessages(messages, nextId);
}

function getStorageStatus() {
  return storage.getStatus();
}

// Initialize storage on module load
initializeStorage();

async function connectToDatabase() {
  if (dbConnection) return dbConnection;
  
  const DATABASE_URL = process.env.DATABASE_URL;
  console.log('🔍 Environment check:', {
    hasDatabaseUrl: !!DATABASE_URL,
    urlLength: DATABASE_URL?.length || 0,
    urlStart: DATABASE_URL?.substring(0, 20) || 'none'
  });
  
  if (!DATABASE_URL) {
    console.log('❌ No DATABASE_URL configured - check Netlify environment variables');
    return null;
  }
  
  try {
    console.log('🔌 Attempting to connect to Neon database via HTTP...');
    
    // Use HTTP-based connection for better Netlify compatibility  
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(DATABASE_URL);
    
    // Test the connection immediately
    console.log('🧪 Testing database connection...');
    const testResult = await sql`SELECT NOW() as current_time`;
    console.log('✅ Database connection test successful:', testResult[0]);
    
    // Create a wrapper that converts our SQL queries to tagged template literals
    dbConnection = {
      sql,
      query: async (queryText, params = []) => {
        console.log('🔍 Executing query:', { sql: queryText.substring(0, 100) + '...', paramCount: params.length });
        try {
          let result;
          
          if (queryText.includes('SELECT NOW()')) {
            result = await sql`SELECT NOW() as current_time`;
          } else if (queryText.includes('SELECT EXISTS')) {
            result = await sql`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contact_messages')`;
          } else if (queryText.includes('CREATE TABLE IF NOT EXISTS contact_messages')) {
            result = await sql`
              CREATE TABLE IF NOT EXISTS contact_messages (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                subject TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
              )
            `;
          } else if (queryText.includes('INSERT INTO contact_messages') && params.length === 6) {
            result = await sql`
              INSERT INTO contact_messages (first_name, last_name, email, phone, subject, message)
              VALUES (${params[0]}, ${params[1]}, ${params[2]}, ${params[3]}, ${params[4]}, ${params[5]})
              RETURNING id, first_name as "firstName", last_name as "lastName", 
                       email, phone, subject, message, created_at as "createdAt"
            `;
          } else if (queryText.includes('SELECT COUNT(*)')) {
            result = await sql`SELECT COUNT(*) as count FROM contact_messages`;
          } else if (queryText.includes('SELECT id, first_name as')) {
            result = await sql`
              SELECT id, first_name as "firstName", last_name as "lastName", 
                     email, phone, subject, message, created_at as "createdAt"
              FROM contact_messages
              ORDER BY created_at DESC
            `;
          } else if (queryText.includes('SELECT id FROM contact_messages WHERE id =') && params.length === 1) {
            result = await sql`SELECT id FROM contact_messages WHERE id = ${params[0]}`;
          } else if (queryText.includes('DELETE FROM contact_messages WHERE id =') && params.length === 1) {
            result = await sql`DELETE FROM contact_messages WHERE id = ${params[0]} RETURNING id`;
          } else {
            throw new Error('Unsupported query pattern: ' + queryText.substring(0, 50));
          }
          
          console.log('✅ Query successful, rows returned:', result.length);
          return result;
        } catch (queryError) {
          console.error('❌ Query failed:', { 
            error: queryError.message, 
            sql: queryText.substring(0, 100) + '...',
            paramCount: params.length 
          });
          throw queryError;
        }
      }
    };
    
    // Verify the contact_messages table exists
    await verifyTableExists();
    
    console.log('✅ Database connection established and verified');
    return dbConnection;
  } catch (error) {
    console.error('❌ Database connection failed:', {
      message: error.message,
      code: error.code,
      detail: error.detail
    });
    return null;
  }
}

async function verifyTableExists() {
  if (!dbConnection) return false;
  
  try {
    console.log('🔍 Verifying contact_messages table exists...');
    const tableCheck = await dbConnection.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'contact_messages'
      );
    `);
    
    const tableExists = tableCheck[0]?.exists;
    console.log('📊 Table existence check:', { exists: tableExists });
    
    if (!tableExists) {
      console.log('⚠️ contact_messages table does not exist, attempting to create...');
      await createContactMessagesTable();
    }
    
    return tableExists;
  } catch (error) {
    console.error('❌ Table verification failed:', error);
    return false;
  }
}

async function createContactMessagesTable() {
  if (!dbConnection) return false;
  
  try {
    console.log('🏗️ Creating contact_messages table...');
    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ contact_messages table created successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to create contact_messages table:', error);
    return false;
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
  console.log('🚀 Netlify function invoked:', {
    method: event.httpMethod,
    path: event.path,
    headers: Object.keys(event.headers || {}),
    bodyLength: event.body?.length || 0,
    timestamp: new Date().toISOString()
  });
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
        console.log('🔍 Current storage state before saving:', getStorageStatus());
        
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
        
        // Create new message object
        const newMessage = {
          firstName: body.firstName.trim(),
          lastName: body.lastName.trim(), 
          email: body.email.trim(),
          phone: body.phone ? body.phone.trim() : null,
          subject: body.subject,
          message: body.message.trim()
        };
        
        // Try to save to database first
        const savedMessage = await saveContactMessageToDatabase(newMessage);
        
        if (!savedMessage) {
          // Fallback to in-memory storage if database fails
          console.log('⚠️ Database save failed, using fallback storage');
          const { messages: currentMessages, nextId } = readMessages();
          const fallbackMessage = {
            ...newMessage,
            id: nextId.toString(),
            createdAt: new Date().toISOString()
          };
          const updatedMessages = [fallbackMessage, ...currentMessages];
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
        }
        
        console.log('💾 Contact message saved successfully:', {
          id: savedMessage?.id || 'fallback',
          from: newMessage.email,
          subject: newMessage.subject,
          savedToDatabase: !!savedMessage
        });
        console.log('🔍 Storage state after saving:', getStorageStatus());
        
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
      
      // Read messages from database first, fallback to memory storage
      console.log('🔍 Starting message retrieval process...');
      const messages = await getContactMessagesFromDatabase();
      console.log('📊 Messages retrieved:', {
        count: messages.length,
        source: messages.length > 0 ? 'database' : 'fallback',
        firstMessage: messages[0] ? {
          id: messages[0].id,
          from: messages[0].email || messages[0].firstName,
          subject: messages[0].subject
        } : 'none'
      });
      
      // Sort by newest first (already sorted in query, but just in case)
      const sortedMessages = messages
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      console.log('📖 GET /contact-messages - Reading from database:', {
        totalMessages: messages.length,
        messageIds: messages.map(m => ({ id: m.id, from: m.email })),
        sortedCount: sortedMessages.length,
        latest: sortedMessages[0]?.createdAt,
        source: 'database'
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
      console.log('🗑️ Message deletion requested for ID:', messageId);
      
      // Try to delete from database first
      const deleteSuccess = await deleteContactMessageFromDatabase(messageId);
      
      if (!deleteSuccess) {
        // Fallback to in-memory storage if database fails
        console.log('⚠️ Database delete failed, trying fallback storage');
        const { messages: currentMessages, nextId } = readMessages();
        const messageIndex = currentMessages.findIndex(msg => msg.id === messageId);
        
        if (messageIndex === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({
              success: false,
              message: `Message with ID ${messageId} not found`
            })
          };
        }
        
        const updatedMessages = currentMessages.filter(msg => msg.id !== messageId);
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
      }
      
      // Get updated count for response
      const remainingMessages = await getContactMessagesFromDatabase();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Contact message deleted successfully',
          deletedId: messageId,
          remainingCount: remainingMessages.length
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
