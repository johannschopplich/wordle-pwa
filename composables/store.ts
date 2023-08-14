import { klona } from 'klona'
import { DEFAULT_BOARD_STATE } from '~/constants'

// Set up persistent data
const state = useLocalStorage('app.state', klona(DEFAULT_BOARD_STATE))

const now = useNow()
const tomorrow = useLocalStorage<Date>('app.next', getTomorrow(now.value), {
  serializer: {
    read: (v) => new Date(v),
    write: (v) => v.toISOString(),
  },
})

// Count down to next play day
const countdown = computed(() => {
  const diff = tomorrow.value.getTime() - now.value.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  return {
    hours,
    minutes,
  }
})

// Reset the app when tomorrow is already reached
async function tryReset() {
  if (now.value.getTime() > tomorrow.value.getTime()) {
    // Reset board state to initialize a new game
    state.value = klona(DEFAULT_BOARD_STATE)

    // Reset tomorrow date, which also re-renders the board component
    tomorrow.value = getTomorrow(now.value)
  }
}

export function useWordle() {
  return {
    state,
    now,
    tomorrow,
    countdown,
    tryReset,
  }
}

function getTomorrow(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
}
