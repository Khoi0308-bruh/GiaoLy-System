<script setup lang="ts">
import { ApiError } from '~/composables/useApi'

const route = useRoute()
const api = useApi()

const childId = computed(() => route.params.id as string)

interface ChildDetail {
  id: string
  studentCode: string
  holyName?: string | null
  fullName: string
  gender: string
  dateOfBirth: string
  placeOfBirth?: string | null
  parish?: string | null
  currentClassroom?: {
    id: string
    name: string
    academicYearName?: string | null
    mainTeacherName?: string | null
    room?: string | null
  } | null
  sacraments?: {
    baptism?: { date: string, place?: string, minister?: string } | null
    firstCommunion?: { date: string, place?: string } | null
    confirmation?: { date: string, place?: string, bishop?: string } | null
  } | null
}

interface GradeRecord {
  academicYearName: string
  className: string
  oralScore?: number | null
  quiz15m?: number | null
  test45m?: number | null
  semester1Exam?: number | null
  semester1Average?: number | null
  semester2Exam?: number | null
  semester2Average?: number | null
  yearlyAverage?: number | null
  rank?: string | null
  conduct?: string | null
  attendanceSummary?: {
    presentCount: number
    absentWithPermission: number
    absentWithoutPermission: number
    bouquetPoints?: number | null
  } | null
}

interface CertificateItem {
  id: string
  code: string
  type: string
  title: string
  sacramentDate: string
  place?: string | null
  minister?: string | null
  issuedAt: string
}

const child = ref<ChildDetail | null>(null)
const grades = ref<GradeRecord[]>([])
const certificates = ref<CertificateItem[]>([])

const loadingChild = ref(false)
const loadingGrades = ref(false)
const loadingCertificates = ref(false)
const downloadingCertId = ref<string | null>(null)

const errorChild = ref<ApiError | null>(null)
const errorGrades = ref<ApiError | null>(null)
const errorCertificates = ref<ApiError | null>(null)
const errorDownload = ref<string | null>(null)

async function fetchChildDetail() {
  if (!childId.value) return
  loadingChild.value = true
  errorChild.value = null
  try {
    child.value = await api.get<ChildDetail>(`/portal/children/${childId.value}`)
  } catch (e) {
    errorChild.value = e as ApiError
  } finally {
    loadingChild.value = false
  }
}

async function fetchGrades() {
  if (!childId.value) return
  loadingGrades.value = true
  errorGrades.value = null
  try {
    const res = await api.get<{ items?: GradeRecord[], data?: GradeRecord[] } | GradeRecord[]>(`/portal/children/${childId.value}/grades`)
    if (Array.isArray(res)) {
      grades.value = res
    } else if (res && Array.isArray(res.items)) {
      grades.value = res.items
    } else if (res && Array.isArray(res.data)) {
      grades.value = res.data
    } else {
      grades.value = []
    }
  } catch (e) {
    errorGrades.value = e as ApiError
  } finally {
    loadingGrades.value = false
  }
}

async function fetchCertificates() {
  if (!childId.value) return
  loadingCertificates.value = true
  errorCertificates.value = null
  try {
    const res = await api.get<{ items?: CertificateItem[], data?: CertificateItem[] } | CertificateItem[]>(`/portal/children/${childId.value}/certificates`)
    if (Array.isArray(res)) {
      certificates.value = res
    } else if (res && Array.isArray(res.items)) {
      certificates.value = res.items
    } else if (res && Array.isArray(res.data)) {
      certificates.value = res.data
    } else {
      certificates.value = []
    }
  } catch (e) {
    errorCertificates.value = e as ApiError
  } finally {
    loadingCertificates.value = false
  }
}

async function downloadCertificatePdf(cert: CertificateItem) {
  downloadingCertId.value = cert.id
  errorDownload.value = null
  try {
    const blob = await api.get<Blob>(
      `/portal/children/${childId.value}/certificates/${cert.id}/pdf`,
      undefined,
      { responseType: 'blob' }
    )
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Chung-chi-${cert.code || cert.type}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  } catch (e) {
    errorDownload.value = (e as Error).message || 'Không thể tải file PDF chứng chỉ.'
  } finally {
    downloadingCertId.value = null
  }
}

const activeTab = ref<'grades' | 'certificates' | 'info'>('grades')

