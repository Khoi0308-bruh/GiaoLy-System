<template>
  <div class="min-h-screen font-sans relative pb-24 overflow-hidden selection:bg-amber-500/30">
    <!-- BACKGROUND MESH GRADIENT -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute -top-40 -left-40 w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob bg-blue-200 dark:bg-blue-900"></div>
      <div class="absolute -bottom-40 right-0 w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-amber-200 dark:bg-amber-900"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
    </div>

    <div class="relative z-10 space-y-6 animate-fade-in-up px-4 md:px-8 pt-8 max-w-7xl mx-auto">
      <!-- ── PAGE HEADER & BANNER ── -->
      <div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="z-10 text-center lg:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-black uppercase tracking-widest border border-amber-200 dark:border-amber-800 shadow-inner">
            <UIcon name="i-heroicons-user-group" class="w-4 h-4" />
            <span>Phân Hệ Quản Trị Nhân Sự</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
            Ban Điều Hành & <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">Giáo Lý Viên</span>
          </h1>
          <p class="text-stone-500 text-sm mt-2 max-w-xl">
            Quản lý cơ cấu Sứ Đoàn: Ban Linh Hướng, Ban Điều Hành và Huynh Trưởng 5 Ngành theo sơ đồ thực tế.
          </p>
        </div>
        
        <div class="flex flex-wrap items-center justify-center gap-3 z-10">
          <UButton
            v-if="auth?.hasPermission('leaders.update')"
            label="Xoay Vòng Nhiệm Kỳ"
            icon="i-heroicons-arrow-path-rounded-square"
            color="neutral"
            variant="soft"
            size="lg"
            class="rounded-2xl shadow-sm hover:-translate-y-0.5 transition-transform font-bold text-amber-600"
            @click="isRotateOpen = true"
          />
          <UButton
            v-if="auth?.hasPermission('leaders.create')"
            label="Thêm Nhân Sự Mới"
            icon="i-heroicons-user-plus"
            color="primary"
            variant="solid"
            size="lg"
            class="rounded-2xl shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 transition-transform font-black uppercase tracking-wider bg-gradient-to-r from-amber-600 to-amber-500 text-white"
            @click="openCreate"
          />
        </div>
      </div>

      <!-- ── BỘ LỌC ĐA NĂNG (INSPIRATION FROM ANHEMMOTOR TABS & SEARCH) ── -->
      <div class="bg-white/60 dark:bg-stone-900/60 backdrop-blur-2xl border border-white/60 dark:border-stone-800 rounded-3xl p-4 shadow-xl shadow-black/5 space-y-4">
        <!-- Hàng 1: Trạng thái & Tìm kiếm -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <!-- Active vs History Tab -->
          <div class="bg-stone-100/70 dark:bg-stone-800/70 p-1 rounded-2xl border border-stone-200/50 dark:border-stone-700/50 inline-flex">
            <button
              class="px-5 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-wider"
              :class="activeTab === 'active' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'"
              @click="activeTab = 'active'"
            >
              Đang Nhiệm Kỳ
            </button>
            <button
              class="px-5 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-wider flex items-center gap-1.5"
              :class="activeTab === 'history' ? 'bg-stone-900 text-white dark:bg-stone-700 shadow' : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'"
              @click="activeTab = 'history'"
            >
              Cựu Trào <UIcon name="i-heroicons-clock" class="w-3.5 h-3.5" />
            </button>
          </div>

          <!-- Quick Search -->
          <div class="w-full md:w-80 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UIcon name="i-heroicons-magnifying-glass" class="w-4 h-4 text-stone-400" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm theo Tên Thánh, Họ Tên, Chức vụ..."
              class="w-full pl-9 pr-4 py-2 bg-stone-100/60 dark:bg-stone-800/60 rounded-xl border border-stone-200/50 dark:border-stone-700/50 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
        </div>

        <!-- Hàng 2: THANH PHÂN CẤP THEO SƠ ĐỒ XỨ ĐOÀN (BRANCH TABS) -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            v-for="cat in categoryFilters"
            :key="cat.id"
            class="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border"
            :class="selectedCategory === cat.id ? cat.activeClass : 'bg-stone-50 dark:bg-stone-800/40 text-stone-500 border-stone-200/50 dark:border-stone-800 hover:bg-stone-100'"
            @click="selectedCategory = cat.id"
          >
            <span>{{ cat.icon }}</span>
            <span>{{ cat.label }}</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10 ml-0.5">
              {{ getCategoryCount(cat.id) }}
            </span>
          </button>
        </div>
      </div>

      <!-- ── LOADING ── -->
      <div v-if="pending" class="flex flex-col items-center justify-center py-24 bg-white/20 dark:bg-stone-900/20 backdrop-blur-xl rounded-[2rem]">
        <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 animate-spin text-amber-500 mb-4" />
        <p class="text-stone-500 font-bold uppercase tracking-widest text-sm">Đang tải danh sách nhân sự...</p>
      </div>

      <!-- ── EMPTY ── -->
      <div v-else-if="!filteredList.length" class="text-center py-20 bg-white/40 dark:bg-stone-900/40 backdrop-blur-xl rounded-[2rem] border border-white/50 dark:border-stone-800 shadow-sm">
        <UIcon name="i-heroicons-user-group" class="w-16 h-16 text-stone-300 dark:text-stone-700 mx-auto mb-4" />
        <p class="text-stone-600 dark:text-stone-300 font-bold text-base">Không tìm thấy nhân sự phù hợp với bộ lọc.</p>
        <p class="text-stone-400 text-xs mt-1">Hãy thử xóa từ khóa tìm kiếm hoặc chọn danh mục khác.</p>
      </div>

      <!-- ── GRID DANH SÁCH NHÂN SỰ ĐƯỢC CHUẨN HÓA ── -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        <div
          v-for="leader in filteredList"
          :key="leader.id"
          class="group bg-white/70 dark:bg-stone-900/70 backdrop-blur-2xl border border-white/80 dark:border-stone-800 rounded-3xl p-5 shadow-lg shadow-black/5 flex flex-col justify-between transition-all relative overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:border-amber-400/50"
        >
          <!-- Active Gradient Glow -->
          <div v-if="activeTab === 'active'" class="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none"></div>

          <!-- Top Row: Badge Ngành & Chức danh -->
          <div class="relative z-10 flex items-center justify-between gap-2 mb-3">
            <span class="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md" :class="getBranchBadgeClass(leader.branch)">
              {{ getBranchName(leader.branch) }}
            </span>
            <span class="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
              Cấp {{ leader.level }}
            </span>
          </div>

          <!-- Info & Avatar Center -->
          <div class="relative z-10 flex flex-col items-center text-center">
            <!-- Avatar -->
            <div class="relative mb-3 group/avatar">
              <UAvatar
                :src="leader.avatarPath ? `${config.public.apiBase}${leader.avatarPath}` : undefined"
                :alt="leader.fullName"
                size="3xl"
                class="w-20 h-20 shadow-md ring-3 ring-amber-400/30 bg-stone-100 dark:bg-stone-800"
                :ui="{ placeholder: 'font-black text-xl text-stone-400' }"
              />
              <button
                v-if="auth?.hasPermission('leaders.update')"
                class="absolute bottom-0 right-0 p-1.5 bg-amber-500 text-stone-950 rounded-full shadow-md opacity-0 group-hover/avatar:opacity-100 transition-all hover:scale-110"
                title="Đổi ảnh thẻ"
                @click="openAvatarUpload(leader)"
              >
                <UIcon name="i-heroicons-camera" class="w-3.5 h-3.5" />
              </button>
            </div>

            <!-- Profile Info -->
            <div class="space-y-0.5 w-full">
              <p class="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider truncate">{{ leader.holyName || '---' }}</p>
              <h3 class="font-black text-stone-900 dark:text-white text-base leading-tight truncate group-hover:text-amber-600 transition-colors">{{ leader.fullName }}</h3>
              <p class="text-xs font-bold text-stone-600 dark:text-stone-300 mt-1 truncate">{{ leader.position }}</p>
            </div>

            <p class="text-[11px] text-stone-500 italic mt-3 min-h-[2rem] line-clamp-2 px-1">
              "{{ leader.description || 'Hi sinh & Phục vụ...' }}"
            </p>
          </div>

          <!-- Bottom Footer -->
          <div class="relative z-10 mt-4 pt-3 border-t border-stone-200/50 dark:border-stone-800 flex items-center justify-between text-[11px] font-bold text-stone-400">
            <span class="flex items-center gap-1">
              <UIcon name="i-heroicons-calendar" class="w-3.5 h-3.5 text-stone-400" /> {{ leader.term || '---' }}
            </span>
            
            <!-- Quick Actions -->
            <div class="flex items-center gap-1.5">
              <UButton
                v-if="auth?.hasPermission('leaders.update')"
                icon="i-heroicons-pencil-square"
                color="neutral"
                variant="ghost"
                size="xs"
                class="rounded-lg hover:text-amber-600"
                @click="editItem(leader)"
              />
              <UButton
                v-if="auth?.hasPermission('leaders.delete')"
                icon="i-heroicons-trash"
                color="error"
                variant="ghost"
                size="xs"
                class="rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                @click="confirmDelete(leader)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         MODAL: THÊM / SỬA THÀNH VIÊN
    ═══════════════════════════════════════════════════════ -->
    <UModal v-model:open="isFormOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden sm:max-w-2xl' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' }, footer: { padding: 'p-6 bg-stone-50 dark:bg-stone-900' } }">
        <template #header>
          <div class="bg-gradient-to-r from-amber-600 to-amber-500 p-6 flex justify-between items-center text-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><UIcon name="i-heroicons-identification" class="w-6 h-6" /></div>
              <h3 class="text-xl font-black uppercase tracking-wide">{{ editingId ? 'Sửa Hồ Sơ Nhân Sự' : 'Thêm Nhân Sự Sứ Đoàn' }}</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="white" variant="ghost" class="hover:bg-white/10 rounded-full" @click="isFormOpen = false" />
          </div>
        </template>
        
        <form class="p-6 sm:p-8 space-y-5" @submit.prevent="submitForm">
          <UFormField label="Đồng bộ từ tài khoản hệ thống (Tùy chọn)">
            <USelectMenu v-model="selectedUser" :options="userOptions" searchable searchable-placeholder="Tìm kiếm tài khoản..." placeholder="Chọn tài khoản để tự động điền tên..." class="w-full" :ui="{ base: 'rounded-xl shadow-inner' }" />
          </UFormField>

          <div class="p-5 bg-stone-50 dark:bg-stone-900/50 rounded-2xl border border-stone-200/60 dark:border-stone-800 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField label="Tên Thánh"><UInput v-model="form.holyName" placeholder="Giuse / Maria..." :ui="{ base: 'rounded-xl shadow-inner' }" /></UFormField>
              <UFormField label="Họ và Tên" required><UInput v-model="form.fullName" placeholder="Nguyễn Văn A" required :ui="{ base: 'rounded-xl shadow-inner' }" /></UFormField>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField label="Chức vụ đảm nhiệm" required><UInput v-model="form.position" placeholder="Trưởng ngành / GLV lớp..." required :ui="{ base: 'rounded-xl shadow-inner' }" /></UFormField>
              <UFormField label="Phân Cấp (1: Tuyên Úy, 2: Đặc trách/BĐH, 3: Trưởng Ngành, 4: GLV)" required>
                <UInput v-model="form.level" type="number" placeholder="2" required :ui="{ base: 'rounded-xl shadow-inner' }" />
              </UFormField>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField label="Ngành Phụ Trách">
                <USelect
                  v-model="form.branch"
                  :options="[
                    { label: 'Chung (Ban Linh Hướng / BĐH)', value: 0 },
                    { label: '🌸 Ngành Chiên Con', value: 1 },
                    { label: '🌿 Ngành Ấu Nhi', value: 2 },
                    { label: '🌊 Ngành Thiếu Nhi', value: 3 },
                    { label: '☀️ Ngành Nghĩa Sĩ', value: 4 },
                    { label: '🛡️ Ngành Hiệp Sĩ', value: 5 }
                  ]"
                  value-attribute="value"
                  option-attribute="label"
                  class="w-full rounded-xl"
                />
              </UFormField>
              <UFormField label="Nhiệm kỳ"><UInput v-model="form.term" placeholder="2023-2026" :ui="{ base: 'rounded-xl shadow-inner' }" /></UFormField>
            </div>
          </div>

          <div class="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 dark:border-amber-800/40">
            <UToggle v-model="form.isActive" color="primary" />
            <span class="text-xs font-bold text-stone-800 dark:text-stone-200">Nhân sự đang hoạt động trong nhiệm kỳ hiện tại.</span>
          </div>

          <UFormField label="Mô tả / Lời tâm niệm sống đạo">
            <UTextarea v-model="form.description" :rows="2" placeholder="Châm ngôn phục vụ..." :ui="{ base: 'rounded-xl shadow-inner' }" />
          </UFormField>
        </form>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Hủy" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isFormOpen = false" />
            <UButton :label="editingId ? 'Lưu Thay Đổi' : 'Xác Nhận Thêm'" color="primary" variant="solid" size="lg" class="rounded-xl font-black uppercase tracking-wider shadow-lg shadow-amber-500/20 bg-amber-500 text-stone-950" :loading="submitting" @click="submitForm" />
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- ═══════════════════════════════════════════════════════
         MODAL: TẢI LÊN AVATAR
    ═══════════════════════════════════════════════════════ -->
    <UModal v-model:open="isAvatarOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' }, footer: { padding: 'p-6 bg-stone-50 dark:bg-stone-900' } }">
        <template #header>
          <div class="bg-amber-600 p-6 flex justify-between items-center text-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><UIcon name="i-heroicons-camera" class="w-6 h-6" /></div>
              <h3 class="text-xl font-black uppercase tracking-wide">Cập Nhật Ảnh Thẻ</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="white" variant="ghost" class="hover:bg-white/10 rounded-full" @click="isAvatarOpen = false" />
          </div>
        </template>
        
        <div class="p-8 text-center">
          <p class="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4">Nhân sự: <span class="text-amber-600 font-black">{{ targetLeader?.fullName }}</span></p>
          <div class="p-6 border-2 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/10 rounded-[2rem] hover:bg-amber-100/50 transition-colors">
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              class="block w-full text-sm text-stone-500 file:mx-auto file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-amber-200 file:text-amber-900 hover:file:bg-amber-300 cursor-pointer transition-colors"
            >
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Hủy" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isAvatarOpen = false" />
            <UButton label="Lưu Ảnh Thẻ" color="primary" variant="solid" size="lg" class="rounded-xl font-black uppercase tracking-wider bg-amber-500 text-stone-950" :loading="uploadingAvatar" @click="submitAvatar" />
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- ═══════════════════════════════════════════════════════
         MODAL: XOAY VÒNG NHIỆM KỲ
    ═══════════════════════════════════════════════════════ -->
    <UModal v-model:open="isRotateOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' }, footer: { padding: 'p-6 bg-stone-50 dark:bg-stone-900' } }">
        <template #header>
          <div class="bg-gradient-to-r from-amber-600 to-orange-500 p-6 flex justify-between items-center text-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><UIcon name="i-heroicons-arrow-path-rounded-square" class="w-6 h-6" /></div>
              <h3 class="text-xl font-black uppercase tracking-wide">Xoay Vòng Nhiệm Kỳ</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="white" variant="ghost" class="hover:bg-white/10 rounded-full" @click="isRotateOpen = false" />
          </div>
        </template>
        
        <div class="p-6 space-y-4">
          <p class="text-xs text-stone-600 dark:text-stone-300">
            Hành động này sẽ chuyển toàn bộ nhân sự đang hoạt động sang danh mục <strong>"Cựu Trào"</strong> để lưu trữ lịch sử và mở nhiệm kỳ mới.
          </p>
          <UFormField label="Tên nhiệm kỳ mới (VD: 2026-2029)" required>
            <UInput v-model="newTerm" placeholder="2026-2029" required :ui="{ base: 'rounded-xl' }" />
          </UFormField>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Hủy" color="neutral" variant="soft" @click="isRotateOpen = false" />
            <UButton label="Tiến Hành Xoay Vòng" color="warning" variant="solid" :loading="rotating" @click="executeRotate" />
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- ═══════════════════════════════════════════════════════
         MODAL: XÁC NHẬN XÓA
    ═══════════════════════════════════════════════════════ -->
    <UModal v-model:open="isDeleteOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden' }">
      <div class="p-6 text-center space-y-4">
        <div class="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center text-red-600">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8" />
        </div>
        <h3 class="text-lg font-black text-stone-900 dark:text-white">Xóa hồ sơ nhân sự?</h3>
        <p class="text-xs text-stone-500">
          Bạn có chắc chắn muốn xóa hồ sơ của <strong>{{ deletingItem?.fullName }}</strong>? Thao tác này không thể hoàn tác.
        </p>
        <div class="flex justify-center gap-3 pt-2">
          <UButton label="Hủy" color="neutral" variant="soft" class="rounded-xl font-bold" @click="isDeleteOpen = false" />
          <UButton label="Xác Nhận Xóa" color="error" variant="solid" class="rounded-xl font-bold" :loading="deleting" @click="executeDelete" />
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const auth = useAuthStore()
const { $api } = useNuxtApp()
const toast = useToast()

