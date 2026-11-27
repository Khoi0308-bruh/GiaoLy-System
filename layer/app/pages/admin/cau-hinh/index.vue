<script setup lang="ts">
import { PERMISSIONS } from '../../../shared/permissions'
import type { ApiError } from '../../../composables/useApi'

definePageMeta({ layout: 'admin', permission: PERMISSIONS.Settings.View })

interface SettingItem {
  key: string
  value: string
  description?: string | null
  updatedBy?: string | null
  updatedAt: string
}

const api = useApi()
const toast = useToast()
const { can } = usePermissions()

const settings = ref<SettingItem[]>([])
const loading = ref(true)
const error = ref<ApiError | null>(null)
const searchQuery = ref('')

// Modal Sửa cấu hình
const editOpen = ref(false)
const saving = ref(false)
const selectedSetting = ref<SettingItem | null>(null)
const editValue = ref('')

async function loadData() {
  loading.value = true
  error.value = null
  try {
    const res = await api.get<SettingItem[]>('/system/settings')
    settings.value = res || []
  } catch (e) {
    error.value = e as ApiError
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

const filteredSettings = computed(() => {
  return settings.value.filter(s => {
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const matchKey = s.key.toLowerCase().includes(q)
      const matchDesc = (s.description || '').toLowerCase().includes(q)
      return matchKey || matchDesc
    }
    return true
  })
})

function openEditModal(s: SettingItem) {
  selectedSetting.value = s
  editValue.value = s.value
  editOpen.value = true
}

async function handleSaveSetting() {
  if (!selectedSetting.value) return
  saving.value = true
  try {
    await api.put(`/system/settings/${encodeURIComponent(selectedSetting.value.key)}`, {
      value: editValue.value.trim()
    })
    toast.add({ title: `Đã cập nhật cấu hình: ${selectedSetting.value.key}`, color: 'success' })
    editOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể cập nhật cấu hình', description: err.detail || err.message, color: 'error' })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Cấu hình Nghiệp vụ Hệ thống"
      subtitle="Thiết lập các tham số hoạt động: chính sách bảo mật, tiêu chuẩn lên lớp, thời hạn mở khóa sổ điểm"
    />

    <ErrorState v-if="error" :error="error" @retry="loadData" />

    <!-- Tìm kiếm -->
    <div class="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div class="w-full sm:w-80">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Tìm theo mã cấu hình hoặc mô tả..."
          size="sm"
        />
      </div>
      <div class="text-xs text-stone-500 font-mono">
        {{ settings.length }} tham số cấu hình
      </div>
    </div>

    <!-- Bảng danh sách cấu hình -->
    <ListTable
      :columns="can(PERMISSIONS.Settings.Manage) ? 5 : 4"
      :loading="loading"
      :empty="filteredSettings.length === 0"
      loading-text="Đang tải danh sách tham số..."
      empty-title="Không tìm thấy tham số cấu hình nào"
      empty-description="Thử đổi từ khoá tìm kiếm."
    >
      <template #head>
        <th class="w-[26%] px-4 py-3">Tham số</th>
        <th class="w-[16%] px-4 py-3">Giá trị</th>
        <th class="w-[28%] px-4 py-3">Mô tả</th>
        <th class="w-[16%] px-4 py-3">Cập nhật</th>
        <th v-if="can(PERMISSIONS.Settings.Manage)" class="w-[14%] px-3 py-3 text-right">Thao tác</th>
      </template>

      <template #rows>
        <tr
          v-for="s in filteredSettings"
          :key="s.key"
          class="transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50"
        >
          <td class="px-4 py-3 font-mono text-xs font-bold">
            <span class="block truncate text-stone-900 dark:text-stone-100" :title="s.key">{{ s.key }}</span>
          </td>
          <td class="px-4 py-3">
            <span class="inline-block max-w-full truncate rounded bg-stone-100 px-2 py-0.5 font-mono text-xs font-bold text-marian-600 dark:bg-stone-800 dark:text-marian-400" :title="s.value">
              {{ s.value }}
            </span>
          </td>
          <td class="px-4 py-3 text-xs text-stone-600 dark:text-stone-300">
            <span class="line-clamp-2" :title="s.description || undefined">{{ s.description || '—' }}</span>
          </td>
          <td class="px-4 py-3 text-[11px] whitespace-nowrap text-stone-400">
            {{ new Date(s.updatedAt).toLocaleDateString('vi-VN') }}
          </td>
          <td v-if="can(PERMISSIONS.Settings.Manage)" class="px-3 py-3 text-right">
            <UButton
              size="xs"
              variant="outline"
              color="neutral"
              icon="i-lucide-pencil"
              title="Sửa giá trị"
              @click="openEditModal(s)"
            />
          </td>
        </tr>
      </template>

      <template #cards>
        <div v-for="s in filteredSettings" :key="s.key" class="space-y-1.5 px-4 py-3">
          <div class="flex items-start justify-between gap-2">
            <p class="min-w-0 truncate font-mono text-xs font-bold text-stone-900 dark:text-stone-100">{{ s.key }}</p>
            <span class="max-w-[45%] shrink-0 truncate rounded bg-stone-100 px-2 py-0.5 font-mono text-[11px] font-bold text-marian-600 dark:bg-stone-800 dark:text-marian-400">
              {{ s.value }}
            </span>
          </div>
          <p v-if="s.description" class="line-clamp-2 text-xs text-stone-500">{{ s.description }}</p>
          <div class="flex items-center justify-between gap-2">
            <span class="text-[11px] text-stone-400">{{ new Date(s.updatedAt).toLocaleDateString('vi-VN') }}</span>
            <UButton
              v-if="can(PERMISSIONS.Settings.Manage)"
              size="xs"
              variant="outline"
              color="neutral"
              icon="i-lucide-pencil"
              @click="openEditModal(s)"
            >
              Sửa giá trị
            </UButton>
          </div>
        </div>
      </template>
    </ListTable>


    <!-- Modal Sửa Giá Trị Cấu Hình -->
    <UModal
      v-model:open="editOpen"
      :title="`Chỉnh sửa tham số: ${selectedSetting?.key}`"
      :description="selectedSetting?.description || ''"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Giá trị mới (Value) <span class="text-red-500">*</span>
            </label>
            <UInput v-model="editValue" />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="editOpen = false">Hủy</UButton>
          <UButton color="primary" :loading="saving" @click="handleSaveSetting">
            Lưu cấu hình
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
