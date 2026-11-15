// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['../layer'],
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/google-fonts'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:5000'
    }
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  googleFonts: {
    families: {
      Outfit: [300, 400, 500, 600, 700],
      Merriweather: [300, 400, 700]
    },
    display: 'swap',
    prefetch: true,
    preconnect: true,
    preload: true
  }
})
