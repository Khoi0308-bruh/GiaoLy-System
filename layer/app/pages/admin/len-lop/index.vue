<script setup lang="ts">
import { PERMISSIONS } from '../../../shared/permissions'
import type { ApiError } from '../../../composables/useApi'

definePageMeta({ layout: 'admin', permission: PERMISSIONS.Promotion.View })

interface PromotionBatchSummary {
  id: string
  sourceYearId: string
  sourceYearName: string
  targetYearId: string
  targetYearName: string
  status: 'Draft' | 'Applied' | 'Cancelled'
  createdBy: string
  creatorName?: string | null
  createdAt: string
  appliedAt?: string | null
  applierName?: string | null
  totalStudents: number
  pendingCount: number
  approvedCount: number
  rejectedCount: number
  staleCount: number
  appliedCount: number
  rowVersion: string
}

interface AcademicYearItem {
  id: string
  name: string
  status: 'Planned' | 'Active' | 'Closing' | 'Archived'
}

const api = useApi()
const toast = useToast()
const { can } = usePermissions()

const batches = ref<PromotionBatchSummary[]>([])
const years = ref<AcademicYearItem[]>([])
const loading = ref(true)
const error = ref<ApiError | null>(null)

// Modal Tạo đợt xét
const createOpen = ref(false)
const creating = ref(false)
const createForm = ref({
  sourceYearId: '',
  targetYearId: ''
})

