import serverless from "serverless-http";
import express from "express";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

// Simple in-memory storage for Netlify (since we can't use database easily)
let users = [
  {
    id: "admin-001",
    username: "admin", 
    password: "admin123" // In production, this should be hashed
  }
];

let contactMessages = [];
let activeTokens = new Map();

// Authentication middleware
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token && activeTokens.has(token)) {
    req.user = activeTokens.get(token);
    return next();
  }
  return res.status(401).json({ success: false, message: "Authentication required" });
};

// Authentication endpoints
app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Username and password are required" 
      });
    }

    const user = users.find(u => u.username === username);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid username or password" 
      });
    }

    // Generate token and store user info
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
});

app.get("/auth/me", (req, res) => {
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
});

// Admin endpoints
app.get("/users", requireAuth, (req, res) => {
  const publicUsers = users.map(u => ({ id: u.id, username: u.username }));
  res.json(publicUsers);
});

app.get("/contact-messages", requireAuth, (req, res) => {
  res.json(contactMessages);
});

app.get("/analytics", requireAuth, (req, res) => {
  res.json({
    totalUsers: users.length.toString(),
    totalMessages: contactMessages.length.toString(),
    recentMessages: contactMessages.slice(-5)
  });
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
    method: req.method
  });
});

// Handle all other routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found"
  });
});

export const handler = serverless(app);