<template>
  <div class="min-h-screen bg-stone-50 dark:bg-stone-950 font-sans text-stone-800 dark:text-stone-200 pb-20">
    <UContainer class="py-6 space-y-6">
      
      <!-- ═══════════════════════════════════════════════════════
           HEADER (Minimalist)
      ═══════════════════════════════════════════════════════ -->
      <div class="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div class="flex items-center gap-4">
          <UAvatar
            :alt="auth?.user?.name || 'Admin'"
            size="lg"
            class="ring-1 ring-stone-200 dark:ring-stone-700 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
          />
          <div>
            <div class="flex items-center gap-2 mb-1">
              <h1 class="text-xl font-bold leading-tight text-stone-900 dark:text-white">
                Chào mừng, {{ auth?.user?.name || 'Trưởng' }}
              </h1>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-100 dark:bg-stone-800 text-stone-500">
                {{ getRoleLabel(auth?.user?.role) }}
              </span>
            </div>
            <p class="text-sm text-stone-500">
              Niên khóa hoạt động: <span class="font-semibold text-stone-700 dark:text-stone-300">{{ activeYear?.name || 'Đang tải...' }}</span>
            </p>
          </div>
        </div>
        <div class="flex gap-2">
          <UButton
            v-if="auth?.hasPermission('students.manage')"
            icon="i-heroicons-document-arrow-up"
            label="Nạp Excel"
            color="white"
            variant="solid"
            size="sm"
            class="shadow-sm"
            @click="isImportOpen = true"
          />
          <UButton
            v-if="auth?.hasPermission('announcements.manage')"
            icon="i-heroicons-megaphone"
            label="Đăng tin"
            color="primary"
            variant="solid"
            size="sm"
            class="shadow-sm"
            @click="isNewsModalOpen = true"
          />
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════
           MAIN LAYOUT: Left (Content) | Right (Widgets)
      ═══════════════════════════════════════════════════════ -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <!-- Cột Trái (Dữ liệu chính): 3/4 màn hình -->
        <div class="lg:col-span-3 space-y-6">
          
          <!-- 1. Metric Cards (Flat UI) -->
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            <!-- Tổng Đoàn Sinh -->
            <div class="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 shadow-sm flex flex-col justify-center items-start col-span-2 md:col-span-1">
              <p class="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Tổng Số</p>
              <div v-if="pending" class="w-12 h-8"><USkeleton class="w-full h-full" /></div>
              <p v-else class="text-2xl font-black text-stone-900 dark:text-white">{{ students?.length || 0 }}</p>
            </div>
            
            <!-- Các Ngành -->
            <div
              v-for="stat in branchStats.filter(b => b.branch >= 1 && b.branch <= 4)"
              :key="stat.branch"
              class="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 shadow-sm flex flex-col justify-center items-start"
            >
              <div class="flex items-center gap-1.5 mb-1">
                <UIcon :name="getBranchIcon(stat.branch)" :class="`w-3 h-3 text-${getBranchTailwindColor(stat.branch)}-500`" />
                <p class="text-[10px] font-bold uppercase tracking-widest text-stone-400 truncate">{{ getBranchName(stat.branch) }}</p>
              </div>
              <div v-if="pending" class="w-12 h-8"><USkeleton class="w-full h-full" /></div>
              <p v-else class="text-2xl font-black text-stone-900 dark:text-white">{{ stat.count }}</p>
            </div>
          </div>

          <!-- 2. Tiến Độ Bí Tích -->
          <div class="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm space-y-5">
            <h3 class="text-[11px] font-bold uppercase tracking-widest text-stone-400">Tiến Độ Bí Tích</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <!-- Rửa Tội -->
              <div>
                <div class="flex justify-between items-end mb-2">
                  <span class="text-sm font-semibold text-stone-700 dark:text-stone-300">Rửa Tội</span>
                  <span class="text-xs text-stone-500 font-medium">{{ students?.filter(s => s.baptismDate).length || 0 }} / {{ students?.length || 0 }}</span>
                </div>
                <div class="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
                  <div class="bg-blue-500 h-full rounded-full" :style="{ width: getPercentage(students?.filter(s => s.baptismDate).length, students?.length) }" />
                </div>
              </div>

              <!-- Rước Lễ -->
              <div>
                <div class="flex justify-between items-end mb-2">
                  <span class="text-sm font-semibold text-stone-700 dark:text-stone-300">Rước Lễ Lần Đầu</span>
                  <span class="text-xs text-stone-500 font-medium">{{ students?.filter(s => s.communionDate).length || 0 }} / {{ students?.length || 0 }}</span>
                </div>
                <div class="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
                  <div class="bg-amber-500 h-full rounded-full" :style="{ width: getPercentage(students?.filter(s => s.communionDate).length, students?.length) }" />
                </div>
              </div>

              <!-- Thêm Sức -->
              <div>
                <div class="flex justify-between items-end mb-2">
                  <span class="text-sm font-semibold text-stone-700 dark:text-stone-300">Thêm Sức</span>
                  <span class="text-xs text-stone-500 font-medium">{{ students?.filter(s => s.confirmationDate).length || 0 }} / {{ students?.length || 0 }}</span>
                </div>
                <div class="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
                  <div class="bg-red-500 h-full rounded-full" :style="{ width: getPercentage(students?.filter(s => s.confirmationDate).length, students?.length) }" />
                </div>
              </div>

            </div>
          </div>

          <!-- 3. Bảng Dữ Liệu Học Sinh (Clean Table) -->
          <div class="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm overflow-hidden">
            <!-- Toolbar -->
            <div class="p-4 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-50/50 dark:bg-stone-900/50">
              <h3 class="text-[11px] font-bold uppercase tracking-widest text-stone-400">Danh Sách Đoàn Sinh Gần Đây</h3>
              <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <UInput v-model="q" icon="i-heroicons-magnifying-glass" placeholder="Tìm kiếm..." size="sm" class="w-full sm:w-48" :ui="{ base: 'shadow-none border-stone-200 dark:border-stone-700' }" />
                <USelect v-model="selectedBranch" :options="branchFilterOptions" size="sm" class="w-full sm:w-32" :ui="{ base: 'shadow-none border-stone-200 dark:border-stone-700' }" />
                <UButton v-if="auth?.hasPermission('students.manage')" icon="i-heroicons-plus" color="primary" variant="soft" size="sm" @click="openCreateModal" />
              </div>
            </div>

            <!-- Table -->
            <UTable
              :rows="filteredRows.slice(0, 10)"
              :columns="columns"
              :loading="pending"
              :empty-state="{ icon: 'i-heroicons-users', header: 'Không tìm thấy hồ sơ' }"
              :ui="{ 
                th: { base: 'bg-white dark:bg-stone-900 text-[10px] uppercase font-bold text-stone-500 tracking-wider py-3 border-b border-stone-200 dark:border-stone-800' },
                td: { base: 'py-2.5 border-b border-stone-100 dark:border-stone-800/50 whitespace-nowrap text-sm text-stone-600 dark:text-stone-300' },
                tr: { base: 'hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors' }
              }"
            >
              <template #fullName-cell="{ row }">
                <div class="flex flex-col">
                  <span class="font-semibold text-stone-900 dark:text-white">
                    <span class="text-stone-400 text-xs mr-1">{{ row.original.holyName }}</span>{{ row.original.fullName }}
                  </span>
                  <span class="text-[10px] text-stone-400">{{ formatDate(row.original.birthDate) }}</span>
                </div>
              </template>
              <template #sacraments-cell="{ row }">
                <div class="flex gap-2">
                  <div :class="row.original.baptismDate ? 'text-blue-500' : 'text-stone-300 dark:text-stone-700'" title="Rửa Tội"><UIcon name="i-heroicons-beaker" class="w-4 h-4"/></div>
                  <div :class="row.original.communionDate ? 'text-amber-500' : 'text-stone-300 dark:text-stone-700'" title="Rước Lễ"><UIcon name="i-heroicons-cake" class="w-4 h-4"/></div>
                  <div :class="row.original.confirmationDate ? 'text-red-500' : 'text-stone-300 dark:text-stone-700'" title="Thêm Sức"><UIcon name="i-heroicons-fire" class="w-4 h-4"/></div>
                </div>
              </template>
              <template #branch-cell="{ row }">
                <span class="text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                  {{ getBranchName(row.original.branch) }}
                </span>
              </template>
              <template #className-cell="{ row }">
                {{ row.original.className || '---' }}
              </template>
              <template #actions-cell="{ row }">
                <UDropdown v-if="auth?.hasPermission('students.manage')" :items="getStudentActions(row.original)" :popper="{ placement: 'bottom-end' }">
                  <UButton color="neutral" variant="ghost" icon="i-heroicons-ellipsis-horizontal" size="sm" class="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200" />
                </UDropdown>
              </template>
            </UTable>

            <!-- Table Footer -->
            <div class="p-3 bg-stone-50/50 dark:bg-stone-900/50 border-t border-stone-200 dark:border-stone-800 flex justify-center">
              <UButton label="Xem toàn bộ hồ sơ" color="neutral" variant="ghost" size="sm" to="/admin/students" class="text-xs" />
            </div>
          </div>
        </div>

        <!-- Cột Phải (Widgets): 1/4 màn hình -->
        <div class="space-y-6">
          
          <!-- Widget: Lịch Phụng Vụ -->
          <div class="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-sm">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-[11px] font-bold uppercase tracking-widest text-stone-400">Hôm Nay</h3>
              <UButton icon="i-heroicons-arrow-top-right-on-square" color="neutral" variant="ghost" size="2xs" class="opacity-50 hover:opacity-100" to="/admin/liturgical" />
            </div>
            
            <div v-if="liturgicalToday" class="space-y-1">
              <p class="text-[10px] font-bold text-stone-400">{{ liturgicalToday.date }}</p>
              <h4 class="font-semibold text-sm text-stone-900 dark:text-white leading-tight">{{ liturgicalToday.feastName }}</h4>
              <div class="flex items-center gap-1.5 mt-2">
                <span class="w-2 h-2 rounded-full" :class="getColorDot(liturgicalToday.liturgicalColor)"></span>
                <span class="text-xs text-stone-500">{{ liturgicalToday.liturgicalColorVi }}</span>
              </div>
            </div>
          </div>

          <!-- Widget: Thông Báo -->
          <div class="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-sm flex flex-col h-[320px]">
            <div class="flex justify-between items-center mb-4 shrink-0">
              <h3 class="text-[11px] font-bold uppercase tracking-widest text-stone-400">Bảng Tin</h3>
              <UButton v-if="auth?.hasPermission('announcements.manage')" icon="i-heroicons-arrow-top-right-on-square" color="neutral" variant="ghost" size="2xs" class="opacity-50 hover:opacity-100" to="/admin/announcements" />
            </div>
            
            <div class="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
              <div v-if="announcements?.length === 0" class="text-xs text-stone-500 text-center py-4">Chưa có thông báo.</div>
              
              <div
                v-for="news in announcements?.slice(0, 5)"
                :key="news.id"
                class="p-3 rounded-lg border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 relative group"
              >
                <!-- Dấu chấm chỉ báo khẩn cấp/sự kiện -->
                <div v-if="news.type === 1" class="absolute top-3 left-3 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <div v-else-if="news.type === 2" class="absolute top-3 left-3 w-1.5 h-1.5 bg-amber-500 rounded-full" />
                <div v-else class="absolute top-3 left-3 w-1.5 h-1.5 bg-blue-500 rounded-full" />

                <div class="pl-4">
                  <div class="flex justify-between items-start gap-2 mb-1">
                    <h5 class="text-xs font-semibold text-stone-800 dark:text-stone-200 leading-tight line-clamp-2">{{ news.title }}</h5>
                    <span class="text-[9px] text-stone-400 shrink-0">{{ formatDateShort(news.createdDate) }}</span>
                  </div>
                  <div class="flex items-center gap-1.5 mt-2">
                    <span class="text-[9px] font-bold px-1.5 py-0.5 bg-stone-200/50 dark:bg-stone-800 rounded text-stone-500 uppercase">{{ getBranchName(news.branch) }}</span>
                    <UButton
                      v-if="auth?.hasPermission('announcements.manage')"
                      icon="i-heroicons-trash" color="red" variant="ghost" size="2xs"
                      class="opacity-0 group-hover:opacity-100 ml-auto h-4 min-h-0"
                      @click="deleteAnnouncement(news.id)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Widget: Sinh Nhật -->
          <div class="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-sm">
            <h3 class="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-4">Sinh Nhật Tháng Này</h3>
            <div v-if="upcomingBirthdays.length" class="space-y-3">
              <div v-for="student in upcomingBirthdays" :key="student.id" class="flex items-center justify-between">
                <div>
                  <p class="text-xs font-semibold text-stone-800 dark:text-stone-200 leading-none mb-1">{{ student.holyName }} {{ student.fullName }}</p>
                  <p class="text-[10px] text-stone-500">Ngành {{ getBranchName(student.branch) }}</p>
                </div>
                <div class="text-[10px] font-bold text-stone-500 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded border border-stone-200 dark:border-stone-700">
                  {{ formatDateShort(student.birthDate) }}
                </div>
              </div>
            </div>
            <div v-else class="text-xs text-stone-500 text-center py-4">Không có sinh nhật tháng này.</div>
          </div>

        </div>
      </div>
    </UContainer>

    <!-- ═══════════════════════════════════════════════════════
         MODALS (Student Edit, News, Excel) - Giữ nguyên Logic, Thiết kế Tối Giản
    ═══════════════════════════════════════════════════════ -->
    
    <!-- Modal Student -->
    <UModal v-model:open="isOpen" :ui="{ base: 'rounded-2xl' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-5 border-b border-stone-200 dark:border-stone-800' }, footer: { padding: 'p-5 bg-stone-50 dark:bg-stone-900' } }" class="border border-stone-200 dark:border-stone-800 shadow-xl">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-stone-900 dark:text-white">{{ isEditing ? 'Cập Nhật Hồ Sơ' : 'Thêm Hồ Sơ Mới' }}</h3>
            <UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" @click="isOpen = false" />
          </div>
        </template>
        <form id="student-form" class="p-5 grid grid-cols-1 md:grid-cols-2 gap-5" @submit.prevent="submitForm">
          <div class="space-y-4">
            <p class="text-[10px] font-bold uppercase tracking-widest text-stone-400 border-b border-stone-100 dark:border-stone-800 pb-1">Cá Nhân</p>
            <UFormField label="Tên Thánh" required><UInput v-model="form.holyName" class="w-full" size="sm" :ui="{ base: 'shadow-none' }" /></UFormField>
            <UFormField label="Họ và Tên" required><UInput v-model="form.fullName" class="w-full" size="sm" :ui="{ base: 'shadow-none' }" /></UFormField>
            <UFormField label="Ngày sinh"><UInput v-model="form.birthDate" type="date" class="w-full" size="sm" :ui="{ base: 'shadow-none' }" /></UFormField>
            <UFormField label="Ngành Phụ Trách" required><USelect v-model="form.branch" :options="branchOptions" class="w-full" size="sm" :ui="{ base: 'shadow-none' }" /></UFormField>
            <UFormField label="Lớp học"><UInput v-model="form.className" class="w-full" size="sm" :ui="{ base: 'shadow-none' }" /></UFormField>
          </div>
          <div class="space-y-4">
            <p class="text-[10px] font-bold uppercase tracking-widest text-stone-400 border-b border-stone-100 dark:border-stone-800 pb-1">Bí Tích</p>
            <UFormField label="Rửa Tội"><UInput v-model="form.baptismDate" type="date" class="w-full" size="sm" :ui="{ base: 'shadow-none' }" /></UFormField>
            <UFormField label="Rước Lễ"><UInput v-model="form.communionDate" type="date" class="w-full" size="sm" :ui="{ base: 'shadow-none' }" /></UFormField>
            <UFormField label="Thêm Sức"><UInput v-model="form.confirmationDate" type="date" class="w-full" size="sm" :ui="{ base: 'shadow-none' }" /></UFormField>
          </div>
        </form>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton label="Hủy bỏ" color="neutral" variant="soft" size="sm" @click="isOpen = false" />
            <UButton type="submit" form="student-form" :label="isEditing ? 'Cập Nhật' : 'Tạo Mới'" color="primary" variant="solid" size="sm" :loading="isSubmitting" />
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Modal Excel -->
    <UModal v-model:open="isImportOpen" :ui="{ base: 'rounded-2xl' }">
      <UCard :ui="{ body: { padding: 'p-5' }, header: { padding: 'p-5 border-b border-stone-200 dark:border-stone-800' } }" class="border border-stone-200 dark:border-stone-800 shadow-xl">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-stone-900 dark:text-white">Nạp Dữ Liệu Excel</h3>
            <UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" @click="isImportOpen = false; importResult = null" />
          </div>
        </template>
        <div class="space-y-4">
          <div v-if="importResult" class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded p-3 text-sm">
            <p class="font-semibold text-emerald-700 dark:text-emerald-400">Thành công! Đã thêm {{ importResult.count }} hồ sơ.</p>
          </div>
          <UFormField label="Chọn file Excel (.xlsx)" required>
            <UInput :key="excelInputKey" type="file" accept=".xlsx,.xls" class="w-full" size="sm" :ui="{ base: 'shadow-none' }" @change="onFileChange" />
          </UFormField>
          <UButton label="Nạp dữ liệu" color="primary" size="sm" class="w-full justify-center" :loading="isUploading" :disabled="!excelFile" @click="uploadExcel" />
        </div>
      </UCard>
    </UModal>

    <!-- Modal Tin Tức -->
    <UModal v-model:open="isNewsModalOpen" :ui="{ base: 'rounded-2xl' }">
      <UCard :ui="{ body: { padding: 'p-5' }, header: { padding: 'p-5 border-b border-stone-200 dark:border-stone-800' } }" class="border border-stone-200 dark:border-stone-800 shadow-xl">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-stone-900 dark:text-white">Đăng Thông Báo Mới</h3>
            <UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" @click="isNewsModalOpen = false" />
          </div>
        </template>
        <div class="space-y-4">
          <UFormField label="Tiêu đề"><UInput v-model="newsForm.title" placeholder="Tiêu đề thông báo" size="sm" :ui="{ base: 'shadow-none' }" /></UFormField>
          <UFormField label="Phạm vi"><USelect v-model="newsForm.branch" :options="[{ value: 0, label: 'Toàn đoàn' }, ...branchOptions]" size="sm" :ui="{ base: 'shadow-none' }" /></UFormField>
          <UFormField label="Nội dung"><UTextarea v-model="newsForm.content" autoresize :ui="{ base: 'shadow-none' }" /></UFormField>
          <UCheckbox v-model="newsForm.isUrgent" label="Tin khẩn cấp" />
          <UButton label="Đăng tin" color="primary" size="sm" class="w-full justify-center mt-2" @click="submitNews" />
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Tổng Quan Hệ Thống - GiaoLy' })

