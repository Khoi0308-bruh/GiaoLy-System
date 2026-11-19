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

interface ClassRoomItem {
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

interface AcademicYearItem {
  id: string
  name: string
  status: 'Planned' | 'Active' | 'Closing' | 'Archived'
  classRoomCount: number
}

interface BranchItem {
  id: number
  code: string
  name: string
}

interface ClassLevelItem {
  id: number
  branchId: number
  branchName: string
  code: string
  name: string
}

const api = useApi()
const toast = useToast()
const { can } = usePermissions()

const years = ref<AcademicYearItem[]>([])
const selectedYearId = ref<string>('')
const branches = ref<BranchItem[]>([])
const classLevels = ref<ClassLevelItem[]>([])
const classrooms = ref<ClassRoomItem[]>([])

const loading = ref(false)
const error = ref<ApiError | null>(null)
const selectedBranchId = ref<number | null>(null)
const searchQuery = ref('')

// Modal tạo lớp
const createOpen = ref(false)
const creating = ref(false)
const createForm = ref({
  classLevelId: undefined as number | undefined,
  section: '',
  roomName: ''
})

async function initData() {
  loading.value = true
  error.value = null
  try {
    const [yList, bList, clList] = await Promise.all([
      api.get<AcademicYearItem[]>('/academic-years'),
      api.get<BranchItem[]>('/branches').catch(() => []),
      api.get<ClassLevelItem[]>('/class-levels').catch(() => [])
    ])
    years.value = yList || []
    branches.value = bList || []
    classLevels.value = clList || []

    if (years.value.length > 0) {
      const activeYear = years.value.find(y => y.status === 'Active')
      selectedYearId.value = activeYear ? activeYear.id : years.value[0].id
      await loadClassrooms()
    }
  } catch (e) {
    error.value = e as ApiError
  } finally {
    loading.value = false
  }
}

async function loadClassrooms() {
  if (!selectedYearId.value) return
  loading.value = true
  error.value = null
  try {
    classrooms.value = await api.get<ClassRoomItem[]>(`/academic-years/${selectedYearId.value}/classrooms`)
  } catch (e) {
    error.value = e as ApiError
  } finally {
    loading.value = false
  }
}

watch(selectedYearId, () => {
  loadClassrooms()
})

const filteredClassrooms = computed(() => {
  return classrooms.value.filter(c => {
    if (selectedBranchId.value !== null && c.branchId !== selectedBranchId.value) {
      return false
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const matchName = c.className.toLowerCase().includes(q)
      const matchRoom = (c.roomName || '').toLowerCase().includes(q)
      const matchLead = c.leadTeacher ? `${c.leadTeacher.christianName ?? ''} ${c.leadTeacher.fullName}`.toLowerCase().includes(q) : false
      return matchName || matchRoom || matchLead
    }
    return true
  })
})

const stats = computed(() => {
  const totalClasses = classrooms.value.length
  const totalStudents = classrooms.value.reduce((acc, c) => acc + (c.studentCount || 0), 0)
  const withLead = classrooms.value.filter(c => !!c.leadTeacher).length
  const missingLead = totalClasses - withLead
  return { totalClasses, totalStudents, withLead, missingLead }
})

const currentYear = computed(() => {
  return years.value.find(y => y.id === selectedYearId.value)
})

function openCreateModal() {
  createForm.value = {
    classLevelId: classLevels.value[0]?.id,
    section: '',
    roomName: ''
  }
  createOpen.value = true
}

async function handleCreateClassroom() {
  if (!createForm.value.classLevelId || !selectedYearId.value) {
    toast.add({ title: 'Vui lòng chọn cấp lớp', color: 'error' })
    return
  }
  creating.value = true
  try {
    await api.post(`/academic-years/${selectedYearId.value}/classrooms`, {
      classLevelId: createForm.value.classLevelId,
      section: createForm.value.section?.trim() || null,
      roomName: createForm.value.roomName?.trim() || null
    })
    toast.add({ title: 'Tạo lớp học thành công', color: 'success' })
    createOpen.value = false
    await loadClassrooms()
  } catch (e) {
    const err = e as ApiError
    toast.add({
      title: 'Không thể tạo lớp học',
      description: err.detail || err.message,
      color: 'error'
    })
  } finally {
    creating.value = false
  }
}

onMounted(initData)
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Danh sách Lớp học"
      :subtitle="currentYear ? `Niên khóa ${currentYear.name}` : 'Quản lý các lớp giáo lý và phân công'"
    >
      <template #actions>
        <UButton
          v-if="can(PERMISSIONS.Academic.Create)"
          color="primary"
          icon="i-lucide-plus"
          @click="openCreateModal"
        >
          Tạo lớp mới
        </UButton>
      </template>
    </PageHeader>

