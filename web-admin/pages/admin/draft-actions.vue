<template>
  <div class="space-y-6 animate-fade-in-up">
    <!-- ── Page Header ── -->
    <div class="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200/50 dark:border-stone-800/50 pb-5">
      <div>
        <h1 class="text-2xl font-black text-stone-800 dark:text-white uppercase tracking-wide">
          📝 Xét Duyệt <span class="text-primary-500">Lên Lớp</span>
        </h1>
        <p class="text-xs text-stone-400 mt-0.5">
          Phê duyệt hoặc từ chối các đề xuất lên lớp (Draft Actions) từ năm cũ
        </p>
      </div>
      <UButton
        icon="i-heroicons-arrow-left"
        label="Trở Về Quản Lý Niên Khóa"
        color="neutral"
        variant="soft"
        to="/admin/academic-years"
      />
    </div>

    <!-- ── Filter & Year Selection ── -->
    <UCard class="glass-card">
      <div class="flex items-end justify-between gap-4">
        <UFormField
          label="Chọn Niên Khóa Đích"
          class="w-64"
        >
          <USelect
            v-model="selectedYear"
            :options="yearOptions"
            placeholder="-- Chọn niên khóa --"
            @change="fetchDrafts"
          />
        </UFormField>
        
        <div class="flex gap-2" v-if="selectedYear && drafts.filter(d => d.status === 'Pending').length > 0">
          <UButton icon="i-heroicons-x-circle" label="Từ Chối Tất Cả" color="error" variant="soft" @click="bulkReject" :loading="isBulking" />
          <UButton icon="i-heroicons-check-circle" label="Duyệt Tất Cả" color="success" @click="bulkApprove" :loading="isBulking" />
        </div>
      </div>
    </UCard>

    <!-- ── Main Table ── -->
    <UCard
      v-if="selectedYear"
      class="glass-card overflow-hidden"
    >
      <UTable
        :rows="drafts"
        :columns="columns"
        :loading="pending"
        :empty-state="{ icon: 'i-heroicons-inbox', header: 'Không có bản nháp nào cần duyệt' }"
      >
        <template #studentName-cell="{ row }">
          <div class="font-bold text-stone-800 dark:text-stone-200">
            <span class="text-[10px] text-stone-400 uppercase tracking-wider mr-1">{{ row.original.student?.holyName }}</span>
            {{ row.original.student?.fullName }}
          </div>
        </template>
        <template #suggestedClass-cell="{ row }">
          <UBadge
            v-if="row.original.suggestedClassRoom"
            color="primary"
            variant="subtle"
          >
            {{ row.original.suggestedClassRoom.name }}
          </UBadge>
          <span
            v-else
            class="text-xs text-stone-400 italic"
          >Chưa phân lớp</span>
        </template>
        <template #status-cell="{ row }">
          <UBadge
            :label="getStatusLabel(row.original.status)"
            :color="getStatusColor(row.original.status)"
            variant="soft"
            size="xs"
          />
        </template>
        <template #actions-cell="{ row }">
          <div
            v-if="row.original.status === 'Pending'"
            class="flex gap-2"
          >
            <UTooltip text="Duyệt (Đồng ý)">
              <UButton
                icon="i-heroicons-check"
                color="success"
                variant="ghost"
                size="xs"
                @click="approveDraft(row.original.id)"
              />
            </UTooltip>
            <UTooltip text="Từ chối (Lưu ban)">
              <UButton
                icon="i-heroicons-x-mark"
                color="error"
                variant="ghost"
                size="xs"
                @click="rejectDraft(row.original.id)"
              />
            </UTooltip>
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
useHead({ title: 'Xét Duyệt Lên Lớp - GiaoLy Admin' })

const toast = useToast()

const { data: years } = await useApiFetch('/AcademicYear')
const yearOptions = computed(() => years.value?.map(y => ({ value: y.id, header: y.name })) || [])

const selectedYear = ref('')
const drafts = ref([])
const pending = ref(false)

const columns = [
  { accessorKey: 'studentName', header: 'Đoàn Sinh' },
  { accessorKey: 'suggestedClass', header: 'Lớp Đề Xuất' },
  { accessorKey: 'status', header: 'Trạng Thái' },
  { accessorKey: 'actions', header: '' }
]

const getStatusLabel = s => ({ Pending: 'Chờ duyệt', Approved: 'Đã duyệt', Rejected: 'Từ chối' }[s] || s)
const getStatusColor = s => ({ Pending: 'warning', Approved: 'success', Rejected: 'error' }[s] || 'neutral')

const fetchDrafts = async () => {
  if (!selectedYear.value) return
  pending.value = true
  try {
    drafts.value = await $api(`/DraftAction/${selectedYear.value}`) || []
  } catch {
    toast.add({ title: 'Lỗi tải danh sách nháp', color: 'error' })
  } finally {
    pending.value = false
  }
}

const approveDraft = async (id) => {
  try {
    await $api(`/DraftAction/approve/${id}`, { method: 'POST' })
    toast.add({ title: 'Đã duyệt lên lớp', color: 'success' })
    await fetchDrafts()
  } catch (err) {
    toast.add({ title: 'Lỗi khi duyệt', description: err.data?.message || err.message, color: 'error' })
  }
}

const rejectDraft = async (id) => {
  try {
    await $api(`/DraftAction/reject/${id}`, { method: 'POST' })
    toast.add({ title: 'Đã từ chối', color: 'error' })
    await fetchDrafts()
  } catch {
    toast.add({ title: 'Lỗi', color: 'error' })
  }
}

const isBulking = ref(false)

const bulkApprove = async () => {
  if (!selectedYear.value) return
  if (!confirm('Bạn có chắc chắn muốn duyệt TẤT CẢ bản nháp đang chờ?')) return
  isBulking.value = true
  try {
    const res = await $api(`/DraftAction/bulk-approve/${selectedYear.value}`, { method: 'POST' })
    toast.add({ title: 'Thành công', description: `Đã duyệt ${res.count} bản nháp`, color: 'success' })
    await fetchDrafts()
  } catch (err) {
    toast.add({ title: 'Lỗi', description: err.message, color: 'error' })
  } finally {
    isBulking.value = false
  }
}

const bulkReject = async () => {
  if (!selectedYear.value) return
  if (!confirm('Bạn có chắc chắn muốn từ chối TẤT CẢ bản nháp đang chờ?')) return
  isBulking.value = true
  try {
    const res = await $api(`/DraftAction/bulk-reject/${selectedYear.value}`, { method: 'POST' })
    toast.add({ title: 'Thành công', description: `Đã từ chối ${res.count} bản nháp`, color: 'error' })
    await fetchDrafts()
  } catch (err) {
    toast.add({ title: 'Lỗi', description: err.message, color: 'error' })
  } finally {
    isBulking.value = false
  }
}
</script>
