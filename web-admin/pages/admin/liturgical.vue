<template>
  <div class="min-h-screen font-sans relative pb-24 overflow-hidden">
    <!-- BACKGROUND MESH GRADIENT -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute -top-32 left-0 w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob bg-rose-200 dark:bg-rose-900"></div>
      <div class="absolute bottom-0 right-0 w-[40vw] h-[40vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-amber-200 dark:bg-amber-900"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
    </div>

    <div class="relative z-10 space-y-8 animate-fade-in-up px-4 md:px-8 pt-8 max-w-5xl mx-auto">
      <!-- ── PAGE HEADER & BANNER ── -->
      <div class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-rose-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="z-10 text-center md:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 text-xs font-black uppercase tracking-widest border border-rose-200 dark:border-rose-800 shadow-inner">
            <UIcon name="i-heroicons-calendar-days" class="w-4 h-4" />
            <span>Phân Hệ Phụng Vụ</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-stone-800 dark:text-white tracking-tight">
            Quản Lý <span class="text-rose-500">Lịch Phụng Vụ</span>
          </h1>
          <p class="text-stone-500 text-sm mt-2 max-w-lg">
            Tra cứu, thiết lập và ghi đè ngày lễ (Override) chuẩn của Giáo phận để áp dụng riêng cho Giáo xứ.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- ── TRA CỨU & GHI ĐÈ ── -->
        <div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-rose-100/30 to-transparent dark:from-rose-900/10 pointer-events-none"></div>
          
          <h3 class="font-black text-xl text-stone-800 dark:text-white mb-6 flex items-center gap-2 relative z-10"><UIcon name="i-heroicons-magnifying-glass-circle" class="text-rose-500 w-7 h-7" /> Tra cứu & Tùy chỉnh (Override)</h3>
          
          <div class="relative z-10 space-y-6">
            <div class="p-5 bg-white/70 dark:bg-stone-950/70 backdrop-blur-md rounded-2xl border border-white/50 dark:border-stone-800 shadow-sm">
              <UFormField label="Chọn ngày cần tra cứu" required>
                <UInput v-model="selectedDate" type="date" size="lg" :ui="{ base: 'rounded-xl shadow-inner font-bold' }" @change="fetchDay" />
              </UFormField>
            </div>

            <!-- Kết quả tra cứu -->
            <transition name="fade">
              <div v-if="dayData" class="p-6 rounded-2xl border-2 shadow-lg relative overflow-hidden transition-all duration-300" :class="getColorBorder(dayData.liturgicalColor)">
                
                <div class="absolute top-0 right-0 px-3 py-1 rounded-bl-xl font-bold text-[10px] uppercase tracking-widest text-white shadow-sm" :class="getColorBg(dayData.liturgicalColor)">
                  {{ dayData.liturgicalColorVi }}
                </div>

                <UBadge v-if="dayData.feastName.includes('Tùy chỉnh')" label="ĐÃ GHI ĐÈ" color="amber" variant="solid" class="absolute top-3 right-24 animate-pulse shadow-md font-black uppercase tracking-widest text-[10px]" />

                <div class="pr-12">
                  <p class="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Ngày {{ formatDate(selectedDate) }}</p>
                  <h4 class="font-black text-2xl leading-tight mb-4" :class="getColorText(dayData.liturgicalColor)">
                    {{ dayData.feastName }}
                  </h4>
                </div>

                <div class="flex gap-2 border-t border-stone-200 dark:border-stone-800 pt-4 mt-2">
                  <UButton label="Tùy chỉnh ngày này" color="rose" variant="solid" icon="i-heroicons-pencil-square" class="rounded-xl shadow-md font-bold text-xs" @click="openOverrideModal" />
                  <UButton v-if="dayData.feastName.includes('Tùy chỉnh')" label="Khôi phục" color="error" variant="ghost" icon="i-heroicons-arrow-uturn-left" class="rounded-xl font-bold text-xs" @click="deleteOverride" />
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- ── IMPORT JSON ── -->
        <div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-center items-center text-center">
          <div class="w-24 h-24 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-white dark:ring-stone-900">
            <UIcon name="i-heroicons-arrow-up-tray" class="w-10 h-10 text-stone-400" />
          </div>
          <h3 class="font-black text-xl text-stone-800 dark:text-white mb-3">Nhập Dữ Liệu (Import JSON)</h3>
          <p class="text-stone-500 text-sm mb-6 max-w-xs">Tính năng đang được phát triển để hỗ trợ nhập hàng loạt danh sách các ngày lễ từ file JSON chuẩn của Giáo phận.</p>
          <UTooltip text="Tính năng đang được bảo trì / phát triển">
            <UButton label="Tải lên File JSON" icon="i-heroicons-lock-closed" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold cursor-not-allowed opacity-50" disabled />
          </UTooltip>
        </div>

      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         MODAL: TÙY CHỈNH (OVERRIDE)
    ═══════════════════════════════════════════════════════ -->
    <UModal v-model:open="isModalOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' }, footer: { padding: 'p-6 bg-stone-50 dark:bg-stone-900' } }">
        <template #header>
          <div class="bg-rose-600 dark:bg-rose-900 p-6 flex justify-between items-center text-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><UIcon name="i-heroicons-pencil-square" class="w-6 h-6" /></div>
              <h3 class="text-xl font-black uppercase tracking-wide">Tùy Chỉnh Ngày Lễ</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="white" variant="ghost" class="hover:bg-white/10 rounded-full" @click="isModalOpen = false" />
          </div>
        </template>
        
        <form class="p-8 space-y-6" @submit.prevent="submitOverride">
          <div class="text-center pb-4 border-b border-stone-200 dark:border-stone-800">
            <p class="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Áp dụng cho ngày</p>
            <p class="text-xl font-black text-rose-600 dark:text-rose-400">{{ formatDate(selectedDate) }}</p>
          </div>

          <UFormField label="Tên ngày lễ (Hiển thị)" required>
            <UInput v-model="form.title" placeholder="VD: Lễ Thánh Đaminh, Bổn mạng xứ..." required size="lg" :ui="{ base: 'rounded-xl shadow-inner font-bold' }" />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Màu áo lễ" required>
              <USelectMenu v-model="form.color" :options="colorOptions" value-attribute="value" option-attribute="label" class="w-full" :ui="{ base: 'rounded-xl shadow-inner font-bold' }" />
            </UFormField>
            <UFormField label="Bậc lễ" required>
              <USelectMenu v-model="form.level" :options="levelOptions" value-attribute="value" option-attribute="label" class="w-full" :ui="{ base: 'rounded-xl shadow-inner font-bold' }" />
            </UFormField>
          </div>
        </form>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Hủy Bỏ" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isModalOpen = false" />
            <UButton label="Lưu Tùy Chỉnh" color="rose" variant="solid" size="lg" class="rounded-xl font-black uppercase tracking-wider shadow-lg shadow-rose-500/20" :loading="saving" @click="submitOverride" />
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
useHead({ title: 'Quản Lý Lịch Phụng Vụ - GiaoLy Admin' })

