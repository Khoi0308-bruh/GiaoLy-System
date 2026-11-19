<script setup lang="ts">
import { PERMISSIONS } from '~/shared/permissions'
import type { ApiError } from '~/composables/useApi'

definePageMeta({ layout: 'admin', permission: PERMISSIONS.Documents.View })

interface DocumentItem {
  id: string
  fileName: string
  category: string
  branchId?: number | null
  branchName?: string | null
  academicYearId?: string | null
  academicYearName?: string | null
  accessLevel: 'Internal' | 'Public' | string
  tags?: string | null
  fileSize: number
  contentType: string
  sha256: string
  uploadedBy: string
  uploadedByName: string
  createdAt: string
}

const api = useApi()
const toast = useToast()
const { can } = usePermissions()

const documents = ref<DocumentItem[]>([])
const loading = ref(true)
const error = ref<ApiError | null>(null)

// Bộ lọc
const filterCategory = ref<string>('ALL')
const filterAccess = ref<string>('ALL')
const searchQuery = ref<string>('')

// Modal Upload
const uploadOpen = ref(false)
const uploading = ref(false)
const uploadForm = ref({
  fileName: '',
  category: 'Giáo án',
  accessLevel: 'Internal',
  tags: '',
  contentType: 'application/octet-stream',
  fileBytes: [] as number[]
})

// Modal Sửa
const editOpen = ref(false)
const editing = ref(false)
const currentId = ref<string | null>(null)
const editForm = ref({
  fileName: '',
  category: '',
  accessLevel: 'Internal',
  tags: ''
})

// Modal Xóa
const deleteOpen = ref(false)
const deleting = ref(false)
const selectedDoc = ref<DocumentItem | null>(null)

const categoryOptions = [
  'Giáo án',
  'Bài hát sinh hoạt & Thánh ca',
  'Kinh bổn & Cầu nguyện',
  'Biểu mẫu & Đơn từ',
  'Quy chế & Cẩm nang Huynh trưởng',
  'Tài liệu khác'
]

async function loadData() {
  loading.value = true
  error.value = null
  try {
    const res = await api.get<DocumentItem[]>('/documents')
    documents.value = res || []
  } catch (e) {
    error.value = e as ApiError
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

const filteredDocuments = computed(() => {
  return documents.value.filter(d => {
    if (filterCategory.value !== 'ALL' && d.category !== filterCategory.value) return false
    if (filterAccess.value !== 'ALL' && d.accessLevel !== filterAccess.value) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const matchName = d.fileName.toLowerCase().includes(q)
      const matchTags = (d.tags || '').toLowerCase().includes(q)
      const matchUploader = d.uploadedByName.toLowerCase().includes(q)
      return matchName || matchTags || matchUploader
    }
    return true
  })
})

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function getFileIcon(type: string, name: string) {
  const lower = name.toLowerCase()
  if (lower.endsWith('.pdf')) return 'i-lucide-file-text'
  if (lower.endsWith('.doc') || lower.endsWith('.docx')) return 'i-lucide-file-type-doc'
  if (lower.endsWith('.xls') || lower.endsWith('.xlsx')) return 'i-lucide-file-spreadsheet'
  if (lower.endsWith('.mp3') || lower.endsWith('.wav')) return 'i-lucide-file-audio'
  if (lower.endsWith('.jpg') || lower.endsWith('.png') || lower.endsWith('.webp')) return 'i-lucide-file-image'
  return 'i-lucide-file'
}

// ── Tải về tài liệu ─────────────────────────────────────
async function handleDownload(doc: DocumentItem) {
  try {
    const blob = await api.download<Blob>(`/documents/${doc.id}/download`)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = doc.fileName
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    toast.add({ title: `Đang tải xuống: ${doc.fileName}`, color: 'success' })
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể tải xuống tài liệu', description: err.detail || err.message, color: 'error' })
  }
}

// ── Upload tài liệu ─────────────────────────────────────
function openUploadModal() {
  uploadForm.value = {
    fileName: '',
    category: 'Giáo án',
    accessLevel: 'Internal',
    tags: '',
    contentType: 'application/octet-stream',
    fileBytes: []
  }
  uploadOpen.value = true
}

function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return
  const file = input.files[0]
  uploadForm.value.fileName = file.name
  uploadForm.value.contentType = file.type || 'application/octet-stream'

  const reader = new FileReader()
  reader.onload = () => {
    const arrayBuffer = reader.result as ArrayBuffer
    const bytes = new Uint8Array(arrayBuffer)
    uploadForm.value.fileBytes = Array.from(bytes)
  }
  reader.readAsArrayBuffer(file)
}