const auth = useAuthStore()
const toast = useToast()

// Niên khóa
const { data: academicYears } = await useApiFetch('/AcademicYear', { default: () => [] })
const activeYear = computed(() => academicYears.value?.find(y => y.isActive) || null)

// Students & Stats
const { data: students, pending, refresh: refreshStudents } = await useApiFetch('/Student', { default: () => [] })
const branchStats = computed(() => {
  const branches = [1, 2, 3, 4]
  return branches.map(b => ({
    branch: b,
    count: students.value?.filter(s => s.branch === b).length || 0
  }))
})

// Announcements
const { data: announcements, refresh: refreshNews } = await useApiFetch('/Announcement')

// Liturgical
const { data: liturgicalToday } = await useApiFetch('/Liturgical/today')

// Birthdays this month
const upcomingBirthdays = computed(() => {
  if (!students.value) return []
  const thisMonth = new Date().getMonth()
  return students.value.filter(s => {
    if (!s.birthDate) return false
    return new Date(s.birthDate).getMonth() === thisMonth
  }).slice(0, 5)
})

// Search Table
const q = ref('')
const selectedBranch = ref('0')
const branchOptions = [
  { value: 1, label: 'Ấu Nhi' },
  { value: 2, label: 'Thiếu Nhi' },
  { value: 3, label: 'Nghĩa Sĩ' },
  { value: 4, label: 'Hiệp Sĩ' }
]
const branchFilterOptions = [{ value: '0', label: 'Tất cả Ngành' }, ...branchOptions]

