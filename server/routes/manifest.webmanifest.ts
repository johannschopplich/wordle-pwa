export default defineEventHandler(async (event) => {
  const { appName } = useRuntimeConfig().public

  setHeader(
    event,
    'Cache-Control',
    process.dev ? 'no-store' : 'public, max-age=604800, immutable',
  )

  return {
    name: appName,
    short_name: appName,
    start_url: '/',
    display: 'standalone',
    background_color: '#92400E',
    theme_color: '#92400E',
    icons: [
      {
        src: '/images/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/images/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  }
})