async function handleUpload() {
  if (!uploadForm.value.fileName.trim() || uploadForm.value.fileBytes.length === 0) {
    toast.add({ title: 'Vui lòng chọn một tập tin để tải lên', color: 'error' })
    return
  }
  uploading.value = true
  try {
    await api.post('/documents', {
      fileName: uploadForm.value.fileName.trim(),
      category: uploadForm.value.category,
      accessLevel: uploadForm.value.accessLevel,
      tags: uploadForm.value.tags?.trim() || null,
      contentType: uploadForm.value.contentType,
      fileBytes: uploadForm.value.fileBytes
    })
    toast.add({ title: 'Tải lên tài liệu thành công', color: 'success' })
    uploadOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể tải lên tài liệu', description: err.detail || err.message, color: 'error' })
  } finally {
    uploading.value = false
  }
}

// ── Sửa thông tin ───────────────────────────────────────
function openEditModal(doc: DocumentItem) {
  currentId.value = doc.id
  editForm.value = {
    fileName: doc.fileName,
    category: doc.category,
    accessLevel: doc.accessLevel,
    tags: doc.tags || ''
  }
  editOpen.value = true
}

async function handleUpdateDoc() {
  if (!currentId.value || !editForm.value.fileName.trim()) return
  editing.value = true
  try {
    await api.put(`/documents/${currentId.value}`, {
      fileName: editForm.value.fileName.trim(),
      category: editForm.value.category,
      accessLevel: editForm.value.accessLevel,
      tags: editForm.value.tags?.trim() || null
    })
    toast.add({ title: 'Cập nhật thông tin tài liệu thành công', color: 'success' })
    editOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể cập nhật tài liệu', description: err.detail || err.message, color: 'error' })
  } finally {
    editing.value = false
  }
}

// ── Xóa tài liệu ────────────────────────────────────────
function openDeleteModal(doc: DocumentItem) {
  selectedDoc.value = doc
  deleteOpen.value = true
}

async function handleDeleteDoc() {
  if (!selectedDoc.value) return
  deleting.value = true
  try {
    await api.delete(`/documents/${selectedDoc.value.id}`)
    toast.add({ title: 'Đã xóa tài liệu', color: 'success' })
    deleteOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể xóa tài liệu', description: err.detail || err.message, color: 'error' })
  } finally {
    deleting.value = false
  }
}

