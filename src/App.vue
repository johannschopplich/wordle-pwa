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
</template>
