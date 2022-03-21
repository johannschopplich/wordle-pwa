<script setup lang="ts">
import { onUnmounted } from "vue";
import { promiseTimeout, useShare } from "@vueuse/core";
import { getWordOfTheDay, getAllWords } from "~/logic/words";
import { icons } from "~/data/result";
import { notEnoughLetters, notInWordList, successMessages } from "~/i18n";
import { LetterState } from "~/types";

// Get word of the day
const answer = getWordOfTheDay();

// Lazily load all words
let allWords: string[] = [];
(async () => (allWords = await getAllWords()))();

// Board state. Each tile is represented as { letter, state }
const board = $ref(
  Array.from({ length: 6 }, () =>
    Array.from({ length: 5 }, () => ({
      letter: "",
      state: LetterState.INITIAL,
    }))
  )
);

// Current active row
let currentRowIndex = $ref(0);
const currentRow = $computed(() => board[currentRowIndex]);

// Feedback state: message and shake
let message = $ref("");
let grid = $ref("");
let shakeRowIndex = $ref(-1);
let success = $ref(false);

// Keep track of revealed letters for the virtual keyboard
const letterStates: Record<string, LetterState> = $ref({});

// Handle keyboard input
let allowInput = true;

const onKeyup = (e: KeyboardEvent) => onKey(e.key);

window.addEventListener("keyup", onKeyup);

onUnmounted(() => {
  window.removeEventListener("keyup", onKeyup);
});

const { share, isSupported } = useShare();

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
    showMessage(notEnoughLetters);
    return;
  }

  const guess = currentRow.map((tile) => tile.letter).join("");
  if (!allWords.includes(guess) && guess !== answer) {
    shake();
    showMessage(notInWordList);
    return;
  }

  const answerLetters: (string | null)[] = answer.split("");

  // First pass: mark correct ones
  currentRow.forEach((tile, i) => {
    if (answerLetters[i] === tile.letter) {
      tile.state = letterStates[tile.letter] = LetterState.CORRECT;
      answerLetters[i] = null;
    }
  });

  // Second pass: mark the present
  currentRow.forEach((tile) => {
    if (!tile.state && answerLetters.includes(tile.letter)) {
      tile.state = LetterState.PRESENT;
      answerLetters[answerLetters.indexOf(tile.letter)] = null;
      if (!letterStates[tile.letter]) {
        letterStates[tile.letter] = LetterState.PRESENT;
      }
    }
  });

  // 3rd pass: mark absent
  currentRow.forEach((tile) => {
    if (!tile.state) {
      tile.state = LetterState.ABSENT;
      if (!letterStates[tile.letter]) {
        letterStates[tile.letter] = LetterState.ABSENT;
      }
    }
  });

  allowInput = false;
  if (currentRow.every((tile) => tile.state === LetterState.CORRECT)) {
    // Yay!
    await promiseTimeout(1600);
    grid = genResultGrid();
    success = true;
    // Wait for jump animation to finish
    await promiseTimeout(1000);
    showMessage(successMessages[currentRowIndex], -1);
  } else if (currentRowIndex < board.length - 1) {
    // Go the next row
    currentRowIndex++;
    await promiseTimeout(1600);
    allowInput = true;
  } else {
    // Game over :(
    await promiseTimeout(1600);
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
  shakeRowIndex = currentRowIndex;
  await promiseTimeout(1000);
  shakeRowIndex = -1;
}

function genResultGrid() {
  return board
    .slice(0, currentRowIndex + 1)
    .map((row) => row.map((tile) => icons[tile.state]).join(""))
    .join("\n");
}
</script>

<template>
  <div class="h-full grid grid-rows-[auto_1fr_auto] gap-4 children:min-w-0">
    <header class="bg-stone-100 px-4 py-2 rounded-lg">
      <div class="text-2xl flex justify-between">
        <h1 class="text-amber-700 font-heading tracking-wide">
          Osterwortsuche
        </h1>
        <span>🐰</span>
      </div>
      <p class="-mt-1 text-stone-400 text-xs font-500 uppercase">
        Jeden Tag ein Wort
      </p>
    </header>

    <div class="flex justify-center items-center">
      <div
        class="w-$width h-$height grid grid-rows-6 gap-2 mx-auto"
        style="
          --height: min(26rem, calc(var(--h-screen) - 20rem));
          --width: calc(var(--height) / 6 * 5);
        "
      >
        <div
          v-for="(row, boardIndex) in board"
          :key="boardIndex"
          :class="[
            'grid grid-cols-5 gap-2',
            shakeRowIndex === boardIndex &&
              'animate-[shake] animate-duration-500ms',
          ]"
        >
          <div
            v-for="(tile, index) in row"
            :key="index"
            :class="[
              'w-full relative text-4xl align-middle font-700 uppercase select-none',
              tile.letter && 'animate-[zoom] animate-duration-200ms',
            ]"
          >
            <div
              :class="[
                'tile-front',
                'border-2 border-gray-300',
                tile.letter && 'border-gray-400',
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
                  currentRowIndex === boardIndex &&
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
      :letter-states="letterStates"
      :umlauts="true"
      @key="onKey"
    />
  </div>

  <Message :is-open="!!message" :size="success ? 'large' : 'default'">
    <p :class="['font-600 truncate', success && 'text-xl']">
      {{ message }}
    </p>
    <pre v-if="grid" class="text-2xl">{{ grid }}</pre>
    <button
      v-show="success && isSupported"
      class="button"
      @click="share({ text: grid })"
    >
      Ergebnis teilen
    </button>
  </Message>
</template>

<style scoped>
.tile-front,
.tile-back {
  @apply absolute inset-0 inline-flex justify-center items-center transition-transform-600 backface-hidden;
}
</style>
