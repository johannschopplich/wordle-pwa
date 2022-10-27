import {
  getAnswersFromEnv,
  getAnswersFromSpreadsheet,
} from "~/data/customAnswers";

const defaultMessage = "Using word of the day instead.";

export async function getAllWords() {
  const { answers } = await import("~/data/answers");
  const { allowedGuesses } = await import("~/data/allowedGuesses");
  const answersFromEnv = getAnswersFromEnv();
  const answersFromSpreadsheet = await getAnswersFromSpreadsheet();
  return [
    ...new Set([
      ...answers,
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
        alert(`Incorrect word length from encoded query. ${defaultMessage}`);
      } else {
        return query.toLowerCase();
      }
    } catch (e) {
      alert(`Malformed encoded word query. ${defaultMessage}`);
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
    const { answers } = await import("~/data/answers");
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
