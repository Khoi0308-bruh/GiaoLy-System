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
  <footer
    class="relative mt-24 border-t overflow-hidden bg-white dark:bg-[#0a0d13]"
    style="border-color: rgba(201,169,110,0.25);"
  >
    <!-- Dải màu 5 Ngành TNTT tinh tế với hiệu ứng gradient -->
    <div class="flex h-2 w-full shadow-sm">
      <div
        class="flex-1 bg-pink-500"
        title="Ngành Ấu Nhi"
      />
      <div
        class="flex-1 bg-blue-500"
        title="Ngành Thiếu Nhi"
      />
      <div
        class="flex-1 bg-emerald-500"
        title="Ngành Nghĩa Sĩ"
      />
      <div
        class="flex-1 bg-red-600"
        title="Ngành Hiệp Sĩ"
      />
      <div
        class="flex-1 bg-amber-700"
        title="Huynh Trưởng"
      />
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
              <span
                class="text-white font-extrabold text-[9px] tracking-widest mt-0.5"
                style="color: #e8c98a;"
              >TNTT</span>
            </div>
            <div>
              <span
                class="text-[11px] font-black uppercase tracking-[0.25em]"
                style="color: #a07840;"
              >
                Phong Trào Giới Trẻ
              </span>
              <h2 class="text-2xl font-black font-serif leading-tight uppercase text-[#1a3a6b] dark:text-[#e8c98a]">
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
          <h3 class="text-xs font-black uppercase tracking-[0.2em] mb-6 text-[#1a3a6b] dark:text-[#e8c98a]">
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
          <h3 class="text-xs font-black uppercase tracking-[0.2em] mb-6 text-[#1a3a6b] dark:text-[#e8c98a]">
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
                class="hover:underline transition-colors text-[#1a3a6b] dark:text-stone-300"
              >
                contact@xudoan.org
              </a>
            </li>
          </ul>

          <div
            class="mt-6 pt-6 border-t flex items-center gap-3"
            style="border-color: rgba(201,169,110,0.2);"
          >
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
          <NuxtLink
            to="#"
            class="hover:underline"
            style="color: #a07840;"
          >Quy Chế Sinh Hoạt</NuxtLink>
          <NuxtLink
            to="#"
            class="hover:underline"
            style="color: #a07840;"
          >Bảo Vệ Thiếu Nhi</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
