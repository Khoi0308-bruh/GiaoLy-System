<script setup lang="ts">
// Trang legacy: dùng endpoint cũ /Announcement (không còn tồn tại).
// Chuyển về trang quản lý thông báo hợp nhất.
await navigateTo('/admin/thong-bao', { replace: true })
</script>

<template>
  <div class="p-6 text-stone-500">
    Đang chuyển hướng đến Quản lý Thông báo...
  </div>
</template>
