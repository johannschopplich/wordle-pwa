import { klona } from 'klona'
import { DEFAULT_BOARD_STATE } from '~/constants'

const [useProvideWordleStore, _useWordleStore] = createInjectionState(() => {
  const state = useLocalStorage('app.state', klona(DEFAULT_BOARD_STATE))

  const tomorrow = useLocalStorage('app.next', getTomorrow(new Date()), {
    serializer: {
      read: (v) => new Date(v),
      write: (v) => v.toISOString(),
    },
  })

  // Reset the app when tomorrow is already reached
  async function tryReset() {
    const now = new Date()
    if (now.getTime() > tomorrow.value.getTime()) {
      // Reset board state to initialize a new game
      state.value = klona(DEFAULT_BOARD_STATE)

      // Reset tomorrow date, which also re-renders the board component
      tomorrow.value = getTomorrow(now)
    }
  }

  return {
    state,
    tomorrow,
    tryReset,
  }
})

function useWordleStore() {
  const store = _useWordleStore()
  if (!store)
    throw new Error(
      'Initialize the store by calling "useProvideWordleStore" first',
    )
  return store
}

export { useProvideWordleStore, useWordleStore }

function getTomorrow(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
}
