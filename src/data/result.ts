import { LetterState } from "~/types";

export const icons = {
  [LetterState.CORRECT]: "🟩",
  [LetterState.PRESENT]: "🟨",
  [LetterState.ABSENT]: "⬜",
  [LetterState.INITIAL]: null,
};
