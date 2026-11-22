<script setup lang="ts">
import { ApiError } from '../../composables/useApi'

definePageMeta({ public: true })

const api = useApi()

interface PublicDoc {
  id: string
  fileName: string
  category: string
  fileSize?: number | null
  contentType?: string | null
  tags?: string | null
  createdAt: string
}

const documents = ref<PublicDoc[]>([])
const loading = ref(false)
const error = ref<ApiError | null>(null)
const searchQuery = ref('')
const selectedCategory = ref('all')
const downloadingId = ref<string | null>(null)
const downloadError = ref<string | null>(null)

async function fetchDocuments() {
  loading.value = true
  error.value = null
  try {
    const res = await api.get<{ items?: PublicDoc[], data?: PublicDoc[] } | PublicDoc[]>('/public/documents')
    if (Array.isArray(res)) {
      documents.value = res
    } else if (res && Array.isArray(res.items)) {
      documents.value = res.items
    } else if (res && Array.isArray(res.data)) {
      documents.value = res.data
    } else {
      documents.value = []
    }
  } catch (e) {
    error.value = e as ApiError
  } finally {
    loading.value = false
  }
}

async function downloadDocument(doc: PublicDoc) {
  downloadingId.value = doc.id
  downloadError.value = null
  try {
    const blob = await api.download<Blob>(`/public/documents/${doc.id}/download`)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = doc.fileName || `tai-lieu.${extensionOf(doc) || 'pdf'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => window.URL.revokeObjectURL(url), 1000)
  } catch (e) {
    downloadError.value = (e as Error).message || 'Không thể tải tài liệu. Vui lòng thử lại sau.'
  } finally {
    downloadingId.value = null
  }
}

onMounted(() => {
  fetchDocuments()
})

const categories = computed(() => {
  const set = new Set<string>()
  documents.value.forEach(d => {
    if (d.category) set.add(d.category)
  })
  return ['all', ...Array.from(set)]
})

const filteredDocuments = computed(() => {
  return documents.value.filter(d => {
    const matchesSearch = !searchQuery.value ||
      (d.fileName ?? '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (d.category ?? '').toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesCat = selectedCategory.value === 'all' || d.category === selectedCategory.value

    return matchesSearch && matchesCat
  })
})

function extensionOf(doc: PublicDoc) {
  const fromName = doc.fileName?.includes('.') ? doc.fileName.split('.').pop() : null
  if (fromName) return fromName.toUpperCase()
  const sub = doc.contentType?.split('/').pop()
  return sub ? sub.toUpperCase() : null
}

function formatSize(bytes?: number | null) {
  if (!bytes) return ''
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
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
              <UIcon name="i-heroicons-book-open" class="h-6 w-6" />
            </div>
            <div>
              <h1 class="font-serif text-2xl font-bold text-stone-900">
                Thư Viện Tài Liệu Huấn Giáo
              </h1>
              <p class="text-xs text-stone-600">
                Tài liệu học tập giáo lý, kinh nguyện Công giáo, cẩm nang huynh trưởng và biểu mẫu gia đình
              </p>
            </div>
          </div>

          <!-- Bộ lọc & Tìm kiếm -->
          <div class="flex flex-wrap items-center gap-3">
            <UInput
              v-model="searchQuery"
              icon="i-heroicons-magnifying-glass"
              placeholder="Tìm tài liệu..."
              size="sm"
              class="w-60"
            />
            <USelect
              v-model="selectedCategory"
              :items="categories.map(c => ({ label: c === 'all' ? 'Tất cả phân loại' : c, value: c }))"
              size="sm"
            />
          </div>
        </div>
      </div>

      <ErrorState v-if="error" :error="error" />
      <div v-if="downloadError" class="rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
        {{ downloadError }}
      </div>

      <div v-if="loading" class="py-16 text-center text-sm text-stone-500">
        Đang tải danh mục tài liệu...
      </div>

      <EmptyState
        v-else-if="filteredDocuments.length === 0"
        title="Không tìm thấy tài liệu"
        description="Hiện không có tài liệu nào phù hợp với bộ lọc của bạn."
        icon="i-heroicons-document-magnifying-glass"
      />

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="doc in filteredDocuments"
          :key="doc.id"
          class="rounded-xl border border-stone-200 bg-white p-5 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between"
        >
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#1D3A73] shrink-0">
                <UIcon name="i-heroicons-document-arrow-down" class="h-6 w-6" />
              </div>
              <div class="flex-1">
                <span class="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600">
                  {{ doc.category }}
                </span>
                <h2 class="font-serif text-base font-bold text-stone-900 mt-1 leading-snug break-words">
                  {{ doc.fileName }}
                </h2>
              </div>
            </div>

            <div class="flex items-center gap-3 text-[11px] text-stone-400">
              <span v-if="extensionOf(doc)" class="uppercase font-semibold text-stone-500">{{ extensionOf(doc) }}</span>
              <span v-if="doc.fileSize">• {{ formatSize(doc.fileSize) }}</span>
              <span v-if="doc.createdAt">• {{ formatDate(doc.createdAt) }}</span>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-stone-100 flex justify-end">
            <UButton
              size="xs"
              color="primary"
              variant="solid"
              icon="i-heroicons-arrow-down-tray"
              :loading="downloadingId === doc.id"
              @click="downloadDocument(doc)"
            >
              Tải tài liệu về máy
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </PortalShell>
</template>
