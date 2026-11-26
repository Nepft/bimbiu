import { describe, expect, it } from 'vitest'
import {
  getCategoryDetail,
  getLessonById,
  listBadgeDefinitions,
  listCategoriesWithCounts,
  sanitizeLessonForClient,
} from '../../server/services/content.service'

describe('Static content loader and DTO sanitizer', () => {
  it('loads 6 categories with 4 units and 20 lessons each (120 lessons total)', () => {
    const categories = listCategoriesWithCounts()
    expect(categories).toHaveLength(6)

    let totalLessons = 0
    for (const cat of categories) {
      expect(cat.unitCount).toBe(4)
      expect(cat.lessonCount).toBe(20)
      totalLessons += cat.lessonCount
    }
    expect(totalLessons).toBe(120)
  })

  it('loads category detail with nested units and lessons', () => {
    const detail = getCategoryDetail('science-nature')
    expect(detail).not.toBeNull()
    expect(detail?.units).toHaveLength(4)
    expect(detail?.units[0]?.lessons.length).toBe(5)
  })

  it('strips correctAnswer and acceptedAnswers when sanitizing a lesson for client', () => {
    const lesson = getLessonById('science-planets-01')
    expect(lesson).not.toBeNull()

    const sanitized = sanitizeLessonForClient(lesson!)
    expect(sanitized.questions).toHaveLength(10)

    const serialized = JSON.stringify(sanitized)
    expect(serialized).not.toContain('correctAnswer')
    expect(serialized).not.toContain('acceptedAnswers')
  })

  it('loads badge definitions', () => {
    const badges = listBadgeDefinitions()
    expect(badges.length).toBeGreaterThanOrEqual(4)
  })

  it('shuffles questions and non-true_false options deterministically by attempt seed', () => {
    const lesson = getLessonById('science-planets-01')!
    const runA1 = sanitizeLessonForClient(lesson, 'attempt-seed-1')
    const runA2 = sanitizeLessonForClient(lesson, 'attempt-seed-1')
    const runB = sanitizeLessonForClient(lesson, 'attempt-seed-2')

    expect(runA1.questions.map(q => q.id)).toEqual(runA2.questions.map(q => q.id))
    expect(runA1.questions.map(q => q.id)).not.toEqual(runB.questions.map(q => q.id))
    expect(runA1.questions.map(q => q.id)).not.toEqual(lesson.questions.map(q => q.id))

    const tfQuestion = runA1.questions.find(q => q.type === 'true_false')
    expect(tfQuestion && 'options' in tfQuestion ? tfQuestion.options.map(o => o.id) : []).toEqual(['true', 'false'])

    const mcOriginal = lesson.questions.find(q => q.type === 'multiple_choice')!
    const mcRunA1 = runA1.questions.find(q => q.id === mcOriginal.id)!
    const mcRunA2 = runA2.questions.find(q => q.id === mcOriginal.id)!
    if ('options' in mcOriginal && 'options' in mcRunA1 && 'options' in mcRunA2) {
      expect(mcRunA1.options.map(o => o.id)).toEqual(mcRunA2.options.map(o => o.id))
      expect(new Set(mcRunA1.options.map(o => o.id))).toEqual(new Set(mcOriginal.options.map(o => o.id)))
    }
  })
})
