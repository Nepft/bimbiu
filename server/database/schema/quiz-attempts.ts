import { char, datetime, index, int, mysqlTable, uniqueIndex, varchar } from 'drizzle-orm/mysql-core'
import { users } from './users'

export const quizAttempts = mysqlTable(
  'quiz_attempts',
  {
    id: char('id', { length: 36 }).primaryKey(),
    userId: char('user_id', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    lessonId: varchar('lesson_id', { length: 100 }).notNull(),
    contentVersion: varchar('content_version', { length: 30 }).notNull(),
    status: varchar('status', { length: 20 }).notNull().default('in_progress'),
    totalQuestions: int('total_questions').notNull(),
    correctAnswers: int('correct_answers').notNull().default(0),
    score: int('score'),
    xpAwarded: int('xp_awarded').notNull().default(0),
    idempotencyKey: char('idempotency_key', { length: 36 }).notNull(),
    startedAt: datetime('started_at', { mode: 'date', fsp: 3 }).notNull(),
    completedAt: datetime('completed_at', { mode: 'date', fsp: 3 }),
  },
  table => [
    uniqueIndex('uq_quiz_attempts_idempotency').on(table.idempotencyKey),
    index('idx_quiz_attempts_user_started').on(table.userId, table.startedAt),
    index('idx_quiz_attempts_user_lesson_status').on(table.userId, table.lessonId, table.status),
  ],
)

export type QuizAttemptRecord = typeof quizAttempts.$inferSelect
export type NewQuizAttemptRecord = typeof quizAttempts.$inferInsert
