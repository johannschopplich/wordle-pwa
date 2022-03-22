/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, inject } from "vue";
import type { App, InjectionKey } from "vue";
import type { Messages, I18nInstance, I18nConfig } from "~/types";

declare module "vue" {
  interface ComponentCustomProperties {
    $t: I18nInstance["t"];
  }
}

const injectionKey = Symbol("i18n") as InjectionKey<I18nInstance>;

function parseAndReplaceString(str: string, params: any): string {
  const RE = /{(\w*)}/g;
  let arr;
  let _str: string = str;

  while ((arr = RE.exec(str)) !== null) {
    if (Object.prototype.hasOwnProperty.call(params, arr[1])) {
      _str = _str.replace(arr[0], params[arr[1]]);
    } else {
      throw new Error(`[i18n] Param "${arr[1]}" not found`);
    }
  }

  return _str;
}

function recursiveRetrieve(
  chain: string[],
  messages: Messages,
  params?: any
): string {
  const key = chain[0];
  if (~key.indexOf("[")) {
    // Get array item
    const [objKey, str] = key.split("[");
    const num = parseInt(str.replace("]", ""));

    if (num > -1) {
      if (
        !messages[objKey] &&
        messages[objKey].length > 0 &&
        messages[objKey][num] &&
        messages[objKey][num] !== ""
      ) {
        throw new Error("Key not found");
      } else if (chain.length === 1) {
        return typeof messages[objKey][num] === "string"
          ? messages[objKey][num]
          : "";
      } else {
        return recursiveRetrieve(chain.slice(1), messages[objKey][num], params);
      }
    } else {
      throw new Error(`Key "${key}" not found`);
    }
  } else {
    if (!messages[chain[0]] && messages[chain[0]] !== "") {
      throw new Error("Message not found");
    } else if (chain.length === 1) {
      let string: string =
        typeof messages[chain[0]] === "string" ? messages[chain[0]] : "";
      if (params) {
        string = parseAndReplaceString(string, params);
      }
      return string;
    } else {
      return recursiveRetrieve(chain.slice(1), messages[chain[0]], params);
    }
  }
}

export const createI18n = (config: I18nConfig): I18nInstance => {
  const { defaultLocale, locales, messages } = config;
  const fallbackLocale = "en";
  const locale = ref(defaultLocale || fallbackLocale);

  const t = (key: string, params?: any): string => {
    const pack = messages[locale.value] || messages[fallbackLocale];

    if (typeof key !== "string") {
      console.warn("[i18n]", "Key must be a string");
      return "";
    }

    try {
      return recursiveRetrieve(key.split("."), pack, params);
    } catch (error) {
      console.warn("[i18n]", `Key path "${key}" not found`);
      return "";
    }
  };

  return {
    locales,
    locale,
    messages,
    t,
    install(app: App) {
      app.provide(injectionKey, this);
      app.config.globalProperties.$t = this.t;
      app.config.globalProperties.$i18n = this;
    },
  };
};

export function useI18n() {
  return inject(injectionKey) as Omit<I18nInstance, "install">;
}
