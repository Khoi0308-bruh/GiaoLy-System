<template>
  <div class="max-w-md mx-auto bg-white dark:bg-stone-900 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800 p-8 text-center">
    <div class="relative w-24 h-24 mx-auto mb-4">
      <img
        :src="user.avatar"
        alt="Avatar"
        class="w-full h-full rounded-full object-cover border-4 border-blue-50 dark:border-blue-900/30 shadow-sm"
      >
      <!-- Badge ngành Thiếu nhi màu xanh dương -->
      <div
        class="absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-white dark:border-stone-900 flex items-center justify-center"
        :class="user.branchColor"
      />
    </div>

    <h2 class="text-2xl font-bold text-stone-900 dark:text-stone-100">
      {{ user.name }}
    </h2>
    <p class="text-blue-600 dark:text-blue-400 font-medium mb-1 mt-1">
      Ngành {{ user.branch }} - {{ user.className }}
    </p>
    <p class="text-sm text-stone-500 dark:text-stone-400 mb-6 flex items-center justify-center gap-1">
      <UIcon name="i-heroicons-map-pin" />
      Giáo khu: {{ user.zone }}
    </p>

    <div class="grid grid-cols-2 gap-4 text-left mb-6">
      <div class="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-100 dark:border-stone-800">
        <div class="text-xs text-stone-500 dark:text-stone-400 uppercase font-semibold tracking-wider mb-1">
          Điểm Giáo Lý
        </div>
        <div class="text-2xl font-black text-stone-800 dark:text-stone-200">
          {{ user.grade }}
        </div>
      </div>
      <div class="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-100 dark:border-stone-800">
        <div class="text-xs text-stone-500 dark:text-stone-400 uppercase font-semibold tracking-wider mb-1">
          Chuyên Cần
        </div>
        <div class="text-2xl font-black text-stone-800 dark:text-stone-200">
          {{ user.attendance }}%
        </div>
      </div>
    </div>

    <UButton
      block
      size="lg"
      color="primary"
      variant="solid"
      class="rounded-xl font-semibold shadow-sm hover:shadow transition-shadow"
    >
      Cập nhật thông tin
    </UButton>
    <UButton
      block
      size="md"
      color="neutral"
      variant="ghost"
      class="rounded-xl mt-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
    >
      Đăng xuất
    </UButton>
  </div>
</template>

<script setup lang="ts">
// Mock data for the logged-in user profile
const user = {
  name: 'Maria Nguyễn Văn A',
  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
  branch: 'Thiếu Nhi',
  branchColor: 'bg-green-500', // Thiếu nhi is green (wait, 5 colors: Ấu=Green, Thiếu=Blue, Nghĩa=Yellow, Hiệp=Brown, Trưởng=Red). Let me fix this.
  className: 'Lớp Thiếu 1',
  zone: 'Thánh Giuse',
  grade: '8.5',
  attendance: 95
}

// Adjusting the branch color correctly according to TNTT
user.branchColor = 'bg-blue-600'
</script>
