import { getSpreadsheetValues } from "~/logic/googleSheetsApi";

const DEFAULT_MESSAGE = "Using word of the day instead.";

export let answersFromEnv: string[] | undefined;
export let answersFromSpreadsheet: string[] | undefined;
export let defaultAnswers: string[] = [];

export async function getAllWords() {
  const { default: allowedGuesses } = await import(
    "~/data/allowedGuesses.json"
  );
  const answersFromEnv = getAnswersFromEnv();
  const answersFromSpreadsheet = await getAnswersFromSpreadsheet();

  if (!answersFromEnv.length && !answersFromSpreadsheet.length) {
    const { default: answers } = await import("~/data/answers.json");
    defaultAnswers = answers;
  }

  return [
    ...new Set([
      ...defaultAnswers,
      ...answersFromEnv,
      ...answersFromSpreadsheet,
      ...allowedGuesses,
    ]),
  ];
}

export async function getWordOfTheDay() {
  if (location.search) {
    try {
      const query = atob(location.search.slice(1));
      if (query.length !== 5) {
        alert(`Incorrect word length from encoded query. ${DEFAULT_MESSAGE}`);
      } else {
        return query.toLowerCase();
      }
    } catch (e) {
      alert(`Malformed encoded word query. ${DEFAULT_MESSAGE}`);
    }
  }

  let start = new Date(new Date().getFullYear(), 0, 1);

  if (import.meta.env.VITE_STARTS_AT) {
    const date = new Date(import.meta.env.VITE_STARTS_AT);
    if (date.toString() === "Invalid Date") {
      console.error('Invalid start date in "VITE_STARTS_AT" env variable.');
    } else {
      start = date;
    }
  }

  let word: string | undefined;

  const answersFromEnv = getAnswersFromEnv();
  if (answersFromEnv.length) {
    word = getWordFromList(answersFromEnv, start);
  }

  const answersFromSpreadsheet = await getAnswersFromSpreadsheet();
  if (answersFromSpreadsheet.length) {
    word = getWordFromList(answersFromSpreadsheet, start);
  }

  if (!word) {
    const { default: answers } = await import("~/data/answers.json");
    word = getWordFromList(answers, start);
  }

  return word;
}

function getWordFromList(answers: string[], start: Date) {
  const now = new Date();
  const diff = Number(now) - Number(start);
  let day = Math.floor(diff / (1000 * 60 * 60 * 24));
  while (day > answers.length) {
    day -= answers.length;
  }

  return answers[day];
}

function getAnswersFromEnv() {
  answersFromEnv ??=
    import.meta.env.VITE_ANSWERS?.split(",").map((i) => i.toLowerCase()) ?? [];
  return answersFromEnv;
}

async function getAnswersFromSpreadsheet() {
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

  const result = values.map((i) => Object.values(i)[0].toLowerCase());
  answersFromSpreadsheet = result;
  return result;
}
