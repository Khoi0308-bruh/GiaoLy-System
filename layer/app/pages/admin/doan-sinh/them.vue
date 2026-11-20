<script setup lang="ts">
import type { ApiError } from '~/composables/useApi'
import { toApiError } from '~/composables/useApi'
import { PERMISSIONS } from '~/shared/permissions'

definePageMeta({
  layout: 'admin',
  permission: PERMISSIONS.Students.Create
})

interface ClassroomRef {
  id: string
  name: string
  branchName?: string
  classLevelName?: string
}

interface DuplicateCheckResult {
  level: 'None' | 'Probable' | 'Exact'
  message?: string | null
  existingStudentId?: string | null
  existingStudentCode?: string | null
  existingStudentFullName?: string | null
}

interface GuardianInput {
  fullName: string
  phone: string
  relationship: string
  isPrimary: boolean
}

const api = useApi()
const permissions = usePermissions()
const toast = useToast()

// Form fields
const holyName = ref('')
const fullName = ref('')
const gender = ref<'Male' | 'Female'>('Male')
const dateOfBirth = ref('')
const parishArea = ref('')

// Sacraments
const baptismDate = ref('')
const baptismChurch = ref('')
const firstCommunionDate = ref('')
const firstCommunionChurch = ref('')
const confirmationDate = ref('')
const confirmationChurch = ref('')

// Guardians
const fatherName = ref('')
const fatherPhone = ref('')
const motherName = ref('')
const motherPhone = ref('')
const address = ref('')

// Health
const bloodType = ref('')
const allergies = ref('')
const healthNotes = ref('')

// Direct enrollment (optional)
const activeYearId = ref<string | null>(null)
const classrooms = ref<ClassroomRef[]>([])
const selectedClassroomId = ref<string>('')

// Form state
const loading = ref(false)
const checkingDuplicates = ref(false)
const duplicateWarning = ref<DuplicateCheckResult | null>(null)
const error = ref<ApiError | null>(null)
const formError = ref<string | null>(null)

// Tải danh sách lớp học nếu có niên khóa đang hoạt động
async function loadClassrooms() {
  if (!permissions.can(PERMISSIONS.Academic.View)) return
  try {
    const activeYear = await api.get<{ id: string }>('/academic-years/active').catch(() => null)
    if (activeYear?.id) {
      activeYearId.value = activeYear.id
      const res = await api.get<ClassroomRef[]>(`/academic-years/${activeYear.id}/classrooms`)
      classrooms.value = Array.isArray(res) ? res : []
    }
  } catch {
    // Supplementary
  }
}

// Kiểm tra trùng lặp
async function checkDuplicate() {
  if (!fullName.value.trim() || !dateOfBirth.value) return
  checkingDuplicates.value = true
  duplicateWarning.value = null
  try {
    const res = await api.post<DuplicateCheckResult>('/students/duplicates/check', {
      fullName: fullName.value.trim(),
      birthDate: dateOfBirth.value,
      guardianPhones: [fatherPhone.value.trim(), motherPhone.value.trim()].filter(Boolean)
    })
    if (res?.level && res.level !== 'None') {
      duplicateWarning.value = res
    }
  } catch {
    // Bỏ qua lỗi kiểm tra trùng lặp, API tạo mới vẫn chặn trùng ở bước sau
  } finally {
    checkingDuplicates.value = false
  }
}

const SACRAMENT_LABELS: Record<string, string> = {
  Baptism: 'Rửa Tội',
  FirstCommunion: 'Rước Lễ Lần Đầu',
  Confirmation: 'Thêm Sức'
}

// Dựng danh sách phụ huynh đúng GuardianDto: mỗi người cần họ tên và số điện thoại
// vì API dùng số điện thoại làm khóa nhận diện phụ huynh.
function buildGuardians(): GuardianInput[] {
  const guardians: GuardianInput[] = []
  if (fatherName.value.trim() && fatherPhone.value.trim()) {
    guardians.push({
      fullName: fatherName.value.trim(),
      phone: fatherPhone.value.trim(),
      relationship: 'Cha',
      isPrimary: true
    })
  }
  if (motherName.value.trim() && motherPhone.value.trim()) {
    guardians.push({
      fullName: motherName.value.trim(),
      phone: motherPhone.value.trim(),
      relationship: 'Mẹ',
      isPrimary: guardians.length === 0
    })
  }
  return guardians
}

