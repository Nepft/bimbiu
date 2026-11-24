import { loadContentStore } from '../repositories/content.repository'
import type { LessonContent, QuizQuestion, SanitizedQuizQuestion } from '../content/types'

export function sanitizeQuestion(question: QuizQuestion): SanitizedQuizQuestion {
  const { correctAnswer: _omitted, ...safeQuestion } = question
  return safeQuestion
}

export function sanitizeLessonForClient(lesson: LessonContent) {
  return {
    id: lesson.id,
    contentVersion: lesson.contentVersion,
    categoryId: lesson.categoryId,
    unitId: lesson.unitId,
    title: lesson.title,
    description: lesson.description,
    difficulty: lesson.difficulty,
    estimatedMinutes: lesson.estimatedMinutes,
    order: lesson.order,
    prerequisites: lesson.prerequisites,
    xpReward: lesson.xpReward,
    questions: lesson.questions.map(sanitizeQuestion),
  }
}

export function listCategoriesWithCounts() {
  const store = loadContentStore()
  return store.categories.map((cat) => {
    const catLessons = store.lessons.filter(l => l.categoryId === cat.id)
    const catUnits = store.units.filter(u => u.categoryId === cat.id)
    return {
      ...cat,
      unitCount: catUnits.length,
      lessonCount: catLessons.length,
    }
  })
}

export function getCategoryDetail(categoryId: string) {
  const store = loadContentStore()
  const category = store.categories.find(c => c.id === categoryId)
  if (!category) return null

  const units = store.units
    .filter(u => u.categoryId === categoryId)
    .map(unit => ({
      ...unit,
      lessons: store.lessons
        .filter(l => l.categoryId === categoryId && l.unitId === unit.id)
        .map(l => ({
          id: l.id,
          title: l.title,
          description: l.description,
          difficulty: l.difficulty,
          estimatedMinutes: l.estimatedMinutes,
          order: l.order,
          prerequisites: l.prerequisites,
          xpReward: l.xpReward,
          questionCount: l.questions.length,
        })),
    }))

  return {
    ...category,
    units,
  }
}

export function getLessonById(lessonId: string) {
  const store = loadContentStore()
  return store.lessonsById.get(lessonId) ?? null
}

export function listBadgeDefinitions() {
  return loadContentStore().badges
}
