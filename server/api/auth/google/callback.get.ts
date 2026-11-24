import { getCookie, getQuery, sendRedirect } from 'h3'
import {
  authService,
  exchangeGoogleCodeForIdentity,
  verifyOAuthStateCookieValue,
} from '../../../services/auth.service'
import {
  clearOAuthStateCookie,
  OAUTH_STATE_COOKIE_NAME,
  setSessionCookie,
} from '../../../utils/session'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const oauthError = typeof query.error === 'string' ? query.error : undefined
  const code = typeof query.code === 'string' ? query.code : undefined
  const state = typeof query.state === 'string' ? query.state : undefined

  const signedStateCookie = getCookie(event, OAUTH_STATE_COOKIE_NAME)
  clearOAuthStateCookie(event)

  if (oauthError) {
    const errorCode = oauthError === 'access_denied' ? 'cancelled' : 'failed'
    return sendRedirect(event, `/auth/login?error=${errorCode}`, 302)
  }

  const verifiedState = verifyOAuthStateCookieValue(signedStateCookie, state)
  if (!verifiedState || !code) {
    return sendRedirect(event, '/auth/login?error=failed', 302)
  }

  try {
    const identity = await exchangeGoogleCodeForIdentity(code, verifiedState.codeVerifier)
    const session = await authService.loginWithGoogleIdentity(
      identity.googleSub,
      identity.givenName,
    )

    setSessionCookie(event, session.rawToken, session.expiresAt)

    const destination = session.user.onboardingCompleted ? '/app' : '/auth/onboarding'
    return sendRedirect(event, destination, 302)
  } catch (error) {
    console.error('[auth/google/callback] OAuth callback failed:', error)
    return sendRedirect(event, '/auth/login?error=failed', 302)
  }
})
