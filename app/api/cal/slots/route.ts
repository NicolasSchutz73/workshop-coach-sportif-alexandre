import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { getCalSlots } from '@/lib/cal'

const datePattern = /^\d{4}-\d{2}-\d{2}$/

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

export async function GET(request: NextRequest) {
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
    const slotsByDate = await getCalSlots(parsed.data.start, parsed.data.end)
    return Response.json(
      { slotsByDate },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    console.error('Unable to load Cal slots', error)
    return Response.json(
      { error: 'Impossible de charger les créneaux disponibles.' },
      { status: 502 },
    )
  }
}
