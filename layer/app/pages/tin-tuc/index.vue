<script setup lang="ts">
import { ApiError } from '~/composables/useApi'

definePageMeta({ public: true })

const api = useApi()
const { sanitize } = useSafeHtml()

interface NewsArticle {
  id: string
  title: string
  summary?: string | null
  content?: string | null
  imageUrl?: string | null
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

function getSafeImageUrl(rawUrl?: string | null) {
  if (!rawUrl) return ''
  // Nếu là url bên ngoài, dùng proxy ảnh an toàn của hệ thống qua endpoint /public/news/image
  return `/api/v1/public/news/image?url=${encodeURIComponent(rawUrl)}`
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
  <PortalShell>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
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
              :options="categories.map(c => ({ label: c === 'all' ? 'Tất cả chuyên mục' : c, value: c }))"
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
          class="group rounded-xl border border-stone-200 bg-white overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between cursor-pointer"
          @click="openArticle(item)"
        >
          <div>
            <div class="aspect-video w-full bg-stone-100 overflow-hidden relative">
              <img
                v-if="item.imageUrl"
                :src="getSafeImageUrl(item.imageUrl)"
                :alt="item.title"
                class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              >
              <div v-else class="h-full w-full flex items-center justify-center text-stone-400 bg-stone-50">
                <UIcon name="i-heroicons-photo" class="h-10 w-10 text-stone-300" />
              </div>
              <span
                v-if="item.category"
                class="absolute top-2.5 left-2.5 rounded bg-[#1D3A73]/90 text-white text-[10px] font-semibold px-2 py-0.5 backdrop-blur-xs"
              >
                {{ item.category }}
              </span>
            </div>

            <div class="p-5 space-y-2">
              <div class="flex items-center justify-between text-[11px] text-stone-400">
                <span>{{ item.publishedAt }}</span>
                <span v-if="item.sourceName" class="font-medium text-stone-600">{{ item.sourceName }}</span>
              </div>
              <h2 class="font-serif text-base font-bold text-stone-900 group-hover:text-[#1D3A73] transition-colors line-clamp-2">
                {{ item.title }}
              </h2>
              <p v-if="item.summary" class="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                {{ item.summary }}
              </p>
            </div>
          </div>

          <div class="p-5 pt-0 flex items-center justify-between border-t border-stone-100 text-xs font-semibold text-[#1D3A73]">
            <span>Xem chi tiết</span>
            <UIcon name="i-heroicons-arrow-right" class="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </article>
      </div>

      <!-- Modal Chi tiết bài viết -->
      <UModal v-model="modalOpen" :ui="{ width: 'sm:max-w-3xl' }">
        <div v-if="selectedArticle" class="p-6 space-y-4">
          <div class="flex items-start justify-between gap-4">
            <div>
              <span
                v-if="selectedArticle.category"
                class="inline-block rounded bg-[#1D3A73]/10 text-[#1D3A73] text-xs font-semibold px-2.5 py-0.5 mb-2"
              >
                {{ selectedArticle.category }}
              </span>
              <h3 class="font-serif text-2xl font-bold text-stone-900">
                {{ selectedArticle.title }}
              </h3>
              <div class="text-xs text-stone-500 mt-1 flex items-center gap-3">
                <span>Ngày đăng: {{ selectedArticle.publishedAt }}</span>
                <span v-if="selectedArticle.sourceName">• Nguồn: {{ selectedArticle.sourceName }}</span>
              </div>
            </div>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark"
              size="sm"
              @click="modalOpen = false"
            />
          </div>

          <div v-if="selectedArticle.imageUrl" class="aspect-video w-full rounded-xl overflow-hidden bg-stone-100">
            <img
              :src="getSafeImageUrl(selectedArticle.imageUrl)"
              :alt="selectedArticle.title"
              class="h-full w-full object-cover"
            >
          </div>

          <p v-if="selectedArticle.summary" class="text-sm font-medium text-stone-700 italic border-l-2 border-[#A8812A] pl-3 py-1">
            {{ selectedArticle.summary }}
          </p>

          <div
            v-if="selectedArticle.content"
            class="prose prose-stone max-w-none text-xs sm:text-sm text-stone-800 leading-relaxed"
            v-html="sanitize(selectedArticle.content)"
          />

          <div class="pt-4 border-t border-stone-200 flex justify-end">
            <UButton variant="outline" color="gray" @click="modalOpen = false">
              Đóng lại
            </UButton>
          </div>
        </div>
      </UModal>
    </div>
  </PortalShell>
</template>
