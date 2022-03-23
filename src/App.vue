<script setup lang="ts">
import { until, useNow, useStorage } from "@vueuse/core";

let now = $(useNow());
let tomorrow = $(
  useStorage<Date>("app.next", getTomorrow(now), undefined, {
    serializer: {
      read: (v) => new Date(v),
      write: (v) => v.toISOString(),
    },
  })
);

// Reset the app when tomorrow is already reached
if (tomorrow.getTime() < now.getTime()) {
  reset();
}

// Reset the app when the next day has dawned
until($$(now))
  .toMatch((v) => v.getTime() > tomorrow.getTime())
  .then(reset);

// Count down to next play day
const countdown = $computed(() => {
  const diff = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return `${pad(hours)}:${pad(minutes)}`;
});

function getTomorrow(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
}

function pad(n: number) {
  return n < 10 ? "0" + n : n;
}

function reset() {
  // Reset board state to initialize a new game
  localStorage.removeItem("app.state");
  // Re-render the board component
  tomorrow = getTomorrow(now);
}
</script>

<template>
  <div class="h-full grid grid-rows-[auto_1fr_auto] gap-4 children:min-w-0">
    <Header :countdown="countdown" />

    <!-- Board will contains two fragments -->
    <Board :key="tomorrow.getTime()" />
  </div>

  <div class="absolute top-3 right-3 text-white hidden md:block">
    <ColorSchemaToggle />
  </div>
</template>
