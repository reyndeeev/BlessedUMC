import type { Express, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import { 
  insertContactMessageSchema, insertUserSchema, insertSermonSchema,
  insertBirthdaySchema, insertAnniversarySchema 
} from "@shared/schema";
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

// JWT secret and configuration
// SECURITY: JWT_SECRET must be set in production
const isProduction = process.env.NODE_ENV === 'production';
const JWT_SECRET = process.env.JWT_SECRET || 
  (isProduction 
    ? (() => { throw new Error('JWT_SECRET environment variable must be set in production'); })()
    : 'blessed-umc-dev-secret-jwt-key-change-in-production');
const JWT_EXPIRES_IN = '24h';

// Helper functions for JWT
const generateToken = (user: Omit<User, 'password'>): string => {
  return jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

const verifyToken = (token: string): { id: string; username: string } => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded.id || !decoded.username) {
      throw new Error('Invalid token payload');
    }
    return { id: decoded.id, username: decoded.username };
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Authentication middleware
const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  // Check session first (development only - session may be undefined in production)
  if (req.session?.user) {
    req.user = req.session.user;
    return next();
  }

  // JWT token authentication (primary method for production)
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  try {
    // Verify JWT token
    const tokenData = verifyToken(token);

    // Verify user still exists in database
    const user = await storage.getUser(tokenData.id);
    if (!user || user.username !== tokenData.username) {
      throw new Error('User not found or username mismatch');
    }

    // Set user for downstream middleware
    const { password: _, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    return next();

  } catch (error) {
    // Only log the error type, not sensitive details
    console.error("Authentication failed:", error instanceof Error ? error.message : 'Unknown error');
    return res.status(401).json({ success: false, message: "Authentication required" });
  }
};

export async function registerRoutes(app: Express): Promise<void> {
  // Note: Session storage is not used in production (serverless incompatible)
  // We rely on JWT tokens for stateless authentication
  const isProduction = process.env.NODE_ENV === 'production';

  // SECURITY CHECK: Ensure JWT_SECRET is set in production
  if (isProduction && !process.env.JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable must be set in production for secure authentication');
  }

  // Only use sessions in development for convenience
  if (!isProduction) {
    app.use(session({
      secret: process.env.SESSION_SECRET || 'blessed-umc-dev-secret',
      resave: false,
      saveUninitialized: false,
      name: 'connect.sid',
      cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }
    }));
  }

  // Authentication endpoints
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      console.log("LOGIN ATTEMPT:", { 
        username, 
        passwordLength: password?.length,
        usernameType: typeof username,
        passwordType: typeof password 
      });

      // STRICT validation - reject empty credentials immediately
      if (!username || !password || username.trim() === '' || password.trim() === '') {
        console.log("LOGIN REJECTED: Empty credentials");
        return res.status(401).json({ 
          success: false, 
          message: "Username and password are required" 
        });
      }

      console.log("Attempting authentication for user:", username);
      const user = await storage.authenticateUser(username.trim(), password.trim());

      if (!user) {
        console.log("LOGIN FAILED: Invalid credentials for user:", username);
        return res.status(401).json({ 
          success: false, 
          message: "Invalid username or password" 
        });
      }

      console.log("LOGIN SUCCESS for user:", username);
      // Create secure JWT token
      const { password: _, ...userWithoutPassword } = user;
      const token = generateToken(userWithoutPassword);

      // Set session in development only
      if (req.session) {
        req.session.user = userWithoutPassword;
      }

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
        message: "Internal server error" 
      });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    // Clear session if it exists (development only)
    if (req.session && req.session.destroy) {
      req.session.destroy((err) => {
        if (err) {
          console.error("Logout error:", err);
        }
      });
    }

    // In production, logout is client-side (remove JWT token)
    res.json({ 
      success: true, 
      message: "Logout successful" 
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "No token provided" 
      });
    }

    try {
      // Verify JWT token
      const tokenData = verifyToken(token);

      // Verify user still exists in database
      const user = await storage.getUser(tokenData.id);
      if (!user || user.username !== tokenData.username) {
        throw new Error('User not found or username mismatch');
      }

      const { password: _, ...userWithoutPassword } = user;
      return res.json({ 
        success: true, 
        user: userWithoutPassword 
      });

    } catch (error) {
      // Only log the error type, not sensitive details
      console.error("Authentication failed:", error instanceof Error ? error.message : 'Unknown error');
      return res.status(401).json({ 
        success: false, 
        message: "Invalid or expired token" 
      });
    }
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

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(409).json({ 
          success: false, 
          message: "Username already exists" 
        });
      }

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

  // Sermon endpoints
  app.get("/api/sermons", async (req, res) => {
    try {
      const sermons = await storage.getSermons();
      res.json(sermons);
    } catch (error) {
      console.error("Error fetching sermons:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch sermons" 
      });
    }
  });

  app.get("/api/sermons/featured", async (req, res) => {
    try {
      const sermon = await storage.getFeaturedSermon();
      res.json(sermon || null);
    } catch (error) {
      console.error("Error fetching featured sermon:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch featured sermon" 
      });
    }
  });

  app.get("/api/sermons/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 6;
      const sermons = await storage.getRecentSermons(limit);
      res.json(sermons);
    } catch (error) {
      console.error("Error fetching recent sermons:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch recent sermons" 
      });
    }
  });

  app.post("/api/sermons", requireAuth, async (req, res) => {
    try {
      const validatedData = insertSermonSchema.parse(req.body);
      const sermon = await storage.createSermon(validatedData);
      res.json({ success: true, sermon });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid sermon data", 
          errors: error.errors 
        });
      } else {
        console.error("Error creating sermon:", error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to create sermon" 
        });
      }
    }
  });

  app.put("/api/sermons/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertSermonSchema.partial().parse(req.body);
      const sermon = await storage.updateSermon(id, validatedData);
      if (sermon) {
        res.json({ success: true, sermon });
      } else {
        res.status(404).json({ success: false, message: "Sermon not found" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid sermon data", 
          errors: error.errors 
        });
      } else {
        console.error("Error updating sermon:", error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to update sermon" 
        });
      }
    }
  });

  app.delete("/api/sermons/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteSermon(id);
      if (deleted) {
        res.json({ success: true, message: "Sermon deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "Sermon not found" });
      }
    } catch (error) {
      console.error("Error deleting sermon:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to delete sermon" 
      });
    }
  });

  // Birthday endpoints
  app.get("/api/birthdays", async (req, res) => {
    try {
      const birthdays = await storage.getBirthdays();
      res.json(birthdays);
    } catch (error) {
      console.error("Error fetching birthdays:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch birthdays" 
      });
    }
  });

  app.get("/api/birthdays/upcoming", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const birthdays = await storage.getUpcomingBirthdays(days);
      res.json(birthdays);
    } catch (error) {
      console.error("Error fetching upcoming birthdays:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch upcoming birthdays" 
      });
    }
  });

  app.post("/api/birthdays", requireAuth, async (req, res) => {
    try {
      const validatedData = insertBirthdaySchema.parse(req.body);
      const birthday = await storage.createBirthday(validatedData);
      res.json({ success: true, birthday });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid birthday data", 
          errors: error.errors 
        });
      } else {
        console.error("Error creating birthday:", error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to create birthday" 
        });
      }
    }
  });

  app.put("/api/birthdays/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertBirthdaySchema.partial().parse(req.body);
      const birthday = await storage.updateBirthday(id, validatedData);
      if (birthday) {
        res.json({ success: true, birthday });
      } else {
        res.status(404).json({ success: false, message: "Birthday not found" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid birthday data", 
          errors: error.errors 
        });
      } else {
        console.error("Error updating birthday:", error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to update birthday" 
        });
      }
    }
  });

  app.delete("/api/birthdays/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteBirthday(id);
      if (deleted) {
        res.json({ success: true, message: "Birthday deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "Birthday not found" });
      }
    } catch (error) {
      console.error("Error deleting birthday:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to delete birthday" 
      });
    }
  });

  // Anniversary endpoints
  app.get("/api/anniversaries", async (req, res) => {
    try {
      const anniversaries = await storage.getAnniversaries();
      res.json(anniversaries);
    } catch (error) {
      console.error("Error fetching anniversaries:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch anniversaries" 
      });
    }
  });

  app.get("/api/anniversaries/upcoming", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const anniversaries = await storage.getUpcomingAnniversaries(days);
      res.json(anniversaries);
    } catch (error) {
      console.error("Error fetching upcoming anniversaries:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch upcoming anniversaries" 
      });
    }
  });

  app.post("/api/anniversaries", requireAuth, async (req, res) => {
    try {
      const validatedData = insertAnniversarySchema.parse(req.body);
      const anniversary = await storage.createAnniversary(validatedData);
      res.json({ success: true, anniversary });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid anniversary data", 
          errors: error.errors 
        });
      } else {
        console.error("Error creating anniversary:", error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to create anniversary" 
        });
      }
    }
  });

  app.put("/api/anniversaries/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertAnniversarySchema.partial().parse(req.body);
      const anniversary = await storage.updateAnniversary(id, validatedData);
      if (anniversary) {
        res.json({ success: true, anniversary });
      } else {
        res.status(404).json({ success: false, message: "Anniversary not found" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid anniversary data", 
          errors: error.errors 
        });
      } else {
        console.error("Error updating anniversary:", error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to update anniversary" 
        });
      }
    }
  });

  app.delete("/api/anniversaries/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteAnniversary(id);
      if (deleted) {
        res.json({ success: true, message: "Anniversary deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "Anniversary not found" });
      }
    } catch (error) {
      console.error("Error deleting anniversary:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to delete anniversary" 
      });
    }
  });

}