<script setup lang="ts">
// Trang legacy: dùng $api cũ (không có tiền tố /api/v1) nên mọi request đều 404.
// Chuyển về trang quản lý vai trò hợp nhất.
await navigateTo('/admin/vai-tro', { replace: true })
</script>

<template>
  <div class="p-6 text-stone-500">
    Đang chuyển hướng đến Quản lý Vai trò...
  </div>
</template>
