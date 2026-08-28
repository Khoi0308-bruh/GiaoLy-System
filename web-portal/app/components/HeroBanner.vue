<template>
  <section class="relative h-[60vh] min-h-[400px] flex items-center justify-center bg-stone-900 overflow-hidden">
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1548625361-ecceabcce8f1?q=80&w=2000&auto=format&fit=crop"
        alt="Nhà thờ Công Giáo"
        class="w-full h-full object-cover opacity-60"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-900/40 to-transparent" />
    </div>

    <!-- Content -->
    <div class="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
      <h1 class="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight drop-shadow-md">
        Thiếu Nhi Thánh Thể Việt Nam
      </h1>
      <p class="text-lg md:text-xl text-blue-100 font-light mb-8 max-w-2xl mx-auto drop-shadow">
        Sứ Đoàn Thiếu Nhi Thánh Thể Giáo Xứ<br>
        Bổn mạng: Thánh Têrêsa Hài Đồng Giêsu
      </p>

      <div class="flex flex-wrap justify-center gap-4">
        <UButton
          size="lg"
          color="neutral"
          variant="solid"
          class="font-semibold shadow-lg hover:scale-105 transition-transform"
          to="/profile"
        >
          Đăng Nhập / Tra Cứu
        </UButton>
        <UButton
          size="lg"
          color="neutral"
          variant="ghost"
          class="font-semibold hover:bg-white/10 text-white"
          to="#thong-bao"
        >
          Xem Thông Báo
        </UButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// No extra logic required for banner
</script>
