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

const { data: news } = await useFetch<NewsArticle[]>('/api/news/catholic?limit=4', {
  baseURL: 'https://localhost:7198'
})

const { data: announcements } = await useFetch<Announcement[]>('/api/announcement?limit=5', {
  baseURL: 'https://localhost:7198'
})
</script>

<template>
  <div class="flex flex-col gap-10 mb-8 relative">
    <!-- Ambient Glow Effect (Dark Mode only) -->
    <div class="hidden dark:block absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

    <!-- Hàng 1: Tin Tức Mới Nhất -->
    <div class="relative z-10 w-full">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <UIcon
              name="i-heroicons-newspaper"
              class="w-6 h-6 text-blue-600"
            />
          </div>
          <h2 class="text-2xl font-bold text-stone-800 dark:text-white">
            Tin Tức Mới Nhất
          </h2>
        </div>
        <UButton
          color="neutral"
          variant="ghost"
          label="Xem tất cả"
          trailing-icon="i-heroicons-arrow-right-20-solid"
          to="/news"
        />
      </div>

      <div
        v-if="news && news.length > 0"
        class="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <!-- Bài viết nổi bật (to hơn) -->
        <div class="md:col-span-2 group cursor-pointer relative rounded-2xl overflow-hidden shadow-sm h-[350px]">
          <img
            :src="news[0]?.imageUrl"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
            <UBadge
              color="primary"
              size="sm"
              class="mb-3 self-start"
            >
              {{ news[0]?.category }}
            </UBadge>
            <h3 class="text-2xl md:text-3xl font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2 drop-shadow-md">
              {{ news[0]?.title }}
            </h3>
          </div>
        </div>

        <!-- Các bài viết khác -->
        <div class="md:col-span-1 flex flex-col gap-4">
          <div
            v-for="item in news.slice(1, 4)"
            :key="item.id"
            class="group cursor-pointer flex gap-4 bg-white dark:bg-[#242526] p-3 rounded-xl border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-all"
          >
            <div class="w-24 h-24 rounded-lg overflow-hidden shrink-0">
              <img
                :src="item.imageUrl"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              >
            </div>
            <div class="flex flex-col justify-center">
              <h4 class="font-bold text-sm text-stone-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-3 leading-snug">
                {{ item.title }}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hàng 2: Thông Báo Nổi Bật -->
    <div class="relative z-10 w-full bg-white dark:bg-[#242526] rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100 dark:border-stone-800">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <UIcon
              name="i-heroicons-bell-alert"
              class="w-6 h-6 text-red-600"
            />
          </div>
          <h2 class="text-2xl font-bold text-stone-800 dark:text-white">
            Bảng Thông Báo
          </h2>
        </div>
        <UButton
          color="neutral"
          variant="soft"
          label="Xem bảng tin"
          trailing-icon="i-heroicons-arrow-right-20-solid"
          to="/thong-bao"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="(item, index) in announcements"
          :key="item.id"
          class="flex items-start gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-[#3a3b3c] hover:bg-stone-100 dark:hover:bg-[#4a4b4c] transition-colors cursor-pointer border border-transparent hover:border-stone-200 dark:hover:border-stone-600"
        >
          <div class="shrink-0 mt-1">
            <UIcon
              v-if="item.isUrgent"
              name="i-heroicons-exclamation-triangle-solid"
              class="w-8 h-8 text-red-500 drop-shadow-sm"
            />
            <div
              v-else
              class="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 font-bold text-xs"
            >
              {{ index + 1 }}
            </div>
          </div>

          <div class="flex-1">
            <h4
              class="font-bold text-base text-stone-800 dark:text-white leading-snug mb-2"
              :class="{ 'text-red-600 dark:text-red-400': item.isUrgent }"
            >
              {{ item.title }}
            </h4>
            <div class="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
              <span class="flex items-center gap-1">
                <UIcon
                  name="i-heroicons-calendar"
                  class="w-4 h-4"
                />
                {{ new Date(item.createdDate).toLocaleDateString('vi-VN') }}
              </span>
              <UBadge
                v-if="item.isUrgent"
                color="error"
                variant="subtle"
                size="xs"
              >
                Khẩn cấp
              </UBadge>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
