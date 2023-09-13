<script setup lang="ts">
import { promiseTimeout } from '@vueuse/core'
import { LETTER_ICONS, LETTER_STATES } from '~/constants'

// Use the wordle store
const { state, tomorrow } = useWordleStore()

// Get the translation helper
const { t } = useI18n()

// Word of the day
let answer: string = ''

// All possible words
let allWords: string[] = []

// Current active row
const currentRow = computed(
  () => state.value.board[state.value.currentRowIndex],
)

// Feedback state: message and shake
const message = ref('')
const grid = ref('')
const shakeRowIndex = ref(-1)
const success = ref(false)

// Count down to next play day
const now = useNow()
const countdown = computed(() => {
  const diff = tomorrow.value.getTime() - now.value.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  return {
    hours,
    minutes,
  }
})

// Handle keyboard input
let allowInput = true

// Share board grid as text
const shareText = ref('')
const isMobile = process.client ? matchMedia('(hover: none)').matches : false
const { share, isSupported: isShareSupported } = useShare()
const { copy, copied, isSupported: isClipboardSupported } = useClipboard()

// Re-render when state has been read from localStorage,
// otherwise classes won't be hydrated correctly
const forceRenderKey = ref(0)

onMounted(async () => {
  forceRenderKey.value++

  useEventListener(window, 'keyup', (event) => onKey(event.key))

  // Lazily retrieve word/answers
  answer = await useWordOfTheDay()
  allWords = await useAllWords()

  // Handle already guessed word of the day
  if (state.value.gameOver) {
    allowInput = false
    completeRow()
  }
})

function onKey(key: string) {
  if (!allowInput) return
  if (/^[\p{Letter}\p{Mark}]$/u.test(key)) {
    fillTile(key.toLowerCase())
  } else if (key === 'Backspace') {
    clearTile()
  } else if (key === 'Enter') {
    completeRow()
  }
}

function fillTile(letter: string) {
  for (const tile of currentRow.value) {
    if (!tile.letter) {
      tile.letter = letter
      break
    }
  }
}

function clearTile() {
  for (const tile of [...currentRow.value].reverse()) {
    if (tile.letter) {
      tile.letter = ''
      break
    }
  }
}

async function completeRow() {
  if (!currentRow.value.every((tile) => tile.letter)) {
    shake()
    showMessage(t('errorMessages.notEnoughLetters'))
    return
  }

  const guess = currentRow.value.map((tile) => tile.letter).join('')
  if (!allWords.includes(guess) && guess !== answer) {
    shake()
    showMessage(t('errorMessages.notInWordList'))
    return
  }

  const answerLetters: (string | null)[] = answer.split('')

  // First pass: mark correct ones
  currentRow.value.forEach((tile, i) => {
    if (answerLetters[i] === tile.letter) {
      tile.state = state.value.letterStates[tile.letter] = LETTER_STATES.CORRECT
      answerLetters[i] = null
    }
  })

  // Second pass: mark the present
  currentRow.value.forEach((tile) => {
    if (!tile.state && answerLetters.includes(tile.letter)) {
      tile.state = LETTER_STATES.PRESENT
      answerLetters[answerLetters.indexOf(tile.letter)] = null
      if (!state.value.letterStates[tile.letter]) {
        state.value.letterStates[tile.letter] = LETTER_STATES.PRESENT
      }
    }
  })

  // 3rd pass: mark absent
  currentRow.value.forEach((tile) => {
    if (!tile.state) {
      tile.state = LETTER_STATES.ABSENT
      if (!state.value.letterStates[tile.letter]) {
        state.value.letterStates[tile.letter] = LETTER_STATES.ABSENT
      }
    }
  })

  allowInput = false
  if (!state.value.gameOver) await promiseTimeout(1600)

  if (currentRow.value.every((tile) => tile.state === LETTER_STATES.CORRECT)) {
    // Yay!
    grid.value = genResultGrid()
    shareText.value = `${new Date().toLocaleDateString('de-DE')}\n${grid.value}`
    success.value = state.value.gameOver = true
    // Wait for jump animation to almost finish (1000ms)
    await promiseTimeout(900)
    showMessage(t(`successMessages[${state.value.currentRowIndex}]`), -1)
  } else if (state.value.currentRowIndex < state.value.board.length - 1) {
    // Go the next row
    state.value.currentRowIndex++
    allowInput = true
  } else {
    // Game over :(
    state.value.gameOver = true
    showMessage(
      t('errorMessages.notFound', { label: answer.toUpperCase() }),
      -1,
    )
  }
}