const filteredRows = computed(() => {
  if (!students.value) return []
  return students.value.filter((student) => {
    const searchTerm = q.value.toLowerCase()
    const matchesSearch = !q.value || student.fullName.toLowerCase().includes(searchTerm) || student.holyName.toLowerCase().includes(searchTerm)
    const matchesBranch = selectedBranch.value === '0' || student.branch === parseInt(selectedBranch.value)
    return matchesSearch && matchesBranch
  }).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
})

const columns = [
  { accessorKey: 'fullName', header: 'Họ và Tên' },
  { accessorKey: 'sacraments', header: 'Bí Tích' },
  { accessorKey: 'branch', header: 'Ngành' },
  { accessorKey: 'className', header: 'Lớp' },
  { accessorKey: 'actions', header: '' }
]

const getStudentActions = (student) => [
  [{ label: 'Mở chi tiết', icon: 'i-heroicons-arrow-top-right-on-square', click: () => { window.location.href = '/admin/students' } }],
  [{ label: 'Chỉnh sửa', icon: 'i-heroicons-pencil', click: () => openEditModal(student) }],
  [{ label: 'Xóa hồ sơ', icon: 'i-heroicons-trash', color: 'red', click: () => deleteStudent(student.id) }]
]

// Modal CRUD Student
const isOpen = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const currentEditId = ref(null)
const initialForm = { holyName: '', fullName: '', birthDate: '', className: '', branch: 1, baptismDate: '', communionDate: '', confirmationDate: '' }
const form = reactive({ ...initialForm })

