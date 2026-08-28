<template>
  <div class="min-h-screen bg-slate-50 dark:bg-[#18191a] font-sans text-slate-900 transition-colors duration-300">
    <!-- ──────────────────────────────────────────────────────
         TOP BAR (cố định, full-width, giống thanh trên Facebook)
    ─────────────────────────────────────────────────────────── -->
    <header class="fixed top-0 left-0 right-0 z-50 h-[64px] bg-white dark:bg-[#242526] shadow-sm border-b-2 border-amber-500 flex items-center gap-2 px-3 transition-all duration-300">
      <!-- Logo -->
      <div class="flex items-center gap-2 shrink-0 lg:w-[280px] xl:w-[300px]">
        <NuxtLink
          to="/"
          class="flex items-center gap-2.5 group"
        >
          <div class="w-10 h-10 rounded-full bg-catholic-red flex items-center justify-center shadow-md shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg">
            <span class="text-white font-black text-xl leading-none">✝</span>
          </div>
          <span class="font-bold text-lg hidden sm:block tracking-wide whitespace-nowrap">Thiếu Nhi <span class="text-amber-600">Thánh Thể</span></span>
        </NuxtLink>
      </div>

      <!-- ── Center Nav Links ── -->
      <div class="hidden md:flex flex-1 justify-center items-center h-full gap-1 xl:gap-2">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-link-refined text-slate-500 hover:text-amber-600 dark:text-slate-400 group h-full px-2"
          active-class="active !text-amber-600"
        >
          <UIcon
            :name="item.icon"
            class="w-5 h-5 mr-1.5 shrink-0"
          />
          <span class="hidden xl:inline whitespace-nowrap text-sm">{{ item.label }}</span>
          <span
            v-if="item.badge"
            class="ml-1.5 px-1.5 py-0.5 bg-catholic-red text-white text-[10px] font-bold rounded-full shadow-sm"
          >{{ item.badge }}</span>
          <div class="nav-dot-floating bg-amber-500" />
        </NuxtLink>
      </div>

      <!-- ── Right Actions ── -->
      <div class="flex items-center gap-2 shrink-0 lg:w-[320px] xl:w-[360px] justify-end">
        <UColorModeButton
          size="sm"
          variant="soft"
          color="neutral"
        />
        <NuxtLink
          to="/profile"
          class="flex items-center gap-2 bg-slate-100 dark:bg-[#3a3b3c] hover:bg-amber-50 dark:hover:bg-[#4a4b4c] hover:text-amber-700 rounded-full pl-1 pr-3 py-1 transition-all duration-300 hover:shadow-sm"
        >
          <div class="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
            <UIcon
              name="i-heroicons-user"
              class="w-4 h-4 text-white"
            />
          </div>
          <span class="text-sm font-semibold text-stone-800 dark:text-stone-200 hidden lg:inline">Hồ Sơ</span>
        </NuxtLink>
        <!-- Mobile hamburger -->
        <UButton
          icon="i-heroicons-bars-3"
          color="neutral"
          variant="soft"
          size="sm"
          class="md:hidden"
          @click="mobileOpen = true"
        />
      </div>
    </header>

    <!-- ──────────────────────────────────────────────────────
         BODY: MAIN
    ─────────────────────────────────────────────────────────── -->
    <div class="pt-[64px] flex min-h-screen">
      <!-- ════════════════════════════════
           CENTER COLUMN (Full Width)
      ════════════════════════════════════ -->
      <main class="flex-1 min-w-0 flex flex-col pt-4 w-full">
        <div :class="[$route.path === '/' ? 'w-full flex-1' : 'w-full max-w-[1200px] mx-auto px-4 sm:px-6 flex-1']">
          <slot />
        </div>
        <LayoutFooterSection />
      </main>
    </div>

    <!-- ──────────────────────────────────────────────────────
         MOBILE SLIDE-OVER MENU
    ─────────────────────────────────────────────────────────── -->
    <USlideover
      v-if="mobileOpen"
      v-model="mobileOpen"
      side="left"
      class="md:hidden z-[100]"
    >
      <div class="flex flex-col h-full bg-white dark:bg-[#242526] p-4">
        <div class="flex items-center justify-between mb-4 pb-4 border-b border-stone-100 dark:border-stone-700">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
              <span class="text-white font-black text-sm">✝</span>
            </div>
            <span class="font-bold text-stone-800 dark:text-white">Thiếu Nhi Thánh Thể</span>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark"
            size="sm"
            @click="mobileOpen = false"
          />
        </div>
        <nav class="flex-1 space-y-0.5 overflow-y-auto">
          <NuxtLink
            v-for="item in sidebarItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-100 dark:hover:bg-[#3a3b3c] transition-colors"
            active-class="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
            @click="mobileOpen = false"
          >
            <div
              class="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              :class="item.iconBg"
            >
              <UIcon
                :name="item.icon"
                class="w-5 h-5"
                :class="item.iconColor"
              />
            </div>
            <span class="font-semibold text-sm text-stone-800 dark:text-stone-200">{{ item.label }}</span>
          </NuxtLink>
        </nav>
      </div>
    </USlideover>

    <!-- Floating Action Button (FAB) - Support / Contact -->
    <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 group">
      <!-- Hover menu -->
      <div class="absolute bottom-16 right-0 flex flex-col gap-2 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 origin-bottom">
        <button class="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg border border-slate-100 text-sm font-semibold text-slate-700 hover:text-amber-600 hover:border-amber-200 transition-all">
          <UIcon
            name="i-heroicons-envelope"
            class="w-4 h-4 text-red-500"
          />
          <span>Email HT</span>
        </button>
        <button class="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg border border-slate-100 text-sm font-semibold text-slate-700 hover:text-amber-600 hover:border-amber-200 transition-all">
          <UIcon
            name="i-heroicons-phone"
            class="w-4 h-4 text-green-500"
          />
          <span>Gọi Nóng</span>
        </button>
      </div>
      <!-- Main Button -->
      <button class="w-14 h-14 bg-catholic-red rounded-full shadow-[0_10px_25px_-5px_rgba(227,24,55,0.4)] flex items-center justify-center text-white hover:scale-110 hover:bg-amber-600 transition-all duration-300">
        <UIcon
          name="i-heroicons-chat-bubble-oval-left-ellipsis"
          class="w-7 h-7"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const mobileOpen = ref(false)

