<script setup lang="ts">
import { PERMISSIONS } from '../../../../shared/permissions'
import type { ApiError } from '../../../../composables/useApi'

definePageMeta({ layout: 'admin', permission: PERMISSIONS.Grades.View })

interface GradeRow {
  id: string
  enrollmentId: string
  studentId: string
  studentCode: string
  holyName?: string | null
  fullName: string
  oral: number | null
  smallTest: number | null
  bigTest: number | null
  finalExam: number | null
  totalSessions: number | null
  absences: number | null
  computedGpa: number | null
  computedStatus: 'Qualified' | 'NotQualified' | 'Incomplete' | null
  attendanceRate: number | null
  remarks?: string | null
  rowVersion: string
}

interface ClassGradesResponse {
  classRoomId: string
  classRoomName: string
  academicYearId: string
  academicYearName: string
  academicYearStatus: 'Planned' | 'Active' | 'Closing' | 'Archived'
  isLocked: boolean
  lockReason?: string | null
  grades: GradeRow[]
}

interface GradeUnlockItem {
  id: string
  classRoomId: string
  unlockedBy: string
  unlockedByName?: string | null
  reason: string
  unlockedAt: string
  expiresAt: string
  closedAt?: string | null
  isActive: boolean
}

const route = useRoute()
const api = useApi()
const toast = useToast()
const { can } = usePermissions()

const classRoomId = route.params.id as string

const sheet = ref<ClassGradesResponse | null>(null)
const draft = ref<GradeRow[]>([])
const loading = ref(true)
const saving = ref(false)
const exporting = ref(false)
const error = ref<ApiError | null>(null)
const conflicts = ref<string[]>([])

// Mở khóa sổ điểm
const unlockHistory = ref<GradeUnlockItem[]>([])
const unlockHistoryOpen = ref(false)
const unlockModalOpen = ref(false)
const unlocking = ref(false)
const unlockForm = ref({
  reason: '',
  durationHours: 72
})

// Xem chi tiết điểm một học sinh
const detailModalOpen = ref(false)
const selectedStudentGrade = ref<GradeRow | null>(null)
const loadingSingleGrade = ref(false)

const activeUnlock = computed(() => {
  return unlockHistory.value.find(u => u.isActive && new Date(u.expiresAt) > new Date())
})

const isLocked = computed(() => {
  if (!sheet.value) return false
  if (activeUnlock.value) return false
  return sheet.value.isLocked || sheet.value.academicYearStatus !== 'Active'
})

const editable = computed(() => can(PERMISSIONS.Grades.Update) && !isLocked.value)

async function load() {
  loading.value = true
  error.value = null
  try {
    const [resSheet, resUnlocks] = await Promise.all([
      api.get<ClassGradesResponse>(`/classrooms/${classRoomId}/grades`),
      api.get<GradeUnlockItem[]>(`/classrooms/${classRoomId}/grade-unlocks`).catch(() => [])
    ])
    sheet.value = resSheet
    unlockHistory.value = resUnlocks || []
    draft.value = (resSheet.grades || []).map(r => ({ ...r }))
  } catch (e) {
    error.value = e as ApiError
  } finally {
    loading.value = false
  }
}

onMounted(load)

function invalidGrade(val: number | null) {
  return val !== null && (Number.isNaN(val) || val < 0 || val > 10)
}

function computeLiveGpa(r: GradeRow): number | null {
  if (r.oral === null && r.smallTest === null && r.bigTest === null && r.finalExam === null) {
    return r.computedGpa
  }
  const m = r.oral ?? 0
  const sm = r.smallTest ?? 0
  const bg = r.bigTest ?? 0
  const fn = r.finalExam ?? 0
  const gpa = (m * 1 + sm * 1 + bg * 2 + fn * 3) / 7
  return Math.round(gpa * 10) / 10
}

const hasInvalid = computed(() => draft.value.some(r =>
  [r.oral, r.smallTest, r.bigTest, r.finalExam].some(invalidGrade)
  || (r.absences !== null && r.totalSessions !== null && r.absences > r.totalSessions)
))

