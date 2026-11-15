<script setup lang="ts">
import { PERMISSIONS } from '~/shared/permissions'
import type { ApiError } from '~/composables/useApi'

definePageMeta({ layout: 'admin', permission: PERMISSIONS.Academic.View })

interface TeacherSummary {
  userId: string
  username: string
  fullName: string
  christianName?: string | null
  isLead: boolean
}

interface ClassRoomDetail {
  id: string
  academicYearId: string
  academicYearName: string
  classLevelId: number
  classLevelCode: string
  classLevelName: string
  branchId: number
  section?: string | null
  className: string
  roomName?: string | null
  leadTeacher?: TeacherSummary | null
  assistantTeachers: TeacherSummary[]
  studentCount: number
}

interface EnrollmentItem {
  id: string
  studentId: string
  studentCode: string
  holyName?: string | null
  fullName: string
  classRoomId: string
  classRoomName: string
  academicYearId: string
  academicYearName: string
  status: 'Active' | 'Transferred' | 'Completed' | 'Retained' | 'DropOut'
  startDate: string
  endDate?: string | null
  note?: string | null
  rowVersion: string
}

interface TargetClassItem {
  id: string
  className: string
  roomName?: string | null
}

interface UserOption {
  id: string
  fullName: string
  christianName?: string | null
  username: string
}

interface StudentSearchItem {
  id: string
  studentCode: string
  holyName?: string | null
  fullName: string
  birthDate?: string | null
}

const route = useRoute()
const router = useRouter()
const api = useApi()
const toast = useToast()
const { can } = usePermissions()

const classId = route.params.id as string

const classroom = ref<ClassRoomDetail | null>(null)
const enrollments = ref<EnrollmentItem[]>([])
const loading = ref(true)
const error = ref<ApiError | null>(null)

// Danh sách lớp cùng niên khóa để chuyển lớp
const otherClassrooms = ref<TargetClassItem[]>([])
// Danh sách users để gán GLV
const userOptions = ref<UserOption[]>([])

// Modal Sửa Lớp
const editOpen = ref(false)
const editing = ref(false)
const editForm = ref({
  section: '',
  roomName: ''
})

// Modal Xóa Lớp
const deleteOpen = ref(false)
const deleting = ref(false)

// Modal Phân Công GLV
const assignOpen = ref(false)
const assigning = ref(false)
const assignForm = ref({
  leadTeacherUserId: '' as string,
  assistantTeacherUserIds: [] as string[]
})

// Modal Xếp Đoàn Sinh Vào Lớp
const enrollOpen = ref(false)
const enrolling = ref(false)
const studentSearchText = ref('')
const searchedStudents = ref<StudentSearchItem[]>([])
const selectedStudentIds = ref<string[]>([])
const enrollNote = ref('')

// Modal Chuyển Lớp
const transferOpen = ref(false)
const transferring = ref(false)
const selectedEnrollment = ref<EnrollmentItem | null>(null)
const transferForm = ref({
  targetClassRoomId: '',
  transferDate: new Date().toISOString().substring(0, 10),
  reason: ''
})

// Modal Rút Lớp
const withdrawOpen = ref(false)
const withdrawing = ref(false)
const withdrawForm = ref({
  withdrawDate: new Date().toISOString().substring(0, 10),
  reason: ''
})

async function loadClassroom() {
  loading.value = true
  error.value = null
  try {
    classroom.value = await api.get<ClassRoomDetail>(`/classrooms/${classId}`)
    await Promise.all([
      loadEnrollments(),
      loadOtherClassrooms()
    ])
  } catch (e) {
    error.value = e as ApiError
  } finally {
    loading.value = false
  }
}

async function loadEnrollments() {
  try {
    enrollments.value = await api.get<EnrollmentItem[]>(`/classrooms/${classId}/enrollments`)
  } catch (e) {
    // Có thể không có quyền enrollments.view
    enrollments.value = []
  }
}

