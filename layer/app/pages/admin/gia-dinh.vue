<script setup lang="ts">
import type { ApiError } from '~/composables/useApi'
import { toApiError } from '~/composables/useApi'
import { PERMISSIONS } from '~/shared/permissions'

definePageMeta({
  layout: 'admin',
  permission: PERMISSIONS.Students.View
})

interface FamilyMember {
  id: string
  code: string
  holyName?: string
  fullName: string
  className?: string
}

interface FamilyItem {
  id: string
  familyCode: string
  fatherName?: string
  motherName?: string
  phone?: string
  address?: string
  parishArea?: string
  members?: FamilyMember[]
  membersCount?: number
}

const api = useApi()
const permissions = usePermissions()

const families = ref<FamilyItem[]>([])
const loading = ref(false)
const error = ref<ApiError | null>(null)
const search = ref('')

// Modal Create/Edit Family
const familyModalOpen = ref(false)
const isEditing = ref(false)
const formId = ref('')
const formCode = ref('')
const formFatherName = ref('')
const formMotherName = ref('')
const formPhone = ref('')
const formAddress = ref('')
const formParishArea = ref('')
const formSubmitting = ref(false)
const formError = ref<ApiError | null>(null)

// Modal Manage Members
const membersModalOpen = ref(false)
const currentFamily = ref<FamilyItem | null>(null)
const memberSubmitting = ref(false)
const memberError = ref<ApiError | null>(null)
const studentSearchQuery = ref('')
const foundStudents = ref<any[]>([])
const searchingStudents = ref(false)

async function loadFamilies() {
  loading.value = true
  error.value = null
  try {
    const data = await api.get<FamilyItem[]>('/families', {
      search: search.value || undefined
    })
    families.value = Array.isArray(data) ? data : []
  } catch (e) {
    error.value = toApiError(e)
  } finally {
    loading.value = false
  }
}

watch(search, () => {
  loadFamilies()
})

function openCreateModal() {
  isEditing.value = false
  formId.value = ''
  formCode.value = `GD-${Math.floor(1000 + Math.random() * 9000)}`
  formFatherName.value = ''
  formMotherName.value = ''
  formPhone.value = ''
  formAddress.value = ''
  formParishArea.value = ''
  formError.value = null
  familyModalOpen.value = true
}

function openEditModal(f: FamilyItem) {
  isEditing.value = true
  formId.value = f.id
  formCode.value = f.familyCode
  formFatherName.value = f.fatherName || ''
  formMotherName.value = f.motherName || ''
  formPhone.value = f.phone || ''
  formAddress.value = f.address || ''
  formParishArea.value = f.parishArea || ''
  formError.value = null
  familyModalOpen.value = true
}

async function submitFamily() {
  formSubmitting.value = true
  formError.value = null
  try {
    const payload = {
      familyCode: formCode.value.trim(),
      fatherName: formFatherName.value.trim() || null,
      motherName: formMotherName.value.trim() || null,
      phone: formPhone.value.trim() || null,
      address: formAddress.value.trim() || null,
      parishArea: formParishArea.value.trim() || null
    }

    if (isEditing.value) {
      await api.put(`/families/${formId.value}`, payload)
    } else {
      await api.post('/families', payload)
    }
    familyModalOpen.value = false
    await loadFamilies()
  } catch (e) {
    formError.value = toApiError(e)
  } finally {
    formSubmitting.value = false
  }
}

async function deleteFamily(id: string) {
  if (!confirm('Bạn có chắc chắn muốn xóa gia đình này?')) return
  try {
    await api.del(`/families/${id}`)
    await loadFamilies()
  } catch (e) {
    error.value = toApiError(e)
  }
}

// Manage members
function openMembersModal(f: FamilyItem) {
  currentFamily.value = JSON.parse(JSON.stringify(f))
  studentSearchQuery.value = ''
  foundStudents.value = []
  memberError.value = null
  membersModalOpen.value = true
}

async function searchStudentsToAdd() {
  if (!studentSearchQuery.value.trim()) return
  searchingStudents.value = true
  try {
    const res = await api.get<{ items: any[] }>('/students', {
      search: studentSearchQuery.value.trim(),
      pageSize: 5
    })
    foundStudents.value = res.items || []
  } catch {
    foundStudents.value = []
  } finally {
    searchingStudents.value = false
  }
}

function addMemberToFamily(st: any) {
  if (!currentFamily.value) return
  if (!currentFamily.value.members) currentFamily.value.members = []
  if (!currentFamily.value.members.some(m => m.id === st.id)) {
    currentFamily.value.members.push({
      id: st.id,
      code: st.code,
      holyName: st.holyName,
      fullName: st.fullName,
      className: st.className
    })
  }
}