// Top center nav icons
interface NavItem { to: string, icon: string, label: string, badge?: string }
const navItems: NavItem[] = [
  { to: '/', icon: 'i-heroicons-home-solid', label: 'Trang Chủ' },
  { to: '/leadership', icon: 'i-heroicons-user-group', label: 'Giới Thiệu' },
  { to: '/thong-bao', icon: 'i-heroicons-bell-alert', label: 'Thông Báo' },
  { to: '/news', icon: 'i-heroicons-newspaper', label: 'Tin Tức' },
  { to: 'http://localhost:3000', icon: 'i-heroicons-cog-6-tooth', label: 'Quản Lý Đoàn Sinh' },
  { to: '/library', icon: 'i-heroicons-book-open', label: 'Tài Liệu' }
]

// Left sidebar navigation
interface SidebarItem { to: string, label: string, desc: string, icon: string, iconBg: string, iconColor: string, badge?: string }
const sidebarItems: SidebarItem[] = [
  {
    to: '/', label: 'Trang Chủ', desc: 'Bản tin tổng hợp',
    icon: 'i-heroicons-home-solid', iconBg: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    to: '/leadership', label: 'Ban Điều Hành Xứ', desc: 'Sơ đồ tổ chức Sứ Đoàn',
    icon: 'i-heroicons-user-group', iconBg: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    to: '/thong-bao', label: 'Thông Báo', desc: 'Thông báo từ giáo xứ',
    icon: 'i-heroicons-bell-alert', iconBg: 'bg-red-100 dark:bg-red-900/30', iconColor: 'text-red-600 dark:text-red-400'
  },
  {
    to: '/news', label: 'Tin Tức', desc: 'Tin tức Công giáo',
    icon: 'i-heroicons-newspaper', iconBg: 'bg-green-100 dark:bg-green-900/30', iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    to: 'http://localhost:3000', label: 'Quản Lý Đoàn Sinh', desc: 'Dành cho Huynh Trưởng',
    icon: 'i-heroicons-cog-6-tooth', iconBg: 'bg-stone-200 dark:bg-stone-800', iconColor: 'text-stone-600 dark:text-stone-400'
  },
  {
    to: '/library', label: 'Tài Liệu', desc: 'Tài liệu học tập & biểu mẫu',
    icon: 'i-heroicons-book-open', iconBg: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600 dark:text-orange-400'
  },
  {
    to: '/profile', label: 'Thông Tin Cá Nhân', desc: 'Hồ sơ, điểm số, điểm danh',
    icon: 'i-heroicons-user', iconBg: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600 dark:text-amber-400'
  }
]

</script>
