import type { App } from "vue";

export type UserModule = (ctx: { app: App<Element> }) => void | Promise<void>;

export interface UserModuleImport {
  install?: UserModule;
}

export const enum LetterState {
  INITIAL = 0,
  CORRECT = "correct",
  PRESENT = "present",
  ABSENT = "absent",
}
