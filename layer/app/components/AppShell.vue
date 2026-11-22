<script setup lang="ts">
import { ADMIN_NAV } from '../shared/nav'

const session = useSessionStore()
const route = useRoute()
const mobileMenuOpen = ref(false)

const groups = computed(() =>
  ADMIN_NAV
    .map(group => ({
      ...group,
      items: group.items.filter(item => !item.permission || session.can(item.permission))
    }))
    .filter(group => group.items.length > 0)
)

const isActive = (to: string) => to === '/admin' ? route.path === '/admin' : route.path.startsWith(to)

watch(() => route.path, () => {
  mobileMenuOpen.value = false
})

async function signOut() {
  await session.logout()
  await navigateTo('/dang-nhap')
}
</script>

<template>
  <div class="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
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
      class="fixed inset-y-0 left-0 z-50 w-[260px] transform bg-gradient-to-b from-marian-800 to-marian-700 p-3 text-stone-100 transition-transform duration-200 ease-in-out lg:static lg:block lg:h-screen lg:w-auto lg:overflow-y-auto lg:translate-x-0 no-print"
      :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <div class="mb-3 flex items-center justify-between border-b border-vatican-400/40 px-2 pb-4">
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

      <nav aria-label="Điều hướng chính" class="space-y-4">
        <div v-for="group in groups" :key="group.label">
          <div class="mx-2 mb-1 text-xs font-semibold tracking-wider text-vatican-300 uppercase">
            {{ group.label }}
          </div>
          <div class="space-y-0.5">
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
    <div class="flex min-w-0 flex-col">
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

      <main class="w-full max-w-[1180px] flex-1 px-4 py-6 sm:px-6">
        <ScopeBanner />
        <slot />
      </main>
    </div>
  </div>
</template>
