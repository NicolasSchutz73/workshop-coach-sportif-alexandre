import { z } from 'zod'
import { getStrapiUrl } from '@/lib/strapi'

const bookingSchema = z.object({
  clientName: z.string().trim().min(2).max(120),
  clientEmail: z.string().trim().email().max(254),
  clientPhone: z.string().trim().min(6).max(40),
  message: z.string().trim().max(3000).optional(),
  timeSlotId: z.string().min(1),
  sessionTypeId: z.string().min(1),
})

type StrapiBookingResponse = {
  data: {
    documentId: string
    clientName: string
    clientEmail: string
    clientPhone: string
    message?: string | null
    status: 'pending' | 'confirmed' | 'cancelled'
  }
  meta: {
    timeSlot: {
      documentId: string
      date: string
      startTime: string
    }
    sessionType: {
      documentId: string
      name: string
      duration: number
      mode: 'visio' | 'présentiel'
      slug: string
    }
    emailsSent?: boolean
  }
}

function getRequiredEnvironment() {
  const values = {
    strapiApiToken: process.env.STRAPI_API_TOKEN,
  }
  const missing = Object.entries(values)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(`Missing booking environment: ${missing.join(', ')}`)
  }

  return values as Record<keyof typeof values, string>
}

export async function POST(request: Request) {
  let environment: ReturnType<typeof getRequiredEnvironment>

  try {
    environment = getRequiredEnvironment()
  } catch (error) {
    console.error(error)
    return Response.json(
      { error: 'La réservation est temporairement indisponible.' },
      { status: 500 },
    )
  }

  const body = await request.json().catch(() => null)
  const parsed = bookingSchema.safeParse(body)

  if (!parsed.success) {
    return Response.json(
      {
        error: 'Les informations de réservation sont invalides.',
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    )
  }

  try {
    const strapiResponse = await fetch(getStrapiUrl('/api/bookings'), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${environment.strapiApiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: parsed.data,
      }),
      cache: 'no-store',
    })
    const payload = (await strapiResponse.json().catch(() => null)) as
      | StrapiBookingResponse
      | { error?: { message?: string } }
      | null

    if (strapiResponse.status === 409) {
      return Response.json(
        {
          error:
            payload && 'error' in payload
              ? payload.error?.message
              : 'Ce créneau vient d’être pris, veuillez en choisir un autre',
        },
        { status: 409 },
      )
    }

    if (!strapiResponse.ok || !payload || !('data' in payload)) {
      throw new Error(`Strapi booking request failed: ${strapiResponse.status}`)
    }

    return Response.json({
      success: true,
      booking: payload.data,
      emailsSent: payload.meta.emailsSent ?? false,
    })
  } catch (error) {
    console.error('Unable to create booking', error)
    return Response.json(
      { error: 'Impossible d’enregistrer la réservation.' },
      { status: 502 },
    )
  }
}
