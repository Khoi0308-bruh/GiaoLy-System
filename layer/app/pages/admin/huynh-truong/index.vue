<script setup lang="ts">
import { PERMISSIONS } from '~/shared/permissions'
import type { ApiError } from '~/composables/useApi'

definePageMeta({ layout: 'admin', permission: PERMISSIONS.Leaders.View })

interface LeaderItem {
  id: string
  holyName?: string | null
  fullName: string
  position: string
  level: number
  term: string
  avatarPath?: string | null
  description?: string | null
  branchId?: number | null
  branchName?: string | null
  isActive: boolean
  createdAt: string
  updatedAt?: string | null
}

interface BranchItem {
  id: number
  name: string
}

const api = useApi()
const toast = useToast()
const { can } = usePermissions()

const leaders = ref<LeaderItem[]>([])
const branches = ref<BranchItem[]>([])
const loading = ref(true)
const error = ref<ApiError | null>(null)

// Bộ lọc
const filterTerm = ref<string>('ALL')
const filterBranch = ref<string>('ALL')
const searchQuery = ref<string>('')

// Modal Thêm / Sửa
const formOpen = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const currentId = ref<string | null>(null)
const form = ref({
  holyName: '',
  fullName: '',
  position: 'Huynh trưởng',
  level: 1,
  term: '2023-2026',
  avatarPath: '',
  description: '',
  branchId: null as number | null,
  isActive: true
})

// Modal Xóa
const deleteOpen = ref(false)
const deleting = ref(false)
const selectedLeader = ref<LeaderItem | null>(null)

