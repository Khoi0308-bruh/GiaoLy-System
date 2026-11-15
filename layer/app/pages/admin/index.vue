<script setup lang="ts">
import { PERMISSIONS } from '~/shared/permissions'
import { ApiError } from '~/composables/useApi'

definePageMeta({ layout: 'admin' })

const api = useApi()
const { can } = usePermissions()

interface AcademicYear {
  id: string
  name: string
  theme?: string | null
  startDate: string
  endDate: string
  status: 'Draft' | 'Active' | 'Locked' | 'Archived'
}

interface DashboardReport {
  totalStudents: number
  activeStudents: number
  totalClassrooms: number
  totalLeaders: number
  averageAttendanceRate?: number | null
  sacramentsSummary?: {
    baptismCount: number
    communionCount: number
    confirmationCount: number
  }
}

interface Announcement {
  id: string
  title: string
  summary?: string | null
  targetAudience: string
  priority: string
  publishedAt: string
  isPinned?: boolean
}

interface LiturgicalDay {
  date: string
  celebrationTitle: string
  liturgicalColor: 'White' | 'Red' | 'Green' | 'Violet' | 'Rose' | 'Gold'
  rank: string
  readingsSummary?: string | null
}

const activeYear = ref<AcademicYear | null>(null)
const dashboardStats = ref<DashboardReport | null>(null)
const announcements = ref<Announcement[]>([])
const liturgicalToday = ref<LiturgicalDay | null>(null)

const loadingYear = ref(false)
const loadingStats = ref(false)
const loadingAnnouncements = ref(false)
const loadingLiturgical = ref(false)

const errorYear = ref<ApiError | null>(null)
const errorStats = ref<ApiError | null>(null)
const errorAnnouncements = ref<ApiError | null>(null)
const errorLiturgical = ref<ApiError | null>(null)

async function fetchLiturgicalToday() {
  loadingLiturgical.value = true
  errorLiturgical.value = null
  try {
    liturgicalToday.value = await api.get<LiturgicalDay>('/public/liturgical/today')
  } catch (e) {
    errorLiturgical.value = e as ApiError
  } finally {
    loadingLiturgical.value = false
  }
}

async function fetchActiveYear() {
  if (!can(PERMISSIONS.Academic.View)) return
  loadingYear.value = true
  errorYear.value = null
  try {
    activeYear.value = await api.get<AcademicYear>('/academic-years/active')
  } catch (e) {
    errorYear.value = e as ApiError
  } finally {
    loadingYear.value = false
  }
}

async function fetchDashboardStats() {
  if (!can(PERMISSIONS.Reports.View)) return
  loadingStats.value = true
  errorStats.value = null
  try {
    dashboardStats.value = await api.get<DashboardReport>('/reports/dashboard')
  } catch (e) {
    errorStats.value = e as ApiError
  } finally {
    loadingStats.value = false
  }
}

async function fetchAnnouncements() {
  if (!can(PERMISSIONS.Announcements.View)) return
  loadingAnnouncements.value = true
  errorAnnouncements.value = null
  try {
    const res = await api.get<{ items?: Announcement[], data?: Announcement[] } | Announcement[]>('/announcements', { limit: 5 })
    if (Array.isArray(res)) {
      announcements.value = res.slice(0, 5)
    } else if (res && Array.isArray(res.items)) {
      announcements.value = res.items.slice(0, 5)
    } else if (res && Array.isArray(res.data)) {
      announcements.value = res.data.slice(0, 5)
    }
  } catch (e) {
    errorAnnouncements.value = e as ApiError
  } finally {
    loadingAnnouncements.value = false
  }
}

onMounted(() => {
  fetchLiturgicalToday()
  fetchActiveYear()
  fetchDashboardStats()
  fetchAnnouncements()
})

