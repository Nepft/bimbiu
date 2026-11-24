import { and, eq } from 'drizzle-orm'
import { createError } from 'h3'
import { randomUUID } from 'node:crypto'
import { getDb } from '../database/client'
import {
  attemptAnswers,
  lessonProgress,
  quizAttempts,
  userBadges,
  xpTransactions,
} from '../database/schema'
import { loadContentStore } from '../repositories/content.repository'
import { learningRepository } from '../repositories/learning.repository'
import { sanitizeLessonForClient } from './content.service'
import {
  calculateLevelInfo,
  evaluateQuestionAnswer,
  submitAnswerPayloadSchema,
} from './quiz-evaluator'

function isDuplicateEntryError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const err = error as { code?: string; errno?: number; cause?: { code?: string; errno?: number } }
  return (
    err.code === 'ER_DUP_ENTRY' ||
    err.errno === 1062 ||
    err.cause?.code === 'ER_DUP_ENTRY' ||
    err.cause?.errno === 1062
  )
}

export const quizService = {
  async startAttempt(userId: string, lessonId: string, idempotencyKey: string) {
    const store = loadContentStore()
    const lesson = store.lessonsById.get(lessonId)
    if (!lesson) {
      throw createError({ statusCode: 404, statusMessage: 'Pelajaran tidak ditemukan.' })
    }

    const db = getDb()
    const existingByIdempotency = await db
      .select()
      .from(quizAttempts)
      .where(
        and(
          eq(quizAttempts.idempotencyKey, idempotencyKey),
          eq(quizAttempts.userId, userId),
        ),
      )
      .limit(1)

    if (existingByIdempotency[0]) {
      return this.getAttemptState(userId, existingByIdempotency[0].id)
    }

    if (lesson.prerequisites.length > 0) {
      const progressRows = await learningRepository.getLessonProgressByUser(userId)
      const completedSet = new Set(
        progressRows
          .filter(p => p.status === 'completed' || p.status === 'mastered')
          .map(p => p.lessonId),
      )
      const missingPrereq = lesson.prerequisites.some(reqId => !completedSet.has(reqId))
      if (missingPrereq) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Selesaikan pelajaran sebelumnya terlebih dahulu.',
        })
      }
    }

    const attemptId = randomUUID()
    const now = new Date()

    await db.insert(quizAttempts).values({
      id: attemptId,
      userId,
      lessonId: lesson.id,
      contentVersion: lesson.contentVersion,
      status: 'in_progress',
      totalQuestions: lesson.questions.length,
      correctAnswers: 0,
      score: null,
      xpAwarded: 0,
      idempotencyKey,
      startedAt: now,
      completedAt: null,
    })

    return {
      attempt: {
        id: attemptId,
        lessonId: lesson.id,
        contentVersion: lesson.contentVersion,
        status: 'in_progress',
        totalQuestions: lesson.questions.length,
        answeredQuestionIds: [] as string[],
      },
      lesson: sanitizeLessonForClient(lesson),
    }
  },

  async getAttemptState(userId: string, attemptId: string) {
    const db = getDb()
    const rows = await db
      .select()
      .from(quizAttempts)
      .where(eq(quizAttempts.id, attemptId))
      .limit(1)

    const attempt = rows[0]
    if (!attempt || attempt.userId !== userId) {
      throw createError({ statusCode: 404, statusMessage: 'Sesi kuis tidak ditemukan.' })
    }

    const store = loadContentStore()
    const lesson = store.lessonsById.get(attempt.lessonId)
    if (!lesson) {
      throw createError({ statusCode: 404, statusMessage: 'Materi pelajaran tidak ditemukan.' })
    }

    const answers = await db
      .select()
      .from(attemptAnswers)
      .where(eq(attemptAnswers.attemptId, attempt.id))

    return {
      attempt: {
        id: attempt.id,
        lessonId: attempt.lessonId,
        contentVersion: attempt.contentVersion,
        status: attempt.status,
        totalQuestions: attempt.totalQuestions,
        answeredQuestionIds: answers.map(a => a.questionId),
      },
      lesson: sanitizeLessonForClient(lesson),
    }
  },

  async submitAnswer(userId: string, attemptId: string, rawBody: unknown) {
    const parsed = submitAnswerPayloadSchema.safeParse(rawBody)
    if (!parsed.success) {
      throw createError({ statusCode: 400, statusMessage: 'Format jawaban tidak valid.' })
    }

    const db = getDb()
    const attemptRows = await db
      .select()
      .from(quizAttempts)
      .where(eq(quizAttempts.id, attemptId))
      .limit(1)

    const attempt = attemptRows[0]
    if (!attempt || attempt.userId !== userId) {
      throw createError({ statusCode: 404, statusMessage: 'Sesi kuis tidak ditemukan.' })
    }

    if (attempt.status !== 'in_progress') {
      throw createError({ statusCode: 409, statusMessage: 'Sesi kuis ini sudah selesai.' })
    }

    const store = loadContentStore()
    const lesson = store.lessonsById.get(attempt.lessonId)
    if (!lesson) {
      throw createError({ statusCode: 404, statusMessage: 'Pelajaran tidak ditemukan.' })
    }

    const question = lesson.questions.find(q => q.id === parsed.data.questionId)
    if (!question) {
      throw createError({ statusCode: 404, statusMessage: 'Pertanyaan tidak ditemukan.' })
    }

    const existingAnswer = await db
      .select()
      .from(attemptAnswers)
      .where(
        and(
          eq(attemptAnswers.attemptId, attempt.id),
          eq(attemptAnswers.questionId, question.id),
        ),
      )
      .limit(1)

    if (existingAnswer[0]) {
      throw createError({ statusCode: 409, statusMessage: 'Pertanyaan ini sudah dijawab.' })
    }

    let evaluation
    try {
      evaluation = evaluateQuestionAnswer(question, parsed.data)
    } catch (error) {
      throw createError({
        statusCode: 400,
        statusMessage: error instanceof Error ? error.message : 'Jawaban tidak valid.',
      })
    }

    await db.insert(attemptAnswers).values({
      id: randomUUID(),
      attemptId: attempt.id,
      questionId: question.id,
      submittedAnswer: evaluation.normalizedAnswer,
      questionSnapshot: {
        id: question.id,
        type: question.type,
        prompt: question.prompt,
        explanation: question.explanation,
        correctAnswerLabel: evaluation.correctAnswerLabel,
      },
      isCorrect: evaluation.isCorrect,
      answeredAt: new Date(),
    })

    return {
      questionId: question.id,
      isCorrect: evaluation.isCorrect,
      title: evaluation.isCorrect ? 'Hebat! Jawabanmu Benar' : 'Hampir Tepat! Yuk Pelajari',
      correctAnswerLabel: evaluation.isCorrect ? undefined : evaluation.correctAnswerLabel,
      explanation: question.explanation,
    }
  },

  async completeAttempt(userId: string, attemptId: string) {
    const db = getDb()
    const store = loadContentStore()

    const newlyAwardedBadgeIds: string[] = []

    await db.transaction(async (tx) => {
      const attemptRows = await tx
        .select()
        .from(quizAttempts)
        .where(eq(quizAttempts.id, attemptId))
        .limit(1)

      const attempt = attemptRows[0]
      if (!attempt || attempt.userId !== userId) {
        throw createError({ statusCode: 404, statusMessage: 'Sesi kuis tidak ditemukan.' })
      }

      if (attempt.status === 'completed') {
        return
      }

      const lesson = store.lessonsById.get(attempt.lessonId)
      if (!lesson) {
        throw createError({ statusCode: 404, statusMessage: 'Pelajaran tidak ditemukan.' })
      }

      const answers = await tx
        .select()
        .from(attemptAnswers)
        .where(eq(attemptAnswers.attemptId, attempt.id))

      if (answers.length < attempt.totalQuestions) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Jawab semua pertanyaan sebelum menyelesaikan kuis.',
        })
      }

      const correctAnswersCount = answers.filter(a => a.isCorrect).length
      const score = Math.round((correctAnswersCount / attempt.totalQuestions) * 100)
      const now = new Date()

      // Idempotent completion XP: unique constraint on (userId, sourceType, sourceId, transactionType)
      let xpAwarded = 0
      try {
        await tx.insert(xpTransactions).values({
          id: randomUUID(),
          userId,
          sourceType: 'lesson_completion',
          sourceId: lesson.id,
          transactionType: 'earn',
          amount: lesson.xpReward,
          createdAt: now,
        })
        xpAwarded = lesson.xpReward
      } catch (error) {
        if (!isDuplicateEntryError(error)) {
          throw error
        }
      }

      // Upsert lesson_progress
      const existingProgressRows = await tx
        .select()
        .from(lessonProgress)
        .where(
          and(
            eq(lessonProgress.userId, userId),
            eq(lessonProgress.lessonId, lesson.id),
          ),
        )
        .limit(1)

      const existingProgress = existingProgressRows[0]
      const nextStatus = score >= 80 || existingProgress?.status === 'mastered' ? 'mastered' : 'completed'

      if (existingProgress) {
        await tx
          .update(lessonProgress)
          .set({
            status: nextStatus,
            bestScore: Math.max(existingProgress.bestScore, score),
            attemptsCount: existingProgress.attemptsCount + 1,
            firstCompletedAt: existingProgress.firstCompletedAt ?? now,
            updatedAt: now,
          })
          .where(eq(lessonProgress.id, existingProgress.id))
      } else {
        await tx.insert(lessonProgress).values({
          id: randomUUID(),
          userId,
          lessonId: lesson.id,
          status: nextStatus,
          bestScore: score,
          attemptsCount: 1,
          firstCompletedAt: now,
          updatedAt: now,
        })
      }

      await tx
        .update(quizAttempts)
        .set({
          status: 'completed',
          correctAnswers: correctAnswersCount,
          score,
          xpAwarded,
          completedAt: now,
        })
        .where(eq(quizAttempts.id, attempt.id))

      // Evaluate badge eligibility
      const allProgress = await tx
        .select()
        .from(lessonProgress)
        .where(eq(lessonProgress.userId, userId))

      const completedLessonIds = new Set(
        allProgress
          .filter(p => p.status === 'completed' || p.status === 'mastered')
          .map(p => p.lessonId),
      )

      const masteredLessonIds = new Set(
        allProgress.filter(p => p.status === 'mastered').map(p => p.lessonId),
      )

      const existingBadges = await tx
        .select()
        .from(userBadges)
        .where(eq(userBadges.userId, userId))
      const earnedBadgeSet = new Set(existingBadges.map(b => b.badgeId))

      for (const badge of store.badges) {
        if (earnedBadgeSet.has(badge.id)) continue

        let eligible = false
        if (badge.ruleType === 'first_lesson' || badge.ruleType === 'lessons_count') {
          eligible = completedLessonIds.size >= Number(badge.targetValue)
        } else if (badge.ruleType === 'mastered_lesson') {
          const targetProgress = allProgress.find(p => p.lessonId === String(badge.targetValue))
          eligible = Boolean(targetProgress && targetProgress.bestScore >= 80)
        } else if (badge.ruleType === 'category_complete') {
          const catLessons = store.lessons.filter(l => l.categoryId === String(badge.targetValue))
          eligible = catLessons.length > 0 && catLessons.every(l => completedLessonIds.has(l.id))
        } else if (badge.ruleType === 'category_mastered') {
          const catLessons = store.lessons.filter(l => l.categoryId === String(badge.targetValue))
          eligible = catLessons.length > 0 && catLessons.every(l => masteredLessonIds.has(l.id))
        } else if (badge.ruleType === 'perfect_score_count') {
          const perfectCount = allProgress.filter(p => p.bestScore === 100).length
          eligible = perfectCount >= Number(badge.targetValue)
        } else if (badge.ruleType === 'mastered_count') {
          eligible = masteredLessonIds.size >= Number(badge.targetValue)
        } else if (badge.ruleType === 'retry_mastery') {
          eligible = allProgress.some(p => p.attemptsCount >= Number(badge.targetValue))
        } else if (badge.ruleType === 'all_categories_started') {
          eligible = store.categories.every(cat =>
            store.lessons.some(l => l.categoryId === cat.id && completedLessonIds.has(l.id)),
          )
        } else if (badge.ruleType === 'all_categories_mastered') {
          eligible = store.categories.every(cat =>
            store.lessons.some(l => l.categoryId === cat.id && masteredLessonIds.has(l.id)),
          )
        } else if (badge.ruleType === 'units_complete') {
          const unitIds = String(badge.targetValue).split(',').map(s => s.trim()).filter(Boolean)
          eligible = unitIds.length > 0 && unitIds.every((uId) => {
            const unitLessons = store.lessons.filter(l => l.unitId === uId)
            return unitLessons.length > 0 && unitLessons.every(l => completedLessonIds.has(l.id))
          })
        } else if (badge.ruleType === 'units_mastered') {
          const unitIds = String(badge.targetValue).split(',').map(s => s.trim()).filter(Boolean)
          eligible = unitIds.length > 0 && unitIds.every((uId) => {
            const unitLessons = store.lessons.filter(l => l.unitId === uId)
            return unitLessons.length > 0 && unitLessons.every(l => masteredLessonIds.has(l.id))
          })
        } else if (badge.ruleType === 'badges_count') {
          eligible = earnedBadgeSet.size >= Number(badge.targetValue)
        }

        if (eligible) {
          try {
            await tx.insert(userBadges).values({
              id: randomUUID(),
              userId,
              badgeId: badge.id,
              awardedAt: now,
            })
            earnedBadgeSet.add(badge.id)
            newlyAwardedBadgeIds.push(badge.id)
          } catch (error) {
            if (!isDuplicateEntryError(error)) {
              throw error
            }
          }
        }
      }
    })

    const result = await this.getAttemptResult(userId, attemptId)
    return {
      ...result,
      newlyAwardedBadgeIds,
    }
  },

  async getAttemptResult(userId: string, attemptId: string) {
    const db = getDb()
    const attemptRows = await db
      .select()
      .from(quizAttempts)
      .where(eq(quizAttempts.id, attemptId))
      .limit(1)

    const attempt = attemptRows[0]
    if (!attempt || attempt.userId !== userId) {
      throw createError({ statusCode: 404, statusMessage: 'Hasil kuis tidak ditemukan.' })
    }

    if (attempt.status !== 'completed') {
      throw createError({ statusCode: 409, statusMessage: 'Kuis ini belum diselesaikan.' })
    }

    const store = loadContentStore()
    const lesson = store.lessonsById.get(attempt.lessonId)
    const answers = await db
      .select()
      .from(attemptAnswers)
      .where(eq(attemptAnswers.attemptId, attempt.id))

    const totalXp = await learningRepository.getTotalXp(userId)
    const levelInfo = calculateLevelInfo(totalXp)

    const reviewItems = answers.map((ans) => {
      const snap = ans.questionSnapshot as {
        prompt?: string
        explanation?: string
        correctAnswerLabel?: string
      }
      return {
        questionId: ans.questionId,
        prompt: snap.prompt ?? '',
        isCorrect: ans.isCorrect,
        explanation: snap.explanation ?? '',
        correctAnswerLabel: snap.correctAnswerLabel ?? '',
      }
    })

    return {
      attempt: {
        id: attempt.id,
        lessonId: attempt.lessonId,
        lessonTitle: lesson?.title ?? attempt.lessonId,
        categoryId: lesson?.categoryId ?? '',
        totalQuestions: attempt.totalQuestions,
        correctAnswers: attempt.correctAnswers,
        score: attempt.score ?? 0,
        xpAwarded: attempt.xpAwarded,
        completedAt: attempt.completedAt,
      },
      rewards: levelInfo,
      reviewItems,
    }
  },
}
