import { boolean, char, datetime, mysqlTable, uniqueIndex, varchar } from 'drizzle-orm/mysql-core'

export const users = mysqlTable(
  'users',
  {
    id: char('id', { length: 36 }).primaryKey(),
    googleSub: varchar('google_sub', { length: 120 }).notNull(),
    displayName: varchar('display_name', { length: 60 }).notNull(),
    avatarKey: varchar('avatar_key', { length: 80 }).notNull().default('R1'),
    onboardingCompleted: boolean('onboarding_completed').notNull().default(false),
    status: varchar('status', { length: 20 }).notNull().default('active'),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 }).notNull(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 }).notNull(),
  },
  table => [
    uniqueIndex('uq_users_google_sub').on(table.googleSub),
  ],
)

export type UserRecord = typeof users.$inferSelect
export type NewUserRecord = typeof users.$inferInsert
