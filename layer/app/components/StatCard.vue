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
    class="block rounded-xl border border-stone-200 border-t-4 border-t-vatican-500 bg-parchment p-4 transition-shadow dark:border-stone-700 dark:bg-stone-900"
    :class="to ? 'hover:shadow-md cursor-pointer' : ''"
  >
    <div class="flex items-start justify-between gap-2">
      <div class="font-display text-4xl leading-none text-marian-600 dark:text-marian-300">
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
