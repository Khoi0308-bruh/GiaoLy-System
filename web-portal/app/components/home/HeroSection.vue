<script setup lang="ts">
interface BannerItem {
  id: string
  title: string
  subtitle?: string
  tag?: string
  tagColor?: string
  imageUrl: string
  // API công khai trả `linkUrl` (BannerDto), không phải `link`.
  linkUrl?: string | null
  ctaText?: string
  orderIndex?: number
  isActive?: boolean
}

const config = useRuntimeConfig()

// Gọi API lấy danh sách banner đang hoạt động
const { data: apiBanners } = await useFetch<BannerItem[]>('/api/v1/public/banners', {
  baseURL: config.public.apiBase
})

// Không có banner nào đang bật thì không dựng hero: trước đây chỗ này rơi về một
// banner mẫu (ảnh Unsplash) nên xoá hết banner trong quản trị mà trang chủ vẫn có
// banner — vừa gây hiểu nhầm, vừa đẩy nội dung giả lên production.
const bannerList = computed(() => apiBanners.value ?? [])

// Tự chuyển slide là nội dung động kéo dài quá 5 giây nên phải có cách tạm dừng
// (WCAG 2.2.2); mặc định đứng yên nếu người dùng bật "giảm chuyển động".
//
// Chỉ slide đang hiển thị nằm trong cây trợ năng; các slide còn lại tuy nằm ngoài
// khung nhìn nhưng vẫn ở trong DOM, nếu không ẩn thì trình đọc màn hình sẽ đọc lần
// lượt mọi banner và phím Tab còn nhảy vào nút "Xem Chi Tiết" của slide vô hình.
const dangChon = ref(0)
const tuDongChay = ref(true)
onMounted(() => {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    tuDongChay.value = false
  }
})

const searchQuery = ref('')
const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  navigateTo(`/verify?q=${encodeURIComponent(searchQuery.value.trim())}`)
}

// Thống kê nhanh — lấy từ API công khai, không hard-code.
interface PublicBranchSummary {
  branchId: number
  branchName: string
  studentCount: number
  classCount: number
}

interface PublicStats {
  totalStudents: number
  totalCatechists: number
  totalClasses: number
  totalActiveAcademicYears: number
  branches: PublicBranchSummary[]
}

const { data: publicStats } = await useFetch<PublicStats>('/api/v1/public/stats', {
  baseURL: config.public.apiBase,
  // Trang chủ là route prerender: nếu fetch cả ở server thì số liệu bị đóng băng vào
  // HTML/payload lúc build. Chỉ lấy ở client để mỗi lượt truy cập thấy số hiện tại.
  server: false
})

const quickStats = computed(() => [
  { label: 'Đoàn Sinh', value: publicStats.value?.totalStudents, icon: 'i-heroicons-users' },
  { label: 'Huynh Trưởng', value: publicStats.value?.totalCatechists, icon: 'i-heroicons-academic-cap' },
  { label: 'Lớp Học', value: publicStats.value?.totalClasses, icon: 'i-heroicons-building-library' },
  { label: 'Niên Khóa', value: publicStats.value?.totalActiveAcademicYears, icon: 'i-heroicons-star' }
])

// Số đoàn sinh và số lớp theo từng ngành, cùng nguồn /api/v1/public/stats.
const branchStats = computed(() => publicStats.value?.branches ?? [])
</script>

