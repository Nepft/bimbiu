import { char, datetime, int, mysqlTable, uniqueIndex, varchar } from 'drizzle-orm/mysql-core'
import { users } from './users'

export const lessonProgress = mysqlTable(
  'lesson_progress',
  {
    id: char('id', { length: 36 }).primaryKey(),
    userId: char('user_id', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    lessonId: varchar('lesson_id', { length: 100 }).notNull(),
    status: varchar('status', { length: 20 }).notNull().default('not_started'),
    bestScore: int('best_score').notNull().default(0),
    attemptsCount: int('attempts_count').notNull().default(0),
    firstCompletedAt: datetime('first_completed_at', { mode: 'date', fsp: 3 }),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 }).notNull(),
  },
  table => [
    uniqueIndex('uq_lesson_progress_user_lesson').on(table.userId, table.lessonId),
  ],
)

export type LessonProgressRecord = typeof lessonProgress.$inferSelect
export type NewLessonProgressRecord = typeof lessonProgress.$inferInsert
