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
              <!-- Màu dùng qua class, không dùng style inline: style sẽ thắng dark:text-white
                   và làm chữ navy chìm trên nền tối. -->
              <span class="font-black text-[15px] tracking-wider text-[#1a3a6b] dark:text-white transition-colors">Thiếu Nhi</span>
              <span class="font-bold text-[13px] tracking-wider text-[#a07840] dark:text-[#e8c98a]">Thánh Thể</span>
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
              <span class="font-black text-base text-[#1a3a6b] dark:text-white">Thiếu Nhi Thánh Thể</span>
              <span class="text-xs font-medium text-[#a07840] dark:text-[#e8c98a]">Cầu Nguyện • Rước Lễ • Hy Sinh</span>
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
  '/ban-huynh-truong': 'Ban Điều Hành',
  '/tin-tuc': 'Tin Tức',
  '/thu-vien': 'Tài Liệu',
  '/lich-phung-vu': 'Lịch Phụng Vụ',
  '/xac-thuc-chung-chi': 'Tra Cứu Chứng Chỉ',
  '/phu-huynh': 'Phụ Huynh',
  '/dang-nhap': 'Đăng Nhập',
  '/doi-mat-khau-lan-dau': 'Đổi Mật Khẩu',
  '/leadership': 'Ban Điều Hành',
  '/thong-bao': 'Thông Báo',
  '/news': 'Tin Tức',
  '/library': 'Tài Liệu',
  '/liturgical': 'Lịch Phụng Vụ',
  '/verify': 'Tra Cứu',
  '/profile': 'Hồ Sơ Cá Nhân',
}
// Trang con (vd /phu-huynh/<id>) dùng nhãn của đoạn đường dẫn đầu tiên thay vì in GUID thô.
const currentPageLabel = computed(() => {
  const path = route.path.replace(/\/$/, '')
  const firstSegment = `/${path.split('/')[1] ?? ''}`
  return pageLabelMap[path] ?? pageLabelMap[firstSegment] ?? firstSegment.replace('/', '')
})

// ── Nav Items (top bar) ──
interface NavItem { to: string; icon: string; label: string; badge?: string; external?: boolean }
const navItems: NavItem[] = [
  { to: '/', icon: 'i-heroicons-home-solid', label: 'Trang Chủ' },
  { to: '/leadership', icon: 'i-heroicons-user-group', label: 'Giới Thiệu' },
  { to: '/thong-bao', icon: 'i-heroicons-bell-alert', label: 'Thông Báo' },
  { to: '/news', icon: 'i-heroicons-newspaper', label: 'Tin Tức' },
  { to: useRuntimeConfig().public.adminBase as string, icon: 'i-heroicons-cog-6-tooth', label: 'Quản Lý Đoàn Sinh', external: true },
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
