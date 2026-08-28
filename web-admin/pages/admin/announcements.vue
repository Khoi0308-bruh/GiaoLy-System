<template>
  <div class="min-h-screen font-sans relative pb-24 overflow-hidden">
    <!-- BACKGROUND MESH GRADIENT -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute top-0 -left-32 w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob bg-purple-200 dark:bg-purple-900"></div>
      <div class="absolute -bottom-32 right-0 w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-orange-200 dark:bg-orange-900"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
    </div>

    <div class="relative z-10 space-y-6 animate-fade-in-up px-4 md:px-8 pt-8 max-w-7xl mx-auto">
      <!-- ── PAGE HEADER & BANNER ── -->
      <div class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="z-10 text-center md:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 text-xs font-black uppercase tracking-widest border border-purple-200 dark:border-purple-800 shadow-inner">
            <UIcon name="i-heroicons-megaphone" class="w-4 h-4" />
            <span>Phân Hệ Nội Dung</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-stone-800 dark:text-white tracking-tight">
            Quản Lý <span class="text-purple-500">Thông Báo</span>
          </h1>
          <p class="text-stone-500 text-sm mt-2 max-w-lg">
            Khởi tạo, phát sóng và quản lý các thông báo quan trọng đến toàn thể đoàn sinh và phụ huynh.
          </p>
        </div>
        
        <div class="flex flex-wrap items-center justify-center gap-3 z-10">
          <UButton
            v-if="auth?.hasPermission('announcements.create')"
            label="Đăng Thông Báo Mới"
            icon="i-heroicons-plus"
            color="purple"
            variant="solid"
            size="lg"
            class="rounded-2xl shadow-lg shadow-purple-500/20 hover:-translate-y-0.5 transition-transform font-bold uppercase tracking-wider"
            @click="openCreate"
          />
        </div>
      </div>

      <!-- ── FILTER BAR ── -->
      <div class="flex justify-center md:justify-start">
        <div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-xl p-1.5 rounded-2xl border border-white/60 dark:border-stone-800 shadow-sm inline-flex">
          <button
            v-for="f in typeFilters"
            :key="f.value"
            class="px-6 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 uppercase tracking-widest"
            :class="activeType === f.value ? 'bg-purple-500 text-white shadow-md' : 'text-stone-500 hover:text-purple-600 hover:bg-white dark:hover:bg-stone-800'"
            @click="activeType = f.value"
          >
            {{ f.label }}
          </button>
        </div>
      </div>

      <!-- ── LOADING ── -->
      <div v-if="pending" class="flex flex-col items-center justify-center py-24">
        <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 animate-spin text-purple-400 mb-4" />
        <p class="text-stone-500 font-bold uppercase tracking-widest text-sm">Đang tải thông báo...</p>
      </div>

      <!-- ── EMPTY ── -->
      <div v-else-if="!filtered.length" class="text-center py-24 bg-white/40 dark:bg-stone-900/40 backdrop-blur-xl rounded-[2rem] border border-white/50 dark:border-stone-800 shadow-sm">
        <UIcon name="i-heroicons-megaphone" class="w-16 h-16 text-stone-300 dark:text-stone-700 mx-auto mb-4" />
        <p class="text-stone-500 font-bold text-lg">Chưa có thông báo nào trong mục này.</p>
        <UButton v-if="auth?.hasPermission('announcements.create')" label="Tạo thông báo đầu tiên" variant="soft" color="purple" class="mt-4 rounded-xl font-bold" @click="openCreate" />
      </div>

      <!-- ── MASONRY GRID LIST ── -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in filtered"
          :key="item.id"
          class="group bg-white/50 dark:bg-stone-900/50 backdrop-blur-xl border rounded-[2rem] p-6 shadow-xl shadow-black/5 flex flex-col transition-all relative overflow-hidden"
          :class="[
            item.type === 'Urgent' ? 'border-red-400/50 hover:border-red-500 shadow-red-500/10 hover:shadow-red-500/20' : 
            item.type === 'Event' ? 'border-amber-400/50 hover:border-amber-500 shadow-amber-500/10 hover:shadow-amber-500/20' : 
            'border-white/60 dark:border-stone-800 hover:border-purple-400 hover:shadow-purple-500/10 hover:-translate-y-1'
          ]"
        >
          <!-- Radiant Background for Urgent -->
          <div v-if="item.type === 'Urgent'" class="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent pointer-events-none"></div>
          
          <div class="relative z-10 flex-1">
            <div class="flex justify-between items-start mb-4">
              <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner', typeIconBg(item.type), typeIconColor(item.type)]">
                <UIcon :name="typeIcon(item.type)" class="w-6 h-6" />
              </div>
              <div class="flex flex-col items-end gap-2">
                <UBadge :label="typeBadge(item.type).label" :color="typeBadge(item.type).color" variant="soft" size="xs" class="font-black uppercase tracking-widest rounded-lg" />
                <UBadge v-if="item.expiryDate && isExpired(item.expiryDate)" label="HẾT HẠN" color="neutral" variant="solid" size="xs" class="font-black tracking-widest rounded-lg" />
              </div>
            </div>

            <h3 class="font-black text-xl text-stone-800 dark:text-white leading-tight mb-2 group-hover:text-purple-600 transition-colors">{{ item.title }}</h3>
            
            <p class="text-xs font-bold text-stone-500 mt-4 space-y-1">
              <span class="flex items-center gap-2"><UIcon name="i-heroicons-user" class="w-4 h-4" /> {{ item.author }}</span>
              <span class="flex items-center gap-2"><UIcon name="i-heroicons-clock" class="w-4 h-4" /> {{ formatDate(item.createdDate) }}</span>
              <span class="flex items-center gap-2 text-purple-600 dark:text-purple-400"><UIcon name="i-heroicons-users" class="w-4 h-4" /> {{ audienceLabel(item.targetAudience) }}</span>
            </p>
          </div>

          <div class="relative z-10 mt-6 pt-4 border-t border-stone-200/50 dark:border-stone-800/50 flex items-center justify-end gap-2">
            <UButton icon="i-heroicons-eye" color="neutral" variant="soft" size="sm" class="rounded-xl font-bold" @click="viewItem(item)">Xem</UButton>
            <UButton v-if="auth?.hasPermission('announcements.update')" icon="i-heroicons-pencil-square" color="primary" variant="ghost" size="sm" class="rounded-xl" @click="editItem(item)" />
            <UButton v-if="auth?.hasPermission('announcements.delete')" icon="i-heroicons-trash" color="error" variant="ghost" size="sm" class="rounded-xl" @click="confirmDelete(item)" />
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         MODAL: TẠO / SỬA THÔNG BÁO
    ═══════════════════════════════════════════════════════ -->
    <UModal v-model:open="isFormOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden sm:max-w-4xl' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' }, footer: { padding: 'p-6 bg-stone-50 dark:bg-stone-900' } }">
        <template #header>
          <div class="bg-purple-600 dark:bg-purple-900 p-6 flex justify-between items-center text-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><UIcon name="i-heroicons-megaphone" class="w-6 h-6" /></div>
              <h3 class="text-xl font-black uppercase tracking-wide">{{ editingId ? 'Chỉnh Sửa Thông Báo' : 'Đăng Thông Báo Mới' }}</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="white" variant="ghost" class="hover:bg-white/10 rounded-full" @click="isFormOpen = false" />
          </div>
        </template>
        
        <div class="p-6">
          <UAlert v-if="formError" color="error" variant="soft" :description="formError" icon="i-heroicons-exclamation-circle" class="mb-6 rounded-2xl" />
          
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Cột trái: Nội dung -->
            <div class="lg:col-span-2 space-y-6">
              <UFormField label="Tiêu đề thông báo" required>
                <UInput v-model="form.title" placeholder="Hôm nay nghỉ học..." class="w-full text-lg font-bold" size="lg" :ui="{ base: 'rounded-xl' }" />
              </UFormField>
              <UFormField label="Nội dung" required>
                <UTextarea v-model="form.content" placeholder="Nhập nội dung chi tiết (hỗ trợ HTML cơ bản)..." :rows="12" class="w-full font-sans text-sm" :ui="{ base: 'rounded-xl' }" />
              </UFormField>
            </div>

            <!-- Cột phải: Cấu hình -->
            <div class="space-y-6 bg-purple-50/50 dark:bg-purple-900/10 p-5 rounded-2xl border border-purple-100 dark:border-purple-800/50 h-fit">
              <h3 class="font-black text-purple-800 dark:text-purple-300 flex items-center gap-2 pb-2 border-b border-purple-200 dark:border-purple-800"><UIcon name="i-heroicons-cog-6-tooth" /> Phân Loại</h3>
              
              <UFormField label="Mức độ quan trọng">
                <USelectMenu v-model="form.type" :options="typeOptions" value-attribute="value" option-attribute="label" class="w-full" :ui="{ base: 'rounded-xl' }" />
              </UFormField>
              
              <UFormField label="Đối tượng hiển thị">
                <USelectMenu v-model="form.targetAudience" :options="audienceOptions" value-attribute="value" option-attribute="label" class="w-full" :ui="{ base: 'rounded-xl' }" />
              </UFormField>
              
              <UFormField label="Ngày hết hạn (tùy chọn)">
                <UInput v-model="form.expiryDate" type="datetime-local" class="w-full" :ui="{ base: 'rounded-xl' }" />
                <p class="text-[10px] text-stone-500 font-bold mt-2 leading-tight">Nếu để trống, thông báo sẽ tồn tại vĩnh viễn cho đến khi bị xóa.</p>
              </UFormField>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Hủy" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isFormOpen = false" />
            <UButton :label="editingId ? 'Lưu Thay Đổi' : 'Phát Sóng Thông Báo'" color="purple" variant="solid" size="lg" class="rounded-xl font-black uppercase tracking-wider shadow-lg shadow-purple-500/20" :loading="submitting" icon="i-heroicons-paper-airplane" @click="submitForm" />
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- ═══════════════════════════════════════════════════════
         MODAL: XEM CHI TIẾT
    ═══════════════════════════════════════════════════════ -->
    <UModal v-model:open="isViewOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden sm:max-w-3xl' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-6 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800' } }">
        <template #header>
          <div class="flex justify-between items-start gap-4">
            <div>
              <div class="flex items-center gap-2 mb-3">
                <UBadge :label="typeBadge(viewingItem?.type).label" :color="typeBadge(viewingItem?.type).color" variant="soft" class="font-black uppercase tracking-widest rounded-lg" />
                <span class="text-xs font-bold text-stone-400"><UIcon name="i-heroicons-clock" class="inline-block mr-1" /> {{ formatDate(viewingItem?.createdDate) }}</span>
              </div>
              <h3 class="text-2xl font-black text-stone-800 dark:text-white leading-tight">{{ viewingItem?.title }}</h3>
              <p class="text-sm font-bold text-purple-600 mt-2">Đăng bởi: {{ viewingItem?.author }}</p>
            </div>
            <UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" class="rounded-full" @click="isViewOpen = false" />
          </div>
        </template>
        
        <div class="p-8 bg-white dark:bg-stone-950">
          <div class="prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-a:text-purple-600 text-stone-700 dark:text-stone-300" v-html="viewingItem?.content"></div>
        </div>

        <template #footer>
          <div class="flex justify-end p-4 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
            <UButton label="Đóng" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isViewOpen = false" />
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
            <h3 class="text-xl font-black uppercase tracking-wide">Xác Nhận Xóa</h3>
          </div>
        </template>
        <p class="text-stone-600 dark:text-stone-300 mb-6">Bạn có chắc chắn muốn xóa thông báo <b>"{{ deletingItem?.title }}"</b>? Hành động này không thể hoàn tác.</p>
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
useHead({ title: 'Quản Lý Thông Báo - GiaoLy Admin' })