async function loadData() {
  loading.value = true
  error.value = null
  try {
    const [resBatches, resYears] = await Promise.all([
      api.get<PromotionBatchSummary[]>('/promotion-batches'),
      api.get<AcademicYearItem[]>('/academic-years').catch(() => [])
    ])
    batches.value = resBatches || []
    years.value = resYears || []
  } catch (e) {
    error.value = e as ApiError
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

function openCreateModal() {
  const closingOrActive = years.value.find(y => y.status === 'Closing' || y.status === 'Active')
  const plannedOrActive = years.value.find(y => y.id !== closingOrActive?.id && (y.status === 'Planned' || y.status === 'Active'))

  createForm.value = {
    sourceYearId: closingOrActive?.id || (years.value[0]?.id ?? ''),
    targetYearId: plannedOrActive?.id || (years.value[1]?.id ?? '')
  }
  createOpen.value = true
}

async function handleCreateBatch() {
  if (!createForm.value.sourceYearId || !createForm.value.targetYearId) {
    toast.add({ title: 'Vui lòng chọn đầy đủ Niên khóa nguồn và Niên khóa đích', color: 'error' })
    return
  }
  if (createForm.value.sourceYearId === createForm.value.targetYearId) {
    toast.add({ title: 'Niên khóa đích phải khác Niên khóa nguồn', color: 'error' })
    return
  }

  creating.value = true
  try {
    const res = await api.post<PromotionBatchSummary>('/promotion-batches', {
      sourceYearId: createForm.value.sourceYearId,
      targetYearId: createForm.value.targetYearId
    })
    toast.add({ title: 'Đã tạo đợt xét lên lớp thành công', color: 'success' })
    createOpen.value = false
    await loadData()
    if (res?.id) {
      await navigateTo(`/admin/len-lop/${res.id}`)
    }
  } catch (e) {
    const err = e as ApiError
    toast.add({
      title: 'Không thể tạo đợt xét lên lớp',
      description: err.detail || err.message,
      color: 'error'
    })
  } finally {
    creating.value = false
  }
}

const stats = computed(() => {
  const total = batches.value.length
  const draft = batches.value.filter(b => b.status === 'Draft').length
  const applied = batches.value.filter(b => b.status === 'Applied').length
  const totalStudents = batches.value.reduce((acc, b) => acc + (b.totalStudents || 0), 0)
  return { total, draft, applied, totalStudents }
})
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Đợt xét Lên lớp & Phân ban"
      subtitle="Quản lý quy trình tự động tính toán đề xuất lên lớp, lưu ban hoặc tốt nghiệp giữa hai niên khóa"
    >
      <template #actions>
        <UButton
          v-if="can(PERMISSIONS.Promotion.Create)"
          color="primary"
          icon="i-lucide-plus"
          @click="openCreateModal"
        >
          Tạo đợt xét mới
        </UButton>
      </template>
    </PageHeader>

    <ErrorState v-if="error" :error="error" @retry="loadData" />

    <!-- Thống kê nhanh -->
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard
        label="Tổng số đợt xét"
        :value="stats.total"
        icon="i-lucide-layers"
      />
      <StatCard
        label="Đang xét (Dự thảo)"
        :value="stats.draft"
        icon="i-lucide-clock"
        :class="stats.draft > 0 ? 'text-amber-600 dark:text-amber-400' : ''"
      />
      <StatCard
        label="Đã áp dụng hoàn tất"
        :value="stats.applied"
        icon="i-lucide-check-circle-2"
        class="text-emerald-600 dark:text-emerald-400"
      />
      <StatCard
        label="Tổng lượt đoàn sinh"
        :value="stats.totalStudents"
        icon="i-lucide-users"
      />
    </div>

    <!-- Danh sách các đợt xét -->
    <div class="rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div class="border-b border-stone-100 p-4 dark:border-stone-800">
        <h3 class="font-display text-lg font-bold text-stone-900 dark:text-stone-100">
          Danh sách các Đợt xét lên lớp
        </h3>
        <p class="text-xs text-stone-500">Mỗi đợt kết nối giữa một niên khóa kết thúc và một niên khóa mới</p>
      </div>

          <ListTable
      flat
      :columns="9"
      :loading="loading"
      :empty="batches.length === 0"
      loading-text="Đang tải dữ liệu các đợt xét lên lớp..."
      empty-title="Chưa có đợt xét lên lớp nào"
      empty-description="Nhấn Tạo đợt xét mới để hệ thống tổng hợp đề xuất lên lớp từ niên khóa vừa qua."
    >
      <template #head>
        <th class="w-[16%] px-4 py-3">Niên khóa</th>
        <th class="w-[10%] px-4 py-3">Trạng thái</th>
        <th class="w-[7%] px-4 py-3 text-center">Tổng</th>
        <th class="w-[9%] px-4 py-3 text-center">Chờ duyệt</th>
        <th class="w-[9%] px-4 py-3 text-center">Đã duyệt</th>
        <th class="w-[9%] px-4 py-3 text-center">Từ chối</th>
        <th class="w-[11%] px-4 py-3 text-center">Cần xem lại</th>
        <th class="w-[16%] px-4 py-3">Người tạo</th>
        <th class="w-[13%] px-4 py-3 text-right">Hành động</th>
      </template>

      <template #rows>
        <tr v-for="b in batches" :key="b.id" class="transition-colors hover:bg-stone-50/70 dark:hover:bg-stone-800/40">
          <td class="px-4 py-3">
            <div class="flex items-center gap-1.5 text-[13px]">
              <span class="truncate font-semibold text-stone-800 dark:text-stone-100">{{ b.sourceYearName }}</span>
              <UIcon name="i-lucide-arrow-right" class="size-3 shrink-0 text-stone-400" />
              <span class="truncate font-semibold text-marian-600 dark:text-marian-400">{{ b.targetYearName }}</span>
            </div>
          </td>
          <td class="px-4 py-3">
            <StatusChip domain="draft" :value="b.status" />
          </td>
          <td class="px-4 py-3 text-center font-mono font-bold text-stone-800 dark:text-stone-200">
            {{ b.totalStudents }}
          </td>
          <td class="px-4 py-3 text-center font-mono">
            <span v-if="b.pendingCount > 0" class="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              {{ b.pendingCount }}
            </span>
            <span v-else class="text-xs text-stone-400">0</span>
          </td>
          <td class="px-4 py-3 text-center font-mono">
            <span v-if="b.approvedCount > 0" class="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              {{ b.approvedCount }}
            </span>
            <span v-else class="text-xs text-stone-400">0</span>
          </td>
          <td class="px-4 py-3 text-center font-mono">
            <span v-if="b.rejectedCount > 0" class="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
              {{ b.rejectedCount }}
            </span>
            <span v-else class="text-xs text-stone-400">0</span>
          </td>
          <td class="px-4 py-3 text-center font-mono">
            <span v-if="b.staleCount > 0" class="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-black text-amber-800 dark:bg-amber-900 dark:text-amber-200">
              ⚠️ {{ b.staleCount }}
            </span>
            <span v-else class="text-xs text-stone-400">0</span>
          </td>
          <td class="px-4 py-3 text-xs">
            <p class="truncate font-medium text-stone-700 dark:text-stone-300">{{ b.creatorName || 'Quản trị viên' }}</p>
            <p class="text-[11px] text-stone-400">{{ new Date(b.createdAt).toLocaleDateString('vi-VN') }}</p>
          </td>
          <td class="px-4 py-3 text-right">
            <NuxtLink
              :to="'/admin/len-lop/' + b.id"
              class="inline-flex items-center gap-1 rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-stone-700 transition hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
            >
              <span>{{ b.status === 'Draft' ? 'Duyệt' : 'Xem' }}</span>
              <UIcon name="i-lucide-arrow-right" class="size-3.5" />
            </NuxtLink>
          </td>
        </tr>
      </template>

      <template #cards>
        <div v-for="b in batches" :key="b.id" class="space-y-2 px-4 py-3">
          <div class="flex items-start justify-between gap-2">
            <div class="flex min-w-0 items-center gap-1.5 text-sm">
              <span class="truncate font-semibold text-stone-900 dark:text-stone-100">{{ b.sourceYearName }}</span>
              <UIcon name="i-lucide-arrow-right" class="size-3 shrink-0 text-stone-400" />
              <span class="truncate font-semibold text-marian-600 dark:text-marian-400">{{ b.targetYearName }}</span>
            </div>
            <StatusChip domain="draft" :value="b.status" />
          </div>
          <p class="text-[11px] text-stone-400">
            {{ b.creatorName || 'Quản trị viên' }} · {{ new Date(b.createdAt).toLocaleDateString('vi-VN') }}
          </p>
          <p class="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span class="rounded bg-stone-100 px-1.5 py-0.5 font-semibold text-stone-700 dark:bg-stone-800 dark:text-stone-300">
              {{ b.totalStudents }} em
            </span>
            <span v-if="b.pendingCount > 0" class="rounded bg-amber-50 px-1.5 py-0.5 font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              Chờ duyệt: {{ b.pendingCount }}
            </span>
            <span v-if="b.approvedCount > 0" class="rounded bg-emerald-50 px-1.5 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              Đã duyệt: {{ b.approvedCount }}
            </span>
            <span v-if="b.rejectedCount > 0" class="rounded bg-red-50 px-1.5 py-0.5 font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
              Từ chối: {{ b.rejectedCount }}
            </span>
            <span v-if="b.staleCount > 0" class="rounded bg-amber-100 px-1.5 py-0.5 font-bold text-amber-800 dark:bg-amber-900 dark:text-amber-200">
              ⚠️ Cần xem lại: {{ b.staleCount }}
            </span>
          </p>
          <NuxtLink
            :to="'/admin/len-lop/' + b.id"
            class="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-200"
          >
            <span>{{ b.status === 'Draft' ? 'Duyệt đề xuất' : 'Xem kết quả' }}</span>
            <UIcon name="i-lucide-arrow-right" class="size-3.5" />
          </NuxtLink>
        </div>
      </template>
    </ListTable>
    </div>

    <!-- Modal Tạo Đợt Xét Mới -->
    <UModal
      v-model:open="createOpen"
      title="Tạo đợt xét lên lớp mới"
      description="Hệ thống sẽ tự động tổng hợp kết quả học tập và sinh danh sách đề xuất"
    >
      <template #body>
        <div class="space-y-4">
          <div class="rounded-xl border border-stone-200 bg-stone-50 p-3.5 text-xs text-stone-600 dark:border-stone-800 dark:bg-stone-800/50 dark:text-stone-300 space-y-1">
            <p class="font-semibold text-stone-800 dark:text-stone-200">⚡ Cơ chế tự động tính toán:</p>
            <ul class="list-disc pl-4 space-y-0.5">
              <li>Hệ thống quét tất cả đoàn sinh đang học trong Niên khóa nguồn.</li>
              <li>Tự động đánh giá theo ĐTB (≥ 5.0) và Chuyên cần (≥ 80%).</li>
              <li>Đề xuất Lên lớp (Promote), Ở lại lớp (Retain), hoặc Mãn khóa/Tốt nghiệp (Graduate).</li>
              <li>Tự động gợi ý xếp vào lớp tương ứng của Niên khóa đích nếu đã có lớp.</li>
            </ul>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Niên khóa nguồn (Năm học vừa qua) <span class="text-red-500">*</span>
            </label>
            <select
              v-model="createForm.sourceYearId"
              class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            >
              <option v-for="y in years" :key="y.id" :value="y.id">
                {{ y.name }} ({{ y.status }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Niên khóa đích (Năm học tiếp theo) <span class="text-red-500">*</span>
            </label>
            <select
              v-model="createForm.targetYearId"
              class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            >
              <option v-for="y in years" :key="y.id" :value="y.id" :disabled="y.id === createForm.sourceYearId">
                {{ y.name }} ({{ y.status }})
              </option>
            </select>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="createOpen = false">Hủy</UButton>
          <UButton
            color="primary"
            :loading="creating"
            :disabled="!createForm.sourceYearId || !createForm.targetYearId || createForm.sourceYearId === createForm.targetYearId"
            @click="handleCreateBatch"
          >
            Bắt đầu tạo đợt xét
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
