import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

export function generateRandomToken(byteLength = 32): string {
  return randomBytes(byteLength).toString('base64url')
}

export function hashSessionToken(rawToken: string, pepper: string): string {
  return createHash('sha256').update(`${pepper}:${rawToken}`).digest('hex')
}

export function createPkceChallenge(codeVerifier: string): string {
  return createHash('sha256').update(codeVerifier).digest('base64url')
}

export function signPayload(payload: string, secret: string): string {
  const sig = createHmac('sha256', secret).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

export function verifySignedPayload(signedValue: string, secret: string): string | null {
  const lastDot = signedValue.lastIndexOf('.')
  if (lastDot <= 0) return null

  const payload = signedValue.slice(0, lastDot)
  const providedSig = signedValue.slice(lastDot + 1)
  const expectedSig = createHmac('sha256', secret).update(payload).digest('base64url')

  const providedBuf = Buffer.from(providedSig)
  const expectedBuf = Buffer.from(expectedSig)
  if (providedBuf.length !== expectedBuf.length) return null
  if (!timingSafeEqual(providedBuf, expectedBuf)) return null

  return payload
}
