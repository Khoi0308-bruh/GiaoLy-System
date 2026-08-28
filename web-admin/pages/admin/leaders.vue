<template>
  <div class="min-h-screen font-sans relative pb-24 overflow-hidden">
    <!-- BACKGROUND MESH GRADIENT -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute -top-40 -left-40 w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob bg-blue-200 dark:bg-blue-900"></div>
      <div class="absolute -bottom-40 right-0 w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-amber-200 dark:bg-amber-900"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
    </div>

    <div class="relative z-10 space-y-6 animate-fade-in-up px-4 md:px-8 pt-8 max-w-7xl mx-auto">
      <!-- ── PAGE HEADER & BANNER ── -->
      <div class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="z-10 text-center lg:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 text-xs font-black uppercase tracking-widest border border-blue-200 dark:border-blue-800 shadow-inner">
            <UIcon name="i-heroicons-users" class="w-4 h-4" />
            <span>Phân Hệ Nội Dung</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-stone-800 dark:text-white tracking-tight">
            Ban Điều Hành <span class="text-blue-500">Xứ Đoàn</span>
          </h1>
          <p class="text-stone-500 text-sm mt-2 max-w-xl">
            Quản lý hồ sơ Huynh Trưởng, Ban Điều Hành, và cơ chế chuyển giao thế hệ (Xoay vòng nhiệm kỳ).
          </p>
        </div>
        
        <div class="flex flex-wrap items-center justify-center gap-3 z-10">
          <UButton
            v-if="auth?.hasPermission('leaders.update')"
            label="Xoay Vòng Nhiệm Kỳ"
            icon="i-heroicons-arrow-path-rounded-square"
            color="white"
            variant="solid"
            size="lg"
            class="rounded-2xl shadow-sm hover:-translate-y-0.5 transition-transform font-bold text-amber-600"
            @click="isRotateOpen = true"
          />
          <UButton
            v-if="auth?.hasPermission('leaders.create')"
            label="Thêm Huynh Trưởng"
            icon="i-heroicons-user-plus"
            color="blue"
            variant="solid"
            size="lg"
            class="rounded-2xl shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-transform font-bold uppercase tracking-wider"
            @click="openCreate"
          />
        </div>
      </div>

      <!-- ── TABS ── -->
      <div class="flex justify-center md:justify-start">
        <div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-xl p-1.5 rounded-2xl border border-white/60 dark:border-stone-800 shadow-sm inline-flex">
          <button
            class="px-6 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 uppercase tracking-widest"
            :class="activeTab === 'active' ? 'bg-blue-500 text-white shadow-md' : 'text-stone-500 hover:text-blue-600 hover:bg-white dark:hover:bg-stone-800'"
            @click="activeTab = 'active'"
          >
            Đang Hoạt Động
          </button>
          <button
            class="px-6 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 uppercase tracking-widest flex items-center gap-2"
            :class="activeTab === 'history' ? 'bg-stone-800 text-white shadow-md' : 'text-stone-500 hover:text-stone-800 hover:bg-white dark:hover:bg-stone-800'"
            @click="activeTab = 'history'"
          >
            Cựu Trào <UIcon name="i-heroicons-clock" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- ── LOADING ── -->
      <div v-if="pending" class="flex flex-col items-center justify-center py-24 bg-white/20 dark:bg-stone-900/20 backdrop-blur-xl rounded-[2rem]">
        <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 animate-spin text-blue-400 mb-4" />
        <p class="text-stone-500 font-bold uppercase tracking-widest text-sm">Đang tải hồ sơ nhân sự...</p>
      </div>

      <!-- ── EMPTY ── -->
      <div v-else-if="!currentList.length" class="text-center py-24 bg-white/40 dark:bg-stone-900/40 backdrop-blur-xl rounded-[2rem] border border-white/50 dark:border-stone-800 shadow-sm">
        <UIcon name="i-heroicons-user-group" class="w-16 h-16 text-stone-300 dark:text-stone-700 mx-auto mb-4" />
        <p class="text-stone-500 font-bold text-lg">Chưa có hồ sơ nhân sự nào trong mục này.</p>
      </div>

      <!-- ── LIST ── -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="leader in currentList"
          :key="leader.id"
          class="group bg-white/60 dark:bg-stone-900/60 backdrop-blur-2xl border border-white/80 dark:border-stone-800 rounded-3xl p-6 shadow-xl shadow-black/5 flex flex-col transition-all relative overflow-hidden"
          :class="activeTab === 'active' ? 'hover:border-blue-400 hover:shadow-blue-500/10 hover:-translate-y-1' : 'hover:border-stone-400 opacity-80 hover:opacity-100'"
        >
          <!-- Active Gradient Glow -->
          <div v-if="activeTab === 'active'" class="absolute inset-0 bg-gradient-to-b from-blue-100/30 to-transparent dark:from-blue-900/10 pointer-events-none"></div>

          <div class="relative z-10 flex flex-col items-center text-center">
            <!-- Avatar -->
            <div class="relative mb-4">
              <UAvatar
                :src="leader.avatarPath ? `${config.public.apiBase}${leader.avatarPath}` : undefined"
                :alt="leader.fullName"
                size="3xl"
                class="w-24 h-24 shadow-xl ring-4 ring-white dark:ring-stone-800 bg-stone-100 dark:bg-stone-800"
                :ui="{ placeholder: 'font-black text-2xl text-stone-400' }"
              />
              <button
                v-if="auth?.hasPermission('leaders.update')"
                class="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600 hover:scale-110"
                title="Cập nhật ảnh thẻ"
                @click="openAvatarUpload(leader)"
              >
                <UIcon name="i-heroicons-camera" class="w-4 h-4" />
              </button>
            </div>

            <!-- Profile Info -->
            <div class="space-y-1 w-full">
              <p class="text-[10px] font-black text-stone-400 uppercase tracking-widest">{{ leader.holyName || '---' }}</p>
              <h3 class="font-black text-stone-800 dark:text-white text-lg leading-tight group-hover:text-blue-600 transition-colors">{{ leader.fullName }}</h3>
              
              <div class="pt-2">
                <UBadge :label="leader.position" :color="activeTab === 'active' ? 'blue' : 'neutral'" variant="soft" size="sm" class="font-bold tracking-wide rounded-lg" />
              </div>
            </div>

            <p class="text-xs text-stone-500 italic mt-4 min-h-[2rem] line-clamp-2">
              "{{ leader.description || 'Sống Đạo yêu thương...' }}"
            </p>

            <div class="w-full mt-4 p-3 bg-white/50 dark:bg-stone-900/50 rounded-2xl flex items-center justify-between text-[11px] font-bold text-stone-500 uppercase tracking-widest">
              <span class="flex flex-col items-center gap-1"><UIcon name="i-heroicons-calendar" class="w-4 h-4 text-blue-400" /> {{ leader.term || '---' }}</span>
              <span class="flex flex-col items-center gap-1"><UIcon name="i-heroicons-star" class="w-4 h-4 text-amber-400" /> CẤP {{ leader.level }}</span>
            </div>
          </div>

          <!-- Actions Overlay (Top Right) -->
          <div v-if="auth?.hasPermission('leaders.update') || auth?.hasPermission('leaders.delete')" class="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 z-20">
            <UTooltip text="Chỉnh sửa hồ sơ" placement="left">
              <UButton icon="i-heroicons-pencil-square" color="primary" variant="solid" size="xs" class="rounded-xl shadow-md" @click="editItem(leader)" />
            </UTooltip>
            <UTooltip text="Xóa hồ sơ" placement="left">
              <UButton v-if="auth?.hasPermission('leaders.delete')" icon="i-heroicons-trash" color="error" variant="solid" size="xs" class="rounded-xl shadow-md" @click="confirmDelete(leader)" />
            </UTooltip>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         MODAL: THÊM / SỬA THÀNH VIÊN
    ═══════════════════════════════════════════════════════ -->
    <UModal v-model:open="isFormOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden sm:max-w-3xl' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' }, footer: { padding: 'p-6 bg-stone-50 dark:bg-stone-900' } }">
        <template #header>
          <div class="bg-blue-600 dark:bg-blue-900 p-6 flex justify-between items-center text-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><UIcon name="i-heroicons-identification" class="w-6 h-6" /></div>
              <h3 class="text-xl font-black uppercase tracking-wide">{{ editingId ? 'Sửa Hồ Sơ' : 'Thêm Nhân Sự' }}</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="white" variant="ghost" class="hover:bg-white/10 rounded-full" @click="isFormOpen = false" />
          </div>
        </template>
        
        <form class="p-8 space-y-6" @submit.prevent="submitForm">
          <UFormField label="Đồng bộ từ tài khoản hệ thống (Tùy chọn)">
            <USelectMenu v-model="selectedUser" :options="userOptions" searchable searchable-placeholder="Tìm kiếm tài khoản..." placeholder="Chọn tài khoản để tự động điền tên..." class="w-full" :ui="{ base: 'rounded-xl shadow-inner' }" />
          </UFormField>

          <div class="p-5 bg-stone-50 dark:bg-stone-900/50 rounded-2xl border border-stone-100 dark:border-stone-800 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UFormField label="Tên Thánh"><UInput v-model="form.holyName" placeholder="Giuse..." :ui="{ base: 'rounded-xl shadow-inner' }" /></UFormField>
              <UFormField label="Họ và Tên" required><UInput v-model="form.fullName" placeholder="Nguyễn Văn A" required :ui="{ base: 'rounded-xl shadow-inner' }" /></UFormField>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UFormField label="Chức vụ" required><UInput v-model="form.position" placeholder="Xứ đoàn trưởng..." required :ui="{ base: 'rounded-xl shadow-inner' }" /></UFormField>
              <UFormField label="Cấp độ (Priority)" required><UInput v-model="form.level" type="number" placeholder="1" required :ui="{ base: 'rounded-xl shadow-inner' }" /></UFormField>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UFormField label="Nhiệm kỳ"><UInput v-model="form.term" placeholder="2024-2027" :ui="{ base: 'rounded-xl shadow-inner' }" /></UFormField>
              <UFormField label="Ngành (0: Chung, 1: Ấu...)"><UInput v-model="form.branch" type="number" :ui="{ base: 'rounded-xl shadow-inner' }" /></UFormField>
            </div>
          </div>

          <div class="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <UToggle v-model="form.isActive" color="blue" />
            <span class="text-sm font-bold text-blue-700 dark:text-blue-300">Nhân sự này đang hoạt động trong nhiệm kỳ hiện tại.</span>
          </div>

          <UFormField label="Mô tả / Châm ngôn sống">
            <UTextarea v-model="form.description" :rows="3" placeholder="Nhập châm ngôn hoặc tóm tắt..." :ui="{ base: 'rounded-xl shadow-inner' }" />
          </UFormField>
        </form>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Hủy" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isFormOpen = false" />
            <UButton :label="editingId ? 'Lưu Thay Đổi' : 'Xác Nhận Thêm'" color="blue" variant="solid" size="lg" class="rounded-xl font-black uppercase tracking-wider shadow-lg shadow-blue-500/20" :loading="submitting" @click="submitForm" />
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- ═══════════════════════════════════════════════════════
         MODAL: TẢI LÊN AVATAR
    ═══════════════════════════════════════════════════════ -->
    <UModal v-model:open="isAvatarOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' }, footer: { padding: 'p-6 bg-stone-50 dark:bg-stone-900' } }">
        <template #header>
          <div class="bg-blue-600 dark:bg-blue-900 p-6 flex justify-between items-center text-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><UIcon name="i-heroicons-camera" class="w-6 h-6" /></div>
              <h3 class="text-xl font-black uppercase tracking-wide">Đổi Ảnh Thẻ</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="white" variant="ghost" class="hover:bg-white/10 rounded-full" @click="isAvatarOpen = false" />
          </div>
        </template>
        
        <div class="p-8 text-center">
          <p class="text-sm font-bold text-stone-500 uppercase tracking-widest mb-6">Thành viên: <span class="text-blue-600">{{ targetLeader?.fullName }}</span></p>
          <div class="p-6 border-2 border-dashed border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10 rounded-[2rem] hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-colors">
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              class="block w-full text-sm text-stone-500 file:mx-auto file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:uppercase file:tracking-widest file:bg-blue-200 file:text-blue-800 dark:file:bg-blue-800 dark:file:text-blue-200 hover:file:bg-blue-300 cursor-pointer transition-colors"
            >
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Hủy" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isAvatarOpen = false" />
            <UButton label="Tải Ảnh Lên" color="blue" variant="solid" size="lg" class="rounded-xl font-black uppercase tracking-wider" :loading="uploadingAvatar" @click="submitAvatar" />
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- ═══════════════════════════════════════════════════════
         MODAL: XOAY VÒNG NHIỆM KỲ
    ═══════════════════════════════════════════════════════ -->
    <UModal v-model:open="isRotateOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' }, footer: { padding: 'p-6 bg-stone-50 dark:bg-stone-900' } }">
        <template #header>
          <div class="bg-gradient-to-r from-amber-500 to-orange-500 p-6 flex justify-between items-center text-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><UIcon name="i-heroicons-arrow-path-rounded-square" class="w-6 h-6" /></div>
              <h3 class="text-xl font-black uppercase tracking-wide">Xoay Vòng Nhiệm Kỳ</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="white" variant="ghost" class="hover:bg-white/10 rounded-full" @click="isRotateOpen = false" />
          </div>
        </template>
        
        <div class="p-8 space-y-6">
          <div class="p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-start gap-4">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-amber-500 shrink-0" />
            <div class="text-amber-800 dark:text-amber-200 text-sm font-medium">
              <p class="mb-2 font-bold uppercase tracking-widest text-xs">⚠️ Cơ chế chuyển giao thế hệ</p>
              <p>Tất cả thành viên đang hoạt động hiện tại sẽ bị chuyển thành <b>Cựu Trào</b>. Hệ thống sẽ quét toàn bộ danh sách, và tự động kích hoạt những người có "Nhiệm kỳ" khớp với nhiệm kỳ mới mà bạn sắp nhập bên dưới.</p>
            </div>
          </div>
          <UFormField label="Nhiệm kỳ mới sẽ kích hoạt">
            <UInput v-model="newTerm" placeholder="VD: 2024-2027" size="xl" class="font-bold text-center" :ui="{ base: 'rounded-xl shadow-inner text-center' }" />
          </UFormField>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Hủy Bỏ" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isRotateOpen = false" />
            <UButton label="Thực Hiện Xoay Vòng" color="amber" variant="solid" size="lg" class="rounded-xl font-black uppercase tracking-wider shadow-lg shadow-amber-500/20" :loading="rotating" @click="executeRotate" />
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- ═══════════════════════════════════════════════════════
         MODAL: XÓA
    ═══════════════════════════════════════════════════════ -->
    <UModal v-model:open="isDeleteOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden' }">
      <UCard :ui="{ body: { padding: 'p-6' }, header: { padding: 'p-6 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/50' } }">
        <template #header>
          <div class="flex items-center gap-3 text-red-600 dark:text-red-400">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8" />
            <h3 class="text-xl font-black uppercase tracking-wide">Xóa Hồ Sơ</h3>
          </div>
        </template>
        <p class="text-stone-600 dark:text-stone-300 mb-6">Bạn có chắc muốn xóa vĩnh viễn hồ sơ của <b>{{ deletingItem?.fullName }}</b>? Hành động này không thể hoàn tác.</p>
        <div class="flex justify-end gap-3">
          <UButton label="Hủy" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isDeleteOpen = false" />
          <UButton label="Xóa Vĩnh Viễn" color="error" variant="solid" size="lg" class="rounded-xl font-black uppercase tracking-wider" :loading="deleting" @click="executeDelete" />
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
useHead({ title: 'Quản Lý Ban Trưởng - GiaoLy Admin' })

