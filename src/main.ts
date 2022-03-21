import { createApp } from "vue";
import App from "./App.vue";

import "@unocss/reset/tailwind.css";
import "./main.css";
import "uno.css";

const app = createApp(App);

// Install all modules from `./modules/`
for (const m of Object.values(import.meta.globEager("./modules/*.ts"))) {
  m.install?.({ app });
}

app.mount("#app");
