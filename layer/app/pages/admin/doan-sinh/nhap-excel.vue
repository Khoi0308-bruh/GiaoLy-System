<script setup lang="ts">
import type { ApiError } from '../../../composables/useApi'
import { toApiError } from '../../../composables/useApi'
import { PERMISSIONS } from '../../../shared/permissions'

definePageMeta({
  layout: 'admin',
  permission: PERMISSIONS.Students.Import
})

interface ImportErrorItem {
  rowNumber: number
  field?: string
  message: string
  rawData?: Record<string, unknown>
}

interface ImportPreviewResult {
  id: string
  totalRows: number
  validRows: number
  invalidRows: number
  errors: ImportErrorItem[]
  status?: string
}

const api = useApi()

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const applying = ref(false)
const canceling = ref(false)
const downloadingTemplate = ref(false)

const previewResult = ref<ImportPreviewResult | null>(null)
const error = ref<ApiError | null>(null)
const importSuccess = ref(false)
const appliedCount = ref(0)

async function downloadTemplate() {
  downloadingTemplate.value = true
  try {
    const blob = await api.download('/imports/students/template')
    const url = window.URL.createObjectURL(blob as Blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Mau_Nhap_Doan_Sinh_GiaoLy.xlsx'
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (e) {
    error.value = toApiError(e)
  } finally {
    downloadingTemplate.value = false
  }
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files?.[0]) {
    selectedFile.value = target.files[0]
    previewResult.value = null
    error.value = null
  }
}

async function uploadAndPreview() {
  if (!selectedFile.value) return
  uploading.value = true
  error.value = null

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    const res = await api.post<ImportPreviewResult>('/imports/students', formData)
    previewResult.value = res
  } catch (e) {
    error.value = toApiError(e)
  } finally {
    uploading.value = false
  }
}

async function applyImport() {
  if (!previewResult.value?.id) return
  applying.value = true
  error.value = null

  try {
    await api.post(`/imports/${previewResult.value.id}/apply`)
    appliedCount.value = previewResult.value.validRows
    importSuccess.value = true
    previewResult.value = null
    selectedFile.value = null
  } catch (e) {
    error.value = toApiError(e)
  } finally {
    applying.value = false
  }
}

async function cancelImport() {
  if (!previewResult.value?.id) return
  canceling.value = true
  error.value = null

  try {
    await api.post(`/imports/${previewResult.value.id}/cancel`)
    previewResult.value = null
    selectedFile.value = null
  } catch (e) {
    error.value = toApiError(e)
  } finally {
    canceling.value = false
  }
}

