<template>
  <div class="min-h-screen bg-stone-50 dark:bg-stone-950 font-sans selection:bg-primary-500/30 relative pb-24">
    <!-- ═══════════════════════════════════════════════════════
         BACKGROUND MESH GRADIENT
    ═══════════════════════════════════════════════════════ -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div class="absolute top-[10%] left-[20%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob bg-rose-400"></div>
      <div class="absolute -bottom-[20%] right-[10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-sky-400"></div>
      <div class="absolute top-[30%] right-[30%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-15 dark:opacity-5 animate-blob animation-delay-4000 bg-amber-400"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
    </div>

    <UContainer class="relative z-10 pt-12 space-y-8 animate-fade-in-up">
      <!-- ═══════════════════════════════════════════════════════
           PAGE HEADER
      ═══════════════════════════════════════════════════════ -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-white/60 dark:bg-stone-900/40 backdrop-blur-md border border-white/40 dark:border-stone-700/50 shadow-sm text-xs font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest">
            <UIcon name="i-heroicons-user-group" class="w-4 h-4" />
            <span>Hồ Sơ Sứ Đoàn</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-stone-900 dark:text-white uppercase tracking-tight leading-tight drop-shadow-sm">
            Danh Sách <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">Đoàn Sinh</span>
          </h1>
          <p class="text-stone-500 text-lg mt-2 font-serif italic">
            Hiển thị danh sách đoàn sinh hiện tại (Chế độ xem)
          </p>
        </div>
        
        <div v-if="authStore.isLoggedIn" class="shrink-0 mb-2">
          <UButton
            to="/admin/students"
            label="Quản lý Dữ liệu"
            icon="i-heroicons-pencil-square"
            color="primary"
            variant="solid"
            size="lg"
            class="rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 bg-gradient-to-r from-primary-600 to-primary-500 hover:-translate-y-0.5 transition-transform"
          />
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════
           GLASSMORPHIC FILTER BAR
      ═══════════════════════════════════════════════════════ -->
      <div class="bg-white/60 dark:bg-stone-900/60 backdrop-blur-2xl border border-white/50 dark:border-stone-800 rounded-[2rem] p-3 shadow-xl shadow-black/5 animate-fade-in-up delay-100">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
          <!-- Tên -->
          <div class="md:col-span-1 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5 text-stone-400" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tên, Tên Thánh..."
              class="w-full pl-10 pr-4 py-2.5 bg-stone-100/50 dark:bg-stone-800/50 rounded-2xl border border-stone-200/50 dark:border-stone-700/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-stone-900 dark:text-white placeholder-stone-400 font-medium transition-all"
            />
          </div>

          <!-- Ngành -->
          <div class="md:col-span-1">
            <USelect
              v-model="filterBranch"
              :options="[{ label: 'Tất cả Ngành', value: 0 }, { label: 'Chiên con', value: 1 }, { label: 'Ấu nhi', value: 2 }, { label: 'Thiếu nhi', value: 3 }, { label: 'Nghĩa sĩ', value: 4 }, { label: 'Hiệp sĩ', value: 5 }]"
              value-attribute="value"
              option-attribute="label"
              size="lg"
              variant="none"
              class="w-full bg-stone-100/50 dark:bg-stone-800/50 rounded-2xl border border-stone-200/50 dark:border-stone-700/50 font-medium text-stone-700 dark:text-stone-300"
            />
          </div>

          <!-- Rửa Tội -->
          <div class="md:col-span-1">
            <USelect
              v-model="filterBaptism"
              :options="[{ label: 'Rửa Tội: Tất cả', value: '' }, { label: 'Đã Rửa Tội', value: 'true' }, { label: 'Chưa Rửa Tội', value: 'false' }]"
              value-attribute="value"
              option-attribute="label"
              size="lg"
              variant="none"
              class="w-full bg-stone-100/50 dark:bg-stone-800/50 rounded-2xl border border-stone-200/50 dark:border-stone-700/50 font-medium text-stone-700 dark:text-stone-300"
            />
          </div>

          <!-- Rước Lễ -->
          <div class="md:col-span-1">
            <USelect
              v-model="filterCommunion"
              :options="[{ label: 'Rước Lễ: Tất cả', value: '' }, { label: 'Đã Rước Lễ', value: 'true' }, { label: 'Chưa Rước Lễ', value: 'false' }]"
              value-attribute="value"
              option-attribute="label"
              size="lg"
              variant="none"
              class="w-full bg-stone-100/50 dark:bg-stone-800/50 rounded-2xl border border-stone-200/50 dark:border-stone-700/50 font-medium text-stone-700 dark:text-stone-300"
            />
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════
           PREMIUM GLASS TABLE
      ═══════════════════════════════════════════════════════ -->
      <UCard 
        class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-3xl shadow-2xl shadow-black/5 dark:shadow-black/40 border border-white/50 dark:border-stone-800 rounded-[2.5rem] overflow-hidden animate-fade-in-up delay-200"
        :ui="{ body: { padding: 'p-0', base: 'overflow-x-auto' } }"
      >
        <UTable
          :rows="pagedData?.items || []"
          :columns="columns"
          :loading="pending"
          :empty-state="{ icon: 'i-heroicons-users', header: 'Không tìm thấy hồ sơ', label: 'Vui lòng thay đổi bộ lọc hoặc từ khóa.' }"
          :ui="{ 
            th: { base: 'bg-stone-100/50 dark:bg-stone-900/50 font-black uppercase tracking-widest text-[10px] text-stone-500 py-5 border-b border-white/40 dark:border-stone-800/50' },
            td: { base: 'whitespace-nowrap border-b border-stone-200/20 dark:border-stone-800/20 py-4' },
            tr: { base: 'hover:bg-white/50 dark:hover:bg-stone-800/50 transition-colors' }
          }"
        >
          <!-- Cột: Tên Đoàn Sinh -->
          <template #fullName-cell="{ row }">
            <div class="block py-1 pl-2">
              <p class="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-0.5">
                {{ row.original.holyName }}
              </p>
              <p class="font-black font-serif text-stone-800 dark:text-white text-lg">
                {{ row.original.fullName }}
              </p>
            </div>
          </template>

          <!-- Cột: Lớp -->
          <template #className-cell="{ row }">
            <div class="flex items-center gap-2 text-stone-600 dark:text-stone-300">
              <UIcon name="i-heroicons-academic-cap" class="w-4 h-4 text-stone-400" />
              <span class="font-bold">{{ row.original.className || 'Chưa xếp' }}</span>
            </div>
          </template>

          <!-- Cột: Ngành -->
          <template #branch-cell="{ row }">
            <UBadge
              :label="getBranchName(row.original.branch)"
              :color="getBranchColor(row.original.branch)"
              variant="soft"
              size="sm"
              class="font-black uppercase tracking-widest px-3 rounded-xl shadow-inner"
            />
          </template>

          <!-- Cột: Bí Tích (Glowing Badges) -->
          <template #sacraments-cell="{ row }">
            <div class="flex items-center gap-2">
              
              <!-- Rửa Tội -->
              <UTooltip text="Rửa Tội">
                <div :class="[
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm transition-all', 
                  row.original.baptismDate 
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 shadow-blue-500/20 drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]' 
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200/50 dark:border-stone-700'
                ]">
                  R
                </div>
              </UTooltip>

              <!-- Rước Lễ -->
              <UTooltip text="Rước Lễ">
                <div :class="[
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm transition-all', 
                  row.original.communionDate 
                    ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shadow-amber-500/20 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]' 
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200/50 dark:border-stone-700'
                ]">
                  L
                </div>
              </UTooltip>

              <!-- Thêm Sức -->
              <UTooltip text="Thêm Sức">
                <div :class="[
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm transition-all', 
                  row.original.confirmationDate 
                    ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 shadow-rose-500/20 drop-shadow-[0_0_4px_rgba(225,29,72,0.5)]' 
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200/50 dark:border-stone-700'
                ]">
                  S
                </div>
              </UTooltip>

            </div>
          </template>
        </UTable>

        <!-- Phân Trang (Pagination) -->
        <div class="flex justify-between items-center px-6 py-4 border-t border-white/30 dark:border-stone-800/50 bg-stone-100/30 dark:bg-stone-900/30 backdrop-blur-md">
          <span class="text-sm font-bold text-stone-500">
            Tổng cộng: <b class="text-primary-600 dark:text-primary-400 text-lg ml-1">{{ pagedData?.total || 0 }}</b>
          </span>
          <UPagination
            v-model="page"
            :page-count="pageSize"
            :total="pagedData?.total || 0"
          />
        </div>
      </UCard>
    </UContainer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({ layout: 'public' })
