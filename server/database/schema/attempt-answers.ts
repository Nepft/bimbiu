import { boolean, char, datetime, json, mysqlTable, uniqueIndex, varchar } from 'drizzle-orm/mysql-core'
import { quizAttempts } from './quiz-attempts'

export const attemptAnswers = mysqlTable(
  'attempt_answers',
  {
    id: char('id', { length: 36 }).primaryKey(),
    attemptId: char('attempt_id', { length: 36 })
      .notNull()
      .references(() => quizAttempts.id, { onDelete: 'cascade' }),
    questionId: varchar('question_id', { length: 100 }).notNull(),
    submittedAnswer: json('submitted_answer').$type<Record<string, unknown>>().notNull(),
    questionSnapshot: json('question_snapshot').$type<Record<string, unknown>>().notNull(),
    isCorrect: boolean('is_correct').notNull(),
    answeredAt: datetime('answered_at', { mode: 'date', fsp: 3 }).notNull(),
  },
  table => [
    uniqueIndex('uq_attempt_answers_attempt_question').on(table.attemptId, table.questionId),
  ],
)

export type AttemptAnswerRecord = typeof attemptAnswers.$inferSelect
export type NewAttemptAnswerRecord = typeof attemptAnswers.$inferInsert
