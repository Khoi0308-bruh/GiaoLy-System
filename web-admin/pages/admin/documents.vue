<script setup lang="ts">
// Trang legacy: dùng endpoint cũ /Document (không còn tồn tại).
// Chuyển về trang quản lý tài liệu hợp nhất.
await navigateTo('/admin/tai-lieu', { replace: true })
</script>

<template>
  <div class="p-6 text-stone-500">
    Đang chuyển hướng đến Quản lý Tài liệu...
  </div>
</template>