    <ErrorState v-if="error" :error="error" @retry="loadClassrooms" />

    <!-- Thống kê nhanh -->
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard
        label="Tổng số lớp"
        :value="stats.totalClasses"
        icon="i-lucide-school"
      />
      <StatCard
        label="Tổng số đoàn sinh"
        :value="stats.totalStudents"
        icon="i-lucide-users"
      />
      <StatCard
        label="Đã có GLV Chủ nhiệm"
        :value="stats.withLead"
        icon="i-lucide-user-check"
      />
      <StatCard
        label="Chưa có GLV CN"
        :value="stats.missingLead"
        icon="i-lucide-user-x"
        :class="stats.missingLead > 0 ? 'text-amber-600 dark:text-amber-400' : ''"
      />
    </div>

    <!-- Bộ lọc & Tìm kiếm -->
    <div class="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-stone-800 dark:bg-stone-900">
      <div class="flex flex-wrap items-center gap-3">
        <!-- Chọn niên khóa -->
        <div class="flex items-center gap-2">
          <label class="text-xs font-semibold uppercase tracking-wider text-stone-500">Niên khóa:</label>
          <select
            v-model="selectedYearId"
            class="h-9 rounded-lg border border-stone-200 bg-stone-50 px-3 text-sm font-medium text-stone-800 focus:border-marian-600 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
          >
            <option v-for="y in years" :key="y.id" :value="y.id">
              {{ y.name }} {{ y.status === 'Active' ? ' (Đang diễn ra)' : `(${y.status})` }}
            </option>
          </select>
        </div>

        <!-- Lọc theo ngành -->
        <div class="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            class="rounded-lg px-2.5 py-1 text-xs font-medium transition-colors"
            :class="selectedBranchId === null ? 'bg-marian-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300'"
            @click="selectedBranchId = null"
          >
            Tất cả ngành
          </button>
          <button
            v-for="b in branches"
            :key="b.id"
            type="button"
            class="rounded-lg px-2.5 py-1 text-xs font-medium transition-colors"
            :class="selectedBranchId === b.id ? 'bg-marian-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300'"
            @click="selectedBranchId = b.id"
          >
            {{ b.name }}
          </button>
        </div>
      </div>

      <!-- Tìm kiếm -->
      <div class="w-full sm:w-64">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Tìm tên lớp, phòng, GLV..."
          size="sm"
        />
      </div>
    </div>

    <!-- Danh sách Lớp Grid -->
    <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 6" :key="i" class="h-44 animate-pulse rounded-2xl border border-stone-200 bg-stone-100 dark:border-stone-800 dark:bg-stone-800/50" />
    </div>

    <EmptyState
      v-else-if="filteredClassrooms.length === 0"
      icon="i-lucide-school"
      title="Không tìm thấy lớp học nào"
      description="Chưa có lớp học nào trong niên khóa này hoặc không khớp với bộ lọc."
    >
      <template #actions>
        <UButton
          v-if="can(PERMISSIONS.Academic.Create)"
          color="primary"
          icon="i-lucide-plus"
          @click="openCreateModal"
        >
          Tạo lớp mới ngay
        </UButton>
      </template>
    </EmptyState>

    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="c in filteredClassrooms"
        :key="c.id"
        class="group relative flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-vatican-500 hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
      >
        <div>
          <!-- Header thẻ -->
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="inline-block rounded-md bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                {{ c.classLevelName }}
              </span>
              <h3 class="mt-1 font-display text-xl font-bold text-stone-900 group-hover:text-marian-600 dark:text-stone-50 dark:group-hover:text-marian-400">
                <NuxtLink :to="`/admin/lop/${c.id}`" class="hover:underline">
                  {{ c.className }}
                </NuxtLink>
              </h3>
            </div>
            <span class="flex items-center gap-1 rounded-full bg-vatican-50 px-2.5 py-1 text-xs font-semibold text-vatican-800 dark:bg-vatican-950/50 dark:text-vatican-300">
              <UIcon name="i-lucide-users" class="h-3.5 w-3.5" />
              {{ c.studentCount }} em
            </span>
          </div>

