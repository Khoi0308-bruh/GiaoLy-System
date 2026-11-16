<template>
  <div class="min-h-screen font-sans relative pb-24 overflow-hidden">
    <!-- BACKGROUND MESH GRADIENT -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute -top-32 right-1/4 w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob bg-sky-200 dark:bg-sky-900"></div>
      <div class="absolute bottom-0 -left-32 w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-cyan-200 dark:bg-cyan-900"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
    </div>

    <div class="relative z-10 space-y-6 animate-fade-in-up px-4 md:px-8 pt-8 max-w-7xl mx-auto">
      <!-- ── PAGE HEADER & BANNER ── -->
      <div class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="z-10 text-center md:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-300 text-xs font-black uppercase tracking-widest border border-sky-200 dark:border-sky-800 shadow-inner">
            <UIcon name="i-heroicons-document-duplicate" class="w-4 h-4" />
            <span>Phân Hệ Nội Dung</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-stone-800 dark:text-white tracking-tight">
            Thư Viện <span class="text-sky-500">Tài Liệu Số</span>
          </h1>
          <p class="text-stone-500 text-sm mt-2 max-w-lg">
            Trung tâm lưu trữ, chia sẻ giáo án, tài liệu học và văn bản hành chính của xứ đoàn.
          </p>
        </div>
        
        <div class="flex flex-wrap items-center justify-center gap-3 z-10">
          <UButton
            v-if="auth?.hasPermission('documents.create')"
            label="Tải Lên Tài Liệu"
            icon="i-heroicons-cloud-arrow-up"
            color="sky"
            variant="solid"
            size="lg"
            class="rounded-2xl shadow-lg shadow-sky-500/20 hover:-translate-y-0.5 transition-transform font-bold uppercase tracking-wider"
            @click="openUpload"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start mt-6">
        
        <!-- ── SIDEBAR DANH MỤC ── -->
        <div class="lg:col-span-1 bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/60 dark:border-stone-800 rounded-[2rem] p-6 shadow-xl shadow-black/5 sticky top-6">
          <h3 class="font-black text-stone-800 dark:text-white mb-4 flex items-center gap-2"><UIcon name="i-heroicons-folder-open" class="text-sky-500" /> Danh Mục</h3>
          
          <div class="space-y-2">
            <button
              v-for="cat in categories"
              :key="cat.value"
              class="w-full text-left px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-3"
              :class="filter.category === cat.value ? 'bg-sky-500 text-white shadow-md' : 'text-stone-500 hover:bg-white dark:hover:bg-stone-800 hover:text-sky-600'"
              @click="setCategory(cat.value)"
            >
              <UIcon :name="cat.icon" class="w-5 h-5" />
              {{ cat.label }}
            </button>
          </div>

          <h3 class="font-black text-stone-800 dark:text-white mt-8 mb-4 flex items-center gap-2"><UIcon name="i-heroicons-shield-check" class="text-cyan-500" /> Phân Quyền</h3>
          <USelectMenu
            v-model="filter.access"
            :options="[{ label: 'Tất cả quyền', value: 'all' }, { label: 'Công khai (Public)', value: 'Public' }, { label: 'Nội bộ (Internal)', value: 'Internal' }]"
            value-attribute="value"
            option-attribute="label"
            class="w-full"
            :ui="{ base: 'rounded-xl shadow-inner' }"
            @change="fetchDocuments"
          />
        </div>

        <!-- ── MAIN CONTENT (FILE GRID) ── -->
        <div class="lg:col-span-3">
          
          <div class="flex items-center justify-between mb-4 bg-white/50 dark:bg-stone-900/50 backdrop-blur-md p-3 px-5 rounded-2xl border border-white/50 dark:border-stone-800">
            <p class="text-sm font-bold text-stone-500"><span class="text-sky-600">{{ documents.length }}</span> tài liệu tìm thấy</p>
            <UButton icon="i-heroicons-arrow-path" color="neutral" variant="ghost" size="sm" class="rounded-xl" @click="fetchDocuments" />
          </div>

          <!-- Loading -->
          <div v-if="pending" class="flex flex-col items-center justify-center py-32 bg-white/20 dark:bg-stone-900/20 backdrop-blur-xl rounded-[2rem] border border-white/30 dark:border-stone-800">
            <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 animate-spin text-sky-400 mb-4" />
            <p class="text-stone-500 font-bold uppercase tracking-widest text-sm">Đang tải dữ liệu...</p>
          </div>

          <!-- Empty -->
          <div v-else-if="!documents.length" class="text-center py-32 bg-white/20 dark:bg-stone-900/20 backdrop-blur-xl rounded-[2rem] border border-white/30 dark:border-stone-800">
            <UIcon name="i-heroicons-document-magnifying-glass" class="w-16 h-16 text-stone-300 dark:text-stone-700 mx-auto mb-4" />
            <p class="text-stone-500 font-bold text-lg">Chưa có tài liệu nào trong thư mục này.</p>
          </div>

          <!-- Grid Files -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="doc in documents"
              :key="doc.id"
              class="group bg-white/60 dark:bg-stone-900/60 backdrop-blur-2xl border border-white/80 dark:border-stone-800 rounded-3xl p-5 shadow-xl shadow-black/5 hover:border-sky-400 hover:shadow-sky-500/10 hover:-translate-y-1 transition-all flex flex-col"
            >
              <div class="flex justify-between items-start mb-4">
                <div class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner" :class="getFileColorBg(doc.fileName)">
                  <UIcon :name="getFileIcon(doc.fileName)" class="w-8 h-8" :class="getFileColorText(doc.fileName)" />
                </div>
                <UBadge :label="doc.accessLevel === 'Internal' ? 'Nội Bộ' : 'Công Khai'" :color="doc.accessLevel === 'Internal' ? 'amber' : 'emerald'" variant="subtle" size="xs" class="font-black uppercase tracking-widest rounded-lg" />
              </div>

              <h4 class="font-black text-stone-800 dark:text-white text-base leading-tight break-words line-clamp-2 mb-1 group-hover:text-sky-600 transition-colors" :title="doc.fileName">
                {{ doc.fileName }}
              </h4>
              <p class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">
                {{ formatBytes(doc.fileSize) }} • {{ formatDate(doc.uploadDate) }}
              </p>

              <div class="mt-auto pt-4 border-t border-stone-200/50 dark:border-stone-800/50 flex items-center justify-between">
                <UBadge :label="doc.category" color="sky" variant="soft" size="xs" class="rounded-lg" />
                <div class="flex gap-1">
                  <UButton icon="i-heroicons-arrow-down-tray" color="primary" variant="ghost" size="sm" class="rounded-xl hover:bg-sky-50 dark:hover:bg-sky-900/20" :to="`/api/v1/documents/${doc.id}/download`" target="_blank" external />
                  <UTooltip text="Xóa File" v-if="auth?.hasPermission('documents.delete')">
                    <UButton icon="i-heroicons-trash" color="error" variant="ghost" size="sm" class="rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20" @click="confirmDelete(doc)" />
                  </UTooltip>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         MODAL: TẢI LÊN TÀI LIỆU
    ═══════════════════════════════════════════════════════ -->
    <UModal v-model:open="isUploadOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden sm:max-w-xl' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' }, footer: { padding: 'p-6 bg-stone-50 dark:bg-stone-900' } }">
        <template #header>
          <div class="bg-sky-600 dark:bg-sky-900 p-6 flex justify-between items-center text-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><UIcon name="i-heroicons-cloud-arrow-up" class="w-6 h-6" /></div>
              <h3 class="text-xl font-black uppercase tracking-wide">Tải Lên Tài Liệu</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="white" variant="ghost" class="hover:bg-white/10 rounded-full" @click="isUploadOpen = false" />
          </div>
        </template>
        
        <form class="p-8 space-y-6" @submit.prevent="submitUpload">
          <div class="p-6 border-2 border-dashed border-sky-300 dark:border-sky-700 bg-sky-50/50 dark:bg-sky-900/10 rounded-[2rem] text-center hover:bg-sky-100/50 dark:hover:bg-sky-900/20 transition-colors">
            <UIcon name="i-heroicons-document-arrow-up" class="w-12 h-12 text-sky-400 mx-auto mb-2" />
            <input
              ref="fileInput"
              type="file"
              class="block w-full text-sm text-stone-500
              file:mx-auto file:py-2 file:px-4
              file:rounded-xl file:border-0
              file:text-sm file:font-bold file:uppercase file:tracking-widest
              file:bg-sky-200 file:text-sky-800 dark:file:bg-sky-800 dark:file:text-sky-200
              hover:file:bg-sky-300 transition-colors cursor-pointer"
              required
            >
          </div>

          <UFormField label="Danh mục lưu trữ">
            <USelectMenu v-model="uploadForm.category" :options="['Giáo án', 'Nhạc đoàn', 'Văn bản', 'Tài liệu học']" class="w-full" :ui="{ base: 'rounded-xl shadow-inner' }" />
          </UFormField>

          <UFormField label="Phân quyền truy cập">
            <USelectMenu v-model="uploadForm.accessLevel" :options="[{ label: 'Công khai (Mọi người đều thấy)', value: 'Public' }, { label: 'Nội bộ (Chỉ Admin/Ban Điều Hành)', value: 'Internal' }]" value-attribute="value" option-attribute="label" class="w-full" :ui="{ base: 'rounded-xl shadow-inner' }" />
          </UFormField>

          <UFormField label="Từ khóa (Tags)">
            <UInput v-model="uploadForm.tags" placeholder="VD: GiaoAn, AuNhi, Thang8..." class="w-full" :ui="{ base: 'rounded-xl shadow-inner' }" />
          </UFormField>
        </form>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Hủy" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isUploadOpen = false" />
            <UButton label="Đẩy Lên Server" color="sky" variant="solid" size="lg" class="rounded-xl font-black uppercase tracking-wider shadow-lg shadow-sky-500/20" :loading="uploading" icon="i-heroicons-cloud-arrow-up" @click="submitUpload" />
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- ═══════════════════════════════════════════════════════
         MODAL: XÁC NHẬN XÓA
    ═══════════════════════════════════════════════════════ -->
    <UModal v-model:open="isDeleteOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden' }">
      <UCard :ui="{ body: { padding: 'p-6' }, header: { padding: 'p-6 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/50' } }">
        <template #header>
          <div class="flex items-center gap-3 text-red-600 dark:text-red-400">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8" />
            <h3 class="text-xl font-black uppercase tracking-wide">Xóa Tài Liệu</h3>
          </div>
        </template>
        <p class="text-stone-600 dark:text-stone-300 mb-6">Bạn có chắc muốn xóa file <b>"{{ deletingDoc?.fileName }}"</b>? Hành động này không thể hoàn tác.</p>
        <div class="flex justify-end gap-3">
          <UButton label="Hủy" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isDeleteOpen = false" />
          <UButton label="Xóa Vĩnh Viễn" color="error" variant="solid" size="lg" class="rounded-xl font-black uppercase tracking-wider" icon="i-heroicons-trash" :loading="deleting" @click="executeDelete" />
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
useHead({ title: 'Thư Viện Tài Liệu - GiaoLy Admin' })

