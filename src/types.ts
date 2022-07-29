import type { App } from "vue";

export interface UserModuleContext {
  app: App<Element>;
}

export type UserModule = (ctx: UserModuleContext) => void | Promise<void>;

export const enum LetterState {
  INITIAL = 0,
  CORRECT = "correct",
  PRESENT = "present",
  ABSENT = "absent",
}
