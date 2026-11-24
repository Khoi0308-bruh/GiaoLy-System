<script setup lang="ts">
import { PERMISSIONS } from '../../../shared/permissions'
import type { ApiError } from '../../../composables/useApi'
import { toApiError } from '../../../composables/useApi'

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
// USelect của Nuxt UI không nhận giá trị rỗng, nên 'all' là sentinel gửi lên API thành "không lọc".
const selectedStatus = ref<string>('all')
const selectedBranchId = ref<string>('all')
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
      status: selectedStatus.value === 'all' ? undefined : selectedStatus.value,
      branchId: selectedBranchId.value === 'all' ? undefined : Number(selectedBranchId.value)
    })
    if (Array.isArray(res)) {
      // /students/unassigned trả về mảng phẳng (không phân trang) nên tự cắt trang.
      total.value = res.length
      const maxPage = Math.max(1, Math.ceil(res.length / pageSize))
      if (page.value > maxPage) {
        // Đổi bộ lọc làm số trang co lại: đưa về trang cuối rồi để watcher tải lại.
        page.value = maxPage
        return
      }
      const start = (page.value - 1) * pageSize
      rows.value = res.slice(start, start + pageSize)
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

// Gõ tìm kiếm không bắn một request cho mỗi phím: gộp trong 300ms.
let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(search, () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    page.value = 1
    load()
  }, 300)
})
onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer)
})

watch([tab, selectedStatus, selectedBranchId, page], load)

onMounted(() => {
  load()
  loadStats()
  loadReferences()
})

/** Hồ sơ cũ có thể thiếu mã hoặc họ tên; hiển thị nhãn thay vì ô trống. */
const tenHienThi = (row: StudentRow) => row.fullName?.trim() || '(Chưa có tên)'
const maHienThi = (row: StudentRow) => row.code?.trim() || '—'
const chuDau = (row: StudentRow) => (row.fullName?.trim().charAt(0) || '?').toUpperCase()

/** Tuổi hiện tại tính từ ngày sinh; trả null khi thiếu ngày sinh hợp lệ. */
function ageOf(birthDate?: string | null): number | null {
  if (!birthDate) return null
  // API trả "YYYY-MM-DD"; new Date("YYYY-MM-DD") hiểu là UTC nên ở múi giờ âm
  // có thể lệch một ngày. Tách phần ngày rồi so sánh theo lịch địa phương.
  const [year, month, day] = birthDate.slice(0, 10).split('-').map(Number)
  if (!year || !month || !day || year < 1900) return null
  const now = new Date()
  let age = now.getFullYear() - year
  if (now.getMonth() + 1 < month || (now.getMonth() + 1 === month && now.getDate() < day)) age--
  return age >= 0 ? age : null
}

const statusOptions = [
  { label: 'Mọi trạng thái', value: 'all' },
  { label: 'Đang học', value: 'Active' },
  { label: 'Tạm nghỉ', value: 'Paused' },
  { label: 'Đã nghỉ', value: 'Left' },
  { label: 'Đã tốt nghiệp', value: 'Graduated' }
]

const branchOptions = computed(() => [
  { label: 'Mọi ngành', value: 'all' },
  ...branches.value.map(b => ({ label: `Ngành ${b.name}`, value: String(b.id) }))
])

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
    <div class="rounded-xl border border-stone-200 bg-white p-3 shadow-xs dark:border-stone-800 dark:bg-stone-900">
      <div class="flex flex-wrap items-center gap-3">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Tìm theo tên thánh, họ tên hoặc mã đoàn sinh..."
          class="min-w-56 flex-1"
        />

        <USelect
          v-model="selectedBranchId"
          :items="branchOptions"
          class="w-44"
          aria-label="Lọc theo ngành"
        />

        <USelect
          v-model="selectedStatus"
          :items="statusOptions"
          class="w-44"
          aria-label="Lọc theo trạng thái"
        />
      </div>
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
      <table class="w-full min-w-[860px] text-left text-sm">
        <thead class="border-b border-stone-200 bg-stone-50 text-[11px] font-semibold tracking-wide text-stone-500 uppercase dark:border-stone-800 dark:bg-stone-950 dark:text-stone-400">
          <tr>
            <th class="px-4 py-3">Mã</th>
            <th class="px-4 py-3">Đoàn sinh</th>
            <th class="px-4 py-3 text-center">Tuổi</th>
            <th class="px-4 py-3">Ngành › Lớp</th>
            <th class="px-4 py-3">Phụ huynh</th>
            <th class="px-4 py-3">Trạng thái</th>
            <th class="px-3 py-3"><span class="sr-only">Chi tiết</span></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
          <tr v-if="loading">
            <td colspan="7" class="p-8 text-center text-stone-500">
              <UIcon name="i-lucide-loader-2" class="size-6 animate-spin mx-auto mb-2 text-marian-600" />
              <span>Đang tải danh sách đoàn sinh...</span>
            </td>
          </tr>
          <tr v-else-if="rows.length === 0">
            <td colspan="7" class="p-8">
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
            class="cursor-pointer transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50"
            @click="navigateTo(`/admin/doan-sinh/${row.id}`)"
          >
            <td class="px-4 py-3 font-mono text-xs font-bold whitespace-nowrap text-marian-700 dark:text-marian-400">
              {{ maHienThi(row) }}
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <span class="grid size-9 shrink-0 place-items-center rounded-full bg-marian-50 text-xs font-bold text-marian-700 dark:bg-marian-950 dark:text-marian-300">
                  {{ chuDau(row) }}
                </span>
                <span class="min-w-0">
                  <span v-if="row.holyName" class="mb-0.5 block text-[11px] font-semibold text-vatican-600 dark:text-vatican-400">
                    {{ row.holyName }}
                  </span>
                  <strong class="block truncate text-stone-900 dark:text-white">{{ tenHienThi(row) }}</strong>
                </span>
              </div>
            </td>
            <td class="px-4 py-3 text-center text-xs tabular-nums">
              {{ ageOf(row.birthDate) ?? '–' }}
            </td>
            <td class="px-4 py-3 text-xs">
              <span v-if="row.className" class="rounded bg-stone-100 px-2 py-0.5 font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-200">
                {{ row.branchName ? `${row.branchName} › ` : '' }}{{ row.className }}
              </span>
              <span v-else class="rounded bg-amber-50 px-1.5 py-0.5 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                Chưa xếp lớp
              </span>
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
              <div v-if="row.area" class="mt-0.5 text-[11px] text-stone-400">
                Giáo họ {{ row.area }}
              </div>
            </td>
            <td class="px-4 py-3">
              <StatusChip domain="student" :value="row.status" />
            </td>
            <td class="px-3 py-3 text-right">
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
          <span class="px-2 py-1 font-semibold tabular-nums">Trang {{ page }} / {{ Math.max(1, Math.ceil(total / pageSize)) }}</span>
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
