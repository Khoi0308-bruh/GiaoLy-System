<script setup lang="ts">
definePageMeta({
  public: true,
  redirect: '/dang-nhap'
})
await navigateTo('/dang-nhap', { replace: true })
</script>

<template>
  <div class="grid min-h-screen place-items-center text-stone-500">
    Đang chuyển hướng đến trang đăng nhập...
  </div>
</template>
