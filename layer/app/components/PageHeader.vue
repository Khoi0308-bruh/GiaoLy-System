<script setup lang="ts">
defineProps<{ title: string, subtitle?: string }>()
</script>

<template>
  <header class="mb-6">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="text-3xl text-marian-700 dark:text-marian-200">
          {{ title }}
        </h1>
        <p v-if="subtitle" class="mt-1 text-sm text-stone-600 dark:text-stone-400">
          {{ subtitle }}
        </p>
      </div>
      <div class="flex flex-wrap gap-2 no-print">
        <slot name="actions" />
      </div>
    </div>
    <div class="gold-rule mt-3" aria-hidden="true">
      <span>✠</span>
    </div>
  </header>
</template>
