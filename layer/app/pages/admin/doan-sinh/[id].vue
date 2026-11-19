<script setup lang="ts">
import type { ApiError } from '~/composables/useApi'
import { toApiError } from '~/composables/useApi'
import { PERMISSIONS } from '~/shared/permissions'

definePageMeta({
  layout: 'admin',
  permission: PERMISSIONS.Students.View
})

const route = useRoute()
const studentId = computed(() => String(route.params.id))
const api = useApi()
const permissions = usePermissions()

// State
const student = ref<any>(null)
const loading = ref(false)
const error = ref<ApiError | null>(null)
const activeTab = ref<'info' | 'sacraments' | 'certificates' | 'enrollments' | 'notes'>('info')

// Sub-data states
const guardians = ref<any[]>([])
const guardianLinks = ref<any[]>([])
const notes = ref<any[]>([])
const history = ref<any[]>([])
const enrollments = ref<any[]>([])
const sacraments = ref<any[]>([])
const requirements = ref<any[]>([])
const certificates = ref<any[]>([])

// Notes state
const newNoteContent = ref('')
const noteSubmitting = ref(false)

// Modals
const statusModalOpen = ref(false)
const targetStatus = ref('Active')
const statusReason = ref('')
const statusSubmitting = ref(false)

const editModalOpen = ref(false)
const editFullName = ref('')
const editHolyName = ref('')
const editGender = ref<'Male' | 'Female'>('Male')
const editDob = ref('')
const editParishArea = ref('')
const editAddress = ref('')
const editBloodType = ref('')
const editAllergies = ref('')
const editHealthNotes = ref('')
const editSubmitting = ref(false)

const photoInput = ref<HTMLInputElement | null>(null)
const photoLoading = ref(false)

// Issue Certificate Modal
const certModalOpen = ref(false)
const certType = ref<'Baptism' | 'FirstCommunion' | 'Confirmation'>('Baptism')
const certSubmitting = ref(false)

// Guardian link modal
const linkGuardianModalOpen = ref(false)
const linkGuardianUserId = ref('')
const linkRelationship = ref('Phụ huynh')
const linkSubmitting = ref(false)

async function loadStudent() {
  loading.value = true
  error.value = null
  try {
    student.value = await api.get(`/students/${studentId.value}`)
    await Promise.allSettled([
      loadGuardians(),
      loadGuardianLinks(),
      loadNotes(),
      loadEnrollments(),
      loadSacraments(),
      loadRequirements(),
      loadCertificates(),
      loadHistory()
    ])
  } catch (e) {
    error.value = toApiError(e)
  } finally {
    loading.value = false
  }
}

async function loadGuardians() {
  try {
    guardians.value = await api.get(`/students/${studentId.value}/guardians`)
  } catch { /* optional */ }
}

async function loadGuardianLinks() {
  if (!permissions.can(PERMISSIONS.Guardians.Link)) return
  try {
    guardianLinks.value = await api.get('/guardian-links', { studentId: studentId.value })
  } catch { /* optional */ }
}

async function loadNotes() {
  try {
    notes.value = await api.get(`/students/${studentId.value}/notes`)
  } catch { /* optional */ }
}

async function loadEnrollments() {
  if (!permissions.can(PERMISSIONS.Enrollments.View)) return
  try {
    enrollments.value = await api.get(`/students/${studentId.value}/enrollments`)
  } catch { /* optional */ }
}

async function loadHistory() {
  try {
    history.value = await api.get(`/students/${studentId.value}/history`)
  } catch { /* optional */ }
}

async function loadSacraments() {
  if (!permissions.can(PERMISSIONS.Sacraments.View)) return
  try {
    sacraments.value = await api.get(`/students/${studentId.value}/sacraments`)
  } catch { /* optional */ }
}

async function loadRequirements() {
  if (!permissions.can(PERMISSIONS.Sacraments.View)) return
  try {
    requirements.value = await api.get(`/students/${studentId.value}/requirement-progress`)
  } catch { /* optional */ }
}

