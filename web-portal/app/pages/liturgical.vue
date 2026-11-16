<template>
  <div layout="default">
    <!-- Header -->
    <section class="relative py-14 bg-gradient-to-br from-tntt-green-700 via-tntt-green-600 to-tntt-green-800 text-white overflow-hidden">
      <div
        class="absolute inset-0 opacity-10"
        style="background-image: radial-gradient(circle at 70% 30%, #4ade80, transparent 60%)"
      />
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-xs font-bold uppercase tracking-widest text-green-200 mb-2">
          Phụng Vụ
        </p>
        <h1 class="font-serif font-bold text-3xl md:text-4xl mb-3">
          Lịch Phụng Vụ
        </h1>
        <p class="text-green-100 max-w-xl">
          Lịch phụng vụ Công giáo theo tuần và năm phụng vụ.
        </p>
      </div>
    </section>

    <!-- Content -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div
        v-if="loading"
        class="space-y-3"
      >
        <div
          v-for="n in 5"
          :key="n"
          class="h-16 bg-stone-100 dark:bg-stone-800 rounded-xl animate-pulse"
        />
      </div>

      <div
        v-else-if="entries.length"
        class="space-y-3"
      >
        <div
          v-for="(entry, i) in entries"
          :key="entry.date"
          :class="['glass-card flex items-center gap-4 p-4 animate-fade-in-up', isToday(entry.date) ? 'ring-2 ring-tntt-green-400' : '']"
          :style="{ animationDelay: `${i * 0.04}s` }"
        >
          <!-- Date badge -->
          <div :class="['rounded-xl text-center p-2 w-14 shrink-0 font-black', isToday(entry.date) ? 'bg-tntt-green-500 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200']">
            <p class="text-xl leading-none">
              {{ new Date(entry.date).getDate() }}
            </p>
            <p class="text-[10px] uppercase">
              {{ monthShort(entry.date) }}
            </p>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="font-bold text-stone-800 dark:text-white text-sm">
              {{ entry.liturgyName || entry.title }}
            </p>
            <p
              v-if="entry.description"
              class="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1"
            >
              {{ entry.description }}
            </p>
          </div>

          <!-- Season badge -->
          <UBadge
            v-if="entry.season"
            color="success"
            variant="soft"
            size="xs"
            class="shrink-0"
          >
            {{ entry.season }}
          </UBadge>
        </div>
      </div>

      <div
        v-else
        class="text-center py-16 text-stone-400"
      >
        <UIcon
          name="i-heroicons-calendar-days"
          class="w-12 h-12 mx-auto mb-3 opacity-40"
        />
        <p>Chưa có dữ liệu lịch phụng vụ.</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', public: true })
useHead({ title: 'Lịch Phụng Vụ – Thiếu Nhi Thánh Thể' })

const config = useRuntimeConfig()
const apiBase = config.public.apiBase

interface LiturgicalEntry {
  date: string
  title?: string
  liturgyName?: string
  description?: string
  season?: string
}

const loading = ref(true)
const entries = ref<LiturgicalEntry[]>([])

const { data } = await useFetch<LiturgicalEntry[]>(`${apiBase}/api/liturgical`)
entries.value = data.value ?? []
loading.value = false

const isToday = (dateStr: string) => {
  const today = new Date()
  const d = new Date(dateStr)
  return today.toDateString() === d.toDateString()
}

const monthShort = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('vi-VN', { month: 'short' }).replace('.', '')
</script>
