import { defineConfig, presetUno } from "unocss";
import { presetTypography } from "@unocss/preset-typography";

const control =
  "appearance-none text-sm leading-4 px-3 py-2 border rounded-md shadow-sm focus:outline-none";

export default defineConfig({
  theme: {
    fontFamily: {
      heading: "Henrietta, sans-serif",
    },
  },
  presets: [presetUno(), presetTypography()],
  shortcuts: {
    box: "bg-white rounded-md shadow-sm p-4 dark:bg-gray-800",
    button: `${control} border-transparent bg-amber-600 hover:bg-amber-700 text-white font-medium flex-shrink-0 focus:ring-2 focus:ring-offset-2 focus:ring-amber-600 disabled:cursor-default disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-100 dark:focus:ring-offset-gray-900`,
    input: `${control} w-full bg-white border-gray-300 placeholder-gray-400 focus:border-amber-600 focus:ring focus:ring-amber-600 disabled:bg-gray-100 disabled:border-gray-100 disabled:text-gray-500 dark:bg-gray-800 dark:border-gray-600`,
    "icon-inline":
      "w-[1em] h-[1em] relative bottom-[0.125em] inline-block fill-current text-current select-none",
  },
});