async function showMessage(msg: string, time = 1250) {
  message.value = msg
  if (time > 0) {
    await promiseTimeout(time)
    message.value = ''
  }
}

async function shake() {
  shakeRowIndex.value = state.value.currentRowIndex
  await promiseTimeout(1000)
  shakeRowIndex.value = -1
}

function genResultGrid() {
  return state.value.board
    .slice(0, state.value.currentRowIndex + 1)
    .map((row) => row.map((tile) => LETTER_ICONS[tile.state]).join(''))
    .join('\n')
}
</script>

<template>
  <div class="flex items-center justify-center">
    <div
      :key="forceRenderKey"
      class="grid grid-rows-6 mx-auto h-$height w-$width gap-2"
      style="
        --height: clamp(12rem, 50svh, 26rem);
        --width: calc(var(--height) / 6 * 5);
      "
    >
      <div
        v-for="(row, rowIndex) in state.board"
        :key="rowIndex"
        class="grid grid-cols-5 gap-2"
        :class="[
          shakeRowIndex === rowIndex &&
            'animate-duration-500ms animate-[shake]',
        ]"
      >
        <div
          v-for="(tile, index) in row"
          :key="index"
          class="relative w-full select-none text-size-$size font-700 uppercase"
          :class="[tile.letter && 'animate-duration-200ms animate-[zoom]']"
          style="--size: calc(var(--height) * 0.1)"
        >
          <div
            class="tile-front border-2"
            :class="[
              tile.letter
                ? 'border-gray-400 dark:border-zinc-500'
                : 'border-gray-300 dark:border-zinc-600',
              tile.state && 'rotate-x-180',
            ]"
            :style="{ transitionDelay: `${index * 300}ms` }"
          >
            <ClientOnly>
              {{ tile.letter }}
            </ClientOnly>
          </div>
          <div
            :class="[
              'tile-back',
              tile.state ? 'rotate-x-0' : 'rotate-x-180',
              tile.state === 'correct' &&
                'outline outline-2 -outline-offset-4 outline-current',
              tile.state,
              success &&
                state.currentRowIndex === rowIndex &&
                'animate-duration-500ms animate-[jump]',
            ]"
            :style="{
              transitionDelay: `${index * 300}ms`,
              animationDelay: `${index * 100}ms`,
            }"
          >
            <ClientOnly>
              {{ tile.letter }}
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
  </div>

  <GameKeyboard
    :key="forceRenderKey"
    class="-mx-3 sm:mx-0"
    :letter-states="state.letterStates"
    @key="onKey"
  />

  <AppMessage :is-open="!!message" :size="state.gameOver ? 'large' : 'default'">
    <h2
      :class="[
        state.gameOver
          ? 'text-2xl leading-tight tracking-wide font-heading text-primary-700'
          : 'truncate text-sm font-600',
      ]"
    >
      {{ message }}
    </h2>

    <template v-if="state.gameOver">
      <pre v-show="success" class="text-2xl leading-none">{{ grid }}</pre>

      <p class="whitespace-nowrap">
        <span class="text-gray-500">Nächste Runde in</span>
        {{ ' ' }}
        <span v-show="countdown.hours > 0" class="font-semibold">
          {{ countdown.hours }}&thinsp;h
        </span>
        <span class="font-semibold">{{ countdown.minutes }}&thinsp;min</span>
      </p>

      <button
        v-show="success && (isShareSupported || isClipboardSupported)"
        class="w-full py-3 space-x-2 button"
        @click="
          isShareSupported && isMobile
            ? share({ text: shareText })
            : copy(shareText)
        "
      >
        <template v-if="isShareSupported && isMobile">
          <div class="i-teenyicons:share-solid" />
          <span>{{ t('actions.share') }}</span>
        </template>
        <template v-else>
          <div v-show="!copied" class="i-teenyicons:documents-solid" />
          <span>{{ !copied ? t('actions.copy') : t('actions.copied') }}</span>
        </template>
      </button>
    </template>
  </AppMessage>
</template>

<style scoped>
.tile-front,
.tile-back {
  --at-apply: 'transition-transform-600 backface-hidden absolute inset-0 inline-flex items-center justify-center';
  -webkit-backface-visibility: hidden;
}
</style>
