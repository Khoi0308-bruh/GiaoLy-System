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
    <div class="rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-stone-50 text-xs font-semibold uppercase text-stone-600 dark:bg-stone-800/70 dark:text-stone-300">
            <tr>
              <th class="p-4">Thời gian</th>
              <th class="p-4">Người thực hiện</th>
              <th class="p-4 text-center">Thao tác</th>
              <th class="p-4">Đối tượng tác động</th>
              <th class="p-4">Địa chỉ IP</th>
              <th class="p-4 text-right">Chi tiết</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
            <tr v-if="loading">
              <td colspan="6" class="p-8 text-center text-sm text-stone-400 animate-pulse">
                Đang tải nhật ký kiểm toán...
              </td>
            </tr>
            <tr v-else-if="logs.length === 0">
              <td colspan="6" class="p-8 text-center text-sm text-stone-500">
                Không có dữ liệu nhật ký phù hợp với bộ lọc.
              </td>
            </tr>
            <tr
              v-for="l in logs"
              :key="l.id"
              class="hover:bg-stone-50/70 dark:hover:bg-stone-800/40"
            >
              <td class="p-4 font-mono text-xs text-stone-500 whitespace-nowrap">
                {{ new Date(l.occurredAt).toLocaleString('vi-VN') }}
              </td>
              <td class="p-4 font-medium text-stone-900 dark:text-stone-100 whitespace-nowrap">
                {{ l.userName || 'Hệ thống / Anonymous' }}
              </td>
              <td class="p-4 text-center">
                <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="getActionBadge(l.action).color">
                  {{ getActionBadge(l.action).label }}
                </span>
              </td>
              <td class="p-4 text-xs">
                <span class="font-semibold text-stone-800 dark:text-stone-200">{{ l.entityType }}</span>
                <span v-if="l.entityId" class="ml-1 font-mono text-stone-400">#{{ l.entityId.substring(0, 8) }}</span>
              </td>
              <td class="p-4 font-mono text-xs text-stone-400">
                {{ l.ipAddress || '—' }}
              </td>
              <td class="p-4 text-right">
                <UButton
                  size="xs"
                  variant="outline"
                  icon="i-lucide-code"
                  @click="openDiffModal(l)"
                >
                  Xem Diff
                </UButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Phân trang -->
      <div v-if="totalPages > 1" class="border-t border-stone-100 p-4 flex items-center justify-between dark:border-stone-800">
        <span class="text-xs text-stone-500">Trang {{ currentPage }} / {{ totalPages }}</span>
        <div class="flex items-center gap-1">
          <UButton
            size="xs"
            variant="ghost"
            :disabled="currentPage <= 1"
            icon="i-lucide-chevron-left"
            @click="currentPage--; loadData()"
          />
          <UButton
            size="xs"
            variant="ghost"
            :disabled="currentPage >= totalPages"
            icon="i-lucide-chevron-right"
            @click="currentPage++; loadData()"
          />
        </div>
      </div>
    </div>

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
