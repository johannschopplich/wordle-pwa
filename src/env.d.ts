declare module "~icons/*" {
  import type { FunctionalComponent } from "vue";
  const component: FunctionalComponent;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_STARTS_AT?: string;
  readonly VITE_ANSWERS?: string;
}