const activeTab = ref<'active' | 'history'>('active')
const selectedCategory = ref<string>('all')
const searchQuery = ref('')

const pending = ref(true)
const leaders = ref<any[]>([])

// Định nghĩa các Tab phân cấp theo sơ đồ Xứ Đoàn
const categoryFilters = [
  { id: 'all', label: 'Tất Cả', icon: '📋', activeClass: 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900' },
  { id: 'clergy', label: 'Ban Linh Hướng & Trợ Tá', icon: '✝️', activeClass: 'bg-amber-600 text-white' },
  { id: 'bdh', label: 'Ban Điều Hành Xứ Đoàn', icon: '⭐', activeClass: 'bg-amber-500 text-stone-950' },
  { id: 'branch_1', label: '🌸 Chiên Con', icon: '🌸', activeClass: 'bg-pink-500 text-white' },
  { id: 'branch_2', label: '🌿 Ấu Nhi', icon: '🌿', activeClass: 'bg-emerald-600 text-white' },
  { id: 'branch_3', label: '🌊 Thiếu Nhi', icon: '🌊', activeClass: 'bg-sky-600 text-white' },
  { id: 'branch_4', label: '☀️ Nghĩa Sĩ', icon: '☀️', activeClass: 'bg-yellow-500 text-stone-950' },
  { id: 'branch_5', label: '🛡️ Hiệp Sĩ', icon: '🛡️', activeClass: 'bg-amber-800 text-white' }
]

const fetchData = async () => {
  pending.value = true
  try {
    const endpoint = activeTab.value === 'active' ? '/Leader' : '/Leader/history'
    const res = await $api(endpoint)
    leaders.value = res || []
  } catch (err) {
    console.error(err)
    toast.add({ title: 'Lỗi tải dữ liệu nhân sự', color: 'error' })
  } finally {
    pending.value = false
  }
}

watch(activeTab, () => {
  fetchData()
})

onMounted(() => {
  fetchData()
})

// Đếm số lượng theo danh mục
const getCategoryCount = (catId: string) => {
  if (catId === 'all') return leaders.value.length
  if (catId === 'clergy') return leaders.value.filter(l => l.level === 1 || l.position.toLowerCase().includes('tuyên úy') || l.position.toLowerCase().includes('đặc trách') || l.position.toLowerCase().includes('trợ tá') || l.position.toLowerCase().includes('trợ úy')).length
  if (catId === 'bdh') return leaders.value.filter(l => (l.level === 2 || l.level === 3) && l.branch === 0).length
  if (catId.startsWith('branch_')) {
    const bId = parseInt(catId.replace('branch_', ''))
    return leaders.value.filter(l => l.branch === bId).length
  }
  return 0
}

// Lọc dữ liệu theo tab danh mục và từ khóa tìm kiếm
const filteredList = computed(() => {
  let list = leaders.value

  // Lọc theo Tab danh mục
  if (selectedCategory.value === 'clergy') {
    list = list.filter(l => l.level === 1 || l.position.toLowerCase().includes('tuyên úy') || l.position.toLowerCase().includes('đặc trách') || l.position.toLowerCase().includes('trợ tá') || l.position.toLowerCase().includes('trợ úy'))
  } else if (selectedCategory.value === 'bdh') {
    list = list.filter(l => (l.level === 2 || l.level === 3) && l.branch === 0)
  } else if (selectedCategory.value.startsWith('branch_')) {
    const bId = parseInt(selectedCategory.value.replace('branch_', ''))
    list = list.filter(l => l.branch === bId)
  }

  // Lọc theo từ khóa tìm kiếm
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(l => 
      (l.fullName && l.fullName.toLowerCase().includes(q)) ||
      (l.holyName && l.holyName.toLowerCase().includes(q)) ||
      (l.position && l.position.toLowerCase().includes(q))
    )
  }

  return list
})

