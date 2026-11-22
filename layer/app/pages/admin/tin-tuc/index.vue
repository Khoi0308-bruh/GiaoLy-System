<script setup lang="ts">
import { PERMISSIONS } from '../../../shared/permissions'
import type { ApiError } from '../../../composables/useApi'

definePageMeta({ layout: 'admin', permission: PERMISSIONS.News.View })

interface NewsArticleItem {
  id: string
  sourceId?: string | null
  sourceName?: string | null
  title: string
  link: string
  summary: string
  imageUrl?: string | null
  category: string
  publishedAt: string
  isActive: boolean
}

interface NewsSourceItem {
  id: string
  name: string
  rssUrl: string
  isActive: boolean
  articleCount: number
  createdAt: string
}

interface PagedNews {
  items: NewsArticleItem[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

const api = useApi()
const toast = useToast()
const { can } = usePermissions()

const activeTab = ref<'articles' | 'sources'>('articles')

const articles = ref<NewsArticleItem[]>([])
const sources = ref<NewsSourceItem[]>([])
const loading = ref(true)
const syncing = ref(false)
const error = ref<ApiError | null>(null)
const page = ref(1)
const pageSize = 24
const total = ref(0)

// Modal Thêm / Sửa nguồn
const sourceFormOpen = ref(false)
const isEditingSource = ref(false)
const savingSource = ref(false)
const currentSourceId = ref<string | null>(null)
const sourceForm = ref({
  name: '',
  rssUrl: '',
  isActive: true
})

// Modal Xóa nguồn
const deleteSourceOpen = ref(false)
const deletingSource = ref(false)
const selectedSource = ref<NewsSourceItem | null>(null)

async function loadData() {
  loading.value = true
  error.value = null
  try {
    const [resArticles, resSources] = await Promise.all([
      api.get<PagedNews>(`/news/articles?page=${page.value}&pageSize=${pageSize}`),
      api.get<NewsSourceItem[]>('/news/sources').catch(() => [])
    ])
    articles.value = resArticles?.items || []
    total.value = resArticles?.totalCount || 0
    sources.value = resSources || []
  } catch (e) {
    error.value = e as ApiError
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
watch(page, loadData)

async function syncNews() {
  syncing.value = true
  try {
    const result = await api.post<{ status: string, message?: string }>('/news/sync')
    if (result.status !== 'Succeeded') {
      throw new Error(result.message || 'Tác vụ đồng bộ không hoàn tất.')
    }
    toast.add({ title: 'Đã đồng bộ tin tức', description: result.message, color: 'success' })
    // Đang ở trang 1 thì tải lại ngay; trang khác thì để watch(page) tải lại, tránh gọi 2 lần.
    if (page.value === 1) await loadData()
    else page.value = 1
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể đồng bộ tin tức', description: err.detail || err.message, color: 'error' })
  } finally {
    syncing.value = false
  }
}

// ── Ẩn / Hiện bài viết ─────────────────────────────────
async function toggleArticleActive(a: NewsArticleItem) {
  try {
    await api.put(`/news/articles/${a.id}`, {
      isActive: !a.isActive
    })
    a.isActive = !a.isActive
    toast.add({
      title: a.isActive ? 'Đã kích hoạt hiển thị bài viết' : 'Đã ẩn bài viết khỏi Portal',
      color: 'success'
    })
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể thay đổi trạng thái', description: err.detail || err.message, color: 'error' })
  }
}

// ── Quản lý nguồn RSS ──────────────────────────────────
function openCreateSourceModal() {
  isEditingSource.value = false
  currentSourceId.value = null
  sourceForm.value = {
    name: '',
    rssUrl: '',
    isActive: true
  }
  sourceFormOpen.value = true
}

function openEditSourceModal(s: NewsSourceItem) {
  isEditingSource.value = true
  currentSourceId.value = s.id
  sourceForm.value = {
    name: s.name,
    rssUrl: s.rssUrl,
    isActive: s.isActive
  }
  sourceFormOpen.value = true
}

async function handleSaveSource() {
  if (!sourceForm.value.name.trim() || !sourceForm.value.rssUrl.trim()) {
    toast.add({ title: 'Vui lòng nhập tên nguồn và đường dẫn RSS', color: 'error' })
    return
  }
  savingSource.value = true
  try {
    const payload = {
      name: sourceForm.value.name.trim(),
      rssUrl: sourceForm.value.rssUrl.trim(),
      isActive: sourceForm.value.isActive
    }

    if (isEditingSource.value && currentSourceId.value) {
      await api.put(`/news/sources/${currentSourceId.value}`, payload)
      toast.add({ title: 'Cập nhật nguồn tin thành công', color: 'success' })
    } else {
      await api.post('/news/sources', payload)
      toast.add({ title: 'Thêm nguồn tin mới thành công', color: 'success' })
    }
    sourceFormOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Lỗi lưu nguồn tin', description: err.detail || err.message, color: 'error' })
  } finally {
    savingSource.value = false
  }
}

function openDeleteSourceModal(s: NewsSourceItem) {
  selectedSource.value = s
  deleteSourceOpen.value = true
}

async function handleDeleteSource() {
  if (!selectedSource.value) return
  deletingSource.value = true
  try {
    await api.delete(`/news/sources/${selectedSource.value.id}`)
    toast.add({ title: 'Đã xóa nguồn tin', color: 'success' })
    deleteSourceOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể xóa nguồn tin', description: err.detail || err.message, color: 'error' })
  } finally {
    deletingSource.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Tin tức & Dòng sự kiện Công giáo"
      subtitle="Tổng hợp tin tức tự động từ các nguồn tin chính thống của Giáo hội và Giáo phận"
    >
      <template #actions>
        <UButton
          v-if="can(PERMISSIONS.News.Update)"
          color="neutral"
          variant="soft"
          icon="i-lucide-refresh-cw"
          :loading="syncing"
          @click="syncNews"
        >
          Đồng bộ tin
        </UButton>
        <UButton
          v-if="can(PERMISSIONS.News.Create)"
          color="primary"
          icon="i-lucide-rss"
          @click="openCreateSourceModal"
        >
          Thêm nguồn RSS
        </UButton>
      </template>
    </PageHeader>

    <ErrorState v-if="error" :error="error" @retry="loadData" />

    <!-- Tabs chuyển đổi -->
    <div class="flex items-center gap-2 border-b border-stone-200 pb-2 dark:border-stone-800">
      <button
        type="button"
        class="rounded-lg px-4 py-2 text-sm font-semibold transition"
        :class="activeTab === 'articles' ? 'bg-marian-600 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800'"
        @click="activeTab = 'articles'"
      >
        <UIcon name="i-lucide-newspaper" class="mr-1.5 inline h-4 w-4" />
        Danh sách bài viết ({{ total }})
      </button>
      <button
        type="button"
        class="rounded-lg px-4 py-2 text-sm font-semibold transition"
        :class="activeTab === 'sources' ? 'bg-marian-600 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800'"
        @click="activeTab = 'sources'"
      >
        <UIcon name="i-lucide-rss" class="mr-1.5 inline h-4 w-4" />
        Quản lý nguồn RSS ({{ sources.length }})
      </button>
    </div>

    <!-- Tab 1: Danh sách bài viết -->
    <div v-if="activeTab === 'articles'">
      <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 6" :key="i" class="h-64 animate-pulse rounded-2xl border border-stone-200 bg-stone-100 dark:border-stone-800 dark:bg-stone-800/40" />
      </div>

      <EmptyState
        v-else-if="articles.length === 0"
        icon="i-lucide-newspaper"
        title="Chưa có bài viết tin tức nào"
        description="Hãy thêm nguồn RSS để hệ thống tự động thu thập tin tức từ Giáo hội."
      />

      <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="a in articles"
          :key="a.id"
          class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:border-vatican-500 hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
          :class="!a.isActive ? 'opacity-60 bg-stone-50' : ''"
        >
          <div>
            <!-- Ảnh bài viết -->
            <div class="relative aspect-video w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
              <img
                v-if="a.imageUrl"
                :src="a.imageUrl"
                :alt="a.title"
                class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div v-else class="flex h-full w-full items-center justify-center text-stone-300">
                <UIcon name="i-lucide-image" class="h-10 w-10" />
              </div>
              <span class="absolute top-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">
                {{ a.sourceName || 'Tin tức' }}
              </span>
            </div>

            <div class="p-4">
              <h4 class="font-display text-base font-bold text-stone-900 group-hover:text-marian-600 dark:text-stone-100 dark:group-hover:text-marian-400">
                <a :href="a.link" target="_blank" class="hover:underline">
                  {{ a.title }}
                </a>
              </h4>
              <p class="mt-2 line-clamp-3 text-xs text-stone-500 dark:text-stone-400">
                {{ a.summary }}
              </p>
            </div>
          </div>

          <!-- Footer Thẻ -->
          <div class="flex items-center justify-between border-t border-stone-100 p-3 text-xs text-stone-400 dark:border-stone-800">
            <span>{{ new Date(a.publishedAt).toLocaleDateString('vi-VN') }}</span>

            <div class="flex items-center gap-2">
              <button
                v-if="can(PERMISSIONS.News.Update)"
                type="button"
                class="flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold transition"
                :class="a.isActive ? 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'"
                @click="toggleArticleActive(a)"
              >
                <UIcon :name="a.isActive ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="h-3.5 w-3.5" />
                <span>{{ a.isActive ? 'Tạm ẩn' : 'Hiển thị' }}</span>
              </button>

              <a
                :href="a.link"
                target="_blank"
                class="inline-flex items-center gap-1 text-marian-600 hover:underline dark:text-marian-400"
              >
                Đọc tin
                <UIcon name="i-lucide-external-link" class="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div v-if="total > pageSize" class="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p class="text-xs font-semibold text-stone-500">
          Hiển thị {{ (page - 1) * pageSize + 1 }}–{{ Math.min(page * pageSize, total) }} trong {{ total }} bài viết
        </p>
        <UPagination
          v-model:page="page"
          :total="total"
          :items-per-page="pageSize"
        />
      </div>
    </div>

    <!-- Tab 2: Quản lý nguồn RSS -->
    <div v-else class="rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-stone-50 text-xs font-semibold uppercase text-stone-600 dark:bg-stone-800/70 dark:text-stone-300">
            <tr>
              <th class="p-4">Tên nguồn tin</th>
              <th class="p-4">Đường dẫn RSS</th>
              <th class="p-4 text-center">Số bài đã cào</th>
              <th class="p-4 text-center">Trạng thái</th>
              <th class="p-4">Ngày thêm</th>
              <th v-if="can(PERMISSIONS.News.Update) || can(PERMISSIONS.News.Delete)" class="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
            <tr v-if="sources.length === 0">
              <td colspan="6" class="p-8 text-center text-sm text-stone-500">
                Chưa cấu hình nguồn RSS nào.
              </td>
            </tr>
            <tr
              v-for="s in sources"
              :key="s.id"
              class="hover:bg-stone-50/70 dark:hover:bg-stone-800/40"
            >
              <td class="p-4 font-bold text-stone-900 dark:text-stone-100">{{ s.name }}</td>
              <td class="p-4 font-mono text-xs text-stone-500 break-all">{{ s.rssUrl }}</td>
              <td class="p-4 text-center font-mono font-bold text-marian-600 dark:text-marian-400">{{ s.articleCount }}</td>
              <td class="p-4 text-center">
                <span
                  class="rounded-full px-2 py-0.5 text-xs font-semibold"
                  :class="s.isActive ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-stone-100 text-stone-500 dark:bg-stone-800'"
                >
                  {{ s.isActive ? 'Đang lấy tin' : 'Tạm dừng' }}
                </span>
              </td>
              <td class="p-4 text-xs text-stone-400 whitespace-nowrap">{{ new Date(s.createdAt).toLocaleDateString('vi-VN') }}</td>
              <td v-if="can(PERMISSIONS.News.Update) || can(PERMISSIONS.News.Delete)" class="p-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-1">
                  <UButton
                    v-if="can(PERMISSIONS.News.Update)"
                    size="xs"
                    variant="ghost"
                    color="neutral"
                    icon="i-lucide-pencil"
                    @click="openEditSourceModal(s)"
                  />
                  <UButton
                    v-if="can(PERMISSIONS.News.Delete)"
                    size="xs"
                    variant="ghost"
                    color="error"
                    icon="i-lucide-trash-2"
                    @click="openDeleteSourceModal(s)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Thêm / Sửa Nguồn RSS -->
    <UModal
      v-model:open="sourceFormOpen"
      :title="isEditingSource ? 'Sửa nguồn tin RSS' : 'Thêm nguồn tin RSS mới'"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Tên nguồn tin <span class="text-red-500">*</span>
            </label>
            <UInput v-model="sourceForm.name" placeholder="Ví dụ: HĐGMVN, Vatican News, Tổng GP Sài Gòn..." />
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Đường dẫn RSS Feed (URL) <span class="text-red-500">*</span>
            </label>
            <UInput v-model="sourceForm.rssUrl" placeholder="https://.../rss hoặc .xml" />
          </div>

          <div class="flex items-center gap-2">
            <input
              id="sourceActiveCheck"
              type="checkbox"
              v-model="sourceForm.isActive"
              class="rounded text-marian-600"
            />
            <label for="sourceActiveCheck" class="text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
              Kích hoạt tự động cào tin định kỳ
            </label>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="sourceFormOpen = false">Hủy</UButton>
          <UButton
            color="primary"
            :loading="savingSource"
            :disabled="!sourceForm.name.trim() || !sourceForm.rssUrl.trim()"
            @click="handleSaveSource"
          >
            {{ isEditingSource ? 'Cập nhật' : 'Thêm nguồn' }}
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Xóa Nguồn RSS -->
    <UModal v-model:open="deleteSourceOpen" title="Xác nhận xóa nguồn RSS">
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="deleteSourceOpen = false">Hủy</UButton>
          <UButton color="error" :loading="deletingSource" @click="handleDeleteSource">Xác nhận xóa</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
