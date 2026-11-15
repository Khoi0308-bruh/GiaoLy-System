<template>
  <div class="min-h-screen bg-stone-50 dark:bg-stone-950 font-sans selection:bg-marian-blue-500/30 relative pb-24">
    <!-- ═══════════════════════════════════════════════════════
         BACKGROUND MESH GRADIENT
    ═══════════════════════════════════════════════════════ -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div class="absolute -top-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob bg-marian-blue-400" />
      <div class="absolute top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-vatican-gold-400" />
      <div class="absolute -bottom-[20%] right-[20%] w-[70vw] h-[70vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-15 dark:opacity-10 animate-blob animation-delay-4000 bg-sky-400" />
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay" />
    </div>

    <UContainer class="relative z-10 pt-12 space-y-8">
      <!-- ═══════════════════════════════════════════════════════
           HEADER
      ═══════════════════════════════════════════════════════ -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in-up">
        <div>
          <div class="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-white/60 dark:bg-stone-900/40 backdrop-blur-md border border-white/40 dark:border-stone-700/50 shadow-sm text-xs font-black text-marian-blue-600 dark:text-marian-blue-400 uppercase tracking-widest">
            <UIcon
              name="i-heroicons-bookmark-square"
              class="w-4 h-4"
            />
            <span>Kho Lưu Trữ</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-stone-900 dark:text-white flex items-center gap-3 drop-shadow-sm uppercase tracking-tight">
            Thư Viện Tài Liệu
          </h1>
          <p class="text-stone-500 text-lg mt-2 font-serif italic">
            Tài liệu giáo lý, giáo án mẫu và biểu mẫu sinh hoạt phong trào Thiếu Nhi Thánh Thể
          </p>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════
           CONTEXT-AWARE BANNER
      ═══════════════════════════════════════════════════════ -->
      <div
        v-if="auth.user?.branch"
        class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-xl border border-white/40 dark:border-stone-800/50 rounded-3xl p-5 flex items-center gap-5 animate-fade-in-up shadow-lg shadow-marian-blue-500/5"
        style="animation-delay: 0.1s;"
      >
        <div class="p-3 bg-marian-blue-500/10 rounded-2xl text-marian-blue-600 dark:text-marian-blue-400">
          <UIcon
            name="i-heroicons-sparkles"
            class="w-7 h-7 animate-pulse"
          />
        </div>
        <div>
          <h4 class="font-black text-stone-800 dark:text-white text-lg">
            Tối ưu hóa theo ngành <span class="text-marian-blue-600 dark:text-marian-blue-400">{{ getBranchName(auth.user.branch) }}</span>
          </h4>
          <p class="text-stone-500 dark:text-stone-400 text-sm mt-0.5">
            Tài liệu thuộc ngành của bạn đã được ưu tiên hiển thị lên hàng đầu và lọc theo ngữ cảnh.
          </p>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════
           FILTER BAR (PILL SHAPE)
      ═══════════════════════════════════════════════════════ -->
      <div
        class="bg-white/60 dark:bg-stone-900/60 backdrop-blur-2xl border border-white/50 dark:border-stone-800 rounded-[2rem] p-3 shadow-xl shadow-black/5 animate-fade-in-up"
        style="animation-delay: 0.2s;"
      >
        <div class="flex flex-col md:flex-row gap-3 justify-between items-center">
          <div class="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto flex-1">
            <UInput
              v-model="searchQuery"
              icon="i-heroicons-magnifying-glass"
              placeholder="Tìm tên tài liệu hoặc thẻ tag..."
              size="lg"
              variant="none"
              class="w-full md:w-80 bg-stone-100/50 dark:bg-stone-800/50 rounded-2xl border border-stone-200/50 dark:border-stone-700/50 focus-within:ring-2 focus-within:ring-marian-blue-500/50"
            />
            <div class="w-px bg-stone-200 dark:bg-stone-800 hidden md:block my-2" />
            <USelect
              v-model="selectedCategory"
              :options="categoryOptions"
              size="lg"
              variant="none"
              class="w-full md:w-48 bg-stone-100/50 dark:bg-stone-800/50 rounded-2xl border border-stone-200/50 dark:border-stone-700/50"
            />
            <USelect
              v-model="selectedBranch"
              :options="branchOptions"
              size="lg"
              variant="none"
              class="w-full md:w-48 bg-stone-100/50 dark:bg-stone-800/50 rounded-2xl border border-stone-200/50 dark:border-stone-700/50"
            />
          </div>

          <div class="flex gap-4 items-center px-4 w-full md:w-auto justify-between md:justify-end border-t md:border-none border-stone-200/50 dark:border-stone-800/50 pt-3 md:pt-0">
            <span class="text-sm font-bold text-stone-500">
              Tổng số: <b class="text-marian-blue-600 dark:text-marian-blue-400 text-lg">{{ totalCount }}</b>
            </span>
            <UPagination
              v-if="totalCount > limit"
              v-model="page"
              :total="totalCount"
              :page-count="limit"
              size="sm"
            />
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════
           MAIN CONTENT AREA
      ═══════════════════════════════════════════════════════ -->
      <div
        class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up"
        style="animation-delay: 0.3s;"
      >
        <!-- Documents List -->
        <div :class="[previewDoc ? 'lg:col-span-2' : 'lg:col-span-3', 'space-y-4 transition-all duration-500']">
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <UCard
              v-for="doc in documents"
              :key="doc.id"
              :class="[
                'group relative overflow-hidden transition-all duration-300 cursor-pointer rounded-[2rem] border border-white/40 dark:border-stone-800/50 shadow-md hover:shadow-xl hover:-translate-y-1',
                doc.id === previewDoc?.id ? 'bg-marian-blue-50/80 dark:bg-marian-blue-900/20 border-marian-blue-300/50 dark:border-marian-blue-700/50 ring-2 ring-marian-blue-500/30' : 'bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl',
                doc.branch === auth.user?.branch ? 'border-b-4 border-b-marian-blue-500' : ''
              ]"
              @click="selectPreview(doc)"
            >
              <div class="flex flex-col h-full p-2">
                <!-- Top Row: Icon & Category -->
                <div class="flex items-start justify-between mb-4">
                  <div :class="`p-3.5 rounded-2xl ${getFileTheme(doc.fileName).bg} ${getFileTheme(doc.fileName).text} shadow-inner`">
                    <UIcon
                      :name="getFileTheme(doc.fileName).icon"
                      class="w-8 h-8"
                    />
                  </div>

                  <div class="flex flex-col items-end gap-1.5">
                    <UBadge
                      size="xs"
                      variant="soft"
                      class="font-bold tracking-wider rounded-lg bg-stone-100/50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 backdrop-blur-sm"
                    >
                      {{ doc.category }}
                    </UBadge>
                    <UBadge
                      size="xs"
                      :color="getBranchColor(doc.branch)"
                      variant="soft"
                      class="font-bold tracking-wider rounded-lg"
                    >
                      {{ getBranchName(doc.branch) }}
                    </UBadge>
                  </div>
                </div>

                <!-- Document Info -->
                <div class="flex-1 min-w-0 mb-6">
                  <h3
                    class="font-black text-stone-900 dark:text-white text-lg leading-tight line-clamp-2 mb-2"
                    :title="doc.fileName"
                  >
                    {{ doc.fileName }}
                  </h3>
                  <div class="flex items-center gap-3 text-xs font-semibold text-stone-500">
                    <span class="flex items-center gap-1"><UIcon
                      name="i-heroicons-user"
                      class="w-3.5 h-3.5"
                    /> {{ doc.uploadedBy || 'Ban Giáo Lý' }}</span>
                    <span>•</span>
                    <span class="flex items-center gap-1"><UIcon
                      name="i-heroicons-circle-stack"
                      class="w-3.5 h-3.5"
                    /> {{ formatSize(doc.fileSize) }}</span>
                  </div>
                </div>

                <!-- Tags -->
                <div
                  v-if="doc.tags"
                  class="flex flex-wrap gap-1.5"
                >
                  <span
                    v-for="tag in doc.tags.split(',')"
                    :key="tag"
                    class="text-[10px] font-bold uppercase tracking-widest bg-stone-100/80 dark:bg-stone-800/80 text-stone-500 px-2 py-1 rounded-md"
                  >
                    #{{ tag.trim() }}
                  </span>
                </div>
              </div>

              <!-- Hover Action Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <div class="flex justify-end gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <UButton
                    icon="i-heroicons-eye"
                    color="white"
                    variant="solid"
                    label="Xem"
                    size="sm"
                    class="rounded-xl shadow-lg"
                    @click.stop="selectPreview(doc)"
                  />
                  <UButton
                    icon="i-heroicons-arrow-down-tray"
                    color="marian-blue"
                    variant="solid"
                    size="sm"
                    class="rounded-xl shadow-lg shadow-marian-blue-500/30"
                    @click.stop="downloadFile(doc)"
                  />
                </div>
              </div>
            </UCard>
          </div>

          <!-- Empty State -->
          <div
            v-if="!pending && (!documents || !documents.length)"
            class="text-center py-32 bg-white/40 dark:bg-stone-900/40 backdrop-blur-md rounded-[3rem] border border-white/30 dark:border-stone-800"
          >
            <UIcon
              name="i-heroicons-document-magnifying-glass"
              class="w-24 h-24 mx-auto mb-6 text-stone-300 dark:text-stone-700 animate-pulse"
            />
            <p class="text-2xl font-black text-stone-500">
              Không tìm thấy tài liệu
            </p>
            <p class="text-stone-400 mt-2 font-medium">
              Vui lòng thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.
            </p>
          </div>
        </div>

        <!-- ═══════════════════════════════════════════════════════
             RIGHT PANEL: PDF PREVIEW (Desktop Only)
        ═══════════════════════════════════════════════════════ -->
        <div
          v-if="previewDoc"
          class="hidden lg:block lg:col-span-1 space-y-4 sticky top-6 self-start"
        >
          <UCard
            class="bg-white/80 dark:bg-stone-900/80 backdrop-blur-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 border border-white/50 dark:border-stone-700/50 rounded-[2.5rem] overflow-hidden h-[800px] flex flex-col"
            :ui="{ body: { padding: 'p-0', base: 'flex-1 flex flex-col' } }"
          >
            <template #header>
              <div class="flex items-start justify-between">
                <div class="min-w-0 flex-1 pr-4">
                  <h3 class="font-black text-stone-900 dark:text-white truncate text-lg">
                    {{ previewDoc.fileName }}
                  </h3>
                  <p class="text-xs font-bold text-marian-blue-500 uppercase tracking-widest mt-1">
                    Xem trước
                  </p>
                </div>
                <div class="flex gap-2 shrink-0">
                  <UButton
                    icon="i-heroicons-arrow-down-tray"
                    color="marian-blue"
                    size="sm"
                    class="rounded-xl"
                    @click="downloadFile(previewDoc)"
                  />
                  <UButton
                    icon="i-heroicons-x-mark"
                    color="neutral"
                    variant="soft"
                    size="sm"
                    class="rounded-xl bg-stone-100 dark:bg-stone-800"
                    @click="previewDoc = null"
                  />
                </div>
              </div>
            </template>

            <div class="flex-1 w-full bg-stone-200/50 dark:bg-stone-950/50 overflow-hidden relative">
              <iframe
                v-if="isPreviewable(previewDoc.fileName)"
                :src="getPreviewUrl(previewDoc.filePath)"
                class="w-full h-full border-none absolute inset-0"
              />
              <div
                v-else
                class="flex flex-col items-center justify-center h-full text-center text-stone-500 p-8"
              >
                <div class="p-6 bg-stone-100 dark:bg-stone-800 rounded-full mb-6">
                  <UIcon
                    name="i-heroicons-document-arrow-down"
                    class="w-16 h-16 opacity-50"
                  />
                </div>
                <p class="font-black text-xl mb-2 text-stone-700 dark:text-stone-300">
                  Định dạng không hỗ trợ
                </p>
                <p class="text-sm font-medium text-stone-400">
                  Tài liệu này không thể xem trực tuyến.<br>Vui lòng tải về máy để xem.
                </p>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </UContainer>

    <!-- ═══════════════════════════════════════════════════════
         MOBILE PREVIEW MODAL
    ═══════════════════════════════════════════════════════ -->
    <UModal
      v-model:open="isMobilePreviewOpen"
      fullscreen
      class="lg:hidden"
    >
      <template #content>
        <div class="h-full flex flex-col bg-stone-100 dark:bg-stone-950">
          <!-- Header -->
          <div class="flex items-center justify-between p-4 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
            <div class="min-w-0 flex-1 pr-4">
              <h3 class="font-black text-stone-900 dark:text-white truncate">
                {{ previewDoc?.fileName }}
              </h3>
            </div>
            <div class="flex gap-2 shrink-0">
              <UButton
                icon="i-heroicons-arrow-down-tray"
                color="marian-blue"
                size="sm"
                @click="downloadFile(previewDoc)"
              />
              <UButton
                icon="i-heroicons-x-mark"
                color="neutral"
                variant="soft"
                size="sm"
                @click="closeMobilePreview"
              />
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 w-full relative overflow-hidden">
            <iframe
              v-if="previewDoc && isPreviewable(previewDoc.fileName)"
              :src="getPreviewUrl(previewDoc.filePath)"
              class="w-full h-full border-none absolute inset-0"
            />
            <div
              v-else
              class="flex flex-col items-center justify-center h-full text-center text-stone-500 p-8"
            >
              <UIcon
                name="i-heroicons-document-arrow-down"
                class="w-16 h-16 opacity-30 mb-4"
              />
              <p class="font-bold text-lg">
                Không hỗ trợ xem trước
              </p>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })
