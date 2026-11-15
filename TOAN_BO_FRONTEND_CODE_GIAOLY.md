# TOÀN BỘ MÃ NGUỒN FRONTEND DỰ ÁN GIAOLY (FULL FRONTEND SOURCE CODE)
> **Dự án:** Hệ Sinh Thái Quản Lý Mục Vụ GiaoLy  
> **Kiến trúc Frontend:** Nuxt 3 (Vue 3 Composition API), Nuxt UI v3, Tailwind CSS, Pinia  
> **Cơ cấu phân hệ:** 2 Cổng độc lập: `web-admin` (Cổng Quản Trị) & `web-portal` (Cổng Công Chúng)  
> **Tổng số tệp Frontend:** 71 files  
> **Tổng số dòng lệnh (LOC):** 14.819 dòng  
> **Dung lượng mã nguồn:** 0.63 MB  
> **Thời gian tạo:** 08:35:55 4/11/2026  

---

## MỤC LỤC TOÀN BỘ CÁC TỆP FRONTEND

### 📁 web-admin (Cổng Quản Trị)

#### App & Build Config (Cấu hình) (6 files)
- [web-admin/app.config.ts](#fe-file-1) - *(10 dòng, 0.2 KB)*
- [web-admin/app.vue](#fe-file-2) - *(30 dòng, 0.7 KB)*
- [web-admin/eslint.config.mjs](#fe-file-7) - *(7 dòng, 0.1 KB)*
- [web-admin/nuxt.config.ts](#fe-file-12) - *(56 dòng, 1.0 KB)*
- [web-admin/package.json](#fe-file-13) - *(37 dòng, 0.9 KB)*
- [web-admin/tsconfig.json](#fe-file-41) - *(11 dòng, 0.3 KB)*

#### Styles & CSS (Giao diện) (1 files)
- [web-admin/assets/css/main.css](#fe-file-3) - *(342 dòng, 11.5 KB)*

#### UI Components (Dùng chung) (2 files)
- [web-admin/components/ImportWizard.vue](#fe-file-4) - *(386 dòng, 17.4 KB)*
- [web-admin/components/SafeHtml.vue](#fe-file-5) - *(53 dòng, 1.8 KB)*

#### Composables (API Hooks) (1 files)
- [web-admin/composables/useApi.ts](#fe-file-6) - *(69 dòng, 2.5 KB)*

#### I18n Locales (Đa ngôn ngữ) (2 files)
- [web-admin/i18n/locales/en.json](#fe-file-8) - *(39 dòng, 1.3 KB)*
- [web-admin/i18n/locales/vi.json](#fe-file-9) - *(39 dòng, 1.5 KB)*

#### Layouts (Khung trang) (1 files)
- [web-admin/layouts/admin.vue](#fe-file-10) - *(538 dòng, 19.1 KB)*

#### Middleware (Route Guards) (1 files)
- [web-admin/middleware/auth.global.ts](#fe-file-11) - *(46 dòng, 1.6 KB)*

#### Admin Pages (Quản trị) (15 files)
- [web-admin/pages/admin/academic-years.vue](#fe-file-14) - *(357 dòng, 19.7 KB)*
- [web-admin/pages/admin/academic-years/[id].vue](#fe-file-15) - *(408 dòng, 11.7 KB)*
- [web-admin/pages/admin/announcements.vue](#fe-file-16) - *(316 dòng, 20.1 KB)*
- [web-admin/pages/admin/classrooms/[id].vue](#fe-file-17) - *(1.071 dòng, 38.2 KB)*
- [web-admin/pages/admin/dashboard.vue](#fe-file-18) - *(955 dòng, 44.6 KB)*
- [web-admin/pages/admin/documents.vue](#fe-file-19) - *(342 dòng, 19.1 KB)*
- [web-admin/pages/admin/draft-actions.vue](#fe-file-20) - *(199 dòng, 6.8 KB)*
- [web-admin/pages/admin/leaders.vue](#fe-file-21) - *(630 dòng, 31.4 KB)*
- [web-admin/pages/admin/liturgical.vue](#fe-file-22) - *(248 dòng, 13.6 KB)*
- [web-admin/pages/admin/news/index.vue](#fe-file-23) - *(370 dòng, 13.4 KB)*
- [web-admin/pages/admin/reports.vue](#fe-file-24) - *(229 dòng, 14.8 KB)*
- [web-admin/pages/admin/roles.vue](#fe-file-25) - *(370 dòng, 17.7 KB)*
- [web-admin/pages/admin/students.vue](#fe-file-26) - *(739 dòng, 47.6 KB)*
- [web-admin/pages/admin/students/[id].vue](#fe-file-27) - *(225 dòng, 12.4 KB)*
- [web-admin/pages/admin/users.vue](#fe-file-28) - *(578 dòng, 23.3 KB)*

#### Catechist Pages (Giáo lý viên) (6 files)
- [web-admin/pages/catechist/camps.vue](#fe-file-29) - *(25 dòng, 0.9 KB)*
- [web-admin/pages/catechist/duty-roster.vue](#fe-file-30) - *(25 dòng, 0.9 KB)*
- [web-admin/pages/catechist/index.vue](#fe-file-31) - *(72 dòng, 2.3 KB)*
- [web-admin/pages/catechist/lesson-plans.vue](#fe-file-32) - *(25 dòng, 0.9 KB)*
- [web-admin/pages/catechist/sacraments.vue](#fe-file-33) - *(25 dòng, 0.9 KB)*
- [web-admin/pages/catechist/spiritual-bouquets.vue](#fe-file-34) - *(25 dòng, 0.9 KB)*

#### Portal Pages (Cổng công chúng) (3 files)
- [web-admin/pages/index.vue](#fe-file-35) - *(14 dòng, 0.2 KB)*
- [web-admin/pages/login.vue](#fe-file-36) - *(208 dòng, 8.8 KB)*
- [web-admin/pages/students/index.vue](#fe-file-39) - *(277 dòng, 14.0 KB)*

#### Profile Pages (Hồ sơ) (2 files)
- [web-admin/pages/profile/edit.vue](#fe-file-37) - *(177 dòng, 6.1 KB)*
- [web-admin/pages/profile/index.vue](#fe-file-38) - *(436 dòng, 22.3 KB)*

#### State Management (Pinia Store) (1 files)
- [web-admin/stores/auth.ts](#fe-file-40) - *(85 dòng, 3.4 KB)*

### 📁 web-portal (Cổng Công Chúng)

#### App & Build Config (Cấu hình) (7 files)
- [web-portal/app/app.config.ts](#fe-file-42) - *(11 dòng, 0.2 KB)*
- [web-portal/app/app.vue](#fe-file-43) - *(28 dòng, 0.8 KB)*
- [web-portal/eslint.config.mjs](#fe-file-67) - *(7 dòng, 0.1 KB)*
- [web-portal/nuxt.config.ts](#fe-file-68) - *(47 dòng, 0.8 KB)*
- [web-portal/package.json](#fe-file-69) - *(30 dòng, 0.7 KB)*
- [web-portal/renovate.json](#fe-file-70) - *(14 dòng, 0.2 KB)*
- [web-portal/tsconfig.json](#fe-file-71) - *(11 dòng, 0.3 KB)*

#### Styles & CSS (Giao diện) (1 files)
- [web-portal/app/assets/css/main.css](#fe-file-44) - *(350 dòng, 11.2 KB)*

#### UI Components (Dùng chung) (8 files)
- [web-portal/app/components/AppLogo.vue](#fe-file-45) - *(41 dòng, 3.2 KB)*
- [web-portal/app/components/HeroBanner.vue](#fe-file-46) - *(50 dòng, 1.6 KB)*
- [web-portal/app/components/MarqueeAnnouncement.vue](#fe-file-52) - *(27 dòng, 1.4 KB)*
- [web-portal/app/components/NewsGrid.vue](#fe-file-53) - *(87 dòng, 3.8 KB)*
- [web-portal/app/components/NoticeBoard.vue](#fe-file-54) - *(80 dòng, 3.1 KB)*
- [web-portal/app/components/PortalVerifyWidget.vue](#fe-file-55) - *(154 dòng, 5.9 KB)*
- [web-portal/app/components/ProfileCard.vue](#fe-file-56) - *(83 dòng, 2.9 KB)*
- [web-portal/app/components/TemplateMenu.vue](#fe-file-57) - *(50 dòng, 1.2 KB)*

#### Home Components (Trang chủ) (4 files)
- [web-portal/app/components/home/HeroSection.vue](#fe-file-47) - *(227 dòng, 9.4 KB)*
- [web-portal/app/components/home/NewsAndAnnouncementsSection.vue](#fe-file-48) - *(253 dòng, 11.0 KB)*
- [web-portal/app/components/home/SpiritualSection.vue](#fe-file-49) - *(219 dòng, 9.6 KB)*
- [web-portal/app/components/home/TenCommandmentsSection.vue](#fe-file-50) - *(200 dòng, 8.7 KB)*

#### Layout Components (1 files)
- [web-portal/app/components/layout/FooterSection.vue](#fe-file-51) - *(185 dòng, 7.5 KB)*

#### Layouts (Khung trang) (1 files)
- [web-portal/app/layouts/default.vue](#fe-file-58) - *(363 dòng, 16.0 KB)*

#### Portal Pages (Cổng công chúng) (7 files)
- [web-portal/app/pages/index.vue](#fe-file-59) - *(99 dòng, 3.9 KB)*
- [web-portal/app/pages/leadership.vue](#fe-file-60) - *(512 dòng, 28.3 KB)*
- [web-portal/app/pages/library.vue](#fe-file-61) - *(536 dòng, 22.9 KB)*
- [web-portal/app/pages/liturgical.vue](#fe-file-62) - *(126 dòng, 3.7 KB)*
- [web-portal/app/pages/news.vue](#fe-file-63) - *(183 dòng, 6.2 KB)*
- [web-portal/app/pages/thong-bao.vue](#fe-file-65) - *(251 dòng, 8.9 KB)*
- [web-portal/app/pages/verify.vue](#fe-file-66) - *(247 dòng, 8.2 KB)*

#### Profile Pages (Hồ sơ) (1 files)
- [web-portal/app/pages/profile/index.vue](#fe-file-64) - *(254 dòng, 9.1 KB)*

---

## NỘI DUNG CHI TIẾT TOÀN BỘ TỆP MÃ NGUỒN FRONTEND

### <a id="fe-file-1"></a>📄 [1/71] File: `web-admin/app.config.ts`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** App & Build Config (Cấu hình) | **Số dòng:** 10 | **Kích thước:** 0.2 KB

```typescript
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'marian-blue',
      neutral: 'stone',
      secondary: 'vatican-gold'
    }
  }
})

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-2"></a>📄 [2/71] File: `web-admin/app.vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** App & Build Config (Cấu hình) | **Số dòng:** 30 | **Kích thước:** 0.7 KB

```markup
<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup>
const appConfig = useAppConfig()
const liturgicalToday = useState('liturgicalToday', () => null)

// Fetch today's liturgical state
const { data } = await useApiFetch('/Liturgical/today')
if (data.value) {
  liturgicalToday.value = data.value

  const colorMap = {
    green: 'emerald',
    red: 'rose',
    white: 'amber', // Gold-amber fits white liturgical feast perfectly and looks beautiful
    purple: 'violet',
    black: 'stone'
  }

  const themeColor = colorMap[data.value.liturgicalColor] || 'rose'
  appConfig.ui.colors.primary = themeColor
}
</script>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-3"></a>📄 [3/71] File: `web-admin/assets/css/main.css`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Styles & CSS (Giao diện) | **Số dòng:** 342 | **Kích thước:** 11.5 KB

```css
@import "tailwindcss";
@import "@nuxt/ui";
@plugin "@tailwindcss/typography";

/* ══════════════════════════════════════════════════════════════
   SACRED ADMIN - Hệ thống màu sắc chủ đề Công Giáo
   Primary: Marian Blue (#1e3a8a → blue-900)
   Secondary: Vatican Gold (#b45309 → amber-700)
   Background: Warm Ivory (#f8f7f4)
   ══════════════════════════════════════════════════════════════ */

@theme static {
  --font-sans: 'Inter', sans-serif;
  --font-serif: 'Merriweather', serif;
  --ui-radius: 0.375rem; /* rounded */

  /* ── Marian Blue (Primary) ── */
  --color-marian-blue-50:  #eff6ff;
  --color-marian-blue-100: #dbeafe;
  --color-marian-blue-200: #bfdbfe;
  --color-marian-blue-300: #93c5fd;
  --color-marian-blue-400: #60a5fa;
  --color-marian-blue-500: #3b82f6;
  --color-marian-blue-600: #2563eb;
  --color-marian-blue-700: #1d4ed8;
  --color-marian-blue-800: #1e40af;
  --color-marian-blue-900: #1e3a8a;
  --color-marian-blue-950: #172554;

  /* ── Vatican Gold (Secondary) ── */
  --color-vatican-gold-50:  #fffbeb;
  --color-vatican-gold-100: #fef3c7;
  --color-vatican-gold-200: #fde68a;
  --color-vatican-gold-300: #fcd34d;
  --color-vatican-gold-400: #fbbf24;
  --color-vatican-gold-500: #f59e0b;
  --color-vatican-gold-600: #d97706;
  --color-vatican-gold-700: #b45309;
  --color-vatican-gold-800: #92400e;
  --color-vatican-gold-900: #78350f;
  --color-vatican-gold-950: #451a03;

  /* ── Warm Ivory Background ── */
  --color-ivory-50:  #fdfcfb;
  --color-ivory-100: #f8f7f4;
  --color-ivory-200: #f0ede6;
  --color-ivory-300: #e6e0d5;

  /* ── Nuxt UI Primary mapping → Marian Blue ── */
  --color-primary-50:  var(--color-marian-blue-50);
  --color-primary-100: var(--color-marian-blue-100);
  --color-primary-200: var(--color-marian-blue-200);
  --color-primary-300: var(--color-marian-blue-300);
  --color-primary-400: var(--color-marian-blue-400);
  --color-primary-500: var(--color-marian-blue-500);
  --color-primary-600: var(--color-marian-blue-600);
  --color-primary-700: var(--color-marian-blue-700);
  --color-primary-800: var(--color-marian-blue-800);
  --color-primary-900: var(--color-marian-blue-900);
  --color-primary-950: var(--color-marian-blue-950);

  /* ── Nuxt UI Neutral mapping → Stone ── */
  --color-neutral-50:  #fafaf9;
  --color-neutral-100: #f5f5f4;
  --color-neutral-200: #e7e5e4;
  --color-neutral-300: #d6d3d1;
  --color-neutral-400: #a8a29e;
  --color-neutral-500: #78716c;
  --color-neutral-600: #57534e;
  --color-neutral-700: #44403c;
  --color-neutral-800: #292524;
  --color-neutral-900: #1c1917;
  --color-neutral-950: #0c0a09;

  /* ── Original Green (giữ nguyên) ── */
  --color-green-50:  #EFFDF5;
  --color-green-100: #D9FBE8;
  --color-green-200: #B3F5D1;
  --color-green-300: #75EDAE;
  --color-green-400: #00DC82;
  --color-green-500: #00C16A;
  --color-green-600: #00A155;
  --color-green-700: #007F45;
  --color-green-800: #016538;
  --color-green-900: #0A5331;
  --color-green-950: #052E16;
}

/* ══════════════════════════════════════════════════════════════
   LAYER UTILITIES
   ══════════════════════════════════════════════════════════════ */
@layer utilities {

  /* ── Safe Area (mobile) ── */
  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom);
  }

  /* ══ GLASS CARD ══ */
  .glass-card {
    @apply bg-white/80 dark:bg-stone-900/80 border border-white/30 dark:border-stone-800/60 shadow-lg backdrop-blur-xl backdrop-saturate-150;
  }
  .glass-card-dark {
    @apply bg-stone-900/85 border border-white/10 shadow-2xl backdrop-blur-xl;
  }

  /* ══ SACRED SIDEBAR ══ */
  /* Sidebar nền gradient xanh Marian Blue sâu */
  .sacred-sidebar {
    background: linear-gradient(180deg, #1e3a8a 0%, #1e40af 60%, #1d4ed8 100%);
  }
  /* Item nav active: nền vàng Vatican nhạt */
  .sidebar-nav-active {
    @apply bg-amber-400/20 text-amber-300 border-l-2 border-amber-400;
  }
  /* Item nav hover */
  .sidebar-nav-hover {
    @apply hover:bg-white/10 hover:text-white transition-all duration-200;
  }

  /* ══ METRIC CARDS ══ */
  .metric-card {
    @apply bg-white dark:bg-stone-900 rounded-2xl p-5 shadow-sm border border-stone-100 dark:border-stone-800 transition-all duration-300;
  }
  .metric-card:hover {
    @apply -translate-y-1 shadow-lg shadow-marian-blue-500/10;
  }

  /* ══ BADGE NGÀNH ══ */
  /* Ấu Nhi = pink/rose */
  .badge-aunhi {
    @apply bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800;
  }
  /* Thiếu Nhi = blue */
  .badge-thieunhi {
    @apply bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800;
  }
  /* Nghĩa Sĩ = green */
  .badge-nghiasi {
    @apply bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800;
  }
  /* Hiệp Sĩ = red */
  .badge-hiepsi {
    @apply bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800;
  }
  /* Chiên Con = lavender */
  .badge-chiencon {
    @apply bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800;
  }

  /* ══ HOVER EFFECTS ══ */
  .hover-lift {
    @apply transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-marian-blue-500/15;
  }
  .hover-glow {
    @apply transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/30;
  }

  /* ══ GRADIENT TEXT ══ */
  .text-gradient-gold {
    background: linear-gradient(135deg, #f59e0b 0%, #fcd34d 50%, #b45309 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .text-gradient-primary {
    background: linear-gradient(135deg, #60a5fa 0%, #1e3a8a 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ══ CARD SHINE ══ */
  .card-shine {
    position: relative;
    overflow: hidden;
  }
  .card-shine::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%);
    pointer-events: none;
  }

  /* ══ TABLE ROW HOVER ══ */
  .table-row-hover {
    @apply hover:bg-marian-blue-50/60 dark:hover:bg-marian-blue-950/30 transition-colors duration-150;
  }

  /* ══ DATA CARD (sidebar widgets) ══ */
  .data-card {
    @apply bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm border border-stone-100 dark:border-stone-800;
  }

  /* ══ SECTION LABEL ══ */
  .section-label {
    @apply text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500;
  }

  /* ══ ANIMATIONS ══ */
  .animate-fade-in-up {
    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .animate-fade-in-left {
    animation: fadeInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .animate-scale-in {
    animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .animate-slide-in-sidebar {
    animation: slideInSidebar 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .animate-fade-in-cards {
    animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  /* Animation delays */
  .delay-50  { animation-delay: 0.05s; }
  .delay-100 { animation-delay: 0.1s; }
  .delay-150 { animation-delay: 0.15s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
  .delay-400 { animation-delay: 0.4s; }
  .delay-500 { animation-delay: 0.5s; }
  .delay-600 { animation-delay: 0.6s; }
  .delay-700 { animation-delay: 0.7s; }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInLeft {
    from { opacity: 0; transform: translateX(-20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.94); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes slideInSidebar {
    from { opacity: 0; transform: translateX(-100%); }
    to   { opacity: 1; transform: translateX(0); }
  }

  /* ══ PROGRESS RING (SVG) ══ */
  .progress-ring-circle {
    transition: stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
  }

  /* ══ SCROLLBAR THIN ══ */
  .scrollbar-thin::-webkit-scrollbar { width: 4px; height: 4px; }
  .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
  .scrollbar-thin::-webkit-scrollbar-thumb {
    @apply bg-stone-300 dark:bg-stone-700 rounded-full;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    @apply bg-stone-400 dark:bg-stone-600;
  }

  /* ══ CUSTOM SCROLLBAR (sidebar, panels) ══ */
  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(255,255,255,0.2);
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255,255,255,0.35);
  }

  /* ══ LINE CLAMP ══ */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* ══ BENTO GRID ══ */
  .bento-grid {
    display: grid;
    gap: 1rem;
  }

  /* ══ SUBTLE GRID BACKGROUND ══ */
  .bg-sacred-grid {
    background-color: #f8f7f4;
    background-image:
      linear-gradient(rgba(30,58,138,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(30,58,138,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  .dark .bg-sacred-grid {
    background-color: #0c0a09;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  /* ══ NEWS CARD HOVER ══ */
  .news-card-hover {
    @apply transition-all duration-300 cursor-pointer;
  }
  .news-card-hover:hover {
    @apply -translate-y-0.5 shadow-md;
  }

  /* ══ BLOB ANIMATION (students page) ══ */
  @keyframes blob {
    0%   { transform: translate(0px, 0px) scale(1); }
    33%  { transform: translate(30px, -50px) scale(1.1); }
    66%  { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .animate-blob { animation: blob 10s infinite; }
  .animation-delay-2000 { animation-delay: 2s; }

  /* ══ CROSS LOGO DECORATION ══ */
  .cross-decoration::before {
    content: '✛';
    @apply text-amber-400/60 text-4xl font-serif;
  }

  /* ══ LITURGICAL COLOR BADGE ══ */
  .liturgical-dot-green  { @apply bg-emerald-500; }
  .liturgical-dot-purple { @apply bg-purple-500; }
  .liturgical-dot-red    { @apply bg-red-500; }
  .liturgical-dot-white  { @apply bg-amber-400; }
  .liturgical-dot-rose   { @apply bg-pink-500; }
  .liturgical-dot-black  { @apply bg-stone-800; }
}

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-4"></a>📄 [4/71] File: `web-admin/components/ImportWizard.vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** UI Components (Dùng chung) | **Số dòng:** 386 | **Kích thước:** 17.4 KB

```markup
<template>
  <div class="space-y-6">
    <!-- Stepper UI -->
    <div class="flex items-center justify-between relative max-w-lg mx-auto mb-8 mt-2">
      <!-- Line -->
      <div class="absolute left-0 top-5 -translate-y-1/2 w-full h-1 bg-stone-200 dark:bg-stone-800 -z-10 rounded-full"></div>
      <div class="absolute left-0 top-5 -translate-y-1/2 h-1 bg-primary-500 -z-10 rounded-full transition-all duration-500" :style="`width: ${(currentStep - 1) * 50}%`"></div>
      
      <!-- Step 1 -->
      <div class="flex flex-col items-center gap-2">
        <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500" :class="currentStep >= 1 ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-110' : 'bg-stone-100 dark:bg-stone-800 text-stone-400'">
          1
        </div>
        <span class="text-xs font-bold" :class="currentStep >= 1 ? 'text-primary-600 dark:text-primary-400' : 'text-stone-400'">Tải Lên</span>
      </div>
      
      <!-- Step 2 -->
      <div class="flex flex-col items-center gap-2">
        <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500" :class="currentStep >= 2 ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-110' : 'bg-stone-100 dark:bg-stone-800 text-stone-400'">
          2
        </div>
        <span class="text-xs font-bold" :class="currentStep >= 2 ? 'text-primary-600 dark:text-primary-400' : 'text-stone-400'">Xác Thực</span>
      </div>
      
      <!-- Step 3 -->
      <div class="flex flex-col items-center gap-2">
        <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500" :class="currentStep >= 3 ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-110' : 'bg-stone-100 dark:bg-stone-800 text-stone-400'">
          3
        </div>
        <span class="text-xs font-bold" :class="currentStep >= 3 ? 'text-primary-600 dark:text-primary-400' : 'text-stone-400'">Đồng Bộ</span>
      </div>
    </div>

    <!-- Bước 1: Khu vực Upload File -->
    <div
      v-if="currentStep === 1"
      class="border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-xl p-12 text-center transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50 cursor-pointer animate-fade-in-up"
      @click="triggerFileInput"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInputRef"
        type="file"
        accept=".xlsx, .xls, .docx"
        class="hidden"
        @change="handleFileChange"
      >
      <div class="w-20 h-20 mx-auto mb-4 bg-primary-50 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
        <UIcon name="i-heroicons-cloud-arrow-up" class="w-10 h-10 text-primary-500" />
      </div>
      <h3 class="font-bold text-xl text-stone-800 dark:text-stone-200">Kéo thả file hoặc Click để tải lên</h3>
      <p class="text-sm text-stone-500 mt-2">Hỗ trợ định dạng: Excel (.xlsx, .xls) hoặc Word (.docx)</p>
      <div class="mt-8 flex justify-center">
        <UButton color="primary" variant="soft" icon="i-heroicons-document-arrow-down" label="Tải File Excel Mẫu" to="/api/Student/export-template" external target="_blank" />
      </div>
    </div>

    <!-- Bước 2: Khu vực Preview & Validate -->
    <div v-else-if="currentStep === 2" class="space-y-4 animate-fade-in-up">
      <div class="flex items-center justify-between bg-stone-50 dark:bg-stone-900/50 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
        <div>
          <h3 class="font-bold text-lg text-stone-800 dark:text-white">Kiểm tra dữ liệu</h3>
          <p class="text-sm text-stone-500 mt-1">
            Tổng cộng: <span class="font-bold text-primary-600">{{ parsedData.length }}</span> dòng. 
            Hợp lệ: <span class="font-bold text-emerald-600">{{ validCount }}</span> | 
            Trùng lặp: <span class="font-bold text-amber-600">{{ duplicateCount }}</span> | 
            Lỗi: <span class="font-bold text-red-600">{{ errorCount }}</span>
          </p>
        </div>
        <div class="flex gap-3">
          <UButton label="Hủy & Tải Lại" color="neutral" variant="soft" icon="i-heroicons-arrow-path" @click="resetData" />
          <UButton label="Tiến Hành Đồng Bộ" color="primary" icon="i-heroicons-arrow-right" :disabled="errorCount > 0" :loading="isSaving" @click="saveData" />
        </div>
      </div>

      <!-- Bảng Data Grid -->
      <div class="border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden bg-white dark:bg-stone-900 shadow-sm">
        <div class="overflow-x-auto max-h-[50vh]">
          <table class="w-full text-sm text-left">
            <thead class="text-xs text-stone-500 uppercase bg-stone-100 dark:bg-stone-950 sticky top-0 z-10 shadow-sm">
              <tr>
                <th class="px-4 py-4 font-black">STT</th>
                <th class="px-4 py-4 font-black">Tên Thánh</th>
                <th class="px-4 py-4 font-black min-w-[180px]">Họ và Tên *</th>
                <th class="px-4 py-4 font-black min-w-[130px]">Ngày Sinh</th>
                <th class="px-4 py-4 font-black">Ngành</th>
                <th class="px-4 py-4 font-black">Lớp</th>
                <th class="px-4 py-4 font-black">Trạng thái</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
              <tr v-for="(row, idx) in parsedData" :key="idx" :class="getRowClass(row)" class="hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors">
                <td class="px-4 py-3 font-medium text-stone-500">{{ idx + 1 }}</td>
                <td class="px-4 py-3">
                  <UInput v-model="row.holyName" size="xs" variant="none" class="bg-transparent focus:bg-white dark:focus:bg-stone-900 rounded" @blur="validateRow(row)" />
                </td>
                <td class="px-4 py-3 relative">
                  <UInput v-model="row.fullName" size="xs" variant="none" class="bg-transparent font-bold focus:bg-white dark:focus:bg-stone-900 rounded" :class="{'text-red-500': row.errors.fullName}" @blur="validateRow(row)" />
                  <div v-if="row.errors.fullName" class="text-[10px] text-red-500 absolute bottom-0 left-4 font-bold">{{ row.errors.fullName }}</div>
                </td>
                <td class="px-4 py-3 relative">
                  <UInput v-model="row.birthDateStr" type="date" size="xs" variant="none" class="bg-transparent focus:bg-white dark:focus:bg-stone-900 rounded" :class="{'text-red-500': row.errors.birthDate}" @blur="validateRow(row)" />
                  <div v-if="row.errors.birthDate" class="text-[10px] text-red-500 absolute bottom-0 left-4 font-bold">{{ row.errors.birthDate }}</div>
                </td>
                <td class="px-4 py-3">
                  <USelect v-model="row.branch" :options="[{ label: 'Chiên con', value: 1 }, { label: 'Ấu nhi', value: 2 }, { label: 'Thiếu nhi', value: 3 }, { label: 'Nghĩa sĩ', value: 4 }, { label: 'Hiệp sĩ', value: 5 }]" size="xs" variant="none" value-attribute="value" option-attribute="label" class="focus:bg-white dark:focus:bg-stone-900 rounded" @change="validateRow(row)" />
                </td>
                <td class="px-4 py-3">
                  <UInput v-model="row.className" size="xs" variant="none" class="bg-transparent focus:bg-white dark:focus:bg-stone-900 rounded" @blur="validateRow(row)" />
                </td>
                <td class="px-4 py-3">
                  <UBadge v-if="row.isDuplicate" color="amber" variant="subtle" size="xs" class="font-bold">Trùng lặp</UBadge>
                  <UBadge v-else-if="Object.keys(row.errors).length > 0" color="red" variant="subtle" size="xs" class="font-bold">Lỗi</UBadge>
                  <UBadge v-else color="emerald" variant="subtle" size="xs" class="font-bold">Hợp lệ</UBadge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <UAlert v-if="duplicateCount > 0" title="Phát hiện hồ sơ trùng lặp" icon="i-heroicons-exclamation-triangle" color="amber" variant="soft" description="Có một số hồ sơ bị trùng tên và ngày sinh với dữ liệu trên hệ thống. Hệ thống sẽ tự động cập nhật đè lên thay vì tạo mới. Bạn có thể tự do sửa đổi trực tiếp ở bảng trên." />
    </div>

    <!-- Bước 3: Đồng Bộ Hoàn Tất -->
    <div v-else-if="currentStep === 3" class="text-center py-16 space-y-6 animate-fade-in-up">
      <div class="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
        <UIcon name="i-heroicons-check-circle" class="w-14 h-14 text-emerald-500" />
      </div>
      <div>
        <h3 class="text-3xl font-black text-stone-800 dark:text-white mb-2">Đồng Bộ Thành Công!</h3>
        <p class="text-stone-500 text-lg">Toàn bộ dữ liệu đoàn sinh đã được lưu vào hệ thống an toàn.</p>
      </div>
      <div class="pt-6">
        <UButton label="Hoàn Tất & Đóng" color="primary" size="xl" class="px-10 shadow-lg shadow-primary-500/20" @click="finishImport" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { z } from 'zod'
import * as XLSX from 'xlsx'
import mammoth from 'mammoth'

const props = defineProps({
  onSuccess: Function
})

const emit = defineEmits(['imported'])
const toast = useToast()
const auth = useAuthStore()
const config = useRuntimeConfig()

const fileInputRef = ref(null)
const parsedData = ref([])
const isSaving = ref(false)
const currentStep = ref(1)

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleDrop = (e) => {
  const file = e.dataTransfer.files[0]
  if (file) processFile(file)
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) processFile(file)
}

const resetData = () => {
  parsedData.value = []
  currentStep.value = 1
  if (fileInputRef.value) fileInputRef.value.value = ''
}

const finishImport = () => {
  resetData()
  if (props.onSuccess) props.onSuccess()
  emit('imported')
}

// ─────────────────────────────────────────────────────────────────────────────
// PARSING LOGIC
// ─────────────────────────────────────────────────────────────────────────────
const processFile = async (file) => {
  try {
    let rawData = []
    
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 })
      
      // Bỏ qua dòng tiêu đề (json[0])
      rawData = json.slice(1).filter(row => row.length > 0 && !!row[1]).map(row => {
        return {
          holyName: row[0]?.toString() || '',
          fullName: row[1]?.toString() || '',
          birthDateStr: parseExcelDate(row[2]),
          className: row[3]?.toString() || '',
          branch: mapBranch(row[4]?.toString() || ''),
          parentPhone: row[5]?.toString() || '',
          bloodType: row[6]?.toString() || '',
          allergies: row[7]?.toString() || '',
          baptismDateStr: parseExcelDate(row[8]),
          communionDateStr: parseExcelDate(row[9]),
          confirmationDateStr: parseExcelDate(row[10]),
          errors: {},
          isDuplicate: false,
          existingId: null
        }
      })
    } else if (file.name.endsWith('.docx')) {
      const data = await file.arrayBuffer()
      const result = await mammoth.extractRawText({ arrayBuffer: data })
      rawData = parseWordRegex(result.value)
    } else {
      throw new Error('Định dạng file không hỗ trợ')
    }
    
    if (!rawData.length) throw new Error('Không tìm thấy dữ liệu hợp lệ trong file')
    
    // Gán dữ liệu và chạy check validation, trùng lặp
    parsedData.value = rawData
    currentStep.value = 2 // Move to step 2 after file parsing
    runValidation()
    await checkDuplicates()
    
  } catch (err) {
    toast.add({ title: 'Lỗi đọc file', description: err.message, color: 'error' })
  }
}

const parseExcelDate = (excelDate) => {
  if (!excelDate) return ''
  if (typeof excelDate === 'number') {
    const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000))
    return date.toISOString().split('T')[0]
  }
  // Thử parse string
  try {
    return new Date(excelDate).toISOString().split('T')[0]
  } catch { return '' }
}

const mapBranch = (str) => {
  str = str.toLowerCase()
  if (str.includes('chiên')) return 1
  if (str.includes('ấu') || str == '2') return 2
  if (str.includes('thiếu') || str == '3') return 3
  if (str.includes('nghĩa') || str == '4') return 4
  return 2 // Default
}

// Regex đọc text từ Word. Tuỳ theo Xứ, mẫu sẽ khác nhau.
// Tạm định dạng: "[Tên Thánh] [Họ Tên] - [Ngày Sinh]" mỗi dòng
const parseWordRegex = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 5)
  const results = []
  
  // Tạm xử lý regex cơ bản: (Maria|Giuse...) (Nguyễn Văn A) [-|,] (DD/MM/YYYY)
  const regex = /^(?:([a-zA-Z\s]+)\s+)?([A-ZÀ-Ỹa-zà-ỹ\s]+)(?:\s*[-|,]\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}))?/i
  
  for (const line of lines) {
    const match = line.match(regex)
    if (match) {
      let d = ''
      if (match[3]) {
        const parts = match[3].split(/[\/\-]/)
        if (parts.length === 3) d = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
      }
      
      results.push({
        holyName: (match[1] || '').trim(),
        fullName: (match[2] || '').trim(),
        birthDateStr: d,
        className: '',
        branch: 2,
        parentPhone: '', bloodType: '', allergies: '', baptismDateStr: '', communionDateStr: '', confirmationDateStr: '',
        errors: {},
        isDuplicate: false
      })
    }
  }
  return results
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION & SYNC
// ─────────────────────────────────────────────────────────────────────────────
const rowSchema = z.object({
  fullName: z.string().min(2, 'Thiếu tên'),
  birthDateStr: z.string().optional()
})

const validateRow = (row) => {
  row.errors = {}
  try {
    rowSchema.parse(row)
  } catch (err) {
    err.errors.forEach(e => {
      row.errors[e.path[0]] = e.message
    })
  }
}

const runValidation = () => {
  parsedData.value.forEach(row => validateRow(row))
}

const checkDuplicates = async () => {
  try {
    const requests = parsedData.value.map(r => ({ fullName: r.fullName, birthDate: r.birthDateStr || null }))
    const duplicates = await $api('/Student/check-duplicates', {
      method: 'POST',
      body: requests
    })
    
    // Gán cờ trùng lặp
    parsedData.value.forEach(row => {
      const dup = duplicates.find(d => d.fullName.toLowerCase() === row.fullName.toLowerCase())
      if (dup) {
        row.isDuplicate = true
        row.existingId = dup.existingId
      }
    })
  } catch (err) {
    console.error('Lỗi check trùng lặp:', err)
  }
}

const errorCount = computed(() => parsedData.value.filter(r => Object.keys(r.errors).length > 0).length)
const duplicateCount = computed(() => parsedData.value.filter(r => r.isDuplicate).length)
const validCount = computed(() => parsedData.value.length - errorCount.value)

const getRowClass = (row) => {
  if (Object.keys(row.errors).length > 0) return 'bg-red-50/50 dark:bg-red-900/10'
  if (row.isDuplicate) return 'bg-amber-50/50 dark:bg-amber-900/10'
  return ''
}

const saveData = async () => {
  if (errorCount.value > 0) return toast.add({ title: 'Vui lòng sửa các dòng lỗi trước khi lưu', color: 'amber' })
  
  isSaving.value = true
  try {
    const payload = parsedData.value.map(r => ({
      // Nếu trùng lặp, ta có thể gửi ID lên để backend update thay vì insert.
      // Tạm thời backend "bulk" đang Insert. Cần update logic backend hoặc xử lý frontend.
      // Dành cho bản demo, gửi thẳng lên bulk import.
      id: r.existingId || undefined, 
      holyName: r.holyName,
      fullName: r.fullName,
      birthDate: r.birthDateStr || null,
      branch: r.branch,
      className: r.className,
      parentPhone: r.parentPhone,
      bloodType: r.bloodType,
      allergies: r.allergies,
      baptismDate: r.baptismDateStr || null,
      communionDate: r.communionDateStr || null,
      confirmationDate: r.confirmationDateStr || null
    }))
    
    await $api('/Student/bulk', {
      method: 'POST',
      body: payload
    })
    
    toast.add({ title: 'Đã lưu danh sách thành công!', color: 'success' })
    currentStep.value = 3 // Move to step 3 (Success)
  } catch (err) {
    toast.add({ title: 'Lỗi lưu dữ liệu', description: err.data?.message || err.message, color: 'error' })
  } finally {
    isSaving.value = false
  }
}
</script>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-5"></a>📄 [5/71] File: `web-admin/components/SafeHtml.vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** UI Components (Dùng chung) | **Số dòng:** 53 | **Kích thước:** 1.8 KB

```markup
<template>
  <!--
    SafeHtml Component — Bộ lọc XSS an toàn cho Nuxt 3.
    Dùng thay thế cho v-html trực tiếp ở mọi nơi hiển thị nội dung từ DB.

    Cách dùng:
      <SafeHtml :content="item.content" />
      <SafeHtml :content="news.content" class="prose dark:prose-invert" />

    Nguyên lý hoạt động:
    - isomorphic-dompurify chạy được cả SSR (Node.js) lẫn CSR (Browser).
    - Chỉ cho phép các thẻ HTML an toàn, loại bỏ <script>, onclick, javascript:... v.v.
  -->
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div
    class="prose prose-stone dark:prose-invert prose-blockquote:font-serif prose-blockquote:text-lg prose-blockquote:italic prose-blockquote:border-l-4 prose-blockquote:border-marian-blue-500 prose-blockquote:bg-stone-50 dark:prose-blockquote:bg-stone-800/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-a:text-marian-blue-600 prose-headings:font-serif max-w-none"
    v-html="cleanHtml"
  />
</template>

<script setup lang="ts">
import DOMPurify from 'isomorphic-dompurify'

const props = defineProps<{
  content: string | null | undefined
}>()

/**
 * Danh sách thẻ được phép hiển thị (Whitelist).
 * Loại bỏ tất cả những gì không có trong danh sách này.
 */
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's',
  'h2', 'h3', 'h4',
  'ul', 'ol', 'li',
  'a', 'blockquote', 'hr',
  'span', 'div'
]

const ALLOWED_ATTR = ['href', 'target', 'rel', 'class']

const cleanHtml = computed(() => {
  if (!props.content) return ''
  return DOMPurify.sanitize(props.content, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Đảm bảo link ngoài không thể chạy javascript:
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed']
  })
})
</script>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-6"></a>📄 [6/71] File: `web-admin/composables/useApi.ts`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Composables (API Hooks) | **Số dòng:** 69 | **Kích thước:** 2.5 KB

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthStore } from '~/stores/auth'

/**
 * Tạo options chung cho cả useApiFetch và $api:
 * - Gắn Bearer Token vào header mỗi request
 * - Bắt lỗi 401 (Token hết hạn): Tự động logout
 * - Bắt lỗi 400 (Validation): Phát sự kiện để Form hiển thị lỗi đỏ theo field
 */
function createApiOptions(request: string, opts?: any) {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  return {
    baseURL: config.public.apiBase,
    ...opts,
    onRequest({ options }: { options: any }) {
      if (authStore.token) {
        options.headers = new Headers(options.headers || {})
        options.headers.set('Authorization', `Bearer ${authStore.token}`)
      }
    },
    onResponseError({ response }: { response: any }) {
      // Giai đoạn 5D — Xử lý lỗi tập trung cho toàn bộ API calls

      // 401 Unauthorized: Token hết hạn hoặc không hợp lệ → Tự động logout
      if (response.status === 401) {
        authStore.logout()
        return
      }

      // 403 Forbidden: Không có quyền (ABAC từ chối) → Thông báo nhẹ nhàng
      if (response.status === 403) {
        console.warn('[API] Từ chối truy cập: Bạn không có quyền thực hiện thao tác này.')
        return
      }

      // 400 Bad Request: Lỗi validation từ Backend (FluentValidation / ProblemDetails RFC 7807)
      // Phát sự kiện để các component Form lắng nghe và hiển thị lỗi đỏ đúng field
      if (response.status === 400 && response._data?.errors) {
        // Các form dùng useEventBus('validation-errors') để lắng nghe
        import('@vueuse/core').then(({ useEventBus }) => {
          const bus = useEventBus<Record<string, string[]>>('validation-errors')
          bus.emit(response._data.errors)
        })
      }
    }
  }
}

/**
 * useApiFetch — Dùng với useFetch() trong setup() của component.
 * Tự động reactive, re-fetch khi deps thay đổi.
 * Phù hợp cho: data fetching trong page/component lifecycle.
 */
export const useApiFetch = <T>(request: string, opts?: any) => {
  const key = opts?.key ?? request
  return useFetch<T>(request, { key, ...createApiOptions(request, opts) })
}

/**
 * $api — Dùng với $fetch() trong event handlers, actions.
 * One-shot, không reactive.
 * Phù hợp cho: POST/PUT/DELETE trong button click handlers.
 */
export const $api = <T>(request: string, opts?: any) => {
  return $fetch<T>(request, createApiOptions(request, opts))
}

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-7"></a>📄 [7/71] File: `web-admin/eslint.config.mjs`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** App & Build Config (Cấu hình) | **Số dòng:** 7 | **Kích thước:** 0.1 KB

```javascript
// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
)

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-8"></a>📄 [8/71] File: `web-admin/i18n/locales/en.json`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** I18n Locales (Đa ngôn ngữ) | **Số dòng:** 39 | **Kích thước:** 1.3 KB

```json
{
  "appName": "TNTT Teresa",
  "student": "Youth Member",
  "leadership": "Leadership Council",
  "library": "Catechism Library",
  "academicYears": "Academic Years",
  "accounts": "Personnel",
  "logout": "Log Out",
  "login": "Log In",
  "loginTitle": "Eucharistic Youth Movement Management Portal",
  "enterSystem": "Enter System",
  "username": "Username",
  "password": "Password",
  "enterUsername": "Enter username",
  "wrongCredentials": "Invalid username or password!",
  "studentManagement": "Youth Member Management",
  "studentDesc": "Manage profiles, academic grades, and sacramental certificates.",
  "selectYear": "Select Year:",
  "filterClass": "Filter Classroom:",
  "activeYearLabel": "Active Academic Year:",
  "notSet": "Not Set",
  "searchPlaceholder": "Search by name or phone...",
  "addStudent": "Add student",
  "allClasses": "All Classes",
  "unassigned": "Unassigned Students",
  "leadershipTitle": "Parish Leadership Council",
  "leadershipDesc": "Organizational chart and council members across terms.",
  "libraryTitle": "Catechism Digital Library",
  "libraryDesc": "Smart archive and classification of documents & lesson plans.",
  "save": "Save",
  "cancel": "Cancel",
  "delete": "Delete",
  "edit": "Edit",
  "success": "Success",
  "error": "Error",
  "branch": "Branch",
  "classRoom": "Classroom"
}

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-9"></a>📄 [9/71] File: `web-admin/i18n/locales/vi.json`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** I18n Locales (Đa ngôn ngữ) | **Số dòng:** 39 | **Kích thước:** 1.5 KB

```json
{
  "appName": "Sứ Đoàn Têrêsa",
  "student": "Đoàn Sinh",
  "leadership": "Ban Điều Hành",
  "library": "Tủ Sách Giáo Lý",
  "academicYears": "Niên Khóa",
  "accounts": "Nhân Sự",
  "logout": "Đăng Xuất",
  "login": "Đăng Nhập",
  "loginTitle": "Cổng thông tin quản trị Sứ đoàn Thiếu Nhi Thánh Thể",
  "enterSystem": "Vào Hệ Thống",
  "username": "Tên đăng nhập",
  "password": "Mật khẩu",
  "enterUsername": "Nhập tài khoản",
  "wrongCredentials": "Sai tài khoản hoặc mật khẩu!",
  "studentManagement": "Quản Lý Đoàn Sinh",
  "studentDesc": "Tra cứu hồ sơ, theo dõi điểm số giáo lý và cấp phát chứng thư bí tích điện tử.",
  "selectYear": "Chọn Niên Khóa:",
  "filterClass": "Lọc lớp học:",
  "activeYearLabel": "Niên khóa hoạt động:",
  "notSet": "Chưa thiết lập",
  "searchPlaceholder": "Tìm theo tên hoặc số điện thoại...",
  "addStudent": "Thêm đoàn sinh",
  "allClasses": "Tất cả các lớp",
  "unassigned": "Học sinh tự do",
  "leadershipTitle": "Ban Điều Hành Sứ Đoàn",
  "leadershipDesc": "Sơ đồ tổ chức, cơ cấu nhân sự Ban Điều Hành Sứ Đoàn qua các nhiệm kỳ.",
  "libraryTitle": "Thư Viện Số Giáo Lý",
  "libraryDesc": "Hệ thống lưu trữ, phân loại tài liệu & giáo án thông minh.",
  "save": "Lưu",
  "cancel": "Hủy",
  "delete": "Xóa",
  "edit": "Sửa",
  "success": "Thành công",
  "error": "Lỗi",
  "branch": "Ngành",
  "classRoom": "Lớp học"
}

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-10"></a>📄 [10/71] File: `web-admin/layouts/admin.vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Layouts (Khung trang) | **Số dòng:** 538 | **Kích thước:** 19.1 KB

```markup
<template>
  <!-- ══════════════════════════════════════════════════════════
       SACRED ADMIN LAYOUT
       Chủ đề: "Sacred Admin" - Chuyên nghiệp, có bản sắc Công Giáo
       ══════════════════════════════════════════════════════════ -->
  <div class="min-h-screen bg-sacred-grid dark:bg-stone-950 transition-colors duration-500">

    <!-- Mobile Backdrop (khi sidebar mở trên mobile) -->
    <Transition name="fade">
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm"
        @click="isSidebarOpen = false"
      />
    </Transition>

    <!-- ─────────────────────────────────────────────────────────
         SIDEBAR - Nền gradient Marian Blue, icon + label
         Desktop: 260px khi mở, 64px khi thu gọn
         Mobile: slide-over từ trái
    ──────────────────────────────────────────────────────────── -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 flex flex-col sacred-sidebar shadow-2xl transition-all duration-300 ease-in-out',
        isSidebarOpen
          ? 'translate-x-0 w-[260px]'
          : '-translate-x-full md:translate-x-0 md:w-16'
      ]"
    >
      <!-- Logo Section: Dấu thánh giá + tên hệ thống -->
      <div class="h-16 flex items-center border-b border-white/10 flex-shrink-0 px-3 gap-3">
        <!-- Icon dấu thánh giá -->
        <div class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 shadow-inner">
          <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-amber-300" />
        </div>
        <!-- Tên hệ thống (chỉ hiện khi sidebar mở) -->
        <Transition name="slide-label">
          <div v-if="isSidebarOpen" class="overflow-hidden">
            <p class="font-serif font-black text-sm text-white leading-tight whitespace-nowrap">
              Quản Trị TNTT
            </p>
            <p class="text-[10px] text-amber-300/80 font-semibold tracking-widest uppercase whitespace-nowrap">
              Sacred Admin
            </p>
          </div>
        </Transition>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 overflow-y-auto py-3 flex flex-col gap-0.5 px-2 custom-scrollbar scrollbar-thin">

        <!-- Tổng Quan -->
        <NavItem
          to="/admin/dashboard"
          icon="i-heroicons-home"
          label="Tổng Quan"
          :expanded="isSidebarOpen"
          @click="closeOnMobile"
        />

        <div class="my-2 mx-2 border-t border-white/10" />

        <!-- GROUP: Học Vụ -->
        <Transition name="slide-label">
          <p v-if="isSidebarOpen" class="text-[9px] font-black text-white/40 uppercase tracking-[0.18em] px-3 pt-1 pb-1">
            Học Vụ
          </p>
        </Transition>

        <NavItem
          to="/admin/students"
          icon="i-heroicons-academic-cap"
          label="Đoàn Sinh"
          :expanded="isSidebarOpen"
          @click="closeOnMobile"
        />
        <NavItem
          to="/admin/reports"
          icon="i-heroicons-chart-pie"
          label="Báo Cáo"
          :expanded="isSidebarOpen"
          @click="closeOnMobile"
        />
        <NavItem
          to="/admin/users"
          icon="i-heroicons-users"
          label="Tài Khoản"
          :expanded="isSidebarOpen"
          @click="closeOnMobile"
        />
        <NavItem
          to="/admin/roles"
          icon="i-heroicons-key"
          label="Phân Quyền"
          :expanded="isSidebarOpen"
          @click="closeOnMobile"
        />

        <div class="my-2 mx-2 border-t border-white/10" />

        <!-- GROUP: Nội Dung -->
        <Transition name="slide-label">
          <p v-if="isSidebarOpen" class="text-[9px] font-black text-white/40 uppercase tracking-[0.18em] px-3 pt-1 pb-1">
            Nội Dung
          </p>
        </Transition>

        <NavItem
          to="/admin/announcements"
          icon="i-heroicons-megaphone"
          label="Thông Báo"
          :expanded="isSidebarOpen"
          @click="closeOnMobile"
        />
        <NavItem
          to="/admin/documents"
          icon="i-heroicons-document-text"
          label="Tài Liệu Số"
          :expanded="isSidebarOpen"
          @click="closeOnMobile"
        />
        <NavItem
          to="/admin/leaders"
          icon="i-heroicons-identification"
          label="Ban Trưởng"
          :expanded="isSidebarOpen"
          @click="closeOnMobile"
        />
        <NavItem
          to="/admin/news"
          icon="i-heroicons-newspaper"
          label="Tin Tức RSS"
          :expanded="isSidebarOpen"
          @click="closeOnMobile"
        />

        <div class="my-2 mx-2 border-t border-white/10" />

        <!-- GROUP: Phụng Vụ -->
        <Transition name="slide-label">
          <p v-if="isSidebarOpen" class="text-[9px] font-black text-white/40 uppercase tracking-[0.18em] px-3 pt-1 pb-1">
            Phụng Vụ
          </p>
        </Transition>

        <NavItem
          to="/admin/liturgical"
          icon="i-heroicons-calendar-days"
          label="Lịch Phụng Vụ"
          :expanded="isSidebarOpen"
          @click="closeOnMobile"
        />

        <div class="my-2 mx-2 border-t border-white/10" />

        <!-- Sang Cổng Thông Tin Web Portal -->
        <NavItem
          to="http://localhost:3001"
          icon="i-heroicons-globe-alt"
          label="Cổng Thông Tin"
          :expanded="isSidebarOpen"
        />
      </nav>

      <!-- User Info ở cuối sidebar -->
      <div
        v-if="auth?.isLoggedIn"
        class="border-t border-white/10 p-3 flex-shrink-0"
      >
        <div :class="['flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer', !isSidebarOpen && 'justify-center']">
          <!-- Avatar chữ cái đầu -->
          <div class="w-8 h-8 rounded-full bg-amber-400/30 border border-amber-400/50 flex items-center justify-center flex-shrink-0">
            <span class="text-xs font-black text-amber-300">
              {{ (auth?.user?.name || 'A').charAt(0).toUpperCase() }}
            </span>
          </div>
          <!-- Tên + vai trò (chỉ hiện khi sidebar mở) -->
          <Transition name="slide-label">
            <div v-if="isSidebarOpen" class="overflow-hidden min-w-0">
              <p class="text-sm font-bold text-white truncate leading-tight">
                {{ auth?.user?.name || 'Admin' }}
              </p>
              <p class="text-[10px] text-amber-300/70 truncate">
                {{ roleName }}
              </p>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Sidebar Toggle Button (chỉ hiện trên Desktop) -->
      <div class="hidden md:block border-t border-white/10 p-2 flex-shrink-0">
        <button
          class="w-full flex items-center justify-center p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-all duration-200"
          @click="isSidebarOpen = !isSidebarOpen"
        >
          <UIcon
            :name="isSidebarOpen ? 'i-heroicons-chevron-double-left' : 'i-heroicons-chevron-double-right'"
            class="w-4 h-4"
          />
        </button>
      </div>
    </aside>

    <!-- ─────────────────────────────────────────────────────────
         MAIN CONTENT AREA
         Dịch chuyển sang phải tùy theo trạng thái sidebar
    ──────────────────────────────────────────────────────────── -->
    <div
      :class="[
        'flex flex-col min-h-screen transition-all duration-300',
        'md:ml-16',
        isSidebarOpen ? 'md:ml-[260px]' : ''
      ]"
    >
      <!-- ─── TOP HEADER ─────────────────────────────────────── -->
      <header class="sticky top-0 z-30 h-16 flex items-center justify-between px-4 md:px-6 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200/60 dark:border-stone-800/60 shadow-sm">

        <!-- Trái: Hamburger (mobile) + Breadcrumb -->
        <div class="flex items-center gap-3 min-w-0">
          <!-- Hamburger mobile -->
          <UButton
            icon="i-heroicons-bars-3"
            color="neutral"
            variant="ghost"
            size="sm"
            class="md:hidden text-stone-500"
            @click="isSidebarOpen = true"
          />

          <!-- Breadcrumb (desktop) -->
          <div class="hidden md:flex items-center gap-1.5 text-sm text-stone-500 min-w-0">
            <UIcon name="i-heroicons-sparkles" class="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span class="text-stone-400">/</span>
            <span class="font-semibold text-stone-700 dark:text-stone-200 truncate">
              {{ currentPageTitle }}
            </span>
          </div>
        </div>

        <!-- Phải: Actions -->
        <div class="flex items-center gap-1 md:gap-2">

          <!-- Dark mode toggle -->
          <UButton
            :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
            color="neutral"
            variant="ghost"
            size="sm"
            :class="isDark ? 'text-amber-400' : 'text-stone-400'"
            @click="toggleColorMode"
          />

          <!-- Notification Bell (placeholder) -->
          <div class="relative">
            <UButton
              icon="i-heroicons-bell"
              color="neutral"
              variant="ghost"
              size="sm"
              class="text-stone-400"
            />
            <!-- Badge đỏ -->
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-stone-900 animate-pulse" />
          </div>

          <!-- Divider -->
          <div class="w-px h-6 bg-stone-200 dark:bg-stone-700 mx-1" />

          <!-- User Dropdown -->
          <UDropdownMenu
            v-if="auth?.isLoggedIn"
            :items="accountMenuItems"
            :ui="{ item: { disabled: 'cursor-text select-text' } }"
            :popper="{ placement: 'bottom-end' }"
          >
            <UButton
              color="neutral"
              variant="ghost"
              class="px-2 py-1.5 h-auto"
            >
              <div class="flex items-center gap-2">
                <!-- Avatar chữ cái -->
                <div class="w-7 h-7 rounded-full bg-marian-blue-100 dark:bg-marian-blue-900 border border-marian-blue-200 dark:border-marian-blue-800 flex items-center justify-center">
                  <span class="text-xs font-black text-marian-blue-700 dark:text-marian-blue-300">
                    {{ (auth?.user?.name || 'A').charAt(0).toUpperCase() }}
                  </span>
                </div>
                <!-- Tên + role (chỉ desktop) -->
                <div class="hidden sm:block text-left">
                  <p class="text-xs font-bold text-stone-700 dark:text-stone-200 leading-tight">
                    {{ auth?.user?.name || 'Admin' }}
                  </p>
                  <p class="text-[10px] text-stone-400 leading-tight">
                    {{ roleName }}
                  </p>
                </div>
                <UIcon name="i-heroicons-chevron-down" class="w-3 h-3 hidden sm:block text-stone-400" />
              </div>
            </UButton>
          </UDropdownMenu>
        </div>
      </header>

      <!-- ─── PAGE SLOT ──────────────────────────────────────── -->
      <main class="flex-1 p-4 md:p-6 pb-24 md:pb-8">
        <slot />
      </main>
    </div>

    <!-- ─────────────────────────────────────────────────────────
         MOBILE BOTTOM NAV (5 items)
         Chỉ hiện trên mobile
    ──────────────────────────────────────────────────────────── -->
    <nav class="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/97 dark:bg-stone-900/97 backdrop-blur-lg border-t border-stone-200/60 dark:border-stone-800/60 pb-safe shadow-xl">
      <div class="grid grid-cols-5 h-14">
        <MobileNavItem
          to="/admin/dashboard"
          icon="i-heroicons-home"
          label="Tổng Quan"
        />
        <MobileNavItem
          to="/admin/students"
          icon="i-heroicons-academic-cap"
          label="Đoàn Sinh"
        />
        <MobileNavItem
          to="/admin/announcements"
          icon="i-heroicons-megaphone"
          label="Thông Báo"
        />
        <MobileNavItem
          to="/admin/documents"
          icon="i-heroicons-document-text"
          label="Tài Liệu"
        />
        <MobileNavItem
          to="/admin/users"
          icon="i-heroicons-users"
          label="Nhân Sự"
        />
      </div>
    </nav>
  </div>
</template>

<script setup>
// ── Inline sub-components (tránh tạo file riêng cho 2 component nhỏ) ──

/**
 * NavItem: Item navigation cho sidebar
 * - Khi expanded: hiện icon + label đầy đủ
 * - Khi collapsed: chỉ hiện icon, có tooltip
 * - Active: nền vàng Vatican nhạt, border trái vàng
 */
const NavItem = defineComponent({
  props: { to: String, icon: String, label: String, expanded: Boolean },
  emits: ['click'],
  setup(props, { emit }) {
    const route = useRoute()
    const isActive = computed(() => route.path === props.to || route.path.startsWith(props.to + '/'))

    return () => h(
      resolveComponent('UTooltip'),
      { text: props.label, disabled: props.expanded, placement: 'right' },
      {
        default: () => h(
          resolveComponent('NuxtLink'),
          {
            to: props.to,
            class: [
              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group w-full',
              isActive.value
                ? 'bg-white/20 text-white border border-white/30 shadow-inner'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            ],
            onClick: () => emit('click')
          },
          {
            default: () => [
              // Icon
              h('div', {
                class: [
                  'w-5 h-5 flex-shrink-0 flex items-center justify-center transition-colors',
                  isActive.value ? 'text-amber-300' : 'text-white/60 group-hover:text-white'
                ]
              }, [
                h(resolveComponent('UIcon'), {
                  name: props.icon,
                  class: 'w-5 h-5'
                })
              ]),
              // Label (chỉ hiện khi expanded)
              props.expanded
                ? h('span', {
                    class: [
                      'text-sm font-semibold leading-none truncate transition-colors',
                      isActive.value ? 'text-white' : 'text-white/70 group-hover:text-white'
                    ]
                  }, props.label)
                : null,
              // Active indicator (dot bên phải khi collapsed)
              !props.expanded && isActive.value
                ? h('div', { class: 'absolute right-1 w-1.5 h-1.5 rounded-full bg-amber-400' })
                : null
            ]
          }
        )
      }
    )
  }
})

/**
 * MobileNavItem: Item navigation cho bottom nav trên mobile
 * - Icon + label nhỏ
 * - Active: màu primary (Marian Blue)
 */
const MobileNavItem = defineComponent({
  props: { to: String, icon: String, label: String },
  setup(props) {
    return () => h(
      resolveComponent('NuxtLink'),
      {
        to: props.to,
        class: 'flex flex-col items-center justify-center gap-0.5 text-stone-400 hover:text-marian-blue-600 dark:hover:text-marian-blue-400 transition-colors',
        activeClass: 'text-marian-blue-600 dark:text-marian-blue-400'
      },
      {
        default: () => [
          h(resolveComponent('UIcon'), { name: props.icon, class: 'w-5 h-5' }),
          h('span', { class: 'text-[9px] font-bold leading-tight' }, props.label)
        ]
      }
    )
  }
})

// ── State & Composables ──
const isSidebarOpen = ref(false)
const auth = useAuthStore()
const colorMode = useColorMode()
const route = useRoute()

const isDark = computed(() => colorMode.value === 'dark')

// Map tên trang theo route
const pageTitleMap = {
  '/admin/dashboard': 'Tổng Quan',
  '/admin/students': 'Quản Lý Đoàn Sinh',
  '/admin/reports': 'Báo Cáo',
  '/admin/users': 'Tài Khoản',
  '/admin/roles': 'Phân Quyền',
  '/admin/announcements': 'Thông Báo',
  '/admin/documents': 'Tài Liệu Số',
  '/admin/leaders': 'Ban Trưởng',
  '/admin/news': 'Tin Tức RSS',
  '/admin/liturgical': 'Lịch Phụng Vụ',
}

// Tiêu đề trang hiện tại cho breadcrumb
const currentPageTitle = computed(() => {
  const path = route.path
  // Kiểm tra exact match trước
  if (pageTitleMap[path]) return pageTitleMap[path]
  // Tìm prefix match
  const match = Object.keys(pageTitleMap).find(k => path.startsWith(k + '/'))
  return match ? pageTitleMap[match] : 'Quản Trị'
})

// Map vai trò người dùng sang tên tiếng Việt
const roleName = computed(() => {
  const role = auth?.user?.role
  const map = {
    'SystemAdmin': 'Quản Trị Hệ Thống',
    'ExecutiveBoard': 'Ban Điều Hành',
    'DivisionLeader': 'Phân Đoàn Trưởng',
    'Catechist': 'Giáo Lý Viên',
    'SecretaryTreasurer': 'Thư Ký / Thủ Quỹ'
  }
  return map[role] || 'Thành Viên'
})

// Menu dropdown tài khoản
const accountMenuItems = computed(() => {
  return [
    [{
      label: auth?.user?.name || 'Admin',
      disabled: true,
      icon: 'i-heroicons-user-circle'
    }],
    [{
      label: 'Trang Cá Nhân',
      icon: 'i-heroicons-user-circle',
      to: '/profile'
    }],
    [{
      label: 'Đăng xuất',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      click: () => auth?.logout()
    }]
  ]
})

// Toggle dark/light mode
const toggleColorMode = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

// Đóng sidebar khi click nav item trên mobile
const closeOnMobile = () => {
  if (window.innerWidth < 768) isSidebarOpen.value = false
}
</script>

<style scoped>
/* Transition cho label text trong sidebar khi expand/collapse */
.slide-label-enter-active,
.slide-label-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-label-enter-from,
.slide-label-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

/* Fade cho mobile backdrop */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-11"></a>📄 [11/71] File: `web-admin/middleware/auth.global.ts`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Middleware (Route Guards) | **Số dòng:** 46 | **Kích thước:** 1.6 KB

```typescript
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // Các trang công khai không cần đăng nhập
  const isPublicRoute
    = to.path === '/login'
      || to.path === '/'
      || to.path === '/public-leadership'
      || to.path === '/announcements'
      || to.path === '/library'
      || to.path === '/verify'
      || to.path.startsWith('/verify/')

  if (!authStore.isLoggedIn && !isPublicRoute) {
    return navigateTo('/login')
  }

  if (authStore.isLoggedIn && to.path === '/login') {
    return navigateTo('/admin/dashboard')
  }

  if (to.path.startsWith('/admin')) {
    const role = authStore.user?.role
    // Nếu không có role (hoặc lỗi), đá ra login
    if (!role) return navigateTo('/login')

    // Role 1 (Admin) được truy cập mọi nơi
    if (authStore.isAdmin) return

    // Các Route yêu cầu quyền cụ thể (RBAC)
    if (to.path.startsWith('/admin/users') && !authStore.hasPermission('users.view')) {
      return abortNavigation('Bạn không có quyền truy cập quản lý người dùng')
    }
    
    if (to.path.startsWith('/admin/roles') && !authStore.hasPermission('roles.view')) {
      return abortNavigation('Bạn không có quyền truy cập phân quyền hệ thống')
    }

    // (Tuỳ chọn) Nếu là Role 4 (GLV), có thể chặn thêm các route quản lý tổng, chỉ cho vào Dashboard và Lớp của mình
    const glvRestrictedRoutes = ['/admin/leaders']
    if (role === 4 && glvRestrictedRoutes.some(r => to.path.startsWith(r))) {
      return abortNavigation('Giáo lý viên không có quyền truy cập khu vực này')
    }
  }
})

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-12"></a>📄 [12/71] File: `web-admin/nuxt.config.ts`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** App & Build Config (Cấu hình) | **Số dòng:** 56 | **Kích thước:** 1.0 KB

```typescript
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-13"></a>📄 [13/71] File: `web-admin/package.json`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** App & Build Config (Cấu hình) | **Số dòng:** 37 | **Kích thước:** 0.9 KB

```json
{
  "name": "web-admin",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev --port 3000",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare",
    "lint": "eslint .",
    "typecheck": "nuxt typecheck"
  },
  "dependencies": {
    "@iconify-json/lucide": "^1.2.117",
    "@iconify-json/simple-icons": "^1.2.90",
    "@nuxt/ui": "^4.10.0",
    "@pinia/nuxt": "^0.11.3",
    "@vueuse/core": "^14.3.0",
    "isomorphic-dompurify": "^3.17.0",
    "mammoth": "^1.12.0",
    "nuxt": "^4.4.8",
    "pinia": "^3.0.4",
    "tailwindcss": "^4.3.2",
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "@nuxt/eslint": "^1.15.2",
    "@nuxtjs/google-fonts": "^3.2.0",
    "@tailwindcss/typography": "^0.5.20",
    "eslint": "^10.3.0",
    "typescript": "^6.0.3",
    "vue-tsc": "^3.2.8",
    "xlsx": "^0.18.5"
  },
  "packageManager": "pnpm@11.13.1"
}

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-14"></a>📄 [14/71] File: `web-admin/pages/admin/academic-years.vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Admin Pages (Quản trị) | **Số dòng:** 357 | **Kích thước:** 19.7 KB

```markup
<template>
  <div class="min-h-screen font-sans relative pb-24 overflow-hidden">
    <!-- BACKGROUND MESH GRADIENT -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob bg-fuchsia-200 dark:bg-fuchsia-900"></div>
      <div class="absolute -bottom-32 left-0 w-[40vw] h-[40vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-emerald-200 dark:bg-emerald-900"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
    </div>

    <div class="relative z-10 space-y-6 animate-fade-in-up px-4 md:px-8 pt-8 max-w-7xl mx-auto">
      <!-- ── PAGE HEADER & BANNER ── -->
      <div class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-fuchsia-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="z-10 text-center md:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/50 text-fuchsia-600 dark:text-fuchsia-300 text-xs font-black uppercase tracking-widest border border-fuchsia-200 dark:border-fuchsia-800 shadow-inner">
            <UIcon name="i-heroicons-calendar-days" class="w-4 h-4" />
            <span>Phân Hệ Học Vụ</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-stone-800 dark:text-white tracking-tight">
            Quản Lý <span class="text-fuchsia-500">Niên Khóa</span>
          </h1>
          <p class="text-stone-500 text-sm mt-2 max-w-lg">
            Thiết lập năm học, lên lớp tự động và sao chép cấu trúc dữ liệu qua các năm.
          </p>
        </div>
        
        <div class="flex flex-wrap items-center justify-center gap-3 z-10">
          <UButton
            icon="i-heroicons-document-duplicate"
            label="Sao chép từ năm cũ"
            color="white"
            variant="solid"
            size="lg"
            class="rounded-2xl shadow-sm hover:-translate-y-0.5 transition-transform font-bold"
            @click="openCloneModal"
          />
          <UButton
            icon="i-heroicons-sparkles"
            label="Lên Lớp Tự Động"
            color="emerald"
            variant="soft"
            size="lg"
            class="rounded-2xl shadow-sm hover:-translate-y-0.5 transition-transform font-bold"
            @click="openPromoteModal"
          />
          <UButton
            icon="i-heroicons-plus"
            label="Tạo Niên Khóa"
            color="fuchsia"
            variant="solid"
            size="lg"
            class="rounded-2xl shadow-lg shadow-fuchsia-500/20 hover:-translate-y-0.5 transition-transform font-bold uppercase tracking-wider"
            @click="isCreateOpen = true"
          />
        </div>
      </div>

      <!-- Active year banner -->
      <div v-if="activeYear" class="bg-gradient-to-r from-emerald-500 to-teal-400 p-1 rounded-3xl shadow-xl shadow-emerald-500/20 animate-fade-in-up">
        <div class="bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl rounded-[1.4rem] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
              <UIcon name="i-heroicons-check-badge" class="w-7 h-7" />
            </div>
            <div>
              <p class="text-xs font-bold text-stone-500 uppercase tracking-widest">Niên khóa đang hoạt động</p>
              <h2 class="text-2xl font-black text-stone-800 dark:text-white">{{ activeYear.name }}</h2>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-bold text-stone-500"><UIcon name="i-heroicons-calendar" class="inline-block mr-1" /> {{ formatDate(activeYear.startDate) }} — {{ formatDate(activeYear.endDate) }}</p>
          </div>
        </div>
      </div>

      <!-- DRAFT ACTIONS BUTTON -->
      <div class="flex justify-end">
        <UButton
          icon="i-heroicons-clipboard-document-check"
          label="Chuyển đến: Xét Duyệt Bản Nháp Lên Lớp"
          color="amber"
          variant="soft"
          size="lg"
          class="rounded-2xl font-bold uppercase tracking-wider shadow-sm"
          to="/admin/draft-actions"
        />
      </div>

      <!-- List of years (Grid) -->
      <div v-if="!pending && !years?.length" class="text-center py-24 text-stone-400 bg-white/40 dark:bg-stone-900/40 rounded-[2rem] border border-white/50 dark:border-stone-800">
        <UIcon name="i-heroicons-calendar" class="w-16 h-16 mx-auto mb-4 opacity-30" />
        <p class="text-lg font-bold">Chưa có niên khóa nào. Hãy tạo niên khóa đầu tiên!</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="year in years"
          :key="year.id"
          class="group bg-white/50 dark:bg-stone-900/50 backdrop-blur-xl border border-white/60 dark:border-stone-800 rounded-3xl p-6 shadow-xl shadow-black/5 flex flex-col transition-all relative overflow-hidden"
          :class="year.isActive ? 'ring-2 ring-emerald-500 shadow-emerald-500/10' : 'hover:border-fuchsia-300 dark:hover:border-fuchsia-700/50 hover:-translate-y-1'"
        >
          <div v-if="year.isActive" class="absolute inset-0 bg-gradient-to-br from-emerald-100/30 to-transparent dark:from-emerald-900/10 pointer-events-none"></div>
          
          <div class="relative z-10 flex-1">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-3">
                <div :class="['w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner', year.isActive ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500']">
                  <UIcon name="i-heroicons-academic-cap" class="w-5 h-5" />
                </div>
                <div>
                  <h3 class="font-black text-xl text-stone-800 dark:text-white leading-none">{{ year.name }}</h3>
                </div>
              </div>
              <UBadge v-if="year.isActive" label="ACTIVE" color="emerald" variant="soft" size="xs" class="font-black uppercase tracking-widest rounded-lg animate-pulse" />
            </div>
            
            <p class="text-sm font-bold text-stone-500 mb-6 bg-stone-100/50 dark:bg-stone-800/50 p-2 rounded-xl text-center">
              {{ formatDate(year.startDate) }} — {{ formatDate(year.endDate) }}
            </p>
          </div>

          <div class="relative z-10 pt-4 border-t border-stone-200/50 dark:border-stone-800/50 flex items-center justify-between gap-2">
            <UButton
              icon="i-heroicons-squares-2x2"
              color="neutral"
              variant="ghost"
              size="sm"
              class="rounded-xl flex-1 justify-center bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 font-bold"
              :to="`/admin/academic-years/${year.id}`"
              label="Xem Lớp Học"
            />
            <UButton
              v-if="!year.isActive"
              label="Kích hoạt"
              icon="i-heroicons-bolt"
              color="fuchsia"
              variant="soft"
              size="sm"
              class="rounded-xl font-bold uppercase tracking-wider"
              :loading="activating === year.id"
              @click="activateYear(year.id)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         MODALS (Create, Promote, Clone)
    ═══════════════════════════════════════════════════════ -->

    <!-- Modal Tạo Niên Khóa -->
    <UModal v-model:open="isCreateOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' }, footer: { padding: 'p-6 bg-stone-50 dark:bg-stone-900' } }">
        <template #header>
          <div class="bg-fuchsia-600 dark:bg-fuchsia-900 p-6 flex justify-between items-center text-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><UIcon name="i-heroicons-calendar-days" class="w-6 h-6" /></div>
              <h3 class="text-xl font-black uppercase tracking-wide">Tạo Niên Khóa Mới</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="white" variant="ghost" class="hover:bg-white/10 rounded-full" @click="isCreateOpen = false" />
          </div>
        </template>
        <form id="year-form" class="p-6 space-y-6" @submit.prevent="createYear">
          <UFormField label="Tên niên khóa" required>
            <UInput v-model="yearForm.name" placeholder="Ví dụ: 2025-2026" class="w-full" :ui="{ base: 'rounded-xl' }" />
          </UFormField>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Ngày bắt đầu"><UInput v-model="yearForm.startDate" type="date" class="w-full" :ui="{ base: 'rounded-xl' }" /></UFormField>
            <UFormField label="Ngày kết thúc"><UInput v-model="yearForm.endDate" type="date" class="w-full" :ui="{ base: 'rounded-xl' }" /></UFormField>
          </div>
          <div class="flex items-center gap-3 p-4 bg-fuchsia-50 dark:bg-fuchsia-900/20 rounded-xl border border-fuchsia-100 dark:border-fuchsia-800 mt-2">
            <UToggle v-model="yearForm.isActive" color="fuchsia" />
            <span class="text-sm font-bold text-fuchsia-700 dark:text-fuchsia-300">Đặt làm niên khóa hoạt động ngay</span>
          </div>
        </form>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Hủy" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isCreateOpen = false" />
            <UButton type="submit" form="year-form" label="Khởi Tạo" color="fuchsia" variant="solid" size="lg" class="rounded-xl font-black uppercase shadow-lg shadow-fuchsia-500/20" :loading="isSubmitting" />
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Modal Lên Lớp Tự Động (Smart Promotion) -->
    <UModal v-model:open="isPromoteOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' }, footer: { padding: 'p-6 bg-stone-50 dark:bg-stone-900' } }">
        <template #header>
          <div class="bg-emerald-600 dark:bg-emerald-900 p-6 flex justify-between items-center text-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><UIcon name="i-heroicons-sparkles" class="w-6 h-6" /></div>
              <h3 class="text-xl font-black uppercase tracking-wide">Lên Lớp Tự Động</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="white" variant="ghost" class="hover:bg-white/10 rounded-full" @click="isPromoteOpen = false" />
          </div>
        </template>
        <div class="p-6 space-y-6">
          <div class="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-start gap-3 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
            <UIcon name="i-heroicons-information-circle" class="w-6 h-6 shrink-0" />
            <p>Hệ thống sẽ quét toàn bộ danh sách lớp học của Niên Khóa Nguồn và tự động thăng hạng học sinh (ví dụ: Ấu 1 -> Ấu 2) sang Niên Khóa Đích. Dữ liệu sẽ lưu ở dạng <b>Bản Nháp (Draft)</b> để bạn kiểm duyệt trước khi chính thức áp dụng.</p>
          </div>
          <UFormField label="Niên Khóa Nguồn (Năm cũ)" required>
            <USelect v-model="promoteForm.sourceYearId" :options="yearOptions" placeholder="Chọn niên khóa nguồn..." class="w-full" :ui="{ base: 'rounded-xl' }" />
          </UFormField>
          <UFormField label="Niên Khóa Đích (Năm mới)" required>
            <USelect v-model="promoteForm.targetYearId" :options="yearOptions" placeholder="Chọn niên khóa đích..." class="w-full" :ui="{ base: 'rounded-xl' }" />
          </UFormField>
        </div>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Hủy" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isPromoteOpen = false" />
            <UButton label="Tiến Hành Thăng Lớp" color="emerald" variant="solid" size="lg" class="rounded-xl font-black uppercase shadow-lg shadow-emerald-500/20" :loading="isPromoting" @click="executePromotion" />
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Modal Sao chép dữ liệu (Smart Cloning) -->
    <UModal v-model:open="isCloneOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' }, footer: { padding: 'p-6 bg-stone-50 dark:bg-stone-900' } }">
        <template #header>
          <div class="bg-blue-600 dark:bg-blue-900 p-6 flex justify-between items-center text-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><UIcon name="i-heroicons-document-duplicate" class="w-6 h-6" /></div>
              <h3 class="text-xl font-black uppercase tracking-wide">Sao Chép Dữ Liệu</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="white" variant="ghost" class="hover:bg-white/10 rounded-full" @click="isCloneOpen = false" />
          </div>
        </template>
        <div class="p-6 space-y-6">
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl flex items-start gap-3 text-blue-700 dark:text-blue-300 text-sm font-medium">
            <UIcon name="i-heroicons-information-circle" class="w-6 h-6 shrink-0" />
            <p>Hệ thống sẽ sao chép cấu trúc Lớp học (Tên lớp, ngành) từ Niên Khóa Cũ sang Niên Khóa Mới. (Không sao chép học sinh, chỉ sao chép cấu trúc "Vỏ").</p>
          </div>
          <UFormField label="Từ Niên Khóa Cũ" required>
            <USelect v-model="cloneForm.oldYearId" :options="yearOptions" placeholder="Chọn niên khóa nguồn..." class="w-full" :ui="{ base: 'rounded-xl' }" />
          </UFormField>
          <UFormField label="Đến Niên Khóa Mới" required>
            <USelect v-model="cloneForm.newYearId" :options="yearOptions" placeholder="Chọn niên khóa đích..." class="w-full" :ui="{ base: 'rounded-xl' }" />
          </UFormField>
        </div>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Hủy" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isCloneOpen = false" />
            <UButton label="Thực Hiện Sao Chép" color="blue" variant="solid" size="lg" class="rounded-xl font-black uppercase shadow-lg shadow-blue-500/20" :loading="isCloning" @click="executeClone" />
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
useHead({ title: 'Quản Lý Niên Khóa - GiaoLy Admin' })

const toast = useToast()

const { data: years, pending, refresh } = await useApiFetch('/AcademicYear')
const activeYear = computed(() => years.value?.find(y => y.isActive))

const yearOptions = computed(() => {
  return years.value?.map(y => ({ value: y.id, label: y.name })) ?? []
})

const formatDate = (d) => {
  if (!d) return '---'
  return new Date(d).toLocaleDateString('vi-VN')
}

// ── CREATE YEAR ──
const isCreateOpen = ref(false)
const isSubmitting = ref(false)
const yearForm = reactive({ name: '', startDate: '', endDate: '', isActive: false })

const createYear = async () => {
  isSubmitting.value = true
  try {
    await $api('/AcademicYear', { method: 'POST', body: { ...yearForm } })
    isCreateOpen.value = false
    Object.assign(yearForm, { name: '', startDate: '', endDate: '', isActive: false })
    await refresh()
    toast.add({ title: 'Đã tạo niên khóa mới!', color: 'success' })
  } catch { toast.add({ title: 'Lỗi khởi tạo', color: 'error' }) } 
  finally { isSubmitting.value = false }
}

const activating = ref(null)
const activateYear = async (id) => {
  activating.value = id
  try {
    await $api('/AcademicYear/activate-new-year', { method: 'POST', body: id })
    await refresh()
    toast.add({ title: 'Đã chuyển đổi niên khóa hoạt động!', color: 'success' })
  } catch { toast.add({ title: 'Lỗi kích hoạt', color: 'error' }) } 
  finally { activating.value = null }
}

// ── SMART PROMOTION ──
const isPromoteOpen = ref(false)
const isPromoting = ref(false)
const promoteForm = reactive({ sourceYearId: '', targetYearId: '' })

const openPromoteModal = () => {
  promoteForm.sourceYearId = ''
  promoteForm.targetYearId = activeYear.value?.id || ''
  isPromoteOpen.value = true
}

const executePromotion = async () => {
  if (!promoteForm.sourceYearId || !promoteForm.targetYearId) {
    return toast.add({ title: 'Thiếu thông tin', description: 'Vui lòng chọn đủ 2 niên khóa.', color: 'error' })
  }
  isPromoting.value = true
  try {
    const res = await $api('/Enrollment/promote', { method: 'POST', body: promoteForm })
    isPromoteOpen.value = false
    toast.add({ title: 'Thăng lớp thành công!', description: `Đã tạo Bản Nháp (Draft) cho ${res.count} đoàn sinh.`, color: 'success' })
  } catch (err) { toast.add({ title: 'Lỗi thăng lớp', description: err.data?.message || err.message, color: 'error' }) } 
  finally { isPromoting.value = false }
}

// ── SMART CLONING ──
const isCloneOpen = ref(false)
const isCloning = ref(false)
const cloneForm = reactive({ oldYearId: '', newYearId: '' })

const openCloneModal = () => {
  cloneForm.oldYearId = ''
  cloneForm.newYearId = activeYear.value?.id || ''
  isCloneOpen.value = true
}

const executeClone = async () => {
  if (!cloneForm.oldYearId || !cloneForm.newYearId) {
    return toast.add({ title: 'Thiếu thông tin', description: 'Vui lòng chọn đủ 2 niên khóa.', color: 'error' })
  }
  isCloning.value = true
  try {
    const res = await $api('/AcademicYear/clone', { method: 'POST', body: cloneForm })
    isCloneOpen.value = false
    toast.add({ title: 'Sao chép thành công!', description: res.message || 'Cấu trúc lớp đã được sao chép.', color: 'success' })
  } catch (err) { toast.add({ title: 'Lỗi sao chép', description: err.data?.message || err.message, color: 'error' }) } 
  finally { isCloning.value = false }
}
</script>

<style>
@keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
.animate-blob { animation: blob 10s infinite; }
.animation-delay-2000 { animation-delay: 2s; }
@keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-15"></a>📄 [15/71] File: `web-admin/pages/admin/academic-years/[id].vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Admin Pages (Quản trị) | **Số dòng:** 408 | **Kích thước:** 11.7 KB

```markup
<template>
  <UContainer class="py-10 space-y-8">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-stone-500">
      <NuxtLink
        to="/admin/academic-years"
        class="hover:text-primary-500 transition-colors"
      >
        Niên Khóa
      </NuxtLink>
      <UIcon
        name="i-heroicons-chevron-right"
        class="w-4 h-4"
      />
      <span class="font-semibold text-stone-800 dark:text-white">{{ year?.name ?? '...' }}</span>
    </div>

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-black text-stone-800 dark:text-white">
          Lớp Học <span class="text-primary-500">{{ year?.name }}</span>
        </h1>
        <p class="text-stone-500 text-sm mt-1">
          Quản lý danh sách lớp học trong niên khóa này.
        </p>
      </div>
      <UButton
        icon="i-heroicons-plus"
        label="Thêm Lớp Học"
        color="primary"
        @click="isCreateOpen = true"
      />
    </div>

    <!-- Loading -->
    <div
      v-if="pendingRooms"
      class="flex justify-center py-10"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 animate-spin text-primary-500"
      />
    </div>

    <!-- Grid lớp học theo ngành -->
    <div
      v-for="branch in branches"
      :key="branch.id"
      class="space-y-3"
    >
      <div class="flex items-center gap-3">
        <UBadge
          :label="branch.name"
          :color="branch.color"
          variant="soft"
          size="lg"
        />
        <span class="text-xs text-stone-400">
          {{ roomsByBranch(branch.id).length }} lớp
        </span>
      </div>

      <div
        v-if="roomsByBranch(branch.id).length === 0"
        class="text-sm text-stone-400 pl-2 italic"
      >
        Chưa có lớp học nào.
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <UCard
          v-for="room in roomsByBranch(branch.id)"
          :key="room.id"
          class="hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer group relative"
        >
          <div class="flex items-start justify-between">
            <NuxtLink
              :to="`/admin/classrooms/${room.id}`"
              class="flex-1 min-w-0"
            >
              <h3 class="font-bold text-stone-800 dark:text-white text-lg hover:text-primary-500 transition-colors">
                {{ room.className }}
              </h3>
              <p class="text-sm text-stone-500 mt-1">
                <UIcon
                  name="i-heroicons-user"
                  class="inline w-3 h-3 mr-1 text-primary-500"
                />
                GLV: {{ room.mainTeacher || 'Chưa phân công' }}
              </p>
              <p
                v-if="room.roomName"
                class="text-sm text-stone-500 mt-0.5"
              >
                <UIcon
                  name="i-heroicons-map-pin"
                  class="inline w-3 h-3 mr-1 text-amber-500"
                />
                {{ room.roomName }}
              </p>
            </NuxtLink>
            <div class="flex gap-1 ml-2 flex-shrink-0">
              <UButton
                icon="i-heroicons-pencil-square"
                color="neutral"
                variant="ghost"
                size="xs"
                @click.stop="openEditRoom(room)"
              />
              <UButton
                icon="i-heroicons-trash"
                color="red"
                variant="ghost"
                size="xs"
                @click.stop="deleteRoom(room.id)"
              />
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="!pendingRooms && !classRooms?.length"
      class="text-center py-20 text-stone-400"
    >
      <UIcon
        name="i-heroicons-squares-2x2"
        class="w-14 h-14 mx-auto mb-4 opacity-30"
      />
      <p class="text-lg">
        Chưa có lớp học nào trong niên khóa này.
      </p>
    </div>

    <!-- Modal tạo lớp học -->
    <UModal
      v-model:open="isCreateOpen"
      title="Thêm Lớp Học Mới"
    >
      <template #body>
        <form
          id="room-form"
          class="p-4 space-y-4"
          @submit.prevent="createRoom"
        >
          <UFormField
            label="Tên lớp"
            required
          >
            <UInput
              v-model="roomForm.className"
              placeholder="Ví dụ: Khối Ấu 1 - Lớp A"
              class="w-full"
            />
          </UFormField>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Ngành">
              <USelect
                v-model="roomForm.branch"
                :options="branchOptions"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Phòng / địa điểm">
              <UInput
                v-model="roomForm.roomName"
                placeholder="Ví dụ: Phòng 3"
                class="w-full"
              />
            </UFormField>
          </div>
          <UFormField label="Tài khoản GLV Chủ nhiệm (Dùng phân quyền nhập điểm)">
            <USelect
              v-model="roomForm.leaderId"
              :options="userOptions"
              placeholder="-- Chọn tài khoản Giáo Lý Viên --"
              class="w-full"
            />
          </UFormField>
        </form>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton
            label="Hủy"
            color="neutral"
            variant="ghost"
            @click="isCreateOpen = false"
          />
          <UButton
            type="submit"
            form="room-form"
            label="Thêm lớp"
            :loading="isSubmitting"
          />
        </div>
      </template>
    </UModal>
    <!-- Modal chỉnh sửa lớp học -->
    <UModal
      v-model:open="isEditOpen"
      title="Cập Nhật Thông Tin Lớp Học"
    >
      <template #body>
        <form
          id="edit-room-form"
          class="p-4 space-y-4"
          @submit.prevent="updateRoom"
        >
          <UFormField
            label="Tên lớp"
            required
          >
            <UInput
              v-model="editRoomForm.className"
              placeholder="Ví dụ: Khối Ấu 1 - Lớp A"
              class="w-full"
            />
          </UFormField>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Ngành">
              <USelect
                v-model="editRoomForm.branch"
                :options="branchOptions"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Phòng / địa điểm">
              <UInput
                v-model="editRoomForm.roomName"
                placeholder="Ví dụ: Phòng 3"
                class="w-full"
              />
            </UFormField>
          </div>
          <UFormField label="Tài khoản GLV Chủ nhiệm (Dùng phân quyền nhập điểm)">
            <USelect
              v-model="editRoomForm.leaderId"
              :options="userOptions"
              placeholder="-- Chọn tài khoản Giáo Lý Viên --"
              class="w-full"
            />
          </UFormField>
        </form>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton
            label="Hủy"
            color="neutral"
            variant="ghost"
            @click="isEditOpen = false"
          />
          <UButton
            type="submit"
            form="edit-room-form"
            label="Cập nhật lớp"
            :loading="isEditSubmitting"
          />
        </div>
      </template>
    </UModal>
  </UContainer>
</template>

<script setup>
definePageMeta({ layout: 'default' })

const route = useRoute()
const toast = useToast()
const yearId = route.params.id

const { data: year } = await useApiFetch(`/AcademicYear`)
const currentYear = computed(() => year.value?.find(y => y.id === yearId))

const { data: classRooms, pending: pendingRooms, refresh } = await useApiFetch(`/AcademicYear/${yearId}/classrooms`, {
  default: () => []
})

const { data: users } = await useApiFetch('/User')
const userOptions = computed(() => {
  if (!users.value) return []
  // Chỉ lấy những user có role 1, 2, 3 (Admin, Secretary, Mod) làm GLV
  return users.value.map(u => ({
    value: u.id,
    label: u.fullName || u.username
  }))
})

useHead({ title: computed(() => `Lớp học - ${currentYear.value?.name ?? 'Niên khóa'} | GiaoLy`) })

const branches = [
  { id: 1, name: 'Ấu Nhi', color: 'success' },
  { id: 2, name: 'Thiếu Nhi', color: 'primary' },
  { id: 3, name: 'Nghĩa Sĩ', color: 'warning' },
  { id: 4, name: 'Hiệp Sĩ', color: 'error' }
]

const branchOptions = branches.map(b => ({ value: b.id, label: b.name }))

const roomsByBranch = branchId => classRooms.value?.filter(r => r.branch === branchId) ?? []

const isCreateOpen = ref(false)
const isSubmitting = ref(false)

const roomForm = reactive({
  className: '',
  branch: 1,
  mainTeacher: '',
  leaderId: '',
  roomName: ''
})

// Edit room
const isEditOpen = ref(false)
const isEditSubmitting = ref(false)
const currentEditRoomId = ref(null)

const editRoomForm = reactive({
  className: '',
  branch: 1,
  mainTeacher: '',
  leaderId: '',
  roomName: ''
})

const openEditRoom = (room) => {
  currentEditRoomId.value = room.id
  Object.assign(editRoomForm, {
    className: room.className,
    branch: room.branch,
    mainTeacher: room.mainTeacher || '',
    leaderId: room.leaderId || '',
    roomName: room.roomName || ''
  })
  isEditOpen.value = true
}

const updateRoom = async () => {
  isEditSubmitting.value = true
  try {
    // Tự động gán mainTeacher text dựa trên user được chọn (để tương thích ngược với UI cũ)
    const selectedUser = userOptions.value.find(u => u.value === editRoomForm.leaderId)
    const teacherName = selectedUser ? selectedUser.label : ''

    await $api(`/AcademicYear/classrooms/${currentEditRoomId.value}`, {
      method: 'PUT',
      body: {
        id: currentEditRoomId.value,
        academicYearId: yearId,
        ...editRoomForm,
        mainTeacher: teacherName,
        leaderId: editRoomForm.leaderId || null,
        branch: parseInt(editRoomForm.branch)
      }
    })
    isEditOpen.value = false
    await refresh()
    toast.add({ title: 'Đã cập nhật lớp học!', color: 'success' })
  } catch {
    toast.add({ title: 'Lỗi khi cập nhật lớp học', color: 'error' })
  } finally {
    isEditSubmitting.value = false
  }
}

const createRoom = async () => {
  isSubmitting.value = true
  try {
    const selectedUser = userOptions.value.find(u => u.value === roomForm.leaderId)
    const teacherName = selectedUser ? selectedUser.label : ''

    await $api(`/AcademicYear/${yearId}/classrooms`, {
      method: 'POST',
      body: {
        ...roomForm,
        mainTeacher: teacherName,
        leaderId: roomForm.leaderId || null,
        branch: parseInt(roomForm.branch)
      }
    })
    isCreateOpen.value = false
    Object.assign(roomForm, { className: '', branch: 1, mainTeacher: '', leaderId: '', roomName: '' })
    await refresh()
    toast.add({ title: 'Đã thêm lớp học!', color: 'success' })
  } catch {
    toast.add({ title: 'Lỗi khi tạo lớp học', color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

const deleteRoom = async (id) => {
  if (!confirm('Xóa lớp học này?')) return
  try {
    await $api(`/AcademicYear/classrooms/${id}`, { method: 'DELETE' })
    await refresh()
    toast.add({ title: 'Đã xóa lớp học', color: 'success' })
  } catch {
    toast.add({ title: 'Lỗi khi xóa', color: 'error' })
  }
}
</script>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-16"></a>📄 [16/71] File: `web-admin/pages/admin/announcements.vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Admin Pages (Quản trị) | **Số dòng:** 316 | **Kích thước:** 20.1 KB

```markup
<template>
  <div class="min-h-screen font-sans relative pb-24 overflow-hidden">
    <!-- BACKGROUND MESH GRADIENT -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute top-0 -left-32 w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob bg-purple-200 dark:bg-purple-900"></div>
      <div class="absolute -bottom-32 right-0 w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-orange-200 dark:bg-orange-900"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
    </div>

    <div class="relative z-10 space-y-6 animate-fade-in-up px-4 md:px-8 pt-8 max-w-7xl mx-auto">
      <!-- ── PAGE HEADER & BANNER ── -->
      <div class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="z-10 text-center md:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 text-xs font-black uppercase tracking-widest border border-purple-200 dark:border-purple-800 shadow-inner">
            <UIcon name="i-heroicons-megaphone" class="w-4 h-4" />
            <span>Phân Hệ Nội Dung</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-stone-800 dark:text-white tracking-tight">
            Quản Lý <span class="text-purple-500">Thông Báo</span>
          </h1>
          <p class="text-stone-500 text-sm mt-2 max-w-lg">
            Khởi tạo, phát sóng và quản lý các thông báo quan trọng đến toàn thể đoàn sinh và phụ huynh.
          </p>
        </div>
        
        <div class="flex flex-wrap items-center justify-center gap-3 z-10">
          <UButton
            v-if="auth?.hasPermission('announcements.create')"
            label="Đăng Thông Báo Mới"
            icon="i-heroicons-plus"
            color="purple"
            variant="solid"
            size="lg"
            class="rounded-2xl shadow-lg shadow-purple-500/20 hover:-translate-y-0.5 transition-transform font-bold uppercase tracking-wider"
            @click="openCreate"
          />
        </div>
      </div>

      <!-- ── FILTER BAR ── -->
      <div class="flex justify-center md:justify-start">
        <div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-xl p-1.5 rounded-2xl border border-white/60 dark:border-stone-800 shadow-sm inline-flex">
          <button
            v-for="f in typeFilters"
            :key="f.value"
            class="px-6 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 uppercase tracking-widest"
            :class="activeType === f.value ? 'bg-purple-500 text-white shadow-md' : 'text-stone-500 hover:text-purple-600 hover:bg-white dark:hover:bg-stone-800'"
            @click="activeType = f.value"
          >
            {{ f.label }}
          </button>
        </div>
      </div>

      <!-- ── LOADING ── -->
      <div v-if="pending" class="flex flex-col items-center justify-center py-24">
        <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 animate-spin text-purple-400 mb-4" />
        <p class="text-stone-500 font-bold uppercase tracking-widest text-sm">Đang tải thông báo...</p>
      </div>

      <!-- ── EMPTY ── -->
      <div v-else-if="!filtered.length" class="text-center py-24 bg-white/40 dark:bg-stone-900/40 backdrop-blur-xl rounded-[2rem] border border-white/50 dark:border-stone-800 shadow-sm">
        <UIcon name="i-heroicons-megaphone" class="w-16 h-16 text-stone-300 dark:text-stone-700 mx-auto mb-4" />
        <p class="text-stone-500 font-bold text-lg">Chưa có thông báo nào trong mục này.</p>
        <UButton v-if="auth?.hasPermission('announcements.create')" label="Tạo thông báo đầu tiên" variant="soft" color="purple" class="mt-4 rounded-xl font-bold" @click="openCreate" />
      </div>

      <!-- ── MASONRY GRID LIST ── -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in filtered"
          :key="item.id"
          class="group bg-white/50 dark:bg-stone-900/50 backdrop-blur-xl border rounded-[2rem] p-6 shadow-xl shadow-black/5 flex flex-col transition-all relative overflow-hidden"
          :class="[
            item.type === 'Urgent' ? 'border-red-400/50 hover:border-red-500 shadow-red-500/10 hover:shadow-red-500/20' : 
            item.type === 'Event' ? 'border-amber-400/50 hover:border-amber-500 shadow-amber-500/10 hover:shadow-amber-500/20' : 
            'border-white/60 dark:border-stone-800 hover:border-purple-400 hover:shadow-purple-500/10 hover:-translate-y-1'
          ]"
        >
          <!-- Radiant Background for Urgent -->
          <div v-if="item.type === 'Urgent'" class="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent pointer-events-none"></div>
          
          <div class="relative z-10 flex-1">
            <div class="flex justify-between items-start mb-4">
              <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner', typeIconBg(item.type), typeIconColor(item.type)]">
                <UIcon :name="typeIcon(item.type)" class="w-6 h-6" />
              </div>
              <div class="flex flex-col items-end gap-2">
                <UBadge :label="typeBadge(item.type).label" :color="typeBadge(item.type).color" variant="soft" size="xs" class="font-black uppercase tracking-widest rounded-lg" />
                <UBadge v-if="item.expiryDate && isExpired(item.expiryDate)" label="HẾT HẠN" color="neutral" variant="solid" size="xs" class="font-black tracking-widest rounded-lg" />
              </div>
            </div>

            <h3 class="font-black text-xl text-stone-800 dark:text-white leading-tight mb-2 group-hover:text-purple-600 transition-colors">{{ item.title }}</h3>
            
            <p class="text-xs font-bold text-stone-500 mt-4 space-y-1">
              <span class="flex items-center gap-2"><UIcon name="i-heroicons-user" class="w-4 h-4" /> {{ item.author }}</span>
              <span class="flex items-center gap-2"><UIcon name="i-heroicons-clock" class="w-4 h-4" /> {{ formatDate(item.createdDate) }}</span>
              <span class="flex items-center gap-2 text-purple-600 dark:text-purple-400"><UIcon name="i-heroicons-users" class="w-4 h-4" /> {{ audienceLabel(item.targetAudience) }}</span>
            </p>
          </div>

          <div class="relative z-10 mt-6 pt-4 border-t border-stone-200/50 dark:border-stone-800/50 flex items-center justify-end gap-2">
            <UButton icon="i-heroicons-eye" color="neutral" variant="soft" size="sm" class="rounded-xl font-bold" @click="viewItem(item)">Xem</UButton>
            <UButton v-if="auth?.hasPermission('announcements.update')" icon="i-heroicons-pencil-square" color="primary" variant="ghost" size="sm" class="rounded-xl" @click="editItem(item)" />
            <UButton v-if="auth?.hasPermission('announcements.delete')" icon="i-heroicons-trash" color="error" variant="ghost" size="sm" class="rounded-xl" @click="confirmDelete(item)" />
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         MODAL: TẠO / SỬA THÔNG BÁO
    ═══════════════════════════════════════════════════════ -->
    <UModal v-model:open="isFormOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden sm:max-w-4xl' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' }, footer: { padding: 'p-6 bg-stone-50 dark:bg-stone-900' } }">
        <template #header>
          <div class="bg-purple-600 dark:bg-purple-900 p-6 flex justify-between items-center text-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><UIcon name="i-heroicons-megaphone" class="w-6 h-6" /></div>
              <h3 class="text-xl font-black uppercase tracking-wide">{{ editingId ? 'Chỉnh Sửa Thông Báo' : 'Đăng Thông Báo Mới' }}</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="white" variant="ghost" class="hover:bg-white/10 rounded-full" @click="isFormOpen = false" />
          </div>
        </template>
        
        <div class="p-6">
          <UAlert v-if="formError" color="error" variant="soft" :description="formError" icon="i-heroicons-exclamation-circle" class="mb-6 rounded-2xl" />
          
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Cột trái: Nội dung -->
            <div class="lg:col-span-2 space-y-6">
              <UFormField label="Tiêu đề thông báo" required>
                <UInput v-model="form.title" placeholder="Hôm nay nghỉ học..." class="w-full text-lg font-bold" size="lg" :ui="{ base: 'rounded-xl' }" />
              </UFormField>
              <UFormField label="Nội dung" required>
                <UTextarea v-model="form.content" placeholder="Nhập nội dung chi tiết (hỗ trợ HTML cơ bản)..." :rows="12" class="w-full font-sans text-sm" :ui="{ base: 'rounded-xl' }" />
              </UFormField>
            </div>

            <!-- Cột phải: Cấu hình -->
            <div class="space-y-6 bg-purple-50/50 dark:bg-purple-900/10 p-5 rounded-2xl border border-purple-100 dark:border-purple-800/50 h-fit">
              <h3 class="font-black text-purple-800 dark:text-purple-300 flex items-center gap-2 pb-2 border-b border-purple-200 dark:border-purple-800"><UIcon name="i-heroicons-cog-6-tooth" /> Phân Loại</h3>
              
              <UFormField label="Mức độ quan trọng">
                <USelectMenu v-model="form.type" :options="typeOptions" value-attribute="value" option-attribute="label" class="w-full" :ui="{ base: 'rounded-xl' }" />
              </UFormField>
              
              <UFormField label="Đối tượng hiển thị">
                <USelectMenu v-model="form.targetAudience" :options="audienceOptions" value-attribute="value" option-attribute="label" class="w-full" :ui="{ base: 'rounded-xl' }" />
              </UFormField>
              
              <UFormField label="Ngày hết hạn (tùy chọn)">
                <UInput v-model="form.expiryDate" type="datetime-local" class="w-full" :ui="{ base: 'rounded-xl' }" />
                <p class="text-[10px] text-stone-500 font-bold mt-2 leading-tight">Nếu để trống, thông báo sẽ tồn tại vĩnh viễn cho đến khi bị xóa.</p>
              </UFormField>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Hủy" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isFormOpen = false" />
            <UButton :label="editingId ? 'Lưu Thay Đổi' : 'Phát Sóng Thông Báo'" color="purple" variant="solid" size="lg" class="rounded-xl font-black uppercase tracking-wider shadow-lg shadow-purple-500/20" :loading="submitting" icon="i-heroicons-paper-airplane" @click="submitForm" />
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- ═══════════════════════════════════════════════════════
         MODAL: XEM CHI TIẾT
    ═══════════════════════════════════════════════════════ -->
    <UModal v-model:open="isViewOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden sm:max-w-3xl' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-6 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800' } }">
        <template #header>
          <div class="flex justify-between items-start gap-4">
            <div>
              <div class="flex items-center gap-2 mb-3">
                <UBadge :label="typeBadge(viewingItem?.type).label" :color="typeBadge(viewingItem?.type).color" variant="soft" class="font-black uppercase tracking-widest rounded-lg" />
                <span class="text-xs font-bold text-stone-400"><UIcon name="i-heroicons-clock" class="inline-block mr-1" /> {{ formatDate(viewingItem?.createdDate) }}</span>
              </div>
              <h3 class="text-2xl font-black text-stone-800 dark:text-white leading-tight">{{ viewingItem?.title }}</h3>
              <p class="text-sm font-bold text-purple-600 mt-2">Đăng bởi: {{ viewingItem?.author }}</p>
            </div>
            <UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" class="rounded-full" @click="isViewOpen = false" />
          </div>
        </template>
        
        <div class="p-8 bg-white dark:bg-stone-950">
          <div class="prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-a:text-purple-600 text-stone-700 dark:text-stone-300" v-html="viewingItem?.content"></div>
        </div>

        <template #footer>
          <div class="flex justify-end p-4 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
            <UButton label="Đóng" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isViewOpen = false" />
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- ═══════════════════════════════════════════════════════
         MODAL: XÁC NHẬN XÓA
    ═══════════════════════════════════════════════════════ -->
    <UModal v-model:open="isDeleteOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden' }">
      <UCard :ui="{ body: { padding: 'p-6' }, header: { padding: 'p-6 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/50' } }">
        <template #header>
          <div class="flex items-center gap-3 text-red-600 dark:text-red-400">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8" />
            <h3 class="text-xl font-black uppercase tracking-wide">Xác Nhận Xóa</h3>
          </div>
        </template>
        <p class="text-stone-600 dark:text-stone-300 mb-6">Bạn có chắc chắn muốn xóa thông báo <b>"{{ deletingItem?.title }}"</b>? Hành động này không thể hoàn tác.</p>
        <div class="flex justify-end gap-3">
          <UButton label="Hủy" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isDeleteOpen = false" />
          <UButton label="Xóa Vĩnh Viễn" color="error" variant="solid" size="lg" class="rounded-xl font-black uppercase tracking-wider" icon="i-heroicons-trash" :loading="deleting" @click="executeDelete" />
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
useHead({ title: 'Quản Lý Thông Báo - GiaoLy Admin' })

const toast = useToast()
const auth = useAuthStore()

const { data: allAnnouncements, pending, refresh } = await useApiFetch('/Announcement', { default: () => [] })

const activeType = ref('all')
const typeFilters = [
  { label: 'Tất Cả', value: 'all' },
  { label: 'Thông Thường', value: 'Normal' },
  { label: 'Khẩn Cấp', value: 'Urgent' },
  { label: 'Sự Kiện', value: 'Event' }
]

const filtered = computed(() => {
  const list = allAnnouncements.value || []
  if (activeType.value === 'all') return list
  return list.filter(a => a.type === activeType.value)
})

const isFormOpen = ref(false)
const submitting = ref(false)
const formError = ref('')
const editingId = ref(null)

const defaultForm = () => ({ title: '', content: '', type: 'Normal', targetAudience: 'All', expiryDate: '' })
const form = ref(defaultForm())

const typeOptions = [
  { label: 'Thông Thường 📢', value: 'Normal' },
  { label: 'Khẩn Cấp 🚨', value: 'Urgent' },
  { label: 'Sự Kiện 📅', value: 'Event' }
]
const audienceOptions = [
  { label: 'Tất Cả', value: 'All' },
  { label: 'Trưởng đoàn', value: 'LeadersOnly' },
  { label: 'Theo Ngành', value: 'BranchSpecific' }
]

const openCreate = () => { editingId.value = null; form.value = defaultForm(); formError.value = ''; isFormOpen.value = true }
const editItem = (item) => {
  editingId.value = item.id
  form.value = { title: item.title, content: item.content, type: item.type, targetAudience: item.targetAudience, expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().slice(0, 16) : '' }
  formError.value = ''; isFormOpen.value = true
}

const submitForm = async () => {
  if (!form.value.title.trim() || !form.value.content.trim()) { formError.value = 'Vui lòng điền đầy đủ tiêu đề và nội dung.'; return }
  submitting.value = true; formError.value = ''
  try {
    const payload = { ...form.value, expiryDate: form.value.expiryDate ? new Date(form.value.expiryDate).toISOString() : null }
    if (editingId.value) { await $api(`/Announcement/${editingId.value}`, { method: 'PUT', body: payload }); toast.add({ title: 'Đã cập nhật', color: 'success' }) } 
    else { await $api('/Announcement', { method: 'POST', body: payload }); toast.add({ title: 'Đã đăng thông báo', color: 'success' }) }
    isFormOpen.value = false; await refresh()
  } catch (err) { formError.value = err?.data?.message || 'Lỗi hệ thống.' } 
  finally { submitting.value = false }
}

const isViewOpen = ref(false)
const viewingItem = ref(null)
const viewItem = (item) => { viewingItem.value = item; isViewOpen.value = true }

const isDeleteOpen = ref(false)
const deleting = ref(false)
const deletingItem = ref(null)
const confirmDelete = (item) => { deletingItem.value = item; isDeleteOpen.value = true }
const executeDelete = async () => {
  deleting.value = true
  try { await $api(`/Announcement/${deletingItem.value.id}`, { method: 'DELETE' }); toast.add({ title: 'Đã xóa', color: 'success' }); isDeleteOpen.value = false; await refresh() } 
  catch { toast.add({ title: 'Lỗi xóa', color: 'error' }) } 
  finally { deleting.value = false }
}

const formatDate = d => d ? new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''
const isExpired = d => d && new Date(d) < new Date()
const typeBadge = type => ({ Normal: { label: 'Thông Thường', color: 'purple' }, Urgent: { label: 'Khẩn Cấp', color: 'error' }, Event: { label: 'Sự Kiện', color: 'warning' } }[type] || { label: type || 'Thông Thường', color: 'neutral' })
const typeIcon = type => ({ Urgent: 'i-heroicons-bell-alert', Event: 'i-heroicons-calendar-days' }[type] || 'i-heroicons-megaphone')
const typeIconBg = type => ({ Urgent: 'bg-red-100 dark:bg-red-900/50', Event: 'bg-amber-100 dark:bg-amber-900/50' }[type] || 'bg-purple-100 dark:bg-purple-900/50')
const typeIconColor = type => ({ Urgent: 'text-red-600 dark:text-red-400', Event: 'text-amber-600 dark:text-amber-400' }[type] || 'text-purple-600 dark:text-purple-400')
const audienceLabel = a => ({ All: 'Tất Cả', LeadersOnly: 'Trưởng Đoàn', BranchSpecific: 'Theo Ngành' }[a] || a)
</script>

<style>
@keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
.animate-blob { animation: blob 10s infinite; }
.animation-delay-2000 { animation-delay: 2s; }
@keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-17"></a>📄 [17/71] File: `web-admin/pages/admin/classrooms/[id].vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Admin Pages (Quản trị) | **Số dòng:** 1.071 | **Kích thước:** 38.2 KB

```markup
<template>
  <UContainer class="py-10 space-y-8">
    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 text-sm text-stone-500">
      <NuxtLink
        to="/admin/academic-years"
        class="hover:text-primary-500 transition-colors"
      >
        Niên Khóa
      </NuxtLink>
      <UIcon
        name="i-heroicons-chevron-right"
        class="w-4 h-4"
      />
      <NuxtLink
        :to="`/admin/academic-years/${classRoom?.academicYearId}`"
        class="hover:text-primary-500 transition-colors"
      >
        Lớp Học
      </NuxtLink>
      <UIcon
        name="i-heroicons-chevron-right"
        class="w-4 h-4"
      />
      <span class="font-semibold text-stone-800 dark:text-white">{{ classRoom?.className ?? 'Lớp học' }}</span>
    </div>

    <!-- Classroom Header Widget -->
    <div class="glass-card rounded-2xl p-6 border border-white/20 dark:border-stone-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="space-y-2 relative z-10">
        <div class="flex items-center gap-3 flex-wrap">
          <span class="text-xs font-bold text-stone-400 uppercase tracking-widest">Chi tiết lớp học</span>
          <UBadge
            :label="`Ngành ${getBranchName(classRoom?.branch)}`"
            :color="getBranchColor(classRoom?.branch)"
            variant="solid"
            size="xs"
          />
        </div>
        <h1 class="text-3xl font-black text-stone-800 dark:text-white">
          {{ classRoom?.className }}
        </h1>
        <div class="flex items-center gap-6 text-sm text-stone-500 flex-wrap">
          <span class="flex items-center gap-1.5">
            <UIcon
              name="i-heroicons-user"
              class="text-primary-500 w-4 h-4"
            />
            GLV Chủ nhiệm: <strong class="text-stone-700 dark:text-stone-300">{{ classRoom?.mainTeacher || 'Chưa phân công' }}</strong>
          </span>
          <span
            v-if="classRoom?.roomName"
            class="flex items-center gap-1.5"
          >
            <UIcon
              name="i-heroicons-map-pin"
              class="text-amber-500 w-4 h-4"
            />
            Phòng học: <strong class="text-stone-700 dark:text-stone-300">{{ classRoom?.roomName }}</strong>
          </span>
        </div>
      </div>

      <div class="flex gap-2 flex-shrink-0 relative z-10">
        <UButton
          v-if="activeTab === 'students'"
          icon="i-heroicons-user-plus"
          label="Xếp Lớp Hàng Loạt"
          color="primary"
          @click="openEnrollModal"
        />
        <div
          v-else
          class="flex gap-2"
        >
          <UButton
            icon="i-heroicons-document-arrow-down"
            label="Xuất Excel"
            color="neutral"
            variant="soft"
            @click="exportGrades"
          />
          <UButton
            icon="i-heroicons-printer"
            label="In PDF"
            color="rose"
            variant="soft"
            @click="exportGradesPdf"
          />
          <div class="flex items-center justify-end px-2">
            <span
              v-if="saveStatus === 'saving'"
              class="text-xs font-bold text-amber-500 flex items-center gap-1"
            ><UIcon
              name="i-heroicons-arrow-path"
              class="w-4 h-4 animate-spin"
            /> Đang lưu...</span>
            <span
              v-else-if="saveStatus === 'saved'"
              class="text-xs font-bold text-emerald-500 flex items-center gap-1"
            ><UIcon
              name="i-heroicons-check-circle"
              class="w-4 h-4"
            /> Đã lưu tự động</span>
            <span
              v-else-if="saveStatus === 'error'"
              class="text-xs font-bold text-red-500 flex items-center gap-1"
            ><UIcon
              name="i-heroicons-x-circle"
              class="w-4 h-4"
            /> Lỗi lưu</span>
          </div>
          <UButton
            icon="i-heroicons-check-circle"
            label="Force Save"
            color="primary"
            variant="outline"
            :loading="isSavingGrades"
            @click="saveGrades"
          />
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex border-b border-stone-200 dark:border-stone-850 gap-6 overflow-x-auto">
      <button
        class="pb-3 text-sm font-extrabold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap"
        :class="activeTab === 'students' ? 'border-primary-500 text-primary-500' : 'border-transparent text-stone-400 hover:text-stone-600'"
        @click="activeTab = 'students'"
      >
        Danh Sách Đoàn Sinh
      </button>
      <button
        class="pb-3 text-sm font-extrabold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap"
        :class="activeTab === 'grades' ? 'border-primary-500 text-primary-500' : 'border-transparent text-stone-400 hover:text-stone-600'"
        @click="activeTab = 'grades'"
      >
        Sổ Điểm &amp; Chuyên Cần
      </button>
      <button
        class="pb-3 text-sm font-extrabold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap"
        :class="activeTab === 'contacts' ? 'border-primary-500 text-primary-500' : 'border-transparent text-stone-400 hover:text-stone-600'"
        @click="activeTab = 'contacts'"
      >
        Sổ Liên Lạc
      </button>
      <button
        class="pb-3 text-sm font-extrabold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap"
        :class="activeTab === 'log' ? 'border-primary-500 text-primary-500' : 'border-transparent text-stone-400 hover:text-stone-600'"
        @click="activeTab = 'log'"
      >
        Nhật Ký Lớp
      </button>
    </div>

    <!-- Tab Content -->
    <div class="space-y-6">
      <!-- TAB 1: STUDENTS LIST -->
      <div
        v-if="activeTab === 'students'"
        class="space-y-4"
      >
        <h3 class="text-xl font-bold flex items-center gap-2">
          <UIcon
            name="i-heroicons-users"
            class="text-primary-500"
          />
          Danh Sách Đoàn Sinh ({{ enrollments.length }} em)
        </h3>

        <div
          v-if="pendingEnrollments"
          class="flex flex-col gap-4 py-8 max-w-2xl mx-auto"
        >
          <div v-for="i in 5" :key="i" class="flex items-center gap-4 animate-pulse">
            <USkeleton class="h-12 w-12 rounded-full" />
            <div class="space-y-2 flex-1">
              <USkeleton class="h-4 w-1/3" />
              <USkeleton class="h-3 w-1/4" />
            </div>
            <USkeleton class="h-8 w-24 rounded-lg" />
          </div>
        </div>

        <UCard
          v-else-if="enrollments.length === 0"
          class="text-center py-16 glass-card"
        >
          <UIcon
            name="i-heroicons-user-minus"
            class="w-12 h-12 mx-auto mb-3 text-stone-300 dark:text-stone-700"
          />
          <p class="text-stone-400">
            Lớp học này chưa có đoàn sinh nào được xếp vào.
          </p>
          <UButton
            label="Xếp đoàn sinh ngay"
            color="primary"
            variant="soft"
            class="mt-4"
            @click="openEnrollModal"
          />
        </UCard>

        <UCard
          v-else
          class="glass-card overflow-hidden"
        >
          <UTable
            :data="enrollments"
            :columns="columns"
          >
            <!-- Student full name with Holy name -->
            <template #fullName-cell="{ row }">
              <div class="font-bold text-stone-800 dark:text-white">
                <span class="text-primary-500 font-semibold mr-1">{{ row.original.student?.holyName }}</span>
                {{ row.original.student?.fullName }}
              </div>
            </template>

            <!-- Birthday cell -->
            <template #birthDate-cell="{ row }">
              {{ formatDate(row.original.student?.birthDate) }}
            </template>

            <!-- Sacrament Status Badges -->
            <template #sacraments-cell="{ row }">
              <div class="flex gap-1">
                <UBadge
                  label="Rửa Tội"
                  :color="row.original.student?.baptismDate ? 'success' : 'neutral'"
                  variant="subtle"
                  size="xs"
                />
                <UBadge
                  label="Rước Lễ"
                  :color="row.original.student?.communionDate ? 'success' : 'neutral'"
                  variant="subtle"
                  size="xs"
                />
                <UBadge
                  label="Thêm Sức"
                  :color="row.original.student?.confirmationDate ? 'success' : 'neutral'"
                  variant="subtle"
                  size="xs"
                />
              </div>
            </template>

            <!-- Unenroll action -->
            <template #actions-cell="{ row }">
              <UButton
                icon="i-heroicons-user-minus"
                color="red"
                variant="ghost"
                size="xs"
                label="Rút khỏi lớp"
                @click="unenrollStudent(row.original.id)"
              />
            </template>
          </UTable>
        </UCard>
      </div>

      <!-- TAB 2: GRADES SHEET -->
      <div
        v-else-if="activeTab === 'grades'"
        class="space-y-4"
      >
        <h3 class="text-xl font-bold flex items-center gap-2">
          <UIcon
            name="i-heroicons-academic-cap"
            class="text-primary-500"
          />
          Sổ Điểm Điện Tử Lớp Học
        </h3>

        <!-- Thống kê tổng quan lớp học -->
        <div
          v-if="gradesList.length"
          class="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div class="glass-card rounded-xl p-4 text-center">
            <p class="text-xs text-stone-400 font-bold uppercase">
              Tổng Học Sinh
            </p>
            <p class="text-3xl font-black text-stone-800 dark:text-white mt-1">
              {{ gradesList.length }}
            </p>
          </div>
          <div class="glass-card rounded-xl p-4 text-center">
            <p class="text-xs text-emerald-500 font-bold uppercase">
              Đạt / Lên Lớp
            </p>
            <p class="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {{ gradesList.filter(g => checkQualified(g)).length }}
            </p>
          </div>
          <div class="glass-card rounded-xl p-4 text-center">
            <p class="text-xs text-red-400 font-bold uppercase">
              Học Lại
            </p>
            <p class="text-3xl font-black text-red-500 mt-1">
              {{ gradesList.filter(g => !checkQualified(g)).length }}
            </p>
          </div>
          <div class="glass-card rounded-xl p-4 text-center">
            <p class="text-xs text-amber-500 font-bold uppercase">
              ĐTB Trung Bình Lớp
            </p>
            <p class="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {{ gradesList.length ? (gradesList.reduce((sum, g) => sum + calculateGPA(g), 0) / gradesList.length).toFixed(1) : '0.0' }}
            </p>
          </div>
        </div>

        <div
          v-if="!gradesList.length"
          class="text-center py-20 glass-card rounded-2xl"
        >
          <UIcon
            name="i-heroicons-inbox"
            class="w-12 h-12 mx-auto mb-2 text-stone-300"
          />
          <p class="text-stone-400 italic">
            Lớp học chưa có đoàn sinh nào để nhập điểm.
          </p>
        </div>

        <div
          v-else
          class="overflow-x-auto border border-stone-200 dark:border-stone-850 rounded-2xl shadow-xl"
        >
          <table class="w-full text-left border-collapse bg-white dark:bg-stone-900">
            <thead>
              <tr class="bg-stone-50 dark:bg-stone-950 text-xs font-black uppercase text-stone-500 tracking-wider border-b border-stone-200 dark:border-stone-850">
                <th class="p-4">
                  Đoàn Sinh
                </th>
                <th class="p-4 text-center w-20">
                  Miệng
                </th>
                <th class="p-4 text-center w-20">
                  15 Phút
                </th>
                <th class="p-4 text-center w-20">
                  1 Tiết (x2)
                </th>
                <th class="p-4 text-center w-20">
                  Học Kỳ (x3)
                </th>
                <th class="p-4 text-center w-24">
                  Vắng
                </th>
                <th class="p-4 text-center w-24">
                  Tổng Buổi
                </th>
                <th class="p-4 text-center w-20">
                  ĐTB
                </th>
                <th class="p-4 text-center w-28">
                  Trạng Thái
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100 dark:divide-stone-850 text-sm">
              <tr
                v-for="grade in gradesList"
                :key="grade.studentId"
                :class="[
                  'transition-colors',
                  checkQualified(grade) ? 'hover:bg-stone-50/50 dark:hover:bg-stone-850/30' : 'bg-red-50/40 dark:bg-red-950/10 hover:bg-red-50/60'
                ]"
              >
                <!-- Student Name -->
                <td class="p-4">
                  <div class="font-bold text-stone-800 dark:text-white">
                    <span class="text-primary-500 font-semibold mr-1">{{ grade.studentHolyName }}</span>
                    {{ grade.studentFullName }}
                  </div>
                </td>

                <!-- Oral Score -->
                <td class="p-2 text-center">
                  <input
                    v-model.number="grade.oral"
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    class="w-16 p-1 text-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                    @input="onGradeInput"
                  >
                </td>

                <!-- 15m Score -->
                <td class="p-2 text-center">
                  <input
                    v-model.number="grade.smallTest"
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    class="w-16 p-1 text-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                    @input="onGradeInput"
                  >
                </td>

                <!-- 1 Period Score -->
                <td class="p-2 text-center">
                  <input
                    v-model.number="grade.bigTest"
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    class="w-16 p-1 text-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                    @input="onGradeInput"
                  >
                </td>

                <!-- Final Exam Score -->
                <td class="p-2 text-center">
                  <input
                    v-model.number="grade.finalExam"
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    class="w-16 p-1 text-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                    @input="onGradeInput"
                  >
                </td>

                <!-- Absences -->
                <td class="p-2 text-center">
                  <input
                    v-model.number="grade.absences"
                    type="number"
                    min="0"
                    max="50"
                    class="w-16 p-1 text-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                    @input="onGradeInput"
                  >
                </td>

                <!-- Total Sessions -->
                <td class="p-2 text-center">
                  <input
                    v-model.number="grade.totalSessions"
                    type="number"
                    min="1"
                    max="100"
                    class="w-16 p-1 text-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                    @input="onGradeInput"
                  >
                </td>

                <!-- Computed GPA -->
                <td
                  class="p-4 text-center font-black text-sm"
                  :class="calculateGPA(grade) >= 5.0 ? 'text-emerald-500' : 'text-red-500'"
                >
                  {{ calculateGPA(grade) }}
                </td>

                <!-- Promotion Status -->
                <td class="p-4 text-center">
                  <UBadge
                    v-if="checkQualified(grade)"
                    label="LÊN LỚP"
                    color="success"
                    variant="solid"
                    size="xs"
                    class="font-black tracking-wider"
                  />
                  <UBadge
                    v-else
                    label="HỌC LẠI"
                    color="error"
                    variant="solid"
                    size="xs"
                    class="font-black tracking-wider animate-pulse"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 3: SỔ̉ LIÊN LẠC -->
      <div v-else-if="activeTab === 'contacts'" class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold flex items-center gap-2">
            <UIcon name="i-heroicons-envelope" class="text-primary-500" />
            Sổ Liên Lạc Điện Tử
          </h3>
          <UButton
            icon="i-heroicons-document-arrow-down"
            label="Xuất PDF Toàn Lớp"
            color="rose"
            variant="soft"
            @click="exportContactBookPdf"
          />
        </div>
        <p class="text-xs text-stone-400 italic">Nhập nhận xét cuối kỳ và xếp loại Hạnh kiểm cho từng đoàn sinh. Dữ liệu sẽ tự động lưu khi bạn rời khỏi ô nhập.</p>

        <div v-if="!gradesList.length" class="text-center py-16 glass-card rounded-2xl">
          <UIcon name="i-heroicons-inbox" class="w-12 h-12 mx-auto mb-2 text-stone-300" />
          <p class="text-stone-400 italic">Lớp học chưa có đoàn sinh nào để viết sổ liên lạc.</p>
        </div>

        <div v-else class="overflow-x-auto border border-stone-200 dark:border-stone-850 rounded-2xl shadow-xl">
          <table class="w-full text-left border-collapse bg-white dark:bg-stone-900">
            <thead>
              <tr class="bg-stone-50 dark:bg-stone-950 text-xs font-black uppercase text-stone-500 tracking-wider border-b border-stone-200 dark:border-stone-850">
                <th class="p-4">Đoàn Sinh</th>
                <th class="p-4 text-center w-32">ĐTB Học Tập</th>
                <th class="p-4 text-center w-36">Hạnh Kiểm</th>
                <th class="p-4">Nhận Xét của Huynh Trưởng</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100 dark:divide-stone-850 text-sm">
              <tr v-for="grade in gradesList" :key="grade.studentId" class="hover:bg-stone-50/50 dark:hover:bg-stone-850/30 transition-colors">
                <td class="p-4">
                  <div class="font-bold text-stone-800 dark:text-white">
                    <span class="text-primary-500 font-semibold mr-1">{{ grade.studentHolyName }}</span>
                    {{ grade.studentFullName }}
                  </div>
                </td>
                <td class="p-4 text-center">
                  <span :class="['text-xl font-black', calculateGPA(grade) >= 8 ? 'text-emerald-500' : calculateGPA(grade) >= 5 ? 'text-amber-500' : 'text-red-500']">
                    {{ calculateGPA(grade) }}
                  </span>
                </td>
                <td class="p-3 text-center">
                  <select
                    v-model="grade.conduct"
                    class="w-full p-1.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                    @change="onGradeInput"
                  >
                    <option value="">-- Chọn --</option>
                    <option value="excellent">Tốt</option>
                    <option value="good">Khá</option>
                    <option value="average">Trung Bình</option>
                    <option value="poor">Yếu</option>
                  </select>
                </td>
                <td class="p-3">
                  <textarea
                    v-model="grade.teacherRemark"
                    rows="2"
                    placeholder="Nhận xét cá nhân..."
                    class="w-full p-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white resize-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                    @input="onGradeInput"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 4: NHẬT KÝ LớP -->
      <div v-else-if="activeTab === 'log'" class="space-y-4">
        <h3 class="text-xl font-bold flex items-center gap-2">
          <UIcon name="i-heroicons-clipboard-document-list" class="text-primary-500" />
          Nhật Ký Lớp
        </h3>
        <p class="text-xs text-stone-400 italic">Ghi chép nội bộ cho lớp học — dùng làm tư liệu khi viết nhận xét Sổ Liên Lạc cuối kỳ.</p>

        <!-- Input vùng ghi chú mới -->
        <UCard class="glass-card">
          <div class="space-y-3">
            <UTextarea
              v-model="newLogEntry"
              :rows="3"
              placeholder="Ghi chép sự kiện, nhận xét về buổi học, hạnh kiểm đoàn sinh..."
              class="w-full"
            />
            <div class="flex justify-end">
              <UButton
                icon="i-heroicons-plus"
                label="Lưu Ghi Chú"
                color="primary"
                :loading="isSavingLog"
                :disabled="!newLogEntry.trim()"
                @click="saveLogEntry"
              />
            </div>
          </div>
        </UCard>

        <!-- Feed Nhật Ký -->
        <div v-if="pendingLogs" class="space-y-4 py-8 max-w-3xl">
          <div v-for="i in 3" :key="i" class="flex gap-4">
            <USkeleton class="h-10 w-10 rounded-full flex-shrink-0" />
            <div class="space-y-2 flex-1">
              <USkeleton class="h-4 w-1/4" />
              <USkeleton class="h-16 w-full rounded-xl" />
            </div>
          </div>
        </div>
        <div v-else-if="!classLogs.length" class="text-center py-12 glass-card rounded-2xl">
          <UIcon name="i-heroicons-document-text" class="w-12 h-12 mx-auto mb-2 text-stone-300" />
          <p class="text-stone-400 italic">Chưa có ghi chú nào trong nhật ký lớp.</p>
        </div>
        <div v-else class="space-y-3">
          <UCard
            v-for="log in classLogs"
            :key="log.id"
            class="glass-card border-l-4 border-primary-200 dark:border-primary-800"
          >
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <UIcon name="i-heroicons-pencil-square" class="w-4 h-4 text-primary-500" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2 mb-1">
                  <span class="text-xs font-bold text-stone-500">{{ log.authorName || 'GLV' }}</span>
                  <span class="text-[10px] text-stone-400">{{ formatDate(log.createdAt) }}</span>
                </div>
                <p class="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-line">{{ log.content }}</p>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>

    <!-- Quick Enroll Multi-select Slideover/Modal -->
    <UModal
      v-model:open="isEnrollModalOpen"
      title="Xếp Đoàn Sinh Vào Lớp Hàng Loạt"
      size="lg"
    >
      <template #body>
        <div class="p-4 space-y-4">
          <p class="text-xs text-stone-500 italic">
            Hiển thị danh sách đoàn sinh tự do thuộc Ngành hoặc Toàn đoàn chưa có lớp học trong niên khóa hiện tại.
          </p>

          <UFormField label="Tìm kiếm đoàn sinh">
            <UInput
              v-model="searchQuery"
              icon="i-heroicons-magnifying-glass"
              placeholder="Nhập tên Thánh, Họ tên học sinh..."
              class="w-full"
            />
          </UFormField>

          <div
            v-if="pendingUnassigned"
            class="space-y-4 py-8"
          >
            <div v-for="i in 4" :key="i" class="flex items-center gap-3">
              <USkeleton class="h-5 w-5 rounded flex-shrink-0" />
              <div class="space-y-2 flex-1">
                <USkeleton class="h-4 w-1/3" />
                <USkeleton class="h-3 w-1/2" />
              </div>
            </div>
          </div>

          <div
            v-else-if="filteredUnassigned.length === 0"
            class="text-center py-10 text-stone-400 italic text-sm"
          >
            Không tìm thấy đoàn sinh tự do nào phù hợp.
          </div>

          <!-- Unassigned selection list -->
          <div
            v-else
            class="max-h-[300px] overflow-y-auto border border-stone-200 dark:border-stone-800 rounded-xl divide-y divide-stone-100 dark:divide-stone-800"
          >
            <div
              v-for="student in filteredUnassigned"
              :key="student.id"
              class="flex items-center gap-3 p-3 hover:bg-stone-50 dark:hover:bg-stone-800/50 cursor-pointer"
              @click="toggleSelectStudent(student.id)"
            >
              <UCheckbox
                :checked="selectedStudentIds.includes(student.id)"
                @change="toggleSelectStudent(student.id)"
              />
              <div class="min-w-0 flex-1">
                <p class="font-bold text-sm text-stone-800 dark:text-white">
                  <span class="text-primary-500 font-semibold mr-1">{{ student.holyName }}</span>
                  {{ student.fullName }}
                </p>
                <p class="text-xs text-stone-400">
                  Ngày sinh: {{ formatDate(student.birthDate) }} | Phân loại: Ngành {{ getBranchName(student.branch) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between items-center w-full">
          <span class="text-xs font-semibold text-stone-500">
            Đã chọn: {{ selectedStudentIds.length }} em
          </span>
          <div class="flex gap-2">
            <UButton
              label="Hủy"
              color="neutral"
              variant="ghost"
              @click="isEnrollModalOpen = false"
            />
            <UButton
              label="Xếp vào lớp"
              color="primary"
              :loading="isEnrolling"
              :disabled="selectedStudentIds.length === 0"
              @click="submitEnrollment"
            />
          </div>
        </div>
      </template>
    </UModal>
  </UContainer>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

definePageMeta({ layout: 'default' })

const route = useRoute()
const toast = useToast()
const classRoomId = route.params.id

// Fetch Class details & Enrollments
const { data: allYears } = await useApiFetch('/AcademicYear')
const classRoom = ref(null)

// Find classroom from all academic years
onMounted(async () => {
  if (allYears.value) {
    for (const year of allYears.value) {
      try {
        const rooms = await $api(`/AcademicYear/${year.id}/classrooms`)
        const found = rooms.find(r => r.id === classRoomId)
        if (found) {
          classRoom.value = found
          break
        }
      } catch (e) {
        console.error(e)
      }
    }
  }
})

useHead({ title: computed(() => `${classRoom.value?.className ?? 'Chi tiết lớp học'} | GiaoLy`) })

const { data: enrollments, pending: pendingEnrollments, refresh: refreshEnrollments } = await useApiFetch(`/Enrollment/classroom/${classRoomId}`, {
  default: () => []
})

// Unassigned list
const unassignedStudents = ref([])
const pendingUnassigned = ref(false)
const selectedStudentIds = ref([])
const isEnrollModalOpen = ref(false)
const isEnrolling = ref(false)
const searchQuery = ref('')

const openEnrollModal = async () => {
  if (!classRoom.value) return
  selectedStudentIds.value = []
  searchQuery.value = ''
  pendingUnassigned.value = true
  isEnrollModalOpen.value = true
  try {
    const res = await $api(`/Enrollment/unassigned/${classRoom.value.academicYearId}`)
    unassignedStudents.value = res
  } catch {
    toast.add({ title: 'Lỗi tải đoàn sinh tự do', color: 'error' })
  } finally {
    pendingUnassigned.value = false
  }
}

const toggleSelectStudent = (id) => {
  const index = selectedStudentIds.value.indexOf(id)
  if (index === -1) {
    selectedStudentIds.value.push(id)
  } else {
    selectedStudentIds.value.splice(index, 1)
  }
}

const filteredUnassigned = computed(() => {
  if (!searchQuery.value) return unassignedStudents.value
  const q = searchQuery.value.toLowerCase()
  return unassignedStudents.value.filter(s =>
    (s.fullName || '').toLowerCase().includes(q)
    || (s.holyName || '').toLowerCase().includes(q)
  )
})

const submitEnrollment = async () => {
  isEnrolling.value = true
  try {
    await $api('/Enrollment', {
      method: 'POST',
      body: {
        classRoomId: classRoomId,
        studentIds: selectedStudentIds.value
      }
    })
    isEnrollModalOpen.value = false
    await refreshEnrollments()
    toast.add({ title: 'Xếp lớp thành công!', color: 'success' })
  } catch {
    toast.add({ title: 'Lỗi xếp lớp', color: 'error' })
  } finally {
    isEnrolling.value = false
  }
}

const unenrollStudent = async (enrollmentId) => {
  if (!confirm('Rút học sinh này khỏi lớp?')) return
  try {
    await $api(`/Enrollment/${enrollmentId}`, { method: 'DELETE' })
    await refreshEnrollments()
    toast.add({ title: 'Đã rút đoàn sinh ra khỏi lớp', color: 'success' })
  } catch {
    toast.add({ title: 'Lỗi khi rút', color: 'error' })
  }
}

// Columns
const columns = [
  { accessorKey: 'fullName', header: 'Học Sinh' },
  { accessorKey: 'birthDate', header: 'Ngày Sinh' },
  { accessorKey: 'sacraments', header: 'Bí Tích Đức Tin' },
  { accessorKey: 'actions', header: '' }
]

// Tab Logic
const activeTab = ref('students')
const gradesList = ref([])
const isSavingGrades = ref(false)

const loadGrades = async () => {
  try {
    const res = await $api(`/Grade/classroom/${classRoomId}`)
    gradesList.value = res.map(g => ({
      ...g,
      oral: g.oral || 0,
      smallTest: g.smallTest || 0,
      bigTest: g.bigTest || 0,
      finalExam: g.finalExam || 0,
      absences: g.absences || 0,
      totalSessions: g.totalSessions || 30
    }))
  } catch (error) {
    console.error('Error fetching grades:', error)
    toast.add({ title: 'Lỗi tải sổ điểm', color: 'error' })
  }
}

watch(activeTab, async (newTab) => {
  if (newTab === 'grades' || newTab === 'contacts') {
    if (!gradesList.value.length) {
      await loadGrades()
    }
  } else if (newTab === 'log') {
    if (!classLogs.value.length) {
      await loadLogs()
    }
  }
})

// Tab 3: Contacts
const exportContactBookPdf = async () => {
  if (import.meta.client) {
    try {
      toast.add({ title: 'Đang xuất Sổ Liên Lạc PDF...', color: 'primary' })
      const res = await $api(`/Grade/classroom/${classRoomId}/export-contacts-pdf`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(res)
      const a = document.createElement('a')
      a.href = url
      a.download = `So_Lien_Lac_${classRoom.value?.className?.replace(/ /g, '_') || 'Lop'}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      toast.add({ title: 'Lỗi khi xuất Sổ Liên Lạc', color: 'error' })
    }
  }
}

// Tab 4: Logs
const classLogs = ref([])
const pendingLogs = ref(false)
const newLogEntry = ref('')
const isSavingLog = ref(false)

const loadLogs = async () => {
  pendingLogs.value = true
  try {
    classLogs.value = await $api(`/ClassroomLog/classroom/${classRoomId}`)
  } catch (error) {
    console.error('Error fetching logs:', error)
  } finally {
    pendingLogs.value = false
  }
}

const saveLogEntry = async () => {
  if (!newLogEntry.value.trim()) return
  isSavingLog.value = true
  try {
    await $api(`/ClassroomLog/classroom/${classRoomId}`, {
      method: 'POST',
      body: { content: newLogEntry.value }
    })
    toast.add({ title: 'Đã lưu ghi chú', color: 'success' })
    newLogEntry.value = ''
    await loadLogs()
  } catch (error) {
    console.error('Error saving log:', error)
    toast.add({ title: 'Lỗi lưu ghi chú', color: 'error' })
  } finally {
    isSavingLog.value = false
  }
}


// Dynamic GPA & Qualifications Calculation
const calculateGPA = (row) => {
  const sum = (parseFloat(row.oral) || 0)
    + (parseFloat(row.smallTest) || 0)
    + ((parseFloat(row.bigTest) || 0) * 2)
    + ((parseFloat(row.finalExam) || 0) * 3)
  return Math.round((sum / 7.0) * 10) / 10
}

const checkQualified = (row) => {
  const gpa = calculateGPA(row)
  const total = parseInt(row.totalSessions) || 30
  const abs = parseInt(row.absences) || 0
  const attendanceRate = total > 0 ? (total - abs) / total : 0
  return gpa >= 5.0 && attendanceRate >= 0.8
}

const saveStatus = ref('idle')

const debouncedSave = useDebounceFn(async () => {
  await saveGrades(true)
}, 1000)

const onGradeInput = () => {
  saveStatus.value = 'saving'
  debouncedSave()
}

const saveGrades = async (isAuto = false) => {
  if (!isAuto) isSavingGrades.value = true
  try {
    const payload = gradesList.value.map(g => ({
      studentId: g.studentId,
      classRoomId: classRoomId,
      oral: parseFloat(g.oral) || 0,
      smallTest: parseFloat(g.smallTest) || 0,
      bigTest: parseFloat(g.bigTest) || 0,
      finalExam: parseFloat(g.finalExam) || 0,
      absences: parseInt(g.absences) || 0,
      totalSessions: parseInt(g.totalSessions) || 30
    }))

    await $api(`/Grade/save/${classRoomId}`, {
      method: 'POST',
      body: payload
    })

    if (!isAuto) {
      toast.add({ title: 'Bảng điểm đã được lưu thành công!', color: 'success' })
    }

    saveStatus.value = 'saved'
    setTimeout(() => {
      if (saveStatus.value === 'saved') saveStatus.value = 'idle'
    }, 2000)
  } catch (error) {
    console.error('Error saving grades:', error)
    if (!isAuto) toast.add({ title: 'Lỗi lưu sổ điểm', color: 'error' })
    saveStatus.value = 'error'
  } finally {
    if (!isAuto) isSavingGrades.value = false
  }
}

const exportGrades = async () => {
  if (import.meta.client) {
    try {
      toast.add({ title: 'Đang tải file Excel...', color: 'primary' })
      const res = await $api(`/Grade/classroom/${classRoomId}/export`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(res)
      const a = document.createElement('a')
      a.href = url
      a.download = `Bang_Diem_${classRoom.value?.className?.replace(/ /g, '_') || 'Lop'}.xlsx`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      toast.add({ title: 'Lỗi khi tải file', color: 'error' })
    }
  }
}

const exportGradesPdf = async () => {
  if (import.meta.client) {
    try {
      toast.add({ title: 'Đang xuất PDF...', color: 'primary' })
      const res = await $api(`/Grade/classroom/${classRoomId}/export-pdf`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(res)
      const a = document.createElement('a')
      a.href = url
      a.download = `Bang_Diem_${classRoom.value?.className?.replace(/ /g, '_') || 'Lop'}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      toast.add({ title: 'Lỗi khi tải file', color: 'error' })
    }
  }
}

// Helpers
const getBranchName = (b) => {
  const names = { 0: 'Chung', 1: 'Chiên Con', 2: 'Ấu Nhi', 3: 'Thiếu Nhi', 4: 'Nghĩa Sĩ', 5: 'Hiệp Sĩ' }
  return names[b] || 'Chung'
}

const getBranchColor = (b) => {
  const colors = { 0: 'neutral', 1: 'pink', 2: 'success', 3: 'primary', 4: 'warning', 5: 'error' }
  return colors[b] || 'neutral'
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.25s ease;
}

.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 20px -8px rgba(0, 0, 0, 0.08);
}

.dark .glass-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
</style>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-18"></a>📄 [18/71] File: `web-admin/pages/admin/dashboard.vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Admin Pages (Quản trị) | **Số dòng:** 955 | **Kích thước:** 44.6 KB

```markup
<template>
  <div class="min-h-screen font-sans text-stone-800 dark:text-stone-200 pb-20">
    <UContainer class="py-6 space-y-6">

      <!-- ═══════════════════════════════════════════════════════
           HEADER CARD: Chào mừng + Avatar + Ngày giờ + Actions
      ═══════════════════════════════════════════════════════ -->
      <div class="animate-fade-in-cards bg-gradient-to-r from-marian-blue-900 to-marian-blue-700 dark:from-marian-blue-950 dark:to-marian-blue-900 rounded-2xl p-6 shadow-xl shadow-marian-blue-900/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 relative overflow-hidden">
        <!-- Trang trí nền -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
        <div class="absolute bottom-0 left-1/3 w-48 h-32 bg-amber-400/10 rounded-full translate-y-1/2 blur-2xl pointer-events-none" />

        <!-- Avatar + Thông tin -->
        <div class="flex items-center gap-4 z-10">
          <!-- Avatar chữ cái đầu -->
          <div class="w-14 h-14 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center flex-shrink-0 shadow-inner">
            <span class="text-xl font-black text-white">
              {{ (auth?.user?.name || 'A').charAt(0).toUpperCase() }}
            </span>
          </div>
          <div>
            <div class="flex items-center gap-2 mb-1 flex-wrap">
              <h1 class="text-xl font-black text-white leading-tight">
                Chào mừng, {{ auth?.user?.name || 'Trưởng' }}!
              </h1>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                {{ getRoleLabel(auth?.user?.role) }}
              </span>
            </div>
            <p class="text-sm text-white/60">
              Niên khóa:
              <span class="font-semibold text-amber-300">{{ activeYear?.name || 'Đang tải...' }}</span>
              &nbsp;·&nbsp;
              <span class="font-medium text-white/50">{{ currentDateTime }}</span>
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2 z-10 flex-wrap">
          <UButton
            v-if="auth?.hasPermission('students.manage')"
            icon="i-heroicons-document-arrow-up"
            label="Nạp Excel"
            color="white"
            variant="solid"
            size="sm"
            class="shadow-sm font-semibold"
            @click="isImportOpen = true"
          />
          <UButton
            v-if="auth?.hasPermission('announcements.manage')"
            icon="i-heroicons-megaphone"
            label="Đăng Tin"
            color="white"
            variant="soft"
            size="sm"
            class="bg-amber-400 hover:bg-amber-500 text-amber-900 border-0 font-bold shadow-md"
            @click="isNewsModalOpen = true"
          />
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════
           METRIC CARDS ROW (5 cards)
           Tổng đoàn sinh + 4 ngành
      ═══════════════════════════════════════════════════════ -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">

        <!-- Tổng Đoàn Sinh -->
        <div class="metric-card animate-fade-in-cards delay-100 col-span-2 md:col-span-1 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-marian-blue-50 dark:bg-marian-blue-950 flex items-center justify-center flex-shrink-0">
            <UIcon name="i-heroicons-users" class="w-6 h-6 text-marian-blue-600 dark:text-marian-blue-400" />
          </div>
          <div>
            <p class="section-label mb-1">Tổng Số</p>
            <div v-if="pending"><USkeleton class="w-14 h-7 rounded" /></div>
            <p v-else class="text-3xl font-black text-stone-900 dark:text-white leading-none">
              {{ students?.length || 0 }}
            </p>
            <p class="text-[10px] text-stone-400 mt-0.5">đoàn sinh</p>
          </div>
        </div>

        <!-- 4 Ngành -->
        <div
          v-for="(stat, index) in branchStats.filter(b => b.branch >= 1 && b.branch <= 4)"
          :key="stat.branch"
          :class="['metric-card animate-fade-in-cards flex items-center gap-4', `delay-${(index + 2) * 100}`]"
        >
          <div :class="[`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`, getBranchBgClass(stat.branch)]">
            <UIcon :name="getBranchIcon(stat.branch)" :class="['w-6 h-6', getBranchIconColor(stat.branch)]" />
          </div>
          <div>
            <p class="section-label mb-1 truncate">{{ getBranchName(stat.branch) }}</p>
            <div v-if="pending"><USkeleton class="w-10 h-7 rounded" /></div>
            <p v-else class="text-3xl font-black text-stone-900 dark:text-white leading-none">
              {{ stat.count }}
            </p>
            <p class="text-[10px] text-stone-400 mt-0.5">đoàn sinh</p>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════
           MAIN GRID: 3-col Left | 1-col Right
      ═══════════════════════════════════════════════════════ -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">

        <!-- ╔═══ CỘT TRÁI (3/4) ═══════════════════════════════ -->
        <div class="lg:col-span-3 space-y-6">

          <!-- ── 1. Tiến Độ Bí Tích: SVG Progress Rings ──────── -->
          <div class="animate-fade-in-cards delay-200 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl p-5 shadow-sm">
            <div class="flex justify-between items-center mb-5">
              <h3 class="section-label">Tiến Độ Bí Tích</h3>
              <div class="text-[10px] text-stone-400">{{ students?.length || 0 }} đoàn sinh</div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

              <!-- Ring: Rửa Tội -->
              <div class="flex items-center gap-4">
                <!-- SVG Progress Ring -->
                <div class="relative flex-shrink-0">
                  <svg width="72" height="72" viewBox="0 0 72 72">
                    <!-- Track -->
                    <circle cx="36" cy="36" r="28" fill="none" stroke="currentColor" stroke-width="6" class="text-stone-100 dark:text-stone-800" />
                    <!-- Progress -->
                    <circle
                      cx="36" cy="36" r="28"
                      fill="none" stroke="#3b82f6" stroke-width="6"
                      stroke-linecap="round"
                      :stroke-dasharray="`${175.93}`"
                      :stroke-dashoffset="`${175.93 * (1 - getBaptismRatio())}`"
                      class="progress-ring-circle"
                    />
                  </svg>
                  <!-- Phần trăm ở giữa -->
                  <span class="absolute inset-0 flex items-center justify-center text-xs font-black text-blue-600 dark:text-blue-400">
                    {{ Math.round(getBaptismRatio() * 100) }}%
                  </span>
                </div>
                <div>
                  <p class="font-bold text-stone-800 dark:text-white text-sm">Rửa Tội</p>
                  <p class="text-xs text-stone-500">
                    {{ students?.filter(s => s.baptismDate).length || 0 }}
                    /
                    {{ students?.length || 0 }}
                  </p>
                  <div class="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1 mt-2 overflow-hidden">
                    <div class="bg-blue-500 h-full rounded-full transition-all duration-700" :style="{ width: getPercentage(students?.filter(s => s.baptismDate).length, students?.length) }" />
                  </div>
                </div>
              </div>

              <!-- Ring: Rước Lễ -->
              <div class="flex items-center gap-4">
                <div class="relative flex-shrink-0">
                  <svg width="72" height="72" viewBox="0 0 72 72">
                    <circle cx="36" cy="36" r="28" fill="none" stroke="currentColor" stroke-width="6" class="text-stone-100 dark:text-stone-800" />
                    <circle
                      cx="36" cy="36" r="28"
                      fill="none" stroke="#f59e0b" stroke-width="6"
                      stroke-linecap="round"
                      :stroke-dasharray="`${175.93}`"
                      :stroke-dashoffset="`${175.93 * (1 - getCommunionRatio())}`"
                      class="progress-ring-circle"
                    />
                  </svg>
                  <span class="absolute inset-0 flex items-center justify-center text-xs font-black text-amber-600 dark:text-amber-400">
                    {{ Math.round(getCommunionRatio() * 100) }}%
                  </span>
                </div>
                <div>
                  <p class="font-bold text-stone-800 dark:text-white text-sm">Rước Lễ</p>
                  <p class="text-xs text-stone-500">
                    {{ students?.filter(s => s.communionDate).length || 0 }}
                    /
                    {{ students?.length || 0 }}
                  </p>
                  <div class="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1 mt-2 overflow-hidden">
                    <div class="bg-amber-500 h-full rounded-full transition-all duration-700" :style="{ width: getPercentage(students?.filter(s => s.communionDate).length, students?.length) }" />
                  </div>
                </div>
              </div>

              <!-- Ring: Thêm Sức -->
              <div class="flex items-center gap-4">
                <div class="relative flex-shrink-0">
                  <svg width="72" height="72" viewBox="0 0 72 72">
                    <circle cx="36" cy="36" r="28" fill="none" stroke="currentColor" stroke-width="6" class="text-stone-100 dark:text-stone-800" />
                    <circle
                      cx="36" cy="36" r="28"
                      fill="none" stroke="#ef4444" stroke-width="6"
                      stroke-linecap="round"
                      :stroke-dasharray="`${175.93}`"
                      :stroke-dashoffset="`${175.93 * (1 - getConfirmationRatio())}`"
                      class="progress-ring-circle"
                    />
                  </svg>
                  <span class="absolute inset-0 flex items-center justify-center text-xs font-black text-red-600 dark:text-red-400">
                    {{ Math.round(getConfirmationRatio() * 100) }}%
                  </span>
                </div>
                <div>
                  <p class="font-bold text-stone-800 dark:text-white text-sm">Thêm Sức</p>
                  <p class="text-xs text-stone-500">
                    {{ students?.filter(s => s.confirmationDate).length || 0 }}
                    /
                    {{ students?.length || 0 }}
                  </p>
                  <div class="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1 mt-2 overflow-hidden">
                    <div class="bg-red-500 h-full rounded-full transition-all duration-700" :style="{ width: getPercentage(students?.filter(s => s.confirmationDate).length, students?.length) }" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- ── 2. Bảng Danh Sách Đoàn Sinh Gần Đây ─────────── -->
          <div class="animate-fade-in-cards delay-300 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl shadow-sm overflow-hidden">
            <!-- Toolbar -->
            <div class="p-4 border-b border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-stone-50/50 dark:bg-stone-950/30">
              <h3 class="section-label">Danh Sách Đoàn Sinh Gần Đây</h3>
              <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <UInput
                  v-model="q"
                  icon="i-heroicons-magnifying-glass"
                  placeholder="Tìm kiếm..."
                  size="sm"
                  class="w-full sm:w-44"
                  :ui="{ base: 'shadow-none border-stone-200 dark:border-stone-700 rounded-xl' }"
                />
                <USelect
                  v-model="selectedBranch"
                  :options="branchFilterOptions"
                  size="sm"
                  class="w-full sm:w-32"
                  :ui="{ base: 'shadow-none border-stone-200 dark:border-stone-700 rounded-xl' }"
                />
                <UButton
                  v-if="auth?.hasPermission('students.manage')"
                  icon="i-heroicons-plus"
                  color="primary"
                  variant="solid"
                  size="sm"
                  class="rounded-xl"
                  @click="openCreateModal"
                />
              </div>
            </div>

            <!-- Table -->
            <UTable
              :rows="filteredRows.slice(0, 10)"
              :columns="columns"
              :loading="pending"
              :empty-state="{ icon: 'i-heroicons-users', header: 'Không tìm thấy hồ sơ' }"
              :ui="{
                th: { base: 'bg-stone-50 dark:bg-stone-950/50 text-[10px] uppercase font-black text-stone-400 tracking-wider py-3 border-b border-stone-100 dark:border-stone-800' },
                td: { base: 'py-2.5 border-b border-stone-50 dark:border-stone-800/40 whitespace-nowrap text-sm text-stone-600 dark:text-stone-300' },
                tr: { base: 'table-row-hover' }
              }"
            >
              <!-- Cell: Họ tên + Tên Thánh + Ngày sinh -->
              <template #fullName-cell="{ row }">
                <div class="flex items-center gap-3">
                  <!-- Avatar chữ cái đầu với màu theo ngành -->
                  <div :class="['w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black', getBranchAvatarClass(row.original.branch)]">
                    {{ row.original.fullName?.charAt(0) || '?' }}
                  </div>
                  <div class="flex flex-col">
                    <span class="font-semibold text-stone-900 dark:text-white text-sm">
                      <span class="text-marian-blue-500 text-xs mr-1">{{ row.original.holyName }}</span>{{ row.original.fullName }}
                    </span>
                    <span class="text-[10px] text-stone-400">{{ formatDate(row.original.birthDate) }}</span>
                  </div>
                </div>
              </template>

              <!-- Cell: Bí Tích Icons -->
              <template #sacraments-cell="{ row }">
                <div class="flex gap-2">
                  <UTooltip text="Rửa Tội">
                    <UIcon name="i-heroicons-beaker" :class="row.original.baptismDate ? 'w-4 h-4 text-blue-500' : 'w-4 h-4 text-stone-300 dark:text-stone-700'" />
                  </UTooltip>
                  <UTooltip text="Rước Lễ">
                    <UIcon name="i-heroicons-cake" :class="row.original.communionDate ? 'w-4 h-4 text-amber-500' : 'w-4 h-4 text-stone-300 dark:text-stone-700'" />
                  </UTooltip>
                  <UTooltip text="Thêm Sức">
                    <UIcon name="i-heroicons-fire" :class="row.original.confirmationDate ? 'w-4 h-4 text-red-500' : 'w-4 h-4 text-stone-300 dark:text-stone-700'" />
                  </UTooltip>
                </div>
              </template>

              <!-- Cell: Ngành badge -->
              <template #branch-cell="{ row }">
                <span :class="['text-[10px] font-bold px-2.5 py-1 rounded-full inline-block', getBranchBadgeClass(row.original.branch)]">
                  {{ getBranchName(row.original.branch) }}
                </span>
              </template>

              <!-- Cell: Lớp -->
              <template #className-cell="{ row }">
                <span class="text-stone-500 dark:text-stone-400">{{ row.original.className || '—' }}</span>
              </template>

              <!-- Cell: Actions -->
              <template #actions-cell="{ row }">
                <UDropdown
                  v-if="auth?.hasPermission('students.manage')"
                  :items="getStudentActions(row.original)"
                  :popper="{ placement: 'bottom-end' }"
                >
                  <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-heroicons-ellipsis-horizontal"
                    size="sm"
                    class="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg"
                  />
                </UDropdown>
              </template>
            </UTable>

            <!-- Table Footer -->
            <div class="p-3 border-t border-stone-100 dark:border-stone-800 flex justify-center bg-stone-50/50 dark:bg-stone-950/30">
              <UButton
                label="Xem toàn bộ hồ sơ →"
                color="primary"
                variant="ghost"
                size="sm"
                to="/admin/students"
                class="text-xs font-semibold"
              />
            </div>
          </div>

          <!-- ── 3. Quick Actions Grid ────────────────────────── -->
          <div class="animate-fade-in-cards delay-400 grid grid-cols-2 md:grid-cols-4 gap-3">
            <QuickActionCard
              icon="i-heroicons-user-plus"
              label="Thêm Đoàn Sinh"
              color="blue"
              @click="openCreateModal"
            />
            <QuickActionCard
              icon="i-heroicons-megaphone"
              label="Đăng Thông Báo"
              color="amber"
              @click="isNewsModalOpen = true"
            />
            <QuickActionCard
              icon="i-heroicons-document-arrow-up"
              label="Nạp Excel"
              color="emerald"
              @click="isImportOpen = true"
            />
            <QuickActionCard
              icon="i-heroicons-calendar-days"
              label="Lịch Phụng Vụ"
              color="purple"
              to="/admin/liturgical"
            />
          </div>
        </div>

        <!-- ╔═══ CỘT PHẢI (1/4) ════════════════════════════════ -->
        <div class="space-y-5">

          <!-- Widget: Hôm Nay (Lịch Phụng Vụ) -->
          <div class="animate-fade-in-cards delay-200 data-card">
            <div class="flex justify-between items-center mb-3">
              <h3 class="section-label">Hôm Nay</h3>
              <UButton
                icon="i-heroicons-arrow-top-right-on-square"
                color="neutral"
                variant="ghost"
                size="2xs"
                class="opacity-40 hover:opacity-80"
                to="/admin/liturgical"
              />
            </div>

            <div v-if="liturgicalToday" class="space-y-2">
              <p class="text-[10px] font-bold text-stone-400 uppercase">{{ liturgicalToday.date }}</p>
              <h4 class="font-bold text-sm text-stone-900 dark:text-white leading-snug">
                {{ liturgicalToday.feastName }}
              </h4>
              <!-- Màu phụng vụ -->
              <div class="flex items-center gap-2 mt-2 p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50">
                <span :class="['w-3 h-3 rounded-full flex-shrink-0', getColorDot(liturgicalToday.liturgicalColor)]" />
                <span class="text-xs text-stone-500 font-medium">
                  Màu {{ liturgicalToday.liturgicalColorVi }}
                </span>
              </div>
              <!-- Thánh quan thầy nếu có -->
              <p v-if="liturgicalToday.saintName" class="text-[11px] text-stone-400 italic">
                Thánh {{ liturgicalToday.saintName }}
              </p>
            </div>
            <div v-else class="text-xs text-stone-400 text-center py-4">
              <USkeleton class="h-4 w-full mb-2 rounded" />
              <USkeleton class="h-4 w-3/4 mx-auto rounded" />
            </div>
          </div>

          <!-- Widget: Bảng Tin Thông Báo -->
          <div class="animate-fade-in-cards delay-300 data-card flex flex-col h-[300px]">
            <div class="flex justify-between items-center mb-3 shrink-0">
              <h3 class="section-label">Bảng Tin</h3>
              <UButton
                v-if="auth?.hasPermission('announcements.manage')"
                icon="i-heroicons-arrow-top-right-on-square"
                color="neutral"
                variant="ghost"
                size="2xs"
                class="opacity-40 hover:opacity-80"
                to="/admin/announcements"
              />
            </div>

            <div class="flex-1 overflow-y-auto pr-1 space-y-2 scrollbar-thin">
              <div v-if="announcements?.length === 0" class="text-xs text-stone-400 text-center py-6">
                Chưa có thông báo.
              </div>

              <div
                v-for="news in announcements?.slice(0, 5)"
                :key="news.id"
                class="news-card-hover p-2.5 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 relative group"
              >
                <!-- Dot chỉ báo loại -->
                <div
                  :class="[
                    'absolute top-3.5 left-3 w-1.5 h-1.5 rounded-full',
                    news.type === 1 ? 'bg-red-500 animate-pulse' :
                    news.type === 2 ? 'bg-amber-500' : 'bg-blue-500'
                  ]"
                />
                <div class="pl-4">
                  <div class="flex justify-between items-start gap-2 mb-1">
                    <h5 class="text-xs font-semibold text-stone-800 dark:text-stone-200 leading-tight line-clamp-2">
                      {{ news.title }}
                    </h5>
                    <span class="text-[9px] text-stone-400 shrink-0">{{ formatDateShort(news.createdDate) }}</span>
                  </div>
                  <div class="flex items-center gap-1.5 mt-1.5">
                    <span :class="['text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase', getBranchBadgeClass(news.branch)]">
                      {{ getBranchName(news.branch) }}
                    </span>
                    <UButton
                      v-if="auth?.hasPermission('announcements.manage')"
                      icon="i-heroicons-trash"
                      color="error"
                      variant="ghost"
                      size="2xs"
                      class="opacity-0 group-hover:opacity-100 ml-auto h-4 min-h-0"
                      @click="deleteAnnouncement(news.id)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Widget: Sinh Nhật Tháng Này -->
          <div class="animate-fade-in-cards delay-400 data-card">
            <h3 class="section-label mb-3">🎂 Sinh Nhật Tháng Này</h3>

            <div v-if="upcomingBirthdays.length" class="space-y-2.5">
              <div
                v-for="student in upcomingBirthdays"
                :key="student.id"
                class="flex items-center justify-between gap-2"
              >
                <!-- Avatar -->
                <div class="flex items-center gap-2 min-w-0">
                  <div :class="['w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black', getBranchAvatarClass(student.branch)]">
                    {{ student.fullName?.charAt(0) || '?' }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-semibold text-stone-800 dark:text-stone-200 leading-none truncate">
                      {{ student.holyName }} {{ student.fullName }}
                    </p>
                    <p class="text-[9px] text-stone-400 mt-0.5">{{ getBranchName(student.branch) }}</p>
                  </div>
                </div>
                <!-- Ngày sinh -->
                <div class="text-[10px] font-bold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-lg border border-stone-200 dark:border-stone-700 whitespace-nowrap flex-shrink-0">
                  {{ formatDateShort(student.birthDate) }}
                </div>
              </div>
            </div>
            <div v-else class="text-xs text-stone-400 text-center py-4">
              Không có sinh nhật tháng này.
            </div>
          </div>

        </div>
      </div>
    </UContainer>

    <!-- ═══════════════════════════════════════════════════════
         MODALS (Student Edit, News, Excel) - Giữ nguyên Logic
    ═══════════════════════════════════════════════════════ -->

    <!-- Modal Student: Thêm / Cập nhật hồ sơ -->
    <UModal v-model:open="isOpen" :ui="{ base: 'rounded-2xl' }">
      <UCard
        :ui="{
          body: { padding: 'p-0' },
          header: { padding: 'p-5 border-b border-stone-200 dark:border-stone-800' },
          footer: { padding: 'p-5 bg-stone-50 dark:bg-stone-900/50 border-t border-stone-200 dark:border-stone-800' }
        }"
        class="border border-stone-200 dark:border-stone-800 shadow-2xl"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-marian-blue-100 dark:bg-marian-blue-900 flex items-center justify-center">
                <UIcon name="i-heroicons-user-plus" class="w-4 h-4 text-marian-blue-600 dark:text-marian-blue-400" />
              </div>
              <h3 class="font-bold text-stone-900 dark:text-white">{{ isEditing ? 'Cập Nhật Hồ Sơ' : 'Thêm Hồ Sơ Mới' }}</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" size="sm" @click="isOpen = false" />
          </div>
        </template>

        <form id="student-form" class="p-5 grid grid-cols-1 md:grid-cols-2 gap-5" @submit.prevent="submitForm">
          <div class="space-y-4">
            <p class="section-label border-b border-stone-100 dark:border-stone-800 pb-1">Cá Nhân</p>
            <UFormField label="Tên Thánh" required>
              <UInput v-model="form.holyName" class="w-full" size="sm" :ui="{ base: 'shadow-none rounded-xl' }" />
            </UFormField>
            <UFormField label="Họ và Tên" required>
              <UInput v-model="form.fullName" class="w-full" size="sm" :ui="{ base: 'shadow-none rounded-xl' }" />
            </UFormField>
            <UFormField label="Ngày sinh">
              <UInput v-model="form.birthDate" type="date" class="w-full" size="sm" :ui="{ base: 'shadow-none rounded-xl' }" />
            </UFormField>
            <UFormField label="Ngành Phụ Trách" required>
              <USelect v-model="form.branch" :options="branchOptions" class="w-full" size="sm" :ui="{ base: 'shadow-none rounded-xl' }" />
            </UFormField>
            <UFormField label="Lớp học">
              <UInput v-model="form.className" class="w-full" size="sm" :ui="{ base: 'shadow-none rounded-xl' }" />
            </UFormField>
          </div>
          <div class="space-y-4">
            <p class="section-label border-b border-stone-100 dark:border-stone-800 pb-1">Bí Tích</p>
            <UFormField label="Rửa Tội">
              <UInput v-model="form.baptismDate" type="date" class="w-full" size="sm" :ui="{ base: 'shadow-none rounded-xl' }" />
            </UFormField>
            <UFormField label="Rước Lễ">
              <UInput v-model="form.communionDate" type="date" class="w-full" size="sm" :ui="{ base: 'shadow-none rounded-xl' }" />
            </UFormField>
            <UFormField label="Thêm Sức">
              <UInput v-model="form.confirmationDate" type="date" class="w-full" size="sm" :ui="{ base: 'shadow-none rounded-xl' }" />
            </UFormField>
          </div>
        </form>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton label="Hủy bỏ" color="neutral" variant="soft" size="sm" class="rounded-xl" @click="isOpen = false" />
            <UButton
              type="submit"
              form="student-form"
              :label="isEditing ? 'Cập Nhật' : 'Tạo Mới'"
              color="primary"
              variant="solid"
              size="sm"
              class="rounded-xl font-bold"
              :loading="isSubmitting"
            />
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Modal Excel: Nạp dữ liệu hàng loạt -->
    <UModal v-model:open="isImportOpen" :ui="{ base: 'rounded-2xl' }">
      <UCard
        :ui="{
          body: { padding: 'p-5' },
          header: { padding: 'p-5 border-b border-stone-200 dark:border-stone-800' }
        }"
        class="border border-stone-200 dark:border-stone-800 shadow-2xl"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-document-arrow-up" class="w-4 h-4 text-emerald-600" />
              </div>
              <h3 class="font-bold text-stone-900 dark:text-white">Nạp Dữ Liệu Excel</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" size="sm" @click="isImportOpen = false; importResult = null" />
          </div>
        </template>
        <div class="space-y-4">
          <div v-if="importResult" class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 text-sm">
            <p class="font-semibold text-emerald-700 dark:text-emerald-400">
              ✓ Thành công! Đã thêm {{ importResult.count }} hồ sơ.
            </p>
          </div>
          <UFormField label="Chọn file Excel (.xlsx)" required>
            <UInput
              :key="excelInputKey"
              type="file"
              accept=".xlsx,.xls"
              class="w-full"
              size="sm"
              :ui="{ base: 'shadow-none rounded-xl' }"
              @change="onFileChange"
            />
          </UFormField>
          <UButton
            label="Nạp dữ liệu"
            color="primary"
            size="sm"
            class="w-full justify-center rounded-xl font-bold"
            :loading="isUploading"
            :disabled="!excelFile"
            @click="uploadExcel"
          />
        </div>
      </UCard>
    </UModal>

    <!-- Modal Tin Tức: Đăng thông báo mới -->
    <UModal v-model:open="isNewsModalOpen" :ui="{ base: 'rounded-2xl' }">
      <UCard
        :ui="{
          body: { padding: 'p-5' },
          header: { padding: 'p-5 border-b border-stone-200 dark:border-stone-800' }
        }"
        class="border border-stone-200 dark:border-stone-800 shadow-2xl"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-megaphone" class="w-4 h-4 text-amber-600" />
              </div>
              <h3 class="font-bold text-stone-900 dark:text-white">Đăng Thông Báo Mới</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" size="sm" @click="isNewsModalOpen = false" />
          </div>
        </template>
        <div class="space-y-4">
          <UFormField label="Tiêu đề">
            <UInput v-model="newsForm.title" placeholder="Tiêu đề thông báo" size="sm" :ui="{ base: 'shadow-none rounded-xl' }" />
          </UFormField>
          <UFormField label="Phạm vi">
            <USelect
              v-model="newsForm.branch"
              :options="[{ value: 0, label: 'Toàn đoàn' }, ...branchOptions]"
              size="sm"
              :ui="{ base: 'shadow-none rounded-xl' }"
            />
          </UFormField>
          <UFormField label="Nội dung">
            <UTextarea v-model="newsForm.content" autoresize :ui="{ base: 'shadow-none rounded-xl' }" />
          </UFormField>
          <UCheckbox v-model="newsForm.isUrgent" label="Tin khẩn cấp" />
          <UButton
            label="Đăng tin"
            color="primary"
            size="sm"
            class="w-full justify-center mt-2 rounded-xl font-bold"
            @click="submitNews"
          />
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Tổng Quan Hệ Thống - GiaoLy' })

const auth = useAuthStore()
const toast = useToast()

// ── Quick Action Card: component nhỏ nội tuyến ──
const QuickActionCard = defineComponent({
  props: { icon: String, label: String, color: String, to: String },
  emits: ['click'],
  setup(props, { emit }) {
    const colorMap = {
      blue:   'bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/60 text-blue-600 dark:text-blue-400',
      amber:  'bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-amber-600 dark:text-amber-400',
      emerald:'bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
      purple: 'bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-950/60 text-purple-600 dark:text-purple-400',
    }
    const cls = computed(() => colorMap[props.color] || colorMap.blue)

    return () => {
      const inner = [
        h(resolveComponent('UIcon'), { name: props.icon, class: 'w-7 h-7 mb-2' }),
        h('p', { class: 'text-xs font-bold text-center leading-tight' }, props.label)
      ]
      const wrapperClass = `p-4 rounded-2xl flex flex-col items-center justify-center cursor-pointer border border-transparent hover:border-current/20 transition-all duration-200 hover:-translate-y-0.5 shadow-sm ${cls.value}`

      if (props.to) {
        return h(resolveComponent('NuxtLink'), { to: props.to, class: wrapperClass }, { default: () => inner })
      }
      return h('div', { class: wrapperClass, onClick: () => emit('click') }, inner)
    }
  }
})

// ── Ngày giờ hiện tại ──
const currentDateTime = ref('')
const updateTime = () => {
  currentDateTime.value = new Date().toLocaleString('vi-VN', {
    weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}
updateTime()
onMounted(() => { setInterval(updateTime, 60000) })

// ── Niên khóa ──
const { data: academicYears } = await useApiFetch('/AcademicYear', { default: () => [] })
const activeYear = computed(() => academicYears.value?.find(y => y.isActive) || null)

// ── Students & Stats ──
const { data: students, pending, refresh: refreshStudents } = await useApiFetch('/Student', { default: () => [] })

const branchStats = computed(() => {
  const branches = [1, 2, 3, 4]
  return branches.map(b => ({
    branch: b,
    count: students.value?.filter(s => s.branch === b).length || 0
  }))
})

// ── Announcements ──
const { data: announcements, refresh: refreshNews } = await useApiFetch('/Announcement')

// ── Liturgical ──
const { data: liturgicalToday } = await useApiFetch('/Liturgical/today')

// ── Birthdays this month ──
const upcomingBirthdays = computed(() => {
  if (!students.value) return []
  const thisMonth = new Date().getMonth()
  return students.value.filter(s => {
    if (!s.birthDate) return false
    return new Date(s.birthDate).getMonth() === thisMonth
  }).slice(0, 5)
})

// ── Search Table ──
const q = ref('')
const selectedBranch = ref('0')
const branchOptions = [
  { value: 1, label: 'Ấu Nhi' },
  { value: 2, label: 'Thiếu Nhi' },
  { value: 3, label: 'Nghĩa Sĩ' },
  { value: 4, label: 'Hiệp Sĩ' }
]
const branchFilterOptions = [{ value: '0', label: 'Tất cả Ngành' }, ...branchOptions]

const filteredRows = computed(() => {
  if (!students.value) return []
  return students.value.filter((student) => {
    const searchTerm = q.value.toLowerCase()
    const matchesSearch = !q.value || student.fullName.toLowerCase().includes(searchTerm) || student.holyName.toLowerCase().includes(searchTerm)
    const matchesBranch = selectedBranch.value === '0' || student.branch === parseInt(selectedBranch.value)
    return matchesSearch && matchesBranch
  }).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
})

const columns = [
  { accessorKey: 'fullName', header: 'Họ và Tên' },
  { accessorKey: 'sacraments', header: 'Bí Tích' },
  { accessorKey: 'branch', header: 'Ngành' },
  { accessorKey: 'className', header: 'Lớp' },
  { accessorKey: 'actions', header: '' }
]

const getStudentActions = (student) => [
  [{ label: 'Mở chi tiết', icon: 'i-heroicons-arrow-top-right-on-square', click: () => { window.location.href = '/admin/students' } }],
  [{ label: 'Chỉnh sửa', icon: 'i-heroicons-pencil', click: () => openEditModal(student) }],
  [{ label: 'Xóa hồ sơ', icon: 'i-heroicons-trash', color: 'red', click: () => deleteStudent(student.id) }]
]

// ── Modal CRUD Student ──
const isOpen = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const currentEditId = ref(null)
const initialForm = { holyName: '', fullName: '', birthDate: '', className: '', branch: 1, baptismDate: '', communionDate: '', confirmationDate: '' }
const form = reactive({ ...initialForm })

const openCreateModal = () => {
  isEditing.value = false; currentEditId.value = null; Object.assign(form, initialForm); isOpen.value = true
}
const openEditModal = (student) => {
  isEditing.value = true; currentEditId.value = student.id
  Object.assign(form, {
    ...student,
    birthDate: student.birthDate?.slice(0, 10) || '',
    baptismDate: student.baptismDate?.slice(0, 10) || '',
    communionDate: student.communionDate?.slice(0, 10) || '',
    confirmationDate: student.confirmationDate?.slice(0, 10) || ''
  })
  isOpen.value = true
}
const deleteStudent = async (id) => {
  if (!confirm('Xác nhận xóa hồ sơ này?')) return
  try {
    await $api(`/Student/${id}`, { method: 'DELETE' }); await refreshStudents()
    toast.add({ title: 'Đã xóa', color: 'success' })
  } catch (error) { toast.add({ title: 'Lỗi', color: 'error' }) }
}
const submitForm = async () => {
  isSubmitting.value = true
  try {
    const payload = { ...form, branch: parseInt(form.branch), baptismDate: form.baptismDate || null, communionDate: form.communionDate || null, confirmationDate: form.confirmationDate || null }
    const url = isEditing.value ? `/Student/${currentEditId.value}` : '/Student'
    await $api(url, { method: isEditing.value ? 'PUT' : 'POST', body: payload })
    isOpen.value = false; await refreshStudents()
    toast.add({ title: isEditing.value ? 'Cập nhật thành công' : 'Thêm thành công', color: 'success' })
  } catch (error) { toast.add({ title: 'Lỗi', color: 'error' }) }
  isSubmitting.value = false
}

// ── Modal Excel ──
const isImportOpen = ref(false)
const excelFile = ref(null)
const isUploading = ref(false)
const importResult = ref(null)
const excelInputKey = ref(0)
const onFileChange = (e) => { if (e.target.files?.length) { excelFile.value = e.target.files[0]; importResult.value = null } }
const uploadExcel = async () => {
  if (!excelFile.value) return
  isUploading.value = true
  const formData = new FormData()
  formData.append('file', excelFile.value)
  try {
    const res = await $api('/Student/import-excel', { method: 'POST', body: formData })
    importResult.value = res; excelFile.value = null; await refreshStudents()
  } catch (error) { toast.add({ title: 'Lỗi nạp file', color: 'error' }) }
  isUploading.value = false
}

// ── Modal News ──
const isNewsModalOpen = ref(false)
const newsForm = reactive({ title: '', content: '', branch: 0, isUrgent: false })
const submitNews = async () => {
  if (!newsForm.title || !newsForm.content) return toast.add({ title: 'Thiếu thông tin', color: 'error' })
  try {
    await $api('/Announcement', {
      method: 'POST',
      body: { title: newsForm.title, content: newsForm.content, branch: parseInt(newsForm.branch), type: newsForm.isUrgent ? 1 : 0, targetAudience: 0, expiryDate: null }
    })
    isNewsModalOpen.value = false; Object.assign(newsForm, { title: '', content: '', branch: 0, isUrgent: false }); await refreshNews()
    toast.add({ title: 'Đã đăng tin', color: 'success' })
  } catch (error) { toast.add({ title: 'Lỗi đăng', color: 'error' }) }
}
const deleteAnnouncement = async (id) => {
  if (!confirm('Xóa thông báo này?')) return
  try { await $api(`/Announcement/${id}`, { method: 'DELETE' }); await refreshNews() } catch (error) {}
}

// ── Helpers ──
const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('vi-VN') : '---'
const formatDateShort = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : ''
const getPercentage = (num, total) => total ? `${(num / total) * 100}%` : '0%'

// Tỉ lệ cho progress rings
const getBaptismRatio = () => {
  const count = students.value?.filter(s => s.baptismDate).length || 0
  const total = students.value?.length || 0
  return total ? count / total : 0
}
const getCommunionRatio = () => {
  const count = students.value?.filter(s => s.communionDate).length || 0
  const total = students.value?.length || 0
  return total ? count / total : 0
}
const getConfirmationRatio = () => {
  const count = students.value?.filter(s => s.confirmationDate).length || 0
  const total = students.value?.length || 0
  return total ? count / total : 0
}

// Tên ngành
const getBranchName = (id) => ({ 1: 'Ấu Nhi', 2: 'Thiếu Nhi', 3: 'Nghĩa Sĩ', 4: 'Hiệp Sĩ' }[id] || 'Chung')

// Icon ngành
const getBranchIcon = (id) => ({
  1: 'i-heroicons-heart',
  2: 'i-heroicons-face-smile',
  3: 'i-heroicons-academic-cap',
  4: 'i-heroicons-fire'
}[id] || 'i-heroicons-user')

// Màu nền icon ngành (metric card)
const getBranchBgClass = (id) => ({
  1: 'bg-pink-50 dark:bg-pink-950/30',
  2: 'bg-blue-50 dark:bg-blue-950/30',
  3: 'bg-emerald-50 dark:bg-emerald-950/30',
  4: 'bg-red-50 dark:bg-red-950/30'
}[id] || 'bg-stone-100 dark:bg-stone-800')

// Màu icon ngành
const getBranchIconColor = (id) => ({
  1: 'text-pink-500 dark:text-pink-400',
  2: 'text-blue-500 dark:text-blue-400',
  3: 'text-emerald-500 dark:text-emerald-400',
  4: 'text-red-500 dark:text-red-400'
}[id] || 'text-stone-400')

// Badge ngành
const getBranchBadgeClass = (id) => ({
  1: 'badge-aunhi',
  2: 'badge-thieunhi',
  3: 'badge-nghiasi',
  4: 'badge-hiepsi',
  0: 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700'
}[id] || 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700')

// Avatar màu theo ngành
const getBranchAvatarClass = (id) => ({
  1: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
  2: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  3: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  4: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
}[id] || 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400')

// Màu chấm phụng vụ
const getColorDot = (color) => {
  const c = color?.toLowerCase()
  if (c === 'red') return 'liturgical-dot-red'
  if (c === 'purple') return 'liturgical-dot-purple'
  if (c === 'white') return 'liturgical-dot-white'
  if (c === 'rose') return 'liturgical-dot-rose'
  if (c === 'black') return 'liturgical-dot-black'
  return 'liturgical-dot-green'
}

// Label vai trò
const getRoleLabel = (r) => ({ 1: 'Admin', 2: 'Thư Ký', 3: 'Mod' }[r] || 'Trưởng')
</script>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-19"></a>📄 [19/71] File: `web-admin/pages/admin/documents.vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Admin Pages (Quản trị) | **Số dòng:** 342 | **Kích thước:** 19.1 KB

```markup
<template>
  <div class="min-h-screen font-sans relative pb-24 overflow-hidden">
    <!-- BACKGROUND MESH GRADIENT -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute -top-32 right-1/4 w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob bg-sky-200 dark:bg-sky-900"></div>
      <div class="absolute bottom-0 -left-32 w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-cyan-200 dark:bg-cyan-900"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
    </div>

    <div class="relative z-10 space-y-6 animate-fade-in-up px-4 md:px-8 pt-8 max-w-7xl mx-auto">
      <!-- ── PAGE HEADER & BANNER ── -->
      <div class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="z-10 text-center md:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-300 text-xs font-black uppercase tracking-widest border border-sky-200 dark:border-sky-800 shadow-inner">
            <UIcon name="i-heroicons-document-duplicate" class="w-4 h-4" />
            <span>Phân Hệ Nội Dung</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-stone-800 dark:text-white tracking-tight">
            Thư Viện <span class="text-sky-500">Tài Liệu Số</span>
          </h1>
          <p class="text-stone-500 text-sm mt-2 max-w-lg">
            Trung tâm lưu trữ, chia sẻ giáo án, tài liệu học và văn bản hành chính của xứ đoàn.
          </p>
        </div>
        
        <div class="flex flex-wrap items-center justify-center gap-3 z-10">
          <UButton
            v-if="auth?.hasPermission('documents.create')"
            label="Tải Lên Tài Liệu"
            icon="i-heroicons-cloud-arrow-up"
            color="sky"
            variant="solid"
            size="lg"
            class="rounded-2xl shadow-lg shadow-sky-500/20 hover:-translate-y-0.5 transition-transform font-bold uppercase tracking-wider"
            @click="openUpload"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start mt-6">
        
        <!-- ── SIDEBAR DANH MỤC ── -->
        <div class="lg:col-span-1 bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/60 dark:border-stone-800 rounded-[2rem] p-6 shadow-xl shadow-black/5 sticky top-6">
          <h3 class="font-black text-stone-800 dark:text-white mb-4 flex items-center gap-2"><UIcon name="i-heroicons-folder-open" class="text-sky-500" /> Danh Mục</h3>
          
          <div class="space-y-2">
            <button
              v-for="cat in categories"
              :key="cat.value"
              class="w-full text-left px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-3"
              :class="filter.category === cat.value ? 'bg-sky-500 text-white shadow-md' : 'text-stone-500 hover:bg-white dark:hover:bg-stone-800 hover:text-sky-600'"
              @click="setCategory(cat.value)"
            >
              <UIcon :name="cat.icon" class="w-5 h-5" />
              {{ cat.label }}
            </button>
          </div>

          <h3 class="font-black text-stone-800 dark:text-white mt-8 mb-4 flex items-center gap-2"><UIcon name="i-heroicons-shield-check" class="text-cyan-500" /> Phân Quyền</h3>
          <USelectMenu
            v-model="filter.access"
            :options="[{ label: 'Tất cả quyền', value: 'all' }, { label: 'Công khai (Public)', value: 'Public' }, { label: 'Nội bộ (Internal)', value: 'Internal' }]"
            value-attribute="value"
            option-attribute="label"
            class="w-full"
            :ui="{ base: 'rounded-xl shadow-inner' }"
            @change="fetchDocuments"
          />
        </div>

        <!-- ── MAIN CONTENT (FILE GRID) ── -->
        <div class="lg:col-span-3">
          
          <div class="flex items-center justify-between mb-4 bg-white/50 dark:bg-stone-900/50 backdrop-blur-md p-3 px-5 rounded-2xl border border-white/50 dark:border-stone-800">
            <p class="text-sm font-bold text-stone-500"><span class="text-sky-600">{{ documents.length }}</span> tài liệu tìm thấy</p>
            <UButton icon="i-heroicons-arrow-path" color="neutral" variant="ghost" size="sm" class="rounded-xl" @click="fetchDocuments" />
          </div>

          <!-- Loading -->
          <div v-if="pending" class="flex flex-col items-center justify-center py-32 bg-white/20 dark:bg-stone-900/20 backdrop-blur-xl rounded-[2rem] border border-white/30 dark:border-stone-800">
            <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 animate-spin text-sky-400 mb-4" />
            <p class="text-stone-500 font-bold uppercase tracking-widest text-sm">Đang tải dữ liệu...</p>
          </div>

          <!-- Empty -->
          <div v-else-if="!documents.length" class="text-center py-32 bg-white/20 dark:bg-stone-900/20 backdrop-blur-xl rounded-[2rem] border border-white/30 dark:border-stone-800">
            <UIcon name="i-heroicons-document-magnifying-glass" class="w-16 h-16 text-stone-300 dark:text-stone-700 mx-auto mb-4" />
            <p class="text-stone-500 font-bold text-lg">Chưa có tài liệu nào trong thư mục này.</p>
          </div>

          <!-- Grid Files -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="doc in documents"
              :key="doc.id"
              class="group bg-white/60 dark:bg-stone-900/60 backdrop-blur-2xl border border-white/80 dark:border-stone-800 rounded-3xl p-5 shadow-xl shadow-black/5 hover:border-sky-400 hover:shadow-sky-500/10 hover:-translate-y-1 transition-all flex flex-col"
            >
              <div class="flex justify-between items-start mb-4">
                <div class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner" :class="getFileColorBg(doc.fileName)">
                  <UIcon :name="getFileIcon(doc.fileName)" class="w-8 h-8" :class="getFileColorText(doc.fileName)" />
                </div>
                <UBadge :label="doc.accessLevel === 'Internal' ? 'Nội Bộ' : 'Công Khai'" :color="doc.accessLevel === 'Internal' ? 'amber' : 'emerald'" variant="subtle" size="xs" class="font-black uppercase tracking-widest rounded-lg" />
              </div>

              <h4 class="font-black text-stone-800 dark:text-white text-base leading-tight break-words line-clamp-2 mb-1 group-hover:text-sky-600 transition-colors" :title="doc.fileName">
                {{ doc.fileName }}
              </h4>
              <p class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">
                {{ formatBytes(doc.fileSize) }} • {{ formatDate(doc.uploadDate) }}
              </p>

              <div class="mt-auto pt-4 border-t border-stone-200/50 dark:border-stone-800/50 flex items-center justify-between">
                <UBadge :label="doc.category" color="sky" variant="soft" size="xs" class="rounded-lg" />
                <div class="flex gap-1">
                  <UButton icon="i-heroicons-arrow-down-tray" color="primary" variant="ghost" size="sm" class="rounded-xl hover:bg-sky-50 dark:hover:bg-sky-900/20" :to="`/api/Document/download/${doc.id}`" target="_blank" external />
                  <UTooltip text="Xóa File" v-if="auth?.hasPermission('documents.delete')">
                    <UButton icon="i-heroicons-trash" color="error" variant="ghost" size="sm" class="rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20" @click="confirmDelete(doc)" />
                  </UTooltip>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         MODAL: TẢI LÊN TÀI LIỆU
    ═══════════════════════════════════════════════════════ -->
    <UModal v-model:open="isUploadOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden sm:max-w-xl' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' }, footer: { padding: 'p-6 bg-stone-50 dark:bg-stone-900' } }">
        <template #header>
          <div class="bg-sky-600 dark:bg-sky-900 p-6 flex justify-between items-center text-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><UIcon name="i-heroicons-cloud-arrow-up" class="w-6 h-6" /></div>
              <h3 class="text-xl font-black uppercase tracking-wide">Tải Lên Tài Liệu</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="white" variant="ghost" class="hover:bg-white/10 rounded-full" @click="isUploadOpen = false" />
          </div>
        </template>
        
        <form class="p-8 space-y-6" @submit.prevent="submitUpload">
          <div class="p-6 border-2 border-dashed border-sky-300 dark:border-sky-700 bg-sky-50/50 dark:bg-sky-900/10 rounded-[2rem] text-center hover:bg-sky-100/50 dark:hover:bg-sky-900/20 transition-colors">
            <UIcon name="i-heroicons-document-arrow-up" class="w-12 h-12 text-sky-400 mx-auto mb-2" />
            <input
              ref="fileInput"
              type="file"
              class="block w-full text-sm text-stone-500
              file:mx-auto file:py-2 file:px-4
              file:rounded-xl file:border-0
              file:text-sm file:font-bold file:uppercase file:tracking-widest
              file:bg-sky-200 file:text-sky-800 dark:file:bg-sky-800 dark:file:text-sky-200
              hover:file:bg-sky-300 transition-colors cursor-pointer"
              required
            >
          </div>

          <UFormField label="Danh mục lưu trữ">
            <USelectMenu v-model="uploadForm.category" :options="['Giáo án', 'Nhạc đoàn', 'Văn bản', 'Tài liệu học']" class="w-full" :ui="{ base: 'rounded-xl shadow-inner' }" />
          </UFormField>

          <UFormField label="Phân quyền truy cập">
            <USelectMenu v-model="uploadForm.accessLevel" :options="[{ label: 'Công khai (Mọi người đều thấy)', value: 'Public' }, { label: 'Nội bộ (Chỉ Admin/Ban Điều Hành)', value: 'Internal' }]" value-attribute="value" option-attribute="label" class="w-full" :ui="{ base: 'rounded-xl shadow-inner' }" />
          </UFormField>

          <UFormField label="Từ khóa (Tags)">
            <UInput v-model="uploadForm.tags" placeholder="VD: GiaoAn, AuNhi, Thang8..." class="w-full" :ui="{ base: 'rounded-xl shadow-inner' }" />
          </UFormField>
        </form>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Hủy" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isUploadOpen = false" />
            <UButton label="Đẩy Lên Server" color="sky" variant="solid" size="lg" class="rounded-xl font-black uppercase tracking-wider shadow-lg shadow-sky-500/20" :loading="uploading" icon="i-heroicons-cloud-arrow-up" @click="submitUpload" />
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- ═══════════════════════════════════════════════════════
         MODAL: XÁC NHẬN XÓA
    ═══════════════════════════════════════════════════════ -->
    <UModal v-model:open="isDeleteOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden' }">
      <UCard :ui="{ body: { padding: 'p-6' }, header: { padding: 'p-6 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/50' } }">
        <template #header>
          <div class="flex items-center gap-3 text-red-600 dark:text-red-400">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8" />
            <h3 class="text-xl font-black uppercase tracking-wide">Xóa Tài Liệu</h3>
          </div>
        </template>
        <p class="text-stone-600 dark:text-stone-300 mb-6">Bạn có chắc muốn xóa file <b>"{{ deletingDoc?.fileName }}"</b>? Hành động này không thể hoàn tác.</p>
        <div class="flex justify-end gap-3">
          <UButton label="Hủy" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isDeleteOpen = false" />
          <UButton label="Xóa Vĩnh Viễn" color="error" variant="solid" size="lg" class="rounded-xl font-black uppercase tracking-wider" icon="i-heroicons-trash" :loading="deleting" @click="executeDelete" />
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
useHead({ title: 'Thư Viện Tài Liệu - GiaoLy Admin' })

const toast = useToast()
const auth = useAuthStore()

const categories = [
  { label: 'Tất Cả', value: 'Tất cả', icon: 'i-heroicons-rectangle-stack' },
  { label: 'Giáo Án', value: 'Giáo án', icon: 'i-heroicons-book-open' },
  { label: 'Nhạc Đoàn', value: 'Nhạc đoàn', icon: 'i-heroicons-musical-note' },
  { label: 'Văn Bản', value: 'Văn bản', icon: 'i-heroicons-document-text' },
  { label: 'Tài Liệu Học', value: 'Tài liệu học', icon: 'i-heroicons-academic-cap' }
]

const filter = ref({ category: 'Tất cả', access: 'all' })
const documents = ref([])
const pending = ref(true)

const fetchDocuments = async () => {
  pending.value = true
  try {
    const params = new URLSearchParams()
    if (filter.value.category !== 'Tất cả') params.append('category', filter.value.category)
    if (filter.value.access !== 'all') params.append('access', filter.value.access)

    const res = await $api(`/Document?${params.toString()}`)
    documents.value = res || []
  } catch { toast.add({ title: 'Lỗi tải danh sách', color: 'error' }) } 
  finally { pending.value = false }
}

onMounted(fetchDocuments)

const setCategory = (val) => {
  filter.value.category = val
  fetchDocuments()
}

// ── UPLOAD ──
const isUploadOpen = ref(false)
const uploading = ref(false)
const fileInput = ref(null)
const uploadForm = ref({ category: 'Giáo án', accessLevel: 'Public', tags: '' })

const openUpload = () => {
  uploadForm.value = { category: 'Giáo án', accessLevel: 'Public', tags: '' }
  if (fileInput.value) fileInput.value.value = ''
  isUploadOpen.value = true
}

const submitUpload = async () => {
  const file = fileInput.value?.files[0]
  if (!file) return toast.add({ title: 'Vui lòng chọn file', color: 'error' })

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('File', file)
    formData.append('Category', uploadForm.value.category)
    formData.append('AccessLevel', uploadForm.value.accessLevel)
    if (uploadForm.value.tags) formData.append('Tags', uploadForm.value.tags)
    formData.append('Branch', '0')

    await $fetch(`${useRuntimeConfig().public.apiBase}/Document/upload`, {
      method: 'POST', body: formData, headers: { Authorization: `Bearer ${auth.token}` }
    })

    toast.add({ title: 'Đã tải lên', color: 'success' })
    isUploadOpen.value = false
    await fetchDocuments()
  } catch (err) { toast.add({ title: 'Lỗi tải lên', description: err?.data?.message || err.message, color: 'error' }) } 
  finally { uploading.value = false }
}

// ── DELETE ──
const isDeleteOpen = ref(false)
const deleting = ref(false)
const deletingDoc = ref(null)
const confirmDelete = (doc) => { deletingDoc.value = doc; isDeleteOpen.value = true }
const executeDelete = async () => {
  deleting.value = true
  try { await $api(`/Document/${deletingDoc.value.id}`, { method: 'DELETE' }); toast.add({ title: 'Đã xóa file', color: 'success' }); isDeleteOpen.value = false; await fetchDocuments() } 
  catch { toast.add({ title: 'Lỗi xóa', color: 'error' }) } 
  finally { deleting.value = false }
}

// ── HELPERS ──
const formatDate = d => d ? new Date(d).toLocaleDateString('vi-VN') : ''
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024; const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const getFileExtension = (filename) => filename.split('.').pop().toLowerCase()
const getFileIcon = (filename) => {
  const ext = getFileExtension(filename)
  if (['pdf'].includes(ext)) return 'i-heroicons-document-text'
  if (['doc', 'docx'].includes(ext)) return 'i-heroicons-document-text'
  if (['xls', 'xlsx'].includes(ext)) return 'i-heroicons-table-cells'
  if (['ppt', 'pptx'].includes(ext)) return 'i-heroicons-presentation-chart-bar'
  if (['mp3', 'wav', 'ogg'].includes(ext)) return 'i-heroicons-musical-note'
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'i-heroicons-photo'
  if (['mp4', 'mov', 'avi'].includes(ext)) return 'i-heroicons-video-camera'
  if (['zip', 'rar'].includes(ext)) return 'i-heroicons-archive-box'
  return 'i-heroicons-document'
}
const getFileColorBg = (filename) => {
  const ext = getFileExtension(filename)
  if (['pdf'].includes(ext)) return 'bg-red-100 dark:bg-red-900/50'
  if (['doc', 'docx'].includes(ext)) return 'bg-blue-100 dark:bg-blue-900/50'
  if (['xls', 'xlsx'].includes(ext)) return 'bg-emerald-100 dark:bg-emerald-900/50'
  if (['ppt', 'pptx'].includes(ext)) return 'bg-orange-100 dark:bg-orange-900/50'
  if (['mp3', 'wav', 'ogg'].includes(ext)) return 'bg-purple-100 dark:bg-purple-900/50'
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'bg-pink-100 dark:bg-pink-900/50'
  return 'bg-stone-100 dark:bg-stone-800'
}
const getFileColorText = (filename) => {
  const ext = getFileExtension(filename)
  if (['pdf'].includes(ext)) return 'text-red-500'
  if (['doc', 'docx'].includes(ext)) return 'text-blue-500'
  if (['xls', 'xlsx'].includes(ext)) return 'text-emerald-500'
  if (['ppt', 'pptx'].includes(ext)) return 'text-orange-500'
  if (['mp3', 'wav', 'ogg'].includes(ext)) return 'text-purple-500'
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'text-pink-500'
  return 'text-stone-500'
}
</script>

<style>
@keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
.animate-blob { animation: blob 10s infinite; }
.animation-delay-2000 { animation-delay: 2s; }
@keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-20"></a>📄 [20/71] File: `web-admin/pages/admin/draft-actions.vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Admin Pages (Quản trị) | **Số dòng:** 199 | **Kích thước:** 6.8 KB

```markup
<template>
  <div class="space-y-6 animate-fade-in-up">
    <!-- ── Page Header ── -->
    <div class="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200/50 dark:border-stone-800/50 pb-5">
      <div>
        <h1 class="text-2xl font-black text-stone-800 dark:text-white uppercase tracking-wide">
          📝 Xét Duyệt <span class="text-primary-500">Lên Lớp</span>
        </h1>
        <p class="text-xs text-stone-400 mt-0.5">
          Phê duyệt hoặc từ chối các đề xuất lên lớp (Draft Actions) từ năm cũ
        </p>
      </div>
      <UButton
        icon="i-heroicons-arrow-left"
        label="Trở Về Quản Lý Niên Khóa"
        color="neutral"
        variant="soft"
        to="/admin/academic-years"
      />
    </div>

    <!-- ── Filter & Year Selection ── -->
    <UCard class="glass-card">
      <div class="flex items-end justify-between gap-4">
        <UFormField
          label="Chọn Niên Khóa Đích"
          class="w-64"
        >
          <USelect
            v-model="selectedYear"
            :options="yearOptions"
            placeholder="-- Chọn niên khóa --"
            @change="fetchDrafts"
          />
        </UFormField>
        
        <div class="flex gap-2" v-if="selectedYear && drafts.filter(d => d.status === 'Pending').length > 0">
          <UButton icon="i-heroicons-x-circle" label="Từ Chối Tất Cả" color="error" variant="soft" @click="bulkReject" :loading="isBulking" />
          <UButton icon="i-heroicons-check-circle" label="Duyệt Tất Cả" color="success" @click="bulkApprove" :loading="isBulking" />
        </div>
      </div>
    </UCard>

    <!-- ── Main Table ── -->
    <UCard
      v-if="selectedYear"
      class="glass-card overflow-hidden"
    >
      <UTable
        :rows="drafts"
        :columns="columns"
        :loading="pending"
        :empty-state="{ icon: 'i-heroicons-inbox', header: 'Không có bản nháp nào cần duyệt' }"
      >
        <template #studentName-cell="{ row }">
          <div class="font-bold text-stone-800 dark:text-stone-200">
            <span class="text-[10px] text-stone-400 uppercase tracking-wider mr-1">{{ row.original.student?.holyName }}</span>
            {{ row.original.student?.fullName }}
          </div>
        </template>
        <template #suggestedClass-cell="{ row }">
          <UBadge
            v-if="row.original.suggestedClassRoom"
            color="primary"
            variant="subtle"
          >
            {{ row.original.suggestedClassRoom.name }}
          </UBadge>
          <span
            v-else
            class="text-xs text-stone-400 italic"
          >Chưa phân lớp</span>
        </template>
        <template #status-cell="{ row }">
          <UBadge
            :label="getStatusLabel(row.original.status)"
            :color="getStatusColor(row.original.status)"
            variant="soft"
            size="xs"
          />
        </template>
        <template #actions-cell="{ row }">
          <div
            v-if="row.original.status === 'Pending'"
            class="flex gap-2"
          >
            <UTooltip text="Duyệt (Đồng ý)">
              <UButton
                icon="i-heroicons-check"
                color="success"
                variant="ghost"
                size="xs"
                @click="approveDraft(row.original.id)"
              />
            </UTooltip>
            <UTooltip text="Từ chối (Lưu ban)">
              <UButton
                icon="i-heroicons-x-mark"
                color="error"
                variant="ghost"
                size="xs"
                @click="rejectDraft(row.original.id)"
              />
            </UTooltip>
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
useHead({ title: 'Xét Duyệt Lên Lớp - GiaoLy Admin' })

const toast = useToast()

const { data: years } = await useApiFetch('/AcademicYear')
const yearOptions = computed(() => years.value?.map(y => ({ value: y.id, header: y.name })) || [])

const selectedYear = ref('')
const drafts = ref([])
const pending = ref(false)

const columns = [
  { accessorKey: 'studentName', header: 'Đoàn Sinh' },
  { accessorKey: 'suggestedClass', header: 'Lớp Đề Xuất' },
  { accessorKey: 'status', header: 'Trạng Thái' },
  { accessorKey: 'actions', header: '' }
]

const getStatusLabel = s => ({ Pending: 'Chờ duyệt', Approved: 'Đã duyệt', Rejected: 'Từ chối' }[s] || s)
const getStatusColor = s => ({ Pending: 'warning', Approved: 'success', Rejected: 'error' }[s] || 'neutral')

const fetchDrafts = async () => {
  if (!selectedYear.value) return
  pending.value = true
  try {
    drafts.value = await $api(`/DraftAction/${selectedYear.value}`) || []
  } catch {
    toast.add({ title: 'Lỗi tải danh sách nháp', color: 'error' })
  } finally {
    pending.value = false
  }
}

const approveDraft = async (id) => {
  try {
    await $api(`/DraftAction/approve/${id}`, { method: 'POST' })
    toast.add({ title: 'Đã duyệt lên lớp', color: 'success' })
    await fetchDrafts()
  } catch (err) {
    toast.add({ title: 'Lỗi khi duyệt', description: err.data?.message || err.message, color: 'error' })
  }
}

const rejectDraft = async (id) => {
  try {
    await $api(`/DraftAction/reject/${id}`, { method: 'POST' })
    toast.add({ title: 'Đã từ chối', color: 'error' })
    await fetchDrafts()
  } catch {
    toast.add({ title: 'Lỗi', color: 'error' })
  }
}

const isBulking = ref(false)

const bulkApprove = async () => {
  if (!selectedYear.value) return
  if (!confirm('Bạn có chắc chắn muốn duyệt TẤT CẢ bản nháp đang chờ?')) return
  isBulking.value = true
  try {
    const res = await $api(`/DraftAction/bulk-approve/${selectedYear.value}`, { method: 'POST' })
    toast.add({ title: 'Thành công', description: `Đã duyệt ${res.count} bản nháp`, color: 'success' })
    await fetchDrafts()
  } catch (err) {
    toast.add({ title: 'Lỗi', description: err.message, color: 'error' })
  } finally {
    isBulking.value = false
  }
}

const bulkReject = async () => {
  if (!selectedYear.value) return
  if (!confirm('Bạn có chắc chắn muốn từ chối TẤT CẢ bản nháp đang chờ?')) return
  isBulking.value = true
  try {
    const res = await $api(`/DraftAction/bulk-reject/${selectedYear.value}`, { method: 'POST' })
    toast.add({ title: 'Thành công', description: `Đã từ chối ${res.count} bản nháp`, color: 'error' })
    await fetchDrafts()
  } catch (err) {
    toast.add({ title: 'Lỗi', description: err.message, color: 'error' })
  } finally {
    isBulking.value = false
  }
}
</script>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-21"></a>📄 [21/71] File: `web-admin/pages/admin/leaders.vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Admin Pages (Quản trị) | **Số dòng:** 630 | **Kích thước:** 31.4 KB

```markup
<template>
  <div class="min-h-screen font-sans relative pb-24 overflow-hidden selection:bg-amber-500/30">
    <!-- BACKGROUND MESH GRADIENT -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute -top-40 -left-40 w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob bg-blue-200 dark:bg-blue-900"></div>
      <div class="absolute -bottom-40 right-0 w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-amber-200 dark:bg-amber-900"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
    </div>

    <div class="relative z-10 space-y-6 animate-fade-in-up px-4 md:px-8 pt-8 max-w-7xl mx-auto">
      <!-- ── PAGE HEADER & BANNER ── -->
      <div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="z-10 text-center lg:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-black uppercase tracking-widest border border-amber-200 dark:border-amber-800 shadow-inner">
            <UIcon name="i-heroicons-user-group" class="w-4 h-4" />
            <span>Phân Hệ Quản Trị Nhân Sự</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
            Ban Điều Hành & <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">Giáo Lý Viên</span>
          </h1>
          <p class="text-stone-500 text-sm mt-2 max-w-xl">
            Quản lý cơ cấu Sứ Đoàn: Ban Linh Hướng, Ban Điều Hành và Huynh Trưởng 5 Ngành theo sơ đồ thực tế.
          </p>
        </div>
        
        <div class="flex flex-wrap items-center justify-center gap-3 z-10">
          <UButton
            v-if="auth?.hasPermission('leaders.update')"
            label="Xoay Vòng Nhiệm Kỳ"
            icon="i-heroicons-arrow-path-rounded-square"
            color="neutral"
            variant="soft"
            size="lg"
            class="rounded-2xl shadow-sm hover:-translate-y-0.5 transition-transform font-bold text-amber-600"
            @click="isRotateOpen = true"
          />
          <UButton
            v-if="auth?.hasPermission('leaders.create')"
            label="Thêm Nhân Sự Mới"
            icon="i-heroicons-user-plus"
            color="primary"
            variant="solid"
            size="lg"
            class="rounded-2xl shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 transition-transform font-black uppercase tracking-wider bg-gradient-to-r from-amber-600 to-amber-500 text-white"
            @click="openCreate"
          />
        </div>
      </div>

      <!-- ── BỘ LỌC ĐA NĂNG (INSPIRATION FROM ANHEMMOTOR TABS & SEARCH) ── -->
      <div class="bg-white/60 dark:bg-stone-900/60 backdrop-blur-2xl border border-white/60 dark:border-stone-800 rounded-3xl p-4 shadow-xl shadow-black/5 space-y-4">
        <!-- Hàng 1: Trạng thái & Tìm kiếm -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <!-- Active vs History Tab -->
          <div class="bg-stone-100/70 dark:bg-stone-800/70 p-1 rounded-2xl border border-stone-200/50 dark:border-stone-700/50 inline-flex">
            <button
              class="px-5 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-wider"
              :class="activeTab === 'active' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'"
              @click="activeTab = 'active'"
            >
              Đang Nhiệm Kỳ
            </button>
            <button
              class="px-5 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-wider flex items-center gap-1.5"
              :class="activeTab === 'history' ? 'bg-stone-900 text-white dark:bg-stone-700 shadow' : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'"
              @click="activeTab = 'history'"
            >
              Cựu Trào <UIcon name="i-heroicons-clock" class="w-3.5 h-3.5" />
            </button>
          </div>

          <!-- Quick Search -->
          <div class="w-full md:w-80 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UIcon name="i-heroicons-magnifying-glass" class="w-4 h-4 text-stone-400" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm theo Tên Thánh, Họ Tên, Chức vụ..."
              class="w-full pl-9 pr-4 py-2 bg-stone-100/60 dark:bg-stone-800/60 rounded-xl border border-stone-200/50 dark:border-stone-700/50 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
        </div>

        <!-- Hàng 2: THANH PHÂN CẤP THEO SƠ ĐỒ XỨ ĐOÀN (BRANCH TABS) -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            v-for="cat in categoryFilters"
            :key="cat.id"
            class="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border"
            :class="selectedCategory === cat.id ? cat.activeClass : 'bg-stone-50 dark:bg-stone-800/40 text-stone-500 border-stone-200/50 dark:border-stone-800 hover:bg-stone-100'"
            @click="selectedCategory = cat.id"
          >
            <span>{{ cat.icon }}</span>
            <span>{{ cat.label }}</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10 ml-0.5">
              {{ getCategoryCount(cat.id) }}
            </span>
          </button>
        </div>
      </div>

      <!-- ── LOADING ── -->
      <div v-if="pending" class="flex flex-col items-center justify-center py-24 bg-white/20 dark:bg-stone-900/20 backdrop-blur-xl rounded-[2rem]">
        <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 animate-spin text-amber-500 mb-4" />
        <p class="text-stone-500 font-bold uppercase tracking-widest text-sm">Đang tải danh sách nhân sự...</p>
      </div>

      <!-- ── EMPTY ── -->
      <div v-else-if="!filteredList.length" class="text-center py-20 bg-white/40 dark:bg-stone-900/40 backdrop-blur-xl rounded-[2rem] border border-white/50 dark:border-stone-800 shadow-sm">
        <UIcon name="i-heroicons-user-group" class="w-16 h-16 text-stone-300 dark:text-stone-700 mx-auto mb-4" />
        <p class="text-stone-600 dark:text-stone-300 font-bold text-base">Không tìm thấy nhân sự phù hợp với bộ lọc.</p>
        <p class="text-stone-400 text-xs mt-1">Hãy thử xóa từ khóa tìm kiếm hoặc chọn danh mục khác.</p>
      </div>

      <!-- ── GRID DANH SÁCH NHÂN SỰ ĐƯỢC CHUẨN HÓA ── -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        <div
          v-for="leader in filteredList"
          :key="leader.id"
          class="group bg-white/70 dark:bg-stone-900/70 backdrop-blur-2xl border border-white/80 dark:border-stone-800 rounded-3xl p-5 shadow-lg shadow-black/5 flex flex-col justify-between transition-all relative overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:border-amber-400/50"
        >
          <!-- Active Gradient Glow -->
          <div v-if="activeTab === 'active'" class="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none"></div>

          <!-- Top Row: Badge Ngành & Chức danh -->
          <div class="relative z-10 flex items-center justify-between gap-2 mb-3">
            <span class="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md" :class="getBranchBadgeClass(leader.branch)">
              {{ getBranchName(leader.branch) }}
            </span>
            <span class="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
              Cấp {{ leader.level }}
            </span>
          </div>

          <!-- Info & Avatar Center -->
          <div class="relative z-10 flex flex-col items-center text-center">
            <!-- Avatar -->
            <div class="relative mb-3 group/avatar">
              <UAvatar
                :src="leader.avatarPath ? `${config.public.apiBase}${leader.avatarPath}` : undefined"
                :alt="leader.fullName"
                size="3xl"
                class="w-20 h-20 shadow-md ring-3 ring-amber-400/30 bg-stone-100 dark:bg-stone-800"
                :ui="{ placeholder: 'font-black text-xl text-stone-400' }"
              />
              <button
                v-if="auth?.hasPermission('leaders.update')"
                class="absolute bottom-0 right-0 p-1.5 bg-amber-500 text-stone-950 rounded-full shadow-md opacity-0 group-hover/avatar:opacity-100 transition-all hover:scale-110"
                title="Đổi ảnh thẻ"
                @click="openAvatarUpload(leader)"
              >
                <UIcon name="i-heroicons-camera" class="w-3.5 h-3.5" />
              </button>
            </div>

            <!-- Profile Info -->
            <div class="space-y-0.5 w-full">
              <p class="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider truncate">{{ leader.holyName || '---' }}</p>
              <h3 class="font-black text-stone-900 dark:text-white text-base leading-tight truncate group-hover:text-amber-600 transition-colors">{{ leader.fullName }}</h3>
              <p class="text-xs font-bold text-stone-600 dark:text-stone-300 mt-1 truncate">{{ leader.position }}</p>
            </div>

            <p class="text-[11px] text-stone-500 italic mt-3 min-h-[2rem] line-clamp-2 px-1">
              "{{ leader.description || 'Hi sinh & Phục vụ...' }}"
            </p>
          </div>

          <!-- Bottom Footer -->
          <div class="relative z-10 mt-4 pt-3 border-t border-stone-200/50 dark:border-stone-800 flex items-center justify-between text-[11px] font-bold text-stone-400">
            <span class="flex items-center gap-1">
              <UIcon name="i-heroicons-calendar" class="w-3.5 h-3.5 text-stone-400" /> {{ leader.term || '---' }}
            </span>
            
            <!-- Quick Actions -->
            <div class="flex items-center gap-1.5">
              <UButton
                v-if="auth?.hasPermission('leaders.update')"
                icon="i-heroicons-pencil-square"
                color="neutral"
                variant="ghost"
                size="xs"
                class="rounded-lg hover:text-amber-600"
                @click="editItem(leader)"
              />
              <UButton
                v-if="auth?.hasPermission('leaders.delete')"
                icon="i-heroicons-trash"
                color="error"
                variant="ghost"
                size="xs"
                class="rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                @click="confirmDelete(leader)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         MODAL: THÊM / SỬA THÀNH VIÊN
    ═══════════════════════════════════════════════════════ -->
    <UModal v-model:open="isFormOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden sm:max-w-2xl' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' }, footer: { padding: 'p-6 bg-stone-50 dark:bg-stone-900' } }">
        <template #header>
          <div class="bg-gradient-to-r from-amber-600 to-amber-500 p-6 flex justify-between items-center text-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><UIcon name="i-heroicons-identification" class="w-6 h-6" /></div>
              <h3 class="text-xl font-black uppercase tracking-wide">{{ editingId ? 'Sửa Hồ Sơ Nhân Sự' : 'Thêm Nhân Sự Sứ Đoàn' }}</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="white" variant="ghost" class="hover:bg-white/10 rounded-full" @click="isFormOpen = false" />
          </div>
        </template>
        
        <form class="p-6 sm:p-8 space-y-5" @submit.prevent="submitForm">
          <UFormField label="Đồng bộ từ tài khoản hệ thống (Tùy chọn)">
            <USelectMenu v-model="selectedUser" :options="userOptions" searchable searchable-placeholder="Tìm kiếm tài khoản..." placeholder="Chọn tài khoản để tự động điền tên..." class="w-full" :ui="{ base: 'rounded-xl shadow-inner' }" />
          </UFormField>

          <div class="p-5 bg-stone-50 dark:bg-stone-900/50 rounded-2xl border border-stone-200/60 dark:border-stone-800 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField label="Tên Thánh"><UInput v-model="form.holyName" placeholder="Giuse / Maria..." :ui="{ base: 'rounded-xl shadow-inner' }" /></UFormField>
              <UFormField label="Họ và Tên" required><UInput v-model="form.fullName" placeholder="Nguyễn Văn A" required :ui="{ base: 'rounded-xl shadow-inner' }" /></UFormField>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField label="Chức vụ đảm nhiệm" required><UInput v-model="form.position" placeholder="Trưởng ngành / GLV lớp..." required :ui="{ base: 'rounded-xl shadow-inner' }" /></UFormField>
              <UFormField label="Phân Cấp (1: Tuyên Úy, 2: Đặc trách/BĐH, 3: Trưởng Ngành, 4: GLV)" required>
                <UInput v-model="form.level" type="number" placeholder="2" required :ui="{ base: 'rounded-xl shadow-inner' }" />
              </UFormField>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField label="Ngành Phụ Trách">
                <USelect
                  v-model="form.branch"
                  :options="[
                    { label: 'Chung (Ban Linh Hướng / BĐH)', value: 0 },
                    { label: '🌸 Ngành Chiên Con', value: 1 },
                    { label: '🌿 Ngành Ấu Nhi', value: 2 },
                    { label: '🌊 Ngành Thiếu Nhi', value: 3 },
                    { label: '☀️ Ngành Nghĩa Sĩ', value: 4 },
                    { label: '🛡️ Ngành Hiệp Sĩ', value: 5 }
                  ]"
                  value-attribute="value"
                  option-attribute="label"
                  class="w-full rounded-xl"
                />
              </UFormField>
              <UFormField label="Nhiệm kỳ"><UInput v-model="form.term" placeholder="2023-2026" :ui="{ base: 'rounded-xl shadow-inner' }" /></UFormField>
            </div>
          </div>

          <div class="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 dark:border-amber-800/40">
            <UToggle v-model="form.isActive" color="primary" />
            <span class="text-xs font-bold text-stone-800 dark:text-stone-200">Nhân sự đang hoạt động trong nhiệm kỳ hiện tại.</span>
          </div>

          <UFormField label="Mô tả / Lời tâm niệm sống đạo">
            <UTextarea v-model="form.description" :rows="2" placeholder="Châm ngôn phục vụ..." :ui="{ base: 'rounded-xl shadow-inner' }" />
          </UFormField>
        </form>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Hủy" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isFormOpen = false" />
            <UButton :label="editingId ? 'Lưu Thay Đổi' : 'Xác Nhận Thêm'" color="primary" variant="solid" size="lg" class="rounded-xl font-black uppercase tracking-wider shadow-lg shadow-amber-500/20 bg-amber-500 text-stone-950" :loading="submitting" @click="submitForm" />
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- ═══════════════════════════════════════════════════════
         MODAL: TẢI LÊN AVATAR
    ═══════════════════════════════════════════════════════ -->
    <UModal v-model:open="isAvatarOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' }, footer: { padding: 'p-6 bg-stone-50 dark:bg-stone-900' } }">
        <template #header>
          <div class="bg-amber-600 p-6 flex justify-between items-center text-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><UIcon name="i-heroicons-camera" class="w-6 h-6" /></div>
              <h3 class="text-xl font-black uppercase tracking-wide">Cập Nhật Ảnh Thẻ</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="white" variant="ghost" class="hover:bg-white/10 rounded-full" @click="isAvatarOpen = false" />
          </div>
        </template>
        
        <div class="p-8 text-center">
          <p class="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4">Nhân sự: <span class="text-amber-600 font-black">{{ targetLeader?.fullName }}</span></p>
          <div class="p-6 border-2 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/10 rounded-[2rem] hover:bg-amber-100/50 transition-colors">
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              class="block w-full text-sm text-stone-500 file:mx-auto file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-amber-200 file:text-amber-900 hover:file:bg-amber-300 cursor-pointer transition-colors"
            >
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Hủy" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isAvatarOpen = false" />
            <UButton label="Lưu Ảnh Thẻ" color="primary" variant="solid" size="lg" class="rounded-xl font-black uppercase tracking-wider bg-amber-500 text-stone-950" :loading="uploadingAvatar" @click="submitAvatar" />
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- ═══════════════════════════════════════════════════════
         MODAL: XOAY VÒNG NHIỆM KỲ
    ═══════════════════════════════════════════════════════ -->
    <UModal v-model:open="isRotateOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' }, footer: { padding: 'p-6 bg-stone-50 dark:bg-stone-900' } }">
        <template #header>
          <div class="bg-gradient-to-r from-amber-600 to-orange-500 p-6 flex justify-between items-center text-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><UIcon name="i-heroicons-arrow-path-rounded-square" class="w-6 h-6" /></div>
              <h3 class="text-xl font-black uppercase tracking-wide">Xoay Vòng Nhiệm Kỳ</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="white" variant="ghost" class="hover:bg-white/10 rounded-full" @click="isRotateOpen = false" />
          </div>
        </template>
        
        <div class="p-6 space-y-4">
          <p class="text-xs text-stone-600 dark:text-stone-300">
            Hành động này sẽ chuyển toàn bộ nhân sự đang hoạt động sang danh mục <strong>"Cựu Trào"</strong> để lưu trữ lịch sử và mở nhiệm kỳ mới.
          </p>
          <UFormField label="Tên nhiệm kỳ mới (VD: 2026-2029)" required>
            <UInput v-model="newTerm" placeholder="2026-2029" required :ui="{ base: 'rounded-xl' }" />
          </UFormField>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Hủy" color="neutral" variant="soft" @click="isRotateOpen = false" />
            <UButton label="Tiến Hành Xoay Vòng" color="warning" variant="solid" :loading="rotating" @click="executeRotate" />
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- ═══════════════════════════════════════════════════════
         MODAL: XÁC NHẬN XÓA
    ═══════════════════════════════════════════════════════ -->
    <UModal v-model:open="isDeleteOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden' }">
      <div class="p-6 text-center space-y-4">
        <div class="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center text-red-600">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8" />
        </div>
        <h3 class="text-lg font-black text-stone-900 dark:text-white">Xóa hồ sơ nhân sự?</h3>
        <p class="text-xs text-stone-500">
          Bạn có chắc chắn muốn xóa hồ sơ của <strong>{{ deletingItem?.fullName }}</strong>? Thao tác này không thể hoàn tác.
        </p>
        <div class="flex justify-center gap-3 pt-2">
          <UButton label="Hủy" color="neutral" variant="soft" class="rounded-xl font-bold" @click="isDeleteOpen = false" />
          <UButton label="Xác Nhận Xóa" color="error" variant="solid" class="rounded-xl font-bold" :loading="deleting" @click="executeDelete" />
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const auth = useAuthStore()
const { $api } = useNuxtApp()
const toast = useToast()

const activeTab = ref<'active' | 'history'>('active')
const selectedCategory = ref<string>('all')
const searchQuery = ref('')

const pending = ref(true)
const leaders = ref<any[]>([])

// Định nghĩa các Tab phân cấp theo sơ đồ Xứ Đoàn
const categoryFilters = [
  { id: 'all', label: 'Tất Cả', icon: '📋', activeClass: 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900' },
  { id: 'clergy', label: 'Ban Linh Hướng & Trợ Tá', icon: '✝️', activeClass: 'bg-amber-600 text-white' },
  { id: 'bdh', label: 'Ban Điều Hành Xứ Đoàn', icon: '⭐', activeClass: 'bg-amber-500 text-stone-950' },
  { id: 'branch_1', label: '🌸 Chiên Con', icon: '🌸', activeClass: 'bg-pink-500 text-white' },
  { id: 'branch_2', label: '🌿 Ấu Nhi', icon: '🌿', activeClass: 'bg-emerald-600 text-white' },
  { id: 'branch_3', label: '🌊 Thiếu Nhi', icon: '🌊', activeClass: 'bg-sky-600 text-white' },
  { id: 'branch_4', label: '☀️ Nghĩa Sĩ', icon: '☀️', activeClass: 'bg-yellow-500 text-stone-950' },
  { id: 'branch_5', label: '🛡️ Hiệp Sĩ', icon: '🛡️', activeClass: 'bg-amber-800 text-white' }
]

const fetchData = async () => {
  pending.value = true
  try {
    const endpoint = activeTab.value === 'active' ? '/Leader' : '/Leader/history'
    const res = await $api(endpoint)
    leaders.value = res || []
  } catch (err) {
    console.error(err)
    toast.add({ title: 'Lỗi tải dữ liệu nhân sự', color: 'error' })
  } finally {
    pending.value = false
  }
}

watch(activeTab, () => {
  fetchData()
})

onMounted(() => {
  fetchData()
})

// Đếm số lượng theo danh mục
const getCategoryCount = (catId: string) => {
  if (catId === 'all') return leaders.value.length
  if (catId === 'clergy') return leaders.value.filter(l => l.level === 1 || l.position.toLowerCase().includes('tuyên úy') || l.position.toLowerCase().includes('đặc trách') || l.position.toLowerCase().includes('trợ tá') || l.position.toLowerCase().includes('trợ úy')).length
  if (catId === 'bdh') return leaders.value.filter(l => (l.level === 2 || l.level === 3) && l.branch === 0).length
  if (catId.startsWith('branch_')) {
    const bId = parseInt(catId.replace('branch_', ''))
    return leaders.value.filter(l => l.branch === bId).length
  }
  return 0
}

// Lọc dữ liệu theo tab danh mục và từ khóa tìm kiếm
const filteredList = computed(() => {
  let list = leaders.value

  // Lọc theo Tab danh mục
  if (selectedCategory.value === 'clergy') {
    list = list.filter(l => l.level === 1 || l.position.toLowerCase().includes('tuyên úy') || l.position.toLowerCase().includes('đặc trách') || l.position.toLowerCase().includes('trợ tá') || l.position.toLowerCase().includes('trợ úy'))
  } else if (selectedCategory.value === 'bdh') {
    list = list.filter(l => (l.level === 2 || l.level === 3) && l.branch === 0)
  } else if (selectedCategory.value.startsWith('branch_')) {
    const bId = parseInt(selectedCategory.value.replace('branch_', ''))
    list = list.filter(l => l.branch === bId)
  }

  // Lọc theo từ khóa tìm kiếm
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(l => 
      (l.fullName && l.fullName.toLowerCase().includes(q)) ||
      (l.holyName && l.holyName.toLowerCase().includes(q)) ||
      (l.position && l.position.toLowerCase().includes(q))
    )
  }

  return list
})

const getBranchName = (b: number) => {
  const map: Record<number, string> = {
    0: 'Xứ Đoàn',
    1: 'Chiên Con',
    2: 'Ấu Nhi',
    3: 'Thiếu Nhi',
    4: 'Nghĩa Sĩ',
    5: 'Hiệp Sĩ'
  }
  return map[b] || 'Khác'
}

const getBranchBadgeClass = (b: number) => {
  const map: Record<number, string> = {
    0: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
    1: 'bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300',
    2: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    3: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
    4: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    5: 'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200'
  }
  return map[b] || 'bg-stone-100 text-stone-700'
}

// ── FORM XỬ LÝ THÊM / SỬA ──
const isFormOpen = ref(false)
const editingId = ref<string | null>(null)
const submitting = ref(false)
const selectedUser = ref<any>(null)
const userOptions = ref<any[]>([])

const form = ref({
  holyName: '',
  fullName: '',
  position: '',
  level: 4,
  branch: 0,
  term: '2023-2026',
  description: '',
  isActive: true
})

const openCreate = () => {
  editingId.value = null
  selectedUser.value = null
  form.value = {
    holyName: '',
    fullName: '',
    position: '',
    level: 4,
    branch: selectedCategory.value.startsWith('branch_') ? parseInt(selectedCategory.value.replace('branch_', '')) : 0,
    term: '2023-2026',
    description: '',
    isActive: true
  }
  isFormOpen.value = true
}

const editItem = (item: any) => {
  editingId.value = item.id
  selectedUser.value = null
  form.value = { ...item }
  isFormOpen.value = true
}

const submitForm = async () => {
  if (!form.value.fullName || !form.value.position) {
    return toast.add({ title: 'Thiếu thông tin bắt buộc', color: 'error' })
  }
  submitting.value = true
  try {
    if (editingId.value) {
      await $api(`/Leader/${editingId.value}`, { method: 'PUT', body: form.value })
      toast.add({ title: 'Đã cập nhật hồ sơ', color: 'success' })
    } else {
      await $api('/Leader', { method: 'POST', body: form.value })
      toast.add({ title: 'Đã thêm nhân sự mới', color: 'success' })
    }
    isFormOpen.value = false
    await fetchData()
  } catch (err: any) {
    toast.add({ title: 'Có lỗi xảy ra', description: err.message, color: 'error' })
  } finally {
    submitting.value = false
  }
}

// ── AVATAR UPLOAD ──
const isAvatarOpen = ref(false)
const uploadingAvatar = ref(false)
const avatarInput = ref<any>(null)
const targetLeader = ref<any>(null)

const openAvatarUpload = (leader: any) => {
  targetLeader.value = leader
  if (avatarInput.value) avatarInput.value.value = ''
  isAvatarOpen.value = true
}

const submitAvatar = async () => {
  const file = avatarInput.value?.files[0]
  if (!file) return
  uploadingAvatar.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    await $fetch(`${config.public.apiBase}/Leader/${targetLeader.value.id}/avatar`, {
      method: 'POST',
      body: formData,
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    toast.add({ title: 'Cập nhật ảnh thành công', color: 'success' })
    isAvatarOpen.value = false
    await fetchData()
  } catch {
    toast.add({ title: 'Lỗi tải ảnh', color: 'error' })
  } finally {
    uploadingAvatar.value = false
  }
}

// ── XOAY VÒNG NHIỆM KỲ ──
const isRotateOpen = ref(false)
const rotating = ref(false)
const newTerm = ref('2026-2029')

const executeRotate = async () => {
  if (!newTerm.value.trim()) return
  rotating.value = true
  try {
    const res: any = await $api('/Leader/rotate-term', {
      method: 'POST',
      body: `"${newTerm.value.trim()}"`,
      headers: { 'Content-Type': 'application/json' }
    })
    toast.add({ title: 'Xoay vòng nhiệm kỳ thành công', description: res.message, color: 'success' })
    isRotateOpen.value = false
    await fetchData()
  } catch {
    toast.add({ title: 'Lỗi xoay vòng', color: 'error' })
  } finally {
    rotating.value = false
  }
}

// ── XÓA ──
const isDeleteOpen = ref(false)
const deleting = ref(false)
const deletingItem = ref<any>(null)

const confirmDelete = (item: any) => {
  deletingItem.value = item
  isDeleteOpen.value = true
}

const executeDelete = async () => {
  deleting.value = true
  try {
    await $api(`/Leader/${deletingItem.value.id}`, { method: 'DELETE' })
    toast.add({ title: 'Đã xóa hồ sơ thành công', color: 'success' })
    isDeleteOpen.value = false
    await fetchData()
  } catch {
    toast.add({ title: 'Lỗi xóa hồ sơ', color: 'error' })
  } finally {
    deleting.value = false
  }
}
</script>

<style>
@keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
.animate-blob { animation: blob 10s infinite; }
.animation-delay-2000 { animation-delay: 2s; }
@keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-22"></a>📄 [22/71] File: `web-admin/pages/admin/liturgical.vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Admin Pages (Quản trị) | **Số dòng:** 248 | **Kích thước:** 13.6 KB

```markup
<template>
  <div class="min-h-screen font-sans relative pb-24 overflow-hidden">
    <!-- BACKGROUND MESH GRADIENT -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute -top-32 left-0 w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob bg-rose-200 dark:bg-rose-900"></div>
      <div class="absolute bottom-0 right-0 w-[40vw] h-[40vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-amber-200 dark:bg-amber-900"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
    </div>

    <div class="relative z-10 space-y-8 animate-fade-in-up px-4 md:px-8 pt-8 max-w-5xl mx-auto">
      <!-- ── PAGE HEADER & BANNER ── -->
      <div class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-rose-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="z-10 text-center md:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 text-xs font-black uppercase tracking-widest border border-rose-200 dark:border-rose-800 shadow-inner">
            <UIcon name="i-heroicons-calendar-days" class="w-4 h-4" />
            <span>Phân Hệ Phụng Vụ</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-stone-800 dark:text-white tracking-tight">
            Quản Lý <span class="text-rose-500">Lịch Phụng Vụ</span>
          </h1>
          <p class="text-stone-500 text-sm mt-2 max-w-lg">
            Tra cứu, thiết lập và ghi đè ngày lễ (Override) chuẩn của Giáo phận để áp dụng riêng cho Giáo xứ.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- ── TRA CỨU & GHI ĐÈ ── -->
        <div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-rose-100/30 to-transparent dark:from-rose-900/10 pointer-events-none"></div>
          
          <h3 class="font-black text-xl text-stone-800 dark:text-white mb-6 flex items-center gap-2 relative z-10"><UIcon name="i-heroicons-magnifying-glass-circle" class="text-rose-500 w-7 h-7" /> Tra cứu & Tùy chỉnh (Override)</h3>
          
          <div class="relative z-10 space-y-6">
            <div class="p-5 bg-white/70 dark:bg-stone-950/70 backdrop-blur-md rounded-2xl border border-white/50 dark:border-stone-800 shadow-sm">
              <UFormField label="Chọn ngày cần tra cứu" required>
                <UInput v-model="selectedDate" type="date" size="lg" :ui="{ base: 'rounded-xl shadow-inner font-bold' }" @change="fetchDay" />
              </UFormField>
            </div>

            <!-- Kết quả tra cứu -->
            <transition name="fade">
              <div v-if="dayData" class="p-6 rounded-2xl border-2 shadow-lg relative overflow-hidden transition-all duration-300" :class="getColorBorder(dayData.liturgicalColor)">
                
                <div class="absolute top-0 right-0 px-3 py-1 rounded-bl-xl font-bold text-[10px] uppercase tracking-widest text-white shadow-sm" :class="getColorBg(dayData.liturgicalColor)">
                  {{ dayData.liturgicalColorVi }}
                </div>

                <UBadge v-if="dayData.feastName.includes('Tùy chỉnh')" label="ĐÃ GHI ĐÈ" color="amber" variant="solid" class="absolute top-3 right-24 animate-pulse shadow-md font-black uppercase tracking-widest text-[10px]" />

                <div class="pr-12">
                  <p class="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Ngày {{ formatDate(selectedDate) }}</p>
                  <h4 class="font-black text-2xl leading-tight mb-4" :class="getColorText(dayData.liturgicalColor)">
                    {{ dayData.feastName }}
                  </h4>
                </div>

                <div class="flex gap-2 border-t border-stone-200 dark:border-stone-800 pt-4 mt-2">
                  <UButton label="Tùy chỉnh ngày này" color="rose" variant="solid" icon="i-heroicons-pencil-square" class="rounded-xl shadow-md font-bold text-xs" @click="openOverrideModal" />
                  <UButton v-if="dayData.feastName.includes('Tùy chỉnh')" label="Khôi phục" color="error" variant="ghost" icon="i-heroicons-arrow-uturn-left" class="rounded-xl font-bold text-xs" @click="deleteOverride" />
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- ── IMPORT JSON ── -->
        <div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-center items-center text-center">
          <div class="w-24 h-24 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-white dark:ring-stone-900">
            <UIcon name="i-heroicons-arrow-up-tray" class="w-10 h-10 text-stone-400" />
          </div>
          <h3 class="font-black text-xl text-stone-800 dark:text-white mb-3">Nhập Dữ Liệu (Import JSON)</h3>
          <p class="text-stone-500 text-sm mb-6 max-w-xs">Tính năng đang được phát triển để hỗ trợ nhập hàng loạt danh sách các ngày lễ từ file JSON chuẩn của Giáo phận.</p>
          <UTooltip text="Tính năng đang được bảo trì / phát triển">
            <UButton label="Tải lên File JSON" icon="i-heroicons-lock-closed" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold cursor-not-allowed opacity-50" disabled />
          </UTooltip>
        </div>

      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         MODAL: TÙY CHỈNH (OVERRIDE)
    ═══════════════════════════════════════════════════════ -->
    <UModal v-model:open="isModalOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' }, footer: { padding: 'p-6 bg-stone-50 dark:bg-stone-900' } }">
        <template #header>
          <div class="bg-rose-600 dark:bg-rose-900 p-6 flex justify-between items-center text-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><UIcon name="i-heroicons-pencil-square" class="w-6 h-6" /></div>
              <h3 class="text-xl font-black uppercase tracking-wide">Tùy Chỉnh Ngày Lễ</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="white" variant="ghost" class="hover:bg-white/10 rounded-full" @click="isModalOpen = false" />
          </div>
        </template>
        
        <form class="p-8 space-y-6" @submit.prevent="submitOverride">
          <div class="text-center pb-4 border-b border-stone-200 dark:border-stone-800">
            <p class="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Áp dụng cho ngày</p>
            <p class="text-xl font-black text-rose-600 dark:text-rose-400">{{ formatDate(selectedDate) }}</p>
          </div>

          <UFormField label="Tên ngày lễ (Hiển thị)" required>
            <UInput v-model="form.title" placeholder="VD: Lễ Thánh Đaminh, Bổn mạng xứ..." required size="lg" :ui="{ base: 'rounded-xl shadow-inner font-bold' }" />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Màu áo lễ" required>
              <USelectMenu v-model="form.color" :options="colorOptions" value-attribute="value" option-attribute="label" class="w-full" :ui="{ base: 'rounded-xl shadow-inner font-bold' }" />
            </UFormField>
            <UFormField label="Bậc lễ" required>
              <USelectMenu v-model="form.level" :options="levelOptions" value-attribute="value" option-attribute="label" class="w-full" :ui="{ base: 'rounded-xl shadow-inner font-bold' }" />
            </UFormField>
          </div>
        </form>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Hủy Bỏ" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isModalOpen = false" />
            <UButton label="Lưu Tùy Chỉnh" color="rose" variant="solid" size="lg" class="rounded-xl font-black uppercase tracking-wider shadow-lg shadow-rose-500/20" :loading="saving" @click="submitOverride" />
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
useHead({ title: 'Quản Lý Lịch Phụng Vụ - GiaoLy Admin' })

const toast = useToast()

const today = new Date()
const localTodayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')

const selectedDate = ref(localTodayStr)
const dayData = ref(null)

const isModalOpen = ref(false)
const saving = ref(false)
const form = reactive({ title: '', color: 'White', level: 'Thường' })

const colorOptions = [
  { value: 'Green', label: 'Xanh Lá' },
  { value: 'White', label: 'Trắng' },
  { value: 'Red', label: 'Đỏ' },
  { value: 'Purple', label: 'Tím' },
  { value: 'Rose', label: 'Hồng' },
  { value: 'Black', label: 'Đen' }
]

const levelOptions = [
  { value: 'Thường', label: 'Thường' },
  { value: 'Nhớ', label: 'Lễ Nhớ' },
  { value: 'Kính', label: 'Lễ Kính' },
  { value: 'Trọng', label: 'Lễ Trọng' }
]

const fetchDay = async () => {
  if (!selectedDate.value) return
  try {
    const data = await $api(`/Liturgical/${selectedDate.value}`)
    dayData.value = data
  } catch { toast.add({ title: 'Lỗi tra cứu', color: 'error' }) }
}

const openOverrideModal = () => {
  form.title = dayData.value.feastName.replace(' (Tùy chỉnh)', '')
  const matchedOpt = colorOptions.find(o => o.value.toLowerCase() === dayData.value.liturgicalColor.toLowerCase())
  form.color = matchedOpt ? matchedOpt.value : 'White'
  form.level = 'Thường'
  isModalOpen.value = true
}

const submitOverride = async () => {
  saving.value = true
  try {
    await $api('/Liturgical/override', {
      method: 'POST',
      body: { date: selectedDate.value, title: form.title, color: form.color, level: form.level }
    })
    toast.add({ title: 'Đã lưu tùy chỉnh', color: 'success' })
    isModalOpen.value = false
    await fetchDay()
  } catch { toast.add({ title: 'Lỗi ghi đè', color: 'error' }) } 
  finally { saving.value = false }
}

const deleteOverride = async () => {
  if (!confirm('Bạn có chắc muốn xóa tùy chỉnh và khôi phục Lịch Phụng Vụ gốc tự động?')) return
  try {
    await $api(`/Liturgical/override/${selectedDate.value}`, { method: 'DELETE' })
    toast.add({ title: 'Đã xóa tùy chỉnh, khôi phục gốc', color: 'success' })
    await fetchDay()
  } catch { toast.add({ title: 'Lỗi xóa', color: 'error' }) }
}

const getColorText = (color) => {
  const c = color.toLowerCase()
  if (c === 'red') return 'text-red-600 dark:text-red-400'
  if (c === 'purple') return 'text-purple-600 dark:text-purple-400'
  if (c === 'white') return 'text-amber-500 dark:text-amber-400' 
  if (c === 'rose') return 'text-pink-500'
  if (c === 'black') return 'text-stone-800 dark:text-stone-300'
  return 'text-green-600 dark:text-green-400'
}

const getColorBg = (color) => {
  const c = color.toLowerCase()
  if (c === 'red') return 'bg-red-500'
  if (c === 'purple') return 'bg-purple-500'
  if (c === 'white') return 'bg-amber-400' // yellow for visibility
  if (c === 'rose') return 'bg-pink-500'
  if (c === 'black') return 'bg-stone-800'
  return 'bg-green-500'
}

const getColorBorder = (color) => {
  const c = color.toLowerCase()
  if (c === 'red') return 'border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20'
  if (c === 'purple') return 'border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/20'
  if (c === 'white') return 'border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20'
  if (c === 'rose') return 'border-pink-200 dark:border-pink-900/50 bg-pink-50/50 dark:bg-pink-950/20'
  if (c === 'black') return 'border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/20'
  return 'border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-950/20'
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  return `${parts[2]}/${parts[1]}/${parts[0]}`
}

onMounted(() => { fetchDay() })
</script>

<style>
@keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
.animate-blob { animation: blob 10s infinite; }
.animation-delay-2000 { animation-delay: 2s; }
@keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-23"></a>📄 [23/71] File: `web-admin/pages/admin/news/index.vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Admin Pages (Quản trị) | **Số dòng:** 370 | **Kích thước:** 13.4 KB

```markup
<template>
  <div class="min-h-screen font-sans relative pb-24 overflow-hidden">
    <!-- BACKGROUND MESH GRADIENT -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute top-0 -left-32 w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob bg-sky-200 dark:bg-sky-900"></div>
      <div class="absolute -bottom-32 right-0 w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-indigo-200 dark:bg-indigo-900"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
    </div>

    <div class="relative z-10 space-y-6 animate-fade-in-up px-4 md:px-8 pt-8 max-w-7xl mx-auto">

      <!-- PAGE HEADER -->
      <div class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div class="z-10 text-center md:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-300 text-xs font-black uppercase tracking-widest border border-sky-200 dark:border-sky-800 shadow-inner">
            <UIcon name="i-heroicons-newspaper" class="w-4 h-4" />
            <span>Phan He Noi Dung</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-stone-800 dark:text-white tracking-tight">
            Quan Ly <span class="text-sky-500">Tin Tuc RSS</span>
          </h1>
          <p class="text-stone-500 text-sm mt-2 max-w-lg">
            Theo doi va quan ly cac bai viet tin tuc Cong Giao duoc tong hop tu dong tu cac nguon RSS.
          </p>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3 z-10">
          <UBadge
            v-if="total > 0"
            :label="`${total} bai viet`"
            color="sky"
            variant="soft"
            size="lg"
            class="rounded-2xl font-black text-sm px-4"
          />
          <UButton
            label="Dong bo ngay"
            icon="i-heroicons-arrow-path"
            color="sky"
            variant="solid"
            size="lg"
            class="rounded-2xl shadow-lg shadow-sky-500/20 hover:-translate-y-0.5 transition-transform font-bold uppercase tracking-wider"
            :loading="syncing"
            @click="syncNow"
          />
        </div>
      </div>

      <!-- FILTER BAR -->
      <div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-xl border border-white/60 dark:border-stone-800 shadow-sm rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div class="flex items-center gap-2 flex-shrink-0">
          <UIcon name="i-heroicons-funnel" class="w-4 h-4 text-stone-400" />
          <span class="text-xs font-black text-stone-500 uppercase tracking-widest">Loc theo nguon:</span>
        </div>
        <USelect
          v-model="selectedSource"
          :options="sourceOptions"
          value-attribute="value"
          label-attribute="label"
          placeholder="Tat ca nguon"
          class="w-full sm:w-56"
          :ui="{ base: 'rounded-xl' }"
        />
        <div class="sm:ml-auto flex items-center gap-2">
          <span class="text-xs font-bold text-stone-400">Hien thi:</span>
          <USelect
            v-model="perPage"
            :options="perPageOptions"
            value-attribute="value"
            label-attribute="label"
            class="w-28"
            :ui="{ base: 'rounded-xl' }"
          />
        </div>
      </div>

      <!-- LOADING -->
      <div v-if="pending" class="flex flex-col items-center justify-center py-24">
        <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 animate-spin text-sky-400 mb-4" />
        <p class="text-stone-500 font-bold uppercase tracking-widest text-sm">Dang tai tin tuc...</p>
      </div>

      <!-- ERROR -->
      <UAlert
        v-else-if="error"
        color="error"
        variant="soft"
        icon="i-heroicons-exclamation-circle"
        title="Khong the tai tin tuc"
        :description="(error as any)?.message || 'Da xay ra loi khi ket noi API.'"
        class="rounded-2xl"
      />

      <!-- EMPTY -->
      <div
        v-else-if="!paginatedArticles.length"
        class="text-center py-24 bg-white/40 dark:bg-stone-900/40 backdrop-blur-xl rounded-[2rem] border border-white/50 dark:border-stone-800 shadow-sm"
      >
        <UIcon name="i-heroicons-newspaper" class="w-16 h-16 text-stone-300 dark:text-stone-700 mx-auto mb-4" />
        <p class="text-stone-500 font-bold text-lg">Chua co bai viet nao.</p>
        <p class="text-stone-400 text-sm mt-1">Thu dong bo de lay tin tuc moi nhat.</p>
        <UButton
          label="Dong bo ngay"
          icon="i-heroicons-arrow-path"
          variant="soft"
          color="sky"
          class="mt-4 rounded-xl font-bold"
          @click="syncNow"
        />
      </div>

      <!-- TABLE -->
      <div
        v-else
        class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] overflow-hidden"
      >
        <UTable
          :rows="paginatedArticles"
          :columns="columns"
          :ui="{
            wrapper: 'overflow-x-auto',
            thead: 'bg-stone-50/80 dark:bg-stone-800/50',
            th: { base: 'text-[10px] font-black text-stone-500 uppercase tracking-widest py-3 px-4 whitespace-nowrap' },
            td: { base: 'py-3 px-4 align-middle' },
            tr: { base: 'hover:bg-sky-50/50 dark:hover:bg-sky-900/10 transition-colors border-b border-stone-100 dark:border-stone-800 last:border-0' }
          }"
        >
          <!-- Tieu de -->
          <template #title-data="{ row }">
            <div class="max-w-sm">
              <a
                v-if="row.url"
                :href="row.url"
                target="_blank"
                rel="noopener"
                class="font-bold text-stone-800 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-colors line-clamp-2 leading-snug"
              >{{ row.title }}</a>
              <p v-else class="font-bold text-stone-800 dark:text-white line-clamp-2 leading-snug">
                {{ row.title }}
              </p>
            </div>
          </template>

          <!-- Nguon -->
          <template #source-data="{ row }">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-sky-400 flex-shrink-0"></div>
              <span class="text-xs font-bold text-stone-600 dark:text-stone-300 whitespace-nowrap">{{ row.source || '—' }}</span>
            </div>
          </template>

          <!-- Danh muc -->
          <template #category-data="{ row }">
            <UBadge
              v-if="row.category"
              :label="row.category"
              color="indigo"
              variant="soft"
              size="xs"
              class="font-bold uppercase tracking-wide rounded-lg whitespace-nowrap"
            />
            <span v-else class="text-xs text-stone-400">—</span>
          </template>

          <!-- Ngay dang -->
          <template #publishedAt-data="{ row }">
            <span class="text-xs font-bold text-stone-500 whitespace-nowrap">
              {{ formatDate(row.publishedAt) }}
            </span>
          </template>

          <!-- Trang thai -->
          <template #isActive-data="{ row }">
            <UBadge
              :label="row.isActive ? 'Hien' : 'An'"
              :color="row.isActive ? 'success' : 'neutral'"
              variant="soft"
              size="xs"
              class="font-black uppercase tracking-widest rounded-lg"
            />
          </template>

          <!-- Hanh dong -->
          <template #actions-data="{ row }">
            <div class="flex items-center gap-1">
              <UButton
                v-if="row.url"
                icon="i-heroicons-arrow-top-right-on-square"
                color="neutral"
                variant="ghost"
                size="xs"
                class="rounded-lg"
                :to="row.url"
                target="_blank"
              />
              <UButton
                :icon="row.isActive ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                :color="row.isActive ? 'warning' : 'success'"
                variant="ghost"
                size="xs"
                class="rounded-lg"
                @click="toggleActive(row)"
              />
            </div>
          </template>
        </UTable>
      </div>

      <!-- PAGINATION -->
      <div
        v-if="!pending && !error && total > 0"
        class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/40 dark:bg-stone-900/40 backdrop-blur-xl border border-white/60 dark:border-stone-800 rounded-2xl px-6 py-4"
      >
        <p class="text-xs font-bold text-stone-500">
          Hien thi <span class="text-sky-600">{{ rangeStart }}{{ '\u2013' }}{{ rangeEnd }}</span>
          trong tong so <span class="text-sky-600">{{ total }}</span> bai viet
        </p>
        <UPagination
          v-model:page="currentPage"
          :total="total"
          :items-per-page="perPage"
          :ui="{
            list: 'gap-1',
            item: { base: 'rounded-xl font-bold' },
            active: 'bg-sky-500 text-white shadow-md',
          }"
        />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Quan Ly Tin Tuc RSS - GiaoLy Admin' })

const toast = useToast()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string

// State
const selectedSource = ref('')
const currentPage = ref(1)
const perPage = ref(15)
const syncing = ref(false)

const perPageOptions = [
  { label: '10 / trang', value: 10 },
  { label: '15 / trang', value: 15 },
  { label: '25 / trang', value: 25 },
  { label: '50 / trang', value: 50 },
]

// Types
interface NewsArticle {
  id: string | number
  title: string
  url?: string
  source?: string
  category?: string
  publishedAt?: string
  isActive: boolean
}

// Fetch
const { data: rawArticles, pending, error, refresh } = await useFetch<NewsArticle[]>(
  () => `${apiBase}/api/news/catholic`,
  { default: () => [] as NewsArticle[], server: false }
)

// Source filter options
const sourceOptions = computed(() => {
  const sources = [...new Set((rawArticles.value ?? []).map(a => a.source).filter(Boolean))] as string[]
  return [
    { label: 'Tat Ca Nguon', value: '' },
    ...sources.map(s => ({ label: s, value: s })),
  ]
})

// Filtered + paginated
const filteredArticles = computed(() => {
  const list = rawArticles.value ?? []
  if (!selectedSource.value) return list
  return list.filter(a => a.source === selectedSource.value)
})

const total = computed(() => filteredArticles.value.length)
const rangeStart = computed(() => total.value === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1)
const rangeEnd = computed(() => Math.min(currentPage.value * perPage.value, total.value))

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return filteredArticles.value.slice(start, start + perPage.value)
})

watch([selectedSource, perPage], () => { currentPage.value = 1 })

// Columns
const columns = [
  { key: 'title',       label: 'Tieu De' },
  { key: 'source',      label: 'Nguon' },
  { key: 'category',    label: 'Danh Muc' },
  { key: 'publishedAt', label: 'Ngay Dang' },
  { key: 'isActive',    label: 'Trang Thai' },
  { key: 'actions',     label: '' },
]

// Sync action
const syncNow = async () => {
  syncing.value = true
  try {
    await $fetch(`${apiBase}/api/news/sync`, { method: 'POST' })
    toast.add({ title: 'Dong bo thanh cong', description: 'Da cap nhat tin tuc moi nhat.', color: 'success' })
    await refresh()
  } catch {
    toast.add({ title: 'Loi dong bo', description: 'Khong the ket noi toi may chu.', color: 'error' })
  } finally {
    syncing.value = false
  }
}

// Toggle active
const toggleActive = async (article: NewsArticle) => {
  try {
    await $fetch(`${apiBase}/api/news/${article.id}/toggle`, { method: 'PATCH' })
    article.isActive = !article.isActive
    toast.add({
      title: article.isActive ? 'Da hien bai viet' : 'Da an bai viet',
      color: 'success',
    })
  } catch {
    toast.add({ title: 'Loi cap nhat', color: 'error' })
  }
}

// Date formatter
const formatDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }) : '—'
</script>

<style scoped>
@keyframes blob {
  0%   { transform: translate(0px, 0px) scale(1); }
  33%  { transform: translate(30px, -50px) scale(1.1); }
  66%  { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob { animation: blob 10s infinite; }
.animation-delay-2000 { animation-delay: 2s; }

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-24"></a>📄 [24/71] File: `web-admin/pages/admin/reports.vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Admin Pages (Quản trị) | **Số dòng:** 229 | **Kích thước:** 14.8 KB

```markup
<template>
  <div class="min-h-screen font-sans relative pb-24 overflow-hidden">
    <!-- BACKGROUND MESH GRADIENT -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute -top-32 left-1/4 w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob bg-indigo-200 dark:bg-indigo-900"></div>
      <div class="absolute top-1/2 -right-32 w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-sky-200 dark:bg-sky-900"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
    </div>

    <div class="relative z-10 space-y-6 animate-fade-in-up px-4 md:px-8 pt-8 max-w-7xl mx-auto">
      <!-- ── PAGE HEADER & BANNER ── -->
      <div class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-indigo-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="z-10 text-center md:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-xs font-black uppercase tracking-widest border border-indigo-200 dark:border-indigo-800 shadow-inner">
            <UIcon name="i-heroicons-chart-pie" class="w-4 h-4" />
            <span>Phân Hệ Học Vụ</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-stone-800 dark:text-white tracking-tight">
            Báo Cáo <span class="text-indigo-500">Thống Kê</span>
          </h1>
          <p class="text-stone-500 text-sm mt-2 max-w-lg">
            Góc nhìn toàn cảnh về dữ liệu đoàn sinh, tiến độ bí tích và phân bổ theo các phân ngành.
          </p>
        </div>
        
        <div class="flex flex-wrap items-center justify-center gap-3 z-10">
          <UButton
            v-if="auth?.hasPermission('students.export')"
            label="Xuất Báo Cáo (PDF)"
            icon="i-heroicons-document-arrow-down"
            color="neutral"
            variant="soft"
            size="lg"
            class="rounded-2xl shadow-sm hover:-translate-y-0.5 transition-transform font-bold"
            @click="exportPdf"
          />
          <UButton
            v-if="auth?.hasPermission('students.export')"
            label="Xuất Dữ Liệu (Excel)"
            icon="i-heroicons-table-cells"
            color="indigo"
            variant="solid"
            size="lg"
            class="rounded-2xl shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 transition-transform font-bold"
            @click="exportExcel"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="flex flex-col items-center justify-center py-24">
        <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 animate-spin text-indigo-400 mb-4" />
        <p class="text-stone-500 font-bold uppercase tracking-widest text-sm">Đang tính toán số liệu...</p>
      </div>

      <div v-else class="space-y-8">
        <!-- ── BENTO GRID TỔNG QUAN (PROGRESS RINGS) ── -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          
          <div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-2xl border border-white/60 dark:border-stone-800 rounded-3xl p-6 shadow-xl shadow-black/5 flex flex-col items-center text-center hover:-translate-y-1 transition-transform relative overflow-hidden group">
            <div class="absolute inset-0 bg-gradient-to-b from-stone-100/50 to-transparent dark:from-stone-800/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative w-32 h-32 mb-4">
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path class="text-stone-100 dark:text-stone-800" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path class="text-indigo-500" stroke-width="3" stroke-dasharray="100, 100" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke-linecap="round" />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <UIcon name="i-heroicons-users" class="w-8 h-8 text-indigo-500" />
              </div>
            </div>
            <p class="text-4xl font-black text-stone-800 dark:text-white">{{ totalStudents }}</p>
            <p class="text-xs font-bold text-stone-500 uppercase tracking-widest mt-2">Tổng Đoàn Sinh</p>
          </div>

          <div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-2xl border border-white/60 dark:border-stone-800 rounded-3xl p-6 shadow-xl shadow-black/5 flex flex-col items-center text-center hover:-translate-y-1 transition-transform relative overflow-hidden group">
            <div class="absolute inset-0 bg-gradient-to-b from-blue-100/20 to-transparent dark:from-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative w-32 h-32 mb-4">
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path class="text-stone-100 dark:text-stone-800" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path class="text-blue-500 transition-all duration-1000 ease-out" stroke-width="3" :stroke-dasharray="`${getPercentage(totalBaptism)}, 100`" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke-linecap="round" />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <p class="text-lg font-black text-blue-600 dark:text-blue-400">{{ getPercentage(totalBaptism) }}%</p>
              </div>
            </div>
            <p class="text-4xl font-black text-stone-800 dark:text-white">{{ totalBaptism }}</p>
            <p class="text-xs font-bold text-stone-500 uppercase tracking-widest mt-2">Đã Rửa Tội</p>
          </div>

          <div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-2xl border border-white/60 dark:border-stone-800 rounded-3xl p-6 shadow-xl shadow-black/5 flex flex-col items-center text-center hover:-translate-y-1 transition-transform relative overflow-hidden group">
            <div class="absolute inset-0 bg-gradient-to-b from-amber-100/20 to-transparent dark:from-amber-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative w-32 h-32 mb-4">
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path class="text-stone-100 dark:text-stone-800" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path class="text-amber-500 transition-all duration-1000 ease-out" stroke-width="3" :stroke-dasharray="`${getPercentage(totalCommunion)}, 100`" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke-linecap="round" />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <p class="text-lg font-black text-amber-600 dark:text-amber-400">{{ getPercentage(totalCommunion) }}%</p>
              </div>
            </div>
            <p class="text-4xl font-black text-stone-800 dark:text-white">{{ totalCommunion }}</p>
            <p class="text-xs font-bold text-stone-500 uppercase tracking-widest mt-2">Đã Rước Lễ</p>
          </div>

          <div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-2xl border border-white/60 dark:border-stone-800 rounded-3xl p-6 shadow-xl shadow-black/5 flex flex-col items-center text-center hover:-translate-y-1 transition-transform relative overflow-hidden group">
            <div class="absolute inset-0 bg-gradient-to-b from-red-100/20 to-transparent dark:from-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative w-32 h-32 mb-4">
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path class="text-stone-100 dark:text-stone-800" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path class="text-red-500 transition-all duration-1000 ease-out" stroke-width="3" :stroke-dasharray="`${getPercentage(totalConfirmation)}, 100`" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke-linecap="round" />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <p class="text-lg font-black text-red-600 dark:text-red-400">{{ getPercentage(totalConfirmation) }}%</p>
              </div>
            </div>
            <p class="text-4xl font-black text-stone-800 dark:text-white">{{ totalConfirmation }}</p>
            <p class="text-xs font-bold text-stone-500 uppercase tracking-widest mt-2">Đã Thêm Sức</p>
          </div>
          
        </div>

        <!-- ── TIẾN ĐỘ THEO NGÀNH (HORIZONTAL PROGRESS BARS) ── -->
        <UCard 
          class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-3xl shadow-2xl shadow-black/5 border border-white/50 dark:border-stone-800 rounded-[2.5rem] overflow-hidden"
          :ui="{ body: { padding: 'p-8' } }"
        >
          <div class="flex items-center gap-4 mb-8 pb-4 border-b border-stone-200 dark:border-stone-800">
            <div class="p-3 bg-primary-100 dark:bg-primary-900/50 text-primary-600 rounded-2xl shadow-inner"><UIcon name="i-heroicons-chart-bar-square" class="w-8 h-8" /></div>
            <div>
              <h2 class="text-2xl font-black text-stone-800 dark:text-white tracking-tight">Phân Bố Ngành</h2>
              <p class="text-sm font-bold text-stone-500 uppercase tracking-widest mt-1">Tỷ lệ đoàn sinh theo từng phân ngành</p>
            </div>
          </div>

          <div class="space-y-8">
            <div v-for="branch in branchStats" :key="branch.id" class="relative group">
              <div class="flex justify-between items-end mb-2">
                <p class="font-black text-lg text-stone-800 dark:text-white group-hover:translate-x-2 transition-transform">{{ branch.name }}</p>
                <div class="text-right">
                  <p class="font-black text-2xl" :class="branch.colorClass">{{ branch.count }} <span class="text-sm text-stone-400 font-bold ml-1">em</span></p>
                  <p class="text-xs font-bold text-stone-500 uppercase tracking-widest">{{ getPercentage(branch.count) }}% tổng số</p>
                </div>
              </div>
              <div class="w-full h-4 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden shadow-inner">
                <div class="h-full rounded-full transition-all duration-1000 ease-out" :class="branch.bgClass" :style="`width: ${getPercentage(branch.count)}%`"></div>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
useHead({ title: 'Báo Cáo Thống Kê - GiaoLy Admin' })

const auth = useAuthStore()
const toast = useToast()

const { data: students, pending } = await useApiFetch('/Student')

const totalStudents = computed(() => students.value?.length || 0)
const totalBaptism = computed(() => students.value?.filter(s => s.baptismDate).length || 0)
const totalCommunion = computed(() => students.value?.filter(s => s.communionDate).length || 0)
const totalConfirmation = computed(() => students.value?.filter(s => s.confirmationDate).length || 0)

const branchStats = computed(() => {
  const countBranch = (b) => students.value?.filter(s => s.branch === b).length || 0
  return [
    { id: 1, name: 'Chiên Con', count: countBranch(1), colorClass: 'text-pink-500', bgClass: 'bg-gradient-to-r from-pink-400 to-pink-500' },
    { id: 2, name: 'Ấu Nhi', count: countBranch(2), colorClass: 'text-emerald-500', bgClass: 'bg-gradient-to-r from-emerald-400 to-emerald-500' },
    { id: 3, name: 'Thiếu Nhi', count: countBranch(3), colorClass: 'text-blue-500', bgClass: 'bg-gradient-to-r from-blue-400 to-blue-500' },
    { id: 4, name: 'Nghĩa Sĩ', count: countBranch(4), colorClass: 'text-amber-500', bgClass: 'bg-gradient-to-r from-amber-400 to-amber-500' },
    { id: 5, name: 'Hiệp Sĩ', count: countBranch(5), colorClass: 'text-red-500', bgClass: 'bg-gradient-to-r from-red-400 to-red-500' }
  ]
})

const getPercentage = (count) => {
  if (totalStudents.value === 0) return 0
  return ((count / totalStudents.value) * 100).toFixed(1)
}

const exportExcel = async () => {
  try {
    const res = await $fetch(`${useRuntimeConfig().public.apiBase}/Student/export-excel`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${auth.token}` },
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([res]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `BaoCaoTongHop_${new Date().toISOString().split('T')[0]}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (err) {
    toast.add({ title: 'Lỗi xuất Excel', description: err.message, color: 'error' })
  }
}

const exportPdf = () => {
  window.print()
}
</script>

<style>
@keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
.animate-blob { animation: blob 10s infinite; }
.animation-delay-2000 { animation-delay: 2s; }
@keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

@media print {
  /* Ẩn Sidebar, Header và các nút khi in PDF */
  aside, header, nav, button { display: none !important; }
  .fixed, .absolute.inset-0 { display: none !important; } /* Ẩn background mesh */
  .md\:ml-64, .md\:ml-20 { margin-left: 0 !important; }
  .animate-fade-in-up { animation: none !important; opacity: 1 !important; transform: none !important; }
  .bg-white\/40, .bg-white\/50 { background: white !important; }
  * { text-shadow: none !important; box-shadow: none !important; }
}
</style>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-25"></a>📄 [25/71] File: `web-admin/pages/admin/roles.vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Admin Pages (Quản trị) | **Số dòng:** 370 | **Kích thước:** 17.7 KB

```markup
<template>
  <div class="min-h-screen font-sans relative pb-24 overflow-hidden">
    <!-- BACKGROUND MESH GRADIENT -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute -top-32 -right-32 w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob bg-rose-200 dark:bg-rose-900"></div>
      <div class="absolute top-1/2 -left-32 w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-amber-200 dark:bg-amber-900"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
    </div>

    <div class="relative z-10 space-y-6 animate-fade-in-up px-4 md:px-8 pt-8 max-w-7xl mx-auto">
      <!-- ── PAGE HEADER & BANNER ── -->
      <div class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-rose-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="z-10 text-center md:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 text-xs font-black uppercase tracking-widest border border-rose-200 dark:border-rose-800 shadow-inner">
            <UIcon name="i-heroicons-shield-check" class="w-4 h-4" />
            <span>Phân Hệ Học Vụ</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-stone-800 dark:text-white tracking-tight">
            Quản Lý <span class="text-rose-500">Phân Quyền</span>
          </h1>
          <p class="text-stone-500 text-sm mt-2 max-w-lg">
            Thiết lập vai trò (Roles) và ma trận quyền hạn (Permissions) cho toàn bộ tài khoản hệ thống.
          </p>
        </div>
        
        <div class="flex flex-wrap items-center justify-center gap-3 z-10">
          <UButton
            icon="i-heroicons-arrow-path-rounded-square"
            label="Chuyển Đổi Dữ Liệu"
            color="amber"
            variant="soft"
            size="lg"
            class="rounded-2xl shadow-sm hover:-translate-y-0.5 transition-transform"
            :loading="migrating"
            @click="migrateUsers"
          />
          <UButton
            icon="i-heroicons-plus"
            label="Tạo Vai Trò"
            color="rose"
            variant="solid"
            size="lg"
            class="rounded-2xl shadow-lg shadow-rose-500/20 hover:-translate-y-0.5 transition-transform font-bold"
            @click="openCreateModal"
          />
        </div>
      </div>

      <!-- ── GLASS DATA GRID ── -->
      <UCard 
        class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-3xl shadow-2xl shadow-black/5 border border-white/50 dark:border-stone-800 rounded-[2.5rem] overflow-hidden"
        :ui="{ body: { padding: 'p-0', base: 'overflow-x-auto' } }"
      >
        <UTable
          :rows="roles"
          :columns="columns"
          :loading="loading"
          :empty-state="{ icon: 'i-heroicons-shield-exclamation', header: 'Chưa có vai trò nào' }"
          :ui="{ 
            th: { base: 'bg-stone-100/50 dark:bg-stone-900/50 font-black uppercase tracking-widest text-[10px] text-stone-500 py-5 border-b border-white/40 dark:border-stone-800/50' },
            td: { base: 'whitespace-nowrap border-b border-stone-200/20 dark:border-stone-800/20 py-4' },
            tr: { base: 'hover:bg-white/50 dark:hover:bg-stone-800/50 transition-colors group' }
          }"
        >
          <template #name-cell="{ row }">
            <div class="flex items-center gap-4 pl-4">
              <div class="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-900/50 text-rose-500 flex items-center justify-center shadow-inner border border-rose-200 dark:border-rose-800">
                <UIcon name="i-heroicons-user-group" class="w-5 h-5" />
              </div>
              <div>
                <p class="font-black text-stone-800 dark:text-white text-base leading-none mb-1 group-hover:text-rose-600 transition-colors">
                  {{ row.original.name }}
                </p>
                <p class="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1">
                  Mã: <UBadge color="neutral" variant="subtle" size="xs">{{ row.original.code }}</UBadge>
                </p>
              </div>
            </div>
          </template>

          <template #description-cell="{ row }">
            <span class="text-sm text-stone-500 max-w-[300px] truncate block" :title="row.original.description">
              {{ row.original.description || 'Chưa có mô tả' }}
            </span>
          </template>

          <template #userCount-cell="{ row }">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-users" class="w-4 h-4 text-stone-400" />
              <span class="font-black text-stone-700 dark:text-stone-300">{{ row.original.userCount }}</span>
            </div>
          </template>

          <template #actions-cell="{ row }">
            <div class="flex items-center justify-end gap-2 pr-4">
              <UTooltip text="Ma trận cấp quyền">
                <UButton
                  size="sm"
                  color="amber"
                  variant="soft"
                  icon="i-heroicons-key"
                  class="rounded-xl font-bold uppercase tracking-wider"
                  label="Cấp Quyền"
                  @click="openAssignModal(row.original)"
                />
              </UTooltip>
              
              <UDropdown :items="getRoleActions(row.original)" :popper="{ placement: 'bottom-end' }">
                <UButton color="neutral" variant="ghost" icon="i-heroicons-ellipsis-horizontal" size="sm" class="rounded-xl opacity-50 group-hover:opacity-100 transition-opacity bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 shadow-sm" />
              </UDropdown>
            </div>
          </template>
        </UTable>
      </UCard>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         MODAL: TẠO / SỬA VAI TRÒ
    ═══════════════════════════════════════════════════════ -->
    <UModal v-model:open="isModalOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' }, footer: { padding: 'p-6 bg-stone-50 dark:bg-stone-900' } }">
        <template #header>
          <div class="bg-rose-600 dark:bg-rose-900 p-6 flex justify-between items-center text-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><UIcon name="i-heroicons-shield-check" class="w-6 h-6" /></div>
              <h3 class="text-xl font-black uppercase tracking-wide">{{ isEditing ? 'Chỉnh Sửa Vai Trò' : 'Tạo Vai Trò Mới' }}</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="white" variant="ghost" class="hover:bg-white/10 rounded-full" @click="isModalOpen = false" />
          </div>
        </template>
        
        <UForm :state="form" @submit="submitForm" id="roleForm" class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField label="Tên vai trò" name="name">
              <UInput v-model="form.name" placeholder="VD: Quản trị viên" required :ui="{ base: 'rounded-xl' }" />
            </UFormField>
            <UFormField label="Mã vai trò (Role Code)" name="code">
              <UInput v-model="form.code" placeholder="VD: Admin, GLV, 1, 2..." required :disabled="isEditing && form.code === '1'" :ui="{ base: 'rounded-xl' }" />
            </UFormField>
          </div>
          <UFormField label="Mô tả" name="description">
            <UTextarea v-model="form.description" :rows="3" placeholder="Vai trò này có chức năng gì..." :ui="{ base: 'rounded-xl' }" />
          </UFormField>
        </UForm>
        
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Hủy bỏ" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isModalOpen = false" />
            <UButton type="submit" form="roleForm" :label="isEditing ? 'Lưu Thay Đổi' : 'Tạo Vai Trò'" color="rose" variant="solid" size="lg" class="rounded-xl font-black uppercase tracking-wider shadow-lg shadow-rose-500/20" :loading="saving" />
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- ═══════════════════════════════════════════════════════
         MODAL: MA TRẬN GÁN QUYỀN (PERMISSION MATRIX)
    ═══════════════════════════════════════════════════════ -->
    <UModal v-model:open="isAssignModalOpen" fullscreen :ui="{ base: 'bg-white/95 dark:bg-stone-950/95 backdrop-blur-3xl' }">
      <div class="h-full flex flex-col p-6 max-w-7xl mx-auto w-full">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8 pb-6 border-b border-stone-200 dark:border-stone-800">
          <div class="flex items-center gap-4">
            <div class="p-4 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-3xl shadow-inner"><UIcon name="i-heroicons-key" class="w-10 h-10" /></div>
            <div>
              <h2 class="text-3xl font-black text-stone-800 dark:text-white uppercase tracking-tight">Ma Trận Cấp Quyền</h2>
              <p class="text-sm font-bold text-stone-500 uppercase tracking-widest mt-1">Đang thiết lập cho: <span class="text-amber-600 dark:text-amber-400 text-lg ml-1">{{ selectedRole?.name }}</span></p>
            </div>
          </div>
          <div class="flex gap-3">
            <UButton label="Hủy" color="neutral" variant="soft" size="xl" class="rounded-2xl font-bold" @click="isAssignModalOpen = false" />
            <UButton label="Lưu Ma Trận" color="amber" variant="solid" size="xl" class="rounded-2xl font-black uppercase tracking-wider shadow-xl shadow-amber-500/20" icon="i-heroicons-check" :loading="savingPermissions" @click="savePermissions" />
          </div>
        </div>
        
        <!-- Ma trận -->
        <div class="flex-1 overflow-auto rounded-[2rem] p-2">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            <div 
              v-for="(perms, moduleName) in groupedPermissions" 
              :key="moduleName"
              class="bg-white/60 dark:bg-stone-900/60 backdrop-blur-xl border border-white/80 dark:border-stone-700/50 rounded-3xl p-6 shadow-xl shadow-black/5 flex flex-col transition-all hover:border-amber-300 dark:hover:border-amber-700/50"
            >
              <h4 class="font-black text-stone-800 dark:text-white text-lg mb-4 flex items-center gap-2 pb-3 border-b border-stone-200 dark:border-stone-800">
                <UIcon name="i-heroicons-square-3-stack-3d" class="text-amber-500" />
                {{ moduleName }}
              </h4>
              
              <div class="space-y-4 flex-1">
                <div 
                  v-for="p in perms" 
                  :key="p.id"
                  class="flex items-center justify-between group p-2 -mx-2 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
                >
                  <div>
                    <p class="font-bold text-stone-700 dark:text-stone-300 text-sm group-hover:text-amber-600 transition-colors">{{ p.name }}</p>
                    <p class="text-[10px] text-stone-400 uppercase tracking-widest font-bold">{{ p.code }}</p>
                  </div>
                  <!-- Glowing Toggle -->
                  <div class="relative">
                    <div v-if="selectedPermissions.includes(p.id)" class="absolute inset-0 bg-amber-400 blur-md opacity-50 rounded-full"></div>
                    <UToggle 
                      :model-value="selectedPermissions.includes(p.id)"
                      @update:model-value="val => togglePermission(p.id, val)"
                      color="amber" 
                      size="lg"
                      class="relative z-10"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </UModal>

  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
useHead({ title: 'Quản Lý Phân Quyền - GiaoLy Admin' })

const toast = useToast()

const roles = ref([])
const loading = ref(true)
const columns = [
  { accessorKey: 'name', header: 'Vai Trò' },
  { accessorKey: 'description', header: 'Mô Tả' },
  { accessorKey: 'userCount', header: 'Người Dùng' },
  { accessorKey: 'actions', header: '' }
]

const permissions = ref([])
const groupedPermissions = computed(() => {
  const groups = {}
  permissions.value.forEach((p) => {
    if (!groups[p.module]) groups[p.module] = []
    groups[p.module].push(p)
  })
  return groups
})

const isModalOpen = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const form = reactive({ id: null, name: '', code: '', description: '' })

const isAssignModalOpen = ref(false)
const selectedRole = ref(null)
const selectedPermissions = ref([])
const savingPermissions = ref(false)
const migrating = ref(false)

const getRoleActions = (role) => {
  const actions = [
    [{ label: 'Sửa Thông Tin', icon: 'i-heroicons-pencil-square', click: () => openEditModal(role) }]
  ]
  if (role.code !== '1') {
    actions.push([{ label: 'Xóa Vai Trò', icon: 'i-heroicons-trash', color: 'red', click: () => deleteRole(role) }])
  }
  return actions
}

const togglePermission = (id, val) => {
  if (val) {
    if (!selectedPermissions.value.includes(id)) selectedPermissions.value.push(id)
  } else {
    selectedPermissions.value = selectedPermissions.value.filter(pId => pId !== id)
  }
}

const migrateUsers = async () => {
  if (!confirm('Bạn có chắc muốn chạy tiến trình chuyển đổi dữ liệu người dùng cũ sang RBAC mới không? (Nên chạy 1 lần)')) return
  migrating.value = true
  try {
    const res = await $api('/roles/migrate-users', { method: 'POST' })
    toast.add({ title: 'Thành công', description: res.message, color: 'success' })
  } catch { toast.add({ title: 'Lỗi chuyển đổi dữ liệu', color: 'error' }) }
  finally { migrating.value = false }
}

const fetchRoles = async () => {
  loading.value = true
  try { roles.value = await $api('/roles') } 
  catch { toast.add({ title: 'Lỗi tải danh sách', color: 'error' }) } 
  finally { loading.value = false }
}

const fetchPermissions = async () => {
  try { permissions.value = await $api('/roles/permissions') } 
  catch { /* Ignore */ }
}

const openCreateModal = () => {
  isEditing.value = false
  Object.assign(form, { id: null, name: '', code: '', description: '' })
  isModalOpen.value = true
}

const openEditModal = (role) => {
  isEditing.value = true
  Object.assign(form, role)
  isModalOpen.value = true
}

const submitForm = async () => {
  saving.value = true
  try {
    if (isEditing.value) {
      await $api(`/roles/${form.id}`, { method: 'PUT', body: form })
      toast.add({ title: 'Đã cập nhật', color: 'success' })
    } else {
      await $api('/roles', { method: 'POST', body: form })
      toast.add({ title: 'Đã tạo vai trò mới', color: 'success' })
    }
    isModalOpen.value = false
    await fetchRoles()
  } catch { toast.add({ title: 'Lỗi lưu dữ liệu', color: 'error' }) } 
  finally { saving.value = false }
}

const deleteRole = async (role) => {
  if (!confirm(`Bạn có chắc muốn xóa vai trò ${role.name}?`)) return
  try {
    await $api(`/roles/${role.id}`, { method: 'DELETE' })
    toast.add({ title: 'Đã xóa', color: 'success' })
    await fetchRoles()
  } catch { toast.add({ title: 'Lỗi xóa', color: 'error' }) }
}

const openAssignModal = async (role) => {
  selectedRole.value = role
  selectedPermissions.value = []
  try {
    const data = await $api(`/roles/${role.id}`)
    selectedPermissions.value = data.permissions || []
    isAssignModalOpen.value = true
  } catch { toast.add({ title: 'Lỗi tải quyền hạn', color: 'error' }) }
}

const savePermissions = async () => {
  savingPermissions.value = true
  try {
    await $api(`/roles/${selectedRole.value.id}/permissions`, { method: 'POST', body: selectedPermissions.value })
    toast.add({ title: 'Đã cập nhật quyền hạn', color: 'success' })
    isAssignModalOpen.value = false
  } catch { toast.add({ title: 'Lỗi cập nhật', color: 'error' }) } 
  finally { savingPermissions.value = false }
}

onMounted(() => {
  fetchRoles()
  fetchPermissions()
})
</script>

<style>
@keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
.animate-blob { animation: blob 10s infinite; }
.animation-delay-2000 { animation-delay: 2s; }
@keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-26"></a>📄 [26/71] File: `web-admin/pages/admin/students.vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Admin Pages (Quản trị) | **Số dòng:** 739 | **Kích thước:** 47.6 KB

```markup
<template>
  <!-- ══════════════════════════════════════════════════════════
       TRANG QUẢN LÝ ĐOÀN SINH - Sacred Admin Theme
       Giữ nguyên toàn bộ logic JS, chỉ nâng cấp giao diện
       ══════════════════════════════════════════════════════════ -->
  <div class="min-h-screen font-sans relative pb-24 overflow-hidden">

    <!-- Nền mesh gradient trang trí -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full mix-blend-multiply filter blur-[100px] opacity-15 dark:opacity-8 animate-blob bg-marian-blue-200 dark:bg-marian-blue-900" />
      <div class="absolute -bottom-32 -left-32 w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-10 dark:opacity-8 animate-blob animation-delay-2000 bg-amber-100 dark:bg-amber-900/20" />
    </div>

    <div class="relative z-10 space-y-6 animate-fade-in-up">
      <!-- ── PAGE HEADER & BANNER: Gradient Marian Blue ── -->
      <div class="bg-gradient-to-r from-marian-blue-900 via-marian-blue-800 to-marian-blue-700 dark:from-marian-blue-950 dark:via-marian-blue-900 dark:to-marian-blue-800 rounded-[2rem] p-7 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-2xl shadow-marian-blue-900/40">
        <!-- Trang trí nền -->
        <div class="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div class="absolute bottom-0 left-1/4 w-48 h-24 bg-amber-400/10 rounded-full translate-y-1/2 blur-2xl pointer-events-none" />

        <!-- Text info -->
        <div class="z-10 text-center md:text-left">
          <!-- Badge nhỏ phân hệ -->
          <div class="inline-flex items-center gap-2 px-3 py-1.5 mb-3 rounded-full bg-white/15 text-white/90 text-xs font-black uppercase tracking-widest border border-white/20 shadow-inner backdrop-blur-sm">
            <UIcon name="i-heroicons-academic-cap" class="w-4 h-4 text-amber-300" />
            <span>Phân Hệ Học Vụ</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md">
            Quản Lý
            <span class="text-gradient-gold ml-2">Đoàn Sinh</span>
          </h1>
          <p class="text-marian-blue-200/80 text-sm mt-2 max-w-lg">
            Trung tâm lưu trữ hồ sơ, cấp chứng chỉ bí tích, xếp lớp và quản lý bảng điểm toàn diện.
          </p>
        </div>

        <!-- Buttons -->
        <div class="flex flex-wrap items-center justify-center gap-3 z-10">
          <UButton
            v-if="auth?.hasPermission('students.export')"
            label="Xuất Excel"
            icon="i-heroicons-arrow-down-tray"
            color="white"
            variant="solid"
            size="lg"
            class="rounded-2xl shadow-sm hover:-translate-y-0.5 transition-transform font-semibold"
            @click="exportExcel"
          />
          <UButton
            v-if="auth?.hasPermission('students.manage')"
            label="Nạp Excel"
            icon="i-heroicons-cloud-arrow-up"
            variant="outline"
            size="lg"
            class="rounded-2xl shadow-sm hover:-translate-y-0.5 transition-transform bg-white/10 text-white border-white/30 hover:bg-white/20 font-semibold"
            @click="isImportOpen = true"
          />
          <UButton
            v-if="auth?.hasPermission('students.manage')"
            label="Thêm Mới"
            icon="i-heroicons-plus"
            size="lg"
            class="rounded-2xl shadow-lg hover:-translate-y-0.5 transition-transform font-bold bg-amber-400 hover:bg-amber-500 text-amber-900 border-0 shadow-amber-400/30"
            @click="openAddModal"
          />
        </div>
      </div>

      <!-- ── TIER 1: TABS PHÂN NGÀNH ── -->
      <UCard class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-xl border border-white/50 dark:border-stone-800 rounded-3xl shadow-lg shadow-black/5" :ui="{ body: { padding: 'p-2' } }">
        <UTabs
          :model-value="activeBranch - 1"
          :items="[
            { label: 'Chiên Con', value: 1, icon: 'i-heroicons-heart' },
            { label: 'Ấu Nhi', value: 2, icon: 'i-heroicons-face-smile' },
            { label: 'Thiếu Nhi', value: 3, icon: 'i-heroicons-academic-cap' },
            { label: 'Nghĩa Sĩ', value: 4, icon: 'i-heroicons-fire' },
            { label: 'Hiệp Sĩ', value: 5, icon: 'i-heroicons-shield-check' }
          ]"
          :ui="{ list: { rounded: 'rounded-2xl', background: 'bg-transparent' } }"
          class="w-full"
          @update:model-value="(index) => { activeBranch = index + 1; }"
        />
      </UCard>

      <!-- ── TIER 2: THƯ MỤC LỚP ── -->
      <div v-if="!activeClass" class="animate-fade-in-up">
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
          
          <!-- Thư mục Chưa Xếp Lớp -->
          <div
            class="group cursor-pointer bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/50 dark:border-stone-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-amber-400 dark:hover:border-amber-500 transition-all text-center relative overflow-hidden"
            @click="activeClass = 'UNASSIGNED'"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="w-16 h-16 mx-auto bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
              <UIcon name="i-heroicons-folder-minus" class="w-8 h-8 text-amber-500" />
            </div>
            <h3 class="font-black text-stone-800 dark:text-white text-lg relative z-10">Chưa xếp lớp</h3>
            <p class="text-xs text-stone-500 mt-1 font-bold tracking-widest uppercase relative z-10">Cần phân bổ</p>
          </div>

          <!-- Các Thư mục Lớp học -->
          <div
            v-for="cls in availableClasses"
            :key="cls"
            class="group cursor-pointer bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/50 dark:border-stone-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-primary-400 transition-all text-center relative overflow-hidden"
            @click="activeClass = cls"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-primary-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="w-16 h-16 mx-auto bg-stone-100 dark:bg-stone-800/50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 shadow-inner">
              <UIcon name="i-heroicons-folder" class="w-8 h-8 text-stone-400 group-hover:text-primary-500 transition-colors" />
            </div>
            <h3 class="font-black text-stone-800 dark:text-white text-lg relative z-10">{{ cls }}</h3>
          </div>

        </div>
      </div>

      <!-- ── TIER 3: DANH SÁCH ĐOÀN SINH TRONG LỚP ── -->
      <div v-else class="animate-fade-in-up space-y-4">
        
        <!-- Navbar trong lớp -->
        <div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-xl border border-white/50 dark:border-stone-800 rounded-3xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div class="flex items-center gap-3">
            <UButton icon="i-heroicons-arrow-uturn-left" color="neutral" variant="soft" class="rounded-xl shadow-inner hover:bg-stone-200 dark:hover:bg-stone-800" @click="activeClass = null" />
            <div class="flex items-center gap-2">
              <span class="text-stone-400 font-bold text-sm">Ngành {{ getBranchName(activeBranch) }}</span>
              <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-stone-400" />
              <span class="font-black text-primary-600 dark:text-primary-400 text-lg uppercase tracking-wide">
                {{ activeClass === 'UNASSIGNED' ? 'Chưa xếp lớp' : activeClass }}
              </span>
            </div>
          </div>
          
          <div class="flex flex-wrap items-center gap-3">
            <!-- Nút xếp lớp tự động -->
            <UButton
              v-if="activeClass === 'UNASSIGNED' && auth?.hasPermission('students.manage')"
              label="Xếp Lớp Nhanh (Wizard)"
              icon="i-heroicons-sparkles"
              color="amber"
              variant="solid"
              class="rounded-xl shadow-md font-bold"
              @click="openAssignWizard"
            />
            <!-- Nút Bảng điểm -->
            <UButton
              v-if="activeClass !== 'UNASSIGNED'"
              label="Bảng Điểm (Gradebook)"
              icon="i-heroicons-clipboard-document-list"
              color="primary"
              variant="soft"
              class="rounded-xl shadow-inner font-bold"
              @click="openGradebook"
            />
            
            <div class="hidden lg:flex gap-2 mx-2 pl-4 border-l border-stone-200 dark:border-stone-700">
              <USelectMenu v-model="filterBaptism" :options="[{ label: 'Lọc Rửa Tội', value: '' }, { label: 'Đã Rửa Tội', value: 'true' }, { label: 'Chưa Rửa Tội', value: 'false' }]" value-attribute="value" option-attribute="label" class="w-32" :ui="{ base: 'rounded-xl shadow-sm' }" />
              <USelectMenu v-model="filterCommunion" :options="[{ label: 'Lọc Rước Lễ', value: '' }, { label: 'Đã Rước Lễ', value: 'true' }, { label: 'Chưa Rước Lễ', value: 'false' }]" value-attribute="value" option-attribute="label" class="w-32" :ui="{ base: 'rounded-xl shadow-sm' }" />
              <USelectMenu v-model="filterConfirmation" :options="[{ label: 'Lọc Thêm Sức', value: '' }, { label: 'Đã Thêm Sức', value: 'true' }, { label: 'Chưa Thêm Sức', value: 'false' }]" value-attribute="value" option-attribute="label" class="w-32" :ui="{ base: 'rounded-xl shadow-sm' }" />
            </div>
            <UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass" placeholder="Tên thánh, Họ tên..." class="w-56 lg:w-64" :ui="{ base: 'rounded-xl shadow-inner' }" />
          </div>
        </div>

        <!-- Glass Data Grid -->
        <UCard 
          class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-3xl shadow-2xl shadow-black/5 border border-white/50 dark:border-stone-800 rounded-[2.5rem] overflow-hidden"
          :ui="{ body: { padding: 'p-0', base: 'overflow-x-auto' } }"
        >
          <UTable
            :rows="pagedData?.items || []"
            :columns="columns"
            :loading="pending"
            :empty-state="{ icon: 'i-heroicons-users', header: 'Lớp trống hoặc không tìm thấy' }"
            :ui="{ 
              th: { base: 'bg-stone-100/50 dark:bg-stone-900/50 font-black uppercase tracking-widest text-[10px] text-stone-500 py-4 border-b border-white/40 dark:border-stone-800/50' },
              td: { base: 'whitespace-nowrap border-b border-stone-200/20 dark:border-stone-800/20 py-3' },
              tr: { base: 'hover:bg-white/50 dark:hover:bg-stone-800/50 transition-colors group' }
            }"
          >
            <template #fullName-cell="{ row }">
              <NuxtLink :to="`/admin/students/${row.original.id}`" class="flex items-center gap-3 pl-2 group/link cursor-pointer">
                <UAvatar :alt="row.original.fullName" size="sm" :ui="{ background: `bg-${getBranchTailwindColor(row.original.branch)}-100 dark:bg-${getBranchTailwindColor(row.original.branch)}-900`, text: `text-${getBranchTailwindColor(row.original.branch)}-600 dark:text-${getBranchTailwindColor(row.original.branch)}-300 font-bold` }" class="shadow-sm ring-2 ring-white dark:ring-stone-800 group-hover/link:scale-105 transition-transform" />
                <div>
                  <p class="font-black text-stone-800 dark:text-white text-sm leading-none mb-1 group-hover/link:text-primary-600 transition-colors">
                    <span class="text-primary-500 mr-1">{{ row.original.holyName }}</span>
                    {{ row.original.fullName }}
                  </p>
                  <p class="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                    Sinh: {{ formatDate(row.original.birthDate) }}
                  </p>
                </div>
              </NuxtLink>
            </template>
            
            <template #branch-cell="{ row }">
              <UBadge :color="getBranchColor(row.original.branch)" variant="subtle" size="sm" class="font-black uppercase tracking-widest px-3 rounded-xl shadow-inner">
                {{ getBranchName(row.original.branch) }}
              </UBadge>
            </template>
            
            <template #sacraments-cell="{ row }">
              <div class="flex gap-2">
                <UTooltip text="Rửa Tội"><UIcon name="i-heroicons-beaker" :class="row.original.baptismDate ? 'text-blue-500 w-5 h-5 drop-shadow' : 'text-stone-300 dark:text-stone-700 w-5 h-5 opacity-50'" /></UTooltip>
                <UTooltip text="Rước Lễ"><UIcon name="i-heroicons-cake" :class="row.original.communionDate ? 'text-amber-500 w-5 h-5 drop-shadow' : 'text-stone-300 dark:text-stone-700 w-5 h-5 opacity-50'" /></UTooltip>
                <UTooltip text="Thêm Sức"><UIcon name="i-heroicons-fire" :class="row.original.confirmationDate ? 'text-red-500 w-5 h-5 drop-shadow' : 'text-stone-300 dark:text-stone-700 w-5 h-5 opacity-50'" /></UTooltip>
              </div>
            </template>

            <!-- Menu 3 chấm Actions -->
            <template #actions-cell="{ row }">
              <div class="flex justify-end pr-2">
                <UDropdown v-if="auth?.hasPermission('students.manage')" :items="getStudentActions(row.original)" :popper="{ placement: 'bottom-end' }">
                  <UButton color="neutral" variant="ghost" icon="i-heroicons-ellipsis-horizontal" size="sm" class="rounded-xl opacity-50 group-hover:opacity-100 transition-opacity bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 shadow-sm" />
                </UDropdown>
              </div>
            </template>
          </UTable>

          <div class="flex justify-between items-center px-6 py-4 border-t border-white/30 dark:border-stone-800/50 bg-stone-100/30 dark:bg-stone-900/30">
            <span class="text-xs font-bold text-stone-500">Tổng cộng: <b>{{ pagedData?.total || 0 }}</b> hồ sơ</span>
            <UPagination v-model="page" :page-count="pageSize" :total="pagedData?.total || 0" :ui="{ wrapper: 'shadow-inner rounded-xl', base: 'rounded-lg' }" />
          </div>
        </UCard>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         MODALS (Add/Edit, Certificate, Wizard, Gradebook, Import)
    ═══════════════════════════════════════════════════════ -->
    
    <!-- Modal Add/Edit Student -->
    <UModal v-model:open="isAddModalOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden sm:max-w-4xl' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' }, footer: { padding: 'p-6 bg-stone-50 dark:bg-stone-900' } }">
        <template #header>
          <div class="bg-primary-600 dark:bg-primary-900 p-6 flex justify-between items-center text-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><UIcon name="i-heroicons-user-plus" class="w-6 h-6" /></div>
              <h3 class="text-xl font-black uppercase tracking-wide">{{ isEditing ? 'Cập Nhật Hồ Sơ Đoàn Sinh' : 'Tạo Hồ Sơ Đoàn Sinh Mới' }}</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="white" variant="ghost" class="hover:bg-white/10 rounded-full" @click="isAddModalOpen = false" />
          </div>
        </template>
        <UForm :schema="studentSchema" :state="studentForm" id="studentForm" @submit="submitStudent" class="p-6">
          <UTabs :items="profileTabs" :ui="{ list: { rounded: 'rounded-2xl bg-stone-100 dark:bg-stone-800' } }" class="w-full">
            
            <template #personal>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <UFormField label="Tên Thánh" name="holyName"><UInput v-model="studentForm.holyName" placeholder="Giuse" class="w-full" :ui="{ base: 'rounded-xl' }" /></UFormField>
                <UFormField label="Họ và Tên" name="fullName" required><UInput v-model="studentForm.fullName" placeholder="Nguyễn Văn A" class="w-full" :ui="{ base: 'rounded-xl' }" /></UFormField>
                <UFormField label="Ngày Sinh" name="birthDate"><UInput v-model="studentForm.birthDate" type="date" class="w-full" :ui="{ base: 'rounded-xl' }" /></UFormField>
                <UFormField label="Giới tính" name="gender"><USelect v-model="studentForm.gender" :options="['Nam', 'Nữ']" class="w-full" :ui="{ base: 'rounded-xl' }" /></UFormField>
                <UFormField label="Trạng thái" name="isActive">
                  <div class="flex items-center gap-3 mt-1 p-2 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                    <UToggle v-model="studentForm.isActive" color="emerald" />
                    <span class="text-sm font-bold text-stone-600 dark:text-stone-300">{{ studentForm.isActive ? 'Đang hoạt động' : 'Đã nghỉ học' }}</span>
                  </div>
                </UFormField>
                <UFormField label="Khu/Xóm" name="area"><UInput v-model="studentForm.area" placeholder="Khu Mân Côi..." class="w-full" :ui="{ base: 'rounded-xl' }" /></UFormField>
              </div>
            </template>
            
            <!-- Other tabs are similarly restyled in a fast way -->
            <template #family>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div class="space-y-4 p-5 border border-primary-200 dark:border-primary-800 rounded-2xl bg-primary-50/30 dark:bg-primary-900/10">
                  <h4 class="font-black text-primary-600 flex items-center gap-2"><UIcon name="i-heroicons-user" /> Thông tin Cha</h4>
                  <div class="grid grid-cols-2 gap-3">
                    <UFormField label="Tên Thánh" name="fatherHolyName"><UInput v-model="studentForm.fatherHolyName" :ui="{ base: 'rounded-xl' }" /></UFormField>
                    <UFormField label="Họ Tên" name="fatherName"><UInput v-model="studentForm.fatherName" :ui="{ base: 'rounded-xl' }" /></UFormField>
                  </div>
                  <UFormField label="Nghề nghiệp" name="fatherJob"><UInput v-model="studentForm.fatherJob" :ui="{ base: 'rounded-xl' }" /></UFormField>
                </div>
                <div class="space-y-4 p-5 border border-pink-200 dark:border-pink-800 rounded-2xl bg-pink-50/30 dark:bg-pink-900/10">
                  <h4 class="font-black text-pink-600 flex items-center gap-2"><UIcon name="i-heroicons-user" /> Thông tin Mẹ</h4>
                  <div class="grid grid-cols-2 gap-3">
                    <UFormField label="Tên Thánh" name="motherHolyName"><UInput v-model="studentForm.motherHolyName" :ui="{ base: 'rounded-xl' }" /></UFormField>
                    <UFormField label="Họ Tên" name="motherName"><UInput v-model="studentForm.motherName" :ui="{ base: 'rounded-xl' }" /></UFormField>
                  </div>
                  <UFormField label="Nghề nghiệp" name="motherJob"><UInput v-model="studentForm.motherJob" :ui="{ base: 'rounded-xl' }" /></UFormField>
                </div>
                <UFormField label="Số Điện Thoại Liên Lạc" name="parentPhone" class="md:col-span-2">
                  <UInput v-model="studentForm.parentPhone" placeholder="090..." icon="i-heroicons-phone" class="w-full" :ui="{ base: 'rounded-xl' }" />
                </UFormField>
                <UFormField label="Địa chỉ nhà" name="address" class="md:col-span-2">
                  <UInput v-model="studentForm.address" placeholder="Tổ, Đường, Phường..." class="w-full" :ui="{ base: 'rounded-xl' }" />
                </UFormField>
              </div>
            </template>

            <template #sacraments>
              <div class="space-y-4 mt-6">
                <!-- Rửa tội -->
                <div class="p-5 border border-blue-200 dark:border-blue-800 rounded-2xl bg-blue-50/30 dark:bg-blue-900/10">
                  <UCheckbox :model-value="!!studentForm.baptismDate" @update:model-value="val => studentForm.baptismDate = val ? (studentForm.baptismDate || new Date().toISOString().split('T')[0]) : ''" label="Đã Rửa Tội" :ui="{ label: 'font-bold text-blue-700 dark:text-blue-400' }" />
                  <div v-if="studentForm.baptismDate" class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <UFormField label="Ngày nhận"><UInput v-model="studentForm.baptismDate" type="date" :ui="{ base: 'rounded-xl' }" /></UFormField>
                    <UFormField label="Nơi nhận"><UInput v-model="studentForm.baptismPlace" placeholder="Giáo xứ..." :ui="{ base: 'rounded-xl' }" /></UFormField>
                    <UFormField label="Linh mục"><UInput v-model="studentForm.baptismPriest" :ui="{ base: 'rounded-xl' }" /></UFormField>
                  </div>
                </div>
                <!-- Rước lễ -->
                <div class="p-5 border border-amber-200 dark:border-amber-800 rounded-2xl bg-amber-50/30 dark:bg-amber-900/10">
                  <UCheckbox :model-value="!!studentForm.communionDate" @update:model-value="val => studentForm.communionDate = val ? (studentForm.communionDate || new Date().toISOString().split('T')[0]) : ''" label="Đã Rước Lễ" :ui="{ label: 'font-bold text-amber-700 dark:text-amber-400' }" />
                  <div v-if="studentForm.communionDate" class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <UFormField label="Ngày nhận"><UInput v-model="studentForm.communionDate" type="date" :ui="{ base: 'rounded-xl' }" /></UFormField>
                    <UFormField label="Nơi nhận"><UInput v-model="studentForm.communionPlace" :ui="{ base: 'rounded-xl' }" /></UFormField>
                    <UFormField label="Linh mục"><UInput v-model="studentForm.communionPriest" :ui="{ base: 'rounded-xl' }" /></UFormField>
                  </div>
                </div>
                <!-- Thêm sức -->
                <div class="p-5 border border-red-200 dark:border-red-800 rounded-2xl bg-red-50/30 dark:bg-red-900/10">
                  <UCheckbox :model-value="!!studentForm.confirmationDate" @update:model-value="val => studentForm.confirmationDate = val ? (studentForm.confirmationDate || new Date().toISOString().split('T')[0]) : ''" label="Đã Thêm Sức" :ui="{ label: 'font-bold text-red-700 dark:text-red-400' }" />
                  <div v-if="studentForm.confirmationDate" class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <UFormField label="Ngày nhận"><UInput v-model="studentForm.confirmationDate" type="date" :ui="{ base: 'rounded-xl' }" /></UFormField>
                    <UFormField label="Nơi nhận"><UInput v-model="studentForm.confirmationPlace" :ui="{ base: 'rounded-xl' }" /></UFormField>
                    <UFormField label="Người đỡ đầu"><UInput v-model="studentForm.confirmationGodparent" :ui="{ base: 'rounded-xl' }" /></UFormField>
                  </div>
                </div>
              </div>
            </template>

            <template #medical>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <UFormField label="Nhóm máu"><USelect v-model="studentForm.bloodType" :options="['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Chưa rõ']" :ui="{ base: 'rounded-xl' }" /></UFormField>
                <UFormField label="Tiền sử dị ứng"><UInput v-model="studentForm.allergies" placeholder="Ví dụ: Hải sản..." :ui="{ base: 'rounded-xl' }" /></UFormField>
              </div>
            </template>

            <template #academic>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <UFormField label="Ngành"><USelect v-model="studentForm.branch" :options="[{ label: 'Chiên con', value: 1 }, { label: 'Ấu nhi', value: 2 }, { label: 'Thiếu nhi', value: 3 }, { label: 'Nghĩa sĩ', value: 4 }, { label: 'Hiệp sĩ', value: 5 }]" value-attribute="value" option-attribute="label" :ui="{ base: 'rounded-xl' }" /></UFormField>
                <UFormField label="Lớp (để trống nếu xếp tự động)"><UInput v-model="studentForm.className" placeholder="Ấu 1" :ui="{ base: 'rounded-xl' }" /></UFormField>
                <UFormField label="Ghi chú đặc biệt" class="md:col-span-2"><UTextarea v-model="studentForm.notes" :rows="3" :ui="{ base: 'rounded-xl' }" /></UFormField>
              </div>
            </template>
          </UTabs>
        </UForm>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Hủy bỏ" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isAddModalOpen = false" />
            <UButton type="submit" form="studentForm" :label="isEditing ? 'Lưu Thay Đổi' : 'Tạo Hồ Sơ Mới'" color="primary" variant="solid" size="lg" class="rounded-xl font-black uppercase tracking-wider shadow-lg" :loading="isSubmitting" />
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Modal Cấp Chứng Chỉ -->
    <UModal v-model:open="isCertModalOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden' }">
      <UCard :ui="{ body: { padding: 'p-6' }, header: { padding: 'p-6 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800' } }">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl shadow-inner"><UIcon name="i-heroicons-academic-cap" class="w-8 h-8" /></div>
            <div>
              <h3 class="text-xl font-black text-stone-800 dark:text-white uppercase">Chứng Chỉ Bí Tích</h3>
              <p class="text-sm font-bold text-primary-600 mt-1">{{ selectedStudent?.holyName }} {{ selectedStudent?.fullName }}</p>
            </div>
          </div>
        </template>
        <div class="space-y-6">
          <div class="space-y-2">
            <h4 class="font-black text-xs uppercase tracking-widest text-stone-500">Đã Cấp Phát</h4>
            <div v-if="!certificates.length" class="text-sm text-stone-400 italic p-4 bg-stone-50 dark:bg-stone-900/50 rounded-2xl text-center border border-dashed border-stone-200 dark:border-stone-800">Chưa có chứng chỉ nào.</div>
            <div v-for="cert in certificates" :key="cert.id" class="flex justify-between items-center p-4 bg-stone-100 dark:bg-stone-800 rounded-2xl">
              <div>
                <p class="font-black text-stone-800 dark:text-white">{{ getCertName(cert.certificateType) }}</p>
                <p class="text-[10px] text-stone-500 font-bold uppercase tracking-widest mt-1">Mã: {{ cert.verificationCode }}</p>
              </div>
              <div class="flex gap-2">
                <UButton icon="i-heroicons-arrow-down-tray" color="primary" variant="soft" size="sm" class="rounded-xl" :to="`/api/Certificate/download/${cert.id}`" target="_blank" external />
                <UButton icon="i-heroicons-trash" color="error" variant="ghost" size="sm" class="rounded-xl" @click="revokeCert(cert.id)" />
              </div>
            </div>
          </div>
          <hr class="border-stone-200 dark:border-stone-800">
          <div class="space-y-4">
            <h4 class="font-black text-xs uppercase tracking-widest text-stone-500">Cấp Mới</h4>
            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Loại Bí Tích"><USelect v-model="certForm.certificateType" :options="[{ label: 'Rửa Tội', value: 'Baptism' }, { label: 'Rước Lễ', value: 'Communion' }, { label: 'Thêm Sức', value: 'Confirmation' }]" value-attribute="value" option-attribute="label" :ui="{ base: 'rounded-xl' }" /></UFormField>
              <UFormField label="Linh Mục Chủ Sự"><UInput v-model="certForm.celebrant" :ui="{ base: 'rounded-xl' }" /></UFormField>
              <UFormField label="Người Đỡ Đầu"><UInput v-model="certForm.godparent" :ui="{ base: 'rounded-xl' }" /></UFormField>
              <UFormField label="Ký tên (Cha Xứ)"><UInput v-model="certForm.signedBy" :ui="{ base: 'rounded-xl' }" /></UFormField>
            </div>
            <UButton label="Tiến Hành Cấp Phát" color="amber" block size="lg" class="rounded-xl font-black uppercase tracking-wider shadow-md" @click="issueCert" />
          </div>
        </div>
      </UCard>
    </UModal>

    <!-- Modal Auto-Assign Wizard -->
    <UModal v-model:open="isAssignModalOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden' }">
      <UCard :ui="{ body: { padding: 'p-6' }, header: { padding: 'p-6 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800' } }">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl shadow-inner"><UIcon name="i-heroicons-sparkles" class="w-8 h-8" /></div>
            <div>
              <h3 class="text-xl font-black text-stone-800 dark:text-white uppercase">Xếp Lớp Tự Động</h3>
              <p class="text-sm font-bold text-stone-500 mt-1">Phân bổ đều học sinh vào các lớp</p>
            </div>
          </div>
        </template>
        <div class="space-y-6">
          <div class="p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-2xl flex items-start gap-3 text-primary-700 dark:text-primary-300 text-sm font-medium">
            <UIcon name="i-heroicons-information-circle" class="w-6 h-6 shrink-0" />
            <p>Hệ thống sẽ lấy toàn bộ <b>{{ pagedData?.total || 0 }}</b> đoàn sinh chưa xếp lớp của ngành <b>{{ getBranchName(activeBranch) }}</b> và chia đều vào số lượng lớp bạn chọn.</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Số lượng Lớp"><UInput v-model.number="assignForm.numClasses" type="number" min="1" max="20" :ui="{ base: 'rounded-xl' }" /></UFormField>
            <UFormField label="Phương pháp">
              <USelect v-model="assignForm.method" :options="[{ label: 'Trộn Ngẫu Nhiên', value: 'Random' }, { label: 'Chia Theo Giáo Khu', value: 'Area' }]" value-attribute="value" option-attribute="label" :ui="{ base: 'rounded-xl' }" />
            </UFormField>
          </div>
          <UButton label="Khởi Chạy Xếp Lớp" color="amber" block size="lg" class="rounded-xl font-black uppercase tracking-wider shadow-lg" @click="submitAssignClasses" />
        </div>
      </UCard>
    </UModal>

    <!-- Modal Bảng Điểm (Gradebook) -->
    <UModal v-model:open="isGradebookOpen" fullscreen :ui="{ base: 'bg-white/95 dark:bg-stone-950/95 backdrop-blur-3xl' }">
      <div class="h-full flex flex-col p-6 max-w-7xl mx-auto w-full">
        <div class="flex items-center justify-between mb-6 pb-6 border-b border-stone-200 dark:border-stone-800">
          <div class="flex items-center gap-4">
            <div class="p-4 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-2xl"><UIcon name="i-heroicons-clipboard-document-list" class="w-8 h-8" /></div>
            <div>
              <h2 class="text-3xl font-black text-stone-800 dark:text-white uppercase tracking-tight">Sổ Điểm Danh & Kết Quả</h2>
              <p class="text-sm font-bold text-stone-500 uppercase tracking-widest mt-1">Lớp: <span class="text-primary-600">{{ activeClass }}</span></p>
            </div>
          </div>
          <div class="flex gap-3">
            <UButton label="Đóng" color="neutral" variant="soft" size="lg" class="rounded-2xl font-bold" @click="isGradebookOpen = false" />
            <UButton label="Lưu Bảng Điểm" color="primary" variant="solid" size="lg" class="rounded-2xl font-black uppercase shadow-lg" icon="i-heroicons-check" :loading="isSavingGradebook" @click="saveGradebook" />
          </div>
        </div>
        
        <div class="flex-1 overflow-auto rounded-[2rem] border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xl relative">
          <table class="w-full text-sm text-left">
            <thead class="text-xs font-black text-stone-500 uppercase tracking-widest bg-stone-100 dark:bg-stone-950 sticky top-0 z-10 shadow-sm">
              <tr>
                <th class="px-6 py-5 w-16">STT</th>
                <th class="px-6 py-5 min-w-[200px]">Họ và Tên Đoàn Sinh</th>
                <th class="px-6 py-5 w-32 text-center">Học Kỳ 1</th>
                <th class="px-6 py-5 w-32 text-center">Học Kỳ 2</th>
                <th class="px-6 py-5 w-32 text-center text-primary-600">Tổng Kết</th>
                <th class="px-6 py-5 min-w-[300px]">Nhận Xét Của GLV</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100 dark:divide-stone-800/50">
              <tr v-if="gradebookPending" v-for="i in 5" :key="`skeleton-${i}`" class="animate-pulse">
                <td colspan="6" class="px-6 py-6 bg-stone-50 dark:bg-stone-900/50">Đang tải dữ liệu...</td>
              </tr>
              <tr v-else-if="!gradebookData.length">
                <td colspan="6" class="px-6 py-12 text-center text-stone-500 font-bold">Chưa có đoàn sinh nào trong lớp.</td>
              </tr>
              <tr v-else v-for="(row, idx) in gradebookData" :key="row.studentId" class="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                <td class="px-6 py-4 font-black text-stone-400">{{ idx + 1 }}</td>
                <td class="px-6 py-4">
                  <div class="font-black text-stone-800 dark:text-stone-200 text-base">{{ row.fullName }}</div>
                  <div class="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{{ row.holyName }}</div>
                </td>
                <td class="px-6 py-4"><UInput v-model="row.semester1" type="number" step="0.1" size="lg" placeholder="-" class="w-24 mx-auto" :ui="{ base: 'text-center font-bold rounded-xl bg-white dark:bg-stone-900 shadow-inner' }" /></td>
                <td class="px-6 py-4"><UInput v-model="row.semester2" type="number" step="0.1" size="lg" placeholder="-" class="w-24 mx-auto" :ui="{ base: 'text-center font-bold rounded-xl bg-white dark:bg-stone-900 shadow-inner' }" /></td>
                <td class="px-6 py-4"><UInput v-model="row.finalScore" type="number" step="0.1" size="lg" placeholder="Auto" class="w-24 mx-auto" :ui="{ base: 'text-center font-black text-primary-600 bg-primary-50 dark:bg-primary-900/20 rounded-xl shadow-inner border-primary-200 dark:border-primary-800' }" /></td>
                <td class="px-6 py-4"><UInput v-model="row.remarks" size="lg" placeholder="Nhập nhận xét..." :ui="{ base: 'rounded-xl shadow-inner' }" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </UModal>

    <!-- Modal Import -->
    <UModal v-model:open="isImportOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden sm:max-w-3xl' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-6 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800' } }">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-black text-stone-800 dark:text-white uppercase flex items-center gap-2">
              <UIcon name="i-heroicons-cloud-arrow-up" class="text-primary-500 w-6 h-6" /> Nạp Dữ Liệu Hàng Loạt
            </h3>
            <UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" @click="isImportOpen = false" />
          </div>
        </template>
        <div class="p-6">
          <ImportWizard @imported="isImportOpen = false; refresh()" />
        </div>
      </UCard>
    </UModal>

  </div>
</template>

<script setup>
import { z } from 'zod'
import { refDebounced } from '@vueuse/core'
import ImportWizard from '~/components/ImportWizard.vue'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Quản Lý Đoàn Sinh - GiaoLy Admin' })

const toast = useToast()
const auth = useAuthStore()

// ── State Thư Mục (File Explorer) ──
const activeBranch = ref(1) // Mặc định Chiên Con
const activeClass = ref(null) // null = xem danh sách lớp, string = tên lớp cụ thể
const availableClasses = ref([])

const fetchClasses = async () => {
  try {
    availableClasses.value = await $api(`/Student/classes/${activeBranch.value}`) || []
  } catch (err) {
    console.error('Lỗi tải danh sách lớp', err)
  }
}

watch(activeBranch, () => {
  activeClass.value = null
  fetchClasses()
}, { immediate: true })

// ── Gradebook ──
const isGradebookOpen = ref(false)
const gradebookData = ref([])
const gradebookPending = ref(false)
const isSavingGradebook = ref(false)

const openGradebook = async () => {
  if (!activeClass.value || activeClass.value === 'UNASSIGNED') return
  isGradebookOpen.value = true
  await fetchGradebook()
}

const fetchGradebook = async () => {
  gradebookPending.value = true
  try {
    gradebookData.value = await $api(`/StudentScore/class/${encodeURIComponent(activeClass.value)}`)
  } catch (err) {
    toast.add({ title: 'Lỗi tải bảng điểm', description: err.data?.message || err.message, color: 'error' })
  } finally {
    gradebookPending.value = false
  }
}

const saveGradebook = async () => {
  isSavingGradebook.value = true
  try {
    await $fetch(`${useRuntimeConfig().public.apiBase}/StudentScore/save`, {
      method: 'POST',
      body: gradebookData.value,
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    toast.add({ title: 'Đã lưu điểm thành công', color: 'success' })
  } catch (err) {
    toast.add({ title: 'Lỗi lưu điểm', description: err.data?.message || err.message, color: 'error' })
  } finally {
    isSavingGradebook.value = false
  }
}

// ── Bảng Dữ Liệu Đoàn Sinh (Pagination & Filter) ──
const page = ref(1)
const pageSize = ref(20)
const searchQuery = ref('')
const debouncedSearchQuery = refDebounced(searchQuery, 500)
const filterBaptism = ref('')
const filterCommunion = ref('')
const filterConfirmation = ref('')

const { data: pagedData, pending, refresh } = await useApiFetch('/Student/paged', {
  query: computed(() => ({
    page: page.value,
    pageSize: pageSize.value,
    search: debouncedSearchQuery.value,
    branch: activeBranch.value,
    className: activeClass.value === 'UNASSIGNED' ? 'UNASSIGNED' : activeClass.value,
    hasBaptism: filterBaptism.value !== '' ? filterBaptism.value === 'true' : undefined,
    hasCommunion: filterCommunion.value !== '' ? filterCommunion.value === 'true' : undefined,
    hasConfirmation: filterConfirmation.value !== '' ? filterConfirmation.value === 'true' : undefined
  })),
  watch: [page, pageSize, debouncedSearchQuery, activeBranch, activeClass, filterBaptism, filterCommunion, filterConfirmation]
})

const columns = [
  { accessorKey: 'fullName', header: 'Đoàn Sinh' },
  { accessorKey: 'branch', header: 'Ngành' },
  { accessorKey: 'sacraments', header: 'Bí Tích' },
  { accessorKey: 'actions', header: '' }
]

const getStudentActions = (student) => [
  [{ label: 'Chi tiết / In Chứng Chỉ', icon: 'i-heroicons-qr-code', click: () => { window.location.href = `/admin/students/${student.id}` } }],
  [{ label: 'Cấp Bí Tích', icon: 'i-heroicons-sparkles', click: () => openCertModal(student) }, { label: 'Sửa Hồ Sơ', icon: 'i-heroicons-pencil-square', click: () => openEditModal(student) }],
  [{ label: 'Xóa Hồ Sơ', icon: 'i-heroicons-trash', color: 'red', click: () => deleteStudent(student.id) }]
]

// ── Helpers ──
const getBranchName = b => ({ 1: 'Chiên con', 2: 'Ấu nhi', 3: 'Thiếu nhi', 4: 'Nghĩa sĩ', 5: 'Hiệp sĩ' }[b] || 'Khác')
const getBranchColor = b => ({ 1: 'pink', 2: 'success', 3: 'primary', 4: 'warning', 5: 'error' }[b] || 'neutral')
const getBranchTailwindColor = b => ({ 1: 'pink', 2: 'emerald', 3: 'blue', 4: 'amber', 5: 'red' }[b] || 'stone')
const getCertName = t => ({ Baptism: 'Rửa Tội', Communion: 'Rước Lễ', Confirmation: 'Thêm Sức' }[t] || t)
const formatDate = d => d ? new Date(d).toLocaleDateString('vi-VN') : '---'
const toDateInput = d => d ? new Date(d).toISOString().split('T')[0] : ''

// ── Add/Edit Modal ──
const isAddModalOpen = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const editingId = ref(null)

const defaultStudent = () => ({ 
  holyName: '', fullName: '', birthDate: '', gender: 'Nam', area: '', 
  className: '', branch: activeBranch.value, isActive: true,
  baptismDate: '', baptismPlace: '', baptismPriest: '', baptismGodparent: '',
  communionDate: '', communionPlace: '', communionPriest: '',
  confirmationDate: '', confirmationPlace: '', confirmationBishop: '', confirmationGodparent: '', 
  fatherHolyName: '', fatherName: '', fatherJob: '', fatherReligion: '',
  motherHolyName: '', motherName: '', motherJob: '', motherReligion: '',
  parentPhone: '', address: '', marriageStatus: '',
  notes: '', bloodType: '', allergies: ''
})
const studentForm = ref(defaultStudent())

const studentSchema = z.object({
  holyName: z.string().max(50).optional().or(z.literal('')),
  fullName: z.string().min(2, 'Họ tên quá ngắn').max(100),
  birthDate: z.string().optional().or(z.literal('')),
  gender: z.string().optional().or(z.literal('')),
  area: z.string().max(100).optional().or(z.literal('')),
  className: z.string().max(50).optional().or(z.literal('')),
  branch: z.number(),
  isActive: z.boolean().optional(),
  baptismDate: z.string().optional().or(z.literal('')),
  communionDate: z.string().optional().or(z.literal('')),
  confirmationDate: z.string().optional().or(z.literal('')),
  parentPhone: z.string().optional().or(z.literal(''))
})

const openAddModal = () => { isEditing.value = false; studentForm.value = defaultStudent(); isAddModalOpen.value = true }
const openEditModal = (s) => { isEditing.value = true; editingId.value = s.id; studentForm.value = { ...s, birthDate: toDateInput(s.birthDate), baptismDate: toDateInput(s.baptismDate), communionDate: toDateInput(s.communionDate), confirmationDate: toDateInput(s.confirmationDate) }; isAddModalOpen.value = true }

const profileTabs = [
  { label: 'Cá nhân', slot: 'personal' }, { label: 'Gia đình', slot: 'family' }, { label: 'Bí tích', slot: 'sacraments' }, { label: 'Y tế', slot: 'medical' }, { label: 'Học vụ', slot: 'academic' }
]

const submitStudent = async () => {
  isSubmitting.value = true
  try {
    const payload = { ...studentForm.value }
    if (!payload.baptismDate) payload.baptismDate = null
    if (!payload.communionDate) payload.communionDate = null
    if (!payload.confirmationDate) payload.confirmationDate = null
    if (!payload.birthDate) payload.birthDate = null
    if (isEditing.value) {
      await $api(`/Student/${editingId.value}`, { method: 'PUT', body: payload })
      toast.add({ title: 'Đã cập nhật', color: 'success' })
    } else {
      await $api('/Student', { method: 'POST', body: payload })
      toast.add({ title: 'Đã thêm hồ sơ', color: 'success' })
    }
    isAddModalOpen.value = false
    await refresh()
  } catch (err) { toast.add({ title: 'Lỗi', description: err.message, color: 'error' }) }
  isSubmitting.value = false
}

const deleteStudent = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa đoàn sinh này? Dữ liệu không thể phục hồi.')) return
  try {
    await $api(`/Student/${id}`, { method: 'DELETE' })
    toast.add({ title: 'Đã xóa hồ sơ', color: 'success' })
    await refresh()
  } catch { toast.add({ title: 'Lỗi xóa', color: 'error' }) }
}

// ── Auto-Assign Wizard ──
const isAssignModalOpen = ref(false)
const assignForm = ref({ numClasses: 3, method: 'Random' })
const openAssignWizard = () => isAssignModalOpen.value = true
const submitAssignClasses = async () => {
  if (!pagedData.value?.items?.length) return toast.add({ title: 'Không có đoàn sinh để xếp lớp', color: 'error' })
  try {
    const studentIds = pagedData.value.items.map(s => s.id)
    const branchPrefix = getBranchName(activeBranch.value).split(' ')[0]
    await $api('/Student/assign-classes', { method: 'POST', body: { studentIds, numberOfClasses: assignForm.value.numClasses, branchPrefix, method: assignForm.value.method } })
    toast.add({ title: 'Đã xếp lớp thành công', color: 'success' })
    isAssignModalOpen.value = false
    activeClass.value = null
    await fetchClasses()
    await refresh()
  } catch (err) { toast.add({ title: 'Lỗi xếp lớp', description: err.message, color: 'error' }) }
}

// ── Certificates ──
const isCertModalOpen = ref(false)
const selectedStudent = ref(null)
const certificates = ref([])
const certForm = ref({ certificateType: 'Baptism', celebrant: '', godparent: '', signedBy: 'Cha Chánh Xứ' })

const loadCerts = async (id) => { try { certificates.value = await $api(`/Certificate/student/${id}`) || [] } catch { certificates.value = [] } }
const openCertModal = async (student) => { selectedStudent.value = student; certForm.value = { certificateType: 'Baptism', celebrant: '', godparent: '', signedBy: 'Cha Chánh Xứ' }; await loadCerts(student.id); isCertModalOpen.value = true }
const issueCert = async () => {
  try {
    await $api('/Certificate/issue', { method: 'POST', body: { studentId: selectedStudent.value.id, ...certForm.value } })
    toast.add({ title: 'Đã cấp chứng chỉ', color: 'success' })
    await loadCerts(selectedStudent.value.id)
  } catch (err) { toast.add({ title: 'Lỗi', description: err.data?.message || err.message, color: 'error' }) }
}
const revokeCert = async (id) => {
  if (!confirm('Thu hồi chứng chỉ này?')) return
  try { await $api(`/Certificate/${id}`, { method: 'DELETE' }); toast.add({ title: 'Đã thu hồi', color: 'success' }); await loadCerts(selectedStudent.value.id) } catch { toast.add({ title: 'Lỗi', color: 'error' }) }
}

// ── Excel ──
const isImportOpen = ref(false)
const exportExcel = async () => {
  try {
    const params = new URLSearchParams()
    if (activeBranch.value > 0) params.append('branch', activeBranch.value) // FIX BUG: Changed from filterBranch to activeBranch
    if (filterBaptism.value !== '') params.append('hasBaptism', filterBaptism.value === 'true')
    if (filterCommunion.value !== '') params.append('hasCommunion', filterCommunion.value === 'true')
    if (filterConfirmation.value !== '') params.append('hasConfirmation', filterConfirmation.value === 'true')
    
    const res = await $fetch(`${useRuntimeConfig().public.apiBase}/Student/export-excel?${params.toString()}`, { method: 'GET', headers: { Authorization: `Bearer ${auth.token}` }, responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([res]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `DanhSachDoanSinh_${new Date().toISOString().split('T')[0]}.xlsx`)
    document.body.appendChild(link)
    link.click(); link.remove()
  } catch (err) { toast.add({ title: 'Lỗi xuất Excel', description: err.message, color: 'error' }) }
}
</script>

<style>
/* animate-blob, animation-delay-2000, animate-fade-in-up đã định nghĩa trong main.css */
/* Giữ style block trống để tương thích scoped nếu cần */
</style>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-27"></a>📄 [27/71] File: `web-admin/pages/admin/students/[id].vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Admin Pages (Quản trị) | **Số dòng:** 225 | **Kích thước:** 12.4 KB

```markup
<template>
  <div class="space-y-6 animate-fade-in-up">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <UButton
          icon="i-heroicons-arrow-left"
          color="neutral"
          variant="ghost"
          to="/admin/students"
        />
        <div>
          <h1 class="text-2xl font-black text-stone-800 dark:text-white uppercase tracking-wide">
            Hồ Sơ Đoàn Sinh
          </h1>
          <p class="text-xs text-stone-400 mt-0.5">
            Xem chi tiết thông tin và quá trình sinh hoạt
          </p>
        </div>
      </div>
      <div>
        <UButton
          icon="i-heroicons-printer"
          label="In Hồ Sơ"
          color="primary"
          variant="soft"
          class="print:hidden font-bold"
          @click="printDossier"
        />
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="pending"
      class="flex justify-center py-16"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 animate-spin text-primary-400"
      />
    </div>

    <!-- Content -->
    <div
      v-else-if="student"
      class="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      <!-- Cột Trái: Thông tin cơ bản -->
      <div class="lg:col-span-1 space-y-6">
        <UCard class="glass-card text-center relative overflow-hidden">
          <div class="absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-primary-500 to-marian-blue-500 opacity-20" />
          <div class="relative pt-6">
            <UAvatar
              :src="student.photoUrl"
              :alt="student.fullName"
              size="3xl"
              class="w-24 h-24 shadow-md ring-4 ring-white dark:ring-stone-800 mx-auto bg-stone-200"
            />
            <h2 class="mt-4 font-black text-xl text-stone-800 dark:text-white">
              {{ student.fullName }}
            </h2>
            <p class="text-sm font-bold text-stone-500 uppercase">
              {{ student.holyName }}
            </p>
            <div class="flex gap-2 justify-center mt-3">
              <UBadge :color="getBranchColor(student.branch)" class="font-semibold">
                {{ getBranchName(student.branch) }}
              </UBadge>
              <UBadge v-if="student.className" color="primary" variant="subtle" class="font-semibold">
                Lớp: {{ student.className }}
              </UBadge>
            </div>
          </div>
        </UCard>

        <!-- Thống kê nhỏ bên trái -->
        <div class="grid grid-cols-2 gap-4">
          <UCard class="glass-card flex flex-col items-center justify-center text-center p-4">
            <UIcon name="i-heroicons-calendar" class="w-6 h-6 text-stone-400 mb-1" />
            <span class="text-xs text-stone-500 font-medium">Năm sinh</span>
            <strong class="text-lg text-stone-800 dark:text-stone-200">{{ student.birthDate ? new Date(student.birthDate).getFullYear() : 'N/A' }}</strong>
          </UCard>
          <UCard class="glass-card flex flex-col items-center justify-center text-center p-4">
            <UIcon name="i-heroicons-heart" class="w-6 h-6 text-red-400 mb-1" />
            <span class="text-xs text-stone-500 font-medium">Nhóm Máu</span>
            <strong class="text-lg text-stone-800 dark:text-stone-200">{{ student.bloodType || 'N/A' }}</strong>
          </UCard>
        </div>
      </div>

      <!-- Cột Phải: Tabs Chi tiết -->
      <div class="lg:col-span-2 space-y-6">
        <UCard class="glass-card h-full">
          <UTabs :items="profileTabs" class="w-full">
            <template #general>
              <div class="space-y-6 mt-4">
                <div class="grid grid-cols-2 gap-6">
                  <div>
                    <p class="text-stone-400 text-xs mb-1">Khu/Xóm</p>
                    <p class="font-medium">{{ student.area || 'Chưa cập nhật' }}</p>
                  </div>
                  <div>
                    <p class="text-stone-400 text-xs mb-1">Địa chỉ thường trú</p>
                    <p class="font-medium">{{ student.address || 'Chưa cập nhật' }}</p>
                  </div>
                </div>
                <hr class="border-stone-100 dark:border-stone-800">
                <div class="grid grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <h4 class="font-bold text-primary-600">Thông tin Cha</h4>
                    <div><p class="text-stone-400 text-xs mb-1">Họ Tên Cha</p><p class="font-medium">{{ student.fatherName || 'Chưa cập nhật' }}</p></div>
                    <div><p class="text-stone-400 text-xs mb-1">Nghề nghiệp</p><p class="font-medium">{{ student.fatherJob || 'Chưa cập nhật' }}</p></div>
                    <div><p class="text-stone-400 text-xs mb-1">Số điện thoại</p><p class="font-medium">{{ student.fatherPhone || 'Chưa cập nhật' }}</p></div>
                    <div><p class="text-stone-400 text-xs mb-1">Tôn giáo</p><p class="font-medium">{{ student.fatherReligion || 'Chưa cập nhật' }}</p></div>
                  </div>
                  <div class="space-y-4">
                    <h4 class="font-bold text-pink-600">Thông tin Mẹ</h4>
                    <div><p class="text-stone-400 text-xs mb-1">Họ Tên Mẹ</p><p class="font-medium">{{ student.motherName || 'Chưa cập nhật' }}</p></div>
                    <div><p class="text-stone-400 text-xs mb-1">Nghề nghiệp</p><p class="font-medium">{{ student.motherJob || 'Chưa cập nhật' }}</p></div>
                    <div><p class="text-stone-400 text-xs mb-1">Số điện thoại</p><p class="font-medium">{{ student.motherPhone || 'Chưa cập nhật' }}</p></div>
                    <div><p class="text-stone-400 text-xs mb-1">Tôn giáo</p><p class="font-medium">{{ student.motherReligion || 'Chưa cập nhật' }}</p></div>
                  </div>
                </div>
              </div>
            </template>
            
            <template #sacraments>
              <div class="space-y-6 mt-4">
                <!-- Rửa Tội -->
                <div class="flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-blue-100 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-800/50">
                  <div class="flex-shrink-0 w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">R</div>
                  <div class="flex-1 grid grid-cols-2 gap-4">
                    <div><p class="text-stone-400 text-xs">Trạng thái</p><p class="font-bold text-blue-600">{{ student.baptismDate ? 'Đã nhận' : 'Chưa nhận' }}</p></div>
                    <div><p class="text-stone-400 text-xs">Ngày nhận</p><p class="font-medium">{{ formatDate(student.baptismDate) || '-' }}</p></div>
                    <div><p class="text-stone-400 text-xs">Nơi rửa tội</p><p class="font-medium">{{ student.baptismPlace || '-' }}</p></div>
                    <div><p class="text-stone-400 text-xs">Người đỡ đầu</p><p class="font-medium">{{ student.baptismGodparent || '-' }}</p></div>
                    <div class="col-span-2"><p class="text-stone-400 text-xs">Linh mục chủ sự</p><p class="font-medium">{{ student.baptismPriest || '-' }}</p></div>
                  </div>
                </div>
                <!-- Rước Lễ -->
                <div class="flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-amber-100 bg-amber-50/50 dark:bg-amber-900/10 dark:border-amber-800/50">
                  <div class="flex-shrink-0 w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold text-xl">L</div>
                  <div class="flex-1 grid grid-cols-2 gap-4">
                    <div><p class="text-stone-400 text-xs">Trạng thái</p><p class="font-bold text-amber-600">{{ student.communionDate ? 'Đã nhận' : 'Chưa nhận' }}</p></div>
                    <div><p class="text-stone-400 text-xs">Ngày nhận</p><p class="font-medium">{{ formatDate(student.communionDate) || '-' }}</p></div>
                    <div><p class="text-stone-400 text-xs">Nơi rước lễ</p><p class="font-medium">{{ student.communionPlace || '-' }}</p></div>
                    <div class="col-span-2"><p class="text-stone-400 text-xs">Linh mục chủ sự</p><p class="font-medium">{{ student.communionPriest || '-' }}</p></div>
                  </div>
                </div>
                <!-- Thêm Sức -->
                <div class="flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-red-100 bg-red-50/50 dark:bg-red-900/10 dark:border-red-800/50">
                  <div class="flex-shrink-0 w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-xl">S</div>
                  <div class="flex-1 grid grid-cols-2 gap-4">
                    <div><p class="text-stone-400 text-xs">Trạng thái</p><p class="font-bold text-red-600">{{ student.confirmationDate ? 'Đã nhận' : 'Chưa nhận' }}</p></div>
                    <div><p class="text-stone-400 text-xs">Ngày nhận</p><p class="font-medium">{{ formatDate(student.confirmationDate) || '-' }}</p></div>
                    <div><p class="text-stone-400 text-xs">Nơi thêm sức</p><p class="font-medium">{{ student.confirmationPlace || '-' }}</p></div>
                    <div><p class="text-stone-400 text-xs">Người đỡ đầu</p><p class="font-medium">{{ student.confirmationGodparent || '-' }}</p></div>
                    <div class="col-span-2"><p class="text-stone-400 text-xs">Giám mục chủ sự</p><p class="font-medium">{{ student.confirmationBishop || '-' }}</p></div>
                  </div>
                </div>
              </div>
            </template>
            
            <template #medical>
              <div class="space-y-6 mt-4">
                <div class="grid grid-cols-2 gap-6">
                  <UCard class="bg-red-50/30 border-red-100 dark:bg-red-900/10 dark:border-red-800">
                    <h4 class="font-bold text-red-600 flex items-center gap-2 mb-2"><UIcon name="i-heroicons-heart" /> Nhóm máu</h4>
                    <p class="text-xl font-black text-stone-800 dark:text-white">{{ student.bloodType || 'Chưa cập nhật' }}</p>
                  </UCard>
                  <UCard class="bg-amber-50/30 border-amber-100 dark:bg-amber-900/10 dark:border-amber-800">
                    <h4 class="font-bold text-amber-600 flex items-center gap-2 mb-2"><UIcon name="i-heroicons-exclamation-triangle" /> Dị ứng / Bệnh lý</h4>
                    <p class="font-medium text-stone-800 dark:text-white">{{ student.allergies || 'Không có' }}</p>
                  </UCard>
                </div>
                <div class="mt-4">
                  <p class="text-stone-400 text-xs mb-1">Ghi chú sức khỏe hoặc tâm lý chung</p>
                  <p class="font-medium bg-stone-50 dark:bg-stone-900 p-4 rounded-lg italic">{{ student.notes || 'Không có ghi chú' }}</p>
                </div>
              </div>
            </template>
          </UTabs>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin', middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const toast = useToast()
const studentId = route.params.id

// Fix: Gọi trực tiếp API /Student/{id} thay vì fetch toàn bộ list rồi .find()
const { data: student, pending, error } = await useApiFetch(`/Student/${studentId}`)

// Xử lý 404: nếu không tìm thấy học sinh, redirect về danh sách
watch(error, (err) => {
  if (err?.statusCode === 404 || err?.status === 404) {
    toast.add({ title: 'Không tìm thấy đoàn sinh', description: 'Hồ sơ này không tồn tại hoặc đã bị xóa.', color: 'error' })
    router.push('/admin/students')
  }
})

useHead({ title: computed(() => `Hồ Sơ: ${student.value?.fullName || 'Đang tải...'} - GiaoLy Admin`) })

const getBranchName = b => ({ 1: 'Chiên con', 2: 'Ấu nhi', 3: 'Thiếu nhi', 4: 'Nghĩa sĩ' }[b] || 'Khác')
const getBranchColor = b => ({ 1: 'pink', 2: 'green', 3: 'blue', 4: 'amber' }[b] || 'neutral')
const formatDate = d => d ? new Date(d).toLocaleDateString('vi-VN') : ''

const profileTabs = [
  { label: 'Tổng quan', icon: 'i-heroicons-user', slot: 'general' },
  { label: 'Bí tích', icon: 'i-heroicons-sparkles', slot: 'sacraments' },
  { label: 'Y tế & Sức khỏe', icon: 'i-heroicons-heart', slot: 'medical' }
]

const printDossier = () => {
  window.print()
}
</script>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-28"></a>📄 [28/71] File: `web-admin/pages/admin/users.vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Admin Pages (Quản trị) | **Số dòng:** 578 | **Kích thước:** 23.3 KB

```markup
<template>
  <div class="min-h-screen bg-stone-50/50 dark:bg-stone-950/50 font-sans relative pb-24">
    <!-- ═══════════════════════════════════════════════════════
         BACKGROUND MESH GRADIENT
    ═══════════════════════════════════════════════════════ -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div class="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-30 dark:opacity-10 animate-blob bg-blue-100 dark:bg-blue-900"></div>
      <div class="absolute top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-30 dark:opacity-10 animate-blob animation-delay-2000 bg-emerald-100 dark:bg-emerald-900"></div>
      <div class="absolute -bottom-[20%] right-[20%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-4000 bg-amber-100 dark:bg-amber-900"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
    </div>

    <UContainer class="relative z-10 py-10 space-y-8 animate-fade-in-up">
      <!-- ═══════════════════════════════════════════════════════
           PAGE HEADER
      ═══════════════════════════════════════════════════════ -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div class="inline-flex items-center gap-2 px-4 py-1.5 mb-3 rounded-full bg-white/60 dark:bg-stone-900/40 backdrop-blur-md border border-white/40 dark:border-stone-700/50 shadow-sm text-xs font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest">
            <UIcon name="i-heroicons-shield-check" class="w-4 h-4" />
            <span>Phân hệ Quản trị</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-stone-900 dark:text-white flex items-center gap-3 drop-shadow-sm uppercase tracking-tight">
            Quản Lý <span class="text-primary-500">Tài Khoản</span>
          </h1>
          <p class="text-stone-500 text-sm mt-2 font-serif italic">
            Kiểm soát quyền truy cập và phân bổ nhân sự cho các Chi Đoàn.
          </p>
        </div>
        
        <div class="shrink-0 flex gap-3">
          <UButton
            icon="i-heroicons-user-plus"
            label="Thêm Tài Khoản"
            color="primary"
            variant="solid"
            size="lg"
            class="rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 bg-gradient-to-r from-primary-600 to-primary-500 hover:-translate-y-0.5 transition-transform"
            @click="openCreateModal"
          />
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════
           QUICK STATS CARDS
      ═══════════════════════════════════════════════════════ -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up delay-100">
        <!-- Tổng Tài Khoản -->
        <UCard class="bg-white/60 dark:bg-stone-900/60 backdrop-blur-2xl border border-white/50 dark:border-stone-800 rounded-[2rem] shadow-xl shadow-black/5" :ui="{ body: { padding: 'p-6' } }">
          <div class="flex items-center gap-4">
            <div class="p-4 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl shadow-inner">
              <UIcon name="i-heroicons-users" class="w-8 h-8" />
            </div>
            <div>
              <p class="text-stone-500 dark:text-stone-400 text-sm font-bold uppercase tracking-widest">Tổng Tài Khoản</p>
              <h2 class="text-3xl font-black text-stone-800 dark:text-white mt-1">{{ totalUsers }}</h2>
            </div>
          </div>
        </UCard>
        
        <!-- Tổng Admin -->
        <UCard class="bg-white/60 dark:bg-stone-900/60 backdrop-blur-2xl border border-white/50 dark:border-stone-800 rounded-[2rem] shadow-xl shadow-black/5" :ui="{ body: { padding: 'p-6' } }">
          <div class="flex items-center gap-4">
            <div class="p-4 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl shadow-inner">
              <UIcon name="i-heroicons-key" class="w-8 h-8" />
            </div>
            <div>
              <p class="text-stone-500 dark:text-stone-400 text-sm font-bold uppercase tracking-widest">Ban Quản Trị</p>
              <h2 class="text-3xl font-black text-stone-800 dark:text-white mt-1">{{ totalAdmins }}</h2>
            </div>
          </div>
        </UCard>
        
        <!-- Giáo Lý Viên -->
        <UCard class="bg-white/60 dark:bg-stone-900/60 backdrop-blur-2xl border border-white/50 dark:border-stone-800 rounded-[2rem] shadow-xl shadow-black/5" :ui="{ body: { padding: 'p-6' } }">
          <div class="flex items-center gap-4">
            <div class="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl shadow-inner">
              <UIcon name="i-heroicons-academic-cap" class="w-8 h-8" />
            </div>
            <div>
              <p class="text-stone-500 dark:text-stone-400 text-sm font-bold uppercase tracking-widest">Giáo Lý Viên</p>
              <h2 class="text-3xl font-black text-stone-800 dark:text-white mt-1">{{ totalTeachers }}</h2>
            </div>
          </div>
        </UCard>
      </div>

      <!-- ═══════════════════════════════════════════════════════
           PREMIUM GLASS TABLE
      ═══════════════════════════════════════════════════════ -->
      <UCard 
        class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-3xl shadow-2xl shadow-black/5 dark:shadow-black/40 border border-white/50 dark:border-stone-800 rounded-[2.5rem] overflow-hidden animate-fade-in-up delay-200"
        :ui="{ body: { padding: 'p-0', base: 'overflow-x-auto' } }"
      >
        <UTable
          :rows="users"
          :columns="columns"
          :loading="pending"
          :empty-state="{ icon: 'i-heroicons-users', header: 'Chưa có dữ liệu tài khoản' }"
          :ui="{ 
            th: { base: 'bg-stone-100/50 dark:bg-stone-900/50 font-black uppercase tracking-widest text-[10px] text-stone-500 py-5 border-b border-white/40 dark:border-stone-800/50' },
            td: { base: 'whitespace-nowrap border-b border-stone-200/20 dark:border-stone-800/20 py-4' },
            tr: { base: 'hover:bg-white/50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer group' }
          }"
        >
          <!-- Cột User Info: Avatar + Indicator + Name -->
          <template #userInfo-cell="{ row }">
            <div class="flex items-center gap-4 pl-2">
              <div class="relative">
                <UAvatar
                  :alt="row.original.fullName || 'User'"
                  :ui="{ background: 'bg-primary-100 dark:bg-primary-900', text: 'text-primary-600 dark:text-primary-300 font-bold' }"
                  size="md"
                  class="shadow-sm border-2 border-white dark:border-stone-800"
                />
                <!-- Active Indicator Pip -->
                <span class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-stone-800 rounded-full shadow-sm"></span>
              </div>
              <div class="block py-1">
                <p class="font-black text-stone-800 dark:text-white text-base leading-none mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {{ row.original.fullName }}
                </p>
                <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  <span v-if="row.original.holyName">{{ row.original.holyName }}</span>
                  <span v-if="row.original.holyName">•</span>
                  <span class="text-stone-500">@{{ row.original.username }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- Cột Role (Vai Trò) -->
          <template #role-cell="{ row }">
            <UBadge
              :color="getRoleColor(row.original.role)"
              variant="subtle"
              size="sm"
              class="font-black uppercase tracking-widest px-3 rounded-xl shadow-inner"
            >
              {{ getRoleLabel(row.original.roleId, row.original.role) }}
            </UBadge>
          </template>

          <!-- Cột Branch (Ngành Phụ Trách) -->
          <template #branch-cell="{ row }">
            <UBadge
              :color="getBranchColor(row.original.branch)"
              variant="soft"
              size="sm"
              class="font-black uppercase tracking-widest px-3 rounded-xl"
            >
              {{ getBranchName(row.original.branch) }}
            </UBadge>
          </template>

          <!-- Cột Created At -->
          <template #createdAt-cell="{ row }">
            <span class="text-sm font-semibold text-stone-500 dark:text-stone-400">
              {{ formatDate(row.original.createdAt) }}
            </span>
          </template>

          <!-- Cột Actions Menu (3 chấm) -->
          <template #actions-cell="{ row }">
            <div class="flex justify-end pr-2">
              <UDropdown :items="getActionItems(row.original)" :popper="{ placement: 'bottom-end' }">
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-heroicons-ellipsis-horizontal"
                  size="md"
                  class="rounded-xl opacity-50 group-hover:opacity-100 transition-opacity bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700"
                />
              </UDropdown>
            </div>
          </template>
        </UTable>
        
        <!-- Footer / Pagination Area -->
        <div class="flex justify-between items-center px-6 py-4 border-t border-white/30 dark:border-stone-800/50 bg-stone-100/30 dark:bg-stone-900/30 backdrop-blur-md">
          <span class="text-sm font-bold text-stone-500">
            Hiển thị <b class="text-primary-600 dark:text-primary-400 text-lg mx-1">{{ users.length }}</b> tài khoản
          </span>
        </div>
      </UCard>
    </UContainer>

    <!-- ═══════════════════════════════════════════════════════
         CREATE / EDIT USER MODAL
    ═══════════════════════════════════════════════════════ -->
    <UModal
      v-model:open="isModalOpen"
      :ui="{ base: 'rounded-[2rem] overflow-hidden' }"
    >
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' }, footer: { padding: 'p-6 bg-stone-50 dark:bg-stone-900' } }">
        <!-- Modal Header -->
        <template #header>
          <div class="bg-primary-600 dark:bg-primary-900 p-6 flex justify-between items-center text-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <UIcon :name="isEditing ? 'i-heroicons-pencil-square' : 'i-heroicons-user-plus'" class="w-6 h-6 text-white" />
              </div>
              <h3 class="text-xl font-black uppercase tracking-wide">
                {{ isEditing ? 'Cập Nhật Tài Khoản' : 'Thêm Tài Khoản Mới' }}
              </h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="white" variant="ghost" class="hover:bg-white/10 rounded-full" @click="isModalOpen = false" />
          </div>
        </template>

        <!-- Modal Body -->
        <form id="user-form" class="p-6 grid grid-cols-1 md:grid-cols-2 gap-8" @submit.prevent="handleSubmit">
          
          <!-- Cột 1: Thông tin hệ thống -->
          <div class="space-y-5">
            <div class="flex items-center gap-2 mb-2 border-b border-stone-200 dark:border-stone-800 pb-2">
              <UIcon name="i-heroicons-server-stack" class="w-5 h-5 text-stone-400" />
              <h4 class="font-bold text-stone-800 dark:text-stone-200 uppercase tracking-widest text-xs">Hệ Thống</h4>
            </div>
            
            <UFormField label="Tên đăng nhập" required>
              <UInput
                v-model="userForm.username"
                icon="i-heroicons-at-symbol"
                placeholder="nguyenvana"
                :disabled="isEditing"
                size="lg"
                class="w-full"
                :ui="{ base: 'rounded-xl' }"
              />
            </UFormField>
            
            <UFormField
              :label="isEditing ? 'Mật khẩu mới (Để trống nếu giữ nguyên)' : 'Mật khẩu'"
              :required="!isEditing"
            >
              <UInput
                v-model="userForm.password"
                type="password"
                icon="i-heroicons-key"
                placeholder="••••••••"
                size="lg"
                class="w-full"
                :ui="{ base: 'rounded-xl' }"
              />
            </UFormField>
            
            <UFormField label="Quyền hạn / Chức vụ">
              <USelectMenu
                v-model="userForm.roleId"
                :options="roleOptions"
                value-attribute="value"
                option-attribute="label"
                icon="i-heroicons-shield-check"
                placeholder="Chọn quyền..."
                size="lg"
                class="w-full"
                :ui="{ base: 'rounded-xl' }"
              />
            </UFormField>
          </div>

          <!-- Cột 2: Thông tin cá nhân -->
          <div class="space-y-5">
            <div class="flex items-center gap-2 mb-2 border-b border-stone-200 dark:border-stone-800 pb-2">
              <UIcon name="i-heroicons-identification" class="w-5 h-5 text-stone-400" />
              <h4 class="font-bold text-stone-800 dark:text-stone-200 uppercase tracking-widest text-xs">Cá Nhân</h4>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <UFormField label="Tên Thánh" class="col-span-1">
                <UInput
                  v-model="userForm.holyName"
                  placeholder="Giuse..."
                  size="lg"
                  class="w-full"
                  :ui="{ base: 'rounded-xl' }"
                />
              </UFormField>
              <UFormField label="Họ và tên" required class="col-span-2">
                <UInput
                  v-model="userForm.fullName"
                  placeholder="Nguyễn Văn A"
                  size="lg"
                  class="w-full"
                  :ui="{ base: 'rounded-xl' }"
                />
              </UFormField>
            </div>

            <UFormField label="Ngành Phụ Trách">
              <USelectMenu
                v-model="userForm.branch"
                :options="branchOptions"
                value-attribute="value"
                option-attribute="label"
                icon="i-heroicons-flag"
                placeholder="Chọn ngành..."
                size="lg"
                class="w-full"
                :ui="{ base: 'rounded-xl' }"
              />
            </UFormField>
          </div>
        </form>

        <!-- Modal Footer -->
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton
              label="Hủy bỏ"
              color="neutral"
              variant="soft"
              size="lg"
              class="rounded-xl font-bold"
              @click="isModalOpen = false"
            />
            <UButton
              type="submit"
              form="user-form"
              :label="isEditing ? 'Lưu Cập Nhật' : 'Hoàn Tất Tạo'"
              color="primary"
              variant="solid"
              size="lg"
              class="rounded-xl font-black uppercase tracking-wider"
              :loading="isSubmitting"
            />
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Quản Lý Tài Khoản - GiaoLy' })

const authStore = useAuthStore()
const toast = useToast()

// Redirection safeguard if not Admin or doesn't have users.view permission
onMounted(() => {
  if (!authStore.hasPermission('users.view')) {
    toast.add({ title: 'Từ chối truy cập', description: 'Bạn không có quyền quản lý tài khoản.', color: 'error' })
    navigateTo('/admin/dashboard')
  }
})

// Columns for DataGrid
const columns = [
  { accessorKey: 'userInfo', header: 'Người Dùng' },
  { accessorKey: 'role', header: 'Vai Trò / Quyền' },
  { accessorKey: 'branch', header: 'Ngành Phụ Trách' },
  { accessorKey: 'createdAt', header: 'Ngày Tạo' },
  { accessorKey: 'actions', header: '' }
]

// Modal & Forms
const isModalOpen = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const currentUserId = ref(null)

const userForm = reactive({
  username: '',
  fullName: '',
  holyName: '',
  role: 'Viewer',
  roleId: null,
  branch: '0',
  password: ''
})

const roleOptions = ref([])

const fetchRoles = async () => {
  try {
    const data = await $api('/roles')
    roleOptions.value = data.map(r => ({ value: r.id, label: r.name, code: r.code }))
  } catch (e) {
    console.error('Error fetching roles', e)
  }
}

onMounted(() => {
  fetchRoles()
})

const branchOptions = [
  { value: '0', label: 'Tất cả (Chung)' },
  { value: '1', label: 'Ấu Nhi' },
  { value: '2', label: 'Thiếu Nhi' },
  { value: '3', label: 'Nghĩa Sĩ' },
  { value: '4', label: 'Hiệp Sĩ' }
]

// Fetch Users Data
const { data: users, pending, refresh } = await useApiFetch('/User', {
  default: () => []
})

// Quick Stats Computed properties
const totalUsers = computed(() => users.value.length || 0)
const totalAdmins = computed(() => users.value.filter(u => getRoleLabel(u.roleId, u.role).toLowerCase().includes('admin') || String(u.role) === '1').length || 0)
const totalTeachers = computed(() => users.value.filter(u => !getRoleLabel(u.roleId, u.role).toLowerCase().includes('admin') && String(u.role) !== '1').length || 0)

// Helpers
const getRoleLabel = (roleId, roleCode) => {
  const roleOpt = roleOptions.value.find(r => r.value === roleId || r.code === roleCode)
  if (roleOpt) return roleOpt.label

  const labels = {
    1: 'Admin',
    2: 'Thư ký',
    3: 'Mod',
    Viewer: 'Giáo Lý Viên'
  }
  return labels[roleCode] || roleCode
}

const getRoleColor = (role) => {
  const colors = {
    1: 'error',
    2: 'primary',
    3: 'warning',
    Viewer: 'neutral'
  }
  return colors[role] || 'neutral'
}

const getBranchName = (b) => {
  const names = { 0: 'Chi Đoàn Chung', 1: 'Ấu Nhi', 2: 'Thiếu Nhi', 3: 'Nghĩa Sĩ', 4: 'Hiệp Sĩ' }
  return names[b] || 'Chi Đoàn Chung'
}

// TNTT official colors mapping
const getBranchColor = (b) => {
  const colors = { 0: 'neutral', 1: 'green', 2: 'blue', 3: 'yellow', 4: 'error' } // error is red
  return colors[b] || 'neutral'
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// Action Menus for UDropdown
const getActionItems = (row) => [
  [
    {
      label: 'Chỉnh sửa tài khoản',
      icon: 'i-heroicons-pencil-square',
      click: () => openEditModal(row)
    }
  ],
  ...(row.username !== 'admin' ? [[
    {
      label: 'Xóa tài khoản',
      icon: 'i-heroicons-trash',
      color: 'red',
      click: () => deleteUser(row.id)
    }
  ]] : [])
]

const openCreateModal = () => {
  isEditing.value = false
  currentUserId.value = null
  Object.assign(userForm, {
    username: '',
    fullName: '',
    holyName: '',
    role: 'Viewer',
    roleId: null,
    branch: '0',
    password: ''
  })
  isModalOpen.value = true
}

const openEditModal = (user) => {
  isEditing.value = true
  currentUserId.value = user.id
  Object.assign(userForm, {
    username: user.username,
    fullName: user.fullName,
    holyName: user.holyName || '',
    role: user.role,
    roleId: user.roleId || user.role, // Tương thích ngược nếu roleId null thì lấy role cũ tạm
    branch: String(user.branch || 0),
    password: ''
  })
  isModalOpen.value = true
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const payload = {
      fullName: userForm.fullName,
      holyName: userForm.holyName,
      role: 'Viewer', // Backend sẽ tự resolve bằng RoleId
      roleId: userForm.roleId,
      branch: parseInt(userForm.branch),
      password: userForm.password || undefined
    }

    if (isEditing.value) {
      await $api(`/User/${currentUserId.value}`, {
        method: 'PUT',
        body: payload
      })
      toast.add({ title: 'Cập nhật thành công!', color: 'success' })
    } else {
      await $api('/User', {
        method: 'POST',
        body: {
          username: userForm.username,
          fullName: userForm.fullName,
          holyName: userForm.holyName,
          role: 'Viewer',
          roleId: userForm.roleId,
          branch: parseInt(userForm.branch),
          password: userForm.password
        }
      })
      toast.add({ title: 'Tạo tài khoản thành công!', color: 'success' })
    }
    isModalOpen.value = false
    await refresh()
  } catch (error) {
    toast.add({ title: 'Lỗi xử lý', description: error.data?.message || 'Vui lòng kiểm tra lại.', color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

const deleteUser = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn xóa tài khoản này? Hành động không thể hoàn tác!')) return
  try {
    await $api(`/User/${id}`, { method: 'DELETE' })
    toast.add({ title: 'Đã xóa tài khoản', color: 'success' })
    await refresh()
  } catch (error) {
    toast.add({ title: 'Lỗi khi xóa', description: error.data?.message, color: 'error' })
  }
}
</script>

<style>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 10s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-29"></a>📄 [29/71] File: `web-admin/pages/catechist/camps.vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Catechist Pages (Giáo lý viên) | **Số dòng:** 25 | **Kích thước:** 0.9 KB

```markup
<template>
  <div class="max-w-6xl mx-auto p-4 md:p-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold font-serif text-marian-blue-900 dark:text-white">Quản Lý Hội Trại</h1>
        <p class="text-stone-600 dark:text-stone-400 mt-2">Theo dõi đăng ký, thu phí và phân đội cho các kỳ Sa mạc.</p>
      </div>
      <UButton icon="i-lucide-arrow-left" variant="soft" color="gray" to="/catechist">Trở về</UButton>
    </div>

    <UCard class="bg-white/80 dark:bg-stone-900">
      <div class="p-8 text-center text-stone-500">
        <UIcon name="i-lucide-tent" class="w-12 h-12 mx-auto mb-4 text-stone-300" />
        <p>Giao diện danh sách Hội trại đang được tích hợp...</p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-30"></a>📄 [30/71] File: `web-admin/pages/catechist/duty-roster.vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Catechist Pages (Giáo lý viên) | **Số dòng:** 25 | **Kích thước:** 0.9 KB

```markup
<template>
  <div class="max-w-6xl mx-auto p-4 md:p-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold font-serif text-marian-blue-900 dark:text-white">Phân Công Phụng Vụ</h1>
        <p class="text-stone-600 dark:text-stone-400 mt-2">Lên lịch phân công nhiệm vụ cho các Huynh trưởng.</p>
      </div>
      <UButton icon="i-lucide-arrow-left" variant="soft" color="gray" to="/catechist">Trở về</UButton>
    </div>

    <UCard class="bg-white/80 dark:bg-stone-900">
      <div class="p-8 text-center text-stone-500">
        <UIcon name="i-lucide-calendar-clock" class="w-12 h-12 mx-auto mb-4 text-stone-300" />
        <p>Bảng phân công nhiệm vụ đang được tích hợp...</p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-31"></a>📄 [31/71] File: `web-admin/pages/catechist/index.vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Catechist Pages (Giáo lý viên) | **Số dòng:** 72 | **Kích thước:** 2.3 KB

```markup
<template>
  <div class="max-w-6xl mx-auto p-4 md:p-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold font-serif text-marian-blue-900 dark:text-white">Góc Giáo Lý Viên</h1>
      <p class="text-stone-600 dark:text-stone-400 mt-2">Công cụ quản lý nội bộ dành riêng cho Giáo Lý Viên và Huynh Trưởng.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard 
        v-for="tool in tools" 
        :key="tool.title"
        class="hover-lift cursor-pointer bg-white/80 dark:bg-stone-900 border-none shadow-md"
        @click="navigateTo(tool.link)"
      >
        <div class="flex items-start space-x-4">
          <div :class="['p-3 rounded-md', tool.bgColor]">
            <UIcon :name="tool.icon" class="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 class="font-semibold text-lg text-marian-blue-800 dark:text-stone-200">{{ tool.title }}</h3>
            <p class="text-sm text-stone-500 mt-1 line-clamp-2">{{ tool.desc }}</p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const tools = [
  {
    title: 'Sổ Hoa Thiêng',
    desc: 'Chấm điểm thi đua, viếng Chúa, làm việc thiện cho các em.',
    icon: 'i-lucide-flower-2',
    link: '/catechist/spiritual-bouquets',
    bgColor: 'bg-rose-500'
  },
  {
    title: 'Tiến Trình Bí Tích',
    desc: 'Theo dõi điều kiện Rước Lễ, Thêm Sức (Giấy tờ, Tĩnh tâm).',
    icon: 'i-lucide-scroll',
    link: '/catechist/sacraments',
    bgColor: 'bg-marian-blue-500'
  },
  {
    title: 'Thư Viện Giáo Án',
    desc: 'Soạn thảo và chia sẻ giáo án điện tử giữa các lớp.',
    icon: 'i-lucide-book-open',
    link: '/catechist/lesson-plans',
    bgColor: 'bg-vatican-gold-600'
  },
  {
    title: 'Phân Công Phụng Vụ',
    desc: 'Lên lịch trực, phân công giảng dạy cho Huynh trưởng.',
    icon: 'i-lucide-calendar-clock',
    link: '/catechist/duty-roster',
    bgColor: 'bg-emerald-600'
  },
  {
    title: 'Quản Lý Hội Trại',
    desc: 'Danh sách đi Sa mạc, đóng phí, chia đội nhóm.',
    icon: 'i-lucide-tent',
    link: '/catechist/camps',
    bgColor: 'bg-orange-500'
  }
]
</script>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-32"></a>📄 [32/71] File: `web-admin/pages/catechist/lesson-plans.vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Catechist Pages (Giáo lý viên) | **Số dòng:** 25 | **Kích thước:** 0.9 KB

```markup
<template>
  <div class="max-w-6xl mx-auto p-4 md:p-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold font-serif text-marian-blue-900 dark:text-white">Thư Viện Giáo Án</h1>
        <p class="text-stone-600 dark:text-stone-400 mt-2">Soạn thảo, quản lý và chia sẻ giáo án điện tử.</p>
      </div>
      <UButton icon="i-lucide-arrow-left" variant="soft" color="gray" to="/catechist">Trở về</UButton>
    </div>

    <UCard class="bg-white/80 dark:bg-stone-900">
      <div class="p-8 text-center text-stone-500">
        <UIcon name="i-lucide-book-open" class="w-12 h-12 mx-auto mb-4 text-stone-300" />
        <p>Giao diện soạn thảo giáo án (Rich Text Editor) đang được xây dựng...</p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-33"></a>📄 [33/71] File: `web-admin/pages/catechist/sacraments.vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Catechist Pages (Giáo lý viên) | **Số dòng:** 25 | **Kích thước:** 0.9 KB

```markup
<template>
  <div class="max-w-6xl mx-auto p-4 md:p-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold font-serif text-marian-blue-900 dark:text-white">Tiến Trình Bí Tích</h1>
        <p class="text-stone-600 dark:text-stone-400 mt-2">Theo dõi tiến độ nhận Bí Tích của các em học sinh.</p>
      </div>
      <UButton icon="i-lucide-arrow-left" variant="soft" color="gray" to="/catechist">Trở về</UButton>
    </div>

    <UCard class="bg-white/80 dark:bg-stone-900">
      <div class="p-8 text-center text-stone-500">
        <UIcon name="i-lucide-scroll" class="w-12 h-12 mx-auto mb-4 text-stone-300" />
        <p>Giao diện theo dõi điều kiện Bí tích đang được tích hợp...</p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-34"></a>📄 [34/71] File: `web-admin/pages/catechist/spiritual-bouquets.vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Catechist Pages (Giáo lý viên) | **Số dòng:** 25 | **Kích thước:** 0.9 KB

```markup
<template>
  <div class="max-w-6xl mx-auto p-4 md:p-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold font-serif text-marian-blue-900 dark:text-white">Sổ Hoa Thiêng</h1>
        <p class="text-stone-600 dark:text-stone-400 mt-2">Đánh giá đạo đức và chấm điểm thi đua cho lớp.</p>
      </div>
      <UButton icon="i-lucide-arrow-left" variant="soft" color="gray" to="/catechist">Trở về</UButton>
    </div>

    <UCard class="bg-white/80 dark:bg-stone-900">
      <div class="p-8 text-center text-stone-500">
        <UIcon name="i-lucide-flower-2" class="w-12 h-12 mx-auto mb-4 text-stone-300" />
        <p>Đang xây dựng giao diện chấm điểm cho từng học sinh...</p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-35"></a>📄 [35/71] File: `web-admin/pages/index.vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Portal Pages (Cổng công chúng) | **Số dòng:** 14 | **Kích thước:** 0.2 KB

```markup
<template>
  <div>Redirecting...</div>
</template>

<script setup>
definePageMeta({
  middleware: [
    function (to, from) {
      return navigateTo('/login')
    }
  ]
})
</script>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-36"></a>📄 [36/71] File: `web-admin/pages/login.vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Portal Pages (Cổng công chúng) | **Số dòng:** 208 | **Kích thước:** 8.8 KB

```markup
<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- ══════════════════════════════════════════════════════════
       TRANG ĐĂNG NHẬP - Sacred Admin
       Split layout: Trái = Hình ảnh/Branding, Phải = Form
       ══════════════════════════════════════════════════════════ -->
  <div class="min-h-screen flex flex-col md:flex-row bg-ivory-100 dark:bg-stone-900">

    <!-- ─── NỬA TRÁI: Branding tôn giáo ──────────────────────── -->
    <div class="hidden md:flex md:w-1/2 lg:w-3/5 relative bg-marian-blue-950 overflow-hidden items-center justify-center">

      <!-- Hình nền nhà thờ -->
      <img
        src="https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=2000&auto=format&fit=crop"
        class="absolute inset-0 w-full h-full object-cover opacity-25 blur-[2px] transition-all duration-1000"
        alt="Church Interior"
      >

      <!-- Overlay gradient -->
      <div class="absolute inset-0 bg-gradient-to-tr from-marian-blue-950/95 via-marian-blue-900/70 to-marian-blue-800/40" />

      <!-- Trang trí hình học -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div class="absolute bottom-0 left-0 w-72 h-72 bg-marian-blue-600/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

      <!-- Nội dung branding -->
      <div class="relative z-10 p-12 text-center animate-fade-in-up max-w-lg">
        <!-- Icon thánh giá -->
        <div class="w-20 h-20 mx-auto mb-8 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center backdrop-blur-sm">
          <UIcon name="i-heroicons-sparkles" class="w-10 h-10 text-amber-400 drop-shadow-lg" />
        </div>

        <!-- Tiêu đề chính -->
        <h1 class="font-serif text-5xl lg:text-6xl font-black text-white leading-tight mb-6 drop-shadow-md">
          Ánh Sáng<br>
          <span class="text-gradient-gold">Tân Phúc Âm Hóa</span>
        </h1>

        <!-- Trích dẫn Kinh Thánh -->
        <p class="text-marian-blue-200 text-base italic max-w-md mx-auto drop-shadow-md leading-relaxed border-l-2 border-amber-400/50 pl-4 text-left">
          "Cứ để trẻ em đến với Thầy, đừng ngăn cấm chúng,
          vì Nước Thiên Chúa là của những ai giống như chúng."
        </p>
        <p class="text-amber-400/70 text-xs mt-3 text-right pr-4 font-semibold tracking-wider uppercase">— Mc 10, 14</p>

        <!-- Thống kê nhỏ -->
        <div class="flex justify-center gap-8 mt-10">
          <div class="text-center">
            <p class="text-2xl font-black text-white">TNTT</p>
            <p class="text-xs text-marian-blue-300 uppercase tracking-widest font-semibold">Thiếu Nhi</p>
          </div>
          <div class="w-px bg-white/10" />
          <div class="text-center">
            <p class="text-2xl font-black text-amber-400">GL</p>
            <p class="text-xs text-marian-blue-300 uppercase tracking-widest font-semibold">Giáo Lý</p>
          </div>
          <div class="w-px bg-white/10" />
          <div class="text-center">
            <p class="text-2xl font-black text-white">Admin</p>
            <p class="text-xs text-marian-blue-300 uppercase tracking-widest font-semibold">Quản Trị</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── NỬA PHẢI: Form đăng nhập ─────────────────────────── -->
    <div class="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-6 sm:p-10 lg:p-16 relative">

      <!-- Background nhẹ -->
      <div class="absolute inset-0 bg-gradient-to-br from-marian-blue-50/40 via-white to-ivory-100 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 -z-10" />

      <!-- Form container -->
      <div class="w-full max-w-sm animate-fade-in-up" style="animation-delay: 0.15s;">

        <!-- Logo + Tiêu đề -->
        <div class="text-center mb-10">
          <!-- Logo icon -->
          <NuxtLink
            to="/"
            class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-marian-blue-600 hover:bg-marian-blue-700 text-white mb-6 hover:scale-105 transition-all duration-200 shadow-lg shadow-marian-blue-500/30"
          >
            <UIcon name="i-heroicons-sparkles" class="w-7 h-7" />
          </NuxtLink>

          <!-- Tiêu đề -->
          <h2 class="text-3xl font-black text-stone-800 dark:text-white tracking-tight mb-2">
            Đăng Nhập
          </h2>
          <p class="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
            Cổng thông tin quản trị<br>
            <span class="font-semibold text-marian-blue-600 dark:text-marian-blue-400">Sứ đoàn Thiếu Nhi Thánh Thể</span>
          </p>
        </div>

        <!-- Form -->
        <form class="space-y-5" @submit.prevent="handleLogin">

          <!-- Tên đăng nhập -->
          <UFormField label="Tên đăng nhập" name="username">
            <div class="relative">
              <UInput
                v-model="form.username"
                icon="i-heroicons-user-circle"
                placeholder="Nhập tài khoản"
                size="xl"
                class="w-full"
                variant="outline"
                autofocus
                :ui="{
                  base: 'focus:ring-2 focus:ring-marian-blue-500 dark:focus:ring-marian-blue-400 transition-shadow rounded-xl border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800'
                }"
              />
            </div>
          </UFormField>

          <!-- Mật khẩu -->
          <UFormField label="Mật khẩu" name="password">
            <UInput
              v-model="form.password"
              type="password"
              icon="i-heroicons-lock-closed"
              placeholder="••••••••"
              size="xl"
              class="w-full"
              variant="outline"
              :ui="{
                base: 'focus:ring-2 focus:ring-marian-blue-500 dark:focus:ring-marian-blue-400 transition-shadow rounded-xl border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800'
              }"
            />
          </UFormField>

          <!-- Remember me + Quên mật khẩu -->
          <div class="flex items-center justify-between text-sm">
            <UCheckbox
              v-model="rememberMe"
              label="Ghi nhớ đăng nhập"
              :ui="{ label: 'text-stone-600 dark:text-stone-400 text-sm' }"
            />
            <a href="#" class="text-marian-blue-600 dark:text-marian-blue-400 hover:underline font-medium text-xs">
              Quên mật khẩu?
            </a>
          </div>

          <!-- Nút đăng nhập -->
          <UButton
            type="submit"
            block
            color="primary"
            size="xl"
            :loading="loading"
            class="mt-2 font-bold tracking-wide shadow-lg shadow-marian-blue-500/30 rounded-xl"
          >
            <template v-if="!loading">
              <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5 mr-2" />
              Vào Hệ Thống
            </template>
          </UButton>
        </form>

        <!-- Divider trang trí -->
        <div class="flex items-center gap-3 my-8">
          <div class="flex-1 h-px bg-stone-200 dark:bg-stone-700" />
          <span class="text-stone-300 dark:text-stone-600 text-xs">✛</span>
          <div class="flex-1 h-px bg-stone-200 dark:bg-stone-700" />
        </div>

        <!-- Footer -->
        <div class="text-center text-xs text-stone-400 space-y-1">
          <p class="font-semibold text-stone-500">GiaoLy Vision &copy; {{ new Date().getFullYear() }}</p>
          <p>Phần mềm quản lý Giáo Lý &amp; TNTT</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false }) // Tắt layout mặc định cho trang login

const auth = useAuthStore()
const toast = useToast()
const loading = ref(false)
const rememberMe = ref(false)
const form = reactive({ username: '', password: '' })
const config = useRuntimeConfig()

const handleLogin = async () => {
  loading.value = true
  try {
    const res = await $fetch(`${config.public.apiBase}/Auth/login`, {
      method: 'POST',
      body: form
    })
    auth.setAuth(res)
    navigateTo('/') // Đăng nhập xong về trang chủ
  } catch {
    toast.add({
      title: 'Đăng nhập thất bại',
      description: 'Sai tài khoản hoặc mật khẩu!',
      color: 'red',
      icon: 'i-heroicons-x-circle'
    })
  } finally {
    loading.value = false
  }
}
</script>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-37"></a>📄 [37/71] File: `web-admin/pages/profile/edit.vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Profile Pages (Hồ sơ) | **Số dòng:** 177 | **Kích thước:** 6.1 KB

```markup
<template>
  <div class="min-h-screen bg-stone-50 dark:bg-stone-950 py-12 transition-colors duration-300">
    <UContainer maxWidth="3xl">
      <!-- Back Button -->
      <div class="mb-6">
        <UButton
          to="/profile"
          icon="i-heroicons-arrow-left"
          color="gray"
          variant="ghost"
          label="Quay lại hồ sơ"
          class="hover:-translate-x-1 transition-transform"
        />
      </div>

      <!-- Edit Card -->
      <UCard class="bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl shadow-xl shadow-stone-200/50 dark:shadow-black/50 border border-white/50 dark:border-stone-700/50 rounded-2xl animate-fade-in-up">
        
        <template #header>
          <div class="flex items-center gap-4">
            <div class="p-3 bg-primary-100 dark:bg-primary-900/50 rounded-xl text-primary-600 dark:text-primary-400">
              <UIcon name="i-heroicons-pencil-square" class="w-8 h-8" />
            </div>
            <div>
              <h2 class="text-2xl font-black text-stone-900 dark:text-white tracking-tight">Cập Nhật Hồ Sơ</h2>
              <p class="text-sm text-stone-500 dark:text-stone-400 mt-0.5">Chỉnh sửa và bổ sung thông tin cá nhân của bạn.</p>
            </div>
          </div>
        </template>

        <UForm :state="editForm" class="space-y-8 py-2" @submit="submitEditProfile" @error="onFormError">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField label="Tên Thánh" name="christianName">
              <UInput v-model="editForm.christianName" placeholder="Ví dụ: Giuse" size="xl" color="primary" class="w-full" />
            </UFormField>
            
            <UFormField label="Họ và Tên" name="fullName" required>
              <UInput v-model="editForm.fullName" placeholder="Nhập họ và tên..." size="xl" color="primary" class="w-full" />
            </UFormField>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField label="Thư điện tử (Email)" name="email">
              <UInput v-model="editForm.email" type="email" placeholder="example@email.com" icon="i-heroicons-envelope" size="xl" color="primary" class="w-full" />
            </UFormField>
            
            <UFormField label="Số điện thoại" name="phoneNumber">
              <UInput v-model="editForm.phoneNumber" placeholder="09xxxxxxxx" icon="i-heroicons-phone" size="xl" color="primary" class="w-full" />
            </UFormField>
          </div>

          <UFormField label="Ngày sinh" name="dateOfBirth">
            <UInput v-model="editForm.dateOfBirth" type="date" icon="i-heroicons-calendar" size="xl" color="primary" class="w-full" />
          </UFormField>

          <UFormField label="Địa chỉ" name="address">
            <UInput v-model="editForm.address" placeholder="Nhập địa chỉ của bạn..." icon="i-heroicons-map-pin" size="xl" color="primary" class="w-full" />
          </UFormField>
          
          <UFormField label="Giới thiệu bản thân (Bio)" name="bio">
            <UTextarea v-model="editForm.bio" placeholder="Vài dòng giới thiệu..." :rows="4" size="xl" color="primary" class="w-full" />
          </UFormField>

          <div class="flex justify-end gap-4 pt-8 border-t border-stone-200 dark:border-stone-800">
            <UButton to="/profile" label="Hủy bỏ" color="gray" variant="soft" size="xl" class="px-6" />
            <UButton type="submit" label="Lưu thay đổi" color="primary" size="xl" icon="i-heroicons-check" :loading="isSavingProfile" class="shadow-md px-8 font-bold tracking-wide" />
          </div>

        </UForm>

      </UCard>
    </UContainer>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'public'
})

useHead({
  title: 'Cập Nhật Hồ Sơ - Thiếu Nhi Thánh Thể'
})

const authStore = useAuthStore()
const user = computed(() => authStore.user || {})
const toast = useToast()

const isSavingProfile = ref(false)
const editForm = ref({
  christianName: '',
  fullName: '',
  email: '',
  phoneNumber: '',
  dateOfBirth: '',
  address: '',
  bio: ''
})

onMounted(async () => {
  // Lấy dữ liệu profile mới nhất khi vào trang
  try {
    const res = await $api('/Profile/me')
    if (res) {
      authStore.updateProfile(res)
    }
  } catch (err) {
    console.error('Failed to fetch profile', err)
  }

  // Chuyển đổi dateOfBirth sang định dạng yyyy-mm-dd
  let dobString = ''
  if (user.value.dateOfBirth) {
    const d = new Date(user.value.dateOfBirth)
    if (!isNaN(d.getTime())) {
      dobString = d.toISOString().split('T')[0]
    }
  }

  editForm.value = {
    christianName: user.value.christianName || '',
    fullName: user.value.fullName || '',
    email: user.value.email || '',
    phoneNumber: user.value.phoneNumber || '',
    dateOfBirth: dobString,
    address: user.value.address || '',
    bio: user.value.bio || ''
  }
})

const submitEditProfile = async () => {
  isSavingProfile.value = true
  try {
    const payload = { ...editForm.value }
    if (!payload.dateOfBirth) {
      payload.dateOfBirth = null
    }

    const res = await $api('/Profile/update', {
      method: 'PUT',
      body: payload
    })
    
    authStore.updateProfile(res.user)
    toast.add({ title: 'Cập nhật hồ sơ thành công', color: 'success' })
    
    // Quay về trang profile sau khi lưu thành công
    navigateTo('/profile')
  } catch (error) {
    if (error?.response?._data?.errors) {
       toast.add({ title: 'Vui lòng kiểm tra lại thông tin nhập', color: 'error' })
    } else {
       toast.add({ title: error?.response?._data || 'Có lỗi xảy ra', color: 'error' })
    }
  } finally {
    isSavingProfile.value = false
  }
}

const onFormError = (event) => {
  const element = document.getElementById(event.errors[0].id)
  element?.focus()
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.4s ease-out forwards;
}
</style>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-38"></a>📄 [38/71] File: `web-admin/pages/profile/index.vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Profile Pages (Hồ sơ) | **Số dòng:** 436 | **Kích thước:** 22.3 KB

```markup
<template>
  <div class="min-h-screen bg-stone-50 dark:bg-stone-950 pb-16 transition-colors duration-300">
    <!-- Hero Banner with Mesh Gradient & Glassmorphism -->
    <div class="h-64 md:h-72 w-full relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-800 to-stone-900 dark:from-stone-800 dark:via-stone-900 dark:to-black">
      <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>
      <div class="absolute top-[-20%] left-[-10%] w-96 h-96 bg-primary-500/30 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-secondary-500/30 rounded-full blur-[100px]"></div>
    </div>

    <UContainer class="relative -mt-28 md:-mt-32">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        <!-- Left Sidebar: Profile Hero Card -->
        <div class="lg:col-span-4">
          <UCard class="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl shadow-xl shadow-stone-200/50 dark:shadow-black/50 border border-white/50 dark:border-stone-700/50 overflow-hidden sticky top-24 transition-all hover:shadow-2xl">
            <div class="flex flex-col items-center text-center p-6">
              
              <!-- Avatar -->
              <div class="relative group cursor-pointer mb-6" @click="$refs.fileInput.click()">
                <UAvatar
                  :src="user?.avatarPath ? `${config.public.apiBase}${user.avatarPath}` : undefined"
                  :alt="user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'"
                  size="3xl"
                  class="ring-4 ring-white dark:ring-stone-800 shadow-lg transition-transform duration-300 group-hover:scale-105"
                  :ui="{ background: 'bg-gradient-to-br from-primary-400 to-primary-600', text: 'text-white font-bold text-3xl' }"
                />
                <div class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <UIcon name="i-heroicons-camera" class="text-white w-6 h-6" />
                </div>
                <div v-if="isUploadingAvatar" class="absolute inset-0 bg-stone-100/80 dark:bg-stone-900/80 rounded-full flex items-center justify-center">
                  <UIcon name="i-heroicons-arrow-path" class="animate-spin text-primary-500 w-6 h-6" />
                </div>
              </div>
              <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onAvatarSelected" />

              <!-- User Names -->
              <h1 class="text-2xl font-black font-serif text-stone-900 dark:text-white leading-tight">
                <span v-if="user?.christianName" class="block text-primary-600 dark:text-primary-400 text-lg font-medium mb-1">{{ user.christianName }}</span>
                {{ user?.fullName || 'Người dùng' }}
              </h1>
              <p class="text-sm text-stone-500 dark:text-stone-400 font-medium mt-2">
                @{{ user?.username }}
              </p>

              <!-- Badges -->
              <div class="flex flex-wrap justify-center gap-2 mt-5 mb-6">
                <UBadge :color="getRoleColor(user?.role)" variant="soft" class="px-3 py-1 font-semibold rounded-full shadow-sm">
                  <UIcon name="i-heroicons-shield-check" class="w-4 h-4 mr-1.5" />
                  {{ getRoleName(user?.role) }}
                </UBadge>
                <UBadge v-if="user?.branch && user.branch > 0" :color="getBranchColor(user?.branch)" variant="soft" class="px-3 py-1 font-semibold rounded-full shadow-sm">
                  <UIcon name="i-heroicons-user-group" class="w-4 h-4 mr-1.5" />
                  Ngành {{ getBranchName(user?.branch) }}
                </UBadge>
              </div>

              <!-- Bio -->
              <p v-if="user?.bio" class="text-sm text-stone-600 dark:text-stone-300 italic px-2 mb-6 border-l-2 border-primary-500 text-left">
                "{{ user.bio }}"
              </p>

              <div class="w-full border-t border-stone-200 dark:border-stone-800 pt-5">
                <div class="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-3">
                  <span class="flex items-center gap-1.5"><UIcon name="i-heroicons-calendar" class="w-4 h-4" /> Tham gia từ</span>
                  <span class="font-semibold text-stone-700 dark:text-stone-200">
                    {{ user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '--/--/----' }}
                  </span>
                </div>
                <div class="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                  <span class="flex items-center gap-1.5"><UIcon name="i-heroicons-check-badge" class="w-4 h-4" /> Trạng thái</span>
                  <span class="text-success-500 font-semibold flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-success-500 animate-pulse"></span> Hoạt động
                  </span>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Right Content: Bento Box / Tabs -->
        <div class="lg:col-span-8">
          <UCard class="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl shadow-xl shadow-stone-200/50 dark:shadow-black/50 border border-white/50 dark:border-stone-700/50 min-h-[500px]">
            <UTabs :items="tabItems" class="w-full">
              
              <!-- TAB 1: OVERVIEW -->
              <template #overview>
                <div class="p-2 md:p-4 space-y-8 animate-fade-in-up">
                  
                  <!-- Section Header -->
                  <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 class="text-xl font-black text-stone-900 dark:text-white tracking-wide flex items-center gap-2">
                        Thông Tin <span class="text-primary-600 dark:text-primary-400">Cá Nhân</span>
                      </h3>
                      <p class="text-sm text-stone-500 dark:text-stone-400 mt-1">
                        Dữ liệu hồ sơ cơ bản từ hệ thống Quản lý Giáo lý.
                      </p>
                    </div>
                    <!-- Chuyển hướng sang trang con -->
                    <UButton 
                      to="/profile/edit" 
                      icon="i-heroicons-pencil-square" 
                      color="primary" 
                      variant="solid" 
                      label="Chỉnh Sửa" 
                      class="shadow-md transition-transform hover:-translate-y-0.5" 
                    />
                  </div>

                  <!-- Bento Grid Layout -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div class="p-5 rounded-2xl border border-stone-200/70 dark:border-stone-700/70 bg-white/50 dark:bg-stone-800/50 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-start gap-4 shadow-sm group">
                      <div class="p-2.5 bg-primary-100 dark:bg-primary-900/50 rounded-xl text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                        <UIcon name="i-heroicons-user" class="w-6 h-6" />
                      </div>
                      <div>
                        <p class="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-1">Họ Tên & Tên Thánh</p>
                        <p class="text-sm font-semibold text-stone-900 dark:text-white">
                          {{ user?.christianName ? user.christianName + ' ' : '' }}{{ user?.fullName || '---' }}
                        </p>
                      </div>
                    </div>

                    <div class="p-5 rounded-2xl border border-stone-200/70 dark:border-stone-700/70 bg-white/50 dark:bg-stone-800/50 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-start gap-4 shadow-sm group">
                      <div class="p-2.5 bg-sky-100 dark:bg-sky-900/50 rounded-xl text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
                        <UIcon name="i-heroicons-cake" class="w-6 h-6" />
                      </div>
                      <div>
                        <p class="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-1">Ngày sinh</p>
                        <p class="text-sm font-semibold text-stone-900 dark:text-white">
                          {{ user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật' }}
                        </p>
                      </div>
                    </div>

                    <div class="p-5 rounded-2xl border border-stone-200/70 dark:border-stone-700/70 bg-white/50 dark:bg-stone-800/50 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-start gap-4 shadow-sm group">
                      <div class="p-2.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                        <UIcon name="i-heroicons-envelope" class="w-6 h-6" />
                      </div>
                      <div>
                        <p class="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-1">Thư điện tử (Email)</p>
                        <p class="text-sm font-semibold text-stone-900 dark:text-white break-all">{{ user?.email || 'Chưa cập nhật' }}</p>
                      </div>
                    </div>

                    <div class="p-5 rounded-2xl border border-stone-200/70 dark:border-stone-700/70 bg-white/50 dark:bg-stone-800/50 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-start gap-4 shadow-sm group">
                      <div class="p-2.5 bg-amber-100 dark:bg-amber-900/50 rounded-xl text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                        <UIcon name="i-heroicons-phone" class="w-6 h-6" />
                      </div>
                      <div>
                        <p class="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-1">Số điện thoại</p>
                        <p class="text-sm font-semibold text-stone-900 dark:text-white">{{ user?.phoneNumber || 'Chưa cập nhật' }}</p>
                      </div>
                    </div>

                    <div class="p-5 md:col-span-2 rounded-2xl border border-stone-200/70 dark:border-stone-700/70 bg-white/50 dark:bg-stone-800/50 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-start gap-4 shadow-sm group">
                      <div class="p-2.5 bg-purple-100 dark:bg-purple-900/50 rounded-xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                        <UIcon name="i-heroicons-map-pin" class="w-6 h-6" />
                      </div>
                      <div class="w-full">
                        <p class="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-1">Địa chỉ</p>
                        <p class="text-sm font-semibold text-stone-900 dark:text-white">{{ user?.address || 'Chưa cập nhật địa chỉ thường trú' }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <!-- TAB 2: SETTINGS -->
              <template #settings>
                <div class="p-2 md:p-4 space-y-6 animate-fade-in-up">
                  <div class="mb-8">
                    <h3 class="text-xl font-black text-stone-900 dark:text-white tracking-wide flex items-center gap-2">
                      Cài Đặt <span class="text-primary-600 dark:text-primary-400">Giao Diện</span>
                    </h3>
                    <p class="text-sm text-stone-500 dark:text-stone-400 mt-1">
                      Cá nhân hóa trải nghiệm của bạn trên hệ thống.
                    </p>
                  </div>

                  <div class="space-y-4">
                    <div class="flex items-center justify-between p-5 rounded-2xl border border-stone-200/70 dark:border-stone-700/70 bg-white/50 dark:bg-stone-800/50 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors shadow-sm">
                      <div class="flex items-center gap-4">
                        <div class="p-3 bg-stone-100 dark:bg-stone-700 rounded-xl text-stone-600 dark:text-stone-300">
                          <UIcon :name="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'" class="w-6 h-6" />
                        </div>
                        <div>
                          <p class="font-bold text-stone-900 dark:text-white text-base">Giao diện (Dark Mode)</p>
                          <p class="text-sm text-stone-500 dark:text-stone-400">Chuyển đổi giao diện Sáng / Tối.</p>
                        </div>
                      </div>
                      <ClientOnly>
                        <USwitch v-model="isDarkModel" size="lg" color="primary" />
                        <template #fallback>
                          <div class="w-12 h-6 rounded-full bg-stone-200 dark:bg-stone-700 animate-pulse"></div>
                        </template>
                      </ClientOnly>
                    </div>

                    <!-- TÍNH NĂNG MỚI: Thông báo nhắc nhở Đọc Kinh -->
                    <div class="flex items-center justify-between p-5 rounded-2xl border border-stone-200/70 dark:border-stone-700/70 bg-white/50 dark:bg-stone-800/50 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors shadow-sm">
                      <div class="flex items-center gap-4">
                        <div class="p-3 bg-stone-100 dark:bg-stone-700 rounded-xl text-stone-600 dark:text-stone-300">
                          <UIcon name="i-heroicons-bell-alert" class="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                          <p class="font-bold text-stone-900 dark:text-white text-base">Nhắc Nhở Đọc Kinh</p>
                          <p class="text-sm text-stone-500 dark:text-stone-400">Nhận thông báo Lời Chúa và giờ kinh Sáng/Tối.</p>
                        </div>
                      </div>
                      <ClientOnly>
                        <USwitch v-model="isPrayerReminder" size="lg" color="primary" />
                        <template #fallback>
                          <div class="w-12 h-6 rounded-full bg-stone-200 dark:bg-stone-700 animate-pulse"></div>
                        </template>
                      </ClientOnly>
                    </div>
                  </div>
                </div>
              </template>

              <!-- TAB 3: SECURITY (Sử dụng UFormField thay vì UFormGroup) -->
              <template #security>
                <div class="p-2 md:p-4 space-y-6 animate-fade-in-up">
                  <div class="mb-8">
                    <h3 class="text-xl font-black text-stone-900 dark:text-white tracking-wide flex items-center gap-2">
                      Bảo Mật <span class="text-primary-600 dark:text-primary-400">& Đăng Nhập</span>
                    </h3>
                    <p class="text-sm text-stone-500 dark:text-stone-400 mt-1">
                      Quản lý thông tin bảo mật và mật khẩu của bạn.
                    </p>
                  </div>

                  <UAlert
                    icon="i-heroicons-shield-exclamation"
                    color="amber"
                    variant="soft"
                    title="Lưu ý Bảo mật"
                    description="Tuyệt đối không chia sẻ mật khẩu cho bất kỳ ai. Đổi mật khẩu ngay nếu nghi ngờ tài khoản bị lộ."
                    class="mb-8 shadow-sm rounded-xl border border-amber-200/50 dark:border-amber-900/50"
                  />

                  <div class="p-6 rounded-2xl border border-stone-200/70 dark:border-stone-700/70 bg-white/50 dark:bg-stone-800/50 shadow-sm">
                    <UForm :state="passwordForm" class="space-y-6" @submit="changePassword">
                      
                      <!-- Sửa UFormGroup thành UFormField -->
                      <UFormField label="Mật Khẩu Hiện Tại" name="oldPassword" required>
                        <UInput v-model="passwordForm.oldPassword" type="password" placeholder="••••••••" icon="i-heroicons-lock-closed" size="lg" color="primary" class="w-full" />
                      </UFormField>
                      
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <UFormField label="Mật Khẩu Mới" name="newPassword" required>
                          <UInput v-model="passwordForm.newPassword" type="password" placeholder="••••••••" icon="i-heroicons-key" size="lg" color="primary" class="w-full" />
                        </UFormField>
                        <UFormField label="Xác Nhận Mật Khẩu" name="confirmPassword" required>
                          <UInput v-model="passwordForm.confirmPassword" type="password" placeholder="••••••••" icon="i-heroicons-key" size="lg" color="primary" class="w-full" />
                        </UFormField>
                      </div>
                      
                      <div class="pt-4 flex justify-end">
                        <UButton type="submit" color="primary" size="lg" label="Lưu Mật Khẩu" icon="i-heroicons-check" :loading="isChangingPassword" class="shadow-md" />
                      </div>
                    </UForm>
                  </div>
                </div>
              </template>
            </UTabs>
          </UCard>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
import { useLocalStorage } from '@vueuse/core'

definePageMeta({
  layout: 'public'
})

useHead({
  title: 'Trang Cá Nhân - Thiếu Nhi Thánh Thể'
})

const authStore = useAuthStore()
const user = computed(() => authStore.user || {})
const config = useRuntimeConfig()
const toast = useToast()

onMounted(async () => {
  try {
    const res = await $api('/Profile/me')
    if (res) {
      authStore.updateProfile(res)
    }
  } catch (err) {
    console.error('Failed to fetch profile', err)
  }
})

// Avatar Logic
const fileInput = ref(null)
const isUploadingAvatar = ref(false)

const onAvatarSelected = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  isUploadingAvatar.value = true
  try {
    const formData = new FormData()
    formData.append('avatar', file)
    const res = await $api('/Profile/avatar', {
      method: 'POST',
      body: formData
    })
    authStore.updateProfile({ avatarPath: res.avatarPath })
    toast.add({ title: 'Cập nhật ảnh đại diện thành công', color: 'success' })
  } catch (error) {
    toast.add({ title: error?.response?._data || 'Lỗi tải ảnh', color: 'error' })
  } finally {
    isUploadingAvatar.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

// Theme logic
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const isDarkModel = computed({
  get: () => isDark.value,
  set: (val) => { colorMode.preference = val ? 'dark' : 'light' }
})



// New feature logic: Prayer reminders
const isPrayerReminder = useLocalStorage('prayer-reminder', false)
watch(isPrayerReminder, (val) => {
  if (val) {
    toast.add({ title: 'Đã bật nhắc nhở', description: 'Hệ thống sẽ gửi thông báo đến bạn vào mỗi giờ kinh Sáng và Tối.', color: 'primary', icon: 'i-heroicons-bell-alert' })
  } else {
    toast.add({ title: 'Đã tắt nhắc nhở', description: 'Bạn sẽ không nhận được thông báo nhắc nhở đọc kinh.', color: 'gray', icon: 'i-heroicons-bell-slash' })
  }
})

// Tabs Configuration
const tabItems = [
  { label: 'Tổng Quan', icon: 'i-heroicons-identification', slot: 'overview' },
  { label: 'Cài Đặt', icon: 'i-heroicons-cog-6-tooth', slot: 'settings' },
  { label: 'Bảo Mật', icon: 'i-heroicons-shield-check', slot: 'security' }
]

// Password Form Logic
const isChangingPassword = ref(false)
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const changePassword = async () => {
  if (!passwordForm.value.oldPassword || !passwordForm.value.newPassword) {
    toast.add({ title: 'Vui lòng nhập đầy đủ thông tin', color: 'error' })
    return
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    toast.add({ title: 'Mật khẩu xác nhận không khớp', color: 'error' })
    return
  }

  isChangingPassword.value = true
  try {
    await $api('/Profile/change-password', {
      method: 'PATCH',
      body: {
        oldPassword: passwordForm.value.oldPassword,
        newPassword: passwordForm.value.newPassword
      }
    })
    toast.add({ title: 'Đổi mật khẩu thành công!', color: 'success' })
    passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
  } catch (error) {
    toast.add({ title: error?.response?._data || 'Có lỗi xảy ra', color: 'error' })
  } finally {
    isChangingPassword.value = false
  }
}

// Helper functions for UI
const getRoleName = (role) => {
  const map = {
    1: 'Quản Trị Viên', Admin: 'Quản Trị Viên',
    2: 'Thư Ký', Secretary: 'Thư Ký',
    3: 'Huynh Trưởng', Moderator: 'Huynh Trưởng',
    4: 'Đoàn Sinh / Phụ Huynh', Viewer: 'Đoàn Sinh / Phụ Huynh'
  }
  return map[role] || 'Người Dùng'
}

const getRoleColor = (role) => {
  const map = {
    1: 'error', Admin: 'error',
    2: 'purple', Secretary: 'purple',
    3: 'success', Moderator: 'success',
    4: 'primary', Viewer: 'primary'
  }
  return map[role] || 'neutral'
}

const getBranchName = (branchId) => {
  const map = {
    1: 'Ấu Nhi', 2: 'Thiếu Nhi', 3: 'Nghĩa Sĩ', 4: 'Hiệp Sĩ'
  }
  return map[branchId] || ''
}

const getBranchColor = (branchId) => {
  const map = {
    1: 'success', 2: 'primary', 3: 'warning', 4: 'error'
  }
  return map[branchId] || 'neutral'
}
</script>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}
</style>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-39"></a>📄 [39/71] File: `web-admin/pages/students/index.vue`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** Portal Pages (Cổng công chúng) | **Số dòng:** 277 | **Kích thước:** 14.0 KB

```markup
<template>
  <div class="min-h-screen bg-stone-50 dark:bg-stone-950 font-sans selection:bg-primary-500/30 relative pb-24">
    <!-- ═══════════════════════════════════════════════════════
         BACKGROUND MESH GRADIENT
    ═══════════════════════════════════════════════════════ -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div class="absolute top-[10%] left-[20%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob bg-rose-400"></div>
      <div class="absolute -bottom-[20%] right-[10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-sky-400"></div>
      <div class="absolute top-[30%] right-[30%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-15 dark:opacity-5 animate-blob animation-delay-4000 bg-amber-400"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
    </div>

    <UContainer class="relative z-10 pt-12 space-y-8 animate-fade-in-up">
      <!-- ═══════════════════════════════════════════════════════
           PAGE HEADER
      ═══════════════════════════════════════════════════════ -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-white/60 dark:bg-stone-900/40 backdrop-blur-md border border-white/40 dark:border-stone-700/50 shadow-sm text-xs font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest">
            <UIcon name="i-heroicons-user-group" class="w-4 h-4" />
            <span>Hồ Sơ Sứ Đoàn</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-stone-900 dark:text-white uppercase tracking-tight leading-tight drop-shadow-sm">
            Danh Sách <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">Đoàn Sinh</span>
          </h1>
          <p class="text-stone-500 text-lg mt-2 font-serif italic">
            Hiển thị danh sách đoàn sinh hiện tại (Chế độ xem)
          </p>
        </div>
        
        <div v-if="authStore.isLoggedIn" class="shrink-0 mb-2">
          <UButton
            to="/admin/students"
            label="Quản lý Dữ liệu"
            icon="i-heroicons-pencil-square"
            color="primary"
            variant="solid"
            size="lg"
            class="rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 bg-gradient-to-r from-primary-600 to-primary-500 hover:-translate-y-0.5 transition-transform"
          />
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════
           GLASSMORPHIC FILTER BAR
      ═══════════════════════════════════════════════════════ -->
      <div class="bg-white/60 dark:bg-stone-900/60 backdrop-blur-2xl border border-white/50 dark:border-stone-800 rounded-[2rem] p-3 shadow-xl shadow-black/5 animate-fade-in-up delay-100">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
          <!-- Tên -->
          <div class="md:col-span-1 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5 text-stone-400" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tên, Tên Thánh..."
              class="w-full pl-10 pr-4 py-2.5 bg-stone-100/50 dark:bg-stone-800/50 rounded-2xl border border-stone-200/50 dark:border-stone-700/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-stone-900 dark:text-white placeholder-stone-400 font-medium transition-all"
            />
          </div>

          <!-- Ngành -->
          <div class="md:col-span-1">
            <USelect
              v-model="filterBranch"
              :options="[{ label: 'Tất cả Ngành', value: 0 }, { label: 'Chiên con', value: 1 }, { label: 'Ấu nhi', value: 2 }, { label: 'Thiếu nhi', value: 3 }, { label: 'Nghĩa sĩ', value: 4 }, { label: 'Hiệp sĩ', value: 5 }]"
              value-attribute="value"
              option-attribute="label"
              size="lg"
              variant="none"
              class="w-full bg-stone-100/50 dark:bg-stone-800/50 rounded-2xl border border-stone-200/50 dark:border-stone-700/50 font-medium text-stone-700 dark:text-stone-300"
            />
          </div>

          <!-- Rửa Tội -->
          <div class="md:col-span-1">
            <USelect
              v-model="filterBaptism"
              :options="[{ label: 'Rửa Tội: Tất cả', value: '' }, { label: 'Đã Rửa Tội', value: 'true' }, { label: 'Chưa Rửa Tội', value: 'false' }]"
              value-attribute="value"
              option-attribute="label"
              size="lg"
              variant="none"
              class="w-full bg-stone-100/50 dark:bg-stone-800/50 rounded-2xl border border-stone-200/50 dark:border-stone-700/50 font-medium text-stone-700 dark:text-stone-300"
            />
          </div>

          <!-- Rước Lễ -->
          <div class="md:col-span-1">
            <USelect
              v-model="filterCommunion"
              :options="[{ label: 'Rước Lễ: Tất cả', value: '' }, { label: 'Đã Rước Lễ', value: 'true' }, { label: 'Chưa Rước Lễ', value: 'false' }]"
              value-attribute="value"
              option-attribute="label"
              size="lg"
              variant="none"
              class="w-full bg-stone-100/50 dark:bg-stone-800/50 rounded-2xl border border-stone-200/50 dark:border-stone-700/50 font-medium text-stone-700 dark:text-stone-300"
            />
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════
           PREMIUM GLASS TABLE
      ═══════════════════════════════════════════════════════ -->
      <UCard 
        class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-3xl shadow-2xl shadow-black/5 dark:shadow-black/40 border border-white/50 dark:border-stone-800 rounded-[2.5rem] overflow-hidden animate-fade-in-up delay-200"
        :ui="{ body: { padding: 'p-0', base: 'overflow-x-auto' } }"
      >
        <UTable
          :rows="pagedData?.items || []"
          :columns="columns"
          :loading="pending"
          :empty-state="{ icon: 'i-heroicons-users', header: 'Không tìm thấy hồ sơ', label: 'Vui lòng thay đổi bộ lọc hoặc từ khóa.' }"
          :ui="{ 
            th: { base: 'bg-stone-100/50 dark:bg-stone-900/50 font-black uppercase tracking-widest text-[10px] text-stone-500 py-5 border-b border-white/40 dark:border-stone-800/50' },
            td: { base: 'whitespace-nowrap border-b border-stone-200/20 dark:border-stone-800/20 py-4' },
            tr: { base: 'hover:bg-white/50 dark:hover:bg-stone-800/50 transition-colors' }
          }"
        >
          <!-- Cột: Tên Đoàn Sinh -->
          <template #fullName-cell="{ row }">
            <div class="block py-1 pl-2">
              <p class="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-0.5">
                {{ row.original.holyName }}
              </p>
              <p class="font-black font-serif text-stone-800 dark:text-white text-lg">
                {{ row.original.fullName }}
              </p>
            </div>
          </template>

          <!-- Cột: Lớp -->
          <template #className-cell="{ row }">
            <div class="flex items-center gap-2 text-stone-600 dark:text-stone-300">
              <UIcon name="i-heroicons-academic-cap" class="w-4 h-4 text-stone-400" />
              <span class="font-bold">{{ row.original.className || 'Chưa xếp' }}</span>
            </div>
          </template>

          <!-- Cột: Ngành -->
          <template #branch-cell="{ row }">
            <UBadge
              :label="getBranchName(row.original.branch)"
              :color="getBranchColor(row.original.branch)"
              variant="soft"
              size="sm"
              class="font-black uppercase tracking-widest px-3 rounded-xl shadow-inner"
            />
          </template>

          <!-- Cột: Bí Tích (Glowing Badges) -->
          <template #sacraments-cell="{ row }">
            <div class="flex items-center gap-2">
              
              <!-- Rửa Tội -->
              <UTooltip text="Rửa Tội">
                <div :class="[
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm transition-all', 
                  row.original.baptismDate 
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 shadow-blue-500/20 drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]' 
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200/50 dark:border-stone-700'
                ]">
                  R
                </div>
              </UTooltip>

              <!-- Rước Lễ -->
              <UTooltip text="Rước Lễ">
                <div :class="[
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm transition-all', 
                  row.original.communionDate 
                    ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shadow-amber-500/20 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]' 
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200/50 dark:border-stone-700'
                ]">
                  L
                </div>
              </UTooltip>

              <!-- Thêm Sức -->
              <UTooltip text="Thêm Sức">
                <div :class="[
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm transition-all', 
                  row.original.confirmationDate 
                    ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 shadow-rose-500/20 drop-shadow-[0_0_4px_rgba(225,29,72,0.5)]' 
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200/50 dark:border-stone-700'
                ]">
                  S
                </div>
              </UTooltip>

            </div>
          </template>
        </UTable>

        <!-- Phân Trang (Pagination) -->
        <div class="flex justify-between items-center px-6 py-4 border-t border-white/30 dark:border-stone-800/50 bg-stone-100/30 dark:bg-stone-900/30 backdrop-blur-md">
          <span class="text-sm font-bold text-stone-500">
            Tổng cộng: <b class="text-primary-600 dark:text-primary-400 text-lg ml-1">{{ pagedData?.total || 0 }}</b>
          </span>
          <UPagination
            v-model="page"
            :page-count="pageSize"
            :total="pagedData?.total || 0"
          />
        </div>
      </UCard>
    </UContainer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({ layout: 'public' })
useHead({ title: 'Danh Sách Đoàn Sinh - GiaoLy' })

const authStore = useAuthStore()

// State Phân Trang & Filter
const page = ref(1)
const pageSize = ref(20)
const searchQuery = ref('')
const filterBranch = ref(0)
const filterBaptism = ref('')
const filterCommunion = ref('')

// Gọi API Phân Trang
const { data: pagedData, pending } = await useApiFetch('/Student/paged', {
  query: computed(() => ({
    page: page.value,
    pageSize: pageSize.value,
    search: searchQuery.value,
    branch: filterBranch.value,
    hasBaptism: filterBaptism.value !== '' ? filterBaptism.value === 'true' : undefined,
    hasCommunion: filterCommunion.value !== '' ? filterCommunion.value === 'true' : undefined
  })),
  watch: [page, pageSize, searchQuery, filterBranch, filterBaptism, filterCommunion]
})

const columns = [
  { accessorKey: 'fullName', header: 'Hồ Sơ Đoàn Sinh' },
  { accessorKey: 'className', header: 'Phân Lớp' },
  { accessorKey: 'branch', header: 'Ngành' },
  { accessorKey: 'sacraments', header: 'Trạng Thái Bí Tích' }
]

// ── Helpers ───────────────────────────────────────────────────
const getBranchName = b => ({ 1: 'Chiên con', 2: 'Ấu nhi', 3: 'Thiếu nhi', 4: 'Nghĩa sĩ', 5: 'Hiệp sĩ' }[b] || 'Khác')
const getBranchColor = b => ({ 1: 'pink', 2: 'green', 3: 'blue', 4: 'yellow', 5: 'red' }[b] || 'gray')
</script>

<style>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 10s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-40"></a>📄 [40/71] File: `web-admin/stores/auth.ts`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** State Management (Pinia Store) | **Số dòng:** 85 | **Kích thước:** 3.4 KB

```typescript
import { defineStore } from 'pinia'

interface UserState {
  name: string
  username?: string
  fullName?: string
  avatarPath?: string
  email?: string
  phoneNumber?: string
  role: string | number
  branch: number
  userId: string // Giai đoạn 3A — Cần cho ABAC: so sánh với ClassRoom.LeaderId
  permissions: string[]
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    // Bản vá: Ép thời gian sống 7 ngày để không mất phiên khi đóng trình duyệt
    const token = useCookie<string | null>('auth_token', { maxAge: 60 * 60 * 24 * 7 })
    const user = useCookie<UserState | null>('user_data', { maxAge: 60 * 60 * 24 * 7 })
    return {
      token: token.value || null,
      user: user.value || null
    }
  },
  actions: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setAuth(data: any) {
      const tokenCookie = useCookie<string | null>('auth_token', { maxAge: 60 * 60 * 24 * 7 })
      const userCookie = useCookie<UserState | null>('user_data', { maxAge: 60 * 60 * 24 * 7 })

      // Bóc tách userId từ JWT Token nếu Backend trả về trong response
      // (AuthController login trả về field "userId" sau khi thêm Claim vào JWT)
      const parsedUser: UserState = {
        name: data.fullName || data.name || data.username || '',
        username: data.username || '',
        fullName: data.fullName || data.name || '',
        avatarPath: data.avatarPath || '',
        email: data.email || '',
        phoneNumber: data.phoneNumber || '',
        role: isNaN(Number(data.role)) ? data.role : Number(data.role),
        branch: data.branch !== null && data.branch !== undefined ? Number(data.branch) : 0,
        userId: data.userId || '', // Giai đoạn 5D — Lưu userId để dùng cho ABAC check phía FE
        permissions: data.permissions || []
      }

      tokenCookie.value = data.token
      userCookie.value = parsedUser

      this.token = data.token
      this.user = parsedUser
    },
    logout() {
      const tokenCookie = useCookie<string | null>('auth_token', { maxAge: 60 * 60 * 24 * 7 })
      const userCookie = useCookie<UserState | null>('user_data', { maxAge: 60 * 60 * 24 * 7 })

      tokenCookie.value = null
      userCookie.value = null

      this.token = null
      this.user = null
      navigateTo('/login')
    },
    updateProfile(data: Partial<UserState>) {
      if (!this.user) return
      this.user = { ...this.user, ...data }
      const userCookie = useCookie<UserState | null>('user_data', { maxAge: 60 * 60 * 24 * 7 })
      userCookie.value = this.user
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    isAdmin: state => state.user?.role === 1 || state.user?.role === 'Admin',
    isSecretary: state => state.user?.role === 2 || state.user?.role === 'Secretary',
    isMod: state => state.user?.role === 3 || state.user?.role === 'Moderator',
    hasPermission: state => (code: string) => state.user?.role === 1 || state.user?.role === 'Admin' || (state.user?.permissions?.includes(code) ?? false),
    // Getter mới: Kiểm tra xem user hiện tại có phải là GLV của lớp này không
    // Dùng trên UI để ẩn/hiện nút "Sửa điểm" mà không cần gọi API
    isLeaderOf: state => (leaderId: string | null | undefined) => {
      if (!leaderId || !state.user?.userId) return false
      return state.user.userId === leaderId
    }
  }
})

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-41"></a>📄 [41/71] File: `web-admin/tsconfig.json`
> **Dự án:** web-admin (Cổng Quản Trị) | **Phân loại:** App & Build Config (Cấu hình) | **Số dòng:** 11 | **Kích thước:** 0.3 KB

```json
{
  // https://nuxt.com/docs/guide/concepts/typescript
  "files": [],
  "references": [
    { "path": "./.nuxt/tsconfig.app.json" },
    { "path": "./.nuxt/tsconfig.server.json" },
    { "path": "./.nuxt/tsconfig.shared.json" },
    { "path": "./.nuxt/tsconfig.node.json" }
  ]
}

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-42"></a>📄 [42/71] File: `web-portal/app/app.config.ts`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** App & Build Config (Cấu hình) | **Số dòng:** 11 | **Kích thước:** 0.2 KB

```typescript
export default defineAppConfig({
  ui: {
    colors: {
      // Navy Blue (Xanh Marian) là màu chính
      primary: 'blue',
      // Stone thay cho slate - ấm hơn, hợp với Ivory/Gold palette
      neutral: 'stone'
    }
  }
})

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-43"></a>📄 [43/71] File: `web-portal/app/app.vue`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** App & Build Config (Cấu hình) | **Số dòng:** 28 | **Kích thước:** 0.8 KB

```markup
<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: { lang: 'vi' }
})

useSeoMeta({
  title: 'Thiếu Nhi Thánh Thể – Cổng Thông Tin Sứ Đoàn',
  description: 'Cổng thông tin chính thức của Sứ Đoàn Thiếu Nhi Thánh Thể: tin tức Công giáo, lịch phụng vụ, danh sách ban trưởng và tra cứu điểm giáo lý.',
  ogTitle: 'Thiếu Nhi Thánh Thể – Cổng Thông Tin Sứ Đoàn',
  ogDescription: 'Cổng thông tin chính thức của Sứ Đoàn Thiếu Nhi Thánh Thể.',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage class="animate-fade-in" />
    </NuxtLayout>
  </UApp>
</template>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-44"></a>📄 [44/71] File: `web-portal/app/assets/css/main.css`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** Styles & CSS (Giao diện) | **Số dòng:** 350 | **Kích thước:** 11.2 KB

```css
@import "tailwindcss";

/* ════════════════════════════════════════════════════════════════════
   THIẾU NHI THÁNH THỂ — Web Portal
   Chủ đề: "Spiritual Premium"
   Bảng màu: Navy Marian + Gold Vatican + Ivory + Deep Red
════════════════════════════════════════════════════════════════════ */

@theme {
  /* ── Màu sắc chính ── */
  --color-navy:        #1a3a6b;   /* Xanh Marian (chính) */
  --color-navy-light:  #2a5298;   /* Xanh Navy sáng hơn */
  --color-navy-dark:   #0f2347;   /* Xanh Navy tối */
  --color-gold:        #c9a96e;   /* Vàng Vatican */
  --color-gold-light:  #e8c98a;   /* Vàng sáng */
  --color-gold-dark:   #a07840;   /* Vàng tối */
  --color-ivory:       #faf8f3;   /* Nền sáng Ivory */
  --color-ivory-dark:  #f0ece0;   /* Ivory đậm hơn */
  --color-catholic-red: #8b1a1a;  /* Đỏ Công Giáo */
  --color-catholic-red-light: #b02a2a;
  --color-catholic-gold: #c9a96e; /* Vàng Vatican */

  /* ── Typography ── */
  --font-sans:  "Outfit", "sans-serif";
  --font-serif: "Merriweather", "serif";

  /* ── Animations ── */
  --animate-marquee:      marquee 25s linear infinite;
  --animate-sweep:        sweep 0.8s ease-in-out;
  --animate-fade-in:      fade-in 0.8s ease-out forwards;
  --animate-slide-up:     slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  --animate-float:        float 6s ease-in-out infinite;
  --animate-shimmer:      shimmer 2.5s linear infinite;
  --animate-pulse-gold:   pulse-gold 2s ease-in-out infinite;
  --animate-glow:         glow 3s ease-in-out infinite;
  --animate-scroll-progress: scroll-progress linear both;

  @keyframes marquee {
    0%   { transform: translateX(0%); }
    100% { transform: translateX(-100%); }
  }
  @keyframes sweep {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes fade-in {
    0%   { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes slide-up {
    0%   { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  /* Hiệu ứng nổi lên xuống nhẹ nhàng (dùng cho bokeh/particles) */
  @keyframes float {
    0%, 100% { transform: translateY(0) scale(1); }
    50%       { transform: translateY(-20px) scale(1.05); }
  }
  /* Ánh sáng chạy qua - shimmer effect */
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  /* Nhịp đập vàng */
  @keyframes pulse-gold {
    0%, 100% { box-shadow: 0 0 0 0 rgba(201, 169, 110, 0.4); }
    50%       { box-shadow: 0 0 0 12px rgba(201, 169, 110, 0); }
  }
  /* Ánh hào quang */
  @keyframes glow {
    0%, 100% { opacity: 0.6; }
    50%       { opacity: 1; }
  }
  /* Progress bar cuộn trang */
  @keyframes scroll-progress {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
}

/* ════════════════════════════════════════════════════════════════════
   BASE STYLES
════════════════════════════════════════════════════════════════════ */
@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply font-sans antialiased text-slate-900 bg-ivory;
    background-color: #faf8f3;
  }

  /* Dark mode body */
  .dark body {
    @apply bg-[#0d1117] text-stone-100;
  }

  h1, h2, h3 {
    @apply font-serif;
  }

  /* Scrollbar đẹp */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #f0ece0;
  }
  ::-webkit-scrollbar-thumb {
    background: #c9a96e;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #a07840;
  }
  .dark ::-webkit-scrollbar-track {
    background: #1a1b1e;
  }
  .dark ::-webkit-scrollbar-thumb {
    background: #2a5298;
  }
}

/* ════════════════════════════════════════════════════════════════════
   COMPONENT CLASSES
════════════════════════════════════════════════════════════════════ */
@layer components {

  /* ── Navigation ── */
  .nav-link-refined {
    @apply relative flex items-center px-3 py-2 text-sm font-semibold tracking-wide transition-all duration-300;
  }
  .nav-link-refined:hover,
  .nav-link-refined.active {
    @apply text-gold;
    color: #c9a96e;
  }
  /* Thanh underline chạy */
  .nav-dot-floating {
    @apply absolute left-0 bottom-[-4px] h-[3px] w-0 rounded-full transition-all duration-300;
    background: linear-gradient(90deg, #c9a96e, #e8c98a);
  }
  .nav-link-refined:hover .nav-dot-floating,
  .nav-link-refined.active .nav-dot-floating {
    @apply w-full;
  }

  /* ── Glassmorphism Card ── */
  .glass-card {
    @apply relative rounded-2xl border overflow-hidden;
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow:
      0 8px 32px rgba(26, 58, 107, 0.08),
      0 1px 0 rgba(255, 255, 255, 0.6) inset;
  }
  .dark .glass-card {
    background: rgba(26, 27, 30, 0.7);
    border-color: rgba(255, 255, 255, 0.06);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }
  .glass-card:hover {
    @apply -translate-y-1;
    box-shadow:
      0 16px 48px rgba(26, 58, 107, 0.14),
      0 1px 0 rgba(255, 255, 255, 0.6) inset;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* ── Sacred Card (card trang trọng) ── */
  .sacred-card {
    @apply relative rounded-3xl border transition-all duration-500 overflow-hidden;
    background: #faf8f3;
    border-color: rgba(201, 169, 110, 0.2);
    box-shadow:
      0 4px 24px rgba(26, 58, 107, 0.06),
      0 0 0 1px rgba(201, 169, 110, 0.1);
  }
  .dark .sacred-card {
    background: #1a1b1e;
    border-color: rgba(201, 169, 110, 0.12);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  }
  .sacred-card:hover {
    border-color: rgba(201, 169, 110, 0.5);
    box-shadow:
      0 12px 40px rgba(26, 58, 107, 0.12),
      0 0 0 1px rgba(201, 169, 110, 0.3);
    transform: translateY(-4px);
  }

  /* ── Catholic Card (giữ lại từ design cũ, nâng cấp) ── */
  .catholic-card {
    @apply bg-white rounded-xl border border-stone-100 shadow-sm transition-all duration-500;
  }
  .catholic-card:hover {
    @apply -translate-y-2;
    border-color: rgba(201, 169, 110, 0.3);
    box-shadow: 0 20px 40px rgba(26, 58, 107, 0.1);
  }

  /* ── Premium Button ── */
  .premium-btn {
    @apply relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm tracking-wide overflow-hidden transition-all duration-300;
    background: linear-gradient(135deg, #1a3a6b, #2a5298);
    box-shadow: 0 4px 15px rgba(26, 58, 107, 0.3);
  }
  .premium-btn::before {
    content: '';
    @apply absolute inset-0 opacity-0 transition-opacity duration-300;
    background: linear-gradient(135deg, #2a5298, #1a3a6b);
  }
  .premium-btn:hover::before {
    @apply opacity-100;
  }
  .premium-btn:hover {
    @apply -translate-y-0.5;
    box-shadow: 0 8px 25px rgba(26, 58, 107, 0.4);
  }

  /* ── Gold Button ── */
  .gold-btn {
    @apply relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-navy text-sm tracking-wide overflow-hidden transition-all duration-300;
    background: linear-gradient(135deg, #c9a96e, #e8c98a);
    box-shadow: 0 4px 15px rgba(201, 169, 110, 0.4);
    color: #1a3a6b;
  }
  .gold-btn:hover {
    @apply -translate-y-0.5;
    box-shadow: 0 8px 25px rgba(201, 169, 110, 0.5);
  }

  /* ── Shimmer Text ── */
  .shimmer-text {
    background: linear-gradient(
      90deg,
      #c9a96e 0%,
      #faf8f3 30%,
      #e8c98a 50%,
      #faf8f3 70%,
      #c9a96e 100%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }

  /* ── Cross Pattern (họa tiết thánh giá mờ) ── */
  .cross-pattern {
    background-image:
      linear-gradient(rgba(201, 169, 110, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201, 169, 110, 0.04) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  /* ── Sacred Divider ── */
  .sacred-divider {
    @apply flex items-center gap-4;
  }
  .sacred-divider::before,
  .sacred-divider::after {
    content: '';
    @apply flex-1 h-px;
    background: linear-gradient(90deg, transparent, rgba(201, 169, 110, 0.5), transparent);
  }

  /* ── Liturgical Color Dot ── */
  .liturgy-dot {
    @apply w-3 h-3 rounded-full shadow-sm;
    animation: pulse-gold 2s ease-in-out infinite;
  }

  /* ── Section Heading ── */
  .section-heading {
    @apply text-2xl md:text-3xl font-black tracking-tight text-navy;
    color: #1a3a6b;
  }
  .dark .section-heading {
    color: #e8c98a;
  }

  /* ── Gold Accent Line ── */
  .gold-accent-line {
    @apply h-1 w-16 rounded-full;
    background: linear-gradient(90deg, #c9a96e, #e8c98a);
  }

  /* ── Scroll Progress ── */
  .scroll-progress-bar {
    @apply fixed top-0 left-0 right-0 z-[100] h-[3px] origin-left;
    background: linear-gradient(90deg, #1a3a6b, #c9a96e, #8b1a1a);
    animation: scroll-progress linear both;
    animation-timeline: scroll();
  }

  /* ── No scrollbar ── */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  /* ── Bokeh pseudo-particle (dùng bằng CSS) ── */
  .bokeh-bg {
    @apply absolute inset-0 overflow-hidden pointer-events-none;
  }
  .bokeh-bg::before,
  .bokeh-bg::after {
    content: '';
    @apply absolute rounded-full;
    background: radial-gradient(circle, rgba(201, 169, 110, 0.15) 0%, transparent 70%);
    animation: float 8s ease-in-out infinite;
  }
  .bokeh-bg::before {
    width: 300px; height: 300px;
    top: 10%; left: 5%;
    animation-delay: 0s;
  }
  .bokeh-bg::after {
    width: 200px; height: 200px;
    top: 40%; right: 8%;
    animation-delay: 3s;
  }

  /* ── Gradient Overlay ── */
  .navy-gradient-overlay {
    background: linear-gradient(
      135deg,
      rgba(26, 58, 107, 0.95) 0%,
      rgba(42, 82, 152, 0.85) 50%,
      rgba(139, 26, 26, 0.7) 100%
    );
  }

  /* ── TNTT Branch Colors ── */
  .tntt-au      { background-color: #ec4899; } /* Ấu: Hồng */
  .tntt-thieu   { background-color: #22c55e; } /* Thiếu: Xanh lá */
  .tntt-nghia   { background-color: #3b82f6; } /* Nghĩa: Xanh dương */
  .tntt-hiep    { background-color: #eab308; } /* Hiệp: Vàng */
  .tntt-huynh   { background-color: #92400e; } /* Huynh Trưởng: Nâu */
}

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-45"></a>📄 [45/71] File: `web-portal/app/components/AppLogo.vue`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** UI Components (Dùng chung) | **Số dòng:** 41 | **Kích thước:** 3.2 KB

```markup
<template>
  <svg
    width="1020"
    height="200"
    viewBox="0 0 1020 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M377 200C379.16 200 381 198.209 381 196V103C381 103 386 112 395 127L434 194C435.785 197.74 439.744 200 443 200H470V50H443C441.202 50 439 51.4941 439 54V148L421 116L385 55C383.248 51.8912 379.479 50 376 50H350V200H377Z"
      fill="currentColor"
    />
    <path
      d="M726 92H739C742.314 92 745 89.3137 745 86V60H773V92H800V116H773V159C773 169.5 778.057 174 787 174H800V200H783C759.948 200 745 185.071 745 160V116H726V92Z"
      fill="currentColor"
    />
    <path
      d="M591 92V154C591 168.004 585.742 179.809 578 188C570.258 196.191 559.566 200 545 200C530.434 200 518.742 196.191 511 188C503.389 179.809 498 168.004 498 154V92H514C517.412 92 520.769 92.622 523 95C525.231 97.2459 526 98.5652 526 102V154C526 162.059 526.457 167.037 530 171C533.543 174.831 537.914 176 545 176C552.217 176 555.457 174.831 559 171C562.543 167.037 563 162.059 563 154V102C563 98.5652 563.769 96.378 566 94C567.96 91.9107 570.028 91.9599 573 92C573.411 92.0055 574.586 92 575 92H591Z"
      fill="currentColor"
    />
    <path
      d="M676 144L710 92H684C680.723 92 677.812 93.1758 676 96L660 120L645 97C643.188 94.1758 639.277 92 636 92H611L645 143L608 200H634C637.25 200 640.182 196.787 642 194L660 167L679 195C680.818 197.787 683.75 200 687 200H713L676 144Z"
      fill="currentColor"
    />
    <path
      d="M168 200H279C282.542 200 285.932 198.756 289 197C292.068 195.244 295.23 193.041 297 190C298.77 186.959 300.002 183.51 300 179.999C299.998 176.488 298.773 173.04 297 170.001L222 41C220.23 37.96 218.067 35.7552 215 34C211.933 32.2448 207.542 31 204 31C200.458 31 197.067 32.2448 194 34C190.933 35.7552 188.77 37.96 187 41L168 74L130 9.99764C128.228 6.95784 126.068 3.75491 123 2C119.932 0.245087 116.542 0 113 0C109.458 0 106.068 0.245087 103 2C99.9323 3.75491 96.7717 6.95784 95 9.99764L2 170.001C0.226979 173.04 0.00154312 176.488 1.90993e-06 179.999C-0.0015393 183.51 0.229648 186.959 2 190C3.77035 193.04 6.93245 195.244 10 197C13.0675 198.756 16.4578 200 20 200H90C117.737 200 137.925 187.558 152 164L186 105L204 74L259 168H186L168 200ZM89 168H40L113 42L150 105L125.491 147.725C116.144 163.01 105.488 168 89 168Z"
      fill="var(--ui-primary)"
    />
    <path
      d="M958 60.0001H938C933.524 60.0001 929.926 59.9395 927 63C924.074 65.8905 925 67.5792 925 72V141C925 151.372 923.648 156.899 919 162C914.352 166.931 908.468 169 899 169C889.705 169 882.648 166.931 878 162C873.352 156.899 873 151.372 873 141V72.0001C873 67.5793 872.926 65.8906 870 63.0001C867.074 59.9396 863.476 60.0001 859 60.0001H840V141C840 159.023 845.016 173.458 855 184C865.156 194.542 879.893 200 899 200C918.107 200 932.844 194.542 943 184C953.156 173.458 958 159.023 958 141V60.0001Z"
      fill="var(--ui-primary)"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M1000 60.0233L1020 60V77L1020 128V156.007L1020 181L1020 189.004C1020 192.938 1019.98 194.429 1017 197.001C1014.02 199.725 1009.56 200 1005 200H986.001V181.006L986 130.012V70.0215C986 66.1576 986.016 64.5494 989 62.023C991.819 59.6358 995.437 60.0233 1000 60.0233Z"
      fill="var(--ui-primary)"
    />
  </svg>
</template>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-46"></a>📄 [46/71] File: `web-portal/app/components/HeroBanner.vue`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** UI Components (Dùng chung) | **Số dòng:** 50 | **Kích thước:** 1.6 KB

```markup
<template>
  <section class="relative h-[60vh] min-h-[400px] flex items-center justify-center bg-stone-900 overflow-hidden">
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1548625361-ecceabcce8f1?q=80&w=2000&auto=format&fit=crop"
        alt="Nhà thờ Công Giáo"
        class="w-full h-full object-cover opacity-60"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-900/40 to-transparent" />
    </div>

    <!-- Content -->
    <div class="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
      <h1 class="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight drop-shadow-md">
        Thiếu Nhi Thánh Thể Việt Nam
      </h1>
      <p class="text-lg md:text-xl text-blue-100 font-light mb-8 max-w-2xl mx-auto drop-shadow">
        Sứ Đoàn Thiếu Nhi Thánh Thể Giáo Xứ<br>
        Bổn mạng: Thánh Têrêsa Hài Đồng Giêsu
      </p>

      <div class="flex flex-wrap justify-center gap-4">
        <UButton
          size="lg"
          color="neutral"
          variant="solid"
          class="font-semibold shadow-lg hover:scale-105 transition-transform"
          to="/profile"
        >
          Đăng Nhập / Tra Cứu
        </UButton>
        <UButton
          size="lg"
          color="neutral"
          variant="ghost"
          class="font-semibold hover:bg-white/10 text-white"
          to="#thong-bao"
        >
          Xem Thông Báo
        </UButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// No extra logic required for banner
</script>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-47"></a>📄 [47/71] File: `web-portal/app/components/home/HeroSection.vue`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** Home Components (Trang chủ) | **Số dòng:** 227 | **Kích thước:** 9.4 KB

```markup
<script setup lang="ts">
interface BannerItem {
  id: string
  title: string
  subtitle?: string
  tag?: string
  tagColor?: string
  imageUrl: string
  link?: string
  ctaText?: string
  orderIndex?: number
  isActive?: boolean
}

const config = useRuntimeConfig()

// Gọi API lấy danh sách banner đang hoạt động
const { data: apiBanners } = await useFetch<BannerItem[]>('/api/banners/active', {
  baseURL: config.public.apiBase
})

// Dữ liệu mẫu phong phú khi API chưa có hoặc đang tải
const fallbackBanners: BannerItem[] = [
  {
    id: '1',
    title: 'Khơi Nguồn Đức Tin – Đồng Hành Cùng Giới Trẻ',
    subtitle: 'Năm học Giáo lý mới với chủ đề "Cầu Nguyện • Rước Lễ • Hy Sinh • Làm Tông Đồ"',
    tag: '✨ NĂM HỌC MỚI',
    tagColor: 'warning',
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=2000&auto=format&fit=crop',
    link: '/news',
    ctaText: 'Khám Phá Ngay'
  },
  {
    id: '2',
    title: 'Đại Hội Huynh Trưởng & Đoàn Sinh Xứ Đoàn',
    subtitle: 'Tổng kết phong trào Thiếu Nhi Thánh Thể và tuyên hứa Ban Điều Hành nhiệm kỳ mới.',
    tag: '✝ SỰ KIỆN NỔI BẬT',
    tagColor: 'error',
    imageUrl: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=2071&auto=format&fit=crop',
    link: '/thong-bao',
    ctaText: 'Xem Chương Trình'
  }
]

const bannerList = computed(() => {
  if (apiBanners.value && apiBanners.value.length > 0) {
    return apiBanners.value
  }
  return fallbackBanners
})

const searchQuery = ref('')
const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  navigateTo(`/verify?q=${encodeURIComponent(searchQuery.value.trim())}`)
}

// Thống kê nhanh (quick stats)
const quickStats = [
  { label: 'Đoàn Sinh', value: '120+', icon: 'i-heroicons-users' },
  { label: 'Huynh Trưởng', value: '24', icon: 'i-heroicons-academic-cap' },
  { label: 'Lớp Học', value: '8', icon: 'i-heroicons-building-library' },
  { label: 'Năm Hoạt Động', value: '15+', icon: 'i-heroicons-star' },
]
</script>

<template>
  <div class="relative w-full mb-20 -mt-0">

    <!-- ══════════════════════════════════════════════════════════════
         HERO BANNER — Cinematic Edge-to-Edge
    ══════════════════════════════════════════════════════════════════ -->
    <div class="relative w-full overflow-hidden shadow-2xl" style="box-shadow: 0 25px 60px rgba(26,58,107,0.25);">

      <!-- Bokeh particles giả (CSS only) -->
      <div class="bokeh-bg z-10" />

      <!-- UCarousel Nuxt UI -->
      <UCarousel
        :items="bannerList"
        :ui="{
          root: 'relative overflow-hidden w-full h-[520px] sm:h-[620px] md:h-[680px] lg:h-[740px]',
          container: 'h-full w-full',
          item: 'w-full basis-full h-full relative select-none'
        }"
        indicators
        arrows
        :autoplay="{ delay: 5500 }"
        loop
      >
        <template #default="{ item }">
          <div class="relative w-full h-full group overflow-hidden">

            <!-- Ảnh nền với hiệu ứng zoom -->
            <img
              :src="item.imageUrl"
              :alt="item.title"
              class="w-full h-full object-cover object-center transform transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              draggable="false"
            >

            <!-- Các lớp gradient overlay tạo chiều sâu -->
            <div class="absolute inset-0 bg-gradient-to-t from-[#0d1117]/95 via-[#0d1117]/30 to-transparent" />
            <div class="absolute inset-0 bg-gradient-to-r from-[#0d1117]/80 via-[#0d1117]/20 to-transparent" />
            <!-- Viền vàng tinh tế ở bottom -->
            <div class="absolute bottom-0 left-0 right-0 h-[3px]"
              style="background: linear-gradient(90deg, transparent, #c9a96e, transparent);"
            />

            <!-- Nội dung Slide — Typography "Spiritual Premium" -->
            <div class="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-14 pb-24 sm:pb-28 z-10 max-w-4xl">

              <!-- Tag / Eyebrow Label -->
              <div v-if="item.tag" class="mb-4">
                <span class="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black tracking-[0.2em] uppercase backdrop-blur-md border"
                  style="
                    background: rgba(201,169,110,0.15);
                    border-color: rgba(201,169,110,0.4);
                    color: #e8c98a;
                  "
                >
                  {{ item.tag }}
                </span>
              </div>

              <!-- Tiêu đề serif lớn -->
              <h1 class="font-serif font-black text-white leading-[1.1] tracking-tight drop-shadow-2xl mb-4"
                style="font-size: clamp(1.75rem, 5vw, 3.5rem);"
              >
                {{ item.title }}
              </h1>

              <!-- Phụ đề -->
              <p
                v-if="item.subtitle"
                class="text-stone-300/90 line-clamp-2 sm:line-clamp-3 mb-8 leading-relaxed"
                style="font-size: clamp(0.875rem, 1.5vw, 1.1rem); max-width: 600px;"
              >
                {{ item.subtitle }}
              </p>

              <!-- Nút CTA -->
              <div class="flex items-center gap-3 flex-wrap">
                <NuxtLink
                  v-if="item.link"
                  :to="item.link"
                  class="gold-btn"
                >
                  {{ item.ctaText || 'Xem Chi Tiết' }}
                  <UIcon name="i-heroicons-arrow-right-20-solid" class="w-4 h-4" />
                </NuxtLink>

                <NuxtLink
                  to="/leadership"
                  class="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white border border-white/30 backdrop-blur-sm hover:bg-white/15 transition-all duration-300"
                >
                  Về Ban Điều Hành
                </NuxtLink>
              </div>
            </div>
          </div>
        </template>
      </UCarousel>
    </div>

    <!-- ══════════════════════════════════════════════════════════════
         FLOATING SEARCH BAR — Glassmorphism nép chân banner
    ══════════════════════════════════════════════════════════════════ -->
    <div class="absolute -bottom-7 left-1/2 -translate-x-1/2 w-[92%] max-w-2xl z-30">
      <form
        class="relative p-2 rounded-2xl flex items-center gap-2 transition-all duration-500 focus-within:shadow-[0_15px_50px_rgba(201,169,110,0.3)]"
        style="
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow: 0 15px 40px rgba(26,58,107,0.18);
          border: 1px solid rgba(201,169,110,0.25);
        "
        @submit.prevent="handleSearch"
      >
        <div class="flex-1 flex items-center pl-2 gap-2">
          <UIcon
            name="i-heroicons-magnifying-glass-20-solid"
            class="w-5 h-5 shrink-0 transition-colors duration-300"
            style="color: #c9a96e;"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tra cứu điểm, thông báo, bài viết giáo lý..."
            class="w-full bg-transparent border-none text-stone-800 dark:text-stone-100 placeholder-stone-400 text-sm sm:text-base focus:outline-none"
          >
        </div>
        <button
          type="submit"
          class="premium-btn shrink-0 text-sm px-5 sm:px-7 py-2.5"
        >
          Tìm Kiếm
        </button>
      </form>
    </div>

    <!-- ══════════════════════════════════════════════════════════════
         QUICK STATS BAR — Thống kê nhanh dưới hero
    ══════════════════════════════════════════════════════════════════ -->
    <div class="mt-20 px-4 sm:px-6">
      <div class="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="stat in quickStats"
          :key="stat.label"
          class="sacred-card p-5 text-center group cursor-default"
        >
          <div class="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style="background: linear-gradient(135deg, rgba(26,58,107,0.08), rgba(201,169,110,0.08));"
          >
            <UIcon :name="stat.icon" class="w-5 h-5" style="color: #c9a96e;" />
          </div>
          <div class="font-black text-2xl font-serif" style="color: #1a3a6b;">{{ stat.value }}</div>
          <div class="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-0.5 tracking-wide uppercase">{{ stat.label }}</div>
        </div>
      </div>
    </div>

  </div>
</template>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-48"></a>📄 [48/71] File: `web-portal/app/components/home/NewsAndAnnouncementsSection.vue`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** Home Components (Trang chủ) | **Số dòng:** 253 | **Kích thước:** 11.0 KB

```markup
<script setup lang="ts">
interface NewsArticle {
  id: string
  title: string
  imageUrl: string
  category: string
}

interface Announcement {
  id: string
  title: string
  isUrgent: boolean
  createdDate: string
}

const config = useRuntimeConfig()

const { data: news } = await useFetch<NewsArticle[]>('/api/news/catholic?limit=4', {
  baseURL: config.public.apiBase
})

const { data: announcements } = await useFetch<Announcement[]>('/api/announcement?limit=5', {
  baseURL: config.public.apiBase
})
</script>

<template>
  <div class="flex flex-col gap-12 mb-10 relative">

    <!-- Ambient glow (dark mode) -->
    <div class="hidden dark:block absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-1/2 rounded-full pointer-events-none z-0"
      style="background: radial-gradient(ellipse, rgba(26,58,107,0.08) 0%, transparent 70%); filter: blur(80px);"
    />

    <!-- ══════════════════════════════════════════════════════════════
         TIN TỨC MỚI NHẤT — Magazine-style Layout
    ══════════════════════════════════════════════════════════════════ -->
    <div class="relative z-10 w-full">
      <!-- Section Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <!-- Accent bar -->
          <div class="gold-accent-line" />
          <div>
            <h2 class="section-heading">Tin Tức Mới Nhất</h2>
            <p class="text-sm text-stone-500 dark:text-stone-400 mt-0.5">Tin tức Công giáo & Giáo xứ</p>
          </div>
        </div>
        <NuxtLink
          to="/news"
          class="inline-flex items-center gap-1.5 text-sm font-bold transition-all duration-300 hover:-translate-x-0.5 group"
          style="color: #c9a96e;"
        >
          Xem tất cả
          <UIcon name="i-heroicons-arrow-right-20-solid" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </NuxtLink>
      </div>

      <!-- News Grid: Magazine style -->
      <div
        v-if="news && news.length > 0"
        class="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        <!-- Bài viết nổi bật (Featured - chiếm 2 cột) -->
        <NuxtLink
          :to="`/news`"
          class="md:col-span-2 group cursor-pointer relative rounded-3xl overflow-hidden block"
          style="height: 380px; box-shadow: 0 8px 30px rgba(26,58,107,0.12);"
        >
          <img
            :src="news[0]?.imageUrl"
            :alt="news[0]?.title"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          >
          <!-- Gradient overlay -->
          <div class="absolute inset-0"
            style="background: linear-gradient(to top, rgba(13,17,23,0.92) 0%, rgba(13,17,23,0.3) 50%, transparent 100%);"
          />
          <!-- Viền vàng bottom -->
          <div class="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
            style="background: linear-gradient(90deg, #c9a96e, #e8c98a);"
          />
          <!-- Content -->
          <div class="absolute inset-0 flex flex-col justify-end p-7">
            <!-- Category badge -->
            <span class="inline-flex self-start px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase mb-3"
              style="background: rgba(201,169,110,0.2); color: #e8c98a; border: 1px solid rgba(201,169,110,0.3); backdrop-filter: blur(8px);"
            >
              {{ news[0]?.category }}
            </span>
            <h3 class="text-2xl md:text-3xl font-black text-white leading-snug group-hover:text-gold transition-colors duration-300 drop-shadow font-serif"
              style="--tw-text-opacity: 1;"
            >
              {{ news[0]?.title }}
            </h3>
            <!-- Read more arrow -->
            <div class="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <span class="text-sm font-bold" style="color: #c9a96e;">Đọc tiếp</span>
              <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" style="color: #c9a96e;" />
            </div>
          </div>
        </NuxtLink>

        <!-- Các bài viết phụ (1 cột, list dọc) -->
        <div class="md:col-span-1 flex flex-col gap-4">
          <NuxtLink
            v-for="item in news.slice(1, 4)"
            :key="item.id"
            to="/news"
            class="group flex gap-4 rounded-2xl border border-transparent p-3 transition-all duration-300 hover:border-gold/20 hover:-translate-y-0.5 cursor-pointer"
            style="background: white; box-shadow: 0 2px 12px rgba(26,58,107,0.06);"
          >
            <!-- Thumbnail -->
            <div class="w-[90px] h-[90px] rounded-xl overflow-hidden shrink-0 shadow-sm">
              <img
                :src="item.imageUrl"
                :alt="item.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              >
            </div>
            <!-- Text -->
            <div class="flex flex-col justify-between py-1 flex-1 min-w-0">
              <!-- Category -->
              <span class="text-[10px] font-black tracking-widest uppercase mb-1" style="color: #c9a96e;">
                {{ item.category }}
              </span>
              <h4 class="font-bold text-sm text-stone-800 dark:text-stone-100 group-hover:text-navy line-clamp-3 leading-snug transition-colors duration-200"
                style="--hover-color: #1a3a6b;"
              >
                {{ item.title }}
              </h4>
              <span class="text-xs text-stone-400 dark:text-stone-500 mt-1 flex items-center gap-1">
                <UIcon name="i-heroicons-arrow-right-circle" class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span class="opacity-0 group-hover:opacity-100 transition-opacity" style="color: #c9a96e;">Xem thêm</span>
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Skeleton / Empty state -->
      <div v-else class="flex items-center justify-center h-40 rounded-2xl border border-dashed"
        style="border-color: rgba(201,169,110,0.2); background: rgba(201,169,110,0.03);"
      >
        <p class="text-stone-400 text-sm">Đang tải tin tức...</p>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════
         BẢNG THÔNG BÁO — Modern Premium Board
    ══════════════════════════════════════════════════════════════════ -->
    <div class="relative z-10 w-full sacred-card p-6 md:p-8">

      <!-- Section Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <div class="gold-accent-line" />
          <div>
            <h2 class="section-heading">Bảng Thông Báo</h2>
            <p class="text-sm text-stone-500 dark:text-stone-400 mt-0.5">Cập nhật mới nhất từ Ban Điều Hành</p>
          </div>
        </div>
        <NuxtLink
          to="/thong-bao"
          class="inline-flex items-center gap-1.5 text-sm font-bold transition-all duration-300 hover:-translate-x-0.5 group"
          style="color: #c9a96e;"
        >
          Xem bảng tin
          <UIcon name="i-heroicons-arrow-right-20-solid" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </NuxtLink>
      </div>

      <!-- Announcement list -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <NuxtLink
          v-for="(item, index) in announcements"
          :key="item.id"
          to="/thong-bao"
          class="group flex items-start gap-4 p-4 md:p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
          :style="item.isUrgent
            ? 'background: rgba(139,26,26,0.04); border-color: rgba(139,26,26,0.15);'
            : 'background: rgba(26,58,107,0.03); border-color: rgba(201,169,110,0.15);'"
        >
          <!-- Icon / Số thứ tự -->
          <div class="shrink-0 mt-0.5">
            <!-- Icon khẩn cấp -->
            <div v-if="item.isUrgent"
              class="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              style="background: rgba(139,26,26,0.1);"
            >
              <UIcon
                name="i-heroicons-exclamation-triangle-solid"
                class="w-5 h-5"
                style="color: #8b1a1a;"
              />
            </div>
            <!-- Số thứ tự thường -->
            <div v-else
              class="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm font-black text-sm font-serif"
              style="background: linear-gradient(135deg, rgba(26,58,107,0.08), rgba(201,169,110,0.08)); color: #1a3a6b;"
            >
              {{ index + 1 }}
            </div>
          </div>

          <!-- Nội dung -->
          <div class="flex-1 min-w-0">
            <h4
              class="font-bold text-[15px] leading-snug mb-2 transition-colors duration-200 group-hover:text-navy line-clamp-2"
              :class="item.isUrgent ? 'text-red-800 dark:text-red-400' : 'text-stone-800 dark:text-stone-100'"
            >
              {{ item.title }}
            </h4>
            <div class="flex items-center gap-3">
              <!-- Ngày đăng -->
              <span class="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400">
                <UIcon name="i-heroicons-calendar" class="w-3.5 h-3.5" />
                {{ new Date(item.createdDate).toLocaleDateString('vi-VN') }}
              </span>
              <!-- Badge khẩn -->
              <UBadge
                v-if="item.isUrgent"
                color="error"
                variant="subtle"
                size="xs"
                class="font-bold"
              >
                Khẩn Cấp
              </UBadge>
            </div>
          </div>

          <!-- Arrow -->
          <UIcon
            name="i-heroicons-chevron-right"
            class="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300 self-center"
            style="color: #c9a96e;"
          />
        </NuxtLink>
      </div>

      <!-- Empty state -->
      <div v-if="!announcements || announcements.length === 0"
        class="flex flex-col items-center justify-center py-10 text-center"
      >
        <UIcon name="i-heroicons-bell-slash" class="w-10 h-10 mb-2 opacity-20" style="color: #c9a96e;" />
        <p class="text-sm text-stone-400">Chưa có thông báo nào.</p>
      </div>
    </div>

  </div>
</template>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-49"></a>📄 [49/71] File: `web-portal/app/components/home/SpiritualSection.vue`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** Home Components (Trang chủ) | **Số dòng:** 219 | **Kích thước:** 9.6 KB

```markup
<script setup lang="ts">
interface LiturgicalEvent {
  id: string
  date: string
  title: string
  color: string
  level: string
  isOverride: boolean
  wordOfGodOverride?: string | null
  wordOfGodReference?: string | null
}

const config = useRuntimeConfig()

// Fetch today's Liturgical Event
const { data: liturgicalToday } = await useFetch<LiturgicalEvent>('/api/liturgical/today', {
  baseURL: config.public.apiBase
})

// Lời Chúa: dùng override từ API, hoặc fallback
const wordOfGod = computed(() => {
  if (liturgicalToday.value?.wordOfGodOverride) {
    return {
      text: liturgicalToday.value.wordOfGodOverride,
      reference: liturgicalToday.value.wordOfGodReference || 'Lời Chúa'
    }
  }
  return {
    text: '\"Thầy là đường, là sự thật và là sự sống. Không ai đến được với Chúa Cha mà không qua Thầy.\"',
    reference: 'Ga 14, 6'
  }
})

const wordOfGodContent = computed(() => wordOfGod.value.text)
const wordOfGodReference = computed(() => wordOfGod.value.reference)

// Ánh xạ màu phụng vụ sang màu thực tế
const liturgicalColorMap: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  'Đỏ':   { bg: 'rgba(139,26,26,0.08)',  text: '#8b1a1a', dot: '#c0392b', label: 'Màu Đỏ' },
  'Tím':  { bg: 'rgba(76,29,149,0.08)',  text: '#4c1d95', dot: '#7c3aed', label: 'Màu Tím' },
  'Xanh': { bg: 'rgba(26,58,107,0.08)',  text: '#1a3a6b', dot: '#2a5298', label: 'Màu Xanh' },
  'Trắng':{ bg: 'rgba(201,169,110,0.1)', text: '#a07840', dot: '#c9a96e', label: 'Màu Trắng' },
  'Xanh lá':{ bg: 'rgba(22,101,52,0.08)',text: '#166534', dot: '#16a34a', label: 'Màu Xanh Lá' },
  'Hồng': { bg: 'rgba(219,39,119,0.08)', text: '#be185d', dot: '#db2777', label: 'Màu Hồng' },
}

const liturgicalStyle = computed(() => {
  const color = liturgicalToday.value?.color || ''
  return liturgicalColorMap[color] || { bg: 'rgba(26,58,107,0.06)', text: '#1a3a6b', dot: '#c9a96e', label: `Màu ${color}` }
})
</script>

<template>
  <div class="flex flex-col gap-8 mb-10">

    <!-- ══════════════════════════════════════════════════════════════
         LỜI CHÚA — Beautiful Quote Card với Glassmorphism
    ══════════════════════════════════════════════════════════════════ -->
    <div
      class="relative w-full rounded-3xl overflow-hidden"
      style="box-shadow: 0 20px 60px rgba(26,58,107,0.15);"
    >
      <!-- Ảnh nền -->
      <div
        class="absolute inset-0 bg-center bg-cover"
        style="background-image: url('https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=2000&auto=format&fit=crop');"
      />
      <!-- Overlay Navy -->
      <div class="absolute inset-0"
        style="background: linear-gradient(135deg, rgba(26,58,107,0.92) 0%, rgba(42,82,152,0.85) 50%, rgba(139,26,26,0.75) 100%);"
      />
      <!-- Họa tiết chìm thánh giá -->
      <div class="absolute inset-0 cross-pattern opacity-30" />

      <!-- Bokeh particles -->
      <div class="absolute top-8 right-12 w-40 h-40 rounded-full opacity-20"
        style="background: radial-gradient(circle, #c9a96e 0%, transparent 70%); animation: float 7s ease-in-out infinite;"
      />
      <div class="absolute bottom-6 left-8 w-24 h-24 rounded-full opacity-15"
        style="background: radial-gradient(circle, #e8c98a 0%, transparent 70%); animation: float 5s ease-in-out 2s infinite;"
      />

      <!-- Nội dung -->
      <div class="relative z-10 p-8 md:p-12">
        <!-- Header -->
        <div class="flex items-center gap-4 mb-8">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
            style="background: linear-gradient(135deg, rgba(201,169,110,0.3), rgba(232,201,138,0.2)); border: 1px solid rgba(201,169,110,0.4);"
          >
            <UIcon name="i-heroicons-book-open" class="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 class="text-xl font-black text-white tracking-wide font-serif">Suy Niệm Lời Chúa</h2>
            <p class="text-xs font-medium tracking-widest uppercase" style="color: #e8c98a;">
              {{ new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
            </p>
          </div>
        </div>

        <!-- Quote Card — Glassmorphism -->
        <div class="relative p-8 md:p-10 rounded-2xl"
          style="
            background: rgba(255,255,255,0.08);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255,255,255,0.15);
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);
          "
        >
          <!-- Dấu ngoặc kép trang trọng -->
          <span class="absolute -top-5 -left-2 font-serif leading-none select-none"
            style="font-size: 8rem; color: rgba(201,169,110,0.3); line-height: 1;"
          >"</span>

          <p class="font-serif text-lg md:text-xl lg:text-2xl text-white/95 leading-loose italic mb-6 relative z-10">
            {{ wordOfGodContent }}
          </p>

          <!-- Reference -->
          <div class="flex items-center justify-end gap-3">
            <div class="h-px w-16" style="background: linear-gradient(90deg, transparent, #c9a96e);" />
            <span class="font-black tracking-[0.2em] uppercase text-sm"
              style="color: #e8c98a;"
            >{{ wordOfGodReference }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════
         LỊCH PHỤNG VỤ — Card với màu phụng vụ thực sự
    ══════════════════════════════════════════════════════════════════ -->
    <div class="sacred-card p-6 md:p-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
        <div class="flex items-center gap-4 flex-1">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
            style="background: linear-gradient(135deg, rgba(76,29,149,0.1), rgba(76,29,149,0.05)); border: 1px solid rgba(76,29,149,0.15);"
          >
            <UIcon name="i-heroicons-calendar-days" class="w-7 h-7" style="color: #7c3aed;" />
          </div>
          <div>
            <h2 class="text-xl font-black text-stone-800 dark:text-white font-serif leading-tight">
              Lịch Phụng Vụ Hôm Nay
            </h2>
            <p class="text-sm font-medium text-stone-500 dark:text-stone-400">
              {{ new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
            </p>
          </div>
        </div>

        <!-- Indicator màu phụng vụ khi có dữ liệu -->
        <div v-if="liturgicalToday" class="flex items-center gap-2 self-start md:self-auto">
          <!-- Animated dot màu phụng vụ -->
          <div class="w-4 h-4 rounded-full liturgy-dot"
            :style="{ backgroundColor: liturgicalStyle.dot }"
          />
          <span class="text-sm font-bold"
            :style="{ color: liturgicalStyle.text }"
          >{{ liturgicalStyle.label }}</span>
        </div>
      </div>

      <!-- Card nội dung phụng vụ -->
      <div
        v-if="liturgicalToday"
        class="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 p-5 md:p-6 rounded-2xl border transition-all duration-300"
        :style="{
          background: liturgicalStyle.bg,
          borderColor: liturgicalStyle.dot + '30'
        }"
      >
        <div class="flex-1">
          <h3 class="font-black text-stone-800 dark:text-white text-lg md:text-xl leading-tight mb-3 font-serif">
            {{ liturgicalToday.title }}
          </h3>
          <div class="flex flex-wrap gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
              :style="{ background: liturgicalStyle.bg, borderColor: liturgicalStyle.dot + '50', color: liturgicalStyle.text }"
            >
              <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: liturgicalStyle.dot }" />
              {{ liturgicalStyle.label }}
            </span>
            <UBadge
              color="neutral"
              variant="subtle"
              size="sm"
              class="font-semibold"
            >
              {{ liturgicalToday.level }}
            </UBadge>
          </div>
        </div>
        <UIcon
          name="i-heroicons-arrow-right-circle"
          class="hidden md:block w-8 h-8 opacity-20 dark:opacity-10"
        />
      </div>

      <!-- Không có dữ liệu -->
      <div
        v-else
        class="flex flex-col items-center justify-center p-10 text-center rounded-2xl border border-dashed"
        style="border-color: rgba(201,169,110,0.2); background: rgba(201,169,110,0.04);"
      >
        <UIcon
          name="i-heroicons-calendar-days"
          class="w-12 h-12 mb-3 opacity-30"
          style="color: #c9a96e;"
        />
        <p class="text-sm font-medium text-stone-500 dark:text-stone-400">
          Không có dữ liệu lịch phụng vụ hôm nay.
        </p>
      </div>
    </div>

  </div>
</template>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-50"></a>📄 [50/71] File: `web-portal/app/components/home/TenCommandmentsSection.vue`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** Home Components (Trang chủ) | **Số dòng:** 200 | **Kích thước:** 8.7 KB

```markup
<script setup lang="ts">
// 10 Điều Răn — phân nhóm theo bổn phận
const commandmentsLeft = [
  { roman: 'I',   text: 'Thờ phượng một Đức Chúa Trời và kính mến Người trên hết mọi sự.' },
  { roman: 'II',  text: 'Chớ kêu tên Đức Chúa Trời vô cớ.' },
  { roman: 'III', text: 'Giữ ngày Chúa Nhật.' },
]

const commandmentsRight = [
  { roman: 'IV',  text: 'Thảo kính cha mẹ.' },
  { roman: 'V',   text: 'Chớ giết người.' },
  { roman: 'VI',  text: 'Chớ làm sự dâm dục.' },
  { roman: 'VII', text: 'Chớ lấy của người.' },
  { roman: 'VIII',text: 'Chớ làm chứng dối.' },
  { roman: 'IX',  text: 'Chớ muốn vợ chồng người.' },
  { roman: 'X',   text: 'Chớ tham của người.' },
]
</script>

<template>
  <!-- ══════════════════════════════════════════════════════════════
       MƯỜI ĐIỀU RĂN — Premium Sacred Section
  ══════════════════════════════════════════════════════════════════ -->
  <div class="relative rounded-3xl overflow-hidden mb-12"
    style="
      background: linear-gradient(160deg, #faf8f3 0%, #f0ece0 50%, #faf8f3 100%);
      box-shadow: 0 8px 40px rgba(26,58,107,0.08);
      border: 1px solid rgba(201,169,110,0.2);
    "
  >
    <!-- Họa tiết watermark thánh giá chìm -->
    <div class="absolute inset-0 cross-pattern opacity-60 pointer-events-none" />

    <!-- Bokeh decorative -->
    <div class="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
      style="background: radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%);"
    />
    <div class="absolute bottom-0 left-0 w-56 h-56 rounded-full pointer-events-none"
      style="background: radial-gradient(circle, rgba(139,26,26,0.05) 0%, transparent 70%);"
    />

    <!-- Icon chìm góc trái -->
    <UIcon
      name="i-heroicons-book-open"
      class="w-52 h-52 absolute -bottom-12 -left-12 opacity-[0.04] select-none pointer-events-none"
      style="color: #1a3a6b;"
    />
    <!-- Icon chìm góc phải -->
    <UIcon
      name="i-heroicons-scale"
      class="w-52 h-52 absolute -top-12 -right-12 opacity-[0.04] select-none pointer-events-none"
      style="color: #8b1a1a;"
    />

    <!-- Content -->
    <div class="relative z-10 p-8 md:p-12">

      <!-- Section Title -->
      <div class="text-center mb-10">
        <!-- Gold pill -->
        <div class="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black tracking-[0.2em] uppercase mb-4"
          style="background: rgba(201,169,110,0.12); color: #a07840; border: 1px solid rgba(201,169,110,0.25);"
        >
          ✝ Luật Chúa
        </div>

        <h2 class="text-3xl md:text-4xl lg:text-5xl font-black font-serif mb-3"
          style="color: #1a3a6b;"
        >
          Mười Điều Răn
        </h2>

        <p class="italic text-stone-500 dark:text-stone-400 text-base">
          Luật Chúa ban cho Môsê trên núi Sinai
        </p>

        <!-- Sacred divider -->
        <div class="sacred-divider mt-6 max-w-xs mx-auto">
          <span class="text-lg" style="color: #c9a96e;">✦</span>
        </div>
      </div>

      <!-- Two columns -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-5xl mx-auto">

        <!-- ── Cột Trái: Bổn Phận Với Thiên Chúa ── -->
        <div class="flex flex-col gap-4">
          <!-- Column Label -->
          <div class="flex items-center justify-center gap-3 mb-2">
            <div class="h-px flex-1" style="background: linear-gradient(90deg, transparent, rgba(201,169,110,0.4));" />
            <span class="text-xs font-black tracking-[0.18em] uppercase px-3"
              style="color: #a07840;"
            >Bổn Phận Với Thiên Chúa</span>
            <div class="h-px flex-1" style="background: linear-gradient(90deg, rgba(201,169,110,0.4), transparent);" />
          </div>

          <div
            v-for="(cmd, index) in commandmentsLeft"
            :key="index"
            class="group relative rounded-2xl p-5 border transition-all duration-400 overflow-hidden cursor-default"
            style="
              background: rgba(255,255,255,0.85);
              border-color: rgba(201,169,110,0.15);
              box-shadow: 0 2px 12px rgba(26,58,107,0.05);
            "
          >
            <!-- Hover effect background -->
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl"
              style="background: linear-gradient(135deg, rgba(26,58,107,0.04), rgba(201,169,110,0.04));"
            />
            <!-- Border glow khi hover -->
            <div class="absolute inset-0 rounded-2xl border border-transparent group-hover:border-gold/30 transition-colors duration-400"
              style="border-color: rgba(201,169,110,0);"
            />

            <!-- Watermark Roman numeral -->
            <div class="absolute -right-2 -bottom-6 font-black font-serif select-none pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100"
              style="font-size: 5rem; color: rgba(26,58,107,0.06); line-height: 1;"
            >
              {{ cmd.roman }}
            </div>

            <!-- Content -->
            <div class="relative z-10 flex items-start gap-4">
              <!-- Roman numeral badge -->
              <div class="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-black font-serif text-sm shadow-sm"
                style="
                  background: linear-gradient(135deg, #1a3a6b, #2a5298);
                  color: #c9a96e;
                  min-width: 3rem;
                  box-shadow: 0 2px 8px rgba(26,58,107,0.25);
                "
              >
                {{ cmd.roman }}
              </div>
              <p class="font-semibold text-base text-stone-800 dark:text-stone-100 leading-relaxed pt-2">
                {{ cmd.text }}
              </p>
            </div>
          </div>
        </div>

        <!-- ── Cột Phải: Bổn Phận Với Tha Nhân ── -->
        <div class="flex flex-col gap-4">
          <!-- Column Label -->
          <div class="flex items-center justify-center gap-3 mb-2">
            <div class="h-px flex-1" style="background: linear-gradient(90deg, transparent, rgba(139,26,26,0.3));" />
            <span class="text-xs font-black tracking-[0.18em] uppercase px-3"
              style="color: #8b1a1a;"
            >Bổn Phận Với Tha Nhân</span>
            <div class="h-px flex-1" style="background: linear-gradient(90deg, rgba(139,26,26,0.3), transparent);" />
          </div>

          <div
            v-for="(cmd, index) in commandmentsRight"
            :key="index"
            class="group relative rounded-2xl p-5 border transition-all duration-400 overflow-hidden cursor-default"
            style="
              background: rgba(255,255,255,0.85);
              border-color: rgba(139,26,26,0.1);
              box-shadow: 0 2px 12px rgba(26,58,107,0.05);
            "
          >
            <!-- Hover effect -->
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl"
              style="background: linear-gradient(135deg, rgba(139,26,26,0.03), rgba(201,169,110,0.04));"
            />

            <!-- Watermark Roman numeral -->
            <div class="absolute -right-2 -bottom-6 font-black font-serif select-none pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100"
              style="font-size: 5rem; color: rgba(139,26,26,0.06); line-height: 1;"
            >
              {{ cmd.roman }}
            </div>

            <!-- Content -->
            <div class="relative z-10 flex items-start gap-4">
              <!-- Roman numeral badge — màu đỏ -->
              <div class="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-black font-serif text-sm shadow-sm"
                style="
                  background: linear-gradient(135deg, #8b1a1a, #b02a2a);
                  color: #e8c98a;
                  min-width: 3rem;
                  box-shadow: 0 2px 8px rgba(139,26,26,0.25);
                "
              >
                {{ cmd.roman }}
              </div>
              <p class="font-semibold text-base text-stone-800 dark:text-stone-100 leading-relaxed pt-2">
                {{ cmd.text }}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-51"></a>📄 [51/71] File: `web-portal/app/components/layout/FooterSection.vue`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** Layout Components | **Số dòng:** 185 | **Kích thước:** 7.5 KB

```markup
<script setup lang="ts">
const currentYear = new Date().getFullYear()

const quickLinks = [
  { label: 'Tin Tức Mới', to: '/news' },
  { label: 'Thông Báo Sứ Đoàn', to: '/thong-bao' },
  { label: 'Ban Điều Hành', to: '/leadership' },
  { label: 'Tài Liệu Giáo Lý', to: '/library' },
  { label: 'Quản Lý Đoàn Sinh', to: 'http://localhost:3000', external: true }
]
</script>

<template>
  <footer class="relative mt-24 border-t overflow-hidden bg-white dark:bg-[#0a0d13]" style="border-color: rgba(201,169,110,0.25);">
    <!-- Dải màu 5 Ngành TNTT tinh tế với hiệu ứng gradient -->
    <div class="flex h-2 w-full shadow-sm">
      <div class="flex-1 bg-pink-500" title="Ngành Ấu Nhi" />
      <div class="flex-1 bg-blue-500" title="Ngành Thiếu Nhi" />
      <div class="flex-1 bg-emerald-500" title="Ngành Nghĩa Sĩ" />
      <div class="flex-1 bg-red-600" title="Ngành Hiệp Sĩ" />
      <div class="flex-1 bg-amber-700" title="Huynh Trưởng" />
    </div>

    <!-- Họa tiết Watermark chìm ở góc -->
    <UIcon
      name="i-heroicons-globe-asia-australia"
      class="absolute -bottom-24 -right-24 w-[420px] h-[420px] opacity-[0.03] dark:opacity-[0.02] z-0 select-none pointer-events-none"
      style="color: #1a3a6b;"
    />

    <div class="relative z-10 w-full max-w-[1240px] mx-auto px-6 py-16 sm:py-20">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-14">
        <!-- Cột 1: Nhận diện & Sứ Mạng (5 cột) -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <div class="flex items-center gap-4">
            <div
              class="w-16 h-16 rounded-2xl flex flex-col items-center justify-center shadow-xl shrink-0 border-2"
              style="
                background: linear-gradient(135deg, #1a3a6b, #2a5298);
                border-color: #c9a96e;
              "
            >
              <span class="text-white font-black text-2xl leading-none">✝</span>
              <span class="text-white font-extrabold text-[9px] tracking-widest mt-0.5" style="color: #e8c98a;">TNTT</span>
            </div>
            <div>
              <span class="text-[11px] font-black uppercase tracking-[0.25em]" style="color: #a07840;">
                Phong Trào Giới Trẻ
              </span>
              <h2 class="text-2xl font-black font-serif leading-tight uppercase" style="color: #1a3a6b;">
                Thiếu Nhi Thánh Thể
              </h2>
            </div>
          </div>

          <div
            class="pl-4 py-1 border-l-4 rounded-r-xl"
            style="
              border-color: #c9a96e;
              background: linear-gradient(90deg, rgba(201,169,110,0.08), transparent);
            "
          >
            <p class="text-base font-serif italic text-stone-700 dark:text-stone-300 font-semibold">
              "Cầu Nguyện • Rước Lễ • Hy Sinh • Làm Tông Đồ"
            </p>
          </div>

          <p class="text-sm text-stone-500 dark:text-stone-400 leading-relaxed max-w-sm">
            Cổng thông tin chính thức của Xứ Đoàn. Kết nối phụ huynh, đoàn sinh và ban huynh trưởng trong sứ vụ tông đồ và bồi dưỡng đức tin.
          </p>
        </div>

        <!-- Cột 2: Liên Kết Nhanh (3 cột) -->
        <div class="lg:col-span-3">
          <h3 class="text-xs font-black uppercase tracking-[0.2em] mb-6" style="color: #1a3a6b;">
            Liên Kết Nhanh
          </h3>
          <ul class="flex flex-col gap-3.5">
            <li
              v-for="link in quickLinks"
              :key="link.to"
            >
              <NuxtLink
                :to="link.to"
                :target="link.external ? '_blank' : undefined"
                class="text-sm text-stone-600 dark:text-stone-400 hover:text-navy font-medium transition-all duration-200 flex items-center gap-2 group"
              >
                <UIcon
                  name="i-heroicons-chevron-right"
                  class="w-4 h-4 text-stone-300 group-hover:translate-x-1 transition-all duration-200"
                  style="color: #c9a96e;"
                />
                <span>{{ link.label }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Cột 3: Liên hệ (4 cột) -->
        <div class="lg:col-span-4">
          <h3 class="text-xs font-black uppercase tracking-[0.2em] mb-6" style="color: #1a3a6b;">
            Văn Phòng Xứ Đoàn
          </h3>
          <ul class="flex flex-col gap-4 text-sm text-stone-600 dark:text-stone-400">
            <li class="flex items-start gap-3">
              <div
                class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                style="background: rgba(26,58,107,0.05); border-color: rgba(201,169,110,0.25);"
              >
                <UIcon
                  name="i-heroicons-map-pin"
                  class="w-4 h-4"
                  style="color: #1a3a6b;"
                />
              </div>
              <p class="mt-1 leading-relaxed">
                Nhà Mục Vụ Giáo Xứ — Phòng Sinh Hoạt TNTT<br>
                <span class="text-xs text-stone-400">Giờ sinh hoạt: Chiều Chúa Nhật hàng tuần</span>
              </p>
            </li>
            <li class="flex items-center gap-3">
              <div
                class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                style="background: rgba(26,58,107,0.05); border-color: rgba(201,169,110,0.25);"
              >
                <UIcon
                  name="i-heroicons-envelope"
                  class="w-4 h-4"
                  style="color: #1a3a6b;"
                />
              </div>
              <a
                href="mailto:contact@xudoan.org"
                class="hover:underline transition-colors"
                style="color: #1a3a6b;"
              >
                contact@xudoan.org
              </a>
            </li>
          </ul>

          <div class="mt-6 pt-6 border-t flex items-center gap-3" style="border-color: rgba(201,169,110,0.2);">
            <span class="text-xs text-stone-400">Mạng xã hội:</span>
            <div class="flex gap-2">
              <UButton
                color="neutral"
                variant="soft"
                icon="i-simple-icons-facebook"
                size="xs"
                class="rounded-lg hover:scale-105 transition-transform"
              />
              <UButton
                color="neutral"
                variant="soft"
                icon="i-simple-icons-youtube"
                size="xs"
                class="rounded-lg hover:scale-105 transition-transform"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bản quyền cuối trang -->
    <div
      class="relative z-10 w-full border-t py-5"
      style="
        background: rgba(26,58,107,0.03);
        border-color: rgba(201,169,110,0.18);
      "
    >
      <div class="w-full max-w-[1240px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
        <p>
          &copy; {{ currentYear }} Hệ Thống Giáo Lý & Thiếu Nhi Thánh Thể. Mọi quyền được bảo lưu.
        </p>
        <div class="flex gap-5">
          <NuxtLink to="#" class="hover:underline" style="color: #a07840;">Quy Chế Sinh Hoạt</NuxtLink>
          <NuxtLink to="#" class="hover:underline" style="color: #a07840;">Bảo Vệ Thiếu Nhi</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-52"></a>📄 [52/71] File: `web-portal/app/components/MarqueeAnnouncement.vue`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** UI Components (Dùng chung) | **Số dòng:** 27 | **Kích thước:** 1.4 KB

```markup
<template>
  <div class="w-full bg-amber-50 border-y border-amber-200 overflow-hidden py-2 mb-6 shadow-sm">
    <div class="flex items-center">
      <div class="bg-amber-500 text-white font-bold px-3 py-1 text-sm whitespace-nowrap z-10 uppercase tracking-widest shadow-[2px_0_5px_rgba(0,0,0,0.1)]">
        Thông Báo
      </div>
      <div class="flex-1 overflow-hidden relative flex items-center h-full">
        <div class="animate-marquee whitespace-nowrap flex items-center gap-10 hover:[animation-play-state:paused] cursor-pointer pl-4">
          <span class="text-sm font-semibold text-catholic-red">
            🔔 Lễ Khai Giảng Năm Học Giáo Lý 2026-2027 vào lúc 7:30 Chúa Nhật tuần này!
          </span>
          <span class="text-sm text-slate-700 font-medium">
            Mời phụ huynh đăng ký mua đồng phục Thiếu Nhi Thánh Thể tại văn phòng Ban Học Vụ trước ngày 20/08.
          </span>
          <span class="text-sm text-slate-700 font-medium">
            Lịch thi học kỳ I sẽ diễn ra vào tháng 12/2026. Chúc các em học viên ôn tập tốt!
          </span>
          <!-- Lặp lại để hiệu ứng chạy mượt -->
          <span class="text-sm font-semibold text-catholic-red">
            🔔 Lễ Khai Giảng Năm Học Giáo Lý 2026-2027 vào lúc 7:30 Chúa Nhật tuần này!
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-53"></a>📄 [53/71] File: `web-portal/app/components/NewsGrid.vue`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** UI Components (Dùng chung) | **Số dòng:** 87 | **Kích thước:** 3.8 KB

```markup
<template>
  <section class="max-w-6xl mx-auto px-4 py-16">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-3xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
        Tin Tức & Sự Kiện
      </h2>
      <NuxtLink
        to="/news"
        class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
      >
        Xem tất cả tin tức &rarr;
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- News Cards (Mocked) -->
      <article
        v-for="(news, index) in newsList"
        :key="index"
        class="bg-white dark:bg-stone-900 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-stone-100 dark:border-stone-800 flex flex-col overflow-hidden group"
      >
        <div class="relative h-48 overflow-hidden">
          <img
            :src="news.image"
            :alt="news.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent" />
          <div class="absolute bottom-3 left-4">
            <span
              :class="news.tagColor"
              class="px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm"
            >
              {{ news.tag }}
            </span>
          </div>
        </div>
        <div class="p-5 flex-1 flex flex-col">
          <h3 class="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
            {{ news.title }}
          </h3>
          <p class="text-sm text-stone-600 dark:text-stone-400 mb-4 line-clamp-2">
            {{ news.summary }}
          </p>
          <div class="mt-auto pt-4 flex items-center justify-between text-xs text-stone-500 dark:text-stone-500 border-t border-stone-100 dark:border-stone-800">
            <span>{{ news.date }}</span>
            <span class="flex items-center gap-1"><UIcon name="i-heroicons-clock" /> {{ news.readTime }}</span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
// Mock data - In the future, this should fetch from /api/news
const newsList = [
  {
    image: 'https://images.unsplash.com/photo-1596706927429-b6951268686e?q=80&w=600&auto=format&fit=crop',
    tag: 'Ấu Nhi',
    tagColor: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    title: 'Sinh hoạt ngoại khóa khối Ấu Nhi tháng 8',
    summary: 'Các em Ấu nhi đã có một buổi chiều học hỏi giáo lý và vui chơi tràn đầy tiếng cười cùng các Huynh trưởng.',
    date: '25/08/2026',
    readTime: '3 phút đọc'
  },
  {
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop',
    tag: 'Hiệp Sĩ',
    tagColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    title: 'Khóa Tĩnh tâm chuẩn bị Lãnh nhận Bí tích Thêm Sức',
    summary: 'Ban Điều Hành Sứ Đoàn tổ chức khóa tĩnh tâm 2 ngày dành riêng cho các em ngành Hiệp Sĩ chuẩn bị lãnh nhận Bí Tích Thêm Sức.',
    date: '20/08/2026',
    readTime: '5 phút đọc'
  },
  {
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600&auto=format&fit=crop',
    tag: 'Xứ Đoàn',
    tagColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    title: 'Bầu cử Ban Quản Trị Sứ Đoàn nhiệm kỳ 2026-2030',
    summary: 'Kết quả bầu cử Ban Quản Trị mới đã chính thức được công bố sau Thánh Lễ Thiếu Nhi Chúa Nhật vừa qua.',
    date: '15/08/2026',
    readTime: '4 phút đọc'
  }
]
</script>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-54"></a>📄 [54/71] File: `web-portal/app/components/NoticeBoard.vue`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** UI Components (Dùng chung) | **Số dòng:** 80 | **Kích thước:** 3.1 KB

```markup
<template>
  <section
    id="thong-bao"
    class="max-w-6xl mx-auto px-4 -mt-16 relative z-20"
  >
    <div class="bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl shadow-xl shadow-stone-200/50 dark:shadow-none rounded-2xl p-6 border border-stone-100 dark:border-stone-800 transition-colors">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
          <UIcon
            name="i-heroicons-bell-alert"
            class="w-6 h-6 text-red-600 dark:text-red-500"
          />
          Thông báo mới nhất
        </h2>
        <NuxtLink
          to="/thong-bao"
          class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          Xem tất cả &rarr;
        </NuxtLink>
      </div>

      <div class="space-y-3">
        <!-- Notice Items (Mocked) -->
        <div
          v-for="(notice, index) in notices"
          :key="index"
          class="group flex flex-col md:flex-row gap-4 p-4 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors border-l-4"
          :class="notice.isImportant ? 'border-red-500' : 'border-blue-500'"
        >
          <div class="flex-shrink-0 text-sm font-medium text-stone-500 dark:text-stone-400 md:w-28 pt-1">
            {{ notice.date }}
          </div>
          <div>
            <h3 class="font-bold text-stone-800 dark:text-stone-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
              {{ notice.title }}
              <UBadge
                v-if="notice.isImportant"
                color="error"
                variant="subtle"
                size="xs"
                class="ml-2"
              >
                Quan trọng
              </UBadge>
            </h3>
            <p class="text-stone-600 dark:text-stone-400 text-sm mt-1.5 leading-relaxed">
              {{ notice.content }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Mock data - In the future, this should fetch from /api/announcements
const notices = [
  {
    date: '25/08/2026',
    title: 'Thông báo khai giảng năm học Giáo lý mới 2026-2027',
    content: 'Kính thưa quý Phụ huynh, chúa nhật tuần sau Giáo xứ sẽ chính thức khai giảng năm học mới. Thánh lễ lúc 7:30 sáng, sau đó các em sẽ tập trung theo lớp đã được phân bổ.',
    isImportant: true
  },
  {
    date: '20/08/2026',
    title: 'Thay đổi giờ lễ cho khối Ấu Nhi',
    content: 'Do thời tiết nắng nóng, giờ lễ của khối Ấu Nhi sẽ được chuyển lên sớm hơn 30 phút. Phụ huynh vui lòng đưa các em đến đúng giờ.',
    isImportant: false
  },
  {
    date: '15/08/2026',
    title: 'Đăng ký tham gia cắm trại ngành Nghĩa Sĩ',
    content: 'Trại hè sẽ diễn ra vào cuối tháng 8. Các em Nghĩa Sĩ đăng ký trực tiếp cho Huynh trưởng phụ trách lớp trước ngày 22/08.',
    isImportant: false
  }
]
</script>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-55"></a>📄 [55/71] File: `web-portal/app/components/PortalVerifyWidget.vue`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** UI Components (Dùng chung) | **Số dòng:** 154 | **Kích thước:** 5.9 KB

```markup
<template>
  <div class="py-2">
    <form
      id="verify-form"
      class="flex flex-col sm:flex-row gap-3"
      @submit.prevent="search"
    >
      <div class="relative flex-1">
        <UIcon
          name="i-heroicons-user"
          class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 pointer-events-none"
        />
        <input
          id="verify-input"
          v-model="query"
          type="text"
          placeholder="Nhập họ tên đầy đủ hoặc mã đoàn sinh..."
          class="w-full pl-11 pr-4 py-3 rounded-xl border text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 transition-all shadow-sm"
          style="border-color: rgba(201,169,110,0.3); --tw-ring-color: #c9a96e;"
          :disabled="loading"
        >
      </div>

      <button
        id="verify-btn"
        type="submit"
        :disabled="loading || !query.trim()"
        class="premium-btn text-sm px-7 py-3 rounded-xl flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <UIcon
          v-if="loading"
          name="i-heroicons-arrow-path"
          class="w-4 h-4 animate-spin"
        />
        <UIcon
          v-else
          name="i-heroicons-magnifying-glass"
          class="w-4 h-4"
        />
        <span>{{ loading ? 'Đang tra cứu...' : 'Tra Cứu' }}</span>
      </button>
    </form>

    <!-- Kết Quả Hiển Thị Đẹp Mắt -->
    <Transition name="fade">
      <div
        v-if="result"
        class="mt-6 p-5 sm:p-6 rounded-2xl border shadow-md relative overflow-hidden"
        style="
          background: linear-gradient(135deg, rgba(250,248,243,0.98), rgba(240,236,224,0.95));
          border-color: rgba(201,169,110,0.35);
        "
      >
        <div class="flex items-start justify-between gap-4 border-b pb-4" style="border-color: rgba(201,169,110,0.2);">
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md shrink-0"
              style="background: linear-gradient(135deg, #1a3a6b, #2a5298);"
            >
              <UIcon name="i-heroicons-academic-cap" class="w-6 h-6 text-white" />
            </div>
            <div>
              <span class="text-[10px] font-black uppercase tracking-widest" style="color: #a07840;">
                Kết quả hồ sơ
              </span>
              <h3 class="font-black font-serif text-lg sm:text-xl text-navy" style="color: #1a3a6b;">
                {{ result.studentName }}
              </h3>
            </div>
          </div>
          <span
            class="px-3 py-1 rounded-full text-xs font-bold border"
            style="background: rgba(26,58,107,0.08); color: #1a3a6b; border-color: rgba(26,58,107,0.2);"
          >
            Ngành {{ result.branch }}
          </span>
        </div>

        <div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div class="p-3 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-stone-200/50">
            <span class="text-stone-400 block mb-0.5">Lớp Học</span>
            <span class="font-bold text-stone-800 dark:text-stone-200 text-sm">{{ result.className || 'Chưa xếp lớp' }}</span>
          </div>
          <div class="p-3 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-stone-200/50">
            <span class="text-stone-400 block mb-0.5">Điểm Giáo Lý</span>
            <span class="font-black text-sm font-serif" style="color: #1a3a6b;">{{ result.grade ?? 'Chưa chấm' }}</span>
          </div>
          <div class="p-3 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-stone-200/50">
            <span class="text-stone-400 block mb-0.5">Hạnh Kiểm</span>
            <span class="font-bold text-sm" style="color: #166534;">{{ result.conduct ?? 'Tốt' }}</span>
          </div>
          <div class="p-3 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-stone-200/50">
            <span class="text-stone-400 block mb-0.5">Trạng Thái</span>
            <span class="font-bold text-emerald-600 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Đang theo học
            </span>
          </div>
        </div>
      </div>

      <div
        v-else-if="notFound"
        class="mt-5 p-4 rounded-xl border text-sm text-center flex items-center justify-center gap-2"
        style="
          background: rgba(139,26,26,0.04);
          border-color: rgba(139,26,26,0.2);
          color: #8b1a1a;
        "
      >
        <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 shrink-0" />
        <span>Không tìm thấy hồ sơ đoàn sinh phù hợp. Vui lòng kiểm tra lại họ tên hoặc mã số.</span>
      </div>
    </Transition>

    <div class="mt-4 text-center">
      <NuxtLink
        to="/verify"
        class="inline-flex items-center gap-1.5 text-xs font-bold hover:underline transition-all"
        style="color: #1a3a6b;"
      >
        <span>Mở trang tra cứu chi tiết và in phiếu điểm</span>
        <UIcon name="i-heroicons-arrow-right-20-solid" class="w-3.5 h-3.5" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const apiBase = config.public.apiBase
const query = ref('')
const loading = ref(false)
const result = ref<Record<string, unknown> | null>(null)
const notFound = ref(false)

const search = async () => {
  if (!query.value.trim()) return
  loading.value = true
  result.value = null
  notFound.value = false

  try {
    const data = await $fetch<Record<string, unknown>>(`${apiBase}/api/students/verify`, {
      query: { q: query.value }
    })
    result.value = data
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }
}
</script>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-56"></a>📄 [56/71] File: `web-portal/app/components/ProfileCard.vue`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** UI Components (Dùng chung) | **Số dòng:** 83 | **Kích thước:** 2.9 KB

```markup
<template>
  <div class="max-w-md mx-auto bg-white dark:bg-stone-900 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800 p-8 text-center">
    <div class="relative w-24 h-24 mx-auto mb-4">
      <img
        :src="user.avatar"
        alt="Avatar"
        class="w-full h-full rounded-full object-cover border-4 border-blue-50 dark:border-blue-900/30 shadow-sm"
      >
      <!-- Badge ngành Thiếu nhi màu xanh dương -->
      <div
        class="absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-white dark:border-stone-900 flex items-center justify-center"
        :class="user.branchColor"
      />
    </div>

    <h2 class="text-2xl font-bold text-stone-900 dark:text-stone-100">
      {{ user.name }}
    </h2>
    <p class="text-blue-600 dark:text-blue-400 font-medium mb-1 mt-1">
      Ngành {{ user.branch }} - {{ user.className }}
    </p>
    <p class="text-sm text-stone-500 dark:text-stone-400 mb-6 flex items-center justify-center gap-1">
      <UIcon name="i-heroicons-map-pin" />
      Giáo khu: {{ user.zone }}
    </p>

    <div class="grid grid-cols-2 gap-4 text-left mb-6">
      <div class="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-100 dark:border-stone-800">
        <div class="text-xs text-stone-500 dark:text-stone-400 uppercase font-semibold tracking-wider mb-1">
          Điểm Giáo Lý
        </div>
        <div class="text-2xl font-black text-stone-800 dark:text-stone-200">
          {{ user.grade }}
        </div>
      </div>
      <div class="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-100 dark:border-stone-800">
        <div class="text-xs text-stone-500 dark:text-stone-400 uppercase font-semibold tracking-wider mb-1">
          Chuyên Cần
        </div>
        <div class="text-2xl font-black text-stone-800 dark:text-stone-200">
          {{ user.attendance }}%
        </div>
      </div>
    </div>

    <UButton
      block
      size="lg"
      color="primary"
      variant="solid"
      class="rounded-xl font-semibold shadow-sm hover:shadow transition-shadow"
    >
      Cập nhật thông tin
    </UButton>
    <UButton
      block
      size="md"
      color="neutral"
      variant="ghost"
      class="rounded-xl mt-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
    >
      Đăng xuất
    </UButton>
  </div>
</template>

<script setup lang="ts">
// Mock data for the logged-in user profile
const user = {
  name: 'Maria Nguyễn Văn A',
  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
  branch: 'Thiếu Nhi',
  branchColor: 'bg-green-500', // Thiếu nhi is green (wait, 5 colors: Ấu=Green, Thiếu=Blue, Nghĩa=Yellow, Hiệp=Brown, Trưởng=Red). Let me fix this.
  className: 'Lớp Thiếu 1',
  zone: 'Thánh Giuse',
  grade: '8.5',
  attendance: 95
}

// Adjusting the branch color correctly according to TNTT
user.branchColor = 'bg-blue-600'
</script>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-57"></a>📄 [57/71] File: `web-portal/app/components/TemplateMenu.vue`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** UI Components (Dùng chung) | **Số dòng:** 50 | **Kích thước:** 1.2 KB

```markup
<template>
  <UDropdownMenu
    v-slot="{ open }"
    :modal="false"
    :items="[{
      label: 'Starter',
      to: 'https://starter-template.nuxt.dev/',
      color: 'primary',
      checked: true,
      type: 'checkbox'
    }, {
      label: 'Landing',
      to: 'https://landing-template.nuxt.dev/'
    }, {
      label: 'Docs',
      to: 'https://docs-template.nuxt.dev/'
    }, {
      label: 'SaaS',
      to: 'https://saas-template.nuxt.dev/'
    }, {
      label: 'Dashboard',
      to: 'https://dashboard-template.nuxt.dev/'
    }, {
      label: 'Chat',
      to: 'https://chat-template.nuxt.dev/'
    }, {
      label: 'Portfolio',
      to: 'https://portfolio-template.nuxt.dev/'
    }, {
      label: 'Changelog',
      to: 'https://changelog-template.nuxt.dev/'
    }]"
    :content="{ align: 'start' }"
    :ui="{ content: 'min-w-fit' }"
    size="xs"
  >
    <UButton
      label="Starter"
      variant="subtle"
      trailing-icon="i-lucide-chevron-down"
      size="xs"
      class="-mb-[6px] font-semibold rounded-full truncate"
      :class="[open && 'bg-primary/15']"
      :ui="{
        trailingIcon: ['transition-transform duration-200', open ? 'rotate-180' : undefined].filter(Boolean).join(' ')
      }"
    />
  </UDropdownMenu>
</template>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-58"></a>📄 [58/71] File: `web-portal/app/layouts/default.vue`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** Layouts (Khung trang) | **Số dòng:** 363 | **Kích thước:** 16.0 KB

```markup
<template>
  <!-- Scroll Progress Indicator -->
  <div class="scroll-progress-bar" />

  <div class="min-h-screen bg-ivory dark:bg-[#0d1117] font-sans text-stone-900 dark:text-stone-100 transition-colors duration-300">

    <!-- ══════════════════════════════════════════════════════════════
         HEADER CỐ ĐỊNH — Glassmorphism Premium
    ══════════════════════════════════════════════════════════════════ -->
    <header
      class="fixed top-[3px] left-0 right-0 z-50 transition-all duration-500"
      :class="[
        scrolled
          ? 'bg-white/90 dark:bg-[#0d1117]/90 backdrop-blur-2xl shadow-[0_4px_30px_rgba(26,58,107,0.12)] border-b border-gold/20'
          : 'bg-transparent border-b border-transparent'
      ]"
    >
      <div class="max-w-[1400px] mx-auto px-4 sm:px-6 h-[68px] flex items-center gap-3">

        <!-- ── Logo / Brand ── -->
        <div class="flex items-center gap-3 shrink-0 lg:w-[260px]">
          <NuxtLink
            to="/"
            class="flex items-center gap-3 group"
          >
            <!-- Icon Thánh Thể -->
            <div class="relative w-11 h-11 rounded-full flex items-center justify-center shadow-lg shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:shadow-gold/40"
              style="background: linear-gradient(135deg, #1a3a6b, #2a5298);"
            >
              <span class="text-white font-black text-xl leading-none">✝</span>
              <!-- Vành vàng -->
              <div class="absolute inset-0 rounded-full border-2 border-gold/40 group-hover:border-gold/80 transition-colors duration-300"
                style="border-color: rgba(201,169,110,0.4);"
              />
            </div>
            <!-- Tên -->
            <div class="hidden sm:flex flex-col leading-tight">
              <span class="font-black text-[15px] tracking-wider text-navy dark:text-white transition-colors"
                style="color: var(--color-navy, #1a3a6b);"
                :class="scrolled ? '' : 'dark:text-white'"
              >Thiếu Nhi</span>
              <span class="font-bold text-[13px] tracking-wider"
                style="color: #c9a96e;"
              >Thánh Thể</span>
            </div>
          </NuxtLink>
        </div>

        <!-- ── Navigation Center ── -->
        <nav class="hidden md:flex flex-1 justify-center items-center h-full gap-0.5">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            :target="item.external ? '_blank' : undefined"
            class="nav-link-refined text-stone-600 hover:text-navy dark:text-stone-400 dark:hover:text-white group h-full"
            active-class="active !text-navy dark:!text-gold"
          >
            <UIcon
              :name="item.icon"
              class="w-[18px] h-[18px] mr-1.5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
            />
            <span class="hidden xl:inline whitespace-nowrap text-[13px] font-semibold">{{ item.label }}</span>
            <!-- Badge thông báo -->
            <span
              v-if="item.badge"
              class="ml-1.5 px-1.5 py-0.5 text-white text-[10px] font-bold rounded-full"
              style="background-color: #8b1a1a;"
            >{{ item.badge }}</span>
            <!-- Animated underline -->
            <div class="nav-dot-floating" />
          </NuxtLink>
        </nav>

        <!-- ── Right Actions ── -->
        <div class="flex items-center gap-2 shrink-0 lg:w-[260px] justify-end">
          <!-- Dark/Light Toggle -->
          <UColorModeButton
            size="sm"
            variant="ghost"
            color="neutral"
            class="rounded-full"
          />

          <!-- Profile Link -->
          <NuxtLink
            to="/profile"
            class="flex items-center gap-2 rounded-full pl-1.5 pr-3 py-1.5 transition-all duration-300 border"
            style="background: rgba(26,58,107,0.06); border-color: rgba(201,169,110,0.2);"
          >
            <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              style="background: linear-gradient(135deg, #c9a96e, #e8c98a);"
            >
              <UIcon
                name="i-heroicons-user"
                class="w-4 h-4"
                style="color: #1a3a6b;"
              />
            </div>
            <span class="text-[13px] font-semibold text-stone-700 dark:text-stone-200 hidden lg:inline">Hồ Sơ</span>
          </NuxtLink>

          <!-- Mobile Hamburger -->
          <UButton
            icon="i-heroicons-bars-3"
            color="neutral"
            variant="ghost"
            size="sm"
            class="md:hidden rounded-full"
            @click="mobileOpen = true"
          />
        </div>
      </div>
    </header>

    <!-- ══════════════════════════════════════════════════════════════
         BODY MAIN
    ══════════════════════════════════════════════════════════════════ -->
    <div class="pt-[71px] flex min-h-screen">
      <main class="flex-1 min-w-0 flex flex-col w-full">
        <!-- Container: full-width cho homepage, centered cho sub-pages -->
        <div :class="[$route.path === '/' ? 'w-full flex-1' : 'w-full max-w-[1200px] mx-auto px-4 sm:px-6 flex-1 py-6']">
          <!-- Breadcrumb cho sub-pages -->
          <div
            v-if="$route.path !== '/'"
            class="mb-6 flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400"
          >
            <NuxtLink
              to="/"
              class="hover:text-navy dark:hover:text-gold transition-colors font-medium"
            >Trang Chủ</NuxtLink>
            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 opacity-50" />
            <span class="font-semibold text-navy dark:text-gold capitalize">
              {{ currentPageLabel }}
            </span>
          </div>
          <slot />
        </div>
        <LayoutFooterSection />
      </main>
    </div>

    <!-- ══════════════════════════════════════════════════════════════
         MOBILE SLIDE-OVER MENU — Premium
    ══════════════════════════════════════════════════════════════════ -->
    <USlideover
      v-if="mobileOpen"
      v-model="mobileOpen"
      side="left"
      class="md:hidden z-[100]"
    >
      <div class="flex flex-col h-full bg-ivory dark:bg-[#0d1117]"
        style="background: linear-gradient(180deg, #faf8f3 0%, #f0ece0 100%);"
      >
        <!-- Header mobile menu -->
        <div class="flex items-center justify-between p-5 border-b"
          style="border-color: rgba(201,169,110,0.2);"
        >
          <!-- Avatar placeholder + tên -->
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-md"
              style="background: linear-gradient(135deg, #1a3a6b, #2a5298); border-color: rgba(201,169,110,0.5);"
            >
              <span class="text-white font-black text-xl">✝</span>
            </div>
            <div class="flex flex-col">
              <span class="font-black text-navy dark:text-white text-base"
                style="color: #1a3a6b;"
              >Thiếu Nhi Thánh Thể</span>
              <span class="text-xs font-medium"
                style="color: #c9a96e;"
              >Cầu Nguyện • Rước Lễ • Hy Sinh</span>
            </div>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark"
            size="sm"
            class="rounded-full"
            @click="mobileOpen = false"
          />
        </div>

        <!-- Navigation mobile -->
        <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
          <NuxtLink
            v-for="item in sidebarItems"
            :key="item.to"
            :to="item.to"
            :target="item.external ? '_blank' : undefined"
            class="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 border border-transparent hover:border-gold/20 group"
            style="hover:background: rgba(201,169,110,0.08);"
            active-class="!border-gold/30 shadow-sm"
            @click="mobileOpen = false"
          >
            <!-- Icon container màu gradient -->
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105"
              :class="item.iconBg"
            >
              <UIcon
                :name="item.icon"
                class="w-5 h-5"
                :class="item.iconColor"
              />
            </div>
            <div class="flex flex-col leading-tight">
              <span class="font-bold text-sm text-stone-800 dark:text-stone-100">{{ item.label }}</span>
              <span class="text-xs text-stone-500 dark:text-stone-400">{{ item.desc }}</span>
            </div>
          </NuxtLink>
        </nav>

        <!-- Footer mobile menu -->
        <div class="p-5 border-t"
          style="border-color: rgba(201,169,110,0.2);"
        >
          <!-- 5 màu ngành -->
          <div class="flex gap-1.5 mb-3">
            <div class="flex-1 h-1.5 rounded-full tntt-au" />
            <div class="flex-1 h-1.5 rounded-full tntt-thieu" />
            <div class="flex-1 h-1.5 rounded-full tntt-nghia" />
            <div class="flex-1 h-1.5 rounded-full tntt-hiep" />
            <div class="flex-1 h-1.5 rounded-full tntt-huynh" />
          </div>
          <p class="text-xs text-stone-400 dark:text-stone-500 text-center">
            © {{ new Date().getFullYear() }} Web Portal Xứ Đoàn
          </p>
        </div>
      </div>
    </USlideover>

    <!-- ══════════════════════════════════════════════════════════════
         FLOATING ACTION BUTTON — Prayer / Contact
    ══════════════════════════════════════════════════════════════════ -->
    <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 group">
      <!-- Hover submenu -->
      <div class="absolute bottom-[68px] right-0 flex flex-col gap-2 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 origin-bottom-right">
        <!-- Email -->
        <button class="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-semibold text-sm shadow-lg border transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
          style="background: white; border-color: rgba(201,169,110,0.3); color: #1a3a6b; box-shadow: 0 4px 20px rgba(26,58,107,0.12);"
        >
          <UIcon
            name="i-heroicons-envelope"
            class="w-4 h-4"
            style="color: #8b1a1a;"
          />
          <span>Email Huynh Trưởng</span>
        </button>
        <!-- Phone -->
        <button class="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-semibold text-sm shadow-lg border transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
          style="background: white; border-color: rgba(201,169,110,0.3); color: #1a3a6b; box-shadow: 0 4px 20px rgba(26,58,107,0.12);"
        >
          <UIcon
            name="i-heroicons-phone"
            class="w-4 h-4"
            style="color: #16a34a;"
          />
          <span>Gọi Đường Dây Nóng</span>
        </button>
      </div>

      <!-- FAB chính — nhịp đập vàng khi idle -->
      <button
        class="w-[58px] h-[58px] rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 hover:scale-110"
        style="
          background: linear-gradient(135deg, #1a3a6b, #2a5298);
          box-shadow: 0 8px 25px rgba(26,58,107,0.4);
          animation: pulse-gold 3s ease-in-out infinite;
        "
        title="Liên hệ & Hỗ trợ"
      >
        <!-- Icon cầu nguyện -->
        <UIcon
          name="i-heroicons-chat-bubble-oval-left-ellipsis"
          class="w-6 h-6"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// ── Trạng thái mobile menu ──
const mobileOpen = ref(false)
const scrolled = ref(false)

// Theo dõi scroll để đổi style header
onMounted(() => {
  const handleScroll = () => {
    scrolled.value = window.scrollY > 20
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))
})

// Route hiện tại cho breadcrumb
const route = useRoute()
const pageLabelMap: Record<string, string> = {
  '/leadership': 'Ban Điều Hành',
  '/thong-bao': 'Thông Báo',
  '/news': 'Tin Tức',
  '/library': 'Tài Liệu',
  '/liturgical': 'Lịch Phụng Vụ',
  '/verify': 'Tra Cứu',
  '/profile': 'Hồ Sơ Cá Nhân',
}
const currentPageLabel = computed(() => pageLabelMap[route.path] || route.path.replace('/', ''))

// ── Nav Items (top bar) ──
interface NavItem { to: string; icon: string; label: string; badge?: string; external?: boolean }
const navItems: NavItem[] = [
  { to: '/', icon: 'i-heroicons-home-solid', label: 'Trang Chủ' },
  { to: '/leadership', icon: 'i-heroicons-user-group', label: 'Giới Thiệu' },
  { to: '/thong-bao', icon: 'i-heroicons-bell-alert', label: 'Thông Báo' },
  { to: '/news', icon: 'i-heroicons-newspaper', label: 'Tin Tức' },
  { to: 'http://localhost:3000', icon: 'i-heroicons-cog-6-tooth', label: 'Quản Lý Đoàn Sinh', external: true },
  { to: '/library', icon: 'i-heroicons-book-open', label: 'Tài Liệu' },
]

// ── Sidebar Items (mobile menu) ──
interface SidebarItem { to: string; label: string; desc: string; icon: string; iconBg: string; iconColor: string; badge?: string; external?: boolean }
const sidebarItems: SidebarItem[] = [
  {
    to: '/', label: 'Trang Chủ', desc: 'Bản tin tổng hợp',
    icon: 'i-heroicons-home-solid',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-700 dark:text-blue-400',
  },
  {
    to: '/leadership', label: 'Ban Điều Hành Xứ', desc: 'Sơ đồ tổ chức Sứ Đoàn',
    icon: 'i-heroicons-user-group',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-700 dark:text-purple-400',
  },
  {
    to: '/thong-bao', label: 'Thông Báo', desc: 'Thông báo từ giáo xứ',
    icon: 'i-heroicons-bell-alert',
    iconBg: 'bg-red-100 dark:bg-red-900/30', iconColor: 'text-red-700 dark:text-red-400',
  },
  {
    to: '/news', label: 'Tin Tức', desc: 'Tin tức Công giáo',
    icon: 'i-heroicons-newspaper',
    iconBg: 'bg-green-100 dark:bg-green-900/30', iconColor: 'text-green-700 dark:text-green-400',
  },
  {
    to: 'http://localhost:3000', label: 'Quản Lý Đoàn Sinh', desc: 'Dành cho Huynh Trưởng',
    icon: 'i-heroicons-cog-6-tooth',
    iconBg: 'bg-stone-200 dark:bg-stone-800', iconColor: 'text-stone-700 dark:text-stone-400',
    external: true,
  },
  {
    to: '/library', label: 'Tài Liệu', desc: 'Tài liệu học tập & biểu mẫu',
    icon: 'i-heroicons-book-open',
    iconBg: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-700 dark:text-amber-400',
  },
  {
    to: '/profile', label: 'Thông Tin Cá Nhân', desc: 'Hồ sơ, điểm số, điểm danh',
    icon: 'i-heroicons-user',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/30', iconColor: 'text-yellow-700 dark:text-yellow-400',
  },
]
</script>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-59"></a>📄 [59/71] File: `web-portal/app/pages/index.vue`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** Portal Pages (Cổng công chúng) | **Số dòng:** 99 | **Kích thước:** 3.9 KB

```markup
<script setup lang="ts">
import HeroSection from '~/components/home/HeroSection.vue'
import SpiritualSection from '~/components/home/SpiritualSection.vue'
import NewsAndAnnouncementsSection from '~/components/home/NewsAndAnnouncementsSection.vue'
import TenCommandmentsSection from '~/components/home/TenCommandmentsSection.vue'

useHead({
  title: 'Trang Chủ - Thiếu Nhi Thánh Thể'
})
</script>

<template>
  <div class="pb-16">
    <HeroSection />

    <!-- Nội dung chính (bọc khung tiêu chuẩn sang trọng) -->
    <div class="w-full max-w-[1240px] mx-auto px-4 sm:px-6 flex flex-col gap-12">
      <!-- ══════════════════════════════════════════════════════════════
           TRA CỨU NHANH HỌC VỤ & ĐIỂM SỐ — Spiritual Premium Widget
      ══════════════════════════════════════════════════════════════════ -->
      <div
        class="relative rounded-3xl p-6 md:p-10 overflow-hidden shadow-xl border transition-all duration-300"
        style="
          background: linear-gradient(135deg, rgba(250,248,243,0.95) 0%, rgba(240,236,224,0.9) 100%);
          border-color: rgba(201,169,110,0.3);
          box-shadow: 0 16px 40px rgba(26,58,107,0.08);
        "
      >
        <!-- Họa tiết watermark thánh giá chìm -->
        <div class="absolute inset-0 cross-pattern opacity-40 pointer-events-none" />

        <!-- Ánh sáng hào quang trang trí -->
        <div
          class="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
          style="background: radial-gradient(circle, rgba(201,169,110,0.18) 0%, transparent 70%);"
        />
        <div
          class="absolute -bottom-16 -left-16 w-56 h-56 rounded-full pointer-events-none"
          style="background: radial-gradient(circle, rgba(26,58,107,0.12) 0%, transparent 70%);"
        />

        <UIcon
          name="i-heroicons-academic-cap"
          class="absolute -right-4 -bottom-4 w-44 h-44 opacity-5 rotate-12 pointer-events-none"
          style="color: #1a3a6b;"
        />

        <div class="relative z-10 max-w-3xl mx-auto">
          <div class="flex flex-col items-center justify-center gap-2 mb-6 text-center">
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md mb-1"
              style="background: linear-gradient(135deg, #1a3a6b, #2a5298);"
            >
              <UIcon
                name="i-heroicons-magnifying-glass"
                class="w-7 h-7 text-white"
              />
            </div>
            <span
              class="text-xs font-black uppercase tracking-[0.25em]"
              style="color: #a07840;"
            >
              Học Vụ Đoàn Sinh
            </span>
            <h2
              class="text-2xl sm:text-3xl font-black font-serif tracking-tight"
              style="color: #1a3a6b;"
            >
              Tra Cứu Điểm & Hồ Sơ Nhanh
            </h2>
            <p class="text-sm text-stone-500 max-w-md">
              Nhập mã đoàn sinh hoặc họ tên để xem kết quả học tập giáo lý và tiến trình bí tích
            </p>
          </div>

          <div
            class="p-6 md:p-8 rounded-2xl shadow-lg border backdrop-blur-md"
            style="
              background: rgba(255, 255, 255, 0.85);
              border-color: rgba(201,169,110,0.25);
            "
          >
            <PortalVerifyWidget />
          </div>
        </div>
      </div>

      <!-- Khối Lời Chúa & Lịch Phụng Vụ -->
      <SpiritualSection />

      <!-- Bảng Tin & Thông Báo -->
      <NewsAndAnnouncementsSection />

      <!-- Mười Điều Răn -->
      <TenCommandmentsSection />
    </div>
  </div>
</template>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-60"></a>📄 [60/71] File: `web-portal/app/pages/leadership.vue`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** Portal Pages (Cổng công chúng) | **Số dòng:** 512 | **Kích thước:** 28.3 KB

```markup
<template>
  <div class="min-h-screen bg-stone-50 dark:bg-stone-950 font-sans pb-24 selection:bg-amber-500/30">
    <!-- ═══════════════════════════════════════════════════════
         BANNER HEADER (Trang nghiêm & Ấm áp phong cách Mục Vụ)
    ═══════════════════════════════════════════════════════ -->
    <section class="relative py-16 overflow-hidden bg-gradient-to-br from-[#4a2e18] via-[#784620] to-[#5a3214] text-white shadow-lg">
      <div
        class="absolute inset-0 opacity-10 pointer-events-none"
        style="background-image: url('data:image/svg+xml,<svg width=40 height=40 viewBox=0 0 40 40 xmlns=http://www.w3.org/2000/svg><g fill=none fill-rule=evenodd><g fill=%23fff fill-opacity=0.4><path d=M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41z/></g></g></svg>')"
      />
      <!-- Radial Glow -->
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-200 text-xs font-bold uppercase tracking-widest mb-4">
          <UIcon name="i-heroicons-users" class="w-4 h-4 text-amber-300" />
          <span>Cơ Cấu Tổ Chức Mục Vụ</span>
        </div>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight drop-shadow-md text-white font-serif">
          Sơ Đồ Tổ Chức <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-yellow-300">Xứ Đoàn</span>
        </h1>
        <p class="mt-3 text-amber-100/90 text-sm sm:text-base max-w-2xl mx-auto font-medium">
          Hệ thống Ban Linh Hướng, Ban Điều Hành và đội ngũ Huynh Trưởng - Giáo Lý Viên phục vụ Sứ Đoàn Thiếu Nhi Thánh Thể.
        </p>

        <!-- View Mode Switcher -->
        <div class="mt-8 inline-flex p-1 bg-black/25 backdrop-blur-md rounded-2xl border border-white/15">
          <button
            class="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
            :class="viewMode === 'chart' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-stone-200 hover:text-white'"
            @click="viewMode = 'chart'"
          >
            <UIcon name="i-heroicons-rectangle-group" class="w-4 h-4" />
            <span>Sơ Đồ Phân Cấp (Org Chart)</span>
          </button>
          <button
            class="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
            :class="viewMode === 'grid' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-stone-200 hover:text-white'"
            @click="viewMode = 'grid'"
          >
            <UIcon name="i-heroicons-squares-2x2" class="w-4 h-4" />
            <span>Danh Sách Toàn Đoàn</span>
          </button>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════
         MAIN BODY CONTENT
    ═══════════════════════════════════════════════════════ -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
      <!-- Loading Skeleton -->
      <div v-if="loading" class="space-y-8 pt-10">
        <div class="h-32 bg-white/60 dark:bg-stone-900/60 rounded-3xl animate-pulse" />
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div v-for="n in 5" :key="n" class="h-80 bg-white/60 dark:bg-stone-900/60 rounded-3xl animate-pulse" />
        </div>
      </div>

      <!-- SƠ ĐỒ PHÂN CẤP ORG CHART (VIEW MODE: CHART) -->
      <div v-else-if="viewMode === 'chart'" class="space-y-12 pt-6">

        <!-- ───────────────────────────────────────────
             TẦNG 1: CHA TUYÊN ÚY (ĐỈNH CAO NHẤT)
        ─────────────────────────────────────────── -->
        <div class="flex flex-col items-center">
          <div class="text-center mb-2">
            <span class="text-[11px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-800">
              Linh Hướng Tối Cao
            </span>
          </div>

          <div
            v-if="chaplainLeader"
            class="w-72 sm:w-80 bg-gradient-to-b from-amber-50 to-white dark:from-stone-900 dark:to-stone-900/90 rounded-3xl p-6 shadow-xl border-2 border-amber-400 dark:border-amber-600/60 text-center relative hover:-translate-y-1 transition-all group"
          >
            <div class="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden ring-4 ring-amber-400 shadow-md bg-stone-100 dark:bg-stone-800">
              <img
                v-if="chaplainLeader.avatarPath"
                :src="getAvatarUrl(chaplainLeader.avatarPath)"
                :alt="chaplainLeader.fullName"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform"
              >
              <div v-else class="w-full h-full flex items-center justify-center text-3xl font-serif text-amber-700 dark:text-amber-300">
                ✝
              </div>
            </div>
            <span class="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
              {{ chaplainLeader.holyName || 'Linh Mục' }}
            </span>
            <h3 class="text-lg font-black text-stone-900 dark:text-white mt-0.5">
              {{ chaplainLeader.fullName }}
            </h3>
            <p class="text-xs font-bold text-stone-600 dark:text-stone-300 mt-1 uppercase tracking-wide">
              {{ chaplainLeader.position || 'Cha Tuyên Úy' }}
            </p>
          </div>

          <!-- Fallback nếu chưa có dữ liệu trong DB -->
          <div
            v-else
            class="w-72 bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-lg border-2 border-amber-300 dark:border-amber-700 text-center"
          >
            <div class="w-20 h-20 mx-auto mb-3 rounded-full bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-3xl text-amber-600">
              ✝
            </div>
            <p class="text-xs font-bold text-amber-600 uppercase">Linh Mục</p>
            <h3 class="font-black text-stone-800 dark:text-white">Cha Tuyên Úy</h3>
            <p class="text-xs text-stone-500">Tổng linh hướng Xứ Đoàn</p>
          </div>

          <!-- Đường dây nối đứng -->
          <div class="w-0.5 h-10 bg-gradient-to-b from-amber-400 to-stone-300 dark:to-stone-700" />
        </div>

        <!-- ───────────────────────────────────────────
             TẦNG 2: CHA ĐẶC TRÁCH & TRỢ TÁ / TRỢ ÚY
        ─────────────────────────────────────────── -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center max-w-5xl mx-auto">
          <!-- Cánh Trái: BAN TRỢ TÁ -->
          <div class="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm text-center">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 text-xs font-bold uppercase tracking-wider mb-3">
              <UIcon name="i-heroicons-hand-raised" class="w-4 h-4" />
              <span>Ban Trợ Tá</span>
            </div>
            <div v-if="troTaLeaders.length" class="flex flex-wrap justify-center gap-3">
              <div v-for="lead in troTaLeaders" :key="lead.id" class="text-center">
                <div class="w-14 h-14 mx-auto mb-1.5 rounded-full overflow-hidden ring-2 ring-orange-300 bg-stone-100 dark:bg-stone-800">
                  <img v-if="lead.avatarPath" :src="getAvatarUrl(lead.avatarPath)" class="w-full h-full object-cover">
                  <span v-else class="w-full h-full flex items-center justify-center font-bold text-orange-600">{{ lead.fullName.charAt(0) }}</span>
                </div>
                <p class="text-[11px] font-bold text-stone-800 dark:text-stone-200 line-clamp-1">{{ lead.fullName }}</p>
                <p class="text-[10px] text-stone-500">{{ lead.position || 'Trợ Tá' }}</p>
              </div>
            </div>
            <p v-else class="text-xs text-stone-400 italic py-3">Quý Phụ Huynh & Hội Đồng Mục Vụ đồng hành</p>
          </div>

          <!-- Trung tâm: CHA ĐẶC TRÁCH -->
          <div class="flex flex-col items-center">
            <div
              v-if="specialPriestLeader"
              class="w-full sm:w-72 bg-gradient-to-b from-amber-50/80 to-white dark:from-stone-900 dark:to-stone-900 rounded-3xl p-6 shadow-xl border-2 border-amber-300 dark:border-amber-700 text-center relative hover:-translate-y-1 transition-all"
            >
              <div class="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden ring-3 ring-amber-400 shadow bg-stone-100 dark:bg-stone-800">
                <img
                  v-if="specialPriestLeader.avatarPath"
                  :src="getAvatarUrl(specialPriestLeader.avatarPath)"
                  :alt="specialPriestLeader.fullName"
                  class="w-full h-full object-cover"
                >
                <div v-else class="w-full h-full flex items-center justify-center text-2xl font-serif text-amber-700 dark:text-amber-400">
                  ✝
                </div>
              </div>
              <span class="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                {{ specialPriestLeader.holyName || 'Linh Mục' }}
              </span>
              <h3 class="text-base font-black text-stone-900 dark:text-white mt-0.5">
                {{ specialPriestLeader.fullName }}
              </h3>
              <p class="text-xs font-bold text-amber-700 dark:text-amber-400 mt-1 uppercase tracking-wide">
                {{ specialPriestLeader.position || 'Cha Đặc Trách' }}
              </p>
            </div>
            <div
              v-else
              class="w-full sm:w-72 bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-lg border-2 border-stone-200 dark:border-stone-800 text-center"
            >
              <div class="w-16 h-16 mx-auto mb-2 rounded-full bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-2xl text-amber-600">
                ✝
              </div>
              <h3 class="font-bold text-stone-800 dark:text-white">Cha Đặc Trách</h3>
              <p class="text-xs text-stone-500">Điều hành mục vụ thiếu nhi</p>
            </div>
          </div>

          <!-- Cánh Phải: BAN TRỢ ÚY (Quý Dì / Thầy) -->
          <div class="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm text-center">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-3">
              <UIcon name="i-heroicons-sparkles" class="w-4 h-4" />
              <span>Ban Trợ Úy</span>
            </div>
            <div v-if="troUyLeaders.length" class="flex flex-wrap justify-center gap-3">
              <div v-for="lead in troUyLeaders" :key="lead.id" class="text-center">
                <div class="w-14 h-14 mx-auto mb-1.5 rounded-full overflow-hidden ring-2 ring-purple-300 bg-stone-100 dark:bg-stone-800">
                  <img v-if="lead.avatarPath" :src="getAvatarUrl(lead.avatarPath)" class="w-full h-full object-cover">
                  <span v-else class="w-full h-full flex items-center justify-center font-bold text-purple-600">{{ lead.fullName.charAt(0) }}</span>
                </div>
                <p class="text-[11px] font-bold text-stone-800 dark:text-stone-200 line-clamp-1">{{ lead.fullName }}</p>
                <p class="text-[10px] text-stone-500">{{ lead.position || 'Trợ Úy' }}</p>
              </div>
            </div>
            <p v-else class="text-xs text-stone-400 italic py-3">Quý Tu Sĩ & Trợ Úy linh hướng</p>
          </div>
        </div>

        <!-- Đường dây nối đứng xuống Ban Điều Hành -->
        <div class="flex justify-center -my-6">
          <div class="w-0.5 h-12 bg-gradient-to-b from-stone-300 to-amber-500 dark:from-stone-700 dark:to-amber-500" />
        </div>

        <!-- ───────────────────────────────────────────
             TẦNG 3: BAN ĐIỀU HÀNH XỨ ĐOÀN
        ─────────────────────────────────────────── -->
        <div class="bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 dark:from-stone-900/90 dark:to-stone-900/90 border-2 border-amber-400/50 dark:border-amber-600/40 rounded-[2.5rem] p-6 sm:p-8 max-w-5xl mx-auto shadow-xl backdrop-blur-md">
          <div class="text-center mb-6">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500 text-stone-950 font-black text-xs uppercase tracking-widest shadow-sm">
              <UIcon name="i-heroicons-star" class="w-4 h-4" />
              <span>Ban Điều Hành Xứ Đoàn</span>
            </div>
            <p class="text-xs text-stone-500 dark:text-stone-400 mt-2 font-medium">Nhiệm Kỳ 2023 - 2026</p>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div
              v-for="leader in bdhLeaders"
              :key="leader.id"
              class="bg-white/90 dark:bg-stone-800/90 rounded-2xl p-4 text-center border border-amber-200 dark:border-stone-700 shadow-sm hover:-translate-y-1 transition-all group"
            >
              <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 rounded-2xl overflow-hidden ring-2 ring-amber-400 bg-stone-100 dark:bg-stone-700 shadow">
                <img
                  v-if="leader.avatarPath"
                  :src="getAvatarUrl(leader.avatarPath)"
                  :alt="leader.fullName"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                >
                <div v-else class="w-full h-full flex items-center justify-center text-xl font-bold text-amber-600">
                  {{ leader.fullName.charAt(0) }}
                </div>
              </div>
              <p class="text-[10px] text-stone-400 uppercase font-bold tracking-wider">{{ leader.holyName }}</p>
              <h4 class="font-bold text-stone-900 dark:text-white text-sm line-clamp-1 mt-0.5">{{ leader.fullName }}</h4>
              <p class="text-xs font-bold text-amber-600 dark:text-amber-400 mt-1 line-clamp-1">{{ leader.position }}</p>
            </div>
          </div>
        </div>

        <!-- ───────────────────────────────────────────
             TẦNG 4: 5 CỘT NGÀNH CHUYÊN MÔN (CHIÊN - ẤU - THIẾU - NGHĨA - HIỆP)
        ─────────────────────────────────────────── -->
        <div>
          <div class="text-center mb-8">
            <h2 class="text-2xl font-black text-stone-900 dark:text-white uppercase tracking-tight font-serif">
              Đội Ngũ Huynh Trưởng & Giáo Lý Viên 5 Ngành
            </h2>
            <p class="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-1">
              Phụ trách giảng dạy và đồng hành cùng các em thiếu nhi theo từng lứa tuổi
            </p>
          </div>

          <!-- 5 Cột Ngành -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5 items-start">
            <div
              v-for="branch in branchColumns"
              :key="branch.id"
              class="rounded-3xl border shadow-md overflow-hidden flex flex-col transition-all bg-white/70 dark:bg-stone-900/70 backdrop-blur-md"
              :class="branch.containerClass"
            >
              <!-- Header Ngành -->
              <div :class="['p-4 text-center text-white', branch.headerClass]">
                <div class="text-2xl mb-1">{{ branch.icon }}</div>
                <h3 class="font-black text-sm uppercase tracking-wider">{{ branch.name }}</h3>
                <p class="text-[10px] opacity-90 font-medium">{{ branch.ageRange }}</p>
              </div>

              <div class="p-4 space-y-4 flex-1">
                <!-- Box Trưởng Ngành -->
                <div>
                  <div class="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1">
                    <UIcon name="i-heroicons-shield-check" class="w-3.5 h-3.5 text-amber-500" />
                    <span>Ban Trưởng Ngành</span>
                  </div>

                  <div v-if="getBranchChiefs(branch.id).length" class="space-y-2">
                    <div
                      v-for="chief in getBranchChiefs(branch.id)"
                      :key="chief.id"
                      class="bg-stone-50 dark:bg-stone-800/60 p-2.5 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 flex items-center gap-3"
                    >
                      <div class="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-stone-300 dark:ring-stone-600 bg-stone-200">
                        <img v-if="chief.avatarPath" :src="getAvatarUrl(chief.avatarPath)" class="w-full h-full object-cover">
                        <span v-else class="w-full h-full flex items-center justify-center font-bold text-xs">{{ chief.fullName.charAt(0) }}</span>
                      </div>
                      <div class="overflow-hidden">
                        <p class="text-[10px] text-stone-400 font-semibold">{{ chief.holyName }}</p>
                        <p class="text-xs font-bold text-stone-800 dark:text-white truncate">{{ chief.fullName }}</p>
                        <p class="text-[10px] text-amber-600 font-medium">{{ chief.position || 'Trưởng ngành' }}</p>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-xs text-stone-400 italic bg-stone-50 dark:bg-stone-800/40 p-2.5 rounded-2xl text-center">
                    Đang kiện toàn nhân sự
                  </div>
                </div>

                <!-- Lưới GLV Đứng Lớp -->
                <div>
                  <div class="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1">
                    <UIcon name="i-heroicons-academic-cap" class="w-3.5 h-3.5 text-blue-500" />
                    <span>Giáo Lý Viên Đứng Lớp</span>
                  </div>

                  <div v-if="getBranchTeachers(branch.id).length" class="grid grid-cols-2 gap-2">
                    <div
                      v-for="teacher in getBranchTeachers(branch.id)"
                      :key="teacher.id"
                      class="bg-stone-50 dark:bg-stone-800/50 hover:bg-stone-100 dark:hover:bg-stone-800 p-2 rounded-xl text-center border border-stone-200/40 dark:border-stone-700/40 transition-colors cursor-pointer"
                      @click="selectedLeader = teacher"
                    >
                      <div class="w-12 h-12 mx-auto mb-1.5 rounded-xl overflow-hidden ring-1 ring-stone-200 bg-stone-200 dark:bg-stone-700">
                        <img v-if="teacher.avatarPath" :src="getAvatarUrl(teacher.avatarPath)" class="w-full h-full object-cover">
                        <span v-else class="w-full h-full flex items-center justify-center font-bold text-xs text-stone-600 dark:text-stone-300">{{ teacher.fullName.charAt(0) }}</span>
                      </div>
                      <p class="text-[9px] text-stone-400 truncate">{{ teacher.holyName }}</p>
                      <p class="text-[11px] font-bold text-stone-800 dark:text-stone-200 truncate">{{ teacher.fullName }}</p>
                      <span class="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-white dark:bg-stone-700 text-stone-600 dark:text-stone-300 mt-1 border border-stone-200 dark:border-stone-600">
                        {{ teacher.position || 'GLV' }}
                      </span>
                    </div>
                  </div>
                  <div v-else class="text-xs text-stone-400 italic text-center py-4 bg-stone-50 dark:bg-stone-800/30 rounded-2xl">
                    Chưa phân công GLV
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- CHẾ ĐỘ XEM GRID TOÀN ĐOÀN (VIEW MODE: GRID) -->
      <div v-else class="space-y-8 pt-8">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div
            v-for="lead in leaders"
            :key="lead.id"
            class="bg-white/80 dark:bg-stone-900/80 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 text-center hover:shadow-lg transition-all"
            @click="selectedLeader = lead"
          >
            <div class="w-16 h-16 mx-auto mb-2 rounded-2xl overflow-hidden ring-2 ring-amber-400/40 bg-stone-100 dark:bg-stone-800">
              <img v-if="lead.avatarPath" :src="getAvatarUrl(lead.avatarPath)" class="w-full h-full object-cover">
              <div v-else class="w-full h-full flex items-center justify-center font-bold text-amber-600">{{ lead.fullName.charAt(0) }}</div>
            </div>
            <p class="text-[10px] text-stone-400 font-bold uppercase">{{ lead.holyName }}</p>
            <h4 class="font-bold text-stone-900 dark:text-white text-xs truncate">{{ lead.fullName }}</h4>
            <p class="text-[11px] text-amber-600 font-medium truncate mt-0.5">{{ lead.position }}</p>
          </div>
        </div>
      </div>
    </main>

    <!-- MODAL CHI TIẾT GLV -->
    <UModal v-model="isDetailOpen">
      <div v-if="selectedLeader" class="p-6 text-center">
        <div class="w-24 h-24 mx-auto mb-4 rounded-3xl overflow-hidden ring-4 ring-amber-400 shadow-lg bg-stone-100">
          <img v-if="selectedLeader.avatarPath" :src="getAvatarUrl(selectedLeader.avatarPath)" class="w-full h-full object-cover">
          <div v-else class="w-full h-full flex items-center justify-center text-3xl font-bold text-amber-600">{{ selectedLeader.fullName.charAt(0) }}</div>
        </div>
        <p class="text-xs font-bold text-amber-600 uppercase tracking-wider">{{ selectedLeader.holyName }}</p>
        <h3 class="text-xl font-black text-stone-900 dark:text-white mt-1">{{ selectedLeader.fullName }}</h3>
        <p class="text-sm font-bold text-stone-600 dark:text-stone-300 mt-1">{{ selectedLeader.position }}</p>
        <div v-if="selectedLeader.description" class="mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-stone-800 text-xs italic text-stone-600 dark:text-stone-300">
          "{{ selectedLeader.description }}"
        </div>
        <div class="mt-6">
          <UButton label="Đóng" color="neutral" variant="soft" class="rounded-xl px-6" @click="selectedLeader = null" />
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'Sơ Đồ Tổ Chức Xứ Đoàn – Thiếu Nhi Thánh Thể' })

const config = useRuntimeConfig()
const apiBase = config.public.apiBase

interface Leader {
  id: string
  holyName: string
  fullName: string
  position: string
  level: number
  branch: number
  term?: string
  description?: string
  avatarPath?: string
  isActive: boolean
}

const viewMode = ref<'chart' | 'grid'>('chart')
const loading = ref(true)
const leaders = ref<Leader[]>([])
const selectedLeader = ref<Leader | null>(null)
const isDetailOpen = computed({
  get: () => !!selectedLeader.value,
  set: (val) => { if (!val) selectedLeader.value = null }
})

const getAvatarUrl = (path: string) => {
  if (path.startsWith('http')) return path
  return `${apiBase}${path}`
}

// 5 Ngành chuyên môn TNTT
const branchColumns = [
  {
    id: 1,
    name: 'Ngành Chiên Con',
    ageRange: '4 - 6 tuổi',
    icon: '🌸',
    headerClass: 'bg-gradient-to-r from-pink-500 to-rose-400',
    containerClass: 'border-pink-200 dark:border-pink-900/40 shadow-pink-500/5'
  },
  {
    id: 2,
    name: 'Ngành Ấu Nhi',
    ageRange: '7 - 9 tuổi',
    icon: '🌿',
    headerClass: 'bg-gradient-to-r from-emerald-600 to-teal-500',
    containerClass: 'border-emerald-200 dark:border-emerald-900/40 shadow-emerald-500/5'
  },
  {
    id: 3,
    name: 'Ngành Thiếu Nhi',
    ageRange: '10 - 12 tuổi',
    icon: '🌊',
    headerClass: 'bg-gradient-to-r from-sky-600 to-blue-500',
    containerClass: 'border-sky-200 dark:border-sky-900/40 shadow-sky-500/5'
  },
  {
    id: 4,
    name: 'Ngành Nghĩa Sĩ',
    ageRange: '13 - 15 tuổi',
    icon: '☀️',
    headerClass: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-900',
    containerClass: 'border-amber-200 dark:border-amber-900/40 shadow-amber-500/5'
  },
  {
    id: 5,
    name: 'Ngành Hiệp Sĩ',
    ageRange: '16 - 18 tuổi',
    icon: '🛡️',
    headerClass: 'bg-gradient-to-r from-[#8c502b] to-[#6d3c1d]',
    containerClass: 'border-amber-800/30 dark:border-stone-800 shadow-stone-500/5'
  }
]

// Tải dữ liệu từ API
try {
  const { data } = await useFetch<Leader[]>(`${apiBase}/api/leader`)
  if (data.value && data.value.length) {
    leaders.value = data.value.filter(l => l.isActive)
  }
} catch (e) {
  console.error('Không thể tải danh sách lãnh đạo:', e)
} finally {
  loading.value = false
}

// Phân loại lãnh đạo theo sơ đồ cấp bậc:
// Level 1: Cha Tuyên Úy
const chaplainLeader = computed(() => {
  return leaders.value.find(l => l.level === 1 || l.position.toLowerCase().includes('tuyên úy'))
})

// Level 2 hoặc vị trí đặc trách: Cha Đặc Trách
const specialPriestLeader = computed(() => {
  return leaders.value.find(l => l.position.toLowerCase().includes('đặc trách') || (l.level === 2 && l.holyName.toLowerCase().includes('linh mục')))
})

// Trợ Tá: Phụ huynh / Hội đồng mục vụ
const troTaLeaders = computed(() => {
  return leaders.value.filter(l => l.position.toLowerCase().includes('trợ tá'))
})

// Trợ Úy: Quý Dì / Quý Thầy
const troUyLeaders = computed(() => {
  return leaders.value.filter(l => l.position.toLowerCase().includes('trợ úy') || l.position.toLowerCase().includes('dì') || l.position.toLowerCase().includes('thầy'))
})

// Ban Điều Hành Xứ Đoàn (Xứ đoàn trưởng, phó, thư ký, thủ quỹ)
const bdhLeaders = computed(() => {
  return leaders.value.filter(l => {
    const pos = l.position.toLowerCase()
    return (l.level === 2 || l.level === 3) && 
      (pos.includes('xứ đoàn') || pos.includes('thư ký') || pos.includes('thủ quỹ') || pos.includes('trưởng ban')) &&
      !pos.includes('đặc trách')
  })
})

// Lấy danh sách Trưởng Ngành cho từng Ngành
const getBranchChiefs = (branchId: number) => {
  return leaders.value.filter(l => {
    return l.branch === branchId && (l.level === 3 || l.position.toLowerCase().includes('trưởng ngành') || l.position.toLowerCase().includes('phó ngành'))
  })
}

// Lấy danh sách Giáo Lý Viên đứng lớp cho từng Ngành
const getBranchTeachers = (branchId: number) => {
  return leaders.value.filter(l => {
    const isChief = l.level === 3 || l.position.toLowerCase().includes('trưởng ngành') || l.position.toLowerCase().includes('phó ngành')
    return l.branch === branchId && !isChief
  })
}
</script>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-61"></a>📄 [61/71] File: `web-portal/app/pages/library.vue`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** Portal Pages (Cổng công chúng) | **Số dòng:** 536 | **Kích thước:** 22.9 KB

```markup
<template>
  <div class="min-h-screen bg-stone-50 dark:bg-stone-950 font-sans selection:bg-marian-blue-500/30 relative pb-24">
    <!-- ═══════════════════════════════════════════════════════
         BACKGROUND MESH GRADIENT
    ═══════════════════════════════════════════════════════ -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div class="absolute -top-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob bg-marian-blue-400" />
      <div class="absolute top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-vatican-gold-400" />
      <div class="absolute -bottom-[20%] right-[20%] w-[70vw] h-[70vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-15 dark:opacity-10 animate-blob animation-delay-4000 bg-sky-400" />
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay" />
    </div>

    <UContainer class="relative z-10 pt-12 space-y-8">
      <!-- ═══════════════════════════════════════════════════════
           HEADER
      ═══════════════════════════════════════════════════════ -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in-up">
        <div>
          <div class="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-white/60 dark:bg-stone-900/40 backdrop-blur-md border border-white/40 dark:border-stone-700/50 shadow-sm text-xs font-black text-marian-blue-600 dark:text-marian-blue-400 uppercase tracking-widest">
            <UIcon
              name="i-heroicons-bookmark-square"
              class="w-4 h-4"
            />
            <span>Kho Lưu Trữ</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-stone-900 dark:text-white flex items-center gap-3 drop-shadow-sm uppercase tracking-tight">
            Thư Viện Tài Liệu
          </h1>
          <p class="text-stone-500 text-lg mt-2 font-serif italic">
            Tài liệu giáo lý, giáo án mẫu và biểu mẫu sinh hoạt phong trào Thiếu Nhi Thánh Thể
          </p>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════
           CONTEXT-AWARE BANNER
      ═══════════════════════════════════════════════════════ -->
      <div
        v-if="auth.user?.branch"
        class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-xl border border-white/40 dark:border-stone-800/50 rounded-3xl p-5 flex items-center gap-5 animate-fade-in-up shadow-lg shadow-marian-blue-500/5"
        style="animation-delay: 0.1s;"
      >
        <div class="p-3 bg-marian-blue-500/10 rounded-2xl text-marian-blue-600 dark:text-marian-blue-400">
          <UIcon
            name="i-heroicons-sparkles"
            class="w-7 h-7 animate-pulse"
          />
        </div>
        <div>
          <h4 class="font-black text-stone-800 dark:text-white text-lg">
            Tối ưu hóa theo ngành <span class="text-marian-blue-600 dark:text-marian-blue-400">{{ getBranchName(auth.user.branch) }}</span>
          </h4>
          <p class="text-stone-500 dark:text-stone-400 text-sm mt-0.5">
            Tài liệu thuộc ngành của bạn đã được ưu tiên hiển thị lên hàng đầu và lọc theo ngữ cảnh.
          </p>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════
           FILTER BAR (PILL SHAPE)
      ═══════════════════════════════════════════════════════ -->
      <div
        class="bg-white/60 dark:bg-stone-900/60 backdrop-blur-2xl border border-white/50 dark:border-stone-800 rounded-[2rem] p-3 shadow-xl shadow-black/5 animate-fade-in-up"
        style="animation-delay: 0.2s;"
      >
        <div class="flex flex-col md:flex-row gap-3 justify-between items-center">
          <div class="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto flex-1">
            <UInput
              v-model="searchQuery"
              icon="i-heroicons-magnifying-glass"
              placeholder="Tìm tên tài liệu hoặc thẻ tag..."
              size="lg"
              variant="none"
              class="w-full md:w-80 bg-stone-100/50 dark:bg-stone-800/50 rounded-2xl border border-stone-200/50 dark:border-stone-700/50 focus-within:ring-2 focus-within:ring-marian-blue-500/50"
            />
            <div class="w-px bg-stone-200 dark:bg-stone-800 hidden md:block my-2" />
            <USelect
              v-model="selectedCategory"
              :options="categoryOptions"
              size="lg"
              variant="none"
              class="w-full md:w-48 bg-stone-100/50 dark:bg-stone-800/50 rounded-2xl border border-stone-200/50 dark:border-stone-700/50"
            />
            <USelect
              v-model="selectedBranch"
              :options="branchOptions"
              size="lg"
              variant="none"
              class="w-full md:w-48 bg-stone-100/50 dark:bg-stone-800/50 rounded-2xl border border-stone-200/50 dark:border-stone-700/50"
            />
          </div>

          <div class="flex gap-4 items-center px-4 w-full md:w-auto justify-between md:justify-end border-t md:border-none border-stone-200/50 dark:border-stone-800/50 pt-3 md:pt-0">
            <span class="text-sm font-bold text-stone-500">
              Tổng số: <b class="text-marian-blue-600 dark:text-marian-blue-400 text-lg">{{ totalCount }}</b>
            </span>
            <UPagination
              v-if="totalCount > limit"
              v-model="page"
              :total="totalCount"
              :page-count="limit"
              size="sm"
            />
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════
           MAIN CONTENT AREA
      ═══════════════════════════════════════════════════════ -->
      <div
        class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up"
        style="animation-delay: 0.3s;"
      >
        <!-- Documents List -->
        <div :class="[previewDoc ? 'lg:col-span-2' : 'lg:col-span-3', 'space-y-4 transition-all duration-500']">
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <UCard
              v-for="doc in documents"
              :key="doc.id"
              :class="[
                'group relative overflow-hidden transition-all duration-300 cursor-pointer rounded-[2rem] border border-white/40 dark:border-stone-800/50 shadow-md hover:shadow-xl hover:-translate-y-1',
                doc.id === previewDoc?.id ? 'bg-marian-blue-50/80 dark:bg-marian-blue-900/20 border-marian-blue-300/50 dark:border-marian-blue-700/50 ring-2 ring-marian-blue-500/30' : 'bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl',
                doc.branch === auth.user?.branch ? 'border-b-4 border-b-marian-blue-500' : ''
              ]"
              @click="selectPreview(doc)"
            >
              <div class="flex flex-col h-full p-2">
                <!-- Top Row: Icon & Category -->
                <div class="flex items-start justify-between mb-4">
                  <div :class="`p-3.5 rounded-2xl ${getFileTheme(doc.fileName).bg} ${getFileTheme(doc.fileName).text} shadow-inner`">
                    <UIcon
                      :name="getFileTheme(doc.fileName).icon"
                      class="w-8 h-8"
                    />
                  </div>

                  <div class="flex flex-col items-end gap-1.5">
                    <UBadge
                      size="xs"
                      variant="soft"
                      class="font-bold tracking-wider rounded-lg bg-stone-100/50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 backdrop-blur-sm"
                    >
                      {{ doc.category }}
                    </UBadge>
                    <UBadge
                      size="xs"
                      :color="getBranchColor(doc.branch)"
                      variant="soft"
                      class="font-bold tracking-wider rounded-lg"
                    >
                      {{ getBranchName(doc.branch) }}
                    </UBadge>
                  </div>
                </div>

                <!-- Document Info -->
                <div class="flex-1 min-w-0 mb-6">
                  <h3
                    class="font-black text-stone-900 dark:text-white text-lg leading-tight line-clamp-2 mb-2"
                    :title="doc.fileName"
                  >
                    {{ doc.fileName }}
                  </h3>
                  <div class="flex items-center gap-3 text-xs font-semibold text-stone-500">
                    <span class="flex items-center gap-1"><UIcon
                      name="i-heroicons-user"
                      class="w-3.5 h-3.5"
                    /> {{ doc.uploadedBy || 'Ban Giáo Lý' }}</span>
                    <span>•</span>
                    <span class="flex items-center gap-1"><UIcon
                      name="i-heroicons-circle-stack"
                      class="w-3.5 h-3.5"
                    /> {{ formatSize(doc.fileSize) }}</span>
                  </div>
                </div>

                <!-- Tags -->
                <div
                  v-if="doc.tags"
                  class="flex flex-wrap gap-1.5"
                >
                  <span
                    v-for="tag in doc.tags.split(',')"
                    :key="tag"
                    class="text-[10px] font-bold uppercase tracking-widest bg-stone-100/80 dark:bg-stone-800/80 text-stone-500 px-2 py-1 rounded-md"
                  >
                    #{{ tag.trim() }}
                  </span>
                </div>
              </div>

              <!-- Hover Action Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <div class="flex justify-end gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <UButton
                    icon="i-heroicons-eye"
                    color="white"
                    variant="solid"
                    label="Xem"
                    size="sm"
                    class="rounded-xl shadow-lg"
                    @click.stop="selectPreview(doc)"
                  />
                  <UButton
                    icon="i-heroicons-arrow-down-tray"
                    color="marian-blue"
                    variant="solid"
                    size="sm"
                    class="rounded-xl shadow-lg shadow-marian-blue-500/30"
                    @click.stop="downloadFile(doc)"
                  />
                </div>
              </div>
            </UCard>
          </div>

          <!-- Empty State -->
          <div
            v-if="!pending && (!documents || !documents.length)"
            class="text-center py-32 bg-white/40 dark:bg-stone-900/40 backdrop-blur-md rounded-[3rem] border border-white/30 dark:border-stone-800"
          >
            <UIcon
              name="i-heroicons-document-magnifying-glass"
              class="w-24 h-24 mx-auto mb-6 text-stone-300 dark:text-stone-700 animate-pulse"
            />
            <p class="text-2xl font-black text-stone-500">
              Không tìm thấy tài liệu
            </p>
            <p class="text-stone-400 mt-2 font-medium">
              Vui lòng thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.
            </p>
          </div>
        </div>

        <!-- ═══════════════════════════════════════════════════════
             RIGHT PANEL: PDF PREVIEW (Desktop Only)
        ═══════════════════════════════════════════════════════ -->
        <div
          v-if="previewDoc"
          class="hidden lg:block lg:col-span-1 space-y-4 sticky top-6 self-start"
        >
          <UCard
            class="bg-white/80 dark:bg-stone-900/80 backdrop-blur-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 border border-white/50 dark:border-stone-700/50 rounded-[2.5rem] overflow-hidden h-[800px] flex flex-col"
            :ui="{ body: { padding: 'p-0', base: 'flex-1 flex flex-col' } }"
          >
            <template #header>
              <div class="flex items-start justify-between">
                <div class="min-w-0 flex-1 pr-4">
                  <h3 class="font-black text-stone-900 dark:text-white truncate text-lg">
                    {{ previewDoc.fileName }}
                  </h3>
                  <p class="text-xs font-bold text-marian-blue-500 uppercase tracking-widest mt-1">
                    Xem trước
                  </p>
                </div>
                <div class="flex gap-2 shrink-0">
                  <UButton
                    icon="i-heroicons-arrow-down-tray"
                    color="marian-blue"
                    size="sm"
                    class="rounded-xl"
                    @click="downloadFile(previewDoc)"
                  />
                  <UButton
                    icon="i-heroicons-x-mark"
                    color="neutral"
                    variant="soft"
                    size="sm"
                    class="rounded-xl bg-stone-100 dark:bg-stone-800"
                    @click="previewDoc = null"
                  />
                </div>
              </div>
            </template>

            <div class="flex-1 w-full bg-stone-200/50 dark:bg-stone-950/50 overflow-hidden relative">
              <iframe
                v-if="isPreviewable(previewDoc.fileName)"
                :src="getPreviewUrl(previewDoc.filePath)"
                class="w-full h-full border-none absolute inset-0"
              />
              <div
                v-else
                class="flex flex-col items-center justify-center h-full text-center text-stone-500 p-8"
              >
                <div class="p-6 bg-stone-100 dark:bg-stone-800 rounded-full mb-6">
                  <UIcon
                    name="i-heroicons-document-arrow-down"
                    class="w-16 h-16 opacity-50"
                  />
                </div>
                <p class="font-black text-xl mb-2 text-stone-700 dark:text-stone-300">
                  Định dạng không hỗ trợ
                </p>
                <p class="text-sm font-medium text-stone-400">
                  Tài liệu này không thể xem trực tuyến.<br>Vui lòng tải về máy để xem.
                </p>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </UContainer>

    <!-- ═══════════════════════════════════════════════════════
         MOBILE PREVIEW MODAL
    ═══════════════════════════════════════════════════════ -->
    <UModal
      v-model:open="isMobilePreviewOpen"
      fullscreen
      class="lg:hidden"
    >
      <template #content>
        <div class="h-full flex flex-col bg-stone-100 dark:bg-stone-950">
          <!-- Header -->
          <div class="flex items-center justify-between p-4 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
            <div class="min-w-0 flex-1 pr-4">
              <h3 class="font-black text-stone-900 dark:text-white truncate">
                {{ previewDoc?.fileName }}
              </h3>
            </div>
            <div class="flex gap-2 shrink-0">
              <UButton
                icon="i-heroicons-arrow-down-tray"
                color="marian-blue"
                size="sm"
                @click="downloadFile(previewDoc)"
              />
              <UButton
                icon="i-heroicons-x-mark"
                color="neutral"
                variant="soft"
                size="sm"
                @click="closeMobilePreview"
              />
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 w-full relative overflow-hidden">
            <iframe
              v-if="previewDoc && isPreviewable(previewDoc.fileName)"
              :src="getPreviewUrl(previewDoc.filePath)"
              class="w-full h-full border-none absolute inset-0"
            />
            <div
              v-else
              class="flex flex-col items-center justify-center h-full text-center text-stone-500 p-8"
            >
              <UIcon
                name="i-heroicons-document-arrow-down"
                class="w-16 h-16 opacity-30 mb-4"
              />
              <p class="font-bold text-lg">
                Không hỗ trợ xem trước
              </p>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })
useHead({ title: 'Thư Viện Tài Liệu - Thiếu Nhi Thánh Thể' })

const auth = reactive({ user: null })
const config = useRuntimeConfig()

// Modals & States
const previewDoc = ref(null)
const isMobilePreviewOpen = ref(false)

// Search/Filter states
const searchQuery = ref('')
const selectedCategory = ref('Tất cả danh mục')
const selectedBranch = ref('0')

// Options
const categoryOptions = [
  'Tất cả danh mục',
  'Giáo án',
  'Bài hát',
  'Văn bản',
  'Tài liệu học'
]

const branchOptions = [
  { value: '0', label: 'Tất cả Ngành' },
  { value: '1', label: 'Ấu Nhi' },
  { value: '2', label: 'Thiếu Nhi' },
  { value: '3', label: 'Nghĩa Sĩ' },
  { value: '4', label: 'Hiệp Sĩ' }
]

// State & Filtersnation & Fetch state
const page = ref(1)
const limit = ref(12)
const totalCount = useState('libraryTotalCount', () => 0)

// API Fetch parameters
const fetchParams = computed(() => {
  const params = {
    page: page.value,
    limit: limit.value,
    search: searchQuery.value || undefined,
    category: selectedCategory.value !== 'Tất cả danh mục' ? selectedCategory.value : undefined,
    branch: selectedBranch.value !== '0' ? parseInt(selectedBranch.value) : undefined
  }
  return params
})

// Watch filters to reset page to 1
watch([searchQuery, selectedCategory, selectedBranch], () => {
  page.value = 1
})

// Fetch documents from server
const { data: documents, pending } = await useFetch('/api/Document', {
  baseURL: config.public.apiBase,
  query: fetchParams,
  default: () => [],
  onResponse({ response }) {
    const total = response.headers.get('X-Total-Count')
    if (total) {
      totalCount.value = parseInt(total, 10)
    } else {
      totalCount.value = Array.isArray(response._data) ? response._data.length : 0
    }
  }
})

// Helpers
const getBranchName = (b) => {
  const names = { 0: 'Chung', 1: 'Ấu Nhi', 2: 'Thiếu Nhi', 3: 'Nghĩa Sĩ', 4: 'Hiệp Sĩ' }
  return names[b] || 'Chung'
}

const getBranchColor = (b) => {
  const colors = { 0: 'neutral', 1: 'green', 2: 'blue', 3: 'yellow', 4: 'red' }
  return colors[b] || 'neutral'
}

/**
 * File mapping to TNTT Colors
 * Xanh dương (Thiếu) = PDF
 * Xanh lá (Ấu) = Word
 * Vàng (Nghĩa) = Excel/PPT
 * Đỏ (Hiệp) = Audio/Video
 */
const getFileTheme = (fileName) => {
  if (!fileName) return { icon: 'i-heroicons-document', bg: 'bg-stone-100 dark:bg-stone-800/50', text: 'text-stone-500' }
  const ext = fileName.split('.').pop().toLowerCase()

  if (['pdf'].includes(ext)) {
    return { icon: 'i-heroicons-document-text', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' } // Thiếu Nhi
  }
  if (['doc', 'docx', 'txt'].includes(ext)) {
    return { icon: 'i-heroicons-document', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' } // Ấu Nhi
  }
  if (['xls', 'xlsx', 'csv', 'ppt', 'pptx'].includes(ext)) {
    return { icon: 'i-heroicons-table-cells', bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400' } // Nghĩa Sĩ
  }
  if (['mp3', 'wav', 'mp4', 'mov'].includes(ext)) {
    return { icon: 'i-heroicons-musical-note', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' } // Hiệp Sĩ
  }
  if (['png', 'jpg', 'jpeg', 'svg'].includes(ext)) {
    return { icon: 'i-heroicons-photo', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' }
  }

  return { icon: 'i-heroicons-document', bg: 'bg-stone-100 dark:bg-stone-800/50', text: 'text-stone-500' }
}

const formatSize = (bytes) => {
  if (!bytes) return '0 B'
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

const isPreviewable = (name) => {
  const ext = name.split('.').pop().toLowerCase()
  return ['pdf', 'png', 'jpg', 'jpeg', 'txt'].includes(ext)
}

const getPreviewUrl = (path) => {
  return `${config.public.apiBase.replace('/api', '')}${path}`
}

const selectPreview = (doc) => {
  previewDoc.value = doc
  if (window.innerWidth < 1024) {
    isMobilePreviewOpen.value = true
  }
}

const closeMobilePreview = () => {
  isMobilePreviewOpen.value = false
  setTimeout(() => {
    previewDoc.value = null
  }, 300)
}

const downloadFile = (doc) => {
  window.open(`${config.public.apiBase}/Document/download/${doc.id}`, '_blank')
}
</script>

<style>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 10s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-62"></a>📄 [62/71] File: `web-portal/app/pages/liturgical.vue`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** Portal Pages (Cổng công chúng) | **Số dòng:** 126 | **Kích thước:** 3.7 KB

```markup
<template>
  <div layout="default">
    <!-- Header -->
    <section class="relative py-14 bg-gradient-to-br from-tntt-green-700 via-tntt-green-600 to-tntt-green-800 text-white overflow-hidden">
      <div
        class="absolute inset-0 opacity-10"
        style="background-image: radial-gradient(circle at 70% 30%, #4ade80, transparent 60%)"
      />
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-xs font-bold uppercase tracking-widest text-green-200 mb-2">
          Phụng Vụ
        </p>
        <h1 class="font-serif font-bold text-3xl md:text-4xl mb-3">
          Lịch Phụng Vụ
        </h1>
        <p class="text-green-100 max-w-xl">
          Lịch phụng vụ Công giáo theo tuần và năm phụng vụ.
        </p>
      </div>
    </section>

    <!-- Content -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div
        v-if="loading"
        class="space-y-3"
      >
        <div
          v-for="n in 5"
          :key="n"
          class="h-16 bg-stone-100 dark:bg-stone-800 rounded-xl animate-pulse"
        />
      </div>

      <div
        v-else-if="entries.length"
        class="space-y-3"
      >
        <div
          v-for="(entry, i) in entries"
          :key="entry.date"
          :class="['glass-card flex items-center gap-4 p-4 animate-fade-in-up', isToday(entry.date) ? 'ring-2 ring-tntt-green-400' : '']"
          :style="{ animationDelay: `${i * 0.04}s` }"
        >
          <!-- Date badge -->
          <div :class="['rounded-xl text-center p-2 w-14 shrink-0 font-black', isToday(entry.date) ? 'bg-tntt-green-500 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200']">
            <p class="text-xl leading-none">
              {{ new Date(entry.date).getDate() }}
            </p>
            <p class="text-[10px] uppercase">
              {{ monthShort(entry.date) }}
            </p>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="font-bold text-stone-800 dark:text-white text-sm">
              {{ entry.liturgyName || entry.title }}
            </p>
            <p
              v-if="entry.description"
              class="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1"
            >
              {{ entry.description }}
            </p>
          </div>

          <!-- Season badge -->
          <UBadge
            v-if="entry.season"
            color="success"
            variant="soft"
            size="xs"
            class="shrink-0"
          >
            {{ entry.season }}
          </UBadge>
        </div>
      </div>

      <div
        v-else
        class="text-center py-16 text-stone-400"
      >
        <UIcon
          name="i-heroicons-calendar-days"
          class="w-12 h-12 mx-auto mb-3 opacity-40"
        />
        <p>Chưa có dữ liệu lịch phụng vụ.</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'Lịch Phụng Vụ – Thiếu Nhi Thánh Thể' })

const config = useRuntimeConfig()
const apiBase = config.public.apiBase

interface LiturgicalEntry {
  date: string
  title?: string
  liturgyName?: string
  description?: string
  season?: string
}

const loading = ref(true)
const entries = ref<LiturgicalEntry[]>([])

const { data } = await useFetch<LiturgicalEntry[]>(`${apiBase}/api/liturgical`)
entries.value = data.value ?? []
loading.value = false

const isToday = (dateStr: string) => {
  const today = new Date()
  const d = new Date(dateStr)
  return today.toDateString() === d.toDateString()
}

const monthShort = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('vi-VN', { month: 'short' }).replace('.', '')
</script>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-63"></a>📄 [63/71] File: `web-portal/app/pages/news.vue`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** Portal Pages (Cổng công chúng) | **Số dòng:** 183 | **Kích thước:** 6.2 KB

```markup
<template>
  <div layout="default">
    <!-- Header -->
    <section class="relative bg-gradient-to-br from-tntt-blue-700 via-tntt-blue-600 to-tntt-blue-800 py-14 text-white overflow-hidden">
      <div
        class="absolute inset-0 opacity-20"
        style="background-image: radial-gradient(circle at 20% 80%, #60a5fa 0%, transparent 50%), radial-gradient(circle at 80% 20%, #818cf8 0%, transparent 50%)"
      />
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-xs font-bold uppercase tracking-widest text-blue-200 mb-2">
          Tự động cập nhật mỗi ngày lúc 2:00 SA
        </p>
        <h1 class="font-serif font-bold text-3xl md:text-4xl mb-3">
          Tin Tức Công Giáo
        </h1>
        <p class="text-blue-100 max-w-xl">
          Tổng hợp tin tức từ Vatican News, HĐGM Việt Nam và các nguồn Công giáo uy tín.
        </p>
      </div>
    </section>

    <!-- Filters -->
    <section class="sticky top-[56px] z-20 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 py-3">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center gap-3">
        <UBadge
          id="filter-all"
          :color="activeSource === null ? 'primary' : 'neutral'"
          :variant="activeSource === null ? 'solid' : 'outline'"
          class="cursor-pointer text-xs px-3 py-1.5 font-semibold"
          @click="activeSource = null"
        >
          Tất cả
        </UBadge>
        <UBadge
          v-for="src in sources"
          :id="`filter-${src}`"
          :key="src"
          :color="activeSource === src ? 'primary' : 'neutral'"
          :variant="activeSource === src ? 'solid' : 'outline'"
          class="cursor-pointer text-xs px-3 py-1.5 font-semibold"
          @click="activeSource = src"
        >
          {{ src }}
        </UBadge>

        <div class="ml-auto text-xs text-stone-400">
          {{ filteredArticles.length }} bài viết
        </div>
      </div>
    </section>

    <!-- Grid -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Loading -->
      <div
        v-if="loading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="n in 6"
          :key="n"
          class="h-64 bg-stone-100 dark:bg-stone-800 rounded-2xl animate-pulse"
        />
      </div>

      <!-- Articles -->
      <div
        v-else-if="filteredArticles.length"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <article
          v-for="(article, i) in filteredArticles"
          :key="article.id"
          :class="['glass-card overflow-hidden hover-lift animate-fade-in-up group cursor-pointer']"
          :style="{ animationDelay: `${Math.min(i * 0.05, 0.4)}s` }"
          @click="openArticle(article.link)"
        >
          <!-- Image -->
          <div class="h-44 overflow-hidden relative bg-stone-100 dark:bg-stone-800">
            <img
              v-if="article.imageUrl"
              :src="imageProxyUrl(article.imageUrl)"
              :alt="article.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              @error="(e: Event) => (e.target as HTMLImageElement).style.display = 'none'"
            >
            <div
              v-else
              class="w-full h-full flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-newspaper"
                class="w-10 h-10 text-stone-300 dark:text-stone-600"
              />
            </div>
            <span class="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
              {{ article.sourceName }}
            </span>
          </div>

          <!-- Content -->
          <div class="p-4">
            <p class="text-[11px] text-stone-400 mb-1.5">
              {{ formatDate(article.publishedDate) }}
            </p>
            <h2 class="font-bold text-sm text-stone-800 dark:text-white leading-snug line-clamp-3 group-hover:text-tntt-blue-600 dark:group-hover:text-tntt-blue-400 transition-colors">
              {{ article.title }}
            </h2>
            <p class="text-xs text-stone-500 dark:text-stone-400 mt-2 line-clamp-2">
              {{ article.summary }}
            </p>
          </div>
        </article>
      </div>

      <!-- Empty -->
      <div
        v-else
        class="text-center py-24 text-stone-400"
      >
        <UIcon
          name="i-heroicons-newspaper"
          class="w-16 h-16 mx-auto mb-4 opacity-30"
        />
        <p class="font-semibold text-stone-500">
          Chưa có tin tức nào từ nguồn này.
        </p>
        <p class="text-sm mt-1">
          Hệ thống sẽ tự động cập nhật lúc 2:00 SA mỗi ngày.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'Tin Tức Công Giáo – Thiếu Nhi Thánh Thể' })

const config = useRuntimeConfig()
const apiBase = config.public.apiBase

interface Article {
  id: string
  title: string
  link: string
  summary: string
  imageUrl: string
  sourceName: string
  category: string
  publishedDate: string
}

const loading = ref(true)
const articles = ref<Article[]>([])
const activeSource = ref<string | null>(null)

const { data } = await useFetch<Article[]>(`${apiBase}/api/news/catholic`, {
  query: { limit: 50, sort: 'newest' },
  default: () => []
})
articles.value = data.value ?? []
loading.value = false

const sources = computed(() => [...new Set(articles.value.map(a => a.sourceName))])

const filteredArticles = computed(() =>
  activeSource.value
    ? articles.value.filter(a => a.sourceName === activeSource.value)
    : articles.value
)

const imageProxyUrl = (url: string) =>
  `${apiBase}/api/news/image-proxy?url=${encodeURIComponent(url)}`

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })

const openArticle = (link: string) =>
  window.open(link, '_blank', 'noopener,noreferrer')
</script>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-64"></a>📄 [64/71] File: `web-portal/app/pages/profile/index.vue`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** Profile Pages (Hồ sơ) | **Số dòng:** 254 | **Kích thước:** 9.1 KB

```markup
<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'Hồ Sơ Cá Nhân – GiaoLy' })

const user = {
  name: 'Maria Nguyễn Văn A',
  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
  branch: 'Thiếu Nhi',
  role: 'Đoàn Sinh',
  className: 'Lớp Thiếu 1',
  zone: 'Thánh Giuse',
  dob: '15/08/2012',
  phone: '0901234567',
  email: 'maria.a@example.com',
  sacraments: {
    baptism: 'Đã nhận',
    eucharist: 'Đã nhận',
    confirmation: 'Chưa nhận'
  },
  grade: 8.5,
  attendance: 95
}

const tabItems = [
  { label: 'Tổng quan', icon: 'i-heroicons-user' },
  { label: 'Lịch Học & Dạy', icon: 'i-heroicons-calendar-days' },
  { label: 'Chứng từ / Bí Tích', icon: 'i-heroicons-document-check' }
]
</script>

<template>
  <div class="space-y-6 pb-12">
    <!-- Header Profile Card (Banner + Avatar) -->
    <div class="relative glass-card overflow-hidden">
      <!-- Gradient Banner -->
      <div class="h-40 w-full tntt-banner" />

      <div class="px-6 sm:px-10 pb-8">
        <div class="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16 relative z-10">
          <div class="relative w-32 h-32 shrink-0">
            <img
              :src="user.avatar"
              alt="Avatar"
              class="w-full h-full object-cover rounded-full border-4 border-white dark:border-stone-900 shadow-lg bg-stone-100"
            >
            <div class="absolute bottom-1 right-1 w-8 h-8 rounded-full border-2 border-white dark:border-stone-900 chip-thieu-nhi shadow-sm flex items-center justify-center">
              <UIcon
                name="i-heroicons-star"
                class="w-4 h-4"
              />
            </div>
          </div>

          <div class="flex-1 space-y-1 sm:mb-2">
            <div class="flex items-center gap-3">
              <h1 class="text-3xl font-extrabold text-stone-900 dark:text-white">
                {{ user.name }}
              </h1>
              <UBadge
                color="primary"
                variant="subtle"
              >
                {{ user.role }}
              </UBadge>
            </div>
            <p class="text-stone-600 dark:text-stone-300 font-medium text-lg">
              Ngành {{ user.branch }} &bull; {{ user.className }}
            </p>
          </div>

          <div class="sm:mb-2 flex gap-3">
            <UButton
              color="neutral"
              variant="solid"
              icon="i-heroicons-pencil-square"
              class="shadow-sm"
            >
              Sửa hồ sơ
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs Component -->
    <UTabs
      :items="tabItems"
      class="w-full"
    >
      <template #content="{ index }">
        <!-- TỔNG QUAN -->
        <div
          v-if="index === 0"
          class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4"
        >
          <!-- Left Column: Personal Info -->
          <div class="lg:col-span-2 glass-card p-6 space-y-6 border border-stone-200/50 dark:border-stone-700/50">
            <h2 class="text-xl font-bold text-stone-800 dark:text-white border-b border-stone-100 dark:border-stone-800 pb-3">
              Thông Tin Cá Nhân
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <p class="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Ngày sinh
                </p>
                <p class="font-medium text-stone-900 dark:text-stone-100">
                  {{ user.dob }}
                </p>
              </div>
              <div>
                <p class="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Giáo khu
                </p>
                <p class="font-medium text-stone-900 dark:text-stone-100">
                  {{ user.zone }}
                </p>
              </div>
              <div>
                <p class="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Điện thoại
                </p>
                <p class="font-medium text-stone-900 dark:text-stone-100">
                  {{ user.phone }}
                </p>
              </div>
              <div>
                <p class="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Email
                </p>
                <p class="font-medium text-stone-900 dark:text-stone-100">
                  {{ user.email }}
                </p>
              </div>
            </div>
          </div>

          <!-- Right Column: Academic Stats -->
          <div class="space-y-6">
            <div class="glass-card p-6 border border-stone-200/50 dark:border-stone-700/50 flex flex-col items-center justify-center text-center">
              <div class="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-3">
                <UIcon
                  name="i-heroicons-academic-cap"
                  class="w-8 h-8 text-rose-600 dark:text-rose-400"
                />
              </div>
              <h3 class="text-stone-500 dark:text-stone-400 font-semibold uppercase tracking-wider text-sm mb-1">
                Điểm Trung Bình
              </h3>
              <p class="text-4xl font-black text-stone-800 dark:text-white">
                {{ user.grade }}
              </p>
            </div>

            <div class="glass-card p-6 border border-stone-200/50 dark:border-stone-700/50 flex flex-col items-center justify-center text-center">
              <div class="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3">
                <UIcon
                  name="i-heroicons-clock"
                  class="w-8 h-8 text-amber-600 dark:text-amber-400"
                />
              </div>
              <h3 class="text-stone-500 dark:text-stone-400 font-semibold uppercase tracking-wider text-sm mb-1">
                Tỷ lệ Chuyên Cần
              </h3>
              <p class="text-4xl font-black text-stone-800 dark:text-white">
                {{ user.attendance }}%
              </p>
            </div>
          </div>
        </div>

        <!-- LỊCH HỌC -->
        <div
          v-if="index === 1"
          class="glass-card p-8 text-center mt-4 border border-stone-200/50 dark:border-stone-700/50"
        >
          <UIcon
            name="i-heroicons-calendar"
            class="w-16 h-16 text-stone-300 mx-auto mb-4"
          />
          <h3 class="text-lg font-semibold text-stone-800 dark:text-white">
            Lịch Học Trống
          </h3>
          <p class="text-stone-500 mt-2">
            Hiện tại chưa có lịch học nào được xếp cho tuần này.
          </p>
        </div>

        <!-- CHỨNG TỪ BÍ TÍCH -->
        <div
          v-if="index === 2"
          class="glass-card p-6 mt-4 border border-stone-200/50 dark:border-stone-700/50"
        >
          <h2 class="text-xl font-bold text-stone-800 dark:text-white mb-6">
            Trạng Thái Bí Tích
          </h2>

          <div class="space-y-4 max-w-2xl">
            <!-- Rửa Tội -->
            <div class="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl">
              <div class="flex items-center gap-3">
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-6 h-6 text-green-500"
                />
                <span class="font-medium text-stone-900 dark:text-stone-100">Bí Tích Rửa Tội</span>
              </div>
              <UBadge
                color="success"
                variant="soft"
              >
                Đã nhận
              </UBadge>
            </div>

            <!-- Rước Lễ -->
            <div class="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl">
              <div class="flex items-center gap-3">
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-6 h-6 text-green-500"
                />
                <span class="font-medium text-stone-900 dark:text-stone-100">Bí Tích Rước Lễ Lần Đầu</span>
              </div>
              <UBadge
                color="success"
                variant="soft"
              >
                Đã nhận
              </UBadge>
            </div>

            <!-- Thêm Sức -->
            <div class="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl">
              <div class="flex items-center gap-3">
                <UIcon
                  name="i-heroicons-clock"
                  class="w-6 h-6 text-stone-400"
                />
                <span class="font-medium text-stone-900 dark:text-stone-100">Bí Tích Thêm Sức</span>
              </div>
              <UBadge
                color="neutral"
                variant="soft"
              >
                Chưa nhận
              </UBadge>
            </div>
          </div>
        </div>
      </template>
    </UTabs>
  </div>
</template>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-65"></a>📄 [65/71] File: `web-portal/app/pages/thong-bao.vue`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** Portal Pages (Cổng công chúng) | **Số dòng:** 251 | **Kích thước:** 8.9 KB

```markup
<template>
  <div>
    <!-- Page Header -->
    <section class="relative py-14 overflow-hidden bg-gradient-to-br from-tntt-blue-800 via-tntt-blue-700 to-tntt-blue-900 text-white">
      <div class="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-tntt-blue-500/20 rounded-full blur-3xl" />
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-xs font-bold uppercase tracking-widest text-blue-200 mb-2">
          Sứ Đoàn Thiếu Nhi Thánh Thể
        </p>
        <h1 class="font-serif font-bold text-3xl md:text-4xl mb-3">
          Bảng Thông Báo
        </h1>
        <p class="text-blue-100 max-w-xl text-sm">
          Tổng hợp toàn bộ thông báo từ Ban Điều Hành Sứ Đoàn và Giáo Xứ. Cập nhật thường xuyên.
        </p>
      </div>
    </section>

    <!-- Filter Bar -->
    <div class="sticky top-[56px] z-20 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 py-3">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center gap-3">
        <UBadge
          v-for="cat in categories"
          :key="cat.value"
          :color="activeCategory === cat.value ? 'primary' : 'neutral'"
          :variant="activeCategory === cat.value ? 'solid' : 'outline'"
          class="cursor-pointer text-xs px-3 py-1.5 font-semibold select-none"
          @click="activeCategory = cat.value"
        >
          {{ cat.label }}
        </UBadge>
        <div class="ml-auto text-xs text-stone-400">
          {{ filteredAnnouncements.length }} thông báo
        </div>
      </div>
    </div>

    <!-- Content -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Loading Skeleton -->
      <div
        v-if="loading"
        class="space-y-4"
      >
        <div
          v-for="n in 5"
          :key="n"
          class="h-28 bg-stone-100 dark:bg-stone-800 rounded-2xl animate-pulse"
        />
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="text-center py-16"
      >
        <UIcon
          name="i-heroicons-exclamation-circle"
          class="w-14 h-14 mx-auto text-red-400 mb-4"
        />
        <p class="font-bold text-stone-600 dark:text-stone-400">
          Không thể tải thông báo
        </p>
        <p class="text-sm text-stone-400 mt-1">
          {{ error }}
        </p>
        <UButton
          class="mt-4"
          color="primary"
          variant="soft"
          @click="refresh"
        >
          Thử lại
        </UButton>
      </div>

      <!-- Announcement List -->
      <div
        v-else-if="filteredAnnouncements.length"
        class="space-y-4"
      >
        <div
          v-for="(item, i) in filteredAnnouncements"
          :key="item.id"
          class="group bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 p-5 hover:shadow-md transition-all flex gap-4"
          :class="[item.isImportant ? 'border-l-4 border-l-red-500 dark:border-l-red-500' : 'border-l-4 border-l-tntt-blue-500 dark:border-l-tntt-blue-400']"
          :style="{ animationDelay: `${i * 0.04}s` }"
        >
          <!-- Date Block -->
          <div class="shrink-0 text-center min-w-[52px]">
            <div
              class="rounded-xl px-2 py-1.5 text-white text-xs font-bold shadow-sm"
              :class="item.isImportant ? 'bg-red-500' : 'bg-tntt-blue-600'"
            >
              <p class="text-base leading-none font-black">
                {{ formatDay(item.publishedAt) }}
              </p>
              <p class="uppercase tracking-wider text-[9px] mt-0.5 opacity-80">
                {{ formatMonth(item.publishedAt) }}
              </p>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2 mb-1.5">
              <h3 class="font-bold text-stone-900 dark:text-stone-100 group-hover:text-tntt-blue-600 dark:group-hover:text-tntt-blue-400 transition-colors leading-snug">
                {{ item.title }}
              </h3>
              <UBadge
                v-if="item.isImportant"
                color="error"
                variant="subtle"
                size="xs"
                class="shrink-0"
              >
                Quan trọng
              </UBadge>
            </div>
            <p
              v-if="item.content"
              class="text-sm text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3"
            >
              {{ item.content }}
            </p>
            <p class="text-xs text-stone-400 mt-2 font-medium">
              <span v-if="item.category">{{ item.category }} · </span>{{ formatDate(item.publishedAt) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="text-center py-24"
      >
        <UIcon
          name="i-heroicons-megaphone"
          class="w-16 h-16 mx-auto mb-4 text-stone-300 dark:text-stone-700 opacity-50"
        />
        <p class="font-semibold text-stone-500 dark:text-stone-400">
          Chưa có thông báo nào.
        </p>
        <p class="text-sm text-stone-400 mt-1">
          Vui lòng quay lại sau.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'Thông Báo – Thiếu Nhi Thánh Thể' })

const config = useRuntimeConfig()
const apiBase = config.public.apiBase

interface Announcement {
  id: string
  title: string
  content: string
  category: string
  isImportant: boolean
  publishedAt: string
}

const loading = ref(true)
const error = ref<string | null>(null)
const announcements = ref<Announcement[]>([])
const activeCategory = ref<string>('all')

const categories = [
  { label: 'Tất cả', value: 'all' },
  { label: '⚠️ Quan trọng', value: 'important' },
  { label: 'Học vụ', value: 'Học vụ' },
  { label: 'Sinh hoạt', value: 'Sinh hoạt' },
  { label: 'Giáo xứ', value: 'Giáo xứ' }
]

const filteredAnnouncements = computed(() => {
  if (activeCategory.value === 'all') return announcements.value
  if (activeCategory.value === 'important') return announcements.value.filter(a => a.isImportant)
  return announcements.value.filter(a => a.category === activeCategory.value)
})

const refresh = async () => {
  loading.value = true
  error.value = null
  try {
    const data = await $fetch<Announcement[]>(`${apiBase}/api/announcements`, {
      query: { limit: 50, sort: 'newest' }
    })
    announcements.value = Array.isArray(data) ? data : []
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Lỗi không xác định'
    // Fallback mock data khi API chưa chạy
    announcements.value = [
      {
        id: '1',
        title: 'Thông báo khai giảng năm học Giáo lý mới 2026-2027',
        content: 'Kính thưa quý Phụ huynh, Chúa nhật tuần sau Giáo xứ sẽ chính thức khai giảng năm học mới. Thánh lễ lúc 7:30 sáng, sau đó các em sẽ tập trung theo lớp đã được phân bổ.',
        category: 'Học vụ',
        isImportant: true,
        publishedAt: '2026-08-25T07:00:00Z'
      },
      {
        id: '2',
        title: 'Thay đổi giờ lễ cho khối Ấu Nhi ngày Chúa Nhật',
        content: 'Do thời tiết nắng nóng, giờ lễ của khối Ấu Nhi sẽ được chuyển lên sớm hơn 30 phút. Phụ huynh vui lòng đưa các em đến đúng giờ.',
        category: 'Sinh hoạt',
        isImportant: false,
        publishedAt: '2026-08-20T07:00:00Z'
      },
      {
        id: '3',
        title: 'Đăng ký tham gia cắm trại ngành Nghĩa Sĩ',
        content: 'Trại hè sẽ diễn ra vào cuối tháng 8. Các em Nghĩa Sĩ đăng ký trực tiếp cho Huynh trưởng phụ trách lớp trước ngày 22/08.',
        category: 'Sinh hoạt',
        isImportant: false,
        publishedAt: '2026-08-15T07:00:00Z'
      },
      {
        id: '4',
        title: 'Họp phụ huynh đầu năm học',
        content: 'Ban Điều Hành kính mời Quý Phụ Huynh tham dự buổi họp phụ huynh đầu năm học. Thời gian: 8:00 sáng Chúa Nhật 01/09/2026 tại hội trường giáo xứ.',
        category: 'Giáo xứ',
        isImportant: true,
        publishedAt: '2026-08-10T07:00:00Z'
      }
    ]
    // Clear the error so fallback data shows
    error.value = null
  } finally {
    loading.value = false
  }
}

// Format helpers
const formatDay = (dateStr: string) => new Date(dateStr).getDate().toString().padStart(2, '0')
const formatMonth = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('vi-VN', { month: 'short' })
const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })

// Load on mount
await refresh()
</script>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-66"></a>📄 [66/71] File: `web-portal/app/pages/verify.vue`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** Portal Pages (Cổng công chúng) | **Số dòng:** 247 | **Kích thước:** 8.2 KB

```markup
<template>
  <div layout="default">
    <!-- Header -->
    <section class="relative py-14 overflow-hidden bg-gradient-to-br from-tntt-gold-600 via-tntt-gold-500 to-tntt-gold-700 text-white">
      <div class="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-xs font-bold uppercase tracking-widest text-yellow-100 mb-2">
          Học Vụ Giáo Lý
        </p>
        <h1 class="font-serif font-bold text-3xl md:text-4xl mb-3">
          Tra Cứu Điểm Giáo Lý
        </h1>
        <p class="text-yellow-100 max-w-md mx-auto text-sm">
          Đoàn sinh và phụ huynh nhập họ tên hoặc mã đoàn sinh để xem điểm và thông tin học vụ.
        </p>
      </div>
    </section>

    <!-- Search Box -->
    <section class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
      <div class="glass-card p-6 animate-fade-in-up">
        <form
          id="verify-search-form"
          class="flex gap-3"
          @submit.prevent="search"
        >
          <UInput
            id="verify-search-input"
            v-model="query"
            size="lg"
            placeholder="Nhập họ tên hoặc mã đoàn sinh..."
            class="flex-1"
            :disabled="loading"
            leading-icon="i-heroicons-magnifying-glass"
          />
          <UButton
            id="verify-search-btn"
            type="submit"
            size="lg"
            :loading="loading"
            color="warning"
            class="font-bold px-6"
          >
            Tìm kiếm
          </UButton>
        </form>
        <p class="text-xs text-stone-400 mt-3 text-center">
          Thông tin chỉ dành cho mục đích tra cứu học vụ nội bộ sứ đoàn.
        </p>
      </div>
    </section>

    <!-- Results -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Loading -->
      <div
        v-if="loading"
        class="space-y-4"
      >
        <div
          v-for="n in 3"
          :key="n"
          class="h-20 bg-stone-100 dark:bg-stone-800 rounded-2xl animate-pulse"
        />
      </div>

      <!-- Results -->
      <div v-else-if="results.length">
        <p class="text-sm text-stone-500 dark:text-stone-400 mb-5">
          Tìm thấy <strong class="text-stone-800 dark:text-white">{{ results.length }}</strong> kết quả cho "<em>{{ lastQuery }}</em>"
        </p>

        <div class="space-y-4">
          <div
            v-for="(item, i) in results"
            :key="item.studentId"
            :class="['glass-card p-5 animate-fade-in-up']"
            :style="{ animationDelay: `${i * 0.06}s` }"
          >
            <div class="flex items-start gap-4">
              <!-- Avatar / Icon -->
              <div :class="[branchColor(item.branch), 'rounded-xl p-3 shrink-0']">
                <UIcon
                  name="i-heroicons-academic-cap"
                  class="w-6 h-6"
                />
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  <h2 class="font-bold text-stone-800 dark:text-white">
                    {{ item.studentName }}
                  </h2>
                  <UBadge
                    :color="branchBadgeColor(item.branch)"
                    variant="soft"
                    size="xs"
                  >
                    {{ item.branch }}
                  </UBadge>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-1.5 text-sm">
                  <div>
                    <p class="text-[10px] text-stone-400 uppercase tracking-wider">
                      Lớp
                    </p>
                    <p class="font-semibold text-stone-700 dark:text-stone-300">
                      {{ item.className || '—' }}
                    </p>
                  </div>
                  <div>
                    <p class="text-[10px] text-stone-400 uppercase tracking-wider">
                      Niên khóa
                    </p>
                    <p class="font-semibold text-stone-700 dark:text-stone-300">
                      {{ item.academicYear || '—' }}
                    </p>
                  </div>
                  <div>
                    <p class="text-[10px] text-stone-400 uppercase tracking-wider">
                      Điểm Giáo Lý
                    </p>
                    <p :class="['font-black text-lg', gradeColor(item.averageGrade)]">
                      {{ item.averageGrade !== null ? item.averageGrade.toFixed(1) : '—' }}
                    </p>
                  </div>
                  <div>
                    <p class="text-[10px] text-stone-400 uppercase tracking-wider">
                      Hạnh Kiểm
                    </p>
                    <p class="font-semibold text-stone-700 dark:text-stone-300">
                      {{ item.conduct || '—' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Not found -->
      <div
        v-else-if="searched && !results.length"
        class="text-center py-16 animate-fade-in"
      >
        <UIcon
          name="i-heroicons-face-frown"
          class="w-16 h-16 mx-auto mb-4 text-stone-300 dark:text-stone-600"
        />
        <p class="font-bold text-stone-600 dark:text-stone-400 text-lg">
          Không tìm thấy kết quả
        </p>
        <p class="text-stone-400 text-sm mt-2 max-w-sm mx-auto">
          Vui lòng kiểm tra lại họ tên. Nếu vẫn không tìm thấy, hãy liên hệ thư ký sứ đoàn.
        </p>
      </div>

      <!-- Initial state -->
      <div
        v-else
        class="text-center py-16 text-stone-300 dark:text-stone-700 animate-fade-in"
      >
        <UIcon
          name="i-heroicons-magnifying-glass"
          class="w-16 h-16 mx-auto mb-4"
        />
        <p class="text-stone-400 dark:text-stone-500">
          Nhập tên để bắt đầu tra cứu
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'Tra Cứu Điểm Giáo Lý – Thiếu Nhi Thánh Thể' })

const config = useRuntimeConfig()
const apiBase = config.public.apiBase

interface VerifyResult {
  studentId: string
  studentName: string
  branch: string
  className: string
  academicYear: string
  averageGrade: number | null
  conduct: string | null
}

const query = ref('')
const lastQuery = ref('')
const loading = ref(false)
const searched = ref(false)
const results = ref<VerifyResult[]>([])

const search = async () => {
  if (!query.value.trim()) return
  loading.value = true
  searched.value = false
  results.value = []
  lastQuery.value = query.value

  try {
    const data = await $fetch<VerifyResult[]>(`${apiBase}/api/students/verify`, {
      query: { q: query.value }
    })
    results.value = Array.isArray(data) ? data : [data as unknown as VerifyResult]
  } catch {
    results.value = []
  } finally {
    loading.value = false
    searched.value = true
  }
}

// Branch color helpers
const branchColor = (branch: string) => {
  const map: Record<string, string> = {
    'Ấu Nhi': 'bg-tntt-pink-100 text-tntt-pink-600',
    'Thiếu Nhi': 'bg-tntt-green-100 text-tntt-green-600',
    'Nghĩa Sĩ': 'bg-tntt-blue-100 text-tntt-blue-600',
    'Hiệp Sĩ': 'bg-tntt-gold-100 text-tntt-gold-600',
    'Huynh Trưởng': 'bg-tntt-brown-100 text-tntt-brown-600'
  }
  return map[branch] ?? 'bg-stone-100 text-stone-600'
}

const branchBadgeColor = (branch: string): 'error' | 'success' | 'info' | 'warning' | 'secondary' | 'neutral' | 'primary' => {
  const map: Record<string, 'error' | 'success' | 'info' | 'warning' | 'secondary' | 'neutral' | 'primary'> = {
    'Ấu Nhi': 'error', 'Thiếu Nhi': 'success',
    'Nghĩa Sĩ': 'info', 'Hiệp Sĩ': 'warning', 'Huynh Trưởng': 'secondary'
  }
  return map[branch] ?? 'neutral'
}

const gradeColor = (grade: number | null) => {
  if (grade === null) return 'text-stone-400'
  if (grade >= 8) return 'text-tntt-green-600'
  if (grade >= 6) return 'text-tntt-gold-600'
  return 'text-red-500'
}
</script>

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-67"></a>📄 [67/71] File: `web-portal/eslint.config.mjs`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** App & Build Config (Cấu hình) | **Số dòng:** 7 | **Kích thước:** 0.1 KB

```javascript
// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
)

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-68"></a>📄 [68/71] File: `web-portal/nuxt.config.ts`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** App & Build Config (Cấu hình) | **Số dòng:** 47 | **Kích thước:** 0.8 KB

```typescript
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-69"></a>📄 [69/71] File: `web-portal/package.json`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** App & Build Config (Cấu hình) | **Số dòng:** 30 | **Kích thước:** 0.7 KB

```json
{
  "name": "web-portal",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev --port 3001",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare",
    "lint": "eslint .",
    "typecheck": "nuxt typecheck"
  },
  "dependencies": {
    "@iconify-json/lucide": "^1.2.117",
    "@iconify-json/simple-icons": "^1.2.90",
    "@nuxt/ui": "^4.10.0",
    "nuxt": "^4.4.8",
    "tailwindcss": "^4.3.2"
  },
  "devDependencies": {
    "@nuxt/eslint": "^1.16.0",
    "@nuxtjs/google-fonts": "^3.2.0",
    "@types/node": "^26.2.0",
    "eslint": "^10.7.0",
    "typescript": "^6.0.3",
    "vue-tsc": "^3.3.7"
  },
  "packageManager": "pnpm@11.13.1"
}

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-70"></a>📄 [70/71] File: `web-portal/renovate.json`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** App & Build Config (Cấu hình) | **Số dòng:** 14 | **Kích thước:** 0.2 KB

```json
{
  "extends": [
    "github>nuxt/renovate-config-nuxt"
  ],
  "lockFileMaintenance": {
    "enabled": true
  },
  "packageRules": [{
    "matchDepTypes": ["resolutions"],
    "enabled": false
  }],
  "postUpdateOptions": ["pnpmDedupe"]
}

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

### <a id="fe-file-71"></a>📄 [71/71] File: `web-portal/tsconfig.json`
> **Dự án:** web-portal (Cổng Công Chúng) | **Phân loại:** App & Build Config (Cấu hình) | **Số dòng:** 11 | **Kích thước:** 0.3 KB

```json
{
  // https://nuxt.com/docs/guide/concepts/typescript
  "files": [],
  "references": [
    { "path": "./.nuxt/tsconfig.app.json" },
    { "path": "./.nuxt/tsconfig.server.json" },
    { "path": "./.nuxt/tsconfig.shared.json" },
    { "path": "./.nuxt/tsconfig.node.json" }
  ]
}

```

[⬆ Về mục lục](#muc-luc-toan-bo-cac-tep-frontend)

---

