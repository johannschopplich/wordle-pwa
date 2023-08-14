import type { App } from "vue";

export interface UserModuleContext {
  app: App<Element>;
}

export type UserModule = (ctx: UserModuleContext) => void | Promise<void>;
