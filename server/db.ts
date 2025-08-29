import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from "@shared/schema";

// Use Replit's database URL or fall back to a development database
const databaseUrl = process.env.DATABASE_URL || process.env.REPLIT_DB_URL;

if (!databaseUrl) {
  console.warn("No database URL found. Using in-memory storage for development.");
  // For development without database, we'll create a mock connection
  // This prevents the app from crashing during development
}

let db: any;

if (databaseUrl) {
  // Use Neon HTTP driver which is more compatible with serverless
  const sql = neon(databaseUrl);
  db = drizzle(sql, { schema });
} else {
  // Mock database for development
  db = {
    query: {
      users: { findMany: () => [], findFirst: () => null },
      contactMessages: { findMany: () => [] },
      // Add other mock methods as needed
    }
  };
}

export { db };
