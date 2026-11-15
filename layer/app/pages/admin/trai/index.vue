<script setup lang="ts">
import { PERMISSIONS } from '~/shared/permissions'
import type { ApiError } from '~/composables/useApi'

definePageMeta({ layout: 'admin', permission: PERMISSIONS.Camps.View })

interface CampEventItem {
  id: string
  name: string
  startDate: string
  endDate: string
  location: string
  fee: number
  description?: string | null
  branchId?: number | null
  branchName?: string | null
  academicYearId?: string | null
  academicYearName?: string | null
  registrationDeadline?: string | null
  totalRegistrations: number
  totalCollected: number
}

interface AcademicYearItem {
  id: string
  name: string
  status: string
}

interface BranchItem {
  id: number
  name: string
}

const api = useApi()
const toast = useToast()
const { can } = usePermissions()

const camps = ref<CampEventItem[]>([])
const years = ref<AcademicYearItem[]>([])
const branches = ref<BranchItem[]>([])
const loading = ref(true)
const error = ref<ApiError | null>(null)

// Bộ lọc
const selectedYearId = ref<string>('ALL')
const selectedBranchId = ref<string>('ALL')
const searchQuery = ref('')

// Modal Tạo / Sửa
const formOpen = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const currentId = ref<string | null>(null)
const form = ref({
  name: '',
  startDate: '',
  endDate: '',
  location: '',
  fee: 0,
  description: '',
  branchId: null as number | null,
  academicYearId: null as string | null,
  registrationDeadline: ''
})

// Modal Xóa
const deleteOpen = ref(false)
const deleting = ref(false)
const selectedCamp = ref<CampEventItem | null>(null)

async function loadData() {
  loading.value = true
  error.value = null
  try {
    const [resCamps, resYears, resBranches] = await Promise.all([
      api.get<CampEventItem[]>('/camps'),
      api.get<AcademicYearItem[]>('/academic-years').catch(() => []),
      api.get<BranchItem[]>('/branches').catch(() => [])
    ])
    camps.value = resCamps || []
    years.value = resYears || []
    branches.value = resBranches || []
  } catch (e) {
    error.value = e as ApiError
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

const filteredCamps = computed(() => {
  return camps.value.filter(c => {
    if (selectedYearId.value !== 'ALL' && c.academicYearId !== selectedYearId.value) return false
    if (selectedBranchId.value !== 'ALL' && c.branchId !== Number(selectedBranchId.value)) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const matchName = c.name.toLowerCase().includes(q)
      const matchLoc = c.location.toLowerCase().includes(q)
      return matchName || matchLoc
    }
    return true
  })
})

const stats = computed(() => {
  const total = camps.value.length
  const now = new Date().toISOString().substring(0, 10)
  const openReg = camps.value.filter(c => !c.registrationDeadline || c.registrationDeadline >= now).length
  const totalReg = camps.value.reduce((acc, c) => acc + (c.totalRegistrations || 0), 0)
  const totalFee = camps.value.reduce((acc, c) => acc + (c.totalCollected || 0), 0)
  return { total, openReg, totalReg, totalFee }
})

function formatCurrency(val: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0)
}

function openCreateModal() {
  isEditing.value = false
  currentId.value = null
  const activeYear = years.value.find(y => y.status === 'Active')
  const today = new Date().toISOString().substring(0, 10)
  form.value = {
    name: '',
    startDate: today,
    endDate: today,
    location: '',
    fee: 0,
    description: '',
    branchId: null,
    academicYearId: activeYear ? activeYear.id : (years.value[0]?.id ?? null),
    registrationDeadline: today
  }
  formOpen.value = true
}

function openEditModal(c: CampEventItem) {
  isEditing.value = true
  currentId.value = c.id
  form.value = {
    name: c.name,
    startDate: c.startDate,
    endDate: c.endDate,
    location: c.location,
    fee: c.fee,
    description: c.description || '',
    branchId: c.branchId ?? null,
    academicYearId: c.academicYearId ?? null,
    registrationDeadline: c.registrationDeadline || ''
  }
  formOpen.value = true
}

async function handleSaveCamp() {
  if (!form.value.name.trim() || !form.value.location.trim()) {
    toast.add({ title: 'Vui lòng nhập tên sự kiện và địa điểm', color: 'error' })
    return
  }
  saving.value = true
  try {
    const payload = {
      name: form.value.name.trim(),
      startDate: form.value.startDate,
      endDate: form.value.endDate,
      location: form.value.location.trim(),
      fee: Number(form.value.fee) || 0,
      description: form.value.description?.trim() || null,
      branchId: form.value.branchId || null,
      academicYearId: form.value.academicYearId || null,
      registrationDeadline: form.value.registrationDeadline || null
    }

    if (isEditing.value && currentId.value) {
      await api.put(`/camps/${currentId.value}`, payload)
      toast.add({ title: 'Cập nhật sự kiện thành công', color: 'success' })
    } else {
      await api.post('/camps', payload)
      toast.add({ title: 'Tạo sự kiện mới thành công', color: 'success' })
    }
    formOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể lưu sự kiện', description: err.detail || err.message, color: 'error' })
  } finally {
    saving.value = false
  }
}

