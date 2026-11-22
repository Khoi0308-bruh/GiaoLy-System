<script setup lang="ts">
import { PERMISSIONS } from '../../../shared/permissions'
import type { ApiError } from '../../../composables/useApi'

definePageMeta({ layout: 'admin', permission: PERMISSIONS.Camps.View })

interface CampDetail {
  id: string
  name: string
  startDate: string
  endDate: string
  location: string
  fee: number
  description?: string | null
  branchName?: string | null
  registrationDeadline?: string | null
}

interface CampPaymentItem {
  id: string
  registrationId: string
  amount: number
  paidOn: string
  receiptNumber?: string | null
  receivedByName: string
  note?: string | null
  reversesPaymentId?: string | null
  createdAt: string
}

interface CampRegistrationItem {
  id: string
  campEventId: string
  eventFee: number
  studentId: string
  studentCode: string
  studentHolyName: string
  studentFullName: string
  classRoomName?: string | null
  teamNumber?: string | null
  note?: string | null
  status: 'Registered' | 'Cancelled' | string
  registeredByName: string
  createdAt: string
  totalPaid: number
  remaining: number
  isOverpaid: boolean
  isSettled: boolean
  payments: CampPaymentItem[]
}

interface CampFinanceSummary {
  campEventId: string
  campEventName: string
  feePerStudent: number
  totalRegistered: number
  totalCancelled: number
  totalExpected: number
  totalCollected: number
  totalRemaining: number
  fullyPaidCount: number
  partiallyPaidCount: number
  unpaidCount: number
  overpaidCount: number
}

interface StudentSearchItem {
  id: string
  studentCode: string
  holyName?: string | null
  fullName: string
}

const route = useRoute()
const api = useApi()
const toast = useToast()
const { can } = usePermissions()

const campId = route.params.id as string

const camp = ref<CampDetail | null>(null)
const registrations = ref<CampRegistrationItem[]>([])
const finance = ref<CampFinanceSummary | null>(null)
const loading = ref(true)
const error = ref<ApiError | null>(null)

// Bộ lọc
const searchQuery = ref('')
const filterStatus = ref<'ALL' | 'Unpaid' | 'Partial' | 'Settled' | 'Cancelled'>('ALL')

// Modal Đăng ký mới
const registerOpen = ref(false)
const registering = ref(false)
const studentSearchText = ref('')
const searchResults = ref<StudentSearchItem[]>([])
const selectedStudent = ref<StudentSearchItem | null>(null)
const registerForm = ref({
  teamNumber: '',
  note: ''
})

// Modal Sửa đăng ký (đổi tổ, ghi chú)
const editRegOpen = ref(false)
const editingReg = ref(false)
const targetReg = ref<CampRegistrationItem | null>(null)
const editRegForm = ref({
  teamNumber: '',
  note: ''
})

// Modal Hủy đăng ký
const cancelRegOpen = ref(false)
const cancellingReg = ref(false)

// Modal Ghi thu tiền
const payOpen = ref(false)
const paying = ref(false)
const payForm = ref({
  amount: 0,
  paidOn: new Date().toISOString().substring(0, 10),
  receiptNumber: '',
  note: ''
})

// Modal Lịch sử phiếu thu & Hoàn phí / Đảo ngược
const historyOpen = ref(false)
const reverseOpen = ref(false)
const reversing = ref(false)
const selectedPayment = ref<CampPaymentItem | null>(null)
const reverseForm = ref({
  amount: 0,
  reason: '',
  receiptNumber: ''
})

