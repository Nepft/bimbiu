import { char, datetime, mysqlTable, uniqueIndex, varchar } from 'drizzle-orm/mysql-core'
import { users } from './users'

export const userBadges = mysqlTable(
  'user_badges',
  {
    id: char('id', { length: 36 }).primaryKey(),
    userId: char('user_id', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    badgeId: varchar('badge_id', { length: 100 }).notNull(),
    awardedAt: datetime('awarded_at', { mode: 'date', fsp: 3 }).notNull(),
  },
  table => [
    uniqueIndex('uq_user_badges_user_badge').on(table.userId, table.badgeId),
  ],
)

export type UserBadgeRecord = typeof userBadges.$inferSelect
export type NewUserBadgeRecord = typeof userBadges.$inferInsert