const toast = useToast()
const auth = useAuthStore()
const config = useRuntimeConfig()

const activeTab = ref('active')
const pending = ref(false)
const activeLeaders = ref([])
const historyLeaders = ref([])

const { data: systemUsers } = await useApiFetch('/User', { default: () => [] })
const userOptions = computed(() => {
  return (systemUsers.value || []).map(u => ({
    label: `${u.fullName} (${u.username})`,
    fullName: u.fullName,
    holyName: u.holyName || ''
  }))
})

const selectedUser = ref(null)
watch(selectedUser, (val) => {
  if (val) {
    form.value.fullName = val.fullName
    if (val.holyName) form.value.holyName = val.holyName
  }
})

const currentList = computed(() => activeTab.value === 'active' ? activeLeaders.value : historyLeaders.value)

const fetchData = async () => {
  pending.value = true
  try {
    const [act, hist] = await Promise.all([$api('/Leader'), $api('/Leader/history')])
    activeLeaders.value = act || []
    historyLeaders.value = hist || []
  } catch { toast.add({ title: 'Lỗi tải dữ liệu', color: 'error' }) } 
  finally { pending.value = false }
}

onMounted(fetchData)

// ── CRUD FORM ──
const isFormOpen = ref(false)
const submitting = ref(false)
const editingId = ref(null)
const defaultForm = () => ({ holyName: '', fullName: '', position: '', level: 1, term: '2024-2027', description: '', branch: 0, isActive: true })
const form = ref(defaultForm())

