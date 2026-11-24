import { createError, deleteCookie, getCookie, setCookie, type H3Event } from 'h3'
import { authService, SESSION_TTL_MS, type LearnerProfileDto } from '../services/auth.service'

export const SESSION_COOKIE_NAME = 'bimbiu_session'
export const OAUTH_STATE_COOKIE_NAME = 'bimbiu_oauth_state'

function isSecureCookieContext(): boolean {
  return process.env.NODE_ENV === 'production'
}

export function setSessionCookie(event: H3Event, rawToken: string, expiresAt: Date): void {
  setCookie(event, SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: isSecureCookieContext(),
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
    expires: expiresAt,
  })
}

export function clearSessionCookie(event: H3Event): void {
  deleteCookie(event, SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: isSecureCookieContext(),
    sameSite: 'lax',
    path: '/',
  })
}

export function setOAuthStateCookie(event: H3Event, signedValue: string): void {
  setCookie(event, OAUTH_STATE_COOKIE_NAME, signedValue, {
    httpOnly: true,
    secure: isSecureCookieContext(),
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  })
}

export function clearOAuthStateCookie(event: H3Event): void {
  deleteCookie(event, OAUTH_STATE_COOKIE_NAME, {
    httpOnly: true,
    secure: isSecureCookieContext(),
    sameSite: 'lax',
    path: '/',
  })
}

export async function getAuthenticatedLearner(event: H3Event): Promise<LearnerProfileDto | null> {
  const rawToken = getCookie(event, SESSION_COOKIE_NAME)
  const resolved = await authService.resolveSession(rawToken)
  return resolved?.user ?? null
}

export async function requireAuthenticatedLearner(event: H3Event): Promise<LearnerProfileDto> {
  const learner = await getAuthenticatedLearner(event)
  if (!learner) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Sesi tidak ditemukan atau sudah berakhir.',
    })
  }
  return learner
}

export async function requireOnboardedLearner(event: H3Event): Promise<LearnerProfileDto> {
  const learner = await requireAuthenticatedLearner(event)
  if (!learner.onboardingCompleted) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Lengkapi profil belajarmu terlebih dahulu.',
    })
  }
  return learner
}
