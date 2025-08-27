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
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    res.json({ 
      success: true, 
      message: "Thank you for your message! We'll get back to you within 24 hours.",
      data: {
        id: `msg_${Date.now()}`,
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

// Handle all other routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found"
  });
});

export const handler = serverless(app);