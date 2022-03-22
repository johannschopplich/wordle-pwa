<script setup lang="ts">
import { useNow, until } from "@vueuse/core";

const now = useNow();
const tomorrow = new Date(
  now.value.getFullYear(),
  now.value.getMonth(),
  now.value.getDate() + 1
);

// Reset the app when the next day has dawned
(async () => {
  await until(now).toMatch((v) => v.getTime() > tomorrow.getTime());
  location.reload();
})();
</script>

<template>
  <div class="h-full grid grid-rows-[auto_1fr_auto] gap-4 children:min-w-0">
    <header class="header bg-stone-100 px-4 py-2 rounded-lg">
      <h1 class="text-2xl text-amber-700 font-heading tracking-wide">
        Osterwortsuche
      </h1>
      <p class="-mt-1 text-stone-400 text-xs font-500 uppercase">
        Jeden Tag ein Wort
      </p>
    </header>

    <Board />
  </div>
</template>

<style scoped>
.header {
  background-image: url("/images/header.png");
  background-position: calc(100% - 0.5rem) bottom;
  background-repeat: no-repeat;
  background-size: 3.5rem auto;
}
</style>
