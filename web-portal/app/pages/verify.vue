<template>
  <div layout="default">
    <!-- Header -->
    <section class="relative py-14 overflow-hidden bg-gradient-to-br from-tntt-gold-600 via-tntt-gold-500 to-tntt-gold-700 text-white">
      <div class="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-xs font-bold uppercase tracking-widest text-yellow-100 mb-2">
          Học Vụ Giáo Lý
        </p>
        <h1 class="font-serif font-bold text-3xl md:text-4xl mb-3">
          Tra Cứu Điểm Giáo Lý
        </h1>
        <p class="text-yellow-100 max-w-md mx-auto text-sm">
          Đoàn sinh và phụ huynh nhập họ tên hoặc mã đoàn sinh để xem điểm và thông tin học vụ.
        </p>
      </div>
    </section>

    <!-- Search Box -->
    <section class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
      <div class="glass-card p-6 animate-fade-in-up">
        <form
          id="verify-search-form"
          class="flex gap-3"
          @submit.prevent="search"
        >
          <UInput
            id="verify-search-input"
            v-model="query"
            size="lg"
            placeholder="Nhập họ tên hoặc mã đoàn sinh..."
            class="flex-1"
            :disabled="loading"
            leading-icon="i-heroicons-magnifying-glass"
          />
          <UButton
            id="verify-search-btn"
            type="submit"
            size="lg"
            :loading="loading"
            color="warning"
            class="font-bold px-6"
          >
            Tìm kiếm
          </UButton>
        </form>
        <p class="text-xs text-stone-400 mt-3 text-center">
          Thông tin chỉ dành cho mục đích tra cứu học vụ nội bộ sứ đoàn.
        </p>
      </div>
    </section>

    <!-- Results -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Loading -->
      <div
        v-if="loading"
        class="space-y-4"
      >
        <div
          v-for="n in 3"
          :key="n"
          class="h-20 bg-stone-100 dark:bg-stone-800 rounded-2xl animate-pulse"
        />
      </div>

      <!-- Results -->
      <div v-else-if="results.length">
        <p class="text-sm text-stone-500 dark:text-stone-400 mb-5">
          Tìm thấy <strong class="text-stone-800 dark:text-white">{{ results.length }}</strong> kết quả cho "<em>{{ lastQuery }}</em>"
        </p>

        <div class="space-y-4">
          <div
            v-for="(item, i) in results"
            :key="item.studentId"
            :class="['glass-card p-5 animate-fade-in-up']"
            :style="{ animationDelay: `${i * 0.06}s` }"
          >
            <div class="flex items-start gap-4">
              <!-- Avatar / Icon -->
              <div :class="[branchColor(item.branch), 'rounded-xl p-3 shrink-0']">
                <UIcon
                  name="i-heroicons-academic-cap"
                  class="w-6 h-6"
                />
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  <h2 class="font-bold text-stone-800 dark:text-white">
                    {{ item.studentName }}
                  </h2>
                  <UBadge
                    :color="branchBadgeColor(item.branch)"
                    variant="soft"
                    size="xs"
                  >
                    {{ item.branch }}
                  </UBadge>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-1.5 text-sm">
                  <div>
                    <p class="text-[10px] text-stone-400 uppercase tracking-wider">
                      Lớp
                    </p>
                    <p class="font-semibold text-stone-700 dark:text-stone-300">
                      {{ item.className || '—' }}
                    </p>
                  </div>
                  <div>
                    <p class="text-[10px] text-stone-400 uppercase tracking-wider">
                      Niên khóa
                    </p>
                    <p class="font-semibold text-stone-700 dark:text-stone-300">
                      {{ item.academicYear || '—' }}
                    </p>
                  </div>
                  <div>
                    <p class="text-[10px] text-stone-400 uppercase tracking-wider">
                      Điểm Giáo Lý
                    </p>
                    <p :class="['font-black text-lg', gradeColor(item.averageGrade)]">
                      {{ item.averageGrade !== null ? item.averageGrade.toFixed(1) : '—' }}
                    </p>
                  </div>
                  <div>
                    <p class="text-[10px] text-stone-400 uppercase tracking-wider">
                      Hạnh Kiểm
                    </p>
                    <p class="font-semibold text-stone-700 dark:text-stone-300">
                      {{ item.conduct || '—' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Not found -->
      <div
        v-else-if="searched && !results.length"
        class="text-center py-16 animate-fade-in"
      >
        <UIcon
          name="i-heroicons-face-frown"
          class="w-16 h-16 mx-auto mb-4 text-stone-300 dark:text-stone-600"
        />
        <p class="font-bold text-stone-600 dark:text-stone-400 text-lg">
          Không tìm thấy kết quả
        </p>
        <p class="text-stone-400 text-sm mt-2 max-w-sm mx-auto">
          Vui lòng kiểm tra lại họ tên. Nếu vẫn không tìm thấy, hãy liên hệ thư ký sứ đoàn.
        </p>
      </div>

      <!-- Initial state -->
      <div
        v-else
        class="text-center py-16 text-stone-300 dark:text-stone-700 animate-fade-in"
      >
        <UIcon
          name="i-heroicons-magnifying-glass"
          class="w-16 h-16 mx-auto mb-4"
        />
        <p class="text-stone-400 dark:text-stone-500">
          Nhập tên để bắt đầu tra cứu
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'Tra Cứu Điểm Giáo Lý – Thiếu Nhi Thánh Thể' })

