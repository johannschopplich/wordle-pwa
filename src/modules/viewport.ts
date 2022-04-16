import type { UserModule } from "~/types";

export const install: UserModule = () => {
  if (matchMedia("(hover: hover)").matches) return;

  // Set actual vh on mobile
  document.documentElement.style.setProperty(
    "--vh",
    `${window.innerHeight * 0.01}px`
  );
};