function validateGuardians(): string | null {
  if (fatherName.value.trim() && !fatherPhone.value.trim()) {
    return 'Vui lòng nhập số điện thoại của Cha, hoặc để trống cả họ tên Cha.'
  }
  if (fatherPhone.value.trim() && !fatherName.value.trim()) {
    return 'Vui lòng nhập họ tên của Cha.'
  }
  if (motherName.value.trim() && !motherPhone.value.trim()) {
    return 'Vui lòng nhập số điện thoại của Mẹ, hoặc để trống cả họ tên Mẹ.'
  }
  if (motherPhone.value.trim() && !motherName.value.trim()) {
    return 'Vui lòng nhập họ tên của Mẹ.'
  }
  return null
}

// API tạo mới không nhận thông tin bí tích, phải ghi từng bí tích sau khi hồ sơ đã có Id
async function saveSacraments(studentId: string): Promise<string[]> {
  const items = [
    { type: 'Baptism', date: baptismDate.value, place: baptismChurch.value },
    { type: 'FirstCommunion', date: firstCommunionDate.value, place: firstCommunionChurch.value },
    { type: 'Confirmation', date: confirmationDate.value, place: confirmationChurch.value }
  ].filter(item => !!item.date)

  const failed: string[] = []
  for (const item of items) {
    try {
      await api.put(`/students/${studentId}/sacraments/${item.type}`, {
        receivedOn: item.date,
        place: item.place.trim() || null
      })
    } catch {
      failed.push(SACRAMENT_LABELS[item.type] ?? item.type)
    }
  }
  return failed
}

async function submit() {
  error.value = null
  formError.value = null

  const guardianMessage = validateGuardians()
  if (guardianMessage) {
    formError.value = guardianMessage
    return
  }

  if (duplicateWarning.value?.level === 'Exact') {
    formError.value = `Hồ sơ trùng hoàn toàn với đoàn sinh ${duplicateWarning.value.existingStudentCode ?? ''} (${duplicateWarning.value.existingStudentFullName ?? ''}). Vui lòng mở hồ sơ đó thay vì tạo mới.`
    return
  }

  loading.value = true

  try {
    const created = await api.post<{ id: string }>('/students', {
      holyName: holyName.value.trim() || null,
      fullName: fullName.value.trim(),
      birthDate: dateOfBirth.value,
      gender: gender.value,
      area: parishArea.value.trim() || null,
      address: address.value.trim() || null,
      bloodType: bloodType.value.trim() || null,
      allergies: allergies.value.trim() || null,
      healthNotes: healthNotes.value.trim() || null,
      classRoomId: selectedClassroomId.value || null,
      guardians: buildGuardians(),
      hasPhotoConsent: false,
      confirmWarning: duplicateWarning.value?.level === 'Probable'
    })

    const failedSacraments = await saveSacraments(created.id)
    if (failedSacraments.length) {
      toast.add({
        title: 'Chưa ghi nhận được một số bí tích',
        description: `Hồ sơ đã được tạo nhưng chưa lưu: ${failedSacraments.join(', ')}. Vui lòng bổ sung ở trang chi tiết (kiểm tra thứ tự ngày).`,
        color: 'warning'
      })
    }

    await navigateTo(`/admin/doan-sinh/${created.id}`)
  } catch (e) {
    error.value = toApiError(e)
  } finally {
    loading.value = false
  }
}

