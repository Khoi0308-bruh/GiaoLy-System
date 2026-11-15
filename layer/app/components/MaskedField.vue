<script setup lang="ts">
withDefaults(defineProps<{
  value?: string | null
  permission: string
  placeholder?: string
}>(), {
  value: null,
  placeholder: 'Đã ẩn (cần quyền)'
})

const session = useSessionStore()
</script>

<template>
  <span v-if="session.can(permission)">{{ value || '–' }}</span>
  <span
    v-else
    class="inline-flex items-center gap-1 rounded bg-stone-100 px-1.5 py-0.5 text-xs text-stone-500 dark:bg-stone-800 dark:text-stone-400"
    :title="`Cần quyền '${permission}' để xem thông tin này`"
  >
    <UIcon name="i-lucide-lock" class="size-3 text-stone-400" aria-hidden="true" />
    <span>{{ placeholder }}</span>
  </span>
</template>
