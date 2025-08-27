// TEMPORARY DEBUG ENDPOINT: List all users in the database (safe version)
app.get('/api/debug/users', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      console.error('DEBUG USERS ERROR:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
    res.json({ success: true, users: data });
  } catch (err) {
    console.error('DEBUG USERS EXCEPTION:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

import serverless from "serverless-http";
import express from "express";
import { supabase } from "./supabaseClient.mjs";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`, {
    path: req.path,
    originalUrl: req.originalUrl,
    headers: req.headers
  });
  next();
});

// Add CORS headers for better compatibility
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});




let contactMessages = [];
let activeTokens = new Map();

// Helper functions for analytics
function getMessagesByDay() {
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const messagesForDay = contactMessages.filter(msg => {
      const msgDate = new Date(msg.timestamp).toISOString().split('T')[0];
      return msgDate === dateStr;
    });
    
    last7Days.push({ 
      date: dateStr, 
      count: messagesForDay.length 
    });
  }
  return last7Days;
}

function getTopSubjects() {
  const subjectCounts = {};
  contactMessages.forEach(msg => {
    const subject = msg.subject || 'No Subject';
    subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
  });
  
  return Object.entries(subjectCounts)
    .map(([subject, count]) => ({ subject, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

// Authentication middleware
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token && activeTokens.has(token)) {
    req.user = activeTokens.get(token);
    return next();
  }
  return res.status(401).json({ success: false, message: "Authentication required" });
};

// Authentication endpoints - handle both paths for compatibility
app.post("/auth/login", async (req, res) => {
  await handleLogin(req, res);
});

app.post("/api/auth/login", async (req, res) => {
  await handleLogin(req, res);
});

async function handleLogin(req, res) {
  try {
    const { username, password } = req.body;
    console.log('LOGIN ATTEMPT:', { username, password });
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Username and password are required" 
      });
    }

    // Supabase user lookup
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    console.log('SUPABASE QUERY RESULT:', { user, findError });
    if (!user || user.password !== password) {
      console.log('LOGIN FAILED: user not found or password mismatch', { user, passwordInput: password, userPassword: user ? user.password : undefined });
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }
    const userWithoutPassword = { id: user.id, username: user.username };
    const token = Buffer.from(JSON.stringify(userWithoutPassword)).toString('base64');
    activeTokens.set(token, userWithoutPassword);
    res.json({
      success: true,
      message: "Login successful",
      user: userWithoutPassword,
      token: token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
}

// Handle both paths for /auth/me
app.get("/auth/me", (req, res) => {
  handleAuthMe(req, res);
});

app.get("/api/auth/me", (req, res) => {
  handleAuthMe(req, res);
});

function handleAuthMe(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token && activeTokens.has(token)) {
    const user = activeTokens.get(token);
    return res.json({ 
      success: true, 
      user: user 
    });
  }
  
  res.status(401).json({ 
    success: false, 
    message: "Not authenticated" 
  });
}

// Admin endpoints - handle both paths
app.get("/users", requireAuth, async (req, res) => {
  const { data, error } = await supabase.from('users').select('id, username');
  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json(data);
});

app.get("/api/users", requireAuth, async (req, res) => {
  const { data, error } = await supabase.from('users').select('id, username');
  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json(data);
});

// Public registration endpoint
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required"
      });
    }
    // Check if user already exists
    const { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already exists"
      });
    }
    // Create new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ username: username.trim(), password }])
      .select()
      .single();
    if (insertError) {
      throw insertError;
    }
    const userWithoutPassword = { id: newUser.id, username: newUser.username };
    const token = Buffer.from(JSON.stringify(userWithoutPassword)).toString('base64');
    activeTokens.set(token, userWithoutPassword);
    res.json({
      success: true,
      user: userWithoutPassword,
      token: token,
      message: "Registration successful"
    });
  } catch (error) {
    console.error("Register user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Create new user (admin only)
app.post("/api/users", requireAuth, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required"
      });
    }
    // Check if user already exists
    const { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already exists"
      });
    }
    // Create new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ username: username.trim(), password }])
      .select()
      .single();
    if (insertError) {
      throw insertError;
    }
    const { password: _, ...userWithoutPassword } = newUser;
    res.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Delete user
app.delete("/api/users/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    // Don't allow deleting the admin user
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    if (user.username === 'admin') {
      return res.status(400).json({
        success: false,
        message: "Cannot delete admin user"
      });
    }
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    if (deleteError) {
      throw deleteError;
    }
    res.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

app.get("/contact-messages", requireAuth, (req, res) => {
  res.json(contactMessages);
});

app.get("/api/contact-messages", requireAuth, (req, res) => {
  res.json(contactMessages);
});

app.get("/analytics", requireAuth, (req, res) => {
  const analyticsData = {
    totalUsers: users.length,
    totalMessages: contactMessages.length,
    recentMessages: contactMessages.filter(msg => {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      return new Date(msg.timestamp) > oneDayAgo;
    }).length,
    activeUsersToday: Math.floor(users.length * 0.3), // Mock data
    messagesByDay: getMessagesByDay(),
    topSubjects: getTopSubjects()
  };
  res.json(analyticsData);
});

app.get("/api/analytics", requireAuth, (req, res) => {
  const analyticsData = {
    totalUsers: users.length,
    totalMessages: contactMessages.length,
    recentMessages: contactMessages.filter(msg => {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      return new Date(msg.timestamp) > oneDayAgo;
    }).length,
    activeUsersToday: Math.floor(users.length * 0.3), // Mock data
    messagesByDay: getMessagesByDay(),
    topSubjects: getTopSubjects()
  };
  res.json(analyticsData);
});

// Contact form endpoint
app.post("/contact", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, subject, message } = req.body;
    
    // Enhanced validation
    const errors = [];
    if (!firstName?.trim()) errors.push("First name is required");
    if (!lastName?.trim()) errors.push("Last name is required");
    if (!email?.trim()) errors.push("Email is required");
    if (!subject?.trim()) errors.push("Subject is required");
    if (!message?.trim()) errors.push("Message is required");
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      errors.push("Please enter a valid email address");
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Please fix the following errors:",
        errors
      });
    }
    
    // Log the contact form submission (in production, you'd save to database or send email)
    const submissionData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(), 
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      subject: subject.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent']
    };
    
    console.log("📧 New Contact Form Submission:", JSON.stringify(submissionData, null, 2));
    
    // Store the message in memory
    const messageWithId = {
      id: `msg_${Date.now()}`,
      ...submissionData
    };
    contactMessages.push(messageWithId);
    
    // Keep only last 100 messages to prevent memory issues
    if (contactMessages.length > 100) {
      contactMessages = contactMessages.slice(-100);
    }
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    res.json({ 
      success: true, 
      message: "Thank you for your message! We'll get back to you within 24 hours.",
      data: {
        id: messageWithId.id,
        timestamp: submissionData.timestamp
      }
    });
    
  } catch (error) {
    console.error("❌ Error processing contact form:", error);
    res.status(500).json({ 
      success: false, 
      message: "We're experiencing technical difficulties. Please try again in a few minutes or contact us directly at iamblessedchurch@gmail.com." 
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    service: "Blessed UMC Contact API"
  });
});

// Test endpoint for debugging
app.get("/test", (req, res) => {
  res.json({ 
    message: "API is working!", 
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    url: req.url
  });
});

app.get("/api/test", (req, res) => {
  res.json({ 
    message: "API test endpoint working!", 
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    url: req.url
  });
});

// Handle all other routes with debugging info
app.use("*", (req, res) => {
  console.log("404 - Path not found:", {
    path: req.path,
    method: req.method,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    url: req.url,
    headers: req.headers
  });
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    debug: {
      path: req.path,
      method: req.method,
      originalUrl: req.originalUrl,
      url: req.url
    }
  });
});

export const handler = serverless(app);