const stats = computed(() => {
  const total = documents.value.length
  const totalSize = documents.value.reduce((acc, d) => acc + (d.fileSize || 0), 0)
  const publicCount = documents.value.filter(d => d.accessLevel === 'Public').length
  const internalCount = documents.value.filter(d => d.accessLevel === 'Internal').length
  return { total, totalSize, publicCount, internalCount }
})
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Kho Tài liệu & Biểu mẫu"
      subtitle="Lưu trữ, quản lý và chia sẻ tài liệu học tập, thánh ca, quy chế và biểu mẫu"
    >
      <template #actions>
        <UButton
          v-if="can(PERMISSIONS.Documents.Create)"
          color="primary"
          icon="i-lucide-upload"
          @click="openUploadModal"
        >
          Tải lên tài liệu
        </UButton>
      </template>
    </PageHeader>

    <ErrorState v-if="error" :error="error" @retry="loadData" />

    <!-- Thống kê -->
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard
        label="Tổng số tài liệu"
        :value="stats.total"
        icon="i-lucide-files"
      />
      <StatCard
        label="Tổng dung lượng"
        :value="formatBytes(stats.totalSize)"
        icon="i-lucide-hard-drive"
      />
      <StatCard
        label="Tài liệu công khai"
        :value="stats.publicCount"
        icon="i-lucide-globe"
        class="text-emerald-600"
      />
      <StatCard
        label="Lưu hành nội bộ"
        :value="stats.internalCount"
        icon="i-lucide-lock"
        class="text-amber-600"
      />
    </div>

    <!-- Bộ lọc & Tìm kiếm -->
    <div class="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-stone-800 dark:bg-stone-900">
      <div class="flex flex-wrap items-center gap-3">
        <!-- Chuyên mục -->
        <div class="flex items-center gap-2">
          <label class="text-xs font-semibold uppercase text-stone-500">Chuyên mục:</label>
          <select
            v-model="filterCategory"
            class="h-9 rounded-lg border border-stone-200 bg-stone-50 px-3 text-xs font-medium dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
          >
            <option value="ALL">Tất cả chuyên mục</option>
            <option v-for="cat in categoryOptions" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>

        <!-- Mức truy cập -->
        <div class="flex items-center gap-2">
          <label class="text-xs font-semibold uppercase text-stone-500">Truy cập:</label>
          <select
            v-model="filterAccess"
            class="h-9 rounded-lg border border-stone-200 bg-stone-50 px-3 text-xs font-medium dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
          >
            <option value="ALL">Tất cả</option>
            <option value="Public">Công khai</option>
            <option value="Internal">Nội bộ</option>
          </select>
        </div>
      </div>

      <div class="w-full sm:w-64">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Tìm tên file, tags, người tải..."
          size="sm"
        />
      </div>
    </div>

    <!-- Bảng danh sách tài liệu -->
    <div class="rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-stone-50 text-xs font-semibold uppercase text-stone-600 dark:bg-stone-800/70 dark:text-stone-300">
            <tr>
              <th class="p-4">Tên tài liệu</th>
              <th class="p-4">Chuyên mục</th>
              <th class="p-4 text-center">Dung lượng</th>
              <th class="p-4 text-center">Quyền hạn</th>
              <th class="p-4">Người tải</th>
              <th class="p-4">Ngày tải</th>
              <th class="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
            <tr v-if="loading">
              <td colspan="7" class="p-8 text-center text-sm text-stone-400 animate-pulse">
                Đang tải danh sách tài liệu...
              </td>
            </tr>
            <tr v-else-if="filteredDocuments.length === 0">
              <td colspan="7" class="p-8 text-center text-sm text-stone-500">
                Chưa có tài liệu nào trong chuyên mục này.
              </td>
            </tr>
            <tr
              v-for="doc in filteredDocuments"
              :key="doc.id"
              class="hover:bg-stone-50/70 dark:hover:bg-stone-800/40"
            >
              <td class="p-4">
                <div class="flex items-center gap-2.5">
                  <UIcon :name="getFileIcon(doc.contentType, doc.fileName)" class="h-5 w-5 text-marian-600 dark:text-marian-400 flex-shrink-0" />
                  <div>
                    <span
                      class="font-semibold text-stone-900 hover:text-marian-600 cursor-pointer dark:text-stone-100 dark:hover:text-marian-400"
                      @click="handleDownload(doc)"
                    >
                      {{ doc.fileName }}
                    </span>
                    <div v-if="doc.tags" class="flex flex-wrap gap-1 mt-0.5">
                      <span
                        v-for="tag in doc.tags.split(',')"
                        :key="tag"
                        class="text-[10px] text-stone-400"
                      >
                        #{{ tag.trim() }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="p-4 text-xs font-medium text-stone-600 dark:text-stone-300">
                {{ doc.category }}
              </td>
              <td class="p-4 text-center font-mono text-xs text-stone-500 whitespace-nowrap">
                {{ formatBytes(doc.fileSize) }}
              </td>
              <td class="p-4 text-center">
                <span
                  class="rounded-full px-2 py-0.5 text-xs font-semibold"
                  :class="doc.accessLevel === 'Public' ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300'"
                >
                  {{ doc.accessLevel === 'Public' ? 'Công khai' : 'Nội bộ' }}
                </span>
              </td>
              <td class="p-4 text-xs text-stone-600 dark:text-stone-300">
                {{ doc.uploadedByName }}
              </td>
              <td class="p-4 text-xs text-stone-500 whitespace-nowrap">
                {{ new Date(doc.createdAt).toLocaleDateString('vi-VN') }}
              </td>
              <td class="p-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-1">
                  <UButton
                    size="xs"
                    color="primary"
                    variant="ghost"
                    icon="i-lucide-download"
                    title="Tải xuống"
                    @click="handleDownload(doc)"
                  />
                  <UButton
                    v-if="can(PERMISSIONS.Documents.Update)"
                    size="xs"
                    variant="ghost"
                    color="neutral"
                    icon="i-lucide-pencil"
                    title="Sửa thông tin"
                    @click="openEditModal(doc)"
                  />
                  <UButton
                    v-if="can(PERMISSIONS.Documents.Delete)"
                    size="xs"
                    variant="ghost"
                    color="error"
                    icon="i-lucide-trash-2"
                    title="Xóa"
                    @click="openDeleteModal(doc)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Upload Tài Liệu -->
    <UModal v-model:open="uploadOpen" title="Tải lên tài liệu mới">
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Chọn tập tin <span class="text-red-500">*</span>
            </label>
            <input
              type="file"
              class="block w-full text-xs text-stone-500 file:mr-3 file:rounded-lg file:border-0 file:bg-stone-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-stone-700 hover:file:bg-stone-200 dark:file:bg-stone-800 dark:file:text-stone-300"
              @change="onFileSelected"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Tên tài liệu hiển thị <span class="text-red-500">*</span>
            </label>
            <UInput v-model="uploadForm.fileName" placeholder="Tên tập tin..." />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Chuyên mục
              </label>
              <select
                v-model="uploadForm.category"
                class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              >
                <option v-for="cat in categoryOptions" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Mức độ truy cập
              </label>
              <select
                v-model="uploadForm.accessLevel"
                class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              >
                <option value="Internal">Lưu hành nội bộ GLV</option>
                <option value="Public">Công khai trên Portal</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Thẻ phân loại (Tags)
            </label>
            <UInput v-model="uploadForm.tags" placeholder="Ngăn cách bằng dấu phẩy..." />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="uploadOpen = false">Hủy</UButton>
          <UButton
            color="primary"
            :loading="uploading"
            :disabled="!uploadForm.fileName.trim() || uploadForm.fileBytes.length === 0"
            @click="handleUpload"
          >
            Bắt đầu tải lên
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Sửa Thông Tin Tài Liệu -->
    <UModal v-model:open="editOpen" title="Sửa thông tin tài liệu">
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Tên tài liệu <span class="text-red-500">*</span>
            </label>
            <UInput v-model="editForm.fileName" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Chuyên mục
              </label>
              <select
                v-model="editForm.category"
                class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              >
                <option v-for="cat in categoryOptions" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Mức độ truy cập
              </label>
              <select
                v-model="editForm.accessLevel"
                class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              >
                <option value="Internal">Lưu hành nội bộ</option>
                <option value="Public">Công khai</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Thẻ phân loại (Tags)
            </label>
            <UInput v-model="editForm.tags" />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="editOpen = false">Hủy</UButton>
          <UButton color="primary" :loading="editing" @click="handleUpdateDoc">Lưu thay đổi</UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Xóa -->
    <UModal v-model:open="deleteOpen" title="Xác nhận xóa tài liệu">
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="deleteOpen = false">Hủy</UButton>
          <UButton color="error" :loading="deleting" @click="handleDeleteDoc">Xác nhận xóa</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
