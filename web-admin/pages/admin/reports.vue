<template>
  <div class="min-h-screen font-sans relative pb-24 overflow-hidden">
    <!-- BACKGROUND MESH GRADIENT -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute -top-32 left-1/4 w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob bg-indigo-200 dark:bg-indigo-900"></div>
      <div class="absolute top-1/2 -right-32 w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-sky-200 dark:bg-sky-900"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
    </div>

    <div class="relative z-10 space-y-6 animate-fade-in-up px-4 md:px-8 pt-8 max-w-7xl mx-auto">
      <!-- ── PAGE HEADER & BANNER ── -->
      <div class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-indigo-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="z-10 text-center md:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-xs font-black uppercase tracking-widest border border-indigo-200 dark:border-indigo-800 shadow-inner">
            <UIcon name="i-heroicons-chart-pie" class="w-4 h-4" />
            <span>Phân Hệ Học Vụ</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-stone-800 dark:text-white tracking-tight">
            Báo Cáo <span class="text-indigo-500">Thống Kê</span>
          </h1>
          <p class="text-stone-500 text-sm mt-2 max-w-lg">
            Góc nhìn toàn cảnh về dữ liệu đoàn sinh, tiến độ bí tích và phân bổ theo các phân ngành.
          </p>
        </div>
        
        <div class="flex flex-wrap items-center justify-center gap-3 z-10">
          <UButton
            v-if="auth?.hasPermission('students.export')"
            label="Xuất Báo Cáo (PDF)"
            icon="i-heroicons-document-arrow-down"
            color="neutral"
            variant="soft"
            size="lg"
            class="rounded-2xl shadow-sm hover:-translate-y-0.5 transition-transform font-bold"
            @click="exportPdf"
          />
          <UButton
            v-if="auth?.hasPermission('students.export')"
            label="Xuất Dữ Liệu (Excel)"
            icon="i-heroicons-table-cells"
            color="indigo"
            variant="solid"
            size="lg"
            class="rounded-2xl shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 transition-transform font-bold"
            @click="exportExcel"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="flex flex-col items-center justify-center py-24">
        <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 animate-spin text-indigo-400 mb-4" />
        <p class="text-stone-500 font-bold uppercase tracking-widest text-sm">Đang tính toán số liệu...</p>
      </div>

      <div v-else class="space-y-8">
        <!-- ── BENTO GRID TỔNG QUAN (PROGRESS RINGS) ── -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          
          <div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-2xl border border-white/60 dark:border-stone-800 rounded-3xl p-6 shadow-xl shadow-black/5 flex flex-col items-center text-center hover:-translate-y-1 transition-transform relative overflow-hidden group">
            <div class="absolute inset-0 bg-gradient-to-b from-stone-100/50 to-transparent dark:from-stone-800/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative w-32 h-32 mb-4">
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path class="text-stone-100 dark:text-stone-800" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path class="text-indigo-500" stroke-width="3" stroke-dasharray="100, 100" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke-linecap="round" />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <UIcon name="i-heroicons-users" class="w-8 h-8 text-indigo-500" />
              </div>
            </div>
            <p class="text-4xl font-black text-stone-800 dark:text-white">{{ totalStudents }}</p>
            <p class="text-xs font-bold text-stone-500 uppercase tracking-widest mt-2">Tổng Đoàn Sinh</p>
          </div>

          <div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-2xl border border-white/60 dark:border-stone-800 rounded-3xl p-6 shadow-xl shadow-black/5 flex flex-col items-center text-center hover:-translate-y-1 transition-transform relative overflow-hidden group">
            <div class="absolute inset-0 bg-gradient-to-b from-blue-100/20 to-transparent dark:from-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative w-32 h-32 mb-4">
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path class="text-stone-100 dark:text-stone-800" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path class="text-blue-500 transition-all duration-1000 ease-out" stroke-width="3" :stroke-dasharray="`${getPercentage(totalBaptism)}, 100`" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke-linecap="round" />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <p class="text-lg font-black text-blue-600 dark:text-blue-400">{{ getPercentage(totalBaptism) }}%</p>
              </div>
            </div>
            <p class="text-4xl font-black text-stone-800 dark:text-white">{{ totalBaptism }}</p>
            <p class="text-xs font-bold text-stone-500 uppercase tracking-widest mt-2">Đã Rửa Tội</p>
          </div>

          <div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-2xl border border-white/60 dark:border-stone-800 rounded-3xl p-6 shadow-xl shadow-black/5 flex flex-col items-center text-center hover:-translate-y-1 transition-transform relative overflow-hidden group">
            <div class="absolute inset-0 bg-gradient-to-b from-amber-100/20 to-transparent dark:from-amber-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative w-32 h-32 mb-4">
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path class="text-stone-100 dark:text-stone-800" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path class="text-amber-500 transition-all duration-1000 ease-out" stroke-width="3" :stroke-dasharray="`${getPercentage(totalCommunion)}, 100`" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke-linecap="round" />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <p class="text-lg font-black text-amber-600 dark:text-amber-400">{{ getPercentage(totalCommunion) }}%</p>
              </div>
            </div>
            <p class="text-4xl font-black text-stone-800 dark:text-white">{{ totalCommunion }}</p>
            <p class="text-xs font-bold text-stone-500 uppercase tracking-widest mt-2">Đã Rước Lễ</p>
          </div>

          <div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-2xl border border-white/60 dark:border-stone-800 rounded-3xl p-6 shadow-xl shadow-black/5 flex flex-col items-center text-center hover:-translate-y-1 transition-transform relative overflow-hidden group">
            <div class="absolute inset-0 bg-gradient-to-b from-red-100/20 to-transparent dark:from-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative w-32 h-32 mb-4">
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path class="text-stone-100 dark:text-stone-800" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path class="text-red-500 transition-all duration-1000 ease-out" stroke-width="3" :stroke-dasharray="`${getPercentage(totalConfirmation)}, 100`" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke-linecap="round" />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <p class="text-lg font-black text-red-600 dark:text-red-400">{{ getPercentage(totalConfirmation) }}%</p>
              </div>
            </div>
            <p class="text-4xl font-black text-stone-800 dark:text-white">{{ totalConfirmation }}</p>
            <p class="text-xs font-bold text-stone-500 uppercase tracking-widest mt-2">Đã Thêm Sức</p>
          </div>
          
        </div>

        <!-- ── TIẾN ĐỘ THEO NGÀNH (HORIZONTAL PROGRESS BARS) ── -->
        <UCard 
          class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-3xl shadow-2xl shadow-black/5 border border-white/50 dark:border-stone-800 rounded-[2.5rem] overflow-hidden"
          :ui="{ body: { padding: 'p-8' } }"
        >
          <div class="flex items-center gap-4 mb-8 pb-4 border-b border-stone-200 dark:border-stone-800">
            <div class="p-3 bg-primary-100 dark:bg-primary-900/50 text-primary-600 rounded-2xl shadow-inner"><UIcon name="i-heroicons-chart-bar-square" class="w-8 h-8" /></div>
            <div>
              <h2 class="text-2xl font-black text-stone-800 dark:text-white tracking-tight">Phân Bố Ngành</h2>
              <p class="text-sm font-bold text-stone-500 uppercase tracking-widest mt-1">Tỷ lệ đoàn sinh theo từng phân ngành</p>
            </div>
          </div>

          <div class="space-y-8">
            <div v-for="branch in branchStats" :key="branch.id" class="relative group">
              <div class="flex justify-between items-end mb-2">
                <p class="font-black text-lg text-stone-800 dark:text-white group-hover:translate-x-2 transition-transform">{{ branch.name }}</p>
                <div class="text-right">
                  <p class="font-black text-2xl" :class="branch.colorClass">{{ branch.count }} <span class="text-sm text-stone-400 font-bold ml-1">em</span></p>
                  <p class="text-xs font-bold text-stone-500 uppercase tracking-widest">{{ getPercentage(branch.count) }}% tổng số</p>
                </div>
              </div>
              <div class="w-full h-4 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden shadow-inner">
                <div class="h-full rounded-full transition-all duration-1000 ease-out" :class="branch.bgClass" :style="`width: ${getPercentage(branch.count)}%`"></div>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
