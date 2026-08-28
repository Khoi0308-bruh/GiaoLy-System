<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-stone-50 dark:bg-stone-900">
    <!-- Nửa trái: Nghệ thuật thị giác -->
    <div class="hidden md:flex md:w-1/2 lg:w-3/5 relative bg-stone-900 overflow-hidden items-center justify-center">
      <!-- Background Image -->
      <img
        src="https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=2000&auto=format&fit=crop"
        class="absolute inset-0 w-full h-full object-cover opacity-30 blur-[2px] transition-all duration-1000"
        alt="Church Interior"
      >
      <div class="absolute inset-0 bg-gradient-to-tr from-marian-blue-950/90 via-marian-blue-900/60 to-transparent" />

      <div class="relative z-10 p-12 text-center animate-fade-in-up">
        <UIcon
          name="i-heroicons-sparkles"
          class="w-16 h-16 text-vatican-gold-400 mx-auto mb-6 drop-shadow-lg"
        />
        <h1 class="font-serif text-5xl lg:text-6xl font-black text-white leading-tight mb-6 drop-shadow-md">
          Ánh Sáng <br><span class="text-vatican-gold-400">Tân Phúc Âm Hóa</span>
        </h1>
        <p class="text-stone-300 text-lg italic max-w-md mx-auto drop-shadow-md">
          "Cứ để trẻ em đến với Thầy, đừng ngăn cấm chúng, vì Nước Thiên Chúa là của những ai giống như chúng."
        </p>
      </div>
    </div>

    <!-- Nửa phải: Form Login -->
    <div class="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-8 lg:p-16 relative">
      <!-- Subtle background glow -->
      <div class="absolute inset-0 bg-gradient-to-br from-marian-blue-50/50 to-white dark:from-stone-900 dark:to-stone-950 -z-10" />

      <div
        class="w-full max-w-sm animate-fade-in-up"
        style="animation-delay: 0.2s;"
      >
        <div class="text-center mb-10">
          <NuxtLink
            to="/"
            class="inline-block p-2 rounded-xl bg-primary-50 dark:bg-stone-800 text-primary-600 mb-6 hover:scale-105 transition-transform"
          >
            <UIcon
              name="i-heroicons-home"
              class="w-6 h-6"
            />
          </NuxtLink>
          <h2 class="text-3xl font-black text-stone-800 dark:text-white uppercase tracking-wider mb-2">
            Đăng Nhập
          </h2>
          <p class="text-stone-500 text-sm">
            Cổng thông tin quản trị Sứ đoàn Thiếu Nhi Thánh Thể
          </p>
        </div>

        <form
          class="space-y-6"
          @submit.prevent="handleLogin"
        >
          <UFormField
            label="Tên đăng nhập"
            name="username"
          >
            <UInput
              v-model="form.username"
              icon="i-heroicons-user"
              placeholder="Nhập tài khoản"
              size="xl"
              class="w-full"
              variant="soft"
              autofocus
              :ui="{ base: 'focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-shadow' }"
            />
          </UFormField>

          <UFormField
            label="Mật khẩu"
            name="password"
          >
            <UInput
              v-model="form.password"
              type="password"
              icon="i-heroicons-lock-closed"
              placeholder="••••••••"
              size="xl"
              class="w-full"
              variant="soft"
              :ui="{ base: 'focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-shadow' }"
            />
          </UFormField>

          <UButton
            type="submit"
            block
            color="primary"
            size="xl"
            :loading="loading"
            class="mt-8 font-bold tracking-wide shadow-sm"
          >
            Vào Hệ Thống
          </UButton>
        </form>

        <div class="mt-8 text-center text-xs text-stone-400">
          <p>&copy; {{ new Date().getFullYear() }} GiaoLy Vision.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false }) // Tắt layout mặc định cho trang login
const auth = useAuthStore()
const toast = useToast()
const loading = ref(false)
const form = reactive({ username: '', password: '' })
const config = useRuntimeConfig()

const handleLogin = async () => {
  loading.value = true
  try {
    const res = await $fetch(`${config.public.apiBase}/Auth/login`, {
      method: 'POST',
      body: form
    })
    auth.setAuth(res)
    navigateTo('/') // Đăng nhập xong về trang chủ
  } catch {
    toast.add({ 
      title: 'Đăng nhập thất bại', 
      description: 'Sai tài khoản hoặc mật khẩu!', 
      color: 'red', 
      icon: 'i-heroicons-x-circle' 
    })
  } finally {
    loading.value = false
  }
}
</script>
