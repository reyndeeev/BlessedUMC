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

      const client = new Client();
      const fileName = `images/${Date.now()}-${req.file.originalname}`;
      
      // Upload to Object Storage
      await client.uploadFromBytes(fileName, req.file.buffer);
      
      // Create public URL
      const publicUrl = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/api/image/${fileName}`;
      
      console.log("Image uploaded successfully:", fileName);
      
      res.json({ 
        success: true, 
        message: "Image uploaded successfully!", 
        url: publicUrl,
        filename: fileName
      });
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
      const client = new Client();
      const imagePath = req.params.path;
      
      const imageBytes = await client.downloadAsBytes(imagePath);
      
      // Set appropriate content type
      const ext = imagePath.split('.').pop()?.toLowerCase();
      let contentType = 'image/jpeg';
      if (ext === 'png') contentType = 'image/png';
      else if (ext === 'gif') contentType = 'image/gif';
      else if (ext === 'webp') contentType = 'image/webp';
      
      res.set('Content-Type', contentType);
      res.send(Buffer.from(imageBytes));
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
