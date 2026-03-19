import { pool } from "./pool.js";

export async function migrate() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";

      CREATE TABLE IF NOT EXISTS users (
        id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name      TEXT NOT NULL,
        email     TEXT NOT NULL UNIQUE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("Migrations complete");
  } finally {
    client.release();
  }
}
