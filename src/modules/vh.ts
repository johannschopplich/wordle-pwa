import type { UserModule } from "~/types";

export const install: UserModule = () => {
  // Set actual vh on mobile
  const onResize = () =>
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight * 0.01}px`
    );

  // Resize for scaling the board size
  window.addEventListener("resize", onResize);

  // Set size on startup
  onResize();
};