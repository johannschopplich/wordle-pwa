import type { App } from "vue";

export type UserModule = (ctx: { app: App }) => void;

export const enum LetterState {
  INITIAL = 0,
  CORRECT = "correct",
  PRESENT = "present",
  ABSENT = "absent",
}
