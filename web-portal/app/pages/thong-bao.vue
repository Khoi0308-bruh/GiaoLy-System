<template>
  <div>
    <!-- Page Header -->
    <section class="relative py-14 overflow-hidden bg-gradient-to-br from-tntt-blue-800 via-tntt-blue-700 to-tntt-blue-900 text-white">
      <div class="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-tntt-blue-500/20 rounded-full blur-3xl" />
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-xs font-bold uppercase tracking-widest text-blue-200 mb-2">
          Sứ Đoàn Thiếu Nhi Thánh Thể
        </p>
        <h1 class="font-serif font-bold text-3xl md:text-4xl mb-3">
          Bảng Thông Báo
        </h1>
        <p class="text-blue-100 max-w-xl text-sm">
          Tổng hợp toàn bộ thông báo từ Ban Điều Hành Sứ Đoàn và Giáo Xứ. Cập nhật thường xuyên.
        </p>
      </div>
    </section>

    <!-- Filter Bar -->
    <div class="sticky top-[56px] z-20 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 py-3">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center gap-3">
        <UBadge
          v-for="cat in categories"
          :key="cat.value"
          :color="activeCategory === cat.value ? 'primary' : 'neutral'"
          :variant="activeCategory === cat.value ? 'solid' : 'outline'"
          class="cursor-pointer text-xs px-3 py-1.5 font-semibold select-none"
          @click="activeCategory = cat.value"
        >
          {{ cat.label }}
        </UBadge>
        <div class="ml-auto text-xs text-stone-400">
          {{ filteredAnnouncements.length }} thông báo
        </div>
      </div>
    </div>

    <!-- Content -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Loading Skeleton -->
      <div
        v-if="loading"
        class="space-y-4"
      >
        <div
          v-for="n in 5"
          :key="n"
          class="h-28 bg-stone-100 dark:bg-stone-800 rounded-2xl animate-pulse"
        />
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="text-center py-16"
      >
        <UIcon
          name="i-heroicons-exclamation-circle"
          class="w-14 h-14 mx-auto text-red-400 mb-4"
        />
        <p class="font-bold text-stone-600 dark:text-stone-400">
          Không thể tải thông báo
        </p>
        <p class="text-sm text-stone-400 mt-1">
          {{ error }}
        </p>
        <UButton
          class="mt-4"
          color="primary"
          variant="soft"
          @click="refresh"
        >
          Thử lại
        </UButton>
      </div>

      <!-- Announcement List -->
      <div
        v-else-if="filteredAnnouncements.length"
        class="space-y-4"
      >
        <div
          v-for="(item, i) in filteredAnnouncements"
          :key="item.id"
          class="group bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 p-5 hover:shadow-md transition-all flex gap-4"
          :class="[item.isImportant ? 'border-l-4 border-l-red-500 dark:border-l-red-500' : 'border-l-4 border-l-tntt-blue-500 dark:border-l-tntt-blue-400']"
          :style="{ animationDelay: `${i * 0.04}s` }"
        >
          <!-- Date Block -->
          <div class="shrink-0 text-center min-w-[52px]">
            <div
              class="rounded-xl px-2 py-1.5 text-white text-xs font-bold shadow-sm"
              :class="item.isImportant ? 'bg-red-500' : 'bg-tntt-blue-600'"
            >
              <p class="text-base leading-none font-black">
                {{ formatDay(item.publishedAt) }}
              </p>
              <p class="uppercase tracking-wider text-[9px] mt-0.5 opacity-80">
                {{ formatMonth(item.publishedAt) }}
              </p>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2 mb-1.5">
              <h3 class="font-bold text-stone-900 dark:text-stone-100 group-hover:text-tntt-blue-600 dark:group-hover:text-tntt-blue-400 transition-colors leading-snug">
                {{ item.title }}
              </h3>
              <UBadge
                v-if="item.isImportant"
                color="error"
                variant="subtle"
                size="xs"
                class="shrink-0"
              >
                Quan trọng
              </UBadge>
            </div>
            <p
              v-if="item.content"
              class="text-sm text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3"
            >
              {{ item.content }}
            </p>
            <p class="text-xs text-stone-400 mt-2 font-medium">
              <span v-if="item.category">{{ item.category }} · </span>{{ formatDate(item.publishedAt) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="text-center py-24"
      >
        <UIcon
          name="i-heroicons-megaphone"
          class="w-16 h-16 mx-auto mb-4 text-stone-300 dark:text-stone-700 opacity-50"
        />
        <p class="font-semibold text-stone-500 dark:text-stone-400">
          Chưa có thông báo nào.
        </p>
        <p class="text-sm text-stone-400 mt-1">
          Vui lòng quay lại sau.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'Thông Báo – Thiếu Nhi Thánh Thể' })

