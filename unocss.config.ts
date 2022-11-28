import { defineConfig, presetTypography, presetWind } from "unocss";
import { theme } from "@unocss/preset-wind";

const control =
  "appearance-none rounded-md border px-3 py-2 text-base leading-4 shadow-sm focus:outline-none sm:text-sm";

export default defineConfig({
  theme: {
    colors: {
      primary: {
        DEFAULT: "#146C3A",
        "50": "#9CEDBF",
        "100": "#8BEAB4",
        "200": "#69E39E",
        "300": "#46DD87",
        "400": "#27D371",
        "500": "#21B15F",
        "600": "#1A8E4C",
        "700": "#146C3A",
        "800": "#0B3D21",
        "900": "#020D07",
      },
    },
    fontFamily: {
      heading: `Henrietta,${theme.fontFamily!.sans}`,
      "heading-condensed": `Henrietta Condensed,${theme.fontFamily!.sans}`,
    },
  },
  shortcuts: {
    box: "rounded-md bg-white p-4 shadow-sm dark:bg-gray-800",
    button: `${control} bg-primary-600 font-500 hover:bg-primary-700 focus:ring-primary-600 inline-flex items-center justify-center whitespace-nowrap border-transparent text-white focus:ring-2 focus:ring-offset-2 disabled:cursor-default disabled:border-gray-100 disabled:bg-gray-100 disabled:text-gray-500 disabled:hover:bg-gray-100 dark:focus:ring-offset-gray-900`,
    input: `${control} focus:border-primary-600 focus:ring-primary-600 w-full border-gray-300 bg-white placeholder-gray-400 focus:ring disabled:border-gray-100 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-500 dark:bg-gray-800`,
    "icon-inline":
      "relative bottom-[0.125em] inline-block h-[1em] w-[1em] select-none fill-current text-current",
  },
  presets: [presetWind(), presetTypography()],
});
