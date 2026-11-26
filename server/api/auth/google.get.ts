import { getQuery, sendRedirect } from 'h3'
import { buildGoogleAuthorizeUrl, createOAuthStateCookieValue } from '../../services/auth.service'
import { setOAuthStateCookie } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const platform = query.platform === 'app' ? 'app' : 'web'

  try {
    const { signedCookie, state, codeChallenge } = createOAuthStateCookieValue(platform)
    setOAuthStateCookie(event, signedCookie)
    const authorizeUrl = buildGoogleAuthorizeUrl(state, codeChallenge)
    return sendRedirect(event, authorizeUrl, 302)
  } catch (error) {
    console.error('[auth/google] failed to start Google OAuth:', error)
    const fallbackUrl = platform === 'app'
      ? 'bimbiu://auth-callback?error=failed'
      : '/auth/login?error=failed'
    return sendRedirect(event, fallbackUrl, 302)
  }
})