async function loadOtherClassrooms() {
  if (!classroom.value?.academicYearId) return
  try {
    const list = await api.get<ClassRoomDetail[]>(`/academic-years/${classroom.value.academicYearId}/classrooms`)
    otherClassrooms.value = list.filter(c => c.id !== classId)
  } catch {
    otherClassrooms.value = []
  }
}

async function loadUserOptions() {
  if (userOptions.value.length > 0) return
  try {
    const res = await api.get<any>('/users?pageSize=200')
    const items = res.items || res
    userOptions.value = items.map((u: any) => ({
      id: u.id,
      fullName: u.fullName,
      christianName: u.christianName,
      username: u.username
    }))
  } catch {
    userOptions.value = []
  }
}

// ── Sửa Lớp ─────────────────────────────────────────────
function openEditModal() {
  if (!classroom.value) return
  editForm.value = {
    section: classroom.value.section || '',
    roomName: classroom.value.roomName || ''
  }
  editOpen.value = true
}

async function handleUpdateClassroom() {
  editing.value = true
  try {
    await api.put(`/classrooms/${classId}`, {
      section: editForm.value.section?.trim() || null,
      roomName: editForm.value.roomName?.trim() || null
    })
    toast.add({ title: 'Cập nhật thông tin lớp thành công', color: 'success' })
    editOpen.value = false
    await loadClassroom()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Lỗi cập nhật', description: err.detail || err.message, color: 'error' })
  } finally {
    editing.value = false
  }
}

// ── Xóa Lớp ─────────────────────────────────────────────
async function handleDeleteClassroom() {
  deleting.value = true
  try {
    await api.delete(`/classrooms/${classId}`)
    toast.add({ title: 'Đã xóa lớp học', color: 'success' })
    deleteOpen.value = false
    router.push('/admin/lop')
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể xóa lớp', description: err.detail || err.message, color: 'error' })
  } finally {
    deleting.value = false
  }
}

// ── Phân Công GLV ────────────────────────────────────────
async function openAssignModal() {
  await loadUserOptions()
  assignForm.value = {
    leadTeacherUserId: classroom.value?.leadTeacher?.userId || '',
    assistantTeacherUserIds: (classroom.value?.assistantTeachers || []).map(t => t.userId)
  }
  assignOpen.value = true
}

async function handleAssignTeachers() {
  assigning.value = true
  try {
    await api.put(`/classrooms/${classId}/teachers`, {
      leadTeacherUserId: assignForm.value.leadTeacherUserId || null,
      assistantTeacherUserIds: assignForm.value.assistantTeacherUserIds
    })
    toast.add({ title: 'Đã cập nhật phân công Giáo lý viên', color: 'success' })
    assignOpen.value = false
    await loadClassroom()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Lỗi phân công GLV', description: err.detail || err.message, color: 'error' })
  } finally {
    assigning.value = false
  }
}

// ── Xếp Lớp (Enroll) ────────────────────────────────────
async function searchStudentsForEnroll() {
  if (!studentSearchText.value.trim()) return
  try {
    const res = await api.get<any>(`/students?search=${encodeURIComponent(studentSearchText.value.trim())}&status=Active&pageSize=20`)
    searchedStudents.value = (res.items || res).filter((s: any) => !enrollments.value.some(e => e.studentId === s.id && e.status === 'Active'))
  } catch {
    searchedStudents.value = []
  }
}

function toggleStudentSelection(id: string) {
  const idx = selectedStudentIds.value.indexOf(id)
  if (idx >= 0) selectedStudentIds.value.splice(idx, 1)
  else selectedStudentIds.value.push(id)
}

function openEnrollModal() {
  selectedStudentIds.value = []
  searchedStudents.value = []
  studentSearchText.value = ''
  enrollNote.value = ''
  enrollOpen.value = true
}

