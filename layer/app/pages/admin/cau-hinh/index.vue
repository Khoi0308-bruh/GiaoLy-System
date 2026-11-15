<script setup lang="ts">
import { PERMISSIONS } from '~/shared/permissions'
import type { ApiError } from '~/composables/useApi'

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
    <div class="rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-stone-50 text-xs font-semibold uppercase text-stone-600 dark:bg-stone-800/70 dark:text-stone-300">
            <tr>
              <th class="p-4">Tham số cấu hình</th>
              <th class="p-4">Giá trị hiện tại</th>
              <th class="p-4">Mô tả nghiệp vụ</th>
              <th class="p-4">Cập nhật cuối</th>
              <th v-if="can(PERMISSIONS.Settings.Manage)" class="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
            <tr v-if="loading">
              <td colspan="5" class="p-8 text-center text-sm text-stone-400 animate-pulse">
                Đang tải danh sách tham số...
              </td>
            </tr>
            <tr v-else-if="filteredSettings.length === 0">
              <td colspan="5" class="p-8 text-center text-sm text-stone-500">
                Không tìm thấy tham số cấu hình nào.
              </td>
            </tr>
            <tr
              v-for="s in filteredSettings"
              :key="s.key"
              class="hover:bg-stone-50/70 dark:hover:bg-stone-800/40"
            >
              <td class="p-4 font-mono font-bold text-xs text-stone-900 dark:text-stone-100">
                {{ s.key }}
              </td>
              <td class="p-4 font-mono font-bold text-xs text-marian-600 dark:text-marian-400">
                <span class="rounded bg-stone-100 px-2.5 py-1 dark:bg-stone-800">
                  {{ s.value }}
                </span>
              </td>
              <td class="p-4 text-xs text-stone-600 dark:text-stone-300 max-w-md">
                {{ s.description || '—' }}
              </td>
              <td class="p-4 text-xs text-stone-400 whitespace-nowrap">
                {{ new Date(s.updatedAt).toLocaleString('vi-VN') }}
              </td>
              <td v-if="can(PERMISSIONS.Settings.Manage)" class="p-4 text-right whitespace-nowrap">
                <UButton
                  size="xs"
                  variant="outline"
                  icon="i-lucide-pencil"
                  @click="openEditModal(s)"
                >
                  Sửa giá trị
                </UButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

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
