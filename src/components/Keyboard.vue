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
      v-for="(row, i) in rows"
      :key="i"
      class="w-full flex gap-1 mx-auto touch-manipulation"
    >
      <div v-if="!umlauts && i === 1" style="flex-grow: 0.5" />

      <button
        v-for="key in row"
        :key="key"
        :class="[
          'button h-12 p-0 bg-gray-200 text-gray-900 font-semibold uppercase select-none transition-color,background-color-200 transition-delay-1500 hover:bg-gray-200',
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
        <TeenyiconsTickCircleOutline v-if="key === 'Enter'" class="text-3xl" />
        <TeenyiconsBackspaceOutline
          v-else-if="key === 'Backspace'"
          class="text-3xl"
        />
        <span v-else>{{ key }}</span>
      </button>

      <div v-if="!umlauts && i === 1" style="flex-grow: 0.5" />
    </div>
  </div>
</template>
