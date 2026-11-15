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
          Nhập mã đoàn sinh, hoặc họ tên đầy đủ kèm ngày sinh, để xem lớp và điểm trung bình.
        </p>
      </div>
    </section>

    <!-- Search Box -->
    <section class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
      <div class="glass-card p-6 animate-fade-in-up">
        <form
          id="verify-search-form"
          class="flex flex-col sm:flex-row gap-3"
          @submit.prevent="search"
        >
          <UInput
            id="verify-search-input"
            v-model="query"
            size="lg"
            placeholder="Mã đoàn sinh (VD: TN260001) hoặc họ tên đầy đủ..."
            class="flex-1"
            :disabled="loading"
            leading-icon="i-heroicons-magnifying-glass"
          />
          <UInput
            id="verify-birthdate-input"
            v-model="birthDate"
            type="date"
            size="lg"
            class="sm:w-48"
            :disabled="loading"
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
          Tra theo họ tên bắt buộc nhập đúng ngày sinh. Thông tin chỉ dành cho mục đích tra cứu học vụ.
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
          v-for="n in 1"
          :key="n"
          class="h-28 bg-stone-100 dark:bg-stone-800 rounded-2xl animate-pulse"
        />
      </div>

      <!-- Result -->
      <div
        v-else-if="result"
        class="glass-card p-5 animate-fade-in-up"
      >
        <div class="flex items-start gap-4">
          <div :class="[branchColor(result.branch), 'rounded-xl p-3 shrink-0']">
            <UIcon
              name="i-heroicons-academic-cap"
              class="w-6 h-6"
            />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <h2 class="font-bold text-stone-800 dark:text-white">
                {{ result.displayName }}
              </h2>
              <UBadge
                :color="branchBadgeColor(result.branch)"
                variant="soft"
                size="xs"
              >
                {{ result.branch || 'Chưa phân ngành' }}
              </UBadge>
              <span class="text-xs text-stone-400">{{ result.studentCode }}</span>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1.5 text-sm">
              <div>
                <p class="text-[10px] text-stone-400 uppercase tracking-wider">
                  Lớp
                </p>
                <p class="font-semibold text-stone-700 dark:text-stone-300">
                  {{ result.className || '—' }}
                </p>
              </div>
              <div>
                <p class="text-[10px] text-stone-400 uppercase tracking-wider">
                  Niên khóa
                </p>
                <p class="font-semibold text-stone-700 dark:text-stone-300">
                  {{ result.academicYear || '—' }}
                </p>
              </div>
              <div>
                <p class="text-[10px] text-stone-400 uppercase tracking-wider">
                  Điểm Giáo Lý
                </p>
                <p :class="['font-black text-lg', gradeColor(result.averageGrade)]">
                  {{ result.averageGrade !== null ? result.averageGrade.toFixed(1) : '—' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Not found / lỗi -->
      <div
        v-else-if="errorMessage"
        class="text-center py-16 animate-fade-in"
      >
        <UIcon
          name="i-heroicons-face-frown"
          class="w-16 h-16 mx-auto mb-4 text-stone-300 dark:text-stone-600"
        />
        <p class="font-bold text-stone-600 dark:text-stone-400 text-lg">
          {{ errorMessage }}
        </p>
        <p class="text-stone-400 text-sm mt-2 max-w-sm mx-auto">
          Nếu vẫn không tìm thấy, hãy liên hệ thư ký sứ đoàn.
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
          Nhập mã đoàn sinh hoặc họ tên để bắt đầu tra cứu
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

/** Khớp đúng 6 trường của api/v1/public/students/lookup — không có dữ liệu định danh nội bộ. */
interface LookupResult {
  studentCode: string
  displayName: string
  className: string | null
  branch: string | null
  academicYear: string | null
  averageGrade: number | null
}

const CODE_PATTERN = /^TN\d{4,}$/i

const query = ref('')
const birthDate = ref('')
const loading = ref(false)
const result = ref<LookupResult | null>(null)
const errorMessage = ref('')

const search = async () => {
  const q = query.value.trim()
  if (!q) return

  const byCode = CODE_PATTERN.test(q)
  if (!byCode && !birthDate.value) {
    errorMessage.value = 'Vui lòng nhập ngày sinh khi tra cứu theo họ tên.'
    result.value = null
    return
  }

  loading.value = true
  result.value = null
  errorMessage.value = ''

  try {
    result.value = await $fetch<LookupResult>(`${apiBase}/api/v1/public/students/lookup`, {
      query: byCode ? { code: q } : { fullName: q, birthDate: birthDate.value }
    })
  } catch (e) {
    const status = (e as { statusCode?: number, status?: number })?.statusCode
      ?? (e as { status?: number })?.status
    result.value = null
    errorMessage.value = status === 429
      ? 'Bạn đã tra cứu quá nhiều lần. Vui lòng thử lại sau một phút.'
      : status === 409
        ? 'Có nhiều hồ sơ khớp. Vui lòng tra cứu bằng mã đoàn sinh.'
        : status === 400
          ? 'Thông tin nhập chưa đúng. Vui lòng kiểm tra lại.'
          : 'Không tìm thấy hồ sơ đoàn sinh phù hợp.'
  } finally {
    loading.value = false
  }
}

// Branch color helpers
const branchColor = (branch: string | null) => {
  const map: Record<string, string> = {
    'Ấu Nhi': 'bg-tntt-pink-100 text-tntt-pink-600',
    'Thiếu Nhi': 'bg-tntt-green-100 text-tntt-green-600',
    'Nghĩa Sĩ': 'bg-tntt-blue-100 text-tntt-blue-600',
    'Hiệp Sĩ': 'bg-tntt-gold-100 text-tntt-gold-600',
    'Huynh Trưởng': 'bg-tntt-brown-100 text-tntt-brown-600'
  }
  return (branch && map[branch]) || 'bg-stone-100 text-stone-600'
}

const branchBadgeColor = (branch: string | null): 'error' | 'success' | 'info' | 'warning' | 'secondary' | 'neutral' | 'primary' => {
  const map: Record<string, 'error' | 'success' | 'info' | 'warning' | 'secondary' | 'neutral' | 'primary'> = {
    'Ấu Nhi': 'error', 'Thiếu Nhi': 'success',
    'Nghĩa Sĩ': 'info', 'Hiệp Sĩ': 'warning', 'Huynh Trưởng': 'secondary'
  }
  return (branch && map[branch]) || 'neutral'
}

const gradeColor = (grade: number | null) => {
  if (grade === null) return 'text-stone-400'
  if (grade >= 8) return 'text-tntt-green-600'
  if (grade >= 6) return 'text-tntt-gold-600'
  return 'text-red-500'
}
</script>