const openCreateModal = () => {
  isEditing.value = false; currentEditId.value = null; Object.assign(form, initialForm); isOpen.value = true
}
const openEditModal = (student) => {
  isEditing.value = true; currentEditId.value = student.id
  Object.assign(form, {
    ...student,
    birthDate: student.birthDate?.slice(0, 10) || '',
    baptismDate: student.baptismDate?.slice(0, 10) || '',
    communionDate: student.communionDate?.slice(0, 10) || '',
    confirmationDate: student.confirmationDate?.slice(0, 10) || ''
  })
  isOpen.value = true
}
const deleteStudent = async (id) => {
  if (!confirm('Xác nhận xóa hồ sơ này?')) return
  try {
    await $api(`/Student/${id}`, { method: 'DELETE' }); await refreshStudents()
    toast.add({ title: 'Đã xóa', color: 'success' })
  } catch (error) { toast.add({ title: 'Lỗi', color: 'error' }) }
}
const submitForm = async () => {
  isSubmitting.value = true
  try {
    const payload = { ...form, branch: parseInt(form.branch), baptismDate: form.baptismDate || null, communionDate: form.communionDate || null, confirmationDate: form.confirmationDate || null }
    const url = isEditing.value ? `/Student/${currentEditId.value}` : '/Student'
    await $api(url, { method: isEditing.value ? 'PUT' : 'POST', body: payload })
    isOpen.value = false; await refreshStudents()
    toast.add({ title: isEditing.value ? 'Cập nhật thành công' : 'Thêm thành công', color: 'success' })
  } catch (error) { toast.add({ title: 'Lỗi', color: 'error' }) }
  isSubmitting.value = false
}

