<script setup lang="ts">
import { until, useNow, useStorage } from "@vueuse/core";

const now = useNow();
const tomorrow = useStorage<Date>(
  "app.lastMatchDay",
  getTomorrow(),
  undefined,
  {
    serializer: {
      read: (v: any) => new Date(v),
      write: (v: any) => v.toISOString(),
    },
  }
);

if (tomorrow.value.getTime() < now.value.getTime()) {
  reset();
}

// Reset the app when the next day has dawned
until(now)
  .toMatch((v) => v.getTime() > tomorrow.value.getTime())
  .then(reset);

let boardKey = $ref(0);

function getTomorrow() {
  return new Date(
    now.value.getFullYear(),
    now.value.getMonth(),
    now.value.getDate() + 1
  );
}

function reset() {
  tomorrow.value = getTomorrow();
  // Reset board state
  localStorage.removeItem("app.board");
  boardKey++;
}
</script>

<template>
  <div class="h-full grid grid-rows-[auto_1fr_auto] gap-4 children:min-w-0">
    <Header />

    <Board :key="boardKey" />
  </div>
</template>
