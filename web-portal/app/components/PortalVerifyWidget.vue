<template>
  <div class="py-2">
    <form
      id="verify-form"
      class="flex flex-col sm:flex-row gap-3"
      @submit.prevent="search"
    >
      <div class="relative flex-1">
        <UIcon
          name="i-heroicons-user"
          class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 pointer-events-none"
        />
        <input
          id="verify-input"
          v-model="query"
          type="text"
          placeholder="Nhập họ tên đầy đủ hoặc mã đoàn sinh..."
          class="w-full pl-11 pr-4 py-3 rounded-xl border text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 transition-all shadow-sm"
          style="border-color: rgba(201,169,110,0.3); --tw-ring-color: #c9a96e;"
          :disabled="loading"
        >
      </div>

      <input
        id="verify-birthdate"
        v-model="birthDate"
        type="date"
        class="w-full sm:w-44 px-4 py-3 rounded-xl border text-sm text-stone-800 dark:text-stone-100 bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 transition-all shadow-sm"
        style="border-color: rgba(201,169,110,0.3); --tw-ring-color: #c9a96e;"
        :disabled="loading"
      >

      <button
        id="verify-btn"
        type="submit"
        :disabled="loading || !query.trim() || (!byCode && !birthDate)"
        class="premium-btn text-sm px-7 py-3 rounded-xl flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <UIcon
          v-if="loading"
          name="i-heroicons-arrow-path"
          class="w-4 h-4 animate-spin"
        />
        <UIcon
          v-else
          name="i-heroicons-magnifying-glass"
          class="w-4 h-4"
        />
        <span>{{ loading ? 'Đang tra cứu...' : 'Tra Cứu' }}</span>
      </button>
    </form>

    <p class="mt-2 text-[11px] text-stone-400">
      Tra theo họ tên cần nhập đúng ngày sinh; tra theo mã đoàn sinh (VD: TN260001) thì không cần.
    </p>

    <!-- Kết Quả Hiển Thị Đẹp Mắt -->
    <Transition name="fade">
      <div
        v-if="result"
        class="mt-6 p-5 sm:p-6 rounded-2xl border shadow-md relative overflow-hidden"
        style="
          background: linear-gradient(135deg, rgba(250,248,243,0.98), rgba(240,236,224,0.95));
          border-color: rgba(201,169,110,0.35);
        "
      >
        <div class="flex items-start justify-between gap-4 border-b pb-4" style="border-color: rgba(201,169,110,0.2);">
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md shrink-0"
              style="background: linear-gradient(135deg, #1a3a6b, #2a5298);"
            >
              <UIcon name="i-heroicons-academic-cap" class="w-6 h-6 text-white" />
            </div>
            <div>
              <span class="text-[10px] font-black uppercase tracking-widest" style="color: #a07840;">
                Kết quả hồ sơ
              </span>
              <h3 class="font-black font-serif text-lg sm:text-xl text-navy" style="color: #1a3a6b;">
                {{ result.displayName }}
              </h3>
              <span class="text-xs text-stone-400">{{ result.studentCode }}</span>
            </div>
          </div>
          <span
            class="px-3 py-1 rounded-full text-xs font-bold border"
            style="background: rgba(26,58,107,0.08); color: #1a3a6b; border-color: rgba(26,58,107,0.2);"
          >
            Ngành {{ result.branch || 'chưa phân' }}
          </span>
        </div>

        <div class="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div class="p-3 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-stone-200/50">
            <span class="text-stone-400 block mb-0.5">Lớp Học</span>
            <span class="font-bold text-stone-800 dark:text-stone-200 text-sm">{{ result.className || 'Chưa xếp lớp' }}</span>
          </div>
          <div class="p-3 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-stone-200/50">
            <span class="text-stone-400 block mb-0.5">Điểm Giáo Lý</span>
            <span class="font-black text-sm font-serif" style="color: #1a3a6b;">
              {{ result.averageGrade !== null ? result.averageGrade.toFixed(1) : 'Chưa chấm' }}
            </span>
          </div>
          <div class="p-3 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-stone-200/50">
            <span class="text-stone-400 block mb-0.5">Niên Khóa</span>
            <span class="font-bold text-sm" style="color: #166534;">{{ result.academicYear || '—' }}</span>
          </div>
        </div>
      </div>

      <div
        v-else-if="errorMessage"
        class="mt-5 p-4 rounded-xl border text-sm text-center flex items-center justify-center gap-2"
        style="
          background: rgba(139,26,26,0.04);
          border-color: rgba(139,26,26,0.2);
          color: #8b1a1a;
        "
      >
        <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 shrink-0" />
        <span>{{ errorMessage }}</span>
      </div>
    </Transition>

    <div class="mt-4 text-center">
      <NuxtLink
        to="/verify"
        class="inline-flex items-center gap-1.5 text-xs font-bold hover:underline transition-all"
        style="color: #1a3a6b;"
      >
        <span>Mở trang tra cứu chi tiết</span>
        <UIcon name="i-heroicons-arrow-right-20-solid" class="w-3.5 h-3.5" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const apiBase = config.public.apiBase

/** Khớp đúng 6 trường của api/v1/public/students/lookup. */
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

const byCode = computed(() => CODE_PATTERN.test(query.value.trim()))

const search = async () => {
  const q = query.value.trim()
  if (!q) return

  loading.value = true
  result.value = null
  errorMessage.value = ''

  try {
    result.value = await $fetch<LookupResult>(`${apiBase}/api/v1/public/students/lookup`, {
      query: byCode.value ? { code: q } : { fullName: q, birthDate: birthDate.value }
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
          ? 'Vui lòng nhập đúng họ tên kèm ngày sinh, hoặc mã đoàn sinh.'
          : 'Không tìm thấy hồ sơ đoàn sinh phù hợp. Vui lòng kiểm tra lại họ tên hoặc mã số.'
  } finally {
    loading.value = false
  }
}
</script>