useHead({ title: 'Thư Viện Tài Liệu - Thiếu Nhi Thánh Thể' })

const auth = reactive({ user: null })
const config = useRuntimeConfig()

// Modals & States
const previewDoc = ref(null)
const isMobilePreviewOpen = ref(false)

// Search/Filter states
const searchQuery = ref('')
const selectedCategory = ref('Tất cả danh mục')
const selectedBranch = ref('0')

// Options
const categoryOptions = [
  'Tất cả danh mục',
  'Giáo án',
  'Bài hát',
  'Văn bản',
  'Tài liệu học'
]

const branchOptions = [
  { value: '0', label: 'Tất cả Ngành' },
  { value: '1', label: 'Ấu Nhi' },
  { value: '2', label: 'Thiếu Nhi' },
  { value: '3', label: 'Nghĩa Sĩ' },
  { value: '4', label: 'Hiệp Sĩ' }
]

// State & Filtersnation & Fetch state
const page = ref(1)
const limit = ref(12)
const totalCount = useState('libraryTotalCount', () => 0)

// API Fetch parameters
const fetchParams = computed(() => {
  const params = {
    page: page.value,
    limit: limit.value,
    search: searchQuery.value || undefined,
    category: selectedCategory.value !== 'Tất cả danh mục' ? selectedCategory.value : undefined,
    branch: selectedBranch.value !== '0' ? parseInt(selectedBranch.value) : undefined
  }
  return params
})

