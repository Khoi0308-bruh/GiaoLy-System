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
  isDuplicate: boolean
  matches?: { id: string, code: string, holyName: string, fullName: string, dateOfBirth: string }[]
}

const api = useApi()
const permissions = usePermissions()

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
const motherName = ref('')
const guardianPhone = ref('')
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
      dateOfBirth: dateOfBirth.value,
      baptismDate: baptismDate.value || null
    })
    if (res?.isDuplicate && res.matches?.length) {
      duplicateWarning.value = res
    }
  } catch {
    // Ignore duplicate check failure
  } finally {
    checkingDuplicates.value = false
  }
}

async function submit() {
  loading.value = true
  error.value = null

  try {
    const payload = {
      holyName: holyName.value.trim() || null,
      fullName: fullName.value.trim(),
      gender: gender.value,
      dateOfBirth: dateOfBirth.value,
      parishArea: parishArea.value.trim() || null,
      address: address.value.trim() || null,
      fatherName: fatherName.value.trim() || null,
      motherName: motherName.value.trim() || null,
      guardianPhone: guardianPhone.value.trim() || null,
      baptismDate: baptismDate.value || null,
      baptismChurch: baptismChurch.value.trim() || null,
      firstCommunionDate: firstCommunionDate.value || null,
      firstCommunionChurch: firstCommunionChurch.value.trim() || null,
      confirmationDate: confirmationDate.value || null,
      confirmationChurch: confirmationChurch.value.trim() || null,
      bloodType: bloodType.value.trim() || null,
      allergies: allergies.value.trim() || null,
      healthNotes: healthNotes.value.trim() || null,
      initialClassroomId: selectedClassroomId.value || null
    }

    const created = await api.post<{ id: string }>('/students', payload)
    await navigateTo(created?.id ? `/admin/doan-sinh/${created.id}` : '/admin/doan-sinh')
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
          Tìm thấy {{ duplicateWarning.matches?.length }} đoàn sinh có họ tên và ngày sinh tương tự:
        </p>
        <ul class="mt-1 list-inside list-disc text-xs space-y-0.5">
          <li v-for="m in duplicateWarning.matches" :key="m.id">
            <strong>{{ m.holyName }} {{ m.fullName }}</strong> (Mã: {{ m.code }} · Sinh: {{ m.dateOfBirth }})
            <NuxtLink :to="`/admin/doan-sinh/${m.id}`" target="_blank" class="text-marian-600 underline ml-1">
              Xem hồ sơ →
            </NuxtLink>
          </li>
        </ul>
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

          <UFormField label="Số điện thoại phụ huynh" name="guardianPhone">
            <UInput v-model="guardianPhone" placeholder="SĐT liên hệ khẩn cấp..." class="w-full" />
          </UFormField>

          <UFormField label="Địa chỉ gia đình" name="address" class="sm:col-span-3">
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
