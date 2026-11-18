export default defineAppConfig({
  ui: {
    colors: {
      // Tên phải khớp chính xác biến màu khai báo trong assets/css/main.css
      // (--color-marian-blue-*, --color-vatican-gold-*), nếu không Nuxt UI không
      // sinh được --ui-primary/--ui-secondary và nút/badge mất màu.
      primary: 'marian-blue',
      secondary: 'vatican-gold',
      neutral: 'stone',
      success: 'green',
      warning: 'amber',
      error: 'red'
    }
  }
})
