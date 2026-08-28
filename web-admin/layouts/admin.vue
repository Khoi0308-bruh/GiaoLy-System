<template>
  <div class="min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors duration-500">
    <!-- Mobile Backdrop -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm"
      @click="isSidebarOpen = false"
    />

    <!-- ─── Sidebar ──────────────────────────────────────────── -->
    <aside
      :class="[
        isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20',
        'fixed inset-y-0 left-0 z-50 flex flex-col glass-card border-r border-stone-200/50 dark:border-stone-800/50 transition-all duration-300'
      ]"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center justify-center border-b border-stone-200/50 dark:border-stone-800/50 px-4 bg-primary-900/5 flex-shrink-0">
        <UIcon
          name="i-heroicons-shield-check"
          class="w-7 h-7 text-primary-600 flex-shrink-0"
        />
        <span
          v-if="isSidebarOpen"
          class="ml-3 font-serif font-bold text-lg text-stone-800 dark:text-white truncate"
        >
          Quản Trị Viên
        </span>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-2 scrollbar-thin">
        <!-- Home -->
        <NavItem
          to="/admin/dashboard"
          icon="i-heroicons-home"
          label="Tổng Quan"
          :expanded="isSidebarOpen"
          @click="closeOnMobile"
        />

        <div class="my-1 border-t border-stone-200/60 dark:border-stone-800/60" />

        <!-- Học Vụ group -->
        <p
          v-if="isSidebarOpen"
          class="text-[10px] font-black text-stone-400 uppercase tracking-widest px-2 pt-1 pb-0.5"
        >
          Học Vụ
        </p>
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

        <div class="my-1 border-t border-stone-200/60 dark:border-stone-800/60" />

        <!-- Nội dung group -->
        <p
          v-if="isSidebarOpen"
          class="text-[10px] font-black text-stone-400 uppercase tracking-widest px-2 pt-1 pb-0.5"
        >
          Nội Dung
        </p>
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

        <div class="my-1 border-t border-stone-200/60 dark:border-stone-800/60" />

        <!-- Phụng Vụ group -->
        <p
          v-if="isSidebarOpen"
          class="text-[10px] font-black text-stone-400 uppercase tracking-widest px-2 pt-1 pb-0.5"
        >
          Phụng Vụ
        </p>
        <NavItem
          to="/admin/liturgical"
          icon="i-heroicons-calendar-days"
          label="Lịch Phụng Vụ"
          :expanded="isSidebarOpen"
          @click="closeOnMobile"
        />

        <div class="my-1 border-t border-stone-200/60 dark:border-stone-800/60" />

        <!-- Về trang chủ công khai -->
        <NavItem
          to="/"
          icon="i-heroicons-arrow-left-on-rectangle"
          label="Trang Chủ"
          :expanded="isSidebarOpen"
        />
      </nav>

      <!-- Sidebar Toggle (Desktop only) -->
      <div class="hidden md:flex p-3 border-t border-stone-200/50 dark:border-stone-800/50">
        <UButton
          :icon="isSidebarOpen ? 'i-heroicons-chevron-double-left' : 'i-heroicons-chevron-double-right'"
          variant="ghost"
          color="neutral"
          class="w-full justify-center text-stone-400"
          @click="isSidebarOpen = !isSidebarOpen"
        />
      </div>
    </aside>

    <!-- ─── Main Content ──────────────────────────────────────── -->
    <div :class="['flex flex-col min-h-screen transition-all duration-300 md:ml-20', isSidebarOpen ? 'md:ml-64' : '']">
      <!-- Top Header -->
      <header class="sticky top-0 z-30 h-16 flex items-center justify-between px-4 md:px-6 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200/50 dark:border-stone-800/50">
        <div class="flex items-center gap-3">
          <UButton
            icon="i-heroicons-bars-3"
            color="neutral"
            variant="ghost"
            class="md:hidden"
            @click="isSidebarOpen = true"
          />
        </div>

        <div class="flex items-center gap-1 md:gap-2">
          <!-- Dark mode toggle -->
          <UButton
            :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
            color="neutral"
            variant="ghost"
            size="sm"
            :class="isDark ? 'text-vatican-gold-400' : 'text-stone-500'"
            @click="toggleColorMode"
          />


          <!-- User Dropdown -->
          <div class="flex items-center gap-2 pl-2 border-l border-stone-200 dark:border-stone-700 ml-1">
            <UDropdownMenu
              v-if="auth?.isLoggedIn"
              :items="accountMenuItems"
              :ui="{ item: { disabled: 'cursor-text select-text' } }"
              :popper="{ placement: 'bottom-end' }"
            >
              <UButton
                color="neutral"
                variant="ghost"
                class="px-2"
              >
                <div class="flex items-center gap-2">
                  <div class="text-right hidden sm:block">
                    <p class="text-sm font-bold text-stone-700 dark:text-stone-200 leading-tight">
                      {{ auth?.user?.name || 'Admin' }}
                    </p>
                    <p class="text-[10px] text-stone-400">
                      {{ roleName }}
                    </p>
                  </div>
                  <UIcon
                    name="i-heroicons-chevron-down"
                    class="w-4 h-4 hidden sm:block text-stone-400"
                  />
                </div>
              </UButton>
            </UDropdownMenu>
          </div>
        </div>
      </header>

      <!-- Page Slot -->
      <main class="flex-1 p-4 md:p-6 pb-20 md:pb-8">
        <slot />
      </main>
    </div>

    <!-- ─── Mobile Bottom Nav ────────────────────────────────── -->
    <nav class="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200/50 dark:border-stone-800/50 pb-safe">
      <div class="grid grid-cols-5 h-14">
        <MobileNavItem
          to="/admin/dashboard"
          icon="i-heroicons-home"
          label="Tổng Quan"
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
        <!-- Tin Tức đã có trong sidebar (nhóm Nội Dung) -->
        <MobileNavItem
          to="/admin/students"
          icon="i-heroicons-academic-cap"
          label="Đoàn Sinh"
        />
      </div>
    </nav>
  </div>
