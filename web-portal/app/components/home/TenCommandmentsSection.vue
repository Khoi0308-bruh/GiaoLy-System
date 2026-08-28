<script setup lang="ts">
const commandmentsLeft = [
  'Thờ phượng một Đức Chúa Trời và kính mến Người trên hết mọi sự.',
  'Chớ kêu tên Đức Chúa Trời vô cớ.',
  'Giữ ngày Chúa Nhật.'
]

const commandmentsRight = [
  'Thảo kính cha mẹ.',
  'Chớ giết người.',
  'Chớ làm sự dâm dục.',
  'Chớ lấy của người.',
  'Chớ làm chứng dối.',
  'Chớ muốn vợ chồng người.',
  'Chớ tham của người.'
]
</script>

<template>
  <div class="bg-gradient-to-b from-stone-50 to-stone-100 dark:from-stone-900 dark:to-black rounded-3xl p-8 md:p-12 shadow-sm border border-stone-200 dark:border-stone-800 text-center relative overflow-hidden mb-12">
    <!-- Họa tiết mờ hai bên -->
    <UIcon
      name="i-heroicons-book-open"
      class="w-40 h-40 absolute -bottom-10 -left-10 text-stone-200/50 dark:text-stone-800/50"
    />
    <UIcon
      name="i-heroicons-scale"
      class="w-40 h-40 absolute -top-10 -right-10 text-stone-200/50 dark:text-stone-800/50"
    />

    <div class="relative z-10">
      <h2 class="text-3xl md:text-4xl font-black text-stone-800 dark:text-white uppercase tracking-widest mb-2 font-serif">
        Mười Điều Răn
      </h2>
      <p class="text-stone-500 dark:text-stone-400 mb-10 italic">
        Luật Chúa ban cho Môsê trên núi Sinai
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 max-w-5xl mx-auto text-left">
        <!-- Bia đá bên trái (3 Điều Răn đầu) -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-center mb-2">
            <div class="h-px w-16 bg-gradient-to-r from-transparent to-amber-500" />
            <h3 class="mx-4 font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest text-sm">
              Bổn Phận Với Thiên Chúa
            </h3>
            <div class="h-px w-16 bg-gradient-to-l from-transparent to-amber-500" />
          </div>

          <div
            v-for="(text, index) in commandmentsLeft"
            :key="index"
            class="group relative bg-white/80 dark:bg-[#242526]/80 backdrop-blur-sm p-5 md:p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700 hover:border-amber-400/50 hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <!-- Watermark số thứ tự khi hover -->
            <div class="absolute -right-4 -bottom-8 text-[120px] font-black text-stone-100 dark:text-stone-800/30 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 select-none z-0">
              {{ index + 1 }}
            </div>

            <div class="relative z-10 flex items-start gap-4">
              <div class="text-3xl font-black text-amber-500 dark:text-amber-600 mt-1 leading-none drop-shadow-sm">
                {{ index + 1 }}
              </div>
              <p class="font-medium text-base text-stone-800 dark:text-stone-200 leading-relaxed">
                {{ text }}
              </p>
            </div>
          </div>
        </div>

        <!-- Bia đá bên phải (7 Điều Răn sau) -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-center mb-2">
            <div class="h-px w-16 bg-gradient-to-r from-transparent to-amber-500" />
            <h3 class="mx-4 font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest text-sm">
              Bổn Phận Với Tha Nhân
            </h3>
            <div class="h-px w-16 bg-gradient-to-l from-transparent to-amber-500" />
          </div>

          <div
            v-for="(text, index) in commandmentsRight"
            :key="index"
            class="group relative bg-white/80 dark:bg-[#242526]/80 backdrop-blur-sm p-5 md:p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700 hover:border-amber-400/50 hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <!-- Watermark số thứ tự khi hover -->
            <div class="absolute -right-4 -bottom-8 text-[120px] font-black text-stone-100 dark:text-stone-800/30 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 select-none z-0">
              {{ index + 4 }}
            </div>

            <div class="relative z-10 flex items-start gap-4">
              <div class="text-3xl font-black text-amber-500 dark:text-amber-600 mt-1 leading-none drop-shadow-sm">
                {{ index + 4 }}
              </div>
              <p class="font-medium text-base text-stone-800 dark:text-stone-200 leading-relaxed">
                {{ text }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
