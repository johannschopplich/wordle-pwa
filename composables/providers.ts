export async function useGoogleSheetsConfig() {
  const { google } = useRuntimeConfig().public
  if (!google.sheetsId || !google.sheetsTable) return

  return await getGoogleSheetsValues<
    [
      'Wort des Tages',
      'Startet am',
      'App-Titel',
      'App-Beschreibung',
      'Primärfarbe',
    ]
  >(google.sheetsId, google.sheetsTable)
}
