<script setup lang="ts">
import { ADMIN_NAV } from '../shared/nav'

const session = useSessionStore()
const route = useRoute()
const mobileMenuOpen = ref(false)

const groups = computed(() =>
  ADMIN_NAV
    .map((group) => {
      const items = group.items.filter(item => !item.permission || session.can(item.permission))
      return { ...group, items, collapsible: items.length > 1 }
    })
    .filter(group => group.items.length > 0)
)

const isActive = (to: string) => to === '/admin' ? route.path === '/admin' : route.path.startsWith(to)

// ── Nhóm điều hướng thu/mở ────────────────────────────────────────────────────
// Mặc định MỞ HẾT để không mục nào bị giấu sau một nút chưa được khám phá.
// Chỉ vùng <nav> cuộn (logo cố định phía trên), có scrollbar luôn hiển thị nhờ
// scrollbar-gutter nên người dùng thấy ngay là còn mục phía dưới. Người dùng
// vẫn thu gọn được từng nhóm; khi điều hướng vào một trang thuộc nhóm đã thu gọn
// thì nhóm đó tự mở lại.
const closedGroups = ref<Record<string, boolean>>({})
const isGroupOpen = (label: string) => closedGroups.value[label] !== true

function toggleGroup(label: string) {
  closedGroups.value[label] = isGroupOpen(label)
}

watch(
  [() => route.path, groups],
  () => {
    for (const group of groups.value) {
      if (group.items.some(item => isActive(item.to))) {
        closedGroups.value[group.label] = false
      }
    }
  },
  { immediate: true }
)

watch(() => route.path, () => {
  mobileMenuOpen.value = false
})

async function signOut() {
  await session.logout()
  await navigateTo('/dang-nhap')
}
</script>

<template>
  <div class="flex min-h-dvh flex-col lg:flex-row">
    <!-- Mobile top header with hamburger -->
    <header class="flex items-center justify-between border-b border-stone-200 bg-marian-800 px-4 py-2.5 text-white lg:hidden no-print">
      <NuxtLink to="/admin" class="flex items-center gap-2">
        <span class="arch-frame grid size-7 place-items-center bg-transparent text-sm text-vatican-300" aria-hidden="true">✝</span>
        <span class="font-display text-xl text-vatican-100">Giáo Lý</span>
      </NuxtLink>
      <div class="flex items-center gap-2">
        <UColorModeButton size="sm" />
        <button
          type="button"
          class="grid size-9 place-items-center rounded-lg border border-white/20 text-white hover:bg-white/10"
          :aria-expanded="mobileMenuOpen"
          aria-label="Mở menu điều hướng"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <UIcon :name="mobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'" class="size-5" />
        </button>
      </div>
    </header>

    <!-- Mobile Backdrop -->
    <div
      v-if="mobileMenuOpen"
      class="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
      @click="mobileMenuOpen = false"
    />

    <!-- Sidebar Desktop & Mobile Off-canvas -->
    <aside
      class="fixed inset-y-0 left-0 z-50 flex w-[260px] transform flex-col bg-gradient-to-b from-marian-800 to-marian-700 p-3 text-stone-100 transition-transform duration-200 ease-in-out lg:sticky lg:top-0 lg:h-dvh lg:shrink-0 no-print"
      :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <div class="mb-3 flex shrink-0 items-center justify-between border-b border-vatican-400/40 px-2 pb-4">
        <NuxtLink to="/admin" class="flex items-center gap-3">
          <span class="arch-frame grid size-9 place-items-center bg-transparent text-vatican-300" aria-hidden="true">✝</span>
          <span>
            <span class="font-display block text-2xl leading-none text-vatican-100">Giáo Lý</span>
            <span class="text-xs opacity-75">Ban Giáo Lý Giáo xứ</span>
          </span>
        </NuxtLink>
        <button
          type="button"
          class="grid size-8 place-items-center rounded-lg text-white/70 hover:bg-white/10 lg:hidden"
          aria-label="Đóng menu"
          @click="mobileMenuOpen = false"
        >
          <UIcon name="i-lucide-x" class="size-5" />
        </button>
      </div>

      <!-- Chỉ vùng nav cuộn; logo phía trên luôn cố định -->
      <nav
        aria-label="Điều hướng chính"
        class="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain pr-1 [scrollbar-gutter:stable]"
      >
        <div v-for="group in groups" :key="group.label">
          <button
            v-if="group.collapsible"
            type="button"
            class="mb-1 flex w-full items-center justify-between gap-2 px-2 text-xs font-semibold tracking-wider text-vatican-300 uppercase hover:text-vatican-100"
            :aria-expanded="isGroupOpen(group.label)"
            @click="toggleGroup(group.label)"
          >
            <span>{{ group.label }}</span>
            <UIcon
              :name="isGroupOpen(group.label) ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
              class="size-3.5 shrink-0 opacity-80"
            />
          </button>
          <div v-else class="mb-1 px-2 text-xs font-semibold tracking-wider text-vatican-300 uppercase">
            {{ group.label }}
          </div>

          <div v-if="!group.collapsible || isGroupOpen(group.label)" class="space-y-0.5">
            <NuxtLink
              v-for="item in group.items"
              :key="item.to"
              :to="item.to"
              class="block rounded-lg border-l-4 px-3 py-1.5 text-sm transition-colors hover:bg-white/10"
              :class="isActive(item.to) ? 'border-vatican-300 bg-vatican-300/15 font-semibold text-white' : 'border-transparent text-stone-200'"
            >
              {{ item.label }}
            </NuxtLink>
          </div>
        </div>
      </nav>
    </aside>

    <!-- Main Content Area -->
    <div class="flex min-w-0 flex-1 flex-col">
      <LiturgicalStrip />

      <!-- Topbar Desktop -->
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 bg-parchment px-6 py-3 dark:border-stone-700 dark:bg-stone-900 no-print">
        <span class="text-sm text-stone-700 dark:text-stone-300">
          <strong v-if="session.me">{{ session.me.fullName }}</strong>
          <span v-if="session.me?.role" class="opacity-80"> · {{ session.me.role.name }}</span>
          <span v-if="!session.me" class="text-stone-400">Chưa đăng nhập</span>
        </span>
        <div class="flex items-center gap-2">
          <UColorModeButton class="hidden sm:inline-flex" />
          <UButton size="sm" variant="outline" to="/admin/tai-khoan">
            Tài khoản
          </UButton>
          <UButton size="sm" variant="ghost" color="neutral" @click="signOut">
            Đăng xuất
          </UButton>
        </div>
      </div>

      <main class="mx-auto w-full max-w-[1180px] flex-1 px-4 py-6 sm:px-6">
        <ScopeBanner />
        <slot />
      </main>
    </div>
  </div>
</template>
