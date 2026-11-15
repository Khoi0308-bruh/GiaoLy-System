<template>
  <div class="min-h-screen font-sans text-stone-800 dark:text-stone-200 pb-20">
    <UContainer class="py-6 space-y-6">

      <!-- ═══════════════════════════════════════════════════════
           HEADER CARD: Chào mừng + Avatar + Ngày giờ + Actions
      ═══════════════════════════════════════════════════════ -->
      <div class="animate-fade-in-cards bg-gradient-to-r from-marian-blue-900 to-marian-blue-700 dark:from-marian-blue-950 dark:to-marian-blue-900 rounded-2xl p-6 shadow-xl shadow-marian-blue-900/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 relative overflow-hidden">
        <!-- Trang trí nền -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
        <div class="absolute bottom-0 left-1/3 w-48 h-32 bg-amber-400/10 rounded-full translate-y-1/2 blur-2xl pointer-events-none" />

        <!-- Avatar + Thông tin -->
        <div class="flex items-center gap-4 z-10">
          <!-- Avatar chữ cái đầu -->
          <div class="w-14 h-14 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center flex-shrink-0 shadow-inner">
            <span class="text-xl font-black text-white">
              {{ (auth?.user?.name || 'A').charAt(0).toUpperCase() }}
            </span>
          </div>
          <div>
            <div class="flex items-center gap-2 mb-1 flex-wrap">
              <h1 class="text-xl font-black text-white leading-tight">
                Chào mừng, {{ auth?.user?.name || 'Trưởng' }}!
              </h1>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                {{ getRoleLabel(auth?.user?.role) }}
              </span>
            </div>
            <p class="text-sm text-white/60">
              Niên khóa:
              <span class="font-semibold text-amber-300">{{ activeYear?.name || 'Đang tải...' }}</span>
              &nbsp;·&nbsp;
              <span class="font-medium text-white/50">{{ currentDateTime }}</span>
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2 z-10 flex-wrap">
          <UButton
            v-if="auth?.hasPermission('students.manage')"
            icon="i-heroicons-document-arrow-up"
            label="Nạp Excel"
            color="white"
            variant="solid"
            size="sm"
            class="shadow-sm font-semibold"
            @click="isImportOpen = true"
          />
          <UButton
            v-if="auth?.hasPermission('announcements.manage')"
            icon="i-heroicons-megaphone"
            label="Đăng Tin"
            color="white"
            variant="soft"
            size="sm"
            class="bg-amber-400 hover:bg-amber-500 text-amber-900 border-0 font-bold shadow-md"
            @click="isNewsModalOpen = true"
          />
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════
           METRIC CARDS ROW (5 cards)
           Tổng đoàn sinh + 4 ngành
      ═══════════════════════════════════════════════════════ -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">

        <!-- Tổng Đoàn Sinh -->
        <div class="metric-card animate-fade-in-cards delay-100 col-span-2 md:col-span-1 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-marian-blue-50 dark:bg-marian-blue-950 flex items-center justify-center flex-shrink-0">
            <UIcon name="i-heroicons-users" class="w-6 h-6 text-marian-blue-600 dark:text-marian-blue-400" />
          </div>
          <div>
            <p class="section-label mb-1">Tổng Số</p>
            <div v-if="pending"><USkeleton class="w-14 h-7 rounded" /></div>
            <p v-else class="text-3xl font-black text-stone-900 dark:text-white leading-none">
              {{ students?.length || 0 }}
            </p>
            <p class="text-[10px] text-stone-400 mt-0.5">đoàn sinh</p>
          </div>
        </div>

        <!-- 4 Ngành -->
        <div
          v-for="(stat, index) in branchStats.filter(b => b.branch >= 1 && b.branch <= 4)"
          :key="stat.branch"
          :class="['metric-card animate-fade-in-cards flex items-center gap-4', `delay-${(index + 2) * 100}`]"
        >
          <div :class="[`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`, getBranchBgClass(stat.branch)]">
            <UIcon :name="getBranchIcon(stat.branch)" :class="['w-6 h-6', getBranchIconColor(stat.branch)]" />
          </div>
          <div>
            <p class="section-label mb-1 truncate">{{ getBranchName(stat.branch) }}</p>
            <div v-if="pending"><USkeleton class="w-10 h-7 rounded" /></div>
            <p v-else class="text-3xl font-black text-stone-900 dark:text-white leading-none">
              {{ stat.count }}
            </p>
            <p class="text-[10px] text-stone-400 mt-0.5">đoàn sinh</p>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════
           MAIN GRID: 3-col Left | 1-col Right
      ═══════════════════════════════════════════════════════ -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">

        <!-- ╔═══ CỘT TRÁI (3/4) ═══════════════════════════════ -->
        <div class="lg:col-span-3 space-y-6">

          <!-- ── 1. Tiến Độ Bí Tích: SVG Progress Rings ──────── -->
          <div class="animate-fade-in-cards delay-200 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl p-5 shadow-sm">
            <div class="flex justify-between items-center mb-5">
              <h3 class="section-label">Tiến Độ Bí Tích</h3>
              <div class="text-[10px] text-stone-400">{{ students?.length || 0 }} đoàn sinh</div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

              <!-- Ring: Rửa Tội -->
              <div class="flex items-center gap-4">
                <!-- SVG Progress Ring -->
                <div class="relative flex-shrink-0">
                  <svg width="72" height="72" viewBox="0 0 72 72">
                    <!-- Track -->
                    <circle cx="36" cy="36" r="28" fill="none" stroke="currentColor" stroke-width="6" class="text-stone-100 dark:text-stone-800" />
                    <!-- Progress -->
                    <circle
                      cx="36" cy="36" r="28"
                      fill="none" stroke="#3b82f6" stroke-width="6"
                      stroke-linecap="round"
                      :stroke-dasharray="`${175.93}`"
                      :stroke-dashoffset="`${175.93 * (1 - getBaptismRatio())}`"
                      class="progress-ring-circle"
                    />
                  </svg>
                  <!-- Phần trăm ở giữa -->
                  <span class="absolute inset-0 flex items-center justify-center text-xs font-black text-blue-600 dark:text-blue-400">
                    {{ Math.round(getBaptismRatio() * 100) }}%
                  </span>
                </div>
                <div>
                  <p class="font-bold text-stone-800 dark:text-white text-sm">Rửa Tội</p>
                  <p class="text-xs text-stone-500">
                    {{ students?.filter(s => s.baptismDate).length || 0 }}
                    /
                    {{ students?.length || 0 }}
                  </p>
                  <div class="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1 mt-2 overflow-hidden">
                    <div class="bg-blue-500 h-full rounded-full transition-all duration-700" :style="{ width: getPercentage(students?.filter(s => s.baptismDate).length, students?.length) }" />
                  </div>
                </div>
              </div>

              <!-- Ring: Rước Lễ -->
              <div class="flex items-center gap-4">
                <div class="relative flex-shrink-0">
                  <svg width="72" height="72" viewBox="0 0 72 72">
                    <circle cx="36" cy="36" r="28" fill="none" stroke="currentColor" stroke-width="6" class="text-stone-100 dark:text-stone-800" />
                    <circle
                      cx="36" cy="36" r="28"
                      fill="none" stroke="#f59e0b" stroke-width="6"
                      stroke-linecap="round"
                      :stroke-dasharray="`${175.93}`"
                      :stroke-dashoffset="`${175.93 * (1 - getCommunionRatio())}`"
                      class="progress-ring-circle"
                    />
                  </svg>
                  <span class="absolute inset-0 flex items-center justify-center text-xs font-black text-amber-600 dark:text-amber-400">
                    {{ Math.round(getCommunionRatio() * 100) }}%
                  </span>
                </div>
                <div>
                  <p class="font-bold text-stone-800 dark:text-white text-sm">Rước Lễ</p>
                  <p class="text-xs text-stone-500">
                    {{ students?.filter(s => s.communionDate).length || 0 }}
                    /
                    {{ students?.length || 0 }}
                  </p>
                  <div class="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1 mt-2 overflow-hidden">
                    <div class="bg-amber-500 h-full rounded-full transition-all duration-700" :style="{ width: getPercentage(students?.filter(s => s.communionDate).length, students?.length) }" />
                  </div>
                </div>
              </div>

              <!-- Ring: Thêm Sức -->
              <div class="flex items-center gap-4">
                <div class="relative flex-shrink-0">
                  <svg width="72" height="72" viewBox="0 0 72 72">
                    <circle cx="36" cy="36" r="28" fill="none" stroke="currentColor" stroke-width="6" class="text-stone-100 dark:text-stone-800" />
                    <circle
                      cx="36" cy="36" r="28"
                      fill="none" stroke="#ef4444" stroke-width="6"
                      stroke-linecap="round"
                      :stroke-dasharray="`${175.93}`"
                      :stroke-dashoffset="`${175.93 * (1 - getConfirmationRatio())}`"
                      class="progress-ring-circle"
                    />
                  </svg>
                  <span class="absolute inset-0 flex items-center justify-center text-xs font-black text-red-600 dark:text-red-400">
                    {{ Math.round(getConfirmationRatio() * 100) }}%
                  </span>
                </div>
                <div>
                  <p class="font-bold text-stone-800 dark:text-white text-sm">Thêm Sức</p>
                  <p class="text-xs text-stone-500">
                    {{ students?.filter(s => s.confirmationDate).length || 0 }}
                    /
                    {{ students?.length || 0 }}
                  </p>
                  <div class="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1 mt-2 overflow-hidden">
                    <div class="bg-red-500 h-full rounded-full transition-all duration-700" :style="{ width: getPercentage(students?.filter(s => s.confirmationDate).length, students?.length) }" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- ── 2. Bảng Danh Sách Đoàn Sinh Gần Đây ─────────── -->
          <div class="animate-fade-in-cards delay-300 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl shadow-sm overflow-hidden">
            <!-- Toolbar -->
            <div class="p-4 border-b border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-stone-50/50 dark:bg-stone-950/30">
              <h3 class="section-label">Danh Sách Đoàn Sinh Gần Đây</h3>
              <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <UInput
                  v-model="q"
                  icon="i-heroicons-magnifying-glass"
                  placeholder="Tìm kiếm..."
                  size="sm"
                  class="w-full sm:w-44"
                  :ui="{ base: 'shadow-none border-stone-200 dark:border-stone-700 rounded-xl' }"
                />
                <USelect
                  v-model="selectedBranch"
                  :options="branchFilterOptions"
                  size="sm"
                  class="w-full sm:w-32"
                  :ui="{ base: 'shadow-none border-stone-200 dark:border-stone-700 rounded-xl' }"
                />
                <UButton
                  v-if="auth?.hasPermission('students.manage')"
                  icon="i-heroicons-plus"
                  color="primary"
                  variant="solid"
                  size="sm"
                  class="rounded-xl"
                  @click="openCreateModal"
                />
              </div>
            </div>

            <!-- Table -->
            <UTable
              :rows="filteredRows.slice(0, 10)"
              :columns="columns"
              :loading="pending"
              :empty-state="{ icon: 'i-heroicons-users', header: 'Không tìm thấy hồ sơ' }"
              :ui="{
                th: { base: 'bg-stone-50 dark:bg-stone-950/50 text-[10px] uppercase font-black text-stone-400 tracking-wider py-3 border-b border-stone-100 dark:border-stone-800' },
                td: { base: 'py-2.5 border-b border-stone-50 dark:border-stone-800/40 whitespace-nowrap text-sm text-stone-600 dark:text-stone-300' },
                tr: { base: 'table-row-hover' }
              }"
            >
              <!-- Cell: Họ tên + Tên Thánh + Ngày sinh -->
              <template #fullName-cell="{ row }">
                <div class="flex items-center gap-3">
                  <!-- Avatar chữ cái đầu với màu theo ngành -->
                  <div :class="['w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black', getBranchAvatarClass(row.original.branch)]">
                    {{ row.original.fullName?.charAt(0) || '?' }}
                  </div>
                  <div class="flex flex-col">
                    <span class="font-semibold text-stone-900 dark:text-white text-sm">
                      <span class="text-marian-blue-500 text-xs mr-1">{{ row.original.holyName }}</span>{{ row.original.fullName }}
                    </span>
                    <span class="text-[10px] text-stone-400">{{ formatDate(row.original.birthDate) }}</span>
                  </div>
                </div>
              </template>

              <!-- Cell: Bí Tích Icons -->
              <template #sacraments-cell="{ row }">
                <div class="flex gap-2">
                  <UTooltip text="Rửa Tội">
                    <UIcon name="i-heroicons-beaker" :class="row.original.baptismDate ? 'w-4 h-4 text-blue-500' : 'w-4 h-4 text-stone-300 dark:text-stone-700'" />
                  </UTooltip>
                  <UTooltip text="Rước Lễ">
                    <UIcon name="i-heroicons-cake" :class="row.original.communionDate ? 'w-4 h-4 text-amber-500' : 'w-4 h-4 text-stone-300 dark:text-stone-700'" />
                  </UTooltip>
                  <UTooltip text="Thêm Sức">
                    <UIcon name="i-heroicons-fire" :class="row.original.confirmationDate ? 'w-4 h-4 text-red-500' : 'w-4 h-4 text-stone-300 dark:text-stone-700'" />
                  </UTooltip>
                </div>
              </template>

              <!-- Cell: Ngành badge -->
              <template #branch-cell="{ row }">
                <span :class="['text-[10px] font-bold px-2.5 py-1 rounded-full inline-block', getBranchBadgeClass(row.original.branch)]">
                  {{ getBranchName(row.original.branch) }}
                </span>
              </template>

              <!-- Cell: Lớp -->
              <template #className-cell="{ row }">
                <span class="text-stone-500 dark:text-stone-400">{{ row.original.className || '—' }}</span>
              </template>

              <!-- Cell: Actions -->
              <template #actions-cell="{ row }">
                <UDropdown
                  v-if="auth?.hasPermission('students.manage')"
                  :items="getStudentActions(row.original)"
                  :popper="{ placement: 'bottom-end' }"
                >
                  <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-heroicons-ellipsis-horizontal"
                    size="sm"
                    class="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg"
                  />
                </UDropdown>
              </template>
            </UTable>

            <!-- Table Footer -->
            <div class="p-3 border-t border-stone-100 dark:border-stone-800 flex justify-center bg-stone-50/50 dark:bg-stone-950/30">
              <UButton
                label="Xem toàn bộ hồ sơ →"
                color="primary"
                variant="ghost"
                size="sm"
                to="/admin/students"
                class="text-xs font-semibold"
              />
            </div>
          </div>

          <!-- ── 3. Quick Actions Grid ────────────────────────── -->
          <div class="animate-fade-in-cards delay-400 grid grid-cols-2 md:grid-cols-4 gap-3">
            <QuickActionCard
              icon="i-heroicons-user-plus"
              label="Thêm Đoàn Sinh"
              color="blue"
              @click="openCreateModal"
            />
            <QuickActionCard
              icon="i-heroicons-megaphone"
              label="Đăng Thông Báo"
              color="amber"
              @click="isNewsModalOpen = true"
            />
            <QuickActionCard
              icon="i-heroicons-document-arrow-up"
              label="Nạp Excel"
              color="emerald"
              @click="isImportOpen = true"
            />
            <QuickActionCard
              icon="i-heroicons-calendar-days"
              label="Lịch Phụng Vụ"
              color="purple"
              to="/admin/liturgical"
            />
          </div>
        </div>

        <!-- ╔═══ CỘT PHẢI (1/4) ════════════════════════════════ -->
        <div class="space-y-5">

          <!-- Widget: Hôm Nay (Lịch Phụng Vụ) -->
          <div class="animate-fade-in-cards delay-200 data-card">
            <div class="flex justify-between items-center mb-3">
              <h3 class="section-label">Hôm Nay</h3>
              <UButton
                icon="i-heroicons-arrow-top-right-on-square"
                color="neutral"
                variant="ghost"
                size="2xs"
                class="opacity-40 hover:opacity-80"
                to="/admin/liturgical"
              />
            </div>

            <div v-if="liturgicalToday" class="space-y-2">
              <p class="text-[10px] font-bold text-stone-400 uppercase">{{ liturgicalToday.date }}</p>
              <h4 class="font-bold text-sm text-stone-900 dark:text-white leading-snug">
                {{ liturgicalToday.feastName }}
              </h4>
              <!-- Màu phụng vụ -->
              <div class="flex items-center gap-2 mt-2 p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50">
                <span :class="['w-3 h-3 rounded-full flex-shrink-0', getColorDot(liturgicalToday.liturgicalColor)]" />
                <span class="text-xs text-stone-500 font-medium">
                  Màu {{ liturgicalToday.liturgicalColorVi }}
                </span>
              </div>
              <!-- Thánh quan thầy nếu có -->
              <p v-if="liturgicalToday.saintName" class="text-[11px] text-stone-400 italic">
                Thánh {{ liturgicalToday.saintName }}
              </p>
            </div>
            <div v-else class="text-xs text-stone-400 text-center py-4">
              <USkeleton class="h-4 w-full mb-2 rounded" />
              <USkeleton class="h-4 w-3/4 mx-auto rounded" />
            </div>
          </div>

          <!-- Widget: Bảng Tin Thông Báo -->
          <div class="animate-fade-in-cards delay-300 data-card flex flex-col h-[300px]">
            <div class="flex justify-between items-center mb-3 shrink-0">
              <h3 class="section-label">Bảng Tin</h3>
              <UButton
                v-if="auth?.hasPermission('announcements.manage')"
                icon="i-heroicons-arrow-top-right-on-square"
                color="neutral"
                variant="ghost"
                size="2xs"
                class="opacity-40 hover:opacity-80"
                to="/admin/announcements"
              />
            </div>

            <div class="flex-1 overflow-y-auto pr-1 space-y-2 scrollbar-thin">
              <div v-if="announcements?.length === 0" class="text-xs text-stone-400 text-center py-6">
                Chưa có thông báo.
              </div>

              <div
                v-for="news in announcements?.slice(0, 5)"
                :key="news.id"
                class="news-card-hover p-2.5 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 relative group"
              >
                <!-- Dot chỉ báo loại -->
                <div
                  :class="[
                    'absolute top-3.5 left-3 w-1.5 h-1.5 rounded-full',
                    news.type === 1 ? 'bg-red-500 animate-pulse' :
                    news.type === 2 ? 'bg-amber-500' : 'bg-blue-500'
                  ]"
                />
                <div class="pl-4">
                  <div class="flex justify-between items-start gap-2 mb-1">
                    <h5 class="text-xs font-semibold text-stone-800 dark:text-stone-200 leading-tight line-clamp-2">
                      {{ news.title }}
                    </h5>
                    <span class="text-[9px] text-stone-400 shrink-0">{{ formatDateShort(news.createdDate) }}</span>
                  </div>
                  <div class="flex items-center gap-1.5 mt-1.5">
                    <span :class="['text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase', getBranchBadgeClass(news.branch)]">
                      {{ getBranchName(news.branch) }}
                    </span>
                    <UButton
                      v-if="auth?.hasPermission('announcements.manage')"
                      icon="i-heroicons-trash"
                      color="error"
                      variant="ghost"
                      size="2xs"
                      class="opacity-0 group-hover:opacity-100 ml-auto h-4 min-h-0"
                      @click="deleteAnnouncement(news.id)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Widget: Sinh Nhật Tháng Này -->
          <div class="animate-fade-in-cards delay-400 data-card">
            <h3 class="section-label mb-3">🎂 Sinh Nhật Tháng Này</h3>

            <div v-if="upcomingBirthdays.length" class="space-y-2.5">
              <div
                v-for="student in upcomingBirthdays"
                :key="student.id"
                class="flex items-center justify-between gap-2"
              >
                <!-- Avatar -->
                <div class="flex items-center gap-2 min-w-0">
                  <div :class="['w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black', getBranchAvatarClass(student.branch)]">
                    {{ student.fullName?.charAt(0) || '?' }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-semibold text-stone-800 dark:text-stone-200 leading-none truncate">
                      {{ student.holyName }} {{ student.fullName }}
                    </p>
                    <p class="text-[9px] text-stone-400 mt-0.5">{{ getBranchName(student.branch) }}</p>
                  </div>
                </div>
                <!-- Ngày sinh -->
                <div class="text-[10px] font-bold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-lg border border-stone-200 dark:border-stone-700 whitespace-nowrap flex-shrink-0">
                  {{ formatDateShort(student.birthDate) }}
                </div>
              </div>
            </div>
            <div v-else class="text-xs text-stone-400 text-center py-4">
              Không có sinh nhật tháng này.
            </div>
          </div>

        </div>
      </div>
    </UContainer>

    <!-- ═══════════════════════════════════════════════════════
         MODALS (Student Edit, News, Excel) - Giữ nguyên Logic
    ═══════════════════════════════════════════════════════ -->

    <!-- Modal Student: Thêm / Cập nhật hồ sơ -->
    <UModal v-model:open="isOpen" :ui="{ base: 'rounded-2xl' }">
      <UCard
        :ui="{
          body: { padding: 'p-0' },
          header: { padding: 'p-5 border-b border-stone-200 dark:border-stone-800' },
          footer: { padding: 'p-5 bg-stone-50 dark:bg-stone-900/50 border-t border-stone-200 dark:border-stone-800' }
        }"
        class="border border-stone-200 dark:border-stone-800 shadow-2xl"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-marian-blue-100 dark:bg-marian-blue-900 flex items-center justify-center">
                <UIcon name="i-heroicons-user-plus" class="w-4 h-4 text-marian-blue-600 dark:text-marian-blue-400" />
              </div>
              <h3 class="font-bold text-stone-900 dark:text-white">{{ isEditing ? 'Cập Nhật Hồ Sơ' : 'Thêm Hồ Sơ Mới' }}</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" size="sm" @click="isOpen = false" />
          </div>
        </template>

        <form id="student-form" class="p-5 grid grid-cols-1 md:grid-cols-2 gap-5" @submit.prevent="submitForm">
          <div class="space-y-4">
            <p class="section-label border-b border-stone-100 dark:border-stone-800 pb-1">Cá Nhân</p>
            <UFormField label="Tên Thánh" required>
              <UInput v-model="form.holyName" class="w-full" size="sm" :ui="{ base: 'shadow-none rounded-xl' }" />
            </UFormField>
            <UFormField label="Họ và Tên" required>
              <UInput v-model="form.fullName" class="w-full" size="sm" :ui="{ base: 'shadow-none rounded-xl' }" />
            </UFormField>
            <UFormField label="Ngày sinh">
              <UInput v-model="form.birthDate" type="date" class="w-full" size="sm" :ui="{ base: 'shadow-none rounded-xl' }" />
            </UFormField>
            <UFormField label="Ngành Phụ Trách" required>
              <USelect v-model="form.branch" :options="branchOptions" class="w-full" size="sm" :ui="{ base: 'shadow-none rounded-xl' }" />
            </UFormField>
            <UFormField label="Lớp học">
              <UInput v-model="form.className" class="w-full" size="sm" :ui="{ base: 'shadow-none rounded-xl' }" />
            </UFormField>
          </div>
          <div class="space-y-4">
            <p class="section-label border-b border-stone-100 dark:border-stone-800 pb-1">Bí Tích</p>
            <UFormField label="Rửa Tội">
              <UInput v-model="form.baptismDate" type="date" class="w-full" size="sm" :ui="{ base: 'shadow-none rounded-xl' }" />
            </UFormField>
            <UFormField label="Rước Lễ">
              <UInput v-model="form.communionDate" type="date" class="w-full" size="sm" :ui="{ base: 'shadow-none rounded-xl' }" />
            </UFormField>
            <UFormField label="Thêm Sức">
              <UInput v-model="form.confirmationDate" type="date" class="w-full" size="sm" :ui="{ base: 'shadow-none rounded-xl' }" />
            </UFormField>
          </div>
        </form>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton label="Hủy bỏ" color="neutral" variant="soft" size="sm" class="rounded-xl" @click="isOpen = false" />
            <UButton
              type="submit"
              form="student-form"
              :label="isEditing ? 'Cập Nhật' : 'Tạo Mới'"
              color="primary"
              variant="solid"
              size="sm"
              class="rounded-xl font-bold"
              :loading="isSubmitting"
            />
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Modal Excel: Nạp dữ liệu hàng loạt -->
    <UModal v-model:open="isImportOpen" :ui="{ base: 'rounded-2xl' }">
      <UCard
        :ui="{
          body: { padding: 'p-5' },
          header: { padding: 'p-5 border-b border-stone-200 dark:border-stone-800' }
        }"
        class="border border-stone-200 dark:border-stone-800 shadow-2xl"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-document-arrow-up" class="w-4 h-4 text-emerald-600" />
              </div>
              <h3 class="font-bold text-stone-900 dark:text-white">Nạp Dữ Liệu Excel</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" size="sm" @click="isImportOpen = false; importResult = null" />
          </div>
        </template>
        <div class="space-y-4">
          <div v-if="importResult" class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 text-sm">
            <p class="font-semibold text-emerald-700 dark:text-emerald-400">
              ✓ Thành công! Đã thêm {{ importResult.count }} hồ sơ.
            </p>
          </div>
          <UFormField label="Chọn file Excel (.xlsx)" required>
            <UInput
              :key="excelInputKey"
              type="file"
              accept=".xlsx,.xls"
              class="w-full"
              size="sm"
              :ui="{ base: 'shadow-none rounded-xl' }"
              @change="onFileChange"
            />
          </UFormField>
          <UButton
            label="Nạp dữ liệu"
            color="primary"
            size="sm"
            class="w-full justify-center rounded-xl font-bold"
            :loading="isUploading"
            :disabled="!excelFile"
            @click="uploadExcel"
          />
        </div>
      </UCard>
    </UModal>

    <!-- Modal Tin Tức: Đăng thông báo mới -->
    <UModal v-model:open="isNewsModalOpen" :ui="{ base: 'rounded-2xl' }">
      <UCard
        :ui="{
          body: { padding: 'p-5' },
          header: { padding: 'p-5 border-b border-stone-200 dark:border-stone-800' }
        }"
        class="border border-stone-200 dark:border-stone-800 shadow-2xl"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-megaphone" class="w-4 h-4 text-amber-600" />
              </div>
              <h3 class="font-bold text-stone-900 dark:text-white">Đăng Thông Báo Mới</h3>
            </div>
            <UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" size="sm" @click="isNewsModalOpen = false" />
          </div>
        </template>
        <div class="space-y-4">
          <UFormField label="Tiêu đề">
            <UInput v-model="newsForm.title" placeholder="Tiêu đề thông báo" size="sm" :ui="{ base: 'shadow-none rounded-xl' }" />
          </UFormField>
          <UFormField label="Phạm vi">
            <USelect
              v-model="newsForm.branch"
              :options="[{ value: 0, label: 'Toàn đoàn' }, ...branchOptions]"
              size="sm"
              :ui="{ base: 'shadow-none rounded-xl' }"
            />
          </UFormField>
          <UFormField label="Nội dung">
            <UTextarea v-model="newsForm.content" autoresize :ui="{ base: 'shadow-none rounded-xl' }" />
          </UFormField>
          <UCheckbox v-model="newsForm.isUrgent" label="Tin khẩn cấp" />
          <UButton
            label="Đăng tin"
            color="primary"
            size="sm"
            class="w-full justify-center mt-2 rounded-xl font-bold"
            @click="submitNews"
          />
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

