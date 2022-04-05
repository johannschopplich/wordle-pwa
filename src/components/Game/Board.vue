<script setup lang="ts">
import {
  promiseTimeout,
  useEventListener,
  useClipboard,
  useShare,
} from "@vueuse/core";
import { getWordOfTheDay, getAllWords } from "~/logic/words";
import { useI18n } from "~/logic/i18n";
import { state as _state, now, countdown } from "~/logic/store";
import { LetterState } from "~/types";

// Get the translation helper
const { t } = useI18n();

// Word of the day
let answer: string;

// All possible words
let allWords: string[] = [];

// Set up persistent data
let state = $(_state);

// Current active row
const currentRow = $computed(() => state.board[state.currentRowIndex]);

// Feedback state: message and shake
let message = $ref("");
let grid = $ref("");
let shakeRowIndex = $ref(-1);
let success = $ref(false);

// Handle keyboard input
let allowInput = true;

// Share board grid as text
let shareText = $ref("");
const { share, isSupported: isShareSupported } = useShare();
const { copy, copied, isSupported: isClipboardSupported } = useClipboard();

useEventListener(window, "keyup", (e: KeyboardEvent) => onKey(e.key));

// Lazily retrieve word/answers and initialize game state
(async () => {
  // Get word of the day
  answer = await getWordOfTheDay();

  // Get all words
  allWords = await getAllWords();

  // Handle already guessed word of the day
  if (state.gameOver) {
    allowInput = false;
    completeRow();
  }
})();

function onKey(key: string) {
  if (!allowInput) return;
  if (/^[\p{Letter}\p{Mark}]$/u.test(key)) {
    fillTile(key.toLowerCase());
  } else if (key === "Backspace") {
    clearTile();
  } else if (key === "Enter") {
    completeRow();
  }
}

function fillTile(letter: string) {
  for (const tile of currentRow) {
    if (!tile.letter) {
      tile.letter = letter;
      break;
    }
  }
}

function clearTile() {
  for (const tile of [...currentRow].reverse()) {
    if (tile.letter) {
      tile.letter = "";
      break;
    }
  }
}

async function completeRow() {
  if (!currentRow.every((tile) => tile.letter)) {
    shake();
    showMessage(t("errorMessages.notEnoughLetters"));
    return;
  }

  const guess = currentRow.map((tile) => tile.letter).join("");
  if (!allWords.includes(guess) && guess !== answer) {
    shake();
    showMessage(t("errorMessages.notInWordList"));
    return;
  }

  const answerLetters: (string | null)[] = answer.split("");

  // First pass: mark correct ones
  currentRow.forEach((tile, i) => {
    if (answerLetters[i] === tile.letter) {
      tile.state = state.letterStates[tile.letter] = LetterState.CORRECT;
      answerLetters[i] = null;
    }
  });

  // Second pass: mark the present
  currentRow.forEach((tile) => {
    if (!tile.state && answerLetters.includes(tile.letter)) {
      tile.state = LetterState.PRESENT;
      answerLetters[answerLetters.indexOf(tile.letter)] = null;
      if (!state.letterStates[tile.letter]) {
        state.letterStates[tile.letter] = LetterState.PRESENT;
      }
    }
  });

  // 3rd pass: mark absent
  currentRow.forEach((tile) => {
    if (!tile.state) {
      tile.state = LetterState.ABSENT;
      if (!state.letterStates[tile.letter]) {
        state.letterStates[tile.letter] = LetterState.ABSENT;
      }
    }
  });

  allowInput = false;
  if (!state.gameOver) await promiseTimeout(1600);

  if (currentRow.every((tile) => tile.state === LetterState.CORRECT)) {
    // Yay!
    grid = genResultGrid();
    shareText = `${now.value.toLocaleDateString("de-DE")}\n${grid}`;
    success = state.gameOver = true;
    // Wait for jump animation to almost finish (1000ms)
    await promiseTimeout(900);
    showMessage(t(`successMessages[${state.currentRowIndex}]`), -1);
  } else if (state.currentRowIndex < state.board.length - 1) {
    // Go the next row
    state.currentRowIndex++;
    allowInput = true;
  } else {
    // Game over :(
    state.gameOver = true;
    showMessage(
      t("errorMessages.notFound", { label: answer.toUpperCase() }),
      -1
    );
  }
}

