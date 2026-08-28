<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'Hồ Sơ Cá Nhân – GiaoLy' })

const user = {
  name: 'Maria Nguyễn Văn A',
  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
  branch: 'Thiếu Nhi',
  role: 'Đoàn Sinh',
  className: 'Lớp Thiếu 1',
  zone: 'Thánh Giuse',
  dob: '15/08/2012',
  phone: '0901234567',
  email: 'maria.a@example.com',
  sacraments: {
    baptism: 'Đã nhận',
    eucharist: 'Đã nhận',
    confirmation: 'Chưa nhận'
  },
  grade: 8.5,
  attendance: 95
}

const tabItems = [
  { label: 'Tổng quan', icon: 'i-heroicons-user' },
  { label: 'Lịch Học & Dạy', icon: 'i-heroicons-calendar-days' },
  { label: 'Chứng từ / Bí Tích', icon: 'i-heroicons-document-check' }
]
</script>

<template>
  <div class="space-y-6 pb-12">
    <!-- Header Profile Card (Banner + Avatar) -->
    <div class="relative glass-card overflow-hidden">
      <!-- Gradient Banner -->
      <div class="h-40 w-full tntt-banner" />

      <div class="px-6 sm:px-10 pb-8">
        <div class="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16 relative z-10">
          <div class="relative w-32 h-32 shrink-0">
            <img
              :src="user.avatar"
              alt="Avatar"
              class="w-full h-full object-cover rounded-full border-4 border-white dark:border-stone-900 shadow-lg bg-stone-100"
            >
            <div class="absolute bottom-1 right-1 w-8 h-8 rounded-full border-2 border-white dark:border-stone-900 chip-thieu-nhi shadow-sm flex items-center justify-center">
              <UIcon
                name="i-heroicons-star"
                class="w-4 h-4"
              />
            </div>
          </div>

          <div class="flex-1 space-y-1 sm:mb-2">
            <div class="flex items-center gap-3">
              <h1 class="text-3xl font-extrabold text-stone-900 dark:text-white">
                {{ user.name }}
              </h1>
              <UBadge
                color="primary"
                variant="subtle"
              >
                {{ user.role }}
              </UBadge>
            </div>
            <p class="text-stone-600 dark:text-stone-300 font-medium text-lg">
              Ngành {{ user.branch }} &bull; {{ user.className }}
            </p>
          </div>

          <div class="sm:mb-2 flex gap-3">
            <UButton
              color="neutral"
              variant="solid"
              icon="i-heroicons-pencil-square"
              class="shadow-sm"
            >
              Sửa hồ sơ
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs Component -->
    <UTabs
      :items="tabItems"
      class="w-full"
    >
      <template #content="{ index }">
        <!-- TỔNG QUAN -->
        <div
          v-if="index === 0"
          class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4"
        >
          <!-- Left Column: Personal Info -->
          <div class="lg:col-span-2 glass-card p-6 space-y-6 border border-stone-200/50 dark:border-stone-700/50">
            <h2 class="text-xl font-bold text-stone-800 dark:text-white border-b border-stone-100 dark:border-stone-800 pb-3">
              Thông Tin Cá Nhân
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <p class="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Ngày sinh
                </p>
                <p class="font-medium text-stone-900 dark:text-stone-100">
                  {{ user.dob }}
                </p>
              </div>
              <div>
                <p class="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Giáo khu
                </p>
                <p class="font-medium text-stone-900 dark:text-stone-100">
                  {{ user.zone }}
                </p>
              </div>
              <div>
                <p class="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Điện thoại
                </p>
                <p class="font-medium text-stone-900 dark:text-stone-100">
                  {{ user.phone }}
                </p>
              </div>
              <div>
                <p class="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Email
                </p>
                <p class="font-medium text-stone-900 dark:text-stone-100">
                  {{ user.email }}
                </p>
              </div>
            </div>
          </div>

          <!-- Right Column: Academic Stats -->
          <div class="space-y-6">
            <div class="glass-card p-6 border border-stone-200/50 dark:border-stone-700/50 flex flex-col items-center justify-center text-center">
              <div class="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-3">
                <UIcon
                  name="i-heroicons-academic-cap"
                  class="w-8 h-8 text-rose-600 dark:text-rose-400"
                />
              </div>
              <h3 class="text-stone-500 dark:text-stone-400 font-semibold uppercase tracking-wider text-sm mb-1">
                Điểm Trung Bình
              </h3>
              <p class="text-4xl font-black text-stone-800 dark:text-white">
                {{ user.grade }}
              </p>
            </div>

            <div class="glass-card p-6 border border-stone-200/50 dark:border-stone-700/50 flex flex-col items-center justify-center text-center">
              <div class="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3">
                <UIcon
                  name="i-heroicons-clock"
                  class="w-8 h-8 text-amber-600 dark:text-amber-400"
                />
              </div>
              <h3 class="text-stone-500 dark:text-stone-400 font-semibold uppercase tracking-wider text-sm mb-1">
                Tỷ lệ Chuyên Cần
              </h3>
              <p class="text-4xl font-black text-stone-800 dark:text-white">
                {{ user.attendance }}%
              </p>
            </div>
          </div>
        </div>

        <!-- LỊCH HỌC -->
        <div
          v-if="index === 1"
          class="glass-card p-8 text-center mt-4 border border-stone-200/50 dark:border-stone-700/50"
        >
          <UIcon
            name="i-heroicons-calendar"
            class="w-16 h-16 text-stone-300 mx-auto mb-4"
          />
          <h3 class="text-lg font-semibold text-stone-800 dark:text-white">
            Lịch Học Trống
          </h3>
          <p class="text-stone-500 mt-2">
            Hiện tại chưa có lịch học nào được xếp cho tuần này.
          </p>
        </div>

        <!-- CHỨNG TỪ BÍ TÍCH -->
        <div
          v-if="index === 2"
          class="glass-card p-6 mt-4 border border-stone-200/50 dark:border-stone-700/50"
        >
          <h2 class="text-xl font-bold text-stone-800 dark:text-white mb-6">
            Trạng Thái Bí Tích
          </h2>

          <div class="space-y-4 max-w-2xl">
            <!-- Rửa Tội -->
            <div class="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl">
              <div class="flex items-center gap-3">
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-6 h-6 text-green-500"
                />
                <span class="font-medium text-stone-900 dark:text-stone-100">Bí Tích Rửa Tội</span>
              </div>
              <UBadge
                color="success"
                variant="soft"
              >
                Đã nhận
              </UBadge>
            </div>

            <!-- Rước Lễ -->
            <div class="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl">
              <div class="flex items-center gap-3">
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-6 h-6 text-green-500"
                />
                <span class="font-medium text-stone-900 dark:text-stone-100">Bí Tích Rước Lễ Lần Đầu</span>
              </div>
              <UBadge
                color="success"
                variant="soft"
              >
                Đã nhận
              </UBadge>
            </div>

            <!-- Thêm Sức -->
            <div class="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl">
              <div class="flex items-center gap-3">
                <UIcon
                  name="i-heroicons-clock"
                  class="w-6 h-6 text-stone-400"
                />
                <span class="font-medium text-stone-900 dark:text-stone-100">Bí Tích Thêm Sức</span>
              </div>
              <UBadge
                color="neutral"
                variant="soft"
              >
                Chưa nhận
              </UBadge>
            </div>
          </div>
        </div>
      </template>
    </UTabs>
  </div>
</template>
