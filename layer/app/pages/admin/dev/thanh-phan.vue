<script setup lang="ts">
import { ApiError } from '~/composables/useApi'
import type { LiturgicalKey } from '~/composables/useLiturgical'

definePageMeta({
  layout: 'admin',
  public: true // Cho phép xem thử nghiệm trong dev không bị chặn bởi route guard
})

// Liturgical color testing
const liturgicalColors: { key: LiturgicalKey, label: string }[] = [
  { key: 'green', label: 'Xanh (Mùa Thường Niên)' },
  { key: 'violet', label: 'Tím (Mùa Vọng / Chay)' },
  { key: 'white', label: 'Trắng/Vàng (Lễ Trọng / Phục Sinh)' },
  { key: 'red', label: 'Đỏ (Lễ Chúa Thánh Thần / Tử Đạo)' },
  { key: 'rose', label: 'Hồng (Chúa Nhật Vui / Mừng)' },
  { key: 'black', label: 'Đen (Cầu Cho Các Tín Hữu Đã Qua Đời)' }
]

function switchColor(colorKey: LiturgicalKey) {
  if (import.meta.client) {
    document.documentElement.dataset.liturgical = colorKey
  }
}

// Error state demo
const simpleError = ref(new ApiError(404, 'NOT_FOUND', 'Không tìm thấy hồ sơ đoàn sinh này trong hệ thống.'))
const rateLimitError = ref(new ApiError(429, 'RATE_LIMITED', 'Bạn đã gửi yêu cầu quá nhanh.', {}, 45))
const validationError = ref(new ApiError(400, 'VALIDATION_FAILED', 'Dữ liệu nhập vào chưa hợp lệ. Vui lòng kiểm tra các trường đánh dấu đỏ.', {
  fullName: ['Họ và tên không được để trống.'],
  dateOfBirth: ['Ngày sinh không hợp lệ.'],
  baptismDate: ['Ngày rửa tội không được trước ngày sinh.']
}))

// Lock banner demo
const lockStatus = ref<'Active' | 'Closing' | 'Archived'>('Closing')
const unlockDate = ref<string | null>(null)

function testUnlock() {
  const d = new Date()
  d.setHours(d.getHours() + 72)
  unlockDate.value = d.toISOString()
}

function testLock() {
  unlockDate.value = null
}
</script>

