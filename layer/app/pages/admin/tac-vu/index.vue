<script setup lang="ts">
import { PERMISSIONS } from '~/shared/permissions'
import type { ApiError } from '~/composables/useApi'

definePageMeta({ layout: 'admin', permission: PERMISSIONS.Jobs.View })

interface JobRunItem {
  id: string
  jobName: string
  startedAt: string
  finishedAt?: string | null
  status: 'Success' | 'Failed' | 'Running' | string
  message?: string | null
  lockedBy?: string | null
}

interface PagedJobResult {
  items: JobRunItem[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

const api = useApi()
const toast = useToast()
const { can } = usePermissions()

const jobRuns = ref<JobRunItem[]>([])
const loading = ref(true)
const runningJob = ref<string | null>(null)
const error = ref<ApiError | null>(null)

// Danh sách các tác vụ nền định kỳ của hệ thống
const standardJobs = [
  {
    name: 'AutoCloseGradeUnlocks',
    title: 'Tự động đóng mở khóa sổ điểm',
    description: 'Quét và tự động đóng các sổ điểm lớp đã hết hạn mở khóa tạm thời (72 giờ).',
    schedule: 'Mỗi 30 phút'
  },
  {
    name: 'RssNewsSync',
    title: 'Cào tin tức Công giáo từ RSS',
    description: 'Đồng bộ bài viết mới nhất từ các nguồn tin Vatican, HĐGMVN, Tổng Giáo Phận.',
    schedule: 'Mỗi 2 giờ'
  },
  {
    name: 'LiturgicalCalendarSync',
    title: 'Đồng bộ Lịch Phụng Vụ',
    description: 'Cập nhật chu kỳ năm phụng vụ, màu áo lễ và các ngày lễ vọng/kính trong năm.',
    schedule: 'Hàng ngày lúc 00:00'
  },
  {
    name: 'PromotionDraftRecalculate',
    title: 'Tính toán lại đề xuất Lên lớp',
    description: 'Rà soát các đợt xét lên lớp, tự động tính lại điểm số các em có dữ liệu bị thay đổi.',
    schedule: 'Hàng ngày lúc 01:00'
  }
]

async function loadData() {
  loading.value = true
  error.value = null
  try {
    const res = await api.get<any>('/system/jobs?pageSize=50')
    jobRuns.value = res?.items || res || []
  } catch (e) {
    error.value = e as ApiError
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

async function triggerRunJob(jobName: string) {
  runningJob.value = jobName
  try {
    await api.post(`/system/jobs/${encodeURIComponent(jobName)}/run`)
    toast.add({ title: `Đã kích hoạt tiến trình: ${jobName}`, color: 'success' })
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể kích hoạt tác vụ', description: err.detail || err.message, color: 'error' })
  } finally {
    runningJob.value = null
  }
}

function getStatusBadge(status: string) {
  const s = (status || '').toLowerCase()
  if (s === 'success' || s === 'completed') return { label: 'Thành công', color: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' }
  if (s === 'running') return { label: 'Đang chạy...', color: 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse' }
  if (s === 'failed' || s === 'error') return { label: 'Thất bại', color: 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300' }
  return { label: status, color: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300' }
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Tác Vụ Nền & Tiến Trình Định Kỳ (Background Jobs)"
      subtitle="Giám sát và kích hoạt thủ công các tiến trình tự động hóa nền tảng của hệ thống"
    >
      <template #actions>
        <UButton
          variant="outline"
          icon="i-lucide-refresh-cw"
          :loading="loading"
          @click="loadData"
        >
          Làm mới trạng thái
        </UButton>
      </template>
    </PageHeader>

    <ErrorState v-if="error" :error="error" @retry="loadData" />

    <!-- Danh sách tác vụ chuẩn -->
    <div>
      <h3 class="font-display text-lg font-bold text-stone-900 dark:text-stone-100 mb-3">
        Các Tiến Trình Định Kỳ Hệ Thống
      </h3>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div
          v-for="j in standardJobs"
          :key="j.name"
          class="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900"
        >
          <div>
            <div class="flex items-start justify-between gap-2">
              <div>
                <h4 class="font-bold text-stone-900 dark:text-stone-100">{{ j.title }}</h4>
                <p class="font-mono text-xs text-marian-600 dark:text-marian-400">@{{ j.name }}</p>
              </div>
              <span class="rounded bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                {{ j.schedule }}
              </span>
            </div>
            <p class="mt-2 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              {{ j.description }}
            </p>
          </div>

          <div class="mt-4 flex items-center justify-end border-t border-stone-100 pt-3 dark:border-stone-800">
            <UButton
              v-if="can(PERMISSIONS.Jobs.Run)"
              size="sm"
              color="primary"
              variant="outline"
              icon="i-lucide-play"
              :loading="runningJob === j.name"
              @click="triggerRunJob(j.name)"
            >
              Chạy ngay
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Bảng lịch sử thực thi -->
    <div class="rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div class="border-b border-stone-100 p-4 dark:border-stone-800">
        <h3 class="font-display text-lg font-bold text-stone-900 dark:text-stone-100">
          Nhật ký Thực thi Gần đây
        </h3>
        <p class="text-xs text-stone-500">Lịch sử chạy của các tác vụ nền trong hệ thống</p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-stone-50 text-xs font-semibold uppercase text-stone-600 dark:bg-stone-800/70 dark:text-stone-300">
            <tr>
              <th class="p-4">Tiến trình (Job)</th>
              <th class="p-4">Bắt đầu</th>
              <th class="p-4">Kết thúc</th>
              <th class="p-4 text-center">Trạng thái</th>
              <th class="p-4">Thông điệp kết quả</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
            <tr v-if="loading">
              <td colspan="5" class="p-8 text-center text-sm text-stone-400 animate-pulse">
                Đang tải nhật ký tiến trình...
              </td>
            </tr>
            <tr v-else-if="jobRuns.length === 0">
              <td colspan="5" class="p-8 text-center text-sm text-stone-500">
                Chưa có nhật ký thực thi tác vụ nào.
              </td>
            </tr>
            <tr
              v-for="r in jobRuns"
              :key="r.id"
              class="hover:bg-stone-50/70 dark:hover:bg-stone-800/40"
            >
              <td class="p-4 font-mono font-bold text-xs text-stone-900 dark:text-stone-100">
                {{ r.jobName }}
              </td>
              <td class="p-4 text-xs font-mono text-stone-500 whitespace-nowrap">
                {{ new Date(r.startedAt).toLocaleString('vi-VN') }}
              </td>
              <td class="p-4 text-xs font-mono text-stone-500 whitespace-nowrap">
                {{ r.finishedAt ? new Date(r.finishedAt).toLocaleString('vi-VN') : '—' }}
              </td>
              <td class="p-4 text-center">
                <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="getStatusBadge(r.status).color">
                  {{ getStatusBadge(r.status).label }}
                </span>
              </td>
              <td class="p-4 text-xs text-stone-600 dark:text-stone-300">
                {{ r.message || 'Thực thi thành công không có lỗi' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
