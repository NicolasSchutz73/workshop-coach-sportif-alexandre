import { z } from 'zod'
import { getStrapiUrl } from '@/lib/strapi'

const optionalPhoneSchema = z
  .string()
  .trim()
  .max(40)
  .refine((value) => value.length === 0 || value.length >= 6)
  .optional()

const contactRequestSchema = z
  .object({
    firstName: z.string().trim().min(2).max(60),
    lastName: z.string().trim().min(2).max(60),
    email: z.string().trim().email().max(254),
    phone: optionalPhoneSchema,
    goal: z.string().trim().max(120).optional(),
    message: z.string().trim().min(1).max(3000),
    contactVerification: z.string().max(0),
  })
  .strict()

function getRequiredEnvironment() {
  const strapiApiToken = process.env.STRAPI_API_TOKEN

  if (!strapiApiToken) {
    throw new Error('Missing contact environment: STRAPI_API_TOKEN')
  }

  return { strapiApiToken }
}

export async function POST(request: Request) {
  let environment: ReturnType<typeof getRequiredEnvironment>

  try {
    environment = getRequiredEnvironment()
  } catch (error) {
    console.error(error)
    return Response.json(
      { error: "L'envoi du message est temporairement indisponible." },
      { status: 500 },
    )
  }

  const body = await request.json().catch(() => null)
  const parsed = contactRequestSchema.safeParse(body)

  if (!parsed.success) {
    return Response.json(
      { error: 'Les informations de contact sont invalides.' },
      { status: 400 },
    )
  }

  try {
    const strapiResponse = await fetch(getStrapiUrl('/api/contact-requests'), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${environment.strapiApiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: parsed.data }),
      cache: 'no-store',
    })

    if (strapiResponse.status === 400) {
      return Response.json(
        { error: 'Les informations de contact sont invalides.' },
        { status: 400 },
      )
    }

    if (!strapiResponse.ok) {
      throw new Error(
        `Strapi contact request failed: ${strapiResponse.status}`,
      )
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Unable to send contact request', error)
    return Response.json(
      { error: "L'envoi du message est temporairement indisponible." },
      { status: 502 },
    )
  }
}