const toast = useToast()

const today = new Date()
const localTodayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')

const selectedDate = ref(localTodayStr)
const dayData = ref(null)

const isModalOpen = ref(false)
const saving = ref(false)
const form = reactive({ title: '', color: 'White', level: 'Thường' })

const colorOptions = [
  { value: 'Green', label: 'Xanh Lá' },
  { value: 'White', label: 'Trắng' },
  { value: 'Red', label: 'Đỏ' },
  { value: 'Purple', label: 'Tím' },
  { value: 'Rose', label: 'Hồng' },
  { value: 'Black', label: 'Đen' }
]

const levelOptions = [
  { value: 'Thường', label: 'Thường' },
  { value: 'Nhớ', label: 'Lễ Nhớ' },
  { value: 'Kính', label: 'Lễ Kính' },
  { value: 'Trọng', label: 'Lễ Trọng' }
]

const fetchDay = async () => {
  if (!selectedDate.value) return
  try {
    const data = await $api(`/Liturgical/${selectedDate.value}`)
    dayData.value = data
  } catch { toast.add({ title: 'Lỗi tra cứu', color: 'error' }) }
}

const openOverrideModal = () => {
  form.title = dayData.value.feastName.replace(' (Tùy chỉnh)', '')
  const matchedOpt = colorOptions.find(o => o.value.toLowerCase() === dayData.value.liturgicalColor.toLowerCase())
  form.color = matchedOpt ? matchedOpt.value : 'White'
  form.level = 'Thường'
  isModalOpen.value = true
}

const submitOverride = async () => {
  saving.value = true
  try {
    await $api('/Liturgical/override', {
      method: 'POST',
      body: { date: selectedDate.value, title: form.title, color: form.color, level: form.level }
    })
    toast.add({ title: 'Đã lưu tùy chỉnh', color: 'success' })
    isModalOpen.value = false
    await fetchDay()
  } catch { toast.add({ title: 'Lỗi ghi đè', color: 'error' }) } 
  finally { saving.value = false }
}

const deleteOverride = async () => {
  if (!confirm('Bạn có chắc muốn xóa tùy chỉnh và khôi phục Lịch Phụng Vụ gốc tự động?')) return
  try {
    await $api(`/Liturgical/override/${selectedDate.value}`, { method: 'DELETE' })
    toast.add({ title: 'Đã xóa tùy chỉnh, khôi phục gốc', color: 'success' })
    await fetchDay()
  } catch { toast.add({ title: 'Lỗi xóa', color: 'error' }) }
}

const getColorText = (color) => {
  const c = color.toLowerCase()
  if (c === 'red') return 'text-red-600 dark:text-red-400'
  if (c === 'purple') return 'text-purple-600 dark:text-purple-400'
  if (c === 'white') return 'text-amber-500 dark:text-amber-400' 
  if (c === 'rose') return 'text-pink-500'
  if (c === 'black') return 'text-stone-800 dark:text-stone-300'
  return 'text-green-600 dark:text-green-400'
}

const getColorBg = (color) => {
  const c = color.toLowerCase()
  if (c === 'red') return 'bg-red-500'
  if (c === 'purple') return 'bg-purple-500'
  if (c === 'white') return 'bg-amber-400' // yellow for visibility
  if (c === 'rose') return 'bg-pink-500'
  if (c === 'black') return 'bg-stone-800'
  return 'bg-green-500'
}

const getColorBorder = (color) => {
  const c = color.toLowerCase()
  if (c === 'red') return 'border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20'
  if (c === 'purple') return 'border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/20'
  if (c === 'white') return 'border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20'
  if (c === 'rose') return 'border-pink-200 dark:border-pink-900/50 bg-pink-50/50 dark:bg-pink-950/20'
  if (c === 'black') return 'border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/20'
  return 'border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-950/20'
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  return `${parts[2]}/${parts[1]}/${parts[0]}`
}

onMounted(() => { fetchDay() })
</script>

<style>
@keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
.animate-blob { animation: blob 10s infinite; }
.animation-delay-2000 { animation-delay: 2s; }
@keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
