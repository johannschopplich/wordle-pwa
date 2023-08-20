<script setup lang="ts">
import '~/assets/css/main.css'

const appConfig = useAppConfig()
const sheetsConfig = await useGoogleSheetsConfig()
mergeIntoAppConfig(appConfig, { sheetsConfig })

// Server-only head tags for improved performance
useServerHead({
  title: appConfig.title,
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/images/favicon.png',
    },
    {
      rel: 'apple-touch-icon',
      href: '/images/pwa-192x192.png',
    },
    {
      rel: 'manifest',
      href: '/manifest.webmanifest',
    },
  ],
  meta: [
    {
      name: 'theme-color',
      content: appConfig.themeColor,
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
      innerHTML: `
((root) => {
  if (localStorage.getItem('app.color-scheme') === 'dark') {
    root.classList.add('dark')
  }
})(document.documentElement)
`.trimStart(),
    },
  ],
})

const { tomorrow, tryReset } = useProvideWordleStore()
const forceRenderKey = ref(0)

if (process.client) {
  // Reset the app when tomorrow is already reached
  useIntervalFn(tryReset, 1000)
}

onMounted(() => {
  // Force re-render when state has been read from localStorage
  forceRenderKey.value++
})

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
    <GameBoard :key="tomorrow.getTime() + forceRenderKey" />
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
  background-image: url(/images/christmas/knit-pattern-1.svg);
  background-position: center calc(100% - 0.5rem);
  background-repeat: repeat-x;
  background-size:
    auto 1.5rem,
    auto 1rem;
}
</style>
