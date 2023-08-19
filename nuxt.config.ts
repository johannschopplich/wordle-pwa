export default defineNuxtConfig({
  modules: [
    '@leanera/nuxt-i18n',
    '@unocss/nuxt',
    '@vueuse/nuxt',
    'nuxt-api-party',
  ],

  $production: {
    routeRules: {
      '/manifest.webmanifest': { swr: 3600 },
    },
  },

  appConfig: {
    title: process.env.NUXT_PUBLIC_TITLE || 'Wortspiel',
    themeColor: process.env.NUXT_PUBLIC_THEME_COLOR || '#f59e0b',
    /** @default First day of the year */
    startsAt:
      process.env.NUXT_PUBLIC_STARTS_AT || `${new Date().getFullYear()}-01-01`,
  },

  runtimeConfig: {
    google: {
      apiKey: '',
    },

    public: {
      // title: '',
      // themeColor: '',
      answers: '',
      google: {
        sheetsId: '',
        sheetsTable: '',
      },
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