async function save() {
  if (hasInvalid.value) {
    toast.add({ title: 'Vui lòng kiểm tra lại điểm (từ 0-10) và số buổi vắng', color: 'error' })
    return
  }
  saving.value = true
  conflicts.value = []
  try {
    await api.put(`/classrooms/${classRoomId}/grades`, {
      grades: draft.value.map(r => ({
        enrollmentId: r.enrollmentId,
        oral: r.oral,
        smallTest: r.smallTest,
        bigTest: r.bigTest,
        finalExam: r.finalExam,
        totalSessions: r.totalSessions,
        absences: r.absences,
        remarks: r.remarks,
        rowVersion: r.rowVersion
      }))
    })
    toast.add({ title: 'Đã lưu điểm toàn bộ lớp thành công', color: 'success' })
    await load()
  } catch (e) {
    const err = e as ApiError
    if (err.code === 'CONFLICT_VERSION') {
      conflicts.value = err.fieldErrors.grades ?? ['Dữ liệu đã được người khác chỉnh sửa. Vui lòng tải lại.']
    }
    toast.add({ title: 'Lỗi lưu sổ điểm', description: err.detail || err.message, color: 'error' })
    error.value = err
  } finally {
    saving.value = false
  }
}

async function handleUnlock() {
  if (!unlockForm.value.reason.trim()) {
    toast.add({ title: 'Vui lòng nhập lý do mở khóa', color: 'error' })
    return
  }
  unlocking.value = true
  try {
    await api.post(`/classrooms/${classRoomId}/grade-unlocks`, {
      reason: unlockForm.value.reason.trim(),
      durationHours: Number(unlockForm.value.durationHours) || 72
    })
    toast.add({ title: 'Đã mở khóa sổ điểm thành công', color: 'success' })
    unlockModalOpen.value = false
    unlockForm.value.reason = ''
    await load()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể mở khóa sổ điểm', description: err.detail || err.message, color: 'error' })
  } finally {
    unlocking.value = false
  }
}

async function exportExcel() {
  exporting.value = true
  try {
    const blob = await api.download<Blob>(`/classrooms/${classRoomId}/grades/export`)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `BangDiem_${sheet.value?.classRoomName || 'Lop'}.xlsx`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    toast.add({ title: 'Xuất bảng điểm thành công', color: 'success' })
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Lỗi khi xuất bảng điểm', description: err.detail || err.message, color: 'error' })
  } finally {
    exporting.value = false
  }
}

async function viewStudentGrade(enrollmentId: string) {
  loadingSingleGrade.value = true
  detailModalOpen.value = true
  try {
    const single = await api.get<GradeRow>(`/enrollments/${enrollmentId}/grade`)
    selectedStudentGrade.value = single
  } catch {
    // Nếu lỗi endpoint đơn thì lấy từ draft
    selectedStudentGrade.value = draft.value.find(d => d.enrollmentId === enrollmentId) || null
  } finally {
    loadingSingleGrade.value = false
  }
}

