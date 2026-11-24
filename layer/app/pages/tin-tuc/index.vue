<script setup lang="ts">
import { ApiError } from '../../composables/useApi'

definePageMeta({ public: true })

const api = useApi()
const { sanitize } = useSafeHtml()
const apiBase = useRuntimeConfig().public.apiBase

interface NewsArticle {
  id: string
  title: string
  summary?: string | null
  content?: string | null
  imageUrl?: string | null
  link?: string | null
  sourceName?: string | null
  sourceUrl?: string | null
  publishedAt: string
  category?: string | null
}

const articles = ref<NewsArticle[]>([])
const loading = ref(false)
const error = ref<ApiError | null>(null)
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedArticle = ref<NewsArticle | null>(null)
const modalOpen = ref(false)
const articleLink = computed(() => selectedArticle.value?.link || selectedArticle.value?.sourceUrl || null)

function getSafeImageUrl(rawUrl?: string | null) {
  if (!rawUrl) return ''
  // Nếu là url bên ngoài, dùng proxy ảnh an toàn của hệ thống qua endpoint /public/news/image.
  // Proxy nằm ở máy chủ API, không phải máy chủ Nuxt, nên phải ghép apiBase.
  return `${apiBase}/api/v1/public/news/image?url=${encodeURIComponent(rawUrl)}`
}

async function fetchNews() {
  loading.value = true
  error.value = null
  try {
    const res = await api.get<{ items?: NewsArticle[], data?: NewsArticle[] } | NewsArticle[]>('/public/news')
    if (Array.isArray(res)) {
      articles.value = res
    } else if (res && Array.isArray(res.items)) {
      articles.value = res.items
    } else if (res && Array.isArray(res.data)) {
      articles.value = res.data
    } else {
      articles.value = []
    }
  } catch (e) {
    error.value = e as ApiError
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchNews()
})

const categories = computed(() => {
  const set = new Set<string>()
  articles.value.forEach(a => {
    if (a.category) set.add(a.category)
  })
  return ['all', ...Array.from(set)]
})

const filteredArticles = computed(() => {
  return articles.value.filter(a => {
    const matchesSearch = !searchQuery.value ||
      a.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (a.summary && a.summary.toLowerCase().includes(searchQuery.value.toLowerCase()))

    const matchesCat = selectedCategory.value === 'all' || a.category === selectedCategory.value

    return matchesSearch && matchesCat
  })
})

function openArticle(article: NewsArticle) {
  selectedArticle.value = article
  modalOpen.value = true
}
</script>

