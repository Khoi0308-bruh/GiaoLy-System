<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const laLoiTamThoi = computed(() => (props.error.statusCode ?? 500) >= 500)

const tieuDe = computed(() => {
  if (props.error.statusCode === 404) return 'Không tìm thấy trang'
  if (props.error.statusCode === 403) return props.error.statusMessage || 'Bạn không có quyền truy cập trang này'
  if (laLoiTamThoi.value) return 'Máy chủ đang tạm gián đoạn'
  return props.error.statusMessage || 'Đã xảy ra lỗi'
})

const moTa = computed(() =>
  laLoiTamThoi.value
    ? 'Máy chủ đang quá tải hoặc tạm giới hạn truy cập. Vui lòng đợi khoảng một phút rồi thử lại — bạn không bị đăng xuất.'
    : 'Vui lòng kiểm tra lại đường dẫn hoặc quay về trang trước.'
)

function thuLai() {
  // Tải lại giữ nguyên địa chỉ: middleware sẽ tự đọc lại phiên.
  window.location.reload()
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-default p-6">
    <div class="max-w-md w-full text-center space-y-4">
      <p class="text-6xl font-serif font-black text-highlighted">
        {{ error.statusCode }}
      </p>
      <h1 class="text-xl font-semibold text-highlighted">
        {{ tieuDe }}
      </h1>
      <p class="text-sm text-muted">
        {{ moTa }}
      </p>
      <div class="flex items-center justify-center gap-3 pt-2">
        <UButton icon="i-lucide-rotate-cw" @click="thuLai">
          Thử lại
        </UButton>
        <UButton variant="ghost" icon="i-lucide-log-in" @click="clearError({ redirect: '/dang-nhap' })">
          Về trang đăng nhập
        </UButton>
      </div>
    </div>
  </div>
</template>