async function loadData() {
  loading.value = true
  error.value = null
  try {
    const [resCamp, resRegs, resFin] = await Promise.all([
      api.get<CampDetail>(`/camps/${campId}`),
      api.get<CampRegistrationItem[]>(`/camps/${campId}/registrations`),
      can(PERMISSIONS.Camps.Collect) ? api.get<CampFinanceSummary>(`/camps/${campId}/finance`).catch(() => null) : Promise.resolve(null)
    ])
    camp.value = resCamp
    registrations.value = resRegs || []
    finance.value = resFin
  } catch (e) {
    error.value = e as ApiError
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

const filteredRegistrations = computed(() => {
  return registrations.value.filter(r => {
    if (filterStatus.value === 'Cancelled' && r.status !== 'Cancelled') return false
    if (filterStatus.value !== 'Cancelled' && r.status === 'Cancelled') return false

    if (filterStatus.value === 'Unpaid' && r.totalPaid > 0) return false
    if (filterStatus.value === 'Partial' && (r.totalPaid === 0 || r.isSettled)) return false
    if (filterStatus.value === 'Settled' && !r.isSettled) return false

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const matchName = `${r.studentHolyName ?? ''} ${r.studentFullName}`.toLowerCase().includes(q)
      const matchCode = r.studentCode.toLowerCase().includes(q)
      const matchTeam = (r.teamNumber || '').toLowerCase().includes(q)
      return matchName || matchCode || matchTeam
    }
    return true
  })
})

function formatCurrency(val: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0)
}

// ── Đăng ký mới ─────────────────────────────────────────
async function searchStudents() {
  if (!studentSearchText.value.trim()) return
  try {
    const res = await api.get<any>(`/students?search=${encodeURIComponent(studentSearchText.value.trim())}&status=Active&pageSize=15`)
    const items: StudentSearchItem[] = res.items || res
    // Lọc những em đã đăng ký
    const registeredIds = new Set(registrations.value.filter(r => r.status !== 'Cancelled').map(r => r.studentId))
    searchResults.value = items.filter(s => !registeredIds.has(s.id))
  } catch {
    searchResults.value = []
  }
}

function openRegisterModal() {
  selectedStudent.value = null
  studentSearchText.value = ''
  searchResults.value = []
  registerForm.value = { teamNumber: '', note: '' }
  registerOpen.value = true
}

async function handleRegisterStudent() {
  if (!selectedStudent.value) {
    toast.add({ title: 'Vui lòng chọn một đoàn sinh', color: 'error' })
    return
  }
  registering.value = true
  try {
    await api.post(`/camps/${campId}/registrations`, {
      studentId: selectedStudent.value.id,
      teamNumber: registerForm.value.teamNumber?.trim() || null,
      note: registerForm.value.note?.trim() || null
    })
    toast.add({ title: 'Đăng ký đoàn sinh thành công', color: 'success' })
    registerOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể đăng ký đoàn sinh', description: err.detail || err.message, color: 'error' })
  } finally {
    registering.value = false
  }
}

// ── Sửa đăng ký (đổi tổ) ────────────────────────────────
function openEditRegModal(reg: CampRegistrationItem) {
  targetReg.value = reg
  editRegForm.value = {
    teamNumber: reg.teamNumber || '',
    note: reg.note || ''
  }
  editRegOpen.value = true
}

async function handleUpdateReg() {
  if (!targetReg.value) return
  editingReg.value = true
  try {
    await api.put(`/camps/${campId}/registrations/${targetReg.value.id}`, {
      teamNumber: editRegForm.value.teamNumber?.trim() || null,
      note: editRegForm.value.note?.trim() || null
    })
    toast.add({ title: 'Cập nhật đăng ký thành công', color: 'success' })
    editRegOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể cập nhật', description: err.detail || err.message, color: 'error' })
  } finally {
    editingReg.value = false
  }
}

// ── Hủy đăng ký ─────────────────────────────────────────
function openCancelRegModal(reg: CampRegistrationItem) {
  targetReg.value = reg
  cancelRegOpen.value = true
}

async function handleCancelRegistration() {
  if (!targetReg.value) return
  cancellingReg.value = true
  try {
    await api.delete(`/camps/${campId}/registrations/${targetReg.value.id}`)
    toast.add({ title: 'Đã hủy đăng ký sự kiện', color: 'success' })
    cancelRegOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Không thể hủy đăng ký', description: err.detail || err.message, color: 'error' })
  } finally {
    cancellingReg.value = false
  }
}

