<template>
  <div class="min-h-screen font-sans relative pb-24 overflow-hidden">
    <!-- BACKGROUND MESH GRADIENT -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute top-0 -left-32 w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob bg-sky-200 dark:bg-sky-900"></div>
      <div class="absolute -bottom-32 right-0 w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-indigo-200 dark:bg-indigo-900"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
    </div>

    <div class="relative z-10 space-y-6 animate-fade-in-up px-4 md:px-8 pt-8 max-w-7xl mx-auto">

      <!-- PAGE HEADER -->
      <div class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div class="z-10 text-center md:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-300 text-xs font-black uppercase tracking-widest border border-sky-200 dark:border-sky-800 shadow-inner">
            <UIcon name="i-heroicons-newspaper" class="w-4 h-4" />
            <span>Phan He Noi Dung</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-stone-800 dark:text-white tracking-tight">
            Quan Ly <span class="text-sky-500">Tin Tuc RSS</span>
          </h1>
          <p class="text-stone-500 text-sm mt-2 max-w-lg">
            Theo doi va quan ly cac bai viet tin tuc Cong Giao duoc tong hop tu dong tu cac nguon RSS.
          </p>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3 z-10">
          <UBadge
            v-if="total > 0"
            :label="`${total} bai viet`"
            color="sky"
            variant="soft"
            size="lg"
            class="rounded-2xl font-black text-sm px-4"
          />
          <UButton
            label="Dong bo ngay"
            icon="i-heroicons-arrow-path"
            color="sky"
            variant="solid"
            size="lg"
            class="rounded-2xl shadow-lg shadow-sky-500/20 hover:-translate-y-0.5 transition-transform font-bold uppercase tracking-wider"
            :loading="syncing"
            @click="syncNow"
          />
        </div>
      </div>

      <!-- FILTER BAR -->
      <div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-xl border border-white/60 dark:border-stone-800 shadow-sm rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div class="flex items-center gap-2 flex-shrink-0">
          <UIcon name="i-heroicons-funnel" class="w-4 h-4 text-stone-400" />
          <span class="text-xs font-black text-stone-500 uppercase tracking-widest">Loc theo nguon:</span>
        </div>
        <USelect
          v-model="selectedSource"
          :options="sourceOptions"
          value-attribute="value"
          label-attribute="label"
          placeholder="Tat ca nguon"
          class="w-full sm:w-56"
          :ui="{ base: 'rounded-xl' }"
        />
        <div class="sm:ml-auto flex items-center gap-2">
          <span class="text-xs font-bold text-stone-400">Hien thi:</span>
          <USelect
            v-model="perPage"
            :options="perPageOptions"
            value-attribute="value"
            label-attribute="label"
            class="w-28"
            :ui="{ base: 'rounded-xl' }"
          />
        </div>
      </div>

      <!-- LOADING -->
      <div v-if="pending" class="flex flex-col items-center justify-center py-24">
        <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 animate-spin text-sky-400 mb-4" />
        <p class="text-stone-500 font-bold uppercase tracking-widest text-sm">Dang tai tin tuc...</p>
      </div>

      <!-- ERROR -->
      <UAlert
        v-else-if="error"
        color="error"
        variant="soft"
        icon="i-heroicons-exclamation-circle"
        title="Khong the tai tin tuc"
        :description="(error as any)?.message || 'Da xay ra loi khi ket noi API.'"
        class="rounded-2xl"
      />

      <!-- EMPTY -->
      <div
        v-else-if="!paginatedArticles.length"
        class="text-center py-24 bg-white/40 dark:bg-stone-900/40 backdrop-blur-xl rounded-[2rem] border border-white/50 dark:border-stone-800 shadow-sm"
      >
        <UIcon name="i-heroicons-newspaper" class="w-16 h-16 text-stone-300 dark:text-stone-700 mx-auto mb-4" />
        <p class="text-stone-500 font-bold text-lg">Chua co bai viet nao.</p>
        <p class="text-stone-400 text-sm mt-1">Thu dong bo de lay tin tuc moi nhat.</p>
        <UButton
          label="Dong bo ngay"
          icon="i-heroicons-arrow-path"
          variant="soft"
          color="sky"
          class="mt-4 rounded-xl font-bold"
          @click="syncNow"
        />
      </div>

      <!-- TABLE -->
      <div
        v-else
        class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] overflow-hidden"
      >
        <UTable
          :rows="paginatedArticles"
          :columns="columns"
          :ui="{
            wrapper: 'overflow-x-auto',
            thead: 'bg-stone-50/80 dark:bg-stone-800/50',
            th: { base: 'text-[10px] font-black text-stone-500 uppercase tracking-widest py-3 px-4 whitespace-nowrap' },
            td: { base: 'py-3 px-4 align-middle' },
            tr: { base: 'hover:bg-sky-50/50 dark:hover:bg-sky-900/10 transition-colors border-b border-stone-100 dark:border-stone-800 last:border-0' }
          }"
        >
          <!-- Tieu de -->
          <template #title-data="{ row }">
            <div class="max-w-sm">
              <a
                v-if="row.url"
                :href="row.url"
                target="_blank"
                rel="noopener"
                class="font-bold text-stone-800 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-colors line-clamp-2 leading-snug"
              >{{ row.title }}</a>
              <p v-else class="font-bold text-stone-800 dark:text-white line-clamp-2 leading-snug">
                {{ row.title }}
              </p>
            </div>
          </template>

          <!-- Nguon -->
          <template #source-data="{ row }">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-sky-400 flex-shrink-0"></div>
              <span class="text-xs font-bold text-stone-600 dark:text-stone-300 whitespace-nowrap">{{ row.source || '—' }}</span>
            </div>
          </template>

          <!-- Danh muc -->
          <template #category-data="{ row }">
            <UBadge
              v-if="row.category"
              :label="row.category"
              color="indigo"
              variant="soft"
              size="xs"
              class="font-bold uppercase tracking-wide rounded-lg whitespace-nowrap"
            />
            <span v-else class="text-xs text-stone-400">—</span>
          </template>

          <!-- Ngay dang -->
          <template #publishedAt-data="{ row }">
            <span class="text-xs font-bold text-stone-500 whitespace-nowrap">
              {{ formatDate(row.publishedAt) }}
            </span>
          </template>

          <!-- Trang thai -->
          <template #isActive-data="{ row }">
            <UBadge
              :label="row.isActive ? 'Hien' : 'An'"
              :color="row.isActive ? 'success' : 'neutral'"
              variant="soft"
              size="xs"
              class="font-black uppercase tracking-widest rounded-lg"
            />
          </template>

          <!-- Hanh dong -->
          <template #actions-data="{ row }">
            <div class="flex items-center gap-1">
              <UButton
                v-if="row.url"
                icon="i-heroicons-arrow-top-right-on-square"
                color="neutral"
                variant="ghost"
                size="xs"
                class="rounded-lg"
                :to="row.url"
                target="_blank"
              />
              <UButton
                :icon="row.isActive ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                :color="row.isActive ? 'warning' : 'success'"
                variant="ghost"
                size="xs"
                class="rounded-lg"
                @click="toggleActive(row)"
              />
            </div>
          </template>
        </UTable>
      </div>

      <!-- PAGINATION -->
      <div
        v-if="!pending && !error && total > 0"
        class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/40 dark:bg-stone-900/40 backdrop-blur-xl border border-white/60 dark:border-stone-800 rounded-2xl px-6 py-4"
      >
        <p class="text-xs font-bold text-stone-500">
          Hien thi <span class="text-sky-600">{{ rangeStart }}{{ '\u2013' }}{{ rangeEnd }}</span>
          trong tong so <span class="text-sky-600">{{ total }}</span> bai viet
        </p>
        <UPagination
          v-model:page="currentPage"
          :total="total"
          :items-per-page="perPage"
          :ui="{
            list: 'gap-1',
            item: { base: 'rounded-xl font-bold' },
            active: 'bg-sky-500 text-white shadow-md',
          }"
        />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Quan Ly Tin Tuc RSS - GiaoLy Admin' })

