<script setup lang="ts">
import type { ApiError } from '../composables/useApi'

const props = defineProps<{ error: ApiError | null }>()
defineEmits<{ retry: [] }>()

const hasFieldErrors = computed(() => {
  if (!props.error?.fieldErrors) return false
  return Object.keys(props.error.fieldErrors).length > 0
})
</script>

<template>
  <UAlert
    v-if="error"
    color="error"
    variant="subtle"
    :title="error.message"
    icon="i-lucide-circle-alert"
  >
    <template #description>
      <div v-if="error.retryAfter" class="mt-1 text-xs">
        Vui lòng thử lại sau {{ error.retryAfter }} giây.
      </div>
      <ul v-if="hasFieldErrors" class="mt-2 list-inside list-disc space-y-0.5 text-xs text-stone-700 dark:text-stone-300">
        <li v-for="(msgs, field) in error.fieldErrors" :key="field">
          <strong>{{ field }}:</strong> {{ msgs.join(', ') }}
        </li>
      </ul>
    </template>
    <template #actions>
      <UButton
        v-if="error.status !== 403 && error.status !== 404"
        size="xs"
        variant="outline"
        color="error"
        @click="$emit('retry')"
      >
        Thử lại
      </UButton>
    </template>
  </UAlert>
</template>
