<script setup lang="ts">
import type { ApiError } from '~/composables/useApi'
import { toApiError } from '~/composables/useApi'

const session = useSessionStore()
const api = useApi()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showPasswords = ref(false)
const error = ref<ApiError | null>(null)
const loading = ref(false)
const success = ref(false)

// Tiêu chí kiểm tra mật khẩu
const username = computed(() => session.me?.userName?.toLowerCase() || '')

const ruleMinLength = computed(() => newPassword.value.length >= 10)
const ruleNotUsername = computed(() => {
  if (!newPassword.value || !username.value) return true
  return !newPassword.value.toLowerCase().includes(username.value)
})
const ruleNotCurrent = computed(() => {
  if (!newPassword.value || !currentPassword.value) return true
  return newPassword.value !== currentPassword.value
})
const ruleMatchConfirm = computed(() => {
  if (!newPassword.value || !confirmPassword.value) return false
  return newPassword.value === confirmPassword.value
})

const isFormValid = computed(() => {
  return (
    currentPassword.value.length > 0 &&
    ruleMinLength.value &&
    ruleNotUsername.value &&
    ruleNotCurrent.value &&
    ruleMatchConfirm.value
  )
})

async function submit() {
  if (!isFormValid.value) return

  loading.value = true
  error.value = null

  try {
    await api.post('/auth/change-password', {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value
    })

    if (session.me) {
      session.me.mustChangePassword = false
    }

    success.value = true
    setTimeout(async () => {
      await navigateTo('/admin')
    }, 1500)
  } catch (e) {
    error.value = toApiError(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-ivory p-6 dark:bg-stone-950">
    <div class="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-8">
      <div class="text-center">
        <div class="arch-frame mx-auto mb-3 grid size-12 place-items-center bg-vatican-100 text-xl text-vatican-700 dark:bg-vatican-900/50 dark:text-vatican-300">
          ✝
        </div>
        <h1 class="text-2xl font-bold text-stone-900 dark:text-white">
          Đổi mật khẩu lần đầu
        </h1>
        <p class="mt-1 text-sm text-stone-600 dark:text-stone-400">
          Xin chào <strong>{{ session.me?.fullName || session.me?.userName }}</strong>. Để bảo vệ tài khoản, bạn cần đổi mật khẩu mới trước khi tiếp tục.
        </p>
      </div>

      <div class="gold-rule my-5 text-vatican-400" aria-hidden="true">
        <span>✠</span>
      </div>

      <UAlert
        v-if="success"
        color="success"
        variant="subtle"
        icon="i-lucide-check-circle"
        title="Đổi mật khẩu thành công!"
        description="Đang chuyển hướng vào bảng điều khiển quản trị..."
        class="mb-4"
      />

      <form v-else class="space-y-4" @submit.prevent="submit">
        <UFormField label="Mật khẩu hiện tại (mật khẩu tạm)" name="currentPassword">
          <UInput
            v-model="currentPassword"
            :type="showPasswords ? 'text' : 'password'"
            autocomplete="current-password"
            placeholder="Nhập mật khẩu hiện tại..."
            class="w-full"
            icon="i-lucide-key"
            required
            autofocus
          />
        </UFormField>

        <UFormField label="Mật khẩu mới" name="newPassword">
          <UInput
            v-model="newPassword"
            :type="showPasswords ? 'text' : 'password'"
            autocomplete="new-password"
            placeholder="Nhập mật khẩu mới (tối thiểu 10 ký tự)..."
            class="w-full"
            icon="i-lucide-lock"
            required
          />
        </UFormField>

        <UFormField label="Xác nhận mật khẩu mới" name="confirmPassword">
          <UInput
            v-model="confirmPassword"
            :type="showPasswords ? 'text' : 'password'"
            autocomplete="new-password"
            placeholder="Nhập lại mật khẩu mới..."
            class="w-full"
            icon="i-lucide-lock"
            required
          />
        </UFormField>

        <div class="flex items-center justify-between text-xs">
          <label class="flex items-center gap-1.5 cursor-pointer text-stone-600 dark:text-stone-400">
            <input v-model="showPasswords" type="checkbox" class="rounded text-marian-600">
            <span>Hiển thị mật khẩu</span>
          </label>
        </div>

        <!-- Checklist yêu cầu mật khẩu -->
        <div class="rounded-lg border border-stone-200 bg-stone-50 p-3 text-xs dark:border-stone-800 dark:bg-stone-950">
          <div class="font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
            Yêu cầu mật khẩu an toàn:
          </div>
          <ul class="space-y-1">
            <li class="flex items-center gap-1.5" :class="ruleMinLength ? 'text-green-600 dark:text-green-400' : 'text-stone-500'">
              <UIcon :name="ruleMinLength ? 'i-lucide-check' : 'i-lucide-circle'" class="size-3.5" />
              <span>Độ dài tối thiểu 10 ký tự</span>
            </li>
            <li class="flex items-center gap-1.5" :class="ruleNotUsername ? 'text-green-600 dark:text-green-400' : 'text-stone-500'">
              <UIcon :name="ruleNotUsername ? 'i-lucide-check' : 'i-lucide-circle'" class="size-3.5" />
              <span>Không chứa tên đăng nhập</span>
            </li>
            <li class="flex items-center gap-1.5" :class="ruleNotCurrent ? 'text-green-600 dark:text-green-400' : 'text-stone-500'">
              <UIcon :name="ruleNotCurrent ? 'i-lucide-check' : 'i-lucide-circle'" class="size-3.5" />
              <span>Khác với mật khẩu hiện tại</span>
            </li>
            <li class="flex items-center gap-1.5" :class="ruleMatchConfirm ? 'text-green-600 dark:text-green-400' : 'text-stone-500'">
              <UIcon :name="ruleMatchConfirm ? 'i-lucide-check' : 'i-lucide-circle'" class="size-3.5" />
              <span>Xác nhận mật khẩu khớp</span>
            </li>
          </ul>
        </div>

        <ErrorState :error="error" />

        <UButton
          type="submit"
          block
          size="lg"
          :loading="loading"
          :disabled="!isFormValid"
        >
          Xác nhận đổi mật khẩu
        </UButton>
      </form>
    </div>
  </div>
</template>
