import { getCookie } from 'h3'
import { authService } from '../../services/auth.service'
import { assertSameOrigin } from '../../utils/csrf'
import { clearSessionCookie, SESSION_COOKIE_NAME } from '../../utils/session'

export default defineEventHandler(async (event) => {
  assertSameOrigin(event)
  const rawToken = getCookie(event, SESSION_COOKIE_NAME)
  await authService.logoutSession(rawToken)
  clearSessionCookie(event)

  return { ok: true }
})
