export interface SpreadsheetValues {
  majorDimension: "DIMENSION_UNSPECIFIED" | "ROWS" | "COLUMNS";
  range: string;
  values: string[][];
}

export async function getSpreadsheetValues<
  ColumnHeaders extends string = string,
>(id: string, sheet: string) {
  let data: SpreadsheetValues | undefined;

  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${sheet}?key=${
        import.meta.env.VITE_GOOGLE_API_KEY
      }`,
    );
    if (!response.ok) {
      throw new Error(
        `Response failed with status ${response.status}: ${response.statusText}`,
      );
    }
    data = await response.json();
  } catch (error) {
    console.error("Error fetching spreadsheet data:", error);
  }

  const rows: Record<ColumnHeaders, string>[] = [];
  const rawRows: string[][] = data?.values || [[]];
  const headers: string[] = rawRows.shift() || [];

  for (const row of rawRows) {
    const rowData = row.reduce<Record<string, string>>((acc, cell, index) => {
      acc[headers[index]] = cell;
      return acc;
    }, {});

    rows.push(rowData);
  }

  return rows;
}