const openCreate = () => { editingId.value = null; form.value = defaultForm(); isFormOpen.value = true }
const editItem = (item) => { editingId.value = item.id; form.value = { ...item }; isFormOpen.value = true }

const submitForm = async () => {
  if (!form.value.fullName || !form.value.position) return toast.add({ title: 'Thiếu thông tin bắt buộc', color: 'error' })
  submitting.value = true
  try {
    if (editingId.value) { await $api(`/Leader/${editingId.value}`, { method: 'PUT', body: form.value }); toast.add({ title: 'Đã cập nhật', color: 'success' }) } 
    else { await $api('/Leader', { method: 'POST', body: form.value }); toast.add({ title: 'Đã thêm mới', color: 'success' }) }
    isFormOpen.value = false; await fetchData()
  } catch (err) { toast.add({ title: 'Lỗi', description: err.message, color: 'error' }) } 
  finally { submitting.value = false }
}

// ── AVATAR ──
const isAvatarOpen = ref(false)
const uploadingAvatar = ref(false)
const avatarInput = ref(null)
const targetLeader = ref(null)

const openAvatarUpload = (leader) => { targetLeader.value = leader; if (avatarInput.value) avatarInput.value.value = ''; isAvatarOpen.value = true }
const submitAvatar = async () => {
  const file = avatarInput.value?.files[0]
  if (!file) return
  uploadingAvatar.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    await $fetch(`${config.public.apiBase}/Leader/${targetLeader.value.id}/avatar`, {
      method: 'POST', body: formData, headers: { Authorization: `Bearer ${auth.token}` }
    })
    toast.add({ title: 'Cập nhật ảnh thành công', color: 'success' })
    isAvatarOpen.value = false; await fetchData()
  } catch { toast.add({ title: 'Lỗi tải ảnh', color: 'error' }) } 
  finally { uploadingAvatar.value = false }
}

