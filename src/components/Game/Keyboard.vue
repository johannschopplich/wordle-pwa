<script setup lang="ts">
import { computed } from "vue";
import type { LETTER_STATES } from "~/constants";

const props = defineProps<{
  letterStates: typeof LETTER_STATES;
  umlauts: boolean;
}>();

const emit = defineEmits<{
  (event: "key", value: string): void;
}>();

const rows = computed(() => [
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
      class="mx-auto w-full flex touch-none gap-1"
    >
      <div v-if="!umlauts && rowIndex === 1" class="grow-[0.5]" />

      <button
        v-for="(key, keyIndex) in row"
        :key="keyIndex"
        class="h-12 select-none bg-gray-200 p-0 text-base font-600 uppercase text-gray-900 transition-color,background-color-200 transition-delay-1500 dark:bg-zinc-700 hover:bg-gray-200 dark:text-white button"
        :class="[
          key.length > 1 && 'px-0.75',
          key.length === 1
            ? 'flex-1'
            : umlauts
            ? 'flex-[2_1_0%]'
            : 'flex-[1.5_1_0%]',
          letterStates[key],
        ]"
        @click="emit('key', key)"
      >
        <TeenyiconsTickCircleOutline v-if="key === 'Enter'" class="h-7 w-7" />
        <TeenyiconsBackspaceOutline
          v-else-if="key === 'Backspace'"
          class="h-7 w-7"
        />
        <span v-else>{{ key }}</span>
      </button>

      <div v-if="!umlauts && rowIndex === 1" class="grow-[0.5]" />
    </div>
  </div>
</template>
