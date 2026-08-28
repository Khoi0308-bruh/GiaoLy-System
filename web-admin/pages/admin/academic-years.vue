<template>
  <div class="min-h-screen font-sans relative pb-24 overflow-hidden">
    <!-- BACKGROUND MESH GRADIENT -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob bg-fuchsia-200 dark:bg-fuchsia-900"></div>
      <div class="absolute -bottom-32 left-0 w-[40vw] h-[40vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-emerald-200 dark:bg-emerald-900"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
    </div>

    <div class="relative z-10 space-y-6 animate-fade-in-up px-4 md:px-8 pt-8 max-w-7xl mx-auto">
      <!-- ── PAGE HEADER & BANNER ── -->
      <div class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-fuchsia-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="z-10 text-center md:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/50 text-fuchsia-600 dark:text-fuchsia-300 text-xs font-black uppercase tracking-widest border border-fuchsia-200 dark:border-fuchsia-800 shadow-inner">
            <UIcon name="i-heroicons-calendar-days" class="w-4 h-4" />
            <span>Phân Hệ Học Vụ</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-stone-800 dark:text-white tracking-tight">
            Quản Lý <span class="text-fuchsia-500">Niên Khóa</span>
          </h1>
          <p class="text-stone-500 text-sm mt-2 max-w-lg">
            Thiết lập năm học, lên lớp tự động và sao chép cấu trúc dữ liệu qua các năm.
          </p>
        </div>
        
        <div class="flex flex-wrap items-center justify-center gap-3 z-10">
          <UButton
            icon="i-heroicons-document-duplicate"
            label="Sao chép từ năm cũ"
            color="white"
            variant="solid"
            size="lg"
            class="rounded-2xl shadow-sm hover:-translate-y-0.5 transition-transform font-bold"
            @click="openCloneModal"
          />
          <UButton
            icon="i-heroicons-sparkles"
            label="Lên Lớp Tự Động"
            color="emerald"
            variant="soft"
            size="lg"
            class="rounded-2xl shadow-sm hover:-translate-y-0.5 transition-transform font-bold"
            @click="openPromoteModal"
          />
          <UButton
            icon="i-heroicons-plus"
            label="Tạo Niên Khóa"
            color="fuchsia"
            variant="solid"
            size="lg"
            class="rounded-2xl shadow-lg shadow-fuchsia-500/20 hover:-translate-y-0.5 transition-transform font-bold uppercase tracking-wider"
            @click="isCreateOpen = true"
          />
        </div>
      </div>

      <!-- Active year banner -->
      <div v-if="activeYear" class="bg-gradient-to-r from-emerald-500 to-teal-400 p-1 rounded-3xl shadow-xl shadow-emerald-500/20 animate-fade-in-up">
        <div class="bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl rounded-[1.4rem] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
              <UIcon name="i-heroicons-check-badge" class="w-7 h-7" />
            </div>
            <div>
              <p class="text-xs font-bold text-stone-500 uppercase tracking-widest">Niên khóa đang hoạt động</p>
              <h2 class="text-2xl font-black text-stone-800 dark:text-white">{{ activeYear.name }}</h2>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-bold text-stone-500"><UIcon name="i-heroicons-calendar" class="inline-block mr-1" /> {{ formatDate(activeYear.startDate) }} — {{ formatDate(activeYear.endDate) }}</p>
          </div>
        </div>
      </div>

      <!-- DRAFT ACTIONS BUTTON -->
      <div class="flex justify-end">
        <UButton
          icon="i-heroicons-clipboard-document-check"
          label="Chuyển đến: Xét Duyệt Bản Nháp Lên Lớp"
          color="amber"
          variant="soft"
          size="lg"
          class="rounded-2xl font-bold uppercase tracking-wider shadow-sm"
          to="/admin/draft-actions"
        />
      </div>

      <!-- List of years (Grid) -->
      <div v-if="!pending && !years?.length" class="text-center py-24 text-stone-400 bg-white/40 dark:bg-stone-900/40 rounded-[2rem] border border-white/50 dark:border-stone-800">
        <UIcon name="i-heroicons-calendar" class="w-16 h-16 mx-auto mb-4 opacity-30" />
        <p class="text-lg font-bold">Chưa có niên khóa nào. Hãy tạo niên khóa đầu tiên!</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="year in years"
          :key="year.id"
          class="group bg-white/50 dark:bg-stone-900/50 backdrop-blur-xl border border-white/60 dark:border-stone-800 rounded-3xl p-6 shadow-xl shadow-black/5 flex flex-col transition-all relative overflow-hidden"
          :class="year.isActive ? 'ring-2 ring-emerald-500 shadow-emerald-500/10' : 'hover:border-fuchsia-300 dark:hover:border-fuchsia-700/50 hover:-translate-y-1'"
        >
          <div v-if="year.isActive" class="absolute inset-0 bg-gradient-to-br from-emerald-100/30 to-transparent dark:from-emerald-900/10 pointer-events-none"></div>
          
          <div class="relative z-10 flex-1">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-3">
                <div :class="['w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner', year.isActive ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500']">
                  <UIcon name="i-heroicons-academic-cap" class="w-5 h-5" />
                </div>
                <div>
                  <h3 class="font-black text-xl text-stone-800 dark:text-white leading-none">{{ year.name }}</h3>
                </div>
              </div>
              <UBadge v-if="year.isActive" label="ACTIVE" color="emerald" variant="soft" size="xs" class="font-black uppercase tracking-widest rounded-lg animate-pulse" />
            </div>
            
            <p class="text-sm font-bold text-stone-500 mb-6 bg-stone-100/50 dark:bg-stone-800/50 p-2 rounded-xl text-center">
              {{ formatDate(year.startDate) }} — {{ formatDate(year.endDate) }}
            </p>
          </div>

          <div class="relative z-10 pt-4 border-t border-stone-200/50 dark:border-stone-800/50 flex items-center justify-between gap-2">
            <UButton
              icon="i-heroicons-squares-2x2"
              color="neutral"
              variant="ghost"
              size="sm"
              class="rounded-xl flex-1 justify-center bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 font-bold"
              :to="`/admin/academic-years/${year.id}`"
              label="Xem Lớp Học"
            />
            <UButton
              v-if="!year.isActive"
              label="Kích hoạt"
              icon="i-heroicons-bolt"
              color="fuchsia"
              variant="soft"
              size="sm"
              class="rounded-xl font-bold uppercase tracking-wider"
              :loading="activating === year.id"
              @click="activateYear(year.id)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         MODALS (Create, Promote, Clone)
    ═══════════════════════════════════════════════════════ -->

    <!-- Modal Tạo Niên Khóa -->
    <UModal v-model:open="isCreateOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' }, footer: { padding: 'p-6 bg-stone-50 dark:bg-stone-900' } }">
        <template #header>
          <div class="bg-fuchsia-600 dark:bg-fuchsia-900 p-6 flex justify-between items-center text-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><UIcon name="i-heroicons-calendar-days" class="w-6 h-6" /></div>
              <h3 class="text-xl font-black uppercase tracking-wide">Tạo Niên Khóa Mới</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="white" variant="ghost" class="hover:bg-white/10 rounded-full" @click="isCreateOpen = false" />
          </div>
        </template>
        <form id="year-form" class="p-6 space-y-6" @submit.prevent="createYear">
          <UFormField label="Tên niên khóa" required>
            <UInput v-model="yearForm.name" placeholder="Ví dụ: 2025-2026" class="w-full" :ui="{ base: 'rounded-xl' }" />
          </UFormField>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Ngày bắt đầu"><UInput v-model="yearForm.startDate" type="date" class="w-full" :ui="{ base: 'rounded-xl' }" /></UFormField>
            <UFormField label="Ngày kết thúc"><UInput v-model="yearForm.endDate" type="date" class="w-full" :ui="{ base: 'rounded-xl' }" /></UFormField>
          </div>
          <div class="flex items-center gap-3 p-4 bg-fuchsia-50 dark:bg-fuchsia-900/20 rounded-xl border border-fuchsia-100 dark:border-fuchsia-800 mt-2">
            <UToggle v-model="yearForm.isActive" color="fuchsia" />
            <span class="text-sm font-bold text-fuchsia-700 dark:text-fuchsia-300">Đặt làm niên khóa hoạt động ngay</span>
          </div>
        </form>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Hủy" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isCreateOpen = false" />
            <UButton type="submit" form="year-form" label="Khởi Tạo" color="fuchsia" variant="solid" size="lg" class="rounded-xl font-black uppercase shadow-lg shadow-fuchsia-500/20" :loading="isSubmitting" />
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Modal Lên Lớp Tự Động (Smart Promotion) -->
    <UModal v-model:open="isPromoteOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' }, footer: { padding: 'p-6 bg-stone-50 dark:bg-stone-900' } }">
        <template #header>
          <div class="bg-emerald-600 dark:bg-emerald-900 p-6 flex justify-between items-center text-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><UIcon name="i-heroicons-sparkles" class="w-6 h-6" /></div>
              <h3 class="text-xl font-black uppercase tracking-wide">Lên Lớp Tự Động</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="white" variant="ghost" class="hover:bg-white/10 rounded-full" @click="isPromoteOpen = false" />
          </div>
        </template>
        <div class="p-6 space-y-6">
          <div class="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-start gap-3 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
            <UIcon name="i-heroicons-information-circle" class="w-6 h-6 shrink-0" />
            <p>Hệ thống sẽ quét toàn bộ danh sách lớp học của Niên Khóa Nguồn và tự động thăng hạng học sinh (ví dụ: Ấu 1 -> Ấu 2) sang Niên Khóa Đích. Dữ liệu sẽ lưu ở dạng <b>Bản Nháp (Draft)</b> để bạn kiểm duyệt trước khi chính thức áp dụng.</p>
          </div>
          <UFormField label="Niên Khóa Nguồn (Năm cũ)" required>
            <USelect v-model="promoteForm.sourceYearId" :options="yearOptions" placeholder="Chọn niên khóa nguồn..." class="w-full" :ui="{ base: 'rounded-xl' }" />
          </UFormField>
          <UFormField label="Niên Khóa Đích (Năm mới)" required>
            <USelect v-model="promoteForm.targetYearId" :options="yearOptions" placeholder="Chọn niên khóa đích..." class="w-full" :ui="{ base: 'rounded-xl' }" />
          </UFormField>
        </div>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Hủy" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isPromoteOpen = false" />
            <UButton label="Tiến Hành Thăng Lớp" color="emerald" variant="solid" size="lg" class="rounded-xl font-black uppercase shadow-lg shadow-emerald-500/20" :loading="isPromoting" @click="executePromotion" />
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Modal Sao chép dữ liệu (Smart Cloning) -->
    <UModal v-model:open="isCloneOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' }, footer: { padding: 'p-6 bg-stone-50 dark:bg-stone-900' } }">
        <template #header>
          <div class="bg-blue-600 dark:bg-blue-900 p-6 flex justify-between items-center text-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><UIcon name="i-heroicons-document-duplicate" class="w-6 h-6" /></div>
              <h3 class="text-xl font-black uppercase tracking-wide">Sao Chép Dữ Liệu</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="white" variant="ghost" class="hover:bg-white/10 rounded-full" @click="isCloneOpen = false" />
          </div>
        </template>
        <div class="p-6 space-y-6">
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl flex items-start gap-3 text-blue-700 dark:text-blue-300 text-sm font-medium">
            <UIcon name="i-heroicons-information-circle" class="w-6 h-6 shrink-0" />
            <p>Hệ thống sẽ sao chép cấu trúc Lớp học (Tên lớp, ngành) từ Niên Khóa Cũ sang Niên Khóa Mới. (Không sao chép học sinh, chỉ sao chép cấu trúc "Vỏ").</p>
          </div>
          <UFormField label="Từ Niên Khóa Cũ" required>
            <USelect v-model="cloneForm.oldYearId" :options="yearOptions" placeholder="Chọn niên khóa nguồn..." class="w-full" :ui="{ base: 'rounded-xl' }" />
          </UFormField>
          <UFormField label="Đến Niên Khóa Mới" required>
            <USelect v-model="cloneForm.newYearId" :options="yearOptions" placeholder="Chọn niên khóa đích..." class="w-full" :ui="{ base: 'rounded-xl' }" />
          </UFormField>
        </div>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Hủy" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isCloneOpen = false" />
            <UButton label="Thực Hiện Sao Chép" color="blue" variant="solid" size="lg" class="rounded-xl font-black uppercase shadow-lg shadow-blue-500/20" :loading="isCloning" @click="executeClone" />
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
useHead({ title: 'Quản Lý Niên Khóa - GiaoLy Admin' })

