import { z } from 'zod'

export const questionOptionSchema = z.object({
  id: z.string().min(1).max(40),
  text: z.string().min(1).max(300),
})

const baseQuestionFields = {
  id: z.string().min(3).max(100),
  prompt: z.string().min(5).max(500),
  hint: z.string().min(3).max(300),
  explanation: z.string().min(5).max(600),
}

export const multipleChoiceQuestionSchema = z.object({
  ...baseQuestionFields,
  type: z.literal('multiple_choice'),
  options: z.array(questionOptionSchema).min(3).max(5),
  correctAnswer: z.object({
    optionId: z.string().min(1),
  }),
}).superRefine((q, ctx) => {
  const ids = new Set(q.options.map(o => o.id))
  if (ids.size !== q.options.length) {
    ctx.addIssue({ code: 'custom', message: `Duplicate option IDs in ${q.id}` })
  }
  if (!ids.has(q.correctAnswer.optionId)) {
    ctx.addIssue({ code: 'custom', message: `correctAnswer.optionId "${q.correctAnswer.optionId}" not found in options for ${q.id}` })
  }
})

export const trueFalseQuestionSchema = z.object({
  ...baseQuestionFields,
  type: z.literal('true_false'),
  options: z.tuple([questionOptionSchema, questionOptionSchema]),
  correctAnswer: z.object({
    value: z.boolean(),
  }),
})

export const fillInTheBlankQuestionSchema = z.object({
  ...baseQuestionFields,
  type: z.literal('fill_in_the_blank'),
  correctAnswer: z.object({
    acceptedAnswers: z.array(z.string().min(1).max(120)).min(1).max(10),
  }),
})

export const multipleSelectQuestionSchema = z.object({
  ...baseQuestionFields,
  type: z.literal('multiple_select'),
  options: z.array(questionOptionSchema).min(3).max(6),
  correctAnswer: z.object({
    optionIds: z.array(z.string().min(1)).min(1),
  }),
}).superRefine((q, ctx) => {
  const ids = new Set(q.options.map(o => o.id))
  if (ids.size !== q.options.length) {
    ctx.addIssue({ code: 'custom', message: `Duplicate option IDs in ${q.id}` })
  }
  for (const ansId of q.correctAnswer.optionIds) {
    if (!ids.has(ansId)) {
      ctx.addIssue({ code: 'custom', message: `correctAnswer.optionIds "${ansId}" not found in options for ${q.id}` })
    }
  }
})

export const imageQuizQuestionSchema = z.object({
  ...baseQuestionFields,
  type: z.literal('image_quiz'),
  mediaKey: z.string().min(1).max(80),
  mediaCaption: z.string().min(3).max(300),
  options: z.array(questionOptionSchema).min(3).max(5),
  correctAnswer: z.object({
    optionId: z.string().min(1),
  }),
}).superRefine((q, ctx) => {
  const ids = new Set(q.options.map(o => o.id))
  if (!ids.has(q.correctAnswer.optionId)) {
    ctx.addIssue({ code: 'custom', message: `correctAnswer.optionId "${q.correctAnswer.optionId}" not found in options for ${q.id}` })
  }
})

export const quizQuestionSchema = z.discriminatedUnion('type', [
  multipleChoiceQuestionSchema,
  trueFalseQuestionSchema,
  fillInTheBlankQuestionSchema,
  multipleSelectQuestionSchema,
  imageQuizQuestionSchema,
])

export const lessonContentSchema = z.object({
  id: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/),
  contentVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  categoryId: z.string().min(3).max(80),
  unitId: z.string().min(3).max(80),
  title: z.string().min(3).max(120),
  description: z.string().min(5).max(300),
  difficulty: z.enum(['easy', 'medium']),
  estimatedMinutes: z.number().int().min(1).max(30),
  order: z.number().int().min(1).max(100),
  prerequisites: z.array(z.string().min(3)),
  xpReward: z.number().int().min(5).max(100),
  questions: z.array(quizQuestionSchema).min(10).max(20),
})

export const unitDefinitionSchema = z.object({
  id: z.string().min(3).max(80).regex(/^[a-z0-9-]+$/),
  categoryId: z.string().min(3).max(80),
  title: z.string().min(3).max(120),
  description: z.string().min(5).max(300),
  order: z.number().int().min(1).max(20),
})

export const categoryDefinitionSchema = z.object({
  id: z.string().min(3).max(80).regex(/^[a-z0-9-]+$/),
  title: z.string().min(3).max(100),
  description: z.string().min(5).max(300),
  publicMeta: z.string().min(2).max(80),
  order: z.number().int().min(1).max(20),
})

export const badgeDefinitionSchema = z.object({
  id: z.string().min(3).max(100),
  name: z.string().min(3).max(100),
  description: z.string().min(5).max(300),
  icon: z.string().min(2).max(60),
  ruleType: z.enum(['first_lesson', 'mastered_lesson', 'category_complete', 'lessons_count']),
  targetValue: z.union([z.string(), z.number()]),
})
