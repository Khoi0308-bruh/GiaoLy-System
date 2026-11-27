<script setup lang="ts">
/**
 * Khung bảng danh sách dùng chung cho các trang admin.
 *
 * - Header dính ở mép trên màn hình khi cuộn trang (`thead th` sticky). Khung ngoài
 *   KHÔNG được có `overflow-hidden`/`contain:paint`: khi đó khung trở thành vùng cuộn và
 *   sticky chỉ dính vào mép khung, header trôi khỏi màn hình (đã đo được `th.top = -47px`).
 * - Bảng không đặt `min-width`, cột chia theo % nên không tràn ngang ở mọi bề rộng.
 * - Dưới `md`: cùng dữ liệu hiển thị dạng thẻ qua slot `#cards` thay vì cuộn ngang.
 *
 * Slot: `#head` (các `<th>`), `#rows` (các `<tr>`), `#cards` (thẻ mobile), `#footer` (phân trang).
 */
withDefaults(defineProps<{
  /** Số cột của bảng, dùng cho `colspan` của dòng đang tải / rỗng. */
  columns: number
  loading?: boolean
  empty?: boolean
  loadingText?: string
  emptyTitle?: string
  emptyDescription?: string
  /** Bật/tắt thanh chân bảng (phân trang) mà không cần gỡ slot. */
  footer?: boolean
  /**
   * Bỏ viền/nền/bo góc của khung: dùng khi bảng nằm trong một thẻ có sẵn
   * (thẻ có tiêu đề riêng) để không thành hai lớp viền lồng nhau.
   */
  flat?: boolean
}>(), {
  loading: false,
  empty: false,
  loadingText: 'Đang tải dữ liệu...',
  emptyTitle: 'Không có dữ liệu',
  emptyDescription: '',
  footer: true,
  flat: false
})

const STICKY_HEAD = [
  '[&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:z-10',
  '[&_thead_th]:border-b [&_thead_th]:border-stone-200 [&_thead_th]:bg-stone-50',
  'dark:[&_thead_th]:border-stone-800 dark:[&_thead_th]:bg-stone-950',
  '[&_thead_th:first-child]:rounded-tl-xl [&_thead_th:last-child]:rounded-tr-xl',
  '[&_tbody_tr:last-child>td:first-child]:rounded-bl-xl [&_tbody_tr:last-child>td:last-child]:rounded-br-xl'
].join(' ')
</script>

<template>
  <div
    :class="flat
      ? 'w-full'
      : 'rounded-xl border border-stone-200 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900'"
  >
    <table :class="['hidden w-full table-fixed text-left text-sm md:table', STICKY_HEAD]">
      <thead class="text-[11px] font-semibold tracking-wide text-stone-500 uppercase dark:text-stone-400">
        <tr>
          <slot name="head" />
        </tr>
      </thead>
      <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
        <tr v-if="loading">
          <td :colspan="columns" class="p-8 text-center text-stone-500">
            <UIcon name="i-lucide-loader-2" class="mx-auto mb-2 size-6 animate-spin text-marian-600" />
            <span>{{ loadingText }}</span>
          </td>
        </tr>
        <tr v-else-if="empty">
          <td :colspan="columns" class="p-8">
            <EmptyState :title="emptyTitle" :description="emptyDescription || undefined" />
          </td>
        </tr>
        <template v-else>
          <slot name="rows" />
        </template>
      </tbody>
    </table>

    <!-- <md: dạng thẻ, không cuộn ngang -->
    <div class="divide-y divide-stone-100 md:hidden dark:divide-stone-800">
      <div v-if="loading" class="p-8 text-center text-sm text-stone-500">
        <UIcon name="i-lucide-loader-2" class="mx-auto mb-2 size-6 animate-spin text-marian-600" />
        {{ loadingText }}
      </div>
      <div v-else-if="empty" class="p-6">
        <EmptyState :title="emptyTitle" :description="emptyDescription || undefined" />
      </div>
      <template v-else>
        <slot name="cards" />
      </template>
    </div>

    <div
      v-if="footer && $slots.footer"
      class="flex flex-col gap-2 border-t border-stone-200 px-3 py-2.5 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between dark:border-stone-800"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
