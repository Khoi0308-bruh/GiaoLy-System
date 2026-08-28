// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/google-fonts'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:5000' // Có giá trị mặc định tránh lỗi relative URL
    }
  },


  compatibilityDate: '2025-01-15',

  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'isomorphic-dompurify'
      ]
    }
  },

  eslint: {
    config: {
      stylistic: {
        braceStyle: '1tbs',
        commaDangle: 'never'
      }
    }
  },
  googleFonts: {
    families: {
      'Inter': [400, 500, 600, 700],
      'Merriweather': [300, 400, 700, 900]
    },
    display: 'swap',
    prefetch: true,
    preconnect: true,
    preload: true
  }
})
