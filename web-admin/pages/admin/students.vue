<template>
  <div class="min-h-screen font-sans relative pb-24 overflow-hidden">
    <!-- BACKGROUND MESH GRADIENT -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 dark:opacity-10 animate-blob bg-primary-200 dark:bg-primary-900"></div>
      <div class="absolute -bottom-32 -left-32 w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-blue-200 dark:bg-blue-900"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
    </div>

    <div class="relative z-10 space-y-6 animate-fade-in-up">
      <!-- ── PAGE HEADER & BANNER ── -->
      <div class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="z-10 text-center md:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300 text-xs font-black uppercase tracking-widest border border-primary-200 dark:border-primary-800 shadow-inner">
            <UIcon name="i-heroicons-academic-cap" class="w-4 h-4" />
            <span>Phân Hệ Học Vụ</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-stone-800 dark:text-white tracking-tight">
            Quản Lý <span class="text-primary-500">Đoàn Sinh</span>
          </h1>
          <p class="text-stone-500 text-sm mt-2 max-w-lg">
            Trung tâm lưu trữ hồ sơ, cấp chứng chỉ bí tích, xếp lớp và quản lý bảng điểm toàn diện.
          </p>
        </div>
        
        <div class="flex flex-wrap items-center justify-center gap-3 z-10">
          <UButton
            v-if="auth?.hasPermission('students.export')"
            label="Xuất Excel"
            icon="i-heroicons-arrow-down-tray"
            color="white"
            variant="solid"
            size="lg"
            class="rounded-2xl shadow-sm hover:-translate-y-0.5 transition-transform"
            @click="exportExcel"
          />
          <UButton
            v-if="auth?.hasPermission('students.manage')"
            label="Nạp Excel"
            icon="i-heroicons-cloud-arrow-up"
            color="primary"
            variant="soft"
            size="lg"
            class="rounded-2xl shadow-sm hover:-translate-y-0.5 transition-transform"
            @click="isImportOpen = true"
          />
          <UButton
            v-if="auth?.hasPermission('students.manage')"
            label="Thêm Mới"
            icon="i-heroicons-plus"
            color="primary"
            variant="solid"
            size="lg"
            class="rounded-2xl shadow-lg hover:-translate-y-0.5 transition-transform font-bold"
            @click="openAddModal"
          />
        </div>
      </div>

      <!-- ── TIER 1: TABS PHÂN NGÀNH ── -->
      <UCard class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-xl border border-white/50 dark:border-stone-800 rounded-3xl shadow-lg shadow-black/5" :ui="{ body: { padding: 'p-2' } }">
        <UTabs
          :model-value="activeBranch - 1"
          :items="[
            { label: 'Chiên Con', value: 1, icon: 'i-heroicons-heart' },
            { label: 'Ấu Nhi', value: 2, icon: 'i-heroicons-face-smile' },
            { label: 'Thiếu Nhi', value: 3, icon: 'i-heroicons-academic-cap' },
            { label: 'Nghĩa Sĩ', value: 4, icon: 'i-heroicons-fire' },
            { label: 'Hiệp Sĩ', value: 5, icon: 'i-heroicons-shield-check' }
          ]"
          :ui="{ list: { rounded: 'rounded-2xl', background: 'bg-transparent' } }"
          class="w-full"
          @update:model-value="(index) => { activeBranch = index + 1; }"
        />
      </UCard>

      <!-- ── TIER 2: THƯ MỤC LỚP ── -->
      <div v-if="!activeClass" class="animate-fade-in-up">
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
          
          <!-- Thư mục Chưa Xếp Lớp -->
          <div
            class="group cursor-pointer bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/50 dark:border-stone-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-amber-400 dark:hover:border-amber-500 transition-all text-center relative overflow-hidden"
            @click="activeClass = 'UNASSIGNED'"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="w-16 h-16 mx-auto bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
              <UIcon name="i-heroicons-folder-minus" class="w-8 h-8 text-amber-500" />
            </div>
            <h3 class="font-black text-stone-800 dark:text-white text-lg relative z-10">Chưa xếp lớp</h3>
            <p class="text-xs text-stone-500 mt-1 font-bold tracking-widest uppercase relative z-10">Cần phân bổ</p>
          </div>

          <!-- Các Thư mục Lớp học -->
          <div
            v-for="cls in availableClasses"
            :key="cls"
            class="group cursor-pointer bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/50 dark:border-stone-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-primary-400 transition-all text-center relative overflow-hidden"
            @click="activeClass = cls"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-primary-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="w-16 h-16 mx-auto bg-stone-100 dark:bg-stone-800/50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 shadow-inner">
              <UIcon name="i-heroicons-folder" class="w-8 h-8 text-stone-400 group-hover:text-primary-500 transition-colors" />
            </div>
            <h3 class="font-black text-stone-800 dark:text-white text-lg relative z-10">{{ cls }}</h3>
          </div>

        </div>
      </div>

      <!-- ── TIER 3: DANH SÁCH ĐOÀN SINH TRONG LỚP ── -->
      <div v-else class="animate-fade-in-up space-y-4">
        
        <!-- Navbar trong lớp -->
        <div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-xl border border-white/50 dark:border-stone-800 rounded-3xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div class="flex items-center gap-3">
            <UButton icon="i-heroicons-arrow-uturn-left" color="neutral" variant="soft" class="rounded-xl shadow-inner hover:bg-stone-200 dark:hover:bg-stone-800" @click="activeClass = null" />
            <div class="flex items-center gap-2">
              <span class="text-stone-400 font-bold text-sm">Ngành {{ getBranchName(activeBranch) }}</span>
              <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-stone-400" />
              <span class="font-black text-primary-600 dark:text-primary-400 text-lg uppercase tracking-wide">
                {{ activeClass === 'UNASSIGNED' ? 'Chưa xếp lớp' : activeClass }}
              </span>
            </div>
          </div>
          
          <div class="flex flex-wrap items-center gap-3">
            <!-- Nút xếp lớp tự động -->
            <UButton
              v-if="activeClass === 'UNASSIGNED' && auth?.hasPermission('students.manage')"
              label="Xếp Lớp Nhanh (Wizard)"
              icon="i-heroicons-sparkles"
              color="amber"
              variant="solid"
              class="rounded-xl shadow-md font-bold"
              @click="openAssignWizard"
            />
            <!-- Nút Bảng điểm -->
            <UButton
              v-if="activeClass !== 'UNASSIGNED'"
              label="Bảng Điểm (Gradebook)"
              icon="i-heroicons-clipboard-document-list"
              color="primary"
              variant="soft"
              class="rounded-xl shadow-inner font-bold"
              @click="openGradebook"
            />
            
            <div class="hidden lg:flex gap-2 mx-2 pl-4 border-l border-stone-200 dark:border-stone-700">
              <USelectMenu v-model="filterBaptism" :options="[{ label: 'Lọc Rửa Tội', value: '' }, { label: 'Đã Rửa Tội', value: 'true' }, { label: 'Chưa Rửa Tội', value: 'false' }]" value-attribute="value" option-attribute="label" class="w-32" :ui="{ base: 'rounded-xl shadow-sm' }" />
              <USelectMenu v-model="filterCommunion" :options="[{ label: 'Lọc Rước Lễ', value: '' }, { label: 'Đã Rước Lễ', value: 'true' }, { label: 'Chưa Rước Lễ', value: 'false' }]" value-attribute="value" option-attribute="label" class="w-32" :ui="{ base: 'rounded-xl shadow-sm' }" />
              <USelectMenu v-model="filterConfirmation" :options="[{ label: 'Lọc Thêm Sức', value: '' }, { label: 'Đã Thêm Sức', value: 'true' }, { label: 'Chưa Thêm Sức', value: 'false' }]" value-attribute="value" option-attribute="label" class="w-32" :ui="{ base: 'rounded-xl shadow-sm' }" />
            </div>
            <UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass" placeholder="Tên thánh, Họ tên..." class="w-56 lg:w-64" :ui="{ base: 'rounded-xl shadow-inner' }" />
          </div>
        </div>

        <!-- Glass Data Grid -->
        <UCard 
          class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-3xl shadow-2xl shadow-black/5 border border-white/50 dark:border-stone-800 rounded-[2.5rem] overflow-hidden"
          :ui="{ body: { padding: 'p-0', base: 'overflow-x-auto' } }"
        >
          <UTable
            :rows="pagedData?.items || []"
            :columns="columns"
            :loading="pending"
            :empty-state="{ icon: 'i-heroicons-users', header: 'Lớp trống hoặc không tìm thấy' }"
            :ui="{ 
              th: { base: 'bg-stone-100/50 dark:bg-stone-900/50 font-black uppercase tracking-widest text-[10px] text-stone-500 py-4 border-b border-white/40 dark:border-stone-800/50' },
              td: { base: 'whitespace-nowrap border-b border-stone-200/20 dark:border-stone-800/20 py-3' },
              tr: { base: 'hover:bg-white/50 dark:hover:bg-stone-800/50 transition-colors group' }
            }"
          >
            <template #fullName-cell="{ row }">
              <NuxtLink :to="`/admin/students/${row.original.id}`" class="flex items-center gap-3 pl-2 group/link cursor-pointer">
                <UAvatar :alt="row.original.fullName" size="sm" :ui="{ background: `bg-${getBranchTailwindColor(row.original.branch)}-100 dark:bg-${getBranchTailwindColor(row.original.branch)}-900`, text: `text-${getBranchTailwindColor(row.original.branch)}-600 dark:text-${getBranchTailwindColor(row.original.branch)}-300 font-bold` }" class="shadow-sm ring-2 ring-white dark:ring-stone-800 group-hover/link:scale-105 transition-transform" />
                <div>
                  <p class="font-black text-stone-800 dark:text-white text-sm leading-none mb-1 group-hover/link:text-primary-600 transition-colors">
                    <span class="text-primary-500 mr-1">{{ row.original.holyName }}</span>
                    {{ row.original.fullName }}
                  </p>
                  <p class="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                    Sinh: {{ formatDate(row.original.birthDate) }}
                  </p>
                </div>
              </NuxtLink>
            </template>
            
            <template #branch-cell="{ row }">
              <UBadge :color="getBranchColor(row.original.branch)" variant="subtle" size="sm" class="font-black uppercase tracking-widest px-3 rounded-xl shadow-inner">
                {{ getBranchName(row.original.branch) }}
              </UBadge>
            </template>
            
            <template #sacraments-cell="{ row }">
              <div class="flex gap-2">
                <UTooltip text="Rửa Tội"><UIcon name="i-heroicons-beaker" :class="row.original.baptismDate ? 'text-blue-500 w-5 h-5 drop-shadow' : 'text-stone-300 dark:text-stone-700 w-5 h-5 opacity-50'" /></UTooltip>
                <UTooltip text="Rước Lễ"><UIcon name="i-heroicons-cake" :class="row.original.communionDate ? 'text-amber-500 w-5 h-5 drop-shadow' : 'text-stone-300 dark:text-stone-700 w-5 h-5 opacity-50'" /></UTooltip>
                <UTooltip text="Thêm Sức"><UIcon name="i-heroicons-fire" :class="row.original.confirmationDate ? 'text-red-500 w-5 h-5 drop-shadow' : 'text-stone-300 dark:text-stone-700 w-5 h-5 opacity-50'" /></UTooltip>
              </div>
            </template>

            <!-- Menu 3 chấm Actions -->
            <template #actions-cell="{ row }">
              <div class="flex justify-end pr-2">
                <UDropdown v-if="auth?.hasPermission('students.manage')" :items="getStudentActions(row.original)" :popper="{ placement: 'bottom-end' }">
                  <UButton color="neutral" variant="ghost" icon="i-heroicons-ellipsis-horizontal" size="sm" class="rounded-xl opacity-50 group-hover:opacity-100 transition-opacity bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 shadow-sm" />
                </UDropdown>
              </div>
            </template>
          </UTable>

          <div class="flex justify-between items-center px-6 py-4 border-t border-white/30 dark:border-stone-800/50 bg-stone-100/30 dark:bg-stone-900/30">
            <span class="text-xs font-bold text-stone-500">Tổng cộng: <b>{{ pagedData?.total || 0 }}</b> hồ sơ</span>
            <UPagination v-model="page" :page-count="pageSize" :total="pagedData?.total || 0" :ui="{ wrapper: 'shadow-inner rounded-xl', base: 'rounded-lg' }" />
          </div>
        </UCard>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         MODALS (Add/Edit, Certificate, Wizard, Gradebook, Import)
    ═══════════════════════════════════════════════════════ -->
    
    <!-- Modal Add/Edit Student -->
    <UModal v-model:open="isAddModalOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden sm:max-w-4xl' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' }, footer: { padding: 'p-6 bg-stone-50 dark:bg-stone-900' } }">
        <template #header>
          <div class="bg-primary-600 dark:bg-primary-900 p-6 flex justify-between items-center text-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><UIcon name="i-heroicons-user-plus" class="w-6 h-6" /></div>
              <h3 class="text-xl font-black uppercase tracking-wide">{{ isEditing ? 'Cập Nhật Hồ Sơ Đoàn Sinh' : 'Tạo Hồ Sơ Đoàn Sinh Mới' }}</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="white" variant="ghost" class="hover:bg-white/10 rounded-full" @click="isAddModalOpen = false" />
          </div>
        </template>
        <UForm :schema="studentSchema" :state="studentForm" id="studentForm" @submit="submitStudent" class="p-6">
          <UTabs :items="profileTabs" :ui="{ list: { rounded: 'rounded-2xl bg-stone-100 dark:bg-stone-800' } }" class="w-full">
            
            <template #personal>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <UFormField label="Tên Thánh" name="holyName"><UInput v-model="studentForm.holyName" placeholder="Giuse" class="w-full" :ui="{ base: 'rounded-xl' }" /></UFormField>
                <UFormField label="Họ và Tên" name="fullName" required><UInput v-model="studentForm.fullName" placeholder="Nguyễn Văn A" class="w-full" :ui="{ base: 'rounded-xl' }" /></UFormField>
                <UFormField label="Ngày Sinh" name="birthDate"><UInput v-model="studentForm.birthDate" type="date" class="w-full" :ui="{ base: 'rounded-xl' }" /></UFormField>
                <UFormField label="Giới tính" name="gender"><USelect v-model="studentForm.gender" :options="['Nam', 'Nữ']" class="w-full" :ui="{ base: 'rounded-xl' }" /></UFormField>
                <UFormField label="Trạng thái" name="isActive">
                  <div class="flex items-center gap-3 mt-1 p-2 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                    <UToggle v-model="studentForm.isActive" color="emerald" />
                    <span class="text-sm font-bold text-stone-600 dark:text-stone-300">{{ studentForm.isActive ? 'Đang hoạt động' : 'Đã nghỉ học' }}</span>
                  </div>
                </UFormField>
                <UFormField label="Khu/Xóm" name="area"><UInput v-model="studentForm.area" placeholder="Khu Mân Côi..." class="w-full" :ui="{ base: 'rounded-xl' }" /></UFormField>
              </div>
            </template>
            
            <!-- Other tabs are similarly restyled in a fast way -->
            <template #family>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div class="space-y-4 p-5 border border-primary-200 dark:border-primary-800 rounded-2xl bg-primary-50/30 dark:bg-primary-900/10">
                  <h4 class="font-black text-primary-600 flex items-center gap-2"><UIcon name="i-heroicons-user" /> Thông tin Cha</h4>
                  <div class="grid grid-cols-2 gap-3">
                    <UFormField label="Tên Thánh" name="fatherHolyName"><UInput v-model="studentForm.fatherHolyName" :ui="{ base: 'rounded-xl' }" /></UFormField>
                    <UFormField label="Họ Tên" name="fatherName"><UInput v-model="studentForm.fatherName" :ui="{ base: 'rounded-xl' }" /></UFormField>
                  </div>
                  <UFormField label="Nghề nghiệp" name="fatherJob"><UInput v-model="studentForm.fatherJob" :ui="{ base: 'rounded-xl' }" /></UFormField>
                </div>
                <div class="space-y-4 p-5 border border-pink-200 dark:border-pink-800 rounded-2xl bg-pink-50/30 dark:bg-pink-900/10">
                  <h4 class="font-black text-pink-600 flex items-center gap-2"><UIcon name="i-heroicons-user" /> Thông tin Mẹ</h4>
                  <div class="grid grid-cols-2 gap-3">
                    <UFormField label="Tên Thánh" name="motherHolyName"><UInput v-model="studentForm.motherHolyName" :ui="{ base: 'rounded-xl' }" /></UFormField>
                    <UFormField label="Họ Tên" name="motherName"><UInput v-model="studentForm.motherName" :ui="{ base: 'rounded-xl' }" /></UFormField>
                  </div>
                  <UFormField label="Nghề nghiệp" name="motherJob"><UInput v-model="studentForm.motherJob" :ui="{ base: 'rounded-xl' }" /></UFormField>
                </div>
                <UFormField label="Số Điện Thoại Liên Lạc" name="parentPhone" class="md:col-span-2">
                  <UInput v-model="studentForm.parentPhone" placeholder="090..." icon="i-heroicons-phone" class="w-full" :ui="{ base: 'rounded-xl' }" />
                </UFormField>
                <UFormField label="Địa chỉ nhà" name="address" class="md:col-span-2">
                  <UInput v-model="studentForm.address" placeholder="Tổ, Đường, Phường..." class="w-full" :ui="{ base: 'rounded-xl' }" />
                </UFormField>
              </div>
            </template>

            <template #sacraments>
              <div class="space-y-4 mt-6">
                <!-- Rửa tội -->
                <div class="p-5 border border-blue-200 dark:border-blue-800 rounded-2xl bg-blue-50/30 dark:bg-blue-900/10">
                  <UCheckbox :model-value="!!studentForm.baptismDate" @update:model-value="val => studentForm.baptismDate = val ? (studentForm.baptismDate || new Date().toISOString().split('T')[0]) : ''" label="Đã Rửa Tội" :ui="{ label: 'font-bold text-blue-700 dark:text-blue-400' }" />
                  <div v-if="studentForm.baptismDate" class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <UFormField label="Ngày nhận"><UInput v-model="studentForm.baptismDate" type="date" :ui="{ base: 'rounded-xl' }" /></UFormField>
                    <UFormField label="Nơi nhận"><UInput v-model="studentForm.baptismPlace" placeholder="Giáo xứ..." :ui="{ base: 'rounded-xl' }" /></UFormField>
                    <UFormField label="Linh mục"><UInput v-model="studentForm.baptismPriest" :ui="{ base: 'rounded-xl' }" /></UFormField>
                  </div>
                </div>
                <!-- Rước lễ -->
                <div class="p-5 border border-amber-200 dark:border-amber-800 rounded-2xl bg-amber-50/30 dark:bg-amber-900/10">
                  <UCheckbox :model-value="!!studentForm.communionDate" @update:model-value="val => studentForm.communionDate = val ? (studentForm.communionDate || new Date().toISOString().split('T')[0]) : ''" label="Đã Rước Lễ" :ui="{ label: 'font-bold text-amber-700 dark:text-amber-400' }" />
                  <div v-if="studentForm.communionDate" class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <UFormField label="Ngày nhận"><UInput v-model="studentForm.communionDate" type="date" :ui="{ base: 'rounded-xl' }" /></UFormField>
                    <UFormField label="Nơi nhận"><UInput v-model="studentForm.communionPlace" :ui="{ base: 'rounded-xl' }" /></UFormField>
                    <UFormField label="Linh mục"><UInput v-model="studentForm.communionPriest" :ui="{ base: 'rounded-xl' }" /></UFormField>
                  </div>
                </div>
                <!-- Thêm sức -->
                <div class="p-5 border border-red-200 dark:border-red-800 rounded-2xl bg-red-50/30 dark:bg-red-900/10">
                  <UCheckbox :model-value="!!studentForm.confirmationDate" @update:model-value="val => studentForm.confirmationDate = val ? (studentForm.confirmationDate || new Date().toISOString().split('T')[0]) : ''" label="Đã Thêm Sức" :ui="{ label: 'font-bold text-red-700 dark:text-red-400' }" />
                  <div v-if="studentForm.confirmationDate" class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <UFormField label="Ngày nhận"><UInput v-model="studentForm.confirmationDate" type="date" :ui="{ base: 'rounded-xl' }" /></UFormField>
                    <UFormField label="Nơi nhận"><UInput v-model="studentForm.confirmationPlace" :ui="{ base: 'rounded-xl' }" /></UFormField>
                    <UFormField label="Người đỡ đầu"><UInput v-model="studentForm.confirmationGodparent" :ui="{ base: 'rounded-xl' }" /></UFormField>
                  </div>
                </div>
              </div>
            </template>

            <template #medical>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <UFormField label="Nhóm máu"><USelect v-model="studentForm.bloodType" :options="['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Chưa rõ']" :ui="{ base: 'rounded-xl' }" /></UFormField>
                <UFormField label="Tiền sử dị ứng"><UInput v-model="studentForm.allergies" placeholder="Ví dụ: Hải sản..." :ui="{ base: 'rounded-xl' }" /></UFormField>
              </div>
            </template>

            <template #academic>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <UFormField label="Ngành"><USelect v-model="studentForm.branch" :options="[{ label: 'Chiên con', value: 1 }, { label: 'Ấu nhi', value: 2 }, { label: 'Thiếu nhi', value: 3 }, { label: 'Nghĩa sĩ', value: 4 }, { label: 'Hiệp sĩ', value: 5 }]" value-attribute="value" option-attribute="label" :ui="{ base: 'rounded-xl' }" /></UFormField>
                <UFormField label="Lớp (để trống nếu xếp tự động)"><UInput v-model="studentForm.className" placeholder="Ấu 1" :ui="{ base: 'rounded-xl' }" /></UFormField>
                <UFormField label="Ghi chú đặc biệt" class="md:col-span-2"><UTextarea v-model="studentForm.notes" :rows="3" :ui="{ base: 'rounded-xl' }" /></UFormField>
              </div>
            </template>
          </UTabs>
        </UForm>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Hủy bỏ" color="neutral" variant="soft" size="lg" class="rounded-xl font-bold" @click="isAddModalOpen = false" />
            <UButton type="submit" form="studentForm" :label="isEditing ? 'Lưu Thay Đổi' : 'Tạo Hồ Sơ Mới'" color="primary" variant="solid" size="lg" class="rounded-xl font-black uppercase tracking-wider shadow-lg" :loading="isSubmitting" />
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Modal Cấp Chứng Chỉ -->
    <UModal v-model:open="isCertModalOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden' }">
      <UCard :ui="{ body: { padding: 'p-6' }, header: { padding: 'p-6 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800' } }">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl shadow-inner"><UIcon name="i-heroicons-academic-cap" class="w-8 h-8" /></div>
            <div>
              <h3 class="text-xl font-black text-stone-800 dark:text-white uppercase">Chứng Chỉ Bí Tích</h3>
              <p class="text-sm font-bold text-primary-600 mt-1">{{ selectedStudent?.holyName }} {{ selectedStudent?.fullName }}</p>
            </div>
          </div>
        </template>
        <div class="space-y-6">
          <div class="space-y-2">
            <h4 class="font-black text-xs uppercase tracking-widest text-stone-500">Đã Cấp Phát</h4>
            <div v-if="!certificates.length" class="text-sm text-stone-400 italic p-4 bg-stone-50 dark:bg-stone-900/50 rounded-2xl text-center border border-dashed border-stone-200 dark:border-stone-800">Chưa có chứng chỉ nào.</div>
            <div v-for="cert in certificates" :key="cert.id" class="flex justify-between items-center p-4 bg-stone-100 dark:bg-stone-800 rounded-2xl">
              <div>
                <p class="font-black text-stone-800 dark:text-white">{{ getCertName(cert.certificateType) }}</p>
                <p class="text-[10px] text-stone-500 font-bold uppercase tracking-widest mt-1">Mã: {{ cert.verificationCode }}</p>
              </div>
              <div class="flex gap-2">
                <UButton icon="i-heroicons-arrow-down-tray" color="primary" variant="soft" size="sm" class="rounded-xl" :to="`/api/Certificate/download/${cert.id}`" target="_blank" external />
                <UButton icon="i-heroicons-trash" color="error" variant="ghost" size="sm" class="rounded-xl" @click="revokeCert(cert.id)" />
              </div>
            </div>
          </div>
          <hr class="border-stone-200 dark:border-stone-800">
          <div class="space-y-4">
            <h4 class="font-black text-xs uppercase tracking-widest text-stone-500">Cấp Mới</h4>
            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Loại Bí Tích"><USelect v-model="certForm.certificateType" :options="[{ label: 'Rửa Tội', value: 'Baptism' }, { label: 'Rước Lễ', value: 'Communion' }, { label: 'Thêm Sức', value: 'Confirmation' }]" value-attribute="value" option-attribute="label" :ui="{ base: 'rounded-xl' }" /></UFormField>
              <UFormField label="Linh Mục Chủ Sự"><UInput v-model="certForm.celebrant" :ui="{ base: 'rounded-xl' }" /></UFormField>
              <UFormField label="Người Đỡ Đầu"><UInput v-model="certForm.godparent" :ui="{ base: 'rounded-xl' }" /></UFormField>
              <UFormField label="Ký tên (Cha Xứ)"><UInput v-model="certForm.signedBy" :ui="{ base: 'rounded-xl' }" /></UFormField>
            </div>
            <UButton label="Tiến Hành Cấp Phát" color="amber" block size="lg" class="rounded-xl font-black uppercase tracking-wider shadow-md" @click="issueCert" />
          </div>
        </div>
      </UCard>
    </UModal>

    <!-- Modal Auto-Assign Wizard -->
    <UModal v-model:open="isAssignModalOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden' }">
      <UCard :ui="{ body: { padding: 'p-6' }, header: { padding: 'p-6 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800' } }">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl shadow-inner"><UIcon name="i-heroicons-sparkles" class="w-8 h-8" /></div>
            <div>
              <h3 class="text-xl font-black text-stone-800 dark:text-white uppercase">Xếp Lớp Tự Động</h3>
              <p class="text-sm font-bold text-stone-500 mt-1">Phân bổ đều học sinh vào các lớp</p>
            </div>
          </div>
        </template>
        <div class="space-y-6">
          <div class="p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-2xl flex items-start gap-3 text-primary-700 dark:text-primary-300 text-sm font-medium">
            <UIcon name="i-heroicons-information-circle" class="w-6 h-6 shrink-0" />
            <p>Hệ thống sẽ lấy toàn bộ <b>{{ pagedData?.total || 0 }}</b> đoàn sinh chưa xếp lớp của ngành <b>{{ getBranchName(activeBranch) }}</b> và chia đều vào số lượng lớp bạn chọn.</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Số lượng Lớp"><UInput v-model.number="assignForm.numClasses" type="number" min="1" max="20" :ui="{ base: 'rounded-xl' }" /></UFormField>
            <UFormField label="Phương pháp">
              <USelect v-model="assignForm.method" :options="[{ label: 'Trộn Ngẫu Nhiên', value: 'Random' }, { label: 'Chia Theo Giáo Khu', value: 'Area' }]" value-attribute="value" option-attribute="label" :ui="{ base: 'rounded-xl' }" />
            </UFormField>
          </div>
          <UButton label="Khởi Chạy Xếp Lớp" color="amber" block size="lg" class="rounded-xl font-black uppercase tracking-wider shadow-lg" @click="submitAssignClasses" />
        </div>
      </UCard>
    </UModal>

    <!-- Modal Bảng Điểm (Gradebook) -->
    <UModal v-model:open="isGradebookOpen" fullscreen :ui="{ base: 'bg-white/95 dark:bg-stone-950/95 backdrop-blur-3xl' }">
      <div class="h-full flex flex-col p-6 max-w-7xl mx-auto w-full">
        <div class="flex items-center justify-between mb-6 pb-6 border-b border-stone-200 dark:border-stone-800">
          <div class="flex items-center gap-4">
            <div class="p-4 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-2xl"><UIcon name="i-heroicons-clipboard-document-list" class="w-8 h-8" /></div>
            <div>
              <h2 class="text-3xl font-black text-stone-800 dark:text-white uppercase tracking-tight">Sổ Điểm Danh & Kết Quả</h2>
              <p class="text-sm font-bold text-stone-500 uppercase tracking-widest mt-1">Lớp: <span class="text-primary-600">{{ activeClass }}</span></p>
            </div>
          </div>
          <div class="flex gap-3">
            <UButton label="Đóng" color="neutral" variant="soft" size="lg" class="rounded-2xl font-bold" @click="isGradebookOpen = false" />
            <UButton label="Lưu Bảng Điểm" color="primary" variant="solid" size="lg" class="rounded-2xl font-black uppercase shadow-lg" icon="i-heroicons-check" :loading="isSavingGradebook" @click="saveGradebook" />
          </div>
        </div>
        
        <div class="flex-1 overflow-auto rounded-[2rem] border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xl relative">
          <table class="w-full text-sm text-left">
            <thead class="text-xs font-black text-stone-500 uppercase tracking-widest bg-stone-100 dark:bg-stone-950 sticky top-0 z-10 shadow-sm">
              <tr>
                <th class="px-6 py-5 w-16">STT</th>
                <th class="px-6 py-5 min-w-[200px]">Họ và Tên Đoàn Sinh</th>
                <th class="px-6 py-5 w-32 text-center">Học Kỳ 1</th>
                <th class="px-6 py-5 w-32 text-center">Học Kỳ 2</th>
                <th class="px-6 py-5 w-32 text-center text-primary-600">Tổng Kết</th>
                <th class="px-6 py-5 min-w-[300px]">Nhận Xét Của GLV</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100 dark:divide-stone-800/50">
              <tr v-if="gradebookPending" v-for="i in 5" :key="`skeleton-${i}`" class="animate-pulse">
                <td colspan="6" class="px-6 py-6 bg-stone-50 dark:bg-stone-900/50">Đang tải dữ liệu...</td>
              </tr>
              <tr v-else-if="!gradebookData.length">
                <td colspan="6" class="px-6 py-12 text-center text-stone-500 font-bold">Chưa có đoàn sinh nào trong lớp.</td>
              </tr>
              <tr v-else v-for="(row, idx) in gradebookData" :key="row.studentId" class="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                <td class="px-6 py-4 font-black text-stone-400">{{ idx + 1 }}</td>
                <td class="px-6 py-4">
                  <div class="font-black text-stone-800 dark:text-stone-200 text-base">{{ row.fullName }}</div>
                  <div class="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{{ row.holyName }}</div>
                </td>
                <td class="px-6 py-4"><UInput v-model="row.semester1" type="number" step="0.1" size="lg" placeholder="-" class="w-24 mx-auto" :ui="{ base: 'text-center font-bold rounded-xl bg-white dark:bg-stone-900 shadow-inner' }" /></td>
                <td class="px-6 py-4"><UInput v-model="row.semester2" type="number" step="0.1" size="lg" placeholder="-" class="w-24 mx-auto" :ui="{ base: 'text-center font-bold rounded-xl bg-white dark:bg-stone-900 shadow-inner' }" /></td>
                <td class="px-6 py-4"><UInput v-model="row.finalScore" type="number" step="0.1" size="lg" placeholder="Auto" class="w-24 mx-auto" :ui="{ base: 'text-center font-black text-primary-600 bg-primary-50 dark:bg-primary-900/20 rounded-xl shadow-inner border-primary-200 dark:border-primary-800' }" /></td>
                <td class="px-6 py-4"><UInput v-model="row.remarks" size="lg" placeholder="Nhập nhận xét..." :ui="{ base: 'rounded-xl shadow-inner' }" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </UModal>

    <!-- Modal Import -->
    <UModal v-model:open="isImportOpen" :ui="{ base: 'rounded-[2rem] overflow-hidden sm:max-w-3xl' }">
      <UCard :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-6 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800' } }">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-black text-stone-800 dark:text-white uppercase flex items-center gap-2">
              <UIcon name="i-heroicons-cloud-arrow-up" class="text-primary-500 w-6 h-6" /> Nạp Dữ Liệu Hàng Loạt
            </h3>
            <UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" @click="isImportOpen = false" />
          </div>
        </template>
        <div class="p-6">
          <ImportWizard @imported="isImportOpen = false; refresh()" />
        </div>
      </UCard>
    </UModal>

  </div>
