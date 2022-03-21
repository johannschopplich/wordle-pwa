import { answers } from "~/data/answers";
import { customAnswers } from "~/data/customAnswers";

const defaultMessage = "Using word of the day instead.";

function getWordFromList(answers: string[], start: Date) {
  const now = new Date();
  const diff = Number(now) - Number(start);
  let day = Math.floor(diff / (1000 * 60 * 60 * 24));
  while (day > answers.length) {
    day -= answers.length;
  }

  return answers[day];
}

export async function getAllWords() {
  const { allowedGuesses } = await import("~/data/allowedGuesses");
  return [...new Set([...answers, ...customAnswers, ...allowedGuesses])];
}

export function getWordOfTheDay() {
  if (location.search) {
    try {
      const query = atob(location.search.slice(1));
      if (query.length !== 5) {
        alert(`Incorrect word length from encoded query. ${defaultMessage}`);
      } else {
        return query;
      }
    } catch (e) {
      alert(`Malformed encoded word query. ${defaultMessage}`);
    }
  }

  if (import.meta.env.VITE_STARTS_AT && customAnswers.length) {
    const start = new Date(import.meta.env.VITE_STARTS_AT);
    if (isNaN(start.getTime())) {
      alert(`Malformed date format in "VITE_STARTS_AT". ${defaultMessage}`);
    } else {
      return getWordFromList(customAnswers, start);
    }
  }

  return getWordFromList(answers, new Date("2022-01-01"));
}
