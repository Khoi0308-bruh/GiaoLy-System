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

const config = useRuntimeConfig()

// Fetch today's Liturgical Event
const { data: liturgicalToday } = await useFetch<LiturgicalEvent>('/api/liturgical/today', {
  baseURL: config.public.apiBase
})

// Lời Chúa: dùng override từ API, hoặc fallback
const wordOfGod = computed(() => {
  if (liturgicalToday.value?.wordOfGodOverride) {
    return {
      text: liturgicalToday.value.wordOfGodOverride,
      reference: liturgicalToday.value.wordOfGodReference || 'Lời Chúa'
    }
  }
  return {
    text: '\"Thầy là đường, là sự thật và là sự sống. Không ai đến được với Chúa Cha mà không qua Thầy.\"',
    reference: 'Ga 14, 6'
  }
})

const wordOfGodContent = computed(() => wordOfGod.value.text)
const wordOfGodReference = computed(() => wordOfGod.value.reference)

// Ánh xạ màu phụng vụ sang màu thực tế
const liturgicalColorMap: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  'Đỏ':   { bg: 'rgba(139,26,26,0.08)',  text: '#8b1a1a', dot: '#c0392b', label: 'Màu Đỏ' },
  'Tím':  { bg: 'rgba(76,29,149,0.08)',  text: '#4c1d95', dot: '#7c3aed', label: 'Màu Tím' },
  'Xanh': { bg: 'rgba(26,58,107,0.08)',  text: '#1a3a6b', dot: '#2a5298', label: 'Màu Xanh' },
  'Trắng':{ bg: 'rgba(201,169,110,0.1)', text: '#a07840', dot: '#c9a96e', label: 'Màu Trắng' },
  'Xanh lá':{ bg: 'rgba(22,101,52,0.08)',text: '#166534', dot: '#16a34a', label: 'Màu Xanh Lá' },
  'Hồng': { bg: 'rgba(219,39,119,0.08)', text: '#be185d', dot: '#db2777', label: 'Màu Hồng' },
}

const liturgicalStyle = computed(() => {
  const color = liturgicalToday.value?.color || ''
  return liturgicalColorMap[color] || { bg: 'rgba(26,58,107,0.06)', text: '#1a3a6b', dot: '#c9a96e', label: `Màu ${color}` }
})
</script>

