<template>
  <div class="space-y-6">
    <!-- Stepper UI -->
    <div class="flex items-center justify-between relative max-w-lg mx-auto mb-8 mt-2">
      <!-- Line -->
      <div class="absolute left-0 top-5 -translate-y-1/2 w-full h-1 bg-stone-200 dark:bg-stone-800 -z-10 rounded-full"></div>
      <div class="absolute left-0 top-5 -translate-y-1/2 h-1 bg-primary-500 -z-10 rounded-full transition-all duration-500" :style="`width: ${(currentStep - 1) * 50}%`"></div>
      
      <!-- Step 1 -->
      <div class="flex flex-col items-center gap-2">
        <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500" :class="currentStep >= 1 ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-110' : 'bg-stone-100 dark:bg-stone-800 text-stone-400'">
          1
        </div>
        <span class="text-xs font-bold" :class="currentStep >= 1 ? 'text-primary-600 dark:text-primary-400' : 'text-stone-400'">Tải Lên</span>
      </div>
      
      <!-- Step 2 -->
      <div class="flex flex-col items-center gap-2">
        <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500" :class="currentStep >= 2 ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-110' : 'bg-stone-100 dark:bg-stone-800 text-stone-400'">
          2
        </div>
        <span class="text-xs font-bold" :class="currentStep >= 2 ? 'text-primary-600 dark:text-primary-400' : 'text-stone-400'">Xác Thực</span>
      </div>
      
      <!-- Step 3 -->
      <div class="flex flex-col items-center gap-2">
        <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500" :class="currentStep >= 3 ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-110' : 'bg-stone-100 dark:bg-stone-800 text-stone-400'">
          3
        </div>
        <span class="text-xs font-bold" :class="currentStep >= 3 ? 'text-primary-600 dark:text-primary-400' : 'text-stone-400'">Đồng Bộ</span>
      </div>
    </div>

    <!-- Bước 1: Khu vực Upload File -->
    <div
      v-if="currentStep === 1"
      class="border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-xl p-12 text-center transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50 cursor-pointer animate-fade-in-up"
      @click="triggerFileInput"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInputRef"
        type="file"
        accept=".xlsx, .xls, .docx"
        class="hidden"
        @change="handleFileChange"
      >
      <div class="w-20 h-20 mx-auto mb-4 bg-primary-50 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
        <UIcon name="i-heroicons-cloud-arrow-up" class="w-10 h-10 text-primary-500" />
      </div>
      <h3 class="font-bold text-xl text-stone-800 dark:text-stone-200">Kéo thả file hoặc Click để tải lên</h3>
      <p class="text-sm text-stone-500 mt-2">Hỗ trợ định dạng: Excel (.xlsx, .xls) hoặc Word (.docx)</p>
      <div class="mt-8 flex justify-center">
        <UButton color="primary" variant="soft" icon="i-heroicons-document-arrow-down" label="Tải File Excel Mẫu" to="/api/v1/imports/students/template" external target="_blank" />
      </div>
    </div>

    <!-- Bước 2: Khu vực Preview & Validate -->
    <div v-else-if="currentStep === 2" class="space-y-4 animate-fade-in-up">
      <div class="flex items-center justify-between bg-stone-50 dark:bg-stone-900/50 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
        <div>
          <h3 class="font-bold text-lg text-stone-800 dark:text-white">Kiểm tra dữ liệu</h3>
          <p class="text-sm text-stone-500 mt-1">
            Tổng cộng: <span class="font-bold text-primary-600">{{ parsedData.length }}</span> dòng. 
            Hợp lệ: <span class="font-bold text-emerald-600">{{ validCount }}</span> | 
            Trùng lặp: <span class="font-bold text-amber-600">{{ duplicateCount }}</span> | 
            Lỗi: <span class="font-bold text-red-600">{{ errorCount }}</span>
          </p>
        </div>
        <div class="flex gap-3">
          <UButton label="Hủy & Tải Lại" color="neutral" variant="soft" icon="i-heroicons-arrow-path" @click="resetData" />
          <UButton label="Tiến Hành Đồng Bộ" color="primary" icon="i-heroicons-arrow-right" :disabled="errorCount > 0" :loading="isSaving" @click="saveData" />
        </div>
      </div>

      <!-- Bảng Data Grid -->
      <div class="border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden bg-white dark:bg-stone-900 shadow-sm">
        <div class="overflow-x-auto max-h-[50vh]">
          <table class="w-full text-sm text-left">
            <thead class="text-xs text-stone-500 uppercase bg-stone-100 dark:bg-stone-950 sticky top-0 z-10 shadow-sm">
              <tr>
                <th class="px-4 py-4 font-black">STT</th>
                <th class="px-4 py-4 font-black">Tên Thánh</th>
                <th class="px-4 py-4 font-black min-w-[180px]">Họ và Tên *</th>
                <th class="px-4 py-4 font-black min-w-[130px]">Ngày Sinh</th>
                <th class="px-4 py-4 font-black">Ngành</th>
                <th class="px-4 py-4 font-black">Lớp</th>
                <th class="px-4 py-4 font-black">Trạng thái</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
              <tr v-for="(row, idx) in parsedData" :key="idx" :class="getRowClass(row)" class="hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors">
                <td class="px-4 py-3 font-medium text-stone-500">{{ idx + 1 }}</td>
                <td class="px-4 py-3">
                  <UInput v-model="row.holyName" size="xs" variant="none" class="bg-transparent focus:bg-white dark:focus:bg-stone-900 rounded" @blur="validateRow(row)" />
                </td>
                <td class="px-4 py-3 relative">
                  <UInput v-model="row.fullName" size="xs" variant="none" class="bg-transparent font-bold focus:bg-white dark:focus:bg-stone-900 rounded" :class="{'text-red-500': row.errors.fullName}" @blur="validateRow(row)" />
                  <div v-if="row.errors.fullName" class="text-[10px] text-red-500 absolute bottom-0 left-4 font-bold">{{ row.errors.fullName }}</div>
                </td>
                <td class="px-4 py-3 relative">
                  <UInput v-model="row.birthDateStr" type="date" size="xs" variant="none" class="bg-transparent focus:bg-white dark:focus:bg-stone-900 rounded" :class="{'text-red-500': row.errors.birthDate}" @blur="validateRow(row)" />
                  <div v-if="row.errors.birthDate" class="text-[10px] text-red-500 absolute bottom-0 left-4 font-bold">{{ row.errors.birthDate }}</div>
                </td>
                <td class="px-4 py-3">
                  <USelect v-model="row.branch" :items="branchItems" size="xs" variant="none" class="focus:bg-white dark:focus:bg-stone-900 rounded" @update:model-value="validateRow(row)" />
                </td>
                <td class="px-4 py-3">
                  <UInput v-model="row.className" size="xs" variant="none" class="bg-transparent focus:bg-white dark:focus:bg-stone-900 rounded" @blur="validateRow(row)" />
                </td>
                <td class="px-4 py-3">
                  <UBadge v-if="row.isDuplicate" color="amber" variant="subtle" size="xs" class="font-bold">Trùng lặp</UBadge>
                  <UBadge v-else-if="Object.keys(row.errors).length > 0" color="red" variant="subtle" size="xs" class="font-bold">Lỗi</UBadge>
                  <UBadge v-else color="emerald" variant="subtle" size="xs" class="font-bold">Hợp lệ</UBadge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <UAlert v-if="duplicateCount > 0" title="Phát hiện hồ sơ trùng lặp" icon="i-heroicons-exclamation-triangle" color="amber" variant="soft" description="Có một số hồ sơ trùng với dữ liệu đã có trên hệ thống. Khi đồng bộ, các dòng này sẽ được bỏ qua để không tạo hồ sơ trùng; mở hồ sơ đã có nếu cần cập nhật. Bạn có thể tự do sửa đổi trực tiếp ở bảng trên." />
    </div>

    <!-- Bước 3: Đồng Bộ Hoàn Tất -->
    <div v-else-if="currentStep === 3" class="text-center py-16 space-y-6 animate-fade-in-up">
      <div class="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
        <UIcon name="i-heroicons-check-circle" class="w-14 h-14 text-emerald-500" />
      </div>
      <div>
        <h3 class="text-3xl font-black text-stone-800 dark:text-white mb-2">Đồng Bộ Thành Công!</h3>
        <p class="text-stone-500 text-lg">Toàn bộ dữ liệu đoàn sinh đã được lưu vào hệ thống an toàn.</p>
      </div>
      <div class="pt-6">
        <UButton label="Hoàn Tất & Đóng" color="primary" size="xl" class="px-10 shadow-lg shadow-primary-500/20" @click="finishImport" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { z } from 'zod'
