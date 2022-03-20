<script setup lang="ts">
import { onUnmounted } from "vue";
import { useShare } from "@vueuse/core";
import { getWordOfTheDay, allWords } from "~/logic/words";
import { icons } from "~/data/result";
import { notEnoughLetters, notInWordList, successMessages } from "~/i18n";
import { LetterState } from "~/types";

const { share, isSupported } = useShare();

// Get word of the day
const answer = getWordOfTheDay();

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

function completeRow() {
  if (currentRow.every((tile) => tile.letter)) {
    const guess = currentRow.map((tile) => tile.letter).join("");
    if (!allWords.includes(guess) && guess !== answer) {
      shake();
      showMessage(notInWordList);
      return;
    }

    const answerLetters: (string | null)[] = answer.split("");

    // first pass: mark correct ones
    currentRow.forEach((tile, i) => {
      if (answerLetters[i] === tile.letter) {
        tile.state = letterStates[tile.letter] = LetterState.CORRECT;
        answerLetters[i] = null;
      }
    });

    // second pass: mark the present
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
      // yay!
      setTimeout(() => {
        grid = genResultGrid();
        showMessage(successMessages[currentRowIndex], -1);
        success = true;
      }, 1600);
    } else if (currentRowIndex < board.length - 1) {
      // go the next row
      currentRowIndex++;
      setTimeout(() => {
        allowInput = true;
      }, 1600);
    } else {
      // game over :(
      setTimeout(() => {
        showMessage(answer.toUpperCase(), -1);
      }, 1600);
    }
  } else {
    shake();
    showMessage(notEnoughLetters);
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

function shake() {
  shakeRowIndex = currentRowIndex;
  setTimeout(() => {
    shakeRowIndex = -1;
  }, 1000);
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
    <header class="bg-sky-50 text-sky-600 px-4 py-2 rounded-lg">
      <h1 class="text-2xl font-600">🐰 Osterwortsuche</h1>
    </header>

    <div class="flex justify-center items-center">
      <div
        class="w-$width h-$height grid grid-rows-6 gap-2 mx-auto"
        style="
          --height: min(420px, calc(100 * var(--vh, 1vh) - 310px));
          --width: min(350px, calc(var(--height) / 6 * 5));
        "
      >
        <div
          v-for="(row, boardIndex) in board"
          :key="boardIndex"
          :class="[
            'grid grid-cols-5 gap-2',
            shakeRowIndex === boardIndex && 'shake',
            success && currentRowIndex === boardIndex && 'jump',
          ]"
        >
          <div
            v-for="(tile, index) in row"
            :key="index"
            :class="[
              'w-full relative text-size-4xl leading-3xl align-middle font-700 uppercase select-none',
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

    <Keyboard :letter-states="letterStates" @key="onKey" />
  </div>

  <Transition>
    <div
      v-if="message"
      :class="[
        'message',
        'absolute left-1/2 bg-opacity-95 shadow-lg -translate-x-1/2 transition-opacity-250 z-10',
        success
          ? 'top-20 bg-white p-6 rounded-xl'
          : 'top-10 bg-gray-800 text-white px-4 py-2 rounded-full',
      ]"
    >
      <div class="space-y-2xl text-center">
        <p :class="['font-600 truncate', success && 'text-xl']">
          {{ message }}
        </p>
        <pre v-if="grid" class="text-2xl">{{ grid }}</pre>
        <button
          v-show="isSupported"
          class="button"
          @click="share({ text: grid })"
        >
          Ergebnis teilen
        </button>
      </div>
    </div>
  </Transition>

  <div
    v-if="message && success"
    class="absolute inset-0 bg-gray-800 bg-opacity-50 transition-opacity-250"
  />
</template>

<style scoped>
.message.v-leave-to {
  opacity: 0;
}

.tile-front,
.tile-back {
  @apply absolute inset-0 inline-flex justify-center items-center transition-transform-600 backface-hidden;
}

.shake {
  animation: shake 0.5s;
}

.jump .tile-back {
  animation: jump 0.5s;
}
</style>
