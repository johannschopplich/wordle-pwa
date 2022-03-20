import { allowedGuesses } from "~/data/allowedGuesses";
import { answers } from "~/data/answers";

const defaultMessage = "Using word of the day instead.";

export const allWords = [...answers, ...allowedGuesses];

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

  if (import.meta.env.VITE_STARTS_AT) {
    start = new Date(import.meta.env.VITE_STARTS_AT);
    if (isNaN(start.getTime())) {
      alert(`Invalid custom date in "VITE_STARTS_AT". ${defaultMessage}`);
      start = new Date(2022, 0, 0);
    }
  }

  if (import.meta.env.VITE_ANSWERS) {
    currentAnswers = import.meta.env.VITE_ANSWERS.split(",");
    if (!Array.isArray(currentAnswers)) {
      alert(
        `Malformed custom answers list in "VITE_ANSWERS". ${defaultMessage}`
      );
    }
  }

  const diff = Number(now) - Number(start);
  let day = Math.floor(diff / (1000 * 60 * 60 * 24));
  console.log(day);
  while (day > currentAnswers.length) {
    day -= currentAnswers.length;
  }

  return currentAnswers[day];
}