</template>

<script setup>
import { z } from 'zod'
import { refDebounced } from '@vueuse/core'
import ImportWizard from '~/components/ImportWizard.vue'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Quản Lý Đoàn Sinh - GiaoLy Admin' })

const toast = useToast()
const auth = useAuthStore()

// ── State Thư Mục (File Explorer) ──
const activeBranch = ref(1) // Mặc định Chiên Con
const activeClass = ref(null) // null = xem danh sách lớp, string = tên lớp cụ thể
const availableClasses = ref([])

const fetchClasses = async () => {
  try {
    availableClasses.value = await $api(`/Student/classes/${activeBranch.value}`) || []
  } catch (err) {
    console.error('Lỗi tải danh sách lớp', err)
  }
}

watch(activeBranch, () => {
  activeClass.value = null
  fetchClasses()
}, { immediate: true })

// ── Gradebook ──
const isGradebookOpen = ref(false)
const gradebookData = ref([])
const gradebookPending = ref(false)
const isSavingGradebook = ref(false)

const openGradebook = async () => {
  if (!activeClass.value || activeClass.value === 'UNASSIGNED') return
  isGradebookOpen.value = true
  await fetchGradebook()
}

const fetchGradebook = async () => {
  gradebookPending.value = true
  try {
    gradebookData.value = await $api(`/StudentScore/class/${encodeURIComponent(activeClass.value)}`)
  } catch (err) {
    toast.add({ title: 'Lỗi tải bảng điểm', description: err.data?.message || err.message, color: 'error' })
  } finally {
    gradebookPending.value = false
  }
}