// ── Quick Action Card: component nhỏ nội tuyến ──
const QuickActionCard = defineComponent({
  props: { icon: String, label: String, color: String, to: String },
  emits: ['click'],
  setup(props, { emit }) {
    const colorMap = {
      blue:   'bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/60 text-blue-600 dark:text-blue-400',
      amber:  'bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-amber-600 dark:text-amber-400',
      emerald:'bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
      purple: 'bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-950/60 text-purple-600 dark:text-purple-400',
    }
    const cls = computed(() => colorMap[props.color] || colorMap.blue)

    return () => {
      const inner = [
        h(resolveComponent('UIcon'), { name: props.icon, class: 'w-7 h-7 mb-2' }),
        h('p', { class: 'text-xs font-bold text-center leading-tight' }, props.label)
      ]
      const wrapperClass = `p-4 rounded-2xl flex flex-col items-center justify-center cursor-pointer border border-transparent hover:border-current/20 transition-all duration-200 hover:-translate-y-0.5 shadow-sm ${cls.value}`

      if (props.to) {
        return h(resolveComponent('NuxtLink'), { to: props.to, class: wrapperClass }, { default: () => inner })
      }
      return h('div', { class: wrapperClass, onClick: () => emit('click') }, inner)
    }
  }
})

// ── Ngày giờ hiện tại ──
const currentDateTime = ref('')
const updateTime = () => {
  currentDateTime.value = new Date().toLocaleString('vi-VN', {
    weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}
updateTime()
onMounted(() => { setInterval(updateTime, 60000) })

// ── Niên khóa ──
const { data: academicYears } = await useApiFetch('/AcademicYear', { default: () => [] })
const activeYear = computed(() => academicYears.value?.find(y => y.isActive) || null)

// ── Students & Stats ──
const { data: students, pending, refresh: refreshStudents } = await useApiFetch('/Student', { default: () => [] })

const branchStats = computed(() => {
  const branches = [1, 2, 3, 4]
  return branches.map(b => ({
    branch: b,
    count: students.value?.filter(s => s.branch === b).length || 0
  }))
})

// ── Announcements ──
const { data: announcements, refresh: refreshNews } = await useApiFetch('/Announcement')

// ── Liturgical ──
const { data: liturgicalToday } = await useApiFetch('/Liturgical/today')

// ── Birthdays this month ──
const upcomingBirthdays = computed(() => {
  if (!students.value) return []
  const thisMonth = new Date().getMonth()
  return students.value.filter(s => {
    if (!s.birthDate) return false
    return new Date(s.birthDate).getMonth() === thisMonth
  }).slice(0, 5)
})

// ── Search Table ──
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

// ── Modal CRUD Student ──
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

// ── Modal Excel ──
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

// ── Modal News ──
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

// ── Helpers ──
const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('vi-VN') : '---'
const formatDateShort = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : ''
const getPercentage = (num, total) => total ? `${(num / total) * 100}%` : '0%'

// Tỉ lệ cho progress rings
const getBaptismRatio = () => {
  const count = students.value?.filter(s => s.baptismDate).length || 0
  const total = students.value?.length || 0
  return total ? count / total : 0
}
const getCommunionRatio = () => {
  const count = students.value?.filter(s => s.communionDate).length || 0
  const total = students.value?.length || 0
  return total ? count / total : 0
}
const getConfirmationRatio = () => {
  const count = students.value?.filter(s => s.confirmationDate).length || 0
  const total = students.value?.length || 0
  return total ? count / total : 0
}

// Tên ngành
const getBranchName = (id) => ({ 1: 'Ấu Nhi', 2: 'Thiếu Nhi', 3: 'Nghĩa Sĩ', 4: 'Hiệp Sĩ' }[id] || 'Chung')

// Icon ngành
const getBranchIcon = (id) => ({
  1: 'i-heroicons-heart',
  2: 'i-heroicons-face-smile',
  3: 'i-heroicons-academic-cap',
  4: 'i-heroicons-fire'
}[id] || 'i-heroicons-user')

// Màu nền icon ngành (metric card)
const getBranchBgClass = (id) => ({
  1: 'bg-pink-50 dark:bg-pink-950/30',
  2: 'bg-blue-50 dark:bg-blue-950/30',
  3: 'bg-emerald-50 dark:bg-emerald-950/30',
  4: 'bg-red-50 dark:bg-red-950/30'
}[id] || 'bg-stone-100 dark:bg-stone-800')

// Màu icon ngành
const getBranchIconColor = (id) => ({
  1: 'text-pink-500 dark:text-pink-400',
  2: 'text-blue-500 dark:text-blue-400',
  3: 'text-emerald-500 dark:text-emerald-400',
  4: 'text-red-500 dark:text-red-400'
}[id] || 'text-stone-400')

// Badge ngành
const getBranchBadgeClass = (id) => ({
  1: 'badge-aunhi',
  2: 'badge-thieunhi',
  3: 'badge-nghiasi',
  4: 'badge-hiepsi',
  0: 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700'
}[id] || 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700')

// Avatar màu theo ngành
const getBranchAvatarClass = (id) => ({
  1: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
  2: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  3: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  4: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
}[id] || 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400')

// Màu chấm phụng vụ
const getColorDot = (color) => {
  const c = color?.toLowerCase()
  if (c === 'red') return 'liturgical-dot-red'
  if (c === 'purple') return 'liturgical-dot-purple'
  if (c === 'white') return 'liturgical-dot-white'
  if (c === 'rose') return 'liturgical-dot-rose'
  if (c === 'black') return 'liturgical-dot-black'
  return 'liturgical-dot-green'
}

// Label vai trò
const getRoleLabel = (r) => ({ 1: 'Admin', 2: 'Thư Ký', 3: 'Mod' }[r] || 'Trưởng')
</script>
