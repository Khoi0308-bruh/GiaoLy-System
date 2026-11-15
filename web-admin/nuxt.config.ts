// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['../layer'],
  ssr: false,

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/google-fonts'
  ],

  devtools: {
    enabled: true
  },

  // @pinia/nuxt chỉ quét <srcDir>/stores của app hiện tại, không quét store trong layer,
  // nên phải khai báo tường minh để useSessionStore() auto-import hoạt động.
  pinia: {
    storesDirs: ['stores', '../layer/app/stores']
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiBase: (globalThis as unknown as { process?: { env?: Record<string, string> } }).process?.env?.NUXT_PUBLIC_API_BASE || 'http://localhost:5000' // Có giá trị mặc định tránh lỗi relative URL
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
