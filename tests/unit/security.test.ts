import { beforeEach, describe, expect, it } from 'vitest'
import { checkRateLimit, resetRateLimitBuckets } from '../../server/utils/rate-limit'

describe('checkRateLimit', () => {
  beforeEach(() => {
    resetRateLimitBuckets()
  })

  it('allows requests within limit and blocks once exceeded', () => {
    const start = 1_000_000
    expect(checkRateLimit('auth:127.0.0.1', 2, 60_000, start).allowed).toBe(true)
    expect(checkRateLimit('auth:127.0.0.1', 2, 60_000, start + 100).allowed).toBe(true)

    const blocked = checkRateLimit('auth:127.0.0.1', 2, 60_000, start + 200)
    expect(blocked.allowed).toBe(false)
    expect(blocked.remaining).toBe(0)
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0)
  })

  it('resets the bucket after the window expires', () => {
    const start = 2_000_000
    checkRateLimit('quiz:127.0.0.1', 1, 10_000, start)
    expect(checkRateLimit('quiz:127.0.0.1', 1, 10_000, start + 500).allowed).toBe(false)

    const afterWindow = checkRateLimit('quiz:127.0.0.1', 1, 10_000, start + 10_001)
    expect(afterWindow.allowed).toBe(true)
  })
})
