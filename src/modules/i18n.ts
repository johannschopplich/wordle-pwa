import { createI18n } from "@leanera/vue-i18n";
import de from "~/locales/de.json";
import type { UserModule } from "~/types";

export const install: UserModule = ({ app }) => {
  const i18n = createI18n({
    defaultLocale: "de",
    messages: {
      de,
    },
  });

  app.use(i18n);
};
