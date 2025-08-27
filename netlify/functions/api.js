// Simple serverless function for Netlify
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import bcrypt from 'bcrypt';

// Set up database URL from Netlify environment variable
const DATABASE_URL = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('Database URL not found. Please set NETLIFY_DATABASE_URL in Netlify environment variables.');
}

// Database schema (simplified)
const users = {
  id: '',
  username: '',
  password: ''
};

const contactMessages = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  createdAt: ''
};

// Database connection
const client = postgres(DATABASE_URL);
const db = drizzle(client);

export const handler = async (event, context) => {
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

      // Find user
      const result = await client`
        SELECT id, username, password FROM users WHERE username = ${username}
      `;
      
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
      const isValidPassword = await bcrypt.compare(password, user.password);
      
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