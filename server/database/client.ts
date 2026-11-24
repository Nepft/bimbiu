import { drizzle, type MySql2Database } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema'

let pool: mysql.Pool | null = null
let dbInstance: MySql2Database<typeof schema> | null = null

function createPool(): mysql.Pool {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not configured')
  }

  const parsed = new URL(databaseUrl)
  const useTls = parsed.hostname.endsWith('tidbcloud.com') || parsed.searchParams.get('ssl') === 'true'

  return mysql.createPool({
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 4000,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, '') || 'bimbiu',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 5,
    idleTimeout: 60_000,
    timezone: 'Z',
    ...(useTls
      ? {
          ssl: {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: true,
          },
        }
      : {}),
  })
}

export function getDb() {
  if (!dbInstance) {
    pool = createPool()
    dbInstance = drizzle(pool, { schema, mode: 'default' })
  }
  return dbInstance
}

export async function closeDb() {
  if (pool) {
    await pool.end()
    pool = null
    dbInstance = null
  }
}