const toast = useToast()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string

// State
const selectedSource = ref('')
const currentPage = ref(1)
const perPage = ref(15)
const syncing = ref(false)

const perPageOptions = [
  { label: '10 / trang', value: 10 },
  { label: '15 / trang', value: 15 },
  { label: '25 / trang', value: 25 },
  { label: '50 / trang', value: 50 },
]

// Types
interface NewsArticle {
  id: string | number
  title: string
  url?: string
  source?: string
  category?: string
  publishedAt?: string
  isActive: boolean
}

// Fetch
const { data: rawArticles, pending, error, refresh } = await useFetch<NewsArticle[]>(
  () => `${apiBase}/api/news/catholic`,
  { default: () => [] as NewsArticle[], server: false }
)

// Source filter options
const sourceOptions = computed(() => {
  const sources = [...new Set((rawArticles.value ?? []).map(a => a.source).filter(Boolean))] as string[]
  return [
    { label: 'Tat Ca Nguon', value: '' },
    ...sources.map(s => ({ label: s, value: s })),
  ]
})

// Filtered + paginated
const filteredArticles = computed(() => {
  const list = rawArticles.value ?? []
  if (!selectedSource.value) return list
  return list.filter(a => a.source === selectedSource.value)
})

const total = computed(() => filteredArticles.value.length)
const rangeStart = computed(() => total.value === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1)
const rangeEnd = computed(() => Math.min(currentPage.value * perPage.value, total.value))

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return filteredArticles.value.slice(start, start + perPage.value)
})

watch([selectedSource, perPage], () => { currentPage.value = 1 })

// Columns
const columns = [
  { key: 'title',       label: 'Tieu De' },
  { key: 'source',      label: 'Nguon' },
  { key: 'category',    label: 'Danh Muc' },
  { key: 'publishedAt', label: 'Ngay Dang' },
  { key: 'isActive',    label: 'Trang Thai' },
  { key: 'actions',     label: '' },
]

// Sync action
const syncNow = async () => {
  syncing.value = true
  try {
    await $fetch(`${apiBase}/api/news/sync`, { method: 'POST' })
    toast.add({ title: 'Dong bo thanh cong', description: 'Da cap nhat tin tuc moi nhat.', color: 'success' })
    await refresh()
  } catch {
    toast.add({ title: 'Loi dong bo', description: 'Khong the ket noi toi may chu.', color: 'error' })
  } finally {
    syncing.value = false
  }
}

// Toggle active
const toggleActive = async (article: NewsArticle) => {
  try {
    await $fetch(`${apiBase}/api/news/${article.id}/toggle`, { method: 'PATCH' })
    article.isActive = !article.isActive
    toast.add({
      title: article.isActive ? 'Da hien bai viet' : 'Da an bai viet',
      color: 'success',
    })
  } catch {
    toast.add({ title: 'Loi cap nhat', color: 'error' })
  }
}

// Date formatter
const formatDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }) : '—'
</script>

<style scoped>
@keyframes blob {
  0%   { transform: translate(0px, 0px) scale(1); }
  33%  { transform: translate(30px, -50px) scale(1.1); }
  66%  { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob { animation: blob 10s infinite; }
.animation-delay-2000 { animation-delay: 2s; }

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
