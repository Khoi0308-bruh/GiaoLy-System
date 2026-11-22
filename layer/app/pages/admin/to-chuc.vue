<script setup lang="ts">
import type { ApiError } from '../../composables/useApi'
import { toApiError } from '../../composables/useApi'
import { PERMISSIONS } from '../../shared/permissions'

definePageMeta({
  layout: 'admin'
})

interface BranchItem {
  id: number
  code: string
  name: string
  minAge?: number | null
  maxAge?: number | null
  sortOrder: number
  isActive?: boolean
  classLevels?: ClassLevelItem[]
}

interface ClassLevelItem {
  id: number
  branchId: number
  branch?: { id: number, name: string }
  code: string
  name: string
  levelKey?: number
  nextLevelId?: number | null
  nextLevel?: { id: number, name: string } | null
  sortOrder: number
}

const api = useApi()
const permissions = usePermissions()

// Data state
const branches = ref<BranchItem[]>([])
const classLevels = ref<ClassLevelItem[]>([])
const loading = ref(false)
const error = ref<ApiError | null>(null)
const activeTab = ref<'branches' | 'levels'>('branches')

// Branch modal state
const branchModalOpen = ref(false)
const isEditingBranch = ref(false)
const branchId = ref<number | null>(null)
const branchCode = ref('')
const branchName = ref('')
const branchMinAge = ref<number | undefined>(undefined)
const branchMaxAge = ref<number | undefined>(undefined)
const branchSortOrder = ref(0)
const branchSubmitting = ref(false)
const branchError = ref<ApiError | null>(null)

// ClassLevel modal state
const levelModalOpen = ref(false)
const isEditingLevel = ref(false)
const levelId = ref<number | null>(null)
const levelBranchId = ref<number | null>(null)
const levelCode = ref('')
const levelName = ref('')
const levelKey = ref(1)
const levelNextId = ref<number | null>(null)
const levelSortOrder = ref(0)
const levelSubmitting = ref(false)
const levelError = ref<ApiError | null>(null)

async function loadData() {
  loading.value = true
  error.value = null
  try {
    const [bRes, lRes] = await Promise.all([
      api.get<BranchItem[]>('/branches'),
      api.get<ClassLevelItem[]>('/class-levels')
    ])
    branches.value = Array.isArray(bRes) ? bRes : []
    classLevels.value = Array.isArray(lRes) ? lRes : []
  } catch (e) {
    error.value = toApiError(e)
  } finally {
    loading.value = false
  }
}

// Branch Actions
function openAddBranch() {
  isEditingBranch.value = false
  branchId.value = null
  branchCode.value = ''
  branchName.value = ''
  branchMinAge.value = undefined
  branchMaxAge.value = undefined
  branchSortOrder.value = branches.value.length + 1
  branchError.value = null
  branchModalOpen.value = true
}

function openEditBranch(b: BranchItem) {
  isEditingBranch.value = true
  branchId.value = b.id
  branchCode.value = b.code
  branchName.value = b.name
  branchMinAge.value = b.minAge ?? undefined
  branchMaxAge.value = b.maxAge ?? undefined
  branchSortOrder.value = b.sortOrder
  branchError.value = null
  branchModalOpen.value = true
}

async function submitBranch() {
  branchSubmitting.value = true
  branchError.value = null
  try {
    if (isEditingBranch.value && branchId.value !== null) {
      await api.put(`/branches/${branchId.value}`, {
        code: branchCode.value.toUpperCase().trim(),
        name: branchName.value.trim(),
        minAge: branchMinAge.value || null,
        maxAge: branchMaxAge.value || null,
        sortOrder: branchSortOrder.value
      })
    } else {
      await api.post('/branches', {
        code: branchCode.value.toUpperCase().trim(),
        name: branchName.value.trim(),
        minAge: branchMinAge.value || null,
        maxAge: branchMaxAge.value || null,
        sortOrder: branchSortOrder.value
      })
    }
    branchModalOpen.value = false
    await loadData()
  } catch (e) {
    branchError.value = toApiError(e)
  } finally {
    branchSubmitting.value = false
  }
}