const toast = useToast()

const { data: years, pending, refresh } = await useApiFetch('/AcademicYear')
const activeYear = computed(() => years.value?.find(y => y.isActive))

const yearOptions = computed(() => {
  return years.value?.map(y => ({ value: y.id, label: y.name })) ?? []
})

const formatDate = (d) => {
  if (!d) return '---'
  return new Date(d).toLocaleDateString('vi-VN')
}

// ── CREATE YEAR ──
const isCreateOpen = ref(false)
const isSubmitting = ref(false)
const yearForm = reactive({ name: '', startDate: '', endDate: '', isActive: false })

const createYear = async () => {
  isSubmitting.value = true
  try {
    await $api('/AcademicYear', { method: 'POST', body: { ...yearForm } })
    isCreateOpen.value = false
    Object.assign(yearForm, { name: '', startDate: '', endDate: '', isActive: false })
    await refresh()
    toast.add({ title: 'Đã tạo niên khóa mới!', color: 'success' })
  } catch { toast.add({ title: 'Lỗi khởi tạo', color: 'error' }) } 
  finally { isSubmitting.value = false }
}

const activating = ref(null)
const activateYear = async (id) => {
  activating.value = id
  try {
    await $api('/AcademicYear/activate-new-year', { method: 'POST', body: id })
    await refresh()
    toast.add({ title: 'Đã chuyển đổi niên khóa hoạt động!', color: 'success' })
  } catch { toast.add({ title: 'Lỗi kích hoạt', color: 'error' }) } 
  finally { activating.value = null }
}

