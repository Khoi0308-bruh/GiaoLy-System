<script setup lang="ts">
import { PERMISSIONS } from '../../../shared/permissions'
import type { ApiError } from '../../../composables/useApi'

definePageMeta({ layout: 'admin', permission: PERMISSIONS.Announcements.View })

interface AnnouncementItem {
  id: string
  title: string
  contentHtml: string
  announcementType: 'Normal' | 'Urgent' | 'Event' | string
  audience: 'Public' | 'Branch' | 'Class' | string
  branchId?: number | null
  branchName?: string | null
  classRoomId?: string | null
  classRoomName?: string | null
  authorUserId: string
  authorFullName: string
  publishedAt: string
  expiresAt?: string | null
  createdAt: string
}

interface BranchItem {
  id: number
  name: string
}

interface ClassRoomOption {
  id: string
  className: string
}

const api = useApi()
const toast = useToast()
const { can } = usePermissions()
const { sanitize } = useSafeHtml()

const announcements = ref<AnnouncementItem[]>([])
const branches = ref<BranchItem[]>([])
const classrooms = ref<ClassRoomOption[]>([])
const loading = ref(true)
const error = ref<ApiError | null>(null)

// Bộ lọc
const filterAudience = ref<string>('ALL')
const filterType = ref<string>('ALL')
const searchQuery = ref<string>('')

// Modal Xem chi tiết
const viewOpen = ref(false)
const selectedAnnouncement = ref<AnnouncementItem | null>(null)

// Modal Tạo / Sửa
const formOpen = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const currentId = ref<string | null>(null)
const form = ref({
  title: '',
  contentHtml: '',
  announcementType: 'Normal',
  audience: 'Public',
  branchId: null as number | null,
  classRoomId: null as string | null,
  expiresAt: ''
})

// Modal Xóa
const deleteOpen = ref(false)
const deleting = ref(false)

