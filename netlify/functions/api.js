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

// Initialize storage on module load
storage.init();

async function connectToDatabase() {
  if (dbConnection) return dbConnection;
  
  const DATABASE_URL = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
  console.log('🔍 Environment check:', {
    hasNetlifyDatabaseUrl: !!process.env.NETLIFY_DATABASE_URL,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    usingUrl: DATABASE_URL ? 'found' : 'none',
    urlLength: DATABASE_URL?.length || 0,
    urlStart: DATABASE_URL?.substring(0, 20) || 'none'
  });
  
  if (!DATABASE_URL) {
    console.log('❌ No NETLIFY_DATABASE_URL or DATABASE_URL configured - check Netlify environment variables');
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
          
          // Contact messages queries
          } else if (queryText.includes('INSERT INTO contact_messages') && params.length === 6) {
            result = await sql`
              INSERT INTO contact_messages (first_name, last_name, email, phone, subject, message)
              VALUES (${params[0]}, ${params[1]}, ${params[2]}, ${params[3]}, ${params[4]}, ${params[5]})
              RETURNING id, first_name as "firstName", last_name as "lastName", 
                       email, phone, subject, message, created_at as "createdAt"
            `;
          } else if (queryText.includes('SELECT COUNT(*)') && queryText.includes('contact_messages')) {
            result = await sql`SELECT COUNT(*) as count FROM contact_messages`;
          } else if (queryText.includes('SELECT id, first_name as') && queryText.includes('contact_messages')) {
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
          
          // Users queries
          } else if (queryText.includes('SELECT id FROM users WHERE username =') && params.length === 1) {
            result = await sql`SELECT id FROM users WHERE username = ${params[0]}`;
          } else if (queryText.includes('SELECT * FROM users WHERE username =') && params.length === 1) {
            result = await sql`SELECT * FROM users WHERE username = ${params[0]}`;
          } else if (queryText.includes('SELECT * FROM users WHERE id =') && params.length === 1) {
            result = await sql`SELECT * FROM users WHERE id = ${params[0]}`;
          } else if (queryText.includes('INSERT INTO users') && params.length === 2 && queryText.includes('RETURNING id, username')) {
            result = await sql`
              INSERT INTO users (username, password)
              VALUES (${params[0]}, ${params[1]})
              RETURNING id, username
            `;
          } else if (queryText.includes('SELECT id, username') && queryText.includes('FROM users') && queryText.includes('ORDER BY')) {
            result = await sql`
              SELECT id, username
              FROM users
              ORDER BY username
            `;
          } else if (queryText.includes('DELETE FROM users WHERE id =') && params.length === 1) {
            result = await sql`DELETE FROM users WHERE id = ${params[0]} RETURNING id`;
          
          // Sermons queries
          } else if (queryText.includes('SELECT * FROM sermons WHERE featured =') && queryText.includes('LIMIT 1')) {
            result = await sql`SELECT * FROM sermons WHERE featured = true AND is_active = true ORDER BY date DESC LIMIT 1`;
          } else if (queryText.includes('SELECT * FROM sermons WHERE is_active = true') && queryText.includes('ORDER BY date DESC LIMIT')) {
            result = await sql`SELECT * FROM sermons WHERE is_active = true ORDER BY date DESC LIMIT 5`;
          
          // Birthdays queries
          } else if (queryText.includes('SELECT * FROM birthdays WHERE is_active = true')) {
            result = await sql`SELECT * FROM birthdays WHERE is_active = true ORDER BY first_name, last_name`;
          
          // Anniversaries queries  
          } else if (queryText.includes('SELECT * FROM anniversaries WHERE is_active = true')) {
            result = await sql`SELECT * FROM anniversaries WHERE is_active = true ORDER BY husband_name, wife_name`;
          
          // Table existence checks
          } else if (queryText.includes('SELECT EXISTS') && queryText.includes('contact_messages')) {
            result = await sql`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contact_messages')`;
          } else if (queryText.includes('SELECT EXISTS') && queryText.includes('users')) {
            result = await sql`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users')`;
          } else if (queryText.includes('SELECT EXISTS') && queryText.includes('sermons')) {
            result = await sql`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sermons')`;
          } else if (queryText.includes('SELECT EXISTS') && queryText.includes('birthdays')) {
            result = await sql`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'birthdays')`;
          } else if (queryText.includes('SELECT EXISTS') && queryText.includes('anniversaries')) {
            result = await sql`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'anniversaries')`;
          
          // Table creation
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
          } else if (queryText.includes('CREATE TABLE IF NOT EXISTS users')) {
            result = await sql`
              CREATE TABLE IF NOT EXISTS users (
                id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
              )
            `;
          } else if (queryText.includes('CREATE TABLE IF NOT EXISTS sermons')) {
            result = await sql`
              CREATE TABLE IF NOT EXISTS sermons (
                id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
                title TEXT NOT NULL,
                pastor TEXT NOT NULL,
                date DATE NOT NULL,
                description TEXT,
                video_url TEXT,
                thumbnail_url TEXT,
                featured BOOLEAN DEFAULT false,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
              )
            `;
          } else if (queryText.includes('CREATE TABLE IF NOT EXISTS birthdays')) {
            result = await sql`
              CREATE TABLE IF NOT EXISTS birthdays (
                id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                birth_date DATE NOT NULL,
                phone TEXT,
                email TEXT,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
              )
            `;
          } else if (queryText.includes('CREATE TABLE IF NOT EXISTS anniversaries')) {
            result = await sql`
              CREATE TABLE IF NOT EXISTS anniversaries (
                id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
                husband_name TEXT NOT NULL,
                wife_name TEXT NOT NULL,
                anniversary_date DATE NOT NULL,
                phone TEXT,
                email TEXT,
                years_married INTEGER,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
              )
            `;
          } else {
            console.error('❌ Unsupported query pattern:', { 
              queryText: queryText.substring(0, 100),
              params: params.length,
              fullQuery: queryText
            });
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
    
    // Verify all tables exist
    await verifyAllTablesExist();
    
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

async function verifyAllTablesExist() {
  if (!dbConnection) return false;
  
  try {
    // Create all required tables
    await createContactMessagesTable();
    await createUsersTable();
    await createSermonsTable();
    await createBirthdaysTable();
    await createAnniversariesTable();
    
    return true;
  } catch (error) {
    console.error('❌ Table verification failed:', error);
    return false;
  }
}

async function createContactMessagesTable() {
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

async function createUsersTable() {
  try {
    console.log('🏗️ Creating users table...');
    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);
    console.log('✅ users table created successfully');
    
    // Create default admin user
    try {
      const bcrypt = await import('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const existingUsers = await dbConnection.query(`SELECT id FROM users WHERE username = $1`, ['admin']);
      if (existingUsers.length === 0) {
        await dbConnection.query(`INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id`, 
          ['admin', hashedPassword]);
        console.log('✅ Default admin user created');
      }
    } catch (userCreateError) {
      console.error('❌ Failed to create admin user:', userCreateError);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Failed to create users table:', error);
    return false;
  }
}

async function createSermonsTable() {
  try {
    console.log('🏗️ Creating sermons table...');
    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS sermons (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        pastor TEXT NOT NULL,
        date DATE NOT NULL,
        description TEXT,
        video_url TEXT,
        thumbnail_url TEXT,
        featured BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ sermons table created successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to create sermons table:', error);
    return false;
  }
}

async function createBirthdaysTable() {
  try {
    console.log('🏗️ Creating birthdays table...');
    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS birthdays (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        birth_date DATE NOT NULL,
        phone TEXT,
        email TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ birthdays table created successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to create birthdays table:', error);
    return false;
  }
}

async function createAnniversariesTable() {
  try {
    console.log('🏗️ Creating anniversaries table...');
    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS anniversaries (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        husband_name TEXT NOT NULL,
        wife_name TEXT NOT NULL,
        anniversary_date DATE NOT NULL,
        phone TEXT,
        email TEXT,
        years_married INTEGER,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ anniversaries table created successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to create anniversaries table:', error);
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

// Function to calculate upcoming birthdays and anniversaries
function getUpcomingItems(items, dateField) {
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  return items.filter(item => {
    const itemDate = new Date(item[dateField]);
    const thisYear = new Date(today.getFullYear(), itemDate.getMonth(), itemDate.getDate());
    const nextYear = new Date(today.getFullYear() + 1, itemDate.getMonth(), itemDate.getDate());
    
    return (thisYear >= today && thisYear <= thirtyDaysFromNow) || 
           (nextYear >= today && nextYear <= thirtyDaysFromNow);
  }).map(item => {
    const itemDate = new Date(item[dateField]);
    const thisYear = new Date(today.getFullYear(), itemDate.getMonth(), itemDate.getDate());
    const nextYear = new Date(today.getFullYear() + 1, itemDate.getMonth(), itemDate.getDate());
    
    const upcomingDate = thisYear >= today ? thisYear : nextYear;
    const daysUntil = Math.ceil((upcomingDate - today) / (1000 * 60 * 60 * 24));
    
    return {
      ...item,
      daysUntil
    };
  }).sort((a, b) => a.daysUntil - b.daysUntil);
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

    // Authentication endpoints
    if ((path === '/auth/login' || path === '/api/auth/login') && method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { username, password } = body;
      
      console.log('LOGIN ENDPOINT: Received login attempt for username:', username);
      
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

    // Auth verification endpoint
    if ((path === '/auth/me' || path === '/api/auth/me') && method === 'GET') {
      const authHeader = event.headers.authorization || event.headers.Authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '');
        
        try {
          const userData = JSON.parse(Buffer.from(token, 'base64').toString());
          
          if (!userData.id || !userData.username || !userData.isValid || userData.isValid !== true) {
            throw new Error('Invalid token format');
          }
          
          const tokenAge = Date.now() - (userData.loginTime || 0);
          const maxAge = 24 * 60 * 60 * 1000; // 24 hours
          if (tokenAge > maxAge) {
            throw new Error('Token expired');
          }
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              user: { id: userData.id, username: userData.username }
            })
          };
          
        } catch (error) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'Invalid or expired token'
            })
          };
        }
      }

      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'No valid authentication token provided'
        })
      };
    }

    // Sermons endpoints
    if (path === '/api/sermons/featured' && method === 'GET') {
      const db = await connectToDatabase();
      if (!db) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Database connection failed'
          })
        };
      }

      try {
        const sermons = await db.query('SELECT * FROM sermons WHERE featured = true AND is_active = true ORDER BY date DESC LIMIT 1');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(sermons[0] || null)
        };
      } catch (error) {
        console.error('Database error:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Failed to fetch featured sermon'
          })
        };
      }
    }

    if (path === '/api/sermons/recent' && method === 'GET') {
      const db = await connectToDatabase();
      if (!db) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Database connection failed'
          })
        };
      }

      try {
        const sermons = await db.query('SELECT * FROM sermons WHERE is_active = true ORDER BY date DESC LIMIT 5');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(sermons)
        };
      } catch (error) {
        console.error('Database error:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Failed to fetch recent sermons'
          })
        };
      }
    }

    // Birthdays endpoints
    if (path === '/api/birthdays/upcoming' && method === 'GET') {
      const db = await connectToDatabase();
      if (!db) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Database connection failed'
          })
        };
      }

      try {
        const birthdays = await db.query('SELECT * FROM birthdays WHERE is_active = true');
        const upcoming = getUpcomingItems(birthdays, 'birth_date');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(upcoming)
        };
      } catch (error) {
        console.error('Database error:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Failed to fetch upcoming birthdays'
          })
        };
      }
    }

    // Anniversaries endpoints
    if (path === '/api/anniversaries/upcoming' && method === 'GET') {
      const db = await connectToDatabase();
      if (!db) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Database connection failed'
          })
        };
      }

      try {
        const anniversaries = await db.query('SELECT * FROM anniversaries WHERE is_active = true');
        const upcoming = getUpcomingItems(anniversaries, 'anniversary_date');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(upcoming)
        };
      } catch (error) {
        console.error('Database error:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Failed to fetch upcoming anniversaries'
          })
        };
      }
    }

    // Contact form endpoint
    if ((path === '/contact' || path === '/api/contact') && method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { firstName, lastName, email, phone, subject, message } = body;
      
      console.log('📧 Contact form submission received:', {
        firstName,
        lastName,
        email,
        subject: subject?.substring(0, 50) + '...'
      });
      
      if (!firstName || !lastName || !email || !subject || !message) {
        console.log('❌ Invalid contact form data - missing required fields');
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'All fields except phone are required'
          })
        };
      }
      
      const messageData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        subject: subject.trim(),
        message: message.trim()
      };
      
      const db = await connectToDatabase();
      let savedMessage = null;
      
      if (db) {
        try {
          const result = await db.query(`
            INSERT INTO contact_messages (first_name, last_name, email, phone, subject, message)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, first_name as "firstName", last_name as "lastName", 
                     email, phone, subject, message, created_at as "createdAt"
          `, [
            messageData.firstName,
            messageData.lastName,
            messageData.email,
            messageData.phone,
            messageData.subject,
            messageData.message
          ]);
          
          if (result.length > 0) {
            savedMessage = result[0];
            console.log('✅ Contact message saved to database successfully');
          }
        } catch (dbError) {
          console.error('❌ Database save error:', dbError);
        }
      }
      
      // Fallback to memory storage if database fails
      if (!savedMessage) {
        const messageId = storage.nextId++;
        savedMessage = {
          id: messageId,
          ...messageData,
          createdAt: new Date().toISOString()
        };
        storage.messages.push(savedMessage);
        console.log('💾 Contact message saved to memory storage');
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Your message has been sent successfully!',
          data: savedMessage
        })
      };
    }

    // Admin endpoints require authentication
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (path.startsWith('/api/admin') || path.startsWith('/admin')) {
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
    }

    // Default response for unhandled paths
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        success: false,
        message: `Endpoint not found: ${method} ${path}`
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