async function handleEnrollStudents() {
  if (selectedStudentIds.value.length === 0) {
    toast.add({ title: 'Vui lòng chọn ít nhất một đoàn sinh', color: 'error' })
    return
  }
  enrolling.value = true
  try {
    await api.post(`/classrooms/${classId}/enrollments`, {
      studentIds: selectedStudentIds.value,
      note: enrollNote.value?.trim() || null
    })
    toast.add({ title: `Đã xếp ${selectedStudentIds.value.length} đoàn sinh vào lớp`, color: 'success' })
    enrollOpen.value = false
    await loadClassroom()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Lỗi xếp lớp', description: err.detail || err.message, color: 'error' })
  } finally {
    enrolling.value = false
  }
}

// ── Chuyển Lớp (Transfer) ───────────────────────────────
function openTransferModal(enrollment: EnrollmentItem) {
  selectedEnrollment.value = enrollment
  transferForm.value = {
    targetClassRoomId: otherClassrooms.value[0]?.id || '',
    transferDate: new Date().toISOString().substring(0, 10),
    reason: ''
  }
  transferOpen.value = true
}

async function handleTransferEnrollment() {
  if (!selectedEnrollment.value || !transferForm.value.targetClassRoomId) return
  transfering.value = true
  try {
    await api.post(`/enrollments/${selectedEnrollment.value.id}/transfer`, {
      targetClassRoomId: transferForm.value.targetClassRoomId,
      transferDate: transferForm.value.transferDate || null,
      reason: transferForm.value.reason?.trim() || null
    })
    toast.add({ title: 'Chuyển lớp cho đoàn sinh thành công', color: 'success' })
    transferOpen.value = false
    await loadClassroom()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Lỗi chuyển lớp', description: err.detail || err.message, color: 'error' })
  } finally {
    transfering.value = false
  }
}

// ── Rút Lớp (Withdraw) ──────────────────────────────────
function openWithdrawModal(enrollment: EnrollmentItem) {
  selectedEnrollment.value = enrollment
  withdrawForm.value = {
    withdrawDate: new Date().toISOString().substring(0, 10),
    reason: ''
  }
  withdrawOpen.value = true
}

async function handleWithdrawEnrollment() {
  if (!selectedEnrollment.value || !withdrawForm.value.reason.trim()) {
    toast.add({ title: 'Vui lòng nhập lý do rút khỏi lớp', color: 'error' })
    return
  }
  withdrawing.value = true
  try {
    await api.post(`/enrollments/${selectedEnrollment.value.id}/withdraw`, {
      withdrawDate: withdrawForm.value.withdrawDate || null,
      reason: withdrawForm.value.reason.trim()
    })
    toast.add({ title: 'Đã rút đoàn sinh khỏi lớp học', color: 'success' })
    withdrawOpen.value = false
    await loadClassroom()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Lỗi rút khỏi lớp', description: err.detail || err.message, color: 'error' })
  } finally {
    withdrawing.value = false
  }
}

onMounted(loadClassroom)
</script>