const toast = useToast()
const auth = useAuthStore()

const { data: allAnnouncements, pending, refresh } = await useApiFetch('/Announcement', { default: () => [] })

const activeType = ref('all')
const typeFilters = [
  { label: 'Tất Cả', value: 'all' },
  { label: 'Thông Thường', value: 'Normal' },
  { label: 'Khẩn Cấp', value: 'Urgent' },
  { label: 'Sự Kiện', value: 'Event' }
]

const filtered = computed(() => {
  const list = allAnnouncements.value || []
  if (activeType.value === 'all') return list
  return list.filter(a => a.type === activeType.value)
})

const isFormOpen = ref(false)
const submitting = ref(false)
const formError = ref('')
const editingId = ref(null)

const defaultForm = () => ({ title: '', content: '', type: 'Normal', targetAudience: 'All', expiryDate: '' })
const form = ref(defaultForm())

const typeOptions = [
  { label: 'Thông Thường 📢', value: 'Normal' },
  { label: 'Khẩn Cấp 🚨', value: 'Urgent' },
  { label: 'Sự Kiện 📅', value: 'Event' }
]
const audienceOptions = [
  { label: 'Tất Cả', value: 'All' },
  { label: 'Trưởng đoàn', value: 'LeadersOnly' },
  { label: 'Theo Ngành', value: 'BranchSpecific' }
]

