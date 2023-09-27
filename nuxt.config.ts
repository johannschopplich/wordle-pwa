export default defineNuxtConfig({
  modules: [
    '@byjohann/ui/nuxt',
    '@nuxtjs/i18n',
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
    description: process.env.NUXT_PUBLIC_DESCRIPTION || '',
    themeColor: process.env.NUXT_PUBLIC_THEME_COLOR || '#f59e0b',
    /** @default First day of the year */
    startsAt:
      process.env.NUXT_PUBLIC_STARTS_AT || `${new Date().getFullYear()}-01-01`,
  },

  runtimeConfig: {
    google: {
      apiKey: process.env.NUXT_GOOGLE_API_KEY || '',
    },

    public: {
      answers: process.env.NUXT_PUBLIC_ANSWERS || '',
      google: {
        sheetsId: process.env.NUXT_PUBLIC_GOOGLE_SHEETS_ID || '',
        sheetsTable: process.env.NUXT_PUBLIC_GOOGLE_SHEETS_TABLE || '',
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
    locales: [
      {
        code: 'de',
        file: 'de.json',
      },
    ],
    lazy: true,
    langDir: 'locales',
    strategy: 'no_prefix',
    bundle: {
      fullInstall: false,
      dropMessageCompiler: true,
    },
  },

  experimental: {
    typescriptBundlerResolution: true,
    payloadExtraction: true,
    inlineSSRStyles: false,
    headNext: true,
  },

  typescript: {
    typeCheck: 'build',
    shim: false,
  },
})
