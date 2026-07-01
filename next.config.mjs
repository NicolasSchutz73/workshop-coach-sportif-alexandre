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

const hasLocalImageHost = remotePatterns.some(
  ({ hostname }) => hostname === 'localhost' || hostname === '127.0.0.1',
)

const allowedDevOrigins = [
  process.env.NEXT_DEV_ALLOWED_ORIGIN ?? '192.168.1.29',
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  allowedDevOrigins,
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    viewTransition: true,
  },
  images: {
    dangerouslyAllowLocalIP: hasLocalImageHost,
    qualities: [40, 60, 75],
    remotePatterns,
  },
}

export default nextConfig
