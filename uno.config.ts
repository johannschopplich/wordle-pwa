import {
  defineConfig,
  presetIcons,
  presetWind,
  transformerDirectives,
} from 'unocss'
import { theme } from '@unocss/preset-wind'
import type { Theme } from '@unocss/preset-wind'

const control =
  'appearance-none border rounded-md px-3 py-2 text-base leading-4 shadow-sm sm:text-sm focus:outline-none'

export default defineConfig<Theme>({
  theme: {
    fontFamily: {
      heading: `Henrietta,${theme.fontFamily!.sans}`,
      'heading-condensed': `Henrietta Condensed,${theme.fontFamily!.sans}`,
    },
  },
  shortcuts: {
    box: 'rounded-md bg-white p-4 shadow-sm dark:bg-gray-800',
    button: `${control} inline-flex items-center justify-center whitespace-nowrap border-transparent bg-amber-600 font-500 text-white disabled:cursor-default disabled:border-gray-100 disabled:bg-gray-100 hover:bg-amber-700 disabled:text-gray-500 focus:ring-2 focus:ring-offset-2 focus:ring-amber-600 disabled:hover:bg-gray-100 dark:focus:ring-offset-gray-900`,
    input: `${control} w-full border-gray-300 bg-white dark:border-gray-500 disabled:border-gray-100 focus:border-amber-600 dark:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-500 focus:ring focus:ring-amber-600 placeholder-gray-400`,
    'icon-inline':
      'relative bottom-[0.125em] inline-block h-[1em] w-[1em] select-none fill-current text-current',
  },
  presets: [presetWind(), presetIcons()],
  transformers: [transformerDirectives()],
})
