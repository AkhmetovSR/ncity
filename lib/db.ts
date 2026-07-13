// lib/db.ts
import { Pool } from 'pg';

const isLocal = !process.env.VERCEL && process.env.NODE_ENV !== 'production';

const connectionString = isLocal
    ? 'postgresql://adm:Parol!@localhost:5432/ncity_db'
    : process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is missing');
}

// Защита от создания сотен пулов при Hot Reload в Next.js dev-режиме
const globalForPg = global as unknown as { pgPool: Pool };

export const pool = globalForPg.pgPool || new Pool({ connectionString });

if (process.env.NODE_ENV !== 'production') {
  globalForPg.pgPool = pool;
}

export default pool;
