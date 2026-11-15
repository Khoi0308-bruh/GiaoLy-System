<script setup lang="ts">
import type { ApiError } from '~/composables/useApi'
import { toApiError } from '~/composables/useApi'
import { PERMISSIONS } from '~/shared/permissions'

definePageMeta({
  layout: 'admin',
  permission: PERMISSIONS.Sacraments.View
})

interface SacramentRequirement {
  id: string
  sacramentType: 'Baptism' | 'FirstCommunion' | 'Confirmation'
  code: string
  name: string
  description?: string
  isMandatory: boolean
  sortOrder: number
}

const api = useApi()
const permissions = usePermissions()

const requirements = ref<SacramentRequirement[]>([])
const loading = ref(false)
const error = ref<ApiError | null>(null)
const selectedSacrament = ref<string>('ALL')

// Modal state
const modalOpen = ref(false)
const isEditing = ref(false)
const formId = ref('')
const formType = ref<'Baptism' | 'FirstCommunion' | 'Confirmation'>('FirstCommunion')
const formCode = ref('')
const formName = ref('')
const formDescription = ref('')
const formIsMandatory = ref(true)
const formSortOrder = ref(0)
const formSubmitting = ref(false)
const formError = ref<ApiError | null>(null)

async function loadRequirements() {
  loading.value = true
  error.value = null
  try {
    const data = await api.get<SacramentRequirement[]>('/sacrament-requirements')
    requirements.value = Array.isArray(data) ? data : []
  } catch (e) {
    error.value = toApiError(e)
  } finally {
    loading.value = false
  }
}

const filteredList = computed(() => {
  if (selectedSacrament.value === 'ALL') return requirements.value
  return requirements.value.filter(r => r.sacramentType === selectedSacrament.value)
})

function openCreateModal() {
  isEditing.value = false
  formId.value = ''
  formType.value = 'FirstCommunion'
  formCode.value = ''
  formName.value = ''
  formDescription.value = ''
  formIsMandatory.value = true
  formSortOrder.value = requirements.value.length + 1
  formError.value = null
  modalOpen.value = true
}

function openEditModal(r: SacramentRequirement) {
  isEditing.value = true
  formId.value = r.id
  formType.value = r.sacramentType
  formCode.value = r.code
  formName.value = r.name
  formDescription.value = r.description || ''
  formIsMandatory.value = r.isMandatory
  formSortOrder.value = r.sortOrder
  formError.value = null
  modalOpen.value = true
}

async function submitForm() {
  formSubmitting.value = true
  formError.value = null
  try {
    const payload = {
      sacramentType: formType.value,
      code: formCode.value.toUpperCase().trim(),
      name: formName.value.trim(),
      description: formDescription.value.trim() || null,
      isMandatory: formIsMandatory.value,
      sortOrder: formSortOrder.value
    }

    if (isEditing.value) {
      await api.put(`/sacrament-requirements/${formId.value}`, payload)
    } else {
      await api.post('/sacrament-requirements', payload)
    }
    modalOpen.value = false
    await loadRequirements()
  } catch (e) {
    formError.value = toApiError(e)
  } finally {
    formSubmitting.value = false
  }
}

