import { defineConfig, presetTypography, presetWind } from "unocss";
import { theme } from "@unocss/preset-wind";

const control =
  "appearance-none rounded-md border px-3 py-2 text-base leading-4 shadow-sm focus:outline-none sm:text-sm";

export default defineConfig({
  theme: {
    fontFamily: {
      heading: `Henrietta,${theme.fontFamily!.sans}`,
      "heading-condensed": `Henrietta Condensed,${theme.fontFamily!.sans}`,
    },
  },
  shortcuts: {
    box: "rounded-md bg-white p-4 shadow-sm dark:bg-gray-800",
    button: `${control} bg-amber-600 font-500 hover:bg-amber-700 focus:ring-amber-600 inline-flex items-center justify-center whitespace-nowrap border-transparent text-white focus:ring-2 focus:ring-offset-2 disabled:cursor-default disabled:border-gray-100 disabled:bg-gray-100 disabled:text-gray-500 disabled:hover:bg-gray-100 dark:focus:ring-offset-gray-900`,
    input: `${control} focus:border-amber-600 focus:ring-amber-600 w-full border-gray-300 bg-white placeholder-gray-400 focus:ring disabled:border-gray-100 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-500 dark:bg-gray-800`,
    "icon-inline":
      "relative bottom-[0.125em] inline-block h-[1em] w-[1em] select-none fill-current text-current",
  },
  presets: [presetWind(), presetTypography()],
});