const toast = useToast()
const auth = useAuthStore()

const categories = [
  { label: 'Tất Cả', value: 'Tất cả', icon: 'i-heroicons-rectangle-stack' },
  { label: 'Giáo Án', value: 'Giáo án', icon: 'i-heroicons-book-open' },
  { label: 'Nhạc Đoàn', value: 'Nhạc đoàn', icon: 'i-heroicons-musical-note' },
  { label: 'Văn Bản', value: 'Văn bản', icon: 'i-heroicons-document-text' },
  { label: 'Tài Liệu Học', value: 'Tài liệu học', icon: 'i-heroicons-academic-cap' }
]

const filter = ref({ category: 'Tất cả', access: 'all' })
const documents = ref([])
const pending = ref(true)

const fetchDocuments = async () => {
  pending.value = true
  try {
    const params = new URLSearchParams()
    if (filter.value.category !== 'Tất cả') params.append('category', filter.value.category)
    if (filter.value.access !== 'all') params.append('access', filter.value.access)

    const res = await $api(`/Document?${params.toString()}`)
    documents.value = res || []
  } catch { toast.add({ title: 'Lỗi tải danh sách', color: 'error' }) } 
  finally { pending.value = false }
}

onMounted(fetchDocuments)

const setCategory = (val) => {
  filter.value.category = val
  fetchDocuments()
}

