export interface LiturgicalDay {
  eventDate: string
  title: string
  color: string
  level?: string
  description?: string
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
