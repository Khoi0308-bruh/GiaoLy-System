<script setup lang="ts">
import { ApiError } from '~/composables/useApi'
import { liturgicalDisplayColor, type LiturgicalDisplayColor, type LiturgicalEventDto } from '~/composables/useLiturgical'

definePageMeta({ public: true })

const api = useApi()

interface LiturgicalDaySummary {
  date: string
  dayOfMonth: number
  celebrationTitle: string
  liturgicalColor: LiturgicalDisplayColor
  isSunday?: boolean
}

interface LiturgicalDayDetail {
  date: string
  celebrationTitle: string
  liturgicalColor: LiturgicalDisplayColor
  rank: string
  colorName?: string | null
  description?: string | null
  wordOfGodReference?: string | null
  wordOfGodOverride?: string | null
}

/**
 * API trả LiturgicalEventDto (eventDate, title, color, colorNameVi, level,
 * description, wordOfGodReference, wordOfGodOverride). Đổi tên trường ngay tại
 * biên để template chỉ làm việc với một hình dạng dữ liệu duy nhất.
 */
function mapDay(e: LiturgicalEventDto): LiturgicalDayDetail {
  return {
    date: e.eventDate,
    celebrationTitle: e.title,
    liturgicalColor: liturgicalDisplayColor(e.color),
    rank: e.level,
    colorName: e.colorNameVi || null,
    description: e.description ?? null,
    wordOfGodReference: e.wordOfGodReference ?? null,
    wordOfGodOverride: e.wordOfGodOverride ?? null
  }
}

function mapSummary(e: LiturgicalEventDto): LiturgicalDaySummary {
  return {
    date: e.eventDate,
    dayOfMonth: Number(e.eventDate.slice(8, 10)) || 1,
    celebrationTitle: e.title,
    liturgicalColor: liturgicalDisplayColor(e.color),
    isSunday: new Date(`${e.eventDate}T00:00:00`).getDay() === 0
  }
}

const now = new Date()
const selectedYear = ref(now.getFullYear())
const selectedMonth = ref(now.getMonth() + 1)
const todayLiturgical = ref<LiturgicalDayDetail | null>(null)
const monthDays = ref<LiturgicalDaySummary[]>([])
const activeDateDetail = ref<LiturgicalDayDetail | null>(null)

const loadingMonth = ref(false)
const loadingDetail = ref(false)

const errorToday = ref<ApiError | null>(null)
const errorMonth = ref<ApiError | null>(null)
const errorDetail = ref<ApiError | null>(null)

