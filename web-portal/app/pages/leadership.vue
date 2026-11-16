<template>
  <div class="min-h-screen bg-stone-50 dark:bg-stone-950 font-sans pb-24 selection:bg-amber-500/30">
    <!-- ═══════════════════════════════════════════════════════
         BANNER HEADER (Trang nghiêm & Ấm áp phong cách Mục Vụ)
    ═══════════════════════════════════════════════════════ -->
    <section class="relative py-16 overflow-hidden bg-gradient-to-br from-[#4a2e18] via-[#784620] to-[#5a3214] text-white shadow-lg">
      <div
        class="absolute inset-0 opacity-10 pointer-events-none"
        style="background-image: url('data:image/svg+xml,<svg width=40 height=40 viewBox=0 0 40 40 xmlns=http://www.w3.org/2000/svg><g fill=none fill-rule=evenodd><g fill=%23fff fill-opacity=0.4><path d=M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41z/></g></g></svg>')"
      />
      <!-- Radial Glow -->
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-200 text-xs font-bold uppercase tracking-widest mb-4">
          <UIcon name="i-heroicons-users" class="w-4 h-4 text-amber-300" />
          <span>Cơ Cấu Tổ Chức Mục Vụ</span>
        </div>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight drop-shadow-md text-white font-serif">
          Sơ Đồ Tổ Chức <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-yellow-300">Xứ Đoàn</span>
        </h1>
        <p class="mt-3 text-amber-100/90 text-sm sm:text-base max-w-2xl mx-auto font-medium">
          Hệ thống Ban Linh Hướng, Ban Điều Hành và đội ngũ Huynh Trưởng - Giáo Lý Viên phục vụ Sứ Đoàn Thiếu Nhi Thánh Thể.
        </p>

        <!-- View Mode Switcher -->
        <div class="mt-8 inline-flex p-1 bg-black/25 backdrop-blur-md rounded-2xl border border-white/15">
          <button
            class="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
            :class="viewMode === 'chart' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-stone-200 hover:text-white'"
            @click="viewMode = 'chart'"
          >
            <UIcon name="i-heroicons-rectangle-group" class="w-4 h-4" />
            <span>Sơ Đồ Phân Cấp (Org Chart)</span>
          </button>
          <button
            class="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
            :class="viewMode === 'grid' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-stone-200 hover:text-white'"
            @click="viewMode = 'grid'"
          >
            <UIcon name="i-heroicons-squares-2x2" class="w-4 h-4" />
            <span>Danh Sách Toàn Đoàn</span>
          </button>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════
         MAIN BODY CONTENT
    ═══════════════════════════════════════════════════════ -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
      <!-- Loading Skeleton -->
      <div v-if="loading" class="space-y-8 pt-10">
        <div class="h-32 bg-white/60 dark:bg-stone-900/60 rounded-3xl animate-pulse" />
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div v-for="n in 5" :key="n" class="h-80 bg-white/60 dark:bg-stone-900/60 rounded-3xl animate-pulse" />
        </div>
      </div>

      <!-- SƠ ĐỒ PHÂN CẤP ORG CHART (VIEW MODE: CHART) -->
      <div v-else-if="viewMode === 'chart'" class="space-y-12 pt-6">

        <!-- ───────────────────────────────────────────
             TẦNG 1: CHA TUYÊN ÚY (ĐỈNH CAO NHẤT)
        ─────────────────────────────────────────── -->
        <div class="flex flex-col items-center">
          <div class="text-center mb-2">
            <span class="text-[11px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-800">
              Linh Hướng Tối Cao
            </span>
          </div>

          <div
            v-if="chaplainLeader"
            class="w-72 sm:w-80 bg-gradient-to-b from-amber-50 to-white dark:from-stone-900 dark:to-stone-900/90 rounded-3xl p-6 shadow-xl border-2 border-amber-400 dark:border-amber-600/60 text-center relative hover:-translate-y-1 transition-all group"
          >
            <div class="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden ring-4 ring-amber-400 shadow-md bg-stone-100 dark:bg-stone-800">
              <img
                v-if="chaplainLeader.avatarPath"
                :src="getAvatarUrl(chaplainLeader.avatarPath)"
                :alt="chaplainLeader.fullName"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform"
              >
              <div v-else class="w-full h-full flex items-center justify-center text-3xl font-serif text-amber-700 dark:text-amber-300">
                ✝
              </div>
            </div>
            <span class="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
              {{ chaplainLeader.holyName || 'Linh Mục' }}
            </span>
            <h3 class="text-lg font-black text-stone-900 dark:text-white mt-0.5">
              {{ chaplainLeader.fullName }}
            </h3>
            <p class="text-xs font-bold text-stone-600 dark:text-stone-300 mt-1 uppercase tracking-wide">
              {{ chaplainLeader.position || 'Cha Tuyên Úy' }}
            </p>
          </div>

          <!-- Fallback nếu chưa có dữ liệu trong DB -->
          <div
            v-else
            class="w-72 bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-lg border-2 border-amber-300 dark:border-amber-700 text-center"
          >
            <div class="w-20 h-20 mx-auto mb-3 rounded-full bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-3xl text-amber-600">
              ✝
            </div>
            <p class="text-xs font-bold text-amber-600 uppercase">Linh Mục</p>
            <h3 class="font-black text-stone-800 dark:text-white">Cha Tuyên Úy</h3>
            <p class="text-xs text-stone-500">Tổng linh hướng Xứ Đoàn</p>
          </div>

          <!-- Đường dây nối đứng -->
          <div class="w-0.5 h-10 bg-gradient-to-b from-amber-400 to-stone-300 dark:to-stone-700" />
        </div>

        <!-- ───────────────────────────────────────────
             TẦNG 2: CHA ĐẶC TRÁCH & TRỢ TÁ / TRỢ ÚY
        ─────────────────────────────────────────── -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center max-w-5xl mx-auto">
          <!-- Cánh Trái: BAN TRỢ TÁ -->
          <div class="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm text-center">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 text-xs font-bold uppercase tracking-wider mb-3">
              <UIcon name="i-heroicons-hand-raised" class="w-4 h-4" />
              <span>Ban Trợ Tá</span>
            </div>
            <div v-if="troTaLeaders.length" class="flex flex-wrap justify-center gap-3">
              <div v-for="lead in troTaLeaders" :key="lead.id" class="text-center">
                <div class="w-14 h-14 mx-auto mb-1.5 rounded-full overflow-hidden ring-2 ring-orange-300 bg-stone-100 dark:bg-stone-800">
                  <img v-if="lead.avatarPath" :src="getAvatarUrl(lead.avatarPath)" class="w-full h-full object-cover">
                  <span v-else class="w-full h-full flex items-center justify-center font-bold text-orange-600">{{ lead.fullName.charAt(0) }}</span>
                </div>
                <p class="text-[11px] font-bold text-stone-800 dark:text-stone-200 line-clamp-1">{{ lead.fullName }}</p>
                <p class="text-[10px] text-stone-500">{{ lead.position || 'Trợ Tá' }}</p>
              </div>
            </div>
            <p v-else class="text-xs text-stone-400 italic py-3">Quý Phụ Huynh & Hội Đồng Mục Vụ đồng hành</p>
          </div>

          <!-- Trung tâm: CHA ĐẶC TRÁCH -->
          <div class="flex flex-col items-center">
            <div
              v-if="specialPriestLeader"
              class="w-full sm:w-72 bg-gradient-to-b from-amber-50/80 to-white dark:from-stone-900 dark:to-stone-900 rounded-3xl p-6 shadow-xl border-2 border-amber-300 dark:border-amber-700 text-center relative hover:-translate-y-1 transition-all"
            >
              <div class="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden ring-3 ring-amber-400 shadow bg-stone-100 dark:bg-stone-800">
                <img
                  v-if="specialPriestLeader.avatarPath"
                  :src="getAvatarUrl(specialPriestLeader.avatarPath)"
                  :alt="specialPriestLeader.fullName"
                  class="w-full h-full object-cover"
                >
                <div v-else class="w-full h-full flex items-center justify-center text-2xl font-serif text-amber-700 dark:text-amber-400">
                  ✝
                </div>
              </div>
              <span class="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                {{ specialPriestLeader.holyName || 'Linh Mục' }}
              </span>
              <h3 class="text-base font-black text-stone-900 dark:text-white mt-0.5">
                {{ specialPriestLeader.fullName }}
              </h3>
              <p class="text-xs font-bold text-amber-700 dark:text-amber-400 mt-1 uppercase tracking-wide">
                {{ specialPriestLeader.position || 'Cha Đặc Trách' }}
              </p>
            </div>
            <div
              v-else
              class="w-full sm:w-72 bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-lg border-2 border-stone-200 dark:border-stone-800 text-center"
            >
              <div class="w-16 h-16 mx-auto mb-2 rounded-full bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-2xl text-amber-600">
                ✝
              </div>
              <h3 class="font-bold text-stone-800 dark:text-white">Cha Đặc Trách</h3>
              <p class="text-xs text-stone-500">Điều hành mục vụ thiếu nhi</p>
            </div>
          </div>

          <!-- Cánh Phải: BAN TRỢ ÚY (Quý Dì / Thầy) -->
          <div class="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm text-center">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-3">
              <UIcon name="i-heroicons-sparkles" class="w-4 h-4" />
              <span>Ban Trợ Úy</span>
            </div>
            <div v-if="troUyLeaders.length" class="flex flex-wrap justify-center gap-3">
              <div v-for="lead in troUyLeaders" :key="lead.id" class="text-center">
                <div class="w-14 h-14 mx-auto mb-1.5 rounded-full overflow-hidden ring-2 ring-purple-300 bg-stone-100 dark:bg-stone-800">
                  <img v-if="lead.avatarPath" :src="getAvatarUrl(lead.avatarPath)" class="w-full h-full object-cover">
                  <span v-else class="w-full h-full flex items-center justify-center font-bold text-purple-600">{{ lead.fullName.charAt(0) }}</span>
                </div>
                <p class="text-[11px] font-bold text-stone-800 dark:text-stone-200 line-clamp-1">{{ lead.fullName }}</p>
                <p class="text-[10px] text-stone-500">{{ lead.position || 'Trợ Úy' }}</p>
              </div>
            </div>
            <p v-else class="text-xs text-stone-400 italic py-3">Quý Tu Sĩ & Trợ Úy linh hướng</p>
          </div>
        </div>

        <!-- Đường dây nối đứng xuống Ban Điều Hành -->
        <div class="flex justify-center -my-6">
          <div class="w-0.5 h-12 bg-gradient-to-b from-stone-300 to-amber-500 dark:from-stone-700 dark:to-amber-500" />
        </div>

        <!-- ───────────────────────────────────────────
             TẦNG 3: BAN ĐIỀU HÀNH XỨ ĐOÀN
        ─────────────────────────────────────────── -->
        <div class="bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 dark:from-stone-900/90 dark:to-stone-900/90 border-2 border-amber-400/50 dark:border-amber-600/40 rounded-[2.5rem] p-6 sm:p-8 max-w-5xl mx-auto shadow-xl backdrop-blur-md">
          <div class="text-center mb-6">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500 text-stone-950 font-black text-xs uppercase tracking-widest shadow-sm">
              <UIcon name="i-heroicons-star" class="w-4 h-4" />
              <span>Ban Điều Hành Xứ Đoàn</span>
            </div>
            <p class="text-xs text-stone-500 dark:text-stone-400 mt-2 font-medium">Nhiệm Kỳ 2023 - 2026</p>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div
              v-for="leader in bdhLeaders"
              :key="leader.id"
              class="bg-white/90 dark:bg-stone-800/90 rounded-2xl p-4 text-center border border-amber-200 dark:border-stone-700 shadow-sm hover:-translate-y-1 transition-all group"
            >
              <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 rounded-2xl overflow-hidden ring-2 ring-amber-400 bg-stone-100 dark:bg-stone-700 shadow">
                <img
                  v-if="leader.avatarPath"
                  :src="getAvatarUrl(leader.avatarPath)"
                  :alt="leader.fullName"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                >
                <div v-else class="w-full h-full flex items-center justify-center text-xl font-bold text-amber-600">
                  {{ leader.fullName.charAt(0) }}
                </div>
              </div>
              <p class="text-[10px] text-stone-400 uppercase font-bold tracking-wider">{{ leader.holyName }}</p>
              <h4 class="font-bold text-stone-900 dark:text-white text-sm line-clamp-1 mt-0.5">{{ leader.fullName }}</h4>
              <p class="text-xs font-bold text-amber-600 dark:text-amber-400 mt-1 line-clamp-1">{{ leader.position }}</p>
            </div>
          </div>
        </div>

        <!-- ───────────────────────────────────────────
             TẦNG 4: 5 CỘT NGÀNH CHUYÊN MÔN (CHIÊN - ẤU - THIẾU - NGHĨA - HIỆP)
        ─────────────────────────────────────────── -->
        <div>
          <div class="text-center mb-8">
            <h2 class="text-2xl font-black text-stone-900 dark:text-white uppercase tracking-tight font-serif">
              Đội Ngũ Huynh Trưởng & Giáo Lý Viên 5 Ngành
            </h2>
            <p class="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-1">
              Phụ trách giảng dạy và đồng hành cùng các em thiếu nhi theo từng lứa tuổi
            </p>
          </div>

          <!-- 5 Cột Ngành -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5 items-start">
            <div
              v-for="branch in branchColumns"
              :key="branch.id"
              class="rounded-3xl border shadow-md overflow-hidden flex flex-col transition-all bg-white/70 dark:bg-stone-900/70 backdrop-blur-md"
              :class="branch.containerClass"
            >
              <!-- Header Ngành -->
              <div :class="['p-4 text-center text-white', branch.headerClass]">
                <div class="text-2xl mb-1">{{ branch.icon }}</div>
                <h3 class="font-black text-sm uppercase tracking-wider">{{ branch.name }}</h3>
                <p class="text-[10px] opacity-90 font-medium">{{ branch.ageRange }}</p>
              </div>

              <div class="p-4 space-y-4 flex-1">
                <!-- Box Trưởng Ngành -->
                <div>
                  <div class="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1">
                    <UIcon name="i-heroicons-shield-check" class="w-3.5 h-3.5 text-amber-500" />
                    <span>Ban Trưởng Ngành</span>
                  </div>

                  <div v-if="getBranchChiefs(branch.id).length" class="space-y-2">
                    <div
                      v-for="chief in getBranchChiefs(branch.id)"
                      :key="chief.id"
                      class="bg-stone-50 dark:bg-stone-800/60 p-2.5 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 flex items-center gap-3"
                    >
                      <div class="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-stone-300 dark:ring-stone-600 bg-stone-200">
                        <img v-if="chief.avatarPath" :src="getAvatarUrl(chief.avatarPath)" class="w-full h-full object-cover">
                        <span v-else class="w-full h-full flex items-center justify-center font-bold text-xs">{{ chief.fullName.charAt(0) }}</span>
                      </div>
                      <div class="overflow-hidden">
                        <p class="text-[10px] text-stone-400 font-semibold">{{ chief.holyName }}</p>
                        <p class="text-xs font-bold text-stone-800 dark:text-white truncate">{{ chief.fullName }}</p>
                        <p class="text-[10px] text-amber-600 font-medium">{{ chief.position || 'Trưởng ngành' }}</p>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-xs text-stone-400 italic bg-stone-50 dark:bg-stone-800/40 p-2.5 rounded-2xl text-center">
                    Đang kiện toàn nhân sự
                  </div>
                </div>

                <!-- Lưới GLV Đứng Lớp -->
                <div>
                  <div class="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1">
                    <UIcon name="i-heroicons-academic-cap" class="w-3.5 h-3.5 text-blue-500" />
                    <span>Giáo Lý Viên Đứng Lớp</span>
                  </div>

                  <div v-if="getBranchTeachers(branch.id).length" class="grid grid-cols-2 gap-2">
                    <div
                      v-for="teacher in getBranchTeachers(branch.id)"
                      :key="teacher.id"
                      class="bg-stone-50 dark:bg-stone-800/50 hover:bg-stone-100 dark:hover:bg-stone-800 p-2 rounded-xl text-center border border-stone-200/40 dark:border-stone-700/40 transition-colors cursor-pointer"
                      @click="selectedLeader = teacher"
                    >
                      <div class="w-12 h-12 mx-auto mb-1.5 rounded-xl overflow-hidden ring-1 ring-stone-200 bg-stone-200 dark:bg-stone-700">
                        <img v-if="teacher.avatarPath" :src="getAvatarUrl(teacher.avatarPath)" class="w-full h-full object-cover">
                        <span v-else class="w-full h-full flex items-center justify-center font-bold text-xs text-stone-600 dark:text-stone-300">{{ teacher.fullName.charAt(0) }}</span>
                      </div>
                      <p class="text-[9px] text-stone-400 truncate">{{ teacher.holyName }}</p>
                      <p class="text-[11px] font-bold text-stone-800 dark:text-stone-200 truncate">{{ teacher.fullName }}</p>
                      <span class="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-white dark:bg-stone-700 text-stone-600 dark:text-stone-300 mt-1 border border-stone-200 dark:border-stone-600">
                        {{ teacher.position || 'GLV' }}
                      </span>
                    </div>
                  </div>
                  <div v-else class="text-xs text-stone-400 italic text-center py-4 bg-stone-50 dark:bg-stone-800/30 rounded-2xl">
                    Chưa phân công GLV
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- CHẾ ĐỘ XEM GRID TOÀN ĐOÀN (VIEW MODE: GRID) -->
      <div v-else class="space-y-8 pt-8">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div
            v-for="lead in leaders"
            :key="lead.id"
            class="bg-white/80 dark:bg-stone-900/80 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 text-center hover:shadow-lg transition-all"
            @click="selectedLeader = lead"
          >
            <div class="w-16 h-16 mx-auto mb-2 rounded-2xl overflow-hidden ring-2 ring-amber-400/40 bg-stone-100 dark:bg-stone-800">
              <img v-if="lead.avatarPath" :src="getAvatarUrl(lead.avatarPath)" class="w-full h-full object-cover">
              <div v-else class="w-full h-full flex items-center justify-center font-bold text-amber-600">{{ lead.fullName.charAt(0) }}</div>
            </div>
            <p class="text-[10px] text-stone-400 font-bold uppercase">{{ lead.holyName }}</p>
            <h4 class="font-bold text-stone-900 dark:text-white text-xs truncate">{{ lead.fullName }}</h4>
            <p class="text-[11px] text-amber-600 font-medium truncate mt-0.5">{{ lead.position }}</p>
          </div>
        </div>
      </div>
    </main>

    <!-- MODAL CHI TIẾT GLV -->
    <UModal v-model="isDetailOpen">
      <div v-if="selectedLeader" class="p-6 text-center">
        <div class="w-24 h-24 mx-auto mb-4 rounded-3xl overflow-hidden ring-4 ring-amber-400 shadow-lg bg-stone-100">
          <img v-if="selectedLeader.avatarPath" :src="getAvatarUrl(selectedLeader.avatarPath)" class="w-full h-full object-cover">
          <div v-else class="w-full h-full flex items-center justify-center text-3xl font-bold text-amber-600">{{ selectedLeader.fullName.charAt(0) }}</div>
        </div>
        <p class="text-xs font-bold text-amber-600 uppercase tracking-wider">{{ selectedLeader.holyName }}</p>
        <h3 class="text-xl font-black text-stone-900 dark:text-white mt-1">{{ selectedLeader.fullName }}</h3>
        <p class="text-sm font-bold text-stone-600 dark:text-stone-300 mt-1">{{ selectedLeader.position }}</p>
        <div v-if="selectedLeader.description" class="mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-stone-800 text-xs italic text-stone-600 dark:text-stone-300">
          "{{ selectedLeader.description }}"
        </div>
        <div class="mt-6">
          <UButton label="Đóng" color="neutral" variant="soft" class="rounded-xl px-6" @click="selectedLeader = null" />
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', public: true })
useHead({ title: 'Sơ Đồ Tổ Chức Xứ Đoàn – Thiếu Nhi Thánh Thể' })

