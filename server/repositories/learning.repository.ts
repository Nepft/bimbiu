import { desc, eq, sql } from 'drizzle-orm'
import { getDb } from '../database/client'
import {
  lessonProgress,
  quizAttempts,
  userBadges,
  xpTransactions,
  type LessonProgressRecord,
  type QuizAttemptRecord,
  type UserBadgeRecord,
} from '../database/schema'

export const learningRepository = {
  async getLessonProgressByUser(userId: string): Promise<LessonProgressRecord[]> {
    const db = getDb()
    return db.select().from(lessonProgress).where(eq(lessonProgress.userId, userId))
  },

  async getTotalXp(userId: string): Promise<number> {
    const db = getDb()
    const rows = await db
      .select({
        total: sql<number>`COALESCE(SUM(${xpTransactions.amount}), 0)`,
      })
      .from(xpTransactions)
      .where(eq(xpTransactions.userId, userId))

    return Number(rows[0]?.total ?? 0)
  },

  async getUserBadges(userId: string): Promise<UserBadgeRecord[]> {
    const db = getDb()
    return db
      .select()
      .from(userBadges)
      .where(eq(userBadges.userId, userId))
      .orderBy(desc(userBadges.awardedAt))
  },

  async getRecentCompletedAttempts(userId: string, limit = 10): Promise<QuizAttemptRecord[]> {
    const db = getDb()
    return db
      .select()
      .from(quizAttempts)
      .where(eq(quizAttempts.userId, userId))
      .orderBy(desc(quizAttempts.startedAt))
      .limit(limit)
  },
}