const config = useRuntimeConfig()
const apiBase = config.public.apiBase

interface VerifyResult {
  studentId: string
  studentName: string
  branch: string
  className: string
  academicYear: string
  averageGrade: number | null
  conduct: string | null
}

const query = ref('')
const lastQuery = ref('')
const loading = ref(false)
const searched = ref(false)
const results = ref<VerifyResult[]>([])

const search = async () => {
  if (!query.value.trim()) return
  loading.value = true
  searched.value = false
  results.value = []
  lastQuery.value = query.value

  try {
    const data = await $fetch<VerifyResult[]>(`${apiBase}/api/students/verify`, {
      query: { q: query.value }
    })
    results.value = Array.isArray(data) ? data : [data as unknown as VerifyResult]
  } catch {
    results.value = []
  } finally {
    loading.value = false
    searched.value = true
  }
}

// Branch color helpers
const branchColor = (branch: string) => {
  const map: Record<string, string> = {
    'Ấu Nhi': 'bg-tntt-pink-100 text-tntt-pink-600',
    'Thiếu Nhi': 'bg-tntt-green-100 text-tntt-green-600',
    'Nghĩa Sĩ': 'bg-tntt-blue-100 text-tntt-blue-600',
    'Hiệp Sĩ': 'bg-tntt-gold-100 text-tntt-gold-600',
    'Huynh Trưởng': 'bg-tntt-brown-100 text-tntt-brown-600'
  }
  return map[branch] ?? 'bg-stone-100 text-stone-600'
}

const branchBadgeColor = (branch: string): 'error' | 'success' | 'info' | 'warning' | 'secondary' | 'neutral' | 'primary' => {
  const map: Record<string, 'error' | 'success' | 'info' | 'warning' | 'secondary' | 'neutral' | 'primary'> = {
    'Ấu Nhi': 'error', 'Thiếu Nhi': 'success',
    'Nghĩa Sĩ': 'info', 'Hiệp Sĩ': 'warning', 'Huynh Trưởng': 'secondary'
  }
  return map[branch] ?? 'neutral'
}

const gradeColor = (grade: number | null) => {
  if (grade === null) return 'text-stone-400'
  if (grade >= 8) return 'text-tntt-green-600'
  if (grade >= 6) return 'text-tntt-gold-600'
  return 'text-red-500'
}
</script>