// ── UPLOAD ──
const isUploadOpen = ref(false)
const uploading = ref(false)
const fileInput = ref(null)
const uploadForm = ref({ category: 'Giáo án', accessLevel: 'Public', tags: '' })

const openUpload = () => {
  uploadForm.value = { category: 'Giáo án', accessLevel: 'Public', tags: '' }
  if (fileInput.value) fileInput.value.value = ''
  isUploadOpen.value = true
}

const submitUpload = async () => {
  const file = fileInput.value?.files[0]
  if (!file) return toast.add({ title: 'Vui lòng chọn file', color: 'error' })

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('File', file)
    formData.append('Category', uploadForm.value.category)
    formData.append('AccessLevel', uploadForm.value.accessLevel)
    if (uploadForm.value.tags) formData.append('Tags', uploadForm.value.tags)
    formData.append('Branch', '0')

    await $fetch(`${useRuntimeConfig().public.apiBase}/Document/upload`, {
      method: 'POST', body: formData, headers: { Authorization: `Bearer ${auth.token}` }
    })

    toast.add({ title: 'Đã tải lên', color: 'success' })
    isUploadOpen.value = false
    await fetchDocuments()
  } catch (err) { toast.add({ title: 'Lỗi tải lên', description: err?.data?.message || err.message, color: 'error' }) } 
  finally { uploading.value = false }
}

