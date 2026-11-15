<script setup lang="ts">
import { PERMISSIONS } from '~/shared/permissions'
import type { ApiError } from '~/composables/useApi'

definePageMeta({ layout: 'admin', permission: PERMISSIONS.Duty.View })

interface DutyAssignmentItem {
  id: string
  userId: string
  userFullName: string
  classRoomId: string
  classRoomName: string
  dutyDate: string
  roleName: string
  note?: string | null
  createdAt: string
}

interface UserOption {
  id: string
  fullName: string
  christianName?: string | null
  username: string
}

interface ClassRoomOption {
  id: string
  className: string
}

const api = useApi()
const toast = useToast()
const { can } = usePermissions()

const assignments = ref<DutyAssignmentItem[]>([])
const users = ref<UserOption[]>([])
const classrooms = ref<ClassRoomOption[]>([])
const loading = ref(true)
const error = ref<ApiError | null>(null)

// Bộ lọc
const filterClassRoomId = ref<string>('ALL')
const filterUserId = ref<string>('ALL')
const filterFromDate = ref<string>('')
const filterToDate = ref<string>('')

// Modal Tạo / Sửa
const formOpen = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const currentId = ref<string | null>(null)
const form = ref({
  userId: '',
  classRoomId: '',
  dutyDate: new Date().toISOString().substring(0, 10),
  roleName: 'Trực lớp',
  note: ''
})

// Modal Xóa
const deleteOpen = ref(false)
const deleting = ref(false)
const selectedAssignment = ref<DutyAssignmentItem | null>(null)

const roleOptions = [
  'Trực lớp',
  'Trực cổng & Đón tiếp',
  'Giữ trật tự khuôn viên',
  'Điểm danh & Chuyên cần',
  'Y tế & Sơ cấp cứu',
  'Âm thanh & Kinh nguyện'
]