function openDeleteModal(c: CampEventItem) {
  selectedCamp.value = c
  deleteOpen.value = true
}

async function handleDeleteCamp() {
  if (!selectedCamp.value) return
  deleting.value = true
  try {
    await api.delete(`/camps/${selectedCamp.value.id}`)
    toast.add({ title: 'Đã xóa sự kiện', color: 'success' })
    deleteOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể xóa sự kiện', description: err.detail || err.message, color: 'error' })
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Sự kiện & Hội trại"
      subtitle="Quản lý các chương trình cắm trại, sa mạc huấn luyện, dã ngoại và thu lệ phí"
    >
      <template #actions>
        <UButton
          v-if="can(PERMISSIONS.Camps.Manage)"
          color="primary"
          icon="i-lucide-plus"
          @click="openCreateModal"
        >
          Tạo sự kiện mới
        </UButton>
      </template>
    </PageHeader>

    <ErrorState v-if="error" :error="error" @retry="loadData" />

    <!-- Thống kê nhanh -->
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard
        title="Tổng số sự kiện"
        :value="stats.total"
        icon="i-lucide-tent"
      />
      <StatCard
        title="Đang mở đăng ký"
        :value="stats.openReg"
        icon="i-lucide-calendar-check"
        class="text-emerald-600"
      />
      <StatCard
        title="Lượt đoàn sinh đăng ký"
        :value="stats.totalReg"
        icon="i-lucide-users"
      />
      <StatCard
        title="Tổng lệ phí đã thu"
        :value="formatCurrency(stats.totalFee)"
        icon="i-lucide-wallet"
        class="text-vatican-800 dark:text-vatican-300"
      />
    </div>

    <!-- Bộ lọc & Tìm kiếm -->
    <div class="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-stone-800 dark:bg-stone-900">
      <div class="flex flex-wrap items-center gap-3">
        <!-- Lọc niên khóa -->
        <div class="flex items-center gap-2">
          <label class="text-xs font-semibold uppercase text-stone-500">Niên khóa:</label>
          <select
            v-model="selectedYearId"
            class="h-9 rounded-lg border border-stone-200 bg-stone-50 px-3 text-xs font-medium dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
          >
            <option value="ALL">Tất cả niên khóa</option>
            <option v-for="y in years" :key="y.id" :value="y.id">
              {{ y.name }}
            </option>
          </select>
        </div>

        <!-- Lọc ngành -->
        <div class="flex items-center gap-2">
          <label class="text-xs font-semibold uppercase text-stone-500">Ngành:</label>
          <select
            v-model="selectedBranchId"
            class="h-9 rounded-lg border border-stone-200 bg-stone-50 px-3 text-xs font-medium dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
          >
            <option value="ALL">Toàn thể giáo xứ</option>
            <option v-for="b in branches" :key="b.id" :value="b.id">
              {{ b.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Ô tìm kiếm -->
      <div class="w-full sm:w-64">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Tìm tên sự kiện, địa điểm..."
          size="sm"
        />
      </div>
    </div>

    <!-- Danh sách sự kiện dạng Card Grid -->
    <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 6" :key="i" class="h-56 animate-pulse rounded-2xl border border-stone-200 bg-stone-100 dark:border-stone-800 dark:bg-stone-800/40" />
    </div>

    <EmptyState
      v-else-if="filteredCamps.length === 0"
      icon="i-lucide-tent"
      title="Không tìm thấy sự kiện nào"
      description="Chưa có sự kiện nào hoặc không khớp với bộ lọc tìm kiếm."
    >
      <template #actions>
        <UButton
          v-if="can(PERMISSIONS.Camps.Manage)"
          color="primary"
          icon="i-lucide-plus"
          @click="openCreateModal"
        >
          Tạo sự kiện mới ngay
        </UButton>
      </template>
    </EmptyState>

    <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="c in filteredCamps"
        :key="c.id"
        class="group relative flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-vatican-500 hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
      >
        <div>
          <!-- Header Card -->
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="inline-block rounded-md bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                {{ c.branchName || 'Toàn xứ' }}
              </span>
              <h3 class="mt-1 font-display text-xl font-bold text-stone-900 group-hover:text-marian-600 dark:text-stone-50 dark:group-hover:text-marian-400">
                <NuxtLink :to="`/admin/trai/${c.id}`" class="hover:underline">
                  {{ c.name }}
                </NuxtLink>
              </h3>
            </div>
            <div class="text-right">
              <span class="block font-mono text-sm font-bold text-vatican-800 dark:text-vatican-300">
                {{ c.fee > 0 ? formatCurrency(c.fee) : 'Miễn phí' }}
              </span>
            </div>
          </div>

          <!-- Thông tin chi tiết -->
          <div class="mt-4 space-y-2 text-xs text-stone-600 dark:text-stone-400">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-map-pin" class="h-3.5 w-3.5 text-stone-400" />
              <span>Địa điểm: <strong class="text-stone-800 dark:text-stone-200">{{ c.location }}</strong></span>
            </div>

            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-calendar" class="h-3.5 w-3.5 text-stone-400" />
              <span>Thời gian: {{ c.startDate }} <span v-if="c.endDate !== c.startDate">➔ {{ c.endDate }}</span></span>
            </div>

            <div v-if="c.registrationDeadline" class="flex items-center gap-2">
              <UIcon name="i-lucide-clock" class="h-3.5 w-3.5 text-amber-500" />
              <span>Hạn đăng ký: <strong class="text-stone-800 dark:text-stone-200">{{ c.registrationDeadline }}</strong></span>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800 font-medium">
              <span class="text-stone-500">Đã đăng ký:</span>
              <span class="font-bold text-marian-600 dark:text-marian-400">{{ c.totalRegistrations }} em</span>
            </div>
            <div class="flex items-center justify-between font-medium">
              <span class="text-stone-500">Đã thu:</span>
              <span class="font-bold text-emerald-600">{{ formatCurrency(c.totalCollected) }}</span>
            </div>
          </div>
        </div>

        <!-- Footer Card -->
        <div class="mt-5 flex items-center justify-between border-t border-stone-100 pt-3 dark:border-stone-800">
          <div class="flex items-center gap-1">
            <UButton
              v-if="can(PERMISSIONS.Camps.Manage)"
              size="xs"
              variant="ghost"
              color="neutral"
              icon="i-lucide-pencil"
              @click="openEditModal(c)"
            />
            <UButton
              v-if="can(PERMISSIONS.Camps.Manage)"
              size="xs"
              variant="ghost"
              color="error"
              icon="i-lucide-trash-2"
              :disabled="c.totalRegistrations > 0"
              @click="openDeleteModal(c)"
            />
          </div>

          <NuxtLink
            :to="`/admin/trai/${c.id}`"
            class="flex items-center gap-1 rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-800 transition hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-200"
          >
            Đăng ký & Thu phí
            <UIcon name="i-lucide-arrow-right" class="h-3.5 w-3.5" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Modal Tạo / Sửa Sự Kiện -->
    <UModal
      v-model:open="formOpen"
      :title="isEditing ? 'Sửa thông tin sự kiện' : 'Tạo sự kiện & hội trại mới'"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Tên sự kiện / Hội trại <span class="text-red-500">*</span>
            </label>
            <UInput v-model="form.name" placeholder="Ví dụ: Trại hè Thiếu Nhi 2026, Sa mạc Vươn Lên..." />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Ngành tham gia
              </label>
              <select
                v-model="form.branchId"
                class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              >
                <option :value="null">Toàn thể giáo xứ</option>
                <option v-for="b in branches" :key="b.id" :value="b.id">
                  {{ b.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Niên khóa
              </label>
              <select
                v-model="form.academicYearId"
                class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              >
                <option :value="null">Không gắn niên khóa</option>
                <option v-for="y in years" :key="y.id" :value="y.id">
                  {{ y.name }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Địa điểm tổ chức <span class="text-red-500">*</span>
            </label>
            <UInput v-model="form.location" placeholder="Ví dụ: Khu du lịch sinh thái, Đan viện Châu Sơn..." />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Ngày bắt đầu <span class="text-red-500">*</span>
              </label>
              <UInput v-model="form.startDate" type="date" />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Ngày kết thúc <span class="text-red-500">*</span>
              </label>
              <UInput v-model="form.endDate" type="date" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Lệ phí mỗi em (VNĐ)
              </label>
              <UInput v-model.number="form.fee" type="number" step="10000" min="0" />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Hạn chót đăng ký
              </label>
              <UInput v-model="form.registrationDeadline" type="date" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Mô tả chi tiết / Kế hoạch
            </label>
            <UTextarea v-model="form.description" placeholder="Thông tin chi tiết về sự kiện..." :rows="3" />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="formOpen = false">Hủy</UButton>
          <UButton color="primary" :loading="saving" @click="handleSaveCamp">
            {{ isEditing ? 'Cập nhật' : 'Tạo sự kiện' }}
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Xóa Sự Kiện -->
    <UModal
      v-model:open="deleteOpen"
      title="Xác nhận xóa sự kiện"
      description="Chỉ có thể xóa khi chưa có đoàn sinh nào đăng ký tham gia."
    >
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="deleteOpen = false">Hủy</UButton>
          <UButton color="error" :loading="deleting" @click="handleDeleteCamp">
            Xác nhận xóa
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