// Watch filters to reset page to 1
watch([searchQuery, selectedCategory, selectedBranch], () => {
  page.value = 1
})

// Fetch documents from server
const { data: documents, pending } = await useFetch('/api/Document', {
  baseURL: config.public.apiBase,
  query: fetchParams,
  default: () => [],
  onResponse({ response }) {
    const total = response.headers.get('X-Total-Count')
    if (total) {
      totalCount.value = parseInt(total, 10)
    } else {
      totalCount.value = Array.isArray(response._data) ? response._data.length : 0
    }
  }
})

// Helpers
const getBranchName = (b) => {
  const names = { 0: 'Chung', 1: 'Ấu Nhi', 2: 'Thiếu Nhi', 3: 'Nghĩa Sĩ', 4: 'Hiệp Sĩ' }
  return names[b] || 'Chung'
}

const getBranchColor = (b) => {
  const colors = { 0: 'neutral', 1: 'green', 2: 'blue', 3: 'yellow', 4: 'red' }
  return colors[b] || 'neutral'
}

/**
 * File mapping to TNTT Colors
 * Xanh dương (Thiếu) = PDF
 * Xanh lá (Ấu) = Word
 * Vàng (Nghĩa) = Excel/PPT
 * Đỏ (Hiệp) = Audio/Video
 */
