<script setup lang="ts">
import type { ApiError } from '../../../composables/useApi'
import { toApiError } from '../../../composables/useApi'
import { PERMISSIONS } from '../../../shared/permissions'

definePageMeta({
  layout: 'admin',
  permission: PERMISSIONS.Academic.View
})

interface AcademicYearItem {
  id: string
  name: string
  startDate: string
  endDate: string
  status: 'Planned' | 'Active' | 'Closing' | 'Archived'
  classRoomsCount?: number
  classRooms?: unknown[]
  activatedAt?: string
  closedAt?: string
  archivedAt?: string
  reopenedAt?: string
  reopenReason?: string
}

const api = useApi()
const permissions = usePermissions()

// Data state
const years = ref<AcademicYearItem[]>([])
const loading = ref(false)
const error = ref<ApiError | null>(null)

// Selected year for view/edit
const selectedYear = ref<AcademicYearItem | null>(null)
const viewDetailModalOpen = ref(false)

// Create / Edit modal state
const formModalOpen = ref(false)
const isEditing = ref(false)
const formId = ref('')
const formName = ref('')
const formStartDate = ref('')
const formEndDate = ref('')
const formSubmitting = ref(false)
const formError = ref<ApiError | null>(null)

// Reopen modal state
const reopenModalOpen = ref(false)
const reopenYearId = ref('')
const reopenReason = ref('')
const reopenSubmitting = ref(false)
const reopenError = ref<ApiError | null>(null)

// Clone structure modal state
const cloneModalOpen = ref(false)
const cloneTargetYearId = ref('')
const cloneSourceYearId = ref('')
const cloneSubmitting = ref(false)
const cloneError = ref<ApiError | null>(null)

// Delete confirm modal state
const deleteModalOpen = ref(false)
const deleteYearId = ref('')
const deleteYearName = ref('')
const deleteSubmitting = ref(false)
const deleteError = ref<ApiError | null>(null)

async function fetchYears() {
  loading.value = true
  error.value = null
  try {
    const data = await api.get<AcademicYearItem[]>('/academic-years')
    years.value = Array.isArray(data) ? data : []
  } catch (e) {
    error.value = toApiError(e)
  } finally {
    loading.value = false
  }
}

async function viewDetail(year: AcademicYearItem) {
  selectedYear.value = year
  viewDetailModalOpen.value = true
  try {
    const full = await api.get<AcademicYearItem>(`/academic-years/${year.id}`)
    selectedYear.value = full
  } catch {
    // Keep existing year if detail endpoint fails
  }
}

function openCreateModal() {
  isEditing.value = false
  formId.value = ''
  const currentYear = new Date().getFullYear()
  formName.value = `${currentYear}–${currentYear + 1}`
  formStartDate.value = `${currentYear}-09-01`
  formEndDate.value = `${currentYear + 1}-06-30`
  formError.value = null
  formModalOpen.value = true
}

function openEditModal(year: AcademicYearItem) {
  isEditing.value = true
  formId.value = year.id
  formName.value = year.name
  formStartDate.value = year.startDate ? year.startDate.slice(0, 10) : ''
  formEndDate.value = year.endDate ? year.endDate.slice(0, 10) : ''
  formError.value = null
  formModalOpen.value = true
}

async function submitForm() {
  formSubmitting.value = true
  formError.value = null
  try {
    if (isEditing.value) {
      await api.put(`/academic-years/${formId.value}`, {
        name: formName.value,
        startDate: formStartDate.value,
        endDate: formEndDate.value
      })
    } else {
      await api.post('/academic-years', {
        name: formName.value,
        startDate: formStartDate.value,
        endDate: formEndDate.value
      })
    }
    formModalOpen.value = false
    await fetchYears()
  } catch (e) {
    formError.value = toApiError(e)
  } finally {
    formSubmitting.value = false
  }
}

// Lifecycle transitions
async function activateYear(id: string) {
  if (!confirm('Bạn có chắc chắn muốn kích hoạt niên khóa này? Niên khóa đang hoạt động hiện tại sẽ chuyển sang trạng thái chốt.')) return
  try {
    await api.post(`/academic-years/${id}/activate`)
    await fetchYears()
  } catch (e) {
    error.value = toApiError(e)
  }
}

async function closeYear(id: string) {
  if (!confirm('Bạn có chắc muốn chốt niên khóa này? Sổ điểm của tất cả các lớp sẽ bị khóa.')) return
  try {
    await api.post(`/academic-years/${id}/close`)
    await fetchYears()
  } catch (e) {
    error.value = toApiError(e)
  }
}