useHead({ title: 'Danh Sách Đoàn Sinh - GiaoLy' })

const authStore = useAuthStore()

// State Phân Trang & Filter
const page = ref(1)
const pageSize = ref(20)
const searchQuery = ref('')
const filterBranch = ref(0)
const filterBaptism = ref('')
const filterCommunion = ref('')

// Gọi API Phân Trang
const { data: pagedData, pending } = await useApiFetch('/Student/paged', {
  query: computed(() => ({
    page: page.value,
    pageSize: pageSize.value,
    search: searchQuery.value,
    branch: filterBranch.value,
    hasBaptism: filterBaptism.value !== '' ? filterBaptism.value === 'true' : undefined,
    hasCommunion: filterCommunion.value !== '' ? filterCommunion.value === 'true' : undefined
  })),
  watch: [page, pageSize, searchQuery, filterBranch, filterBaptism, filterCommunion]
})

const columns = [
  { accessorKey: 'fullName', header: 'Hồ Sơ Đoàn Sinh' },
  { accessorKey: 'className', header: 'Phân Lớp' },
  { accessorKey: 'branch', header: 'Ngành' },
  { accessorKey: 'sacraments', header: 'Trạng Thái Bí Tích' }
]

// ── Helpers ───────────────────────────────────────────────────
const getBranchName = b => ({ 1: 'Chiên con', 2: 'Ấu nhi', 3: 'Thiếu nhi', 4: 'Nghĩa sĩ', 5: 'Hiệp sĩ' }[b] || 'Khác')
const getBranchColor = b => ({ 1: 'pink', 2: 'green', 3: 'blue', 4: 'yellow', 5: 'red' }[b] || 'gray')
</script>

<style>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 10s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