</template>

<script setup>
// ── Inline sub-components (tránh tạo file riêng cho 2 component nhỏ) ──
const NavItem = defineComponent({
  props: { to: String, icon: String, label: String, expanded: Boolean },
  emits: ['click'],
  setup(props, { emit }) {
    return () => h(resolveComponent('UTooltip'), { text: props.label, disabled: props.expanded, placement: 'right' }, {
      default: () => h(resolveComponent('UButton'), {
        to: props.to, variant: 'ghost', color: 'neutral',
        icon: props.icon, label: props.expanded ? props.label : '',
        class: 'justify-start w-full font-medium text-sm',
        activeClass: 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400',
        onClick: () => emit('click')
      })
    })
  }
})

const MobileNavItem = defineComponent({
  props: { to: String, icon: String, label: String },
  setup(props) {
    return () => h(resolveComponent('NuxtLink'), {
      to: props.to,
      class: 'flex flex-col items-center justify-center gap-0.5 text-stone-400 hover:text-primary-500 transition-colors',
      activeClass: 'text-primary-500'
    }, {
      default: () => [
        h(resolveComponent('UIcon'), { name: props.icon, class: 'w-5 h-5' }),
        h('span', { class: 'text-[9px] font-semibold leading-tight' }, props.label)
      ]
    })
  }
})

const isSidebarOpen = ref(false)
const auth = useAuthStore()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

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

const accountMenuItems = computed(() => {
  return [
    [{
      label: auth?.user?.name || 'Admin',
      disabled: true
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


const toggleColorMode = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
const closeOnMobile = () => {
  if (window.innerWidth < 768) isSidebarOpen.value = false
}
</script>
