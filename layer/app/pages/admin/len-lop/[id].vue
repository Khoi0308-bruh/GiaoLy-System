<script setup lang="ts">
import { PERMISSIONS } from '~/shared/permissions'
import type { ApiError } from '~/composables/useApi'

definePageMeta({ layout: 'admin', permission: PERMISSIONS.Promotion.View })

interface PromotionBatchDetail {
  id: string
  sourceYearId: string
  sourceYearName: string
  targetYearId: string
  targetYearName: string
  status: 'Draft' | 'Applied' | 'Cancelled'
  createdBy: string
  creatorName?: string | null
  createdAt: string
  appliedAt?: string | null
  applierName?: string | null
  totalStudents: number
  pendingCount: number
  approvedCount: number
  rejectedCount: number
  staleCount: number
  appliedCount: number
  outcomeBreakdown: Record<string, number>
  rowVersion: string
}

interface PromotionDraftItem {
  id: string
  batchId: string
  studentId: string
  studentCode: string
  holyName?: string | null
  fullName: string
  fromEnrollmentId: string
  fromClassRoomId: string
  fromClassRoomName: string
  fromClassLevelId: number
  fromClassLevelName: string
  outcome: 'Promote' | 'Retain' | 'Graduate' | string
  suggestedClassRoomId?: string | null
  suggestedClassRoomName?: string | null
  gpa?: number | null
  attendanceRate?: number | null
  gradeStatus?: string | null
  reason?: string | null
  status: 'Pending' | 'Approved' | 'Rejected' | string
  isStale: boolean
  decidedByName?: string | null
  decidedAt?: string | null
  rowVersion: string
}

interface TargetClassOption {
  id: string
  className: string
  roomName?: string | null
  classLevelName: string
}

const route = useRoute()
const router = useRouter()
const api = useApi()
const toast = useToast()
const { can } = usePermissions()

const batchId = route.params.id as string

const batch = ref<PromotionBatchDetail | null>(null)
const drafts = ref<PromotionDraftItem[]>([])
const targetClasses = ref<TargetClassOption[]>([])
const loading = ref(true)
const error = ref<ApiError | null>(null)

// Bộ lọc
const filterOutcome = ref<string>('ALL')
const filterStatus = ref<string>('ALL')
const searchQuery = ref<string>('')

// Modal Từ chối
const rejectOpen = ref(false)
const rejecting = ref(false)
const selectedDraft = ref<PromotionDraftItem | null>(null)
const rejectReason = ref('')

// Modal Đổi lớp đích
const targetClassOpen = ref(false)
const updatingTargetClass = ref(false)
const selectedTargetClassId = ref<string>('')

// Modal Áp dụng đợt
const applyOpen = ref(false)
const applying = ref(false)
const skipPending = ref(false)

// Modal Hủy đợt
const cancelOpen = ref(false)
const cancelling = ref(false)

// Duyệt nhanh tất cả
const approvingQualified = ref(false)

