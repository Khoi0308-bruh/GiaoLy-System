<script setup lang="ts">
import { PERMISSIONS } from '~/shared/permissions'
import type { ApiError } from '~/composables/useApi'

definePageMeta({ layout: 'admin', permission: PERMISSIONS.Users.View })

interface UserItem {
  id: string
  username: string
  fullName: string
  christianName?: string | null
  email?: string | null
  phoneNumber?: string | null
  dateOfBirth?: string | null
  address?: string | null
  bio?: string | null
  avatarPath?: string | null
  roleId: string
  roleCode: string
  roleName: string
  scopeType: string
  branchId?: number | null
  isActive: boolean
  mustChangePassword: boolean
  lastLoginAt?: string | null
  createdAt: string
}

interface RoleOption {
  id: string
  code: string
  name: string
  scopeType: string
}

interface BranchItem {
  id: number
  name: string
}

const api = useApi()
const toast = useToast()
const { can } = usePermissions()

const users = ref<UserItem[]>([])
const roles = ref<RoleOption[]>([])
const branches = ref<BranchItem[]>([])
const loading = ref(true)
const error = ref<ApiError | null>(null)

// Bộ lọc
const filterRole = ref<string>('ALL')
const filterBranch = ref<string>('ALL')
const filterStatus = ref<string>('ALL')
const searchQuery = ref<string>('')

// Modal Tạo mới
const createOpen = ref(false)
const creating = ref(false)
const createForm = ref({
  username: '',
  fullName: '',
  christianName: '',
  email: '',
  phoneNumber: '',
  dateOfBirth: '',
  address: '',
  roleId: '',
  branchId: null as number | null
})

// Modal Sửa
const editOpen = ref(false)
const editing = ref(false)
const currentUser = ref<UserItem | null>(null)
const editForm = ref({
  fullName: '',
  christianName: '',
  email: '',
  phoneNumber: '',
  dateOfBirth: '',
  address: '',
  bio: ''
})

// Modal Gán vai trò
const assignRoleOpen = ref(false)
const assigningRole = ref(false)
const assignRoleForm = ref({
  roleId: '',
  branchId: null as number | null
})

// Modal Đặt lại mật khẩu & hiển thị mật khẩu tạm
const resetResultOpen = ref(false)
const tempPassword = ref('')
const resettingId = ref<string | null>(null)

