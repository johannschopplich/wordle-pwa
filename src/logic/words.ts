import { answers } from "~/data/answers";
import { customAnswers } from "~/data/customAnswers";

const defaultMessage = "Using word of the day instead.";

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

  let start = new Date("2022-01-01");

  if (import.meta.env.VITE_STARTS_AT) {
    const date = new Date(import.meta.env.VITE_STARTS_AT);
    if (date.toString() === "Invalid Date") {
      console.error('Invalid start date in "VITE_STARTS_AT" env variable.');
    } else {
      start = date;
    }
  }

  let word;

  if (customAnswers.length) {
    word = getWordFromList(customAnswers, start);
  }

  if (!word) {
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