import * as XLSX from 'xlsx'
import mammoth from 'mammoth'

const props = defineProps({
  onSuccess: Function
})

const emit = defineEmits(['imported'])
const toast = useToast()
const api = useApi()

// Danh sách ngành lấy từ API thay vì hard-code: mã và tên ngành do backend quản lý.
const branches = ref([])
const branchItems = computed(() => branches.value.map(b => ({ label: b.name, value: b.id })))

onMounted(async () => {
  try {
    const res = await api.get('/branches')
    branches.value = Array.isArray(res) ? res : []
  } catch (err) {
    console.error('Lỗi tải danh sách ngành:', toApiError(err).message)
  }
})

const fileInputRef = ref(null)
const parsedData = ref([])
const isSaving = ref(false)
const currentStep = ref(1)

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleDrop = (e) => {
  const file = e.dataTransfer.files[0]
  if (file) processFile(file)
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) processFile(file)
}

const resetData = () => {
  parsedData.value = []
  currentStep.value = 1
  if (fileInputRef.value) fileInputRef.value.value = ''
}

const finishImport = () => {
  resetData()
  if (props.onSuccess) props.onSuccess()
  emit('imported')
}

// ─────────────────────────────────────────────────────────────────────────────
// PARSING LOGIC
// ─────────────────────────────────────────────────────────────────────────────
const processFile = async (file) => {
  try {
    let rawData = []
    
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 })
      
      // Bỏ qua dòng tiêu đề (json[0])
      rawData = json.slice(1).filter(row => row.length > 0 && !!row[1]).map(row => {
        return {
          holyName: row[0]?.toString() || '',
          fullName: row[1]?.toString() || '',
          birthDateStr: parseExcelDate(row[2]),
          className: row[3]?.toString() || '',
          branchName: row[4]?.toString() || '',
          branch: null,
          parentPhone: row[5]?.toString() || '',
          bloodType: row[6]?.toString() || '',
          allergies: row[7]?.toString() || '',
          baptismDateStr: parseExcelDate(row[8]),
          communionDateStr: parseExcelDate(row[9]),
          confirmationDateStr: parseExcelDate(row[10]),
          errors: {},
          isDuplicate: false,
          existingId: null
        }
      })
    } else if (file.name.endsWith('.docx')) {
      const data = await file.arrayBuffer()
      const result = await mammoth.extractRawText({ arrayBuffer: data })
      rawData = parseWordRegex(result.value)
    } else {
      throw new Error('Định dạng file không hỗ trợ')
    }
    
    if (!rawData.length) throw new Error('Không tìm thấy dữ liệu hợp lệ trong file')

    // Ghép tên ngành trong tệp với ngành thật của hệ thống
    rawData.forEach(r => { r.branch = matchBranch(r.branchName) })

    // Gán dữ liệu và chạy check validation, trùng lặp
    parsedData.value = rawData
    currentStep.value = 2 // Move to step 2 after file parsing
    runValidation()
    await checkDuplicates()
    
  } catch (err) {
    toast.add({ title: 'Lỗi đọc file', description: err.message, color: 'error' })
  }
}

