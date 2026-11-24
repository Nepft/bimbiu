import { loadContentStore } from '../repositories/content.repository'
import { learningRepository } from '../repositories/learning.repository'
import { getCategoryDetail, listCategoriesWithCounts } from './content.service'
import { calculateLevelInfo } from './quiz-evaluator'

const CATEGORY_ICON_MAP: Record<string, string> = {
  'science-nature': 'cat-science',
  'world-geography': 'cat-geography',
  'history-culture': 'cat-history',
  'logic-mathematics': 'cat-logic',
  'language-words': 'cat-language',
  'everyday-knowledge': 'cat-everyday',
}

export const progressService = {
  async getCatalogForLearner(userId: string) {
    const progressRows = await learningRepository.getLessonProgressByUser(userId)
    const progressByLesson = new Map(progressRows.map(row => [row.lessonId, row]))
    const store = loadContentStore()

    const categories = listCategoriesWithCounts().map((cat) => {
      const catLessons = store.lessons.filter(l => l.categoryId === cat.id)
      const completedLessons = catLessons.filter((l) => {
        const p = progressByLesson.get(l.id)
        return p && (p.status === 'completed' || p.status === 'mastered')
      }).length

      return {
        ...cat,
        completedLessons,
      }
    })

    const nextLesson = store.lessons.find((l) => {
      const p = progressByLesson.get(l.id)
      return !p || (p.status !== 'completed' && p.status !== 'mastered')
    }) ?? store.lessons[0]

    return {
      categories,
      recommendedLesson: nextLesson
        ? {
            id: nextLesson.id,
            title: nextLesson.title,
            categoryId: nextLesson.categoryId,
            xpReward: nextLesson.xpReward,
            estimatedMinutes: nextLesson.estimatedMinutes,
          }
        : null,
    }
  },

  async getCategoryDetailForLearner(userId: string, categoryId: string) {
    const detail = getCategoryDetail(categoryId)
    if (!detail) return null

    const progressRows = await learningRepository.getLessonProgressByUser(userId)
    const progressByLesson = new Map(progressRows.map(row => [row.lessonId, row]))
    const completedSet = new Set(
      progressRows
        .filter(p => p.status === 'completed' || p.status === 'mastered')
        .map(p => p.lessonId),
    )

    const units = detail.units.map(unit => ({
      ...unit,
      lessons: unit.lessons.map((lesson) => {
        const prog = progressByLesson.get(lesson.id)
        const prereqsMet = lesson.prerequisites.every(reqId => completedSet.has(reqId))
        let status: 'locked' | 'not_started' | 'completed' | 'mastered' = prereqsMet
          ? 'not_started'
          : 'locked'

        if (prog?.status === 'mastered') {
          status = 'mastered'
        } else if (prog?.status === 'completed') {
          status = 'completed'
        }

        return {
          ...lesson,
          status,
          bestScore: prog?.bestScore ?? 0,
          attemptsCount: prog?.attemptsCount ?? 0,
        }
      }),
    }))

    return {
      ...detail,
      units,
    }
  },

  async getProgressSummary(userId: string) {
    const store = loadContentStore()
    const [progressRows, recentAttempts] = await Promise.all([
      learningRepository.getLessonProgressByUser(userId),
      learningRepository.getRecentCompletedAttempts(userId, 8),
    ])

    const progressByLesson = new Map(progressRows.map(row => [row.lessonId, row]))
    const completedRows = progressRows.filter(
      row => row.status === 'completed' || row.status === 'mastered',
    )
    const averageScore =
      completedRows.length > 0
        ? Math.round(
            completedRows.reduce((sum, row) => sum + row.bestScore, 0) / completedRows.length,
          )
        : 0

    const categories = store.categories.map((cat) => {
      const catLessons = store.lessons.filter(l => l.categoryId === cat.id)
      const completedCount = catLessons.filter((l) => {
        const p = progressByLesson.get(l.id)
        return p && (p.status === 'completed' || p.status === 'mastered')
      }).length

      return {
        id: cat.id,
        title: cat.title,
        icon: CATEGORY_ICON_MAP[cat.id] ?? 'cat-science',
        totalLessons: catLessons.length,
        completedLessons: completedCount,
        progressPercent:
          catLessons.length > 0 ? Math.round((completedCount / catLessons.length) * 100) : 0,
      }
    })

    const recentHistory = recentAttempts
      .filter(a => a.status === 'completed')
      .map((a) => {
        const lesson = store.lessonsById.get(a.lessonId)
        return {
          attemptId: a.id,
          lessonId: a.lessonId,
          lessonTitle: lesson?.title ?? a.lessonId,
          score: a.score ?? 0,
          xpAwarded: a.xpAwarded,
          completedAt: a.completedAt,
        }
      })

    return {
      completedLessonsCount: completedRows.length,
      totalLessonsCount: store.lessons.length,
      averageScore,
      categories,
      recentHistory,
    }
  },

  async getRewardsSummary(userId: string) {
    const store = loadContentStore()
    const [totalXp, earnedBadges] = await Promise.all([
      learningRepository.getTotalXp(userId),
      learningRepository.getUserBadges(userId),
    ])

    const levelInfo = calculateLevelInfo(totalXp)
    const earnedMap = new Map(earnedBadges.map(b => [b.badgeId, b.awardedAt]))

    const badges = store.badges.map(badge => ({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      earned: earnedMap.has(badge.id),
      awardedAt: earnedMap.get(badge.id) ?? null,
    }))

    return {
      ...levelInfo,
      earnedBadgesCount: earnedBadges.length,
      totalBadgesCount: store.badges.length,
      badges,
    }
  },
}
