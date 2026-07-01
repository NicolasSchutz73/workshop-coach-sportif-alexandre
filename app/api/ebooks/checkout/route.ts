import { z } from 'zod'
import { ebooks, ebookSlugs, type EbookSlug } from '@/lib/ebooks'
import { assertCommerceConfiguration } from '@/lib/commerce'
import { hasOversizedBody, isRateLimited, rateLimitResponse } from '@/lib/request-security'

const checkoutSchema = z
  .object({
    ebook: z.enum(ebookSlugs),
  })
  .strict()

type LemonSqueezyCheckoutResponse = {
  data?: {
    attributes?: {
      url?: string
    }
  }
}

function getCheckoutEnvironment(ebook: EbookSlug) {
  const values = {
    apiKey: process.env.LEMONSQUEEZY_API_KEY,
    storeId: process.env.LEMONSQUEEZY_STORE_ID,
    variantId: process.env[ebooks[ebook].variantEnvironmentName],
  }
  const missing = Object.entries(values)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(`Missing LemonSqueezy environment: ${missing.join(', ')}`)
  }

  return values as Record<keyof typeof values, string>
}

export async function POST(request: Request) {
  if (hasOversizedBody(request)) {
    return Response.json({ error: 'La requête est trop volumineuse.' }, { status: 413 })
  }
  if (isRateLimited(request, 'ebook-checkout', 10, 10 * 60_000)) {
    return rateLimitResponse()
  }

  const body = await request.json().catch(() => null)
  const parsed = checkoutSchema.safeParse(body)

  if (!parsed.success) {
    return Response.json({ error: 'Produit invalide.' }, { status: 400 })
  }

  let environment: ReturnType<typeof getCheckoutEnvironment>
  let commerce: ReturnType<typeof assertCommerceConfiguration>

  try {
    commerce = assertCommerceConfiguration()
    environment = getCheckoutEnvironment(parsed.data.ebook)
  } catch (error) {
    console.error(error)
    return Response.json(
      { error: 'Le paiement est temporairement indisponible.' },
      { status: 503 },
    )
  }

  const storeId = Number(environment.storeId)
  const variantId = Number(environment.variantId)

  if (
    !Number.isSafeInteger(storeId) ||
    !Number.isSafeInteger(variantId) ||
    storeId < 1 ||
    variantId < 1
  ) {
    console.error('Invalid LemonSqueezy store or variant identifier')
    return Response.json(
      { error: 'Le paiement est temporairement indisponible.' },
      { status: 503 },
    )
  }

  try {
    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: `Bearer ${environment.apiKey}`,
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            product_options: {
              enabled_variants: [variantId],
            },
            test_mode: commerce.testMode,
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: String(storeId),
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: String(variantId),
              },
            },
          },
        },
      }),
      cache: 'no-store',
    })
    const payload = (await response.json().catch(() => null)) as
      | LemonSqueezyCheckoutResponse
      | null
    const checkoutUrl = payload?.data?.attributes?.url

    if (!response.ok || !checkoutUrl) {
      throw new Error(`LemonSqueezy checkout failed: ${response.status}`)
    }

    return Response.json({ url: checkoutUrl })
  } catch (error) {
    console.error('Unable to create LemonSqueezy checkout', error)
    return Response.json(
      { error: 'Le paiement est temporairement indisponible.' },
      { status: 502 },
    )
  }
}
