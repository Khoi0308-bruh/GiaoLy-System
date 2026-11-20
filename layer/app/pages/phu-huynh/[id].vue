<script setup lang="ts">
import { ApiError } from '~/composables/useApi'

const route = useRoute()
const api = useApi()

const childId = computed(() => route.params.id as string)

interface SacramentItem {
  sacramentType: string
  receivedOn?: string | null
  place?: string | null
  minister?: string | null
  sponsor?: string | null
}

interface ChildDetail {
  id: string
  studentCode: string
  holyName?: string | null
  fullName: string
  gender?: string | null
  birthDate?: string | null
  address?: string | null
  area?: string | null
  bloodType?: string | null
  allergies?: string | null
  relationship?: string | null
  currentClassRoom?: string | null
  currentBranch?: string | null
  status: string
  sacraments?: SacramentItem[] | null
}

interface GradeRecord {
  academicYearName: string
  classRoomName: string
  oral?: number | null
  smallTest?: number | null
  bigTest?: number | null
  finalExam?: number | null
  totalSessions?: number | null
  absences?: number | null
  computedGpa?: number | null
  computedStatus?: string | null
  remarks?: string | null
}

interface CertificateItem {
  id: string
  verificationCode: string
  certificateType: string
  issuedAt: string
  status: string
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

/** Ba bí tích khai tâm, khớp mã SacramentType của API. */
const SACRAMENT_TYPES = [
  { type: 'Baptism', label: '1. Bí tích Rửa tội' },
  { type: 'FirstCommunion', label: '2. Xưng tội & Rước lễ lần đầu' },
  { type: 'Confirmation', label: '3. Bí tích Thêm sức' }
]

const sacramentCards = computed(() => SACRAMENT_TYPES.map(s => ({
  label: s.label,
  item: (child.value?.sacraments ?? []).find(
    x => (x.sacramentType || '').toLowerCase() === s.type.toLowerCase()
  ) ?? null
})))

const CERTIFICATE_LABELS: Record<string, string> = {
  Baptism: 'Chứng chỉ Rửa tội',
  FirstCommunion: 'Chứng chỉ Rước lễ lần đầu',
  Confirmation: 'Chứng chỉ Thêm sức'
}
const certificateLabel = (type: string) => CERTIFICATE_LABELS[type] ?? type
const formatDate = (value?: string | null) => {
  if (!value) return '–'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '–' : d.toLocaleDateString('vi-VN')
}

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
    a.download = `Chung-chi-${cert.verificationCode || cert.certificateType}.pdf`
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
                <span>Ngày sinh: <strong class="text-stone-800">{{ formatDate(child.birthDate) }}</strong></span>
                <span>•</span>
                <span>Giới tính: <strong class="text-stone-800">{{ child.gender === 'Female' ? 'Nữ' : 'Nam' }}</strong></span>
              </div>
            </div>
          </div>

          <div v-if="child.currentClassRoom || child.currentBranch" class="rounded-lg bg-stone-50 border border-stone-200/80 p-3 text-right">
            <div class="text-xs text-stone-500">Lớp hiện tại</div>
            <div class="text-base font-bold text-[#1D3A73]">{{ child.currentClassRoom || 'Chưa xếp lớp' }}</div>
            <div v-if="child.currentBranch" class="text-xs text-stone-600 mt-0.5">
              {{ child.currentBranch }}
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
                  {{ rec.classRoomName }} — Niên khóa: {{ rec.academicYearName }}
                </h3>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="rec.computedGpa != null" class="rounded bg-blue-50 text-[#1D3A73] px-2.5 py-1 text-xs font-bold border border-blue-200">
                  ĐTB: {{ rec.computedGpa }}
                </span>
                <span v-if="rec.computedStatus" class="rounded bg-emerald-50 text-emerald-800 px-2.5 py-1 text-xs font-bold border border-emerald-200">
                  Xếp loại: {{ rec.computedStatus }}
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
                    <th class="p-2.5 text-center">Thi cuối kỳ</th>
                    <th class="p-2.5 text-center bg-amber-50 text-[#A8812A] font-bold">ĐTB</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-stone-200 font-medium text-stone-800">
                  <tr class="divide-x divide-stone-200 text-center">
                    <td class="p-2.5">{{ rec.oral ?? '-' }}</td>
                    <td class="p-2.5">{{ rec.smallTest ?? '-' }}</td>
                    <td class="p-2.5">{{ rec.bigTest ?? '-' }}</td>
                    <td class="p-2.5">{{ rec.finalExam ?? '-' }}</td>
                    <td class="p-2.5 bg-amber-50 font-bold text-base text-[#A8812A]">{{ rec.computedGpa ?? '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Tóm tắt chuyên cần & Hoa thiêng -->
            <div class="flex flex-wrap items-center gap-4 text-xs text-stone-600 bg-stone-50 p-3 rounded-lg">
              <div v-if="rec.totalSessions != null">Tổng số buổi: <strong class="text-stone-900">{{ rec.totalSessions }}</strong></div>
              <div v-if="rec.absences != null">Vắng: <strong class="text-rose-600">{{ rec.absences }}</strong></div>
              <div v-if="rec.remarks" class="flex-1">Nhận xét: <strong class="text-stone-900">{{ rec.remarks }}</strong></div>
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
                    <h4 class="text-sm font-bold text-stone-900">{{ certificateLabel(cert.certificateType) }}</h4>
                    <p class="text-[11px] font-mono text-stone-500">Mã: {{ cert.verificationCode }}</p>
                  </div>
                </div>
              </div>

              <div class="text-xs space-y-1 text-stone-600 pt-1">
                <div>Ngày cấp: <strong class="text-stone-800">{{ formatDate(cert.issuedAt) }}</strong></div>
                <div>Trạng thái: <span class="text-stone-800">{{ cert.status }}</span></div>
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
            <div v-for="card in sacramentCards" :key="card.label" class="rounded-lg border border-stone-200 bg-stone-50/60 p-4">
              <div class="text-xs font-bold text-stone-700 mb-1">{{ card.label }}</div>
              <div v-if="card.item" class="text-xs space-y-1 text-stone-600">
                <div>Ngày: <strong class="text-stone-900">{{ formatDate(card.item.receivedOn) }}</strong></div>
                <div v-if="card.item.place">Nơi nhận: {{ card.item.place }}</div>
                <div v-if="card.item.minister">Chủ tế: {{ card.item.minister }}</div>
                <div v-if="card.item.sponsor">Người đỡ đầu: {{ card.item.sponsor }}</div>
              </div>
              <div v-else class="text-xs text-stone-400 italic">Chưa ghi nhận</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PortalShell>
</template>
