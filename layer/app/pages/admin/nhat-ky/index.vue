<script setup lang="ts">
import { PERMISSIONS } from '../../../shared/permissions'
import type { ApiError } from '../../../composables/useApi'

definePageMeta({ layout: 'admin', permission: PERMISSIONS.Audit.View })

interface AuditLogItem {
  id: number
  occurredAt: string
  userId?: string | null
  userName?: string | null
  action: string
  entityType: string
  entityId?: string | null
  oldValues?: string | null
  newValues?: string | null
  ipAddress?: string | null
  userAgent?: string | null
  correlationId?: string | null
}

interface PagedAuditResult {
  items: AuditLogItem[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

const api = useApi()

const logs = ref<AuditLogItem[]>([])
const totalCount = ref(0)
const currentPage = ref(1)
const totalPages = ref(1)
const loading = ref(true)
const error = ref<ApiError | null>(null)

// Bộ lọc
const filterEntityType = ref<string>('ALL')
const filterAction = ref<string>('ALL')
const filterFromDate = ref<string>('')
const filterToDate = ref<string>('')

// Modal xem chi tiết thay đổi Old/New values
const diffOpen = ref(false)
const selectedLog = ref<AuditLogItem | null>(null)

async function loadData() {
  loading.value = true
  error.value = null
  try {
    const params: Record<string, string | number> = {
      page: currentPage.value,
      pageSize: 20
    }
    if (filterEntityType.value !== 'ALL') params.entityType = filterEntityType.value
    if (filterAction.value !== 'ALL') params.action = filterAction.value
    if (filterFromDate.value) params.fromDate = filterFromDate.value
    if (filterToDate.value) params.toDate = filterToDate.value

    const res = await api.get<PagedAuditResult>('/audit-logs', params)
    logs.value = res?.items || []
    totalCount.value = res?.totalCount || 0
    totalPages.value = res?.totalPages || 1
  } catch (e) {
    error.value = e as ApiError
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

function openDiffModal(log: AuditLogItem) {
  selectedLog.value = log
  diffOpen.value = true
}

function formatJson(val?: string | null) {
  if (!val) return '—'
  try {
    return JSON.stringify(JSON.parse(val), null, 2)
  } catch {
    return val
  }
}

function getActionBadge(action: string) {
  const act = (action || '').toUpperCase()
  if (act.includes('CREATE') || act.includes('INSERT')) return { label: action, color: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' }
  if (act.includes('UPDATE') || act.includes('EDIT')) return { label: action, color: 'bg-marian-50 text-marian-800 dark:bg-marian-950 dark:text-marian-300' }
  if (act.includes('DELETE') || act.includes('CANCEL')) return { label: action, color: 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300' }
  if (act.includes('UNLOCK')) return { label: action, color: 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300' }
  return { label: action, color: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300' }
}

/** Tách ngày/giờ để cột Thời gian hẹp không phải cắt chuỗi. */
/** 8 ký tự đầu của id bản ghi, dùng ở cả bảng và thẻ. */
function shortId(id?: string | null) {
  return id ? id.substring(0, 8) : ''
}

/** "13:33:59 25/11/2026" cho thẻ mobile. */
function logStamp(iso: string) {
  const t = logTime(iso)
  return `${t.time} ${t.date}`
}

function logTime(iso: string) {
  const d = new Date(iso)
  return {
    date: d.toLocaleDateString('vi-VN'),
    time: d.toLocaleTimeString('vi-VN', { hour12: false })
  }
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Nhật Ký Kiểm Toán Hệ Thống (Audit Logs)"
      subtitle="Theo dõi và lưu vết minh bạch mọi thao tác thay đổi dữ liệu trong hệ thống phục vụ an toàn thông tin"
    />

    <ErrorState v-if="error" :error="error" @retry="loadData" />

    <!-- Bộ lọc -->
    <div class="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-stone-800 dark:bg-stone-900">
      <div class="flex flex-wrap items-center gap-3">
        <!-- Thực thể -->
        <div class="flex items-center gap-2">
          <label class="text-xs font-semibold uppercase text-stone-500">Đối tượng:</label>
          <select
            v-model="filterEntityType"
            class="h-9 rounded-lg border border-stone-200 bg-stone-50 px-2.5 text-xs font-medium dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
            @change="currentPage = 1; loadData()"
          >
            <option value="ALL">Tất cả đối tượng</option>
            <option value="Student">Đoàn sinh (Student)</option>
            <option value="ClassRoom">Lớp học (ClassRoom)</option>
            <option value="Grade">Điểm số (Grade)</option>
            <option value="GradeUnlock">Mở khóa sổ điểm</option>
            <option value="Enrollment">Ghi danh (Enrollment)</option>
            <option value="PromotionBatch">Xét lên lớp</option>
            <option value="CampEvent">Sự kiện & Trại</option>
            <option value="User">Người dùng (User)</option>
            <option value="Role">Vai trò (Role)</option>
          </select>
        </div>

        <!-- Hành động -->
        <div class="flex items-center gap-2">
          <label class="text-xs font-semibold uppercase text-stone-500">Thao tác:</label>
          <select
            v-model="filterAction"
            class="h-9 rounded-lg border border-stone-200 bg-stone-50 px-2.5 text-xs font-medium dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
            @change="currentPage = 1; loadData()"
          >
            <option value="ALL">Tất cả thao tác</option>
            <option value="Create">Tạo mới (Create)</option>
            <option value="Update">Chỉnh sửa (Update)</option>
            <option value="Delete">Xóa (Delete)</option>
            <option value="Unlock">Mở khóa (Unlock)</option>
            <option value="Approve">Duyệt (Approve)</option>
            <option value="Apply">Áp dụng (Apply)</option>
          </select>
        </div>

        <!-- Khoảng ngày -->
        <div class="flex items-center gap-1.5 text-xs text-stone-500">
          <span>Từ:</span>
          <input
            v-model="filterFromDate"
            type="date"
            class="h-9 rounded-lg border border-stone-200 bg-stone-50 px-2 text-xs dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
            @change="currentPage = 1; loadData()"
          />
          <span>Đến:</span>
          <input
            v-model="filterToDate"
            type="date"
            class="h-9 rounded-lg border border-stone-200 bg-stone-50 px-2 text-xs dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
            @change="currentPage = 1; loadData()"
          />
        </div>
      </div>

      <div class="text-xs text-stone-500 font-mono">
        Tổng số: <strong>{{ totalCount }}</strong> bản ghi
      </div>
    </div>

    <!-- Bảng nhật ký -->
    <ListTable
      :columns="6"
      :loading="loading"
      :empty="logs.length === 0"
      loading-text="Đang tải nhật ký kiểm toán…"
      empty-title="Không có bản ghi nào"
      empty-description="Không có dữ liệu nhật ký phù hợp với bộ lọc đang chọn."
      :footer="totalPages > 1"
    >
      <template #head>
        <th class="w-[21%] px-4 py-3">Thời gian</th>
        <th class="w-[19%] px-4 py-3">Người thực hiện</th>
        <th class="w-[13%] px-4 py-3">Thao tác</th>
        <th class="w-[23%] px-4 py-3">Đối tượng</th>
        <th class="w-[13%] px-4 py-3">IP</th>
        <th class="w-[11%] px-3 py-3 text-right">Chi tiết</th>
      </template>

      <template #rows>
        <tr
          v-for="l in logs"
          :key="l.id"
          class="transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50"
        >
          <td class="px-4 py-3">
            <p class="text-xs font-medium text-stone-700 dark:text-stone-300">{{ logTime(l.occurredAt).date }}</p>
            <p class="mt-0.5 font-mono text-[11px] text-stone-400">{{ logTime(l.occurredAt).time }}</p>
          </td>
          <td class="px-4 py-3 text-xs">
            <span class="block truncate font-medium text-stone-900 dark:text-stone-100" :title="l.userName || undefined">
              {{ l.userName || 'Hệ thống' }}
            </span>
          </td>
          <td class="px-4 py-3">
            <span
              class="rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap"
              :class="getActionBadge(l.action).color"
            >
              {{ getActionBadge(l.action).label }}
            </span>
          </td>
          <td class="px-4 py-3 text-xs">
            <span class="block truncate font-semibold text-stone-800 dark:text-stone-200">{{ l.entityType }}</span>
            <span v-if="l.entityId" class="mt-0.5 block truncate font-mono text-[11px] text-stone-400">
              #{{ shortId(l.entityId) }}
            </span>
          </td>
          <td class="px-4 py-3">
            <span class="block truncate font-mono text-[11px] text-stone-400" :title="l.ipAddress || undefined">
              {{ l.ipAddress || '—' }}
            </span>
          </td>
          <td class="px-3 py-3">
            <div class="flex justify-end">
              <UButton
                size="xs"
                variant="outline"
                color="neutral"
                icon="i-lucide-code"
                :aria-label="`Xem chi tiết thay đổi #${l.id}`"
                title="Xem Diff"
                @click="openDiffModal(l)"
              >
                <span class="hidden xl:inline">Xem Diff</span>
              </UButton>
            </div>
          </td>
        </tr>
      </template>

      <template #cards>
        <div v-for="l in logs" :key="l.id" class="space-y-1.5 px-4 py-3">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-stone-900 dark:text-stone-100">{{ l.userName || 'Hệ thống' }}</p>
              <p class="font-mono text-[11px] text-stone-400">{{ logStamp(l.occurredAt) }}</p>
            </div>
            <span
              class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap"
              :class="getActionBadge(l.action).color"
            >
              {{ getActionBadge(l.action).label }}
            </span>
          </div>
          <p class="flex flex-wrap items-center gap-x-1.5 text-[11px] text-stone-500">
            <span class="font-semibold text-stone-700 dark:text-stone-300">{{ l.entityType }}</span>
            <span v-if="l.entityId" class="font-mono text-stone-400">#{{ shortId(l.entityId) }}</span>
            <span v-if="l.ipAddress" class="font-mono text-stone-400">· {{ l.ipAddress }}</span>
          </p>
          <div class="flex justify-end">
            <UButton
              size="xs"
              variant="outline"
              color="neutral"
              icon="i-lucide-code"
              :aria-label="`Xem chi tiết thay đổi #${l.id}`"
              @click="openDiffModal(l)"
            >
              Xem Diff
            </UButton>
          </div>
        </div>
      </template>

      <template #footer>
        <span class="tabular-nums">Trang {{ currentPage }} / {{ totalPages }}</span>
        <div class="flex items-center gap-1">
          <UButton
            size="xs"
            variant="ghost"
            color="neutral"
            aria-label="Trang trước"
            :disabled="currentPage <= 1"
            icon="i-lucide-chevron-left"
            @click="currentPage--; loadData()"
          />
          <UButton
            size="xs"
            variant="ghost"
            color="neutral"
            aria-label="Trang sau"
            :disabled="currentPage >= totalPages"
            icon="i-lucide-chevron-right"
            @click="currentPage++; loadData()"
          />
        </div>
      </template>
    </ListTable>

    <!-- Modal Xem Chi Tiết Diff Old / New Values -->
    <UModal
      v-model:open="diffOpen"
      :title="`Chi tiết thay đổi #${selectedLog?.id} (${selectedLog?.action} ${selectedLog?.entityType})`"
    >
      <template #body>
        <div v-if="selectedLog" class="space-y-4">
          <div class="grid grid-cols-2 gap-2 text-xs text-stone-500">
            <div>Người thực hiện: <strong>{{ selectedLog.userName || 'Hệ thống' }}</strong></div>
            <div>Thời gian: {{ new Date(selectedLog.occurredAt).toLocaleString('vi-VN') }}</div>
            <div>Đối tượng ID: <strong class="font-mono">{{ selectedLog.entityId || '—' }}</strong></div>
            <div>IP: <strong class="font-mono">{{ selectedLog.ipAddress || '—' }}</strong></div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span class="block text-xs font-semibold uppercase text-stone-500 mb-1">Dữ liệu cũ (Old Values)</span>
              <pre class="max-h-60 overflow-y-auto rounded-lg bg-stone-900 p-3 font-mono text-[11px] text-red-300">{{ formatJson(selectedLog.oldValues) }}</pre>
            </div>
            <div>
              <span class="block text-xs font-semibold uppercase text-stone-500 mb-1">Dữ liệu mới (New Values)</span>
              <pre class="max-h-60 overflow-y-auto rounded-lg bg-stone-900 p-3 font-mono text-[11px] text-emerald-300">{{ formatJson(selectedLog.newValues) }}</pre>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <UButton variant="outline" @click="diffOpen = false">Đóng</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
