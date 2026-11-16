<template>
  <div layout="default">
    <!-- Header -->
    <section class="relative bg-gradient-to-br from-tntt-blue-700 via-tntt-blue-600 to-tntt-blue-800 py-14 text-white overflow-hidden">
      <div
        class="absolute inset-0 opacity-20"
        style="background-image: radial-gradient(circle at 20% 80%, #60a5fa 0%, transparent 50%), radial-gradient(circle at 80% 20%, #818cf8 0%, transparent 50%)"
      />
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-xs font-bold uppercase tracking-widest text-blue-200 mb-2">
          Tự động cập nhật mỗi ngày lúc 2:00 SA
        </p>
        <h1 class="font-serif font-bold text-3xl md:text-4xl mb-3">
          Tin Tức Công Giáo
        </h1>
        <p class="text-blue-100 max-w-xl">
          Tổng hợp tin tức từ Vatican News, HĐGM Việt Nam và các nguồn Công giáo uy tín.
        </p>
      </div>
    </section>

    <!-- Filters -->
    <section class="sticky top-[56px] z-20 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 py-3">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center gap-3">
        <UBadge
          id="filter-all"
          :color="activeSource === null ? 'primary' : 'neutral'"
          :variant="activeSource === null ? 'solid' : 'outline'"
          class="cursor-pointer text-xs px-3 py-1.5 font-semibold"
          @click="activeSource = null"
        >
          Tất cả
        </UBadge>
        <UBadge
          v-for="src in sources"
          :id="`filter-${src}`"
          :key="src"
          :color="activeSource === src ? 'primary' : 'neutral'"
          :variant="activeSource === src ? 'solid' : 'outline'"
          class="cursor-pointer text-xs px-3 py-1.5 font-semibold"
          @click="activeSource = src"
        >
          {{ src }}
        </UBadge>

        <div class="ml-auto text-xs text-stone-400">
          {{ filteredArticles.length }} bài viết
        </div>
      </div>
    </section>

    <!-- Grid -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Loading -->
      <div
        v-if="loading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="n in 6"
          :key="n"
          class="h-64 bg-stone-100 dark:bg-stone-800 rounded-2xl animate-pulse"
        />
      </div>

      <!-- Articles -->
      <div
        v-else-if="filteredArticles.length"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <article
          v-for="(article, i) in filteredArticles"
          :key="article.id"
          :class="['glass-card overflow-hidden hover-lift animate-fade-in-up group cursor-pointer']"
          :style="{ animationDelay: `${Math.min(i * 0.05, 0.4)}s` }"
          @click="openArticle(article.link)"
        >
          <!-- Image -->
          <div class="h-44 overflow-hidden relative bg-stone-100 dark:bg-stone-800">
            <img
              v-if="article.imageUrl"
              :src="imageProxyUrl(article.imageUrl)"
              :alt="article.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              @error="(e: Event) => (e.target as HTMLImageElement).style.display = 'none'"
            >
            <div
              v-else
              class="w-full h-full flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-newspaper"
                class="w-10 h-10 text-stone-300 dark:text-stone-600"
              />
            </div>
            <span class="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
              {{ article.sourceName }}
            </span>
          </div>

          <!-- Content -->
          <div class="p-4">
            <p class="text-[11px] text-stone-400 mb-1.5">
              {{ formatDate(article.publishedDate) }}
            </p>
            <h2 class="font-bold text-sm text-stone-800 dark:text-white leading-snug line-clamp-3 group-hover:text-tntt-blue-600 dark:group-hover:text-tntt-blue-400 transition-colors">
              {{ article.title }}
            </h2>
            <p class="text-xs text-stone-500 dark:text-stone-400 mt-2 line-clamp-2">
              {{ article.summary }}
            </p>
          </div>
        </article>
      </div>

      <!-- Empty -->
      <div
        v-else
        class="text-center py-24 text-stone-400"
      >
        <UIcon
          name="i-heroicons-newspaper"
          class="w-16 h-16 mx-auto mb-4 opacity-30"
        />
        <p class="font-semibold text-stone-500">
          Chưa có tin tức nào từ nguồn này.
        </p>
        <p class="text-sm mt-1">
          Hệ thống sẽ tự động cập nhật lúc 2:00 SA mỗi ngày.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', public: true })
useHead({ title: 'Tin Tức Công Giáo – Thiếu Nhi Thánh Thể' })

const config = useRuntimeConfig()
const apiBase = config.public.apiBase

interface Article {
  id: string
  title: string
  link: string
  summary: string
  imageUrl: string
  sourceName: string
  category: string
  publishedDate: string
}

const loading = ref(true)
const articles = ref<Article[]>([])
const activeSource = ref<string | null>(null)

const { data } = await useFetch<Article[]>(`${apiBase}/api/v1/public/news`, {
  query: { limit: 50, sort: 'newest' },
  default: () => []
})
articles.value = data.value ?? []
loading.value = false

const sources = computed(() => [...new Set(articles.value.map(a => a.sourceName))])

const filteredArticles = computed(() =>
  activeSource.value
    ? articles.value.filter(a => a.sourceName === activeSource.value)
    : articles.value
)

const imageProxyUrl = (url: string) =>
  `${apiBase}/api/v1/public/news/image?url=${encodeURIComponent(url)}`

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })

const openArticle = (link: string) =>
  window.open(link, '_blank', 'noopener,noreferrer')
</script>
