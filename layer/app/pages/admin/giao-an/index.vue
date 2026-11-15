<script setup lang="ts">
import { PERMISSIONS } from '~/shared/permissions'
import type { ApiError } from '~/composables/useApi'

definePageMeta({ layout: 'admin', permission: PERMISSIONS.LessonPlans.View })

interface LessonPlanSummary {
  id: string
  authorUserId: string
  authorFullName: string
  classRoomId?: string | null
  classRoomName?: string | null
  title: string
  tags?: string | null
  visibility: 'Class' | 'Branch' | 'Public' | string
  createdAt: string
  updatedAt?: string | null
}

interface LessonPlanDetail extends LessonPlanSummary {
  contentHtml: string
}

interface ClassRoomOption {
  id: string
  className: string
}

const api = useApi()
const toast = useToast()
const session = useSessionStore()
const { can } = usePermissions()
const { sanitize } = useSafeHtml()

const plans = ref<LessonPlanSummary[]>([])
const classrooms = ref<ClassRoomOption[]>([])
const loading = ref(true)
const error = ref<ApiError | null>(null)

// Bộ lọc
const filterVisibility = ref<string>('ALL')
const searchQuery = ref<string>('')

// Modal Xem chi tiết
const viewOpen = ref(false)
const viewing = ref(false)
const detailPlan = ref<LessonPlanDetail | null>(null)

// Modal Soạn / Sửa
const formOpen = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const currentId = ref<string | null>(null)
const form = ref({
  title: '',
  classRoomId: null as string | null,
  tags: '',
  visibility: 'Class',
  contentHtml: ''
})

// Modal Xóa
const deleteOpen = ref(false)
const deleting = ref(false)
const selectedPlan = ref<LessonPlanSummary | null>(null)

