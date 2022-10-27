import { getSpreadsheetValues } from "~/logic/spreadsheet";

export let answersFromEnv: string[] | undefined;
export let answersFromSpreadsheet: string[] | undefined;

export function getAnswersFromEnv() {
  answersFromEnv ??= import.meta.env.VITE_ANSWERS?.split(",") ?? [];
  return answersFromEnv;
}

export async function getAnswersFromSpreadsheet() {
  if (answersFromSpreadsheet) return answersFromSpreadsheet;

  if (
    !import.meta.env.VITE_GOOGLE_API_KEY ||
    !import.meta.env.VITE_SPREADSHEET_ID ||
    !import.meta.env.VITE_SPREADSHEET_SHEET
  )
    return [];

  const values = await getSpreadsheetValues(
    import.meta.env.VITE_SPREADSHEET_ID,
    import.meta.env.VITE_SPREADSHEET_SHEET
  );

  const result = values.map((i) => Object.values(i)[0]);
  answersFromSpreadsheet = result;
  return result;
}
