<script setup lang="ts">
interface BannerItem {
  id: string
  title: string
  subtitle?: string
  tag?: string
  tagColor?: string
  imageUrl: string
  link?: string
  ctaText?: string
  orderIndex?: number
  isActive?: boolean
}

// Gọi API lấy danh sách banner đang hoạt động
const { data: apiBanners } = await useFetch<BannerItem[]>('/api/banners/active', {
  baseURL: 'https://localhost:7198'
})

// Dữ liệu mẫu phong phú khi API chưa có hoặc đang tải
const fallbackBanners: BannerItem[] = [
  {
    id: '1',
    title: 'Khơi Nguồn Đức Tin – Đồng Hành Cùng Giới Trẻ',
    subtitle: 'Năm học Giáo lý mới với chủ đề "Cầu Nguyện • Rước Lễ • Hy Sinh • Làm Tông Đồ"',
    tag: '✨ NĂM HỌC MỚI',
    tagColor: 'warning',
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=2000&auto=format&fit=crop',
    link: '/news',
    ctaText: 'Khám Phá Ngay'
  },
  {
    id: '2',
    title: 'Đại Hội Huynh Trưởng & Đoàn Sinh Xứ Đoàn',
    subtitle: 'Tổng kết phong trào Thiếu Nhi Thánh Thể và tuyên hứa Ban Điều Hành nhiệm kỳ mới.',
    tag: '✝ SỰ KIỆN NỔI BẬT',
    tagColor: 'error',
    imageUrl: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=2071&auto=format&fit=crop',
    link: '/thong-bao',
    ctaText: 'Xem Chương Trình'
  }
]

const bannerList = computed(() => {
  if (apiBanners.value && apiBanners.value.length > 0) {
    return apiBanners.value
  }
  return fallbackBanners
})

const searchQuery = ref('')
const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  navigateTo(`/verify?q=${encodeURIComponent(searchQuery.value.trim())}`)
}
</script>

<template>
  <div class="relative w-full mb-16 -mt-4">
    <!-- ═══════════════════════════════════════════════════════
         MAIN HERO BANNER (Edge-to-Edge Cinematic)
    ════════════════════════════════════════════════════════════ -->
    <div class="relative w-full overflow-hidden bg-slate-900 shadow-xl">
      <!-- UCarousel từ Nuxt UI -->
      <UCarousel
        :items="bannerList"
        :ui="{
          root: 'relative overflow-hidden w-full h-[500px] sm:h-[600px] md:h-[650px] lg:h-[700px]',
          container: 'h-full w-full',
          item: 'w-full basis-full h-full relative select-none'
        }"
        indicators
        arrows
        :autoplay="{ delay: 5000 }"
        loop
      >
        <template #default="{ item }">
          <div class="relative w-full h-full group overflow-hidden">
            <!-- Background Image với hiệu ứng Zoom mềm mại -->
            <img
              :src="item.imageUrl"
              :alt="item.title"
              class="w-full h-full object-cover object-center transform transition-transform duration-1000 ease-out group-hover:scale-105"
              draggable="false"
            >

            <!-- Multi-layered Gradient Overlays (Tăng độ tương phản text) -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20" />
            <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

            <!-- Nội dung Slide (Typography hiện đại) -->
            <div class="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-14 pb-20 sm:pb-20 z-10 max-w-3xl">
              <!-- Tag / Eyebrow Pill -->
              <div
                v-if="item.tag"
                class="mb-3"
              >
                <UBadge
                  :color="(item.tagColor as any) || 'primary'"
                  variant="solid"
                  size="md"
                  class="font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-lg backdrop-blur-md"
                >
                  {{ item.tag }}
                </UBadge>
              </div>

              <!-- Tiêu đề lớn -->
              <h1 class="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight font-serif tracking-tight drop-shadow-lg mb-3">
                {{ item.title }}
              </h1>

              <!-- Mô tả / Phụ đề -->
              <p
                v-if="item.subtitle"
                class="text-sm sm:text-base md:text-lg text-stone-200 line-clamp-2 sm:line-clamp-3 mb-6 font-normal drop-shadow"
              >
                {{ item.subtitle }}
              </p>

              <!-- Nút CTA hành động -->
              <div class="flex items-center gap-3">
                <UButton
                  v-if="item.link"
                  :to="item.link"
                  color="primary"
                  size="lg"
                  class="rounded-xl px-6 font-bold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all"
                  trailing-icon="i-heroicons-arrow-right-20-solid"
                >
                  {{ item.ctaText || 'Xem Chi Tiết' }}
                </UButton>

                <UButton
                  to="/leadership"
                  color="neutral"
                  variant="outline"
                  size="lg"
                  class="rounded-xl px-5 font-semibold text-white border-white/40 hover:bg-white/20 backdrop-blur-sm"
                >
                  Về Ban Điều Hành
                </UButton>
              </div>
            </div>
          </div>
        </template>
      </UCarousel>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         FLOATING SEARCH BAR (Glassmorphism nép chân banner)
    ════════════════════════════════════════════════════════════ -->
    <div class="absolute -bottom-7 left-1/2 -translate-x-1/2 w-[92%] max-w-2xl z-30">
      <form
        class="bg-white/60 dark:bg-black/40 backdrop-blur-2xl p-2 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.18)] border border-white/40 dark:border-stone-700/50 flex items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-amber-500 focus-within:bg-white/90 dark:focus-within:bg-[#242526]/90 focus-within:shadow-[0_15px_40px_rgba(245,158,11,0.25)] group"
        @submit.prevent="handleSearch"
      >
        <div class="flex-1 flex items-center pl-2">
          <UIcon
            name="i-heroicons-magnifying-glass-20-solid"
            class="w-6 h-6 text-stone-500 dark:text-stone-400 group-focus-within:text-amber-500 shrink-0 mr-2 transition-colors"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tra cứu điểm, thông báo, bài viết giáo lý..."
            class="w-full bg-transparent border-none text-stone-800 dark:text-stone-100 placeholder-stone-400 text-sm sm:text-base focus:outline-none"
          >
        </div>

        <UButton
          type="submit"
          color="primary"
          size="md"
          class="rounded-xl px-5 sm:px-7 font-bold shadow-md hover:shadow-lg transition-transform active:scale-95 shrink-0"
        >
          Tìm Kiếm
        </UButton>
      </form>
    </div>
  </div>
</template>
