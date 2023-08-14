import { klona } from "klona";
import { computed } from "vue";
import { useNow, useStorage } from "@vueuse/core";
import { DEFAULT_BOARD_STATE } from "~/constants";

// Set up persistent data
export const state = useStorage("app.state", klona(DEFAULT_BOARD_STATE));

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
  },
);

// Count down to next play day
export const countdown = computed(() => {
  const diff = tomorrow.value.getTime() - now.value.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return {
    hours,
    minutes,
  };
});

// Reset the app when tomorrow is already reached
export async function tryReset() {
  if (now.value.getTime() > tomorrow.value.getTime()) {
    // Reset board state to initialize a new game
    state.value = klona(DEFAULT_BOARD_STATE);

    // Reset tomorrow date, which also re-renders the board component
    tomorrow.value = getTomorrow(now.value);
  }
}

function getTomorrow(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
}
