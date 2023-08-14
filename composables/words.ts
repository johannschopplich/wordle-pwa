const DEFAULT_MESSAGE = 'Using word of the day instead.'

let answersFromEnv: string[] | undefined
let answersFromSpreadsheet: string[] | undefined
let defaultAnswers: string[] = []

export async function useAllWords() {
  const { default: allowedGuesses } = await import(
    '~/data/allowedGuesses/de.json'
  )
  const answersFromEnv = getAnswersFromEnv()
  const answersFromSpreadsheet = await getAnswersFromSpreadsheet()

  if (!answersFromEnv.length && !answersFromSpreadsheet.length) {
    const { default: answers } = await import('~/data/answers.json')
    defaultAnswers = answers
  }

  const collection = new Set([
    ...defaultAnswers,
    ...answersFromEnv,
    ...answersFromSpreadsheet,
    ...allowedGuesses,
  ])
  return Array.from(collection)
}

export async function useWordOfTheDay() {
  const { startsAt } = useRuntimeConfig().public

  if (process.client && window.location.search) {
    try {
      const query = atob(location.search.slice(1))
      if (query.length !== 5) {
        alert(`Incorrect word length from encoded query. ${DEFAULT_MESSAGE}`)
      } else {
        return query.toLowerCase()
      }
    } catch (e) {
      alert(`Malformed encoded word query. ${DEFAULT_MESSAGE}`)
    }
  }

  let start = new Date(new Date().getFullYear(), 0, 1)

  if (startsAt) {
    const date = new Date(startsAt)
    if (date.toString() === 'Invalid Date') {
      console.error('Invalid date for "startsAt" public runtime config')
    } else {
      start = date
    }
  }

  let word: string | undefined

  const answersFromEnv = getAnswersFromEnv()
  if (answersFromEnv.length) {
    word = getWordFromList(answersFromEnv, start)
  }

  const answersFromSpreadsheet = await getAnswersFromSpreadsheet()
  if (answersFromSpreadsheet.length) {
    word = getWordFromList(answersFromSpreadsheet, start)
  }

  if (!word) {
    const { default: answers } = await import('~/data/answers.json')
    word = getWordFromList(answers, start)
  }

  return word
}

export async function usePrefetchFetchableWords() {
  await getAnswersFromSpreadsheet()
}

function getAnswersFromEnv() {
  const { answers } = useRuntimeConfig().public
  answersFromEnv ??= answers?.split(',').map((i) => i.toLowerCase()) ?? []
  return answersFromEnv
}

async function getAnswersFromSpreadsheet() {
  if (answersFromSpreadsheet) return answersFromSpreadsheet

  const { googleSheetsId, googleSheetsTable } = useRuntimeConfig().public

  if (!googleSheetsId || !googleSheetsTable) return []

  const values = await getGoogleSpreadsheetValues<'Wort'>(
    googleSheetsId,
    googleSheetsTable,
  )

  const result = values.map((i) => Object.values(i)[0].toLowerCase())
  answersFromSpreadsheet = result
  return result
}

function getWordFromList(answers: string[], start: Date) {
  const diff = Date.now() - start.getTime()
  let day = Math.floor(diff / (1000 * 60 * 60 * 24))
  while (day > answers.length) {
    day -= answers.length
  }

  return answers[day]
}
