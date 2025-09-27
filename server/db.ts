import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon for Replit/development environments
neonConfig.webSocketConstructor = ws;

// For development environments, configure to work with various SSL setups
if (process.env.NODE_ENV === 'development' || process.env.REPL_ID) {
  // Try HTTP-only mode first for better compatibility in Replit
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
}

// Set longer timeout for slow connections
neonConfig.poolQueryViaFetch = true;

// Create database connection only if DATABASE_URL is available
let pool: Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

export function initializeDatabase() {
  const databaseUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "NETLIFY_DATABASE_URL or DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }

  if (!pool) {
    pool = new Pool({ 
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false } // Allow self-signed certificates in development
    });
    db = drizzle({ client: pool, schema });
  }

  return db;
}

export function getDatabaseConnection() {
  if (!db) {
    return initializeDatabase();
  }
  return db;
}

// For backward compatibility, export db but initialize it lazily
export { db };

// Initialize db only if NETLIFY_DATABASE_URL or DATABASE_URL is available
const databaseUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
if (databaseUrl) {
  try {
    pool = new Pool({ 
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false } // Allow self-signed certificates in development
    });
    db = drizzle({ client: pool, schema });
  } catch (error) {
    console.warn("Failed to initialize database connection:", error);
  }
}
