<template>
  <div class="min-h-screen bg-stone-50 dark:bg-stone-950 pb-16 transition-colors duration-300">
    <!-- Hero Banner with Mesh Gradient & Glassmorphism -->
    <div class="h-64 md:h-72 w-full relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-800 to-stone-900 dark:from-stone-800 dark:via-stone-900 dark:to-black">
      <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>
      <div class="absolute top-[-20%] left-[-10%] w-96 h-96 bg-primary-500/30 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-secondary-500/30 rounded-full blur-[100px]"></div>
    </div>

    <UContainer class="relative -mt-28 md:-mt-32">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        <!-- Left Sidebar: Profile Hero Card -->
        <div class="lg:col-span-4">
          <UCard class="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl shadow-xl shadow-stone-200/50 dark:shadow-black/50 border border-white/50 dark:border-stone-700/50 overflow-hidden sticky top-24 transition-all hover:shadow-2xl">
            <div class="flex flex-col items-center text-center p-6">
              
              <!-- Avatar -->
              <div class="relative group cursor-pointer mb-6" @click="$refs.fileInput.click()">
                <UAvatar
                  :src="user?.avatarPath ? `${config.public.apiBase}${user.avatarPath}` : undefined"
                  :alt="user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'"
                  size="3xl"
                  class="ring-4 ring-white dark:ring-stone-800 shadow-lg transition-transform duration-300 group-hover:scale-105"
                  :ui="{ background: 'bg-gradient-to-br from-primary-400 to-primary-600', text: 'text-white font-bold text-3xl' }"
                />
                <div class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <UIcon name="i-heroicons-camera" class="text-white w-6 h-6" />
                </div>
                <div v-if="isUploadingAvatar" class="absolute inset-0 bg-stone-100/80 dark:bg-stone-900/80 rounded-full flex items-center justify-center">
                  <UIcon name="i-heroicons-arrow-path" class="animate-spin text-primary-500 w-6 h-6" />
                </div>
              </div>
              <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onAvatarSelected" />

              <!-- User Names -->
              <h1 class="text-2xl font-black font-serif text-stone-900 dark:text-white leading-tight">
                <span v-if="user?.christianName" class="block text-primary-600 dark:text-primary-400 text-lg font-medium mb-1">{{ user.christianName }}</span>
                {{ user?.fullName || 'Người dùng' }}
              </h1>
              <p class="text-sm text-stone-500 dark:text-stone-400 font-medium mt-2">
                @{{ user?.username }}
              </p>

              <!-- Badges -->
              <div class="flex flex-wrap justify-center gap-2 mt-5 mb-6">
                <UBadge :color="getRoleColor(user?.role)" variant="soft" class="px-3 py-1 font-semibold rounded-full shadow-sm">
                  <UIcon name="i-heroicons-shield-check" class="w-4 h-4 mr-1.5" />
                  {{ getRoleName(user?.role) }}
                </UBadge>
                <UBadge v-if="user?.branch && user.branch > 0" :color="getBranchColor(user?.branch)" variant="soft" class="px-3 py-1 font-semibold rounded-full shadow-sm">
                  <UIcon name="i-heroicons-user-group" class="w-4 h-4 mr-1.5" />
                  Ngành {{ getBranchName(user?.branch) }}
                </UBadge>
              </div>

              <!-- Bio -->
              <p v-if="user?.bio" class="text-sm text-stone-600 dark:text-stone-300 italic px-2 mb-6 border-l-2 border-primary-500 text-left">
                "{{ user.bio }}"
              </p>

              <div class="w-full border-t border-stone-200 dark:border-stone-800 pt-5">
                <div class="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-3">
                  <span class="flex items-center gap-1.5"><UIcon name="i-heroicons-calendar" class="w-4 h-4" /> Tham gia từ</span>
                  <span class="font-semibold text-stone-700 dark:text-stone-200">
                    {{ user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '--/--/----' }}
                  </span>
                </div>
                <div class="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                  <span class="flex items-center gap-1.5"><UIcon name="i-heroicons-check-badge" class="w-4 h-4" /> Trạng thái</span>
                  <span class="text-success-500 font-semibold flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-success-500 animate-pulse"></span> Hoạt động
                  </span>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Right Content: Bento Box / Tabs -->
        <div class="lg:col-span-8">
          <UCard class="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl shadow-xl shadow-stone-200/50 dark:shadow-black/50 border border-white/50 dark:border-stone-700/50 min-h-[500px]">
            <UTabs :items="tabItems" class="w-full">
              
              <!-- TAB 1: OVERVIEW -->
              <template #overview>
                <div class="p-2 md:p-4 space-y-8 animate-fade-in-up">
                  
                  <!-- Section Header -->
                  <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 class="text-xl font-black text-stone-900 dark:text-white tracking-wide flex items-center gap-2">
                        Thông Tin <span class="text-primary-600 dark:text-primary-400">Cá Nhân</span>
                      </h3>
                      <p class="text-sm text-stone-500 dark:text-stone-400 mt-1">
                        Dữ liệu hồ sơ cơ bản từ hệ thống Quản lý Giáo lý.
                      </p>
                    </div>
                    <!-- Chuyển hướng sang trang con -->
                    <UButton 
                      to="/profile/edit" 
                      icon="i-heroicons-pencil-square" 
                      color="primary" 
                      variant="solid" 
                      label="Chỉnh Sửa" 
                      class="shadow-md transition-transform hover:-translate-y-0.5" 
                    />
                  </div>

                  <!-- Bento Grid Layout -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div class="p-5 rounded-2xl border border-stone-200/70 dark:border-stone-700/70 bg-white/50 dark:bg-stone-800/50 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-start gap-4 shadow-sm group">
                      <div class="p-2.5 bg-primary-100 dark:bg-primary-900/50 rounded-xl text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                        <UIcon name="i-heroicons-user" class="w-6 h-6" />
                      </div>
                      <div>
                        <p class="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-1">Họ Tên & Tên Thánh</p>
                        <p class="text-sm font-semibold text-stone-900 dark:text-white">
                          {{ user?.christianName ? user.christianName + ' ' : '' }}{{ user?.fullName || '---' }}
                        </p>
                      </div>
                    </div>

                    <div class="p-5 rounded-2xl border border-stone-200/70 dark:border-stone-700/70 bg-white/50 dark:bg-stone-800/50 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-start gap-4 shadow-sm group">
                      <div class="p-2.5 bg-sky-100 dark:bg-sky-900/50 rounded-xl text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
                        <UIcon name="i-heroicons-cake" class="w-6 h-6" />
                      </div>
                      <div>
                        <p class="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-1">Ngày sinh</p>
                        <p class="text-sm font-semibold text-stone-900 dark:text-white">
                          {{ user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật' }}
                        </p>
                      </div>
                    </div>

                    <div class="p-5 rounded-2xl border border-stone-200/70 dark:border-stone-700/70 bg-white/50 dark:bg-stone-800/50 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-start gap-4 shadow-sm group">
                      <div class="p-2.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                        <UIcon name="i-heroicons-envelope" class="w-6 h-6" />
                      </div>
                      <div>
                        <p class="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-1">Thư điện tử (Email)</p>
                        <p class="text-sm font-semibold text-stone-900 dark:text-white break-all">{{ user?.email || 'Chưa cập nhật' }}</p>
                      </div>
                    </div>

                    <div class="p-5 rounded-2xl border border-stone-200/70 dark:border-stone-700/70 bg-white/50 dark:bg-stone-800/50 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-start gap-4 shadow-sm group">
                      <div class="p-2.5 bg-amber-100 dark:bg-amber-900/50 rounded-xl text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                        <UIcon name="i-heroicons-phone" class="w-6 h-6" />
                      </div>
                      <div>
                        <p class="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-1">Số điện thoại</p>
                        <p class="text-sm font-semibold text-stone-900 dark:text-white">{{ user?.phoneNumber || 'Chưa cập nhật' }}</p>
                      </div>
                    </div>

                    <div class="p-5 md:col-span-2 rounded-2xl border border-stone-200/70 dark:border-stone-700/70 bg-white/50 dark:bg-stone-800/50 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-start gap-4 shadow-sm group">
                      <div class="p-2.5 bg-purple-100 dark:bg-purple-900/50 rounded-xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                        <UIcon name="i-heroicons-map-pin" class="w-6 h-6" />
                      </div>
                      <div class="w-full">
                        <p class="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-1">Địa chỉ</p>
                        <p class="text-sm font-semibold text-stone-900 dark:text-white">{{ user?.address || 'Chưa cập nhật địa chỉ thường trú' }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <!-- TAB 2: SETTINGS -->
              <template #settings>
                <div class="p-2 md:p-4 space-y-6 animate-fade-in-up">
                  <div class="mb-8">
                    <h3 class="text-xl font-black text-stone-900 dark:text-white tracking-wide flex items-center gap-2">
                      Cài Đặt <span class="text-primary-600 dark:text-primary-400">Giao Diện</span>
                    </h3>
                    <p class="text-sm text-stone-500 dark:text-stone-400 mt-1">
                      Cá nhân hóa trải nghiệm của bạn trên hệ thống.
                    </p>
                  </div>

                  <div class="space-y-4">
                    <div class="flex items-center justify-between p-5 rounded-2xl border border-stone-200/70 dark:border-stone-700/70 bg-white/50 dark:bg-stone-800/50 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors shadow-sm">
                      <div class="flex items-center gap-4">
                        <div class="p-3 bg-stone-100 dark:bg-stone-700 rounded-xl text-stone-600 dark:text-stone-300">
                          <UIcon :name="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'" class="w-6 h-6" />
                        </div>
                        <div>
                          <p class="font-bold text-stone-900 dark:text-white text-base">Giao diện (Dark Mode)</p>
                          <p class="text-sm text-stone-500 dark:text-stone-400">Chuyển đổi giao diện Sáng / Tối.</p>
                        </div>
                      </div>
                      <ClientOnly>
                        <USwitch v-model="isDarkModel" size="lg" color="primary" />
                        <template #fallback>
                          <div class="w-12 h-6 rounded-full bg-stone-200 dark:bg-stone-700 animate-pulse"></div>
                        </template>
                      </ClientOnly>
                    </div>

                    <!-- TÍNH NĂNG MỚI: Thông báo nhắc nhở Đọc Kinh -->
                    <div class="flex items-center justify-between p-5 rounded-2xl border border-stone-200/70 dark:border-stone-700/70 bg-white/50 dark:bg-stone-800/50 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors shadow-sm">
                      <div class="flex items-center gap-4">
                        <div class="p-3 bg-stone-100 dark:bg-stone-700 rounded-xl text-stone-600 dark:text-stone-300">
                          <UIcon name="i-heroicons-bell-alert" class="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                          <p class="font-bold text-stone-900 dark:text-white text-base">Nhắc Nhở Đọc Kinh</p>
                          <p class="text-sm text-stone-500 dark:text-stone-400">Nhận thông báo Lời Chúa và giờ kinh Sáng/Tối.</p>
                        </div>
                      </div>
                      <ClientOnly>
                        <USwitch v-model="isPrayerReminder" size="lg" color="primary" />
                        <template #fallback>
                          <div class="w-12 h-6 rounded-full bg-stone-200 dark:bg-stone-700 animate-pulse"></div>
                        </template>
                      </ClientOnly>
                    </div>
                  </div>
                </div>
              </template>

              <!-- TAB 3: SECURITY (Sử dụng UFormField thay vì UFormGroup) -->
              <template #security>
                <div class="p-2 md:p-4 space-y-6 animate-fade-in-up">
                  <div class="mb-8">
                    <h3 class="text-xl font-black text-stone-900 dark:text-white tracking-wide flex items-center gap-2">
                      Bảo Mật <span class="text-primary-600 dark:text-primary-400">& Đăng Nhập</span>
                    </h3>
                    <p class="text-sm text-stone-500 dark:text-stone-400 mt-1">
                      Quản lý thông tin bảo mật và mật khẩu của bạn.
                    </p>
                  </div>

                  <UAlert
                    icon="i-heroicons-shield-exclamation"
                    color="amber"
                    variant="soft"
                    title="Lưu ý Bảo mật"
                    description="Tuyệt đối không chia sẻ mật khẩu cho bất kỳ ai. Đổi mật khẩu ngay nếu nghi ngờ tài khoản bị lộ."
                    class="mb-8 shadow-sm rounded-xl border border-amber-200/50 dark:border-amber-900/50"
                  />

                  <div class="p-6 rounded-2xl border border-stone-200/70 dark:border-stone-700/70 bg-white/50 dark:bg-stone-800/50 shadow-sm">
                    <UForm :state="passwordForm" class="space-y-6" @submit="changePassword">
                      
                      <!-- Sửa UFormGroup thành UFormField -->
                      <UFormField label="Mật Khẩu Hiện Tại" name="oldPassword" required>
                        <UInput v-model="passwordForm.oldPassword" type="password" placeholder="••••••••" icon="i-heroicons-lock-closed" size="lg" color="primary" class="w-full" />
                      </UFormField>
                      
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <UFormField label="Mật Khẩu Mới" name="newPassword" required>
                          <UInput v-model="passwordForm.newPassword" type="password" placeholder="••••••••" icon="i-heroicons-key" size="lg" color="primary" class="w-full" />
                        </UFormField>
                        <UFormField label="Xác Nhận Mật Khẩu" name="confirmPassword" required>
                          <UInput v-model="passwordForm.confirmPassword" type="password" placeholder="••••••••" icon="i-heroicons-key" size="lg" color="primary" class="w-full" />
                        </UFormField>
                      </div>
                      
                      <div class="pt-4 flex justify-end">
                        <UButton type="submit" color="primary" size="lg" label="Lưu Mật Khẩu" icon="i-heroicons-check" :loading="isChangingPassword" class="shadow-md" />
                      </div>
                    </UForm>
                  </div>
                </div>
              </template>
            </UTabs>
          </UCard>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
import { useLocalStorage } from '@vueuse/core'

definePageMeta({
  layout: 'public'
})

useHead({
  title: 'Trang Cá Nhân - Thiếu Nhi Thánh Thể'
})

const authStore = useAuthStore()
const user = computed(() => authStore.user || {})
const config = useRuntimeConfig()
const toast = useToast()

onMounted(async () => {
  try {
    const res = await $api('/Profile/me')
    if (res) {
      authStore.updateProfile(res)
    }
  } catch (err) {
    console.error('Failed to fetch profile', err)
  }
})

// Avatar Logic
const fileInput = ref(null)
const isUploadingAvatar = ref(false)

const onAvatarSelected = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  isUploadingAvatar.value = true
  try {
    const formData = new FormData()
    formData.append('avatar', file)
    const res = await $api('/Profile/avatar', {
      method: 'POST',
      body: formData
    })
    authStore.updateProfile({ avatarPath: res.avatarPath })
    toast.add({ title: 'Cập nhật ảnh đại diện thành công', color: 'success' })
  } catch (error) {
    toast.add({ title: error?.response?._data || 'Lỗi tải ảnh', color: 'error' })
  } finally {
    isUploadingAvatar.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

// Theme logic
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const isDarkModel = computed({
  get: () => isDark.value,
  set: (val) => { colorMode.preference = val ? 'dark' : 'light' }
})



// New feature logic: Prayer reminders
const isPrayerReminder = useLocalStorage('prayer-reminder', false)
watch(isPrayerReminder, (val) => {
  if (val) {
    toast.add({ title: 'Đã bật nhắc nhở', description: 'Hệ thống sẽ gửi thông báo đến bạn vào mỗi giờ kinh Sáng và Tối.', color: 'primary', icon: 'i-heroicons-bell-alert' })
  } else {
    toast.add({ title: 'Đã tắt nhắc nhở', description: 'Bạn sẽ không nhận được thông báo nhắc nhở đọc kinh.', color: 'gray', icon: 'i-heroicons-bell-slash' })
  }
})

// Tabs Configuration
const tabItems = [
  { label: 'Tổng Quan', icon: 'i-heroicons-identification', slot: 'overview' },
  { label: 'Cài Đặt', icon: 'i-heroicons-cog-6-tooth', slot: 'settings' },
  { label: 'Bảo Mật', icon: 'i-heroicons-shield-check', slot: 'security' }
]

// Password Form Logic
const isChangingPassword = ref(false)
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const changePassword = async () => {
  if (!passwordForm.value.oldPassword || !passwordForm.value.newPassword) {
    toast.add({ title: 'Vui lòng nhập đầy đủ thông tin', color: 'error' })
    return
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    toast.add({ title: 'Mật khẩu xác nhận không khớp', color: 'error' })
    return
  }

  isChangingPassword.value = true
  try {
    await $api('/Profile/change-password', {
      method: 'PATCH',
      body: {
        oldPassword: passwordForm.value.oldPassword,
        newPassword: passwordForm.value.newPassword
      }
    })
    toast.add({ title: 'Đổi mật khẩu thành công!', color: 'success' })
    passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
  } catch (error) {
    toast.add({ title: error?.response?._data || 'Có lỗi xảy ra', color: 'error' })
  } finally {
    isChangingPassword.value = false
  }
}

// Helper functions for UI
const getRoleName = (role) => {
  const map = {
    1: 'Quản Trị Viên', Admin: 'Quản Trị Viên',
    2: 'Thư Ký', Secretary: 'Thư Ký',
    3: 'Huynh Trưởng', Moderator: 'Huynh Trưởng',
    4: 'Đoàn Sinh / Phụ Huynh', Viewer: 'Đoàn Sinh / Phụ Huynh'
  }
  return map[role] || 'Người Dùng'
}

const getRoleColor = (role) => {
  const map = {
    1: 'error', Admin: 'error',
    2: 'purple', Secretary: 'purple',
    3: 'success', Moderator: 'success',
    4: 'primary', Viewer: 'primary'
  }
  return map[role] || 'neutral'
}

const getBranchName = (branchId) => {
  const map = {
    1: 'Ấu Nhi', 2: 'Thiếu Nhi', 3: 'Nghĩa Sĩ', 4: 'Hiệp Sĩ'
  }
  return map[branchId] || ''
}

const getBranchColor = (branchId) => {
  const map = {
    1: 'success', 2: 'primary', 3: 'warning', 4: 'error'
  }
  return map[branchId] || 'neutral'
}
</script>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}
</style>