          <!-- Chi tiết phòng & GLV -->
          <div class="mt-4 space-y-2 text-xs text-stone-600 dark:text-stone-400">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-map-pin" class="h-3.5 w-3.5 text-stone-400" />
              <span>Phòng: <strong class="text-stone-800 dark:text-stone-200">{{ c.roomName || 'Chưa xếp phòng' }}</strong></span>
            </div>

            <div class="flex items-start gap-2">
              <UIcon name="i-lucide-user-check" class="mt-0.5 h-3.5 w-3.5 text-marian-600 dark:text-marian-400" />
              <div>
                <span>GLV Chủ nhiệm: </span>
                <span v-if="c.leadTeacher" class="font-medium text-stone-800 dark:text-stone-200">
                  {{ c.leadTeacher.christianName ? `${c.leadTeacher.christianName} ` : '' }}{{ c.leadTeacher.fullName }}
                </span>
                <span v-else class="italic text-amber-600 dark:text-amber-400">Chưa phân công</span>
              </div>
            </div>

            <div v-if="c.assistantTeachers && c.assistantTeachers.length > 0" class="flex items-start gap-2">
              <UIcon name="i-lucide-users-round" class="mt-0.5 h-3.5 w-3.5 text-stone-400" />
              <div>
                <span>Phụ tá: </span>
                <span class="text-stone-700 dark:text-stone-300">
                  {{ c.assistantTeachers.map(t => `${t.christianName ? t.christianName + ' ' : ''}${t.fullName}`).join(', ') }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer hành động -->
        <div class="mt-5 flex items-center justify-between border-t border-stone-100 pt-3 dark:border-stone-800">
          <div class="flex items-center gap-2">
            <NuxtLink
              v-can="PERMISSIONS.Grades.View"
              :to="`/admin/lop/${c.id}/diem-so`"
              class="flex items-center gap-1 text-xs font-medium text-marian-600 hover:text-marian-700 hover:underline dark:text-marian-400"
            >
              <UIcon name="i-lucide-book-open" class="h-3.5 w-3.5" />
              Sổ điểm
            </NuxtLink>
            <span class="text-stone-300 dark:text-stone-700">•</span>
            <NuxtLink
              v-can="PERMISSIONS.Bouquets.View"
              :to="`/admin/lop/${c.id}/hoa-thieng`"
              class="flex items-center gap-1 text-xs font-medium text-vatican-700 hover:text-vatican-800 hover:underline dark:text-vatican-400"
            >
              <UIcon name="i-lucide-flower-2" class="h-3.5 w-3.5" />
              Hoa thiêng
            </NuxtLink>
          </div>

          <NuxtLink
            :to="`/admin/lop/${c.id}`"
            class="flex items-center gap-1 rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700 transition hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
          >
            Chi tiết
            <UIcon name="i-lucide-arrow-right" class="h-3 w-3" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Modal Tạo Lớp Học -->
    <UModal
      v-model:open="createOpen"
      title="Tạo lớp học mới"
      description="Thêm lớp học vào niên khóa đang chọn"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Cấp lớp <span class="text-red-500">*</span>
            </label>
            <select
              v-model="createForm.classLevelId"
              class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 focus:border-marian-600 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            >
              <option v-for="cl in classLevels" :key="cl.id" :value="cl.id">
                {{ cl.name }} ({{ cl.branchName }} - {{ cl.code }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Phân ban / Phân lớp (Section)
            </label>
            <UInput
              v-model="createForm.section"
              placeholder="Ví dụ: A, B, 1, 2 (để trống nếu chỉ có 1 lớp)"
            />
            <p class="mt-1 text-xs text-stone-500">Tên lớp sẽ tự sinh theo Cấp lớp và Phân ban (ví dụ: Khai Tâm 1A).</p>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Phòng học
            </label>
            <UInput
              v-model="createForm.roomName"
              placeholder="Ví dụ: Phòng 102, Hội trường xứ..."
            />
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="createOpen = false">
            Hủy
          </UButton>
          <UButton
            color="primary"
            :loading="creating"
            @click="handleCreateClassroom"
          >
            Tạo lớp
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