async function showMessage(msg: string, time = 1250) {
  message = msg;
  if (time > 0) {
    await promiseTimeout(time);
    message = "";
  }
}

async function shake() {
  shakeRowIndex = state.currentRowIndex;
  await promiseTimeout(1000);
  shakeRowIndex = -1;
}

const icons = {
  [LetterState.CORRECT]: "🟩",
  [LetterState.PRESENT]: "🟨",
  [LetterState.ABSENT]: "⬛️",
  [LetterState.INITIAL]: null,
};

function genResultGrid() {
  return state.board
    .slice(0, state.currentRowIndex + 1)
    .map((row) => row.map((tile) => icons[tile.state]).join(""))
    .join("\n");
}
</script>

<template>
  <div class="flex justify-center items-center">
    <div
      class="w-$width h-$height grid grid-rows-6 gap-2 mx-auto"
      style="
        --height: clamp(12rem, calc(var(--h-screen) * 0.5), 26rem);
        --width: calc(var(--height) / 6 * 5);
      "
    >
      <div
        v-for="(row, rowIndex) in state.board"
        :key="rowIndex"
        :class="[
          'grid grid-cols-5 gap-2',
          shakeRowIndex === rowIndex &&
            'animate-[shake] animate-duration-500ms',
        ]"
      >
        <div
          v-for="(tile, index) in row"
          :key="index"
          :class="[
            'w-full relative text-size-[calc(var(--height)*0.1)] font-700 uppercase select-none',
            tile.letter && 'animate-[zoom] animate-duration-200ms',
          ]"
        >
          <div
            :class="[
              'tile-front',
              'border-2',
              tile.letter
                ? 'border-gray-400 dark:border-zinc-500'
                : 'border-gray-300 dark:border-zinc-600',
              tile.state && 'rotate-x-180',
            ]"
            :style="{ transitionDelay: `${index * 300}ms` }"
          >
            {{ tile.letter }}
          </div>
          <div
            :class="[
              'tile-back',
              tile.state ? 'rotate-x-0' : 'rotate-x-180',
              tile.state === 'correct' &&
                'outline outline-2 outline-current -outline-offset-4',
              tile.state,
              success &&
                state.currentRowIndex === rowIndex &&
                'animate-[jump] animate-duration-500ms',
            ]"
            :style="{
              transitionDelay: `${index * 300}ms`,
              animationDelay: `${index * 100}ms`,
            }"
          >
            {{ tile.letter }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <GameKeyboard
    class="-mx-3 sm:mx-0"
    :letter-states="state.letterStates"
    :umlauts="true"
    @key="onKey"
  />

  <AppMessage :is-open="!!message" :size="state.gameOver ? 'large' : 'default'">
    <h2
      :class="[
        state.gameOver
          ? 'hyphenate text-2xl leading-tight text-amber-700 font-heading tracking-wide'
          : 'text-sm font-600 truncate',
      ]"
    >
      {{ message }}
    </h2>

    <template v-if="state.gameOver">
      <pre v-show="success" class="text-2xl leading-none">{{ grid }}</pre>

      <p class="whitespace-nowrap">
        <span class="text-gray-500">Nächste Runde in</span>
        {{ " " }}
        <span v-show="countdown.hours > 0" class="font-semibold">
          {{ countdown.hours }}&thinsp;h
        </span>
        <span class="font-semibold">{{ countdown.minutes }}&thinsp;min</span>
      </p>

      <button
        v-show="success && (isShareSupported || isClipboardSupported)"
        class="button w-full py-3 space-x-2"
        @click="isShareSupported ? share({ text: shareText }) : copy(shareText)"
      >
        <template v-if="isShareSupported">
          <TeenyiconsShareSolid />
          <span>{{ t("actions.share") }}</span>
        </template>
        <template v-else>
          <TeenyiconsDocumentsSolid v-show="!copied" />
          <span>{{ !copied ? t("actions.copy") : t("actions.copied") }}</span>
        </template>
      </button>
    </template>
  </AppMessage>
</template>

<style scoped>
.tile-front,
.tile-back {
  @apply absolute inset-0 inline-flex justify-center items-center transition-transform-600 backface-hidden;
}
</style>
