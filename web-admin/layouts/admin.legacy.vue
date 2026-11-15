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
