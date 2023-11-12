<script setup lang="ts">
const appConfig = useAppConfig()
const { t } = useI18n()
</script>

<template>
  <header
    class="header sticky top-4 z-10 rounded-lg bg-primary px-4 py-2 dark:bg-zinc-800"
  >
    <h1 class="text-2xl text-white tracking-wide font-heading dark:text-white">
      {{ appConfig.title }}
    </h1>
    <p class="text-xs font-500 uppercase -mt-1">
      <span class="text-white text-opacity-50 dark:text-zinc-500">
        {{ appConfig.description || t('header.currentRound') }}
      </span>
    </p>
  </header>
</template>

<style scoped>
.header {
  background-image: url('/images/favicon.svg');
  background-position: calc(100% - 1rem) calc(100% + 0.6rem);
  background-repeat: no-repeat;
  background-size: 3rem auto;
}
</style>
