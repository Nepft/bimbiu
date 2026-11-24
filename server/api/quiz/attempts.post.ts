import { createError, readBody } from 'h3'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { quizService } from '../../services/quiz.service'
import { assertSameOrigin } from '../../utils/csrf'
import { requireOnboardedLearner } from '../../utils/session'

const startAttemptSchema = z.object({
  lessonId: z.string().min(1),
  idempotencyKey: z.string().uuid().optional(),
})

export default defineEventHandler(async (event) => {
  assertSameOrigin(event)
  const learner = await requireOnboardedLearner(event)
  const body = await readBody(event)

  const parsed = startAttemptSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Permintaan mulai kuis tidak valid.' })
  }

  return quizService.startAttempt(
    learner.id,
    parsed.data.lessonId,
    parsed.data.idempotencyKey ?? randomUUID(),
  )
})
