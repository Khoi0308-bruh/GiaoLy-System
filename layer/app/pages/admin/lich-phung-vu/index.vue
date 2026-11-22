<script setup lang="ts">
import { PERMISSIONS } from '../../../shared/permissions'
import type { ApiError } from '../../../composables/useApi'

definePageMeta({ layout: 'admin', permission: PERMISSIONS.Liturgical.View })

interface LiturgicalEventItem {
  id: string
  eventDate: string
  title: string
  color: string
  colorNameVi: string
  level: string
  description?: string | null
  isOverride: boolean
  wordOfGodOverride?: string | null
  wordOfGodReference?: string | null
}

const api = useApi()
const toast = useToast()
const { can } = usePermissions()

const currentDate = ref(new Date())
const events = ref<LiturgicalEventItem[]>([])
const loading = ref(true)
const error = ref<ApiError | null>(null)

// Modal Xem chi tiết ngày
const detailOpen = ref(false)
const selectedDayEvent = ref<LiturgicalEventItem | null>(null)
const selectedDateStr = ref<string>('')

// Modal Ghi đè
const overrideOpen = ref(false)
const savingOverride = ref(false)
const overrideForm = ref({
  date: '',
  title: '',
  color: 'Green',
  level: 'Thường',
  description: '',
  wordOfGodOverride: '',
  wordOfGodReference: ''
})

const liturgicalColors: { key: string, name: string, bgClass: string, textClass: string }[] = [
  { key: 'Green', name: 'Xanh lá (Mùa Thường Niên)', bgClass: 'bg-emerald-600', textClass: 'text-emerald-700' },
  { key: 'White', name: 'Trắng (Phục Sinh, Giáng Sinh, Các Thánh)', bgClass: 'bg-stone-100 border border-stone-300', textClass: 'text-stone-800' },
  { key: 'Red', name: 'Đỏ (Hiện Xuống, Tử Đạo, Khổ Nạn)', bgClass: 'bg-red-600', textClass: 'text-red-700' },
  { key: 'Violet', name: 'Tím (Mùa Vọng, Mùa Chay, Cầu Hồn)', bgClass: 'bg-purple-700', textClass: 'text-purple-700' },
  { key: 'Rose', name: 'Hồng (Chúa Nhật Vui, Chúa Nhật Hãy Vui Lên)', bgClass: 'bg-rose-500', textClass: 'text-rose-600' },
  { key: 'Gold', name: 'Vàng Hoàng Kim (Đại Lễ)', bgClass: 'bg-amber-400', textClass: 'text-amber-800' }
]

const levelOptions = ['Trọng', 'Kính', 'Nhớ', 'Thường']

async function loadData() {
  loading.value = true
  error.value = null
  try {
    const res = await api.get<LiturgicalEventItem[]>('/liturgical')
    events.value = res || []
  } catch (e) {
    error.value = e as ApiError
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())

function prevMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

function nextMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

function goToday() {
  currentDate.value = new Date()
}

// Tạo ma trận lịch tháng
const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value

  const firstDayOfMonth = new Date(year, month, 1).getDay() // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days: {
    date: Date
    dateStr: string
    dayNumber: number
    isCurrentMonth: boolean
    isToday: boolean
    event?: LiturgicalEventItem
  }[] = []

  const todayStr = new Date().toISOString().substring(0, 10)

  // Ngày tháng trước lấp đầy tuần đầu
  const prevMonthDays = new Date(year, month, 0).getDate()
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthDays - i)
    const dStr = d.toISOString().substring(0, 10)
    days.push({
      date: d,
      dateStr: dStr,
      dayNumber: prevMonthDays - i,
      isCurrentMonth: false,
      isToday: dStr === todayStr,
      event: events.value.find(e => e.eventDate === dStr)
    })
  }

  // Các ngày trong tháng này
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i)
    // ISO date format YYYY-MM-DD
    const monthStr = String(month + 1).padStart(2, '0')
    const dayStr = String(i).padStart(2, '0')
    const dStr = `${year}-${monthStr}-${dayStr}`
    days.push({
      date: d,
      dateStr: dStr,
      dayNumber: i,
      isCurrentMonth: true,
      isToday: dStr === todayStr,
      event: events.value.find(e => e.eventDate === dStr)
    })
  }

  // Các ngày tháng sau lấp đầy tuần cuối
  const totalSlots = Math.ceil(days.length / 7) * 7
  const remaining = totalSlots - days.length
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i)
    const dStr = d.toISOString().substring(0, 10)
    days.push({
      date: d,
      dateStr: dStr,
      dayNumber: i,
      isCurrentMonth: false,
      isToday: dStr === todayStr,
      event: events.value.find(e => e.eventDate === dStr)
    })
  }

  return days
})

