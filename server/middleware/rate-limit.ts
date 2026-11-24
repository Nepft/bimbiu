import { createError, getRequestIP, setResponseHeader } from 'h3'
import { checkRateLimit } from '../utils/rate-limit'

export default defineEventHandler((event) => {
  const path = event.path || ''
  if (!path.startsWith('/api/')) return

  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'

  let group = 'api'
  let limit = 120
  const windowMs = 60_000

  if (path.startsWith('/api/auth/')) {
    group = 'auth'
    limit = 30
  } else if (path.startsWith('/api/profile')) {
    group = 'profile'
    limit = 20
  } else if (path.startsWith('/api/quiz/')) {
    group = 'quiz'
    limit = 90
  }

  const result = checkRateLimit(`${group}:${ip}`, limit, windowMs)
  setResponseHeader(event, 'X-RateLimit-Remaining', String(result.remaining))

  if (!result.allowed) {
    setResponseHeader(event, 'Retry-After', result.retryAfterSeconds)
    throw createError({
      statusCode: 429,
      statusMessage: 'Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi.',
    })
  }
})