const saveGradebook = async () => {
  isSavingGradebook.value = true
  try {
    await $fetch(`${useRuntimeConfig().public.apiBase}/StudentScore/save`, {
      method: 'POST',
      body: gradebookData.value,
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    toast.add({ title: 'Đã lưu điểm thành công', color: 'success' })
  } catch (err) {
    toast.add({ title: 'Lỗi lưu điểm', description: err.data?.message || err.message, color: 'error' })
  } finally {
    isSavingGradebook.value = false
  }
}

// ── Bảng Dữ Liệu Đoàn Sinh (Pagination & Filter) ──
const page = ref(1)
const pageSize = ref(20)
const searchQuery = ref('')
const debouncedSearchQuery = refDebounced(searchQuery, 500)
const filterBaptism = ref('')
const filterCommunion = ref('')
const filterConfirmation = ref('')

const { data: pagedData, pending, refresh } = await useApiFetch('/Student/paged', {
  query: computed(() => ({
    page: page.value,
    pageSize: pageSize.value,
    search: debouncedSearchQuery.value,
    branch: activeBranch.value,
    className: activeClass.value === 'UNASSIGNED' ? 'UNASSIGNED' : activeClass.value,
    hasBaptism: filterBaptism.value !== '' ? filterBaptism.value === 'true' : undefined,
    hasCommunion: filterCommunion.value !== '' ? filterCommunion.value === 'true' : undefined,
    hasConfirmation: filterConfirmation.value !== '' ? filterConfirmation.value === 'true' : undefined
  })),
  watch: [page, pageSize, debouncedSearchQuery, activeBranch, activeClass, filterBaptism, filterCommunion, filterConfirmation]
})

const columns = [
  { accessorKey: 'fullName', header: 'Đoàn Sinh' },
  { accessorKey: 'branch', header: 'Ngành' },
  { accessorKey: 'sacraments', header: 'Bí Tích' },
  { accessorKey: 'actions', header: '' }
]

const getStudentActions = (student) => [
  [{ label: 'Chi tiết / In Chứng Chỉ', icon: 'i-heroicons-qr-code', click: () => { window.location.href = `/admin/students/${student.id}` } }],
  [{ label: 'Cấp Bí Tích', icon: 'i-heroicons-sparkles', click: () => openCertModal(student) }, { label: 'Sửa Hồ Sơ', icon: 'i-heroicons-pencil-square', click: () => openEditModal(student) }],
  [{ label: 'Xóa Hồ Sơ', icon: 'i-heroicons-trash', color: 'red', click: () => deleteStudent(student.id) }]
]

// ── Helpers ──
const getBranchName = b => ({ 1: 'Chiên con', 2: 'Ấu nhi', 3: 'Thiếu nhi', 4: 'Nghĩa sĩ', 5: 'Hiệp sĩ' }[b] || 'Khác')
const getBranchColor = b => ({ 1: 'pink', 2: 'success', 3: 'primary', 4: 'warning', 5: 'error' }[b] || 'neutral')
const getBranchTailwindColor = b => ({ 1: 'pink', 2: 'emerald', 3: 'blue', 4: 'amber', 5: 'red' }[b] || 'stone')
const getCertName = t => ({ Baptism: 'Rửa Tội', Communion: 'Rước Lễ', Confirmation: 'Thêm Sức' }[t] || t)
const formatDate = d => d ? new Date(d).toLocaleDateString('vi-VN') : '---'
const toDateInput = d => d ? new Date(d).toISOString().split('T')[0] : ''

// ── Add/Edit Modal ──
const isAddModalOpen = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const editingId = ref(null)

const defaultStudent = () => ({ 
  holyName: '', fullName: '', birthDate: '', gender: 'Nam', area: '', 
  className: '', branch: activeBranch.value, isActive: true,
  baptismDate: '', baptismPlace: '', baptismPriest: '', baptismGodparent: '',
  communionDate: '', communionPlace: '', communionPriest: '',
  confirmationDate: '', confirmationPlace: '', confirmationBishop: '', confirmationGodparent: '', 
  fatherHolyName: '', fatherName: '', fatherJob: '', fatherReligion: '',
  motherHolyName: '', motherName: '', motherJob: '', motherReligion: '',
  parentPhone: '', address: '', marriageStatus: '',
  notes: '', bloodType: '', allergies: ''
})
const studentForm = ref(defaultStudent())

const studentSchema = z.object({
  holyName: z.string().max(50).optional().or(z.literal('')),
  fullName: z.string().min(2, 'Họ tên quá ngắn').max(100),
  birthDate: z.string().optional().or(z.literal('')),
  gender: z.string().optional().or(z.literal('')),
  area: z.string().max(100).optional().or(z.literal('')),
  className: z.string().max(50).optional().or(z.literal('')),
  branch: z.number(),
  isActive: z.boolean().optional(),
  baptismDate: z.string().optional().or(z.literal('')),
  communionDate: z.string().optional().or(z.literal('')),
  confirmationDate: z.string().optional().or(z.literal('')),
  parentPhone: z.string().optional().or(z.literal(''))
})

const openAddModal = () => { isEditing.value = false; studentForm.value = defaultStudent(); isAddModalOpen.value = true }
const openEditModal = (s) => { isEditing.value = true; editingId.value = s.id; studentForm.value = { ...s, birthDate: toDateInput(s.birthDate), baptismDate: toDateInput(s.baptismDate), communionDate: toDateInput(s.communionDate), confirmationDate: toDateInput(s.confirmationDate) }; isAddModalOpen.value = true }

const profileTabs = [
  { label: 'Cá nhân', slot: 'personal' }, { label: 'Gia đình', slot: 'family' }, { label: 'Bí tích', slot: 'sacraments' }, { label: 'Y tế', slot: 'medical' }, { label: 'Học vụ', slot: 'academic' }
]

const submitStudent = async () => {
  isSubmitting.value = true
  try {
    const payload = { ...studentForm.value }
    if (!payload.baptismDate) payload.baptismDate = null
    if (!payload.communionDate) payload.communionDate = null
    if (!payload.confirmationDate) payload.confirmationDate = null
    if (!payload.birthDate) payload.birthDate = null
    if (isEditing.value) {
      await $api(`/Student/${editingId.value}`, { method: 'PUT', body: payload })
      toast.add({ title: 'Đã cập nhật', color: 'success' })
    } else {
      await $api('/Student', { method: 'POST', body: payload })
      toast.add({ title: 'Đã thêm hồ sơ', color: 'success' })
    }
    isAddModalOpen.value = false
    await refresh()
  } catch (err) { toast.add({ title: 'Lỗi', description: err.message, color: 'error' }) }
  isSubmitting.value = false
}

const deleteStudent = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa đoàn sinh này? Dữ liệu không thể phục hồi.')) return
  try {
    await $api(`/Student/${id}`, { method: 'DELETE' })
    toast.add({ title: 'Đã xóa hồ sơ', color: 'success' })
    await refresh()
  } catch { toast.add({ title: 'Lỗi xóa', color: 'error' }) }
}

// ── Auto-Assign Wizard ──
const isAssignModalOpen = ref(false)
const assignForm = ref({ numClasses: 3, method: 'Random' })
const openAssignWizard = () => isAssignModalOpen.value = true
const submitAssignClasses = async () => {
  if (!pagedData.value?.items?.length) return toast.add({ title: 'Không có đoàn sinh để xếp lớp', color: 'error' })
  try {
    const studentIds = pagedData.value.items.map(s => s.id)
    const branchPrefix = getBranchName(activeBranch.value).split(' ')[0]
    await $api('/Student/assign-classes', { method: 'POST', body: { studentIds, numberOfClasses: assignForm.value.numClasses, branchPrefix, method: assignForm.value.method } })
    toast.add({ title: 'Đã xếp lớp thành công', color: 'success' })
    isAssignModalOpen.value = false
    activeClass.value = null
    await fetchClasses()
    await refresh()
  } catch (err) { toast.add({ title: 'Lỗi xếp lớp', description: err.message, color: 'error' }) }
}

// ── Certificates ──
const isCertModalOpen = ref(false)
const selectedStudent = ref(null)
const certificates = ref([])
const certForm = ref({ certificateType: 'Baptism', celebrant: '', godparent: '', signedBy: 'Cha Chánh Xứ' })

const loadCerts = async (id) => { try { certificates.value = await $api(`/Certificate/student/${id}`) || [] } catch { certificates.value = [] } }
const openCertModal = async (student) => { selectedStudent.value = student; certForm.value = { certificateType: 'Baptism', celebrant: '', godparent: '', signedBy: 'Cha Chánh Xứ' }; await loadCerts(student.id); isCertModalOpen.value = true }
const issueCert = async () => {
  try {
    await $api('/Certificate/issue', { method: 'POST', body: { studentId: selectedStudent.value.id, ...certForm.value } })
    toast.add({ title: 'Đã cấp chứng chỉ', color: 'success' })
    await loadCerts(selectedStudent.value.id)
  } catch (err) { toast.add({ title: 'Lỗi', description: err.data?.message || err.message, color: 'error' }) }
}
const revokeCert = async (id) => {
  if (!confirm('Thu hồi chứng chỉ này?')) return
  try { await $api(`/Certificate/${id}`, { method: 'DELETE' }); toast.add({ title: 'Đã thu hồi', color: 'success' }); await loadCerts(selectedStudent.value.id) } catch { toast.add({ title: 'Lỗi', color: 'error' }) }
}

// ── Excel ──
const isImportOpen = ref(false)
const exportExcel = async () => {
  try {
    const params = new URLSearchParams()
    if (activeBranch.value > 0) params.append('branch', activeBranch.value) // FIX BUG: Changed from filterBranch to activeBranch
    if (filterBaptism.value !== '') params.append('hasBaptism', filterBaptism.value === 'true')
    if (filterCommunion.value !== '') params.append('hasCommunion', filterCommunion.value === 'true')
    if (filterConfirmation.value !== '') params.append('hasConfirmation', filterConfirmation.value === 'true')
    
    const res = await $fetch(`${useRuntimeConfig().public.apiBase}/Student/export-excel?${params.toString()}`, { method: 'GET', headers: { Authorization: `Bearer ${auth.token}` }, responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([res]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `DanhSachDoanSinh_${new Date().toISOString().split('T')[0]}.xlsx`)
    document.body.appendChild(link)
    link.click(); link.remove()
  } catch (err) { toast.add({ title: 'Lỗi xuất Excel', description: err.message, color: 'error' }) }
}
</script>

<style>
@keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
.animate-blob { animation: blob 10s infinite; }
.animation-delay-2000 { animation-delay: 2s; }
@keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
