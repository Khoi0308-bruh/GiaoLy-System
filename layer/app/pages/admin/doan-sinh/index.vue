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


const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))

/** Số trang rút gọn: luôn có trang đầu/cuối và tối đa 5 trang quanh trang hiện tại (null = dấu "…"). */
const pageItems = computed<(number | null)[]>(() => {
  const last = totalPages.value
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1)
  const start = Math.max(2, Math.min(page.value - 2, last - 4))
  const end = Math.min(last - 1, Math.max(page.value + 2, 5))
  const items: (number | null)[] = [1]
  if (start > 2) items.push(null)
  for (let p = start; p <= end; p++) items.push(p)
  if (end < last - 1) items.push(null)
  items.push(last)
  return items
})

/** Dòng phụ dưới tên: mã hồ sơ và tuổi, bỏ phần nào thiếu. */
function subLine(row: StudentRow) {
  const age = ageOf(row.birthDate)
  return [maHienThi(row), age === null ? null : `${age} tuổi`].filter(Boolean).join(' · ')
}

/** "1–20 / 183" cho dòng phân trang. */
const rangeLabel = computed(() => rows.value.length
  ? `${(page.value - 1) * pageSize + 1}–${(page.value - 1) * pageSize + rows.value.length} / ${total.value}`
  : `0 / ${total.value}`)
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

    <!-- Danh sách đoàn sinh: bảng ≥md (header dính khi cuộn), thẻ <md -->
    <ListTable
      :columns="5"
      :loading="loading"
      :empty="rows.length === 0"
      loading-text="Đang tải danh sách đoàn sinh..."
      empty-title="Không tìm thấy đoàn sinh nào"
      empty-description="Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc trạng thái. Bạn chỉ thấy đoàn sinh trong phạm vi phân công của mình."
      :footer="total > pageSize"
    >
      <template #head>
        <th class="w-[36%] px-4 py-3">Đoàn sinh</th>
        <th class="w-[21%] px-4 py-3">Ngành › Lớp</th>
        <th class="w-[23%] px-4 py-3">Phụ huynh</th>
        <th class="w-[15%] px-4 py-3">Trạng thái</th>
        <th class="w-10 px-3 py-3"><span class="sr-only">Mở hồ sơ</span></th>
      </template>

      <template #rows>
        <tr
          v-for="row in rows"
          :key="row.id"
          class="cursor-pointer transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50"
          @click="navigateTo(`/admin/doan-sinh/${row.id}`)"
        >
          <td class="px-4 py-3">
            <div class="flex items-center gap-3">
              <span class="grid size-9 shrink-0 place-items-center rounded-full bg-marian-50 text-xs font-bold text-marian-700 dark:bg-marian-950 dark:text-marian-300">
                {{ chuDau(row) }}
              </span>
              <span class="min-w-0">
                <span v-if="row.holyName" class="block truncate text-[11px] font-semibold text-vatican-600 dark:text-vatican-400">
                  {{ row.holyName }}
                </span>
                <strong class="block truncate text-stone-900 dark:text-white">{{ tenHienThi(row) }}</strong>
                <span class="mt-0.5 block truncate font-mono text-[11px] text-stone-400">{{ subLine(row) }}</span>
              </span>
            </div>
          </td>
          <td class="px-4 py-3 text-xs">
            <span v-if="row.className" class="line-clamp-2 font-medium text-stone-700 dark:text-stone-200">
              <template v-if="row.branchName">{{ row.branchName }} › </template>{{ row.className }}
            </span>
            <span v-else class="rounded bg-amber-50 px-1.5 py-0.5 whitespace-nowrap text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              Chưa xếp lớp
            </span>
          </td>
          <td class="px-4 py-3 text-xs">
            <div class="truncate font-medium text-stone-800 dark:text-stone-200">
              {{ row.primaryGuardianName || '–' }}
            </div>
            <MaskedField
              :value="row.primaryGuardianPhone"
              :permission="PERMISSIONS.Students.ViewContact"
              placeholder="Đã ẩn SĐT"
            />
            <div v-if="row.area" class="mt-0.5 truncate text-[11px] text-stone-400">
              Giáo họ {{ row.area }}
            </div>
          </td>
          <td class="px-4 py-3">
            <StatusChip domain="student" :value="row.status" />
          </td>
          <td class="px-3 py-3 text-right">
            <!-- Thêm menu thao tác trong hàng ở đây thì phải @click.stop trên chính nút mở
                 menu, nếu không sự kiện nổi bọt lên <tr> và trang điều hướng mất. -->
            <UButton
              size="xs"
              variant="ghost"
              color="neutral"
              icon="i-lucide-chevron-right"
              :aria-label="`Mở hồ sơ ${tenHienThi(row)}`"
              @click.stop="navigateTo(`/admin/doan-sinh/${row.id}`)"
            />
          </td>
        </tr>
      </template>

      <template #cards>
        <NuxtLink
          v-for="row in rows"
          :key="row.id"
          :to="`/admin/doan-sinh/${row.id}`"
          class="flex items-start gap-3 px-4 py-3 hover:bg-stone-50 dark:hover:bg-stone-800/50"
        >
          <span class="grid size-10 shrink-0 place-items-center rounded-full bg-marian-50 text-sm font-bold text-marian-700 dark:bg-marian-950 dark:text-marian-300">
            {{ chuDau(row) }}
          </span>
          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-2">
              <span class="min-w-0">
                <span v-if="row.holyName" class="block truncate text-[11px] font-semibold text-vatican-600 dark:text-vatican-400">
                  {{ row.holyName }}
                </span>
                <strong class="block truncate text-sm text-stone-900 dark:text-white">{{ tenHienThi(row) }}</strong>
              </span>
              <StatusChip domain="student" :value="row.status" class="shrink-0" />
            </div>
            <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-stone-500">
              <span class="font-mono">{{ subLine(row) }}</span>
              <span v-if="row.className" class="rounded bg-stone-100 px-1.5 py-0.5 font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-200">
                {{ row.branchName ? `${row.branchName} › ` : '' }}{{ row.className }}
              </span>
              <span v-else class="rounded bg-amber-50 px-1.5 py-0.5 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                Chưa xếp lớp
              </span>
            </div>
            <div v-if="row.primaryGuardianName || row.primaryGuardianPhone" class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-stone-500">
              <UIcon name="i-lucide-phone" class="size-3 shrink-0" />
              <span class="truncate">{{ row.primaryGuardianName || 'Phụ huynh' }}</span>
              <MaskedField
                :value="row.primaryGuardianPhone"
                :permission="PERMISSIONS.Students.ViewContact"
                placeholder="Đã ẩn SĐT"
              />
              <span v-if="row.area" class="text-stone-400">· Giáo họ {{ row.area }}</span>
            </div>
          </div>
          <UIcon name="i-lucide-chevron-right" class="mt-1.5 size-4 shrink-0 text-stone-300" />
        </NuxtLink>
      </template>

      <template #footer>
        <span class="tabular-nums">Hiển thị {{ rangeLabel }} đoàn sinh</span>
        <nav class="flex items-center gap-1" aria-label="Phân trang danh sách đoàn sinh">
          <UButton
            size="xs"
            variant="ghost"
            color="neutral"
            icon="i-lucide-chevron-left"
            aria-label="Trang trước"
            :disabled="page <= 1"
            @click="page--"
          />
          <template v-for="(p, i) in pageItems" :key="`${p ?? 'gap'}-${i}`">
            <span v-if="p === null" class="px-1 text-stone-400">…</span>
            <UButton
              v-else
              size="xs"
              :variant="p === page ? 'solid' : 'ghost'"
              :color="p === page ? 'primary' : 'neutral'"
              class="min-w-7 justify-center tabular-nums"
              :aria-current="p === page ? 'page' : undefined"
              @click="page = p"
            >
              {{ p }}
            </UButton>
          </template>
          <UButton
            size="xs"
            variant="ghost"
            color="neutral"
            icon="i-lucide-chevron-right"
            aria-label="Trang sau"
            :disabled="page >= totalPages"
            @click="page++"
          />
        </nav>
      </template>
    </ListTable>
  </div>
</template>
