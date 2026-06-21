import 'server-only'

const CAL_TIME_ZONE = 'Europe/Paris'
const CAL_EVENT_USERNAME = 'nicolas-schutz-zdf9fu'
const CAL_EVENT_TYPE_SLUG = 'appel-decouverte'
const CAL_SLOTS_API_VERSION = '2024-09-04'
const CAL_BOOKINGS_API_VERSION = '2024-08-13'

type CalSlotPayload = string | { start?: unknown }

type CalSlotsResponse = {
  status?: string
  data?: Record<string, CalSlotPayload[]>
}

type CalBookingResponse = {
  status?: string
  data?: { uid?: string }
}

export type CalSlot = {
  start: string
}

export type CreateCalBookingInput = {
  start: string
  name: string
  email: string
  phone?: string
  message?: string
}

class CalApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message)
  }

  get isConflict() {
    return this.status === 409
  }
}

function getCalConfig(apiVersion: string) {
  const values = {
    apiKey: process.env.CAL_API_KEY?.trim(),
    apiBaseUrl: process.env.CAL_API_BASE_URL?.trim(),
    slotsApiVersion: process.env.CAL_API_VERSION?.trim(),
    bookingsApiVersion:
      process.env.CAL_BOOKINGS_API_VERSION?.trim() ??
      CAL_BOOKINGS_API_VERSION,
    eventUsername: process.env.CAL_EVENT_USERNAME?.trim(),
    eventTypeSlug: process.env.CAL_EVENT_TYPE_SLUG?.trim(),
  }

  const requiredValues = {
    apiKey: values.apiKey,
    apiBaseUrl: values.apiBaseUrl,
    eventUsername: values.eventUsername,
    eventTypeSlug: values.eventTypeSlug,
    ...(apiVersion === CAL_SLOTS_API_VERSION
      ? { slotsApiVersion: values.slotsApiVersion }
      : {}),
  }
  const missing = Object.entries(requiredValues)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(`Missing Cal configuration: ${missing.join(', ')}`)
  }

  let apiBaseUrl: URL
  try {
    apiBaseUrl = new URL(values.apiBaseUrl!)
  } catch {
    throw new Error('CAL_API_BASE_URL must be a valid URL')
  }

  if (apiBaseUrl.protocol !== 'https:') {
    throw new Error('CAL_API_BASE_URL must use HTTPS')
  }

  if (
    apiVersion === CAL_SLOTS_API_VERSION &&
    values.slotsApiVersion !== CAL_SLOTS_API_VERSION
  ) {
    throw new Error(`CAL_API_VERSION must be ${CAL_SLOTS_API_VERSION}`)
  }

  if (
    apiVersion === CAL_BOOKINGS_API_VERSION &&
    values.bookingsApiVersion !== CAL_BOOKINGS_API_VERSION
  ) {
    throw new Error(
      `CAL_BOOKINGS_API_VERSION must be ${CAL_BOOKINGS_API_VERSION}`,
    )
  }

  if (
    values.eventUsername !== CAL_EVENT_USERNAME ||
    values.eventTypeSlug !== CAL_EVENT_TYPE_SLUG
  ) {
    throw new Error('The Cal event configuration does not match this booking flow')
  }

  return {
    apiKey: values.apiKey!,
    apiBaseUrl: apiBaseUrl.toString().replace(/\/$/, ''),
  }
}

async function calFetch(
  path: string,
  apiVersion: string,
  init: RequestInit = {},
) {
  const config = getCalConfig(apiVersion)
  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')
  headers.set('Authorization', `Bearer ${config.apiKey}`)
  headers.set('cal-api-version', apiVersion)

  let response: Response
  try {
    response = await fetch(`${config.apiBaseUrl}${path}`, {
      ...init,
      headers,
      cache: 'no-store',
    })
  } catch {
    throw new CalApiError('Cal API request failed')
  }

  if (!response.ok) {
    throw new CalApiError(`Cal API request failed: ${response.status}`, response.status)
  }

  return response
}

function normalizeSlots(data: CalSlotsResponse['data']) {
  const slotsByDate: Record<string, CalSlot[]> = {}

  for (const [date, slots] of Object.entries(data ?? {})) {
    const normalized = slots
      .map((slot) => (typeof slot === 'string' ? slot : slot.start))
      .filter(
        (start): start is string =>
          typeof start === 'string' && !Number.isNaN(Date.parse(start)),
      )
      .map((start) => ({ start }))

    if (normalized.length > 0) {
      slotsByDate[date] = normalized
    }
  }

  return slotsByDate
}

export async function getCalSlots(start: string, end: string) {
  const params = new URLSearchParams({
    start,
    end,
    username: CAL_EVENT_USERNAME,
    eventTypeSlug: CAL_EVENT_TYPE_SLUG,
    timeZone: CAL_TIME_ZONE,
  })
  const response = await calFetch(
    `/v2/slots?${params.toString()}`,
    CAL_SLOTS_API_VERSION,
  )
  const payload = (await response.json()) as CalSlotsResponse

  if (payload.status !== 'success') {
    throw new CalApiError('Cal slots response was unsuccessful')
  }

  return normalizeSlots(payload.data)
}

export async function createCalBooking(input: CreateCalBookingInput) {
  const attendee = {
    name: input.name,
    email: input.email,
    timeZone: CAL_TIME_ZONE,
    ...(input.phone ? { phoneNumber: input.phone } : {}),
  }
  const response = await calFetch('/v2/bookings', CAL_BOOKINGS_API_VERSION, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      start: input.start,
      attendee,
      username: CAL_EVENT_USERNAME,
      eventTypeSlug: CAL_EVENT_TYPE_SLUG,
      ...(input.message ? { metadata: { message: input.message } } : {}),
    }),
  })
  const payload = (await response.json()) as CalBookingResponse

  if (payload.status !== 'success') {
    throw new CalApiError('Cal booking response was unsuccessful')
  }

  return { uid: payload.data?.uid }
}

export function isCalConflict(error: unknown) {
  return error instanceof CalApiError && error.isConflict
}
