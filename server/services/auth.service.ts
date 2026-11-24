import { z } from 'zod'
import type { UserRecord } from '../database/schema'
import { sessionRepository, userRepository } from '../repositories/auth.repository'
import {
  createPkceChallenge,
  generateRandomToken,
  hashSessionToken,
  signPayload,
  verifySignedPayload,
} from '../utils/auth-crypto'

export const ALLOWED_AVATAR_KEYS = ['R1', 'R2', 'R3', 'R4', 'custom'] as const
export type AvatarKey = (typeof ALLOWED_AVATAR_KEYS)[number]

export interface LearnerProfileDto {
  id: string
  displayName: string
  avatarKey: string
  customAvatarData: string | null
  onboardingCompleted: boolean
  status: string
}

const customAvatarSchema = z
  .string()
  .max(350_000, 'Ukuran gambar avatar terlalu besar.')
  .regex(
    /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/,
    'Format gambar harus JPG, PNG, atau WebP.',
  )
  .nullable()
  .optional()

export const onboardingInputSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, 'Nama tampilan minimal 2 huruf.')
    .max(30, 'Nama tampilan maksimal 30 karakter.'),
  avatarKey: z.enum(ALLOWED_AVATAR_KEYS, {
    message: 'Pilih salah satu avatar bawaan atau unggah gambar sendiri.',
  }),
  customAvatarData: customAvatarSchema,
  guardianConsent: z.literal(true, {
    message: 'Centang konfirmasi pendampingan orang tua/wali terlebih dahulu.',
  }),
})

export const profilePatchInputSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, 'Nama tampilan minimal 2 huruf.')
    .max(30, 'Nama tampilan maksimal 30 karakter.'),
  avatarKey: z.enum(ALLOWED_AVATAR_KEYS, {
    message: 'Pilih salah satu avatar bawaan atau unggah gambar sendiri.',
  }),
  customAvatarData: customAvatarSchema,
})

export const SESSION_TTL_MS = 14 * 24 * 60 * 60 * 1000 // 14 days

function getSessionPepper(): string {
  const pepper = process.env.SESSION_TOKEN_PEPPER
  if (!pepper || pepper.length < 16) {
    throw new Error('SESSION_TOKEN_PEPPER is not configured')
  }
  return pepper
}

function getGoogleOAuthConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Google OAuth environment variables are not configured')
  }

  return { clientId, clientSecret, redirectUri }
}

export function toLearnerProfileDto(user: UserRecord): LearnerProfileDto {
  return {
    id: user.id,
    displayName: user.displayName,
    avatarKey: user.avatarKey,
    customAvatarData: user.customAvatarData ?? null,
    onboardingCompleted: Boolean(user.onboardingCompleted),
    status: user.status,
  }
}

export function createOAuthStateCookieValue(): {
  signedCookie: string
  state: string
  codeChallenge: string
} {
  const pepper = getSessionPepper()
  const state = generateRandomToken(24)
  const codeVerifier = generateRandomToken(32)
  const codeChallenge = createPkceChallenge(codeVerifier)

  const payload = Buffer.from(
    JSON.stringify({
      state,
      codeVerifier,
      exp: Date.now() + 10 * 60 * 1000,
    }),
    'utf8',
  ).toString('base64url')

  return {
    signedCookie: signPayload(payload, pepper),
    state,
    codeChallenge,
  }
}

export function verifyOAuthStateCookieValue(
  signedCookie: string | undefined,
  returnedState: string | undefined,
): { codeVerifier: string } | null {
  if (!signedCookie || !returnedState) return null
  const pepper = getSessionPepper()
  const payloadB64 = verifySignedPayload(signedCookie, pepper)
  if (!payloadB64) return null

  try {
    const parsed = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8')) as {
      state?: string
      codeVerifier?: string
      exp?: number
    }
    if (
      !parsed.state ||
      !parsed.codeVerifier ||
      typeof parsed.exp !== 'number' ||
      parsed.exp < Date.now() ||
      parsed.state !== returnedState
    ) {
      return null
    }
    return { codeVerifier: parsed.codeVerifier }
  } catch {
    return null
  }
}