onMounted(() => {
  fetchChildDetail()
  fetchGrades()
  fetchCertificates()
})
</script>

<template>
  <PortalShell>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <!-- Breadcrumb / Back button -->
      <div class="flex items-center gap-2 text-xs text-stone-500">
        <NuxtLink to="/phu-huynh" class="hover:text-[#1D3A73] flex items-center gap-1">
          <UIcon name="i-heroicons-arrow-left" class="h-3.5 w-3.5" />
          Quay lại danh sách các con
        </NuxtLink>
        <span>/</span>
        <span class="text-stone-800 font-medium">{{ child?.fullName || 'Hồ sơ của con' }}</span>
      </div>

      <ErrorState v-if="errorChild" :error="errorChild" />

      <!-- Thông tin tóm tắt hồ sơ con -->
      <div v-if="child" class="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1D3A73] text-[#ECC367] font-bold text-2xl shadow-sm">
              {{ child.fullName.charAt(0) }}
            </div>
            <div>
              <div v-if="child.holyName" class="text-sm font-semibold text-[#A8812A]">
                {{ child.holyName }}
              </div>
              <h1 class="font-serif text-2xl font-bold text-stone-900">
                {{ child.fullName }}
              </h1>
              <div class="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1">
                <span>Mã đoàn sinh: <strong class="text-stone-800">{{ child.studentCode }}</strong></span>
                <span>•</span>
                <span>Ngày sinh: <strong class="text-stone-800">{{ child.dateOfBirth }}</strong></span>
                <span>•</span>
                <span>Giới tính: <strong class="text-stone-800">{{ child.gender === 'Female' ? 'Nữ' : 'Nam' }}</strong></span>
              </div>
            </div>
          </div>

          <div v-if="child.currentClassroom" class="rounded-lg bg-stone-50 border border-stone-200/80 p-3 text-right">
            <div class="text-xs text-stone-500">Lớp hiện tại</div>
            <div class="text-base font-bold text-[#1D3A73]">{{ child.currentClassroom.name }}</div>
            <div v-if="child.currentClassroom.mainTeacherName" class="text-xs text-stone-600 mt-0.5">
              GLV: {{ child.currentClassroom.mainTeacherName }}
            </div>
          </div>
        </div>

        <!-- Tab chuyển đổi: Sổ điểm / Chứng chỉ / Thông tin bí tích -->
        <div class="mt-6 flex border-b border-stone-200 gap-6">
          <button
            type="button"
            class="pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2"
            :class="activeTab === 'grades' ? 'border-[#1D3A73] text-[#1D3A73]' : 'border-transparent text-stone-500 hover:text-stone-800'"
            @click="activeTab = 'grades'"
          >
            <UIcon name="i-heroicons-chart-bar" class="h-4 w-4" />
            Sổ điểm & Chuyên cần
          </button>
          <button
            type="button"
            class="pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2"
            :class="activeTab === 'certificates' ? 'border-[#1D3A73] text-[#1D3A73]' : 'border-transparent text-stone-500 hover:text-stone-800'"
            @click="activeTab = 'certificates'"
          >
            <UIcon name="i-heroicons-document-check" class="h-4 w-4" />
            Chứng chỉ bí tích ({{ certificates.length }})
          </button>
          <button
            type="button"
            class="pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2"
            :class="activeTab === 'info' ? 'border-[#1D3A73] text-[#1D3A73]' : 'border-transparent text-stone-500 hover:text-stone-800'"
            @click="activeTab = 'info'"
          >
            <UIcon name="i-heroicons-identification" class="h-4 w-4" />
            Thông tin bí tích & gia đình
          </button>
        </div>
      </div>

      <!-- Tab 1: Sổ điểm & Chuyên cần -->
      <div v-if="activeTab === 'grades'" class="space-y-6">
        <ErrorState v-if="errorGrades" :error="errorGrades" />

        <div v-if="loadingGrades" class="py-12 text-center text-sm text-stone-500">
          Đang tải bảng điểm...
        </div>

        <EmptyState
          v-else-if="grades.length === 0"
          title="Chưa có dữ liệu điểm"
          description="Hiện tại lớp chưa công bố bảng điểm cho niên khóa này hoặc con chưa tham gia kỳ thi."
          icon="i-heroicons-clipboard-document-list"
        />

        <div v-else class="space-y-6">
          <div
            v-for="(rec, idx) in grades"
            :key="idx"
            class="rounded-xl border border-stone-200 bg-white p-5 shadow-sm space-y-4"
          >
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
              <div>
                <h3 class="text-base font-bold text-stone-900">
                  {{ rec.className }} — Niên khóa: {{ rec.academicYearName }}
                </h3>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="rec.rank" class="rounded bg-blue-50 text-[#1D3A73] px-2.5 py-1 text-xs font-bold border border-blue-200">
                  Học lực: {{ rec.rank }}
                </span>
                <span v-if="rec.conduct" class="rounded bg-emerald-50 text-emerald-800 px-2.5 py-1 text-xs font-bold border border-emerald-200">
                  Hạnh kiểm: {{ rec.conduct }}
                </span>
              </div>
            </div>

            <!-- Bảng điểm chi tiết -->
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border border-stone-200 rounded-lg">
                <thead class="bg-stone-50 text-stone-700 uppercase font-semibold">
                  <tr class="divide-x divide-stone-200">
                    <th class="p-2.5 text-center">Miệng</th>
                    <th class="p-2.5 text-center">15 phút</th>
                    <th class="p-2.5 text-center">1 tiết</th>
                    <th class="p-2.5 text-center">Thi HK1</th>
                    <th class="p-2.5 text-center bg-blue-50/50 text-[#1D3A73]">ĐTB HK1</th>
                    <th class="p-2.5 text-center">Thi HK2</th>
                    <th class="p-2.5 text-center bg-blue-50/50 text-[#1D3A73]">ĐTB HK2</th>
                    <th class="p-2.5 text-center bg-amber-50 text-[#A8812A] font-bold">Cả năm</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-stone-200 font-medium text-stone-800">
                  <tr class="divide-x divide-stone-200 text-center">
                    <td class="p-2.5">{{ rec.oralScore ?? '-' }}</td>
                    <td class="p-2.5">{{ rec.quiz15m ?? '-' }}</td>
                    <td class="p-2.5">{{ rec.test45m ?? '-' }}</td>
                    <td class="p-2.5">{{ rec.semester1Exam ?? '-' }}</td>
                    <td class="p-2.5 bg-blue-50/50 font-bold text-[#1D3A73]">{{ rec.semester1Average ?? '-' }}</td>
                    <td class="p-2.5">{{ rec.semester2Exam ?? '-' }}</td>
                    <td class="p-2.5 bg-blue-50/50 font-bold text-[#1D3A73]">{{ rec.semester2Average ?? '-' }}</td>
                    <td class="p-2.5 bg-amber-50 font-bold text-base text-[#A8812A]">{{ rec.yearlyAverage ?? '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Tóm tắt chuyên cần & Hoa thiêng -->
            <div v-if="rec.attendanceSummary" class="flex flex-wrap items-center gap-4 text-xs text-stone-600 bg-stone-50 p-3 rounded-lg">
              <div>Có mặt: <strong class="text-stone-900">{{ rec.attendanceSummary.presentCount }}</strong> buổi</div>
              <div>Vắng có phép: <strong class="text-stone-900">{{ rec.attendanceSummary.absentWithPermission }}</strong></div>
              <div>Vắng không phép: <strong class="text-rose-600">{{ rec.attendanceSummary.absentWithoutPermission }}</strong></div>
              <div v-if="rec.attendanceSummary.bouquetPoints != null" class="ml-auto font-bold text-[#A8812A]">
                Điểm Hoa Thiêng: {{ rec.attendanceSummary.bouquetPoints }} bông
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 2: Chứng chỉ bí tích & Tải PDF -->
      <div v-if="activeTab === 'certificates'" class="space-y-4">
        <ErrorState v-if="errorCertificates" :error="errorCertificates" />
        <div v-if="errorDownload" class="rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
          {{ errorDownload }}
        </div>

        <div v-if="loadingCertificates" class="py-12 text-center text-sm text-stone-500">
          Đang tải chứng chỉ bí tích...
        </div>

        <EmptyState
          v-else-if="certificates.length === 0"
          title="Chưa có chứng chỉ được cấp"
          description="Hồ sơ của con chưa có chứng chỉ bí tích chính thức nào được lưu hành trong hệ thống."
          icon="i-heroicons-document"
        />

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="cert in certificates"
            :key="cert.id"
            class="rounded-xl border border-stone-200 bg-white p-5 shadow-sm flex flex-col justify-between"
          >
            <div class="space-y-3">
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-2">
                  <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-[#A8812A]">
                    <UIcon name="i-heroicons-check-badge" class="h-5 w-5" />
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-stone-900">{{ cert.title || cert.type }}</h4>
                    <p class="text-[11px] font-mono text-stone-500">Mã: {{ cert.code }}</p>
                  </div>
                </div>
              </div>

              <div class="text-xs space-y-1 text-stone-600 pt-1">
                <div>Ngày ban bí tích: <strong class="text-stone-800">{{ cert.sacramentDate }}</strong></div>
                <div v-if="cert.place">Nơi ban: <span class="text-stone-800">{{ cert.place }}</span></div>
                <div v-if="cert.minister">Người ban: <span class="text-stone-800">{{ cert.minister }}</span></div>
                <div>Ngày cấp chứng chỉ: <span class="text-stone-500">{{ cert.issuedAt }}</span></div>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
              <NuxtLink
                :to="`/xac-thuc-chung-chi`"
                class="text-xs text-[#1D3A73] hover:underline"
                target="_blank"
              >
                Tra cứu công khai
              </NuxtLink>
              <UButton
                size="xs"
                color="primary"
                variant="outline"
                icon="i-heroicons-arrow-down-tray"
                :loading="downloadingCertId === cert.id"
                @click="downloadCertificatePdf(cert)"
              >
                Tải bản in PDF
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 3: Thông tin bí tích & Gia đình -->
      <div v-if="activeTab === 'info'" class="space-y-4">
        <div class="rounded-xl border border-stone-200 bg-white p-5 shadow-sm space-y-4">
          <h3 class="text-sm font-bold uppercase tracking-wider text-[#1D3A73] flex items-center gap-2">
            <UIcon name="i-heroicons-sparkles" class="h-4 w-4 text-[#A8812A]" />
            Các bí tích khai tâm đã lãnh nhận
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="rounded-lg border border-stone-200 bg-stone-50/60 p-4">
              <div class="text-xs font-bold text-stone-700 mb-1">1. Bí tích Rửa tội</div>
              <div v-if="child?.sacraments?.baptism" class="text-xs space-y-1 text-stone-600">
                <div>Ngày: <strong class="text-stone-900">{{ child.sacraments.baptism.date }}</strong></div>
                <div v-if="child.sacraments.baptism.place">Nơi nhận: {{ child.sacraments.baptism.place }}</div>
                <div v-if="child.sacraments.baptism.minister">Chủ tế: {{ child.sacraments.baptism.minister }}</div>
              </div>
              <div v-else class="text-xs text-stone-400 italic">Chưa ghi nhận</div>
            </div>

            <div class="rounded-lg border border-stone-200 bg-stone-50/60 p-4">
              <div class="text-xs font-bold text-stone-700 mb-1">2. Xưng tội & Rước lễ lần đầu</div>
              <div v-if="child?.sacraments?.firstCommunion" class="text-xs space-y-1 text-stone-600">
                <div>Ngày: <strong class="text-stone-900">{{ child.sacraments.firstCommunion.date }}</strong></div>
                <div v-if="child.sacraments.firstCommunion.place">Nơi nhận: {{ child.sacraments.firstCommunion.place }}</div>
              </div>
              <div v-else class="text-xs text-stone-400 italic">Chưa ghi nhận</div>
            </div>

            <div class="rounded-lg border border-stone-200 bg-stone-50/60 p-4">
              <div class="text-xs font-bold text-stone-700 mb-1">3. Bí tích Thêm sức</div>
              <div v-if="child?.sacraments?.confirmation" class="text-xs space-y-1 text-stone-600">
                <div>Ngày: <strong class="text-stone-900">{{ child.sacraments.confirmation.date }}</strong></div>
                <div v-if="child.sacraments.confirmation.place">Nơi nhận: {{ child.sacraments.confirmation.place }}</div>
                <div v-if="child.sacraments.confirmation.bishop">Đức Giám Mục: {{ child.sacraments.confirmation.bishop }}</div>
              </div>
              <div v-else class="text-xs text-stone-400 italic">Chưa ghi nhận</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PortalShell>
</template>
