export default defineNuxtConfig({
  modules: [
    '@unocss/nuxt',
    '@leanera/nuxt-i18n',
    '@vueuse/nuxt',
    'nuxt-api-party',
  ],

  runtimeConfig: {
    google: {
      apiKey: '',
    },

    public: {
      appName: 'Wortspiel',
      startsAt: '',
      answers: '',
      googleSheetsId: '',
      googleSheetsTable: '',
    },
  },

  apiParty: {
    endpoints: {
      sheets: {
        url: 'https://sheets.googleapis.com/v4/spreadsheets',
        query: {
          key: process.env.NUXT_GOOGLE_API_KEY,
        },
      },
    },
  },

  unocss: {
    preflight: true,
  },

  i18n: {
    defaultLocale: 'de',
    locales: ['de'],
    langImports: true,
    lazy: true,
    strategy: 'no_prefix',
  },

  experimental: {
    payloadExtraction: true,
    inlineSSRStyles: false,
  },

  typescript: {
    typeCheck: 'build',
    shim: false,
    tsConfig: {
      compilerOptions: {
        moduleResolution: 'bundler',
      },
    },
  },
})
