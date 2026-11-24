import { z } from 'zod'
import type { QuizQuestion } from '../content/types'

export const submitAnswerPayloadSchema = z.object({
  questionId: z.string().min(1),
  optionId: z.string().min(1).optional(),
  optionIds: z.array(z.string().min(1)).optional(),
  text: z.string().optional(),
})

export type SubmitAnswerPayload = z.infer<typeof submitAnswerPayloadSchema>

export interface EvaluationResult {
  isCorrect: boolean
  normalizedAnswer: Record<string, unknown>
  correctAnswerLabel: string
}

function normalizeBlankText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function evaluateQuestionAnswer(
  question: QuizQuestion,
  payload: SubmitAnswerPayload,
): EvaluationResult {
  switch (question.type) {
    case 'multiple_choice':
    case 'image_quiz': {
      const chosenId = payload.optionId?.trim()
      if (!chosenId) {
        throw new Error('Pilih salah satu jawaban terlebih dahulu.')
      }
      const validOption = question.options.find(o => o.id === chosenId)
      if (!validOption) {
        throw new Error('Pilihan jawaban tidak ditemukan pada soal ini.')
      }
      const correctOpt = question.options.find(o => o.id === question.correctAnswer.optionId)
      return {
        isCorrect: chosenId === question.correctAnswer.optionId,
        normalizedAnswer: { optionId: chosenId },
        correctAnswerLabel: correctOpt?.text ?? question.correctAnswer.optionId,
      }
    }

    case 'true_false': {
      const chosenId = payload.optionId?.trim().toLowerCase()
      if (chosenId !== 'true' && chosenId !== 'false') {
        throw new Error('Pilih Benar atau Salah.')
      }
      const chosenBool = chosenId === 'true'
      return {
        isCorrect: chosenBool === question.correctAnswer.value,
        normalizedAnswer: { value: chosenBool },
        correctAnswerLabel: question.correctAnswer.value ? 'Benar' : 'Salah',
      }
    }

    case 'fill_in_the_blank': {
      const rawText = payload.text ?? ''
      const normalized = normalizeBlankText(rawText)
      if (!normalized) {
        throw new Error('Isi jawaban terlebih dahulu.')
      }
      const isCorrect = question.correctAnswer.acceptedAnswers.some(
        accepted => normalizeBlankText(accepted) === normalized,
      )
      return {
        isCorrect,
        normalizedAnswer: { text: rawText.trim() },
        correctAnswerLabel: question.correctAnswer.acceptedAnswers[0] ?? '',
      }
    }

    case 'multiple_select': {
      const chosenIds = Array.from(new Set((payload.optionIds ?? []).map(id => id.trim()).filter(Boolean)))
      if (chosenIds.length === 0) {
        throw new Error('Pilih minimal satu jawaban.')
      }
      const validSet = new Set(question.options.map(o => o.id))
      for (const id of chosenIds) {
        if (!validSet.has(id)) {
          throw new Error('Ada pilihan jawaban yang tidak valid.')
        }
      }
      const expectedSet = new Set(question.correctAnswer.optionIds)
      const isCorrect =
        chosenIds.length === expectedSet.size && chosenIds.every(id => expectedSet.has(id))
      const correctLabels = question.options
        .filter(o => expectedSet.has(o.id))
        .map(o => o.text)
        .join(', ')

      return {
        isCorrect,
        normalizedAnswer: { optionIds: chosenIds },
        correctAnswerLabel: correctLabels,
      }
    }
  }
}

export function calculateLevelInfo(totalXp: number) {
  const safeXp = Math.max(0, Math.floor(totalXp))
  const xpPerLevel = 100
  const level = Math.floor(safeXp / xpPerLevel) + 1
  const currentLevelXp = safeXp % xpPerLevel
  const nextLevelXp = level * xpPerLevel
  const xpToNextLevel = nextLevelXp - safeXp
  const progressPercent = Math.round((currentLevelXp / xpPerLevel) * 100)

  return {
    totalXp: safeXp,
    level,
    currentLevelXp,
    nextLevelXp,
    xpToNextLevel,
    progressPercent,
  }
}
