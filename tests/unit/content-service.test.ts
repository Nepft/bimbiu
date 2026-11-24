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
})
