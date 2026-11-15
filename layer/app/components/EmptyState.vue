<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description?: string
  icon?: string
}>(), {
  icon: 'i-lucide-inbox'
})
</script>

<template>
  <div class="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-parchment/60 px-6 py-10 text-center text-stone-600 dark:border-stone-700 dark:bg-stone-900/60 dark:text-stone-400">
    <div class="mb-3 grid size-12 place-items-center rounded-full bg-vatican-100 text-vatican-700 dark:bg-vatican-900/50 dark:text-vatican-300">
      <UIcon :name="icon" class="size-6" />
    </div>
    <div class="font-display text-xl text-stone-800 dark:text-stone-200">
      {{ title }}
    </div>
    <p v-if="description" class="mt-1 max-w-sm text-sm">
      {{ description }}
    </p>
    <div v-if="$slots.default" class="mt-4 flex flex-wrap gap-2">
      <slot />
    </div>
  </div>
</template>
