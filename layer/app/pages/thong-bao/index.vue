<script setup lang="ts">
import { ApiError } from '../../composables/useApi'

definePageMeta({ public: true })

const api = useApi()
const { sanitize } = useSafeHtml()

interface PublicAnnouncement {
  id: string
  title: string
  summary?: string | null
  content?: string | null
  priority: string
  targetAudience?: string | null
  publishedAt: string
  isPinned?: boolean
}

const announcements = ref<PublicAnnouncement[]>([])
const loading = ref(false)
const error = ref<ApiError | null>(null)
const searchQuery = ref('')
const selectedPriority = ref('all')
const expandedId = ref<string | null>(null)

async function fetchAnnouncements() {
  loading.value = true
  error.value = null
  try {
    const res = await api.get<{ items?: PublicAnnouncement[], data?: PublicAnnouncement[] } | PublicAnnouncement[]>('/public/announcements')
    if (Array.isArray(res)) {
      announcements.value = res
    } else if (res && Array.isArray(res.items)) {
      announcements.value = res.items
    } else if (res && Array.isArray(res.data)) {
      announcements.value = res.data
    } else {
      announcements.value = []
    }
  } catch (e) {
    error.value = e as ApiError
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAnnouncements()
})

const filteredAnnouncements = computed(() => {
  return announcements.value.filter(a => {
    const matchesSearch = !searchQuery.value ||
      a.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (a.summary && a.summary.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (a.content && a.content.toLowerCase().includes(searchQuery.value.toLowerCase()))

    const matchesPriority = selectedPriority.value === 'all' || a.priority === selectedPriority.value

    return matchesSearch && matchesPriority
  })
})

function toggleExpand(id: string) {
  expandedId.value = expandedId.value === id ? null : id
}
</script>

<template>
  <PortalShell>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <!-- Header -->
      <div class="border-b border-stone-200 pb-5">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1D3A73] text-[#ECC367]">
              <UIcon name="i-heroicons-megaphone" class="h-6 w-6" />
            </div>
            <div>
              <h1 class="font-serif text-2xl font-bold text-stone-900">
                Thông Báo Giáo Xứ
              </h1>
              <p class="text-xs text-stone-600">
                Các thông tin, thông tri và chương trình sinh hoạt gửi cộng đoàn và phụ huynh
              </p>
            </div>
          </div>

          <!-- Search and Filter -->
          <div class="flex flex-wrap items-center gap-3">
            <UInput
              v-model="searchQuery"
              icon="i-heroicons-magnifying-glass"
              placeholder="Tìm kiếm thông báo..."
              size="sm"
              class="w-64"
            />
            <USelect
              v-model="selectedPriority"
              :items="[
                { label: 'Tất cả mức độ', value: 'all' },
                { label: 'Khẩn cấp / Quan trọng', value: 'High' },
                { label: 'Bình thường', value: 'Normal' }
              ]"
              size="sm"
            />
          </div>
        </div>
      </div>

      <ErrorState v-if="error" :error="error" />

      <div v-if="loading" class="py-16 text-center text-sm text-stone-500">
        Đang tải danh sách thông báo...
      </div>

      <EmptyState
        v-else-if="filteredAnnouncements.length === 0"
        title="Không tìm thấy thông báo"
        description="Hiện tại không có thông báo nào phù hợp với điều kiện tìm kiếm của bạn."
        icon="i-heroicons-inbox"
      />

      <div v-else class="space-y-4">
        <div
          v-for="a in filteredAnnouncements"
          :key="a.id"
          class="rounded-xl border border-stone-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-sm"
        >
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="space-y-2 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span
                  v-if="a.priority === 'High' || a.priority === 'Urgent'"
                  class="rounded bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5"
                >
                  KHẨN CẤP
                </span>
                <span
                  v-if="a.isPinned"
                  class="rounded bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5"
                >
                  GHIM ĐẦU TRANG
                </span>
                <span v-if="a.targetAudience" class="rounded bg-stone-100 text-stone-600 text-[10px] font-medium px-2 py-0.5">
                  Đối tượng: {{ a.targetAudience }}
                </span>
                <span class="text-xs text-stone-400">
                  Ngày đăng: {{ formatDate(a.publishedAt) }}
                </span>
              </div>

              <h2 class="font-serif text-lg font-bold text-stone-900">
                {{ a.title }}
              </h2>

              <p v-if="a.summary" class="text-xs text-stone-600 leading-relaxed">
                {{ a.summary }}
              </p>
            </div>

            <UButton
              v-if="a.content"
              size="xs"
              variant="soft"
              color="primary"
              :icon="expandedId === a.id ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
              @click="toggleExpand(a.id)"
            >
              {{ expandedId === a.id ? 'Thu gọn' : 'Xem nội dung' }}
            </UButton>
          </div>

          <!-- Nội dung chi tiết mở rộng -->
          <div
            v-if="expandedId === a.id && a.content"
            class="mt-4 pt-4 border-t border-stone-100 text-xs text-stone-700 leading-relaxed prose prose-stone max-w-none"
            v-html="sanitize(a.content)"
          />
        </div>
      </div>
    </div>
  </PortalShell>
</template>
