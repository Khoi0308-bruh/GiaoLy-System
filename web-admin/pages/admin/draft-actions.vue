<script setup lang="ts">
// Trang legacy: dùng endpoint cũ /DraftAction + /AcademicYear (không còn tồn tại).
// Chuyển về trang xét duyệt lên lớp hợp nhất.
await navigateTo('/admin/len-lop', { replace: true })
</script>

<template>
  <div class="p-6 text-stone-500">
    Đang chuyển hướng đến Xét duyệt Lên lớp...
  </div>
</template>