const getBranchName = (b: number) => {
  const map: Record<number, string> = {
    0: 'Xứ Đoàn',
    1: 'Chiên Con',
    2: 'Ấu Nhi',
    3: 'Thiếu Nhi',
    4: 'Nghĩa Sĩ',
    5: 'Hiệp Sĩ'
  }
  return map[b] || 'Khác'
}

const getBranchBadgeClass = (b: number) => {
  const map: Record<number, string> = {
    0: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
    1: 'bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300',
    2: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    3: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
    4: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    5: 'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200'
  }
  return map[b] || 'bg-stone-100 text-stone-700'
}

// ── FORM XỬ LÝ THÊM / SỬA ──
const isFormOpen = ref(false)
const editingId = ref<string | null>(null)
const submitting = ref(false)
const selectedUser = ref<any>(null)
const userOptions = ref<any[]>([])

const form = ref({
  holyName: '',
  fullName: '',
  position: '',
  level: 4,
  branch: 0,
  term: '2023-2026',
  description: '',
  isActive: true
})

const openCreate = () => {
  editingId.value = null
  selectedUser.value = null
  form.value = {
    holyName: '',
    fullName: '',
    position: '',
    level: 4,
    branch: selectedCategory.value.startsWith('branch_') ? parseInt(selectedCategory.value.replace('branch_', '')) : 0,
    term: '2023-2026',
    description: '',
    isActive: true
  }
  isFormOpen.value = true
}