const inputColumns: { key: 'oral' | 'smallTest' | 'bigTest' | 'finalExam', label: string, weight: string }[] = [
  { key: 'oral', label: 'Miệng', weight: '×1' },
  { key: 'smallTest', label: '15 phút', weight: '×1' },
  { key: 'bigTest', label: '1 tiết', weight: '×2' },
  { key: 'finalExam', label: 'Thi kết khóa', weight: '×3' }
]
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-2 text-xs font-medium text-stone-500">
      <NuxtLink to="/admin/lop" class="hover:text-marian-600 hover:underline">
        Lớp học
      </NuxtLink>
      <UIcon name="i-lucide-chevron-right" class="h-3 w-3" />
      <NuxtLink :to="`/admin/lop/${classRoomId}`" class="hover:text-marian-600 hover:underline">
        {{ sheet?.classRoomName || 'Chi tiết lớp' }}
      </NuxtLink>
      <UIcon name="i-lucide-chevron-right" class="h-3 w-3" />
      <span class="text-stone-800 dark:text-stone-200 font-semibold">Sổ điểm</span>
    </div>

    <PageHeader
      :title="sheet ? `Sổ điểm lớp ${sheet.classRoomName}` : 'Sổ điểm lớp học'"
      :subtitle="sheet ? `Niên khóa ${sheet.academicYearName} • ${draft.length} đoàn sinh` : 'Bảng tổng hợp điểm số và đánh giá chuyên cần'"
    >
      <template #actions>
        <div class="flex flex-wrap items-center gap-2">
          <UButton
            variant="outline"
            icon="i-lucide-history"
            @click="unlockHistoryOpen = true"
          >
            Lịch sử mở khóa
          </UButton>
          <UButton
            v-can="PERMISSIONS.Grades.Export"
            variant="outline"
            icon="i-lucide-download"
            :loading="exporting"
            @click="exportExcel"
          >
            Xuất Excel
          </UButton>
          <UButton
            v-if="editable"
            color="primary"
            icon="i-lucide-save"
            :loading="saving"
            :disabled="hasInvalid"
            @click="save"
          >
            Lưu sổ điểm
          </UButton>
        </div>
      </template>
    </PageHeader>

    <ErrorState v-if="error" :error="error" @retry="load" />

    <div v-if="conflicts.length > 0" class="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/40">
      <div class="flex items-start gap-3">
        <UIcon name="i-lucide-alert-triangle" class="h-5 w-5 text-red-600" />
        <div>
          <h4 class="font-bold text-red-800 dark:text-red-200">Xung đột phiên bản dữ liệu</h4>
          <p class="text-xs text-red-700 dark:text-red-300">{{ conflicts.join(', ') }}</p>
        </div>
      </div>
    </div>

    <template v-if="sheet">
      <!-- Cảnh báo khóa sổ điểm & Banner -->
      <div
        v-if="isLocked"
        class="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-amber-900 dark:bg-amber-950/30"
      >
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
            <UIcon name="i-lucide-lock" class="h-5 w-5" />
          </div>
          <div>
            <h4 class="font-bold text-amber-900 dark:text-amber-200">Sổ điểm hiện đang bị khóa</h4>
            <p class="text-xs text-amber-700 dark:text-amber-400">
              {{ sheet.lockReason || 'Niên khóa đã kết thúc hoặc sổ điểm đã được chốt. Chỉ có thể xem.' }}
            </p>
          </div>
        </div>
        <UButton
          v-if="can(PERMISSIONS.Grades.Unlock)"
          color="secondary"
          size="sm"
          icon="i-lucide-key-round"
          @click="unlockModalOpen = true"
        >
          Mở khóa sổ điểm
        </UButton>
      </div>

      <div
        v-else-if="activeUnlock"
        class="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 dark:border-emerald-900 dark:bg-emerald-950/30"
      >
        <div class="flex items-center gap-3">
          <UIcon name="i-lucide-unlock" class="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <div>
            <h4 class="font-bold text-emerald-900 dark:text-emerald-200">Sổ điểm đang được mở khóa tạm thời</h4>
            <p class="text-xs text-emerald-700 dark:text-emerald-400">
              Mở bởi {{ activeUnlock.unlockedByName || 'Quản trị' }} • Hết hạn lúc: {{ new Date(activeUnlock.expiresAt).toLocaleString('vi-VN') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Bảng điểm chi tiết -->
      <div class="rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[900px] text-left text-sm">
            <thead class="bg-stone-50 text-xs font-semibold uppercase text-stone-600 dark:bg-stone-800/70 dark:text-stone-300">
              <tr>
                <th class="p-3 w-10 text-center">STT</th>
                <th class="p-3">Mã ĐS</th>
                <th class="p-3">Tên thánh & Họ tên</th>
                <th v-for="c in inputColumns" :key="c.key" class="p-3 text-center">
                  {{ c.label }} <span class="text-[10px] text-stone-400">({{ c.weight }})</span>
                </th>
                <th class="p-3 text-center">Chuyên cần (Vắng/Tổng)</th>
                <th class="p-3 text-center">Điểm TB</th>
                <th class="p-3 text-center">Đánh giá</th>
                <th class="p-3 text-center">Chi tiết</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
              <tr v-if="draft.length === 0">
                <td colspan="10" class="p-8 text-center text-sm text-stone-500">
                  Lớp học chưa có đoàn sinh nào ghi danh.
                </td>
              </tr>
              <tr
                v-for="(row, idx) in draft"
                :key="row.enrollmentId"
                class="hover:bg-stone-50/70 dark:hover:bg-stone-800/40"
              >
                <td class="p-3 text-center text-xs text-stone-400 font-mono">{{ idx + 1 }}</td>
                <td class="p-3 font-mono text-xs font-semibold text-marian-600 dark:text-marian-400">
                  {{ row.studentCode }}
                </td>
                <td class="p-3 font-medium text-stone-900 dark:text-stone-100 whitespace-nowrap">
                  {{ row.holyName ? `${row.holyName} ` : '' }}{{ row.fullName }}
                </td>

                <!-- Ô nhập điểm các cột -->
                <td v-for="c in inputColumns" :key="c.key" class="p-2 text-center">
                  <input
                    v-model.number="row[c.key]"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    :disabled="!editable"
                    class="w-16 rounded border px-2 py-1 text-center font-mono text-sm focus:border-marian-600 focus:outline-none disabled:bg-stone-100 dark:disabled:bg-stone-800 dark:border-stone-700 dark:bg-stone-900"
                    :class="invalidGrade(row[c.key]) ? 'border-red-500 bg-red-50 text-red-700' : 'border-stone-300 text-stone-800 dark:text-stone-100'"
                    :aria-label="`${c.label} của ${row.fullName}`"
                  />
                </td>

                <!-- Vắng / Tổng buổi -->
                <td class="p-2 text-center whitespace-nowrap">
                  <div class="inline-flex items-center gap-1">
                    <input
                      v-model.number="row.absences"
                      type="number"
                      min="0"
                      :max="row.totalSessions || 100"
                      :disabled="!editable"
                      class="w-14 rounded border border-stone-300 px-1.5 py-1 text-center font-mono text-sm focus:border-marian-600 focus:outline-none disabled:bg-stone-100 dark:disabled:bg-stone-800 dark:border-stone-700 dark:bg-stone-900"
                      :aria-label="`Số buổi vắng của ${row.fullName}`"
                    />
                    <span class="text-xs text-stone-400">/ {{ row.totalSessions ?? '—' }}</span>
                  </div>
                </td>

                <!-- Điểm TB Live -->
                <td class="p-3 text-center font-bold font-mono text-sm text-stone-900 dark:text-stone-100">
                  {{ computeLiveGpa(row)?.toFixed(1) ?? '—' }}
                </td>

                <!-- Kết quả (StatusChip) -->
                <td class="p-3 text-center">
                  <StatusChip v-if="row.computedStatus" domain="grade" :value="row.computedStatus" />
                  <span v-else class="text-xs text-stone-400 italic">Chưa đánh giá</span>
                </td>

                <!-- Xem chi tiết cá nhân -->
                <td class="p-3 text-center">
                  <UButton
                    size="xs"
                    variant="ghost"
                    color="neutral"
                    icon="i-lucide-eye"
                    @click="viewStudentGrade(row.enrollmentId)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="border-t border-stone-100 p-4 text-xs text-stone-500 dark:border-stone-800">
          <p class="font-medium text-stone-700 dark:text-stone-300 mb-1">Quy định tính điểm & tiêu chí:</p>
          <ul class="list-disc pl-5 space-y-0.5">
            <li>Công thức ĐTB = (Miệng × 1 + 15 phút × 1 + 1 tiết × 2 + Thi kết khóa × 3) / 7.</li>
            <li>Tiêu chí Lên lớp (Qualified): Điểm trung bình ≥ 5.0 và Tỷ lệ chuyên cần ≥ 80%.</li>
            <li>Ô để trống nghĩa là chưa có điểm (khác với điểm 0). Điểm hợp lệ từ 0 đến 10.</li>
          </ul>
        </div>
      </div>
    </template>

    <!-- Modal Mở Khóa Sổ Điểm -->
    <UModal
      v-model:open="unlockModalOpen"
      title="Mở khóa sổ điểm lớp"
      description="Thao tác này được ghi nhận vào nhật ký kiểm toán hệ thống"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Thời gian mở khóa (giờ)
            </label>
            <select
              v-model="unlockForm.durationHours"
              class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            >
              <option :value="24">24 giờ (1 ngày)</option>
              <option :value="48">48 giờ (2 ngày)</option>
              <option :value="72">72 giờ (3 ngày - mặc định)</option>
              <option :value="168">168 giờ (7 ngày)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Lý do mở khóa <span class="text-red-500">*</span>
            </label>
            <UTextarea
              v-model="unlockForm.reason"
              placeholder="Nhập lý do cần sửa điểm sau khi đã chốt..."
              :rows="3"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="unlockModalOpen = false">Hủy</UButton>
          <UButton
            color="secondary"
            :loading="unlocking"
            :disabled="!unlockForm.reason.trim()"
            @click="handleUnlock"
          >
            Xác nhận mở khóa
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Lịch Sử Mở Khóa Sổ Điểm -->
    <UModal
      v-model:open="unlockHistoryOpen"
      title="Lịch sử mở khóa sổ điểm"
      description="Danh sách các lần mở khóa sổ điểm của lớp học này"
    >
      <template #body>
        <div class="max-h-72 overflow-y-auto space-y-3">
          <div v-if="unlockHistory.length === 0" class="text-center text-sm text-stone-500 py-4">
            Chưa có lượt mở khóa nào trong quá khứ.
          </div>
          <div
            v-for="u in unlockHistory"
            :key="u.id"
            class="rounded-xl border border-stone-200 p-3 text-xs dark:border-stone-800"
          >
            <div class="flex justify-between items-start">
              <div>
                <span class="font-semibold text-stone-900 dark:text-stone-100">{{ u.unlockedByName || 'Người quản trị' }}</span>
                <span class="text-stone-400 ml-1">({{ new Date(u.unlockedAt).toLocaleDateString('vi-VN') }})</span>
              </div>
              <span
                class="rounded-full px-2 py-0.5 font-semibold text-[10px]"
                :class="u.isActive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'"
              >
                {{ u.isActive ? 'Đang mở' : 'Đã kết thúc' }}
              </span>
            </div>
            <p class="mt-1 text-stone-700 dark:text-stone-300">
              <strong class="text-stone-500">Lý do:</strong> {{ u.reason }}
            </p>
            <p class="mt-1 text-[11px] text-stone-400">
              Hạn mở: {{ new Date(u.expiresAt).toLocaleString('vi-VN') }}
            </p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <UButton variant="outline" @click="unlockHistoryOpen = false">Đóng</UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Chi Tiết Điểm Cá Nhân Của Một Em -->
    <UModal
      v-model:open="detailModalOpen"
      :title="`Phiếu điểm cá nhân: ${selectedStudentGrade?.holyName ? selectedStudentGrade.holyName + ' ' : ''}${selectedStudentGrade?.fullName}`"
    >
      <template #body>
        <div v-if="selectedStudentGrade" class="space-y-4">
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="rounded-lg bg-stone-50 p-2.5 dark:bg-stone-800">
              <span class="text-xs text-stone-400">Mã đoàn sinh</span>
              <p class="font-mono font-bold">{{ selectedStudentGrade.studentCode }}</p>
            </div>
            <div class="rounded-lg bg-stone-50 p-2.5 dark:bg-stone-800">
              <span class="text-xs text-stone-400">Kết quả đánh giá</span>
              <div class="mt-0.5">
                <StatusChip v-if="selectedStudentGrade.computedStatus" domain="grade" :value="selectedStudentGrade.computedStatus" />
                <span v-else class="text-xs text-stone-400">—</span>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-stone-200 p-3 space-y-2 text-sm dark:border-stone-800">
            <div class="flex justify-between">
              <span class="text-stone-500">Điểm Miệng:</span>
              <span class="font-bold">{{ selectedStudentGrade.oral ?? '—' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-stone-500">Điểm 15 phút:</span>
              <span class="font-bold">{{ selectedStudentGrade.smallTest ?? '—' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-stone-500">Điểm 1 tiết:</span>
              <span class="font-bold">{{ selectedStudentGrade.bigTest ?? '—' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-stone-500">Thi kết khóa:</span>
              <span class="font-bold">{{ selectedStudentGrade.finalExam ?? '—' }}</span>
            </div>
            <div class="border-t border-stone-100 pt-2 flex justify-between font-bold text-marian-600 dark:text-marian-400 dark:border-stone-800">
              <span>Điểm trung bình (GPA):</span>
              <span>{{ selectedStudentGrade.computedGpa?.toFixed(1) ?? '—' }}</span>
            </div>
            <div class="flex justify-between text-xs text-stone-500">
              <span>Chuyên cần:</span>
              <span>Vắng {{ selectedStudentGrade.absences ?? 0 }} / {{ selectedStudentGrade.totalSessions ?? '—' }} buổi</span>
            </div>
          </div>

          <div v-if="selectedStudentGrade.remarks">
            <span class="text-xs font-semibold uppercase text-stone-500">Nhận xét của Giáo lý viên:</span>
            <p class="mt-1 rounded-lg bg-stone-50 p-2.5 text-xs text-stone-700 italic dark:bg-stone-800 dark:text-stone-300">
              "{{ selectedStudentGrade.remarks }}"
            </p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <UButton variant="outline" @click="detailModalOpen = false">Đóng</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