<template>
  <div class="space-y-6">
    <div v-if="loading" class="h-40 animate-pulse rounded-2xl border border-stone-200 bg-stone-100 dark:border-stone-800 dark:bg-stone-800" />

    <ErrorState v-else-if="error" :error="error" @retry="loadClassroom" />

    <template v-else-if="classroom">
      <!-- Breadcrumb & Header -->
      <div>
        <div class="mb-2 flex items-center gap-2 text-xs font-medium text-stone-500">
          <NuxtLink to="/admin/lop" class="hover:text-marian-600 hover:underline">
            Lớp học
          </NuxtLink>
          <UIcon name="i-lucide-chevron-right" class="h-3 w-3" />
          <span>{{ classroom.academicYearName }}</span>
          <UIcon name="i-lucide-chevron-right" class="h-3 w-3" />
          <span class="text-stone-800 dark:text-stone-200 font-semibold">{{ classroom.className }}</span>
        </div>

        <PageHeader
          :title="`Lớp ${classroom.className}`"
          :subtitle="`Niên khóa ${classroom.academicYearName} • Ngành ${classroom.classLevelName}`"
        >
          <template #actions>
            <div class="flex flex-wrap items-center gap-2">
              <UButton
                v-can="PERMISSIONS.Grades.View"
                :to="`/admin/lop/${classroom.id}/diem-so`"
                variant="outline"
                icon="i-lucide-book-open"
              >
                Sổ điểm
              </UButton>
              <UButton
                v-can="PERMISSIONS.Bouquets.View"
                :to="`/admin/lop/${classroom.id}/hoa-thieng`"
                variant="outline"
                icon="i-lucide-flower-2"
              >
                Hoa thiêng
              </UButton>
              <UButton
                v-can="PERMISSIONS.Academic.Update"
                variant="outline"
                icon="i-lucide-edit-3"
                @click="openEditModal"
              >
                Sửa lớp
              </UButton>
              <UButton
                v-can="PERMISSIONS.Academic.Delete"
                color="error"
                variant="outline"
                icon="i-lucide-trash-2"
                :disabled="enrollments.length > 0"
                @click="deleteOpen = true"
              >
                Xóa lớp
              </UButton>
            </div>
          </template>
        </PageHeader>
      </div>

      <!-- Thẻ thông tin lớp & Phân công GLV -->
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <!-- Thông tin lớp -->
        <div class="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-info" class="h-5 w-5 text-marian-600" />
            <h3 class="font-display text-lg font-bold text-stone-900 dark:text-stone-100">Thông tin lớp học</h3>
          </div>
          <dl class="mt-4 space-y-2.5 text-sm">
            <div class="flex justify-between border-b border-stone-100 pb-2 dark:border-stone-800">
              <dt class="text-stone-500">Cấp lớp:</dt>
              <dd class="font-semibold text-stone-800 dark:text-stone-200">{{ classroom.classLevelName }} ({{ classroom.classLevelCode }})</dd>
            </div>
            <div class="flex justify-between border-b border-stone-100 pb-2 dark:border-stone-800">
              <dt class="text-stone-500">Phân ban:</dt>
              <dd class="font-medium text-stone-800 dark:text-stone-200">{{ classroom.section || '—' }}</dd>
            </div>
            <div class="flex justify-between border-b border-stone-100 pb-2 dark:border-stone-800">
              <dt class="text-stone-500">Phòng học:</dt>
              <dd class="font-medium text-stone-800 dark:text-stone-200">{{ classroom.roomName || 'Chưa xếp phòng' }}</dd>
            </div>
            <div class="flex justify-between pt-1">
              <dt class="text-stone-500">Sĩ số ghi danh:</dt>
              <dd class="font-bold text-marian-600 dark:text-marian-400">{{ enrollments.length }} đoàn sinh</dd>
            </div>
          </dl>
        </div>

        <!-- Phân công Giáo lý viên -->
        <div class="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm lg:col-span-2 dark:border-stone-800 dark:bg-stone-900">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-users" class="h-5 w-5 text-vatican-600" />
              <h3 class="font-display text-lg font-bold text-stone-900 dark:text-stone-100">Đội ngũ Giáo lý viên</h3>
            </div>
            <UButton
              v-can="PERMISSIONS.Academic.AssignTeachers"
              size="xs"
              variant="outline"
              icon="i-lucide-user-plus"
              @click="openAssignModal"
            >
              Phân công GLV
            </UButton>
          </div>

          <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <!-- GLV Chủ nhiệm -->
            <div class="rounded-xl border border-stone-200 bg-stone-50 p-3.5 dark:border-stone-800 dark:bg-stone-800/40">
              <span class="text-xs font-semibold uppercase tracking-wider text-stone-400">Chủ nhiệm (Lead Teacher)</span>
              <div v-if="classroom.leadTeacher" class="mt-2 flex items-center gap-2.5">
                <div class="flex h-9 w-9 items-center justify-center rounded-full bg-marian-100 text-marian-700 font-bold dark:bg-marian-900/50 dark:text-marian-300">
                  {{ classroom.leadTeacher.fullName.charAt(0) }}
                </div>
                <div>
                  <p class="font-semibold text-stone-800 dark:text-stone-100">
                    {{ classroom.leadTeacher.christianName ? `${classroom.leadTeacher.christianName} ` : '' }}{{ classroom.leadTeacher.fullName }}
                  </p>
                  <p class="text-xs text-stone-500">@{{ classroom.leadTeacher.username }}</p>
                </div>
              </div>
              <div v-else class="mt-2 text-xs italic text-amber-600 dark:text-amber-400">
                Chưa có GLV Chủ nhiệm
              </div>
            </div>

            <!-- GLV Phụ tá -->
            <div class="rounded-xl border border-stone-200 bg-stone-50 p-3.5 dark:border-stone-800 dark:bg-stone-800/40">
              <span class="text-xs font-semibold uppercase tracking-wider text-stone-400">Phụ tá (Assistant Teachers)</span>
              <div v-if="classroom.assistantTeachers && classroom.assistantTeachers.length > 0" class="mt-2 space-y-1.5">
                <div
                  v-for="t in classroom.assistantTeachers"
                  :key="t.userId"
                  class="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300"
                >
                  <UIcon name="i-lucide-user-check" class="h-4 w-4 text-stone-400" />
                  <span>{{ t.christianName ? `${t.christianName} ` : '' }}{{ t.fullName }}</span>
                </div>
              </div>
              <div v-else class="mt-2 text-xs italic text-stone-400">
                Không có giáo lý viên phụ tá
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Danh sách Ghi danh của Lớp -->
      <div class="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 class="font-display text-lg font-bold text-stone-900 dark:text-stone-100">
              Danh sách Đoàn sinh ghi danh
            </h3>
            <p class="text-xs text-stone-500">Tổng cộng {{ enrollments.length }} em trong lớp này</p>
          </div>
          <div class="flex items-center gap-2">
            <UButton
              v-can="PERMISSIONS.Enrollments.Manage"
              color="primary"
              size="sm"
              icon="i-lucide-user-plus"
              @click="openEnrollModal"
            >
              Xếp đoàn sinh vào lớp
            </UButton>
          </div>
        </div>

        <!-- Bảng danh sách ghi danh -->
        <div class="mt-4 overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800">
          <table class="w-full text-left text-sm">
            <thead class="bg-stone-50 text-xs font-semibold uppercase text-stone-600 dark:bg-stone-800/60 dark:text-stone-300">
              <tr>
                <th class="p-3 w-12 text-center">STT</th>
                <th class="p-3">Mã ĐS</th>
                <th class="p-3">Tên thánh & Họ tên</th>
                <th class="p-3">Trạng thái</th>
                <th class="p-3">Ngày bắt đầu</th>
                <th class="p-3">Ghi chú</th>
                <th v-if="can(PERMISSIONS.Enrollments.Manage)" class="p-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
              <tr v-if="enrollments.length === 0">
                <td colspan="7" class="p-8 text-center text-sm text-stone-500">
                  Lớp học chưa có đoàn sinh nào. Nhấn "Xếp đoàn sinh vào lớp" để bắt đầu.
                </td>
              </tr>
              <tr
                v-for="(e, idx) in enrollments"
                :key="e.id"
                class="hover:bg-stone-50/80 dark:hover:bg-stone-800/30"
              >
                <td class="p-3 text-center text-xs text-stone-400 font-mono">{{ idx + 1 }}</td>
                <td class="p-3 font-mono text-xs font-semibold text-marian-600 dark:text-marian-400">
                  {{ e.studentCode }}
                </td>
                <td class="p-3 font-medium text-stone-900 dark:text-stone-100">
                  <NuxtLink :to="`/admin/doan-sinh/${e.studentId}`" class="hover:underline">
                    {{ e.holyName ? `${e.holyName} ` : '' }}{{ e.fullName }}
                  </NuxtLink>
                </td>
                <td class="p-3">
                  <StatusChip domain="enrollment" :value="e.status" />
                </td>
                <td class="p-3 text-xs text-stone-500">{{ e.startDate }}</td>
                <td class="p-3 text-xs text-stone-500">{{ e.note || '—' }}</td>
                <td v-if="can(PERMISSIONS.Enrollments.Manage)" class="p-3 text-right">
                  <div v-if="e.status === 'Active'" class="flex items-center justify-end gap-1.5">
                    <UButton
                      size="xs"
                      variant="ghost"
                      color="neutral"
                      icon="i-lucide-arrow-right-left"
                      @click="openTransferModal(e)"
                    >
                      Chuyển lớp
                    </UButton>
                    <UButton
                      size="xs"
                      variant="ghost"
                      color="error"
                      icon="i-lucide-user-minus"
                      @click="openWithdrawModal(e)"
                    >
                      Rút lớp
                    </UButton>
                  </div>
                  <span v-else class="text-xs text-stone-400 italic">Đã kết thúc</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Modal Sửa Lớp -->
    <UModal v-model:open="editOpen" title="Sửa thông tin lớp học">
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Phân ban / Phân lớp (Section)
            </label>
            <UInput v-model="editForm.section" placeholder="Ví dụ: A, B, 1, 2" />
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Phòng học
            </label>
            <UInput v-model="editForm.roomName" placeholder="Ví dụ: Phòng 102" />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="editOpen = false">Hủy</UButton>
          <UButton color="primary" :loading="editing" @click="handleUpdateClassroom">Lưu thay đổi</UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Xóa Lớp -->
    <UModal
      v-model:open="deleteOpen"
      title="Xác nhận xóa lớp học"
      description="Chỉ có thể xóa khi lớp học chưa có đoàn sinh nào ghi danh."
    >
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="deleteOpen = false">Hủy</UButton>
          <UButton color="error" :loading="deleting" @click="handleDeleteClassroom">Xóa vĩnh viễn</UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Phân Công GLV -->
    <UModal v-model:open="assignOpen" title="Phân công Giáo lý viên cho lớp">
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Giáo lý viên Chủ nhiệm
            </label>
            <select
              v-model="assignForm.leadTeacherUserId"
              class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            >
              <option value="">-- Chưa chỉ định --</option>
              <option v-for="u in userOptions" :key="u.id" :value="u.id">
                {{ u.christianName ? `${u.christianName} ` : '' }}{{ u.fullName }} (@{{ u.username }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Giáo lý viên Phụ tá
            </label>
            <div class="max-h-48 overflow-y-auto rounded-lg border border-stone-200 p-2 dark:border-stone-700">
              <div
                v-for="u in userOptions"
                :key="u.id"
                class="flex items-center gap-2 py-1 text-sm"
              >
                <input
                  :id="`assist-${u.id}`"
                  type="checkbox"
                  :value="u.id"
                  v-model="assignForm.assistantTeacherUserIds"
                  class="rounded text-marian-600"
                />
                <label :for="`assist-${u.id}`" class="text-stone-800 dark:text-stone-200 cursor-pointer">
                  {{ u.christianName ? `${u.christianName} ` : '' }}{{ u.fullName }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="assignOpen = false">Hủy</UButton>
          <UButton color="primary" :loading="assigning" @click="handleAssignTeachers">Lưu phân công</UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Xếp Đoàn Sinh Vào Lớp -->
    <UModal
      v-model:open="enrollOpen"
      title="Xếp đoàn sinh vào lớp"
      description="Tìm kiếm và chọn đoàn sinh để ghi danh vào lớp học này"
    >
      <template #body>
        <div class="space-y-4">
          <div class="flex gap-2">
            <UInput
              v-model="studentSearchText"
              placeholder="Nhập tên hoặc mã đoàn sinh..."
              class="flex-1"
              @keyup.enter="searchStudentsForEnroll"
            />
            <UButton icon="i-lucide-search" @click="searchStudentsForEnroll">Tìm</UButton>
          </div>

          <div v-if="searchedStudents.length > 0" class="max-h-56 overflow-y-auto rounded-lg border border-stone-200 p-2 dark:border-stone-700 divide-y divide-stone-100 dark:divide-stone-800">
            <div
              v-for="s in searchedStudents"
              :key="s.id"
              class="flex items-center justify-between py-2 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/50 px-2 rounded"
              @click="toggleStudentSelection(s.id)"
            >
              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  :checked="selectedStudentIds.includes(s.id)"
                  class="rounded text-marian-600"
                />
                <div>
                  <p class="font-medium text-sm text-stone-900 dark:text-stone-100">
                    {{ s.holyName ? `${s.holyName} ` : '' }}{{ s.fullName }}
                  </p>
                  <p class="text-xs text-stone-400 font-mono">{{ s.studentCode }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedStudentIds.length > 0" class="text-xs text-marian-600 font-semibold">
            Đã chọn {{ selectedStudentIds.length }} đoàn sinh
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Ghi chú ghi danh
            </label>
            <UInput v-model="enrollNote" placeholder="Tùy chọn..." />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="enrollOpen = false">Hủy</UButton>
          <UButton
            color="primary"
            :loading="enrolling"
            :disabled="selectedStudentIds.length === 0"
            @click="handleEnrollStudents"
          >
            Xếp vào lớp
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Chuyển Lớp -->
    <UModal
      v-model:open="transferOpen"
      title="Chuyển lớp cho đoàn sinh"
      :description="`Đoàn sinh: ${selectedEnrollment?.holyName ? selectedEnrollment.holyName + ' ' : ''}${selectedEnrollment?.fullName}`"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Lớp chuyển đến <span class="text-red-500">*</span>
            </label>
            <select
              v-model="transferForm.targetClassRoomId"
              class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            >
              <option v-for="c in otherClassrooms" :key="c.id" :value="c.id">
                {{ c.className }} ({{ c.roomName || 'Chưa xếp phòng' }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Ngày chuyển lớp
            </label>
            <UInput v-model="transferForm.transferDate" type="date" />
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Lý do chuyển lớp
            </label>
            <UTextarea v-model="transferForm.reason" placeholder="Nhập lý do chuyển lớp..." :rows="2" />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="transferOpen = false">Hủy</UButton>
          <UButton
            color="primary"
            :loading="transfering"
            :disabled="!transferForm.targetClassRoomId"
            @click="handleTransferEnrollment"
          >
            Xác nhận chuyển
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Rút Lớp -->
    <UModal
      v-model:open="withdrawOpen"
      title="Rút đoàn sinh khỏi lớp học"
      :description="`Đoàn sinh: ${selectedEnrollment?.holyName ? selectedEnrollment.holyName + ' ' : ''}${selectedEnrollment?.fullName}`"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Ngày rút lớp
            </label>
            <UInput v-model="withdrawForm.withdrawDate" type="date" />
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Lý do rút lớp <span class="text-red-500">*</span>
            </label>
            <UTextarea v-model="withdrawForm.reason" placeholder="Bắt buộc phải ghi rõ lý do..." :rows="3" />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="withdrawOpen = false">Hủy</UButton>
          <UButton
            color="error"
            :loading="withdrawing"
            :disabled="!withdrawForm.reason.trim()"
            @click="handleWithdrawEnrollment"
          >
            Xác nhận rút
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