// Modal Excel
const isImportOpen = ref(false)
const excelFile = ref(null)
const isUploading = ref(false)
const importResult = ref(null)
const excelInputKey = ref(0)
const onFileChange = (e) => { if (e.target.files?.length) { excelFile.value = e.target.files[0]; importResult.value = null } }
const uploadExcel = async () => {
  if (!excelFile.value) return
  isUploading.value = true
  const formData = new FormData()
  formData.append('file', excelFile.value)
  try {
    const res = await $api('/Student/import-excel', { method: 'POST', body: formData })
    importResult.value = res; excelFile.value = null; await refreshStudents()
  } catch (error) { toast.add({ title: 'Lỗi nạp file', color: 'error' }) }
  isUploading.value = false
}

// Modal News
const isNewsModalOpen = ref(false)
const newsForm = reactive({ title: '', content: '', branch: 0, isUrgent: false })
const submitNews = async () => {
  if (!newsForm.title || !newsForm.content) return toast.add({ title: 'Thiếu thông tin', color: 'error' })
  try {
    await $api('/Announcement', {
      method: 'POST',
      body: { title: newsForm.title, content: newsForm.content, branch: parseInt(newsForm.branch), type: newsForm.isUrgent ? 1 : 0, targetAudience: 0, expiryDate: null }
    })
    isNewsModalOpen.value = false; Object.assign(newsForm, { title: '', content: '', branch: 0, isUrgent: false }); await refreshNews()
    toast.add({ title: 'Đã đăng tin', color: 'success' })
  } catch (error) { toast.add({ title: 'Lỗi đăng', color: 'error' }) }
}
const deleteAnnouncement = async (id) => {
  if (!confirm('Xóa thông báo này?')) return
  try { await $api(`/Announcement/${id}`, { method: 'DELETE' }); await refreshNews() } catch (error) {}
}

