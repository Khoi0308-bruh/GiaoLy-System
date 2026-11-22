<template>
  <div class="max-w-6xl mx-auto p-4 md:p-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold font-serif text-marian-blue-900 dark:text-white">
          Quản Lý Hội Trại
        </h1>
        <p class="text-stone-600 dark:text-stone-400 mt-2">
          Theo dõi đăng ký, thu phí và phân đội cho các kỳ Sa mạc.
        </p>
      </div>
      <UButton
        icon="i-lucide-arrow-left"
        variant="soft"
        color="gray"
        to="/catechist"
      >
        Trở về
      </UButton>
    </div>

    <UCard class="bg-white/80 dark:bg-stone-900">
      <div class="p-8 text-center text-stone-500">
        <UIcon
          name="i-lucide-tent"
          class="w-12 h-12 mx-auto mb-4 text-stone-300"
        />
        <p>Giao diện danh sách Hội trại đang được tích hợp...</p>
      </div>
    </UCard>
  </div>
</template>
