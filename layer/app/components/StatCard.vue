<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  hint?: string
  icon?: string
  to?: string
}>()
</script>

<template>
  <component
    :is="to ? 'NuxtLink' : 'div'"
    :to="to"
    class="block rounded-xl border border-stone-200 border-t-4 border-t-vatican-500 bg-parchment p-4 dark:border-stone-700 dark:bg-stone-900"
    :class="to ? 'cursor-pointer transition-shadow hover:shadow-md' : ''"
  >
    <div class="flex min-w-0 items-start justify-between gap-2">
      <div class="min-w-0 font-display text-2xl leading-none break-words tabular-nums text-marian-600 sm:text-4xl dark:text-marian-300">
        {{ value }}
      </div>
      <UIcon v-if="icon" :name="icon" class="size-6 text-vatican-500/80" aria-hidden="true" />
    </div>
    <div class="mt-2 text-sm font-medium text-stone-700 dark:text-stone-300">
      {{ label }}
    </div>
    <div v-if="hint" class="mt-1 text-xs text-stone-500 dark:text-stone-400">
      {{ hint }}
    </div>
  </component>
</template>
