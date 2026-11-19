/**
 * Hợp đồng thật của API `/public/liturgical/*` (BE: LiturgicalEventDto).
 * Các trang phải đọc đúng các trường này, không dùng tên tự đặt như
 * `date`, `celebrationTitle`, `liturgicalColor`, `rank`…
 */
export interface LiturgicalEventDto {
  id: string
  eventDate: string
  title: string
  color: string
  colorNameVi: string
  level: string
  description?: string | null
  isOverride: boolean
  wordOfGodOverride?: string | null
  wordOfGodReference?: string | null
}

/** Dải màu phụng vụ (LiturgicalStrip) chỉ cần một phần của hợp đồng trên. */
export type LiturgicalDay = Pick<LiturgicalEventDto, 'eventDate' | 'title' | 'color' | 'level' | 'description'>

export type LiturgicalDisplayColor = 'White' | 'Red' | 'Green' | 'Violet' | 'Rose' | 'Gold'

/**
 * API trả `color` bằng tiếng Anh (Purple, Green…) hoặc đôi khi tiếng Việt.
 * Chuẩn hoá về khoá hiển thị màu mà các bảng COLOR_MAP trong UI đang dùng.
 */
export function liturgicalDisplayColor(color?: string | null): LiturgicalDisplayColor {
  const c = (color ?? '').toLowerCase()
  if (/purple|violet|tím/.test(c)) return 'Violet'
  if (/gold|vàng/.test(c)) return 'Gold'
  if (/white|trắng/.test(c)) return 'White'
  if (/red|đỏ/.test(c)) return 'Red'
  if (/rose|pink|hồng/.test(c)) return 'Rose'
  return 'Green'
}

export type LiturgicalKey = 'green' | 'violet' | 'white' | 'red' | 'rose' | 'black'

export function toLiturgicalKey(color: string | undefined | null): LiturgicalKey {
  const c = (color ?? '').toLowerCase()
  if (/tím|violet|purple/.test(c)) return 'violet'
  if (/trắng|vàng|white|gold/.test(c)) return 'white'
  if (/đỏ|red/.test(c)) return 'red'
  if (/hồng|rose|pink/.test(c)) return 'rose'
  if (/đen|black/.test(c)) return 'black'
  return 'green'
}

export function useLiturgical() {
  const api = useApi()
  const today = useState<LiturgicalDay | null>('liturgical-today', () => null)

  function apply() {
    if (import.meta.client) {
      document.documentElement.dataset.liturgical = toLiturgicalKey(today.value?.color)
    }
  }

  async function load() {
    try {
      today.value = await api.get<LiturgicalDay>('/public/liturgical/today')
    } catch {
      today.value = null
    }
    apply()
  }

  return { today, load, apply }
}
