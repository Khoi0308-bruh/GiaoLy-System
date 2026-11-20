<script setup lang="ts">
import type { ApiError } from '~/composables/useApi'
import { toApiError } from '~/composables/useApi'

definePageMeta({ layout: 'admin' })

const session = useSessionStore()
const api = useApi()

// Profile form state
const fullName = ref(session.me?.fullName || '')
const email = ref(session.me?.email || '')
const phoneNumber = ref(session.me?.phoneNumber || '')
const profileLoading = ref(false)
const profileSuccess = ref(false)
const profileError = ref<ApiError | null>(null)

// Avatar upload state
const avatarInput = ref<HTMLInputElement | null>(null)
const avatarLoading = ref(false)
const avatarError = ref<ApiError | null>(null)
const avatarUrl = ref(session.me?.avatarUrl || session.me?.avatarPath || '')

// Password change state
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordLoading = ref(false)
const passwordSuccess = ref(false)
const passwordError = ref<ApiError | null>(null)

// Sync with session if loaded later
watch(() => session.me, (me) => {
  if (me) {
    fullName.value = me.fullName || ''
    email.value = me.email || ''
    phoneNumber.value = me.phoneNumber || ''
    avatarUrl.value = me.avatarUrl || me.avatarPath || ''
  }
}, { immediate: true })

async function updateProfile() {
  profileLoading.value = true
  profileSuccess.value = false
  profileError.value = null

  try {
    await api.put('/me/profile', {
      fullName: fullName.value,
      email: email.value || null,
      phoneNumber: phoneNumber.value || null
    })
    await session.loadMe()
    profileSuccess.value = true
    setTimeout(() => { profileSuccess.value = false }, 3000)
  } catch (e) {
    profileError.value = toApiError(e)
  } finally {
    profileLoading.value = false
  }
}

function triggerAvatarSelect() {
  avatarInput.value?.click()
}

async function handleAvatarChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  avatarLoading.value = true
  avatarError.value = null

  try {
    const formData = new FormData()
    formData.append('avatar', file)
    const res = await api.post<{ avatarUrl?: string }>('/me/avatar', formData)
    if (res?.avatarUrl) {
      avatarUrl.value = res.avatarUrl
    }
    await session.loadMe()
  } catch (e) {
    avatarError.value = toApiError(e)
  } finally {
    avatarLoading.value = false
    target.value = ''
  }
}

async function changePassword() {
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = new ApiError(400, 'VALIDATION_FAILED', 'Xác nhận mật khẩu mới không khớp.')
    return
  }

  passwordLoading.value = true
  passwordSuccess.value = false
  passwordError.value = null

  try {
    await api.post('/auth/change-password', {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value
    })
    passwordSuccess.value = true
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    // Đổi mật khẩu thu hồi phiên hiện tại, nên đăng nhập lại để nhận token mới.
    setTimeout(async () => {
      session.clear()
      await navigateTo('/dang-nhap?doi_mat_khau=1')
    }, 1500)
  } catch (e) {
    passwordError.value = toApiError(e)
  } finally {
    passwordLoading.value = false
  }
}