const editItem = (item: any) => {
  editingId.value = item.id
  selectedUser.value = null
  form.value = { ...item }
  isFormOpen.value = true
}

const submitForm = async () => {
  if (!form.value.fullName || !form.value.position) {
    return toast.add({ title: 'Thiếu thông tin bắt buộc', color: 'error' })
  }
  submitting.value = true
  try {
    if (editingId.value) {
      await $api(`/Leader/${editingId.value}`, { method: 'PUT', body: form.value })
      toast.add({ title: 'Đã cập nhật hồ sơ', color: 'success' })
    } else {
      await $api('/Leader', { method: 'POST', body: form.value })
      toast.add({ title: 'Đã thêm nhân sự mới', color: 'success' })
    }
    isFormOpen.value = false
    await fetchData()
  } catch (err: any) {
    toast.add({ title: 'Có lỗi xảy ra', description: err.message, color: 'error' })
  } finally {
    submitting.value = false
  }
}

// ── AVATAR UPLOAD ──
const isAvatarOpen = ref(false)
const uploadingAvatar = ref(false)
const avatarInput = ref<any>(null)
const targetLeader = ref<any>(null)

const openAvatarUpload = (leader: any) => {
  targetLeader.value = leader
  if (avatarInput.value) avatarInput.value.value = ''
  isAvatarOpen.value = true
}

