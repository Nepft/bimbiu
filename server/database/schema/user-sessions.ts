import { char, datetime, index, mysqlTable, uniqueIndex } from 'drizzle-orm/mysql-core'
import { users } from './users'

export const userSessions = mysqlTable(
  'user_sessions',
  {
    id: char('id', { length: 36 }).primaryKey(),
    userId: char('user_id', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: char('token_hash', { length: 64 }).notNull(),
    expiresAt: datetime('expires_at', { mode: 'date', fsp: 3 }).notNull(),
    lastSeenAt: datetime('last_seen_at', { mode: 'date', fsp: 3 }),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 }).notNull(),
  },
  table => [
    uniqueIndex('uq_user_sessions_token_hash').on(table.tokenHash),
    index('idx_user_sessions_user_expires').on(table.userId, table.expiresAt),
  ],
)

export type UserSessionRecord = typeof userSessions.$inferSelect
export type NewUserSessionRecord = typeof userSessions.$inferInsert
