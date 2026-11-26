import { getCookie, getQuery, sendRedirect } from 'h3'
import {
  authService,
  createAppAuthCode,
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

  const verifiedState = verifyOAuthStateCookieValue(signedStateCookie, state)
  const isNativeApp = verifiedState?.platform === 'app'

  if (oauthError) {
    const errorCode = oauthError === 'access_denied' ? 'cancelled' : 'failed'
    const errorUrl = isNativeApp
      ? `bimbiu://auth-callback?error=${errorCode}`
      : `/auth/login?error=${errorCode}`
    return sendRedirect(event, errorUrl, 302)
  }

  if (!verifiedState || !code) {
    return sendRedirect(event, '/auth/login?error=failed', 302)
  }

  try {
    const identity = await exchangeGoogleCodeForIdentity(code, verifiedState.codeVerifier)

    if (isNativeApp) {
      const user = await authService.findOrCreateGoogleUser(
        identity.googleSub,
        identity.givenName,
      )
      const appCode = createAppAuthCode(user.id)
      return sendRedirect(event, `bimbiu://auth-callback?code=${encodeURIComponent(appCode)}`, 302)
    }

    const session = await authService.loginWithGoogleIdentity(
      identity.googleSub,
      identity.givenName,
    )

    setSessionCookie(event, session.rawToken, session.expiresAt)

    const destination = session.user.onboardingCompleted ? '/app' : '/auth/onboarding'
    return sendRedirect(event, destination, 302)
  } catch (error) {
    console.error('[auth/google/callback] OAuth callback failed:', error)
    const errorUrl = isNativeApp
      ? 'bimbiu://auth-callback?error=failed'
      : '/auth/login?error=failed'
    return sendRedirect(event, errorUrl, 302)
  }
})