async function loadData() {
  loading.value = true
  error.value = null
  try {
    const [resLeaders, resBranches] = await Promise.all([
      api.get<LeaderItem[]>('/leaders'),
      api.get<BranchItem[]>('/branches').catch(() => [])
    ])
    leaders.value = resLeaders || []
    branches.value = resBranches || []
  } catch (e) {
    error.value = e as ApiError
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

const terms = computed(() => {
  const set = new Set(leaders.value.map(l => l.term).filter(Boolean))
  return Array.from(set)
})

const filteredLeaders = computed(() => {
  return leaders.value.filter(l => {
    if (filterTerm.value !== 'ALL' && l.term !== filterTerm.value) return false
    if (filterBranch.value !== 'ALL' && l.branchId !== Number(filterBranch.value)) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const matchName = `${l.holyName ?? ''} ${l.fullName}`.toLowerCase().includes(q)
      const matchPos = l.position.toLowerCase().includes(q)
      return matchName || matchPos
    }
    return true
  })
})

function openCreateModal() {
  isEditing.value = false
  currentId.value = null
  form.value = {
    holyName: '',
    fullName: '',
    position: 'Huynh trưởng',
    level: 1,
    term: '2023-2026',
    avatarPath: '',
    description: '',
    branchId: null,
    isActive: true
  }
  formOpen.value = true
}

function openEditModal(l: LeaderItem) {
  isEditing.value = true
  currentId.value = l.id
  form.value = {
    holyName: l.holyName || '',
    fullName: l.fullName,
    position: l.position,
    level: l.level,
    term: l.term,
    avatarPath: l.avatarPath || '',
    description: l.description || '',
    branchId: l.branchId ?? null,
    isActive: l.isActive
  }
  formOpen.value = true
}

async function handleSaveLeader() {
  if (!form.value.fullName.trim() || !form.value.position.trim()) {
    toast.add({ title: 'Vui lòng nhập họ tên và chức vụ', color: 'error' })
    return
  }
  saving.value = true
  try {
    const payload = {
      holyName: form.value.holyName?.trim() || null,
      fullName: form.value.fullName.trim(),
      position: form.value.position.trim(),
      level: Number(form.value.level) || 0,
      term: form.value.term?.trim() || '2023-2026',
      avatarPath: form.value.avatarPath?.trim() || null,
      description: form.value.description?.trim() || null,
      branchId: form.value.branchId || null,
      isActive: form.value.isActive
    }

    if (isEditing.value && currentId.value) {
      await api.put(`/leaders/${currentId.value}`, payload)
      toast.add({ title: 'Cập nhật huynh trưởng thành công', color: 'success' })
    } else {
      await api.post('/leaders', payload)
      toast.add({ title: 'Thêm huynh trưởng thành công', color: 'success' })
    }
    formOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể lưu huynh trưởng', description: err.detail || err.message, color: 'error' })
  } finally {
    saving.value = false
  }
}

function openDeleteModal(l: LeaderItem) {
  selectedLeader.value = l
  deleteOpen.value = true
}

async function handleDeleteLeader() {
  if (!selectedLeader.value) return
  deleting.value = true
  try {
    await api.delete(`/leaders/${selectedLeader.value.id}`)
    toast.add({ title: 'Đã xóa huynh trưởng', color: 'success' })
    deleteOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể xóa huynh trưởng', description: err.detail || err.message, color: 'error' })
  } finally {
    deleting.value = false
  }
}

const stats = computed(() => {
  const total = leaders.value.length
  const active = leaders.value.filter(l => l.isActive).length
  const retired = total - active
  return { total, active, retired }
})
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Ban Huynh Trưởng & Điều Hành Đoàn"
      subtitle="Quản lý danh sách ban chỉ huy đoàn, huynh trưởng các ngành và giáo lý viên"
    >
      <template #actions>
        <UButton
          v-if="can(PERMISSIONS.Leaders.Create)"
          color="primary"
          icon="i-lucide-plus"
          @click="openCreateModal"
        >
          Thêm huynh trưởng
        </UButton>
      </template>
    </PageHeader>

    <ErrorState v-if="error" :error="error" @retry="loadData" />

    <!-- Thống kê -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        label="Tổng số Huynh trưởng"
        :value="stats.total"
        icon="i-lucide-users"
      />
      <StatCard
        label="Đang đương nhiệm"
        :value="stats.active"
        icon="i-lucide-user-check"
        class="text-emerald-600"
      />
      <StatCard
        label="Cựu huynh trưởng"
        :value="stats.retired"
        icon="i-lucide-clock"
        class="text-stone-500"
      />
    </div>

    <!-- Bộ lọc & Tìm kiếm -->
    <div class="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-stone-800 dark:bg-stone-900">
      <div class="flex flex-wrap items-center gap-3">
        <!-- Nhiệm kỳ -->
        <div class="flex items-center gap-2">
          <label class="text-xs font-semibold uppercase text-stone-500">Nhiệm kỳ:</label>
          <select
            v-model="filterTerm"
            class="h-9 rounded-lg border border-stone-200 bg-stone-50 px-3 text-xs font-medium dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
          >
            <option value="ALL">Tất cả nhiệm kỳ</option>
            <option v-for="t in terms" :key="t" :value="t">
              {{ t }}
            </option>
          </select>
        </div>

        <!-- Ngành -->
        <div class="flex items-center gap-2">
          <label class="text-xs font-semibold uppercase text-stone-500">Ngành:</label>
          <select
            v-model="filterBranch"
            class="h-9 rounded-lg border border-stone-200 bg-stone-50 px-3 text-xs font-medium dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
          >
            <option value="ALL">Tất cả các ngành</option>
            <option v-for="b in branches" :key="b.id" :value="b.id">
              {{ b.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="w-full sm:w-64">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Tìm tên, chức vụ..."
          size="sm"
        />
      </div>
    </div>

    <!-- Danh sách Huynh trưởng Card Grid -->
    <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 8" :key="i" class="h-64 animate-pulse rounded-2xl border border-stone-200 bg-stone-100 dark:border-stone-800 dark:bg-stone-800/40" />
    </div>

    <EmptyState
      v-else-if="filteredLeaders.length === 0"
      icon="i-lucide-users"
      title="Không tìm thấy huynh trưởng nào"
      description="Chưa có dữ liệu hoặc không khớp với bộ lọc tìm kiếm."
    >
      <template #actions>
        <UButton
          v-if="can(PERMISSIONS.Leaders.Create)"
          color="primary"
          icon="i-lucide-plus"
          @click="openCreateModal"
        >
          Thêm huynh trưởng đầu tiên
        </UButton>
      </template>
    </EmptyState>

    <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="l in filteredLeaders"
        :key="l.id"
        class="group relative flex flex-col items-center rounded-2xl border border-stone-200 bg-white p-5 text-center shadow-sm transition hover:border-vatican-500 hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
      >
        <!-- Khung ảnh Arch-frame -->
        <div class="relative h-24 w-20 overflow-hidden rounded-t-full border-2 border-vatican-500/60 bg-stone-100 shadow-sm dark:bg-stone-800">
          <img
            v-if="l.avatarPath"
            :src="l.avatarPath"
            :alt="l.fullName"
            class="h-full w-full object-cover"
          />
          <div v-else class="flex h-full w-full items-center justify-center text-xl font-bold text-marian-700 dark:text-marian-300">
            {{ l.fullName.charAt(0) }}
          </div>
        </div>

        <!-- Thông tin Huynh trưởng -->
        <h4 class="mt-3 font-display text-base font-bold text-stone-900 dark:text-stone-100">
          {{ l.holyName ? `${l.holyName} ` : '' }}{{ l.fullName }}
        </h4>
        <p class="text-xs font-semibold text-marian-600 dark:text-marian-400">
          {{ l.position }}
        </p>

        <div class="mt-2 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-stone-500">
          <span class="rounded bg-stone-100 px-2 py-0.5 dark:bg-stone-800 dark:text-stone-300">
            {{ l.branchName || 'Đoàn xứ' }}
          </span>
          <span class="rounded bg-stone-100 px-2 py-0.5 dark:bg-stone-800 dark:text-stone-300">
            Cấp {{ l.level }}
          </span>
          <span class="rounded bg-stone-100 px-2 py-0.5 dark:bg-stone-800 dark:text-stone-300">
            NK: {{ l.term }}
          </span>
        </div>

        <p v-if="l.description" class="mt-2 line-clamp-2 text-xs italic text-stone-400">
          "{{ l.description }}"
        </p>

        <!-- Trạng thái & Thao tác -->
        <div class="mt-4 flex w-full items-center justify-between border-t border-stone-100 pt-3 dark:border-stone-800">
          <span
            class="rounded-full px-2 py-0.5 text-[10px] font-semibold"
            :class="l.isActive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-stone-100 text-stone-500 dark:bg-stone-800'"
          >
            {{ l.isActive ? 'Đương nhiệm' : 'Đã nghỉ' }}
          </span>

          <div class="flex items-center gap-1">
            <UButton
              v-if="can(PERMISSIONS.Leaders.Update)"
              size="xs"
              variant="ghost"
              color="neutral"
              icon="i-lucide-pencil"
              @click="openEditModal(l)"
            />
            <UButton
              v-if="can(PERMISSIONS.Leaders.Delete)"
              size="xs"
              variant="ghost"
              color="error"
              icon="i-lucide-trash-2"
              @click="openDeleteModal(l)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Thêm / Sửa Huynh Trưởng -->
    <UModal
      v-model:open="formOpen"
      :title="isEditing ? 'Sửa thông tin huynh trưởng' : 'Thêm huynh trưởng mới'"
    >
      <template #body>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Tên thánh
              </label>
              <UInput v-model="form.holyName" placeholder="Giuse, Maria, Têrêsa..." />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Họ và tên <span class="text-red-500">*</span>
              </label>
              <UInput v-model="form.fullName" placeholder="Nguyễn Văn A..." />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Chức vụ <span class="text-red-500">*</span>
              </label>
              <UInput v-model="form.position" placeholder="Đoàn trưởng, Trưởng ngành..." />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Cấp bậc (Level)
              </label>
              <UInput v-model.number="form.level" type="number" min="0" max="5" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Nhiệm kỳ
              </label>
              <UInput v-model="form.term" placeholder="2023-2026" />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Ngành phụ trách
              </label>
              <select
                v-model="form.branchId"
                class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              >
                <option :value="null">-- Thuộc Ban điều hành đoàn --</option>
                <option v-for="b in branches" :key="b.id" :value="b.id">
                  {{ b.name }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Đường dẫn ảnh đại diện (URL)
            </label>
            <UInput v-model="form.avatarPath" placeholder="https://..." />
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Mô tả / Tiểu sử ngắn
            </label>
            <UTextarea v-model="form.description" placeholder="Vài nét về huynh trưởng..." :rows="2" />
          </div>

          <div class="flex items-center gap-2">
            <input
              id="isActiveCheck"
              type="checkbox"
              v-model="form.isActive"
              class="rounded text-marian-600"
            />
            <label for="isActiveCheck" class="text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
              Đang đương nhiệm (Active)
            </label>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="formOpen = false">Hủy</UButton>
          <UButton
            color="primary"
            :loading="saving"
            :disabled="!form.fullName.trim() || !form.position.trim()"
            @click="handleSaveLeader"
          >
            {{ isEditing ? 'Cập nhật' : 'Thêm mới' }}
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Xóa Huynh Trưởng -->
    <UModal v-model:open="deleteOpen" title="Xác nhận xóa huynh trưởng">
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="deleteOpen = false">Hủy</UButton>
          <UButton color="error" :loading="deleting" @click="handleDeleteLeader">
            Xác nhận xóa
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
