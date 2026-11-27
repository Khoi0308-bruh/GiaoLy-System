<script setup lang="ts">
import { PERMISSIONS } from '../../../shared/permissions'
import type { ApiError } from '../../../composables/useApi'

definePageMeta({ layout: 'admin', permission: PERMISSIONS.Reports.View })

interface AcademicYearItem {
  id: string
  name: string
  status: string
}

interface BranchDetail {
  branchId: number
  branchName: string
  totalStudents: number
  activeCount: number
  suspendedCount: number
  dropoutCount: number
  graduatedCount: number
  maleCount: number
  femaleCount: number
  classes: {
    classRoomId: string
    classRoomName: string
    levelName: string
    totalStudents: number
    maleCount: number
    femaleCount: number
  }[]
}

interface StudentsByBranchReport {
  academicYearId?: string | null
  academicYearName: string
  grandTotal: number
  unassignedCount: number
  branches: BranchDetail[]
}

// Số hồ sơ của ngành chưa có ghi danh lớp trong niên khóa đang báo cáo.
function unassignedInClass(b: BranchDetail): number {
  return Math.max(0, b.totalStudents - b.classes.reduce((sum, c) => sum + c.totalStudents, 0))
}

interface MissingDataReport {
  totalMissing: number
  students: {
    studentId: string
    studentCode: string
    fullName: string
    holyName?: string | null
    branchName: string
    classRoomName: string
    missingReasons: string[]
  }[]
}

interface PromotionSummaryReport {
  academicYearId?: string | null
  academicYearName: string
  totalStudents: number
  promotedCount: number
  retainedCount: number
  graduatedCount: number
  pendingCount: number
  classSummaries: {
    classRoomId: string
    classRoomName: string
    totalStudents: number
    promotedCount: number
    retainedCount: number
    graduatedCount: number
    pendingCount: number
  }[]
}

interface GradesSummaryReport {
  academicYearId?: string | null
  academicYearName: string
  classRoomId?: string | null
  classRoomName?: string | null
  totalStudents: number
  averageGpa: number
  maxGpa: number
  minGpa: number
  belowThresholdCount: number
  belowThresholdStudents: {
    studentId: string
    studentCode: string
    fullName: string
    classRoomName: string
    semester1?: number | null
    semester2?: number | null
    finalExam?: number | null
    attendanceScore?: number | null
    averageScore?: number | null
    status: string
  }[]
}

const api = useApi()
const toast = useToast()
const { can } = usePermissions()

const years = ref<AcademicYearItem[]>([])
const selectedYearId = ref<string>('')
const activeTab = ref<'branch' | 'missing' | 'promotion' | 'grades'>('branch')

const loading = ref(true)
const error = ref<ApiError | null>(null)

const branchReport = ref<StudentsByBranchReport | null>(null)
const missingReport = ref<MissingDataReport | null>(null)
const promotionReport = ref<PromotionSummaryReport | null>(null)
const gradesReport = ref<GradesSummaryReport | null>(null)

// Modal Xuất báo cáo
const exportOpen = ref(false)
const exporting = ref(false)
const exportForm = ref({
  reportType: 'StudentsByBranch',
  academicYearId: ''
})

async function initYears() {
  try {
    const list = await api.get<AcademicYearItem[]>('/academic-years')
    years.value = list || []
    if (years.value.length > 0) {
      const active = years.value.find(y => y.status === 'Active')
      selectedYearId.value = active ? active.id : years.value[0]?.id ?? ''
      exportForm.value.academicYearId = selectedYearId.value
      await loadTabReport()
    }
  } catch (e) {
    error.value = e as ApiError
  }
}

async function loadTabReport() {
  loading.value = true
  error.value = null
  const yId = selectedYearId.value
  const query = yId ? { academicYearId: yId } : undefined

  try {
    if (activeTab.value === 'branch') {
      branchReport.value = await api.get<StudentsByBranchReport>('/reports/students-by-branch', query)
    } else if (activeTab.value === 'missing') {
      missingReport.value = await api.get<MissingDataReport>('/reports/missing-data')
    } else if (activeTab.value === 'promotion') {
      promotionReport.value = await api.get<PromotionSummaryReport>('/reports/promotion-summary', query)
    } else if (activeTab.value === 'grades') {
      gradesReport.value = await api.get<GradesSummaryReport>('/reports/grades-summary', query)
    }
  } catch (e) {
    error.value = e as ApiError
  } finally {
    loading.value = false
  }
}