// ── Ghi thu tiền ────────────────────────────────────────
function openPayModal(reg: CampRegistrationItem) {
  targetReg.value = reg
  payForm.value = {
    amount: reg.remaining > 0 ? reg.remaining : reg.eventFee,
    paidOn: new Date().toISOString().substring(0, 10),
    receiptNumber: '',
    note: ''
  }
  payOpen.value = true
}

async function handleRecordPayment() {
  if (!targetReg.value || payForm.value.amount <= 0) {
    toast.add({ title: 'Vui lòng nhập số tiền thu hợp lệ', color: 'error' })
    return
  }
  paying.value = true
  try {
    await api.post(`/camps/registrations/${targetReg.value.id}/payments`, {
      amount: Number(payForm.value.amount),
      paidOn: payForm.value.paidOn,
      receiptNumber: payForm.value.receiptNumber?.trim() || null,
      note: payForm.value.note?.trim() || null
    })
    toast.add({ title: 'Đã ghi nhận thu phí thành công', color: 'success' })
    payOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Lỗi ghi nhận thu phí', description: err.detail || err.message, color: 'error' })
  } finally {
    paying.value = false
  }
}

// ── Lịch sử & Đảo ngược / Hoàn phí ─────────────────────
function openHistoryModal(reg: CampRegistrationItem) {
  targetReg.value = reg
  historyOpen.value = true
}

function openReverseModal(p: CampPaymentItem) {
  selectedPayment.value = p
  reverseForm.value = {
    amount: Math.abs(p.amount),
    reason: '',
    receiptNumber: ''
  }
  reverseOpen.value = true
}

