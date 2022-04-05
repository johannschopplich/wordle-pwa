<script setup lang="ts">
import { watchThrottled } from "@vueuse/core";
import { now, tomorrow, tryReset } from "~/logic/store";

// Reset the app when tomorrow is already reached
watchThrottled(now, tryReset, { immediate: true, throttle: 1000 });
</script>

<template>
  <div class="h-full grid grid-rows-[auto_1fr_auto] gap-4 children:min-w-0">
    <AppHeader />

    <!-- Board will render two fragments -->
    <GameBoard :key="tomorrow.getTime()" />
  </div>

  <div class="absolute top-3 right-3 text-white hidden md:block">
    <AppThemeToggle />
  </div>
</template>
