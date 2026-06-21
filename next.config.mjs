function toRemotePattern(value) {
  if (!value) return null

  try {
    const url = new URL(value)

    return {
      protocol: url.protocol.replace(':', ''),
      hostname: url.hostname,
      port: url.port,
      pathname: '/uploads/**',
    }
  } catch {
    return null
  }
}

const remotePatterns = [
  toRemotePattern(process.env.STRAPI_URL),
  toRemotePattern(process.env.STRAPI_PUBLIC_URL),
  toRemotePattern(process.env.NEXT_PUBLIC_STRAPI_URL),
].filter(Boolean)

const allowedDevOrigins = [
  process.env.NEXT_DEV_ALLOWED_ORIGIN ?? '192.168.1.29',
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns,
  },
}

export default nextConfig
