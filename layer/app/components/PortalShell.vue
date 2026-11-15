<script setup lang="ts">
const session = useSessionStore()
const mobileMenuOpen = ref(false)

const navLinks = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Thông báo', to: '/thong-bao' },
  { label: 'Tin tức', to: '/tin-tuc' },
  { label: 'Thư viện', to: '/thu-vien' },
  { label: 'Ban Huynh Trưởng', to: '/ban-huynh-truong' },
  { label: 'Lịch phụng vụ', to: '/lich-phung-vu' },
  { label: 'Xác thực chứng chỉ', to: '/xac-thuc-chung-chi' }
]
</script>

<template>
  <div class="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
    <!-- Topbar Dải màu Vatican Gold / Marian Blue -->
    <header class="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs">
      <div class="h-1 bg-gradient-to-r from-[#1D3A73] via-[#A8812A] to-[#1D3A73]" />

      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between gap-4">
          <!-- Logo & Brand -->
          <NuxtLink to="/" class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1D3A73] text-white shadow-xs">
              <span class="font-serif font-bold text-lg text-[#ECC367]">GX</span>
            </div>
            <div>
              <div class="font-serif text-lg font-bold leading-tight text-[#1D3A73]">
                Giáo Lý Giáo Xứ
              </div>
              <div class="text-[11px] font-medium uppercase tracking-wider text-[#A8812A]">
                Cổng thông tin & Huấn giáo
              </div>
            </div>
          </NuxtLink>

          <!-- Desktop Navigation -->
          <nav class="hidden lg:flex items-center gap-1">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="px-3 py-1.5 text-xs font-semibold rounded-md transition-colors"
              active-class="bg-[#1D3A73]/10 text-[#1D3A73]"
              :class="'text-stone-700 hover:bg-stone-100 hover:text-[#1D3A73]'"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>

          <!-- Actions: Cổng phụ huynh, Admin, Đăng nhập -->
          <div class="flex items-center gap-2">
            <NuxtLink
              to="/phu-huynh"
              class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-[#A8812A] text-[#A8812A] hover:bg-[#A8812A]/10 transition-colors"
            >
              <UIcon name="i-heroicons-user" class="h-3.5 w-3.5" />
              <span>Cổng phụ huynh</span>
            </NuxtLink>

            <template v-if="session.isAuthenticated">
              <NuxtLink
                to="/admin"
                class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-[#1D3A73] text-white hover:bg-[#1D3A73]/90 transition-colors"
              >
                <UIcon name="i-heroicons-shield-check" class="h-3.5 w-3.5" />
                <span>Trang quản trị</span>
              </NuxtLink>
              <button
                type="button"
                class="p-1.5 text-stone-500 hover:text-stone-700 rounded-md"
                title="Đăng xuất"
                @click="session.clearSession()"
              >
                <UIcon name="i-heroicons-arrow-right-on-rectangle" class="h-4 w-4" />
              </button>
            </template>
            <template v-else>
              <NuxtLink
                to="/dang-nhap"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-[#1D3A73] text-white hover:bg-[#1D3A73]/90 transition-colors"
              >
                <span>Đăng nhập</span>
              </NuxtLink>
            </template>

            <!-- Mobile menu button -->
            <button
              type="button"
              class="lg:hidden p-2 rounded-md text-stone-600 hover:bg-stone-100"
              aria-label="Menu"
              @click="mobileMenuOpen = !mobileMenuOpen"
            >
              <UIcon :name="mobileMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'" class="h-6 w-6" />
            </button>
          </div>
        </div>

        <!-- Mobile Navigation Menu -->
        <div v-if="mobileMenuOpen" class="lg:hidden py-3 border-t border-stone-200 space-y-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="block px-3 py-2 text-sm font-medium rounded-md text-stone-700 hover:bg-stone-100 hover:text-[#1D3A73]"
            @click="mobileMenuOpen = false"
          >
            {{ link.label }}
          </NuxtLink>
          <div class="pt-2 border-t border-stone-100 space-y-1">
            <NuxtLink
              to="/phu-huynh"
              class="block px-3 py-2 text-sm font-medium text-[#A8812A] hover:bg-amber-50 rounded-md"
              @click="mobileMenuOpen = false"
            >
              Cổng phụ huynh tra cứu
            </NuxtLink>
            <NuxtLink
              v-if="session.isAuthenticated"
              to="/admin"
              class="block px-3 py-2 text-sm font-medium text-[#1D3A73] hover:bg-blue-50 rounded-md"
              @click="mobileMenuOpen = false"
            >
              Bảng điều khiển Quản trị
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-stone-900 text-stone-400 text-xs border-t border-stone-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Cột 1: Thông tin giáo xứ -->
          <div class="space-y-3">
            <div class="flex items-center gap-2 text-white">
              <div class="flex h-8 w-8 items-center justify-center rounded bg-[#1D3A73] text-[#ECC367] font-serif font-bold text-sm">
                GX
              </div>
              <span class="font-serif font-bold text-base">Giáo Lý Giáo Xứ</span>
            </div>
            <p class="text-stone-400 text-xs leading-relaxed">
              Hệ thống quản lý huấn giáo và đồng hành cùng thiếu nhi trên hành trình đức tin và phụng sự.
            </p>
            <p class="text-[11px] text-[#ECC367]">
              "Cứ để trẻ nhỏ đến với Thầy, đừng ngăn cấm chúng" (Mc 10,14)
            </p>
          </div>

          <!-- Cột 2: Cổng thông tin -->
          <div class="space-y-2">
            <h4 class="font-semibold text-stone-200 uppercase tracking-wider text-[11px]">
              Cổng thông tin
            </h4>
            <ul class="space-y-1.5">
              <li><NuxtLink to="/thong-bao" class="hover:text-stone-200">Thông báo giáo xứ</NuxtLink></li>
              <li><NuxtLink to="/tin-tuc" class="hover:text-stone-200">Tin tức Giáo hội</NuxtLink></li>
              <li><NuxtLink to="/thu-vien" class="hover:text-stone-200">Thư viện tài liệu huấn giáo</NuxtLink></li>
              <li><NuxtLink to="/ban-huynh-truong" class="hover:text-stone-200">Đội ngũ Huynh trưởng</NuxtLink></li>
              <li><NuxtLink to="/lich-phung-vu" class="hover:text-stone-200">Lịch phụng vụ & Thánh lễ</NuxtLink></li>
            </ul>
          </div>

          <!-- Cột 3: Tiện ích -->
          <div class="space-y-2">
            <h4 class="font-semibold text-stone-200 uppercase tracking-wider text-[11px]">
              Dành cho Phụ huynh & GLV
            </h4>
            <ul class="space-y-1.5">
              <li><NuxtLink to="/phu-huynh" class="hover:text-stone-200">Cổng thông tin phụ huynh</NuxtLink></li>
              <li><NuxtLink to="/xac-thuc-chung-chi" class="hover:text-stone-200">Tra cứu chứng chỉ bí tích</NuxtLink></li>
              <li><NuxtLink to="/dang-nhap" class="hover:text-stone-200">Đăng nhập tài khoản</NuxtLink></li>
              <li><NuxtLink to="/admin" class="hover:text-stone-200">Khu vực dành cho GLV</NuxtLink></li>
            </ul>
          </div>

          <!-- Cột 4: Giờ sinh hoạt -->
          <div class="space-y-2">
            <h4 class="font-semibold text-stone-200 uppercase tracking-wider text-[11px]">
              Sinh hoạt Giáo lý
            </h4>
            <p class="text-stone-400 text-xs">
              Thánh lễ Thiếu nhi: Chúa Nhật hàng tuần lúc 07:00<br>
              Giờ học Giáo lý: 08:15 – 09:30 Chúa Nhật
            </p>
            <div class="pt-2 text-[11px] text-stone-500">
              © 2026 Quản lý Giáo lý Giáo xứ V3. Bảo mật theo chuẩn Công giáo.
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
