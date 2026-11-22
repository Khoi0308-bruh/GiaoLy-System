<script setup lang="ts">
type Domain = 'student' | 'enrollment' | 'grade' | 'draft' | 'year' | 'certificate'
type Tone = 'success' | 'warning' | 'error' | 'primary' | 'neutral'

const props = defineProps<{ domain: Domain, value: string }>()

const TABLE: Record<Domain, Record<string, [string, Tone]>> = {
  student: { Active: ['Đang học', 'success'], Paused: ['Tạm nghỉ', 'warning'], Left: ['Đã nghỉ', 'neutral'], Graduated: ['Đã tốt nghiệp', 'primary'] },
  enrollment: { Active: ['Đang học', 'success'], Promoted: ['Đã lên lớp', 'primary'], Repeated: ['Học lại', 'warning'], Graduated: ['Tốt nghiệp', 'primary'], DropOut: ['Đã rút', 'neutral'], Transferred: ['Đã chuyển lớp', 'neutral'] },
  grade: { Qualified: ['Đủ điều kiện', 'success'], NotQualified: ['Chưa đạt', 'error'], Incomplete: ['Chưa đủ dữ liệu', 'warning'] },
  draft: { Pending: ['Chờ duyệt', 'warning'], Approved: ['Đã duyệt', 'success'], Rejected: ['Từ chối', 'neutral'], Stale: ['Cần xem lại', 'error'], Applied: ['Đã áp dụng', 'primary'] },
  year: { Planned: ['Dự kiến', 'neutral'], Active: ['Đang hoạt động', 'success'], Closing: ['Đang chốt', 'warning'], Archived: ['Đã lưu trữ', 'neutral'] },
  certificate: { Issued: ['Còn hiệu lực', 'success'], Revoked: ['Đã thu hồi', 'error'] }
}

const entry = computed<[string, Tone]>(() => TABLE[props.domain][props.value] ?? [props.value, 'neutral'])
</script>

<template>
  <UBadge :color="entry[1]" variant="outline" size="sm">
    {{ entry[0] }}
  </UBadge>
</template>
