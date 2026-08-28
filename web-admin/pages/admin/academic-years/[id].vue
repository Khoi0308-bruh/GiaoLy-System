<template>
  <UContainer class="py-10 space-y-8">
    <!-- Breadcrumb -->
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
      <span class="font-semibold text-stone-800 dark:text-white">{{ year?.name ?? '...' }}</span>
    </div>

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-black text-stone-800 dark:text-white">
          Lớp Học <span class="text-primary-500">{{ year?.name }}</span>
        </h1>
        <p class="text-stone-500 text-sm mt-1">
          Quản lý danh sách lớp học trong niên khóa này.
        </p>
      </div>
      <UButton
        icon="i-heroicons-plus"
        label="Thêm Lớp Học"
        color="primary"
        @click="isCreateOpen = true"
      />
    </div>

    <!-- Loading -->
    <div
      v-if="pendingRooms"
      class="flex justify-center py-10"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 animate-spin text-primary-500"
      />
    </div>

    <!-- Grid lớp học theo ngành -->
    <div
      v-for="branch in branches"
      :key="branch.id"
      class="space-y-3"
    >
      <div class="flex items-center gap-3">
        <UBadge
          :label="branch.name"
          :color="branch.color"
          variant="soft"
          size="lg"
        />
        <span class="text-xs text-stone-400">
          {{ roomsByBranch(branch.id).length }} lớp
        </span>
      </div>

      <div
        v-if="roomsByBranch(branch.id).length === 0"
        class="text-sm text-stone-400 pl-2 italic"
      >
        Chưa có lớp học nào.
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <UCard
          v-for="room in roomsByBranch(branch.id)"
          :key="room.id"
          class="hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer group relative"
        >
          <div class="flex items-start justify-between">
            <NuxtLink
              :to="`/admin/classrooms/${room.id}`"
              class="flex-1 min-w-0"
            >
              <h3 class="font-bold text-stone-800 dark:text-white text-lg hover:text-primary-500 transition-colors">
                {{ room.className }}
              </h3>
              <p class="text-sm text-stone-500 mt-1">
                <UIcon
                  name="i-heroicons-user"
                  class="inline w-3 h-3 mr-1 text-primary-500"
                />
                GLV: {{ room.mainTeacher || 'Chưa phân công' }}
              </p>
              <p
                v-if="room.roomName"
                class="text-sm text-stone-500 mt-0.5"
              >
                <UIcon
                  name="i-heroicons-map-pin"
                  class="inline w-3 h-3 mr-1 text-amber-500"
                />
                {{ room.roomName }}
              </p>
            </NuxtLink>
            <div class="flex gap-1 ml-2 flex-shrink-0">
              <UButton
                icon="i-heroicons-pencil-square"
                color="neutral"
                variant="ghost"
                size="xs"
                @click.stop="openEditRoom(room)"
              />
              <UButton
                icon="i-heroicons-trash"
                color="red"
                variant="ghost"
                size="xs"
                @click.stop="deleteRoom(room.id)"
              />
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="!pendingRooms && !classRooms?.length"
      class="text-center py-20 text-stone-400"
    >
      <UIcon
        name="i-heroicons-squares-2x2"
        class="w-14 h-14 mx-auto mb-4 opacity-30"
      />
      <p class="text-lg">
        Chưa có lớp học nào trong niên khóa này.
      </p>
    </div>

    <!-- Modal tạo lớp học -->
    <UModal
      v-model:open="isCreateOpen"
      title="Thêm Lớp Học Mới"
    >
      <template #body>
        <form
          id="room-form"
          class="p-4 space-y-4"
          @submit.prevent="createRoom"
        >
          <UFormField
            label="Tên lớp"
            required
          >
            <UInput
              v-model="roomForm.className"
              placeholder="Ví dụ: Khối Ấu 1 - Lớp A"
              class="w-full"
            />
          </UFormField>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Ngành">
              <USelect
                v-model="roomForm.branch"
                :options="branchOptions"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Phòng / địa điểm">
              <UInput
                v-model="roomForm.roomName"
                placeholder="Ví dụ: Phòng 3"
                class="w-full"
              />
            </UFormField>
          </div>
          <UFormField label="Tài khoản GLV Chủ nhiệm (Dùng phân quyền nhập điểm)">
            <USelect
              v-model="roomForm.leaderId"
              :options="userOptions"
              placeholder="-- Chọn tài khoản Giáo Lý Viên --"
              class="w-full"
            />
          </UFormField>
        </form>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton
            label="Hủy"
            color="neutral"
            variant="ghost"
            @click="isCreateOpen = false"
          />
          <UButton
            type="submit"
            form="room-form"
            label="Thêm lớp"
            :loading="isSubmitting"
          />
        </div>
      </template>
    </UModal>
    <!-- Modal chỉnh sửa lớp học -->
    <UModal
      v-model:open="isEditOpen"
      title="Cập Nhật Thông Tin Lớp Học"
    >
      <template #body>
        <form
          id="edit-room-form"
          class="p-4 space-y-4"
          @submit.prevent="updateRoom"
        >
          <UFormField
            label="Tên lớp"
            required
          >
            <UInput
              v-model="editRoomForm.className"
              placeholder="Ví dụ: Khối Ấu 1 - Lớp A"
              class="w-full"
            />
          </UFormField>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Ngành">
              <USelect
                v-model="editRoomForm.branch"
                :options="branchOptions"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Phòng / địa điểm">
              <UInput
                v-model="editRoomForm.roomName"
                placeholder="Ví dụ: Phòng 3"
                class="w-full"
              />
            </UFormField>
          </div>
          <UFormField label="Tài khoản GLV Chủ nhiệm (Dùng phân quyền nhập điểm)">
            <USelect
              v-model="editRoomForm.leaderId"
              :options="userOptions"
              placeholder="-- Chọn tài khoản Giáo Lý Viên --"
              class="w-full"
            />
          </UFormField>
        </form>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton
            label="Hủy"
            color="neutral"
            variant="ghost"
            @click="isEditOpen = false"
          />
          <UButton
            type="submit"
            form="edit-room-form"
            label="Cập nhật lớp"
            :loading="isEditSubmitting"
          />
        </div>
      </template>
    </UModal>
  </UContainer>
