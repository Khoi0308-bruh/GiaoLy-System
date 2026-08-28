<template>
  <div class="min-h-screen bg-stone-50/50 dark:bg-stone-950/50 font-sans relative pb-24">
    <!-- ═══════════════════════════════════════════════════════
         BACKGROUND MESH GRADIENT
    ═══════════════════════════════════════════════════════ -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div class="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-30 dark:opacity-10 animate-blob bg-blue-100 dark:bg-blue-900"></div>
      <div class="absolute top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-30 dark:opacity-10 animate-blob animation-delay-2000 bg-emerald-100 dark:bg-emerald-900"></div>
      <div class="absolute -bottom-[20%] right-[20%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-4000 bg-amber-100 dark:bg-amber-900"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
    </div>

    <UContainer class="relative z-10 py-10 space-y-8 animate-fade-in-up">
      <!-- ═══════════════════════════════════════════════════════
           PAGE HEADER
      ═══════════════════════════════════════════════════════ -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div class="inline-flex items-center gap-2 px-4 py-1.5 mb-3 rounded-full bg-white/60 dark:bg-stone-900/40 backdrop-blur-md border border-white/40 dark:border-stone-700/50 shadow-sm text-xs font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest">
            <UIcon name="i-heroicons-shield-check" class="w-4 h-4" />
            <span>Phân hệ Quản trị</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-stone-900 dark:text-white flex items-center gap-3 drop-shadow-sm uppercase tracking-tight">
            Quản Lý <span class="text-primary-500">Tài Khoản</span>
          </h1>
          <p class="text-stone-500 text-sm mt-2 font-serif italic">
            Kiểm soát quyền truy cập và phân bổ nhân sự cho các Chi Đoàn.
          </p>
        </div>
        
        <div class="shrink-0 flex gap-3">
          <UButton
            icon="i-heroicons-user-plus"
            label="Thêm Tài Khoản"
            color="primary"
            variant="solid"
            size="lg"
            class="rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 bg-gradient-to-r from-primary-600 to-primary-500 hover:-translate-y-0.5 transition-transform"
            @click="openCreateModal"
          />
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════
           QUICK STATS CARDS
      ═══════════════════════════════════════════════════════ -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up delay-100">
        <!-- Tổng Tài Khoản -->
        <UCard class="bg-white/60 dark:bg-stone-900/60 backdrop-blur-2xl border border-white/50 dark:border-stone-800 rounded-[2rem] shadow-xl shadow-black/5" :ui="{ body: { padding: 'p-6' } }">
          <div class="flex items-center gap-4">
            <div class="p-4 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl shadow-inner">
              <UIcon name="i-heroicons-users" class="w-8 h-8" />
            </div>
            <div>
              <p class="text-stone-500 dark:text-stone-400 text-sm font-bold uppercase tracking-widest">Tổng Tài Khoản</p>
              <h2 class="text-3xl font-black text-stone-800 dark:text-white mt-1">{{ totalUsers }}</h2>
            </div>
          </div>
        </UCard>
        
        <!-- Tổng Admin -->
        <UCard class="bg-white/60 dark:bg-stone-900/60 backdrop-blur-2xl border border-white/50 dark:border-stone-800 rounded-[2rem] shadow-xl shadow-black/5" :ui="{ body: { padding: 'p-6' } }">
          <div class="flex items-center gap-4">
            <div class="p-4 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl shadow-inner">
              <UIcon name="i-heroicons-key" class="w-8 h-8" />
            </div>
            <div>
              <p class="text-stone-500 dark:text-stone-400 text-sm font-bold uppercase tracking-widest">Ban Quản Trị</p>
              <h2 class="text-3xl font-black text-stone-800 dark:text-white mt-1">{{ totalAdmins }}</h2>
            </div>
          </div>
        </UCard>
        
        <!-- Giáo Lý Viên -->
        <UCard class="bg-white/60 dark:bg-stone-900/60 backdrop-blur-2xl border border-white/50 dark:border-stone-800 rounded-[2rem] shadow-xl shadow-black/5" :ui="{ body: { padding: 'p-6' } }">
          <div class="flex items-center gap-4">
            <div class="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl shadow-inner">
              <UIcon name="i-heroicons-academic-cap" class="w-8 h-8" />
            </div>
            <div>
              <p class="text-stone-500 dark:text-stone-400 text-sm font-bold uppercase tracking-widest">Giáo Lý Viên</p>
              <h2 class="text-3xl font-black text-stone-800 dark:text-white mt-1">{{ totalTeachers }}</h2>
            </div>
          </div>
        </UCard>
      </div>

      <!-- ═══════════════════════════════════════════════════════
           PREMIUM GLASS TABLE
      ═══════════════════════════════════════════════════════ -->
      <UCard 
        class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-3xl shadow-2xl shadow-black/5 dark:shadow-black/40 border border-white/50 dark:border-stone-800 rounded-[2.5rem] overflow-hidden animate-fade-in-up delay-200"
        :ui="{ body: { padding: 'p-0', base: 'overflow-x-auto' } }"
      >
        <UTable
          :rows="users"
          :columns="columns"
          :loading="pending"
          :empty-state="{ icon: 'i-heroicons-users', header: 'Chưa có dữ liệu tài khoản' }"
          :ui="{ 
            th: { base: 'bg-stone-100/50 dark:bg-stone-900/50 font-black uppercase tracking-widest text-[10px] text-stone-500 py-5 border-b border-white/40 dark:border-stone-800/50' },
            td: { base: 'whitespace-nowrap border-b border-stone-200/20 dark:border-stone-800/20 py-4' },
            tr: { base: 'hover:bg-white/50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer group' }
          }"
        >
          <!-- Cột User Info: Avatar + Indicator + Name -->
          <template #userInfo-cell="{ row }">
            <div class="flex items-center gap-4 pl-2">
              <div class="relative">
                <UAvatar
                  :alt="row.original.fullName || 'User'"
                  :ui="{ background: 'bg-primary-100 dark:bg-primary-900', text: 'text-primary-600 dark:text-primary-300 font-bold' }"
                  size="md"
                  class="shadow-sm border-2 border-white dark:border-stone-800"
                />
                <!-- Active Indicator Pip -->
                <span class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-stone-800 rounded-full shadow-sm"></span>
              </div>
              <div class="block py-1">
                <p class="font-black text-stone-800 dark:text-white text-base leading-none mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {{ row.original.fullName }}
                </p>
                <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  <span v-if="row.original.holyName">{{ row.original.holyName }}</span>
                  <span v-if="row.original.holyName">•</span>
                  <span class="text-stone-500">@{{ row.original.username }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- Cột Role (Vai Trò) -->
          <template #role-cell="{ row }">
            <UBadge
              :color="getRoleColor(row.original.role)"
              variant="subtle"
              size="sm"
              class="font-black uppercase tracking-widest px-3 rounded-xl shadow-inner"
            >
              {{ getRoleLabel(row.original.roleId, row.original.role) }}
            </UBadge>
          </template>

          <!-- Cột Branch (Ngành Phụ Trách) -->
          <template #branch-cell="{ row }">
            <UBadge
              :color="getBranchColor(row.original.branch)"
              variant="soft"
              size="sm"
              class="font-black uppercase tracking-widest px-3 rounded-xl"
            >
              {{ getBranchName(row.original.branch) }}
            </UBadge>
          </template>

          <!-- Cột Created At -->
          <template #createdAt-cell="{ row }">
            <span class="text-sm font-semibold text-stone-500 dark:text-stone-400">
              {{ formatDate(row.original.createdAt) }}
            </span>
          </template>

          <!-- Cột Actions Menu (3 chấm) -->
          <template #actions-cell="{ row }">
            <div class="flex justify-end pr-2">
              <UDropdown :items="getActionItems(row.original)" :popper="{ placement: 'bottom-end' }">
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-heroicons-ellipsis-horizontal"
                  size="md"
                  class="rounded-xl opacity-50 group-hover:opacity-100 transition-opacity bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700"
                />
              </UDropdown>
            </div>
          </template>
        </UTable>
        
        <!-- Footer / Pagination Area -->
        <div class="flex justify-between items-center px-6 py-4 border-t border-white/30 dark:border-stone-800/50 bg-stone-100/30 dark:bg-stone-900/30 backdrop-blur-md">
          <span class="text-sm font-bold text-stone-500">
            Hiển thị <b class="text-primary-600 dark:text-primary-400 text-lg mx-1">{{ users.length }}</b> tài khoản
          </span>
        </div>
      </UCard>
    </UContainer>

    <!-- ═══════════════════════════════════════════════════════
         CREATE / EDIT USER MODAL
    ═══════════════════════════════════════════════════════ -->
    <UModal
      v-model:open="isModalOpen"
      :ui="{ base: 'rounded-[2rem] overflow-hidden' }"
    >
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' }, footer: { padding: 'p-6 bg-stone-50 dark:bg-stone-900' } }">
        <!-- Modal Header -->
        <template #header>
          <div class="bg-primary-600 dark:bg-primary-900 p-6 flex justify-between items-center text-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <UIcon :name="isEditing ? 'i-heroicons-pencil-square' : 'i-heroicons-user-plus'" class="w-6 h-6 text-white" />
              </div>
              <h3 class="text-xl font-black uppercase tracking-wide">
                {{ isEditing ? 'Cập Nhật Tài Khoản' : 'Thêm Tài Khoản Mới' }}
              </h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="white" variant="ghost" class="hover:bg-white/10 rounded-full" @click="isModalOpen = false" />
          </div>
        </template>

        <!-- Modal Body -->
        <form id="user-form" class="p-6 grid grid-cols-1 md:grid-cols-2 gap-8" @submit.prevent="handleSubmit">
          
          <!-- Cột 1: Thông tin hệ thống -->
          <div class="space-y-5">
            <div class="flex items-center gap-2 mb-2 border-b border-stone-200 dark:border-stone-800 pb-2">
              <UIcon name="i-heroicons-server-stack" class="w-5 h-5 text-stone-400" />
              <h4 class="font-bold text-stone-800 dark:text-stone-200 uppercase tracking-widest text-xs">Hệ Thống</h4>
            </div>
            
            <UFormField label="Tên đăng nhập" required>
              <UInput
                v-model="userForm.username"
                icon="i-heroicons-at-symbol"
                placeholder="nguyenvana"
                :disabled="isEditing"
                size="lg"
                class="w-full"
                :ui="{ base: 'rounded-xl' }"
              />
            </UFormField>
            
            <UFormField
              :label="isEditing ? 'Mật khẩu mới (Để trống nếu giữ nguyên)' : 'Mật khẩu'"
              :required="!isEditing"
            >
              <UInput
                v-model="userForm.password"
                type="password"
                icon="i-heroicons-key"
                placeholder="••••••••"
                size="lg"
                class="w-full"
                :ui="{ base: 'rounded-xl' }"
              />
            </UFormField>
            
            <UFormField label="Quyền hạn / Chức vụ">
              <USelectMenu
                v-model="userForm.roleId"
                :options="roleOptions"
                value-attribute="value"
                option-attribute="label"
                icon="i-heroicons-shield-check"
                placeholder="Chọn quyền..."
                size="lg"
                class="w-full"
                :ui="{ base: 'rounded-xl' }"
              />
            </UFormField>
          </div>

          <!-- Cột 2: Thông tin cá nhân -->
          <div class="space-y-5">
            <div class="flex items-center gap-2 mb-2 border-b border-stone-200 dark:border-stone-800 pb-2">
              <UIcon name="i-heroicons-identification" class="w-5 h-5 text-stone-400" />
              <h4 class="font-bold text-stone-800 dark:text-stone-200 uppercase tracking-widest text-xs">Cá Nhân</h4>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <UFormField label="Tên Thánh" class="col-span-1">
                <UInput
                  v-model="userForm.holyName"
                  placeholder="Giuse..."
                  size="lg"
                  class="w-full"
                  :ui="{ base: 'rounded-xl' }"
                />
              </UFormField>
              <UFormField label="Họ và tên" required class="col-span-2">
                <UInput
                  v-model="userForm.fullName"
                  placeholder="Nguyễn Văn A"
                  size="lg"
                  class="w-full"
                  :ui="{ base: 'rounded-xl' }"
                />
              </UFormField>
            </div>

            <UFormField label="Ngành Phụ Trách">
              <USelectMenu
                v-model="userForm.branch"
                :options="branchOptions"
                value-attribute="value"
                option-attribute="label"
                icon="i-heroicons-flag"
                placeholder="Chọn ngành..."
                size="lg"
                class="w-full"
                :ui="{ base: 'rounded-xl' }"
              />
            </UFormField>
          </div>
        </form>

        <!-- Modal Footer -->
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton
              label="Hủy bỏ"
              color="neutral"
              variant="soft"
              size="lg"
              class="rounded-xl font-bold"
              @click="isModalOpen = false"
            />
            <UButton
              type="submit"
              form="user-form"
              :label="isEditing ? 'Lưu Cập Nhật' : 'Hoàn Tất Tạo'"
              color="primary"
              variant="solid"
              size="lg"
              class="rounded-xl font-black uppercase tracking-wider"
              :loading="isSubmitting"
            />
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Quản Lý Tài Khoản - GiaoLy' })

const authStore = useAuthStore()
const toast = useToast()

// Redirection safeguard if not Admin or doesn't have users.view permission
onMounted(() => {
  if (!authStore.hasPermission('users.view')) {
    toast.add({ title: 'Từ chối truy cập', description: 'Bạn không có quyền quản lý tài khoản.', color: 'error' })
    navigateTo('/admin/dashboard')
  }
})

// Columns for DataGrid
const columns = [
  { accessorKey: 'userInfo', header: 'Người Dùng' },
  { accessorKey: 'role', header: 'Vai Trò / Quyền' },
  { accessorKey: 'branch', header: 'Ngành Phụ Trách' },
  { accessorKey: 'createdAt', header: 'Ngày Tạo' },
  { accessorKey: 'actions', header: '' }
]

// Modal & Forms
const isModalOpen = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const currentUserId = ref(null)

const userForm = reactive({
  username: '',
  fullName: '',
  holyName: '',
  role: 'Viewer',
  roleId: null,
  branch: '0',
  password: ''
})

const roleOptions = ref([])

const fetchRoles = async () => {
  try {
    const data = await $api('/roles')
    roleOptions.value = data.map(r => ({ value: r.id, label: r.name, code: r.code }))
  } catch (e) {
    console.error('Error fetching roles', e)
  }
}

onMounted(() => {
  fetchRoles()
})

const branchOptions = [
  { value: '0', label: 'Tất cả (Chung)' },
  { value: '1', label: 'Ấu Nhi' },
  { value: '2', label: 'Thiếu Nhi' },
  { value: '3', label: 'Nghĩa Sĩ' },
  { value: '4', label: 'Hiệp Sĩ' }
]

// Fetch Users Data
const { data: users, pending, refresh } = await useApiFetch('/User', {
  default: () => []
})

// Quick Stats Computed properties
const totalUsers = computed(() => users.value.length || 0)
const totalAdmins = computed(() => users.value.filter(u => getRoleLabel(u.roleId, u.role).toLowerCase().includes('admin') || String(u.role) === '1').length || 0)
const totalTeachers = computed(() => users.value.filter(u => !getRoleLabel(u.roleId, u.role).toLowerCase().includes('admin') && String(u.role) !== '1').length || 0)

// Helpers
const getRoleLabel = (roleId, roleCode) => {
  const roleOpt = roleOptions.value.find(r => r.value === roleId || r.code === roleCode)
  if (roleOpt) return roleOpt.label

  const labels = {
    1: 'Admin',
    2: 'Thư ký',
    3: 'Mod',
    Viewer: 'Giáo Lý Viên'
  }
  return labels[roleCode] || roleCode
}

const getRoleColor = (role) => {
  const colors = {
    1: 'error',
    2: 'primary',
    3: 'warning',
    Viewer: 'neutral'
  }
  return colors[role] || 'neutral'
}

const getBranchName = (b) => {
  const names = { 0: 'Chi Đoàn Chung', 1: 'Ấu Nhi', 2: 'Thiếu Nhi', 3: 'Nghĩa Sĩ', 4: 'Hiệp Sĩ' }
  return names[b] || 'Chi Đoàn Chung'
}

// TNTT official colors mapping
const getBranchColor = (b) => {
  const colors = { 0: 'neutral', 1: 'green', 2: 'blue', 3: 'yellow', 4: 'error' } // error is red
  return colors[b] || 'neutral'
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// Action Menus for UDropdown
const getActionItems = (row) => [
  [
    {
      label: 'Chỉnh sửa tài khoản',
      icon: 'i-heroicons-pencil-square',
      click: () => openEditModal(row)
    }
  ],
  ...(row.username !== 'admin' ? [[
    {
      label: 'Xóa tài khoản',
      icon: 'i-heroicons-trash',
      color: 'red',
      click: () => deleteUser(row.id)
    }
  ]] : [])
]

const openCreateModal = () => {
  isEditing.value = false
  currentUserId.value = null
  Object.assign(userForm, {
    username: '',
    fullName: '',
    holyName: '',
    role: 'Viewer',
    roleId: null,
    branch: '0',
    password: ''
  })
  isModalOpen.value = true
}

const openEditModal = (user) => {
  isEditing.value = true
  currentUserId.value = user.id
  Object.assign(userForm, {
    username: user.username,
    fullName: user.fullName,
    holyName: user.holyName || '',
    role: user.role,
    roleId: user.roleId || user.role, // Tương thích ngược nếu roleId null thì lấy role cũ tạm
    branch: String(user.branch || 0),
    password: ''
  })
  isModalOpen.value = true
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const payload = {
      fullName: userForm.fullName,
      holyName: userForm.holyName,
      role: 'Viewer', // Backend sẽ tự resolve bằng RoleId
      roleId: userForm.roleId,
      branch: parseInt(userForm.branch),
      password: userForm.password || undefined
    }

    if (isEditing.value) {
      await $api(`/User/${currentUserId.value}`, {
        method: 'PUT',
        body: payload
      })
      toast.add({ title: 'Cập nhật thành công!', color: 'success' })
    } else {
      await $api('/User', {
        method: 'POST',
        body: {
          username: userForm.username,
          fullName: userForm.fullName,
          holyName: userForm.holyName,
          role: 'Viewer',
          roleId: userForm.roleId,
          branch: parseInt(userForm.branch),
          password: userForm.password
        }
      })
      toast.add({ title: 'Tạo tài khoản thành công!', color: 'success' })
    }
    isModalOpen.value = false
    await refresh()
  } catch (error) {
    toast.add({ title: 'Lỗi xử lý', description: error.data?.message || 'Vui lòng kiểm tra lại.', color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

const deleteUser = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn xóa tài khoản này? Hành động không thể hoàn tác!')) return
  try {
    await $api(`/User/${id}`, { method: 'DELETE' })
    toast.add({ title: 'Đã xóa tài khoản', color: 'success' })
    await refresh()
  } catch (error) {
    toast.add({ title: 'Lỗi khi xóa', description: error.data?.message, color: 'error' })
  }
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
