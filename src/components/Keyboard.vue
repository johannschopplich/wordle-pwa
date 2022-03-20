<script setup lang="ts">
import type { LetterState } from "~/types";

defineProps<{
  letterStates: Record<string, LetterState>;
}>();

defineEmits<{
  (e: "key", key: string): void;
}>();

const rows = [
  "qwertyuiopü".split(""),
  "asdfghjklöä".split(""),
  ["Enter", ..."zxcvbnm".split(""), "Backspace"],
];
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="(row, i) in rows"
      :key="i"
      class="w-full flex gap-1 mx-auto touch-manipulation"
    >
      <!-- <div v-if="i === 1" style="flex-grow: 0.5" /> -->
      <button
        v-for="key in row"
        :key="key"
        :class="[
          'button h-12 p-0 flex justify-center items-center bg-gray-300 text-gray-900 select-none uppercase hover:bg-gray-400 transition-color,background-color-200 transition-delay-1500',
          key.length > 1 ? 'flex-[2_1_0%] pr-1' : 'flex-1',
          letterStates[key],
        ]"
        @click="$emit('key', key)"
      >
        <span v-if="key !== 'Backspace'">{{ key }}</span>
        <TeenyiconsBackspaceOutline v-else class="text-3xl" />
      </button>
      <!-- <div v-if="i === 1" style="flex-grow: 0.5" /> -->
    </div>
  </div>
</template>
