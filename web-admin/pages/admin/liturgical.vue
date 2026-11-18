<script setup lang="ts">
// Trang legacy: dùng endpoint cũ /Liturgical (không còn tồn tại).
// Chuyển về trang quản lý lịch phụng vụ hợp nhất.
await navigateTo('/admin/lich-phung-vu', { replace: true })
</script>

<template>
  <div class="p-6 text-stone-500">
    Đang chuyển hướng đến Quản lý Lịch Phụng vụ...
  </div>
</template>