async function loadCertificates() {
  if (!permissions.can(PERMISSIONS.Certificates.View)) return
  try {
    certificates.value = await api.get(`/students/${studentId.value}/certificates`)
  } catch { /* optional */ }
}

// Photo upload
async function handlePhotoUpload(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  photoLoading.value = true
  try {
    const formData = new FormData()
    formData.append('photo', file)
    await api.post(`/students/${studentId.value}/photo`, formData)
    await loadStudent()
  } catch (err) {
    error.value = toApiError(err)
  } finally {
    photoLoading.value = false
    target.value = ''
  }
}

// Status change
async function changeStatus() {
  statusSubmitting.value = true
  try {
    await api.post(`/students/${studentId.value}/status`, {
      status: targetStatus.value,
      reason: statusReason.value || null
    })
    statusModalOpen.value = false
    await loadStudent()
  } catch (err) {
    error.value = toApiError(err)
  } finally {
    statusSubmitting.value = false
  }
}

// Soft Delete & Restore
async function deleteStudent() {
  if (!confirm('Bạn có chắc chắn muốn xóa hồ sơ đoàn sinh này?')) return
  try {
    await api.del(`/students/${studentId.value}`)
    await loadStudent()
  } catch (err) {
    error.value = toApiError(err)
  }
}

async function restoreStudent() {
  try {
    await api.post(`/students/${studentId.value}/restore`)
    await loadStudent()
  } catch (err) {
    error.value = toApiError(err)
  }
}

// Edit Profile
function openEditModal() {
  if (!student.value) return
  editFullName.value = student.value.fullName || ''
  editHolyName.value = student.value.holyName || ''
  editGender.value = student.value.gender || 'Male'
  editDob.value = student.value.dateOfBirth ? student.value.dateOfBirth.slice(0, 10) : ''
  editParishArea.value = student.value.parishArea || ''
  editAddress.value = student.value.address || ''
  editBloodType.value = student.value.bloodType || ''
  editAllergies.value = student.value.allergies || ''
  editHealthNotes.value = student.value.healthNotes || ''
  editModalOpen.value = true
}

async function saveProfile() {
  editSubmitting.value = true
  try {
    await api.patch(`/students/${studentId.value}`, {
      fullName: editFullName.value.trim(),
      holyName: editHolyName.value.trim() || null,
      gender: editGender.value,
      dateOfBirth: editDob.value,
      parishArea: editParishArea.value.trim() || null,
      address: editAddress.value.trim() || null,
      bloodType: editBloodType.value.trim() || null,
      allergies: editAllergies.value.trim() || null,
      healthNotes: editHealthNotes.value.trim() || null
    })
    editModalOpen.value = false
    await loadStudent()
  } catch (err) {
    error.value = toApiError(err)
  } finally {
    editSubmitting.value = false
  }
}

// Notes
async function addNote() {
  if (!newNoteContent.value.trim()) return
  noteSubmitting.value = true
  try {
    await api.post(`/students/${studentId.value}/notes`, {
      content: newNoteContent.value.trim()
    })
    newNoteContent.value = ''
    await loadNotes()
  } catch (err) {
    error.value = toApiError(err)
  } finally {
    noteSubmitting.value = false
  }
}

async function deleteNote(noteId: string) {
  if (!confirm('Xóa ghi chú này?')) return
  try {
    await api.del(`/student-notes/${noteId}`)
    await loadNotes()
  } catch (err) {
    error.value = toApiError(err)
  }
}

// Sacraments
async function updateSacrament(type: string, date: string, church: string) {
  try {
    await api.put(`/students/${studentId.value}/sacraments/${type}`, { date, church })
    await loadSacraments()
  } catch (err) {
    error.value = toApiError(err)
  }
}

