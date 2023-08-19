import type { FetchError } from 'ofetch'

interface GoogleSpreadSheetsValues {
  majorDimension: 'DIMENSION_UNSPECIFIED' | 'ROWS' | 'COLUMNS'
  range: string
  values: string[][]
}

export async function getGoogleSheetsValues<Header extends string[] = string[]>(
  id: string,
  sheet: string,
) {
  let data: GoogleSpreadSheetsValues | undefined

  try {
    data = await $sheets<GoogleSpreadSheetsValues>(`${id}/values/${sheet}`, {
      cache: true,
    })
  } catch (error) {
    console.error(
      'Failed to fetch Google Sheets data',
      (error as FetchError).data,
    )
  }

  return parseGoogleSheetsValues<Header>(data)
}

export function parseGoogleSheetsValues<Header extends string[] = string[]>(
  data?: GoogleSpreadSheetsValues,
) {
  const headers = (data?.values?.[0] ?? []) as Header
  const rows = data?.values?.slice(1) ?? []

  return headers.reduce(
    (acc, header, index) => {
      const values = rows.map((row) => row[index])
      acc[header as Header[number]] = values
      return acc
    },
    {} as Record<Header[number], (string | null)[]>,
  )
}