// Helpers
const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('vi-VN') : '---'
const formatDateShort = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : ''
const getPercentage = (num, total) => total ? `${(num / total) * 100}%` : '0%'
const getBranchName = (id) => ({ 1: 'Ấu Nhi', 2: 'Thiếu Nhi', 3: 'Nghĩa Sĩ', 4: 'Hiệp Sĩ' }[id] || 'Chung')
const getBranchIcon = (id) => ({ 1: 'i-heroicons-heart', 2: 'i-heroicons-face-smile', 3: 'i-heroicons-academic-cap', 4: 'i-heroicons-fire' }[id] || 'i-heroicons-user')
const getBranchTailwindColor = (id) => ({ 1: 'emerald', 2: 'blue', 3: 'amber', 4: 'red' }[id] || 'stone')
const getColorDot = (color) => {
  const c = color?.toLowerCase()
  if (c === 'red') return 'bg-red-500'
  if (c === 'purple') return 'bg-purple-500'
  if (c === 'white') return 'bg-amber-400'
  if (c === 'rose') return 'bg-pink-500'
  if (c === 'black') return 'bg-stone-800'
  return 'bg-green-500'
}
const getRoleLabel = (r) => ({ 1: 'Admin', 2: 'Thư Ký', 3: 'Mod' }[r] || 'Trưởng')
</script>

<style>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e7e5e4; border-radius: 4px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #44403c; }
</style>
