import { createError, readBody } from 'h3'
import { z } from 'zod'
import { authService, verifyAppAuthCode } from '../../services/auth.service'
import { setSessionCookie } from '../../utils/session'

const appExchangeSchema = z.object({
  code: z.string().min(10),
})

export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event)
  const parsed = appExchangeSchema.safeParse(rawBody)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Kode login tidak valid.' })
  }

  const userId = verifyAppAuthCode(parsed.data.code)
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Kode login sudah kedaluwarsa atau tidak valid.' })
  }

  const session = await authService.createSessionForUserId(userId)
  setSessionCookie(event, session.rawToken, session.expiresAt)

  return {
    ok: true,
    redirectTo: session.user.onboardingCompleted ? '/app' : '/auth/onboarding',
  }
})
