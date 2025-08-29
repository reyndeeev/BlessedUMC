import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { createHash } from "crypto";
import { storage } from "./storage";
import { insertContactMessageSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

import type { User } from "@shared/schema";

// Extend session type to include user
declare module 'express-session' {
  interface SessionData {
    user?: Omit<User, 'password'>;
  }
}

// Extend Request type for auth
declare module 'express-serve-static-core' {
  interface Request {
    user?: Omit<User, 'password'>;
  }
}

// Global token storage type
declare global {
  var activeTokens: Map<string, Omit<User, 'password'>> | undefined;
}

// Authentication middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // Check session first
  if (req.session.user) {
    return next();
  }
  
  // Fallback to token authentication
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token && globalThis.activeTokens?.has(token)) {
    // Set user for downstream middleware
    req.user = globalThis.activeTokens.get(token);
    return next();
  }
  
  return res.status(401).json({ success: false, message: "Authentication required" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Temporarily use memory sessions to debug cookie issue
  app.use(session({
    secret: process.env.SESSION_SECRET || 'blessed-umc-dev-secret',
    resave: false,
    saveUninitialized: false,
    name: 'connect.sid',
    cookie: {
      secure: false,
      httpOnly: false, // Temporary for debugging
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Authentication endpoints
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ 
          success: false, 
          message: "Username and password are required" 
        });
      }

      const user = await storage.authenticateUser(username, password);
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: "Invalid username or password" 
        });
      }

      // Store user in session AND send token
      const { password: _, ...userWithoutPassword } = user;
      req.session.user = userWithoutPassword;
      
      // Generate simple token by encoding user data directly (no server-side storage needed)
      const token = JSON.stringify({ id: userWithoutPassword.id, username: userWithoutPassword.username });
      
      res.json({ 
        success: true, 
        message: "Login successful",
        user: userWithoutPassword,
        token: token // Send token as backup
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ 
          success: false, 
          message: "Failed to logout" 
        });
      }
      res.json({ 
        success: true, 
        message: "Logout successful" 
      });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    // Check session first
    if (req.session.user) {
      return res.json({ 
        success: true, 
        user: req.session.user 
      });
    }
    
    // Fallback to token authentication
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      try {
        // Decode the token and validate the user exists in database
        const userData = JSON.parse(token);
        if (userData.id && userData.username) {
          // Verify user still exists in database
          const user = await storage.getUser(userData.id);
          if (user && user.username === userData.username) {
            const { password: _, ...userWithoutPassword } = user;
            return res.json({ 
              success: true, 
              user: userWithoutPassword 
            });
          }
        }
      } catch (error) {
        console.error("Token validation error:", error);
      }
    }
    
    res.status(401).json({ 
      success: false, 
      message: "Not authenticated" 
    });
  });

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      
      // In a real application, you would send an email here
      console.log("New contact message received:", message);
      
      res.json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        console.error("Error saving contact message:", error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to send message. Please try again." 
        });
      }
    }
  });

  // Get contact messages (for admin purposes, protected)
  app.get("/api/contact-messages", requireAuth, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch messages" 
      });
    }
  });

  // User management endpoints (protected)
  app.get("/api/users", requireAuth, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Don't send passwords
      const safeUsers = users.map(({ password, ...user }) => user);
      res.json(safeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch users" 
      });
    }
  });

  app.post("/api/users", requireAuth, async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      // Don't send password back
      const { password, ...safeUser } = user;
      res.json({ success: true, user: safeUser });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid user data", 
          errors: error.errors 
        });
      } else {
        console.error("Error creating user:", error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to create user" 
        });
      }
    }
  });

  app.delete("/api/users/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteUser(id);
      if (deleted) {
        res.json({ success: true, message: "User deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "User not found" });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to delete user" 
      });
    }
  });

  // Analytics endpoint (protected)
  app.get("/api/analytics", requireAuth, async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch analytics" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
