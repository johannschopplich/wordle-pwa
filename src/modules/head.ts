import type { UserModule } from "~/types";

export const install: UserModule = () => {
  // Set actual vh on mobile
  const setVh = () =>
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight * 0.01}px`
    );

  window.addEventListener("resize", () => {
    setVh();

    // Debounced resize to fix iOS Safari bug in PWA mode
    setTimeout(setVh, 100);
  });

  // Set size on startup
  setVh();
};
