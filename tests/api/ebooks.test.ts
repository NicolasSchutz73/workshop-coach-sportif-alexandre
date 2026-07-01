import { afterEach, describe, expect, it, vi } from 'vitest'
import { POST } from '@/app/api/ebooks/checkout/route'

describe('POST /api/ebooks/checkout', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('forces the simulated Lemon Squeezy checkout into test mode', async () => {
    Object.assign(process.env, {
      NEXT_PUBLIC_COMMERCE_MODE: 'demo', LEMONSQUEEZY_API_KEY: 'test-key',
      LEMONSQUEEZY_STORE_ID: '123', LEMONSQUEEZY_VARIANT_PLAN_10_KM: '456',
    })
    const remoteFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: { attributes: { url: 'https://checkout.example.test' } } }), { status: 201 }))
    vi.stubGlobal('fetch', remoteFetch)

    const response = await POST(new Request('http://localhost/api/ebooks/checkout', {
      method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': '192.0.2.30' },
      body: JSON.stringify({ ebook: 'plan-10-km' }),
    }))

    expect(response.status).toBe(200)
    const request = remoteFetch.mock.calls[0]?.[1] as RequestInit
    expect(JSON.parse(String(request.body)).data.attributes.test_mode).toBe(true)
  })
})
