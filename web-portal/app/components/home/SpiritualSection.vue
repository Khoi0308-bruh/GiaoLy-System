<script setup lang="ts">
interface LiturgicalEvent {
  id: string
  date: string
  title: string
  color: string
  level: string
  isOverride: boolean
  wordOfGodOverride?: string | null
  wordOfGodReference?: string | null
}

// Fetch today's Liturgical Event
const { data: liturgicalToday } = await useFetch<LiturgicalEvent>('/api/liturgical/today', {
  baseURL: 'https://localhost:7198'
})

// Optional: If WordOfGodOverride is null, fetch from an external API (simulated here)
const wordOfGod = computed(() => {
  if (liturgicalToday.value?.wordOfGodOverride) {
    return {
      text: liturgicalToday.value.wordOfGodOverride,
      reference: liturgicalToday.value.wordOfGodReference || 'Lời Chúa'
    }
  }
  return {
    text: '"Thầy là đường, là sự thật và là sự sống. Không ai đến được với Chúa Cha mà không qua Thầy."',
    reference: 'Ga 14, 6'
  }
})

const wordOfGodContent = computed(() => wordOfGod.value.text)
const wordOfGodReference = computed(() => wordOfGod.value.reference)
</script>

<template>
  <div class="flex flex-col gap-8 mb-10">
    <!-- Hàng 1: Lời Chúa -->
    <div
      class="w-full relative rounded-3xl p-6 md:p-10 shadow-lg border border-amber-200/50 dark:border-stone-800 overflow-hidden bg-center bg-cover"
      style="background-image: url('https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=2000&auto=format&fit=crop');"
    >
      <!-- Lớp Glassmorphism làm mờ ảnh nền -->
      <div class="absolute inset-0 bg-white/75 dark:bg-[#1a1b1e]/85 backdrop-blur-md" />

      <!-- Decorative background icon -->
      <UIcon
        name="i-heroicons-sparkles"
        class="absolute top-4 right-4 w-32 h-32 text-amber-500/20 dark:text-amber-500/10 rotate-12 z-0"
      />

      <div class="flex items-center gap-3 mb-6 relative z-10">
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center shadow-md">
          <UIcon
            name="i-heroicons-book-open"
            class="w-6 h-6 text-white"
          />
        </div>
        <h2 class="text-2xl font-bold text-stone-800 dark:text-amber-50 drop-shadow-sm">
          Suy Niệm Lời Chúa
        </h2>
      </div>

      <div class="relative z-10 bg-white/50 dark:bg-black/30 backdrop-blur-lg p-6 md:p-10 rounded-2xl border border-white/60 dark:border-stone-700/50 shadow-inner">
        <p class="font-serif text-lg md:text-xl lg:text-2xl text-stone-900 dark:text-stone-100 leading-loose italic mb-6">
          {{ wordOfGodContent }}
        </p>
        <div class="flex items-center gap-3 justify-end">
          <div class="h-px w-12 bg-amber-500" />
          <span class="font-bold text-amber-700 dark:text-amber-400 text-sm md:text-base tracking-widest uppercase">{{ wordOfGodReference }}</span>
        </div>
      </div>
    </div>

    <!-- Hàng 2: Lịch Phụng Vụ -->
    <div class="w-full bg-white dark:bg-[#242526] rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100 dark:border-stone-800 flex flex-col md:flex-row items-center gap-6 md:gap-10">
      <div class="flex items-center gap-3 md:w-1/3">
        <div class="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          <UIcon
            name="i-heroicons-calendar-days"
            class="w-6 h-6 text-purple-600 dark:text-purple-400"
          />
        </div>
        <div>
          <h2 class="text-xl font-bold text-stone-800 dark:text-white leading-tight">
            Lịch Phụng Vụ
          </h2>
          <p class="text-sm text-stone-500 dark:text-stone-400">
            Hôm nay, {{ new Date().toLocaleDateString('vi-VN') }}
          </p>
        </div>
      </div>

      <div class="flex-1 w-full">
        <div
          v-if="liturgicalToday"
          class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-stone-50 dark:bg-[#3a3b3c] border border-stone-100 dark:border-stone-700"
        >
          <div>
            <h3 class="font-bold text-stone-800 dark:text-white text-xl leading-tight mb-2">
              {{ liturgicalToday.title }}
            </h3>
            <div class="flex flex-wrap gap-2">
              <UBadge
                color="primary"
                variant="subtle"
                size="sm"
              >
                Màu {{ liturgicalToday.color }}
              </UBadge>
              <UBadge
                color="neutral"
                variant="solid"
                size="sm"
              >
                {{ liturgicalToday.level }}
              </UBadge>
            </div>
          </div>
          <UIcon
            name="i-heroicons-arrow-right-circle"
            class="hidden md:block w-8 h-8 text-stone-300 dark:text-stone-600"
          />
        </div>
        <div
          v-else
          class="flex flex-col items-center justify-center p-6 text-center rounded-2xl bg-stone-50 dark:bg-[#3a3b3c] border border-stone-100 dark:border-stone-700"
        >
          <UIcon
            name="i-heroicons-calendar-days"
            class="w-10 h-10 text-stone-300 dark:text-stone-600 mb-2"
          />
          <p class="text-sm font-medium text-stone-500 dark:text-stone-400">
            Không có dữ liệu lịch phụng vụ hôm nay.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