// ── DELETE ──
const isDeleteOpen = ref(false)
const deleting = ref(false)
const deletingDoc = ref(null)
const confirmDelete = (doc) => { deletingDoc.value = doc; isDeleteOpen.value = true }
const executeDelete = async () => {
  deleting.value = true
  try { await $api(`/Document/${deletingDoc.value.id}`, { method: 'DELETE' }); toast.add({ title: 'Đã xóa file', color: 'success' }); isDeleteOpen.value = false; await fetchDocuments() } 
  catch { toast.add({ title: 'Lỗi xóa', color: 'error' }) } 
  finally { deleting.value = false }
}

// ── HELPERS ──
const formatDate = d => d ? new Date(d).toLocaleDateString('vi-VN') : ''
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024; const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const getFileExtension = (filename) => filename.split('.').pop().toLowerCase()
const getFileIcon = (filename) => {
  const ext = getFileExtension(filename)
  if (['pdf'].includes(ext)) return 'i-heroicons-document-text'
  if (['doc', 'docx'].includes(ext)) return 'i-heroicons-document-text'
  if (['xls', 'xlsx'].includes(ext)) return 'i-heroicons-table-cells'
  if (['ppt', 'pptx'].includes(ext)) return 'i-heroicons-presentation-chart-bar'
  if (['mp3', 'wav', 'ogg'].includes(ext)) return 'i-heroicons-musical-note'
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'i-heroicons-photo'
  if (['mp4', 'mov', 'avi'].includes(ext)) return 'i-heroicons-video-camera'
  if (['zip', 'rar'].includes(ext)) return 'i-heroicons-archive-box'
  return 'i-heroicons-document'
}
const getFileColorBg = (filename) => {
  const ext = getFileExtension(filename)
  if (['pdf'].includes(ext)) return 'bg-red-100 dark:bg-red-900/50'
  if (['doc', 'docx'].includes(ext)) return 'bg-blue-100 dark:bg-blue-900/50'
  if (['xls', 'xlsx'].includes(ext)) return 'bg-emerald-100 dark:bg-emerald-900/50'
  if (['ppt', 'pptx'].includes(ext)) return 'bg-orange-100 dark:bg-orange-900/50'
  if (['mp3', 'wav', 'ogg'].includes(ext)) return 'bg-purple-100 dark:bg-purple-900/50'
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'bg-pink-100 dark:bg-pink-900/50'
  return 'bg-stone-100 dark:bg-stone-800'
}
const getFileColorText = (filename) => {
  const ext = getFileExtension(filename)
  if (['pdf'].includes(ext)) return 'text-red-500'
  if (['doc', 'docx'].includes(ext)) return 'text-blue-500'
  if (['xls', 'xlsx'].includes(ext)) return 'text-emerald-500'
  if (['ppt', 'pptx'].includes(ext)) return 'text-orange-500'
  if (['mp3', 'wav', 'ogg'].includes(ext)) return 'text-purple-500'
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'text-pink-500'
  return 'text-stone-500'
}
</script>

<style>
@keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
.animate-blob { animation: blob 10s infinite; }
.animation-delay-2000 { animation-delay: 2s; }
@keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
