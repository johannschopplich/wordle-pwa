const DEFAULT_STARTS_AT = new Date(`${new Date().getFullYear()}-01-01`)
const DEFAULT_MESSAGE = 'Using word of the day instead.'
const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24

const answerProviders = new Map<'env' | 'googleSheets', string[]>()

export async function useAllWords() {
  // Auto-load allowed guesses
  const modules = import.meta.glob<{ default: string[] }>(
    '../data/allowedGuesses/*.json',
  )
  const allowedGuesses = await Promise.all(
    Object.values(modules).flatMap(async (mod) => {
      const { default: answers } = await mod()
      return answers
    }),
  )

  const words = [
    ...getAnswersFromEnv(),
    ...(await getAnswersFromGoogleSheets()),
  ]

  if (!words.length) {
    words.push(...(await getDefaultAnswers()))
  }

  const dedupedWords = Array.from(new Set([...words, ...allowedGuesses.flat()]))

  const sanitizedWords = dedupedWords.map(removeAccents)

  return sanitizedWords
}

export async function useWordOfTheDay() {
  if (import.meta.client && window.location.search) {
    try {
      const query = atob(location.search.slice(1))
      if (query.length !== 5) {
        // eslint-disable-next-line no-alert
        alert(`Incorrect word length from encoded query. ${DEFAULT_MESSAGE}`)
      } else {
        return removeAccents(query.toLowerCase())
      }
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(`Malformed encoded word query. ${DEFAULT_MESSAGE}`)
    }
  }

  let start = DEFAULT_STARTS_AT
  const { startsAt } = useAppConfig()

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

  const answersFromGoogleSheets = await getAnswersFromGoogleSheets()
  if (answersFromGoogleSheets.length) {
    word = getWordFromList(answersFromGoogleSheets, start)
  }

  if (!word) {
    const defaultAnswers = await getDefaultAnswers()
    word = getWordFromList(defaultAnswers, start)
  }

  return removeAccents(word)
}

async function getDefaultAnswers() {
  const { default: answers } = await import('~/data/answers.json')
  return answers
}

function getAnswersFromEnv() {
  const { answers } = useRuntimeConfig().public

  let result = answerProviders.get('env')

  if (!result) {
    result = answers?.split(',').map((i) => i.toLowerCase()) ?? []
    answerProviders.set('env', result)
  }

  return result
}

async function getAnswersFromGoogleSheets() {
  let result = answerProviders.get('googleSheets')

  if (!result) {
    const values = (await useGoogleSheetsConfig())?.['Wort des Tages'] ?? []
    result = values
      .filter((i): i is string => Boolean(i))
      .map((i) => i.toLowerCase())
    answerProviders.set('googleSheets', result)
  }

  return result
}

function getWordFromList(answers: string[], start: Date) {
  // Convert timezone offset from minutes to milliseconds
  const timezoneOffset = start.getTimezoneOffset() * 60 * 1000
  const localStart = new Date(start.getTime() + timezoneOffset)
  const diff = Date.now() - localStart.getTime()
  const day = Math.floor(diff / MILLISECONDS_IN_A_DAY)
  const index = day % answers.length

  return answers[index]
}