const config = useRuntimeConfig()
const apiBase = config.public.apiBase

interface Leader {
  id: string
  holyName: string
  fullName: string
  position: string
  level: number
  branch: number
  term?: string
  description?: string
  avatarPath?: string
  isActive: boolean
}

const viewMode = ref<'chart' | 'grid'>('chart')
const loading = ref(true)
const leaders = ref<Leader[]>([])
const selectedLeader = ref<Leader | null>(null)
const isDetailOpen = computed({
  get: () => !!selectedLeader.value,
  set: (val) => { if (!val) selectedLeader.value = null }
})

const getAvatarUrl = (path: string) => {
  if (path.startsWith('http')) return path
  return `${apiBase}${path}`
}

// 5 Ngành chuyên môn TNTT
const branchColumns = [
  {
    id: 1,
    name: 'Ngành Chiên Con',
    ageRange: '4 - 6 tuổi',
    icon: '🌸',
    headerClass: 'bg-gradient-to-r from-pink-500 to-rose-400',
    containerClass: 'border-pink-200 dark:border-pink-900/40 shadow-pink-500/5'
  },
  {
    id: 2,
    name: 'Ngành Ấu Nhi',
    ageRange: '7 - 9 tuổi',
    icon: '🌿',
    headerClass: 'bg-gradient-to-r from-emerald-600 to-teal-500',
    containerClass: 'border-emerald-200 dark:border-emerald-900/40 shadow-emerald-500/5'
  },
  {
    id: 3,
    name: 'Ngành Thiếu Nhi',
    ageRange: '10 - 12 tuổi',
    icon: '🌊',
    headerClass: 'bg-gradient-to-r from-sky-600 to-blue-500',
    containerClass: 'border-sky-200 dark:border-sky-900/40 shadow-sky-500/5'
  },
  {
    id: 4,
    name: 'Ngành Nghĩa Sĩ',
    ageRange: '13 - 15 tuổi',
    icon: '☀️',
    headerClass: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-900',
    containerClass: 'border-amber-200 dark:border-amber-900/40 shadow-amber-500/5'
  },
  {
    id: 5,
    name: 'Ngành Hiệp Sĩ',
    ageRange: '16 - 18 tuổi',
    icon: '🛡️',
    headerClass: 'bg-gradient-to-r from-[#8c502b] to-[#6d3c1d]',
    containerClass: 'border-amber-800/30 dark:border-stone-800 shadow-stone-500/5'
  }
]

