<script setup lang="ts">
import { PERMISSIONS } from '~/shared/permissions'
import type { ApiError } from '~/composables/useApi'
import { toApiError } from '~/composables/useApi'

definePageMeta({ layout: 'admin', permission: PERMISSIONS.Students.View })

interface StudentRow {
  id: string
  code: string
  holyName?: string | null
  fullName: string
  birthDate?: string
  className?: string | null
  branchId?: number | null
  branchName?: string | null
  area?: string | null
  status: string
  primaryGuardianName?: string | null
  primaryGuardianPhone?: string | null
  bloodType?: string | null
  allergies?: string | null
}

/** Số liệu hiển thị trên 4 thẻ đầu trang. */
interface StudentStats {
  total: number
  active: number
  paused: number
  unassigned: number
}

/** Hợp đồng thật của GET /students/stats. */
interface StudentStatsRaw {
  totalActive: number
  totalPaused: number
  totalLeft: number
  totalGraduated: number
}

interface Paged<T> { items: T[], page: number, pageSize: number, totalCount: number }
interface BranchRef { id: number, name: string }
interface ClassLevelRef { id: number, name: string }

const api = useApi()
const permissions = usePermissions()

// Filter states
const search = ref('')
const selectedStatus = ref<string>('')
const selectedBranchId = ref<number | ''>('')
const tab = ref<'all' | 'unassigned'>('all')
const page = ref(1)
const pageSize = 20

// Data states
const rows = ref<StudentRow[]>([])
const total = ref(0)
const stats = ref<StudentStats | null>(null)
const branches = ref<BranchRef[]>([])
const classLevels = ref<ClassLevelRef[]>([])
const loading = ref(false)
const exporting = ref(false)
const error = ref<ApiError | null>(null)

async function loadStats() {
  try {
    const [raw, unassigned] = await Promise.all([
      api.get<StudentStatsRaw>('/students/stats'),
      api.get<StudentRow[]>('/students/unassigned')
    ])
    stats.value = {
      total: raw.totalActive + raw.totalPaused + raw.totalLeft + raw.totalGraduated,
      active: raw.totalActive,
      paused: raw.totalPaused,
      unassigned: Array.isArray(unassigned) ? unassigned.length : 0
    }
  } catch {
    // Stats are supplementary
  }
}

async function loadReferences() {
  try {
    const [bRes, lRes] = await Promise.all([
      api.get<BranchRef[]>('/branches'),
      api.get<ClassLevelRef[]>('/class-levels')
    ])
    branches.value = Array.isArray(bRes) ? bRes : []
    classLevels.value = Array.isArray(lRes) ? lRes : []
  } catch {
    // Supplementary references
  }
}

async function load() {
  loading.value = true
  error.value = null
  try {
    const path = tab.value === 'unassigned' ? '/students/unassigned' : '/students'
    const res = await api.get<Paged<StudentRow> | StudentRow[]>(path, {
      page: page.value,
      pageSize,
      search: search.value || undefined,
      status: selectedStatus.value || undefined,
      branchId: selectedBranchId.value || undefined
    })
    if (Array.isArray(res)) {
      // /students/unassigned trả về mảng phẳng (không phân trang).
      rows.value = res
      total.value = res.length
    } else {
      rows.value = res.items || []
      total.value = res.totalCount || 0
    }
  } catch (e) {
    error.value = toApiError(e)
  } finally {
    loading.value = false
  }
}

