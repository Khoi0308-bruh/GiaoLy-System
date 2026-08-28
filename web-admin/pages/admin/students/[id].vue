<template>
  <div class="space-y-6 animate-fade-in-up">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <UButton
          icon="i-heroicons-arrow-left"
          color="neutral"
          variant="ghost"
          to="/admin/students"
        />
        <div>
          <h1 class="text-2xl font-black text-stone-800 dark:text-white uppercase tracking-wide">
            Hồ Sơ Đoàn Sinh
          </h1>
          <p class="text-xs text-stone-400 mt-0.5">
            Xem chi tiết thông tin và quá trình sinh hoạt
          </p>
        </div>
      </div>
      <div>
        <UButton
          icon="i-heroicons-printer"
          label="In Hồ Sơ"
          color="primary"
          variant="soft"
          class="print:hidden font-bold"
          @click="printDossier"
        />
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="pending"
      class="flex justify-center py-16"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 animate-spin text-primary-400"
      />
    </div>

    <!-- Content -->
    <div
      v-else-if="student"
      class="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      <!-- Cột Trái: Thông tin cơ bản -->
      <div class="lg:col-span-1 space-y-6">
        <UCard class="glass-card text-center relative overflow-hidden">
          <div class="absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-primary-500 to-marian-blue-500 opacity-20" />
          <div class="relative pt-6">
            <UAvatar
              :src="student.photoUrl"
              :alt="student.fullName"
              size="3xl"
              class="w-24 h-24 shadow-md ring-4 ring-white dark:ring-stone-800 mx-auto bg-stone-200"
            />
            <h2 class="mt-4 font-black text-xl text-stone-800 dark:text-white">
              {{ student.fullName }}
            </h2>
            <p class="text-sm font-bold text-stone-500 uppercase">
              {{ student.holyName }}
            </p>
            <div class="flex gap-2 justify-center mt-3">
              <UBadge :color="getBranchColor(student.branch)" class="font-semibold">
                {{ getBranchName(student.branch) }}
              </UBadge>
              <UBadge v-if="student.className" color="primary" variant="subtle" class="font-semibold">
                Lớp: {{ student.className }}
              </UBadge>
            </div>
          </div>
        </UCard>

        <!-- Thống kê nhỏ bên trái -->
        <div class="grid grid-cols-2 gap-4">
          <UCard class="glass-card flex flex-col items-center justify-center text-center p-4">
            <UIcon name="i-heroicons-calendar" class="w-6 h-6 text-stone-400 mb-1" />
            <span class="text-xs text-stone-500 font-medium">Năm sinh</span>
            <strong class="text-lg text-stone-800 dark:text-stone-200">{{ student.birthDate ? new Date(student.birthDate).getFullYear() : 'N/A' }}</strong>
          </UCard>
          <UCard class="glass-card flex flex-col items-center justify-center text-center p-4">
            <UIcon name="i-heroicons-heart" class="w-6 h-6 text-red-400 mb-1" />
            <span class="text-xs text-stone-500 font-medium">Nhóm Máu</span>
            <strong class="text-lg text-stone-800 dark:text-stone-200">{{ student.bloodType || 'N/A' }}</strong>
          </UCard>
        </div>
      </div>

      <!-- Cột Phải: Tabs Chi tiết -->
      <div class="lg:col-span-2 space-y-6">
        <UCard class="glass-card h-full">
          <UTabs :items="profileTabs" class="w-full">
            <template #general>
              <div class="space-y-6 mt-4">
                <div class="grid grid-cols-2 gap-6">
                  <div>
                    <p class="text-stone-400 text-xs mb-1">Khu/Xóm</p>
                    <p class="font-medium">{{ student.area || 'Chưa cập nhật' }}</p>
                  </div>
                  <div>
                    <p class="text-stone-400 text-xs mb-1">Địa chỉ thường trú</p>
                    <p class="font-medium">{{ student.address || 'Chưa cập nhật' }}</p>
                  </div>
                </div>
                <hr class="border-stone-100 dark:border-stone-800">
                <div class="grid grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <h4 class="font-bold text-primary-600">Thông tin Cha</h4>
                    <div><p class="text-stone-400 text-xs mb-1">Họ Tên Cha</p><p class="font-medium">{{ student.fatherName || 'Chưa cập nhật' }}</p></div>
                    <div><p class="text-stone-400 text-xs mb-1">Nghề nghiệp</p><p class="font-medium">{{ student.fatherJob || 'Chưa cập nhật' }}</p></div>
                    <div><p class="text-stone-400 text-xs mb-1">Số điện thoại</p><p class="font-medium">{{ student.fatherPhone || 'Chưa cập nhật' }}</p></div>
                    <div><p class="text-stone-400 text-xs mb-1">Tôn giáo</p><p class="font-medium">{{ student.fatherReligion || 'Chưa cập nhật' }}</p></div>
                  </div>
                  <div class="space-y-4">
                    <h4 class="font-bold text-pink-600">Thông tin Mẹ</h4>
                    <div><p class="text-stone-400 text-xs mb-1">Họ Tên Mẹ</p><p class="font-medium">{{ student.motherName || 'Chưa cập nhật' }}</p></div>
                    <div><p class="text-stone-400 text-xs mb-1">Nghề nghiệp</p><p class="font-medium">{{ student.motherJob || 'Chưa cập nhật' }}</p></div>
                    <div><p class="text-stone-400 text-xs mb-1">Số điện thoại</p><p class="font-medium">{{ student.motherPhone || 'Chưa cập nhật' }}</p></div>
                    <div><p class="text-stone-400 text-xs mb-1">Tôn giáo</p><p class="font-medium">{{ student.motherReligion || 'Chưa cập nhật' }}</p></div>
                  </div>
                </div>
              </div>
            </template>
            
            <template #sacraments>
              <div class="space-y-6 mt-4">
                <!-- Rửa Tội -->
                <div class="flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-blue-100 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-800/50">
                  <div class="flex-shrink-0 w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">R</div>
                  <div class="flex-1 grid grid-cols-2 gap-4">
                    <div><p class="text-stone-400 text-xs">Trạng thái</p><p class="font-bold text-blue-600">{{ student.baptismDate ? 'Đã nhận' : 'Chưa nhận' }}</p></div>
                    <div><p class="text-stone-400 text-xs">Ngày nhận</p><p class="font-medium">{{ formatDate(student.baptismDate) || '-' }}</p></div>
                    <div><p class="text-stone-400 text-xs">Nơi rửa tội</p><p class="font-medium">{{ student.baptismPlace || '-' }}</p></div>
                    <div><p class="text-stone-400 text-xs">Người đỡ đầu</p><p class="font-medium">{{ student.baptismGodparent || '-' }}</p></div>
                    <div class="col-span-2"><p class="text-stone-400 text-xs">Linh mục chủ sự</p><p class="font-medium">{{ student.baptismPriest || '-' }}</p></div>
                  </div>
                </div>
                <!-- Rước Lễ -->
                <div class="flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-amber-100 bg-amber-50/50 dark:bg-amber-900/10 dark:border-amber-800/50">
                  <div class="flex-shrink-0 w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold text-xl">L</div>
                  <div class="flex-1 grid grid-cols-2 gap-4">
                    <div><p class="text-stone-400 text-xs">Trạng thái</p><p class="font-bold text-amber-600">{{ student.communionDate ? 'Đã nhận' : 'Chưa nhận' }}</p></div>
                    <div><p class="text-stone-400 text-xs">Ngày nhận</p><p class="font-medium">{{ formatDate(student.communionDate) || '-' }}</p></div>
                    <div><p class="text-stone-400 text-xs">Nơi rước lễ</p><p class="font-medium">{{ student.communionPlace || '-' }}</p></div>
                    <div class="col-span-2"><p class="text-stone-400 text-xs">Linh mục chủ sự</p><p class="font-medium">{{ student.communionPriest || '-' }}</p></div>
                  </div>
                </div>
                <!-- Thêm Sức -->
                <div class="flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-red-100 bg-red-50/50 dark:bg-red-900/10 dark:border-red-800/50">
                  <div class="flex-shrink-0 w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-xl">S</div>
                  <div class="flex-1 grid grid-cols-2 gap-4">
                    <div><p class="text-stone-400 text-xs">Trạng thái</p><p class="font-bold text-red-600">{{ student.confirmationDate ? 'Đã nhận' : 'Chưa nhận' }}</p></div>
                    <div><p class="text-stone-400 text-xs">Ngày nhận</p><p class="font-medium">{{ formatDate(student.confirmationDate) || '-' }}</p></div>
                    <div><p class="text-stone-400 text-xs">Nơi thêm sức</p><p class="font-medium">{{ student.confirmationPlace || '-' }}</p></div>
                    <div><p class="text-stone-400 text-xs">Người đỡ đầu</p><p class="font-medium">{{ student.confirmationGodparent || '-' }}</p></div>
                    <div class="col-span-2"><p class="text-stone-400 text-xs">Giám mục chủ sự</p><p class="font-medium">{{ student.confirmationBishop || '-' }}</p></div>
                  </div>
                </div>
              </div>
            </template>
            
            <template #medical>
              <div class="space-y-6 mt-4">
                <div class="grid grid-cols-2 gap-6">
                  <UCard class="bg-red-50/30 border-red-100 dark:bg-red-900/10 dark:border-red-800">
                    <h4 class="font-bold text-red-600 flex items-center gap-2 mb-2"><UIcon name="i-heroicons-heart" /> Nhóm máu</h4>
                    <p class="text-xl font-black text-stone-800 dark:text-white">{{ student.bloodType || 'Chưa cập nhật' }}</p>
                  </UCard>
                  <UCard class="bg-amber-50/30 border-amber-100 dark:bg-amber-900/10 dark:border-amber-800">
                    <h4 class="font-bold text-amber-600 flex items-center gap-2 mb-2"><UIcon name="i-heroicons-exclamation-triangle" /> Dị ứng / Bệnh lý</h4>
                    <p class="font-medium text-stone-800 dark:text-white">{{ student.allergies || 'Không có' }}</p>
                  </UCard>
                </div>
                <div class="mt-4">
                  <p class="text-stone-400 text-xs mb-1">Ghi chú sức khỏe hoặc tâm lý chung</p>
                  <p class="font-medium bg-stone-50 dark:bg-stone-900 p-4 rounded-lg italic">{{ student.notes || 'Không có ghi chú' }}</p>
                </div>
              </div>
            </template>
          </UTabs>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin', middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const toast = useToast()
