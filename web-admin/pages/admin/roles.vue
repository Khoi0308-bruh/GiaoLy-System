<template>
  <div class="min-h-screen font-sans relative pb-24 overflow-hidden">
    <!-- BACKGROUND MESH GRADIENT -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute -top-32 -right-32 w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob bg-rose-200 dark:bg-rose-900"></div>
      <div class="absolute top-1/2 -left-32 w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-amber-200 dark:bg-amber-900"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
    </div>

    <div class="relative z-10 space-y-6 animate-fade-in-up px-4 md:px-8 pt-8 max-w-7xl mx-auto">
      <!-- ── PAGE HEADER & BANNER ── -->
      <div class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-rose-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="z-10 text-center md:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 text-xs font-black uppercase tracking-widest border border-rose-200 dark:border-rose-800 shadow-inner">
            <UIcon name="i-heroicons-shield-check" class="w-4 h-4" />
            <span>Phân Hệ Học Vụ</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-stone-800 dark:text-white tracking-tight">
            Quản Lý <span class="text-rose-500">Phân Quyền</span>
          </h1>
          <p class="text-stone-500 text-sm mt-2 max-w-lg">
            Thiết lập vai trò (Roles) và ma trận quyền hạn (Permissions) cho toàn bộ tài khoản hệ thống.
          </p>
        </div>
        
        <div class="flex flex-wrap items-center justify-center gap-3 z-10">
          <UButton
            icon="i-heroicons-arrow-path-rounded-square"
            label="Chuyển Đổi Dữ Liệu"
            color="amber"
            variant="soft"
            size="lg"
            class="rounded-2xl shadow-sm hover:-translate-y-0.5 transition-transform"
            :loading="migrating"
            @click="migrateUsers"
          />
          <UButton
            icon="i-heroicons-plus"
            label="Tạo Vai Trò"
            color="rose"
            variant="solid"
            size="lg"
            class="rounded-2xl shadow-lg shadow-rose-500/20 hover:-translate-y-0.5 transition-transform font-bold"
            @click="openCreateModal"
          />
        </div>
      </div>

      <!-- ── GLASS DATA GRID ── -->
      <UCard 
        class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-3xl shadow-2xl shadow-black/5 border border-white/50 dark:border-stone-800 rounded-[2.5rem] overflow-hidden"
        :ui="{ body: { padding: 'p-0', base: 'overflow-x-auto' } }"
      >
        <UTable
          :rows="roles"
          :columns="columns"
          :loading="loading"
          :empty-state="{ icon: 'i-heroicons-shield-exclamation', header: 'Chưa có vai trò nào' }"
          :ui="{ 
            th: { base: 'bg-stone-100/50 dark:bg-stone-900/50 font-black uppercase tracking-widest text-[10px] text-stone-500 py-5 border-b border-white/40 dark:border-stone-800/50' },
            td: { base: 'whitespace-nowrap border-b border-stone-200/20 dark:border-stone-800/20 py-4' },
            tr: { base: 'hover:bg-white/50 dark:hover:bg-stone-800/50 transition-colors group' }
          }"
        >
          <template #name-cell="{ row }">
            <div class="flex items-center gap-4 pl-4">
              <div class="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-900/50 text-rose-500 flex items-center justify-center shadow-inner border border-rose-200 dark:border-rose-800">
                <UIcon name="i-heroicons-user-group" class="w-5 h-5" />
              </div>
              <div>
                <p class="font-black text-stone-800 dark:text-white text-base leading-none mb-1 group-hover:text-rose-600 transition-colors">
                  {{ row.original.name }}
                </p>
                <p class="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1">
                  Mã: <UBadge color="neutral" variant="subtle" size="xs">{{ row.original.code }}</UBadge>
                </p>
              </div>
            </div>
          </template>

          <template #description-cell="{ row }">
            <span class="text-sm text-stone-500 max-w-[300px] truncate block" :title="row.original.description">
              {{ row.original.description || 'Chưa có mô tả' }}
            </span>
          </template>

          <template #userCount-cell="{ row }">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-users" class="w-4 h-4 text-stone-400" />
              <span class="font-black text-stone-700 dark:text-stone-300">{{ row.original.userCount }}</span>
            </div>
          </template>

          <template #actions-cell="{ row }">
            <div class="flex items-center justify-end gap-2 pr-4">
              <UTooltip text="Ma trận cấp quyền">
                <UButton
                  size="sm"
                  color="amber"
                  variant="soft"
                  icon="i-heroicons-key"
                  class="rounded-xl font-bold uppercase tracking-wider"
                  label="Cấp Quyền"
                  @click="openAssignModal(row.original)"
                />
              </UTooltip>
              
              <UDropdown :items="getRoleActions(row.original)" :popper="{ placement: 'bottom-end' }">
                <UButton color="neutral" variant="ghost" icon="i-heroicons-ellipsis-horizontal" size="sm" class="rounded-xl opacity-50 group-hover:opacity-100 transition-opacity bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 shadow-sm" />
              </UDropdown>
            </div>
          </template>
        </UTable>
      </UCard>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         MODAL: TẠO / SỬA VAI TRÒ
    ═══════════════════════════════════════════════════════ -->
    <UModal v-model:open="isModalOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' }, footer: { padding: 'p-6 bg-stone-50 dark:bg-stone-900' } }">
        <template #header>
          <div class="bg-rose-600 dark:bg-rose-900 p-6 flex justify-between items-center text-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><UIcon name="i-heroicons-shield-check" class="w-6 h-6" /></div>
              <h3 class="text-xl font-black uppercase tracking-wide">{{ isEditing ? 'Chỉnh Sửa Vai Trò' : 'Tạo Vai Trò Mới' }}</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="white" variant="ghost" class="hover:bg-white/10 rounded-full" @click="isModalOpen = false" />
          </div>
        </template>
        
        <UForm :state="form" @submit="submitForm" id="roleForm" class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField label="Tên vai trò" name="name">
              <UInput v-model="form.name" placeholder="VD: Quản trị viên" required :ui="{ base: 'rounded-xl' }" />
            </UFormField>
            <UFormField label="Mã vai trò (Role Code)" name="code">
              <UInput v-model="form.code" placeholder="VD: Admin, GLV, 1, 2..." required :disabled="isEditing && form.code === '1'" :ui="{ base: 'rounded-xl' }" />
            </UFormField>
          </div>
          <UFormField label="Mô tả" name="description">
            <UTextarea v-model="form.description" :rows="3" placeholder="Vai trò này có chức năng gì..." :ui="{ base: 'rounded-xl' }" />
          </UFormField>
        </UForm>
        
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Hủy bỏ" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isModalOpen = false" />
            <UButton type="submit" form="roleForm" :label="isEditing ? 'Lưu Thay Đổi' : 'Tạo Vai Trò'" color="rose" variant="solid" size="lg" class="rounded-xl font-black uppercase tracking-wider shadow-lg shadow-rose-500/20" :loading="saving" />
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- ═══════════════════════════════════════════════════════
         MODAL: MA TRẬN GÁN QUYỀN (PERMISSION MATRIX)
    ═══════════════════════════════════════════════════════ -->
    <UModal v-model:open="isAssignModalOpen" fullscreen :ui="{ base: 'bg-white/95 dark:bg-stone-950/95 backdrop-blur-3xl' }">
      <div class="h-full flex flex-col p-6 max-w-7xl mx-auto w-full">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8 pb-6 border-b border-stone-200 dark:border-stone-800">
          <div class="flex items-center gap-4">
            <div class="p-4 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-3xl shadow-inner"><UIcon name="i-heroicons-key" class="w-10 h-10" /></div>
            <div>
              <h2 class="text-3xl font-black text-stone-800 dark:text-white uppercase tracking-tight">Ma Trận Cấp Quyền</h2>
              <p class="text-sm font-bold text-stone-500 uppercase tracking-widest mt-1">Đang thiết lập cho: <span class="text-amber-600 dark:text-amber-400 text-lg ml-1">{{ selectedRole?.name }}</span></p>
            </div>
          </div>
          <div class="flex gap-3">
            <UButton label="Hủy" color="neutral" variant="soft" size="xl" class="rounded-2xl font-bold" @click="isAssignModalOpen = false" />
            <UButton label="Lưu Ma Trận" color="amber" variant="solid" size="xl" class="rounded-2xl font-black uppercase tracking-wider shadow-xl shadow-amber-500/20" icon="i-heroicons-check" :loading="savingPermissions" @click="savePermissions" />
          </div>
        </div>
        
        <!-- Ma trận -->
        <div class="flex-1 overflow-auto rounded-[2rem] p-2">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            <div 
              v-for="(perms, moduleName) in groupedPermissions" 
              :key="moduleName"
              class="bg-white/60 dark:bg-stone-900/60 backdrop-blur-xl border border-white/80 dark:border-stone-700/50 rounded-3xl p-6 shadow-xl shadow-black/5 flex flex-col transition-all hover:border-amber-300 dark:hover:border-amber-700/50"
            >
              <h4 class="font-black text-stone-800 dark:text-white text-lg mb-4 flex items-center gap-2 pb-3 border-b border-stone-200 dark:border-stone-800">
                <UIcon name="i-heroicons-square-3-stack-3d" class="text-amber-500" />
                {{ moduleName }}
              </h4>
              
              <div class="space-y-4 flex-1">
                <div 
                  v-for="p in perms" 
                  :key="p.id"
                  class="flex items-center justify-between group p-2 -mx-2 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
                >
                  <div>
                    <p class="font-bold text-stone-700 dark:text-stone-300 text-sm group-hover:text-amber-600 transition-colors">{{ p.name }}</p>
                    <p class="text-[10px] text-stone-400 uppercase tracking-widest font-bold">{{ p.code }}</p>
                  </div>
                  <!-- Glowing Toggle -->
                  <div class="relative">
                    <div v-if="selectedPermissions.includes(p.id)" class="absolute inset-0 bg-amber-400 blur-md opacity-50 rounded-full"></div>
                    <UToggle 
                      :model-value="selectedPermissions.includes(p.id)"
                      @update:model-value="val => togglePermission(p.id, val)"
                      color="amber" 
                      size="lg"
                      class="relative z-10"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </UModal>

  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
