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
  <footer class="relative mt-20 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-[#18191a] overflow-hidden">
    <!-- Dải màu 5 Ngành TNTT -->
    <div class="flex h-1.5 w-full">
      <div class="flex-1 bg-tntt-pink-500" />
      <div class="flex-1 bg-tntt-green-500" />
      <div class="flex-1 bg-tntt-blue-600" />
      <div class="flex-1 bg-tntt-gold-500" />
      <div class="flex-1 bg-tntt-brown-600" />
    </div>

    <!-- Họa tiết Watermark chìm ở góc -->
    <UIcon
      name="i-heroicons-globe-asia-australia"
      class="absolute -bottom-20 -right-20 w-96 h-96 text-stone-100/50 dark:text-stone-800/30 z-0 select-none pointer-events-none"
    />

    <div class="relative z-10 w-full max-w-[1200px] mx-auto px-6 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-16">
        <!-- Cột 1: Nhận diện & Sứ Mạng (Chiếm 5 cột) -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-blue-700 flex flex-col items-center justify-center shadow-lg shrink-0 border-2 border-white dark:border-stone-800">
              <span class="text-white font-black text-2xl leading-none">✝</span>
              <span class="text-white font-bold text-[10px] tracking-widest mt-0.5">TNTT</span>
            </div>
            <div>
              <h2 class="text-2xl font-black text-stone-800 dark:text-white leading-tight font-serif uppercase">
                Thiếu Nhi<br>Thánh Thể
              </h2>
            </div>
          </div>

          <div class="pl-2 border-l-4 border-amber-500">
            <p class="text-lg font-serif italic text-stone-600 dark:text-stone-300">
              "Cầu Nguyện • Rước Lễ • Hy Sinh • Làm Tông Đồ"
            </p>
          </div>

          <p class="text-sm text-stone-500 dark:text-stone-400 leading-relaxed max-w-sm">
            Website chính thức của Xứ Đoàn. Nơi cập nhật tin tức, lịch phụng vụ và các tài liệu giáo lý cho đoàn sinh và huynh trưởng.
          </p>
        </div>

        <!-- Cột 2: Quick Links (Chiếm 3 cột) -->
        <div class="lg:col-span-3">
          <h3 class="text-sm font-black text-stone-800 dark:text-stone-200 uppercase tracking-widest mb-6">
            Liên Kết Nhanh
          </h3>
          <ul class="flex flex-col gap-3">
            <li
              v-for="link in quickLinks"
              :key="link.to"
            >
              <NuxtLink
                :to="link.to"
                :target="link.external ? '_blank' : undefined"
                class="text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-500 font-medium transition-colors flex items-center gap-2 group"
              >
                <UIcon
                  name="i-heroicons-chevron-right"
                  class="w-4 h-4 text-stone-300 dark:text-stone-700 group-hover:text-amber-500 transition-colors"
                />
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Cột 3: Liên hệ (Chiếm 4 cột) -->
        <div class="lg:col-span-4">
          <h3 class="text-sm font-black text-stone-800 dark:text-stone-200 uppercase tracking-widest mb-6">
            Liên Hệ
          </h3>
          <ul class="flex flex-col gap-4">
            <li class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
                <UIcon
                  name="i-heroicons-map-pin"
                  class="w-4 h-4 text-stone-600 dark:text-stone-400"
                />
              </div>
              <p class="text-sm text-stone-600 dark:text-stone-400 mt-1.5 leading-relaxed">
                Nhà Thờ Giáo Xứ<br>Đường ABC, Phường XYZ, Thành Phố
              </p>
            </li>
            <li class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
                <UIcon
                  name="i-heroicons-envelope"
                  class="w-4 h-4 text-stone-600 dark:text-stone-400"
                />
              </div>
              <a
                href="mailto:contact@xudoan.org"
                class="text-sm text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
              >
                contact@xudoan.org
              </a>
            </li>
          </ul>

          <div class="mt-6 pt-6 border-t border-stone-100 dark:border-stone-800">
            <div class="flex gap-4">
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-simple-icons-facebook"
                size="sm"
                class="rounded-full"
              />
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-simple-icons-youtube"
                size="sm"
                class="rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Copyright -->
    <div class="relative z-10 w-full border-t border-stone-100 dark:border-stone-800/60 bg-stone-50 dark:bg-stone-900/50">
      <div class="w-full max-w-[1200px] mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-xs font-medium text-stone-400 dark:text-stone-500">
          &copy; {{ currentYear }} Web Portal Xứ Đoàn. All rights reserved.
        </p>
        <div class="flex gap-4 text-xs font-medium text-stone-400 dark:text-stone-500">
          <NuxtLink
            to="#"
            class="hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
          >Bảo mật</NuxtLink>
          <NuxtLink
            to="#"
            class="hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
          >Điều khoản</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