const studentId = route.params.id

// Fix: Gọi trực tiếp API /Student/{id} thay vì fetch toàn bộ list rồi .find()
const { data: student, pending, error } = await useApiFetch(`/Student/${studentId}`)

// Xử lý 404: nếu không tìm thấy học sinh, redirect về danh sách
watch(error, (err) => {
  if (err?.statusCode === 404 || err?.status === 404) {
    toast.add({ title: 'Không tìm thấy đoàn sinh', description: 'Hồ sơ này không tồn tại hoặc đã bị xóa.', color: 'error' })
    router.push('/admin/students')
  }
})

useHead({ title: computed(() => `Hồ Sơ: ${student.value?.fullName || 'Đang tải...'} - GiaoLy Admin`) })

const getBranchName = b => ({ 1: 'Chiên con', 2: 'Ấu nhi', 3: 'Thiếu nhi', 4: 'Nghĩa sĩ' }[b] || 'Khác')
const getBranchColor = b => ({ 1: 'pink', 2: 'green', 3: 'blue', 4: 'amber' }[b] || 'neutral')
const formatDate = d => d ? new Date(d).toLocaleDateString('vi-VN') : ''

const profileTabs = [
  { label: 'Tổng quan', icon: 'i-heroicons-user', slot: 'general' },
  { label: 'Bí tích', icon: 'i-heroicons-sparkles', slot: 'sacraments' },
  { label: 'Y tế & Sức khỏe', icon: 'i-heroicons-heart', slot: 'medical' }
]

const printDossier = () => {
  window.print()
}
</script>