function removeMemberFromFamily(studentId: string) {
  if (!currentFamily.value?.members) return
  currentFamily.value.members = currentFamily.value.members.filter(m => m.id !== studentId)
}

async function saveFamilyMembers() {
  if (!currentFamily.value) return
  memberSubmitting.value = true
  memberError.value = null
  try {
    const studentIds = (currentFamily.value.members || []).map(m => m.id)
    await api.put(`/families/${currentFamily.value.id}/members`, { studentIds })
    membersModalOpen.value = false
    await loadFamilies()
  } catch (e) {
    memberError.value = toApiError(e)
  } finally {
    memberSubmitting.value = false
  }
}

onMounted(loadFamilies)
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Gia đình thiếu nhi"
      subtitle="Quản lý hộ gia đình, liên kết các anh chị em học chung trong xứ đoàn"
    >
      <template #actions>
        <UButton
          v-if="permissions.can(PERMISSIONS.Families.Manage)"
          icon="i-lucide-plus"
          @click="openCreateModal"
        >
          Thêm gia đình
        </UButton>
      </template>
    </PageHeader>

    <ErrorState :error="error" @retry="loadFamilies" />

    <div class="flex items-center gap-3">
      <UInput
        v-model="search"
        icon="i-lucide-search"
        placeholder="Tìm theo tên cha, mẹ, mã gia đình hoặc SĐT..."
        class="max-w-md w-full"
      />
    </div>

    <div v-if="families.length === 0 && !loading">
      <EmptyState title="Chưa có hộ gia đình nào" description="Tạo hồ sơ gia đình để gom nhóm các con cùng cha mẹ." />
    </div>

    <!-- Bảng danh sách gia đình -->
    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="f in families"
        :key="f.id"
        class="flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900"
      >
        <div>
          <div class="flex items-start justify-between">
            <span class="font-mono text-xs font-bold text-marian-600 dark:text-marian-400">
              {{ f.familyCode }}
            </span>
            <span class="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-300">
              {{ f.parishArea || 'Giáo họ xứ' }}
            </span>
          </div>

          <div class="mt-3 space-y-1 text-sm text-stone-800 dark:text-stone-200">
            <p v-if="f.fatherName">
              <span class="text-xs text-stone-500">Cha:</span> <strong>{{ f.fatherName }}</strong>
            </p>
            <p v-if="f.motherName">
              <span class="text-xs text-stone-500">Mẹ:</span> <strong>{{ f.motherName }}</strong>
            </p>
            <p v-if="f.phone" class="text-xs text-stone-500">
              SĐT: {{ f.phone }}
            </p>
            <p v-if="f.address" class="text-xs text-stone-500 truncate">
              ĐC: {{ f.address }}
            </p>
          </div>

          <!-- Các con -->
          <div class="mt-4 border-t border-stone-100 pt-3 dark:border-stone-800">
            <div class="flex items-center justify-between text-xs font-semibold text-stone-500 mb-1.5">
              <span>Đoàn sinh trong gia đình ({{ f.members?.length || f.membersCount || 0 }}):</span>
            </div>
            <div v-if="f.members?.length" class="space-y-1">
              <NuxtLink
                v-for="m in f.members"
                :key="m.id"
                :to="`/admin/doan-sinh/${m.id}`"
                class="flex items-center justify-between rounded bg-stone-50 px-2 py-1 text-xs hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700"
              >
                <span>{{ m.holyName }} {{ m.fullName }}</span>
                <span class="text-stone-400 text-[10px]">{{ m.className || m.code }}</span>
              </NuxtLink>
            </div>
            <div v-else class="text-xs text-stone-400 italic">
              Chưa gán đoàn sinh.
            </div>
          </div>
        </div>

        <div class="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 dark:border-stone-800">
          <UButton
            v-if="permissions.can(PERMISSIONS.Families.Manage)"
            size="xs"
            variant="outline"
            color="secondary"
            icon="i-lucide-users"
            @click="openMembersModal(f)"
          >
            Gán con
          </UButton>

          <div class="flex items-center gap-1">
            <UButton
              v-if="permissions.can(PERMISSIONS.Families.Manage)"
              size="xs"
              variant="ghost"
              color="neutral"
              icon="i-lucide-pencil"
              @click="openEditModal(f)"
            />
            <UButton
              v-if="permissions.can(PERMISSIONS.Families.Manage)"
              size="xs"
              variant="ghost"
              color="error"
              icon="i-lucide-trash-2"
              @click="deleteFamily(f.id)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL THÊM / SỬA GIA ĐÌNH -->
    <UModal v-model:open="familyModalOpen" :title="isEditing ? 'Sửa thông tin gia đình' : 'Thêm gia đình mới'">
      <template #body>
        <form class="space-y-4" @submit.prevent="submitFamily">
          <ErrorState :error="formError" />

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UFormField label="Mã gia đình" name="code" required>
              <UInput v-model="formCode" class="w-full" required />
            </UFormField>
            <UFormField label="Giáo họ" name="parishArea">
              <UInput v-model="formParishArea" placeholder="Ví dụ: Giáo họ Micae..." class="w-full" />
            </UFormField>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UFormField label="Họ tên Cha" name="fatherName">
              <UInput v-model="formFatherName" placeholder="Tên thánh & họ tên cha..." class="w-full" />
            </UFormField>
            <UFormField label="Họ tên Mẹ" name="motherName">
              <UInput v-model="formMotherName" placeholder="Tên thánh & họ tên mẹ..." class="w-full" />
            </UFormField>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UFormField label="Số điện thoại liên hệ" name="phone">
              <UInput v-model="formPhone" placeholder="SĐT phụ huynh..." class="w-full" />
            </UFormField>
            <UFormField label="Địa chỉ gia đình" name="address">
              <UInput v-model="formAddress" placeholder="Địa chỉ thường trú..." class="w-full" />
            </UFormField>
          </div>

          <div class="flex justify-end gap-2 pt-3">
            <UButton variant="ghost" color="neutral" @click="familyModalOpen = false">Hủy</UButton>
            <UButton type="submit" :loading="formSubmitting">{{ isEditing ? 'Lưu thay đổi' : 'Tạo gia đình' }}</UButton>
          </div>
        </form>
      </template>
    </UModal>

    <!-- MODAL GÁN ĐOÀN SINH VÀO GIA ĐÌNH -->
    <UModal v-model:open="membersModalOpen" title="Gán đoàn sinh vào gia đình">
      <template #body>
        <div v-if="currentFamily" class="space-y-4">
          <ErrorState :error="memberError" />

          <p class="text-xs text-stone-600 dark:text-stone-400">
            Gia đình: <strong>{{ currentFamily.fatherName || currentFamily.motherName || currentFamily.familyCode }}</strong>
          </p>

          <!-- Danh sách hiện tại -->
          <div class="space-y-1.5">
            <div class="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Các con hiện tại:
            </div>
            <div v-if="!currentFamily.members?.length" class="text-xs text-stone-400 italic">
              Chưa có đoàn sinh nào trong gia đình này.
            </div>
            <div v-else class="space-y-1">
              <div
                v-for="m in currentFamily.members"
                :key="m.id"
                class="flex items-center justify-between rounded-lg bg-stone-50 px-2.5 py-1.5 text-xs dark:bg-stone-800"
              >
                <span>{{ m.holyName }} {{ m.fullName }} ({{ m.code }})</span>
                <UButton size="xs" variant="ghost" color="error" icon="i-lucide-x" @click="removeMemberFromFamily(m.id)" />
              </div>
            </div>
          </div>

          <!-- Tìm kiếm đoàn sinh để thêm -->
          <div class="border-t border-stone-100 pt-3 dark:border-stone-800 space-y-2">
            <div class="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Tìm đoàn sinh để gán vào:
            </div>
            <div class="flex gap-2">
              <UInput
                v-model="studentSearchQuery"
                placeholder="Nhập tên đoàn sinh..."
                class="flex-1"
                @keydown.enter.prevent="searchStudentsToAdd"
              />
              <UButton size="sm" icon="i-lucide-search" :loading="searchingStudents" @click="searchStudentsToAdd">
                Tìm
              </UButton>
            </div>

            <div v-if="foundStudents.length" class="space-y-1 pt-1">
              <div
                v-for="st in foundStudents"
                :key="st.id"
                class="flex items-center justify-between rounded border border-stone-200 p-2 text-xs dark:border-stone-700"
              >
                <div>
                  <strong>{{ st.holyName }} {{ st.fullName }}</strong>
                  <span class="text-stone-400 ml-1">({{ st.code }} · {{ st.className || 'Chưa xếp lớp' }})</span>
                </div>
                <UButton size="xs" color="primary" icon="i-lucide-plus" @click="addMemberToFamily(st)">
                  Thêm
                </UButton>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
            <UButton variant="ghost" color="neutral" @click="membersModalOpen = false">Đóng</UButton>
            <UButton color="success" :loading="memberSubmitting" @click="saveFamilyMembers">Lưu danh sách</UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
