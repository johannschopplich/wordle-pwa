import { defineConfig, presetUno } from "unocss";
import { presetTypography } from "@unocss/preset-typography";

const control =
  "appearance-none text-base py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600";

export default defineConfig({
  theme: {
    fontFamily: {
      heading: "Henrietta, sans-serif",
    },
  },
  presets: [presetUno(), presetTypography()],
  shortcuts: {
    box: "bg-white rounded-md shadow-sm p-4 dark:bg-gray-800",
    button: `${control} border-transparent bg-green-600 hover:bg-green-700 text-white text-base font-semibold flex-shrink-0 focus:outline-none focus:ring-offset-white focus:ring-offset-2 disabled:cursor-default disabled:bg-gray-600 disabled:border-gray-600 disabled:opacity-50 dark:focus:ring-offset-gray-900`,
    input: `${control} w-full bg-white border-gray-200 placeholder-gray-400 dark:bg-gray-800 dark:border-gray-600 !focus:border-transparent`,
    "icon-inline":
      "w-[1em] h-[1em] relative bottom-[0.125em] inline-block fill-current text-current select-none",
  },
});