async function loadData() {
  loading.value = true
  error.value = null
  try {
    const [resBatch, resDrafts] = await Promise.all([
      api.get<PromotionBatchDetail>(`/promotion-batches/${batchId}`),
      api.get<any>(`/promotion-batches/${batchId}/drafts?pageSize=500`)
    ])
    batch.value = resBatch
    drafts.value = resDrafts?.items || resDrafts || []

    if (resBatch?.targetYearId) {
      const cls = await api.get<any[]>(`/academic-years/${resBatch.targetYearId}/classrooms`).catch(() => [])
      targetClasses.value = (cls || []).map(c => ({
        id: c.id,
        className: c.className,
        roomName: c.roomName,
        classLevelName: c.classLevelName
      }))
    }
  } catch (e) {
    error.value = e as ApiError
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

const filteredDrafts = computed(() => {
  return drafts.value.filter(d => {
    if (filterOutcome.value !== 'ALL' && d.outcome !== filterOutcome.value) {
      return false
    }
    if (filterStatus.value !== 'ALL') {
      if (filterStatus.value === 'Stale' && !d.isStale) return false
      if (filterStatus.value !== 'Stale' && d.status !== filterStatus.value) return false
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const matchName = `${d.holyName ?? ''} ${d.fullName}`.toLowerCase().includes(q)
      const matchCode = d.studentCode.toLowerCase().includes(q)
      const matchClass = d.fromClassRoomName.toLowerCase().includes(q)
      return matchName || matchCode || matchClass
    }
    return true
  })
})

// ── Duyệt 1 đề xuất ─────────────────────────────────────
async function handleApprove(draft: PromotionDraftItem) {
  try {
    await api.post(`/promotion-drafts/${draft.id}/approve`)
    toast.add({ title: `Đã duyệt đề xuất cho em ${draft.fullName}`, color: 'success' })
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể duyệt đề xuất', description: err.detail || err.message, color: 'error' })
  }
}

// ── Từ chối 1 đề xuất ────────────────────────────────────
function openRejectModal(draft: PromotionDraftItem) {
  selectedDraft.value = draft
  rejectReason.value = ''
  rejectOpen.value = true
}

async function handleReject() {
  if (!selectedDraft.value || !rejectReason.value.trim()) {
    toast.add({ title: 'Vui lòng nhập lý do từ chối', color: 'error' })
    return
  }
  rejecting.value = true
  try {
    await api.post(`/promotion-drafts/${selectedDraft.value.id}/reject`, {
      reason: rejectReason.value.trim()
    })
    toast.add({ title: 'Đã từ chối đề xuất', color: 'success' })
    rejectOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể từ chối đề xuất', description: err.detail || err.message, color: 'error' })
  } finally {
    rejecting.value = false
  }
}

// ── Đổi lớp đích ────────────────────────────────────────
function openTargetClassModal(draft: PromotionDraftItem) {
  selectedDraft.value = draft
  selectedTargetClassId.value = draft.suggestedClassRoomId || targetClasses.value[0]?.id || ''
  targetClassOpen.value = true
}

async function handleUpdateTargetClass() {
  if (!selectedDraft.value || !selectedTargetClassId.value) return
  updatingTargetClass.value = true
  try {
    await api.put(`/promotion-drafts/${selectedDraft.value.id}/target-class`, {
      targetClassRoomId: selectedTargetClassId.value
    })
    toast.add({ title: 'Đã cập nhật lớp đích thành công', color: 'success' })
    targetClassOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể đổi lớp đích', description: err.detail || err.message, color: 'error' })
  } finally {
    updatingTargetClass.value = false
  }
}

// ── Duyệt hàng loạt đủ điều kiện ────────────────────────
async function handleApproveQualified() {
  approvingQualified.value = true
  try {
    await api.post(`/promotion-batches/${batchId}/approve-qualified`)
    toast.add({ title: 'Đã duyệt hàng loạt các em đủ điều kiện và có lớp đích', color: 'success' })
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Lỗi duyệt hàng loạt', description: err.detail || err.message, color: 'error' })
  } finally {
    approvingQualified.value = false
  }
}

// ── Áp dụng đợt xét ─────────────────────────────────────
async function handleApplyBatch() {
  applying.value = true
  try {
    await api.post(`/promotion-batches/${batchId}/apply`, {
      skipPending: skipPending.value
    })
    toast.add({ title: 'Đã áp dụng đợt xét lên lớp thành công!', color: 'success' })
    applyOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể áp dụng đợt xét', description: err.detail || err.message, color: 'error' })
  } finally {
    applying.value = false
  }
}

// ── Hủy đợt xét ─────────────────────────────────────────
async function handleCancelBatch() {
  cancelling.value = true
  try {
    await api.post(`/promotion-batches/${batchId}/cancel`)
    toast.add({ title: 'Đã hủy đợt xét lên lớp', color: 'success' })
    cancelOpen.value = false
    router.push('/admin/len-lop')
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể hủy đợt xét', description: err.detail || err.message, color: 'error' })
  } finally {
    cancelling.value = false
  }
}

function getOutcomeLabel(outcome: string) {
  switch (outcome) {
    case 'Promote': return { text: 'Lên lớp', color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300' }
    case 'Retain': return { text: 'Ở lại lớp', color: 'text-amber-700 bg-amber-50 dark:bg-amber-950 dark:text-amber-300' }
    case 'Graduate': return { text: 'Tốt nghiệp', color: 'text-marian-700 bg-marian-50 dark:bg-marian-950 dark:text-marian-300' }
    default: return { text: outcome, color: 'text-stone-700 bg-stone-100 dark:bg-stone-800 dark:text-stone-300' }
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-2 text-xs font-medium text-stone-500">
      <NuxtLink to="/admin/len-lop" class="hover:text-marian-600 hover:underline">
        Đợt xét lên lớp
      </NuxtLink>
      <UIcon name="i-lucide-chevron-right" class="h-3 w-3" />
      <span class="text-stone-800 dark:text-stone-200 font-semibold">
        {{ batch ? `${batch.sourceYearName} ➔ ${batch.targetYearName}` : 'Chi tiết đợt xét' }}
      </span>
    </div>

    <ErrorState v-if="error" :error="error" @retry="loadData" />

    <template v-if="batch">
      <PageHeader
        :title="`Xét lên lớp: ${batch.sourceYearName} ➔ ${batch.targetYearName}`"
        :subtitle="`Người tạo: ${batch.creatorName || 'Quản trị viên'} • Tạo ngày: ${new Date(batch.createdAt).toLocaleDateString('vi-VN')}`"
      >
        <template #actions>
          <div class="flex flex-wrap items-center gap-2">
            <!-- Nút Duyệt nhanh đủ điều kiện -->
            <UButton
              v-if="batch.status === 'Draft' && can(PERMISSIONS.Promotion.Decide)"
              variant="outline"
              icon="i-lucide-check-check"
              :loading="approvingQualified"
              @click="handleApproveQualified"
            >
              Duyệt nhanh em đủ điều kiện
            </UButton>

            <!-- Nút Hủy đợt -->
            <UButton
              v-if="batch.status === 'Draft' && can(PERMISSIONS.Promotion.Create)"
              color="error"
              variant="outline"
              icon="i-lucide-x-circle"
              @click="cancelOpen = true"
            >
              Hủy đợt
            </UButton>

            <!-- Nút Áp dụng đợt -->
            <UButton
              v-if="batch.status === 'Draft' && can(PERMISSIONS.Promotion.Apply)"
              color="primary"
              icon="i-lucide-send"
              @click="applyOpen = true"
            >
              Áp dụng đợt lên lớp
            </UButton>
          </div>
        </template>
      </PageHeader>

      <!-- Cảnh báo Stale nếu có đề xuất bị thay đổi điểm -->
      <div
        v-if="batch.staleCount > 0"
        class="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/40"
      >
        <UIcon name="i-lucide-alert-triangle" class="h-5 w-5 text-amber-600 mt-0.5" />
        <div>
          <h4 class="font-bold text-amber-900 dark:text-amber-200">
            Có {{ batch.staleCount }} đề xuất cần xem lại (Dữ liệu Stale)
          </h4>
          <p class="text-xs text-amber-700 dark:text-amber-300">
            Điểm số hoặc chuyên cần của một số em vừa được chỉnh sửa sau khi tạo đợt. Hãy nhấn nút "Duyệt" trên từng dòng để hệ thống tính lại và làm mới đề xuất!
          </p>
        </div>
      </div>

      <!-- Thống kê tiến độ đợt xét -->
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <StatCard
          label="Tổng đoàn sinh"
          :value="batch.totalStudents"
          icon="i-lucide-users"
        />
        <StatCard
          label="Chờ duyệt"
          :value="batch.pendingCount"
          icon="i-lucide-clock"
          :class="batch.pendingCount > 0 ? 'text-amber-600' : ''"
        />
        <StatCard
          label="Đã duyệt"
          :value="batch.approvedCount"
          icon="i-lucide-check-circle"
          class="text-emerald-600"
        />
        <StatCard
          label="Từ chối"
          :value="batch.rejectedCount"
          icon="i-lucide-x-circle"
          :class="batch.rejectedCount > 0 ? 'text-red-500' : ''"
        />
        <StatCard
          label="Trạng thái đợt"
          :value="batch.status === 'Draft' ? 'Đang xét' : batch.status === 'Applied' ? 'Đã áp dụng' : 'Đã hủy'"
          icon="i-lucide-tag"
          :class="batch.status === 'Applied' ? 'text-primary-600' : ''"
        />
      </div>

      <!-- Bộ lọc và tìm kiếm -->
      <div class="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-stone-800 dark:bg-stone-900">
        <div class="flex flex-wrap items-center gap-3">
          <!-- Lọc Outcome -->
          <div class="flex items-center gap-2">
            <label class="text-xs font-semibold uppercase text-stone-500">Đề xuất:</label>
            <select
              v-model="filterOutcome"
              class="h-8 rounded-lg border border-stone-200 bg-stone-50 px-2 text-xs font-medium dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
            >
              <option value="ALL">Tất cả đề xuất</option>
              <option value="Promote">Lên lớp</option>
              <option value="Retain">Ở lại lớp</option>
              <option value="Graduate">Tốt nghiệp</option>
            </select>
          </div>

          <!-- Lọc Status -->
          <div class="flex items-center gap-2">
            <label class="text-xs font-semibold uppercase text-stone-500">Trạng thái:</label>
            <select
              v-model="filterStatus"
              class="h-8 rounded-lg border border-stone-200 bg-stone-50 px-2 text-xs font-medium dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="Pending">Chờ duyệt</option>
              <option value="Approved">Đã duyệt</option>
              <option value="Rejected">Từ chối</option>
              <option value="Stale">Cần xem lại (Stale)</option>
            </select>
          </div>
        </div>

        <!-- Tìm kiếm -->
        <div class="w-full sm:w-64">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Tìm tên, mã ĐS, lớp..."
            size="xs"
          />
        </div>
      </div>

      <!-- Bảng danh sách đề xuất -->
      <div class="rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-stone-50 text-xs font-semibold uppercase text-stone-600 dark:bg-stone-800/70 dark:text-stone-300">
              <tr>
                <th class="p-3 w-10 text-center">STT</th>
                <th class="p-3">Mã ĐS</th>
                <th class="p-3">Tên thánh & Họ tên</th>
                <th class="p-3">Lớp hiện tại</th>
                <th class="p-3 text-center">ĐTB / Vắng</th>
                <th class="p-3 text-center">Đề xuất</th>
                <th class="p-3">Lớp đích dự kiến</th>
                <th class="p-3 text-center">Trạng thái duyệt</th>
                <th v-if="batch.status === 'Draft' && can(PERMISSIONS.Promotion.Decide)" class="p-3 text-right">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
              <tr v-if="loading">
                <td colspan="9" class="p-8 text-center text-sm text-stone-400 animate-pulse">
                  Đang tải danh sách đề xuất...
                </td>
              </tr>
              <tr v-else-if="filteredDrafts.length === 0">
                <td colspan="9" class="p-8 text-center text-sm text-stone-500">
                  Không có đề xuất nào khớp với điều kiện lọc.
                </td>
              </tr>
              <tr
                v-for="(d, idx) in filteredDrafts"
                :key="d.id"
                class="hover:bg-stone-50/70 dark:hover:bg-stone-800/40"
                :class="d.isStale ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''"
              >
                <td class="p-3 text-center text-xs text-stone-400 font-mono">{{ idx + 1 }}</td>
                <td class="p-3 font-mono text-xs font-semibold text-marian-600 dark:text-marian-400">
                  {{ d.studentCode }}
                </td>
                <td class="p-3 font-medium text-stone-900 dark:text-stone-100 whitespace-nowrap">
                  <NuxtLink :to="`/admin/doan-sinh/${d.studentId}`" class="hover:underline">
                    {{ d.holyName ? `${d.holyName} ` : '' }}{{ d.fullName }}
                  </NuxtLink>
                </td>
                <td class="p-3 text-xs text-stone-600 dark:text-stone-300">
                  <p class="font-semibold">{{ d.fromClassRoomName }}</p>
                  <p class="text-[11px] text-stone-400">{{ d.fromClassLevelName }}</p>
                </td>
                <td class="p-3 text-center font-mono text-xs whitespace-nowrap">
                  <p class="font-bold text-stone-800 dark:text-stone-200">
                    ĐTB: {{ d.gpa?.toFixed(1) ?? '—' }}
                  </p>
                  <p class="text-[11px] text-stone-400">
                    Chuyên cần: {{ d.attendanceRate ? `${d.attendanceRate}%` : '—' }}
                  </p>
                </td>
                <td class="p-3 text-center">
                  <span
                    class="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    :class="getOutcomeLabel(d.outcome).color"
                  >
                    {{ getOutcomeLabel(d.outcome).text }}
                  </span>
                </td>
                <td class="p-3 text-xs">
                  <div class="flex items-center gap-1.5">
                    <span v-if="d.suggestedClassRoomName" class="font-semibold text-stone-800 dark:text-stone-200">
                      {{ d.suggestedClassRoomName }}
                    </span>
                    <span v-else class="italic text-stone-400">Chưa xếp lớp</span>

                    <button
                      v-if="batch.status === 'Draft' && can(PERMISSIONS.Promotion.Decide)"
                      type="button"
                      class="text-marian-600 hover:text-marian-700 dark:text-marian-400"
                      title="Chọn lại lớp đích"
                      @click="openTargetClassModal(d)"
                    >
                      <UIcon name="i-lucide-pencil" class="h-3 w-3" />
                    </button>
                  </div>
                </td>
                <td class="p-3 text-center">
                  <div class="inline-flex flex-col items-center gap-0.5">
                    <StatusChip domain="draft" :value="d.status" />
                    <span
                      v-if="d.isStale"
                      class="rounded bg-amber-100 px-1.5 py-0.2 text-[10px] font-bold text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                    >
                      Stale
                    </span>
                  </div>
                </td>
                <td v-if="batch.status === 'Draft' && can(PERMISSIONS.Promotion.Decide)" class="p-3 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1">
                    <UButton
                      size="xs"
                      variant="ghost"
                      color="primary"
                      icon="i-lucide-check"
                      :title="d.status === 'Approved' ? 'Duyệt lại' : 'Duyệt đề xuất'"
                      @click="handleApprove(d)"
                    >
                      Duyệt
                    </UButton>
                    <UButton
                      v-if="d.status === 'Pending'"
                      size="xs"
                      variant="ghost"
                      color="error"
                      icon="i-lucide-x"
                      title="Từ chối đề xuất"
                      @click="openRejectModal(d)"
                    >
                      Từ chối
                    </UButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Modal Từ Chối Đề Xuất -->
    <UModal
      v-model:open="rejectOpen"
      title="Từ chối đề xuất lên lớp"
      :description="`Đoàn sinh: ${selectedDraft?.holyName ? selectedDraft.holyName + ' ' : ''}${selectedDraft?.fullName}`"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Lý do từ chối <span class="text-red-500">*</span>
            </label>
            <UTextarea
              v-model="rejectReason"
              placeholder="Nhập lý do không đồng ý với đề xuất của hệ thống..."
              :rows="3"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="rejectOpen = false">Hủy</UButton>
          <UButton
            color="error"
            :loading="rejecting"
            :disabled="!rejectReason.trim()"
            @click="handleReject"
          >
            Xác nhận từ chối
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Chọn Lớp Đích -->
    <UModal
      v-model:open="targetClassOpen"
      title="Chọn lớp đích cho đoàn sinh"
      :description="`Đoàn sinh: ${selectedDraft?.holyName ? selectedDraft.holyName + ' ' : ''}${selectedDraft?.fullName}`"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Lớp thuộc niên khóa {{ batch?.targetYearName }} <span class="text-red-500">*</span>
            </label>
            <select
              v-model="selectedTargetClassId"
              class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            >
              <option v-for="c in targetClasses" :key="c.id" :value="c.id">
                {{ c.className }} ({{ c.classLevelName }} - {{ c.roomName || 'Chưa xếp phòng' }})
              </option>
            </select>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="targetClassOpen = false">Hủy</UButton>
          <UButton
            color="primary"
            :loading="updatingTargetClass"
            :disabled="!selectedTargetClassId"
            @click="handleUpdateTargetClass"
          >
            Lưu lớp đích
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Áp Dụng Đợt Lên Lớp -->
    <UModal
      v-model:open="applyOpen"
      title="Xác nhận áp dụng đợt lên lớp"
      description="Thao tác này sẽ chính thức tạo ghi danh mới trong niên khóa tiếp theo và kết thúc ghi danh cũ."
    >
      <template #body>
        <div class="space-y-4">
          <div class="rounded-xl border border-stone-200 bg-stone-50 p-4 text-xs dark:border-stone-800 dark:bg-stone-800/50">
            <p class="font-bold text-stone-800 dark:text-stone-200 mb-1">Tóm tắt đợt xét:</p>
            <ul class="space-y-1 text-stone-600 dark:text-stone-400">
              <li>• Đã duyệt: <strong>{{ batch?.approvedCount }}</strong> em (sẽ được tạo ghi danh mới).</li>
              <li>• Từ chối: <strong>{{ batch?.rejectedCount }}</strong> em.</li>
              <li>• Đang chờ duyệt: <strong>{{ batch?.pendingCount }}</strong> em.</li>
            </ul>
          </div>

          <div v-if="batch && batch.pendingCount > 0" class="flex items-center gap-2">
            <input
              id="skipPendingCheck"
              type="checkbox"
              v-model="skipPending"
              class="rounded text-marian-600"
            />
            <label for="skipPendingCheck" class="text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
              Bỏ qua các đề xuất chưa duyệt (Skip Pending) và áp dụng những em đã duyệt
            </label>
          </div>

          <p class="text-xs text-amber-700 dark:text-amber-400">
            ⚠️ Lưu ý: Sau khi áp dụng thành công, đợt xét sẽ được đóng và không thể chỉnh sửa thêm.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="applyOpen = false">Hủy</UButton>
          <UButton
            color="primary"
            :loading="applying"
            :disabled="batch?.approvedCount === 0 || (batch?.pendingCount > 0 && !skipPending)"
            @click="handleApplyBatch"
          >
            Chính thức áp dụng
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Hủy Đợt Xét -->
    <UModal
      v-model:open="cancelOpen"
      title="Xác nhận hủy đợt xét"
      description="Đợt xét và toàn bộ đề xuất dự thảo sẽ bị hủy bỏ hoàn toàn."
    >
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="cancelOpen = false">Quay lại</UButton>
          <UButton color="error" :loading="cancelling" @click="handleCancelBatch">
            Xác nhận hủy đợt
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