function getColorStyle(colorKey?: string) {
  const found = liturgicalColors.find(c => c.key.toLowerCase() === (colorKey || '').toLowerCase())
  return found ?? liturgicalColors[0] ?? { key: '', bgClass: 'bg-stone-200', textClass: '' }
}

function openDayDetail(day: { dateStr: string, event?: LiturgicalEventItem }) {
  selectedDateStr.value = day.dateStr
  selectedDayEvent.value = day.event || null
  detailOpen.value = true
}

function openOverrideModal(dateStr: string, current?: LiturgicalEventItem | null) {
  overrideForm.value = {
    date: dateStr,
    title: current?.title || '',
    color: current?.color || 'Green',
    level: current?.level || 'Thường',
    description: current?.description || '',
    wordOfGodOverride: current?.wordOfGodOverride || '',
    wordOfGodReference: current?.wordOfGodReference || ''
  }
  overrideOpen.value = true
}

async function handleSaveOverride() {
  if (!overrideForm.value.title.trim()) {
    toast.add({ title: 'Vui lòng nhập tên thánh lễ hoặc ngày phụng vụ', color: 'error' })
    return
  }
  savingOverride.value = true
  try {
    await api.put(`/liturgical/${overrideForm.value.date}`, {
      title: overrideForm.value.title.trim(),
      color: overrideForm.value.color,
      level: overrideForm.value.level,
      description: overrideForm.value.description?.trim() || null,
      wordOfGodOverride: overrideForm.value.wordOfGodOverride?.trim() || null,
      wordOfGodReference: overrideForm.value.wordOfGodReference?.trim() || null
    })
    toast.add({ title: `Đã ghi đè lịch phụng vụ ngày ${overrideForm.value.date}`, color: 'success' })
    overrideOpen.value = false
    detailOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể ghi đè lịch phụng vụ', description: err.detail || err.message, color: 'error' })
  } finally {
    savingOverride.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Lịch Phụng Vụ Giáo Xứ"
      subtitle="Theo dõi chu kỳ năm phụng vụ, màu áo lễ và ghi đè ngày lễ trọng đặc biệt của giáo xứ"
    >
      <template #actions>
        <div class="flex items-center gap-2">
          <UButton variant="outline" icon="i-lucide-calendar" @click="goToday">
            Hôm nay
          </UButton>
        </div>
      </template>
    </PageHeader>

    <ErrorState v-if="error" :error="error" @retry="loadData" />

    <!-- Thanh chuyển tháng -->
    <div class="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div class="flex items-center gap-3">
        <h3 class="font-display text-xl font-bold text-stone-900 dark:text-stone-100">
          Tháng {{ currentMonth + 1 }}, Năm {{ currentYear }}
        </h3>
        <span class="rounded bg-vatican-50 px-2 py-0.5 text-xs font-semibold text-vatican-800 dark:bg-vatican-950 dark:text-vatican-300">
          Màu Phụng Vụ Giáo Hội
        </span>
      </div>

      <div class="flex items-center gap-1">
        <UButton
          size="sm"
          variant="ghost"
          icon="i-lucide-chevron-left"
          @click="prevMonth"
        />
        <UButton
          size="sm"
          variant="ghost"
          icon="i-lucide-chevron-right"
          @click="nextMonth"
        />
      </div>
    </div>

    <!-- Ma trận Lịch tháng 7 cột -->
    <div class="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden dark:border-stone-800 dark:bg-stone-900">
      <!-- Tiêu đề 7 ngày trong tuần -->
      <div class="grid grid-cols-7 border-b border-stone-200 bg-stone-50 text-center text-xs font-bold uppercase text-stone-600 dark:border-stone-800 dark:bg-stone-800/60 dark:text-stone-300">
        <div class="p-3 text-red-600 dark:text-red-400">Chúa Nhật</div>
        <div class="p-3">Thứ Hai</div>
        <div class="p-3">Thứ Ba</div>
        <div class="p-3">Thứ Tư</div>
        <div class="p-3">Thứ Năm</div>
        <div class="p-3">Thứ Sáu</div>
        <div class="p-3">Thứ Bảy</div>
      </div>

      <!-- Lưới ngày -->
      <div class="grid grid-cols-7 divide-x divide-y divide-stone-100 dark:divide-stone-800">
        <div
          v-for="day in calendarDays"
          :key="day.dateStr"
          class="min-h-[105px] p-2 transition cursor-pointer hover:bg-stone-50/80 dark:hover:bg-stone-800/40 relative flex flex-col justify-between"
          :class="[
            !day.isCurrentMonth ? 'opacity-30 bg-stone-50/30 dark:bg-stone-900/30' : '',
            day.isToday ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''
          ]"
          @click="openDayDetail(day)"
        >
          <div>
            <div class="flex items-center justify-between">
              <span
                class="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                :class="day.isToday ? 'bg-marian-600 text-white shadow-sm' : 'text-stone-800 dark:text-stone-200'"
              >
                {{ day.dayNumber }}
              </span>

              <!-- Điểm tròn màu áo lễ -->
              <span
                v-if="day.event"
                class="h-3 w-3 rounded-full shadow-xs"
                :class="getColorStyle(day.event?.color).bgClass"
                :title="`Áo lễ: ${day.event?.colorNameVi || day.event?.color}`"
              />
            </div>

            <!-- Tên thánh lễ -->
            <div v-if="day.event" class="mt-1">
              <p class="line-clamp-2 text-[11px] font-medium leading-snug text-stone-800 dark:text-stone-200">
                <span v-if="day.event.isOverride" class="text-amber-600 dark:text-amber-400 font-bold mr-0.5">✦</span>
                {{ day.event.title }}
              </p>
            </div>
          </div>

          <!-- Bậc lễ badge nhỏ -->
          <div v-if="day.event" class="mt-1 flex items-center justify-between text-[10px]">
            <span
              class="rounded px-1 py-0.2 font-semibold"
              :class="day.event.level === 'Trọng' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' : 'text-stone-400'"
            >
              {{ day.event.level }}
            </span>
            <span v-if="day.event.isOverride" class="text-[9px] font-bold text-amber-600 dark:text-amber-400">
              Giáo xứ
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Chi Tiết Ngày Phụng Vụ -->
    <UModal
      v-model:open="detailOpen"
      :title="`Phụng vụ ngày ${selectedDateStr}`"
    >
      <template #body>
        <div class="space-y-4">
          <div v-if="selectedDayEvent" class="space-y-3">
            <div class="flex items-center gap-2">
              <span class="h-4 w-4 rounded-full" :class="getColorStyle(selectedDayEvent.color).bgClass" />
              <h4 class="font-display text-base font-bold text-stone-900 dark:text-stone-100">
                {{ selectedDayEvent.title }}
              </h4>
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="rounded-lg bg-stone-50 p-2 dark:bg-stone-800">
                <span class="text-stone-400">Màu phụng vụ:</span>
                <p class="font-semibold">{{ selectedDayEvent.colorNameVi || selectedDayEvent.color }}</p>
              </div>
              <div class="rounded-lg bg-stone-50 p-2 dark:bg-stone-800">
                <span class="text-stone-400">Bậc lễ:</span>
                <p class="font-semibold">{{ selectedDayEvent.level }}</p>
              </div>
            </div>

            <div v-if="selectedDayEvent.wordOfGodReference || selectedDayEvent.wordOfGodOverride" class="rounded-xl border border-stone-200 p-3 text-xs dark:border-stone-800">
              <span class="font-semibold uppercase text-stone-500">Lời Chúa trong ngày:</span>
              <p class="mt-1 font-medium text-marian-700 dark:text-marian-300">
                {{ selectedDayEvent.wordOfGodReference }}
              </p>
              <p v-if="selectedDayEvent.wordOfGodOverride" class="mt-1 italic text-stone-600 dark:text-stone-400">
                "{{ selectedDayEvent.wordOfGodOverride }}"
              </p>
            </div>

            <div v-if="selectedDayEvent.description" class="text-xs text-stone-600 dark:text-stone-400">
              <span class="font-semibold uppercase text-stone-500">Ý nghĩa phụng vụ:</span>
              <p class="mt-1">{{ selectedDayEvent.description }}</p>
            </div>

            <div v-if="selectedDayEvent.isOverride" class="rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-200">
              ✦ Ngày này được tùy biến riêng theo lịch của giáo xứ.
            </div>
          </div>

          <div v-else class="text-sm text-stone-500 text-center py-4">
            Chưa có thông tin phụng vụ đặc biệt cho ngày này.
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex items-center justify-between w-full">
          <UButton
            v-if="can(PERMISSIONS.Liturgical.Update)"
            color="secondary"
            icon="i-lucide-pencil"
            @click="openOverrideModal(selectedDateStr, selectedDayEvent)"
          >
            Ghi đè ngày này
          </UButton>
          <UButton variant="outline" @click="detailOpen = false">Đóng</UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Ghi Đè Phụng Vụ Một Ngày -->
    <UModal
      v-model:open="overrideOpen"
      :title="`Ghi đè phụng vụ ngày ${overrideForm.date}`"
      description="Tùy biến ngày lễ bổn mạng giáo xứ, tuần chầu lượt hoặc lễ tang/cưới đặc biệt"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Tên thánh lễ / Ngày phụng vụ <span class="text-red-500">*</span>
            </label>
            <UInput v-model="overrideForm.title" placeholder="Ví dụ: Lễ Bổn Mạng Giáo Xứ, Kỷ niệm Cung hiến..." />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Màu áo lễ
              </label>
              <select
                v-model="overrideForm.color"
                class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              >
                <option v-for="c in liturgicalColors" :key="c.key" :value="c.key">
                  {{ c.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Bậc thánh lễ
              </label>
              <select
                v-model="overrideForm.level"
                class="w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              >
                <option v-for="lvl in levelOptions" :key="lvl" :value="lvl">
                  Lễ {{ lvl }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Tham chiếu Lời Chúa (Bài đọc)
            </label>
            <UInput v-model="overrideForm.wordOfGodReference" placeholder="Ví dụ: Kn 3,1-9; Tv 22; Ga 14,1-6..." />
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Câu Lời Chúa tâm niệm trong ngày
            </label>
            <UInput v-model="overrideForm.wordOfGodOverride" placeholder="Ví dụ: 'Thầy là đường, là sự thật và là sự sống'..." />
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Mô tả / Ý nghĩa thánh lễ
            </label>
            <UTextarea v-model="overrideForm.description" placeholder="Ý chỉ cầu nguyện, thông tin bổ sung..." :rows="2" />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="overrideOpen = false">Hủy</UButton>
          <UButton
            color="primary"
            :loading="savingOverride"
            :disabled="!overrideForm.title.trim()"
            @click="handleSaveOverride"
          >
            Lưu ghi đè
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
