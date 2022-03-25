<script setup lang="ts">
import { state, countdown } from "~/logic/store";

function pad(n: number) {
  return n < 10 ? "0" + n : n;
}
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
        {{ $t(state.gameOver ? "header.nextRound" : "header.currentRound") }}
      </span>
      <span v-show="state.gameOver" class="text-stone-500 dark:text-zinc-400">
        {{ " " }}
        {{ pad(countdown.hours) }}:{{ pad(countdown.minutes) }}
      </span>
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
