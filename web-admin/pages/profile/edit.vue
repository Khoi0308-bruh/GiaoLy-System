<template>
  <div class="min-h-screen bg-stone-50 dark:bg-stone-950 py-12 transition-colors duration-300">
    <UContainer maxWidth="3xl">
      <!-- Back Button -->
      <div class="mb-6">
        <UButton
          to="/profile"
          icon="i-heroicons-arrow-left"
          color="gray"
          variant="ghost"
          label="Quay lại hồ sơ"
          class="hover:-translate-x-1 transition-transform"
        />
      </div>

      <!-- Edit Card -->
      <UCard class="bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl shadow-xl shadow-stone-200/50 dark:shadow-black/50 border border-white/50 dark:border-stone-700/50 rounded-2xl animate-fade-in-up">
        
        <template #header>
          <div class="flex items-center gap-4">
            <div class="p-3 bg-primary-100 dark:bg-primary-900/50 rounded-xl text-primary-600 dark:text-primary-400">
              <UIcon name="i-heroicons-pencil-square" class="w-8 h-8" />
            </div>
            <div>
              <h2 class="text-2xl font-black text-stone-900 dark:text-white tracking-tight">Cập Nhật Hồ Sơ</h2>
              <p class="text-sm text-stone-500 dark:text-stone-400 mt-0.5">Chỉnh sửa và bổ sung thông tin cá nhân của bạn.</p>
            </div>
          </div>
        </template>

        <UForm :state="editForm" class="space-y-8 py-2" @submit="submitEditProfile" @error="onFormError">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField label="Tên Thánh" name="christianName">
              <UInput v-model="editForm.christianName" placeholder="Ví dụ: Giuse" size="xl" color="primary" class="w-full" />
            </UFormField>
            
            <UFormField label="Họ và Tên" name="fullName" required>
              <UInput v-model="editForm.fullName" placeholder="Nhập họ và tên..." size="xl" color="primary" class="w-full" />
            </UFormField>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField label="Thư điện tử (Email)" name="email">
              <UInput v-model="editForm.email" type="email" placeholder="example@email.com" icon="i-heroicons-envelope" size="xl" color="primary" class="w-full" />
            </UFormField>
            
            <UFormField label="Số điện thoại" name="phoneNumber">
              <UInput v-model="editForm.phoneNumber" placeholder="09xxxxxxxx" icon="i-heroicons-phone" size="xl" color="primary" class="w-full" />
            </UFormField>
          </div>

          <UFormField label="Ngày sinh" name="dateOfBirth">
            <UInput v-model="editForm.dateOfBirth" type="date" icon="i-heroicons-calendar" size="xl" color="primary" class="w-full" />
          </UFormField>

          <UFormField label="Địa chỉ" name="address">
            <UInput v-model="editForm.address" placeholder="Nhập địa chỉ của bạn..." icon="i-heroicons-map-pin" size="xl" color="primary" class="w-full" />
          </UFormField>
          
          <UFormField label="Giới thiệu bản thân (Bio)" name="bio">
            <UTextarea v-model="editForm.bio" placeholder="Vài dòng giới thiệu..." :rows="4" size="xl" color="primary" class="w-full" />
          </UFormField>

          <div class="flex justify-end gap-4 pt-8 border-t border-stone-200 dark:border-stone-800">
            <UButton to="/profile" label="Hủy bỏ" color="gray" variant="soft" size="xl" class="px-6" />
            <UButton type="submit" label="Lưu thay đổi" color="primary" size="xl" icon="i-heroicons-check" :loading="isSavingProfile" class="shadow-md px-8 font-bold tracking-wide" />
          </div>

        </UForm>

      </UCard>
    </UContainer>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'public'
})

useHead({
  title: 'Cập Nhật Hồ Sơ - Thiếu Nhi Thánh Thể'
})

const authStore = useAuthStore()
const user = computed(() => authStore.user || {})
const toast = useToast()

const isSavingProfile = ref(false)
const editForm = ref({
  christianName: '',
  fullName: '',
  email: '',
  phoneNumber: '',
  dateOfBirth: '',
  address: '',
  bio: ''
})

onMounted(async () => {
  // Lấy dữ liệu profile mới nhất khi vào trang
  try {
    const res = await $api('/Profile/me')
    if (res) {
      authStore.updateProfile(res)
    }
  } catch (err) {
    console.error('Failed to fetch profile', err)
  }

  // Chuyển đổi dateOfBirth sang định dạng yyyy-mm-dd
  let dobString = ''
  if (user.value.dateOfBirth) {
    const d = new Date(user.value.dateOfBirth)
    if (!isNaN(d.getTime())) {
      dobString = d.toISOString().split('T')[0]
    }
  }

  editForm.value = {
    christianName: user.value.christianName || '',
    fullName: user.value.fullName || '',
    email: user.value.email || '',
    phoneNumber: user.value.phoneNumber || '',
    dateOfBirth: dobString,
    address: user.value.address || '',
    bio: user.value.bio || ''
  }
})

const submitEditProfile = async () => {
  isSavingProfile.value = true
  try {
    const payload = { ...editForm.value }
    if (!payload.dateOfBirth) {
      payload.dateOfBirth = null
    }

    const res = await $api('/Profile/update', {
      method: 'PUT',
      body: payload
    })
    
    authStore.updateProfile(res.user)
    toast.add({ title: 'Cập nhật hồ sơ thành công', color: 'success' })
    
    // Quay về trang profile sau khi lưu thành công
    navigateTo('/profile')
  } catch (error) {
    if (error?.response?._data?.errors) {
       toast.add({ title: 'Vui lòng kiểm tra lại thông tin nhập', color: 'error' })
    } else {
       toast.add({ title: error?.response?._data || 'Có lỗi xảy ra', color: 'error' })
    }
  } finally {
    isSavingProfile.value = false
  }
}

const onFormError = (event) => {
  const element = document.getElementById(event.errors[0].id)
  element?.focus()
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.4s ease-out forwards;
}
</style>
