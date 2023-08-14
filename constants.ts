export const LETTER_STATES: Record<string, string> = {
  INITIAL: '',
  CORRECT: 'correct',
  PRESENT: 'present',
  ABSENT: 'absent',
}

export const LETTER_ICONS = {
  [LETTER_STATES.CORRECT]: '🟩',
  [LETTER_STATES.PRESENT]: '🟨',
  [LETTER_STATES.ABSENT]: '⬛️',
  [LETTER_STATES.INITIAL]: null,
}

export const DEFAULT_BOARD_STATE = {
  // Board state. Each tile is represented as { letter, state }
  board: Array.from({ length: 6 }, () =>
    Array.from({ length: 5 }, () => ({
      letter: '',
      state: LETTER_STATES.INITIAL,
    })),
  ),

  // Current active row index
  currentRowIndex: 0,

  // Keep track of revealed letters for the virtual keyboard
  letterStates: {} as typeof LETTER_STATES,

  // Indicates if the game is over
  gameOver: false,
}
