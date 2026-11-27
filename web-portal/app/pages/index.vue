<script setup lang="ts">
import HeroSection from '~/components/home/HeroSection.vue'
import SpiritualSection from '~/components/home/SpiritualSection.vue'
import NewsAndAnnouncementsSection from '~/components/home/NewsAndAnnouncementsSection.vue'
import TenCommandmentsSection from '~/components/home/TenCommandmentsSection.vue'

definePageMeta({ public: true })

useHead({
  title: 'Trang Chủ - Thiếu Nhi Thánh Thể'
})
</script>

<template>
  <div class="pb-16">
    <!-- Tiêu đề cấp 1 duy nhất của trang: tiêu đề banner chỉ là h2 nên trang chủ
         vẫn cần một h1 (ẩn thị giác, dành cho SEO/trình đọc màn hình). -->
    <h1 class="sr-only">Giáo Lý Thiếu Nhi Thánh Thể – Trang Chủ</h1>

    <HeroSection />

    <!-- Nội dung chính (bọc khung tiêu chuẩn sang trọng) -->
    <div class="w-full max-w-[1240px] mx-auto px-4 sm:px-6 flex flex-col gap-12">
      <!-- ══════════════════════════════════════════════════════════════
           TRA CỨU NHANH HỌC VỤ & ĐIỂM SỐ — Spiritual Premium Widget
      ══════════════════════════════════════════════════════════════════ -->
      <div
        class="relative rounded-3xl p-6 md:p-10 overflow-hidden shadow-xl border transition-all duration-300"
        style="
          background: linear-gradient(135deg, rgba(250,248,243,0.95) 0%, rgba(240,236,224,0.9) 100%);
          border-color: rgba(201,169,110,0.3);
          box-shadow: 0 16px 40px rgba(26,58,107,0.08);
        "
      >
        <!-- Họa tiết watermark thánh giá chìm -->
        <div class="absolute inset-0 cross-pattern opacity-40 pointer-events-none" />

        <!-- Ánh sáng hào quang trang trí -->
        <div
          class="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
          style="background: radial-gradient(circle, rgba(201,169,110,0.18) 0%, transparent 70%);"
        />
        <div
          class="absolute -bottom-16 -left-16 w-56 h-56 rounded-full pointer-events-none"
          style="background: radial-gradient(circle, rgba(26,58,107,0.12) 0%, transparent 70%);"
        />

        <UIcon
          name="i-heroicons-academic-cap"
          class="absolute -right-4 -bottom-4 w-44 h-44 opacity-5 rotate-12 pointer-events-none"
          style="color: #1a3a6b;"
        />

        <div class="relative z-10 max-w-3xl mx-auto">
          <div class="flex flex-col items-center justify-center gap-2 mb-6 text-center">
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md mb-1"
              style="background: linear-gradient(135deg, #1a3a6b, #2a5298);"
            >
              <UIcon
                name="i-heroicons-magnifying-glass"
                class="w-7 h-7 text-white"
              />
            </div>
            <span
              class="text-xs font-black uppercase tracking-[0.25em]"
              style="color: #a07840;"
            >
              Học Vụ Đoàn Sinh
            </span>
            <h2
              class="text-2xl sm:text-3xl font-black font-serif tracking-tight"
              style="color: #1a3a6b;"
            >
              Tra Cứu Điểm & Hồ Sơ Nhanh
            </h2>
            <p class="text-sm text-stone-500 max-w-md">
              Nhập mã đoàn sinh hoặc họ tên để xem kết quả học tập giáo lý và tiến trình bí tích
            </p>
          </div>

          <div
            class="p-6 md:p-8 rounded-2xl shadow-lg border backdrop-blur-md"
            style="
              background: rgba(255, 255, 255, 0.85);
              border-color: rgba(201,169,110,0.25);
            "
          >
            <PortalVerifyWidget />
          </div>
        </div>
      </div>

      <!-- Khối Lời Chúa & Lịch Phụng Vụ -->
      <SpiritualSection />

      <!-- Bảng Tin & Thông Báo -->
      <NewsAndAnnouncementsSection />

      <!-- Mười Điều Răn -->
      <TenCommandmentsSection />
    </div>
  </div>
</template>