async function loadData() {
  loading.value = true
  error.value = null
  try {
    const params: Record<string, string> = {}
    if (filterVisibility.value !== 'ALL') params.visibility = filterVisibility.value

    const [resPlans, resClasses] = await Promise.all([
      api.get<LessonPlanSummary[]>('/lesson-plans', params),
      api.get<any>('/academic-years/active').then(y => api.get<any[]>(`/academic-years/${y.id}/classrooms`)).catch(() => [])
    ])
    plans.value = resPlans || []
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

const filteredPlans = computed(() => {
  return plans.value.filter(p => {
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const matchTitle = p.title.toLowerCase().includes(q)
      const matchAuthor = p.authorFullName.toLowerCase().includes(q)
      const matchTags = (p.tags || '').toLowerCase().includes(q)
      return matchTitle || matchAuthor || matchTags
    }
    return true
  })
})

function canEdit(p: LessonPlanSummary): boolean {
  if (can(PERMISSIONS.LessonPlans.ManageAll)) return true
  if (can(PERMISSIONS.LessonPlans.Manage) && p.authorUserId === session.user?.id) return true
  return false
}

// ── Xem chi tiết ────────────────────────────────────────
async function openViewModal(p: LessonPlanSummary) {
  viewing.value = true
  viewOpen.value = true
  detailPlan.value = null
  try {
    detailPlan.value = await api.get<LessonPlanDetail>(`/lesson-plans/${p.id}`)
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể mở giáo án', description: err.detail || err.message, color: 'error' })
    viewOpen.value = false
  } finally {
    viewing.value = false
  }
}

// ── Soạn mới ────────────────────────────────────────────
function openCreateModal() {
  isEditing.value = false
  currentId.value = null
  form.value = {
    title: '',
    classRoomId: null,
    tags: '',
    visibility: 'Class',
    contentHtml: ''
  }
  formOpen.value = true
}

// ── Sửa giáo án ─────────────────────────────────────────
async function openEditModal(p: LessonPlanSummary) {
  isEditing.value = true
  currentId.value = p.id
  try {
    const detail = await api.get<LessonPlanDetail>(`/lesson-plans/${p.id}`)
    form.value = {
      title: detail.title,
      classRoomId: detail.classRoomId ?? null,
      tags: detail.tags || '',
      visibility: detail.visibility,
      contentHtml: detail.contentHtml
    }
    formOpen.value = true
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể tải giáo án', description: err.detail || err.message, color: 'error' })
  }
}

async function handleSavePlan() {
  if (!form.value.title.trim() || !form.value.contentHtml.trim()) {
    toast.add({ title: 'Vui lòng nhập tiêu đề và nội dung bài giảng', color: 'error' })
    return
  }
  saving.value = true
  try {
    const payload = {
      title: form.value.title.trim(),
      classRoomId: form.value.classRoomId || null,
      tags: form.value.tags?.trim() || null,
      visibility: form.value.visibility,
      contentHtml: form.value.contentHtml
    }

    if (isEditing.value && currentId.value) {
      await api.put(`/lesson-plans/${currentId.value}`, payload)
      toast.add({ title: 'Cập nhật giáo án thành công', color: 'success' })
    } else {
      await api.post('/lesson-plans', payload)
      toast.add({ title: 'Soạn giáo án mới thành công', color: 'success' })
    }
    formOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Lỗi lưu giáo án', description: err.detail || err.message, color: 'error' })
  } finally {
    saving.value = false
  }
}

// ── Xóa giáo án ─────────────────────────────────────────
function openDeleteModal(p: LessonPlanSummary) {
  selectedPlan.value = p
  deleteOpen.value = true
}

async function handleDeletePlan() {
  if (!selectedPlan.value) return
  deleting.value = true
  try {
    await api.delete(`/lesson-plans/${selectedPlan.value.id}`)
    toast.add({ title: 'Đã xóa giáo án', color: 'success' })
    deleteOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể xóa giáo án', description: err.detail || err.message, color: 'error' })
  } finally {
    deleting.value = false
  }
}

const stats = computed(() => {
  const total = plans.value.length
  const myPlans = plans.value.filter(p => p.authorUserId === session.user?.id).length
  const publicPlans = plans.value.filter(p => p.visibility === 'Public').length
  return { total, myPlans, publicPlans }
})
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Kho Giáo án & Bài giảng"
      subtitle="Soạn thảo, quản lý và chia sẻ tài liệu giảng dạy giáo lý cho các cấp lớp"
    >
      <template #actions>
        <UButton
          v-if="can(PERMISSIONS.LessonPlans.Manage)"
          color="primary"
          icon="i-lucide-plus"
          @click="openCreateModal"
        >
          Soạn giáo án mới
        </UButton>
      </template>
    </PageHeader>

    <ErrorState v-if="error" :error="error" @retry="loadData" />

    <!-- Thống kê nhanh -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        title="Tổng số bài giảng"
        :value="stats.total"
        icon="i-lucide-book-open"
      />
      <StatCard
        title="Giáo án của tôi"
        :value="stats.myPlans"
        icon="i-lucide-user"
        class="text-marian-600"
      />
      <StatCard
        title="Chia sẻ toàn xứ"
        :value="stats.publicPlans"
        icon="i-lucide-share-2"
        class="text-emerald-600"
      />
    </div>

    <!-- Bộ lọc & Tìm kiếm -->
    <div class="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-stone-800 dark:bg-stone-900">
      <div class="flex items-center gap-2">
        <label class="text-xs font-semibold uppercase text-stone-500">Phạm vi:</label>
        <select
          v-model="filterVisibility"
          class="h-9 rounded-lg border border-stone-200 bg-stone-50 px-3 text-xs font-medium dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
          @change="loadData"
        >
          <option value="ALL">Tất cả bài giảng</option>
          <option value="Class">Chỉ trong lớp</option>
          <option value="Branch">Trong ngành</option>
          <option value="Public">Toàn thể giáo xứ</option>
        </select>
      </div>

      <div class="w-full sm:w-64">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Tìm tiêu đề, tác giả, thẻ..."
          size="sm"
        />
      </div>
    </div>

    <!-- Danh sách giáo án dạng Grid -->
    <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 6" :key="i" class="h-48 animate-pulse rounded-2xl border border-stone-200 bg-stone-100 dark:border-stone-800 dark:bg-stone-800/40" />
    </div>

    <EmptyState
      v-else-if="filteredPlans.length === 0"
      icon="i-lucide-book-open"
      title="Không tìm thấy bài giảng nào"
      description="Chưa có bài giảng nào được tạo hoặc không khớp với từ khóa tìm kiếm."
    >
      <template #actions>
        <UButton
          v-if="can(PERMISSIONS.LessonPlans.Manage)"
          color="primary"
          icon="i-lucide-plus"
          @click="openCreateModal"
        >
          Soạn bài giảng đầu tiên
        </UButton>
      </template>
    </EmptyState>

    <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="p in filteredPlans"
        :key="p.id"
        class="group relative flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-vatican-500 hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
      >
        <div>
          <!-- Header Thẻ -->
          <div class="flex items-start justify-between gap-2">
            <span
              class="rounded px-2 py-0.5 text-[11px] font-semibold"
              :class="p.visibility === 'Public' ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : p.visibility === 'Branch' ? 'bg-marian-50 text-marian-800 dark:bg-marian-950 dark:text-marian-300' : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'"
            >
              {{ p.visibility === 'Public' ? 'Toàn xứ' : p.visibility === 'Branch' ? 'Toàn ngành' : (p.classRoomName || 'Lớp riêng') }}
            </span>
            <span class="text-[11px] text-stone-400">
              {{ new Date(p.createdAt).toLocaleDateString('vi-VN') }}
            </span>
          </div>

          <!-- Tiêu đề -->
          <h3 class="mt-2 font-display text-lg font-bold text-stone-900 group-hover:text-marian-600 dark:text-stone-50 dark:group-hover:text-marian-400 cursor-pointer" @click="openViewModal(p)">
            {{ p.title }}
          </h3>

          <!-- Tác giả & Tags -->
          <div class="mt-3 space-y-1.5 text-xs text-stone-500">
            <div class="flex items-center gap-1.5">
              <UIcon name="i-lucide-user" class="h-3.5 w-3.5 text-stone-400" />
              <span>Tác giả: <strong class="text-stone-700 dark:text-stone-300">{{ p.authorFullName }}</strong></span>
            </div>

            <div v-if="p.tags" class="flex flex-wrap gap-1 pt-1">
              <span
                v-for="tag in p.tags.split(',')"
                :key="tag"
                class="rounded bg-stone-100 px-1.5 py-0.2 text-[10px] text-stone-600 dark:bg-stone-800 dark:text-stone-300"
              >
                #{{ tag.trim() }}
              </span>
            </div>
          </div>
        </div>

        <!-- Footer Thẻ -->
        <div class="mt-5 flex items-center justify-between border-t border-stone-100 pt-3 dark:border-stone-800">
          <div class="flex items-center gap-1">
            <UButton
              v-if="canEdit(p)"
              size="xs"
              variant="ghost"
              color="neutral"
              icon="i-lucide-pencil"
              title="Chỉnh sửa giáo án"
              @click="openEditModal(p)"
            />
            <UButton
              v-if="canEdit(p)"
              size="xs"
              variant="ghost"
              color="error"
              icon="i-lucide-trash-2"
              title="Xóa giáo án"
              @click="openDeleteModal(p)"
            />
          </div>

          <UButton
            size="xs"
            variant="outline"
            icon="i-lucide-book-open"
            @click="openViewModal(p)"
          >
            Đọc bài giảng
          </UButton>
        </div>
      </div>
    </div>

    <!-- Modal Đọc Giáo Án -->
    <UModal v-model:open="viewOpen" :title="detailPlan?.title || 'Đang mở giáo án...'">
      <template #body>
        <div v-if="viewing" class="h-48 animate-pulse rounded-lg bg-stone-100 dark:bg-stone-800" />
        <div v-else-if="detailPlan" class="space-y-4">
          <div class="flex flex-wrap items-center justify-between border-b border-stone-100 pb-2 text-xs text-stone-500 dark:border-stone-800">
            <div>
              <span>Tác giả: <strong>{{ detailPlan.authorFullName }}</strong></span>
              <span v-if="detailPlan.classRoomName" class="ml-2">• Lớp: {{ detailPlan.classRoomName }}</span>
            </div>
            <div>
              Ngày tạo: {{ new Date(detailPlan.createdAt).toLocaleDateString('vi-VN') }}
            </div>
          </div>

          <!-- Nội dung an toàn HTML -->
          <div
            class="prose prose-stone dark:prose-invert max-w-none text-sm leading-relaxed"
            v-html="sanitize(detailPlan.contentHtml)"
          />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <UButton variant="outline" @click="viewOpen = false">Đóng</UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Soạn / Sửa Giáo Án -->
    <UModal
      v-model:open="formOpen"
      :title="isEditing ? 'Chỉnh sửa giáo án' : 'Soạn bài giảng giáo lý mới'"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Tiêu đề bài giảng <span class="text-red-500">*</span>
            </label>
            <UInput v-model="form.title" placeholder="Ví dụ: Bài 12: Chúa Giêsu Mặc Khải Về Chúa Cha..." />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Lớp áp dụng
              </label>
              <select
                v-model="form.classRoomId"
                class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              >
                <option :value="null">-- Dùng chung / Tự do --</option>
                <option v-for="c in classrooms" :key="c.id" :value="c.id">
                  {{ c.className }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Phạm vi chia sẻ
              </label>
              <select
                v-model="form.visibility"
                class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              >
                <option value="Class">Chỉ trong lớp</option>
                <option value="Branch">Trong ngành</option>
                <option value="Public">Công khai toàn xứ</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Từ khóa / Thẻ phân loại (Tags)
            </label>
            <UInput v-model="form.tags" placeholder="Khai Tâm, Rước Lễ, Tin Kính..." />
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Nội dung bài giảng (HTML / Văn bản) <span class="text-red-500">*</span>
            </label>
            <UTextarea
              v-model="form.contentHtml"
              placeholder="Nhập nội dung bài giảng, dàn bài, câu hỏi giáo lý, trò chơi ôn tập..."
              :rows="8"
            />
            <p class="mt-1 text-[11px] text-stone-400">
              Hệ thống tự động khử khuẩn mã độc XSS qua DOMPurify khi hiển thị.
            </p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="formOpen = false">Hủy</UButton>
          <UButton
            color="primary"
            :loading="saving"
            :disabled="!form.title.trim() || !form.contentHtml.trim()"
            @click="handleSavePlan"
          >
            {{ isEditing ? 'Cập nhật' : 'Lưu bài giảng' }}
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Xóa Giáo Án -->
    <UModal v-model:open="deleteOpen" title="Xác nhận xóa bài giảng">
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="deleteOpen = false">Hủy</UButton>
          <UButton color="error" :loading="deleting" @click="handleDeletePlan">
            Xác nhận xóa
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