async function removeSacrament(type: string) {
  if (!confirm(`Xóa thông tin bí tích ${type}?`)) return
  try {
    await api.del(`/students/${studentId.value}/sacraments/${type}`)
    await loadSacraments()
  } catch (err) {
    error.value = toApiError(err)
  }
}

// Certificates
async function issueCertificate() {
  certSubmitting.value = true
  try {
    await api.post(`/students/${studentId.value}/certificates`, { sacramentType: certType.value })
    certModalOpen.value = false
    await loadCertificates()
  } catch (err) {
    error.value = toApiError(err)
  } finally {
    certSubmitting.value = false
  }
}

async function revokeCertificate(certId: string) {
  const reason = prompt('Nhập lý do thu hồi chứng chỉ này:')
  if (!reason) return
  try {
    await api.post(`/certificates/${certId}/revoke`, { reason })
    await loadCertificates()
  } catch (err) {
    error.value = toApiError(err)
  }
}

async function downloadCertPdf(certId: string, certCode: string) {
  try {
    const blob = await api.download<Blob>(`/certificates/${certId}/pdf`)
    const url = window.URL.createObjectURL(blob as Blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Chung_Chi_${certCode}.pdf`
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    error.value = toApiError(err)
  }
}

// Guardian Link
async function linkGuardian() {
  if (!linkGuardianUserId.value.trim()) return
  linkSubmitting.value = true
  try {
    await api.post('/guardian-links', {
      studentId: studentId.value,
      userId: linkGuardianUserId.value.trim(),
      relationship: linkRelationship.value
    })
    linkGuardianModalOpen.value = false
    linkGuardianUserId.value = ''
    await loadGuardianLinks()
  } catch (err) {
    error.value = toApiError(err)
  } finally {
    linkSubmitting.value = false
  }
}

async function unlinkGuardian(linkId: string) {
  if (!confirm('Hủy liên kết tài khoản phụ huynh này?')) return
  try {
    await api.del(`/guardian-links/${linkId}`)
    await loadGuardianLinks()
  } catch (err) {
    error.value = toApiError(err)
  }
}

onMounted(loadStudent)
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      :title="student ? `${student.holyName || ''} ${student.fullName}` : 'Hồ sơ đoàn sinh'"
      :subtitle="student ? `Mã đoàn sinh: ${student.code} · ${student.className || 'Chưa xếp lớp'}` : ''"
    >
      <template #actions>
        <UButton variant="outline" color="neutral" icon="i-lucide-arrow-left" to="/admin/doan-sinh">
          Danh sách
        </UButton>
        <UButton
          v-if="permissions.can(PERMISSIONS.Students.Update) && student && !student.isDeleted"
          variant="outline"
          icon="i-lucide-pencil"
          @click="openEditModal"
        >
          Sửa hồ sơ
        </UButton>
        <UButton
          v-if="permissions.can(PERMISSIONS.Students.ChangeStatus) && student && !student.isDeleted"
          variant="outline"
          color="warning"
          icon="i-lucide-repeat"
          @click="statusModalOpen = true"
        >
          Đổi trạng thái
        </UButton>
        <UButton
          v-if="permissions.can(PERMISSIONS.Students.Delete) && student && !student.isDeleted"
          variant="ghost"
          color="error"
          icon="i-lucide-trash-2"
          @click="deleteStudent"
        >
          Xóa
        </UButton>
        <UButton
          v-if="permissions.can(PERMISSIONS.Students.Restore) && student?.isDeleted"
          color="success"
          icon="i-lucide-rotate-ccw"
          @click="restoreStudent"
        >
          Khôi phục
        </UButton>
      </template>
    </PageHeader>

    <ErrorState :error="error" @retry="loadStudent" />

    <div v-if="loading" class="h-64 animate-pulse rounded-xl bg-stone-200 dark:bg-stone-800" />

    <div v-else-if="student" class="space-y-6">
      <!-- HEADER THÔNG TIN ĐOÀN SINH -->
      <div class="flex flex-col gap-6 rounded-xl border border-stone-200 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900 sm:flex-row sm:items-center">
        <!-- Avatar Arch-frame -->
        <div class="relative mx-auto size-28 shrink-0 sm:mx-0">
          <div class="arch-frame grid size-full place-items-center overflow-hidden bg-vatican-100 text-vatican-700 shadow-inner dark:bg-vatican-900/40 dark:text-vatican-300">
            <img v-if="student.photoUrl" :src="student.photoUrl" :alt="student.fullName" class="size-full object-cover">
            <span v-else class="text-4xl font-serif">✝</span>
          </div>
          <button
            type="button"
            class="absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-full border border-white bg-marian-600 text-white shadow-xs hover:bg-marian-700 dark:border-stone-900"
            title="Đổi ảnh đoàn sinh"
            :disabled="photoLoading"
            @click="photoInput?.click()"
          >
            <UIcon :name="photoLoading ? 'i-lucide-loader-2' : 'i-lucide-camera'" class="size-4" :class="photoLoading ? 'animate-spin' : ''" />
          </button>
          <input ref="photoInput" type="file" accept="image/*" class="hidden" @change="handlePhotoUpload">
        </div>

        <!-- Info summary -->
        <div class="flex-1 space-y-2 text-center sm:text-left">
          <div class="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <h1 class="font-display text-2xl font-bold text-stone-900 dark:text-white">
              <span v-if="student.holyName" class="text-vatican-600 dark:text-vatican-400 mr-1.5">{{ student.holyName }}</span>
              {{ student.fullName }}
            </h1>
            <StatusChip domain="student" :value="student.status" />
            <UBadge v-if="student.isDeleted" color="error" variant="subtle" size="sm">
              Đã xóa mềm
            </UBadge>
          </div>

          <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-stone-600 dark:text-stone-400 sm:justify-start">
            <span>Mã: <strong class="font-mono">{{ student.code }}</strong></span>
            <span>Giới tính: <strong>{{ student.gender === 'Male' ? 'Nam' : 'Nữ' }}</strong></span>
            <span>Sinh ngày: <strong>{{ student.dateOfBirth }}</strong> ({{ student.age }} tuổi)</span>
            <span>Giáo họ: <strong>{{ student.parishArea || '–' }}</strong></span>
          </div>
        </div>
      </div>

      <!-- TABS ĐIỀU HƯỚNG CHI TIẾT -->
      <div class="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-2 dark:border-stone-800">
        <UButton
          :variant="activeTab === 'info' ? 'solid' : 'ghost'"
          :color="activeTab === 'info' ? 'primary' : 'neutral'"
          size="sm"
          icon="i-lucide-user"
          @click="activeTab = 'info'"
        >
          Thông tin & Liên hệ
        </UButton>
        <UButton
          v-if="permissions.can(PERMISSIONS.Sacraments.View)"
          :variant="activeTab === 'sacraments' ? 'solid' : 'ghost'"
          :color="activeTab === 'sacraments' ? 'primary' : 'neutral'"
          size="sm"
          icon="i-lucide-church"
          @click="activeTab = 'sacraments'"
        >
          Bí tích & Yêu cầu
        </UButton>
        <UButton
          v-if="permissions.can(PERMISSIONS.Certificates.View)"
          :variant="activeTab === 'certificates' ? 'solid' : 'ghost'"
          :color="activeTab === 'certificates' ? 'primary' : 'neutral'"
          size="sm"
          icon="i-lucide-award"
          @click="activeTab = 'certificates'"
        >
          Chứng chỉ ({{ certificates.length }})
        </UButton>
        <UButton
          v-if="permissions.can(PERMISSIONS.Enrollments.View)"
          :variant="activeTab === 'enrollments' ? 'solid' : 'ghost'"
          :color="activeTab === 'enrollments' ? 'primary' : 'neutral'"
          size="sm"
          icon="i-lucide-history"
          @click="activeTab = 'enrollments'"
        >
          Lịch sử học tập
        </UButton>
        <UButton
          :variant="activeTab === 'notes' ? 'solid' : 'ghost'"
          :color="activeTab === 'notes' ? 'primary' : 'neutral'"
          size="sm"
          icon="i-lucide-message-square"
          @click="activeTab = 'notes'"
        >
          Ghi chú mục vụ ({{ notes.length }})
        </UButton>
      </div>

      <!-- TAB 1: THÔNG TIN CÁ NHÂN & LIÊN HỆ PHỤ HUYNH -->
      <div v-if="activeTab === 'info'" class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Phụ huynh & Liên lạc -->
        <div class="space-y-4 rounded-xl border border-stone-200 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900">
          <h2 class="text-base font-bold text-marian-700 dark:text-marian-300">
            Thông tin Phụ huynh & Liên hệ
          </h2>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between border-b border-stone-100 pb-2 dark:border-stone-800">
              <span class="text-stone-500">Họ tên Cha:</span>
              <strong>{{ student.fatherName || '–' }}</strong>
            </div>
            <div class="flex justify-between border-b border-stone-100 pb-2 dark:border-stone-800">
              <span class="text-stone-500">Họ tên Mẹ:</span>
              <strong>{{ student.motherName || '–' }}</strong>
            </div>
            <div class="flex justify-between border-b border-stone-100 pb-2 dark:border-stone-800">
              <span class="text-stone-500">Số điện thoại:</span>
              <MaskedField :value="student.guardianPhone" :permission="PERMISSIONS.Students.ViewContact" placeholder="Đã ẩn SĐT phụ huynh" />
            </div>
            <div class="flex justify-between">
              <span class="text-stone-500">Địa chỉ nhà:</span>
              <MaskedField :value="student.address" :permission="PERMISSIONS.Students.ViewContact" placeholder="Đã ẩn địa chỉ" />
            </div>
          </div>

          <!-- Liên kết tài khoản phụ huynh -->
          <div class="mt-4 border-t border-stone-100 pt-4 dark:border-stone-800">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xs font-bold uppercase tracking-wider text-stone-500">
                Tài khoản Phụ huynh kết nối portal
              </h3>
              <UButton
                v-if="permissions.can(PERMISSIONS.Guardians.Link)"
                size="xs"
                variant="ghost"
                icon="i-lucide-plus"
                @click="linkGuardianModalOpen = true"
              >
                Liên kết TK
              </UButton>
            </div>
            <div v-if="guardianLinks.length === 0" class="text-xs text-stone-400 italic">
              Chưa có tài khoản phụ huynh nào liên kết.
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="g in guardianLinks"
                :key="g.id"
                class="flex items-center justify-between rounded-lg bg-stone-50 p-2 text-xs dark:bg-stone-800"
              >
                <div>
                  <strong>{{ g.guardianFullName || g.guardianUserName }}</strong>
                  <span class="text-stone-500"> ({{ g.relationship || 'Phụ huynh' }})</span>
                </div>
                <UButton
                  v-if="permissions.can(PERMISSIONS.Guardians.Link)"
                  size="xs"
                  variant="ghost"
                  color="error"
                  icon="i-lucide-x"
                  @click="unlinkGuardian(g.id)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Sức khỏe & Thể trạng -->
        <div class="space-y-4 rounded-xl border border-stone-200 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900">
          <h2 class="text-base font-bold text-marian-700 dark:text-marian-300">
            Hồ sơ Sức khỏe & Thể trạng
          </h2>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between border-b border-stone-100 pb-2 dark:border-stone-800">
              <span class="text-stone-500">Nhóm máu:</span>
              <MaskedField :value="student.bloodType" :permission="PERMISSIONS.Students.ViewHealth" placeholder="Đã ẩn nhóm máu" />
            </div>
            <div class="flex justify-between border-b border-stone-100 pb-2 dark:border-stone-800">
              <span class="text-stone-500">Dị ứng thức ăn/thuốc:</span>
              <MaskedField :value="student.allergies" :permission="PERMISSIONS.Students.ViewHealth" placeholder="Đã ẩn thông tin dị ứng" />
            </div>
            <div class="space-y-1">
              <span class="text-stone-500 block">Ghi chú sức khỏe:</span>
              <MaskedField :value="student.healthNotes" :permission="PERMISSIONS.Students.ViewHealth" placeholder="Đã ẩn ghi chú sức khỏe" />
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: BÍ TÍCH & TIẾN TRÌNH YÊU CẦU -->
      <div v-if="activeTab === 'sacraments'" class="space-y-6">
        <div class="rounded-xl border border-stone-200 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900">
          <h2 class="mb-4 text-base font-bold text-marian-700 dark:text-marian-300">
            Các Bí tích đã lãnh nhận
          </h2>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <!-- Rửa tội -->
            <div class="rounded-lg border border-stone-200 p-4 dark:border-stone-800">
              <h3 class="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                <UIcon name="i-lucide-droplets" class="text-blue-500" />
                <span>Rửa Tội</span>
              </h3>
              <p class="mt-2 text-xs text-stone-600 dark:text-stone-400">
                Ngày: <strong>{{ student.baptismDate || 'Chưa lãnh nhận' }}</strong>
              </p>
              <p class="text-xs text-stone-500">
                Giáo xứ: {{ student.baptismChurch || '–' }}
              </p>
            </div>

            <!-- Thánh Thể -->
            <div class="rounded-lg border border-stone-200 p-4 dark:border-stone-800">
              <h3 class="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                <UIcon name="i-lucide-sun" class="text-amber-500" />
                <span>Xưng Tội & Rước Lễ Lần Đầu</span>
              </h3>
              <p class="mt-2 text-xs text-stone-600 dark:text-stone-400">
                Ngày: <strong>{{ student.firstCommunionDate || 'Chưa lãnh nhận' }}</strong>
              </p>
              <p class="text-xs text-stone-500">
                Giáo xứ: {{ student.firstCommunionChurch || '–' }}
              </p>
            </div>

            <!-- Thêm Sức -->
            <div class="rounded-lg border border-stone-200 p-4 dark:border-stone-800">
              <h3 class="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                <UIcon name="i-lucide-flame" class="text-red-500" />
                <span>Thêm Sức</span>
              </h3>
              <p class="mt-2 text-xs text-stone-600 dark:text-stone-400">
                Ngày: <strong>{{ student.confirmationDate || 'Chưa lãnh nhận' }}</strong>
              </p>
              <p class="text-xs text-stone-500">
                Giáo xứ: {{ student.confirmationChurch || '–' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: CHỨNG CHỈ BÍ TÍCH -->
      <div v-if="activeTab === 'certificates'" class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-bold text-marian-700 dark:text-marian-300">
            Chứng chỉ Bí tích đã cấp
          </h2>
          <UButton
            v-if="permissions.can(PERMISSIONS.Certificates.Issue)"
            size="sm"
            icon="i-lucide-plus"
            @click="certModalOpen = true"
          >
            Cấp chứng chỉ mới
          </UButton>
        </div>

        <div v-if="certificates.length === 0" class="text-center py-8">
          <EmptyState title="Chưa có chứng chỉ nào được cấp" description="Nhấn Cấp chứng chỉ mới khi đoàn sinh đã hoàn thành khóa giáo lý và lãnh nhận bí tích." />
        </div>

        <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div
            v-for="cert in certificates"
            :key="cert.id"
            class="flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-4 shadow-xs dark:border-stone-800 dark:bg-stone-900"
          >
            <div>
              <div class="flex items-start justify-between">
                <div>
                  <span class="font-mono text-xs font-bold text-vatican-600 dark:text-vatican-400">
                    {{ cert.code }}
                  </span>
                  <h3 class="font-bold text-base text-stone-900 dark:text-white mt-1">
                    Chứng Chỉ {{ cert.sacramentType }}
                  </h3>
                </div>
                <StatusChip domain="certificate" :value="cert.status" />
              </div>
              <p class="mt-2 text-xs text-stone-500">
                Ngày cấp: {{ cert.issuedDate }} · Người cấp: {{ cert.issuedBy || 'Ban Giáo Lý' }}
              </p>
              <p v-if="cert.revokedReason" class="mt-1 text-xs text-red-600">
                Lý do thu hồi: {{ cert.revokedReason }}
              </p>
            </div>

            <div class="mt-4 flex items-center justify-end gap-2 border-t border-stone-100 pt-3 dark:border-stone-800">
              <UButton
                size="xs"
                variant="outline"
                icon="i-lucide-printer"
                @click="downloadCertPdf(cert.id, cert.code)"
              >
                In / Tải PDF
              </UButton>
              <UButton
                v-if="permissions.can(PERMISSIONS.Certificates.Revoke) && cert.status === 'Issued'"
                size="xs"
                variant="ghost"
                color="error"
                icon="i-lucide-ban"
                @click="revokeCertificate(cert.id)"
              >
                Thu hồi
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 4: LỊCH SỬ GHI DANH -->
      <div v-if="activeTab === 'enrollments'" class="space-y-4">
        <div class="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900">
          <table class="w-full text-left text-sm">
            <thead class="border-b border-stone-200 bg-stone-50 text-xs font-semibold uppercase text-stone-600 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-400">
              <tr>
                <th class="px-4 py-3">Niên khóa</th>
                <th class="px-4 py-3">Lớp học</th>
                <th class="px-4 py-3">Kết quả</th>
                <th class="px-4 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
              <tr v-if="enrollments.length === 0">
                <td colspan="4" class="p-6 text-center text-xs text-stone-400">
                  Chưa có lịch sử ghi danh lớp học nào.
                </td>
              </tr>
              <tr v-for="e in enrollments" :key="e.id">
                <td class="px-4 py-3 font-medium">{{ e.academicYearName }}</td>
                <td class="px-4 py-3">{{ e.className }}</td>
                <td class="px-4 py-3 text-xs">
                  <span v-if="e.finalGpa !== undefined">ĐTB: <strong>{{ e.finalGpa }}</strong></span>
                  <span v-else class="text-stone-400">Đang học</span>
                </td>
                <td class="px-4 py-3">
                  <StatusChip domain="enrollment" :value="e.status" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 5: GHI CHÚ MỤC VỤ -->
      <div v-if="activeTab === 'notes'" class="space-y-4">
        <!-- Form thêm ghi chú -->
        <div
          v-if="permissions.can(PERMISSIONS.Students.NotesWrite)"
          class="rounded-xl border border-stone-200 bg-white p-4 shadow-xs dark:border-stone-800 dark:bg-stone-900"
        >
          <UFormField label="Viết ghi chú mới về đoàn sinh (chỉ người có thẩm quyền mới thấy)" name="note">
            <UTextarea
              v-model="newNoteContent"
              placeholder="Nhập ghi chú mục vụ, hoàn cảnh gia đình hoặc lưu ý đặc biệt..."
              rows="3"
              class="w-full"
            />
          </UFormField>
          <div class="mt-3 flex justify-end">
            <UButton
              size="sm"
              icon="i-lucide-send"
              :loading="noteSubmitting"
              :disabled="!newNoteContent.trim()"
              @click="addNote"
            >
              Lưu ghi chú
            </UButton>
          </div>
        </div>

        <!-- Danh sách ghi chú -->
        <div v-if="notes.length === 0" class="text-center py-6 text-xs text-stone-400">
          Chưa có ghi chú nào về đoàn sinh này.
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="n in notes"
            :key="n.id"
            class="flex items-start justify-between rounded-xl border border-stone-200 bg-white p-4 shadow-xs dark:border-stone-800 dark:bg-stone-900"
          >
            <div>
              <p class="text-sm text-stone-800 dark:text-stone-200 whitespace-pre-wrap">
                {{ n.content }}
              </p>
              <div class="mt-2 text-xs text-stone-400">
                Người viết: <strong>{{ n.authorName || 'Giáo lý viên' }}</strong> · {{ formatDateTime(n.createdAt) }}
              </div>
            </div>
            <UButton
              v-if="permissions.can(PERMISSIONS.Students.NotesWrite)"
              size="xs"
              variant="ghost"
              color="error"
              icon="i-lucide-trash-2"
              @click="deleteNote(n.id)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL ĐỔI TRẠNG THÁI -->
    <UModal v-model:open="statusModalOpen" title="Đổi trạng thái đoàn sinh">
      <template #body>
        <div class="space-y-4">
          <UFormField label="Chọn trạng thái mới" name="status">
            <select
              v-model="targetStatus"
              class="w-full rounded-md border border-stone-300 bg-white p-2 text-sm dark:border-stone-700 dark:bg-stone-900 dark:text-white"
            >
              <option value="Active">Đang học</option>
              <option value="Paused">Tạm nghỉ</option>
              <option value="Left">Đã nghỉ</option>
              <option value="Graduated">Đã tốt nghiệp</option>
            </select>
          </UFormField>
          <UFormField label="Lý do thay đổi" name="reason">
            <UInput v-model="statusReason" placeholder="Nhập lý do..." class="w-full" />
          </UFormField>
          <div class="flex justify-end gap-2 pt-2">
            <UButton variant="ghost" color="neutral" @click="statusModalOpen = false">Hủy</UButton>
            <UButton color="primary" :loading="statusSubmitting" @click="changeStatus">Cập nhật</UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- MODAL CẤP CHỨNG CHỈ -->
    <UModal v-model:open="certModalOpen" title="Cấp Chứng Chỉ Bí Tích">
      <template #body>
        <div class="space-y-4">
          <UFormField label="Chọn loại Bí tích cấp chứng chỉ" name="certType">
            <select
              v-model="certType"
              class="w-full rounded-md border border-stone-300 bg-white p-2 text-sm dark:border-stone-700 dark:bg-stone-900 dark:text-white"
            >
              <option value="Baptism">Bí tích Rửa Tội</option>
              <option value="FirstCommunion">Bí tích Thánh Thể (Rước Lễ)</option>
              <option value="Confirmation">Bí tích Thêm Sức</option>
            </select>
          </UFormField>
          <div class="flex justify-end gap-2 pt-2">
            <UButton variant="ghost" color="neutral" @click="certModalOpen = false">Hủy</UButton>
            <UButton color="primary" :loading="certSubmitting" @click="issueCertificate">Cấp chứng chỉ</UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- MODAL LIÊN KẾT PHỤ HUYNH -->
    <UModal v-model:open="linkGuardianModalOpen" title="Liên kết tài khoản Phụ huynh">
      <template #body>
        <div class="space-y-4">
          <UFormField label="Mã hoặc Tên đăng nhập phụ huynh" name="userId" required>
            <UInput v-model="linkGuardianUserId" placeholder="Nhập ID tài khoản phụ huynh..." class="w-full" required />
          </UFormField>
          <UFormField label="Quan hệ với đoàn sinh" name="relationship">
            <select
              v-model="linkRelationship"
              class="w-full rounded-md border border-stone-300 bg-white p-2 text-sm dark:border-stone-700 dark:bg-stone-900 dark:text-white"
            >
              <option value="Cha">Cha</option>
              <option value="Mẹ">Mẹ</option>
              <option value="Người giám hộ">Người giám hộ</option>
            </select>
          </UFormField>
          <div class="flex justify-end gap-2 pt-2">
            <UButton variant="ghost" color="neutral" @click="linkGuardianModalOpen = false">Hủy</UButton>
            <UButton color="primary" :loading="linkSubmitting" @click="linkGuardian">Liên kết</UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
