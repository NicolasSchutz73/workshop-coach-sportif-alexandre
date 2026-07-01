import { describe, expect, it, vi } from 'vitest'

const getCalSlots = vi.hoisted(() => vi.fn())
const createCalBooking = vi.hoisted(() => vi.fn())
vi.mock('@/lib/cal', () => ({ getCalSlots, createCalBooking, isCalConflict: () => false }))

import { GET } from '@/app/api/cal/slots/route'
import { POST } from '@/app/api/cal/bookings/route'
import { NextRequest } from 'next/server'

describe('Cal.com API routes', () => {
  it('returns simulated monthly slots', async () => {
    getCalSlots.mockResolvedValue({ '2026-07-10': [{ start: '2026-07-10T08:00:00+02:00' }] })
    const response = await GET(new NextRequest('http://localhost/api/cal/slots?start=2026-07-01&end=2026-07-31', { headers: { 'x-forwarded-for': '192.0.2.20' } }))
    expect(response.status).toBe(200)
    expect(await response.json()).toHaveProperty('slotsByDate.2026-07-10')
  })

  it('rechecks availability before creating a simulated booking', async () => {
    const start = '2026-07-10T08:00:00+02:00'
    getCalSlots.mockResolvedValue({ '2026-07-10': [{ start }] })
    createCalBooking.mockResolvedValue({})
    const response = await POST(new Request('http://localhost/api/cal/bookings', {
      method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': '192.0.2.21' },
      body: JSON.stringify({ start, name: 'Camille Durand', email: 'camille@example.test', bookingVerification: '', formStartedAt: Date.now() - 2_000 }),
    }))
    expect(response.status).toBe(201)
    expect(createCalBooking).toHaveBeenCalledOnce()
  })
})
