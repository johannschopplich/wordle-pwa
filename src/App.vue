<script setup lang="ts">
import { until, useNow, useStorage } from "@vueuse/core";

const now = useNow();
const getTomorrow = () =>
  new Date(
    now.value.getFullYear(),
    now.value.getMonth(),
    now.value.getDate() + 1
  );

const tomorrow = useStorage<Date>("app.nextDay", getTomorrow(), undefined, {
  serializer: {
    read: (v: any) => new Date(v),
    write: (v: any) => v.toISOString(),
  },
});

// Reset the app when tomorrow is already reached
if (tomorrow.value.getTime() < now.value.getTime()) {
  reset();
}

// Reset the app when the next day has dawned
until(now)
  .toMatch((v) => v.getTime() > tomorrow.value.getTime())
  .then(reset);

// Reset board state
function reset() {
  localStorage.removeItem("app.state");
  tomorrow.value = getTomorrow();
}
</script>

<template>
  <div class="h-full grid grid-rows-[auto_1fr_auto] gap-4 children:min-w-0">
    <Header />

    <Board :key="tomorrow.getTime()" />
  </div>
</template>
