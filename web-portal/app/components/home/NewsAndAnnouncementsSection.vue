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