const parseExcelDate = (excelDate) => {
  if (!excelDate) return ''
  if (typeof excelDate === 'number') {
    const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000))
    return date.toISOString().split('T')[0]
  }
  // Thử parse string
  try {
    return new Date(excelDate).toISOString().split('T')[0]
  } catch { return '' }
}

const normalizeText = str => (str || '')
  .toString()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd')
  .replace(/Đ/g, 'D')
  .trim()
  .toLowerCase()

// Trả về branchId thật; không khớp thì để trống để người dùng tự chọn, tránh gán sai ngành.
const matchBranch = (str) => {
  const needle = normalizeText(str)
  if (!needle) return null
  const list = branches.value
  const exact = list.find(b => normalizeText(b.code) === needle || normalizeText(b.name) === needle)
  if (exact) return exact.id
  const loose = list.find(b => normalizeText(b.name).includes(needle) || needle.includes(normalizeText(b.name)))
  return loose ? loose.id : null
}

// Regex đọc text từ Word. Tuỳ theo Xứ, mẫu sẽ khác nhau.
// Tạm định dạng: "[Tên Thánh] [Họ Tên] - [Ngày Sinh]" mỗi dòng
const parseWordRegex = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 5)
  const results = []
  
  // Tạm xử lý regex cơ bản: (Maria|Giuse...) (Nguyễn Văn A) [-|,] (DD/MM/YYYY)
  const regex = /^(?:([a-zA-Z\s]+)\s+)?([A-ZÀ-Ỹa-zà-ỹ\s]+)(?:\s*[-|,]\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}))?/i
  
  for (const line of lines) {
    const match = line.match(regex)
    if (match) {
      let d = ''
      if (match[3]) {
        const parts = match[3].split(/[\/\-]/)
        if (parts.length === 3) d = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
      }
      
      results.push({
        holyName: (match[1] || '').trim(),
        fullName: (match[2] || '').trim(),
        birthDateStr: d,
        className: '',
        branchName: '',
        branch: null,
        parentPhone: '', bloodType: '', allergies: '', baptismDateStr: '', communionDateStr: '', confirmationDateStr: '',
        errors: {},
        isDuplicate: false
      })
    }
  }
  return results
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION & SYNC
// ─────────────────────────────────────────────────────────────────────────────
const rowSchema = z.object({
  fullName: z.string().min(2, 'Thiếu tên'),
  birthDateStr: z.string().optional()
})

