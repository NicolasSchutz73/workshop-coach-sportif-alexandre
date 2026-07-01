export const commerceModes = ['demo', 'live'] as const
export type CommerceMode = (typeof commerceModes)[number]

export function getCommerceMode(): CommerceMode {
  return process.env.NEXT_PUBLIC_COMMERCE_MODE === 'live' ? 'live' : 'demo'
}

export function assertCommerceConfiguration() {
  const mode = getCommerceMode()

  if (mode === 'demo') {
    return { mode, testMode: true } as const
  }

  const liveApproved = process.env.COMMERCE_LIVE_APPROVED === 'true'
  const ebooksReady = process.env.EBOOKS_LIVE_READY === 'true'
  const testModeDisabled = process.env.LEMONSQUEEZY_TEST_MODE === 'false'

  if (!liveApproved || !ebooksReady || !testModeDisabled) {
    throw new Error(
      'Live commerce is blocked until products and final PDF files are approved.',
    )
  }

  return { mode, testMode: false } as const
}
