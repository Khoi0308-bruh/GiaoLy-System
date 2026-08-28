<template>
  <!--
    SafeHtml Component — Bộ lọc XSS an toàn cho Nuxt 3.
    Dùng thay thế cho v-html trực tiếp ở mọi nơi hiển thị nội dung từ DB.

    Cách dùng:
      <SafeHtml :content="item.content" />
      <SafeHtml :content="news.content" class="prose dark:prose-invert" />

    Nguyên lý hoạt động:
    - isomorphic-dompurify chạy được cả SSR (Node.js) lẫn CSR (Browser).
    - Chỉ cho phép các thẻ HTML an toàn, loại bỏ <script>, onclick, javascript:... v.v.
  -->
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div
    class="prose prose-stone dark:prose-invert prose-blockquote:font-serif prose-blockquote:text-lg prose-blockquote:italic prose-blockquote:border-l-4 prose-blockquote:border-marian-blue-500 prose-blockquote:bg-stone-50 dark:prose-blockquote:bg-stone-800/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-a:text-marian-blue-600 prose-headings:font-serif max-w-none"
    v-html="cleanHtml"
  />
</template>

<script setup lang="ts">
import DOMPurify from 'isomorphic-dompurify'

const props = defineProps<{
  content: string | null | undefined
}>()

/**
 * Danh sách thẻ được phép hiển thị (Whitelist).
 * Loại bỏ tất cả những gì không có trong danh sách này.
 */
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's',
  'h2', 'h3', 'h4',
  'ul', 'ol', 'li',
  'a', 'blockquote', 'hr',
  'span', 'div'
]

const ALLOWED_ATTR = ['href', 'target', 'rel', 'class']

const cleanHtml = computed(() => {
  if (!props.content) return ''
  return DOMPurify.sanitize(props.content, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Đảm bảo link ngoài không thể chạy javascript:
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed']
  })
})
</script>
