import { createI18n } from "@leanera/vue-i18n";
import type { UserModule } from "~/types";

export const install: UserModule = ({ app }) => {
  // Auto-load translations
  const messages = Object.fromEntries(
    Object.entries(
      import.meta.glob<Record<string, any>>("../locales/*.json", {
        eager: true,
      }),
    ).map(([key, value]) => [key.slice(11, -5), value]),
  );

  const i18n = createI18n({
    defaultLocale: "de",
    locales: Object.keys(messages),
    messages,
  });

  app.use(i18n);
};
