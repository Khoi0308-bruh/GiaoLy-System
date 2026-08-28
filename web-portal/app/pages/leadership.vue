<template>
  <div layout="default">
    <!-- Header -->
    <section
      class="relative py-14 overflow-hidden"
      style="background: linear-gradient(135deg, #43302b 0%, #825c52 50%, #6b4c43 100%);"
    >
      <div
        class="absolute inset-0 opacity-10"
        style="background-image: url('data:image/svg+xml,<svg width=40 height=40 viewBox=0 0 40 40 xmlns=http://www.w3.org/2000/svg><g fill=none fill-rule=evenodd><g fill=%23fff fill-opacity=0.4><path d=M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41z/></g></g></svg>')"
      />
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <p class="text-xs font-bold uppercase tracking-widest text-amber-200 mb-2">
          Nhân Sự Sứ Đoàn
        </p>
        <h1 class="font-serif font-bold text-3xl md:text-4xl mb-3">
          Ban Trưởng Sứ Đoàn
        </h1>
        <p class="text-amber-100 max-w-xl">
          Danh sách các huynh trưởng và ban điều hành sứ đoàn nhiệm kỳ 2023–2026.
        </p>
      </div>
    </section>

    <!-- Content -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Loading -->
      <div
        v-if="loading"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
      >
        <div
          v-for="n in 8"
          :key="n"
          class="h-48 bg-stone-100 dark:bg-stone-800 rounded-2xl animate-pulse"
        />
      </div>

      <!-- By Level -->
      <div v-else>
        <div
          v-for="(group, level) in groupedLeaders"
          :key="level"
          class="mb-12"
        >
          <div class="flex items-center gap-3 mb-6">
            <div class="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
            <h2 class="font-bold text-stone-500 dark:text-stone-400 text-xs uppercase tracking-widest whitespace-nowrap">
              {{ levelLabel(+level) }}
            </h2>
            <div class="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            <div
              v-for="(leader, i) in group"
              :key="leader.id"
              :class="['glass-card p-5 text-center hover-lift animate-fade-in-up']"
              :style="{ animationDelay: `${i * 0.08}s` }"
            >
              <!-- Avatar -->
              <div class="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden bg-tntt-brown-100 dark:bg-tntt-brown-900 ring-2 ring-tntt-brown-200 dark:ring-tntt-brown-700">
                <img
                  v-if="leader.avatarPath"
                  :src="leader.avatarPath"
                  :alt="leader.fullName"
                  class="w-full h-full object-cover"
                  loading="lazy"
                >
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-2xl"
                >
                  {{ leader.fullName.charAt(0) }}
                </div>
              </div>

              <p class="text-[10px] text-stone-400 font-semibold mb-0.5">
                {{ leader.holyName }}
              </p>
              <p class="font-bold text-stone-800 dark:text-white text-sm leading-tight">
                {{ leader.fullName }}
              </p>
              <p class="text-xs text-tntt-brown-600 dark:text-tntt-brown-400 mt-1 font-medium">
                {{ leader.position }}
              </p>
              <p
                v-if="leader.description"
                class="text-[10px] text-stone-400 mt-2 italic line-clamp-2"
              >
                "{{ leader.description }}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'Ban Trưởng – Thiếu Nhi Thánh Thể' })

const config = useRuntimeConfig()
const apiBase = config.public.apiBase

interface Leader {
  id: string
  holyName: string
  fullName: string
  position: string
  level: number
  branch: number
  description?: string
  avatarPath?: string
  isActive: boolean
}

const loading = ref(true)
const leaders = ref<Leader[]>([])

const { data } = await useFetch<Leader[]>(`${apiBase}/api/leaders`)
leaders.value = (data.value ?? []).filter(l => l.isActive)
loading.value = false

const groupedLeaders = computed(() => {
  const groups: Record<number, Leader[]> = {}
  for (const l of leaders.value) {
    if (!groups[l.level]) groups[l.level] = []
    groups[l.level]!.push(l)
  }
  return groups
})

const levelLabel = (level: number) => {
  const map: Record<number, string> = {
    1: 'Linh Mục Tuyên Úy',
    2: 'Ban Điều Hành Xứ Đoàn',
    3: 'Phân Đoàn Trưởng / Ngành Trưởng',
    4: 'Giáo Lý Viên Phụ Trách'
  }
  return map[level] ?? `Cấp ${level}`
}
</script>
