const DEFAULT_MESSAGE = 'Using word of the day instead.'

const answerProviders = new Map<'env' | 'googleSheets', string[]>()

export async function useAllWords() {
  const { default: allowedGuesses } = await import(
    '~/data/allowedGuesses/de.json'
  )
  const words = [
    ...getAnswersFromEnv(),
    ...(await getAnswersFromGoogleSheets()),
  ]

  if (!words.length) {
    words.push(...(await getDefaultAnswers()))
  }

  return Array.from(new Set([...words, ...allowedGuesses]))
}

export async function useWordOfTheDay() {
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

  let start = new Date(`${new Date().getFullYear()}-01-01`)
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

  return word
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
    result = values.filter((i): i is string => Boolean(i))
    answerProviders.set('googleSheets', result)
  }

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
