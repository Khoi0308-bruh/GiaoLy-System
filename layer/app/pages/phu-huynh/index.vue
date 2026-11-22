<script setup lang="ts">
import { ApiError } from '../../composables/useApi'

const api = useApi()

interface ChildSummary {
  id: string
  studentCode: string
  holyName?: string | null
  fullName: string
  gender: string
  dateOfBirth: string
  currentClassroom?: {
    id: string
    name: string
    levelName?: string | null
    gradeName?: string | null
    mainTeacherName?: string | null
  } | null
  attendanceRate?: number | null
}

interface PortalAnnouncement {
  id: string
  title: string
  content: string
  priority: string
  publishedAt: string
}

const children = ref<ChildSummary[]>([])
const announcements = ref<PortalAnnouncement[]>([])
const loadingChildren = ref(false)
const loadingAnnouncements = ref(false)
const errorChildren = ref<ApiError | null>(null)
const errorAnnouncements = ref<ApiError | null>(null)

const { sanitize } = useSafeHtml()

async function fetchChildren() {
  loadingChildren.value = true
  errorChildren.value = null
  try {
    const res = await api.get<{ items?: ChildSummary[], data?: ChildSummary[] } | ChildSummary[]>('/portal/children')
    if (Array.isArray(res)) {
      children.value = res
    } else if (res && Array.isArray(res.items)) {
      children.value = res.items
    } else if (res && Array.isArray(res.data)) {
      children.value = res.data
    } else {
      children.value = []
    }
  } catch (e) {
    errorChildren.value = e as ApiError
  } finally {
    loadingChildren.value = false
  }
}

async function fetchAnnouncements() {
  loadingAnnouncements.value = true
  errorAnnouncements.value = null
  try {
    const res = await api.get<{ items?: PortalAnnouncement[], data?: PortalAnnouncement[] } | PortalAnnouncement[]>('/portal/announcements')
    if (Array.isArray(res)) {
      announcements.value = res
    } else if (res && Array.isArray(res.items)) {
      announcements.value = res.items
    } else if (res && Array.isArray(res.data)) {
      announcements.value = res.data
    } else {
      announcements.value = []
    }
  } catch (e) {
    errorAnnouncements.value = e as ApiError
  } finally {
    loadingAnnouncements.value = false
  }
}

onMounted(() => {
  fetchChildren()
  fetchAnnouncements()
})
</script>

