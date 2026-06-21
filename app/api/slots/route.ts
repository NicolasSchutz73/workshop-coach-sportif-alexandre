import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { getStrapiUrl } from '@/lib/strapi'

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  sessionTypeSlug: z.string().trim().min(1).max(120),
})

type StrapiTimeSlot = {
  documentId: string
  date: string
  startTime: string
  isAvailable: boolean
  sessionType?: {
    documentId: string
    name: string
    duration: number
    mode: 'visio' | 'présentiel'
    slug: string
  } | null
}

type StrapiTimeSlotsResponse = {
  data?: StrapiTimeSlot[]
}

function strapiHeaders() {
  const headers = new Headers({
    Accept: 'application/json',
  })

  if (process.env.STRAPI_API_TOKEN) {
    headers.set('Authorization', `Bearer ${process.env.STRAPI_API_TOKEN}`)
  }

  return headers
}

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse({
    date: request.nextUrl.searchParams.get('date'),
    sessionTypeSlug: request.nextUrl.searchParams.get('sessionTypeSlug'),
  })

  if (!parsed.success) {
    return Response.json(
      { error: 'Les paramètres date et sessionTypeSlug sont requis.' },
      { status: 400 },
    )
  }

  const params = new URLSearchParams({
    'filters[date][$eq]': parsed.data.date,
    'filters[isAvailable][$eq]': 'true',
    'filters[sessionType][slug][$eq]': parsed.data.sessionTypeSlug,
    'sort[0]': 'startTime:asc',
    'populate[sessionType][fields][0]': 'name',
    'populate[sessionType][fields][1]': 'duration',
    'populate[sessionType][fields][2]': 'mode',
    'populate[sessionType][fields][3]': 'slug',
    'pagination[pageSize]': '100',
  })

  try {
    const response = await fetch(
      getStrapiUrl(`/api/time-slots?${params.toString()}`),
      {
        headers: strapiHeaders(),
        cache: 'no-store',
      },
    )

    if (!response.ok) {
      throw new Error(`Strapi slots request failed: ${response.status}`)
    }

    const payload = (await response.json()) as StrapiTimeSlotsResponse
    const slots = (payload.data ?? [])
      .filter((slot) => slot.isAvailable && slot.sessionType)
      .map((slot) => ({
        id: slot.documentId,
        date: slot.date,
        startTime: slot.startTime.slice(0, 5),
        sessionTypeId: slot.sessionType!.documentId,
        sessionTypeSlug: slot.sessionType!.slug,
      }))

    return Response.json({ slots })
  } catch (error) {
    console.error('Unable to load booking slots', error)
    return Response.json(
      { error: 'Impossible de charger les créneaux disponibles.' },
      { status: 502 },
    )
  }
}