async function handleLogout() {
  await session.logout()
  await navigateTo('/dang-nhap')
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Hồ sơ cá nhân"
      subtitle="Quản lý thông tin tài khoản, ảnh đại diện và mật khẩu bảo mật"
    >
      <template #actions>
        <UButton
          color="error"
          variant="outline"
          icon="i-lucide-log-out"
          @click="handleLogout"
        >
          Đăng xuất
        </UButton>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Cột 1: Thông tin đại diện & Thẻ vai trò -->
      <div class="space-y-6">
        <div class="rounded-xl border border-stone-200 bg-white p-6 text-center shadow-xs dark:border-stone-800 dark:bg-stone-900">
          <!-- Khung vòm Gothic cho Avatar -->
          <div class="relative mx-auto mb-4 size-32">
            <div class="arch-frame grid size-full place-items-center overflow-hidden bg-vatican-100 text-vatican-700 shadow-inner dark:bg-vatican-900/40 dark:text-vatican-300">
              <img
                v-if="avatarUrl"
                :src="avatarUrl"
                :alt="session.me?.fullName || 'Avatar'"
                class="size-full object-cover"
              >
              <span v-else class="text-4xl font-serif">
                ✝
              </span>
            </div>

            <!-- Nút đổi avatar -->
            <button
              type="button"
              class="absolute -bottom-1 -right-1 grid size-9 place-items-center rounded-full border-2 border-white bg-marian-600 text-white shadow-sm hover:bg-marian-700 dark:border-stone-900"
              title="Thay đổi ảnh đại diện"
              :disabled="avatarLoading"
              @click="triggerAvatarSelect"
            >
              <UIcon :name="avatarLoading ? 'i-lucide-loader-2' : 'i-lucide-camera'" class="size-4" :class="avatarLoading ? 'animate-spin' : ''" />
            </button>
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleAvatarChange"
            >
          </div>

          <ErrorState :error="avatarError" class="mb-3 text-left" />

          <h2 class="text-xl font-bold text-stone-900 dark:text-white">
            {{ session.me?.fullName || 'Người dùng' }}
          </h2>
          <p class="text-xs text-stone-500">
            @{{ session.me?.userName }}
          </p>

          <div class="mt-3 flex justify-center">
            <UBadge color="primary" variant="subtle" size="md">
              {{ session.me?.role?.name || 'Thành viên' }}
            </UBadge>
          </div>

          <div class="gold-rule my-4 text-vatican-400" aria-hidden="true">
            <span>✠</span>
          </div>

          <!-- Chi tiết phân công -->
          <div class="space-y-2 text-left text-xs text-stone-600 dark:text-stone-400">
            <div class="flex items-center justify-between">
              <span class="text-stone-500">Phạm vi:</span>
              <strong class="text-stone-800 dark:text-stone-200">{{ session.me?.role?.scopeType }}</strong>
            </div>
            <div v-if="session.me?.branch" class="flex items-center justify-between">
              <span class="text-stone-500">Ngành:</span>
              <strong>{{ session.me.branch.name }}</strong>
            </div>
            <div v-if="session.me?.classRooms?.length" class="space-y-1">
              <span class="text-stone-500">Lớp phân công:</span>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="c in session.me.classRooms"
                  :key="c.id"
                  class="rounded bg-stone-100 px-1.5 py-0.5 font-medium text-stone-800 dark:bg-stone-800 dark:text-stone-200"
                >
                  {{ c.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cột 2 & 3: Biểu mẫu thông tin & Đổi mật khẩu -->
      <div class="space-y-6 lg:col-span-2">
        <!-- Form cập nhật thông tin -->
        <div class="rounded-xl border border-stone-200 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900">
          <h2 class="mb-4 text-lg font-bold text-stone-900 dark:text-white">
            Thông tin liên hệ
          </h2>

          <UAlert
            v-if="profileSuccess"
            color="success"
            variant="subtle"
            icon="i-lucide-check-circle"
            title="Đã lưu thay đổi thông tin thành công!"
            class="mb-4"
          />

          <ErrorState :error="profileError" class="mb-4" />

          <form class="space-y-4" @submit.prevent="updateProfile">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <UFormField label="Họ và tên" name="fullName" required class="sm:col-span-2">
                <UInput v-model="fullName" placeholder="Nhập họ và tên..." required class="w-full" />
              </UFormField>

              <UFormField label="Email" name="email">
                <UInput v-model="email" type="email" placeholder="Nhập địa chỉ email..." class="w-full" />
              </UFormField>

              <UFormField label="Số điện thoại" name="phoneNumber">
                <UInput v-model="phoneNumber" placeholder="Nhập số điện thoại..." class="w-full" />
              </UFormField>
            </div>

            <div class="flex justify-end pt-2">
              <UButton type="submit" :loading="profileLoading" icon="i-lucide-save">
                Lưu thông tin
              </UButton>
            </div>
          </form>
        </div>

        <!-- Form đổi mật khẩu định kỳ -->
        <div class="rounded-xl border border-stone-200 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900">
          <h2 class="mb-1 text-lg font-bold text-stone-900 dark:text-white">
            Đổi mật khẩu
          </h2>
          <p class="mb-4 text-xs text-stone-500">
            Mật khẩu mới tối thiểu 10 ký tự, không chứa tên đăng nhập và không quá phổ biến.
          </p>

          <UAlert
            v-if="passwordSuccess"
            color="success"
            variant="subtle"
            icon="i-lucide-check-circle"
            title="Đã đổi mật khẩu thành công!"
            class="mb-4"
          />

          <ErrorState :error="passwordError" class="mb-4" />

          <form class="space-y-4" @submit.prevent="changePassword">
            <UFormField label="Mật khẩu hiện tại" name="currentPassword" required>
              <UInput
                v-model="currentPassword"
                type="password"
                autocomplete="current-password"
                placeholder="Nhập mật khẩu hiện tại..."
                class="w-full"
                required
              />
            </UFormField>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <UFormField label="Mật khẩu mới" name="newPassword" required>
                <UInput
                  v-model="newPassword"
                  type="password"
                  autocomplete="new-password"
                  placeholder="Tối thiểu 10 ký tự..."
                  class="w-full"
                  required
                />
              </UFormField>

              <UFormField label="Xác nhận mật khẩu mới" name="confirmPassword" required>
                <UInput
                  v-model="confirmPassword"
                  type="password"
                  autocomplete="new-password"
                  placeholder="Nhập lại mật khẩu mới..."
                  class="w-full"
                  required
                />
              </UFormField>
            </div>

            <div class="flex justify-end pt-2">
              <UButton
                type="submit"
                variant="outline"
                color="primary"
                :loading="passwordLoading"
                :disabled="!currentPassword || !newPassword || !confirmPassword"
                icon="i-lucide-key"
              >
                Cập nhật mật khẩu
              </UButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