const validateRow = (row) => {
  row.errors = {}
  try {
    rowSchema.parse(row)
  } catch (err) {
    err.errors.forEach(e => {
      row.errors[e.path[0]] = e.message
    })
  }
}

const runValidation = () => {
  parsedData.value.forEach(row => validateRow(row))
}

// API chỉ kiểm tra trùng lặp cho từng hồ sơ (cần họ tên + ngày sinh), nên gọi lần lượt
// để không dội request và để mỗi dòng nhận đúng kết quả của chính nó.
const checkDuplicates = async () => {
  for (const row of parsedData.value) {
    if (!row.fullName || !row.birthDateStr) continue
    try {
      const res = await api.post('/students/duplicates/check', {
        fullName: row.fullName.trim(),
        birthDate: row.birthDateStr,
        guardianPhones: row.parentPhone ? [row.parentPhone.trim()] : []
      })
      if (res?.level && res.level !== 'None') {
        row.isDuplicate = true
        row.existingId = res.existingStudentId ?? null
      }
    } catch (err) {
      // Không chặn bước xem trước nếu API kiểm tra trùng lặp lỗi; lúc lưu API vẫn tự chặn.
      console.error('Lỗi check trùng lặp:', toApiError(err).message)
    }
  }
}

const errorCount = computed(() => parsedData.value.filter(r => Object.keys(r.errors).length > 0).length)
const duplicateCount = computed(() => parsedData.value.filter(r => r.isDuplicate).length)
const validCount = computed(() => parsedData.value.length - errorCount.value)

const getRowClass = (row) => {
  if (Object.keys(row.errors).length > 0) return 'bg-red-50/50 dark:bg-red-900/10'
  if (row.isDuplicate) return 'bg-amber-50/50 dark:bg-amber-900/10'
  return ''
}

const saveData = async () => {
  if (errorCount.value > 0) return toast.add({ title: 'Vui lòng sửa các dòng lỗi trước khi lưu', color: 'amber' })
  
  // Dòng đã trùng hồ sơ có sẵn thì bỏ qua để không tạo bản ghi trùng.
  const pending = parsedData.value.filter(r => !r.isDuplicate)
  if (!pending.length) {
    toast.add({ title: 'Không còn dòng nào cần lưu', description: 'Toàn bộ dòng trong tệp đã trùng hồ sơ có sẵn.', color: 'amber' })
    return
  }

  isSaving.value = true
  const failures = []
  const sacramentFailures = []
  let saved = 0
  try {
    // API không có endpoint lưu hàng loạt; tạo từng hồ sơ qua POST /students.
    for (const row of pending) {
      try {
        const created = await api.post('/students', {
          holyName: row.holyName?.trim() || null,
          fullName: row.fullName.trim(),
          birthDate: row.birthDateStr,
          branchId: row.branch || null,
          bloodType: row.bloodType?.trim() || null,
          allergies: row.allergies?.trim() || null,
          // Tệp chỉ có số điện thoại phụ huynh; để trống họ tên để không ghi đè
          // tên của phụ huynh đã tồn tại (API khớp phụ huynh theo số điện thoại).
          guardians: row.parentPhone?.trim()
            ? [{ fullName: '', phone: row.parentPhone.trim(), relationship: 'Other', isPrimary: true }]
            : [],
          hasPhotoConsent: false
        })

        // Ngày bí tích phải ghi sau khi hồ sơ đã có Id.
        for (const [type, date] of [
          ['Baptism', row.baptismDateStr],
          ['FirstCommunion', row.communionDateStr],
          ['Confirmation', row.confirmationDateStr]
        ]) {
          if (!date) continue
          try {
            await api.put(`/students/${created.id}/sacraments/${type}`, { receivedOn: date })
          } catch (err) {
            sacramentFailures.push(`${row.fullName} (${type}): ${toApiError(err).message}`)
          }
        }

        saved++
      } catch (err) {
        failures.push(`${row.fullName}: ${toApiError(err).message}`)
      }
    }

    if (failures.length) {
      toast.add({
        title: `Đã lưu ${saved}/${pending.length} hồ sơ`,
        description: failures.slice(0, 3).join(' · '),
        color: saved ? 'warning' : 'error'
      })
      if (!saved) return
    } else {
      toast.add({ title: `Đã lưu ${saved} hồ sơ đoàn sinh`, color: 'success' })
    }

    if (sacramentFailures.length) {
      toast.add({
        title: `Chưa ghi được ngày bí tích cho ${sacramentFailures.length} mục`,
        description: sacramentFailures.slice(0, 3).join(' · '),
        color: 'warning'
      })
    }

    currentStep.value = 3 // Move to step 3 (Success)
  } finally {
    isSaving.value = false
  }
}
</script>
