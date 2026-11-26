<script setup lang="ts">
import { PERMISSIONS } from '../../../shared/permissions'
import type { ApiError } from '../../../composables/useApi'

definePageMeta({ layout: 'admin', permission: PERMISSIONS.Banners.Manage })

interface BannerItem {
  id: string
  title: string
  imageUrl: string
  linkUrl?: string | null
  orderIndex: number
  isActive: boolean
  createdAt: string
}

const api = useApi()
const toast = useToast()

const banners = ref<BannerItem[]>([])
const loading = ref(true)
const error = ref<ApiError | null>(null)

// Modal Thêm / Sửa
const formOpen = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const currentId = ref<string | null>(null)
const form = ref({
  title: '',
  imageUrl: '',
  linkUrl: '',
  orderIndex: 0,
  isActive: true
})

// Modal Xóa
const deleteOpen = ref(false)
const deleting = ref(false)
const selectedBanner = ref<BannerItem | null>(null)

async function loadData() {
  loading.value = true
  error.value = null
  try {
    // Danh sách quản trị: gồm cả banner đang tắt để bật lại; endpoint công khai chỉ trả banner đang hiển thị.
    const res = await api.get<BannerItem[]>('/banners')
    banners.value = (res || []).sort((a, b) => a.orderIndex - b.orderIndex)
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
    title: '',
    imageUrl: '',
    linkUrl: '',
    orderIndex: banners.value.length + 1,
    isActive: true
  }
  formOpen.value = true
}

function openEditModal(b: BannerItem) {
  isEditing.value = true
  currentId.value = b.id
  form.value = {
    title: b.title,
    imageUrl: b.imageUrl,
    linkUrl: b.linkUrl || '',
    orderIndex: b.orderIndex,
    isActive: b.isActive
  }
  formOpen.value = true
}

async function handleSaveBanner() {
  if (!form.value.title.trim() || !form.value.imageUrl.trim()) {
    toast.add({ title: 'Vui lòng nhập tiêu đề và đường dẫn hình ảnh', color: 'error' })
    return
  }
  saving.value = true
  try {
    const payload = {
      title: form.value.title.trim(),
      imageUrl: form.value.imageUrl.trim(),
      linkUrl: form.value.linkUrl?.trim() || null,
      orderIndex: Number(form.value.orderIndex) || 0,
      isActive: form.value.isActive
    }

    if (isEditing.value && currentId.value) {
      await api.put(`/banners/${currentId.value}`, payload)
      toast.add({ title: 'Cập nhật banner thành công', color: 'success' })
    } else {
      await api.post('/banners', payload)
      toast.add({ title: 'Thêm banner mới thành công', color: 'success' })
    }
    formOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể lưu banner', description: err.detail || err.message, color: 'error' })
  } finally {
    saving.value = false
  }
}

function openDeleteModal(b: BannerItem) {
  selectedBanner.value = b
  deleteOpen.value = true
}