useHead({ title: 'Báo Cáo Thống Kê - GiaoLy Admin' })

const auth = useAuthStore()
const toast = useToast()

const { data: students, pending } = await useApiFetch('/Student')

const totalStudents = computed(() => students.value?.length || 0)
const totalBaptism = computed(() => students.value?.filter(s => s.baptismDate).length || 0)
const totalCommunion = computed(() => students.value?.filter(s => s.communionDate).length || 0)
const totalConfirmation = computed(() => students.value?.filter(s => s.confirmationDate).length || 0)

const branchStats = computed(() => {
  const countBranch = (b) => students.value?.filter(s => s.branch === b).length || 0
  return [
    { id: 1, name: 'Chiên Con', count: countBranch(1), colorClass: 'text-pink-500', bgClass: 'bg-gradient-to-r from-pink-400 to-pink-500' },
    { id: 2, name: 'Ấu Nhi', count: countBranch(2), colorClass: 'text-emerald-500', bgClass: 'bg-gradient-to-r from-emerald-400 to-emerald-500' },
    { id: 3, name: 'Thiếu Nhi', count: countBranch(3), colorClass: 'text-blue-500', bgClass: 'bg-gradient-to-r from-blue-400 to-blue-500' },
    { id: 4, name: 'Nghĩa Sĩ', count: countBranch(4), colorClass: 'text-amber-500', bgClass: 'bg-gradient-to-r from-amber-400 to-amber-500' },
    { id: 5, name: 'Hiệp Sĩ', count: countBranch(5), colorClass: 'text-red-500', bgClass: 'bg-gradient-to-r from-red-400 to-red-500' }
  ]
})

const getPercentage = (count) => {
  if (totalStudents.value === 0) return 0
  return ((count / totalStudents.value) * 100).toFixed(1)
}

const exportExcel = async () => {
  try {
    const res = await $fetch(`${useRuntimeConfig().public.apiBase}/Student/export-excel`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${auth.token}` },
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([res]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `BaoCaoTongHop_${new Date().toISOString().split('T')[0]}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (err) {
    toast.add({ title: 'Lỗi xuất Excel', description: err.message, color: 'error' })
  }
}

const exportPdf = () => {
  window.print()
}
</script>

<style>
@keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
.animate-blob { animation: blob 10s infinite; }
.animation-delay-2000 { animation-delay: 2s; }
@keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

@media print {
  /* Ẩn Sidebar, Header và các nút khi in PDF */
  aside, header, nav, button { display: none !important; }
  .fixed, .absolute.inset-0 { display: none !important; } /* Ẩn background mesh */
  .md\:ml-64, .md\:ml-20 { margin-left: 0 !important; }
  .animate-fade-in-up { animation: none !important; opacity: 1 !important; transform: none !important; }
  .bg-white\/40, .bg-white\/50 { background: white !important; }
  * { text-shadow: none !important; box-shadow: none !important; }
}
</style>