const COLOR_MAP: Record<string, { label: string, badge: string, border: string }> = {
  White: { label: 'Trắng', badge: 'bg-stone-100 text-stone-800 border-stone-300', border: 'border-l-amber-400' },
  Red: { label: 'Đỏ', badge: 'bg-rose-100 text-rose-800 border-rose-300', border: 'border-l-rose-600' },
  Green: { label: 'Xanh lá', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300', border: 'border-l-emerald-600' },
  Violet: { label: 'Tím', badge: 'bg-purple-100 text-purple-800 border-purple-300', border: 'border-l-purple-700' },
  Rose: { label: 'Hồng', badge: 'bg-pink-100 text-pink-800 border-pink-300', border: 'border-l-pink-400' },
  Gold: { label: 'Vàng kim', badge: 'bg-amber-100 text-amber-900 border-amber-400', border: 'border-l-amber-500' }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <PageHeader
      title="Bảng điều khiển Trung tâm"
      subtitle="Hệ thống Quản lý Giáo lý Giáo xứ — Tổng quan hoạt động đức tin và học tập"
    />

    <!-- Dải Lịch Phụng Vụ Hôm Nay -->
    <div
      v-if="liturgicalToday"
      class="rounded-xl border border-stone-200 bg-white p-4 shadow-sm border-l-4 transition-all"
      :class="COLOR_MAP[liturgicalToday.liturgicalColor]?.border || 'border-l-amber-500'"
    >
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-800">
            <UIcon name="i-heroicons-sparkles" class="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold uppercase tracking-wider text-stone-500">Phụng vụ hôm nay</span>
              <span
                class="rounded-full px-2 py-0.5 text-xs font-medium border"
                :class="COLOR_MAP[liturgicalToday.liturgicalColor]?.badge || 'bg-stone-100 text-stone-800'"
              >
                Màu áo lễ: {{ COLOR_MAP[liturgicalToday.liturgicalColor]?.label || liturgicalToday.liturgicalColor }}
              </span>
            </div>
            <h2 class="text-base font-bold text-stone-900">
              {{ liturgicalToday.celebrationTitle }}
            </h2>
          </div>
        </div>
        <div v-if="liturgicalToday.readingsSummary" class="text-xs text-stone-600 max-w-md text-right hidden md:block">
          {{ liturgicalToday.readingsSummary }}
        </div>
      </div>
    </div>

    <!-- Dải niên khóa hiện hành (academic.view) -->
    <div v-if="can(PERMISSIONS.Academic.View)" class="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1D3A73]">
            <UIcon name="i-heroicons-academic-cap" class="h-4 w-4" />
            Niên khóa hiện hành
          </div>
          <div v-if="activeYear" class="mt-1">
            <h3 class="text-xl font-bold text-stone-900">
              {{ activeYear.name }}
              <span v-if="activeYear.theme" class="text-sm font-normal text-stone-600 italic ml-2">
                — "{{ activeYear.theme }}"
              </span>
            </h3>
            <p class="text-xs text-stone-500 mt-0.5">
              Thời gian: {{ activeYear.startDate }} đến {{ activeYear.endDate }}
            </p>
          </div>
          <div v-else-if="loadingYear" class="text-sm text-stone-500 mt-1">
            Đang tải thông tin niên khóa...
          </div>
          <div v-else class="text-sm text-amber-700 mt-1">
            Chưa thiết lập niên khóa đang hoạt động.
          </div>
        </div>

        <div class="flex items-center gap-3">
          <StatusChip v-if="activeYear" :status="activeYear.status === 'Active' ? 'Active' : 'Locked'" />
          <UButton
            to="/admin/nien-khoa"
            variant="outline"
            size="sm"
            icon="i-heroicons-arrow-top-right-on-square"
          >
            Quản lý niên khóa
          </UButton>
        </div>
      </div>
      <ErrorState v-if="errorYear" :error="errorYear" class="mt-3" />
    </div>

    <!-- Thẻ số liệu tổng quan (reports.view) -->
    <div v-if="can(PERMISSIONS.Reports.View)" class="space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
          <UIcon name="i-heroicons-chart-bar" class="h-4 w-4 text-[#A8812A]" />
          Thẻ số liệu tổng quan
        </h3>
        <UButton to="/admin/bao-cao" variant="link" size="xs" color="primary">
          Xem báo cáo chi tiết →
        </UButton>
      </div>

      <ErrorState v-if="errorStats" :error="errorStats" />

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Tổng số đoàn sinh"
          :value="dashboardStats?.totalStudents ?? (loadingStats ? '...' : 0)"
          description="Đoàn sinh đang theo học giáo lý"
          icon="i-heroicons-user-group"
        />
        <StatCard
          label="Đoàn sinh tích cực"
          :value="dashboardStats?.activeStudents ?? (loadingStats ? '...' : 0)"
          description="Đang tham gia sinh hoạt đều đặn"
          icon="i-heroicons-check-badge"
        />
        <StatCard
          label="Tổng số lớp học"
          :value="dashboardStats?.totalClassrooms ?? (loadingStats ? '...' : 0)"
          description="Từ Khai Tâm đến Vào Đời"
          icon="i-heroicons-academic-cap"
        />
        <StatCard
          label="Huynh trưởng & GLV"
          :value="dashboardStats?.totalLeaders ?? (loadingStats ? '...' : 0)"
          description="Đội ngũ phụ trách & trợ tá"
          icon="i-heroicons-shield-check"
        />
      </div>

      <!-- Tóm tắt Bí tích -->
      <div v-if="dashboardStats?.sacramentsSummary" class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div class="rounded-lg border border-stone-200 bg-stone-50/70 p-3 text-center">
          <div class="text-xs text-stone-500">Rửa tội trong năm</div>
          <div class="text-lg font-bold text-[#1D3A73]">{{ dashboardStats.sacramentsSummary.baptismCount }}</div>
        </div>
        <div class="rounded-lg border border-stone-200 bg-stone-50/70 p-3 text-center">
          <div class="text-xs text-stone-500">Xưng tội & Rước lễ lần đầu</div>
          <div class="text-lg font-bold text-[#1D3A73]">{{ dashboardStats.sacramentsSummary.communionCount }}</div>
        </div>
        <div class="rounded-lg border border-stone-200 bg-stone-50/70 p-3 text-center">
          <div class="text-xs text-stone-500">Bí tích Thêm sức</div>
          <div class="text-lg font-bold text-[#1D3A73]">{{ dashboardStats.sacramentsSummary.confirmationCount }}</div>
        </div>
      </div>
    </div>

    <!-- Hàng dưới: Khung thông báo & Lối tắt nhanh -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Khung thông báo nội bộ (announcements.view) -->
      <div v-if="can(PERMISSIONS.Announcements.View)" class="lg:col-span-2 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-bold text-stone-900 flex items-center gap-2">
            <UIcon name="i-heroicons-megaphone" class="h-5 w-5 text-[#1D3A73]" />
            Khung thông báo giáo xứ
          </h3>
          <UButton to="/admin/thong-bao" variant="outline" size="xs">
            Tất cả thông báo
          </UButton>
        </div>

        <ErrorState v-if="errorAnnouncements" :error="errorAnnouncements" />

        <div v-if="loadingAnnouncements" class="py-6 text-center text-sm text-stone-500">
          Đang tải thông báo...
        </div>

        <div v-else-if="announcements.length === 0" class="py-6 text-center text-sm text-stone-500">
          Chưa có thông báo nào trong niên khóa hiện tại.
        </div>

        <div v-else class="divide-y divide-stone-100">
          <div
            v-for="a in announcements"
            :key="a.id"
            class="py-3 first:pt-0 last:pb-0 hover:bg-stone-50/60 transition-colors rounded-lg px-2 -mx-2"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span
                    v-if="a.priority === 'High' || a.priority === 'Urgent'"
                    class="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-800"
                  >
                    KHẨN
                  </span>
                  <span
                    v-if="a.isPinned"
                    class="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800"
                  >
                    GHIM
                  </span>
                  <NuxtLink :to="`/admin/thong-bao`" class="text-sm font-semibold text-stone-900 hover:text-[#1D3A73]">
                    {{ a.title }}
                  </NuxtLink>
                </div>
                <p v-if="a.summary" class="text-xs text-stone-600 line-clamp-2">
                  {{ a.summary }}
                </p>
              </div>
              <div class="text-right text-[11px] text-stone-400 whitespace-nowrap">
                {{ a.publishedAt }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Khối tác vụ nhanh -->
      <div class="rounded-xl border border-stone-200 bg-white p-5 shadow-sm space-y-4">
        <h3 class="text-base font-bold text-stone-900 flex items-center gap-2">
          <UIcon name="i-heroicons-bolt" class="h-5 w-5 text-[#A8812A]" />
          Lối tắt tác vụ nhanh
        </h3>

        <div class="space-y-2">
          <UButton
            v-if="can(PERMISSIONS.Students.View)"
            to="/admin/doan-sinh"
            block
            variant="soft"
            color="primary"
            icon="i-heroicons-user-group"
            class="justify-start"
          >
            Danh sách đoàn sinh
          </UButton>
          <UButton
            v-if="can(PERMISSIONS.Students.Create)"
            to="/admin/doan-sinh/them"
            block
            variant="soft"
            color="primary"
            icon="i-heroicons-user-plus"
            class="justify-start"
          >
            Tiếp nhận đoàn sinh mới
          </UButton>
          <UButton
            v-if="can(PERMISSIONS.Academic.View)"
            to="/admin/lop"
            block
            variant="soft"
            color="primary"
            icon="i-heroicons-rectangle-group"
            class="justify-start"
          >
            Danh sách lớp giáo lý
          </UButton>
          <UButton
            v-if="can(PERMISSIONS.Promotion.View)"
            to="/admin/len-lop"
            block
            variant="soft"
            color="primary"
            icon="i-heroicons-arrow-trending-up"
            class="justify-start"
          >
            Xét duyệt lên lớp
          </UButton>
          <UButton
            v-if="can(PERMISSIONS.Camps.View)"
            to="/admin/trai"
            block
            variant="soft"
            color="primary"
            icon="i-heroicons-flag"
            class="justify-start"
          >
            Sự kiện & Trại huấn luyện
          </UButton>
          <UButton
            v-if="can(PERMISSIONS.Sacraments.View)"
            to="/admin/doan-sinh/yeu-cau-bi-tich"
            block
            variant="soft"
            color="primary"
            icon="i-heroicons-heart"
            class="justify-start"
          >
            Chuẩn bị bí tích
          </UButton>
        </div>

        <div class="pt-3 border-t border-stone-100">
          <NuxtLink
            to="/xac-thuc-chung-chi"
            class="flex items-center justify-between text-xs text-stone-600 hover:text-[#1D3A73]"
            target="_blank"
          >
            <span>Tra cứu chứng chỉ công khai</span>
            <UIcon name="i-heroicons-arrow-top-right-on-square" class="h-3.5 w-3.5" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
