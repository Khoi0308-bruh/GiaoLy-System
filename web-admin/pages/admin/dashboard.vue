<script setup lang="ts">
// Trang legacy: dashboard cũ gọi các endpoint đã bị loại bỏ (/AcademicYear, /Student, ...).
// Chuyển về trang tổng quan hợp nhất dùng API v1 hiện hành.
await navigateTo('/admin', { replace: true })
</script>

<template>
  <div class="p-6 text-stone-500">
    Đang chuyển hướng đến Bảng điều khiển...
  </div>
</template>
