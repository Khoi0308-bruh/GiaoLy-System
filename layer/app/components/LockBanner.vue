<script setup lang="ts">
defineProps<{
  yearStatus: 'Planned' | 'Active' | 'Closing' | 'Archived'
  unlockedUntil?: string | null
  canUnlock: boolean
}>()
defineEmits<{ unlock: [] }>()
</script>

<template>
  <UAlert
    v-if="yearStatus === 'Active'"
    color="success"
    variant="subtle"
    title="Niên khóa đang hoạt động"
    description="Có thể nhập và sửa điểm."
  />
  <UAlert
    v-else-if="unlockedUntil"
    color="success"
    variant="subtle"
    title="Sổ điểm lớp này đã được mở khóa tạm thời"
    :description="`Hiệu lực đến ${new Date(unlockedUntil).toLocaleString('vi-VN')}. Mọi thay đổi được ghi nhật ký.`"
  />
  <UAlert
    v-else
    color="warning"
    variant="subtle"
    title="Sổ điểm đã khóa"
    :description="yearStatus === 'Archived' ? 'Niên khóa đã lưu trữ, chỉ xem được.' : 'Niên khóa đang chốt, chỉ xem được.'"
  >
    <template #actions>
      <UButton v-if="canUnlock && yearStatus === 'Closing'" size="xs" color="secondary" @click="$emit('unlock')">
        Mở khóa có lý do
      </UButton>
    </template>
  </UAlert>
</template>
