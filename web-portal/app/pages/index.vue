<script setup lang="ts">
import HeroSection from '~/components/home/HeroSection.vue'
import SpiritualSection from '~/components/home/SpiritualSection.vue'
import NewsAndAnnouncementsSection from '~/components/home/NewsAndAnnouncementsSection.vue'
import TenCommandmentsSection from '~/components/home/TenCommandmentsSection.vue'
</script>

<template>
  <div class="pb-10">
    <HeroSection />

    <!-- Nội dung chính (bị giới hạn độ rộng để dễ đọc) -->
    <div class="w-full max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col gap-10">
      <!-- Hàng: Tra cứu điểm -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-[#242526] dark:to-stone-900 rounded-3xl p-6 md:p-10 shadow-sm border border-blue-100 dark:border-stone-800 relative overflow-hidden">
        <UIcon
          name="i-heroicons-academic-cap"
          class="absolute -right-4 -bottom-4 w-40 h-40 text-blue-500/10 dark:text-blue-500/5 rotate-12 pointer-events-none"
        />
        <div class="relative z-10 max-w-2xl mx-auto">
          <div class="flex items-center justify-center gap-3 mb-6">
            <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <UIcon
                name="i-heroicons-magnifying-glass"
                class="w-6 h-6 text-blue-600 dark:text-blue-400"
              />
            </div>
            <h2 class="text-2xl font-bold text-stone-800 dark:text-white uppercase tracking-wider text-center">
              Tra Cứu Điểm Nhanh
            </h2>
          </div>
          <div class="bg-white/80 dark:bg-[#18191a]/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/50 dark:border-stone-700">
            <PortalVerifyWidget />
          </div>
        </div>
      </div>

      <SpiritualSection />
      <NewsAndAnnouncementsSection />
      <TenCommandmentsSection />
    </div>
  </div>
</template>
