export interface GoogleSheetsResponse {
  majorDimension: 'DIMENSION_UNSPECIFIED' | 'ROWS' | 'COLUMNS'
  range: string
  values: string[][]
}

export async function getGoogleSpreadsheetValues<
  ColumnHeaders extends string = string,
>(id: string, sheet: string) {
  let data: GoogleSheetsResponse | undefined

  try {
    data = await $sheets<GoogleSheetsResponse>(`${id}/values/${sheet}`, {
      cache: true,
    })
  } catch (error) {
    console.error('Error fetching spreadsheet data:', error)
  }

  const rows: Record<ColumnHeaders, string>[] = []
  const rawRows: string[][] = data?.values || [[]]
  const headers: string[] = rawRows.shift() || []

  for (const row of rawRows) {
    const rowData = row.reduce<Record<string, string>>((acc, cell, index) => {
      acc[headers[index]] = cell
      return acc
    }, {})

    rows.push(rowData)
  }

  return rows
}
