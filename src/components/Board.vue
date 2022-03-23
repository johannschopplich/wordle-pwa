<script setup lang="ts">
import {
  promiseTimeout,
  useEventListener,
  useShare,
  useStorage,
} from "@vueuse/core";
import { getWordOfTheDay, getAllWords } from "~/logic/words";
import { icons } from "~/data/result";
import { useI18n } from "~/logic/i18n";
import { LetterState } from "~/types";

// Destructure the translation helper
const { t } = useI18n();

// Get word of the day
const answer = getWordOfTheDay();

// Lazily load all words
let allWords: string[] = [];
(async () => (allWords = await getAllWords()))();

// Set up persistent data
const state = useStorage("app.state", {
  // Board state. Each tile is represented as { letter, state }
  board: Array.from({ length: 6 }, () =>
    Array.from({ length: 5 }, () => ({
      letter: "",
      state: LetterState.INITIAL,
    }))
  ),

  // Current active row index
  currentRowIndex: 0,

  // Keep track of revealed letters for the virtual keyboard
  letterStates: {} as Record<string, LetterState>,

  // Indicates if the game is over
  gameOver: false,
});

// Current active row
const currentRow = $computed(
  () => state.value.board[state.value.currentRowIndex]
);

// Feedback state: message and shake
let message = $ref("");
let grid = $ref("");
let shakeRowIndex = $ref(-1);
let success = $ref(false);

// Handle keyboard input
let allowInput = true;

useEventListener(window, "keyup", (e: KeyboardEvent) => onKey(e.key));

const { share, isSupported } = useShare();

function onKey(key: string) {
  if (state.value.gameOver) {
    completeRow();
    return;
  }

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
    showMessage(t("alerts.notEnoughLetters"));
    return;
  }

  const guess = currentRow.map((tile) => tile.letter).join("");
  if (!allWords.includes(guess) && guess !== answer) {
    shake();
    showMessage(t("alerts.notInWordList"));
    return;
  }

  const answerLetters: (string | null)[] = answer.split("");

  // First pass: mark correct ones
  currentRow.forEach((tile, i) => {
    if (answerLetters[i] === tile.letter) {
      tile.state = state.value.letterStates[tile.letter] = LetterState.CORRECT;
      answerLetters[i] = null;
    }
  });

  // Second pass: mark the present
  currentRow.forEach((tile) => {
    if (!tile.state && answerLetters.includes(tile.letter)) {
      tile.state = LetterState.PRESENT;
      answerLetters[answerLetters.indexOf(tile.letter)] = null;
      if (!state.value.letterStates[tile.letter]) {
        state.value.letterStates[tile.letter] = LetterState.PRESENT;
      }
    }
  });

  // 3rd pass: mark absent
  currentRow.forEach((tile) => {
    if (!tile.state) {
      tile.state = LetterState.ABSENT;
      if (!state.value.letterStates[tile.letter]) {
        state.value.letterStates[tile.letter] = LetterState.ABSENT;
      }
    }
  });

  allowInput = false;
  if (currentRow.every((tile) => tile.state === LetterState.CORRECT)) {
    // Yay!
    await promiseTimeout(state.value.gameOver ? 0 : 1600);
    grid = genResultGrid();
    success = state.value.gameOver = true;
    // Wait for jump animation to almost finish (1000ms)
    await promiseTimeout(900);
    showMessage(t(`successMessages.${state.value.currentRowIndex}`), -1);
  } else if (state.value.currentRowIndex < state.value.board.length - 1) {
    // Go the next row
    state.value.currentRowIndex++;
    await promiseTimeout(1600);
    allowInput = true;
  } else {
    // Game over :(
    await promiseTimeout(state.value.gameOver ? 0 : 1600);
    state.value.gameOver = true;
    showMessage(answer.toUpperCase(), -1);
  }
}

function showMessage(msg: string, time = 1250) {
  message = msg;
  if (time > 0) {
    setTimeout(() => {
      message = "";
    }, time);
  }
}

async function shake() {
  shakeRowIndex = state.value.currentRowIndex;
  await promiseTimeout(1000);
  shakeRowIndex = -1;
}

function genResultGrid() {
  return state.value.board
    .slice(0, state.value.currentRowIndex + 1)
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

  <Keyboard
    class="-mx-3 sm:mx-0"
    :letter-states="state.letterStates"
    :umlauts="true"
    @key="onKey"
  />

  <Message :is-open="!!message" :size="success ? 'large' : 'default'">
    <p :class="['font-600 truncate', success ? 'text-xl' : 'text-sm']">
      {{ message }}
    </p>
    <pre v-if="grid" class="text-2xl">{{ grid }}</pre>
    <button
      v-show="success && isSupported"
      class="button"
      @click="share({ text: grid })"
    >
      <TeenyiconsMessageTextAltSolid class="mr-2" />
      Ergebnis teilen
    </button>
  </Message>
</template>

<style>
.correct {
  @apply !bg-lime-600 !text-white;
}

.present {
  @apply !bg-yellow-500;
}

.absent {
  @apply !bg-gray-500 !text-white;
}

.tile-front,
.tile-back {
  @apply absolute inset-0 inline-flex justify-center items-center transition-transform-600 backface-hidden;
}

@keyframes zoom {
  0% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes shake {
  0% {
    transform: translate(1px);
  }
  10% {
    transform: translate(-2px);
  }
  20% {
    transform: translate(2px);
  }
  30% {
    transform: translate(-2px);
  }
  40% {
    transform: translate(2px);
  }
  50% {
    transform: translate(-2px);
  }
  60% {
    transform: translate(2px);
  }
  70% {
    transform: translate(-2px);
  }
  80% {
    transform: translate(2px);
  }
  90% {
    transform: translate(-2px);
  }
  100% {
    transform: translate(1px);
  }
}

@keyframes jump {
  0% {
    transform: translateY(0px);
  }
  20% {
    transform: translateY(5px);
  }
  60% {
    transform: translateY(-25px);
  }
  90% {
    transform: translateY(3px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
