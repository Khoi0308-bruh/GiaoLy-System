<template>
  <div class="py-4">
    <form
      id="verify-form"
      class="flex gap-2"
      @submit.prevent="search"
    >
      <UInput
        id="verify-input"
        v-model="query"
        placeholder="Họ tên hoặc mã đoàn sinh..."
        class="flex-1"
        size="md"
        :disabled="loading"
      />
      <UButton
        id="verify-btn"
        type="submit"
        :loading="loading"
        icon="i-heroicons-magnifying-glass"
        color="primary"
        size="md"
      />
    </form>

    <!-- Result -->
    <Transition name="fade">
      <div
        v-if="result"
        class="mt-4 p-4 rounded-xl bg-tntt-green-50 dark:bg-tntt-green-900/20 border border-tntt-green-200 dark:border-tntt-green-800"
      >
        <p class="font-bold text-tntt-green-700 dark:text-tntt-green-300 text-sm">
          {{ result.studentName }}
        </p>
        <div class="mt-2 grid grid-cols-2 gap-2 text-xs text-stone-600 dark:text-stone-400">
          <span>Lớp: <strong>{{ result.className }}</strong></span>
          <span>Ngành: <strong>{{ result.branch }}</strong></span>
          <span>Giáo lý: <strong class="text-tntt-blue-600">{{ result.grade ?? 'Chưa có' }}</strong></span>
          <span>Hạnh kiểm: <strong>{{ result.conduct ?? 'Chưa có' }}</strong></span>
        </div>
      </div>
      <div
        v-else-if="notFound"
        class="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center"
      >
        Không tìm thấy đoàn sinh. Vui lòng kiểm tra lại.
      </div>
    </Transition>

    <p class="text-xs text-stone-400 mt-3 text-center">
      <NuxtLink
        to="/verify"
        class="hover:underline text-tntt-blue-500"
      >Tra cứu đầy đủ →</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const apiBase = config.public.apiBase
const query = ref('')
const loading = ref(false)
const result = ref<Record<string, unknown> | null>(null)
const notFound = ref(false)

const search = async () => {
  if (!query.value.trim()) return
  loading.value = true
  result.value = null
  notFound.value = false

  try {
    const data = await $fetch<Record<string, unknown>>(`${apiBase}/api/students/verify`, {
      query: { q: query.value }
    })
    result.value = data
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
