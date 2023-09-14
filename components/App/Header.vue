<script setup lang="ts">
const appConfig = useAppConfig()
const { t } = useI18n()
</script>

<template>
  <header
    class="header sticky top-4 z-10 rounded-lg bg-zinc-100 px-4 py-2 dark:bg-zinc-800"
  >
    <h1
      class="text-2xl tracking-wide font-heading text-primary-700 dark:text-white"
    >
      {{ appConfig.title }}
    </h1>
    <p class="text-xs font-500 uppercase -mt-1">
      <span class="text-zinc-400 dark:text-zinc-500">
        {{ appConfig.description || t('header.currentRound') }}
      </span>
    </p>
  </header>
</template>

<style scoped>
.header {
  background-image: url('~/assets/images/header.png');
  background-position: calc(100% - 0.5rem) bottom;
  background-repeat: no-repeat;
  background-size: 3.5rem auto;
}
</style>
