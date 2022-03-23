<script setup lang="ts">
import type { LetterState } from "~/types";

const props = defineProps<{
  letterStates: Record<string, LetterState>;
  umlauts: boolean;
}>();

defineEmits<{
  (e: "key", key: string): void;
}>();

const rows = $computed(() => [
  `qwertyuiop${props.umlauts ? "ü" : ""}`.split(""),
  `asdfghjkl${props.umlauts ? "öä" : ""}`.split(""),
  ["Enter", ..."zxcvbnm".split(""), "Backspace"],
]);
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="(row, rowIndex) in rows"
      :key="rowIndex"
      class="w-full flex gap-1 mx-auto touch-none"
    >
      <div v-if="!umlauts && rowIndex === 1" style="flex-grow: 0.5" />

      <button
        v-for="(key, keyIndex) in row"
        :key="keyIndex"
        :class="[
          'button h-12 p-0 bg-gray-200 text-gray-900 text-base font-600 uppercase select-none hover:bg-gray-200 dark:bg-zinc-700 dark:text-white',
          key.length > 1 && 'px-0.75',
          key.length === 1
            ? 'flex-1'
            : umlauts
            ? 'flex-[2_1_0%]'
            : 'flex-[1.5_1_0%]',
          letterStates[key],
        ]"
        @click="$emit('key', key)"
      >
        <TeenyiconsTickCircleOutline v-if="key === 'Enter'" class="w-7 h-7" />
        <TeenyiconsBackspaceOutline
          v-else-if="key === 'Backspace'"
          class="w-7 h-7"
        />
        <span v-else>{{ key }}</span>
      </button>

      <div v-if="!umlauts && rowIndex === 1" style="flex-grow: 0.5" />
    </div>
  </div>
</template>

<style scoped>
button.correct,
button.present,
button.absent {
  @apply transition-color,background-color-200 transition-delay-1500;
}
</style>