<template>
  <div class="space-y-10 pb-16">
    <PageHeader
      title="Thư viện Thành phần & Thiết kế V3"
      subtitle="Hệ thống Design System Công Giáo: Marian Blue, Vatican Gold, Warm Ivory và các thành phần dùng chung"
    >
      <template #actions>
        <UButton variant="outline" color="neutral" icon="i-lucide-arrow-left" to="/admin">
          Về Tổng quan
        </UButton>
      </template>
    </PageHeader>

    <!-- 1. DẢI PHỤNG VỤ -->
    <section class="space-y-3 rounded-xl border border-stone-200 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900">
      <h2 class="text-xl text-marian-700 dark:text-marian-300">
        1. Dải màu phụng vụ theo ngày (Liturgical Strip)
      </h2>
      <p class="text-sm text-stone-600 dark:text-stone-400">
        Màu phụng vụ tự động cập nhật từ backend mỗi ngày, tuân thủ độ tương phản WCAG AA (≥ 4.5:1). Bấm thử các màu bên dưới:
      </p>
      <div class="flex flex-wrap gap-2 pt-1">
        <UButton
          v-for="c in liturgicalColors"
          :key="c.key"
          size="xs"
          variant="subtle"
          color="neutral"
          @click="switchColor(c.key)"
        >
          {{ c.label }}
        </UButton>
      </div>
    </section>

    <!-- 2. THẺ SỐ LIỆU TỔNG QUAN -->
    <section class="space-y-3">
      <h2 class="text-xl text-marian-700 dark:text-marian-300">
        2. Thẻ số liệu tổng quan (Stat Card)
      </h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Tổng đoàn sinh"
          value="452"
          hint="Niên khóa 2026–2027"
          icon="i-lucide-users"
          to="/admin/doan-sinh"
        />
        <StatCard
          label="Lớp giáo lý"
          value="18"
          hint="4 ngành đang sinh hoạt"
          icon="i-lucide-graduation-cap"
          to="/admin/lop"
        />
        <StatCard
          label="Tỷ lệ lên lớp"
          value="98.2%"
          hint="+2.1% so với niên khóa trước"
          icon="i-lucide-award"
        />
        <StatCard
          label="Sổ điểm cần chốt"
          value="3"
          hint="Hạn chót: Chúa Nhật tuần này"
          icon="i-lucide-clock"
        />
      </div>
    </section>

    <!-- 3. PHẠM VI DỮ LIỆU & BẢO VỆ DỮ LIỆU NHẠY CẢM -->
    <section class="space-y-4 rounded-xl border border-stone-200 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900">
      <h2 class="text-xl text-marian-700 dark:text-marian-300">
        3. Phạm vi dữ liệu & Che trường nhạy cảm
      </h2>
      <p class="text-sm text-stone-600 dark:text-stone-400">
        Luôn minh bạch phạm vi quyền hạn và tự động bảo vệ thông tin cá nhân của thiếu nhi:
      </p>
      
      <ScopeBanner />

      <div class="rounded-lg border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-950">
        <h3 class="mb-3 text-sm font-semibold text-stone-700 dark:text-stone-300">
          Ví dụ MaskedField (thông tin liên lạc và sức khỏe):
        </h3>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3 text-sm">
          <div>
            <span class="text-xs text-stone-500 block">Số điện thoại phụ huynh:</span>
            <MaskedField value="0901 234 567" permission="students.view-contact" placeholder="Đã ẩn SĐT" />
          </div>
          <div>
            <span class="text-xs text-stone-500 block">Địa chỉ thường trú:</span>
            <MaskedField value="123 Thống Nhất, P.11, Gò Vấp" permission="students.view-contact" placeholder="Đã ẩn địa chỉ" />
          </div>
          <div>
            <span class="text-xs text-stone-500 block">Ghi chú sức khỏe/dị ứng:</span>
            <MaskedField value="Dị ứng hải sản, hen suyễn nhẹ" permission="students.view-health" placeholder="Đã ẩn thông tin sức khỏe" />
          </div>
        </div>
      </div>
    </section>

    <!-- 4. CHIP TRẠNG THÁI CHUẨN (STATUS CHIP) -->
    <section class="space-y-4 rounded-xl border border-stone-200 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900">
      <h2 class="text-xl text-marian-700 dark:text-marian-300">
        4. Chip trạng thái chuẩn theo nghiệp vụ (Status Chip)
      </h2>
      <div class="space-y-3">
        <div>
          <div class="mb-1 text-xs font-semibold text-stone-500 uppercase">Đoàn sinh:</div>
          <div class="flex flex-wrap gap-2">
            <StatusChip domain="student" value="Active" />
            <StatusChip domain="student" value="Paused" />
            <StatusChip domain="student" value="Left" />
            <StatusChip domain="student" value="Graduated" />
          </div>
        </div>

        <div>
          <div class="mb-1 text-xs font-semibold text-stone-500 uppercase">Kết quả điểm số:</div>
          <div class="flex flex-wrap gap-2">
            <StatusChip domain="grade" value="Qualified" />
            <StatusChip domain="grade" value="NotQualified" />
            <StatusChip domain="grade" value="Incomplete" />
          </div>
        </div>

        <div>
          <div class="mb-1 text-xs font-semibold text-stone-500 uppercase">Đề xuất lên lớp:</div>
          <div class="flex flex-wrap gap-2">
            <StatusChip domain="draft" value="Pending" />
            <StatusChip domain="draft" value="Approved" />
            <StatusChip domain="draft" value="Rejected" />
            <StatusChip domain="draft" value="Stale" />
            <StatusChip domain="draft" value="Applied" />
          </div>
        </div>

        <div>
          <div class="mb-1 text-xs font-semibold text-stone-500 uppercase">Niên khóa:</div>
          <div class="flex flex-wrap gap-2">
            <StatusChip domain="year" value="Planned" />
            <StatusChip domain="year" value="Active" />
            <StatusChip domain="year" value="Closing" />
            <StatusChip domain="year" value="Archived" />
          </div>
        </div>

        <div>
          <div class="mb-1 text-xs font-semibold text-stone-500 uppercase">Chứng chỉ bí tích:</div>
          <div class="flex flex-wrap gap-2">
            <StatusChip domain="certificate" value="Issued" />
            <StatusChip domain="certificate" value="Revoked" />
          </div>
        </div>
      </div>
    </section>

    <!-- 5. BANNER KHÓA SỔ ĐIỂM (LOCK BANNER) -->
    <section class="space-y-4 rounded-xl border border-stone-200 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h2 class="text-xl text-marian-700 dark:text-marian-300">
          5. Banner cảnh báo khóa sổ điểm (Lock Banner)
        </h2>
        <div class="flex items-center gap-2">
          <UButton size="xs" variant="outline" @click="testUnlock">
            Mô phỏng Mở khóa (72h)
          </UButton>
          <UButton size="xs" variant="outline" color="neutral" @click="testLock">
            Mô phỏng Khóa lại
          </UButton>
        </div>
      </div>
      <LockBanner
        :year-status="lockStatus"
        :unlocked-until="unlockDate"
        :can-unlock="true"
        @unlock="testUnlock"
      />
    </section>

    <!-- 6. TRẠNG THÁI RỖNG & LỖI (EMPTY & ERROR STATE) -->
    <section class="space-y-4 rounded-xl border border-stone-200 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900">
      <h2 class="text-xl text-marian-700 dark:text-marian-300">
        6. Trạng thái rỗng & Thông báo lỗi RFC 7807 (Empty & Error State)
      </h2>
      
      <div class="space-y-3">
        <h3 class="text-sm font-semibold text-stone-700 dark:text-stone-300">
          Lỗi xác thực dữ liệu (ProblemDetails Validation):
        </h3>
        <ErrorState :error="validationError" @retry="() => {}" />
      </div>

      <div class="space-y-3">
        <h3 class="text-sm font-semibold text-stone-700 dark:text-stone-300">
          Lỗi tần suất thao tác (Rate Limited):
        </h3>
        <ErrorState :error="rateLimitError" @retry="() => {}" />
      </div>

      <div class="space-y-3">
        <h3 class="text-sm font-semibold text-stone-700 dark:text-stone-300">
          Trạng thái chưa có dữ liệu (Empty State):
        </h3>
        <EmptyState
          title="Chưa có đoàn sinh nào trong danh sách"
          description="Lớp này hiện chưa có đoàn sinh ghi danh. Bạn có thể thêm đoàn sinh mới hoặc chuyển đoàn sinh từ lớp khác."
          icon="i-lucide-user-plus"
        >
          <UButton size="sm" icon="i-lucide-plus">
            Thêm đoàn sinh mới
          </UButton>
          <UButton size="sm" variant="outline" icon="i-lucide-file-spreadsheet">
            Nhập từ Excel
          </UButton>
        </EmptyState>
      </div>
    </section>

    <!-- 7. BẢNG MÀU SẮC & BIỂU TƯỢNG CÔNG GIÁO -->
    <section class="space-y-4 rounded-xl border border-stone-200 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900">
      <h2 class="text-xl text-marian-700 dark:text-marian-300">
        7. Bảng màu bản sắc (Marian Blue & Vatican Gold)
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
        <div class="rounded-lg bg-marian-600 p-4 text-white font-semibold">
          Marian Blue 600<br>#1D3A73
        </div>
        <div class="rounded-lg bg-marian-800 p-4 text-white font-semibold">
          Marian Blue 800<br>#13264E
        </div>
        <div class="rounded-lg bg-vatican-500 p-4 text-white font-semibold">
          Vatican Gold 500<br>#A8812A
        </div>
        <div class="rounded-lg bg-vatican-200 p-4 text-stone-900 font-semibold border border-vatican-400">
          Vatican Gold 200<br>#EAD58F
        </div>
      </div>
      <div class="gold-rule py-4">
        <span>✠</span>
      </div>
    </section>
  </div>
</template>
