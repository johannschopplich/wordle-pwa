<script setup lang="ts">
import { watchThrottled } from "@vueuse/core";
import { now, tomorrow, tryReset } from "~/logic/store";

// Reset the app when tomorrow is already reached
watchThrottled(now, tryReset, { immediate: true, throttle: 1000 });
</script>

<template>
  <div class="children:min-w-0 grid h-full grid-rows-[auto_1fr_auto] gap-4">
    <AppHeader />

    <!-- Board will render two fragments -->
    <GameBoard :key="tomorrow.getTime()" />
  </div>

  <div class="absolute top-3 right-3 hidden text-white md:block">
    <AppThemeToggle />
  </div>

  <div
    class="content-empty christmas-pattern -z-1 absolute inset-0 pointer-events-none"
  />
</template>

<style scoped>
.christmas-pattern {
  background-image: url(/images/christmas-knit-pattern-1.svg);
  background-position: center calc(100% - 0.5rem);
  background-repeat: repeat-x;
  background-size: auto 1.5rem, auto 1rem;
}
</style>
