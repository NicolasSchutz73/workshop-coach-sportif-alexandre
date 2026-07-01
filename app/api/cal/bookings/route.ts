import { z } from 'zod'
import { createCalBooking, getCalSlots, isCalConflict } from '@/lib/cal'
import { hasOversizedBody, isRateLimited, rateLimitResponse } from '@/lib/request-security'

const TIME_ZONE = 'Europe/Paris'
const e164Phone = /^\+[1-9]\d{7,14}$/

const bookingSchema = z
  .object({
    start: z.string().datetime({ offset: true }),
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().regex(e164Phone).optional(),
    message: z.string().trim().max(3000).optional(),
    bookingVerification: z.string().max(0),
    formStartedAt: z.number().int().positive(),
  })
  .strict()

function dateInParis(start: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(start))
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value

  return `${part('year')}-${part('month')}-${part('day')}`
}

async function slotIsStillAvailable(start: string) {
  const date = dateInParis(start)
  const slotsByDate = await getCalSlots(date, date)
  const expectedTime = new Date(start).getTime()

  return Object.values(slotsByDate)
    .flat()
    .some((slot) => new Date(slot.start).getTime() === expectedTime)
}

export async function POST(request: Request) {
  if (hasOversizedBody(request)) {
    return Response.json({ error: 'La requête est trop volumineuse.' }, { status: 413 })
  }
  if (isRateLimited(request, 'cal-booking', 5, 10 * 60_000)) {
    return rateLimitResponse()
  }

  const body = await request.json().catch(() => null)
  const parsed = bookingSchema.safeParse(body)

  if (!parsed.success || Date.now() - parsed.data.formStartedAt < 1_500) {
    return Response.json(
      { error: 'Les informations de réservation sont invalides.' },
      { status: 400 },
    )
  }

  try {
    if (!(await slotIsStillAvailable(parsed.data.start))) {
      return Response.json(
        { error: 'Ce créneau vient d’être pris, veuillez en choisir un autre.' },
        { status: 409 },
      )
    }

    const booking = {
      start: parsed.data.start,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      message: parsed.data.message,
    }
    await createCalBooking(booking)
    return Response.json({ success: true }, { status: 201 })
  } catch (error) {
    if (isCalConflict(error)) {
      return Response.json(
        { error: 'Ce créneau vient d’être pris, veuillez en choisir un autre.' },
        { status: 409 },
      )
    }

    console.error('Unable to create Cal booking', error)
    return Response.json(
      { error: 'La réservation est temporairement indisponible.' },
      { status: 502 },
    )
  }
}