<template>
  <div class="relative w-full mb-20 -mt-0">
    <!-- ══════════════════════════════════════════════════════════════
         HERO BANNER — Cinematic Edge-to-Edge
    ══════════════════════════════════════════════════════════════════ -->
    <div
      v-if="bannerList.length"
      class="relative w-full overflow-hidden shadow-2xl"
      style="box-shadow: 0 25px 60px rgba(26,58,107,0.25);"
    >
      <!-- Bokeh particles giả (CSS only) -->
      <div class="bokeh-bg z-10" />

      <!-- UCarousel Nuxt UI -->
      <UCarousel
        :items="bannerList"
        :ui="{
          root: 'relative overflow-hidden w-full',
          container: 'h-full w-full',
          // Slide phải có chiều cao xác định: nếu chỉ dựa vào h-full, khung ảnh co giãn
          // theo tỉ lệ ảnh gốc và phần chữ (absolute inset-0) bị đẩy ra ngoài khung.
          item: 'relative w-full basis-full ps-0 select-none h-[520px] sm:h-[620px] md:h-[680px] lg:h-[740px]'
        }"
        :dots="bannerList.length > 1"
        :arrows="bannerList.length > 1"
        :autoplay="tuDongChay && bannerList.length > 1 ? { delay: 5500 } : false"
        loop
        @select="dangChon = $event"
      >
        <template #default="{ item, index }">
          <div
            class="relative w-full h-full group overflow-hidden"
            :aria-hidden="dangChon !== index ? 'true' : undefined"
            :inert="dangChon !== index"
          >
            <!-- Ảnh nền với hiệu ứng zoom -->
            <img
              :src="item.imageUrl"
              :alt="item.title"
              class="w-full h-full object-cover object-center transform transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              draggable="false"
            >

            <!-- Các lớp gradient overlay tạo chiều sâu -->
            <div class="absolute inset-0 bg-gradient-to-t from-[#0d1117]/95 via-[#0d1117]/30 to-transparent" />
            <div class="absolute inset-0 bg-gradient-to-r from-[#0d1117]/80 via-[#0d1117]/20 to-transparent" />
            <!-- Viền vàng tinh tế ở bottom -->
            <div
              class="absolute bottom-0 left-0 right-0 h-[3px]"
              style="background: linear-gradient(90deg, transparent, #c9a96e, transparent);"
            />

            <!-- Nội dung Slide — Typography "Spiritual Premium" -->
            <div class="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-14 pb-24 sm:pb-28 z-10 max-w-4xl">
              <!-- Tag / Eyebrow Label -->
              <div
                v-if="item.tag"
                class="mb-4"
              >
                <span
                  class="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black tracking-[0.2em] uppercase backdrop-blur-md border"
                  style="
                    background: rgba(201,169,110,0.15);
                    border-color: rgba(201,169,110,0.4);
                    color: #e8c98a;
                  "
                >
                  {{ item.tag }}
                </span>
              </div>

              <!-- Tiêu đề serif lớn: chỉ là h2 để trang chủ giữ đúng một h1
                   (mỗi slide một h1 thì trang có N h1, carousel lại nhân bản slide). -->
              <h2
                class="font-serif font-black text-white leading-[1.1] tracking-tight drop-shadow-2xl mb-4"
                style="font-size: clamp(1.75rem, 5vw, 3.5rem);"
              >
                {{ item.title }}
              </h2>

              <!-- Phụ đề -->
              <p
                v-if="item.subtitle"
                class="text-stone-300/90 line-clamp-2 sm:line-clamp-3 mb-8 leading-relaxed"
                style="font-size: clamp(0.875rem, 1.5vw, 1.1rem); max-width: 600px;"
              >
                {{ item.subtitle }}
              </p>

              <!-- Nút CTA -->
              <div class="flex items-center gap-3 flex-wrap">
                <NuxtLink
                  v-if="item.linkUrl"
                  :to="item.linkUrl"
                  class="gold-btn"
                >
                  {{ item.ctaText || 'Xem Chi Tiết' }}
                  <UIcon
                    name="i-heroicons-arrow-right-20-solid"
                    class="w-4 h-4"
                  />
                </NuxtLink>

                <NuxtLink
                  to="/ban-huynh-truong"
                  class="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white border border-white/30 backdrop-blur-sm hover:bg-white/15 transition-all duration-300"
                >
                  Về Ban Điều Hành
                </NuxtLink>
              </div>
            </div>
          </div>
        </template>
      </UCarousel>

      <!-- Tạm dừng / tiếp tục tự chuyển slide -->
      <button
        v-if="bannerList.length > 1"
        type="button"
        class="absolute bottom-6 right-6 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white border border-white/40 backdrop-blur-sm hover:bg-white/20 transition-colors"
        :aria-label="tuDongChay ? 'Tạm dừng trình chiếu banner' : 'Tiếp tục trình chiếu banner'"
        :title="tuDongChay ? 'Tạm dừng trình chiếu banner' : 'Tiếp tục trình chiếu banner'"
        @click="tuDongChay = !tuDongChay"
      >
        <UIcon
          :name="tuDongChay ? 'i-heroicons-pause-20-solid' : 'i-heroicons-play-20-solid'"
          class="w-5 h-5"
        />
      </button>
    </div>

    <!-- ══════════════════════════════════════════════════════════════
         FLOATING SEARCH BAR — Glassmorphism nép chân banner
         Đặt theo luồng (relative + margin âm) thay vì absolute: absolute neo vào
         đáy cả khối wrapper (banner + thanh thống kê) nên thanh tra cứu trùm lên
         nhãn của 4 ô thống kê.
    ══════════════════════════════════════════════════════════════════ -->
    <div
      class="relative mx-auto w-[92%] max-w-2xl z-30"
      :class="bannerList.length ? '-mt-7' : 'mt-6'"
    >
      <form
        class="relative p-2 rounded-2xl flex items-center gap-2 transition-all duration-500 focus-within:shadow-[0_15px_50px_rgba(201,169,110,0.3)]"
        style="
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow: 0 15px 40px rgba(26,58,107,0.18);
          border: 1px solid rgba(201,169,110,0.25);
        "
        @submit.prevent="handleSearch"
      >
        <div class="flex-1 flex items-center pl-2 gap-2">
          <UIcon
            name="i-heroicons-magnifying-glass-20-solid"
            class="w-5 h-5 shrink-0 transition-colors duration-300"
            style="color: #c9a96e;"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tra cứu điểm, thông báo, bài viết giáo lý..."
            class="w-full bg-transparent border-none text-stone-800 dark:text-stone-100 placeholder-stone-400 text-sm sm:text-base focus:outline-none"
          >
        </div>
        <button
          type="submit"
          class="premium-btn shrink-0 text-sm px-5 sm:px-7 py-2.5"
        >
          Tìm Kiếm
        </button>
      </form>
    </div>

    <!-- ══════════════════════════════════════════════════════════════
         QUICK STATS BAR — Thống kê nhanh dưới hero
    ══════════════════════════════════════════════════════════════════ -->
    <div class="mt-20 px-4 sm:px-6">
      <div class="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="stat in quickStats"
          :key="stat.label"
          class="sacred-card p-5 text-center group cursor-default"
        >
          <div
            class="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style="background: linear-gradient(135deg, rgba(26,58,107,0.08), rgba(201,169,110,0.08));"
          >
            <UIcon
              :name="stat.icon"
              class="w-5 h-5"
              style="color: #c9a96e;"
            />
          </div>
          <div
            class="font-black text-2xl font-serif"
            style="color: #1a3a6b;"
          >
            {{ stat.value ?? '—' }}
          </div>
          <div class="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-0.5 tracking-wide uppercase">
            {{ stat.label }}
          </div>
        </div>
      </div>

      <!-- Số đoàn sinh và số lớp theo ngành -->
      <div
        v-if="branchStats.length"
        class="max-w-3xl mx-auto mt-4 grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        <div
          v-for="branch in branchStats"
          :key="branch.branchId"
          class="sacred-card px-3 py-2.5 text-center"
        >
          <div
            class="text-[11px] font-black uppercase tracking-[0.15em]"
            style="color: #a07840;"
          >
            {{ branch.branchName }}
          </div>
          <div class="mt-1 text-sm font-semibold text-stone-600 dark:text-stone-300">
            {{ branch.studentCount }} đoàn sinh · {{ branch.classCount }} lớp
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