watch([selectedYearId, activeTab], () => {
  loadTabReport()
})

onMounted(initYears)

function openExportModal() {
  exportForm.value = {
    reportType: activeTab.value === 'missing' ? 'MissingData' : activeTab.value === 'promotion' ? 'PromotionSummary' : activeTab.value === 'grades' ? 'GradesSummary' : 'StudentsByBranch',
    academicYearId: selectedYearId.value
  }
  exportOpen.value = true
}

async function handleExportReport() {
  exporting.value = true
  try {
    const blob = await api.download<Blob>('/reports/export', {
      method: 'POST',
      body: {
        reportType: exportForm.value.reportType,
        academicYearId: exportForm.value.academicYearId || null
      }
    })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `BaoCao_${exportForm.value.reportType}_${new Date().toISOString().substring(0, 10)}.xlsx`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    toast.add({ title: 'Xuất file báo cáo Excel thành công', color: 'success' })
    exportOpen.value = false
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể xuất báo cáo', description: err.detail || err.message, color: 'error' })
  } finally {
    exporting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Trung Tâm Báo Cáo & Thống Kê"
      subtitle="Tổng hợp dữ liệu đoàn sinh, tỷ lệ chuyên cần, kết quả học tập và rà soát hồ sơ mục vụ"
    >
      <template #actions>
        <UButton
          v-can="PERMISSIONS.Reports.Export"
          variant="outline"
          icon="i-lucide-download"
          @click="openExportModal"
        >
          Xuất báo cáo Excel
        </UButton>
      </template>
    </PageHeader>

    <ErrorState v-if="error" :error="error" @retry="loadTabReport" />

    <!-- Chọn Niên Khóa & Tabs điều hướng -->
    <div class="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-stone-800 dark:bg-stone-900">
      <!-- Tabs -->
      <div class="flex items-center gap-1.5 overflow-x-auto">
        <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap"
          :class="activeTab === 'branch' ? 'bg-marian-600 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800'"
          @click="activeTab = 'branch'"
        >
          <UIcon name="i-lucide-users" class="mr-1 inline h-3.5 w-3.5" />
          Đoàn sinh theo Ngành
        </button>
        <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap"
          :class="activeTab === 'grades' ? 'bg-marian-600 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800'"
          @click="activeTab = 'grades'"
        >
          <UIcon name="i-lucide-book-open" class="mr-1 inline h-3.5 w-3.5" />
          Điểm số & Cảnh báo học tập
        </button>
        <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap"
          :class="activeTab === 'promotion' ? 'bg-marian-600 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800'"
          @click="activeTab = 'promotion'"
        >
          <UIcon name="i-lucide-trending-up" class="mr-1 inline h-3.5 w-3.5" />
          Tổng hợp Lên lớp
        </button>
        <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap"
          :class="activeTab === 'missing' ? 'bg-marian-600 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800'"
          @click="activeTab = 'missing'"
        >
          <UIcon name="i-lucide-alert-circle" class="mr-1 inline h-3.5 w-3.5" />
          Thiếu hồ sơ
        </button>
      </div>

      <!-- Chọn Niên Khóa -->
      <div v-if="activeTab !== 'missing'" class="flex items-center gap-2">
        <label class="text-xs font-semibold uppercase text-stone-500 whitespace-nowrap">Niên khóa:</label>
        <select
          v-model="selectedYearId"
          class="h-9 rounded-lg border border-stone-200 bg-stone-50 px-2.5 text-xs font-medium dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
        >
          <option v-for="y in years" :key="y.id" :value="y.id">
            {{ y.name }} {{ y.status === 'Active' ? '(Đang hoạt động)' : '' }}
          </option>
        </select>
      </div>
    </div>

    <!-- NỘI DUNG TỪNG TAB BÁO CÁO -->
    <div v-if="loading" class="h-64 animate-pulse rounded-2xl border border-stone-200 bg-stone-100 dark:border-stone-800 dark:bg-stone-800/40" />

    <!-- TAB 1: ĐOÀN SINH THEO NGÀNH -->
    <div v-else-if="activeTab === 'branch' && branchReport" class="space-y-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Tổng đoàn sinh toàn xứ"
          :value="branchReport.grandTotal"
          icon="i-lucide-users"
        />
        <StatCard
          label="Số ngành sinh hoạt"
          :value="branchReport.branches.length"
          icon="i-lucide-layers"
        />
        <StatCard
          label="Niên khóa báo cáo"
          :value="branchReport.academicYearName"
          icon="i-lucide-calendar"
        />
      </div>

      <p v-if="branchReport.unassignedCount > 0" class="text-xs text-stone-500">
        Trong tổng số trên có <strong>{{ branchReport.unassignedCount }}</strong> hồ sơ chưa gán ngành;
        tổng theo ngành cộng lại là {{ branchReport.grandTotal - branchReport.unassignedCount }}.
      </p>

      <!-- Danh sách từng ngành -->
      <div
        v-for="b in branchReport.branches"
        :key="b.branchId"
        class="rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900"
      >
        <div class="border-b border-stone-100 bg-stone-50 p-4 flex flex-wrap items-center justify-between gap-2 dark:border-stone-800 dark:bg-stone-800/60">
          <div>
            <h4 class="font-display text-base font-bold text-stone-900 dark:text-stone-100">
              Ngành {{ b.branchName }}
            </h4>
            <p class="text-xs text-stone-500">
              Tổng số: <strong>{{ b.totalStudents }}</strong> em (Nam: {{ b.maleCount }} | Nữ: {{ b.femaleCount }})
              <span v-if="unassignedInClass(b) > 0" class="text-stone-400">
                · chưa xếp lớp: {{ unassignedInClass(b) }}
              </span>
            </p>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <span class="rounded bg-emerald-100 px-2 py-0.5 text-emerald-800 font-semibold dark:bg-emerald-950 dark:text-emerald-300">
              Học: {{ b.activeCount }}
            </span>
            <span v-if="b.suspendedCount > 0" class="rounded bg-amber-100 px-2 py-0.5 text-amber-800 font-semibold">
              Nghỉ tạm: {{ b.suspendedCount }}
            </span>
            <span v-if="b.dropoutCount > 0" class="rounded bg-red-100 px-2 py-0.5 text-red-800 font-semibold">
              Nghỉ hẳn: {{ b.dropoutCount }}
            </span>
            <span v-if="b.graduatedCount > 0" class="rounded bg-sky-100 px-2 py-0.5 text-sky-800 font-semibold">
              Tốt nghiệp: {{ b.graduatedCount }}
            </span>
          </div>
        </div>

        <!-- Bảng chi tiết các lớp trong ngành -->
                <ListTable
          flat
          :columns="5"
          :loading="loading"
          :empty="!b.classes || b.classes.length === 0"
          loading-text="Đang tải số liệu lớp học..."
          empty-title="Ngành này chưa có lớp học"
        >
          <template #head>
            <th class="w-[32%] px-3 py-3">Lớp học</th>
            <th class="w-[24%] px-3 py-3">Cấp lớp</th>
            <th class="w-[18%] px-3 py-3 text-center">Học sinh</th>
            <th class="w-[13%] px-3 py-3 text-center">Nam</th>
            <th class="w-[13%] px-3 py-3 text-center">Nữ</th>
          </template>

          <template #rows>
            <tr v-for="c in b.classes" :key="c.classRoomId" class="transition-colors hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
              <td class="px-3 py-3">
                <NuxtLink :to="'/admin/lop/' + c.classRoomId" class="block truncate font-semibold text-marian-600 hover:underline dark:text-marian-400">
                  {{ c.classRoomName }}
                </NuxtLink>
              </td>
              <td class="px-3 py-3">
                <span class="block truncate text-xs text-stone-500">{{ c.levelName }}</span>
              </td>
              <td class="px-3 py-3 text-center font-mono font-bold text-stone-800 dark:text-stone-200">{{ c.totalStudents }}</td>
              <td class="px-3 py-3 text-center font-mono text-xs text-stone-600 dark:text-stone-400">{{ c.maleCount }}</td>
              <td class="px-3 py-3 text-center font-mono text-xs text-stone-600 dark:text-stone-400">{{ c.femaleCount }}</td>
            </tr>
          </template>

          <template #cards>
            <div v-for="c in b.classes" :key="c.classRoomId" class="space-y-2 px-4 py-3">
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                  <NuxtLink :to="'/admin/lop/' + c.classRoomId" class="block truncate text-sm font-semibold text-marian-600 hover:underline dark:text-marian-400">
                    {{ c.classRoomName }}
                  </NuxtLink>
                  <p class="truncate text-[11px] text-stone-400">{{ c.levelName }}</p>
                </div>
                <span class="shrink-0 font-mono text-sm font-bold text-stone-800 dark:text-stone-200">{{ c.totalStudents }} em</span>
              </div>
              <p class="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-stone-500">
                <span class="rounded bg-sky-50 px-1.5 py-0.5 font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">Nam: {{ c.maleCount }}</span>
                <span class="rounded bg-rose-50 px-1.5 py-0.5 font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-300">Nữ: {{ c.femaleCount }}</span>
              </p>
            </div>
          </template>
        </ListTable>
      </div>
    </div>

    <!-- TAB 2: ĐIỂM SỐ & CẢNH BÁO HỌC LỰC -->
    <div v-else-if="activeTab === 'grades' && gradesReport" class="space-y-6">
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Đoàn sinh được xếp loại"
          :value="gradesReport.totalStudents"
          icon="i-lucide-users"
        />
        <StatCard
          label="Điểm trung bình chung"
          :value="gradesReport.averageGpa.toFixed(2)"
          icon="i-lucide-award"
          class="text-marian-600"
        />
        <StatCard
          label="Biên độ ĐTB (Min - Max)"
          :value="`${gradesReport.minGpa.toFixed(1)} - ${gradesReport.maxGpa.toFixed(1)}`"
          icon="i-lucide-bar-chart-2"
        />
        <StatCard
          label="Dưới ngưỡng (Cần phụ đạo)"
          :value="gradesReport.belowThresholdCount"
          icon="i-lucide-alert-triangle"
          :class="gradesReport.belowThresholdCount > 0 ? 'text-red-600 font-bold' : ''"
        />
      </div>

      <!-- Bảng danh sách các em dưới ngưỡng -->
      <div class="rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <div class="border-b border-stone-100 p-4 dark:border-stone-800">
          <h4 class="font-display text-base font-bold text-stone-900 dark:text-stone-100">
            Danh sách đoàn sinh dưới ngưỡng (ĐTB &lt; 5.0 hoặc Chuyên cần &lt; 80%)
          </h4>
          <p class="text-xs text-stone-500">Cần liên hệ phụ huynh và bố trí giáo lý viên kèm cặp thêm</p>
        </div>

                <ListTable
          flat
          :columns="8"
          :loading="loading"
          :empty="!gradesReport.belowThresholdStudents || gradesReport.belowThresholdStudents.length === 0"
          loading-text="Đang tải danh sách dưới ngưỡng..."
          empty-title="Không có đoàn sinh dưới ngưỡng"
          empty-description="Toàn thể đoàn sinh đều đạt ngưỡng học lực và chuyên cần."
        >
          <template #head>
            <th class="w-[9%] px-3 py-3">Mã ĐS</th>
            <th class="w-[21%] px-3 py-3">Họ và tên</th>
            <th class="w-[16%] px-3 py-3">Lớp học</th>
            <th class="w-[9%] px-3 py-3 text-center">HK1</th>
            <th class="w-[9%] px-3 py-3 text-center">HK2</th>
            <th class="w-[9%] px-3 py-3 text-center">Thi</th>
            <th class="w-[9%] px-3 py-3 text-center">Điểm TB</th>
            <th class="w-[18%] px-3 py-3 text-center">Trạng thái</th>
          </template>

          <template #rows>
            <tr v-for="s in gradesReport.belowThresholdStudents" :key="s.studentId" class="transition-colors hover:bg-stone-50/70 dark:hover:bg-stone-800/40">
              <td class="px-3 py-3">
                <span class="block truncate font-mono text-xs font-semibold text-marian-600 dark:text-marian-400">{{ s.studentCode }}</span>
              </td>
              <td class="px-3 py-3">
                <NuxtLink :to="'/admin/doan-sinh/' + s.studentId" class="block truncate font-medium text-stone-900 hover:underline dark:text-stone-100" :title="s.fullName">
                  {{ s.fullName }}
                </NuxtLink>
              </td>
              <td class="px-3 py-3">
                <span class="block truncate text-xs text-stone-500">{{ s.classRoomName }}</span>
              </td>
              <td class="px-3 py-3 text-center font-mono text-xs">{{ s.semester1 ?? '—' }}</td>
              <td class="px-3 py-3 text-center font-mono text-xs">{{ s.semester2 ?? '—' }}</td>
              <td class="px-3 py-3 text-center font-mono text-xs">{{ s.finalExam ?? '—' }}</td>
              <td class="px-3 py-3 text-center font-mono font-bold text-red-600">
                {{ s.averageScore !== null && s.averageScore !== undefined ? s.averageScore.toFixed(1) : '—' }}
              </td>
              <td class="px-3 py-3 text-center">
                <span class="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-red-700 dark:bg-red-950 dark:text-red-300">
                  {{ s.status || 'Chưa đạt' }}
                </span>
              </td>
            </tr>
          </template>

          <template #cards>
            <div v-for="s in gradesReport.belowThresholdStudents" :key="s.studentId" class="space-y-2 px-4 py-3">
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                  <NuxtLink :to="'/admin/doan-sinh/' + s.studentId" class="block truncate text-sm font-semibold text-stone-900 hover:underline dark:text-stone-100">
                    {{ s.fullName }}
                  </NuxtLink>
                  <p class="truncate font-mono text-[11px] text-stone-400">{{ s.studentCode }} · {{ s.classRoomName }}</p>
                </div>
                <span class="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-red-700 dark:bg-red-950 dark:text-red-300">
                  {{ s.status || 'Chưa đạt' }}
                </span>
              </div>
              <p class="flex flex-wrap items-center gap-1.5 text-[11px] text-stone-500">
                <span class="rounded bg-stone-100 px-1.5 py-0.5 font-mono dark:bg-stone-800 dark:text-stone-300">HK1: {{ s.semester1 ?? '—' }}</span>
                <span class="rounded bg-stone-100 px-1.5 py-0.5 font-mono dark:bg-stone-800 dark:text-stone-300">HK2: {{ s.semester2 ?? '—' }}</span>
                <span class="rounded bg-stone-100 px-1.5 py-0.5 font-mono dark:bg-stone-800 dark:text-stone-300">Thi: {{ s.finalExam ?? '—' }}</span>
                <span class="rounded bg-red-50 px-1.5 py-0.5 font-mono font-bold text-red-600 dark:bg-red-950 dark:text-red-300">
                  TB: {{ s.averageScore !== null && s.averageScore !== undefined ? s.averageScore.toFixed(1) : '—' }}
                </span>
              </p>
            </div>
          </template>
        </ListTable>
      </div>
    </div>

    <!-- TAB 3: TỔNG HỢP LÊN LỚP -->
    <div v-else-if="activeTab === 'promotion' && promotionReport" class="space-y-6">
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Tổng đoàn sinh xét"
          :value="promotionReport.totalStudents"
          icon="i-lucide-users"
        />
        <StatCard
          label="Được lên lớp"
          :value="promotionReport.promotedCount"
          icon="i-lucide-arrow-up-circle"
          class="text-emerald-600"
        />
        <StatCard
          label="Ở lại lớp (Học lại)"
          :value="promotionReport.retainedCount"
          icon="i-lucide-rotate-ccw"
          class="text-amber-600"
        />
        <StatCard
          label="Tốt nghiệp / Mãn khóa"
          :value="promotionReport.graduatedCount"
          icon="i-lucide-graduation-cap"
          class="text-marian-600"
        />
      </div>

      <!-- Bảng tóm tắt theo lớp -->
              <ListTable
          :columns="6"
          :loading="loading"
          :empty="!promotionReport.classSummaries || promotionReport.classSummaries.length === 0"
          loading-text="Đang tải tổng hợp lên lớp..."
          empty-title="Chưa có dữ liệu tổng hợp"
        >
          <template #head>
            <th class="w-[30%] px-3 py-3">Lớp học</th>
            <th class="w-[14%] px-3 py-3 text-center">Tổng</th>
            <th class="w-[14%] px-3 py-3 text-center">Lên lớp</th>
            <th class="w-[14%] px-3 py-3 text-center">Ở lại</th>
            <th class="w-[14%] px-3 py-3 text-center">Tốt nghiệp</th>
            <th class="w-[14%] px-3 py-3 text-center">Chờ duyệt</th>
          </template>

          <template #rows>
            <tr v-for="c in promotionReport.classSummaries" :key="c.classRoomId" class="transition-colors hover:bg-stone-50/70 dark:hover:bg-stone-800/40">
              <td class="px-3 py-3">
                <span class="block truncate font-semibold text-stone-900 dark:text-stone-100">{{ c.classRoomName }}</span>
              </td>
              <td class="px-3 py-3 text-center font-mono font-bold">{{ c.totalStudents }}</td>
              <td class="px-3 py-3 text-center font-mono font-semibold text-emerald-600">{{ c.promotedCount }}</td>
              <td class="px-3 py-3 text-center font-mono font-semibold text-amber-600">{{ c.retainedCount }}</td>
              <td class="px-3 py-3 text-center font-mono font-semibold text-marian-600">{{ c.graduatedCount }}</td>
              <td class="px-3 py-3 text-center font-mono text-stone-400">{{ c.pendingCount }}</td>
            </tr>
          </template>

          <template #cards>
            <div v-for="c in promotionReport.classSummaries" :key="c.classRoomId" class="space-y-2 px-4 py-3">
              <div class="flex items-center justify-between gap-2">
                <p class="min-w-0 truncate text-sm font-semibold text-stone-900 dark:text-stone-100">{{ c.classRoomName }}</p>
                <span class="shrink-0 font-mono text-sm font-bold text-stone-800 dark:text-stone-200">{{ c.totalStudents }} em</span>
              </div>
              <p class="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span class="rounded bg-emerald-50 px-1.5 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">Lên lớp: {{ c.promotedCount }}</span>
                <span class="rounded bg-amber-50 px-1.5 py-0.5 font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">Ở lại: {{ c.retainedCount }}</span>
                <span class="rounded bg-sky-50 px-1.5 py-0.5 font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">Tốt nghiệp: {{ c.graduatedCount }}</span>
                <span class="rounded bg-stone-100 px-1.5 py-0.5 font-semibold text-stone-600 dark:bg-stone-800 dark:text-stone-400">Chờ duyệt: {{ c.pendingCount }}</span>
              </p>
            </div>
          </template>
        </ListTable>
    </div>

    <!-- TAB 4: THIẾU HỒ SƠ -->
    <div v-else-if="activeTab === 'missing' && missingReport" class="space-y-6">
      <div class="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <UIcon name="i-lucide-alert-circle" class="h-6 w-6 text-amber-600" />
          <div>
            <h4 class="font-bold text-amber-900 dark:text-amber-200">
              Phát hiện {{ missingReport.totalMissing }} đoàn sinh chưa hoàn thiện hồ sơ
            </h4>
            <p class="text-xs text-amber-700 dark:text-amber-400">
              Bao gồm thiếu số điện thoại liên lạc, thông tin bí tích Rửa tội/Thêm sức, hoặc chưa xếp lớp.
            </p>
          </div>
        </div>
      </div>

              <ListTable
          :columns="5"
          :loading="loading"
          :empty="!missingReport.students || missingReport.students.length === 0"
          loading-text="Đang tải danh sách thiếu hồ sơ..."
          empty-title="Không còn hồ sơ nào thiếu"
          empty-description="Tất cả hồ sơ đoàn sinh đều đầy đủ thông tin."
        >
          <template #head>
            <th class="w-[10%] px-3 py-3">Mã ĐS</th>
            <th class="w-[24%] px-3 py-3">Tên thánh &amp; Họ tên</th>
            <th class="w-[20%] px-3 py-3">Ngành &amp; Lớp</th>
            <th class="w-[32%] px-3 py-3">Còn thiếu</th>
            <th class="w-[14%] px-3 py-3 text-right"><span class="sr-only">Thao tác</span></th>
          </template>

          <template #rows>
            <tr v-for="s in missingReport.students" :key="s.studentId" class="transition-colors hover:bg-stone-50/70 dark:hover:bg-stone-800/40">
              <td class="px-3 py-3">
                <span class="block truncate font-mono text-xs font-semibold text-marian-600 dark:text-marian-400">{{ s.studentCode }}</span>
              </td>
              <td class="px-3 py-3">
                <NuxtLink
                  :to="'/admin/doan-sinh/' + s.studentId"
                  class="block truncate font-medium text-stone-900 hover:underline dark:text-stone-100"
                  :title="(s.holyName ? s.holyName + ' ' : '') + s.fullName"
                >
                  {{ s.holyName ? s.holyName + ' ' : '' }}{{ s.fullName }}
                </NuxtLink>
              </td>
              <td class="px-3 py-3">
                <span class="block truncate text-xs text-stone-500">{{ s.branchName }} - {{ s.classRoomName || 'Chưa xếp lớp' }}</span>
              </td>
              <td class="px-3 py-3">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="r in s.missingReasons"
                    :key="r"
                    class="rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-700 dark:bg-red-950 dark:text-red-300"
                  >
                    {{ r }}
                  </span>
                </div>
              </td>
              <td class="px-3 py-3 text-right">
                <NuxtLink
                  :to="'/admin/doan-sinh/' + s.studentId"
                  class="inline-flex items-center gap-1 rounded bg-stone-100 px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-200"
                >
                  Bổ sung
                  <UIcon name="i-lucide-arrow-right" class="size-3" />
                </NuxtLink>
              </td>
            </tr>
          </template>

          <template #cards>
            <div v-for="s in missingReport.students" :key="s.studentId" class="space-y-2 px-4 py-3">
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                  <NuxtLink :to="'/admin/doan-sinh/' + s.studentId" class="block truncate text-sm font-semibold text-stone-900 hover:underline dark:text-stone-100">
                    {{ s.holyName ? s.holyName + ' ' : '' }}{{ s.fullName }}
                  </NuxtLink>
                  <p class="truncate font-mono text-[11px] text-stone-400">{{ s.studentCode }} · {{ s.branchName }} - {{ s.classRoomName || 'Chưa xếp lớp' }}</p>
                </div>
              </div>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="r in s.missingReasons"
                  :key="r"
                  class="rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-700 dark:bg-red-950 dark:text-red-300"
                >
                  {{ r }}
                </span>
              </div>
              <NuxtLink
                :to="'/admin/doan-sinh/' + s.studentId"
                class="inline-flex w-full items-center justify-center gap-1 rounded bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-200"
              >
                Bổ sung hồ sơ
                <UIcon name="i-lucide-arrow-right" class="size-3" />
              </NuxtLink>
            </div>
          </template>
        </ListTable>
    </div>

    <!-- Modal Xuất Báo Cáo Excel -->
    <UModal v-model:open="exportOpen" title="Xuất báo cáo Excel">
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Loại báo cáo <span class="text-red-500">*</span>
            </label>
            <select
              v-model="exportForm.reportType"
              class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            >
              <option value="StudentsByBranch">Thống kê đoàn sinh theo ngành & lớp</option>
              <option value="MissingData">Danh sách đoàn sinh thiếu hồ sơ</option>
              <option value="PromotionSummary">Tổng hợp kết quả xét lên lớp</option>
              <option value="GradesSummary">Báo cáo điểm số & học lực</option>
            </select>
          </div>

          <div v-if="exportForm.reportType !== 'MissingData'">
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Niên khóa
            </label>
            <select
              v-model="exportForm.academicYearId"
              class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            >
              <option v-for="y in years" :key="y.id" :value="y.id">
                {{ y.name }}
              </option>
            </select>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="exportOpen = false">Hủy</UButton>
          <UButton
            color="primary"
            :loading="exporting"
            icon="i-lucide-download"
            @click="handleExportReport"
          >
            Tải file Excel
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
