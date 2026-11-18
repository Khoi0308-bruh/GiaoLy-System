<script setup lang="ts">
// Trang legacy: dùng endpoint cũ /Student (không còn tồn tại).
// Chuyển về trang báo cáo hợp nhất.
await navigateTo('/admin/bao-cao', { replace: true })
</script>

<template>
  <div class="p-6 text-stone-500">
    Đang chuyển hướng đến Báo cáo...
  </div>
</template>