<template>
  <div class="mx-auto w-full max-w-7xl space-y-8">
      <!-- Header -->
      <div class="border-b border-stone-200 pb-5">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1D3A73] text-[#ECC367]">
              <UIcon name="i-heroicons-newspaper" class="h-6 w-6" />
            </div>
            <div>
              <h1 class="font-serif text-2xl font-bold text-stone-900">
                Tin Tức Giáo Hội & Giáo Xứ
              </h1>
              <p class="text-xs text-stone-600">
                Thông tin thời sự Giáo hội hoàn vũ, Giáo phận và nhịp sống của Xứ đoàn
              </p>
            </div>
          </div>

          <!-- Bộ lọc & Tìm kiếm -->
          <div class="flex flex-wrap items-center gap-3">
            <UInput
              v-model="searchQuery"
              icon="i-heroicons-magnifying-glass"
              placeholder="Tìm kiếm bài viết..."
              size="sm"
              class="w-60"
            />
            <USelect
              v-model="selectedCategory"
              :items="categories.map(c => ({ label: c === 'all' ? 'Tất cả chuyên mục' : c, value: c }))"
              size="sm"
            />
          </div>
        </div>
      </div>

      <ErrorState v-if="error" :error="error" />

      <div v-if="loading" class="py-16 text-center text-sm text-stone-500">
        Đang tải bài viết tin tức...
      </div>

      <EmptyState
        v-else-if="filteredArticles.length === 0"
        title="Không tìm thấy bài viết"
        description="Hiện chưa có bài viết nào phù hợp với điều kiện tìm kiếm."
        icon="i-heroicons-newspaper"
      />

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="item in filteredArticles"
          :key="item.id"
          class="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xs transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D3A73]"
          tabindex="0"
          role="button"
          @click="openArticle(item)"
          @keydown.enter="openArticle(item)"
          @keydown.space.prevent="openArticle(item)"
        >
          <!-- Ảnh chỉ hiện khi bài viết có ảnh; không có ảnh thì dồn thẳng vào nội dung. -->
          <div v-if="item.imageUrl" class="relative aspect-video w-full overflow-hidden bg-stone-100">
            <img
              :src="getSafeImageUrl(item.imageUrl)"
              :alt="item.title"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            >
            <span
              v-if="item.category"
              class="absolute top-2.5 left-2.5 rounded bg-[#1D3A73]/90 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs"
            >
              {{ item.category }}
            </span>
          </div>

          <div class="flex-1 space-y-2 p-5">
            <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-stone-400">
              <span v-if="!item.imageUrl && item.category" class="rounded bg-[#1D3A73]/10 px-2 py-0.5 font-semibold text-[#1D3A73]">
                {{ item.category }}
              </span>
              <span>{{ formatDate(item.publishedAt) }}</span>
              <span v-if="item.sourceName && item.sourceName !== item.category" class="font-medium text-stone-600">
                • {{ item.sourceName }}
              </span>
            </div>
            <h2 class="line-clamp-3 font-serif text-base font-bold leading-snug text-stone-900 transition-colors group-hover:text-[#1D3A73]">
              {{ item.title }}
            </h2>
            <p v-if="item.summary" class="line-clamp-3 text-xs leading-relaxed text-stone-600">
              {{ item.summary }}
            </p>
          </div>

          <div class="flex items-center justify-between border-t border-stone-100 px-5 py-3 text-xs font-semibold text-[#1D3A73]">
            <span>Xem chi tiết</span>
            <UIcon name="i-heroicons-arrow-right" class="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </article>
      </div>

      <!-- Modal Chi tiết bài viết -->
      <UModal v-model:open="modalOpen" :ui="{ content: 'sm:max-w-3xl' }">
        <template #body>
          <article v-if="selectedArticle" class="space-y-4">
            <header class="space-y-2 border-b border-stone-200 pb-4">
              <div class="flex flex-wrap items-center gap-2 text-[11px] text-stone-500">
                <span
                  v-if="selectedArticle.category"
                  class="rounded bg-[#1D3A73]/10 px-2 py-0.5 font-semibold text-[#1D3A73]"
                >
                  {{ selectedArticle.category }}
                </span>
                <span>{{ formatDateTime(selectedArticle.publishedAt) }}</span>
                <span v-if="selectedArticle.sourceName">• Nguồn: {{ selectedArticle.sourceName }}</span>
              </div>
              <h3 class="font-serif text-xl font-bold leading-snug text-stone-900 sm:text-2xl">
                {{ selectedArticle.title }}
              </h3>
            </header>

            <img
              v-if="selectedArticle.imageUrl"
              :src="getSafeImageUrl(selectedArticle.imageUrl)"
              :alt="selectedArticle.title"
              class="aspect-video w-full rounded-xl bg-stone-100 object-cover"
            >

            <p v-if="selectedArticle.summary" class="border-l-2 border-[#A8812A] py-1 pl-3 text-sm font-medium text-stone-700 italic">
              {{ selectedArticle.summary }}
            </p>

            <div
              v-if="selectedArticle.content"
              class="prose prose-stone max-w-none text-xs leading-relaxed text-stone-800 sm:text-sm"
              v-html="sanitize(selectedArticle.content)"
            />

            <p v-else-if="!selectedArticle.summary" class="rounded-lg bg-stone-50 p-3 text-xs text-stone-500">
              Bản tin chưa có nội dung tóm tắt. Vui lòng mở bài viết gốc để đọc đầy đủ.
            </p>
          </article>
        </template>

        <template #footer>
          <div class="flex w-full flex-wrap items-center justify-between gap-3">
            <UButton
              v-if="articleLink"
              :to="articleLink ?? '#'"
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              icon="i-heroicons-arrow-top-right-on-square"
            >
              Đọc bài gốc
            </UButton>
            <UButton variant="outline" color="neutral" size="sm" @click="modalOpen = false">
              Đóng lại
            </UButton>
          </div>
        </template>
      </UModal>
  </div>
</template>
