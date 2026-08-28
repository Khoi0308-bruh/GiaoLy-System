<template>
  <section
    id="thong-bao"
    class="max-w-6xl mx-auto px-4 -mt-16 relative z-20"
  >
    <div class="bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl shadow-xl shadow-stone-200/50 dark:shadow-none rounded-2xl p-6 border border-stone-100 dark:border-stone-800 transition-colors">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
          <UIcon
            name="i-heroicons-bell-alert"
            class="w-6 h-6 text-red-600 dark:text-red-500"
          />
          Thông báo mới nhất
        </h2>
        <NuxtLink
          to="/thong-bao"
          class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          Xem tất cả &rarr;
        </NuxtLink>
      </div>

      <div class="space-y-3">
        <!-- Notice Items (Mocked) -->
        <div
          v-for="(notice, index) in notices"
          :key="index"
          class="group flex flex-col md:flex-row gap-4 p-4 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors border-l-4"
          :class="notice.isImportant ? 'border-red-500' : 'border-blue-500'"
        >
          <div class="flex-shrink-0 text-sm font-medium text-stone-500 dark:text-stone-400 md:w-28 pt-1">
            {{ notice.date }}
          </div>
          <div>
            <h3 class="font-bold text-stone-800 dark:text-stone-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
              {{ notice.title }}
              <UBadge
                v-if="notice.isImportant"
                color="error"
                variant="subtle"
                size="xs"
                class="ml-2"
              >
                Quan trọng
              </UBadge>
            </h3>
            <p class="text-stone-600 dark:text-stone-400 text-sm mt-1.5 leading-relaxed">
              {{ notice.content }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Mock data - In the future, this should fetch from /api/announcements
const notices = [
  {
    date: '25/08/2026',
    title: 'Thông báo khai giảng năm học Giáo lý mới 2026-2027',
    content: 'Kính thưa quý Phụ huynh, chúa nhật tuần sau Giáo xứ sẽ chính thức khai giảng năm học mới. Thánh lễ lúc 7:30 sáng, sau đó các em sẽ tập trung theo lớp đã được phân bổ.',
    isImportant: true
  },
  {
    date: '20/08/2026',
    title: 'Thay đổi giờ lễ cho khối Ấu Nhi',
    content: 'Do thời tiết nắng nóng, giờ lễ của khối Ấu Nhi sẽ được chuyển lên sớm hơn 30 phút. Phụ huynh vui lòng đưa các em đến đúng giờ.',
    isImportant: false
  },
  {
    date: '15/08/2026',
    title: 'Đăng ký tham gia cắm trại ngành Nghĩa Sĩ',
    content: 'Trại hè sẽ diễn ra vào cuối tháng 8. Các em Nghĩa Sĩ đăng ký trực tiếp cho Huynh trưởng phụ trách lớp trước ngày 22/08.',
    isImportant: false
  }
]
</script>
