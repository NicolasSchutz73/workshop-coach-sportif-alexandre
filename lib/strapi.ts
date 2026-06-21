type StrapiFetchOptions = RequestInit & {
  next?: {
    revalidate?: number | false
    tags?: string[]
  }
}

function stripTrailingSlash(value: string) {
  return value.replace(/\/$/, '')
}

function getStrapiServerUrl() {
  return stripTrailingSlash(process.env.STRAPI_URL ?? 'http://localhost:1337')
}

function getStrapiPublicUrl() {
  return stripTrailingSlash(
    process.env.STRAPI_PUBLIC_URL ??
      process.env.NEXT_PUBLIC_STRAPI_URL ??
      getStrapiServerUrl(),
  )
}

export function getStrapiUrl(path = '') {
  const baseUrl = getStrapiServerUrl()

  if (!path) return baseUrl
  if (path.startsWith('http://') || path.startsWith('https://')) return path

  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export function getStrapiMediaUrl(url?: string | null) {
  if (!url) return undefined
  if (url.startsWith('http://') || url.startsWith('https://')) return url

  const baseUrl = getStrapiPublicUrl()
  return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`
}

export async function strapiFetch<T>(
  path: string,
  options: StrapiFetchOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')

  if (process.env.STRAPI_API_TOKEN) {
    headers.set('Authorization', `Bearer ${process.env.STRAPI_API_TOKEN}`)
  }

  const response = await fetch(getStrapiUrl(`/api${path}`), {
    ...options,
    headers,
    next: options.next ?? {
      revalidate: Number(process.env.STRAPI_REVALIDATE_SECONDS ?? 60),
    },
  })

  if (!response.ok) {
    throw new Error(`Strapi request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}
