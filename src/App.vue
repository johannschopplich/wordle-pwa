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
    <Header />

    <Board />
  </div>
</template>
