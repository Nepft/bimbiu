import { describe, expect, it } from 'vitest'
import {
  calculateLevelInfo,
  evaluateQuestionAnswer,
} from '../../server/services/quiz-evaluator'
import type { QuizQuestion } from '../../server/content/types'

describe('evaluateQuestionAnswer across all 5 MVP question types', () => {
  it('evaluates multiple_choice and image_quiz', () => {
    const mc: QuizQuestion = {
      id: 'q1',
      type: 'multiple_choice',
      prompt: 'Planet terbesar?',
      hint: 'Gas raksasa',
      explanation: 'Jupiter adalah planet terbesar.',
      options: [
        { id: 'a', text: 'Bumi' },
        { id: 'b', text: 'Jupiter' },
      ],
      correctAnswer: { optionId: 'b' },
    }
    expect(evaluateQuestionAnswer(mc, { questionId: 'q1', optionId: 'b' }).isCorrect).toBe(true)
    expect(evaluateQuestionAnswer(mc, { questionId: 'q1', optionId: 'a' }).isCorrect).toBe(false)

    const img: QuizQuestion = {
      id: 'q2',
      type: 'image_quiz',
      prompt: 'Gambar planet?',
      mediaKey: 'quiz-planet',
      mediaCaption: 'Planet biru',
      hint: 'Kedelapan',
      explanation: 'Neptunus berwarna biru.',
      options: [
        { id: 'a', text: 'Mars' },
        { id: 'b', text: 'Neptunus' },
      ],
      correctAnswer: { optionId: 'b' },
    }
    expect(evaluateQuestionAnswer(img, { questionId: 'q2', optionId: 'b' }).isCorrect).toBe(true)
  })

  it('evaluates true_false', () => {
    const tf: QuizQuestion = {
      id: 'q3',
      type: 'true_false',
      prompt: 'Bumi mengelilingi Matahari.',
      hint: 'Heliosentris',
      explanation: 'Benar, Bumi berevolusi mengelilingi Matahari.',
      options: [
        { id: 'true', text: 'Benar' },
        { id: 'false', text: 'Salah' },
      ],
      correctAnswer: { value: true },
    }
    expect(evaluateQuestionAnswer(tf, { questionId: 'q3', optionId: 'true' }).isCorrect).toBe(true)
    expect(evaluateQuestionAnswer(tf, { questionId: 'q3', optionId: 'false' }).isCorrect).toBe(false)
  })

  it('evaluates fill_in_the_blank case-insensitively with whitespace normalization', () => {
    const fib: QuizQuestion = {
      id: 'q4',
      type: 'fill_in_the_blank',
      prompt: 'Planet terdekat Matahari?',
      hint: 'Awalan M',
      explanation: 'Merkurius adalah planet terdekat.',
      correctAnswer: { acceptedAnswers: ['Merkurius'] },
    }
    expect(evaluateQuestionAnswer(fib, { questionId: 'q4', text: '  merkurius  ' }).isCorrect).toBe(true)
    expect(evaluateQuestionAnswer(fib, { questionId: 'q4', text: 'Venus' }).isCorrect).toBe(false)
  })

  it('evaluates multiple_select requiring exact set match', () => {
    const ms: QuizQuestion = {
      id: 'q5',
      type: 'multiple_select',
      prompt: 'Pilih planet berbatu',
      hint: 'Bagian dalam',
      explanation: 'Merkurius dan Bumi adalah planet berbatu.',
      options: [
        { id: 'a', text: 'Merkurius' },
        { id: 'b', text: 'Bumi' },
        { id: 'c', text: 'Jupiter' },
      ],
      correctAnswer: { optionIds: ['a', 'b'] },
    }
    expect(evaluateQuestionAnswer(ms, { questionId: 'q5', optionIds: ['b', 'a'] }).isCorrect).toBe(true)
    expect(evaluateQuestionAnswer(ms, { questionId: 'q5', optionIds: ['a'] }).isCorrect).toBe(false)
    expect(evaluateQuestionAnswer(ms, { questionId: 'q5', optionIds: ['a', 'b', 'c'] }).isCorrect).toBe(false)
  })
})

describe('calculateLevelInfo', () => {
  it('computes level and XP thresholds accurately', () => {
    expect(calculateLevelInfo(0)).toEqual({
      totalXp: 0,
      level: 1,
      currentLevelXp: 0,
      nextLevelXp: 100,
      xpToNextLevel: 100,
      progressPercent: 0,
    })

    expect(calculateLevelInfo(140)).toEqual({
      totalXp: 140,
      level: 2,
      currentLevelXp: 40,
      nextLevelXp: 200,
      xpToNextLevel: 60,
      progressPercent: 40,
    })
  })
})