onMounted(loadRequirements)
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Yêu cầu chuẩn bị Bí tích"
      subtitle="Thiết lập các tiêu chí, điều kiện bắt buộc trước khi đoàn sinh lãnh nhận bí tích"
    >
      <template #actions>
        <UButton
          v-if="permissions.can(PERMISSIONS.Sacraments.ManageRequirements)"
          icon="i-lucide-plus"
          @click="openCreateModal"
        >
          Thêm yêu cầu
        </UButton>
      </template>
    </PageHeader>

    <ErrorState :error="error" @retry="loadRequirements" />

    <!-- Bộ lọc theo bí tích -->
    <div class="flex items-center gap-2 border-b border-stone-200 pb-2 dark:border-stone-800">
      <UButton
        :variant="selectedSacrament === 'ALL' ? 'solid' : 'ghost'"
        :color="selectedSacrament === 'ALL' ? 'primary' : 'neutral'"
        size="sm"
        @click="selectedSacrament = 'ALL'"
      >
        Tất cả bí tích
      </UButton>
      <UButton
        :variant="selectedSacrament === 'FirstCommunion' ? 'solid' : 'ghost'"
        :color="selectedSacrament === 'FirstCommunion' ? 'primary' : 'neutral'"
        size="sm"
        @click="selectedSacrament = 'FirstCommunion'"
      >
        Rước Lễ Lần Đầu
      </UButton>
      <UButton
        :variant="selectedSacrament === 'Confirmation' ? 'solid' : 'ghost'"
        :color="selectedSacrament === 'Confirmation' ? 'primary' : 'neutral'"
        size="sm"
        @click="selectedSacrament = 'Confirmation'"
      >
        Thêm Sức
      </UButton>
      <UButton
        :variant="selectedSacrament === 'Baptism' ? 'solid' : 'ghost'"
        :color="selectedSacrament === 'Baptism' ? 'primary' : 'neutral'"
        size="sm"
        @click="selectedSacrament = 'Baptism'"
      >
        Rửa Tội
      </UButton>
    </div>

    <!-- Bảng danh sách yêu cầu -->
    <div v-if="filteredList.length === 0 && !loading">
      <EmptyState title="Chưa có yêu cầu nào" description="Nhấn Thêm yêu cầu để thiết lập tiêu chuẩn cho bí tích này." />
    </div>

    <div v-else class="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-stone-200 bg-stone-50 text-xs font-semibold uppercase text-stone-600 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-400">
          <tr>
            <th class="px-4 py-3">Mã</th>
            <th class="px-4 py-3">Bí tích</th>
            <th class="px-4 py-3">Tiêu chuẩn / Yêu cầu</th>
            <th class="px-4 py-3">Tính chất</th>
            <th class="px-4 py-3 text-center">Thứ tự</th>
            <th class="px-4 py-3 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
          <tr v-for="r in filteredList" :key="r.id" class="hover:bg-stone-50 dark:hover:bg-stone-800/50">
            <td class="px-4 py-3 font-mono text-xs font-bold text-marian-700 dark:text-marian-400">
              {{ r.code }}
            </td>
            <td class="px-4 py-3 text-xs">
              <UBadge variant="subtle" color="primary" size="xs">
                {{ r.sacramentType }}
              </UBadge>
            </td>
            <td class="px-4 py-3">
              <strong class="text-stone-900 dark:text-white block">{{ r.name }}</strong>
              <span v-if="r.description" class="text-xs text-stone-500">{{ r.description }}</span>
            </td>
            <td class="px-4 py-3 text-xs">
              <span
                class="rounded px-2 py-0.5 font-medium"
                :class="r.isMandatory ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300' : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'"
              >
                {{ r.isMandatory ? 'Bắt buộc' : 'Khuyến nghị' }}
              </span>
            </td>
            <td class="px-4 py-3 text-center text-xs text-stone-400">
              #{{ r.sortOrder }}
            </td>
            <td class="px-4 py-3 text-right">
              <UButton
                v-if="permissions.can(PERMISSIONS.Sacraments.ManageRequirements)"
                size="xs"
                variant="ghost"
                color="neutral"
                icon="i-lucide-pencil"
                @click="openEditModal(r)"
              >
                Sửa
              </UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL THÊM / SỬA YÊU CẦU -->
    <UModal v-model:open="modalOpen" :title="isEditing ? 'Sửa yêu cầu bí tích' : 'Thêm yêu cầu bí tích mới'">
      <template #body>
        <form class="space-y-4" @submit.prevent="submitForm">
          <ErrorState :error="formError" />

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UFormField label="Loại Bí tích" name="sacramentType" required>
              <select
                v-model="formType"
                class="w-full rounded-md border border-stone-300 bg-white p-2 text-sm dark:border-stone-700 dark:bg-stone-900 dark:text-white"
                required
              >
                <option value="FirstCommunion">Rước Lễ Lần Đầu</option>
                <option value="Confirmation">Thêm Sức</option>
                <option value="Baptism">Rửa Tội</option>
              </select>
            </UFormField>

            <UFormField label="Mã yêu cầu (viết tắt)" name="code" required>
              <UInput v-model="formCode" placeholder="Ví dụ: RL_DOC_PRAYER" class="w-full" required />
            </UFormField>
          </div>

          <UFormField label="Tên tiêu chí / Yêu cầu" name="name" required>
            <UInput v-model="formName" placeholder="Ví dụ: Thuộc kinh bổn và 10 điều răn" class="w-full" required />
          </UFormField>

          <UFormField label="Mô tả chi tiết" name="description">
            <UTextarea v-model="formDescription" placeholder="Hướng dẫn cụ thể cho giáo lý viên khi đánh giá..." rows="2" class="w-full" />
          </UFormField>

          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer text-sm">
              <input v-model="formIsMandatory" type="checkbox" class="rounded text-marian-600">
              <span>Bắt buộc phải đạt trước khi cấp chứng chỉ</span>
            </label>
            <div class="w-28">
              <UFormField label="Thứ tự" name="sortOrder">
                <UInput v-model.number="formSortOrder" type="number" class="w-full" />
              </UFormField>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3">
            <UButton variant="ghost" color="neutral" @click="modalOpen = false">Hủy</UButton>
            <UButton type="submit" :loading="formSubmitting">{{ isEditing ? 'Lưu thay đổi' : 'Tạo yêu cầu' }}</UButton>
          </div>
        </form>
      </template>
    </UModal>
  </div>
</template>
