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
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:5000',
      adminBase: process.env.NUXT_PUBLIC_ADMIN_BASE || 'http://localhost:3000'
    }
  },

  routeRules: {
    '/': { prerender: true },
    // Các đường dẫn cũ (trước khi hợp nhất trang) chuyển hướng vĩnh viễn để liên kết đã chia sẻ không chết.
    '/news': { redirect: { to: '/tin-tuc', statusCode: 301 } },
    '/library': { redirect: { to: '/thu-vien', statusCode: 301 } },
    '/leadership': { redirect: { to: '/ban-huynh-truong', statusCode: 301 } },
    '/liturgical': { redirect: { to: '/lich-phung-vu', statusCode: 301 } },
    // Các khu vực cần đăng nhập phải dựng ở client: khi render ở server, middleware
    // không có cookie phiên nên luôn coi là chưa đăng nhập và đá về /dang-nhap
    // (F5 hay mở thẳng link /admin đều bị đẩy ra).
    '/admin/**': { ssr: false },
    '/phu-huynh': { ssr: false },
    '/phu-huynh/**': { ssr: false },
    '/ban-huynh-truong': { ssr: false },
    '/doi-mat-khau-lan-dau': { ssr: false }
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
  },

  // @pinia/nuxt chỉ quét <srcDir>/stores của app hiện tại, không quét store trong layer,
  // nên phải khai báo tường minh để useSessionStore() auto-import hoạt động.
  pinia: {
    storesDirs: ['stores', '../layer/app/stores']
  }
})
