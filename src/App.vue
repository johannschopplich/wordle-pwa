<script setup lang="ts">
import { watchThrottled } from "@vueuse/core";
import { now, tomorrow, tryReset } from "~/logic/store";

// Reset the app when tomorrow is already reached
watchThrottled(now, tryReset, { immediate: true, throttle: 1000 });
</script>

<template>
  <div class="grid grid-rows-[auto_1fr_auto] h-full gap-4 children:min-w-0">
    <AppHeader />

    <!-- Board will render two fragments -->
    <GameBoard :key="tomorrow.getTime()" />
  </div>

  <div class="absolute right-3 top-3 hidden text-white md:block">
    <AppThemeToggle />
  </div>

  <!-- <div
    class="content-empty christmas-pattern -z-1 pointer-events-none absolute inset-0"
  /> -->
</template>

<style scoped>
.christmas-pattern {
  background-image: url(/images/christmas/knit-pattern-1.svg);
  background-position: center calc(100% - 0.5rem);
  background-repeat: repeat-x;
  background-size: auto 1.5rem, auto 1rem;
}
</style>
