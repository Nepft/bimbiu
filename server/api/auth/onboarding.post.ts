import { createError, readBody } from 'h3'
import { ZodError } from 'zod'
import { authService } from '../../services/auth.service'
import { assertSameOrigin } from '../../utils/csrf'
import { requireAuthenticatedLearner } from '../../utils/session'

export default defineEventHandler(async (event) => {
  assertSameOrigin(event)
  const learner = await requireAuthenticatedLearner(event)
  const body = await readBody(event)

  try {
    const updated = await authService.completeOnboarding(learner.id, body)
    return { user: updated }
  } catch (error) {
    if (error instanceof ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: error.issues[0]?.message ?? 'Data onboarding tidak valid.',
      })
    }
    throw error
  }
})
