import { useNow, useStorage } from "@vueuse/core";
import { LetterState } from "~/types";

const DEFAULT_BOARD_STATE = {
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
};

// Set up persistent data
export const state = useStorage("app.state", { ...DEFAULT_BOARD_STATE });

export const now = useNow();
export const tomorrow = useStorage<Date>(
  "app.next",
  getTomorrow(now.value),
  undefined,
  {
    serializer: {
      read: (v) => new Date(v),
      write: (v) => v.toISOString(),
    },
  }
);

// Count down to next play day
export const countdown = $computed(() => {
  const diff = tomorrow.value.getTime() - now.value.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return `${pad(hours)}:${pad(minutes)}`;
});

// Reset the app when tomorrow is already reached
export function tryReset() {
  if (now.value.getTime() > tomorrow.value.getTime()) {
    console.log(DEFAULT_BOARD_STATE);
    // Reset board state to initialize a new game
    Object.assign(state.value, DEFAULT_BOARD_STATE);

    // Rest tomorrow date, which also re-renders the board component
    tomorrow.value = getTomorrow(now.value);
  }
}

function pad(n: number) {
  return n < 10 ? "0" + n : n;
}

function getTomorrow(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
}
