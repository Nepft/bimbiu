import { describe, expect, it } from 'vitest'
import { getTableConfig } from 'drizzle-orm/mysql-core'
import {
  attemptAnswers,
  lessonProgress,
  quizAttempts,
  userBadges,
  userSessions,
  users,
  xpTransactions,
} from '../../server/database/schema'

describe('TiDB Drizzle schema', () => {
  it('defines all 7 core tables with expected table names', () => {
    expect(getTableConfig(users).name).toBe('users')
    expect(getTableConfig(userSessions).name).toBe('user_sessions')
    expect(getTableConfig(quizAttempts).name).toBe('quiz_attempts')
    expect(getTableConfig(attemptAnswers).name).toBe('attempt_answers')
    expect(getTableConfig(lessonProgress).name).toBe('lesson_progress')
    expect(getTableConfig(xpTransactions).name).toBe('xp_transactions')
    expect(getTableConfig(userBadges).name).toBe('user_badges')
  })

  it('defines unique indexes for idempotency and data integrity', () => {
    const usersIndexes = getTableConfig(users).indexes.map(i => i.config.name)
    const sessionIndexes = getTableConfig(userSessions).indexes.map(i => i.config.name)
    const attemptIndexes = getTableConfig(quizAttempts).indexes.map(i => i.config.name)
    const answerIndexes = getTableConfig(attemptAnswers).indexes.map(i => i.config.name)
    const progressIndexes = getTableConfig(lessonProgress).indexes.map(i => i.config.name)
    const xpIndexes = getTableConfig(xpTransactions).indexes.map(i => i.config.name)
    const badgeIndexes = getTableConfig(userBadges).indexes.map(i => i.config.name)

    expect(usersIndexes).toContain('uq_users_google_sub')
    expect(sessionIndexes).toContain('uq_user_sessions_token_hash')
    expect(attemptIndexes).toContain('uq_quiz_attempts_idempotency')
    expect(answerIndexes).toContain('uq_attempt_answers_attempt_question')
    expect(progressIndexes).toContain('uq_lesson_progress_user_lesson')
    expect(xpIndexes).toContain('uq_xp_reward_idempotency')
    expect(badgeIndexes).toContain('uq_user_badges_user_badge')
  })
})
