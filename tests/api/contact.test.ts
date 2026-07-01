import { beforeEach, describe, expect, it, vi } from 'vitest'

const sendMail = vi.hoisted(() => vi.fn())
vi.mock('nodemailer', () => ({ default: { createTransport: () => ({ sendMail }) } }))

import { POST } from '@/app/api/contact/route'

describe('POST /api/contact', () => {
  beforeEach(() => {
    Object.assign(process.env, {
      SMTP_HOST: 'smtp.example.test', SMTP_PORT: '587', SMTP_SECURE: 'false',
      SMTP_USERNAME: 'user', SMTP_PASSWORD: 'secret',
      EMAIL_DEFAULT_FROM: 'site@example.test', COACH_EMAIL: 'coach@example.test',
    })
    sendMail.mockResolvedValue({ messageId: 'test' })
  })

  it('validates and sends a contact email through the simulated SMTP transport', async () => {
    const response = await POST(new Request('http://localhost/api/contact', {
      method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': '192.0.2.10' },
      body: JSON.stringify({ firstName: 'Camille', lastName: 'Durand', email: 'camille@example.test', phone: '', message: 'Bonjour Alexandre', objective: 'Coaching', contactVerification: '', formStartedAt: Date.now() - 2_000 }),
    }))

    expect(response.status).toBe(200)
    expect(sendMail).toHaveBeenCalledOnce()
  })
})
