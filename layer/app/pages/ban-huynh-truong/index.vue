<script setup lang="ts">
import { ApiError } from '../../composables/useApi'

definePageMeta({ public: true })

const api = useApi()

interface PublicLeader {
  id: string
  holyName?: string | null
  fullName: string
  position: string
  level?: number
  term?: string | null
  branchId?: number | null
  branchName?: string | null
}

const leaders = ref<PublicLeader[]>([])
const loading = ref(false)
const error = ref<ApiError | null>(null)
const selectedDivision = ref('all')

async function fetchLeaders() {
  loading.value = true
  error.value = null
  try {
    const res = await api.get<{ items?: PublicLeader[], data?: PublicLeader[] } | PublicLeader[]>('/public/leaders')
    if (Array.isArray(res)) {
      leaders.value = res
    } else if (res && Array.isArray(res.items)) {
      leaders.value = res.items
    } else if (res && Array.isArray(res.data)) {
      leaders.value = res.data
    } else {
      leaders.value = []
    }
  } catch (e) {
    error.value = e as ApiError
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLeaders()
})

const divisions = computed(() => {
  const set = new Set<string>()
  leaders.value.forEach(l => {
    if (l.branchName) set.add(l.branchName)
  })
  return ['all', ...Array.from(set)]
})

const filteredLeaders = computed(() => {
  if (selectedDivision.value === 'all') return leaders.value
  return leaders.value.filter(l => l.branchName === selectedDivision.value)
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
              <UIcon name="i-heroicons-user-group" class="h-6 w-6" />
            </div>
            <div>
              <h1 class="font-serif text-2xl font-bold text-stone-900">
                Ban Huynh Trưởng & Giáo Lý Viên
              </h1>
              <p class="text-xs text-stone-600">
                Đội ngũ phụ trách, đồng hành và dìu dắt các em thiếu nhi trong đời sống đức tin
              </p>
            </div>
          </div>

          <!-- Bộ lọc phân đoàn -->
          <div class="flex items-center gap-2">
            <span class="text-xs text-stone-500 font-medium">Phân đoàn:</span>
            <USelect
              v-model="selectedDivision"
              :items="divisions.map(d => ({ label: d === 'all' ? 'Tất cả các ngành' : d, value: d }))"
              size="sm"
            />
          </div>
        </div>
      </div>

      <ErrorState v-if="error" :error="error" />

      <div v-if="loading" class="py-16 text-center text-sm text-stone-500">
        Đang tải danh sách huynh trưởng...
      </div>

      <EmptyState
        v-else-if="filteredLeaders.length === 0"
        title="Chưa có dữ liệu huynh trưởng"
        description="Hiện tại danh sách huynh trưởng đang được cập nhật."
        icon="i-heroicons-user-group"
      />

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        <div
          v-for="leader in filteredLeaders"
          :key="leader.id"
          class="rounded-xl border border-stone-200 bg-white p-5 shadow-xs text-center flex flex-col items-center justify-between hover:shadow-sm transition-shadow"
        >
          <div class="space-y-3 flex flex-col items-center">
            <!-- Avatar -->
            <div class="h-20 w-20 rounded-full overflow-hidden bg-stone-100 border-2 border-amber-200/80 shadow-xs flex items-center justify-center">
              <div class="font-serif font-bold text-xl text-[#1D3A73]">
                {{ leader.fullName.charAt(0) }}
              </div>
            </div>

            <div class="space-y-0.5">
              <div v-if="leader.holyName" class="text-xs font-semibold text-[#A8812A]">
                {{ leader.holyName }}
              </div>
              <h2 class="font-serif text-base font-bold text-stone-900">
                {{ leader.fullName }}
              </h2>
              <div class="text-xs font-medium text-[#1D3A73]">
                {{ leader.position }}
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-stone-100 w-full flex items-center justify-center gap-2">
            <span v-if="leader.branchName" class="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600">
              {{ leader.branchName }}
            </span>
            <span v-if="leader.term" class="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-[#A8812A]">
              {{ leader.term }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </PortalShell>
</template>
