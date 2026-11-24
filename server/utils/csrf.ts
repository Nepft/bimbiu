import { createError, getRequestHeader, type H3Event } from 'h3'

export function assertSameOrigin(event: H3Event): void {
  const origin = getRequestHeader(event, 'origin')
  if (!origin) return

  const host = getRequestHeader(event, 'host')
  const appBaseUrl = process.env.APP_BASE_URL

  try {
    const originHost = new URL(origin).host
    if (host && originHost === host) return
    if (appBaseUrl && new URL(appBaseUrl).host === originHost) return
  } catch {
    // Fall through to 403 error below
  }

  throw createError({
    statusCode: 403,
    statusMessage: 'Permintaan lintas origin tidak diizinkan.',
  })
}
