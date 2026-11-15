<script setup lang="ts">
const session = useSessionStore()

const text = computed(() => {
  const me = session.me
  if (!me) return ''
  switch (me.role.scopeType) {
    case 'All': return 'Toàn xứ'
    case 'Branch': return me.branch ? `Ngành ${me.branch.name}` : 'Chưa được phân công ngành'
    case 'Classroom': return me.classRooms?.length ? me.classRooms.map(c => `Lớp ${c.name}`).join(', ') : 'Chưa được phân công lớp'
    default: return 'Con của tôi'
  }
})
</script>

<template>
  <div
    v-if="session.me"
    class="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-vatican-500 bg-vatican-50 px-3 py-1.5 text-sm text-stone-800 dark:bg-vatican-900/30 dark:text-stone-200"
    role="status"
  >
    <strong>Phạm vi dữ liệu:</strong> {{ text }}
    <span class="text-xs text-stone-500">· bạn chỉ thấy đoàn sinh và lớp thuộc phạm vi này</span>
  </div>
</template>
