<script setup lang="ts">
import { ApiError } from '../../composables/useApi'
import { liturgicalDisplayColor, type LiturgicalDisplayColor, type LiturgicalEventDto } from '../../composables/useLiturgical'

definePageMeta({ public: true })
useHead({ title: 'Lịch Phụng Vụ – Thiếu Nhi Thánh Thể' })

const api = useApi()

const now = new Date()
const selectedYear = ref(now.getFullYear())
const selectedMonth = ref(now.getMonth() + 1)

const days = ref<LiturgicalEventDto[]>([])
const today = ref<LiturgicalEventDto | null>(null)
const selected = ref<LiturgicalEventDto | null>(null)
const loading = ref(false)
const error = ref<ApiError | null>(null)

/** Bảng màu phẩm phục dùng chung cho ô lịch, huy hiệu và chi tiết. */
interface ColorStyle { label: string, cell: string, dot: string, badge: string, accent: string }

const COLOR_MAP: Record<LiturgicalDisplayColor, ColorStyle> = {
  Violet: {
    label: 'Tím',
    cell: 'bg-purple-50 border-purple-200 hover:border-purple-400',
    dot: 'bg-purple-500',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    accent: '#7c3aed'
  },
  White: {
    label: 'Trắng',
    cell: 'bg-stone-50 border-stone-200 hover:border-stone-400',
    dot: 'bg-stone-300',
    badge: 'bg-stone-100 text-stone-700 border-stone-300',
    accent: '#d6d3d1'
  },
  Red: {
    label: 'Đỏ',
    cell: 'bg-rose-50 border-rose-200 hover:border-rose-400',
    dot: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    accent: '#e11d48'
  },
  Green: {
    label: 'Xanh lá',
    cell: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    accent: '#059669'
  },
  Rose: {
    label: 'Hồng',
    cell: 'bg-pink-50 border-pink-200 hover:border-pink-400',
    dot: 'bg-pink-500',
    badge: 'bg-pink-50 text-pink-700 border-pink-200',
    accent: '#db2777'
  },
  Gold: {
    label: 'Vàng kim',
    cell: 'bg-amber-50 border-amber-200 hover:border-amber-400',
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-800 border-amber-300',
    accent: '#d97706'
  }
}

const colorOf = (color?: string | null) => COLOR_MAP[liturgicalDisplayColor(color)]

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.slice(0, 10).split('-').map(Number)
  if (!y || !m || !d) return dateStr
  return new Date(y, m - 1, d).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function isoToday() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const todayIso = isoToday()

const isToday = (date?: string | null) => Boolean(date) && date === todayIso

const isSunday = (dateStr: string) => {
  const [y, m, d] = dateStr.slice(0, 10).split('-').map(Number)
  if (!y || !m || !d) return false
  return new Date(y, m - 1, d).getDay() === 0
}

/** Các ô trống đầu tháng để ngày 1 rơi đúng cột thứ (Thứ Hai là cột đầu). */
const leadingBlanks = computed(() => {
  const first = new Date(selectedYear.value, selectedMonth.value - 1, 1).getDay()
  return (first + 6) % 7
})

const dayOfMonth = (dateStr: string) => Number(dateStr.slice(8, 10))

const monthLabel = computed(() =>
  new Date(selectedYear.value, selectedMonth.value - 1, 1).toLocaleDateString('vi-VN', {
    month: 'long',
    year: 'numeric'
  })
)

const highlights = computed(() =>
  days.value.filter(d => /lễ trọng|lễ$/i.test(d.level) || d.isOverride)
)

const legend = [
  { label: 'Xanh lá', dot: 'bg-emerald-500' },
  { label: 'Trắng', dot: 'bg-stone-300' },
  { label: 'Đỏ', dot: 'bg-rose-500' },
  { label: 'Tím', dot: 'bg-purple-500' },
  { label: 'Hồng', dot: 'bg-pink-500' }
]

async function fetchToday() {
  try {
    today.value = await api.get<LiturgicalEventDto>('/public/liturgical/today')
  } catch {
    today.value = null
  }
}

async function fetchMonth() {
  loading.value = true
  error.value = null
  try {
    const res = await api.get<LiturgicalEventDto[]>(
      `/public/liturgical/calendar/${selectedYear.value}/${selectedMonth.value}`
    )
    days.value = Array.isArray(res) ? res : []

    // Giữ ngày đang chọn nếu còn trong tháng, nếu không chọn hôm nay hoặc ngày đầu tháng.
    const keep = selected.value?.eventDate
    const sameMonth = keep ? days.value.find(d => d.eventDate === keep) : undefined
    selected.value = sameMonth
      ?? days.value.find(d => d.eventDate === todayIso)
      ?? days.value[0]
      ?? null
  } catch (e) {
    error.value = e as ApiError
    days.value = []
    selected.value = null
  } finally {
    loading.value = false
  }
}