async function archiveYear(id: string) {
  if (!confirm('Lưu trữ niên khóa này? Khi đã lưu trữ, dữ liệu chỉ có thể xem mà không thể chỉnh sửa.')) return
  try {
    await api.post(`/academic-years/${id}/archive`)
    await fetchYears()
  } catch (e) {
    error.value = toApiError(e)
  }
}

function openReopenModal(id: string) {
  reopenYearId.value = id
  reopenReason.value = ''
  reopenError.value = null
  reopenModalOpen.value = true
}

async function submitReopen() {
  if (!reopenReason.value.trim()) return
  reopenSubmitting.value = true
  reopenError.value = null
  try {
    await api.post(`/academic-years/${reopenYearId.value}/reopen`, {
      reason: reopenReason.value
    })
    reopenModalOpen.value = false
    await fetchYears()
  } catch (e) {
    reopenError.value = toApiError(e)
  } finally {
    reopenSubmitting.value = false
  }
}

function openCloneModal(targetYear: AcademicYearItem) {
  cloneTargetYearId.value = targetYear.id
  cloneSourceYearId.value = ''
  cloneError.value = null
  cloneModalOpen.value = true
}

async function submitClone() {
  if (!cloneSourceYearId.value) return
  cloneSubmitting.value = true
  cloneError.value = null
  try {
    await api.post(`/academic-years/${cloneTargetYearId.value}/clone-structure`, {
      sourceYearId: cloneSourceYearId.value
    })
    cloneModalOpen.value = false
    await fetchYears()
  } catch (e) {
    cloneError.value = toApiError(e)
  } finally {
    cloneSubmitting.value = false
  }
}

function openDeleteModal(year: AcademicYearItem) {
  deleteYearId.value = year.id
  deleteYearName.value = year.name
  deleteError.value = null
  deleteModalOpen.value = true
}

async function submitDelete() {
  deleteSubmitting.value = true
  deleteError.value = null
  try {
    await api.del(`/academic-years/${deleteYearId.value}`)
    deleteModalOpen.value = false
    await fetchYears()
  } catch (e) {
    deleteError.value = toApiError(e)
  } finally {
    deleteSubmitting.value = false
  }
}