const COLOR_MAP: Record<string, { label: string, bg: string, text: string, border: string }> = {
  White: { label: 'Trắng', bg: 'bg-stone-100', text: 'text-stone-800', border: 'border-stone-300' },
  Red: { label: 'Đỏ', bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' },
  Green: { label: 'Xanh lá', bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
  Violet: { label: 'Tím', bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  Rose: { label: 'Hồng', bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300' },
  Gold: { label: 'Vàng kim', bg: 'bg-amber-100', text: 'text-amber-900', border: 'border-amber-400' }
}

async function fetchToday() {
  errorToday.value = null
  try {
    todayLiturgical.value = mapDay(await api.get<LiturgicalEventDto>('/public/liturgical/today'))
    if (!activeDateDetail.value) {
      activeDateDetail.value = todayLiturgical.value
    }
  } catch (e) {
    errorToday.value = e as ApiError
  }
}

async function fetchMonth() {
  loadingMonth.value = true
  errorMonth.value = null
  try {
    const res = await api.get<LiturgicalEventDto[]>(
      `/public/liturgical/month/${selectedYear.value}/${selectedMonth.value}`
    )
    monthDays.value = Array.isArray(res) ? res.map(mapSummary) : []
  } catch (e) {
    errorMonth.value = e as ApiError
  } finally {
    loadingMonth.value = false
  }
}

async function selectDate(dateStr: string) {
  loadingDetail.value = true
  errorDetail.value = null
  try {
    activeDateDetail.value = mapDay(await api.get<LiturgicalEventDto>(`/public/liturgical/date/${dateStr}`))
  } catch (e) {
    errorDetail.value = e as ApiError
  } finally {
    loadingDetail.value = false
  }
}

function prevMonth() {
  if (selectedMonth.value === 1) {
    selectedMonth.value = 12
    selectedYear.value--
  } else {
    selectedMonth.value--
  }
  fetchMonth()
}

function nextMonth() {
  if (selectedMonth.value === 12) {
    selectedMonth.value = 1
    selectedYear.value++
  } else {
    selectedMonth.value++
  }
  fetchMonth()
}

function goToToday() {
  selectedYear.value = now.getFullYear()
  selectedMonth.value = now.getMonth() + 1
  fetchMonth()
  if (todayLiturgical.value) {
    activeDateDetail.value = todayLiturgical.value
  } else {
    fetchToday()
  }
}

onMounted(() => {
  fetchToday()
  fetchMonth()
})
</script>

<template>
  <PortalShell>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <!-- Header -->
      <div class="border-b border-stone-200 pb-5">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1D3A73] text-[#ECC367]">
              <UIcon name="i-heroicons-calendar" class="h-6 w-6" />
            </div>
            <div>
              <h1 class="font-serif text-2xl font-bold text-stone-900">
                Lịch Phụng Vụ Công Giáo
              </h1>
              <p class="text-xs text-stone-600">
                Lịch các ngày lễ, màu phẩm phục phụng vụ và Lời Chúa mỗi ngày trong Giáo hội
              </p>
            </div>
          </div>

          <UButton
            variant="outline"
            color="primary"
            size="sm"
            icon="i-heroicons-clock"
            @click="goToToday"
          >
            Hôm nay
          </UButton>
        </div>
      </div>

      <ErrorState v-if="errorToday" :error="errorToday" />

      <!-- Phụng vụ hôm nay Banner -->
      <div
        v-if="todayLiturgical"
        class="rounded-xl border border-stone-200 bg-white p-6 shadow-sm border-l-4"
        :class="COLOR_MAP[todayLiturgical.liturgicalColor]?.border || 'border-l-amber-500'"
      >
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold uppercase tracking-wider text-stone-500">
                Hôm nay: {{ todayLiturgical.date }}
              </span>
              <span
                class="rounded-full px-2.5 py-0.5 text-xs font-medium border"
                :class="COLOR_MAP[todayLiturgical.liturgicalColor]?.bg + ' ' + COLOR_MAP[todayLiturgical.liturgicalColor]?.text"
              >
                Màu áo lễ: {{ COLOR_MAP[todayLiturgical.liturgicalColor]?.label || todayLiturgical.liturgicalColor }}
              </span>
              <span v-if="todayLiturgical.rank" class="text-xs text-stone-500 font-medium">
                • Bậc lễ: {{ todayLiturgical.rank }}
              </span>
            </div>
            <h2 class="font-serif text-2xl font-bold text-stone-900">
              {{ todayLiturgical.celebrationTitle }}
            </h2>
            <p v-if="todayLiturgical.colorName" class="text-xs text-stone-600">
              Phẩm phục: <strong class="text-stone-800">{{ todayLiturgical.colorName }}</strong>
            </p>
          </div>

          <UButton
            size="xs"
            variant="soft"
            color="primary"
            @click="selectDate(todayLiturgical.date)"
          >
            Xem bài đọc Kinh Thánh
          </UButton>
        </div>
      </div>

      <!-- Nội dung 2 cột: Lịch Tháng & Chi Tiết Ngày Đã Chọn -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Cột 1: Lịch tháng (lg:col-span-7) -->
        <div class="lg:col-span-7 rounded-xl border border-stone-200 bg-white p-5 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-stone-100 pb-3">
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="p-1.5 rounded-md hover:bg-stone-100 text-stone-600"
                aria-label="Tháng trước"
                @click="prevMonth"
              >
                <UIcon name="i-heroicons-chevron-left" class="h-5 w-5" />
              </button>
              <h2 class="font-serif text-lg font-bold text-stone-900">
                Tháng {{ selectedMonth }} / {{ selectedYear }}
              </h2>
              <button
                type="button"
                class="p-1.5 rounded-md hover:bg-stone-100 text-stone-600"
                aria-label="Tháng sau"
                @click="nextMonth"
              >
                <UIcon name="i-heroicons-chevron-right" class="h-5 w-5" />
              </button>
            </div>

            <div class="flex items-center gap-2 text-[11px] text-stone-500">
              <span class="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" title="Xanh" />
              <span class="inline-block h-2.5 w-2.5 rounded-full bg-stone-300" title="Trắng" />
              <span class="inline-block h-2.5 w-2.5 rounded-full bg-rose-500" title="Đỏ" />
              <span class="inline-block h-2.5 w-2.5 rounded-full bg-purple-500" title="Tím" />
            </div>
          </div>

          <ErrorState v-if="errorMonth" :error="errorMonth" />

          <div v-if="loadingMonth" class="py-12 text-center text-sm text-stone-500">
            Đang tải lịch tháng {{ selectedMonth }}...
          </div>

          <div v-else class="space-y-2">
            <div class="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-stone-500 pb-1 border-b border-stone-100">
              <div class="text-rose-600">CN</div>
              <div>T2</div>
              <div>T3</div>
              <div>T4</div>
              <div>T5</div>
              <div>T6</div>
              <div>T7</div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <button
                v-for="d in monthDays"
                :key="d.date"
                type="button"
                class="text-left rounded-lg p-2.5 border transition-all text-xs flex flex-col justify-between"
                :class="[
                  activeDateDetail?.date === d.date
                    ? 'border-[#1D3A73] bg-[#1D3A73]/5 ring-1 ring-[#1D3A73]'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                ]"
                @click="selectDate(d.date)"
              >
                <div class="flex items-center justify-between gap-1 w-full">
                  <span
                    class="font-bold text-sm"
                    :class="d.isSunday ? 'text-rose-600' : 'text-stone-900'"
                  >
                    {{ d.dayOfMonth || d.date.split('-')[2] }}
                  </span>
                  <span
                    class="rounded px-1.5 py-0.2 text-[10px] font-medium border"
                    :class="COLOR_MAP[d.liturgicalColor]?.bg + ' ' + COLOR_MAP[d.liturgicalColor]?.text"
                  >
                    {{ COLOR_MAP[d.liturgicalColor]?.label || d.liturgicalColor }}
                  </span>
                </div>
                <div class="font-medium text-stone-800 line-clamp-1 mt-1">
                  {{ d.celebrationTitle }}
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Cột 2: Chi tiết ngày đã chọn & Các bài đọc (lg:col-span-5) -->
        <div class="lg:col-span-5 rounded-xl border border-stone-200 bg-white p-5 shadow-sm space-y-4">
          <div class="border-b border-stone-100 pb-3">
            <h2 class="text-xs font-bold uppercase tracking-wider text-stone-500">
              Chi tiết ngày phụng vụ
            </h2>
            <div v-if="activeDateDetail" class="mt-1">
              <h3 class="font-serif text-xl font-bold text-stone-900">
                {{ activeDateDetail.celebrationTitle }}
              </h3>
              <p class="text-xs text-stone-500 mt-0.5">
                Ngày: <strong class="text-stone-800">{{ activeDateDetail.date }}</strong>
                <span v-if="activeDateDetail.rank"> • {{ activeDateDetail.rank }}</span>
              </p>
            </div>
          </div>

          <ErrorState v-if="errorDetail" :error="errorDetail" />

          <div v-if="loadingDetail" class="py-8 text-center text-sm text-stone-500">
            Đang tải thông tin chi tiết ngày lễ...
          </div>

          <div v-else-if="activeDateDetail" class="space-y-4">
            <div
              class="rounded-lg p-3 text-xs border"
              :class="COLOR_MAP[activeDateDetail.liturgicalColor]?.bg + ' ' + COLOR_MAP[activeDateDetail.liturgicalColor]?.border"
            >
              <div class="font-semibold text-stone-800">
                Phẩm phục: Màu {{ COLOR_MAP[activeDateDetail.liturgicalColor]?.label || activeDateDetail.liturgicalColor }}
              </div>
              <div v-if="activeDateDetail.description" class="text-stone-600 mt-1 leading-relaxed">
                {{ activeDateDetail.description }}
              </div>
            </div>

            <!-- Các bài đọc Lời Chúa -->
            <div class="space-y-3">
              <h3 class="text-xs font-bold uppercase tracking-wider text-[#1D3A73] flex items-center gap-1.5">
                <UIcon name="i-heroicons-book-open" class="h-4 w-4 text-[#A8812A]" />
                Lời Chúa trong ngày
              </h3>

              <div v-if="activeDateDetail.wordOfGodReference || activeDateDetail.wordOfGodOverride" class="space-y-2.5 text-xs">
                <div v-if="activeDateDetail.wordOfGodReference" class="p-2.5 rounded-lg bg-stone-50 border border-stone-100">
                  <div class="font-bold text-stone-700">Bài đọc:</div>
                  <div class="text-stone-900 mt-0.5">{{ activeDateDetail.wordOfGodReference }}</div>
                </div>

                <div v-if="activeDateDetail.wordOfGodOverride" class="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200">
                  <div class="font-bold text-[#A8812A]">Lời Chúa:</div>
                  <div class="text-stone-900 mt-0.5 font-medium whitespace-pre-line">{{ activeDateDetail.wordOfGodOverride }}</div>
                </div>
              </div>

              <div v-else class="text-xs text-stone-500 italic py-3 text-center">
                Chưa cập nhật Lời Chúa cho ngày này.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PortalShell>
</template>