// ── ROTATE TERM ──
const isRotateOpen = ref(false)
const rotating = ref(false)
const newTerm = ref('2024-2027')
const executeRotate = async () => {
  if (!newTerm.value.trim()) return
  rotating.value = true
  try {
    const res = await $api('/Leader/rotate-term', { method: 'POST', body: `"${newTerm.value.trim()}"`, headers: { 'Content-Type': 'application/json' } })
    toast.add({ title: 'Xoay vòng thành công', description: res.message, color: 'success' })
    isRotateOpen.value = false; await fetchData()
  } catch { toast.add({ title: 'Lỗi xoay vòng', color: 'error' }) } 
  finally { rotating.value = false }
}

// ── DELETE ──
const isDeleteOpen = ref(false)
const deleting = ref(false)
const deletingItem = ref(null)
const confirmDelete = (item) => { deletingItem.value = item; isDeleteOpen.value = true }
const executeDelete = async () => {
  deleting.value = true
  try { await $api(`/Leader/${deletingItem.value.id}`, { method: 'DELETE' }); toast.add({ title: 'Xóa thành công', color: 'success' }); isDeleteOpen.value = false; await fetchData() } 
  catch { toast.add({ title: 'Lỗi xóa', color: 'error' }) } 
  finally { deleting.value = false }
}
</script>

<style>
@keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
.animate-blob { animation: blob 10s infinite; }
.animation-delay-2000 { animation-delay: 2s; }
@keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