async function exportExcel() {
  exporting.value = true
  try {
    const blob = await api.download('/students/export')
    const url = window.URL.createObjectURL(blob as Blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Danh_Sach_Doan_Sinh_${new Date().toISOString().slice(0, 10)}.xlsx`
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (e) {
    error.value = toApiError(e)
  } finally {
    exporting.value = false
  }
}

watch(search, () => {
  page.value = 1
  load()
})
watch([tab, selectedStatus, selectedBranchId, page], load)

onMounted(() => {
  load()
  loadStats()
  loadReferences()
})

/** Tuổi hiện tại tính từ ngày sinh; trả null khi thiếu ngày sinh hợp lệ. */
function ageOf(birthDate?: string | null): number | null {
  if (!birthDate) return null
  const birth = new Date(birthDate)
  if (Number.isNaN(birth.getTime()) || birth.getFullYear() < 1900) return null
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const beforeBirthday = now.getMonth() < birth.getMonth()
    || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())
  if (beforeBirthday) age--
  return age >= 0 ? age : null
}

const columns = [
  { accessorKey: 'code', header: 'Mã' },
  { accessorKey: 'fullName', header: 'Họ và tên' },
  { accessorKey: 'birthDate', header: 'Tuổi' },
  { accessorKey: 'className', header: 'Ngành › Lớp' },
  { accessorKey: 'area', header: 'Giáo họ' },
  { accessorKey: 'primaryGuardianName', header: 'Phụ huynh' },
  { accessorKey: 'status', header: 'Trạng thái' }
]
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Danh sách đoàn sinh" subtitle="Quản lý hồ sơ, bí tích, liên hệ phụ huynh và phân bổ lớp">
      <template #actions>
        <UButton
          v-if="permissions.can(PERMISSIONS.Students.Export)"
          variant="outline"
          color="neutral"
          icon="i-lucide-download"
          :loading="exporting"
          @click="exportExcel"
        >
          Xuất Excel
        </UButton>
        <UButton
          v-if="permissions.can(PERMISSIONS.Students.Import)"
          variant="outline"
          color="secondary"
          to="/admin/doan-sinh/nhap-excel"
          icon="i-lucide-file-spreadsheet"
        >
          Nhập từ Excel
        </UButton>
        <UButton
          v-if="permissions.can(PERMISSIONS.Students.Create)"
          to="/admin/doan-sinh/them"
          icon="i-lucide-user-plus"
        >
          Thêm đoàn sinh
        </UButton>
      </template>
    </PageHeader>

    <!-- Thẻ thống kê nhanh -->
    <div v-if="stats" class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard label="Tổng đoàn sinh" :value="stats.total" icon="i-lucide-users" />
      <StatCard label="Đang học" :value="stats.active" icon="i-lucide-user-check" />
      <StatCard label="Tạm nghỉ" :value="stats.paused" icon="i-lucide-pause-circle" />
      <StatCard
        label="Chưa xếp lớp"
        :value="stats.unassigned"
        icon="i-lucide-alert-circle"
        class="border-t-amber-500"
      />
    </div>

    <!-- Thanh tìm kiếm & Bộ lọc -->
    <div class="flex flex-wrap items-center gap-3 rounded-xl border border-stone-200 bg-white p-3 shadow-xs dark:border-stone-800 dark:bg-stone-900">
      <div class="min-w-64 flex-1">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Tìm theo tên thánh, họ tên hoặc mã đoàn sinh..."
          class="w-full"
        />
      </div>

      <select
        v-model="selectedBranchId"
        class="rounded-md border border-stone-300 bg-white p-2 text-sm dark:border-stone-700 dark:bg-stone-900 dark:text-white"
        aria-label="Lọc theo ngành"
      >
        <option value="">-- Mọi ngành --</option>
        <option v-for="b in branches" :key="b.id" :value="b.id">
          Ngành {{ b.name }}
        </option>
      </select>

      <select
        v-model="selectedStatus"
        class="rounded-md border border-stone-300 bg-white p-2 text-sm dark:border-stone-700 dark:bg-stone-900 dark:text-white"
        aria-label="Lọc theo trạng thái"
      >
        <option value="">-- Mọi trạng thái --</option>
        <option value="Active">Đang học</option>
        <option value="Paused">Tạm nghỉ</option>
        <option value="Left">Đã nghỉ</option>
        <option value="Graduated">Đã tốt nghiệp</option>
      </select>
    </div>

    <!-- Tabs chuyển đổi Tất cả vs Chưa xếp lớp -->
    <div class="flex items-center gap-2 border-b border-stone-200 pb-2 dark:border-stone-800">
      <UButton
        :variant="tab === 'all' ? 'solid' : 'ghost'"
        :color="tab === 'all' ? 'primary' : 'neutral'"
        size="sm"
        @click="tab = 'all'"
      >
        Tất cả đoàn sinh
      </UButton>
      <UButton
        v-if="permissions.can(PERMISSIONS.Enrollments.Manage)"
        :variant="tab === 'unassigned' ? 'solid' : 'ghost'"
        :color="tab === 'unassigned' ? 'primary' : 'neutral'"
        size="sm"
        icon="i-lucide-alert-circle"
        @click="tab = 'unassigned'"
      >
        Chưa xếp lớp ({{ stats?.unassigned || 0 }})
      </UButton>
    </div>

    <ErrorState :error="error" @retry="load" />

    <!-- Bảng đoàn sinh -->
    <div class="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-stone-200 bg-stone-50 text-xs font-semibold uppercase text-stone-600 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-400">
          <tr>
            <th class="px-4 py-3">Mã</th>
            <th class="px-4 py-3">Họ và tên</th>
            <th class="px-4 py-3 text-center">Tuổi</th>
            <th class="px-4 py-3">Ngành › Lớp</th>
            <th class="px-4 py-3">Giáo họ</th>
            <th class="px-4 py-3">Phụ huynh</th>
            <th class="px-4 py-3">Trạng thái</th>
            <th class="px-4 py-3 text-right">Chi tiết</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
          <tr v-if="loading">
            <td colspan="8" class="p-8 text-center text-stone-500">
              <UIcon name="i-lucide-loader-2" class="size-6 animate-spin mx-auto mb-2 text-marian-600" />
              <span>Đang tải danh sách đoàn sinh...</span>
            </td>
          </tr>
          <tr v-else-if="rows.length === 0">
            <td colspan="8" class="p-8">
              <EmptyState
                title="Không tìm thấy đoàn sinh nào"
                description="Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc trạng thái. Bạn chỉ thấy đoàn sinh trong phạm vi phân công của mình."
              />
            </td>
          </tr>
          <tr
            v-for="row in rows"
            v-else
            :key="row.id"
            class="hover:bg-stone-50/80 cursor-pointer dark:hover:bg-stone-800/50"
            @click="navigateTo(`/admin/doan-sinh/${row.id}`)"
          >
            <td class="px-4 py-3 font-mono text-xs font-bold text-marian-700 dark:text-marian-400">
              {{ row.code }}
            </td>
            <td class="px-4 py-3">
              <span v-if="row.holyName" class="text-xs text-vatican-600 font-semibold dark:text-vatican-400 block">
                {{ row.holyName }}
              </span>
              <strong class="text-stone-900 dark:text-white">{{ row.fullName }}</strong>
            </td>
            <td class="px-4 py-3 text-center text-xs">
              {{ ageOf(row.birthDate) ?? '–' }}
            </td>
            <td class="px-4 py-3 text-xs">
              <span v-if="row.className" class="font-medium">
                {{ row.branchName ? `${row.branchName} › ` : '' }}{{ row.className }}
              </span>
              <span v-else class="rounded bg-amber-50 px-1.5 py-0.5 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                Chưa xếp lớp
              </span>
            </td>
            <td class="px-4 py-3 text-xs text-stone-600 dark:text-stone-400">
              {{ row.area || '–' }}
            </td>
            <td class="px-4 py-3 text-xs">
              <div class="font-medium text-stone-800 dark:text-stone-200">
                {{ row.primaryGuardianName || '–' }}
              </div>
              <MaskedField
                :value="row.primaryGuardianPhone"
                :permission="PERMISSIONS.Students.ViewContact"
                placeholder="Đã ẩn SĐT"
              />
            </td>
            <td class="px-4 py-3">
              <StatusChip domain="student" :value="row.status" />
            </td>
            <td class="px-4 py-3 text-right">
              <UButton
                size="xs"
                variant="ghost"
                color="neutral"
                icon="i-lucide-chevron-right"
                @click.stop="navigateTo(`/admin/doan-sinh/${row.id}`)"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Phân trang -->
      <div v-if="total > pageSize" class="flex items-center justify-between border-t border-stone-200 p-3 text-xs text-stone-500 dark:border-stone-800">
        <span>Hiển thị {{ rows.length }} / {{ total }} đoàn sinh</span>
        <div class="flex gap-1">
          <UButton
            size="xs"
            variant="outline"
            :disabled="page <= 1"
            icon="i-lucide-chevron-left"
            @click="page--"
          />
          <span class="px-2 py-1 font-semibold">Trang {{ page }}</span>
          <UButton
            size="xs"
            variant="outline"
            :disabled="page * pageSize >= total"
            icon="i-lucide-chevron-right"
            @click="page++"
          />
        </div>
      </div>
    </div>
  </div>
</template>
