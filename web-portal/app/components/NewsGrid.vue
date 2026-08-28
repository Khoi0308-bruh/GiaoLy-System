<template>
  <section class="max-w-6xl mx-auto px-4 py-16">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-3xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
        Tin Tức & Sự Kiện
      </h2>
      <NuxtLink
        to="/news"
        class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
      >
        Xem tất cả tin tức &rarr;
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- News Cards (Mocked) -->
      <article
        v-for="(news, index) in newsList"
        :key="index"
        class="bg-white dark:bg-stone-900 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-stone-100 dark:border-stone-800 flex flex-col overflow-hidden group"
      >
        <div class="relative h-48 overflow-hidden">
          <img
            :src="news.image"
            :alt="news.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent" />
          <div class="absolute bottom-3 left-4">
            <span
              :class="news.tagColor"
              class="px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm"
            >
              {{ news.tag }}
            </span>
          </div>
        </div>
        <div class="p-5 flex-1 flex flex-col">
          <h3 class="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
            {{ news.title }}
          </h3>
          <p class="text-sm text-stone-600 dark:text-stone-400 mb-4 line-clamp-2">
            {{ news.summary }}
          </p>
          <div class="mt-auto pt-4 flex items-center justify-between text-xs text-stone-500 dark:text-stone-500 border-t border-stone-100 dark:border-stone-800">
            <span>{{ news.date }}</span>
            <span class="flex items-center gap-1"><UIcon name="i-heroicons-clock" /> {{ news.readTime }}</span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
// Mock data - In the future, this should fetch from /api/news
const newsList = [
  {
    image: 'https://images.unsplash.com/photo-1596706927429-b6951268686e?q=80&w=600&auto=format&fit=crop',
    tag: 'Ấu Nhi',
    tagColor: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    title: 'Sinh hoạt ngoại khóa khối Ấu Nhi tháng 8',
    summary: 'Các em Ấu nhi đã có một buổi chiều học hỏi giáo lý và vui chơi tràn đầy tiếng cười cùng các Huynh trưởng.',
    date: '25/08/2026',
    readTime: '3 phút đọc'
  },
  {
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop',
    tag: 'Hiệp Sĩ',
    tagColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    title: 'Khóa Tĩnh tâm chuẩn bị Lãnh nhận Bí tích Thêm Sức',
    summary: 'Ban Điều Hành Sứ Đoàn tổ chức khóa tĩnh tâm 2 ngày dành riêng cho các em ngành Hiệp Sĩ chuẩn bị lãnh nhận Bí Tích Thêm Sức.',
    date: '20/08/2026',
    readTime: '5 phút đọc'
  },
  {
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600&auto=format&fit=crop',
    tag: 'Xứ Đoàn',
    tagColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    title: 'Bầu cử Ban Quản Trị Sứ Đoàn nhiệm kỳ 2026-2030',
    summary: 'Kết quả bầu cử Ban Quản Trị mới đã chính thức được công bố sau Thánh Lễ Thiếu Nhi Chúa Nhật vừa qua.',
    date: '15/08/2026',
    readTime: '4 phút đọc'
  }
]
</script>
