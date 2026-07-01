type RateLimitEntry = { count: number; resetAt: number }

const rateLimits = new Map<string, RateLimitEntry>()
const MAX_TRACKED_CLIENTS = 2_000

export function getClientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
}

export function isRateLimited(
  request: Request,
  namespace: string,
  limit: number,
  windowMs: number,
) {
  const now = Date.now()
  const key = `${namespace}:${getClientIp(request)}`
  const current = rateLimits.get(key)

  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }

  current.count += 1
  if (rateLimits.size > MAX_TRACKED_CLIENTS) {
    for (const [entryKey, entry] of rateLimits) {
      if (entry.resetAt <= now) rateLimits.delete(entryKey)
    }
  }

  return current.count > limit
}

export function hasOversizedBody(request: Request, maxBytes = 16_384) {
  const contentLength = Number(request.headers.get('content-length'))
  return Number.isFinite(contentLength) && contentLength > maxBytes
}

export function rateLimitResponse() {
  return Response.json(
    { error: 'Trop de requêtes. Veuillez réessayer dans quelques minutes.' },
    { status: 429, headers: { 'Retry-After': '600' } },
  )
}
