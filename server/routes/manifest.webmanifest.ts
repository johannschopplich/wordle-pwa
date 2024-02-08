import type { FetchError } from 'ofetch'
import { parseGoogleSheetsValues } from '../../utils/googleSheetsApi'

export default defineEventHandler(async () => {
  const { google } = useRuntimeConfig().public
  const appConfig = useAppConfig()
  let title = appConfig.title
  let themeColor = appConfig.themeColor

  if (google.sheetsId && google.sheetsTable) {
    try {
      const response = await $sheets(
        `${google.sheetsId}/values/${google.sheetsTable}`,
      )
      const sheetsConfig = parseGoogleSheetsValues(response)

      const customTitle = sheetsConfig?.['App-Titel']?.[0]
      if (customTitle) title = customTitle

      const customThemeColor = sheetsConfig?.['Primärfarbe']?.[0]
      if (customThemeColor) themeColor = customThemeColor
    } catch (error) {
      console.error(
        'Failed to fetch Google Sheets data',
        (error as FetchError).data,
      )
    }
  }

  return {
    name: title,
    short_name: title,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: themeColor,
    theme_color: themeColor,
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
})