async function handleReversePayment() {
  if (!selectedPayment.value || !reverseForm.value.reason.trim()) {
    toast.add({ title: 'Vui lòng nhập lý do hoàn phí / đảo ngược', color: 'error' })
    return
  }
  reversing.value = true
  try {
    await api.post(`/camps/payments/${selectedPayment.value.id}/reverse`, {
      amount: Number(reverseForm.value.amount),
      reason: reverseForm.value.reason.trim(),
      receiptNumber: reverseForm.value.receiptNumber?.trim() || null
    })
    toast.add({ title: 'Đã hoàn phí / đảo ngược thành công', color: 'success' })
    reverseOpen.value = false
    historyOpen.value = false
    await loadData()
  } catch (e) {
    const err = e as ApiError
    toast.add({ title: 'Lỗi đảo ngược phiếu thu', description: err.detail || err.message, color: 'error' })
  } finally {
    reversing.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-2 text-xs font-medium text-stone-500">
      <NuxtLink to="/admin/trai" class="hover:text-marian-600 hover:underline">
        Sự kiện & Trại
      </NuxtLink>
      <UIcon name="i-lucide-chevron-right" class="h-3 w-3" />
      <span class="text-stone-800 dark:text-stone-200 font-semibold">{{ camp?.name || 'Chi tiết sự kiện' }}</span>
    </div>

    <ErrorState v-if="error" :error="error" @retry="loadData" />

    <template v-if="camp">
      <PageHeader
        :title="camp.name"
        :subtitle="`Địa điểm: ${camp.location} • Thời gian: ${camp.startDate} đến ${camp.endDate} • Lệ phí: ${formatCurrency(camp.fee)}/em`"
      >
        <template #actions>
          <UButton
            v-if="can(PERMISSIONS.Camps.Register)"
            color="primary"
            icon="i-lucide-user-plus"
            @click="openRegisterModal"
          >
            Đăng ký đoàn sinh
          </UButton>
        </template>
      </PageHeader>

      <!-- Khối tài chính sự kiện (camps.collect) -->
      <div
        v-if="finance && can(PERMISSIONS.Camps.Collect)"
        class="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900"
      >
        <div class="flex items-center justify-between mb-4 border-b border-stone-100 pb-3 dark:border-stone-800">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-receipt" class="h-5 w-5 text-vatican-600" />
            <h3 class="font-display text-lg font-bold text-stone-900 dark:text-stone-100">
              Tổng quan Tài chính & Thu phí
            </h3>
          </div>
          <span class="text-xs text-stone-500">Mức phí: {{ formatCurrency(finance.feePerStudent) }} / em</span>
        </div>

        <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div class="rounded-xl bg-stone-50 p-3.5 dark:bg-stone-800/40">
            <span class="text-xs text-stone-500">Dự kiến thu:</span>
            <p class="mt-1 font-mono text-lg font-bold text-stone-900 dark:text-stone-100">
              {{ formatCurrency(finance.totalExpected) }}
            </p>
          </div>
          <div class="rounded-xl bg-emerald-50 p-3.5 dark:bg-emerald-950/30">
            <span class="text-xs text-emerald-700 dark:text-emerald-300">Đã thu thực tế:</span>
            <p class="mt-1 font-mono text-lg font-bold text-emerald-600">
              {{ formatCurrency(finance.totalCollected) }}
            </p>
          </div>
          <div class="rounded-xl bg-amber-50 p-3.5 dark:bg-amber-950/30">
            <span class="text-xs text-amber-700 dark:text-amber-300">Còn phải thu:</span>
            <p class="mt-1 font-mono text-lg font-bold text-amber-600">
              {{ formatCurrency(finance.totalRemaining) }}
            </p>
          </div>
          <div class="rounded-xl bg-stone-50 p-3.5 dark:bg-stone-800/40">
            <span class="text-xs text-stone-500">Tiến độ thu tiền:</span>
            <p class="mt-1 font-mono text-sm font-semibold text-stone-800 dark:text-stone-200">
              Đủ: <strong class="text-emerald-600">{{ finance.fullyPaidCount }}</strong> |
              Thiếu: <strong class="text-amber-600">{{ finance.partiallyPaidCount }}</strong> |
              Chưa đóng: <strong class="text-red-500">{{ finance.unpaidCount }}</strong>
            </p>
          </div>
        </div>
      </div>

      <!-- Bộ lọc và danh sách đăng ký -->
      <div class="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-stone-800 dark:bg-stone-900">
        <div class="flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
            :class="filterStatus === 'ALL' ? 'bg-marian-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300'"
            @click="filterStatus = 'ALL'"
          >
            Tất cả ({{ registrations.filter(r => r.status !== 'Cancelled').length }})
          </button>
          <button
            type="button"
            class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
            :class="filterStatus === 'Settled' ? 'bg-marian-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300'"
            @click="filterStatus = 'Settled'"
          >
            Đã đóng đủ
          </button>
          <button
            type="button"
            class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
            :class="filterStatus === 'Partial' ? 'bg-marian-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300'"
            @click="filterStatus = 'Partial'"
          >
            Đóng một phần
          </button>
          <button
            type="button"
            class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
            :class="filterStatus === 'Unpaid' ? 'bg-marian-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300'"
            @click="filterStatus = 'Unpaid'"
          >
            Chưa đóng
          </button>
          <button
            type="button"
            class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
            :class="filterStatus === 'Cancelled' ? 'bg-red-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300'"
            @click="filterStatus = 'Cancelled'"
          >
            Đã hủy
          </button>
        </div>

        <div class="w-full sm:w-64">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Tìm theo tên, mã ĐS, tổ..."
            size="sm"
          />
        </div>
      </div>

      <!-- Bảng danh sách đăng ký -->
      <div class="rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-stone-50 text-xs font-semibold uppercase text-stone-600 dark:bg-stone-800/70 dark:text-stone-300">
              <tr>
                <th class="p-3 w-10 text-center">STT</th>
                <th class="p-3">Mã ĐS</th>
                <th class="p-3">Tên thánh & Họ tên</th>
                <th class="p-3">Lớp giáo lý</th>
                <th class="p-3 text-center">Tổ / Đội</th>
                <th class="p-3 text-right">Lệ phí</th>
                <th class="p-3 text-right">Đã đóng</th>
                <th class="p-3 text-right">Còn thiếu</th>
                <th class="p-3 text-center">Trạng thái</th>
                <th class="p-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
              <tr v-if="filteredRegistrations.length === 0">
                <td colspan="10" class="p-8 text-center text-sm text-stone-500">
                  Không có đoàn sinh nào trong danh sách đăng ký.
                </td>
              </tr>
              <tr
                v-for="(r, idx) in filteredRegistrations"
                :key="r.id"
                class="hover:bg-stone-50/70 dark:hover:bg-stone-800/40"
                :class="r.status === 'Cancelled' ? 'opacity-50 line-through bg-stone-50/50' : ''"
              >
                <td class="p-3 text-center text-xs text-stone-400 font-mono">{{ idx + 1 }}</td>
                <td class="p-3 font-mono text-xs font-semibold text-marian-600 dark:text-marian-400">
                  {{ r.studentCode }}
                </td>
                <td class="p-3 font-medium text-stone-900 dark:text-stone-100 whitespace-nowrap">
                  <NuxtLink :to="`/admin/doan-sinh/${r.studentId}`" class="hover:underline">
                    {{ r.studentHolyName ? `${r.studentHolyName} ` : '' }}{{ r.studentFullName }}
                  </NuxtLink>
                </td>
                <td class="p-3 text-xs text-stone-500">{{ r.classRoomName || '—' }}</td>
                <td class="p-3 text-center text-xs font-semibold">
                  <span v-if="r.teamNumber" class="rounded bg-stone-100 px-2 py-0.5 text-stone-700 dark:bg-stone-800 dark:text-stone-200">
                    Tổ {{ r.teamNumber }}
                  </span>
                  <span v-else class="text-stone-400">—</span>
                </td>
                <td class="p-3 text-right font-mono text-xs font-semibold">{{ formatCurrency(r.eventFee) }}</td>
                <td class="p-3 text-right font-mono text-xs font-bold text-emerald-600">
                  {{ formatCurrency(r.totalPaid) }}
                </td>
                <td class="p-3 text-right font-mono text-xs font-bold" :class="r.remaining > 0 ? 'text-amber-600' : 'text-stone-400'">
                  {{ formatCurrency(r.remaining) }}
                </td>
                <td class="p-3 text-center">
                  <span
                    v-if="r.status === 'Cancelled'"
                    class="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-950 dark:text-red-300"
                  >
                    Đã hủy
                  </span>
                  <span
                    v-else-if="r.isSettled"
                    class="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  >
                    Đã hoàn tất
                  </span>
                  <span
                    v-else-if="r.totalPaid > 0"
                    class="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  >
                    Còn thiếu
                  </span>
                  <span
                    v-else
                    class="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-600 dark:bg-stone-800 dark:text-stone-400"
                  >
                    Chưa đóng
                  </span>
                </td>
                <td class="p-3 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1">
                    <!-- Thu phí (camps.collect) -->
                    <UButton
                      v-if="can(PERMISSIONS.Camps.Collect) && r.status !== 'Cancelled' && !r.isSettled"
                      size="xs"
                      color="primary"
                      icon="i-lucide-credit-card"
                      @click="openPayModal(r)"
                    >
                      Thu phí
                    </UButton>

                    <!-- Lịch sử phiếu thu / Hoàn phí -->
                    <UButton
                      v-if="r.payments.length > 0"
                      size="xs"
                      variant="ghost"
                      color="neutral"
                      icon="i-lucide-history"
                      title="Lịch sử phiếu thu"
                      @click="openHistoryModal(r)"
                    />

                    <!-- Sửa tổ (camps.register) -->
                    <UButton
                      v-if="can(PERMISSIONS.Camps.Register) && r.status !== 'Cancelled'"
                      size="xs"
                      variant="ghost"
                      color="neutral"
                      icon="i-lucide-pencil"
                      title="Sửa tổ / ghi chú"
                      @click="openEditRegModal(r)"
                    />

                    <!-- Hủy đăng ký (camps.register) -->
                    <UButton
                      v-if="can(PERMISSIONS.Camps.Register) && r.status !== 'Cancelled'"
                      size="xs"
                      variant="ghost"
                      color="error"
                      icon="i-lucide-user-x"
                      title="Hủy đăng ký"
                      @click="openCancelRegModal(r)"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Modal Đăng Ký Đoàn Sinh Mới -->
    <UModal v-model:open="registerOpen" title="Đăng ký đoàn sinh tham gia sự kiện">
      <template #body>
        <div class="space-y-4">
          <div class="flex gap-2">
            <UInput
              v-model="studentSearchText"
              placeholder="Nhập tên hoặc mã đoàn sinh..."
              class="flex-1"
              @keyup.enter="searchStudents"
            />
            <UButton icon="i-lucide-search" @click="searchStudents">Tìm</UButton>
          </div>

          <!-- Kết quả tìm kiếm -->
          <div v-if="searchResults.length > 0" class="max-h-48 overflow-y-auto rounded-lg border border-stone-200 p-2 dark:border-stone-700 divide-y divide-stone-100 dark:divide-stone-800">
            <div
              v-for="s in searchResults"
              :key="s.id"
              class="flex items-center justify-between py-2 px-2 rounded cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/50"
              :class="selectedStudent?.id === s.id ? 'bg-marian-50 border border-marian-200 dark:bg-marian-950/30' : ''"
              @click="selectedStudent = s"
            >
              <div>
                <p class="font-medium text-sm text-stone-900 dark:text-stone-100">
                  {{ s.holyName ? `${s.holyName} ` : '' }}{{ s.fullName }}
                </p>
                <p class="text-xs text-stone-400 font-mono">{{ s.studentCode }}</p>
              </div>
              <UIcon
                v-if="selectedStudent?.id === s.id"
                name="i-lucide-check-circle"
                class="h-5 w-5 text-marian-600"
              />
            </div>
          </div>

          <div v-if="selectedStudent" class="rounded-lg bg-emerald-50 p-2.5 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            Đã chọn: <strong>{{ selectedStudent.holyName ? selectedStudent.holyName + ' ' : '' }}{{ selectedStudent.fullName }}</strong> ({{ selectedStudent.studentCode }})
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Tổ / Đội (Team)
              </label>
              <UInput v-model="registerForm.teamNumber" placeholder="Ví dụ: Tổ 1, Đội Gioan..." />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Ghi chú
              </label>
              <UInput v-model="registerForm.note" placeholder="Dị ứng, ăn chay, số áo..." />
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="registerOpen = false">Hủy</UButton>
          <UButton
            color="primary"
            :loading="registering"
            :disabled="!selectedStudent"
            @click="handleRegisterStudent"
          >
            Xác nhận đăng ký
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Thu Phí -->
    <UModal
      v-model:open="payOpen"
      title="Ghi nhận thu phí sự kiện"
      :description="`Đoàn sinh: ${targetReg?.studentHolyName ? targetReg.studentHolyName + ' ' : ''}${targetReg?.studentFullName}`"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Số tiền thu (VNĐ) <span class="text-red-500">*</span>
            </label>
            <UInput v-model.number="payForm.amount" type="number" step="10000" min="1000" />
            <p class="mt-1 text-xs text-stone-400">
              Còn thiếu: {{ formatCurrency(targetReg?.remaining || 0) }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Ngày thu
              </label>
              <UInput v-model="payForm.paidOn" type="date" />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
                Số phiếu thu / Biên lai
              </label>
              <UInput v-model="payForm.receiptNumber" placeholder="PT-001..." />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Ghi chú thu phí
            </label>
            <UInput v-model="payForm.note" placeholder="Người nộp thay, hình thức..." />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="payOpen = false">Hủy</UButton>
          <UButton
            color="primary"
            :loading="paying"
            :disabled="payForm.amount <= 0"
            @click="handleRecordPayment"
          >
            Lưu phiếu thu
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Sửa Tổ & Ghi Chú Đăng Ký -->
    <UModal v-model:open="editRegOpen" title="Cập nhật tổ & thông tin">
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Tổ / Đội
            </label>
            <UInput v-model="editRegForm.teamNumber" placeholder="Ví dụ: Tổ 2" />
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Ghi chú
            </label>
            <UTextarea v-model="editRegForm.note" placeholder="Ghi chú về đoàn sinh..." :rows="3" />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="editRegOpen = false">Hủy</UButton>
          <UButton color="primary" :loading="editingReg" @click="handleUpdateReg">Lưu thay đổi</UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Hủy Đăng Ký -->
    <UModal
      v-model:open="cancelRegOpen"
      title="Hủy đăng ký tham gia sự kiện"
      :description="`Đoàn sinh: ${targetReg?.studentHolyName ? targetReg.studentHolyName + ' ' : ''}${targetReg?.studentFullName}`"
    >
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="cancelRegOpen = false">Đóng</UButton>
          <UButton color="error" :loading="cancellingReg" @click="handleCancelRegistration">
            Xác nhận hủy
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Lịch Sử Phiếu Thu -->
    <UModal
      v-model:open="historyOpen"
      :title="`Lịch sử thu phí: ${targetReg?.studentHolyName ? targetReg.studentHolyName + ' ' : ''}${targetReg?.studentFullName}`"
    >
      <template #body>
        <div class="space-y-3">
          <div v-if="!targetReg?.payments || targetReg.payments.length === 0" class="text-center text-xs text-stone-500 py-4">
            Chưa có phiếu thu nào được ghi nhận.
          </div>
          <div
            v-for="p in targetReg?.payments"
            :key="p.id"
            class="flex items-center justify-between rounded-xl border border-stone-200 p-3 text-xs dark:border-stone-800"
            :class="p.amount < 0 ? 'bg-red-50/50 dark:bg-red-950/20' : ''"
          >
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold font-mono text-sm" :class="p.amount > 0 ? 'text-emerald-600' : 'text-red-500'">
                  {{ p.amount > 0 ? `+${formatCurrency(p.amount)}` : formatCurrency(p.amount) }}
                </span>
                <span v-if="p.receiptNumber" class="rounded bg-stone-100 px-1.5 py-0.2 font-mono text-[10px] text-stone-600 dark:bg-stone-800">
                  {{ p.receiptNumber }}
                </span>
              </div>
              <p class="text-stone-500 mt-1">
                Ngày: {{ p.paidOn }} • Người thu: {{ p.receivedByName }}
              </p>
              <p v-if="p.note" class="italic text-stone-400 mt-0.5">"{{ p.note }}"</p>
            </div>
            <UButton
              v-if="can(PERMISSIONS.Camps.Collect) && p.amount > 0 && !p.reversesPaymentId"
              size="xs"
              variant="outline"
              color="error"
              icon="i-lucide-undo-2"
              @click="openReverseModal(p)"
            >
              Hoàn phí
            </UButton>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <UButton variant="outline" @click="historyOpen = false">Đóng</UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Hoàn Phí / Đảo Ngược Phiếu Thu -->
    <UModal
      v-model:open="reverseOpen"
      title="Hoàn phí / Đảo ngược phiếu thu"
      description="Thao tác này sẽ ghi nhận một dòng tiền âm trong sổ cái tài chính sự kiện."
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Số tiền hoàn lại (VNĐ) <span class="text-red-500">*</span>
            </label>
            <UInput v-model.number="reverseForm.amount" type="number" step="10000" min="1000" />
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Lý do hoàn phí <span class="text-red-500">*</span>
            </label>
            <UTextarea v-model="reverseForm.reason" placeholder="Nhập lý do hoàn phí hoặc ghi nhầm..." :rows="3" />
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase text-stone-600 dark:text-stone-300 mb-1">
              Số biên lai chi (nếu có)
            </label>
            <UInput v-model="reverseForm.receiptNumber" placeholder="PC-001..." />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="reverseOpen = false">Hủy</UButton>
          <UButton
            color="error"
            :loading="reversing"
            :disabled="!reverseForm.reason.trim() || reverseForm.amount <= 0"
            @click="handleReversePayment"
          >
            Xác nhận hoàn phí
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
