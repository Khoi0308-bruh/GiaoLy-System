<script setup lang="ts">
import { PERMISSIONS } from '../../../../shared/permissions'
import type { ApiError } from '../../../../composables/useApi'

definePageMeta({ layout: 'admin', permission: PERMISSIONS.Bouquets.View })

interface SpiritualBouquetItem {
  id: string
  enrollmentId: string
  studentId: string
  studentCode: string
  studentHolyName: string
  studentFullName: string
  bouquetDate: string
  bouquetType: string
  points: number
  givenBy: string
  givenByName: string
  note?: string | null
  reversesBouquetId?: string | null
  createdAt: string
}

interface LeaderboardEntry {
  rank: number
  studentId: string
  enrollmentId: string
  studentCode: string
  studentHolyName: string
  studentFullName: string
  totalPoints: number
  bouquetCount: number
  pointsByType: Record<string, number>
}

interface ClassRoomSummary {
  id: string
  className: string
  academicYearName: string
}

interface EnrollmentOption {
  id: string
  studentId: string
  studentCode: string
  holyName?: string | null
  fullName: string
}

const route = useRoute()
const api = useApi()
const toast = useToast()
const { can } = usePermissions()

const classRoomId = route.params.id as string

const classroom = ref<ClassRoomSummary | null>(null)
const bouquets = ref<SpiritualBouquetItem[]>([])
const leaderboard = ref<LeaderboardEntry[]>([])
const enrollmentOptions = ref<EnrollmentOption[]>([])
const loading = ref(true)
const error = ref<ApiError | null>(null)

const activeTab = ref<'leaderboard' | 'history'>('leaderboard')

// Modal Ghi hoa thiêng
const recordOpen = ref(false)
const recording = ref(false)
const recordForm = ref({
  enrollmentId: '',
  bouquetDate: new Date().toISOString().substring(0, 10),
  bouquetType: 'Dự Lễ',
  points: 10,
  note: ''
})

// Modal Đảo ngược dòng hoa thiêng
const reverseOpen = ref(false)
const reversing = ref(false)
const selectedBouquet = ref<SpiritualBouquetItem | null>(null)
const reverseReason = ref('')

const bouquetTypeOptions = [
  { label: 'Dự Thánh Lễ (+10)', value: 'Dự Lễ', defaultPoints: 10 },
  { label: 'Lần Hạt Mân Côi (+10)', value: 'Lần Hạt', defaultPoints: 10 },
  { label: 'Việc Bác Ái / Giúp Đỡ (+15)', value: 'Việc Bác Ái', defaultPoints: 15 },
  { label: 'Hy Sinh / Chịu Khó (+10)', value: 'Hy Sinh', defaultPoints: 10 },
  { label: 'Học Kinh Bổn / Giáo Lý (+10)', value: 'Học Kinh Bổn', defaultPoints: 10 },
  { label: 'Việc Thiêng Liêng Khác (+5)', value: 'Khác', defaultPoints: 5 }
]

function onBouquetTypeChange() {
  const found = bouquetTypeOptions.find(o => o.value === recordForm.value.bouquetType)
  if (found) {
    recordForm.value.points = found.defaultPoints
  }
}

