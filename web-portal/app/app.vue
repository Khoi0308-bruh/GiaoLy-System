<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: { lang: 'vi' }
})

useSeoMeta({
  title: 'Thiếu Nhi Thánh Thể – Cổng Thông Tin Sứ Đoàn',
  description: 'Cổng thông tin chính thức của Sứ Đoàn Thiếu Nhi Thánh Thể: tin tức Công giáo, lịch phụng vụ, danh sách ban trưởng và tra cứu điểm giáo lý.',
  ogTitle: 'Thiếu Nhi Thánh Thể – Cổng Thông Tin Sứ Đoàn',
  ogDescription: 'Cổng thông tin chính thức của Sứ Đoàn Thiếu Nhi Thánh Thể.',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage class="animate-fade-in" />
    </NuxtLayout>
  </UApp>
</template>