async function loadData() {
  loading.value = true
  error.value = null
  try {
    const [resAnnounce, resBranches, resClasses] = await Promise.all([
      api.get<AnnouncementItem[]>('/announcements'),
      api.get<BranchItem[]>('/branches').catch(() => []),
      api.get<any>('/academic-years/active').then(y => api.get<any[]>(`/academic-years/${y.id}/classrooms`)).catch(() => [])
    ])
    announcements.value = resAnnounce || []
    branches.value = resBranches || []
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

const filteredAnnouncements = computed(() => {
  return announcements.value.filter(a => {
    if (filterAudience.value !== 'ALL' && a.audience !== filterAudience.value) return false
    if (filterType.value !== 'ALL' && a.announcementType !== filterType.value) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const matchTitle = a.title.toLowerCase().includes(q)
      const matchAuthor = a.authorFullName.toLowerCase().includes(q)
      return matchTitle || matchAuthor
    }
    return true
  })
})

function openViewModal(a: AnnouncementItem) {
  selectedAnnouncement.value = a
  viewOpen.value = true
}

function openCreateModal() {
  isEditing.value = false
  currentId.value = null
  form.value = {
    title: '',
    contentHtml: '',
    announcementType: 'Normal',
    audience: 'Public',
    branchId: null,
    classRoomId: null,
    expiresAt: ''
  }
  formOpen.value = true
}

function openEditModal(a: AnnouncementItem) {
  isEditing.value = true
  currentId.value = a.id
  form.value = {
    title: a.title,
    contentHtml: a.contentHtml,
    announcementType: a.announcementType,
    audience: a.audience,
    branchId: a.branchId ?? null,
    classRoomId: a.classRoomId ?? null,
    expiresAt: a.expiresAt ? a.expiresAt.substring(0, 10) : ''
  }
  formOpen.value = true
}

async function handleSaveAnnouncement() {
  if (!form.value.title.trim() || !form.value.contentHtml.trim()) {
    toast.add({ title: 'Vui lòng nhập tiêu đề và nội dung thông báo', color: 'error' })
    return
  }
  saving.value = true
  try {
    const payload = {
      title: form.value.title.trim(),
      contentHtml: form.value.contentHtml,
      announcementType: form.value.announcementType,
      audience: form.value.audience,
      branchId: form.value.audience === 'Branch' ? form.value.branchId : null,
      classRoomId: form.value.audience === 'Class' ? form.value.classRoomId : null,
      expiresAt: form.value.expiresAt ? new Date(form.value.expiresAt).toISOString() : null
    }

    if (isEditing.value && currentId.value) {
      await api.put(`/announcements/${currentId.value}`, payload)
      toast.add({ title: 'Cập nhật thông báo thành công', color: 'success' })
    } else {
      await api.post('/announcements', payload)
      toast.add({ title: 'Đăng thông báo mới thành công', color: 'success' })
    }
    formOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Lỗi lưu thông báo', description: err.detail || err.message, color: 'error' })
  } finally {
    saving.value = false
  }
}

function openDeleteModal(a: AnnouncementItem) {
  selectedAnnouncement.value = a
  deleteOpen.value = true
}

async function handleDeleteAnnouncement() {
  if (!selectedAnnouncement.value) return
  deleting.value = true
  try {
    await api.delete(`/announcements/${selectedAnnouncement.value.id}`)
    toast.add({ title: 'Đã xóa thông báo', color: 'success' })
    deleteOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể xóa thông báo', description: err.detail || err.message, color: 'error' })
  } finally {
    deleting.value = false
  }
}

function getTypeBadge(type: string) {
  switch (type) {
    case 'Urgent': return { label: 'Khẩn cấp', color: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' }
    case 'Event': return { label: 'Sự kiện', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' }
    default: return { label: 'Bình thường', color: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300' }
  }
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Bản tin & Thông báo"
      subtitle="Quản lý và phát đi các thông báo chính thức đến toàn xứ, các ngành và lớp giáo lý"
    >
      <template #actions>
        <UButton
          v-if="can(PERMISSIONS.Announcements.Create)"
          color="primary"
          icon="i-lucide-plus"
          @click="openCreateModal"
        >
          Tạo thông báo mới
        </UButton>
      </template>
    </PageHeader>

    <ErrorState v-if="error" :error="error" @retry="loadData" />

    <!-- Bộ lọc & Tìm kiếm -->
    <div class="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-stone-800 dark:bg-stone-900">
      <div class="flex flex-wrap items-center gap-3">
        <!-- Đối tượng nhận -->
        <div class="flex items-center gap-2">
          <label class="text-xs font-semibold uppercase text-stone-500">Đối tượng:</label>
          <select
            v-model="filterAudience"
            class="h-9 rounded-lg border border-stone-200 bg-stone-50 px-3 text-xs font-medium dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
          >
            <option value="ALL">Tất cả đối tượng</option>
            <option value="Public">Toàn thể giáo xứ</option>
            <option value="Branch">Theo ngành</option>
            <option value="Class">Theo lớp</option>
          </select>
        </div>

        <!-- Loại thông báo -->
        <div class="flex items-center gap-2">
          <label class="text-xs font-semibold uppercase text-stone-500">Loại:</label>
          <select
            v-model="filterType"
            class="h-9 rounded-lg border border-stone-200 bg-stone-50 px-3 text-xs font-medium dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
          >
            <option value="ALL">Tất cả loại tin</option>
            <option value="Normal">Tin thường</option>
            <option value="Urgent">Tin khẩn</option>
            <option value="Event">Tin sự kiện</option>
          </select>
        </div>
      </div>

      <div class="w-full sm:w-64">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Tìm tiêu đề, người đăng..."
          size="sm"
        />
      </div>
    </div>

    <!-- Danh sách thông báo -->
    <div class="rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-stone-50 text-xs font-semibold uppercase text-stone-600 dark:bg-stone-800/70 dark:text-stone-300">
            <tr>
              <th class="p-4">Tiêu đề thông báo</th>
              <th class="p-4 text-center">Loại</th>
              <th class="p-4">Phạm vi nhận tin</th>
              <th class="p-4">Người đăng</th>
              <th class="p-4">Ngày đăng</th>
              <th class="p-4">Hạn hiển thị</th>
              <th class="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
            <tr v-if="loading">
              <td colspan="7" class="p-8 text-center text-sm text-stone-400 animate-pulse">
                Đang tải thông báo...
              </td>
            </tr>
            <tr v-else-if="filteredAnnouncements.length === 0">
              <td colspan="7" class="p-8 text-center text-sm text-stone-500">
                Chưa có thông báo nào phù hợp.
              </td>
            </tr>
            <tr
              v-for="a in filteredAnnouncements"
              :key="a.id"
              class="hover:bg-stone-50/70 dark:hover:bg-stone-800/40"
            >
              <td class="p-4">
                <span
                  class="font-semibold text-stone-900 hover:text-marian-600 cursor-pointer dark:text-stone-100 dark:hover:text-marian-400"
                  @click="openViewModal(a)"
                >
                  {{ a.title }}
                </span>
              </td>
              <td class="p-4 text-center">
                <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="getTypeBadge(a.announcementType).color">
                  {{ getTypeBadge(a.announcementType).label }}
                </span>
              </td>
              <td class="p-4 text-xs font-medium text-stone-700 dark:text-stone-300">
                <span v-if="a.audience === 'Public'">Toàn giáo xứ</span>
                <span v-else-if="a.audience === 'Branch'">Ngành {{ a.branchName }}</span>
                <span v-else>Lớp {{ a.classRoomName }}</span>
              </td>
              <td class="p-4 text-xs text-stone-600 dark:text-stone-300">
                {{ a.authorFullName }}
              </td>
              <td class="p-4 text-xs text-stone-500 whitespace-nowrap">
                {{ new Date(a.publishedAt).toLocaleDateString('vi-VN') }}
              </td>
              <td class="p-4 text-xs text-stone-500 whitespace-nowrap">
                {{ a.expiresAt ? new Date(a.expiresAt).toLocaleDateString('vi-VN') : 'Không thời hạn' }}
              </td>
              <td class="p-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-1">
                  <UButton
                    size="xs"
                    variant="ghost"
                    color="neutral"
                    icon="i-lucide-eye"
                    title="Xem nội dung"
                    @click="openViewModal(a)"
                  />
                  <UButton
                    v-if="can(PERMISSIONS.Announcements.Update)"
                    size="xs"
                    variant="ghost"
                    color="neutral"
                    icon="i-lucide-pencil"
                    title="Chỉnh sửa"
                    @click="openEditModal(a)"
                  />
                  <UButton
                    v-if="can(PERMISSIONS.Announcements.Delete)"
                    size="xs"
                    variant="ghost"
                    color="error"
                    icon="i-lucide-trash-2"
                    title="Xóa"
                    @click="openDeleteModal(a)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Xem Chi Tiết Thông Báo -->
    <UModal v-model:open="viewOpen" :title="selectedAnnouncement?.title || 'Thông báo'">
      <template #body>
        <div v-if="selectedAnnouncement" class="space-y-4">
          <div class="flex items-center justify-between border-b border-stone-100 pb-2 text-xs text-stone-500 dark:border-stone-800">
            <span>Người đăng: <strong>{{ selectedAnnouncement.authorFullName }}</strong></span>
            <span>Ngày đăng: {{ new Date(selectedAnnouncement.publishedAt).toLocaleDateString('vi-VN') }}</span>
          </div>

          <div
            class="prose prose-stone dark:prose-invert max-w-none text-sm leading-relaxed"
            v-html="sanitize(selectedAnnouncement.contentHtml)"
          />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <UButton variant="outline" @click="viewOpen = false">Đóng</UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Tạo / Sửa Thông Báo -->
    <UModal
      v-model:open="formOpen"
      :title="isEditing ? 'Sửa thông báo' : 'Tạo thông báo mới'"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Tiêu đề thông báo <span class="text-red-500">*</span>
            </label>
            <UInput v-model="form.title" placeholder="Nhập tiêu đề thông báo..." />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Loại thông báo
              </label>
              <select
                v-model="form.announcementType"
                class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              >
                <option value="Normal">Bình thường</option>
                <option value="Urgent">Khẩn cấp</option>
                <option value="Event">Sự kiện</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Phạm vi đối tượng
              </label>
              <select
                v-model="form.audience"
                class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              >
                <option value="Public">Toàn thể giáo xứ</option>
                <option value="Branch">Theo ngành</option>
                <option value="Class">Theo lớp</option>
              </select>
            </div>
          </div>

          <div v-if="form.audience === 'Branch'">
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Chọn ngành
            </label>
            <select
              v-model="form.branchId"
              class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            >
              <option v-for="b in branches" :key="b.id" :value="b.id">
                {{ b.name }}
              </option>
            </select>
          </div>

          <div v-if="form.audience === 'Class'">
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Chọn lớp học
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

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Ngày hết hạn hiển thị (tùy chọn)
            </label>
            <UInput v-model="form.expiresAt" type="date" />
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Nội dung thông báo (HTML) <span class="text-red-500">*</span>
            </label>
            <UTextarea v-model="form.contentHtml" placeholder="Nhập nội dung bài viết..." :rows="6" />
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
            @click="handleSaveAnnouncement"
          >
            {{ isEditing ? 'Cập nhật' : 'Đăng thông báo' }}
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Xóa -->
    <UModal v-model:open="deleteOpen" title="Xác nhận xóa thông báo">
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="deleteOpen = false">Hủy</UButton>
          <UButton color="error" :loading="deleting" @click="handleDeleteAnnouncement">
            Xác nhận xóa
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