async function loadData() {
  loading.value = true
  error.value = null
  try {
    const [resClass, resBouquets, resLeaderboard, resEnrollments] = await Promise.all([
      api.get<ClassRoomSummary>(`/classrooms/${classRoomId}`).catch(() => null),
      api.get<SpiritualBouquetItem[]>(`/classrooms/${classRoomId}/bouquets`),
      api.get<LeaderboardEntry[]>(`/classrooms/${classRoomId}/bouquets/leaderboard`),
      api.get<any[]>(`/classrooms/${classRoomId}/enrollments`).catch(() => [])
    ])
    classroom.value = resClass
    bouquets.value = resBouquets || []
    leaderboard.value = resLeaderboard || []
    enrollmentOptions.value = (resEnrollments || []).map(e => ({
      id: e.id,
      studentId: e.studentId,
      studentCode: e.studentCode,
      holyName: e.holyName,
      fullName: e.fullName
    }))
  } catch (e) {
    error.value = e as ApiError
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

function openRecordModal() {
  recordForm.value = {
    enrollmentId: enrollmentOptions.value[0]?.id || '',
    bouquetDate: new Date().toISOString().substring(0, 10),
    bouquetType: 'Dự Lễ',
    points: 10,
    note: ''
  }
  recordOpen.value = true
}

async function handleRecordBouquet() {
  if (!recordForm.value.enrollmentId) {
    toast.add({ title: 'Vui lòng chọn đoàn sinh', color: 'error' })
    return
  }
  recording.value = true
  try {
    await api.post(`/classrooms/${classRoomId}/bouquets`, {
      enrollmentId: recordForm.value.enrollmentId,
      bouquetDate: recordForm.value.bouquetDate,
      bouquetType: recordForm.value.bouquetType,
      points: Number(recordForm.value.points),
      note: recordForm.value.note?.trim() || null
    })
    toast.add({ title: 'Đã dâng một bông hoa thiêng', color: 'success' })
    recordOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể ghi hoa thiêng', description: err.detail || err.message, color: 'error' })
  } finally {
    recording.value = false
  }
}

function openReverseModal(item: SpiritualBouquetItem) {
  selectedBouquet.value = item
  reverseReason.value = ''
  reverseOpen.value = true
}

async function handleReverseBouquet() {
  if (!selectedBouquet.value || !reverseReason.value.trim()) {
    toast.add({ title: 'Vui lòng nhập lý do đảo ngược dòng ghi nhầm', color: 'error' })
    return
  }
  reversing.value = true
  try {
    await api.post(`/bouquets/${selectedBouquet.value.id}/reverse`, {
      reason: reverseReason.value.trim()
    })
    toast.add({ title: 'Đã hủy/đảo ngược dòng hoa thiêng', color: 'success' })
    reverseOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Lỗi đảo ngược hoa thiêng', description: err.detail || err.message, color: 'error' })
  } finally {
    reversing.value = false
  }
}

const totalBouquetCount = computed(() => bouquets.value.filter(b => !b.reversesBouquetId).length)
const totalPointsAll = computed(() => {
  return bouquets.value.reduce((acc, b) => acc + (b.points || 0), 0)
})

const top3 = computed(() => leaderboard.value.slice(0, 3))
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-2 text-xs font-medium text-stone-500">
      <NuxtLink to="/admin/lop" class="hover:text-marian-600 hover:underline">
        Lớp học
      </NuxtLink>
      <UIcon name="i-lucide-chevron-right" class="h-3 w-3" />
      <NuxtLink :to="`/admin/lop/${classRoomId}`" class="hover:text-marian-600 hover:underline">
        {{ classroom?.className || 'Chi tiết lớp' }}
      </NuxtLink>
      <UIcon name="i-lucide-chevron-right" class="h-3 w-3" />
      <span class="text-stone-800 dark:text-stone-200 font-semibold">Hoa thiêng</span>
    </div>

    <PageHeader
      :title="`Sổ Hoa Thiêng ${classroom ? 'lớp ' + classroom.className : ''}`"
      subtitle="Ghi nhận những việc lành, hy sinh và kinh nguyện của các em đoàn sinh"
    >
      <template #actions>
        <UButton
          v-if="can(PERMISSIONS.Bouquets.Give)"
          color="primary"
          icon="i-lucide-plus"
          @click="openRecordModal"
        >
          Dâng hoa thiêng
        </UButton>
      </template>
    </PageHeader>

    <ErrorState v-if="error" :error="error" @retry="loadData" />

    <!-- Thống kê tổng quan -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        label="Tổng số hoa thiêng đã dâng"
        :value="totalBouquetCount"
        icon="i-lucide-flower-2"
      />
      <StatCard
        label="Tổng điểm hoa thiêng"
        :value="totalPointsAll"
        icon="i-lucide-sparkles"
      />
      <StatCard
        label="Đoàn sinh tham gia"
        :value="leaderboard.length"
        icon="i-lucide-users"
      />
    </div>

    <!-- Top 3 nổi bật (Podium) -->
    <div v-if="top3.length > 0" class="rounded-2xl border border-vatican-200 bg-gradient-to-b from-vatican-50/50 to-white p-5 dark:border-stone-800 dark:from-stone-900 dark:to-stone-900/60">
      <h3 class="mb-4 text-center font-display text-lg font-bold text-stone-900 dark:text-stone-100">
        ✠ Gương mặt Tiêu biểu Hoa Thiêng ✠
      </h3>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div
          v-for="(item, idx) in top3"
          :key="item.studentId"
          class="flex flex-col items-center rounded-xl border p-4 text-center shadow-sm"
          :class="idx === 0 ? 'border-vatican-400 bg-vatican-50/80 dark:bg-vatican-950/40' : 'border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-800/40'"
        >
          <div class="flex h-12 w-12 items-center justify-center rounded-full text-xl shadow"
               :class="idx === 0 ? 'bg-amber-400 text-stone-900' : idx === 1 ? 'bg-stone-300 text-stone-800' : 'bg-amber-700 text-white'">
            {{ idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉' }}
          </div>
          <span class="mt-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
            Hạng {{ idx + 1 }}
          </span>
          <h4 class="mt-1 font-bold text-stone-900 dark:text-stone-100">
            {{ item.studentHolyName ? `${item.studentHolyName} ` : '' }}{{ item.studentFullName }}
          </h4>
          <p class="font-mono text-xs text-stone-500">{{ item.studentCode }}</p>
          <div class="mt-3 flex items-center gap-2">
            <span class="rounded-full bg-vatican-100 px-3 py-1 font-mono text-sm font-bold text-vatican-900 dark:bg-vatican-900/50 dark:text-vatican-200">
              {{ item.totalPoints }} điểm
            </span>
            <span class="text-xs text-stone-400">({{ item.bouquetCount }} bông)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs chuyển đổi giữa Bảng xếp hạng & Nhật ký -->
    <div class="flex items-center gap-2 border-b border-stone-200 pb-2 dark:border-stone-800">
      <button
        type="button"
        class="rounded-lg px-4 py-2 text-sm font-semibold transition"
        :class="activeTab === 'leaderboard' ? 'bg-marian-600 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800'"
        @click="activeTab = 'leaderboard'"
      >
        <UIcon name="i-lucide-trophy" class="mr-1.5 inline h-4 w-4" />
        Bảng xếp hạng lớp
      </button>
      <button
        type="button"
        class="rounded-lg px-4 py-2 text-sm font-semibold transition"
        :class="activeTab === 'history' ? 'bg-marian-600 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800'"
        @click="activeTab = 'history'"
      >
        <UIcon name="i-lucide-list" class="mr-1.5 inline h-4 w-4" />
        Nhật ký ghi nhận ({{ bouquets.length }})
      </button>
    </div>

    <!-- Tab 1: Bảng Xếp Hạng -->
    <ListTable
      v-if="activeTab === 'leaderboard'"
      :columns="6"
      :loading="loading"
      :empty="leaderboard.length === 0"
      loading-text="Đang tải bảng xếp hạng..."
      empty-title="Chưa có dữ liệu hoa thiêng"
      empty-description="Ghi nhận bông hoa thiêng đầu tiên để bảng xếp hạng có dữ liệu."
    >
      <template #head>
        <th class="w-[10%] px-3 py-3 text-center">Hạng</th>
        <th class="w-[13%] px-3 py-3">Mã ĐS</th>
        <th class="w-[27%] px-3 py-3">Tên thánh &amp; Họ tên</th>
        <th class="w-[12%] px-3 py-3 text-center">Tổng điểm</th>
        <th class="w-[13%] px-3 py-3 text-center">Số bông</th>
        <th class="w-[25%] px-3 py-3">Chi tiết việc lành</th>
      </template>

      <template #rows>
        <tr v-for="item in leaderboard" :key="item.studentId" class="transition-colors hover:bg-stone-50/70 dark:hover:bg-stone-800/40">
          <td class="px-3 py-3 text-center">
            <span
              class="inline-flex size-6 items-center justify-center rounded-full text-xs"
              :class="item.rank === 1 ? 'bg-amber-400 font-black text-stone-900' : item.rank === 2 ? 'bg-stone-300 text-stone-800' : item.rank === 3 ? 'bg-amber-700 text-white' : 'text-stone-500'"
            >
              {{ item.rank }}
            </span>
          </td>
          <td class="px-3 py-3">
            <span class="block truncate font-mono text-xs font-semibold text-marian-600 dark:text-marian-400">{{ item.studentCode }}</span>
          </td>
          <td class="px-3 py-3">
            <NuxtLink
              :to="'/admin/doan-sinh/' + item.studentId"
              class="block truncate font-medium text-stone-900 hover:underline dark:text-stone-100"
              :title="(item.studentHolyName ? item.studentHolyName + ' ' : '') + item.studentFullName"
            >
              {{ item.studentHolyName ? item.studentHolyName + ' ' : '' }}{{ item.studentFullName }}
            </NuxtLink>
          </td>
          <td class="px-3 py-3 text-center font-mono font-bold text-vatican-800 dark:text-vatican-300">{{ item.totalPoints }}</td>
          <td class="px-3 py-3 text-center text-xs text-stone-600 dark:text-stone-400">{{ item.bouquetCount }} bông</td>
          <td class="px-3 py-3">
            <div class="flex flex-wrap gap-1">
              <span
                v-for="(pts, type) in item.pointsByType"
                :key="type"
                class="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap text-stone-700 dark:bg-stone-800 dark:text-stone-300"
              >
                {{ type }}: {{ pts }}đ
              </span>
              <span v-if="!item.pointsByType || Object.keys(item.pointsByType).length === 0" class="text-[11px] text-stone-400">—</span>
            </div>
          </td>
        </tr>
      </template>

      <template #cards>
        <div v-for="item in leaderboard" :key="item.studentId" class="space-y-2 px-4 py-3">
          <div class="flex items-start justify-between gap-2">
            <div class="flex min-w-0 items-center gap-2">
              <span
                class="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs"
                :class="item.rank === 1 ? 'bg-amber-400 font-black text-stone-900' : item.rank === 2 ? 'bg-stone-300 text-stone-800' : item.rank === 3 ? 'bg-amber-700 text-white' : 'text-stone-500'"
              >
                {{ item.rank }}
              </span>
              <div class="min-w-0">
                <NuxtLink :to="'/admin/doan-sinh/' + item.studentId" class="block truncate text-sm font-semibold text-stone-900 hover:underline dark:text-stone-100">
                  {{ item.studentHolyName ? item.studentHolyName + ' ' : '' }}{{ item.studentFullName }}
                </NuxtLink>
                <p class="font-mono text-[11px] text-stone-400">{{ item.studentCode }}</p>
              </div>
            </div>
            <div class="shrink-0 text-right">
              <p class="font-mono text-sm font-bold text-vatican-800 dark:text-vatican-300">{{ item.totalPoints }}đ</p>
              <p class="text-[11px] text-stone-400">{{ item.bouquetCount }} bông</p>
            </div>
          </div>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="(pts, type) in item.pointsByType"
              :key="type"
              class="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-300"
            >
              {{ type }}: {{ pts }}đ
            </span>
          </div>
        </div>
      </template>
    </ListTable>

    <!-- Tab 2: Nhật Ký Ghi Nhận -->
    <ListTable
      v-if="activeTab === 'history'"
      :columns="7"
      :loading="loading"
      :empty="bouquets.length === 0"
      loading-text="Đang tải nhật ký hoa thiêng..."
      empty-title="Chưa có nhật ký ghi nhận"
      empty-description="Mỗi bông hoa thiêng được ghi nhận sẽ xuất hiện ở đây."
    >
      <template #head>
        <th class="w-[11%] px-3 py-3">Ngày</th>
        <th class="w-[22%] px-3 py-3">Đoàn sinh</th>
        <th class="w-[17%] px-3 py-3">Loại hoa thiêng</th>
        <th class="w-[8%] px-3 py-3 text-center">Điểm</th>
        <th class="w-[14%] px-3 py-3">Người ghi</th>
        <th class="w-[18%] px-3 py-3">Ghi chú</th>
        <th v-if="can(PERMISSIONS.Bouquets.Manage)" class="w-[10%] px-3 py-3 text-right"><span class="sr-only">Thao tác</span></th>
      </template>

      <template #rows>
        <tr
          v-for="b in bouquets"
          :key="b.id"
          class="transition-colors hover:bg-stone-50/70 dark:hover:bg-stone-800/40"
          :class="b.reversesBouquetId ? 'bg-stone-50/50 opacity-50 line-through' : ''"
        >
          <td class="px-3 py-3 text-xs whitespace-nowrap text-stone-600 dark:text-stone-400">{{ b.bouquetDate }}</td>
          <td class="px-3 py-3">
            <span class="block truncate font-medium text-stone-900 dark:text-stone-100">
              {{ b.studentHolyName ? b.studentHolyName + ' ' : '' }}{{ b.studentFullName }}
            </span>
          </td>
          <td class="px-3 py-3">
            <span class="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-stone-700 dark:bg-stone-800 dark:text-stone-300">
              <UIcon name="i-lucide-flower" class="size-3.5 text-rose-500" />
              {{ b.bouquetType }}
            </span>
          </td>
          <td class="px-3 py-3 text-center font-mono font-bold" :class="b.points > 0 ? 'text-emerald-600' : 'text-red-500'">
            {{ b.points > 0 ? '+' + b.points : b.points }}
          </td>
          <td class="px-3 py-3">
            <span class="block truncate text-xs text-stone-500">{{ b.givenByName }}</span>
          </td>
          <td class="px-3 py-3 text-xs">
            <span v-if="b.note" class="block truncate text-stone-500" :title="b.note">{{ b.note }}</span>
            <span v-else class="text-stone-400">—</span>
          </td>
          <td v-if="can(PERMISSIONS.Bouquets.Manage)" class="px-3 py-3 text-right">
            <UButton
              v-if="!b.reversesBouquetId && b.points > 0"
              size="xs"
              variant="ghost"
              color="error"
              icon="i-lucide-undo-2"
              @click="openReverseModal(b)"
            >
              Đảo
            </UButton>
            <span v-else-if="b.reversesBouquetId" class="text-[11px] text-stone-400 italic">Đã đảo</span>
          </td>
        </tr>
      </template>

      <template #cards>
        <div v-for="b in bouquets" :key="b.id" class="space-y-2 px-4 py-3" :class="b.reversesBouquetId ? 'opacity-50' : ''">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-stone-900 dark:text-stone-100">
                {{ b.studentHolyName ? b.studentHolyName + ' ' : '' }}{{ b.studentFullName }}
              </p>
              <p class="text-[11px] text-stone-400">{{ b.bouquetDate }} · {{ b.givenByName }}</p>
            </div>
            <span class="shrink-0 font-mono text-sm font-bold" :class="b.points > 0 ? 'text-emerald-600' : 'text-red-500'">
              {{ b.points > 0 ? '+' + b.points : b.points }}
            </span>
          </div>
          <div class="flex items-center justify-between gap-2">
            <span class="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-700 dark:bg-stone-800 dark:text-stone-300">
              <UIcon name="i-lucide-flower" class="size-3.5 text-rose-500" />
              {{ b.bouquetType }}
            </span>
            <UButton
              v-if="can(PERMISSIONS.Bouquets.Manage) && !b.reversesBouquetId && b.points > 0"
              size="xs"
              variant="ghost"
              color="error"
              icon="i-lucide-undo-2"
              @click="openReverseModal(b)"
            >
              Đảo ngược
            </UButton>
          </div>
          <p v-if="b.note" class="text-[11px] text-stone-500">{{ b.note }}</p>
        </div>
      </template>
    </ListTable>

    <!-- Modal Dâng Hoa Thiêng -->
    <UModal
      v-model:open="recordOpen"
      title="Dâng bông hoa thiêng"
      description="Ghi nhận việc lành, hy sinh hoặc kinh nguyện cho đoàn sinh"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Đoàn sinh <span class="text-red-500">*</span>
            </label>
            <select
              v-model="recordForm.enrollmentId"
              class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            >
              <option v-for="e in enrollmentOptions" :key="e.id" :value="e.id">
                {{ e.holyName ? `${e.holyName} ` : '' }}{{ e.fullName }} ({{ e.studentCode }})
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Loại việc lành <span class="text-red-500">*</span>
              </label>
              <select
                v-model="recordForm.bouquetType"
                class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                @change="onBouquetTypeChange"
              >
                <option v-for="opt in bouquetTypeOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Điểm cộng <span class="text-red-500">*</span>
              </label>
              <UInput v-model.number="recordForm.points" type="number" min="1" max="100" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Ngày thực hiện
            </label>
            <UInput v-model="recordForm.bouquetDate" type="date" />
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Ghi chú thêm
            </label>
            <UTextarea v-model="recordForm.note" placeholder="Chi tiết việc lành đã làm..." :rows="2" />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="recordOpen = false">Hủy</UButton>
          <UButton
            color="primary"
            :loading="recording"
            :disabled="!recordForm.enrollmentId"
            @click="handleRecordBouquet"
          >
            Dâng hoa thiêng
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Đảo Ngược Hoa Thiêng -->
    <UModal
      v-model:open="reverseOpen"
      title="Đảo ngược dòng hoa thiêng ghi nhầm"
      :description="`Đoàn sinh: ${selectedBouquet?.studentHolyName ? selectedBouquet.studentHolyName + ' ' : ''}${selectedBouquet?.studentFullName} • Loại: ${selectedBouquet?.bouquetType}`"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Lý do đảo ngược / hủy <span class="text-red-500">*</span>
            </label>
            <UTextarea
              v-model="reverseReason"
              placeholder="Nhập lý do đảo dòng (ví dụ: ghi nhầm em, chọn nhầm loại việc...)"
              :rows="3"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="reverseOpen = false">Hủy</UButton>
          <UButton
            color="error"
            :loading="reversing"
            :disabled="!reverseReason.trim()"
            @click="handleReverseBouquet"
          >
            Xác nhận đảo ngược
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
