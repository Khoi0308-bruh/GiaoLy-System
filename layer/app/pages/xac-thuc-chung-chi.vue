<script setup lang="ts">
import { ApiError } from '../composables/useApi'

definePageMeta({ public: true })

interface VerifyResult {
  maskedFullName: string
  certificateType: string
  certificateTypeName?: string
  receivedOn?: string | null
  place?: string | null
  status: 'Issued' | 'Revoked'
  issuedAt: string
}

const api = useApi()
const code = ref('')
const result = ref<VerifyResult | null>(null)
const error = ref<ApiError | null>(null)
const loading = ref(false)

const CODE_PATTERN = /^CERT-(BAP|COM|CON)-\d{4}(-[2-9A-HJ-NP-Z]{4}){3}$/
const TYPE_LABEL: Record<string, string> = { Baptism: 'Bí tích Rửa tội', FirstCommunion: 'Bí tích Rước lễ lần đầu', Confirmation: 'Bí tích Thêm sức' }

async function verify() {
  result.value = null
  error.value = null
  const value = code.value.trim().toUpperCase()
  if (!CODE_PATTERN.test(value)) {
    error.value = new ApiError(400, 'VALIDATION_FAILED', 'Mã không đúng định dạng. Mã gồm 12 ký tự, ví dụ CERT-BAP-2026-XXXX-XXXX-XXXX.')
    return
  }
  loading.value = true
  try {
    result.value = await api.get<VerifyResult>('/public/certificates/verify', { code: value })
  } catch (e) {
    error.value = e as ApiError
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl px-5 py-10">
    <PageHeader title="Xác thực chứng chỉ" subtitle="Nhập mã in trên chứng chỉ. Trang chỉ hiển thị thông tin tối thiểu để bảo vệ đoàn sinh." />

    <form class="flex gap-2" @submit.prevent="verify">
      <UInput v-model="code" class="flex-1" placeholder="CERT-BAP-2026-XXXX-XXXX-XXXX" aria-label="Mã chứng chỉ" />
      <UButton type="submit" :loading="loading">
        Kiểm tra
      </UButton>
    </form>

    <ErrorState class="mt-4" :error="error" />

    <UCard v-if="result" class="mt-4">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-xl">
          {{ result.certificateTypeName ?? TYPE_LABEL[result.certificateType] ?? result.certificateType }}
        </h2>
        <StatusChip domain="certificate" :value="result.status" />
      </div>
      <dl class="grid grid-cols-[130px_1fr] gap-y-2 text-sm">
        <dt class="text-stone-500">Họ tên</dt>
        <dd>{{ result.maskedFullName }}</dd>
        <dt class="text-stone-500">Ngày lãnh</dt>
        <dd>{{ result.receivedOn ? formatDate(result.receivedOn) : '–' }}</dd>
        <dt class="text-stone-500">Nơi lãnh</dt>
        <dd>{{ result.place || '–' }}</dd>
      </dl>
    </UCard>
    <p class="mt-3 text-xs text-stone-500">
      Mỗi phút tra cứu tối đa 10 lần.
    </p>
  </div>
</template>