<template>
  <PortalShell>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Header -->
      <div class="border-b border-stone-200 pb-5">
        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1D3A73] text-[#ECC367]">
            <UIcon name="i-heroicons-user-group" class="h-7 w-7" />
          </div>
          <div>
            <h1 class="font-serif text-2xl font-bold text-stone-900">
              Cổng Thông Tin Phụ Huynh
            </h1>
            <p class="text-sm text-stone-600">
              Theo dõi việc học giáo lý, bảng điểm, chuyên cần và các bí tích của các con.
            </p>
          </div>
        </div>
      </div>

      <!-- Khung thông báo gửi phụ huynh -->
      <div class="rounded-xl border border-amber-200 bg-amber-50/60 p-5 shadow-xs">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-base font-bold text-amber-900 flex items-center gap-2">
            <UIcon name="i-heroicons-bell" class="h-5 w-5 text-amber-700" />
            Thông báo từ Ban Giáo Lý gửi Phụ huynh
          </h2>
          <span v-if="announcements.length > 0" class="text-xs text-amber-800 font-medium">
            {{ announcements.length }} thông báo
          </span>
        </div>

        <ErrorState v-if="errorAnnouncements" :error="errorAnnouncements" />

        <div v-if="loadingAnnouncements" class="text-sm text-stone-500 py-3">
          Đang tải thông báo...
        </div>

        <div v-else-if="announcements.length === 0" class="text-sm text-stone-600 py-2">
          Hiện chưa có thông báo mới gửi riêng cho quý phụ huynh.
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="ann in announcements"
            :key="ann.id"
            class="rounded-lg bg-white p-4 border border-stone-200/80 shadow-xs"
          >
            <div class="flex items-start justify-between gap-3">
              <h3 class="text-sm font-bold text-stone-900">
                {{ ann.title }}
              </h3>
              <span class="text-[11px] text-stone-500 whitespace-nowrap">
                {{ formatDate(ann.publishedAt) }}
              </span>
            </div>
            <!-- Sanitize HTML -->
            <div
              class="prose prose-sm max-w-none text-xs text-stone-700 mt-2 leading-relaxed"
              v-html="sanitize(ann.content)"
            />
          </div>
        </div>
      </div>

      <!-- Danh sách các con của tôi -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-stone-900 flex items-center gap-2">
            <UIcon name="i-heroicons-academic-cap" class="h-5 w-5 text-[#1D3A73]" />
            Danh sách các con của tôi
          </h2>
          <UButton
            icon="i-heroicons-arrow-path"
            size="xs"
            variant="ghost"
            :loading="loadingChildren"
            @click="fetchChildren"
          >
            Làm mới
          </UButton>
        </div>

        <ErrorState v-if="errorChildren" :error="errorChildren" />

        <div v-if="loadingChildren" class="py-12 text-center text-sm text-stone-500">
          Đang tải hồ sơ các con...
        </div>

        <EmptyState
          v-else-if="children.length === 0"
          title="Chưa liên kết hồ sơ con"
          description="Tài khoản của quý phụ huynh chưa được liên kết với hồ sơ đoàn sinh nào. Vui lòng liên hệ Giáo lý viên chủ nhiệm hoặc Ban Quản trị giáo xứ để được hỗ trợ liên kết."
          icon="i-heroicons-user-minus"
        />

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="child in children"
            :key="child.id"
            class="rounded-xl border border-stone-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div class="space-y-3">
              <!-- Avatar & Tên -->
              <div class="flex items-start gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#1D3A73]/10 text-[#1D3A73] font-bold text-base">
                  {{ child.fullName.charAt(0) }}
                </div>
                <div class="flex-1">
                  <div v-if="child.holyName" class="text-xs font-semibold text-[#A8812A]">
                    {{ child.holyName }}
                  </div>
                  <h3 class="text-base font-bold text-stone-900 leading-snug">
                    {{ child.fullName }}
                  </h3>
                  <div class="text-[11px] text-stone-500 mt-0.5">
                    Mã đoàn sinh: <span class="font-mono font-medium">{{ child.studentCode }}</span>
                  </div>
                </div>
              </div>

              <!-- Chi tiết lớp và GLV -->
              <div class="rounded-lg bg-stone-50 p-3 text-xs space-y-1.5 border border-stone-100">
                <div class="flex items-center justify-between">
                  <span class="text-stone-500">Lớp hiện tại:</span>
                  <span class="font-semibold text-stone-800">
                    {{ child.currentClassroom?.name || 'Chưa xếp lớp' }}
                  </span>
                </div>
                <div v-if="child.currentClassroom?.levelName" class="flex items-center justify-between">
                  <span class="text-stone-500">Cấp học:</span>
                  <span class="text-stone-700">{{ child.currentClassroom.levelName }}</span>
                </div>
                <div v-if="child.currentClassroom?.mainTeacherName" class="flex items-center justify-between">
                  <span class="text-stone-500">GLV Chủ nhiệm:</span>
                  <span class="text-stone-700">{{ child.currentClassroom.mainTeacherName }}</span>
                </div>
                <div v-if="child.dateOfBirth" class="flex items-center justify-between">
                  <span class="text-stone-500">Ngày sinh:</span>
                  <span class="text-stone-700">{{ child.dateOfBirth }}</span>
                </div>
                <div v-if="child.attendanceRate != null" class="flex items-center justify-between pt-1 border-t border-stone-200">
                  <span class="text-stone-500">Chuyên cần:</span>
                  <span class="font-bold text-emerald-700">{{ child.attendanceRate }}%</span>
                </div>
              </div>
            </div>

            <!-- Nút chi tiết -->
            <div class="mt-5 pt-3 border-t border-stone-100">
              <UButton
                :to="`/phu-huynh/${child.id}`"
                block
                color="primary"
                variant="solid"
                icon="i-heroicons-arrow-right"
                class="justify-center"
              >
                Xem sổ điểm & chứng chỉ
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PortalShell>
</template>
