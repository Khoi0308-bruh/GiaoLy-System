<script setup lang="ts">
import type { ApiError } from '~/composables/useApi'
import { toApiError } from '~/composables/useApi'

definePageMeta({ public: true })

const session = useSessionStore()
const route = useRoute()

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref<ApiError | null>(null)
const loading = ref(false)

async function submit() {
  if (!username.value || !password.value) return
  loading.value = true
  error.value = null

  try {
    await session.login(username.value, password.value)
    if (session.me?.mustChangePassword) {
      await navigateTo('/doi-mat-khau-lan-dau')
      return
    }

    const back = typeof route.query.quay_lai === 'string' ? route.query.quay_lai : null
    // Phụ huynh không có quyền vào khu quản trị, nên bỏ qua "quay_lai" trỏ tới /admin.
    const backAllowed = !!back
      && back.startsWith('/')
      && !back.startsWith('/dang-nhap')
      && !(session.homePath === '/phu-huynh' && back.startsWith('/admin'))
    await navigateTo(backAllowed ? back : session.homePath)
  } catch (e) {
    error.value = toApiError(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="grid min-h-screen lg:grid-cols-2">
    <!-- Nửa trái: Bản sắc & Thương hiệu Công Giáo -->
    <div class="hidden place-items-center bg-gradient-to-br from-marian-900 via-marian-800 to-marian-700 p-10 text-vatican-100 lg:grid">
      <div class="max-w-md text-center">
        <div class="arch-frame mx-auto mb-6 grid h-36 w-28 place-items-center bg-white/5 text-6xl text-vatican-300 shadow-inner">
          ✝
        </div>
        <h1 class="font-serif text-5xl font-bold tracking-tight text-white drop-shadow-sm">
          Giáo Lý Xứ Đoàn
        </h1>
        <p class="mt-4 text-base leading-relaxed text-marian-100/90">
          "Cùng nhau lớn lên trong đức tin, trong ánh sáng và tình yêu của Lời Chúa."
        </p>
        <div class="gold-rule mt-6 text-vatican-300" aria-hidden="true">
          <span>✠</span>
        </div>
        <p class="mt-6 text-xs text-vatican-200/70 tracking-wider uppercase">
          Hệ thống Quản lý Giáo Lý Giáo Xứ V3
        </p>
      </div>
    </div>

    <!-- Nửa phải: Form Đăng nhập -->
    <div class="flex items-center justify-center bg-ivory p-6 dark:bg-stone-950 sm:p-12">
      <div class="w-full max-w-sm space-y-6">
        <!-- Logo mobile -->
        <div class="text-center lg:hidden">
          <div class="arch-frame mx-auto mb-3 grid size-14 place-items-center bg-vatican-500/10 text-2xl text-vatican-600 dark:text-vatican-300">
            ✝
          </div>
          <h1 class="font-serif text-3xl font-bold text-marian-700 dark:text-marian-300">
            Giáo Lý Xứ Đoàn
          </h1>
        </div>

        <div>
          <h2 class="text-2xl font-bold text-stone-900 dark:text-white">
            Đăng nhập hệ thống
          </h2>
          <p class="mt-1 text-sm text-stone-600 dark:text-stone-400">
            Dành cho giáo lý viên, huynh trưởng và Ban điều hành.
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="submit">
          <UFormField label="Tên đăng nhập" name="username">
            <UInput
              v-model="username"
              autocomplete="username"
              placeholder="Nhập tên đăng nhập..."
              class="w-full"
              icon="i-lucide-user"
              required
              autofocus
            />
          </UFormField>

          <UFormField label="Mật khẩu" name="password">
            <div class="relative w-full">
              <UInput
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Nhập mật khẩu..."
                class="w-full"
                icon="i-lucide-key-round"
                required
              />
              <button
                type="button"
                class="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                tabindex="-1"
                :aria-label="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
                @click="showPassword = !showPassword"
              >
                <UIcon :name="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="size-4" />
              </button>
            </div>
          </UFormField>

          <UAlert
            v-if="route.query.doi_mat_khau === '1'"
            color="success"
            variant="subtle"
            icon="i-lucide-check-circle"
            title="Đã cập nhật mật khẩu"
            description="Vì lý do bảo mật, vui lòng đăng nhập lại bằng mật khẩu mới."
          />

          <ErrorState :error="error" />

          <UAlert
            color="warning"
            variant="subtle"
            icon="i-lucide-shield-alert"
            title="Quy định bảo mật tài khoản"
            description="Sau 5 lần nhập sai liên tiếp, tài khoản sẽ tạm khóa 15 phút để đảm bảo an toàn."
          />

          <UButton
            type="submit"
            block
            size="lg"
            :loading="loading"
            class="mt-2 font-medium"
          >
            Đăng nhập
          </UButton>
        </form>

        <div class="text-center">
          <NuxtLink
            to="/xac-thuc-chung-chi"
            class="text-xs text-vatican-600 hover:underline dark:text-vatican-400"
          >
            Tra cứu chứng chỉ bí tích công khai →
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
