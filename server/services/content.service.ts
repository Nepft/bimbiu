import { loadContentStore } from '../repositories/content.repository'
import type { LessonContent, QuizQuestion, SanitizedQuizQuestion } from '../content/types'

function hashSeed(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function createSeededRng(seed: string): () => number {
  let state = hashSeed(seed) || 1
  return () => {
    state = (state + 0x6D2B79F5) >>> 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffleWithSeed<T>(items: readonly T[], seed: string): T[] {
  const arr = [...items]
  if (arr.length <= 1) return arr
  const rand = createSeededRng(seed)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    const tmp = arr[i]!
    arr[i] = arr[j]!
    arr[j] = tmp
  }
  return arr
}

export function sanitizeQuestion(question: QuizQuestion, seed?: string): SanitizedQuizQuestion {
  const { correctAnswer: _omitted, ...safeQuestion } = question
  if (
    seed
    && (question.type === 'multiple_choice' || question.type === 'multiple_select' || question.type === 'image_quiz')
  ) {
    return {
      ...safeQuestion,
      options: shuffleWithSeed(question.options, `${seed}:${question.id}:options`),
    } as unknown as SanitizedQuizQuestion
  }
  return safeQuestion
}

export function sanitizeLessonForClient(lesson: LessonContent, seed?: string) {
  const orderedQuestions = seed
    ? shuffleWithSeed(lesson.questions, `${seed}:questions`)
    : lesson.questions

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
    questions: orderedQuestions.map(q => sanitizeQuestion(q, seed)),
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
