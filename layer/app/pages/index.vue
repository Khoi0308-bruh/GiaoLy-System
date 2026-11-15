<script setup lang="ts">
import { ApiError } from '~/composables/useApi'

definePageMeta({ public: true })

const api = useApi()

interface Banner {
  id: string
  title: string
  subtitle?: string | null
  imageUrl?: string | null
  linkUrl?: string | null
  order?: number
}

interface LiturgicalDay {
  date: string
  celebrationTitle: string
  liturgicalColor: 'White' | 'Red' | 'Green' | 'Violet' | 'Rose' | 'Gold'
  rank: string
  readingsSummary?: string | null
}

interface PublicStats {
  totalStudents: number
  totalClassrooms: number
  totalLeaders: number
  sacramentsConferred?: number | null
}

interface PublicNews {
  id: string
  title: string
  summary?: string | null
  imageUrl?: string | null
  publishedAt: string
  category?: string | null
}

interface PublicAnnouncement {
  id: string
  title: string
  summary?: string | null
  publishedAt: string
  priority?: string | null
}

const banners = ref<Banner[]>([])
const liturgicalToday = ref<LiturgicalDay | null>(null)
const stats = ref<PublicStats | null>(null)
const newsList = ref<PublicNews[]>([])
const announcements = ref<PublicAnnouncement[]>([])

const loading = ref(true)

