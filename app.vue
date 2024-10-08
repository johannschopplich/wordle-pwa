<script setup lang="ts">
import { getColors } from '@byjohann/ui/utils'
import headScript from '~/assets/js/head?raw'
import '~/assets/css/main.css'

const appConfig = useAppConfig()
const sheetsConfig = await useGoogleSheetsConfig()
mergeIntoAppConfig(appConfig, { sheetsConfig })

useServerSeoMeta({
  title: appConfig.title,
  themeColor: appConfig.themeColor,
})

useServerHead({
  link: [
    {
      rel: 'icon',
      href: '/favicon.ico',
      sizes: '32x32',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
    },
    {
      rel: 'manifest',
      href: '/manifest.webmanifest',
    },
  ],
  style: [
    {
      innerHTML: `
:root {
  ${generateColorsStyleheet(getColors(appConfig.themeColor), 'primary')}
}
`.trimStart(),
    },
  ],
  script: [
    {
      innerHTML: headScript,
    },
  ],
})

const { tomorrow, tryReset } = useProvideWordleStore()

if (import.meta.client) {
  // Reset the app when tomorrow is already reached
  useIntervalFn(tryReset, 1000)
  tryReset()
}

function generateColorsStyleheet(colors: Record<string, string>, prefix = '') {
  return Object.entries(colors)
    .map(
      ([key, value]) =>
        `--un-color${prefix ? `-${prefix}` : ''}-${key}: ${value};`,
    )
    .join('\n')
}
</script>

<template>
  <div class="grid grid-rows-[auto_1fr_auto] h-full gap-4 children:min-w-0">
    <AppHeader />

    <!-- Board will render two fragments -->
    <GameBoard :key="tomorrow.getTime()" />
  </div>

  <div class="absolute right-3 top-3 hidden text-white md:block">
    <AppThemeToggle />
  </div>

  <!-- <div
    class="christmas-pattern pointer-events-none absolute inset-0 content-empty -z-1"
  /> -->
</template>

<style scoped>
.christmas-pattern {
  background-image: url(~/assets/images/christmas/knit-pattern-1.svg);
  background-position: center calc(100% - 0.5rem);
  background-repeat: repeat-x;
  background-size:
    auto 1.5rem,
    auto 1rem;
}
</style>