// Tải dữ liệu từ API
try {
  const { data } = await useFetch<Leader[]>(`${apiBase}/api/v1/public/leaders`)
  if (data.value && data.value.length) {
    leaders.value = data.value.filter(l => l.isActive)
  }
} catch (e) {
  console.error('Không thể tải danh sách lãnh đạo:', e)
} finally {
  loading.value = false
}

// Phân loại lãnh đạo theo sơ đồ cấp bậc:
// Level 1: Cha Tuyên Úy
const chaplainLeader = computed(() => {
  return leaders.value.find(l => l.level === 1 || l.position.toLowerCase().includes('tuyên úy'))
})

// Level 2 hoặc vị trí đặc trách: Cha Đặc Trách
const specialPriestLeader = computed(() => {
  return leaders.value.find(l => l.position.toLowerCase().includes('đặc trách') || (l.level === 2 && l.holyName.toLowerCase().includes('linh mục')))
})

// Trợ Tá: Phụ huynh / Hội đồng mục vụ
const troTaLeaders = computed(() => {
  return leaders.value.filter(l => l.position.toLowerCase().includes('trợ tá'))
})

// Trợ Úy: Quý Dì / Quý Thầy
const troUyLeaders = computed(() => {
  return leaders.value.filter(l => l.position.toLowerCase().includes('trợ úy') || l.position.toLowerCase().includes('dì') || l.position.toLowerCase().includes('thầy'))
})

// Ban Điều Hành Xứ Đoàn (Xứ đoàn trưởng, phó, thư ký, thủ quỹ)
const bdhLeaders = computed(() => {
  return leaders.value.filter(l => {
    const pos = l.position.toLowerCase()
    return (l.level === 2 || l.level === 3) && 
      (pos.includes('xứ đoàn') || pos.includes('thư ký') || pos.includes('thủ quỹ') || pos.includes('trưởng ban')) &&
      !pos.includes('đặc trách')
  })
})

// Lấy danh sách Trưởng Ngành cho từng Ngành
const getBranchChiefs = (branchId: number) => {
  return leaders.value.filter(l => {
    return l.branch === branchId && (l.level === 3 || l.position.toLowerCase().includes('trưởng ngành') || l.position.toLowerCase().includes('phó ngành'))
  })
}

// Lấy danh sách Giáo Lý Viên đứng lớp cho từng Ngành
const getBranchTeachers = (branchId: number) => {
  return leaders.value.filter(l => {
    const isChief = l.level === 3 || l.position.toLowerCase().includes('trưởng ngành') || l.position.toLowerCase().includes('phó ngành')
    return l.branch === branchId && !isChief
  })
}
</script>
