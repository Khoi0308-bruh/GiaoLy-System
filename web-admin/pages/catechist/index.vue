<template>
  <div class="max-w-6xl mx-auto p-4 md:p-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold font-serif text-marian-blue-900 dark:text-white">
        Góc Giáo Lý Viên
      </h1>
      <p class="text-stone-600 dark:text-stone-400 mt-2">
        Công cụ quản lý nội bộ dành riêng cho Giáo Lý Viên và Huynh Trưởng.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard
        v-for="tool in tools"
        :key="tool.title"
        class="hover-lift cursor-pointer bg-white/80 dark:bg-stone-900 border-none shadow-md"
        @click="navigateTo(tool.link)"
      >
        <div class="flex items-start space-x-4">
          <div :class="['p-3 rounded-md', tool.bgColor]">
            <UIcon
              :name="tool.icon"
              class="w-6 h-6 text-white"
            />
          </div>
          <div>
            <h3 class="font-semibold text-lg text-marian-blue-800 dark:text-stone-200">
              {{ tool.title }}
            </h3>
            <p class="text-sm text-stone-500 mt-1 line-clamp-2">
              {{ tool.desc }}
            </p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const tools = [
  {
    title: 'Sổ Hoa Thiêng',
    desc: 'Chấm điểm thi đua, viếng Chúa, làm việc thiện cho các em.',
    icon: 'i-lucide-flower-2',
    link: '/catechist/spiritual-bouquets',
    bgColor: 'bg-rose-500'
  },
  {
    title: 'Tiến Trình Bí Tích',
    desc: 'Theo dõi điều kiện Rước Lễ, Thêm Sức (Giấy tờ, Tĩnh tâm).',
    icon: 'i-lucide-scroll',
    link: '/catechist/sacraments',
    bgColor: 'bg-marian-blue-500'
  },
  {
    title: 'Thư Viện Giáo Án',
    desc: 'Soạn thảo và chia sẻ giáo án điện tử giữa các lớp.',
    icon: 'i-lucide-book-open',
    link: '/catechist/lesson-plans',
    bgColor: 'bg-vatican-gold-600'
  },
  {
    title: 'Phân Công Phụng Vụ',
    desc: 'Lên lịch trực, phân công giảng dạy cho Huynh trưởng.',
    icon: 'i-lucide-calendar-clock',
    link: '/catechist/duty-roster',
    bgColor: 'bg-emerald-600'
  },
  {
    title: 'Quản Lý Hội Trại',
    desc: 'Danh sách đi Sa mạc, đóng phí, chia đội nhóm.',
    icon: 'i-lucide-tent',
    link: '/catechist/camps',
    bgColor: 'bg-orange-500'
  }
]
</script>
