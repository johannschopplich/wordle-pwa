export function mergeIntoAppConfig(
  appConfig: Record<string, unknown>,
  configs: {
    sheetsConfig?: Record<string, any>
  } = {},
) {
  const { sheetsConfig } = configs

  const customTitle = sheetsConfig?.['App-Titel']?.[0]
  if (customTitle) appConfig.title = customTitle

  const customThemeColor = sheetsConfig?.['Primärfarbe']?.[0]
  if (customThemeColor) appConfig.themeColor = customThemeColor

  const customStartsAt = sheetsConfig?.['Startet am']?.[0]
  if (customStartsAt) appConfig.startsAt = customStartsAt
}
