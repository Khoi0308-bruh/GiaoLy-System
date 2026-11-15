<script setup lang="ts">
import { PERMISSIONS } from '~/shared/permissions'
import type { ApiError } from '~/composables/useApi'

definePageMeta({ layout: 'admin', permission: PERMISSIONS.Roles.View })

interface RoleItem {
  id: string
  code: string
  name: string
  description?: string | null
  isSystem: boolean
  scopeType: 'Global' | 'Branch' | 'Class' | 'Guardian' | string
  createdAt: string
  permissions: string[]
}

interface PermissionItem {
  id: string
  code: string
  name: string
  module: string
  description?: string | null
}

const api = useApi()
const toast = useToast()
const { can } = usePermissions()

const roles = ref<RoleItem[]>([])
const allPermissions = ref<PermissionItem[]>([])
const loading = ref(true)
const error = ref<ApiError | null>(null)

// Modal Tạo / Sửa
const formOpen = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const currentId = ref<string | null>(null)
const form = ref({
  code: '',
  name: '',
  description: '',
  scopeType: 'Global'
})

// Modal Phân quyền
const permOpen = ref(false)
const savingPerms = ref(false)
const selectedRole = ref<RoleItem | null>(null)
const checkedPerms = ref<string[]>([])

// Modal Xóa
const deleteOpen = ref(false)
const deleting = ref(false)

