import { char, datetime, index, int, mysqlTable, uniqueIndex, varchar } from 'drizzle-orm/mysql-core'
import { users } from './users'

export const xpTransactions = mysqlTable(
  'xp_transactions',
  {
    id: char('id', { length: 36 }).primaryKey(),
    userId: char('user_id', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    sourceType: varchar('source_type', { length: 30 }).notNull(),
    sourceId: varchar('source_id', { length: 120 }).notNull(),
    transactionType: varchar('transaction_type', { length: 30 }).notNull().default('earn'),
    amount: int('amount').notNull(),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 }).notNull(),
  },
  table => [
    uniqueIndex('uq_xp_reward_idempotency').on(
      table.userId,
      table.sourceType,
      table.sourceId,
      table.transactionType,
    ),
    index('idx_xp_transactions_user_created').on(table.userId, table.createdAt),
  ],
)

export type XpTransactionRecord = typeof xpTransactions.$inferSelect
export type NewXpTransactionRecord = typeof xpTransactions.$inferInsert