useHead({ title: 'Quản Lý Phân Quyền - GiaoLy Admin' })

const toast = useToast()

const roles = ref([])
const loading = ref(true)
const columns = [
  { accessorKey: 'name', header: 'Vai Trò' },
  { accessorKey: 'description', header: 'Mô Tả' },
  { accessorKey: 'userCount', header: 'Người Dùng' },
  { accessorKey: 'actions', header: '' }
]

const permissions = ref([])
const groupedPermissions = computed(() => {
  const groups = {}
  permissions.value.forEach((p) => {
    if (!groups[p.module]) groups[p.module] = []
    groups[p.module].push(p)
  })
  return groups
})

const isModalOpen = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const form = reactive({ id: null, name: '', code: '', description: '' })

const isAssignModalOpen = ref(false)
const selectedRole = ref(null)
const selectedPermissions = ref([])
const savingPermissions = ref(false)
const migrating = ref(false)

const getRoleActions = (role) => {
  const actions = [
    [{ label: 'Sửa Thông Tin', icon: 'i-heroicons-pencil-square', click: () => openEditModal(role) }]
  ]
  if (role.code !== '1') {
    actions.push([{ label: 'Xóa Vai Trò', icon: 'i-heroicons-trash', color: 'red', click: () => deleteRole(role) }])
  }
  return actions
}