async function loadData() {
  loading.value = true
  error.value = null
  try {
    const [resRoles, resPerms] = await Promise.all([
      api.get<RoleItem[]>('/roles'),
      api.get<PermissionItem[]>('/permissions').catch(() => [])
    ])
    roles.value = resRoles || []
    allPermissions.value = resPerms || []
  } catch (e) {
    error.value = e as ApiError
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

// Nhóm permissions theo Module
const groupedPermissions = computed(() => {
  const groups: Record<string, PermissionItem[]> = {}
  allPermissions.value.forEach(p => {
    const mod = p.module || 'Hệ thống'
    if (!groups[mod]) groups[mod] = []
    groups[mod].push(p)
  })
  return groups
})

// ── Tạo / Sửa Vai trò ──────────────────────────────────
function openCreateModal() {
  isEditing.value = false
  currentId.value = null
  form.value = {
    code: '',
    name: '',
    description: '',
    scopeType: 'Global'
  }
  formOpen.value = true
}

function openEditModal(r: RoleItem) {
  isEditing.value = true
  currentId.value = r.id
  form.value = {
    code: r.code,
    name: r.name,
    description: r.description || '',
    scopeType: r.scopeType
  }
  formOpen.value = true
}

async function handleSaveRole() {
  if (!form.value.name.trim() || (!isEditing.value && !form.value.code.trim())) {
    toast.add({ title: 'Vui lòng nhập Mã vai trò và Tên vai trò', color: 'error' })
    return
  }
  saving.value = true
  try {
    if (isEditing.value && currentId.value) {
      await api.put(`/roles/${currentId.value}`, {
        name: form.value.name.trim(),
        description: form.value.description?.trim() || null,
        scopeType: form.value.scopeType
      })
      toast.add({ title: 'Cập nhật vai trò thành công', color: 'success' })
    } else {
      await api.post('/roles', {
        code: form.value.code.trim().toUpperCase(),
        name: form.value.name.trim(),
        description: form.value.description?.trim() || null,
        scopeType: form.value.scopeType,
        permissions: []
      })
      toast.add({ title: 'Tạo vai trò mới thành công', color: 'success' })
    }
    formOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể lưu vai trò', description: err.detail || err.message, color: 'error' })
  } finally {
    saving.value = false
  }
}

// ── Xóa Vai trò ─────────────────────────────────────────
function openDeleteModal(r: RoleItem) {
  selectedRole.value = r
  deleteOpen.value = true
}

async function handleDeleteRole() {
  if (!selectedRole.value) return
  deleting.value = true
  try {
    await api.delete(`/roles/${selectedRole.value.id}`)
    toast.add({ title: 'Đã xóa vai trò', color: 'success' })
    deleteOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể xóa vai trò', description: err.detail || err.message, color: 'error' })
  } finally {
    deleting.value = false
  }
}

// ── Phân quyền (Assign Permissions) ─────────────────────
function openPermModal(r: RoleItem) {
  selectedRole.value = r
  checkedPerms.value = [...(r.permissions || [])]
  permOpen.value = true
}

function toggleModulePerms(modPermissions: PermissionItem[]) {
  const modCodes = modPermissions.map(p => p.code)
  const allChecked = modCodes.every(c => checkedPerms.value.includes(c))
  if (allChecked) {
    checkedPerms.value = checkedPerms.value.filter(c => !modCodes.includes(c))
  } else {
    modCodes.forEach(c => {
      if (!checkedPerms.value.includes(c)) checkedPerms.value.push(c)
    })
  }
}

async function handleSavePermissions() {
  if (!selectedRole.value) return
  savingPerms.value = true
  try {
    await api.put(`/roles/${selectedRole.value.id}/permissions`, {
      permissions: checkedPerms.value
    })
    toast.add({ title: `Đã lưu ${checkedPerms.value.length} quyền cho vai trò ${selectedRole.value.name}`, color: 'success' })
    permOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Lỗi gán quyền', description: err.detail || err.message, color: 'error' })
  } finally {
    savingPerms.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Vai trò & Ma trận Phân quyền"
      subtitle="Thiết lập các vai trò người dùng trong đoàn xứ và cấp phát quyền hạn theo mô hình RBAC"
    >
      <template #actions>
        <UButton
          v-if="can(PERMISSIONS.Roles.Create)"
          color="primary"
          icon="i-lucide-plus"
          @click="openCreateModal"
        >
          Thêm vai trò mới
        </UButton>
      </template>
    </PageHeader>

    <ErrorState v-if="error" :error="error" @retry="loadData" />

    <!-- Danh sách vai trò -->
    <div class="rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-stone-50 text-xs font-semibold uppercase text-stone-600 dark:bg-stone-800/70 dark:text-stone-300">
            <tr>
              <th class="p-4">Tên vai trò</th>
              <th class="p-4">Mã vai trò</th>
              <th class="p-4">Phạm vi tác động (Scope)</th>
              <th class="p-4 text-center">Số quyền hạn</th>
              <th class="p-4">Mô tả nhiệm vụ</th>
              <th class="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
            <tr v-if="loading">
              <td colspan="6" class="p-8 text-center text-sm text-stone-400 animate-pulse">
                Đang tải danh sách vai trò...
              </td>
            </tr>
            <tr
              v-for="r in roles"
              :key="r.id"
              class="hover:bg-stone-50/70 dark:hover:bg-stone-800/40"
            >
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-stone-900 dark:text-stone-100">{{ r.name }}</span>
                  <span
                    v-if="r.isSystem"
                    class="rounded bg-stone-100 px-1.5 py-0.2 text-[10px] font-bold text-stone-600 dark:bg-stone-800 dark:text-stone-400"
                  >
                    Hệ thống
                  </span>
                </div>
              </td>
              <td class="p-4 font-mono text-xs font-semibold text-marian-600 dark:text-marian-400">
                {{ r.code }}
              </td>
              <td class="p-4 text-xs">
                <span class="rounded bg-stone-100 px-2 py-0.5 font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                  {{ r.scopeType }}
                </span>
              </td>
              <td class="p-4 text-center font-mono font-bold text-xs text-stone-800 dark:text-stone-200">
                {{ r.permissions ? r.permissions.length : 0 }} quyền
              </td>
              <td class="p-4 text-xs text-stone-500">
                {{ r.description || '—' }}
              </td>
              <td class="p-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-1">
                  <!-- Gán quyền (roles.assign) -->
                  <UButton
                    v-if="can(PERMISSIONS.Roles.Assign)"
                    size="xs"
                    variant="outline"
                    color="primary"
                    icon="i-lucide-shield-check"
                    @click="openPermModal(r)"
                  >
                    Phân quyền
                  </UButton>

                  <!-- Sửa vai trò (roles.update) -->
                  <UButton
                    v-if="can(PERMISSIONS.Roles.Update)"
                    size="xs"
                    variant="ghost"
                    color="neutral"
                    icon="i-lucide-pencil"
                    @click="openEditModal(r)"
                  />

                  <!-- Xóa vai trò (roles.delete) -->
                  <UButton
                    v-if="can(PERMISSIONS.Roles.Delete)"
                    size="xs"
                    variant="ghost"
                    color="error"
                    icon="i-lucide-trash-2"
                    :disabled="r.isSystem"
                    @click="openDeleteModal(r)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Phân Quyền (Permissions Matrix) -->
    <UModal
      v-model:open="permOpen"
      :title="`Thiết lập quyền cho vai trò: ${selectedRole?.name}`"
      description="Đánh dấu các quyền hạn được phép thực thi trong hệ thống"
    >
      <template #body>
        <div class="max-h-[60vh] overflow-y-auto space-y-6 pr-1">
          <div
            v-for="(modPerms, modName) in groupedPermissions"
            :key="modName"
            class="rounded-xl border border-stone-200 p-4 dark:border-stone-800 space-y-3"
          >
            <div class="flex items-center justify-between border-b border-stone-100 pb-2 dark:border-stone-800">
              <h5 class="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <UIcon name="i-lucide-folder-key" class="h-4 w-4 text-vatican-600" />
                Phân hệ: {{ modName }}
              </h5>
              <button
                type="button"
                class="text-xs text-marian-600 hover:underline dark:text-marian-400 font-medium"
                @click="toggleModulePerms(modPerms)"
              >
                Chọn / Bỏ tất cả
              </button>
            </div>

            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <label
                v-for="p in modPerms"
                :key="p.code"
                class="flex items-start gap-2 text-xs p-1.5 rounded hover:bg-stone-50 dark:hover:bg-stone-800/40 cursor-pointer"
              >
                <input
                  type="checkbox"
                  :value="p.code"
                  v-model="checkedPerms"
                  class="rounded text-marian-600 mt-0.5"
                />
                <div>
                  <span class="font-semibold text-stone-800 dark:text-stone-200">{{ p.name }}</span>
                  <p class="font-mono text-[10px] text-stone-400">{{ p.code }}</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex items-center justify-between w-full">
          <span class="text-xs text-stone-500 font-mono">Đã chọn: {{ checkedPerms.length }} quyền</span>
          <div class="flex gap-2">
            <UButton variant="outline" @click="permOpen = false">Hủy</UButton>
            <UButton color="primary" :loading="savingPerms" @click="handleSavePermissions">
              Lưu phân quyền
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Modal Tạo / Sửa Vai Trò -->
    <UModal
      v-model:open="formOpen"
      :title="isEditing ? 'Sửa thông tin vai trò' : 'Thêm vai trò mới'"
    >
      <template #body>
        <div class="space-y-4">
          <div v-if="!isEditing">
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Mã vai trò (Code) <span class="text-red-500">*</span>
            </label>
            <UInput v-model="form.code" placeholder="Ví dụ: GLV, TRUONG_BAN, PHU_HUYNH..." />
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Tên vai trò hiển thị <span class="text-red-500">*</span>
            </label>
            <UInput v-model="form.name" placeholder="Ví dụ: Giáo Lý Viên, Trưởng Ngành..." />
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Phạm vi tác động (Scope Type)
            </label>
            <select
              v-model="form.scopeType"
              class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            >
              <option value="Global">Toàn giáo xứ (Global)</option>
              <option value="Branch">Theo ngành phụ trách (Branch)</option>
              <option value="Class">Theo lớp được phân công (Class)</option>
              <option value="Guardian">Theo con cái phụ huynh (Guardian)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Mô tả nhiệm vụ
            </label>
            <UTextarea v-model="form.description" placeholder="Mô tả phạm vi quyền hạn..." :rows="2" />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="formOpen = false">Hủy</UButton>
          <UButton
            color="primary"
            :loading="saving"
            :disabled="!form.name.trim() || (!isEditing && !form.code.trim())"
            @click="handleSaveRole"
          >
            {{ isEditing ? 'Cập nhật' : 'Tạo vai trò' }}
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Xóa -->
    <UModal v-model:open="deleteOpen" title="Xác nhận xóa vai trò">
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="deleteOpen = false">Hủy</UButton>
          <UButton color="error" :loading="deleting" @click="handleDeleteRole">Xác nhận xóa</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
