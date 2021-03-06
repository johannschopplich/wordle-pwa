import { createApp } from "vue";
import App from "./App.vue";
import type { UserModuleImport } from "./types";

import "@unocss/reset/tailwind.css";
import "./main.css";
import "uno.css";

const app = createApp(App);

// Install all modules from `./modules/`
for (const m of Object.values(
  import.meta.glob<true, string, UserModuleImport>("./modules/*.ts", {
    eager: true,
  })
)) {
  m.install?.({ app });
}

app.mount("#app");
