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
  // const start = new Date(2022, 0, 0);
  const start = new Date(2022, 3, 12);
  const diff = Number(now) - Number(start);

  let day = Math.floor(diff / (1000 * 60 * 60 * 24));
  while (day > answers.length) {
    day -= answers.length;
  }

  return answers[day];
}