onMounted(fetchYears)
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Niên khóa"
      subtitle="Quản lý vòng đời niên khóa: Dự kiến, Hoạt động, Đang chốt và Lưu trữ"
    >
      <template #actions>
        <UButton
          v-if="permissions.can(PERMISSIONS.Academic.Create)"
          icon="i-lucide-plus"
          @click="openCreateModal"
        >
          Tạo niên khóa
        </UButton>
      </template>
    </PageHeader>

    <ErrorState :error="error" @retry="fetchYears" />

    <!-- Loading Skeleton -->
    <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 3" :key="i" class="h-44 animate-pulse rounded-xl bg-stone-200 dark:bg-stone-800" />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else-if="years.length === 0"
      title="Chưa có niên khóa nào"
      description="Hãy bắt đầu tạo niên khóa đầu tiên để phân bổ các ngành và lớp học."
      icon="i-lucide-calendar"
    >
      <UButton
        v-if="permissions.can(PERMISSIONS.Academic.Create)"
        icon="i-lucide-plus"
        @click="openCreateModal"
      >
        Tạo niên khóa mới
      </UButton>
    </EmptyState>

    <!-- Danh sách Niên Khóa (Cards Grid) -->
    <div v-else class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="year in years"
        :key="year.id"
        class="flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
        :class="year.status === 'Active' ? 'ring-2 ring-marian-500/40 dark:ring-marian-400/40' : ''"
      >
        <div>
          <div class="flex items-start justify-between gap-2">
            <h3 class="font-display text-2xl font-bold text-stone-900 dark:text-white">
              {{ year.name }}
            </h3>
            <StatusChip domain="year" :value="year.status" />
          </div>

          <div class="mt-3 space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
            <div class="flex items-center gap-1.5">
              <UIcon name="i-lucide-calendar" class="size-4 text-stone-400" />
              <span>Thời gian: {{ year.startDate }} → {{ year.endDate }}</span>
            </div>
            <div v-if="year.reopenReason" class="rounded bg-amber-50 p-1.5 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
              <strong>Lý do mở lại:</strong> {{ year.reopenReason }}
            </div>
          </div>
        </div>

        <div class="mt-6 border-t border-stone-100 pt-4 dark:border-stone-800">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <UButton
              size="xs"
              variant="ghost"
              color="neutral"
              icon="i-lucide-eye"
              @click="viewDetail(year)"
            >
              Chi tiết
            </UButton>

            <div class="flex flex-wrap items-center gap-1.5">
              <!-- Nút theo vòng đời -->
              <UButton
                v-if="permissions.can(PERMISSIONS.Academic.Lifecycle) && year.status === 'Planned'"
                size="xs"
                color="success"
                icon="i-lucide-play"
                @click="activateYear(year.id)"
              >
                Kích hoạt
              </UButton>

              <UButton
                v-if="permissions.can(PERMISSIONS.Academic.Create) && year.status === 'Planned'"
                size="xs"
                variant="outline"
                color="secondary"
                icon="i-lucide-copy"
                title="Sao chép cơ cấu lớp từ niên khóa khác"
                @click="openCloneModal(year)"
              >
                Nhân bản lớp
              </UButton>

              <UButton
                v-if="permissions.can(PERMISSIONS.Academic.Lifecycle) && year.status === 'Active'"
                size="xs"
                color="warning"
                icon="i-lucide-lock"
                @click="closeYear(year.id)"
              >
                Chốt sổ
              </UButton>

              <UButton
                v-if="permissions.can(PERMISSIONS.Academic.Lifecycle) && year.status === 'Closing'"
                size="xs"
                variant="outline"
                color="primary"
                icon="i-lucide-unlock"
                @click="openReopenModal(year.id)"
              >
                Mở lại
              </UButton>

              <UButton
                v-if="permissions.can(PERMISSIONS.Academic.Lifecycle) && year.status === 'Closing'"
                size="xs"
                color="neutral"
                icon="i-lucide-archive"
                @click="archiveYear(year.id)"
              >
                Lưu trữ
              </UButton>

              <!-- Nút Sửa / Xóa -->
              <UButton
                v-if="permissions.can(PERMISSIONS.Academic.Update) && year.status !== 'Archived'"
                size="xs"
                variant="ghost"
                color="neutral"
                icon="i-lucide-pencil"
                @click="openEditModal(year)"
              />

              <UButton
                v-if="permissions.can(PERMISSIONS.Academic.Delete) && year.status === 'Planned'"
                size="xs"
                variant="ghost"
                color="error"
                icon="i-lucide-trash-2"
                @click="openDeleteModal(year)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL TẠO / SỬA NIÊN KHÓA -->
    <UModal v-model:open="formModalOpen" :title="isEditing ? 'Sửa niên khóa' : 'Tạo niên khóa mới'">
      <template #body>
        <form class="space-y-4" @submit.prevent="submitForm">
          <ErrorState :error="formError" />

          <UFormField label="Tên niên khóa" name="name" required>
            <UInput v-model="formName" placeholder="Ví dụ: 2026–2027" class="w-full" required />
          </UFormField>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UFormField label="Ngày bắt đầu" name="startDate" required>
              <UInput v-model="formStartDate" type="date" class="w-full" required />
            </UFormField>

            <UFormField label="Ngày kết thúc" name="endDate" required>
              <UInput v-model="formEndDate" type="date" class="w-full" required />
            </UFormField>
          </div>

          <div class="flex justify-end gap-2 pt-3">
            <UButton variant="ghost" color="neutral" @click="formModalOpen = false">
              Hủy
            </UButton>
            <UButton type="submit" :loading="formSubmitting">
              {{ isEditing ? 'Lưu thay đổi' : 'Tạo niên khóa' }}
            </UButton>
          </div>
        </form>
      </template>
    </UModal>

    <!-- MODAL MỞ LẠI NIÊN KHÓA (CẦN LÝ DO) -->
    <UModal v-model:open="reopenModalOpen" title="Mở lại niên khóa">
      <template #body>
        <form class="space-y-4" @submit.prevent="submitReopen">
          <p class="text-sm text-stone-600 dark:text-stone-400">
            Mở lại niên khóa từ trạng thái <strong>Đang chốt</strong> về <strong>Đang hoạt động</strong>. Hành động này được ghi vào nhật ký kiểm toán hệ thống.
          </p>

          <ErrorState :error="reopenError" />

          <UFormField label="Lý do mở lại niên khóa" name="reason" required>
            <UTextarea
              v-model="reopenReason"
              placeholder="Nhập lý do mở lại (ví dụ: cần phúc khảo điểm bài thi học kỳ cuối)..."
              class="w-full"
              :rows="3"
              required
            />
          </UFormField>

          <div class="flex justify-end gap-2 pt-3">
            <UButton variant="ghost" color="neutral" @click="reopenModalOpen = false">
              Hủy
            </UButton>
            <UButton type="submit" color="primary" :loading="reopenSubmitting" :disabled="!reopenReason.trim()">
              Xác nhận mở lại
            </UButton>
          </div>
        </form>
      </template>
    </UModal>

    <!-- MODAL NHÂN BẢN CƠ CẤU LỚP -->
    <UModal v-model:open="cloneModalOpen" title="Nhân bản cơ cấu lớp">
      <template #body>
        <form class="space-y-4" @submit.prevent="submitClone">
          <p class="text-sm text-stone-600 dark:text-stone-400">
            Sao chép toàn bộ danh mục lớp học từ một niên khóa trước vào niên khóa này. Quá trình này không sao chép điểm hay phân công giáo lý viên.
          </p>

          <ErrorState :error="cloneError" />

          <UFormField label="Chọn niên khóa nguồn" name="sourceYear" required>
            <select
              v-model="cloneSourceYearId"
              class="w-full rounded-md border border-stone-300 bg-white p-2 text-sm dark:border-stone-700 dark:bg-stone-900 dark:text-white"
              required
            >
              <option value="" disabled>-- Chọn niên khóa có sẵn --</option>
              <option
                v-for="y in years.filter(y => y.id !== cloneTargetYearId)"
                :key="y.id"
                :value="y.id"
              >
                {{ y.name }} ({{ y.status }})
              </option>
            </select>
          </UFormField>

          <div class="flex justify-end gap-2 pt-3">
            <UButton variant="ghost" color="neutral" @click="cloneModalOpen = false">
              Hủy
            </UButton>
            <UButton type="submit" color="secondary" :loading="cloneSubmitting" :disabled="!cloneSourceYearId">
              Bắt đầu sao chép
            </UButton>
          </div>
        </form>
      </template>
    </UModal>

    <!-- MODAL CHI TIẾT NIÊN KHÓA -->
    <UModal v-model:open="viewDetailModalOpen" :title="`Chi tiết: ${selectedYear?.name || ''}`">
      <template #body>
        <div v-if="selectedYear" class="space-y-4 text-sm">
          <div class="flex items-center justify-between">
            <span class="text-stone-500">Trạng thái:</span>
            <StatusChip domain="year" :value="selectedYear.status" />
          </div>
          <div class="flex items-center justify-between">
            <span class="text-stone-500">Thời gian:</span>
            <strong>{{ selectedYear.startDate }} → {{ selectedYear.endDate }}</strong>
          </div>
          <div v-if="selectedYear.activatedAt" class="flex items-center justify-between text-xs">
            <span class="text-stone-500">Kích hoạt lúc:</span>
            <span>{{ new Date(selectedYear.activatedAt).toLocaleString('vi-VN') }}</span>
          </div>
          <div v-if="selectedYear.closedAt" class="flex items-center justify-between text-xs">
            <span class="text-stone-500">Chốt sổ lúc:</span>
            <span>{{ new Date(selectedYear.closedAt).toLocaleString('vi-VN') }}</span>
          </div>
          <div v-if="selectedYear.archivedAt" class="flex items-center justify-between text-xs">
            <span class="text-stone-500">Lưu trữ lúc:</span>
            <span>{{ new Date(selectedYear.archivedAt).toLocaleString('vi-VN') }}</span>
          </div>

          <div class="border-t border-stone-200 pt-3 dark:border-stone-800">
            <NuxtLink
              :to="`/admin/lop?nien_khoa=${selectedYear.id}`"
              class="inline-flex items-center gap-1.5 text-xs text-marian-600 hover:underline dark:text-marian-400"
            >
              <UIcon name="i-lucide-arrow-right" class="size-3.5" />
              <span>Xem danh sách lớp của niên khóa này</span>
            </NuxtLink>
          </div>
        </div>
      </template>
    </UModal>

    <!-- MODAL XÁC NHẬN XÓA -->
    <UModal v-model:open="deleteModalOpen" title="Xác nhận xóa niên khóa">
      <template #body>
        <div class="space-y-4">
          <p class="text-sm text-stone-600 dark:text-stone-400">
            Bạn có chắc chắn muốn xóa niên khóa <strong>{{ deleteYearName }}</strong>? Hành động này không thể hoàn tác.
          </p>
          <ErrorState :error="deleteError" />
          <div class="flex justify-end gap-2 pt-2">
            <UButton variant="ghost" color="neutral" @click="deleteModalOpen = false">
              Hủy
            </UButton>
            <UButton color="error" :loading="deleteSubmitting" @click="submitDelete">
              Xác nhận xóa
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
