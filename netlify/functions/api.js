const serverless = require("serverless-http");
const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, subject, message } = req.body;
    
    // Basic validation
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields except phone are required" 
      });
    }
    
    // In production, you would save this to a database or send an email
    console.log("Contact form submission:", { firstName, lastName, email, subject, message, phone });
    
    res.json({ 
      success: true, 
      message: "Thank you for your message! We'll get back to you soon." 
    });
    
  } catch (error) {
    console.error("Error processing contact form:", error);
    res.status(500).json({ 
      success: false, 
      message: "Sorry, there was an error processing your message. Please try again." 
    });
  }
});

module.exports.handler = serverless(app);