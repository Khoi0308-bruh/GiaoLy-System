<script setup lang="ts">
// Trang legacy: dùng endpoint cũ /User (không còn tồn tại).
// Chuyển về trang quản lý người dùng hợp nhất.
await navigateTo('/admin/nguoi-dung', { replace: true })
</script>

<template>
  <div class="p-6 text-stone-500">
    Đang chuyển hướng đến Quản lý Người dùng...
  </div>
</template>