async function loadPortalData() {
  loading.value = true
  try {
    const [bRes, lRes, sRes, nRes, aRes] = await Promise.allSettled([
      api.get<Banner[]>('/public/banners'),
      api.get<LiturgicalDay>('/public/liturgical/today'),
      api.get<PublicStats>('/public/stats'),
      api.get<PublicNews[]>('/public/news', { limit: 4 }),
      api.get<PublicAnnouncement[]>('/public/announcements', { limit: 4 })
    ])

    if (bRes.status === 'fulfilled') {
      const v = bRes.value
      banners.value = Array.isArray(v) ? v : ((v as any)?.items || [])
    }
    if (lRes.status === 'fulfilled') {
      liturgicalToday.value = lRes.value
    }
    if (sRes.status === 'fulfilled') {
      stats.value = sRes.value
    }
    if (nRes.status === 'fulfilled') {
      const v = nRes.value
      newsList.value = Array.isArray(v) ? v.slice(0, 4) : (((v as any)?.items || []).slice(0, 4))
    }
    if (aRes.status === 'fulfilled') {
      const v = aRes.value
      announcements.value = Array.isArray(v) ? v.slice(0, 4) : (((v as any)?.items || []).slice(0, 4))
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPortalData()
})

const COLOR_MAP: Record<string, { label: string, badge: string, border: string }> = {
  White: { label: 'Trắng', badge: 'bg-stone-100 text-stone-800 border-stone-300', border: 'border-l-amber-400' },
  Red: { label: 'Đỏ', badge: 'bg-rose-100 text-rose-800 border-rose-300', border: 'border-l-rose-600' },
  Green: { label: 'Xanh lá', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300', border: 'border-l-emerald-600' },
  Violet: { label: 'Tím', badge: 'bg-purple-100 text-purple-800 border-purple-300', border: 'border-l-purple-700' },
  Rose: { label: 'Hồng', badge: 'bg-pink-100 text-pink-800 border-pink-300', border: 'border-l-pink-400' },
  Gold: { label: 'Vàng kim', badge: 'bg-amber-100 text-amber-900 border-amber-400', border: 'border-l-amber-500' }
}
</script>

<template>
  <PortalShell>
    <!-- Phụng vụ hôm nay Strip -->
    <div v-if="liturgicalToday" class="bg-stone-900 text-white text-xs border-b border-stone-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-sparkles" class="h-4 w-4 text-[#ECC367]" />
          <span class="text-stone-400 font-medium">Phụng vụ hôm nay:</span>
          <span class="font-bold text-white">{{ liturgicalToday.celebrationTitle }}</span>
          <span
            class="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            :class="COLOR_MAP[liturgicalToday.liturgicalColor]?.badge || 'bg-stone-700 text-stone-200'"
          >
            Áo lễ {{ COLOR_MAP[liturgicalToday.liturgicalColor]?.label || liturgicalToday.liturgicalColor }}
          </span>
        </div>
        <NuxtLink to="/lich-phung-vu" class="text-[#ECC367] hover:underline flex items-center gap-1 text-[11px]">
          Xem lịch tháng phụng vụ →
        </NuxtLink>
      </div>
    </div>

    <!-- Hero Section / Banners -->
    <section class="relative bg-gradient-to-b from-[#1D3A73] to-[#122449] text-white py-16 sm:py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-7 space-y-6">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#ECC367] text-xs font-semibold backdrop-blur-xs border border-white/10">
              <UIcon name="i-heroicons-heart" class="h-3.5 w-3.5" />
              <span>Xứ Đoàn Thiếu Nhi Thánh Thể</span>
            </div>
            <h1 class="font-serif text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
              Yêu Thương & Phụng Sự Trên Hành Trình Huấn Giáo
            </h1>
            <p class="text-sm sm:text-base text-stone-200 max-w-xl leading-relaxed">
              Chào mừng quý phụ huynh và các em đoàn sinh đến với Cổng thông tin Giáo lý Giáo xứ. Nơi kết nối gia đình, giáo xứ và các em trong tinh thần Cầu nguyện, Rước lễ, Hy sinh và Làm tông đồ.
            </p>
            <div class="flex flex-wrap items-center gap-3 pt-2">
              <UButton
                to="/phu-huynh"
                size="lg"
                color="primary"
                variant="solid"
                icon="i-heroicons-user"
                class="bg-[#A8812A] hover:bg-[#8e6c20] text-white font-semibold"
              >
                Cổng phụ huynh tra cứu
              </UButton>
              <UButton
                to="/xac-thuc-chung-chi"
                size="lg"
                variant="outline"
                icon="i-heroicons-check-badge"
                class="border-white/30 text-white hover:bg-white/10 font-semibold"
              >
                Xác thực chứng chỉ
              </UButton>
            </div>
          </div>

          <div class="lg:col-span-5">
            <!-- Banner Card nếu có -->
            <div v-if="banners.length > 0" class="rounded-2xl overflow-hidden border border-white/20 bg-white/5 backdrop-blur-md p-2 shadow-2xl">
              <div v-if="banners[0].imageUrl" class="aspect-video w-full rounded-xl overflow-hidden bg-stone-800">
                <img :src="banners[0].imageUrl" :alt="banners[0].title" class="h-full w-full object-cover">
              </div>
              <div class="p-4 space-y-2">
                <h3 class="font-serif text-lg font-bold text-white">{{ banners[0].title }}</h3>
                <p v-if="banners[0].subtitle" class="text-xs text-stone-300">{{ banners[0].subtitle }}</p>
              </div>
            </div>
            <div v-else class="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md p-6 text-center space-y-3">
              <div class="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-[#ECC367]/20 text-[#ECC367]">
                <UIcon name="i-heroicons-sparkles" class="h-8 w-8" />
              </div>
              <h3 class="font-serif text-lg font-bold text-white">Niên Khóa Huấn Giáo 2025–2026</h3>
              <p class="text-xs text-stone-300">"Hãy để trẻ nhỏ đến cùng Ta" — Cùng nhau vun đắp đời sống đức tin vững mạnh cho thế hệ tương lai của Giáo xứ.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Thống kê giáo lý (Stats) -->
    <section class="relative -mt-8 z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="rounded-xl border border-stone-200 bg-white p-5 shadow-md text-center">
          <div class="text-2xl sm:text-3xl font-serif font-bold text-[#1D3A73]">
            {{ stats?.totalStudents ?? (loading ? '...' : 0) }}
          </div>
          <div class="text-xs font-semibold uppercase tracking-wider text-stone-500 mt-1">Đoàn sinh</div>
        </div>
        <div class="rounded-xl border border-stone-200 bg-white p-5 shadow-md text-center">
          <div class="text-2xl sm:text-3xl font-serif font-bold text-[#1D3A73]">
            {{ stats?.totalClassrooms ?? (loading ? '...' : 0) }}
          </div>
          <div class="text-xs font-semibold uppercase tracking-wider text-stone-500 mt-1">Lớp giáo lý</div>
        </div>
        <div class="rounded-xl border border-stone-200 bg-white p-5 shadow-md text-center">
          <div class="text-2xl sm:text-3xl font-serif font-bold text-[#1D3A73]">
            {{ stats?.totalLeaders ?? (loading ? '...' : 0) }}
          </div>
          <div class="text-xs font-semibold uppercase tracking-wider text-stone-500 mt-1">Huynh trưởng & GLV</div>
        </div>
        <div class="rounded-xl border border-stone-200 bg-white p-5 shadow-md text-center">
          <div class="text-2xl sm:text-3xl font-serif font-bold text-[#A8812A]">
            {{ stats?.sacramentsConferred ?? (loading ? '...' : 0) }}
          </div>
          <div class="text-xs font-semibold uppercase tracking-wider text-stone-500 mt-1">Bí tích đã ban</div>
        </div>
      </div>
    </section>

    <!-- Tin tức & Hoạt động -->
    <section class="py-14 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
      <div class="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <h2 class="font-serif text-2xl font-bold text-stone-900 flex items-center gap-2">
            <UIcon name="i-heroicons-newspaper" class="h-6 w-6 text-[#1D3A73]" />
            Tin Tức & Hoạt Động Giáo Xứ
          </h2>
          <p class="text-xs text-stone-500 mt-0.5">Nhịp sống đức tin và các sự kiện sôi nổi của Xứ đoàn</p>
        </div>
        <UButton to="/tin-tuc" variant="link" color="primary">
          Xem tất cả tin tức →
        </UButton>
      </div>

      <div v-if="loading" class="py-10 text-center text-sm text-stone-500">
        Đang tải bài viết mới nhất...
      </div>

      <div v-else-if="newsList.length === 0" class="py-8 text-center text-sm text-stone-500">
        Chưa có bài viết tin tức nào được xuất bản.
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <NuxtLink
          v-for="item in newsList"
          :key="item.id"
          to="/tin-tuc"
          class="group rounded-xl border border-stone-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
        >
          <div>
            <div class="aspect-video w-full bg-stone-100 overflow-hidden relative">
              <img
                v-if="item.imageUrl"
                :src="item.imageUrl"
                :alt="item.title"
                class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              >
              <div v-else class="h-full w-full flex items-center justify-center text-stone-400">
                <UIcon name="i-heroicons-photo" class="h-10 w-10" />
              </div>
              <span
                v-if="item.category"
                class="absolute top-2 left-2 rounded bg-[#1D3A73]/90 text-white text-[10px] font-semibold px-2 py-0.5 backdrop-blur-xs"
              >
                {{ item.category }}
              </span>
            </div>
            <div class="p-4 space-y-2">
              <div class="text-[11px] text-stone-400">{{ item.publishedAt }}</div>
              <h3 class="font-serif text-sm font-bold text-stone-900 group-hover:text-[#1D3A73] transition-colors line-clamp-2">
                {{ item.title }}
              </h3>
              <p v-if="item.summary" class="text-xs text-stone-600 line-clamp-2">
                {{ item.summary }}
              </p>
            </div>
          </div>
          <div class="p-4 pt-0 text-xs font-semibold text-[#1D3A73] flex items-center gap-1">
            <span>Đọc tiếp</span>
            <UIcon name="i-heroicons-arrow-right" class="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Thông báo giáo xứ nổi bật & Tiện ích tra cứu -->
    <section class="bg-stone-100/70 py-14 border-t border-stone-200">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Cột thông báo -->
          <div class="lg:col-span-7 space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                <UIcon name="i-heroicons-megaphone" class="h-5 w-5 text-[#A8812A]" />
                Thông Báo Giáo Xứ Nổi Bật
              </h2>
              <UButton to="/thong-bao" variant="link" size="xs" color="primary">
                Xem tất cả thông báo →
              </UButton>
            </div>

            <div v-if="announcements.length === 0" class="rounded-xl border border-stone-200 bg-white p-6 text-center text-sm text-stone-500">
              Hiện chưa có thông báo mới.
            </div>

            <div v-else class="space-y-3">
              <NuxtLink
                v-for="a in announcements"
                :key="a.id"
                to="/thong-bao"
                class="block rounded-xl border border-stone-200 bg-white p-4 shadow-xs hover:border-[#1D3A73]/40 transition-colors"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <span
                        v-if="a.priority === 'High' || a.priority === 'Urgent'"
                        class="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-800"
                      >
                        KHẨN
                      </span>
                      <h3 class="text-sm font-bold text-stone-900 hover:text-[#1D3A73]">
                        {{ a.title }}
                      </h3>
                    </div>
                    <p v-if="a.summary" class="text-xs text-stone-600 line-clamp-2">
                      {{ a.summary }}
                    </p>
                  </div>
                  <div class="text-[11px] text-stone-400 whitespace-nowrap">
                    {{ a.publishedAt }}
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- Cột lối tắt tiện ích công khai -->
          <div class="lg:col-span-5 space-y-4">
            <h2 class="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
              <UIcon name="i-heroicons-squares-2x2" class="h-5 w-5 text-[#1D3A73]" />
              Tiện Ích Cho Giáo Dân
            </h2>

            <div class="space-y-3">
              <NuxtLink
                to="/xac-thuc-chung-chi"
                class="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-xs hover:shadow-md transition-shadow"
              >
                <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-[#A8812A]">
                  <UIcon name="i-heroicons-qr-code" class="h-6 w-6" />
                </div>
                <div>
                  <h4 class="text-sm font-bold text-stone-900">Xác thực chứng chỉ trực tuyến</h4>
                  <p class="text-xs text-stone-500 mt-0.5">Tra cứu tính hợp lệ của chứng chỉ Rửa tội, Thêm sức bằng mã số</p>
                </div>
              </NuxtLink>

              <NuxtLink
                to="/thu-vien"
                class="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-xs hover:shadow-md transition-shadow"
              >
                <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#1D3A73]">
                  <UIcon name="i-heroicons-book-open" class="h-6 w-6" />
                </div>
                <div>
                  <h4 class="text-sm font-bold text-stone-900">Thư viện tài liệu huấn giáo</h4>
                  <p class="text-xs text-stone-500 mt-0.5">Sách giáo lý, kinh nguyện, biểu mẫu gia đình có thể tải về</p>
                </div>
              </NuxtLink>

              <NuxtLink
                to="/ban-huynh-truong"
                class="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-xs hover:shadow-md transition-shadow"
              >
                <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                  <UIcon name="i-heroicons-user-group" class="h-6 w-6" />
                </div>
                <div>
                  <h4 class="text-sm font-bold text-stone-900">Ban Huynh Trưởng & GLV</h4>
                  <p class="text-xs text-stone-500 mt-0.5">Danh sách các anh chị huynh trưởng phụ trách từng phân đoàn</p>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </PortalShell>
</template>
