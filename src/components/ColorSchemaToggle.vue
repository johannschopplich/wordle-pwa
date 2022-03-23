<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <button class="w-8 h-8" @click="toggleDark()">
    <TeenyiconsSunSolid v-if="isDark" class="align-middle" />
    <TeenyiconsMoonSolid v-else class="align-middle" />
  </button>
</template>
