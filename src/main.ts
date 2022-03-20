import { createApp } from "vue";
import App from "./App.vue";

import "@unocss/reset/tailwind.css";
import "./main.css";
import "uno.css";

// Set actual vh on mobile
const onResize = () =>
  document.body.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);

// Resize for scaling the board size
window.addEventListener("resize", onResize);
// Set size on startup
onResize();

const app = createApp(App);

// Install all modules from `./modules/`
for (const m of Object.values(import.meta.globEager("./modules/*.ts"))) {
  m.install?.({ app });
}

app.mount("#app");