const submitAvatar = async () => {
  const file = avatarInput.value?.files[0]
  if (!file) return
  uploadingAvatar.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    await $fetch(`${config.public.apiBase}/Leader/${targetLeader.value.id}/avatar`, {
      method: 'POST',
      body: formData,
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    toast.add({ title: 'Cập nhật ảnh thành công', color: 'success' })
    isAvatarOpen.value = false
    await fetchData()
  } catch {
    toast.add({ title: 'Lỗi tải ảnh', color: 'error' })
  } finally {
    uploadingAvatar.value = false
  }
}

// ── XOAY VÒNG NHIỆM KỲ ──
const isRotateOpen = ref(false)
const rotating = ref(false)
const newTerm = ref('2026-2029')

const executeRotate = async () => {
  if (!newTerm.value.trim()) return
  rotating.value = true
  try {
    const res: any = await $api('/Leader/rotate-term', {
      method: 'POST',
      body: `"${newTerm.value.trim()}"`,
      headers: { 'Content-Type': 'application/json' }
    })
    toast.add({ title: 'Xoay vòng nhiệm kỳ thành công', description: res.message, color: 'success' })
    isRotateOpen.value = false
    await fetchData()
  } catch {
    toast.add({ title: 'Lỗi xoay vòng', color: 'error' })
  } finally {
    rotating.value = false
  }
}

// ── XÓA ──
const isDeleteOpen = ref(false)
const deleting = ref(false)
const deletingItem = ref<any>(null)

const confirmDelete = (item: any) => {
  deletingItem.value = item
  isDeleteOpen.value = true
}

const executeDelete = async () => {
  deleting.value = true
  try {
    await $api(`/Leader/${deletingItem.value.id}`, { method: 'DELETE' })
    toast.add({ title: 'Đã xóa hồ sơ thành công', color: 'success' })
    isDeleteOpen.value = false
    await fetchData()
  } catch {
    toast.add({ title: 'Lỗi xóa hồ sơ', color: 'error' })
  } finally {
    deleting.value = false
  }
}
</script>

<style>
@keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
.animate-blob { animation: blob 10s infinite; }
.animation-delay-2000 { animation-delay: 2s; }
@keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
