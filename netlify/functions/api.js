const serverless = require("serverless-http");
const express = require("express");
const { registerRoutes } = require("../../dist/index.js");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register your API routes
registerRoutes(app).then(() => {
  console.log("Routes registered for serverless function");
});

module.exports.handler = serverless(app);