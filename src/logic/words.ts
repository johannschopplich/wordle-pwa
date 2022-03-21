import { allowedGuesses } from "~/data/allowedGuesses";
import { answers } from "~/data/answers";
import { customAnswers } from "~/data/customAnswers";

const defaultMessage = "Using word of the day instead.";

export const allWords = [
  ...new Set([...answers, ...customAnswers, ...allowedGuesses]),
];

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

  const now = new Date();
  let start = new Date(2022, 0, 0);
  let currentAnswers = answers;

  const customStart = import.meta.env.VITE_STARTS_AT;
  if (customStart) {
    if (isNaN(new Date(customStart).getTime())) {
      alert(`Malformed custom date in "VITE_STARTS_AT". ${defaultMessage}`);
    } else {
      start = new Date(customStart);
    }
  }

  if (customAnswers.length) {
    currentAnswers = customAnswers;
  }

  const diff = Number(now) - Number(start);
  let day = Math.floor(diff / (1000 * 60 * 60 * 24));
  while (day > currentAnswers.length) {
    day -= currentAnswers.length;
  }

  return currentAnswers[day];
}
