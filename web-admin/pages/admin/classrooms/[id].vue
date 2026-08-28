<template>
  <UContainer class="py-10 space-y-8">
    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 text-sm text-stone-500">
      <NuxtLink
        to="/admin/academic-years"
        class="hover:text-primary-500 transition-colors"
      >
        Niên Khóa
      </NuxtLink>
      <UIcon
        name="i-heroicons-chevron-right"
        class="w-4 h-4"
      />
      <NuxtLink
        :to="`/admin/academic-years/${classRoom?.academicYearId}`"
        class="hover:text-primary-500 transition-colors"
      >
        Lớp Học
      </NuxtLink>
      <UIcon
        name="i-heroicons-chevron-right"
        class="w-4 h-4"
      />
      <span class="font-semibold text-stone-800 dark:text-white">{{ classRoom?.className ?? 'Lớp học' }}</span>
    </div>

    <!-- Classroom Header Widget -->
    <div class="glass-card rounded-2xl p-6 border border-white/20 dark:border-stone-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="space-y-2 relative z-10">
        <div class="flex items-center gap-3 flex-wrap">
          <span class="text-xs font-bold text-stone-400 uppercase tracking-widest">Chi tiết lớp học</span>
          <UBadge
            :label="`Ngành ${getBranchName(classRoom?.branch)}`"
            :color="getBranchColor(classRoom?.branch)"
            variant="solid"
            size="xs"
          />
        </div>
        <h1 class="text-3xl font-black text-stone-800 dark:text-white">
          {{ classRoom?.className }}
        </h1>
        <div class="flex items-center gap-6 text-sm text-stone-500 flex-wrap">
          <span class="flex items-center gap-1.5">
            <UIcon
              name="i-heroicons-user"
              class="text-primary-500 w-4 h-4"
            />
            GLV Chủ nhiệm: <strong class="text-stone-700 dark:text-stone-300">{{ classRoom?.mainTeacher || 'Chưa phân công' }}</strong>
          </span>
          <span
            v-if="classRoom?.roomName"
            class="flex items-center gap-1.5"
          >
            <UIcon
              name="i-heroicons-map-pin"
              class="text-amber-500 w-4 h-4"
            />
            Phòng học: <strong class="text-stone-700 dark:text-stone-300">{{ classRoom?.roomName }}</strong>
          </span>
        </div>
      </div>

      <div class="flex gap-2 flex-shrink-0 relative z-10">
        <UButton
          v-if="activeTab === 'students'"
          icon="i-heroicons-user-plus"
          label="Xếp Lớp Hàng Loạt"
          color="primary"
          @click="openEnrollModal"
        />
        <div
          v-else
          class="flex gap-2"
        >
          <UButton
            icon="i-heroicons-document-arrow-down"
            label="Xuất Excel"
            color="neutral"
            variant="soft"
            @click="exportGrades"
          />
          <UButton
            icon="i-heroicons-printer"
            label="In PDF"
            color="rose"
            variant="soft"
            @click="exportGradesPdf"
          />
          <div class="flex items-center justify-end px-2">
            <span
              v-if="saveStatus === 'saving'"
              class="text-xs font-bold text-amber-500 flex items-center gap-1"
            ><UIcon
              name="i-heroicons-arrow-path"
              class="w-4 h-4 animate-spin"
            /> Đang lưu...</span>
            <span
              v-else-if="saveStatus === 'saved'"
              class="text-xs font-bold text-emerald-500 flex items-center gap-1"
            ><UIcon
              name="i-heroicons-check-circle"
              class="w-4 h-4"
            /> Đã lưu tự động</span>
            <span
              v-else-if="saveStatus === 'error'"
              class="text-xs font-bold text-red-500 flex items-center gap-1"
            ><UIcon
              name="i-heroicons-x-circle"
              class="w-4 h-4"
            /> Lỗi lưu</span>
          </div>
          <UButton
            icon="i-heroicons-check-circle"
            label="Force Save"
            color="primary"
            variant="outline"
            :loading="isSavingGrades"
            @click="saveGrades"
          />
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex border-b border-stone-200 dark:border-stone-850 gap-6 overflow-x-auto">
      <button
        class="pb-3 text-sm font-extrabold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap"
        :class="activeTab === 'students' ? 'border-primary-500 text-primary-500' : 'border-transparent text-stone-400 hover:text-stone-600'"
        @click="activeTab = 'students'"
      >
        Danh Sách Đoàn Sinh
      </button>
      <button
        class="pb-3 text-sm font-extrabold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap"
        :class="activeTab === 'grades' ? 'border-primary-500 text-primary-500' : 'border-transparent text-stone-400 hover:text-stone-600'"
        @click="activeTab = 'grades'"
      >
        Sổ Điểm &amp; Chuyên Cần
      </button>
      <button
        class="pb-3 text-sm font-extrabold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap"
        :class="activeTab === 'contacts' ? 'border-primary-500 text-primary-500' : 'border-transparent text-stone-400 hover:text-stone-600'"
        @click="activeTab = 'contacts'"
      >
        Sổ Liên Lạc
      </button>
      <button
        class="pb-3 text-sm font-extrabold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap"
        :class="activeTab === 'log' ? 'border-primary-500 text-primary-500' : 'border-transparent text-stone-400 hover:text-stone-600'"
        @click="activeTab = 'log'"
      >
        Nhật Ký Lớp
      </button>
    </div>

    <!-- Tab Content -->
    <div class="space-y-6">
      <!-- TAB 1: STUDENTS LIST -->
      <div
        v-if="activeTab === 'students'"
        class="space-y-4"
      >
        <h3 class="text-xl font-bold flex items-center gap-2">
          <UIcon
            name="i-heroicons-users"
            class="text-primary-500"
          />
          Danh Sách Đoàn Sinh ({{ enrollments.length }} em)
        </h3>

        <div
          v-if="pendingEnrollments"
          class="flex flex-col gap-4 py-8 max-w-2xl mx-auto"
        >
          <div v-for="i in 5" :key="i" class="flex items-center gap-4 animate-pulse">
            <USkeleton class="h-12 w-12 rounded-full" />
            <div class="space-y-2 flex-1">
              <USkeleton class="h-4 w-1/3" />
              <USkeleton class="h-3 w-1/4" />
            </div>
            <USkeleton class="h-8 w-24 rounded-lg" />
          </div>
        </div>

        <UCard
          v-else-if="enrollments.length === 0"
          class="text-center py-16 glass-card"
        >
          <UIcon
            name="i-heroicons-user-minus"
            class="w-12 h-12 mx-auto mb-3 text-stone-300 dark:text-stone-700"
          />
          <p class="text-stone-400">
            Lớp học này chưa có đoàn sinh nào được xếp vào.
          </p>
          <UButton
            label="Xếp đoàn sinh ngay"
            color="primary"
            variant="soft"
            class="mt-4"
            @click="openEnrollModal"
          />
        </UCard>

        <UCard
          v-else
          class="glass-card overflow-hidden"
        >
          <UTable
            :data="enrollments"
            :columns="columns"
          >
            <!-- Student full name with Holy name -->
            <template #fullName-cell="{ row }">
              <div class="font-bold text-stone-800 dark:text-white">
                <span class="text-primary-500 font-semibold mr-1">{{ row.original.student?.holyName }}</span>
                {{ row.original.student?.fullName }}
              </div>
            </template>

            <!-- Birthday cell -->
            <template #birthDate-cell="{ row }">
              {{ formatDate(row.original.student?.birthDate) }}
            </template>

            <!-- Sacrament Status Badges -->
            <template #sacraments-cell="{ row }">
              <div class="flex gap-1">
                <UBadge
                  label="Rửa Tội"
                  :color="row.original.student?.baptismDate ? 'success' : 'neutral'"
                  variant="subtle"
                  size="xs"
                />
                <UBadge
                  label="Rước Lễ"
                  :color="row.original.student?.communionDate ? 'success' : 'neutral'"
                  variant="subtle"
                  size="xs"
                />
                <UBadge
                  label="Thêm Sức"
                  :color="row.original.student?.confirmationDate ? 'success' : 'neutral'"
                  variant="subtle"
                  size="xs"
                />
              </div>
            </template>

            <!-- Unenroll action -->
            <template #actions-cell="{ row }">
              <UButton
                icon="i-heroicons-user-minus"
                color="red"
                variant="ghost"
                size="xs"
                label="Rút khỏi lớp"
                @click="unenrollStudent(row.original.id)"
              />
            </template>
          </UTable>
        </UCard>
      </div>

      <!-- TAB 2: GRADES SHEET -->
      <div
        v-else-if="activeTab === 'grades'"
        class="space-y-4"
      >
        <h3 class="text-xl font-bold flex items-center gap-2">
          <UIcon
            name="i-heroicons-academic-cap"
            class="text-primary-500"
          />
          Sổ Điểm Điện Tử Lớp Học
        </h3>

        <!-- Thống kê tổng quan lớp học -->
        <div
          v-if="gradesList.length"
          class="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div class="glass-card rounded-xl p-4 text-center">
            <p class="text-xs text-stone-400 font-bold uppercase">
              Tổng Học Sinh
            </p>
            <p class="text-3xl font-black text-stone-800 dark:text-white mt-1">
              {{ gradesList.length }}
            </p>
          </div>
          <div class="glass-card rounded-xl p-4 text-center">
            <p class="text-xs text-emerald-500 font-bold uppercase">
              Đạt / Lên Lớp
            </p>
            <p class="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {{ gradesList.filter(g => checkQualified(g)).length }}
            </p>
          </div>
          <div class="glass-card rounded-xl p-4 text-center">
            <p class="text-xs text-red-400 font-bold uppercase">
              Học Lại
            </p>
            <p class="text-3xl font-black text-red-500 mt-1">
              {{ gradesList.filter(g => !checkQualified(g)).length }}
            </p>
          </div>
          <div class="glass-card rounded-xl p-4 text-center">
            <p class="text-xs text-amber-500 font-bold uppercase">
              ĐTB Trung Bình Lớp
            </p>
            <p class="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {{ gradesList.length ? (gradesList.reduce((sum, g) => sum + calculateGPA(g), 0) / gradesList.length).toFixed(1) : '0.0' }}
            </p>
          </div>
        </div>

        <div
          v-if="!gradesList.length"
          class="text-center py-20 glass-card rounded-2xl"
        >
          <UIcon
            name="i-heroicons-inbox"
            class="w-12 h-12 mx-auto mb-2 text-stone-300"
          />
          <p class="text-stone-400 italic">
            Lớp học chưa có đoàn sinh nào để nhập điểm.
          </p>
        </div>

        <div
          v-else
          class="overflow-x-auto border border-stone-200 dark:border-stone-850 rounded-2xl shadow-xl"
        >
          <table class="w-full text-left border-collapse bg-white dark:bg-stone-900">
            <thead>
              <tr class="bg-stone-50 dark:bg-stone-950 text-xs font-black uppercase text-stone-500 tracking-wider border-b border-stone-200 dark:border-stone-850">
                <th class="p-4">
                  Đoàn Sinh
                </th>
                <th class="p-4 text-center w-20">
                  Miệng
                </th>
                <th class="p-4 text-center w-20">
                  15 Phút
                </th>
                <th class="p-4 text-center w-20">
                  1 Tiết (x2)
                </th>
                <th class="p-4 text-center w-20">
                  Học Kỳ (x3)
                </th>
                <th class="p-4 text-center w-24">
                  Vắng
                </th>
                <th class="p-4 text-center w-24">
                  Tổng Buổi
                </th>
                <th class="p-4 text-center w-20">
                  ĐTB
                </th>
                <th class="p-4 text-center w-28">
                  Trạng Thái
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100 dark:divide-stone-850 text-sm">
              <tr
                v-for="grade in gradesList"
                :key="grade.studentId"
                :class="[
                  'transition-colors',
                  checkQualified(grade) ? 'hover:bg-stone-50/50 dark:hover:bg-stone-850/30' : 'bg-red-50/40 dark:bg-red-950/10 hover:bg-red-50/60'
                ]"
              >
                <!-- Student Name -->
                <td class="p-4">
                  <div class="font-bold text-stone-800 dark:text-white">
                    <span class="text-primary-500 font-semibold mr-1">{{ grade.studentHolyName }}</span>
                    {{ grade.studentFullName }}
                  </div>
                </td>

                <!-- Oral Score -->
                <td class="p-2 text-center">
                  <input
                    v-model.number="grade.oral"
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    class="w-16 p-1 text-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                    @input="onGradeInput"
                  >
                </td>

                <!-- 15m Score -->
                <td class="p-2 text-center">
                  <input
                    v-model.number="grade.smallTest"
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    class="w-16 p-1 text-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                    @input="onGradeInput"
                  >
                </td>

                <!-- 1 Period Score -->
                <td class="p-2 text-center">
                  <input
                    v-model.number="grade.bigTest"
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    class="w-16 p-1 text-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                    @input="onGradeInput"
                  >
                </td>

                <!-- Final Exam Score -->
                <td class="p-2 text-center">
                  <input
                    v-model.number="grade.finalExam"
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    class="w-16 p-1 text-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                    @input="onGradeInput"
                  >
                </td>

                <!-- Absences -->
                <td class="p-2 text-center">
                  <input
                    v-model.number="grade.absences"
                    type="number"
                    min="0"
                    max="50"
                    class="w-16 p-1 text-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                    @input="onGradeInput"
                  >
                </td>

                <!-- Total Sessions -->
                <td class="p-2 text-center">
                  <input
                    v-model.number="grade.totalSessions"
                    type="number"
                    min="1"
                    max="100"
                    class="w-16 p-1 text-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                    @input="onGradeInput"
                  >
                </td>

                <!-- Computed GPA -->
                <td
                  class="p-4 text-center font-black text-sm"
                  :class="calculateGPA(grade) >= 5.0 ? 'text-emerald-500' : 'text-red-500'"
                >
                  {{ calculateGPA(grade) }}
                </td>

                <!-- Promotion Status -->
                <td class="p-4 text-center">
                  <UBadge
                    v-if="checkQualified(grade)"
                    label="LÊN LỚP"
                    color="success"
                    variant="solid"
                    size="xs"
                    class="font-black tracking-wider"
                  />
                  <UBadge
                    v-else
                    label="HỌC LẠI"
                    color="error"
                    variant="solid"
                    size="xs"
                    class="font-black tracking-wider animate-pulse"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 3: SỔ̉ LIÊN LẠC -->
      <div v-else-if="activeTab === 'contacts'" class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold flex items-center gap-2">
            <UIcon name="i-heroicons-envelope" class="text-primary-500" />
            Sổ Liên Lạc Điện Tử
          </h3>
          <UButton
            icon="i-heroicons-document-arrow-down"
            label="Xuất PDF Toàn Lớp"
            color="rose"
            variant="soft"
            @click="exportContactBookPdf"
          />
        </div>
        <p class="text-xs text-stone-400 italic">Nhập nhận xét cuối kỳ và xếp loại Hạnh kiểm cho từng đoàn sinh. Dữ liệu sẽ tự động lưu khi bạn rời khỏi ô nhập.</p>

        <div v-if="!gradesList.length" class="text-center py-16 glass-card rounded-2xl">
          <UIcon name="i-heroicons-inbox" class="w-12 h-12 mx-auto mb-2 text-stone-300" />
          <p class="text-stone-400 italic">Lớp học chưa có đoàn sinh nào để viết sổ liên lạc.</p>
        </div>

        <div v-else class="overflow-x-auto border border-stone-200 dark:border-stone-850 rounded-2xl shadow-xl">
          <table class="w-full text-left border-collapse bg-white dark:bg-stone-900">
            <thead>
              <tr class="bg-stone-50 dark:bg-stone-950 text-xs font-black uppercase text-stone-500 tracking-wider border-b border-stone-200 dark:border-stone-850">
                <th class="p-4">Đoàn Sinh</th>
                <th class="p-4 text-center w-32">ĐTB Học Tập</th>
                <th class="p-4 text-center w-36">Hạnh Kiểm</th>
                <th class="p-4">Nhận Xét của Huynh Trưởng</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100 dark:divide-stone-850 text-sm">
              <tr v-for="grade in gradesList" :key="grade.studentId" class="hover:bg-stone-50/50 dark:hover:bg-stone-850/30 transition-colors">
                <td class="p-4">
                  <div class="font-bold text-stone-800 dark:text-white">
                    <span class="text-primary-500 font-semibold mr-1">{{ grade.studentHolyName }}</span>
                    {{ grade.studentFullName }}
                  </div>
                </td>
                <td class="p-4 text-center">
                  <span :class="['text-xl font-black', calculateGPA(grade) >= 8 ? 'text-emerald-500' : calculateGPA(grade) >= 5 ? 'text-amber-500' : 'text-red-500']">
                    {{ calculateGPA(grade) }}
                  </span>
                </td>
                <td class="p-3 text-center">
                  <select
                    v-model="grade.conduct"
                    class="w-full p-1.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                    @change="onGradeInput"
                  >
                    <option value="">-- Chọn --</option>
                    <option value="excellent">Tốt</option>
                    <option value="good">Khá</option>
                    <option value="average">Trung Bình</option>
                    <option value="poor">Yếu</option>
                  </select>
                </td>
                <td class="p-3">
                  <textarea
                    v-model="grade.teacherRemark"
                    rows="2"
                    placeholder="Nhận xét cá nhân..."
                    class="w-full p-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white resize-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                    @input="onGradeInput"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 4: NHẬT KÝ LớP -->
      <div v-else-if="activeTab === 'log'" class="space-y-4">
        <h3 class="text-xl font-bold flex items-center gap-2">
          <UIcon name="i-heroicons-clipboard-document-list" class="text-primary-500" />
          Nhật Ký Lớp
        </h3>
        <p class="text-xs text-stone-400 italic">Ghi chép nội bộ cho lớp học — dùng làm tư liệu khi viết nhận xét Sổ Liên Lạc cuối kỳ.</p>

        <!-- Input vùng ghi chú mới -->
        <UCard class="glass-card">
          <div class="space-y-3">
            <UTextarea
              v-model="newLogEntry"
              :rows="3"
              placeholder="Ghi chép sự kiện, nhận xét về buổi học, hạnh kiểm đoàn sinh..."
              class="w-full"
            />
            <div class="flex justify-end">
              <UButton
                icon="i-heroicons-plus"
                label="Lưu Ghi Chú"
                color="primary"
                :loading="isSavingLog"
                :disabled="!newLogEntry.trim()"
                @click="saveLogEntry"
              />
            </div>
          </div>
        </UCard>

        <!-- Feed Nhật Ký -->
        <div v-if="pendingLogs" class="space-y-4 py-8 max-w-3xl">
          <div v-for="i in 3" :key="i" class="flex gap-4">
            <USkeleton class="h-10 w-10 rounded-full flex-shrink-0" />
            <div class="space-y-2 flex-1">
              <USkeleton class="h-4 w-1/4" />
              <USkeleton class="h-16 w-full rounded-xl" />
            </div>
          </div>
        </div>
        <div v-else-if="!classLogs.length" class="text-center py-12 glass-card rounded-2xl">
          <UIcon name="i-heroicons-document-text" class="w-12 h-12 mx-auto mb-2 text-stone-300" />
          <p class="text-stone-400 italic">Chưa có ghi chú nào trong nhật ký lớp.</p>
        </div>
        <div v-else class="space-y-3">
          <UCard
            v-for="log in classLogs"
            :key="log.id"
            class="glass-card border-l-4 border-primary-200 dark:border-primary-800"
          >
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <UIcon name="i-heroicons-pencil-square" class="w-4 h-4 text-primary-500" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2 mb-1">
                  <span class="text-xs font-bold text-stone-500">{{ log.authorName || 'GLV' }}</span>
                  <span class="text-[10px] text-stone-400">{{ formatDate(log.createdAt) }}</span>
                </div>
                <p class="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-line">{{ log.content }}</p>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>

    <!-- Quick Enroll Multi-select Slideover/Modal -->
    <UModal
      v-model:open="isEnrollModalOpen"
      title="Xếp Đoàn Sinh Vào Lớp Hàng Loạt"
      size="lg"
    >
      <template #body>
        <div class="p-4 space-y-4">
          <p class="text-xs text-stone-500 italic">
            Hiển thị danh sách đoàn sinh tự do thuộc Ngành hoặc Toàn đoàn chưa có lớp học trong niên khóa hiện tại.
          </p>

          <UFormField label="Tìm kiếm đoàn sinh">
            <UInput
              v-model="searchQuery"
              icon="i-heroicons-magnifying-glass"
              placeholder="Nhập tên Thánh, Họ tên học sinh..."
              class="w-full"
            />
          </UFormField>

          <div
            v-if="pendingUnassigned"
            class="space-y-4 py-8"
          >
            <div v-for="i in 4" :key="i" class="flex items-center gap-3">
              <USkeleton class="h-5 w-5 rounded flex-shrink-0" />
              <div class="space-y-2 flex-1">
                <USkeleton class="h-4 w-1/3" />
                <USkeleton class="h-3 w-1/2" />
              </div>
            </div>
          </div>

          <div
            v-else-if="filteredUnassigned.length === 0"
            class="text-center py-10 text-stone-400 italic text-sm"
          >
            Không tìm thấy đoàn sinh tự do nào phù hợp.
          </div>

          <!-- Unassigned selection list -->
          <div
            v-else
            class="max-h-[300px] overflow-y-auto border border-stone-200 dark:border-stone-800 rounded-xl divide-y divide-stone-100 dark:divide-stone-800"
          >
            <div
              v-for="student in filteredUnassigned"
              :key="student.id"
              class="flex items-center gap-3 p-3 hover:bg-stone-50 dark:hover:bg-stone-800/50 cursor-pointer"
              @click="toggleSelectStudent(student.id)"
            >
              <UCheckbox
                :checked="selectedStudentIds.includes(student.id)"
                @change="toggleSelectStudent(student.id)"
              />
              <div class="min-w-0 flex-1">
                <p class="font-bold text-sm text-stone-800 dark:text-white">
                  <span class="text-primary-500 font-semibold mr-1">{{ student.holyName }}</span>
                  {{ student.fullName }}
                </p>
                <p class="text-xs text-stone-400">
                  Ngày sinh: {{ formatDate(student.birthDate) }} | Phân loại: Ngành {{ getBranchName(student.branch) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between items-center w-full">
          <span class="text-xs font-semibold text-stone-500">
            Đã chọn: {{ selectedStudentIds.length }} em
          </span>
          <div class="flex gap-2">
            <UButton
              label="Hủy"
              color="neutral"
              variant="ghost"
              @click="isEnrollModalOpen = false"
            />
            <UButton
              label="Xếp vào lớp"
              color="primary"
              :loading="isEnrolling"
              :disabled="selectedStudentIds.length === 0"
              @click="submitEnrollment"
            />
          </div>
        </div>
      </template>
    </UModal>
  </UContainer>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

definePageMeta({ layout: 'default' })

const route = useRoute()
const toast = useToast()
const classRoomId = route.params.id

// Fetch Class details & Enrollments
const { data: allYears } = await useApiFetch('/AcademicYear')
const classRoom = ref(null)

// Find classroom from all academic years
onMounted(async () => {
  if (allYears.value) {
    for (const year of allYears.value) {
      try {
        const rooms = await $api(`/AcademicYear/${year.id}/classrooms`)
        const found = rooms.find(r => r.id === classRoomId)
        if (found) {
          classRoom.value = found
          break
        }
      } catch (e) {
        console.error(e)
      }
    }
  }
})

useHead({ title: computed(() => `${classRoom.value?.className ?? 'Chi tiết lớp học'} | GiaoLy`) })

const { data: enrollments, pending: pendingEnrollments, refresh: refreshEnrollments } = await useApiFetch(`/Enrollment/classroom/${classRoomId}`, {
  default: () => []
})

// Unassigned list
const unassignedStudents = ref([])
const pendingUnassigned = ref(false)
const selectedStudentIds = ref([])
const isEnrollModalOpen = ref(false)
const isEnrolling = ref(false)
const searchQuery = ref('')

const openEnrollModal = async () => {
  if (!classRoom.value) return
  selectedStudentIds.value = []
  searchQuery.value = ''
  pendingUnassigned.value = true
  isEnrollModalOpen.value = true
  try {
    const res = await $api(`/Enrollment/unassigned/${classRoom.value.academicYearId}`)
    unassignedStudents.value = res
  } catch {
    toast.add({ title: 'Lỗi tải đoàn sinh tự do', color: 'error' })
  } finally {
    pendingUnassigned.value = false
  }
}

const toggleSelectStudent = (id) => {
  const index = selectedStudentIds.value.indexOf(id)
  if (index === -1) {
    selectedStudentIds.value.push(id)
  } else {
    selectedStudentIds.value.splice(index, 1)
  }
}

const filteredUnassigned = computed(() => {
  if (!searchQuery.value) return unassignedStudents.value
  const q = searchQuery.value.toLowerCase()
  return unassignedStudents.value.filter(s =>
    (s.fullName || '').toLowerCase().includes(q)
    || (s.holyName || '').toLowerCase().includes(q)
  )
})

const submitEnrollment = async () => {
  isEnrolling.value = true
  try {
    await $api('/Enrollment', {
      method: 'POST',
      body: {
        classRoomId: classRoomId,
        studentIds: selectedStudentIds.value
      }
    })
    isEnrollModalOpen.value = false
    await refreshEnrollments()
    toast.add({ title: 'Xếp lớp thành công!', color: 'success' })
  } catch {
    toast.add({ title: 'Lỗi xếp lớp', color: 'error' })
  } finally {
    isEnrolling.value = false
  }
}

const unenrollStudent = async (enrollmentId) => {
  if (!confirm('Rút học sinh này khỏi lớp?')) return
  try {
    await $api(`/Enrollment/${enrollmentId}`, { method: 'DELETE' })
    await refreshEnrollments()
    toast.add({ title: 'Đã rút đoàn sinh ra khỏi lớp', color: 'success' })
  } catch {
    toast.add({ title: 'Lỗi khi rút', color: 'error' })
  }
}

// Columns
const columns = [
  { accessorKey: 'fullName', header: 'Học Sinh' },
  { accessorKey: 'birthDate', header: 'Ngày Sinh' },
  { accessorKey: 'sacraments', header: 'Bí Tích Đức Tin' },
  { accessorKey: 'actions', header: '' }
]

// Tab Logic
const activeTab = ref('students')
const gradesList = ref([])
const isSavingGrades = ref(false)

const loadGrades = async () => {
  try {
    const res = await $api(`/Grade/classroom/${classRoomId}`)
    gradesList.value = res.map(g => ({
      ...g,
      oral: g.oral || 0,
      smallTest: g.smallTest || 0,
      bigTest: g.bigTest || 0,
      finalExam: g.finalExam || 0,
      absences: g.absences || 0,
      totalSessions: g.totalSessions || 30
    }))
  } catch (error) {
    console.error('Error fetching grades:', error)
    toast.add({ title: 'Lỗi tải sổ điểm', color: 'error' })
  }
}

watch(activeTab, async (newTab) => {
  if (newTab === 'grades' || newTab === 'contacts') {
    if (!gradesList.value.length) {
      await loadGrades()
    }
  } else if (newTab === 'log') {
    if (!classLogs.value.length) {
      await loadLogs()
    }
  }
})

// Tab 3: Contacts
const exportContactBookPdf = async () => {
  if (import.meta.client) {
    try {
      toast.add({ title: 'Đang xuất Sổ Liên Lạc PDF...', color: 'primary' })
      const res = await $api(`/Grade/classroom/${classRoomId}/export-contacts-pdf`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(res)
      const a = document.createElement('a')
      a.href = url
      a.download = `So_Lien_Lac_${classRoom.value?.className?.replace(/ /g, '_') || 'Lop'}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      toast.add({ title: 'Lỗi khi xuất Sổ Liên Lạc', color: 'error' })
    }
  }
}

// Tab 4: Logs
const classLogs = ref([])
const pendingLogs = ref(false)
const newLogEntry = ref('')
const isSavingLog = ref(false)

const loadLogs = async () => {
  pendingLogs.value = true
  try {
    classLogs.value = await $api(`/ClassroomLog/classroom/${classRoomId}`)
  } catch (error) {
    console.error('Error fetching logs:', error)
  } finally {
    pendingLogs.value = false
  }
}

const saveLogEntry = async () => {
  if (!newLogEntry.value.trim()) return
  isSavingLog.value = true
  try {
    await $api(`/ClassroomLog/classroom/${classRoomId}`, {
      method: 'POST',
      body: { content: newLogEntry.value }
    })
    toast.add({ title: 'Đã lưu ghi chú', color: 'success' })
    newLogEntry.value = ''
    await loadLogs()
  } catch (error) {
    console.error('Error saving log:', error)
    toast.add({ title: 'Lỗi lưu ghi chú', color: 'error' })
  } finally {
    isSavingLog.value = false
  }
}


// Dynamic GPA & Qualifications Calculation
const calculateGPA = (row) => {
  const sum = (parseFloat(row.oral) || 0)
    + (parseFloat(row.smallTest) || 0)
    + ((parseFloat(row.bigTest) || 0) * 2)
    + ((parseFloat(row.finalExam) || 0) * 3)
  return Math.round((sum / 7.0) * 10) / 10
}

const checkQualified = (row) => {
  const gpa = calculateGPA(row)
  const total = parseInt(row.totalSessions) || 30
  const abs = parseInt(row.absences) || 0
  const attendanceRate = total > 0 ? (total - abs) / total : 0
  return gpa >= 5.0 && attendanceRate >= 0.8
}

const saveStatus = ref('idle')

const debouncedSave = useDebounceFn(async () => {
  await saveGrades(true)
}, 1000)

const onGradeInput = () => {
  saveStatus.value = 'saving'
  debouncedSave()
}

const saveGrades = async (isAuto = false) => {
  if (!isAuto) isSavingGrades.value = true
  try {
    const payload = gradesList.value.map(g => ({
      studentId: g.studentId,
      classRoomId: classRoomId,
      oral: parseFloat(g.oral) || 0,
      smallTest: parseFloat(g.smallTest) || 0,
      bigTest: parseFloat(g.bigTest) || 0,
      finalExam: parseFloat(g.finalExam) || 0,
      absences: parseInt(g.absences) || 0,
      totalSessions: parseInt(g.totalSessions) || 30
    }))

    await $api(`/Grade/save/${classRoomId}`, {
      method: 'POST',
      body: payload
    })

    if (!isAuto) {
      toast.add({ title: 'Bảng điểm đã được lưu thành công!', color: 'success' })
    }

    saveStatus.value = 'saved'
    setTimeout(() => {
      if (saveStatus.value === 'saved') saveStatus.value = 'idle'
    }, 2000)
  } catch (error) {
    console.error('Error saving grades:', error)
    if (!isAuto) toast.add({ title: 'Lỗi lưu sổ điểm', color: 'error' })
    saveStatus.value = 'error'
  } finally {
    if (!isAuto) isSavingGrades.value = false
  }
}

const exportGrades = async () => {
  if (import.meta.client) {
    try {
      toast.add({ title: 'Đang tải file Excel...', color: 'primary' })
      const res = await $api(`/Grade/classroom/${classRoomId}/export`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(res)
      const a = document.createElement('a')
      a.href = url
      a.download = `Bang_Diem_${classRoom.value?.className?.replace(/ /g, '_') || 'Lop'}.xlsx`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      toast.add({ title: 'Lỗi khi tải file', color: 'error' })
    }
  }
}

const exportGradesPdf = async () => {
  if (import.meta.client) {
    try {
      toast.add({ title: 'Đang xuất PDF...', color: 'primary' })
      const res = await $api(`/Grade/classroom/${classRoomId}/export-pdf`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(res)
      const a = document.createElement('a')
      a.href = url
      a.download = `Bang_Diem_${classRoom.value?.className?.replace(/ /g, '_') || 'Lop'}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      toast.add({ title: 'Lỗi khi tải file', color: 'error' })
    }
  }
}

// Helpers
const getBranchName = (b) => {
  const names = { 0: 'Chung', 1: 'Chiên Con', 2: 'Ấu Nhi', 3: 'Thiếu Nhi', 4: 'Nghĩa Sĩ', 5: 'Hiệp Sĩ' }
  return names[b] || 'Chung'
}

const getBranchColor = (b) => {
  const colors = { 0: 'neutral', 1: 'pink', 2: 'success', 3: 'primary', 4: 'warning', 5: 'error' }
  return colors[b] || 'neutral'
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.25s ease;
}

.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 20px -8px rgba(0, 0, 0, 0.08);
}

.dark .glass-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
