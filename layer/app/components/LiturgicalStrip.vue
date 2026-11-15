<script setup lang="ts">
const { today, load } = useLiturgical()
onMounted(load)
</script>

<template>
  <div
    class="flex flex-wrap items-center gap-2 px-5 py-1.5 text-sm"
    style="background: var(--lit); color: var(--lit-text)"
    role="note"
  >
    <span class="inline-block size-2.5 rounded-full border-2 border-white/70 bg-current" aria-hidden="true" />
    <strong v-if="today">{{ today.title }}</strong>
    <span v-else>Ngày hôm nay</span>
    <span v-if="today?.level" class="opacity-80">· {{ today.level }}</span>
  </div>
</template>