async function loadData() {
  loading.value = true
  error.value = null
  try {
    const params: Record<string, string> = { pageSize: '200' }
    if (filterRole.value !== 'ALL') params.role = filterRole.value
    if (filterBranch.value !== 'ALL') params.branchId = filterBranch.value
    if (filterStatus.value !== 'ALL') params.isActive = filterStatus.value === 'Active' ? 'true' : 'false'
    if (searchQuery.value.trim()) params.search = searchQuery.value.trim()

    const [resUsers, resRoles, resBranches] = await Promise.all([
      api.get<any>('/users', params),
      api.get<RoleOption[]>('/roles').catch(() => []),
      api.get<BranchItem[]>('/branches').catch(() => [])
    ])
    users.value = resUsers?.items || resUsers || []
    roles.value = resRoles || []
    branches.value = resBranches || []
  } catch (e) {
    error.value = e as ApiError
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

// ── Tạo người dùng mới ──────────────────────────────────
function openCreateModal() {
  createForm.value = {
    username: '',
    fullName: '',
    christianName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: '',
    roleId: roles.value[0]?.id || '',
    branchId: null
  }
  createOpen.value = true
}

async function handleCreateUser() {
  if (!createForm.value.username.trim() || !createForm.value.fullName.trim() || !createForm.value.roleId) {
    toast.add({ title: 'Vui lòng nhập Tên đăng nhập, Họ tên và chọn Vai trò', color: 'error' })
    return
  }
  creating.value = true
  try {
    await api.post('/users', {
      username: createForm.value.username.trim(),
      fullName: createForm.value.fullName.trim(),
      christianName: createForm.value.christianName?.trim() || null,
      email: createForm.value.email?.trim() || null,
      phoneNumber: createForm.value.phoneNumber?.trim() || null,
      dateOfBirth: createForm.value.dateOfBirth || null,
      address: createForm.value.address?.trim() || null,
      roleId: createForm.value.roleId,
      branchId: createForm.value.branchId || null
    })
    toast.add({ title: 'Tạo tài khoản người dùng thành công', color: 'success' })
    createOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể tạo tài khoản', description: err.detail || err.message, color: 'error' })
  } finally {
    creating.value = false
  }
}

// ── Sửa thông tin người dùng ────────────────────────────
async function openEditModal(u: UserItem) {
  try {
    const full = await api.get<UserItem>(`/users/${u.id}`)
    currentUser.value = full
    editForm.value = {
      fullName: full.fullName,
      christianName: full.christianName || '',
      email: full.email || '',
      phoneNumber: full.phoneNumber || '',
      dateOfBirth: full.dateOfBirth || '',
      address: full.address || '',
      bio: full.bio || ''
    }
    editOpen.value = true
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể tải thông tin', description: err.detail || err.message, color: 'error' })
  }
}

async function handleUpdateUser() {
  if (!currentUser.value || !editForm.value.fullName.trim()) return
  editing.value = true
  try {
    await api.put(`/users/${currentUser.value.id}`, {
      fullName: editForm.value.fullName.trim(),
      christianName: editForm.value.christianName?.trim() || null,
      email: editForm.value.email?.trim() || null,
      phoneNumber: editForm.value.phoneNumber?.trim() || null,
      dateOfBirth: editForm.value.dateOfBirth || null,
      address: editForm.value.address?.trim() || null,
      bio: editForm.value.bio?.trim() || null
    })
    toast.add({ title: 'Cập nhật thông tin thành công', color: 'success' })
    editOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể cập nhật người dùng', description: err.detail || err.message, color: 'error' })
  } finally {
    editing.value = false
  }
}

// ── Gán vai trò ─────────────────────────────────────────
function openAssignRoleModal(u: UserItem) {
  currentUser.value = u
  assignRoleForm.value = {
    roleId: u.roleId,
    branchId: u.branchId ?? null
  }
  assignRoleOpen.value = true
}

async function handleAssignRole() {
  if (!currentUser.value || !assignRoleForm.value.roleId) return
  assigningRole.value = true
  try {
    await api.put(`/users/${currentUser.value.id}/role`, {
      roleId: assignRoleForm.value.roleId,
      branchId: assignRoleForm.value.branchId || null
    })
    toast.add({ title: 'Gán vai trò thành công', color: 'success' })
    assignRoleOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể gán vai trò', description: err.detail || err.message, color: 'error' })
  } finally {
    assigningRole.value = false
  }
}

// ── Đặt lại mật khẩu ────────────────────────────────────
async function handleResetPassword(u: UserItem) {
  resettingId.value = u.id
  try {
    const res = await api.post<{ temporaryPassword: string }>(`/users/${u.id}/reset-password`)
    tempPassword.value = res?.temporaryPassword || 'GiaoLy@2026'
    currentUser.value = u
    resetResultOpen.value = true
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể đặt lại mật khẩu', description: err.detail || err.message, color: 'error' })
  } finally {
    resettingId.value = null
  }
}

// ── Vô hiệu hóa / Kích hoạt ────────────────────────────
async function toggleUserStatus(u: UserItem) {
  try {
    if (u.isActive) {
      await api.post(`/users/${u.id}/deactivate`)
      toast.add({ title: `Đã vô hiệu hóa tài khoản @${u.username}`, color: 'success' })
    } else {
      await api.post(`/users/${u.id}/activate`)
      toast.add({ title: `Đã kích hoạt lại tài khoản @${u.username}`, color: 'success' })
    }
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể thay đổi trạng thái', description: err.detail || err.message, color: 'error' })
  }
}

const stats = computed(() => {
  const total = users.value.length
  const active = users.value.filter(u => u.isActive).length
  const deactivated = total - active
  const mustChange = users.value.filter(u => u.mustChangePassword).length
  return { total, active, deactivated, mustChange }
})
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Quản trị Người dùng & Tài khoản"
      subtitle="Quản lý danh sách giáo lý viên, ban huynh trưởng, phân quyền và trạng thái đăng nhập"
    >
      <template #actions>
        <UButton
          v-if="can(PERMISSIONS.Users.Create)"
          color="primary"
          icon="i-lucide-user-plus"
          @click="openCreateModal"
        >
          Tạo tài khoản mới
        </UButton>
      </template>
    </PageHeader>

    <ErrorState v-if="error" :error="error" @retry="loadData" />

    <!-- Thống kê nhanh -->
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard
        label="Tổng người dùng"
        :value="stats.total"
        icon="i-lucide-users"
      />
      <StatCard
        label="Đang hoạt động"
        :value="stats.active"
        icon="i-lucide-user-check"
        class="text-emerald-600"
      />
      <StatCard
        label="Bị vô hiệu hóa"
        :value="stats.deactivated"
        icon="i-lucide-user-x"
        :class="stats.deactivated > 0 ? 'text-red-500' : ''"
      />
      <StatCard
        label="Chờ đổi MK lần đầu"
        :value="stats.mustChange"
        icon="i-lucide-key-round"
        class="text-amber-600"
      />
    </div>

    <!-- Bộ lọc & Tìm kiếm -->
    <div class="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-stone-800 dark:bg-stone-900">
      <div class="flex flex-wrap items-center gap-3">
        <!-- Vai trò -->
        <div class="flex items-center gap-2">
          <label class="text-xs font-semibold uppercase text-stone-500">Vai trò:</label>
          <select
            v-model="filterRole"
            class="h-9 rounded-lg border border-stone-200 bg-stone-50 px-2.5 text-xs font-medium dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
            @change="loadData"
          >
            <option value="ALL">Tất cả vai trò</option>
            <option v-for="r in roles" :key="r.id" :value="r.code">
              {{ r.name }}
            </option>
          </select>
        </div>

        <!-- Trạng thái -->
        <div class="flex items-center gap-2">
          <label class="text-xs font-semibold uppercase text-stone-500">Trạng thái:</label>
          <select
            v-model="filterStatus"
            class="h-9 rounded-lg border border-stone-200 bg-stone-50 px-2.5 text-xs font-medium dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
            @change="loadData"
          >
            <option value="ALL">Tất cả</option>
            <option value="Active">Đang hoạt động</option>
            <option value="Inactive">Bị vô hiệu hóa</option>
          </select>
        </div>
      </div>

      <div class="w-full sm:w-64">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Tìm username, tên, email..."
          size="sm"
          @keyup.enter="loadData"
        />
      </div>
    </div>

    <!-- Bảng danh sách người dùng -->
    <div class="rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-stone-50 text-xs font-semibold uppercase text-stone-600 dark:bg-stone-800/70 dark:text-stone-300">
            <tr>
              <th class="p-4">Người dùng</th>
              <th class="p-4">Liên hệ</th>
              <th class="p-4">Vai trò & Phạm vi</th>
              <th class="p-4 text-center">Trạng thái</th>
              <th class="p-4">Đăng nhập cuối</th>
              <th class="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
            <tr v-if="loading">
              <td colspan="6" class="p-8 text-center text-sm text-stone-400 animate-pulse">
                Đang tải danh sách người dùng...
              </td>
            </tr>
            <tr v-else-if="users.length === 0">
              <td colspan="6" class="p-8 text-center text-sm text-stone-500">
                Không tìm thấy tài khoản người dùng nào.
              </td>
            </tr>
            <tr
              v-for="u in users"
              :key="u.id"
              class="hover:bg-stone-50/70 dark:hover:bg-stone-800/40"
              :class="!u.isActive ? 'opacity-60 bg-stone-50/40' : ''"
            >
              <td class="p-4">
                <div class="flex items-center gap-3">
                  <div class="flex h-9 w-9 items-center justify-center rounded-full bg-marian-100 text-marian-800 font-bold dark:bg-marian-900/50 dark:text-marian-200">
                    {{ u.fullName.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-bold text-stone-900 dark:text-stone-100">
                      {{ u.christianName ? `${u.christianName} ` : '' }}{{ u.fullName }}
                    </p>
                    <p class="font-mono text-xs text-stone-400">@{{ u.username }}</p>
                  </div>
                </div>
              </td>
              <td class="p-4 text-xs text-stone-500">
                <p v-if="u.email">{{ u.email }}</p>
                <p v-if="u.phoneNumber">{{ u.phoneNumber }}</p>
                <p v-if="!u.email && !u.phoneNumber" class="text-stone-400">—</p>
              </td>
              <td class="p-4">
                <span class="inline-block rounded-md bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                  {{ u.roleName }}
                </span>
                <span v-if="u.scopeType" class="ml-1 text-[10px] text-stone-400">
                  ({{ u.scopeType }})
                </span>
              </td>
              <td class="p-4 text-center">
                <div class="inline-flex flex-col items-center gap-0.5">
                  <span
                    class="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    :class="u.isActive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'"
                  >
                    {{ u.isActive ? 'Hoạt động' : 'Vô hiệu hóa' }}
                  </span>
                  <span v-if="u.mustChangePassword" class="text-[10px] text-amber-600 font-medium">
                    (Cần đổi MK)
                  </span>
                </div>
              </td>
              <td class="p-4 text-xs text-stone-500 whitespace-nowrap">
                {{ u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('vi-VN') : 'Chưa đăng nhập' }}
              </td>
              <td class="p-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-1">
                  <!-- Gán vai trò (users.assign-role) -->
                  <UButton
                    v-if="can(PERMISSIONS.Users.AssignRole)"
                    size="xs"
                    variant="ghost"
                    color="neutral"
                    icon="i-lucide-shield"
                    title="Gán vai trò & phạm vi"
                    @click="openAssignRoleModal(u)"
                  />

                  <!-- Sửa thông tin (users.update) -->
                  <UButton
                    v-if="can(PERMISSIONS.Users.Update)"
                    size="xs"
                    variant="ghost"
                    color="neutral"
                    icon="i-lucide-pencil"
                    title="Chỉnh sửa thông tin"
                    @click="openEditModal(u)"
                  />

                  <!-- Đặt lại mật khẩu (users.reset-password) -->
                  <UButton
                    v-if="can(PERMISSIONS.Users.ResetPassword)"
                    size="xs"
                    variant="ghost"
                    color="warning"
                    icon="i-lucide-key-round"
                    title="Đặt lại mật khẩu"
                    @click="handleResetPassword(u)"
                  />

                  <!-- Vô hiệu hóa / Kích hoạt (users.delete) -->
                  <UButton
                    v-if="can(PERMISSIONS.Users.Delete)"
                    size="xs"
                    variant="ghost"
                    :color="u.isActive ? 'error' : 'success'"
                    :icon="u.isActive ? 'i-lucide-lock' : 'i-lucide-unlock'"
                    :title="u.isActive ? 'Vô hiệu hóa' : 'Kích hoạt lại'"
                    @click="toggleUserStatus(u)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Tạo Tài Khoản Mới -->
    <UModal v-model:open="createOpen" title="Tạo tài khoản người dùng mới">
      <template #body>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Tên đăng nhập (Username) <span class="text-red-500">*</span>
              </label>
              <UInput v-model="createForm.username" placeholder="glv.nguyenvana..." />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Vai trò <span class="text-red-500">*</span>
              </label>
              <select
                v-model="createForm.roleId"
                class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              >
                <option v-for="r in roles" :key="r.id" :value="r.id">
                  {{ r.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Tên thánh
              </label>
              <UInput v-model="createForm.christianName" placeholder="Giuse, Têrêsa..." />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Họ và tên <span class="text-red-500">*</span>
              </label>
              <UInput v-model="createForm.fullName" placeholder="Nguyễn Văn A..." />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Email
              </label>
              <UInput v-model="createForm.email" type="email" placeholder="example@email.com" />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Số điện thoại
              </label>
              <UInput v-model="createForm.phoneNumber" placeholder="0901234567..." />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Ngành phụ trách (Nếu vai trò phân theo ngành)
            </label>
            <select
              v-model="createForm.branchId"
              class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            >
              <option :value="null">-- Không cố định ngành --</option>
              <option v-for="b in branches" :key="b.id" :value="b.id">
                {{ b.name }}
              </option>
            </select>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="createOpen = false">Hủy</UButton>
          <UButton
            color="primary"
            :loading="creating"
            :disabled="!createForm.username.trim() || !createForm.fullName.trim() || !createForm.roleId"
            @click="handleCreateUser"
          >
            Tạo tài khoản
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Sửa Thông Tin Người Dùng -->
    <UModal v-model:open="editOpen" title="Chỉnh sửa thông tin cá nhân người dùng">
      <template #body>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Tên thánh
              </label>
              <UInput v-model="editForm.christianName" />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Họ và tên <span class="text-red-500">*</span>
              </label>
              <UInput v-model="editForm.fullName" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Email
              </label>
              <UInput v-model="editForm.email" type="email" />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Số điện thoại
              </label>
              <UInput v-model="editForm.phoneNumber" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Địa chỉ
            </label>
            <UInput v-model="editForm.address" />
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Tiểu sử / Ghi chú
            </label>
            <UTextarea v-model="editForm.bio" :rows="2" />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="editOpen = false">Hủy</UButton>
          <UButton color="primary" :loading="editing" @click="handleUpdateUser">Lưu thay đổi</UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Gán Vai Trò & Phạm Vi -->
    <UModal
      v-model:open="assignRoleOpen"
      :title="`Gán vai trò cho @${currentUser?.username}`"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Vai trò (Role) <span class="text-red-500">*</span>
            </label>
            <select
              v-model="assignRoleForm.roleId"
              class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            >
              <option v-for="r in roles" :key="r.id" :value="r.id">
                {{ r.name }} ({{ r.scopeType }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Phạm vi ngành (Áp dụng nếu vai trò thuộc ngành)
            </label>
            <select
              v-model="assignRoleForm.branchId"
              class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            >
              <option :value="null">-- Toàn xứ / Không giới hạn ngành --</option>
              <option v-for="b in branches" :key="b.id" :value="b.id">
                {{ b.name }}
              </option>
            </select>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="assignRoleOpen = false">Hủy</UButton>
          <UButton color="primary" :loading="assigningRole" @click="handleAssignRole">
            Lưu vai trò
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Hiển thị Mật khẩu Tạm thời -->
    <UModal v-model:open="resetResultOpen" title="Đặt lại mật khẩu thành công">
      <template #body>
        <div class="space-y-3 text-center py-2">
          <UIcon name="i-lucide-check-circle-2" class="h-10 w-10 text-emerald-600 mx-auto" />
          <p class="text-sm text-stone-600 dark:text-stone-300">
            Mật khẩu tạm thời cho tài khoản <strong>@{{ currentUser?.username }}</strong>:
          </p>
          <div class="rounded-xl border border-dashed border-vatican-400 bg-vatican-50/50 p-3 font-mono text-lg font-bold text-stone-900 select-all dark:bg-stone-800 dark:text-white">
            {{ tempPassword }}
          </div>
          <p class="text-xs text-stone-500">
            Hãy giao mật khẩu này cho người dùng. Họ sẽ được yêu cầu đổi mật khẩu ngay lần đăng nhập đầu tiên.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <UButton color="primary" @click="resetResultOpen = false">Đã sao chép & Đóng</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