</template>

<script setup>
definePageMeta({ layout: 'default' })

const route = useRoute()
const toast = useToast()
const yearId = route.params.id

const { data: year } = await useApiFetch(`/AcademicYear`)
const currentYear = computed(() => year.value?.find(y => y.id === yearId))

const { data: classRooms, pending: pendingRooms, refresh } = await useApiFetch(`/AcademicYear/${yearId}/classrooms`, {
  default: () => []
})

const { data: users } = await useApiFetch('/User')
const userOptions = computed(() => {
  if (!users.value) return []
  // Chỉ lấy những user có role 1, 2, 3 (Admin, Secretary, Mod) làm GLV
  return users.value.map(u => ({
    value: u.id,
    label: u.fullName || u.username
  }))
})

useHead({ title: computed(() => `Lớp học - ${currentYear.value?.name ?? 'Niên khóa'} | GiaoLy`) })

const branches = [
  { id: 1, name: 'Ấu Nhi', color: 'success' },
  { id: 2, name: 'Thiếu Nhi', color: 'primary' },
  { id: 3, name: 'Nghĩa Sĩ', color: 'warning' },
  { id: 4, name: 'Hiệp Sĩ', color: 'error' }
]

const branchOptions = branches.map(b => ({ value: b.id, label: b.name }))

const roomsByBranch = branchId => classRooms.value?.filter(r => r.branch === branchId) ?? []

const isCreateOpen = ref(false)
const isSubmitting = ref(false)

const roomForm = reactive({
  className: '',
  branch: 1,
  mainTeacher: '',
  leaderId: '',
  roomName: ''
})

// Edit room
const isEditOpen = ref(false)
const isEditSubmitting = ref(false)
const currentEditRoomId = ref(null)

const editRoomForm = reactive({
  className: '',
  branch: 1,
  mainTeacher: '',
  leaderId: '',
  roomName: ''
})

const openEditRoom = (room) => {
  currentEditRoomId.value = room.id
  Object.assign(editRoomForm, {
    className: room.className,
    branch: room.branch,
    mainTeacher: room.mainTeacher || '',
    leaderId: room.leaderId || '',
    roomName: room.roomName || ''
  })
  isEditOpen.value = true
}

const updateRoom = async () => {
  isEditSubmitting.value = true
  try {
    // Tự động gán mainTeacher text dựa trên user được chọn (để tương thích ngược với UI cũ)
    const selectedUser = userOptions.value.find(u => u.value === editRoomForm.leaderId)
    const teacherName = selectedUser ? selectedUser.label : ''

    await $api(`/AcademicYear/classrooms/${currentEditRoomId.value}`, {
      method: 'PUT',
      body: {
        id: currentEditRoomId.value,
        academicYearId: yearId,
        ...editRoomForm,
        mainTeacher: teacherName,
        leaderId: editRoomForm.leaderId || null,
        branch: parseInt(editRoomForm.branch)
      }
    })
    isEditOpen.value = false
    await refresh()
    toast.add({ title: 'Đã cập nhật lớp học!', color: 'success' })
  } catch {
    toast.add({ title: 'Lỗi khi cập nhật lớp học', color: 'error' })
  } finally {
    isEditSubmitting.value = false
  }
}

const createRoom = async () => {
  isSubmitting.value = true
  try {
    const selectedUser = userOptions.value.find(u => u.value === roomForm.leaderId)
    const teacherName = selectedUser ? selectedUser.label : ''

    await $api(`/AcademicYear/${yearId}/classrooms`, {
      method: 'POST',
      body: {
        ...roomForm,
        mainTeacher: teacherName,
        leaderId: roomForm.leaderId || null,
        branch: parseInt(roomForm.branch)
      }
    })
    isCreateOpen.value = false
    Object.assign(roomForm, { className: '', branch: 1, mainTeacher: '', leaderId: '', roomName: '' })
    await refresh()
    toast.add({ title: 'Đã thêm lớp học!', color: 'success' })
  } catch {
    toast.add({ title: 'Lỗi khi tạo lớp học', color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

const deleteRoom = async (id) => {
  if (!confirm('Xóa lớp học này?')) return
  try {
    await $api(`/AcademicYear/classrooms/${id}`, { method: 'DELETE' })
    await refresh()
    toast.add({ title: 'Đã xóa lớp học', color: 'success' })
  } catch {
    toast.add({ title: 'Lỗi khi xóa', color: 'error' })
  }
}
</script>
