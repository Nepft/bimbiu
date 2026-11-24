import { createError, readBody } from 'h3'
import { ZodError } from 'zod'
import { authService } from '../../services/auth.service'
import { assertSameOrigin } from '../../utils/csrf'
import { requireOnboardedLearner } from '../../utils/session'

export default defineEventHandler(async (event) => {
  assertSameOrigin(event)
  const learner = await requireOnboardedLearner(event)
  const body = await readBody(event)

  try {
    const updated = await authService.updateProfile(learner.id, body)
    return { user: updated }
  } catch (error) {
    if (error instanceof ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: error.issues[0]?.message ?? 'Data profil tidak valid.',
      })
    }
    throw error
  }
})
