<script setup lang="ts">
import { computed } from "vue";
import { useStorage, useToggle } from "@vueuse/core";

const mode = useStorage<"light" | "dark">("app.color-scheme", "light");

const isDark = computed({
  get() {
    return mode.value === "dark";
  },
  set(v) {
    mode.value = v ? "dark" : "light";
    document.documentElement.classList.toggle("dark");
  },
});

const toggleDark = useToggle(isDark);
</script>

<template>
  <button class="h-8 w-8" @click="toggleDark()">
    <TeenyiconsSunSolid v-if="isDark" class="align-middle" />
    <TeenyiconsMoonSolid v-else class="align-middle" />
  </button>
</template>