onMounted(loadClassrooms)
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Thêm đoàn sinh mới"
      subtitle="Nhập thông tin cá nhân, bí tích, liên hệ phụ huynh và phân lớp"
    >
      <template #actions>
        <UButton variant="outline" color="neutral" icon="i-lucide-arrow-left" to="/admin/doan-sinh">
          Quay lại danh sách
        </UButton>
      </template>
    </PageHeader>

    <ErrorState :error="error" />

    <UAlert
      v-if="formError"
      color="error"
      variant="subtle"
      icon="i-lucide-alert-circle"
      :title="formError"
    />

    <!-- Cảnh báo nếu phát hiện trùng lặp -->
    <UAlert
      v-if="duplicateWarning"
      color="warning"
      variant="subtle"
      icon="i-lucide-alert-triangle"
      title="Cảnh báo: Có thể trùng lặp đoàn sinh trong hệ thống"
      class="mb-4"
    >
      <template #description>
        <p class="text-xs">
          {{ duplicateWarning.message || 'Có đoàn sinh khớp họ tên và ngày sinh.' }}
        </p>
        <p v-if="duplicateWarning.existingStudentId" class="mt-1 text-xs">
          <strong>{{ duplicateWarning.existingStudentFullName }}</strong>
          <template v-if="duplicateWarning.existingStudentCode"> · Mã: {{ duplicateWarning.existingStudentCode }}</template>
          <NuxtLink
            :to="`/admin/doan-sinh/${duplicateWarning.existingStudentId}`"
            target="_blank"
            class="text-marian-600 underline ml-1"
          >
            Xem hồ sơ →
          </NuxtLink>
        </p>
        <p v-if="duplicateWarning.level === 'Probable'" class="mt-1 text-xs">
          Nếu chắc chắn đây là đoàn sinh khác, bấm "Lưu hồ sơ đoàn sinh" để tiếp tục.
        </p>
      </template>
    </UAlert>

    <form class="space-y-6" @submit.prevent="submit">
      <!-- 1. THÔNG TIN CƠ BẢN -->
      <div class="rounded-xl border border-stone-200 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900">
        <h2 class="mb-4 text-lg font-bold text-marian-700 dark:text-marian-300">
          1. Thông tin cơ bản
        </h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <UFormField label="Tên thánh" name="holyName">
            <UInput v-model="holyName" placeholder="Ví dụ: Giuse, Maria, Têrêsa..." class="w-full" />
          </UFormField>

          <UFormField label="Họ và tên" name="fullName" required class="sm:col-span-2">
            <UInput
              v-model="fullName"
              placeholder="Nhập họ và tên khai sinh..."
              class="w-full"
              required
              @blur="checkDuplicate"
            />
          </UFormField>

          <UFormField label="Ngày sinh" name="dateOfBirth" required>
            <UInput
              v-model="dateOfBirth"
              type="date"
              class="w-full"
              required
              @blur="checkDuplicate"
            />
          </UFormField>

          <UFormField label="Giới tính" name="gender" required>
            <select
              v-model="gender"
              class="w-full rounded-md border border-stone-300 bg-white p-2 text-sm dark:border-stone-700 dark:bg-stone-900 dark:text-white"
              required
            >
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
            </select>
          </UFormField>

          <UFormField label="Giáo họ / Khu xóm" name="parishArea">
            <UInput v-model="parishArea" placeholder="Ví dụ: Giáo họ Micae..." class="w-full" />
          </UFormField>
        </div>
      </div>

      <!-- 2. THÔNG TIN BÍ TÍCH -->
      <div class="rounded-xl border border-stone-200 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900">
        <h2 class="mb-4 text-lg font-bold text-marian-700 dark:text-marian-300">
          2. Thông tin Bí tích
        </h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <!-- Rửa tội -->
          <UFormField label="Ngày Rửa Tội" name="baptismDate">
            <UInput v-model="baptismDate" type="date" class="w-full" @blur="checkDuplicate" />
          </UFormField>
          <UFormField label="Nơi Rửa Tội (Giáo xứ)" name="baptismChurch">
            <UInput v-model="baptismChurch" placeholder="Ví dụ: Giáo xứ Thánh Gia..." class="w-full" />
          </UFormField>

          <!-- Rước lễ lần đầu -->
          <UFormField label="Ngày Xưng Tội & Rước Lễ Lần Đầu" name="firstCommunionDate">
            <UInput v-model="firstCommunionDate" type="date" class="w-full" />
          </UFormField>
          <UFormField label="Nơi Rước Lễ Lần Đầu" name="firstCommunionChurch">
            <UInput v-model="firstCommunionChurch" placeholder="Ví dụ: Giáo xứ Thánh Gia..." class="w-full" />
          </UFormField>

          <!-- Thêm sức -->
          <UFormField label="Ngày Thêm Sức" name="confirmationDate">
            <UInput v-model="confirmationDate" type="date" class="w-full" />
          </UFormField>
          <UFormField label="Nơi Thêm Sức" name="confirmationChurch">
            <UInput v-model="confirmationChurch" placeholder="Ví dụ: Nhà thờ Chính Tòa..." class="w-full" />
          </UFormField>
        </div>
      </div>

      <!-- 3. LIÊN HỆ PHỤ HUYNH & GIA ĐÌNH -->
      <div class="rounded-xl border border-stone-200 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900">
        <h2 class="mb-4 text-lg font-bold text-marian-700 dark:text-marian-300">
          3. Liên hệ phụ huynh & Gia đình
        </h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <UFormField label="Họ tên Cha" name="fatherName">
            <UInput v-model="fatherName" placeholder="Tên thánh & họ tên cha..." class="w-full" />
          </UFormField>

          <UFormField label="Họ tên Mẹ" name="motherName">
            <UInput v-model="motherName" placeholder="Tên thánh & họ tên mẹ..." class="w-full" />
          </UFormField>

          <UFormField label="Số điện thoại Cha" name="fatherPhone">
            <UInput v-model="fatherPhone" placeholder="SĐT liên hệ của Cha..." class="w-full" />
          </UFormField>

          <UFormField label="Số điện thoại Mẹ" name="motherPhone">
            <UInput v-model="motherPhone" placeholder="SĐT liên hệ của Mẹ..." class="w-full" />
          </UFormField>

          <UFormField label="Địa chỉ gia đình" name="address" class="sm:col-span-2">
            <UInput v-model="address" placeholder="Địa chỉ thường trú..." class="w-full" />
          </UFormField>
        </div>
      </div>

      <!-- 4. SỨC KHỎE & LỚP HỌC (TÙY CHỌN) -->
      <div class="rounded-xl border border-stone-200 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900">
        <h2 class="mb-4 text-lg font-bold text-marian-700 dark:text-marian-300">
          4. Sức khỏe & Xếp lớp ngay
        </h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <UFormField label="Nhóm máu" name="bloodType">
            <UInput v-model="bloodType" placeholder="Ví dụ: O+, A+..." class="w-full" />
          </UFormField>

          <UFormField label="Dị ứng (nếu có)" name="allergies" class="sm:col-span-2">
            <UInput v-model="allergies" placeholder="Ví dụ: Dị ứng hải sản, đậu phộng..." class="w-full" />
          </UFormField>

          <UFormField label="Ghi chú sức khỏe" name="healthNotes" class="sm:col-span-3">
            <UInput v-model="healthNotes" placeholder="Ghi chú thêm về thể trạng của em..." class="w-full" />
          </UFormField>

          <!-- Chọn lớp xếp ngay -->
          <UFormField
            v-if="permissions.can(PERMISSIONS.Academic.View)"
            label="Xếp vào lớp ngay (Niên khóa đang hoạt động)"
            name="classroom"
            class="sm:col-span-3"
          >
            <select
              v-model="selectedClassroomId"
              class="w-full rounded-md border border-stone-300 bg-white p-2 text-sm dark:border-stone-700 dark:bg-stone-900 dark:text-white"
            >
              <option value="">-- Chưa xếp lớp (xếp sau) --</option>
              <option v-for="c in classrooms" :key="c.id" :value="c.id">
                {{ c.branchName ? `Ngành ${c.branchName} › ` : '' }}{{ c.name }}
              </option>
            </select>
          </UFormField>
        </div>
      </div>

      <!-- Nút lưu -->
      <div class="flex items-center justify-end gap-3 pt-2">
        <UButton variant="ghost" color="neutral" to="/admin/doan-sinh">
          Hủy bỏ
        </UButton>
        <UButton
          type="submit"
          size="lg"
          icon="i-lucide-check"
          :loading="loading"
        >
          Lưu hồ sơ đoàn sinh
        </UButton>
      </div>
    </form>
  </div>
</template>