function reset() {
  selectedFile.value = null
  previewResult.value = null
  error.value = null
  importSuccess.value = false
  if (fileInput.value) fileInput.value.value = ''
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Nhập đoàn sinh từ Excel"
      subtitle="Quy trình nhập 2 bước an toàn: Kiểm tra xác thực trước khi lưu vào cơ sở dữ liệu"
    >
      <template #actions>
        <UButton
          variant="outline"
          color="neutral"
          icon="i-lucide-file-down"
          :loading="downloadingTemplate"
          @click="downloadTemplate"
        >
          Tải file mẫu Excel
        </UButton>
        <UButton variant="outline" color="neutral" icon="i-lucide-arrow-left" to="/admin/doan-sinh">
          Quay lại danh sách
        </UButton>
      </template>
    </PageHeader>

    <ErrorState :error="error" />

    <!-- Thông báo hoàn tất thành công -->
    <div
      v-if="importSuccess"
      class="rounded-xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-800 dark:bg-green-950/40"
    >
      <div class="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300">
        <UIcon name="i-lucide-check-circle" class="size-6" />
      </div>
      <h2 class="text-xl font-bold text-green-800 dark:text-green-200">
        Nhập dữ liệu thành công!
      </h2>
      <p class="mt-1 text-sm text-green-700 dark:text-green-300">
        Đã thêm thành công {{ appliedCount }} đoàn sinh vào hệ thống.
      </p>
      <div class="mt-6 flex justify-center gap-3">
        <UButton color="success" to="/admin/doan-sinh" icon="i-lucide-list">
          Xem danh sách đoàn sinh
        </UButton>
        <UButton variant="outline" color="neutral" @click="reset">
          Nhập tệp khác
        </UButton>
      </div>
    </div>

    <!-- BƯỚC 1: CHỌN VÀ TẢI FILE EXCEL -->
    <div
      v-else-if="!previewResult"
      class="rounded-xl border border-stone-200 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900"
    >
      <h2 class="mb-2 text-lg font-bold text-stone-900 dark:text-white">
        Bước 1: Chọn tệp Excel dữ liệu đoàn sinh
      </h2>
      <p class="mb-4 text-xs text-stone-500">
        Hỗ trợ định dạng .xlsx hoặc .xls. Tệp cần tuân thủ cấu trúc các cột trong tệp mẫu.
      </p>

      <div
        class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50/50 p-8 text-center dark:border-stone-700 dark:bg-stone-950/50"
      >
        <UIcon name="i-lucide-file-spreadsheet" class="size-12 text-vatican-600 dark:text-vatican-400 mb-3" />
        <p class="text-sm font-semibold text-stone-800 dark:text-stone-200">
          {{ selectedFile ? selectedFile.name : 'Chọn tệp Excel từ máy tính của bạn' }}
        </p>
        <p v-if="selectedFile" class="text-xs text-stone-500 mt-1">
          Dung lượng: {{ (selectedFile.size / 1024).toFixed(1) }} KB
        </p>
        <input
          ref="fileInput"
          type="file"
          accept=".xlsx, .xls"
          class="hidden"
          @change="handleFileSelect"
        >

        <div class="mt-4 flex gap-2">
          <UButton variant="outline" color="neutral" icon="i-lucide-folder-open" @click="fileInput?.click()">
            {{ selectedFile ? 'Chọn tệp khác' : 'Duyệt tệp' }}
          </UButton>
          <UButton
            v-if="selectedFile"
            color="primary"
            icon="i-lucide-scan-line"
            :loading="uploading"
            @click="uploadAndPreview"
          >
            Kiểm tra dữ liệu (Xem trước)
          </UButton>
        </div>
      </div>
    </div>

    <!-- BƯỚC 2: XEM TRƯỚC BÁO CÁO & XÁC NHẬN -->
    <div v-else class="space-y-6">
      <div class="rounded-xl border border-stone-200 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4 dark:border-stone-800">
          <div>
            <h2 class="text-lg font-bold text-stone-900 dark:text-white">
              Bước 2: Báo cáo kiểm tra dữ liệu trước khi lưu
            </h2>
            <p class="text-xs text-stone-500">
              Mã đợt nhập: <span class="font-mono font-semibold">{{ previewResult.id }}</span>
            </p>
          </div>
          <div class="flex items-center gap-2">
            <UButton
              variant="outline"
              color="neutral"
              icon="i-lucide-x"
              :loading="canceling"
              @click="cancelImport"
            >
              Hủy đợt nhập
            </UButton>
            <UButton
              color="success"
              icon="i-lucide-check"
              :disabled="previewResult.validRows === 0"
              :loading="applying"
              @click="applyImport"
            >
              Xác nhận lưu {{ previewResult.validRows }} dòng hợp lệ
            </UButton>
          </div>
        </div>

        <!-- Thẻ tóm tắt kết quả kiểm tra -->
        <div class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Tổng số dòng đọc được"
            :value="previewResult.totalRows"
            icon="i-lucide-layers"
          />
          <StatCard
            label="Dòng hợp lệ (sẵn sàng nhập)"
            :value="previewResult.validRows"
            icon="i-lucide-check-circle"
            class="border-t-green-500"
          />
          <StatCard
            label="Dòng có lỗi (sẽ bị bỏ qua)"
            :value="previewResult.invalidRows"
            icon="i-lucide-x-circle"
            class="border-t-red-500"
          />
        </div>

        <!-- Bảng danh sách dòng bị lỗi (nếu có) -->
        <div v-if="previewResult.errors?.length" class="mt-6 space-y-3">
          <h3 class="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
            <UIcon name="i-lucide-alert-circle" class="size-4" />
            <span>Chi tiết các dòng bị lỗi ({{ previewResult.errors.length }} lỗi):</span>
          </h3>

          <div class="overflow-x-auto rounded-lg border border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20">
            <table class="w-full text-left text-xs">
              <thead class="border-b border-red-200 bg-red-100/50 font-semibold text-red-900 dark:border-red-900 dark:bg-red-900/40 dark:text-red-200">
                <tr>
                  <th class="px-3 py-2 text-center w-16">Dòng</th>
                  <th class="px-3 py-2 w-36">Cột / Trường</th>
                  <th class="px-3 py-2">Mô tả lỗi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-red-200/60 dark:divide-red-900/40">
                <tr v-for="err in previewResult.errors" :key="err.rowNumber">
                  <td class="px-3 py-2 text-center font-bold text-red-700 dark:text-red-400">
                    #{{ err.rowNumber }}
                  </td>
                  <td class="px-3 py-2 font-medium text-stone-800 dark:text-stone-200">
                    {{ err.field || 'Toàn dòng' }}
                  </td>
                  <td class="px-3 py-2 text-red-800 dark:text-red-300">
                    {{ err.message }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