const config = useRuntimeConfig()
const apiBase = config.public.apiBase

interface Announcement {
  id: string
  title: string
  content: string
  category: string
  isImportant: boolean
  publishedAt: string
}

const loading = ref(true)
const error = ref<string | null>(null)
const announcements = ref<Announcement[]>([])
const activeCategory = ref<string>('all')

const categories = [
  { label: 'Tất cả', value: 'all' },
  { label: '⚠️ Quan trọng', value: 'important' },
  { label: 'Học vụ', value: 'Học vụ' },
  { label: 'Sinh hoạt', value: 'Sinh hoạt' },
  { label: 'Giáo xứ', value: 'Giáo xứ' }
]

const filteredAnnouncements = computed(() => {
  if (activeCategory.value === 'all') return announcements.value
  if (activeCategory.value === 'important') return announcements.value.filter(a => a.isImportant)
  return announcements.value.filter(a => a.category === activeCategory.value)
})

const refresh = async () => {
  loading.value = true
  error.value = null
  try {
    const data = await $fetch<Announcement[]>(`${apiBase}/api/announcements`, {
      query: { limit: 50, sort: 'newest' }
    })
    announcements.value = Array.isArray(data) ? data : []
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Lỗi không xác định'
    // Fallback mock data khi API chưa chạy
    announcements.value = [
      {
        id: '1',
        title: 'Thông báo khai giảng năm học Giáo lý mới 2026-2027',
        content: 'Kính thưa quý Phụ huynh, Chúa nhật tuần sau Giáo xứ sẽ chính thức khai giảng năm học mới. Thánh lễ lúc 7:30 sáng, sau đó các em sẽ tập trung theo lớp đã được phân bổ.',
        category: 'Học vụ',
        isImportant: true,
        publishedAt: '2026-08-25T07:00:00Z'
      },
      {
        id: '2',
        title: 'Thay đổi giờ lễ cho khối Ấu Nhi ngày Chúa Nhật',
        content: 'Do thời tiết nắng nóng, giờ lễ của khối Ấu Nhi sẽ được chuyển lên sớm hơn 30 phút. Phụ huynh vui lòng đưa các em đến đúng giờ.',
        category: 'Sinh hoạt',
        isImportant: false,
        publishedAt: '2026-08-20T07:00:00Z'
      },
      {
        id: '3',
        title: 'Đăng ký tham gia cắm trại ngành Nghĩa Sĩ',
        content: 'Trại hè sẽ diễn ra vào cuối tháng 8. Các em Nghĩa Sĩ đăng ký trực tiếp cho Huynh trưởng phụ trách lớp trước ngày 22/08.',
        category: 'Sinh hoạt',
        isImportant: false,
        publishedAt: '2026-08-15T07:00:00Z'
      },
      {
        id: '4',
        title: 'Họp phụ huynh đầu năm học',
        content: 'Ban Điều Hành kính mời Quý Phụ Huynh tham dự buổi họp phụ huynh đầu năm học. Thời gian: 8:00 sáng Chúa Nhật 01/09/2026 tại hội trường giáo xứ.',
        category: 'Giáo xứ',
        isImportant: true,
        publishedAt: '2026-08-10T07:00:00Z'
      }
    ]
    // Clear the error so fallback data shows
    error.value = null
  } finally {
    loading.value = false
  }
}

// Format helpers
const formatDay = (dateStr: string) => new Date(dateStr).getDate().toString().padStart(2, '0')
const formatMonth = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('vi-VN', { month: 'short' })
const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })

// Load on mount
await refresh()
</script>
