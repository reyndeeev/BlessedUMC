import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

let pool: Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

export function initializeDatabase() {
  const databaseUrl = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
  
  if (!databaseUrl) {
    const errorMsg = "DATABASE_URL or NETLIFY_DATABASE_URL must be set. Please configure your database connection string.";
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`FATAL: ${errorMsg}`);
    }
    
    console.warn(errorMsg);
    throw new Error(errorMsg);
  }

  if (!pool) {
    console.log("Initializing PostgreSQL connection pool...");
    pool = new Pool({ 
      connectionString: databaseUrl,
      ssl: databaseUrl.includes('supabase.co') || process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : undefined,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
    
    db = drizzle(pool, { schema });
    console.log("PostgreSQL connection pool initialized successfully");
  }

  return db;
}

export function getDatabaseConnection() {
  if (!db) {
    return initializeDatabase();
  }
  return db;
}

export async function closeDatabaseConnection() {
  if (pool) {
    await pool.end();
    pool = null;
    db = null;
    console.log("PostgreSQL connection pool closed");
  }
}

export { db, pool };

const databaseUrl = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
if (databaseUrl) {
  try {
    initializeDatabase();
  } catch (error) {
    console.error("Failed to initialize database connection:", error instanceof Error ? error.message : String(error));
  }
}