async function handleDeleteBanner() {
  if (!selectedBanner.value) return
  deleting.value = true
  try {
    await api.delete(`/banners/${selectedBanner.value.id}`)
    toast.add({ title: 'Đã xóa banner', color: 'success' })
    deleteOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể xóa banner', description: err.detail || err.message, color: 'error' })
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Banner Trang chủ & Cổng thông tin"
      subtitle="Quản lý slide hình ảnh nổi bật trên trang chủ Portal giáo xứ"
    >
      <template #actions>
        <UButton
          color="primary"
          icon="i-lucide-plus"
          @click="openCreateModal"
        >
          Thêm banner mới
        </UButton>
      </template>
    </PageHeader>

    <ErrorState v-if="error" :error="error" @retry="loadData" />

    <!-- Danh sách banner -->
    <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 3" :key="i" class="h-56 animate-pulse rounded-2xl border border-stone-200 bg-stone-100 dark:border-stone-800 dark:bg-stone-800/40" />
    </div>

    <EmptyState
      v-else-if="banners.length === 0"
      icon="i-lucide-image"
      title="Chưa có banner nào"
      description="Thêm banner để làm đẹp trang chủ cổng thông tin của giáo xứ."
    >
      <template #actions>
        <UButton color="primary" icon="i-lucide-plus" @click="openCreateModal">
          Thêm banner ngay
        </UButton>
      </template>
    </EmptyState>

    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="b in banners"
        :key="b.id"
        class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:border-vatican-500 hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
      >
        <!-- Ảnh banner -->
        <div class="relative aspect-video w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
          <img
            :src="b.imageUrl"
            :alt="b.title"
            class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <div class="absolute top-2 right-2 flex items-center gap-1.5">
            <span
              class="rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm"
              :class="b.isActive ? 'bg-emerald-500 text-white' : 'bg-stone-500 text-white'"
            >
              {{ b.isActive ? 'Hiển thị' : 'Tạm ẩn' }}
            </span>
          </div>
          <div class="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 font-mono text-xs font-bold text-white">
            Vị trí: #{{ b.orderIndex }}
          </div>
        </div>

        <!-- Chi tiết -->
        <div class="p-4">
          <h4 class="font-display text-base font-bold text-stone-900 dark:text-stone-100">
            {{ b.title }}
          </h4>
          <p v-if="b.linkUrl" class="mt-1 truncate text-xs text-stone-400">
            Link: <a :href="b.linkUrl" target="_blank" class="hover:underline text-marian-600 dark:text-marian-400">{{ b.linkUrl }}</a>
          </p>
        </div>

        <!-- Thao tác -->
        <div class="flex items-center justify-end gap-1 border-t border-stone-100 p-3 dark:border-stone-800">
          <UButton
            size="xs"
            variant="ghost"
            color="neutral"
            icon="i-lucide-pencil"
            @click="openEditModal(b)"
          />
          <UButton
            size="xs"
            variant="ghost"
            color="error"
            icon="i-lucide-trash-2"
            @click="openDeleteModal(b)"
          />
        </div>
      </div>
    </div>

    <!-- Modal Thêm / Sửa Banner -->
    <UModal
      v-model:open="formOpen"
      :title="isEditing ? 'Sửa banner' : 'Thêm banner mới'"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Tiêu đề banner <span class="text-red-500">*</span>
            </label>
            <UInput v-model="form.title" placeholder="Ví dụ: Mừng Chúa Phục Sinh, Trại Hè 2026..." />
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Đường dẫn hình ảnh (URL) <span class="text-red-500">*</span>
            </label>
            <UInput v-model="form.imageUrl" placeholder="https://..." />
            <div v-if="form.imageUrl" class="mt-2 aspect-video w-full overflow-hidden rounded-lg border border-stone-200">
              <img :src="form.imageUrl" alt="Preview" class="h-full w-full object-cover" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Liên kết chuyển hướng khi nhấp (Link URL)
            </label>
            <UInput v-model="form.linkUrl" placeholder="https://... hoặc /thong-bao/..." />
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Thứ tự hiển thị
            </label>
            <UInput v-model.number="form.orderIndex" type="number" min="0" />
          </div>

          <div class="flex items-center gap-2">
            <input
              id="bannerActiveCheck"
              type="checkbox"
              v-model="form.isActive"
              class="rounded text-marian-600"
            />
            <label for="bannerActiveCheck" class="text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
              Kích hoạt hiển thị trên trang chủ
            </label>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="formOpen = false">Hủy</UButton>
          <UButton
            color="primary"
            :loading="saving"
            :disabled="!form.title.trim() || !form.imageUrl.trim()"
            @click="handleSaveBanner"
          >
            {{ isEditing ? 'Cập nhật' : 'Thêm banner' }}
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Xóa Banner -->
    <UModal v-model:open="deleteOpen" title="Xác nhận xóa banner">
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="deleteOpen = false">Hủy</UButton>
          <UButton color="error" :loading="deleting" @click="handleDeleteBanner">Xác nhận xóa</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
