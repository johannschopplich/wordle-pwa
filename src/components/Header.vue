<script setup lang="ts">
import { countdown } from "~/logic/store";
</script>

<template>
  <header
    class="header sticky top-4 bg-stone-100 px-4 py-2 rounded-lg z-10 dark:bg-zinc-800"
  >
    <h1
      class="text-2xl text-amber-700 font-heading tracking-wide dark:text-amber-600"
    >
      {{ $t("title") }}
    </h1>
    <p class="-mt-1 text-xs font-500 uppercase">
      <span class="text-stone-400 dark:text-zinc-500">
        {{ $t("header.newWordOfTheDay") }}
      </span>
      {{ " " }}
      <span class="text-stone-500 dark:text-zinc-400">{{ countdown }}</span>
    </p>
  </header>
</template>

<style scoped>
.header {
  background-image: url("/images/header.png");
  background-position: calc(100% - 0.5rem) bottom;
  background-repeat: no-repeat;
  background-size: 3.5rem auto;
}
</style>
