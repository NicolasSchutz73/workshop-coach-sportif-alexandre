import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { getCalSlots } from '@/lib/cal'
import { isRateLimited, rateLimitResponse } from '@/lib/request-security'

const datePattern = /^\d{4}-\d{2}-\d{2}$/
const SLOTS_CACHE_TTL = 30_000
const SLOTS_CACHE_LIMIT = 12

type SlotsByDate = Awaited<ReturnType<typeof getCalSlots>>

type CachedSlots = {
  expiresAt: number
  slotsByDate?: SlotsByDate
  request?: Promise<SlotsByDate>
}

const slotsCache = new Map<string, CachedSlots>()

const querySchema = z.object({
  start: z.string().regex(datePattern),
  end: z.string().regex(datePattern),
})

function parseDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null
  }

  return { year, month, day }
}

function isSingleCalendarMonth(start: string, end: string) {
  const parsedStart = parseDate(start)
  const parsedEnd = parseDate(end)
  if (!parsedStart || !parsedEnd || parsedStart.day !== 1) return false
  if (
    parsedStart.year !== parsedEnd.year ||
    parsedStart.month !== parsedEnd.month
  ) {
    return false
  }

  const lastDay = new Date(
    Date.UTC(parsedStart.year, parsedStart.month, 0),
  ).getUTCDate()
  return parsedEnd.day === lastDay
}

function cacheKey(start: string, end: string) {
  return `${start}:${end}`
}

function pruneSlotsCache() {
  if (slotsCache.size <= SLOTS_CACHE_LIMIT) return

  const now = Date.now()
  for (const [key, value] of slotsCache) {
    if (value.expiresAt <= now && !value.request) slotsCache.delete(key)
  }

  while (slotsCache.size > SLOTS_CACHE_LIMIT) {
    const oldestKey = slotsCache.keys().next().value
    if (oldestKey === undefined) return
    slotsCache.delete(oldestKey)
  }
}

async function getCachedCalSlots(start: string, end: string) {
  const key = cacheKey(start, end)
  const cached = slotsCache.get(key)

  if (cached?.slotsByDate && cached.expiresAt > Date.now()) {
    return cached.slotsByDate
  }
  if (cached?.request) return cached.request

  const request = getCalSlots(start, end)
  slotsCache.set(key, { expiresAt: Date.now() + SLOTS_CACHE_TTL, request })

  try {
    const slotsByDate = await request
    slotsCache.set(key, {
      expiresAt: Date.now() + SLOTS_CACHE_TTL,
      slotsByDate,
    })
    pruneSlotsCache()
    return slotsByDate
  } catch (error) {
    slotsCache.delete(key)
    throw error
  }
}

export async function GET(request: NextRequest) {
  if (isRateLimited(request, 'cal-slots', 120, 60_000)) {
    return rateLimitResponse()
  }
  const parsed = querySchema.safeParse({
    start: request.nextUrl.searchParams.get('start'),
    end: request.nextUrl.searchParams.get('end'),
  })

  if (!parsed.success || !isSingleCalendarMonth(parsed.data.start, parsed.data.end)) {
    return Response.json(
      { error: 'L’intervalle doit correspondre à un mois civil complet.' },
      { status: 400 },
    )
  }

  try {
    const forceRefresh = request.nextUrl.searchParams.get('refresh') === '1'
    const slotsByDate = forceRefresh
      ? await getCalSlots(parsed.data.start, parsed.data.end)
      : await getCachedCalSlots(parsed.data.start, parsed.data.end)
    return Response.json(
      { slotsByDate },
      {
        headers: {
          'Cache-Control': forceRefresh
            ? 'no-store'
            : 'public, max-age=30, s-maxage=30, stale-while-revalidate=30',
        },
      },
    )
  } catch (error) {
    console.error('Unable to load Cal slots', error)
    return Response.json(
      { error: 'Impossible de charger les créneaux disponibles.' },
      { status: 502 },
    )
  }
}