async function loadData() {
  loading.value = true
  error.value = null
  try {
    const params: Record<string, string> = {}
    if (filterClassRoomId.value !== 'ALL') params.classRoomId = filterClassRoomId.value
    if (filterUserId.value !== 'ALL') params.userId = filterUserId.value
    if (filterFromDate.value) params.fromDate = filterFromDate.value
    if (filterToDate.value) params.toDate = filterToDate.value

    const [resDuty, resUsers, resClasses] = await Promise.all([
      api.get<DutyAssignmentItem[]>('/duty-assignments', params),
      api.get<any>('/users?pageSize=200').catch(() => []),
      api.get<any>('/academic-years/active').then(y => api.get<any[]>(`/academic-years/${y.id}/classrooms`)).catch(() => [])
    ])
    assignments.value = resDuty || []
    users.value = (resUsers.items || resUsers || []).map((u: any) => ({
      id: u.id,
      fullName: u.fullName,
      christianName: u.christianName,
      username: u.username
    }))
    classrooms.value = (resClasses || []).map((c: any) => ({
      id: c.id,
      className: c.className
    }))
  } catch (e) {
    error.value = e as ApiError
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

function openCreateModal() {
  isEditing.value = false
  currentId.value = null
  form.value = {
    userId: users.value[0]?.id || '',
    classRoomId: classrooms.value[0]?.id || '',
    dutyDate: new Date().toISOString().substring(0, 10),
    roleName: 'Trực lớp',
    note: ''
  }
  formOpen.value = true
}

function openEditModal(item: DutyAssignmentItem) {
  isEditing.value = true
  currentId.value = item.id
  form.value = {
    userId: item.userId,
    classRoomId: item.classRoomId,
    dutyDate: item.dutyDate,
    roleName: item.roleName,
    note: item.note || ''
  }
  formOpen.value = true
}

async function handleSaveDuty() {
  if (!form.value.userId || !form.value.classRoomId || !form.value.dutyDate) {
    toast.add({ title: 'Vui lòng chọn Giáo lý viên, Lớp và Ngày trực', color: 'error' })
    return
  }
  saving.value = true
  try {
    const payload = {
      userId: form.value.userId,
      classRoomId: form.value.classRoomId,
      dutyDate: form.value.dutyDate,
      roleName: form.value.roleName.trim(),
      note: form.value.note?.trim() || null
    }

    if (isEditing.value && currentId.value) {
      await api.put(`/duty-assignments/${currentId.value}`, payload)
      toast.add({ title: 'Cập nhật phân công trực thành công', color: 'success' })
    } else {
      await api.post('/duty-assignments', payload)
      toast.add({ title: 'Tạo phân công trực mới thành công', color: 'success' })
    }
    formOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Lỗi phân công trực', description: err.detail || err.message, color: 'error' })
  } finally {
    saving.value = false
  }
}

function openDeleteModal(item: DutyAssignmentItem) {
  selectedAssignment.value = item
  deleteOpen.value = true
}

async function handleDeleteDuty() {
  if (!selectedAssignment.value) return
  deleting.value = true
  try {
    await api.delete(`/duty-assignments/${selectedAssignment.value.id}`)
    toast.add({ title: 'Đã xóa phân công trực', color: 'success' })
    deleteOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể xóa phân công', description: err.detail || err.message, color: 'error' })
  } finally {
    deleting.value = false
  }
}

const stats = computed(() => {
  const total = assignments.value.length
  const uniqueTeachers = new Set(assignments.value.map(a => a.userId)).size
  const uniqueDates = new Set(assignments.value.map(a => a.dutyDate)).size
  return { total, uniqueTeachers, uniqueDates }
})
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Phân công Trực lớp & Nhiệm vụ"
      subtitle="Quản lý lịch phân công trực nhật, đón tiếp và trật tự của đội ngũ Giáo lý viên"
    >
      <template #actions>
        <UButton
          v-if="can(PERMISSIONS.Duty.Manage)"
          color="primary"
          icon="i-lucide-plus"
          @click="openCreateModal"
        >
          Thêm phân công
        </UButton>
      </template>
    </PageHeader>

    <ErrorState v-if="error" :error="error" @retry="loadData" />

    <!-- Thống kê nhanh -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        title="Tổng lượt phân công"
        :value="stats.total"
        icon="i-lucide-calendar-days"
      />
      <StatCard
        title="Giáo lý viên tham gia"
        :value="stats.uniqueTeachers"
        icon="i-lucide-users"
      />
      <StatCard
        title="Số ngày có lịch trực"
        :value="stats.uniqueDates"
        icon="i-lucide-clock"
      />
    </div>

    <!-- Bộ lọc -->
    <div class="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-stone-800 dark:bg-stone-900">
      <div class="flex flex-wrap items-center gap-3">
        <!-- Lọc Lớp -->
        <div class="flex items-center gap-2">
          <label class="text-xs font-semibold uppercase text-stone-500">Lớp:</label>
          <select
            v-model="filterClassRoomId"
            class="h-9 rounded-lg border border-stone-200 bg-stone-50 px-2.5 text-xs font-medium dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
            @change="loadData"
          >
            <option value="ALL">Tất cả các lớp</option>
            <option v-for="c in classrooms" :key="c.id" :value="c.id">
              {{ c.className }}
            </option>
          </select>
        </div>

        <!-- Lọc GLV -->
        <div class="flex items-center gap-2">
          <label class="text-xs font-semibold uppercase text-stone-500">GLV:</label>
          <select
            v-model="filterUserId"
            class="h-9 rounded-lg border border-stone-200 bg-stone-50 px-2.5 text-xs font-medium dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
            @change="loadData"
          >
            <option value="ALL">Tất cả giáo lý viên</option>
            <option v-for="u in users" :key="u.id" :value="u.id">
              {{ u.christianName ? `${u.christianName} ` : '' }}{{ u.fullName }}
            </option>
          </select>
        </div>

        <!-- Lọc khoảng ngày -->
        <div class="flex items-center gap-1.5 text-xs text-stone-500">
          <span>Từ:</span>
          <input
            v-model="filterFromDate"
            type="date"
            class="h-9 rounded-lg border border-stone-200 bg-stone-50 px-2 text-xs dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
            @change="loadData"
          />
          <span>Đến:</span>
          <input
            v-model="filterToDate"
            type="date"
            class="h-9 rounded-lg border border-stone-200 bg-stone-50 px-2 text-xs dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
            @change="loadData"
          />
        </div>
      </div>
    </div>

    <!-- Bảng phân công -->
    <div class="rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-stone-50 text-xs font-semibold uppercase text-stone-600 dark:bg-stone-800/70 dark:text-stone-300">
            <tr>
              <th class="p-4">Ngày trực</th>
              <th class="p-4">Giáo lý viên</th>
              <th class="p-4">Lớp phụ trách</th>
              <th class="p-4">Nhiệm vụ / Vai trò</th>
              <th class="p-4">Ghi chú</th>
              <th v-if="can(PERMISSIONS.Duty.Manage)" class="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
            <tr v-if="loading">
              <td colspan="6" class="p-8 text-center text-sm text-stone-400 animate-pulse">
                Đang tải lịch phân công...
              </td>
            </tr>
            <tr v-else-if="assignments.length === 0">
              <td colspan="6" class="p-8 text-center text-sm text-stone-500">
                Chưa có lịch trực nào phù hợp với bộ lọc.
              </td>
            </tr>
            <tr
              v-for="item in assignments"
              :key="item.id"
              class="hover:bg-stone-50/70 dark:hover:bg-stone-800/40"
            >
              <td class="p-4 font-mono text-xs font-semibold text-stone-800 dark:text-stone-200 whitespace-nowrap">
                {{ item.dutyDate }}
              </td>
              <td class="p-4 font-medium text-stone-900 dark:text-stone-100 whitespace-nowrap">
                {{ item.userFullName }}
              </td>
              <td class="p-4 text-xs font-semibold text-marian-600 dark:text-marian-400 whitespace-nowrap">
                {{ item.classRoomName }}
              </td>
              <td class="p-4">
                <span class="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                  <UIcon name="i-lucide-shield-check" class="h-3.5 w-3.5 text-vatican-600" />
                  {{ item.roleName }}
                </span>
              </td>
              <td class="p-4 text-xs text-stone-500">
                {{ item.note || '—' }}
              </td>
              <td v-if="can(PERMISSIONS.Duty.Manage)" class="p-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-1">
                  <UButton
                    size="xs"
                    variant="ghost"
                    color="neutral"
                    icon="i-lucide-pencil"
                    @click="openEditModal(item)"
                  />
                  <UButton
                    size="xs"
                    variant="ghost"
                    color="error"
                    icon="i-lucide-trash-2"
                    @click="openDeleteModal(item)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Tạo / Sửa Phân Công -->
    <UModal
      v-model:open="formOpen"
      :title="isEditing ? 'Sửa phân công trực' : 'Thêm phân công trực mới'"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Giáo lý viên <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.userId"
              class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            >
              <option v-for="u in users" :key="u.id" :value="u.id">
                {{ u.christianName ? `${u.christianName} ` : '' }}{{ u.fullName }} (@{{ u.username }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Lớp phụ trách <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.classRoomId"
              class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            >
              <option v-for="c in classrooms" :key="c.id" :value="c.id">
                {{ c.className }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Ngày trực <span class="text-red-500">*</span>
              </label>
              <UInput v-model="form.dutyDate" type="date" />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Nhiệm vụ / Vai trò
              </label>
              <select
                v-model="form.roleName"
                class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              >
                <option v-for="r in roleOptions" :key="r" :value="r">
                  {{ r }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Ghi chú thêm
            </label>
            <UTextarea v-model="form.note" placeholder="Dặn dò đặc biệt..." :rows="2" />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="formOpen = false">Hủy</UButton>
          <UButton
            color="primary"
            :loading="saving"
            :disabled="!form.userId || !form.classRoomId || !form.dutyDate"
            @click="handleSaveDuty"
          >
            Lưu phân công
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Xóa Phân Công -->
    <UModal v-model:open="deleteOpen" title="Xác nhận xóa phân công trực">
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="deleteOpen = false">Hủy</UButton>
          <UButton color="error" :loading="deleting" @click="handleDeleteDuty">
            Xác nhận xóa
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
