<script setup lang="ts">
import { useStorage, useToggle } from "@vueuse/core";

let mode = $(useStorage<"light" | "dark">("app.color-scheme", "light"));

const isDark = $computed<boolean>({
  get() {
    return mode === "dark";
  },
  set(v) {
    mode = v ? "dark" : "light";
    document.documentElement.classList.toggle("dark");
  },
});

const toggleDark = useToggle($$(isDark));
</script>

<template>
  <button class="w-8 h-8" @click="toggleDark()">
    <TeenyiconsSunSolid v-if="isDark" class="align-middle" />
    <TeenyiconsMoonSolid v-else class="align-middle" />
  </button>
</template>
