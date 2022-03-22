import type { App } from "vue";

export type UserModule = (ctx: { app: App }) => void;

export interface AppStorage {
  board: {
    letter: string;
    state: LetterState;
  }[][];
  currentRowIndex: number;
  letterStates: Record<string, LetterState>;
}

export const enum LetterState {
  INITIAL = 0,
  CORRECT = "correct",
  PRESENT = "present",
  ABSENT = "absent",
}