function changeMonth(step: number) {
  const d = new Date(selectedYear.value, selectedMonth.value - 1 + step, 1)
  selectedYear.value = d.getFullYear()
  selectedMonth.value = d.getMonth() + 1
  fetchMonth()
}

function goToToday() {
  selectedYear.value = now.getFullYear()
  selectedMonth.value = now.getMonth() + 1
  fetchMonth()
}

function selectDay(day: LiturgicalEventDto) {
  selected.value = day
}

onMounted(() => {
  fetchToday()
  fetchMonth()
})
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <header class="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-5">
      <div class="flex items-center gap-3">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1D3A73] text-[#ECC367]">
          <UIcon name="i-heroicons-calendar-days" class="h-6 w-6" />
        </div>
        <div>
          <h1 class="font-serif text-2xl font-bold text-stone-900">
            Lịch Phụng Vụ
          </h1>
          <p class="text-xs text-stone-600">
            Mùa phụng vụ, màu phẩm phục và Lời Chúa theo từng ngày
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
        Về hôm nay
      </UButton>
    </header>

    <!-- Phụng vụ hôm nay -->
    <section
      v-if="today"
      class="relative overflow-hidden rounded-2xl border p-5 sm:p-6"
      :class="colorOf(today.color).cell"
    >
      <div
        class="absolute inset-y-0 left-0 w-1.5"
        :style="{ backgroundColor: colorOf(today.color).accent }"
      />
      <div class="flex flex-wrap items-start justify-between gap-4 pl-2">
        <div class="space-y-1">
          <p class="text-[11px] font-bold uppercase tracking-widest text-stone-500">
            Phụng vụ hôm nay · {{ formatDate(today.eventDate) }}
          </p>
          <h2 class="font-serif text-xl font-bold text-stone-900 sm:text-2xl">
            {{ today.title }}
          </h2>
          <div class="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
            <span class="rounded-full border px-2 py-0.5 font-semibold" :class="colorOf(today.color).badge">
              Màu {{ colorOf(today.color).label }}
            </span>
            <span class="rounded-full border border-stone-200 bg-white/70 px-2 py-0.5 font-medium text-stone-600">
              {{ today.level }}
            </span>
          </div>
        </div>

        <div v-if="today.wordOfGodReference || today.wordOfGodOverride" class="max-w-md rounded-xl bg-white/80 p-3 text-xs">
          <p v-if="today.wordOfGodReference" class="font-semibold text-stone-700">
            {{ today.wordOfGodReference }}
          </p>
          <p v-if="today.wordOfGodOverride" class="mt-1 whitespace-pre-line text-stone-700 italic">
            {{ today.wordOfGodOverride }}
          </p>
        </div>
      </div>
    </section>

    <ErrorState v-if="error" :error="error" />

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Lịch tháng -->
      <section class="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5 lg:col-span-7">
        <div class="mb-3 flex items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <UButton
            variant="ghost"
            color="neutral"
            size="sm"
            icon="i-heroicons-chevron-left"
            aria-label="Tháng trước"
            @click="changeMonth(-1)"
          />
          <h2 class="font-serif text-base font-bold capitalize text-stone-900 sm:text-lg">
            {{ monthLabel }}
          </h2>
          <UButton
            variant="ghost"
            color="neutral"
            size="sm"
            icon="i-heroicons-chevron-right"
            aria-label="Tháng sau"
            @click="changeMonth(1)"
          />
        </div>

        <div class="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-stone-400">
          <div>T2</div>
          <div>T3</div>
          <div>T4</div>
          <div>T5</div>
          <div>T6</div>
          <div>T7</div>
          <div class="text-rose-500">
            CN
          </div>
        </div>

        <div v-if="loading" class="grid grid-cols-7 gap-1 pt-1">
          <div v-for="n in 35" :key="n" class="h-16 animate-pulse rounded-lg bg-stone-100" />
        </div>

        <div v-else class="grid grid-cols-7 gap-1 pt-1">
          <div v-for="n in leadingBlanks" :key="`blank-${n}`" class="h-16 rounded-lg bg-transparent" />

          <button
            v-for="day in days"
            :key="day.eventDate"
            type="button"
            class="flex h-16 flex-col items-start justify-between rounded-lg border p-1.5 text-left transition-all"
            :class="[
              colorOf(day.color).cell,
              isSunday(day.eventDate) ? 'ring-1 ring-rose-200/70' : '',
              selected?.eventDate === day.eventDate ? 'ring-2 ring-[#1D3A73]' : '',
              isToday(day.eventDate) ? 'ring-2 ring-[#A8812A]' : ''
            ]"
            :title="day.title"
            @click="selectDay(day)"
          >
            <span class="flex w-full items-center justify-between">
              <span
                class="text-sm font-bold tabular-nums"
                :class="isSunday(day.eventDate) ? 'text-rose-600' : 'text-stone-800'"
              >
                {{ dayOfMonth(day.eventDate) }}
              </span>
              <span class="size-2 rounded-full" :class="colorOf(day.color).dot" />
            </span>
            <span class="line-clamp-2 text-[10px] font-medium leading-tight text-stone-600">
              {{ day.level === 'Thường' ? '' : day.title }}
            </span>
          </button>
        </div>

        <!-- Chú thích màu -->
        <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-stone-100 pt-3 text-[11px] text-stone-500">
          <span
            v-for="entry in legend"
            :key="entry.label"
            class="inline-flex items-center gap-1.5"
          >
            <span class="size-2.5 rounded-full" :class="entry.dot" />
            {{ entry.label }}
          </span>
          <span class="inline-flex items-center gap-1.5">
            <span class="size-2.5 rounded-full ring-2 ring-[#A8812A]" /> Hôm nay
          </span>
        </div>
      </section>

      <!-- Chi tiết ngày -->
      <section class="space-y-5 lg:col-span-5">
        <div class="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p class="text-[11px] font-bold uppercase tracking-widest text-stone-400">
            Chi tiết ngày
          </p>

          <div v-if="selected" class="mt-2 space-y-3">
            <h2 class="font-serif text-xl font-bold leading-snug text-stone-900">
              {{ selected.title }}
            </h2>
            <p class="text-xs text-stone-500">
              {{ formatDate(selected.eventDate) }}
            </p>

            <div class="flex flex-wrap gap-2 text-[11px]">
              <span class="rounded-full border px-2 py-0.5 font-semibold" :class="colorOf(selected.color).badge">
                Màu {{ colorOf(selected.color).label }}
              </span>
              <span class="rounded-full border border-stone-200 px-2 py-0.5 text-stone-600">
                {{ selected.level }}
              </span>
              <span v-if="selected.isOverride" class="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-amber-700">
                Ghi đè của giáo xứ
              </span>
            </div>

            <p v-if="selected.description" class="rounded-lg bg-stone-50 p-3 text-xs leading-relaxed text-stone-700">
              {{ selected.description }}
            </p>

            <div class="space-y-2 border-t border-stone-100 pt-3">
              <h3 class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1D3A73]">
                <UIcon name="i-heroicons-book-open" class="h-4 w-4 text-[#A8812A]" />
                Lời Chúa trong ngày
              </h3>

              <div v-if="selected.wordOfGodReference || selected.wordOfGodOverride" class="space-y-2 text-xs">
                <p v-if="selected.wordOfGodReference" class="rounded-lg bg-stone-50 p-2.5 font-semibold text-stone-700">
                  {{ selected.wordOfGodReference }}
                </p>
                <p v-if="selected.wordOfGodOverride" class="whitespace-pre-line rounded-lg border border-amber-200 bg-amber-50/70 p-2.5 text-stone-800">
                  {{ selected.wordOfGodOverride }}
                </p>
              </div>
              <p v-else class="text-xs italic text-stone-400">
                Chưa cập nhật Lời Chúa cho ngày này.
              </p>
            </div>
          </div>

          <p v-else class="mt-3 text-sm text-stone-500">
            Chọn một ngày trên lịch để xem chi tiết.
          </p>
        </div>

        <!-- Ngày lễ trong tháng -->
        <div class="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 class="text-[11px] font-bold uppercase tracking-widest text-stone-400">
            Ngày lễ trong tháng
          </h3>

          <ul v-if="highlights.length" class="mt-3 space-y-2">
            <li v-for="day in highlights" :key="day.eventDate">
              <button
                type="button"
                class="flex w-full items-start gap-3 rounded-lg p-2 text-left transition-colors hover:bg-stone-50"
                @click="selectDay(day)"
              >
                <span class="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg text-xs font-bold text-white" :style="{ backgroundColor: colorOf(day.color).accent }">
                  {{ dayOfMonth(day.eventDate) }}
                </span>
                <span class="min-w-0">
                  <span class="block truncate text-xs font-semibold text-stone-800">{{ day.title }}</span>
                  <span class="block text-[11px] text-stone-500">{{ day.level }} · Màu {{ colorOf(day.color).label }}</span>
                </span>
              </button>
            </li>
          </ul>
          <p v-else class="mt-3 text-xs text-stone-400">
            Tháng này không có lễ trọng riêng.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>