export function buildGoogleAuthorizeUrl(state: string, codeChallenge: string): string {
  const { clientId, redirectUri } = getGoogleOAuthConfig()
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', 'openid profile')
  url.searchParams.set('state', state)
  url.searchParams.set('code_challenge', codeChallenge)
  url.searchParams.set('code_challenge_method', 'S256')
  url.searchParams.set('prompt', 'select_account')
  return url.toString()
}

export async function exchangeGoogleCodeForIdentity(
  code: string,
  codeVerifier: string,
): Promise<{ googleSub: string; givenName: string }> {
  const { clientId, clientSecret, redirectUri } = getGoogleOAuthConfig()

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
      code_verifier: codeVerifier,
    }),
  })

  if (!tokenResponse.ok) {
    throw new Error(`Google token exchange failed (${tokenResponse.status})`)
  }

  const tokenJson = (await tokenResponse.json()) as {
    access_token?: string
    id_token?: string
  }

  if (!tokenJson.access_token) {
    throw new Error('Missing access_token in Google OAuth response')
  }

  const userInfoResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: {
      Authorization: `Bearer ${tokenJson.access_token}`,
    },
  })

  if (!userInfoResponse.ok) {
    throw new Error(`Google userinfo request failed (${userInfoResponse.status})`)
  }

  const userInfo = (await userInfoResponse.json()) as {
    sub?: string
    given_name?: string
    name?: string
  }

  if (!userInfo.sub) {
    throw new Error('Google userinfo missing sub identifier')
  }

  const fallbackName = userInfo.given_name || userInfo.name?.split(' ')[0] || 'Petualang'
  return {
    googleSub: userInfo.sub,
    givenName: fallbackName,
  }
}

export const authService = {
  async loginWithGoogleIdentity(googleSub: string, defaultDisplayName: string) {
    let user = await userRepository.findByGoogleSub(googleSub)
    if (!user) {
      user = await userRepository.createFromGoogle(googleSub, defaultDisplayName)
    }

    if (user.status !== 'active') {
      throw new Error('Account is not active')
    }

    const rawToken = generateRandomToken(32)
    const tokenHash = hashSessionToken(rawToken, getSessionPepper())
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS)

    await sessionRepository.createSession({
      userId: user.id,
      tokenHash,
      expiresAt,
    })

    return {
      rawToken,
      expiresAt,
      user: toLearnerProfileDto(user),
    }
  },

  async resolveSession(rawToken: string | undefined): Promise<{
    sessionId: string
    user: LearnerProfileDto
  } | null> {
    if (!rawToken) return null
    const tokenHash = hashSessionToken(rawToken, getSessionPepper())
    const found = await sessionRepository.findValidSessionWithUser(tokenHash)
    if (!found || found.user.status !== 'active') return null

    const lastSeenMs = found.session.lastSeenAt?.getTime() ?? 0
    if (Date.now() - lastSeenMs > 5 * 60 * 1000) {
      await sessionRepository.touchSession(found.session.id)
    }

    return {
      sessionId: found.session.id,
      user: toLearnerProfileDto(found.user),
    }
  },

  async logoutSession(rawToken: string | undefined): Promise<void> {
    if (!rawToken) return
    const tokenHash = hashSessionToken(rawToken, getSessionPepper())
    await sessionRepository.revokeByTokenHash(tokenHash)
  },

  async completeOnboarding(userId: string, rawInput: unknown): Promise<LearnerProfileDto> {
    const parsed = onboardingInputSchema.parse(rawInput)
    if (parsed.avatarKey === 'custom' && !parsed.customAvatarData) {
      throw new Error('Unggah gambar terlebih dahulu untuk menggunakan avatar kustom.')
    }
    const updated = await userRepository.completeOnboarding(userId, {
      displayName: parsed.displayName,
      avatarKey: parsed.avatarKey,
      customAvatarData: parsed.customAvatarData,
    })
    return toLearnerProfileDto(updated)
  },

  async updateProfile(userId: string, rawInput: unknown): Promise<LearnerProfileDto> {
    const parsed = profilePatchInputSchema.parse(rawInput)
    if (parsed.avatarKey === 'custom' && parsed.customAvatarData === null) {
      throw new Error('Unggah gambar terlebih dahulu untuk menggunakan avatar kustom.')
    }
    const updated = await userRepository.updateProfile(userId, {
      displayName: parsed.displayName,
      avatarKey: parsed.avatarKey,
      customAvatarData: parsed.customAvatarData,
    })
    return toLearnerProfileDto(updated)
  },
}
