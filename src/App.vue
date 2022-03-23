<script setup lang="ts">
import { until, useNow, useStorage } from "@vueuse/core";

const now = useNow();
const tomorrow = useStorage<Date>(
  "app.next",
  getTomorrow(now.value),
  undefined,
  {
    serializer: {
      read: (v) => new Date(v),
      write: (v) => v.toISOString(),
    },
  }
);

// Reset the app when tomorrow is already reached
if (tomorrow.value.getTime() < now.value.getTime()) {
  reset();
}

// Reset the app when the next day has dawned
until(now)
  .toMatch((v) => v.getTime() > tomorrow.value.getTime())
  .then(reset);

function getTomorrow(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
}

function reset() {
  // Reset board state to initialize a new game
  localStorage.removeItem("app.state");
  // Re-render the board component
  tomorrow.value = getTomorrow(now.value);
}
</script>

<template>
  <div class="h-full grid grid-rows-[auto_1fr_auto] gap-4 children:min-w-0">
    <Header />

    <!-- Board will contains two fragments -->
    <Board :key="tomorrow.getTime()" />
  </div>

  <div class="absolute top-3 right-3 text-white hidden md:block">
    <ColorSchemaToggle />
  </div>
</template>
