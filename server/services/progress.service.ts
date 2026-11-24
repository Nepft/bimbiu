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
      learningRepository.getRecentCompletedAttempts(userId, 12),
    ])

    const categoriesById = new Map(store.categories.map(c => [c.id, c]))
    const progressByLesson = new Map(progressRows.map(row => [row.lessonId, row]))
    const completedRows = progressRows.filter(
      row => row.status === 'completed' || row.status === 'mastered',
    )
    const masteredRows = progressRows.filter(row => row.status === 'mastered')

    const inProgressAttempts = recentAttempts.filter(a => a.status === 'in_progress')
    const inProgressLessonIds = new Set(
      inProgressAttempts
        .map(a => a.lessonId)
        .filter((id) => {
          const p = progressByLesson.get(id)
          return !p || (p.status !== 'completed' && p.status !== 'mastered')
        }),
    )

    const averageScore =
      completedRows.length > 0
        ? Math.round(
            completedRows.reduce((sum, row) => sum + row.bestScore, 0) / completedRows.length,
          )
        : 0

    const lessonProgress: Array<{
      id: string
      icon: string
      title: string
      categoryTitle: string
      attemptsCount: number
      statusLabel: string
      scoreLabel: string
      active: boolean
    }> = []

    for (const lessonId of inProgressLessonIds) {
      const lesson = store.lessonsById.get(lessonId)
      if (!lesson) continue
      const cat = categoriesById.get(lesson.categoryId)
      lessonProgress.push({
        id: lesson.id,
        icon: CATEGORY_ICON_MAP[lesson.categoryId] ?? 'cat-science',
        title: lesson.title,
        categoryTitle: cat?.title ?? lesson.categoryId,
        attemptsCount: 1,
        statusLabel: 'Sedang Dikerjakan',
        scoreLabel: `${lesson.questions.length} soal`,
        active: true,
      })
    }

    const sortedCompleted = [...completedRows].sort(
      (a, b) => (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0),
    )

    for (const row of sortedCompleted) {
      const lesson = store.lessonsById.get(row.lessonId)
      if (!lesson) continue
      const cat = categoriesById.get(lesson.categoryId)
      lessonProgress.push({
        id: lesson.id,
        icon: CATEGORY_ICON_MAP[lesson.categoryId] ?? 'cat-science',
        title: lesson.title,
        categoryTitle: cat?.title ?? lesson.categoryId,
        attemptsCount: row.attemptsCount,
        statusLabel: row.status === 'mastered' ? 'Mastered' : 'Selesai',
        scoreLabel: `Skor terbaik: ${row.bestScore}`,
        active: false,
      })
    }

    const recentHistory = recentAttempts
      .filter(a => a.status === 'completed')
      .map((a) => {
        const lesson = store.lessonsById.get(a.lessonId)
        const score = a.score ?? 0
        return {
          attemptId: a.id,
          lessonId: a.lessonId,
          lessonTitle: lesson?.title ?? a.lessonId,
          score,
          statusLabel: score >= 80 ? 'Mastered' : 'Selesai',
          xpAwarded: a.xpAwarded,
          completedAt: a.completedAt,
        }
      })

    const notStartedCount = Math.max(
      0,
      store.lessons.length - completedRows.length - inProgressLessonIds.size,
    )

    return {
      completedLessonsCount: completedRows.length,
      masteredLessonsCount: masteredRows.length,
      inProgressCount: inProgressLessonIds.size,
      notStartedCount,
      totalLessonsCount: store.lessons.length,
      averageScore,
      lessonProgress,
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