const openCreate = () => { editingId.value = null; form.value = defaultForm(); formError.value = ''; isFormOpen.value = true }
const editItem = (item) => {
  editingId.value = item.id
  form.value = { title: item.title, content: item.content, type: item.type, targetAudience: item.targetAudience, expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().slice(0, 16) : '' }
  formError.value = ''; isFormOpen.value = true
}

const submitForm = async () => {
  if (!form.value.title.trim() || !form.value.content.trim()) { formError.value = 'Vui lòng điền đầy đủ tiêu đề và nội dung.'; return }
  submitting.value = true; formError.value = ''
  try {
    const payload = { ...form.value, expiryDate: form.value.expiryDate ? new Date(form.value.expiryDate).toISOString() : null }
    if (editingId.value) { await $api(`/Announcement/${editingId.value}`, { method: 'PUT', body: payload }); toast.add({ title: 'Đã cập nhật', color: 'success' }) } 
    else { await $api('/Announcement', { method: 'POST', body: payload }); toast.add({ title: 'Đã đăng thông báo', color: 'success' }) }
    isFormOpen.value = false; await refresh()
  } catch (err) { formError.value = err?.data?.message || 'Lỗi hệ thống.' } 
  finally { submitting.value = false }
}

const isViewOpen = ref(false)
const viewingItem = ref(null)
const viewItem = (item) => { viewingItem.value = item; isViewOpen.value = true }