// Class Level Actions
function openAddLevel() {
  isEditingLevel.value = false
  levelId.value = null
  levelBranchId.value = branches.value[0]?.id || null
  levelCode.value = ''
  levelName.value = ''
  levelKey.value = classLevels.value.length + 1
  levelNextId.value = null
  levelSortOrder.value = classLevels.value.length + 1
  levelError.value = null
  levelModalOpen.value = true
}

function openEditLevel(l: ClassLevelItem) {
  isEditingLevel.value = true
  levelId.value = l.id
  levelBranchId.value = l.branchId
  levelCode.value = l.code
  levelName.value = l.name
  levelKey.value = l.levelKey || 1
  levelNextId.value = l.nextLevelId || null
  levelSortOrder.value = l.sortOrder
  levelError.value = null
  levelModalOpen.value = true
}

async function submitLevel() {
  levelSubmitting.value = true
  levelError.value = null
  try {
    if (isEditingLevel.value && levelId.value !== null) {
      await api.put(`/class-levels/${levelId.value}`, {
        branchId: levelBranchId.value,
        code: levelCode.value.toUpperCase().trim(),
        name: levelName.value.trim(),
        levelKey: levelKey.value,
        nextLevelId: levelNextId.value || null,
        sortOrder: levelSortOrder.value
      })
    } else {
      await api.post('/class-levels', {
        branchId: levelBranchId.value,
        code: levelCode.value.toUpperCase().trim(),
        name: levelName.value.trim(),
        levelKey: levelKey.value,
        nextLevelId: levelNextId.value || null,
        sortOrder: levelSortOrder.value
      })
    }
    levelModalOpen.value = false
    await loadData()
  } catch (e) {
    levelError.value = toApiError(e)
  } finally {
    levelSubmitting.value = false
  }
}

function getBranchName(branchId: number) {
  return branches.value.find(b => b.id === branchId)?.name || 'Chưa gán ngành'
}

function getNextLevelName(nextId?: number | null) {
  if (!nextId) return 'Tốt nghiệp / Chuyển ngành'
  return classLevels.value.find(l => l.id === nextId)?.name || `Cấp #${nextId}`
}

