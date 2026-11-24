import { describe, expect, it } from 'vitest'
import {
  createPkceChallenge,
  hashSessionToken,
  signPayload,
  verifySignedPayload,
} from '../../server/utils/auth-crypto'
import {
  onboardingInputSchema,
  profilePatchInputSchema,
  toLearnerProfileDto,
} from '../../server/services/auth.service'

describe('auth-crypto', () => {
  it('hashes session tokens deterministically with pepper', () => {
    const hashA = hashSessionToken('raw-token-123', 'pepper-secret-value-12345')
    const hashB = hashSessionToken('raw-token-123', 'pepper-secret-value-12345')
    const hashC = hashSessionToken('raw-token-123', 'different-pepper-12345')

    expect(hashA).toHaveLength(64)
    expect(hashA).toBe(hashB)
    expect(hashA).not.toBe(hashC)
  })

  it('signs and verifies payloads and rejects tampered payloads', () => {
    const secret = 'test-hmac-secret-123456'
    const signed = signPayload('payload-abc', secret)

    expect(verifySignedPayload(signed, secret)).toBe('payload-abc')
    expect(verifySignedPayload(`${signed}x`, secret)).toBeNull()
    expect(verifySignedPayload('tampered.signature', secret)).toBeNull()
  })

  it('creates valid base64url PKCE challenge', () => {
    const challenge = createPkceChallenge('verifier-sample')
    expect(challenge.length).toBeGreaterThan(20)
    expect(challenge).not.toContain('+')
    expect(challenge).not.toContain('/')
    expect(challenge).not.toContain('=')
  })
})

describe('auth.service schemas and DTO', () => {
  it('validates onboarding input and requires guardianConsent=true', () => {
    const valid = onboardingInputSchema.safeParse({
      displayName: 'Rafi',
      avatarKey: 'R2',
      guardianConsent: true,
    })
    expect(valid.success).toBe(true)

    const missingConsent = onboardingInputSchema.safeParse({
      displayName: 'Rafi',
      avatarKey: 'R2',
      guardianConsent: false,
    })
    expect(missingConsent.success).toBe(false)

    const invalidAvatar = profilePatchInputSchema.safeParse({
      displayName: 'Rafi',
      avatarKey: 'ADMIN_AVATAR',
    })
    expect(invalidAvatar.success).toBe(false)
  })

  it('sanitizes learner DTO without exposing googleSub', () => {
    const dto = toLearnerProfileDto({
      id: 'user-1',
      googleSub: 'google-sub-secret-999',
      displayName: 'Rafi',
      avatarKey: 'R1',
      onboardingCompleted: true,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    expect(dto).toEqual({
      id: 'user-1',
      displayName: 'Rafi',
      avatarKey: 'R1',
      onboardingCompleted: true,
      status: 'active',
    })
    expect('googleSub' in dto).toBe(false)
  })
})
