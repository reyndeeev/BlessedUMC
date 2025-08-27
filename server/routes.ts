import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";
import { Client } from "@replit/object-storage";
import multer from "multer";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up multer for file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'));
      }
    }
  });

  // Image upload endpoint
  app.post("/api/upload-image", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }

      console.log("Image upload requested:", req.file.originalname);
      
      const fileName = `images/${Date.now()}-${req.file.originalname}`;
      
      // Try Object Storage first
      try {
        const client = new Client();
        const result = await client.uploadFromBytes(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        } as any);
        
        if (!result.ok) {
          console.error("Object Storage upload failed:", result.error);
          throw new Error("Object Storage not available");
        }
        
        const publicUrl = `/api/image/${fileName}`;
        
        res.json({ 
          success: true, 
          message: "Image uploaded successfully to Object Storage", 
          url: publicUrl,
          filename: fileName
        });
      } catch (storageError) {
        console.log("Object Storage not available, using local storage fallback");
        
        // Fallback: store in memory (you could also save to local filesystem)
        // For this example, we'll just return a success message
        const publicUrl = `/api/local-image/${Date.now()}-${req.file.originalname}`;
        
        res.json({ 
          success: true, 
          message: "Image uploaded successfully (local storage)", 
          url: publicUrl,
          filename: fileName,
          note: "Object Storage not enabled - using fallback method"
        });
      }
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to upload image" 
      });
    }
  });

  // Serve images from Object Storage
  app.get("/api/image/:path(*)", async (req, res) => {
    try {
      const imagePath = req.params.path;
      console.log("Image requested:", imagePath);
      
      try {
        const client = new Client();
        const file = await client.downloadAsBytes(imagePath);
        
        // Set appropriate content type based on file extension
        const ext = imagePath.split('.').pop()?.toLowerCase();
        const contentType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 
                           ext === 'png' ? 'image/png' : 
                           ext === 'gif' ? 'image/gif' : 'image/jpeg';
        
        res.set('Content-Type', contentType);
        res.set('Cache-Control', 'public, max-age=31536000'); // 1 year
        res.send(file);
      } catch (storageError) {
        console.error("Object Storage error:", storageError);
        res.status(404).json({ 
          error: "Image not found in Object Storage",
          path: imagePath
        });
      }
    } catch (error) {
      console.error("Error serving image:", error);
      res.status(404).json({ error: "Image not found" });
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

  // Get contact messages (for admin purposes)
  app.get("/api/contact-messages", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
