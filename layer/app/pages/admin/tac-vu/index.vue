<script setup lang="ts">
import { PERMISSIONS } from '~/shared/permissions'
import type { ApiError } from '~/composables/useApi'

definePageMeta({ layout: 'admin', permission: PERMISSIONS.Jobs.View })
useHead({ title: 'Tác vụ nền - GiaoLy Admin' })

interface JobRunItem {
  id: string
  jobName: string
  startedAt: string
  finishedAt?: string | null
  status: string
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

interface RunJobResult {
  jobName: string
  status: string
  message?: string | null
  startedAt: string
  finishedAt?: string | null
}

interface JobDefinition {
  name: string
  title: string
  description: string
  schedule: string
}

// Phải khớp BackgroundJobNames ở backend — danh sách này là nguồn duy nhất cho nút "Chạy ngay".
const JOB_CATALOG: JobDefinition[] = [
  {
    name: 'GradebookCloser',
    title: 'Tự động khóa sổ điểm',
    description: 'Tìm các niên khóa đang hoạt động đã quá EndDate và tự động chuyển sang trạng thái khóa sổ.',
    schedule: 'Khi khởi động + mỗi 6 giờ'
  },
  {
    name: 'NewsCrawler',
    title: 'Cào tin tức Công giáo từ RSS',
    description: 'Lấy bài viết mới từ các nguồn RSS đang kích hoạt; bỏ qua bài đã có theo LinkHash.',
    schedule: 'Tự động 02:00 hằng ngày (giờ VN)'
  },
  {
    name: 'TokenCleanup',
    title: 'Dọn refresh token hết hạn',
    description: 'Xóa các refresh token đã thu hồi hoặc quá hạn 30 ngày.',
    schedule: 'Chạy tay hoặc qua cron ngoài'
  },
  {
    name: 'GradeUnlockExpiry',
    title: 'Đóng sổ điểm đã hết hạn mở khóa',
    description: 'Đóng các lượt mở khóa sổ điểm đã quá thời hạn 72 giờ.',
    schedule: 'Chạy tay hoặc qua cron ngoài'
  },
  {
    name: 'AuditRetention',
    title: 'Dọn nhật ký kiểm toán quá hạn',
    description: 'Xóa tối đa 5.000 dòng audit log cũ hơn 24 tháng mỗi lượt.',
    schedule: 'Chạy tay hoặc qua cron ngoài'
  }
]

const JOB_TITLES: Record<string, string> = Object.fromEntries(JOB_CATALOG.map(j => [j.name, j.title]))

const api = useApi()
const toast = useToast()
const { can } = usePermissions()

const jobRuns = ref<JobRunItem[]>([])
const totalCount = ref(0)
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 20
const filterJob = ref('ALL')
const loading = ref(true)
const runningJob = ref<string | null>(null)
const error = ref<ApiError | null>(null)
const autoRefresh = ref(true)
const pendingJob = ref<JobDefinition | null>(null)

const isConfirmOpen = computed({
  get: () => pendingJob.value !== null,
  set: (open: boolean) => {
    if (!open) pendingJob.value = null
  }
})

let refreshTimer: ReturnType<typeof setInterval> | null = null
let inFlight = false

const jobOptions = [
  { value: 'ALL', label: 'Tất cả tác vụ' },
  ...JOB_CATALOG.map(j => ({ value: j.name, label: j.title }))
]

async function loadData(silent = false) {
  if (inFlight) return
  inFlight = true
  if (!silent) loading.value = true
  error.value = null
  try {
    const params: Record<string, string | number> = {
      page: currentPage.value,
      pageSize
    }
    if (filterJob.value !== 'ALL') params.jobName = filterJob.value

    const res = await api.get<PagedJobResult>('/system/jobs', params)
    jobRuns.value = res?.items ?? []
    totalCount.value = res?.totalCount ?? 0
    totalPages.value = Math.max(1, res?.totalPages ?? 1)
  } catch (e) {
    error.value = e as ApiError
  } finally {
    inFlight = false
    loading.value = false
  }
}

function applyFilter() {
  currentPage.value = 1
  loadData()
}

function changePage(delta: number) {
  const next = currentPage.value + delta
  if (next < 1 || next > totalPages.value) return
  currentPage.value = next
  loadData()
}

function startAutoRefresh() {
  stopAutoRefresh()
  if (!autoRefresh.value) return
  refreshTimer = setInterval(() => {
    if (!inFlight && !runningJob.value && !error.value) {
      loadData(true)
    }
  }, 20000)
}

function stopAutoRefresh() {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

watch(autoRefresh, startAutoRefresh)

onMounted(async () => {
  await loadData()
  startAutoRefresh()
})

onBeforeUnmount(stopAutoRefresh)

function askRunJob(job: JobDefinition) {
  if (!can(PERMISSIONS.Jobs.Run) || runningJob.value) return
  pendingJob.value = job
}

async function confirmRunJob() {
  const job = pendingJob.value
  if (!job || runningJob.value) return

  pendingJob.value = null
  runningJob.value = job.name
  try {
    const res = await api.post<RunJobResult>(`/system/jobs/${encodeURIComponent(job.name)}/run`)
    const ok = res.status === 'Succeeded'
    toast.add({
      title: ok ? `Đã chạy xong: ${JOB_TITLES[res.jobName] ?? res.jobName}` : `Tác vụ kết thúc với trạng thái: ${res.status}`,
      description: res.message || undefined,
      color: ok ? 'success' : 'warning'
    })
    currentPage.value = 1
    await loadData(true)
  } catch (e) {
    const err = e as ApiError
    toast.add({
      title: 'Không chạy được tác vụ',
      description: err.message,
      color: 'error'
    })
  } finally {
    runningJob.value = null
  }
}

function statusMeta(status: string) {
  switch ((status || '').toLowerCase()) {
    case 'succeeded':
    case 'success':
    case 'completed':
      return { label: 'Thành công', dot: 'bg-emerald-500', cls: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' }
    case 'running':
      return { label: 'Đang chạy', dot: 'bg-amber-500 animate-pulse', cls: 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300' }
    case 'failed':
    case 'error':
      return { label: 'Thất bại', dot: 'bg-red-500', cls: 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300' }
    case 'skipped':
      return { label: 'Bỏ qua', dot: 'bg-stone-400', cls: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300' }
    default:
      return { label: status || 'Không rõ', dot: 'bg-stone-400', cls: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300' }
  }
}

function triggerLabel(lockedBy?: string | null) {
  if (!lockedBy) return 'Hệ thống'
  if (lockedBy === 'ExternalCron') return 'Cron ngoài'
  if (lockedBy.endsWith('Service')) return 'Tự động'
  return lockedBy
}

function jobTitle(jobName: string) {
  return JOB_TITLES[jobName] ?? jobName
}

function formatDateTime(value?: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleString('vi-VN')
}

function formatDuration(run: JobRunItem) {
  if (!run.finishedAt) {
    return (run.status || '').toLowerCase() === 'running' ? 'Đang chạy…' : '—'
  }
  const ms = new Date(run.finishedAt).getTime() - new Date(run.startedAt).getTime()
  if (Number.isNaN(ms) || ms < 0) return '—'
  if (ms < 1000) return `${ms} ms`

  const totalSeconds = Math.round(ms / 1000)
  if (totalSeconds < 60) return `${totalSeconds} giây`

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return seconds ? `${minutes} phút ${seconds} giây` : `${minutes} phút`
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Tác Vụ Nền"
      subtitle="Theo dõi các lượt chạy tự động và chạy tay tác vụ nền của hệ thống"
    >
      <template #actions>
        <label class="flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-300">
          <USwitch v-model="autoRefresh" color="primary" size="sm" />
          Tự làm mới mỗi 20 giây
        </label>
        <UButton
          variant="outline"
          icon="i-lucide-refresh-cw"
          :loading="loading"
          @click="loadData()"
        >
          Làm mới
        </UButton>
      </template>
    </PageHeader>

    <ErrorState v-if="error" :error="error" @retry="loadData()" />

    <!-- Danh mục tác vụ có thể chạy tay -->
    <div>
      <h2 class="mb-3 font-display text-lg font-bold text-stone-900 dark:text-stone-100">
        Tác Vụ Có Thể Chạy
      </h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div
          v-for="job in JOB_CATALOG"
          :key="job.name"
          class="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900"
        >
          <div>
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <h3 class="font-bold text-stone-900 dark:text-stone-100">{{ job.title }}</h3>
                <p class="truncate font-mono text-xs text-marian-600 dark:text-marian-400">@{{ job.name }}</p>
              </div>
              <span class="shrink-0 rounded bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                {{ job.schedule }}
              </span>
            </div>
            <p class="mt-2 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
              {{ job.description }}
            </p>
          </div>

          <div class="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 dark:border-stone-800">
            <span class="text-[11px] text-stone-400">
              {{ can(PERMISSIONS.Jobs.Run) ? 'Có quyền chạy tay' : 'Chỉ được xem' }}
            </span>
            <UButton
              v-if="can(PERMISSIONS.Jobs.Run)"
              size="sm"
              color="primary"
              variant="outline"
              icon="i-lucide-play"
              :loading="runningJob === job.name"
              :disabled="!!runningJob && runningJob !== job.name"
              @click="askRunJob(job)"
            >
              {{ runningJob === job.name ? 'Đang chạy…' : 'Chạy ngay' }}
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Bộ lọc + lịch sử chạy -->
    <div class="rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div class="flex flex-col gap-3 border-b border-stone-100 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-stone-800">
        <div>
          <h2 class="font-display text-lg font-bold text-stone-900 dark:text-stone-100">
            Lịch Sử Chạy
          </h2>
          <p class="text-xs text-stone-500">Bao gồm cả lượt chạy tự động (theo lịch hoặc khi khởi động) và lượt chạy tay.</p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <select
            v-model="filterJob"
            class="h-9 rounded-lg border border-stone-200 bg-stone-50 px-2.5 text-xs font-medium dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
            @change="applyFilter"
          >
            <option v-for="opt in jobOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
          <span class="font-mono text-xs text-stone-500">
            Tổng số: <strong>{{ totalCount }}</strong> lượt
          </span>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-stone-50 text-xs font-semibold uppercase text-stone-600 dark:bg-stone-800/70 dark:text-stone-300">
            <tr>
              <th class="p-4">Tác vụ</th>
              <th class="p-4">Bắt đầu</th>
              <th class="p-4">Kết thúc</th>
              <th class="p-4">Thời lượng</th>
              <th class="p-4 text-center">Trạng thái</th>
              <th class="p-4">Nguồn kích hoạt</th>
              <th class="p-4">Thông điệp kết quả</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
            <tr v-if="loading">
              <td colspan="7" class="animate-pulse p-8 text-center text-sm text-stone-400">
                Đang tải lịch sử tác vụ nền…
              </td>
            </tr>
            <tr v-else-if="jobRuns.length === 0">
              <td colspan="7" class="p-8 text-center text-sm text-stone-500">
                Chưa có lượt chạy nào phù hợp với bộ lọc.
              </td>
            </tr>
            <tr
              v-for="run in jobRuns"
              :key="run.id"
              class="hover:bg-stone-50/70 dark:hover:bg-stone-800/40"
            >
              <td class="p-4">
                <p class="font-semibold text-stone-900 dark:text-stone-100">{{ jobTitle(run.jobName) }}</p>
                <p class="font-mono text-[11px] text-stone-400">{{ run.jobName }}</p>
              </td>
              <td class="whitespace-nowrap p-4 font-mono text-xs text-stone-500">
                {{ formatDateTime(run.startedAt) }}
              </td>
              <td class="whitespace-nowrap p-4 font-mono text-xs text-stone-500">
                {{ formatDateTime(run.finishedAt) }}
              </td>
              <td class="whitespace-nowrap p-4 font-mono text-xs text-stone-500">
                {{ formatDuration(run) }}
              </td>
              <td class="p-4 text-center">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  :class="statusMeta(run.status).cls"
                >
                  <span class="size-1.5 rounded-full" :class="statusMeta(run.status).dot" />
                  {{ statusMeta(run.status).label }}
                </span>
              </td>
              <td class="whitespace-nowrap p-4 text-xs text-stone-600 dark:text-stone-300">
                {{ triggerLabel(run.lockedBy) }}
              </td>
              <td class="p-4 text-xs text-stone-600 dark:text-stone-300">
                <span class="line-clamp-2 max-w-[360px]" :title="run.message || undefined">
                  {{ run.message || '—' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="totalPages > 1" class="flex items-center justify-between border-t border-stone-100 p-4 dark:border-stone-800">
        <span class="text-xs text-stone-500">Trang {{ currentPage }} / {{ totalPages }}</span>
        <div class="flex items-center gap-1">
          <UButton
            size="xs"
            variant="ghost"
            icon="i-lucide-chevron-left"
            :disabled="currentPage <= 1"
            @click="changePage(-1)"
          />
          <UButton
            size="xs"
            variant="ghost"
            icon="i-lucide-chevron-right"
            :disabled="currentPage >= totalPages"
            @click="changePage(1)"
          />
        </div>
      </div>
    </div>

    <!-- Xác nhận chạy tay -->
    <UModal
      v-model:open="isConfirmOpen"
      :title="pendingJob ? `Chạy tay: ${pendingJob.title}` : 'Chạy tay tác vụ nền'"
    >
      <template #body>
        <div v-if="pendingJob" class="space-y-3 text-sm text-stone-600 dark:text-stone-300">
          <p>
            Tác vụ <strong class="font-mono">{{ pendingJob.name }}</strong> sẽ chạy ngay trên máy chủ.
            Thời gian có thể kéo dài vài giây đến vài chục giây.
          </p>
          <p class="rounded-lg bg-stone-50 p-3 text-xs text-stone-500 dark:bg-stone-800/60">
            {{ pendingJob.description }}
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton variant="outline" @click="pendingJob = null">Hủy</UButton>
          <UButton color="primary" icon="i-lucide-play" :loading="!!runningJob" @click="confirmRunJob">
            Chạy ngay
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