const getFileTheme = (fileName) => {
  if (!fileName) return { icon: 'i-heroicons-document', bg: 'bg-stone-100 dark:bg-stone-800/50', text: 'text-stone-500' }
  const ext = fileName.split('.').pop().toLowerCase()

  if (['pdf'].includes(ext)) {
    return { icon: 'i-heroicons-document-text', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' } // Thiếu Nhi
  }
  if (['doc', 'docx', 'txt'].includes(ext)) {
    return { icon: 'i-heroicons-document', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' } // Ấu Nhi
  }
  if (['xls', 'xlsx', 'csv', 'ppt', 'pptx'].includes(ext)) {
    return { icon: 'i-heroicons-table-cells', bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400' } // Nghĩa Sĩ
  }
  if (['mp3', 'wav', 'mp4', 'mov'].includes(ext)) {
    return { icon: 'i-heroicons-musical-note', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' } // Hiệp Sĩ
  }
  if (['png', 'jpg', 'jpeg', 'svg'].includes(ext)) {
    return { icon: 'i-heroicons-photo', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' }
  }

  return { icon: 'i-heroicons-document', bg: 'bg-stone-100 dark:bg-stone-800/50', text: 'text-stone-500' }
}

const formatSize = (bytes) => {
  if (!bytes) return '0 B'
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

const isPreviewable = (name) => {
  const ext = name.split('.').pop().toLowerCase()
  return ['pdf', 'png', 'jpg', 'jpeg', 'txt'].includes(ext)
}

const getPreviewUrl = (path) => {
  return `${config.public.apiBase.replace('/api', '')}${path}`
}

const selectPreview = (doc) => {
  previewDoc.value = doc
  if (window.innerWidth < 1024) {
    isMobilePreviewOpen.value = true
  }
}

const closeMobilePreview = () => {
  isMobilePreviewOpen.value = false
  setTimeout(() => {
    previewDoc.value = null
  }, 300)
}

const downloadFile = (doc) => {
  window.open(`${config.public.apiBase}/Document/download/${doc.id}`, '_blank')
}
</script>

<style>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 10s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
