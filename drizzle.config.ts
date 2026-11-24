import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

const databaseUrl = process.env.DATABASE_URL ?? 'mysql://root@127.0.0.1:4000/bimbiu'
const parsed = new URL(databaseUrl)
const useTls = parsed.hostname.endsWith('tidbcloud.com') || parsed.searchParams.get('ssl') === 'true'

export default defineConfig({
  schema: './server/database/schema/index.ts',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 4000,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, '') || 'bimbiu',
    ...(useTls
      ? {
          ssl: {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: true,
          },
        }
      : {}),
  },
})