const isDeleteOpen = ref(false)
const deleting = ref(false)
const deletingItem = ref(null)
const confirmDelete = (item) => { deletingItem.value = item; isDeleteOpen.value = true }
const executeDelete = async () => {
  deleting.value = true
  try { await $api(`/Announcement/${deletingItem.value.id}`, { method: 'DELETE' }); toast.add({ title: 'Đã xóa', color: 'success' }); isDeleteOpen.value = false; await refresh() } 
  catch { toast.add({ title: 'Lỗi xóa', color: 'error' }) } 
  finally { deleting.value = false }
}

const formatDate = d => d ? new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''
const isExpired = d => d && new Date(d) < new Date()
const typeBadge = type => ({ Normal: { label: 'Thông Thường', color: 'purple' }, Urgent: { label: 'Khẩn Cấp', color: 'error' }, Event: { label: 'Sự Kiện', color: 'warning' } }[type] || { label: type || 'Thông Thường', color: 'neutral' })
const typeIcon = type => ({ Urgent: 'i-heroicons-bell-alert', Event: 'i-heroicons-calendar-days' }[type] || 'i-heroicons-megaphone')
const typeIconBg = type => ({ Urgent: 'bg-red-100 dark:bg-red-900/50', Event: 'bg-amber-100 dark:bg-amber-900/50' }[type] || 'bg-purple-100 dark:bg-purple-900/50')
const typeIconColor = type => ({ Urgent: 'text-red-600 dark:text-red-400', Event: 'text-amber-600 dark:text-amber-400' }[type] || 'text-purple-600 dark:text-purple-400')
const audienceLabel = a => ({ All: 'Tất Cả', LeadersOnly: 'Trưởng Đoàn', BranchSpecific: 'Theo Ngành' }[a] || a)
</script>

<style>
@keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
.animate-blob { animation: blob 10s infinite; }
.animation-delay-2000 { animation-delay: 2s; }
@keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
