import { sendRedirect } from 'h3'
import { buildGoogleAuthorizeUrl, createOAuthStateCookieValue } from '../../services/auth.service'
import { setOAuthStateCookie } from '../../utils/session'

export default defineEventHandler(async (event) => {
  try {
    const { signedCookie, state, codeChallenge } = createOAuthStateCookieValue()
    setOAuthStateCookie(event, signedCookie)
    const authorizeUrl = buildGoogleAuthorizeUrl(state, codeChallenge)
    return sendRedirect(event, authorizeUrl, 302)
  } catch (error) {
    console.error('[auth/google] failed to start Google OAuth:', error)
    return sendRedirect(event, '/auth/login?error=failed', 302)
  }
})
