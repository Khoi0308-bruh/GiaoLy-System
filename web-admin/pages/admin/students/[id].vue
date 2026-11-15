<script setup lang="ts">
const route = useRoute()
await navigateTo(`/admin/doan-sinh/${route.params.id}`, { replace: true })
</script>

<template>
  <div class="p-6 text-stone-500">
    Đang chuyển hướng đến Hồ sơ đoàn sinh...
  </div>
</template>