// ── SMART PROMOTION ──
const isPromoteOpen = ref(false)
const isPromoting = ref(false)
const promoteForm = reactive({ sourceYearId: '', targetYearId: '' })

const openPromoteModal = () => {
  promoteForm.sourceYearId = ''
  promoteForm.targetYearId = activeYear.value?.id || ''
  isPromoteOpen.value = true
}

const executePromotion = async () => {
  if (!promoteForm.sourceYearId || !promoteForm.targetYearId) {
    return toast.add({ title: 'Thiếu thông tin', description: 'Vui lòng chọn đủ 2 niên khóa.', color: 'error' })
  }
  isPromoting.value = true
  try {
    const res = await $api('/Enrollment/promote', { method: 'POST', body: promoteForm })
    isPromoteOpen.value = false
    toast.add({ title: 'Thăng lớp thành công!', description: `Đã tạo Bản Nháp (Draft) cho ${res.count} đoàn sinh.`, color: 'success' })
  } catch (err) { toast.add({ title: 'Lỗi thăng lớp', description: err.data?.message || err.message, color: 'error' }) } 
  finally { isPromoting.value = false }
}

// ── SMART CLONING ──
const isCloneOpen = ref(false)
const isCloning = ref(false)
const cloneForm = reactive({ oldYearId: '', newYearId: '' })

const openCloneModal = () => {
  cloneForm.oldYearId = ''
  cloneForm.newYearId = activeYear.value?.id || ''
  isCloneOpen.value = true
}

const executeClone = async () => {
  if (!cloneForm.oldYearId || !cloneForm.newYearId) {
    return toast.add({ title: 'Thiếu thông tin', description: 'Vui lòng chọn đủ 2 niên khóa.', color: 'error' })
  }
  isCloning.value = true
  try {
    const res = await $api('/AcademicYear/clone', { method: 'POST', body: cloneForm })
    isCloneOpen.value = false
    toast.add({ title: 'Sao chép thành công!', description: res.message || 'Cấu trúc lớp đã được sao chép.', color: 'success' })
  } catch (err) { toast.add({ title: 'Lỗi sao chép', description: err.data?.message || err.message, color: 'error' }) } 
  finally { isCloning.value = false }
}
</script>

<style>
@keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
.animate-blob { animation: blob 10s infinite; }
.animation-delay-2000 { animation-delay: 2s; }
@keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