const togglePermission = (id, val) => {
  if (val) {
    if (!selectedPermissions.value.includes(id)) selectedPermissions.value.push(id)
  } else {
    selectedPermissions.value = selectedPermissions.value.filter(pId => pId !== id)
  }
}

const migrateUsers = async () => {
  if (!confirm('Bạn có chắc muốn chạy tiến trình chuyển đổi dữ liệu người dùng cũ sang RBAC mới không? (Nên chạy 1 lần)')) return
  migrating.value = true
  try {
    const res = await $api('/roles/migrate-users', { method: 'POST' })
    toast.add({ title: 'Thành công', description: res.message, color: 'success' })
  } catch { toast.add({ title: 'Lỗi chuyển đổi dữ liệu', color: 'error' }) }
  finally { migrating.value = false }
}

const fetchRoles = async () => {
  loading.value = true
  try { roles.value = await $api('/roles') } 
  catch { toast.add({ title: 'Lỗi tải danh sách', color: 'error' }) } 
  finally { loading.value = false }
}

const fetchPermissions = async () => {
  try { permissions.value = await $api('/roles/permissions') } 
  catch { /* Ignore */ }
}

const openCreateModal = () => {
  isEditing.value = false
  Object.assign(form, { id: null, name: '', code: '', description: '' })
  isModalOpen.value = true
}

const openEditModal = (role) => {
  isEditing.value = true
  Object.assign(form, role)
  isModalOpen.value = true
}

const submitForm = async () => {
  saving.value = true
  try {
    if (isEditing.value) {
      await $api(`/roles/${form.id}`, { method: 'PUT', body: form })
      toast.add({ title: 'Đã cập nhật', color: 'success' })
    } else {
      await $api('/roles', { method: 'POST', body: form })
      toast.add({ title: 'Đã tạo vai trò mới', color: 'success' })
    }
    isModalOpen.value = false
    await fetchRoles()
  } catch { toast.add({ title: 'Lỗi lưu dữ liệu', color: 'error' }) } 
  finally { saving.value = false }
}

const deleteRole = async (role) => {
  if (!confirm(`Bạn có chắc muốn xóa vai trò ${role.name}?`)) return
  try {
    await $api(`/roles/${role.id}`, { method: 'DELETE' })
    toast.add({ title: 'Đã xóa', color: 'success' })
    await fetchRoles()
  } catch { toast.add({ title: 'Lỗi xóa', color: 'error' }) }
}

const openAssignModal = async (role) => {
  selectedRole.value = role
  selectedPermissions.value = []
  try {
    const data = await $api(`/roles/${role.id}`)
    selectedPermissions.value = data.permissions || []
    isAssignModalOpen.value = true
  } catch { toast.add({ title: 'Lỗi tải quyền hạn', color: 'error' }) }
}

const savePermissions = async () => {
  savingPermissions.value = true
  try {
    await $api(`/roles/${selectedRole.value.id}/permissions`, { method: 'POST', body: selectedPermissions.value })
    toast.add({ title: 'Đã cập nhật quyền hạn', color: 'success' })
    isAssignModalOpen.value = false
  } catch { toast.add({ title: 'Lỗi cập nhật', color: 'error' }) } 
  finally { savingPermissions.value = false }
}

onMounted(() => {
  fetchRoles()
  fetchPermissions()
})
</script>

<style>
@keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
.animate-blob { animation: blob 10s infinite; }
.animation-delay-2000 { animation-delay: 2s; }
@keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