onMounted(loadData)
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Ngành & Cấp lớp"
      subtitle="Cơ cấu tổ chức xứ đoàn TNTT: danh mục các Ngành và lộ trình các Cấp lớp giáo lý"
    >
      <template #actions>
        <UButton
          v-if="permissions.can(PERMISSIONS.Org.Manage) && activeTab === 'branches'"
          icon="i-lucide-plus"
          @click="openAddBranch"
        >
          Thêm ngành
        </UButton>
        <UButton
          v-if="permissions.can(PERMISSIONS.Org.Manage) && activeTab === 'levels'"
          icon="i-lucide-plus"
          @click="openAddLevel"
        >
          Thêm cấp lớp
        </UButton>
      </template>
    </PageHeader>

    <ErrorState :error="error" @retry="loadData" />

    <!-- Tabs chuyển đổi -->
    <div class="flex items-center gap-2 border-b border-stone-200 pb-2 dark:border-stone-800">
      <UButton
        :variant="activeTab === 'branches' ? 'solid' : 'ghost'"
        :color="activeTab === 'branches' ? 'primary' : 'neutral'"
        size="sm"
        icon="i-lucide-layers"
        @click="activeTab = 'branches'"
      >
        Danh mục Ngành ({{ branches.length }})
      </UButton>
      <UButton
        :variant="activeTab === 'levels' ? 'solid' : 'ghost'"
        :color="activeTab === 'levels' ? 'primary' : 'neutral'"
        size="sm"
        icon="i-lucide-graduation-cap"
        @click="activeTab = 'levels'"
      >
        Lộ trình Cấp lớp ({{ classLevels.length }})
      </UButton>
    </div>

    <!-- TAB 1: DANH SÁCH NGÀNH -->
    <div v-if="activeTab === 'branches'" class="space-y-4">
      <div v-if="branches.length === 0 && !loading" class="text-center py-8">
        <EmptyState title="Chưa có ngành nào" description="Nhấn Thêm ngành để tạo ngành đầu tiên.">
          <UButton v-if="permissions.can(PERMISSIONS.Org.Manage)" icon="i-lucide-plus" @click="openAddBranch">
            Thêm ngành
          </UButton>
        </EmptyState>
      </div>

      <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="b in branches"
          :key="b.id"
          class="flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900"
        >
          <div>
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="rounded bg-stone-100 px-2 py-0.5 text-xs font-bold text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                  {{ b.code }}
                </span>
                <h3 class="mt-2 text-xl font-bold text-stone-900 dark:text-white">
                  {{ b.name }}
                </h3>
              </div>
              <span class="text-xs text-stone-400">Thứ tự #{{ b.sortOrder }}</span>
            </div>

            <div class="mt-3 space-y-1 text-xs text-stone-600 dark:text-stone-400">
              <div v-if="b.minAge || b.maxAge" class="flex items-center gap-1.5">
                <UIcon name="i-lucide-calendar" class="size-4 text-stone-400" />
                <span>Độ tuổi: {{ b.minAge || '–' }} đến {{ b.maxAge || '–' }} tuổi</span>
              </div>
              <div class="flex items-center gap-1.5">
                <UIcon name="i-lucide-book-open" class="size-4 text-stone-400" />
                <span>
                  {{ classLevels.filter(l => l.branchId === b.id).length }} cấp lớp trực thuộc
                </span>
              </div>
            </div>
          </div>

          <div class="mt-4 flex justify-end border-t border-stone-100 pt-3 dark:border-stone-800">
            <UButton
              v-if="permissions.can(PERMISSIONS.Org.Manage)"
              size="xs"
              variant="outline"
              color="neutral"
              icon="i-lucide-pencil"
              @click="openEditBranch(b)"
            >
              Sửa ngành
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: DANH SÁCH CẤP LỚP -->
    <div v-else class="space-y-4">
      <div v-if="classLevels.length === 0 && !loading">
        <EmptyState title="Chưa có cấp lớp nào" description="Nhấn Thêm cấp lớp để bắt đầu lộ trình đào tạo giáo lý.">
          <UButton v-if="permissions.can(PERMISSIONS.Org.Manage)" icon="i-lucide-plus" @click="openAddLevel">
            Thêm cấp lớp
          </UButton>
        </EmptyState>
      </div>

      <div v-else class="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-stone-200 bg-stone-50 text-xs font-semibold uppercase text-stone-600 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-400">
            <tr>
              <th class="px-4 py-3">Mã</th>
              <th class="px-4 py-3">Tên cấp lớp</th>
              <th class="px-4 py-3">Ngành</th>
              <th class="px-4 py-3">Cấp kế tiếp</th>
              <th class="px-4 py-3 text-center">Thứ tự</th>
              <th class="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
            <tr
              v-for="l in classLevels"
              :key="l.id"
              class="hover:bg-stone-50 dark:hover:bg-stone-800/50"
            >
              <td class="px-4 py-3 font-semibold text-stone-900 dark:text-white">
                {{ l.code }}
              </td>
              <td class="px-4 py-3">
                <strong>{{ l.name }}</strong>
              </td>
              <td class="px-4 py-3 text-stone-600 dark:text-stone-300">
                <UBadge variant="subtle" color="primary" size="xs">
                  {{ getBranchName(l.branchId) }}
                </UBadge>
              </td>
              <td class="px-4 py-3 text-xs text-stone-500">
                <span class="inline-flex items-center gap-1">
                  <UIcon name="i-lucide-arrow-right" class="size-3 text-stone-400" />
                  <span>{{ getNextLevelName(l.nextLevelId) }}</span>
                </span>
              </td>
              <td class="px-4 py-3 text-center text-xs text-stone-400">
                #{{ l.sortOrder }}
              </td>
              <td class="px-4 py-3 text-right">
                <UButton
                  v-if="permissions.can(PERMISSIONS.Org.Manage)"
                  size="xs"
                  variant="ghost"
                  color="neutral"
                  icon="i-lucide-pencil"
                  @click="openEditLevel(l)"
                >
                  Sửa
                </UButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL THÊM / SỬA NGÀNH -->
    <UModal v-model:open="branchModalOpen" :title="isEditingBranch ? 'Sửa thông tin ngành' : 'Thêm ngành mới'">
      <template #body>
        <form class="space-y-4" @submit.prevent="submitBranch">
          <ErrorState :error="branchError" />

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UFormField label="Mã ngành (viết tắt)" name="code" required>
              <UInput v-model="branchCode" placeholder="Ví dụ: THIEU" class="w-full" required />
            </UFormField>

            <UFormField label="Tên ngành" name="name" required>
              <UInput v-model="branchName" placeholder="Ví dụ: Thiếu Nhi" class="w-full" required />
            </UFormField>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <UFormField label="Độ tuổi nhỏ nhất" name="minAge">
              <UInput v-model.number="branchMinAge" type="number" placeholder="Ví dụ: 10" class="w-full" />
            </UFormField>

            <UFormField label="Độ tuổi lớn nhất" name="maxAge">
              <UInput v-model.number="branchMaxAge" type="number" placeholder="Ví dụ: 12" class="w-full" />
            </UFormField>

            <UFormField label="Thứ tự hiển thị" name="sortOrder">
              <UInput v-model.number="branchSortOrder" type="number" class="w-full" />
            </UFormField>
          </div>

          <div class="flex justify-end gap-2 pt-3">
            <UButton variant="ghost" color="neutral" @click="branchModalOpen = false">
              Hủy
            </UButton>
            <UButton type="submit" :loading="branchSubmitting">
              {{ isEditingBranch ? 'Lưu thay đổi' : 'Tạo ngành' }}
            </UButton>
          </div>
        </form>
      </template>
    </UModal>

    <!-- MODAL THÊM / SỬA CẤP LỚP -->
    <UModal v-model:open="levelModalOpen" :title="isEditingLevel ? 'Sửa cấp lớp' : 'Thêm cấp lớp mới'">
      <template #body>
        <form class="space-y-4" @submit.prevent="submitLevel">
          <ErrorState :error="levelError" />

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UFormField label="Thuộc ngành" name="branchId" required>
              <select
                v-model.number="levelBranchId"
                class="w-full rounded-md border border-stone-300 bg-white p-2 text-sm dark:border-stone-700 dark:bg-stone-900 dark:text-white"
                required
              >
                <option v-for="b in branches" :key="b.id" :value="b.id">
                  {{ b.name }} ({{ b.code }})
                </option>
              </select>
            </UFormField>

            <UFormField label="Mã cấp lớp" name="code" required>
              <UInput v-model="levelCode" placeholder="Ví dụ: THIEU1" class="w-full" required />
            </UFormField>
          </div>

          <UFormField label="Tên cấp lớp" name="name" required>
            <UInput v-model="levelName" placeholder="Ví dụ: Thiếu 1 (Rước Lễ 1)" class="w-full" required />
          </UFormField>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UFormField label="Cấp lớp tiếp theo (lên lớp)" name="nextLevel">
              <select
                v-model.number="levelNextId"
                class="w-full rounded-md border border-stone-300 bg-white p-2 text-sm dark:border-stone-700 dark:bg-stone-900 dark:text-white"
              >
                <option :value="null">-- Không có (Tốt nghiệp / Cuối ngành) --</option>
                <option
                  v-for="l in classLevels.filter(item => item.id !== levelId)"
                  :key="l.id"
                  :value="l.id"
                >
                  {{ l.name }} ({{ l.code }})
                </option>
              </select>
            </UFormField>

            <UFormField label="Thứ tự hiển thị" name="sortOrder">
              <UInput v-model.number="levelSortOrder" type="number" class="w-full" />
            </UFormField>
          </div>

          <div class="flex justify-end gap-2 pt-3">
            <UButton variant="ghost" color="neutral" @click="levelModalOpen = false">
              Hủy
            </UButton>
            <UButton type="submit" :loading="levelSubmitting">
              {{ isEditingLevel ? 'Lưu thay đổi' : 'Tạo cấp lớp' }}
            </UButton>
          </div>
        </form>
      </template>
    </UModal>
  </div>
</template>
