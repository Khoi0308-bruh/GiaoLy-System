<script setup lang="ts">
// Trang legacy: dùng endpoint cũ /Leader (không còn tồn tại).
// Chuyển về trang quản lý huynh trưởng hợp nhất.
await navigateTo('/admin/huynh-truong', { replace: true })
</script>

<template>
  <div class="p-6 text-stone-500">
    Đang chuyển hướng đến Quản lý Huynh trưởng...
  </div>
</template>