<template>
  <div class="flex flex-col gap-8 mb-10">

    <!-- ══════════════════════════════════════════════════════════════
         LỜI CHÚA — Beautiful Quote Card với Glassmorphism
    ══════════════════════════════════════════════════════════════════ -->
    <div
      class="relative w-full rounded-3xl overflow-hidden"
      style="box-shadow: 0 20px 60px rgba(26,58,107,0.15);"
    >
      <!-- Ảnh nền -->
      <div
        class="absolute inset-0 bg-center bg-cover"
        style="background-image: url('https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=2000&auto=format&fit=crop');"
      />
      <!-- Overlay Navy -->
      <div class="absolute inset-0"
        style="background: linear-gradient(135deg, rgba(26,58,107,0.92) 0%, rgba(42,82,152,0.85) 50%, rgba(139,26,26,0.75) 100%);"
      />
      <!-- Họa tiết chìm thánh giá -->
      <div class="absolute inset-0 cross-pattern opacity-30" />

      <!-- Bokeh particles -->
      <div class="absolute top-8 right-12 w-40 h-40 rounded-full opacity-20"
        style="background: radial-gradient(circle, #c9a96e 0%, transparent 70%); animation: float 7s ease-in-out infinite;"
      />
      <div class="absolute bottom-6 left-8 w-24 h-24 rounded-full opacity-15"
        style="background: radial-gradient(circle, #e8c98a 0%, transparent 70%); animation: float 5s ease-in-out 2s infinite;"
      />

      <!-- Nội dung -->
      <div class="relative z-10 p-8 md:p-12">
        <!-- Header -->
        <div class="flex items-center gap-4 mb-8">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
            style="background: linear-gradient(135deg, rgba(201,169,110,0.3), rgba(232,201,138,0.2)); border: 1px solid rgba(201,169,110,0.4);"
          >
            <UIcon name="i-heroicons-book-open" class="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 class="text-xl font-black text-white tracking-wide font-serif">Suy Niệm Lời Chúa</h2>
            <p class="text-xs font-medium tracking-widest uppercase" style="color: #e8c98a;">
              {{ new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
            </p>
          </div>
        </div>

        <!-- Quote Card — Glassmorphism -->
        <div class="relative p-8 md:p-10 rounded-2xl"
          style="
            background: rgba(255,255,255,0.08);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255,255,255,0.15);
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);
          "
        >
          <!-- Dấu ngoặc kép trang trọng -->
          <span class="absolute -top-5 -left-2 font-serif leading-none select-none"
            style="font-size: 8rem; color: rgba(201,169,110,0.3); line-height: 1;"
          >"</span>

          <p class="font-serif text-lg md:text-xl lg:text-2xl text-white/95 leading-loose italic mb-6 relative z-10">
            {{ wordOfGodContent }}
          </p>

          <!-- Reference -->
          <div class="flex items-center justify-end gap-3">
            <div class="h-px w-16" style="background: linear-gradient(90deg, transparent, #c9a96e);" />
            <span class="font-black tracking-[0.2em] uppercase text-sm"
              style="color: #e8c98a;"
            >{{ wordOfGodReference }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════
         LỊCH PHỤNG VỤ — Card với màu phụng vụ thực sự
    ══════════════════════════════════════════════════════════════════ -->
    <div class="sacred-card p-6 md:p-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
        <div class="flex items-center gap-4 flex-1">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
            style="background: linear-gradient(135deg, rgba(76,29,149,0.1), rgba(76,29,149,0.05)); border: 1px solid rgba(76,29,149,0.15);"
          >
            <UIcon name="i-heroicons-calendar-days" class="w-7 h-7" style="color: #7c3aed;" />
          </div>
          <div>
            <h2 class="text-xl font-black text-stone-800 dark:text-white font-serif leading-tight">
              Lịch Phụng Vụ Hôm Nay
            </h2>
            <p class="text-sm font-medium text-stone-500 dark:text-stone-400">
              {{ new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
            </p>
          </div>
        </div>

        <!-- Indicator màu phụng vụ khi có dữ liệu -->
        <div v-if="liturgicalToday" class="flex items-center gap-2 self-start md:self-auto">
          <!-- Animated dot màu phụng vụ -->
          <div class="w-4 h-4 rounded-full liturgy-dot"
            :style="{ backgroundColor: liturgicalStyle.dot }"
          />
          <span class="text-sm font-bold"
            :style="{ color: liturgicalStyle.text }"
          >{{ liturgicalStyle.label }}</span>
        </div>
      </div>

      <!-- Card nội dung phụng vụ -->
      <div
        v-if="liturgicalToday"
        class="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 p-5 md:p-6 rounded-2xl border transition-all duration-300"
        :style="{
          background: liturgicalStyle.bg,
          borderColor: liturgicalStyle.dot + '30'
        }"
      >
        <div class="flex-1">
          <h3 class="font-black text-stone-800 dark:text-white text-lg md:text-xl leading-tight mb-3 font-serif">
            {{ liturgicalToday.title }}
          </h3>
          <div class="flex flex-wrap gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
              :style="{ background: liturgicalStyle.bg, borderColor: liturgicalStyle.dot + '50', color: liturgicalStyle.text }"
            >
              <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: liturgicalStyle.dot }" />
              {{ liturgicalStyle.label }}
            </span>
            <UBadge
              color="neutral"
              variant="subtle"
              size="sm"
              class="font-semibold"
            >
              {{ liturgicalToday.level }}
            </UBadge>
          </div>
        </div>
        <UIcon
          name="i-heroicons-arrow-right-circle"
          class="hidden md:block w-8 h-8 opacity-20 dark:opacity-10"
        />
      </div>

      <!-- Không có dữ liệu -->
      <div
        v-else
        class="flex flex-col items-center justify-center p-10 text-center rounded-2xl border border-dashed"
        style="border-color: rgba(201,169,110,0.2); background: rgba(201,169,110,0.04);"
      >
        <UIcon
          name="i-heroicons-calendar-days"
          class="w-12 h-12 mb-3 opacity-30"
          style="color: #c9a96e;"
        />
        <p class="text-sm font-medium text-stone-500 dark:text-stone-400">
          Không có dữ liệu lịch phụng vụ hôm nay.
        </p>
      </div>
    </div>

  </div>
</template>
