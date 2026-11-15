<script setup lang="ts">
const route = useRoute()
await navigateTo(`/admin/lop/${route.params.id}`, { replace: true })
</script>

<template>
  <div class="p-6 text-stone-500">
    Đang chuyển hướng đến Chi tiết lớp học...
  </div>
</template>
