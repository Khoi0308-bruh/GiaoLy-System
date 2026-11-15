/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthStore } from '~/stores/auth'

/**
 * Tạo options chung cho cả useApiFetch và $api:
 * - Gắn Bearer Token vào header mỗi request
 * - Bắt lỗi 401 (Token hết hạn): Tự động logout
 * - Bắt lỗi 400 (Validation): Phát sự kiện để Form hiển thị lỗi đỏ theo field
 */
function createApiOptions(request: string, opts?: any) {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  return {
    baseURL: config.public.apiBase,
    ...opts,
    onRequest({ options }: { options: any }) {
      if (authStore.token) {
        options.headers = new Headers(options.headers || {})
        options.headers.set('Authorization', `Bearer ${authStore.token}`)
      }
    },
    onResponseError({ response }: { response: any }) {
      // Giai đoạn 5D — Xử lý lỗi tập trung cho toàn bộ API calls

      // 401 Unauthorized: Token hết hạn hoặc không hợp lệ → Tự động logout
      if (response.status === 401) {
        authStore.logout()
        return
      }

      // 403 Forbidden: Không có quyền (ABAC từ chối) → Thông báo nhẹ nhàng
      if (response.status === 403) {
        console.warn('[API] Từ chối truy cập: Bạn không có quyền thực hiện thao tác này.')
        return
      }

      // 400 Bad Request: Lỗi validation từ Backend (FluentValidation / ProblemDetails RFC 7807)
      // Phát sự kiện để các component Form lắng nghe và hiển thị lỗi đỏ đúng field
      if (response.status === 400 && response._data?.errors) {
        // Các form dùng useEventBus('validation-errors') để lắng nghe
        import('@vueuse/core').then(({ useEventBus }) => {
          const bus = useEventBus<Record<string, string[]>>('validation-errors')
          bus.emit(response._data.errors)
        })
      }
    }
  }
}

/**
 * useApiFetch — Dùng với useFetch() trong setup() của component.
 * Tự động reactive, re-fetch khi deps thay đổi.
 * Phù hợp cho: data fetching trong page/component lifecycle.
 */
export const useApiFetch = <T>(request: string, opts?: any) => {
  const key = opts?.key ?? request
  return useFetch<T>(request, { key, ...createApiOptions(request, opts) })
}

/**
 * $api — Dùng với $fetch() trong event handlers, actions.
 * One-shot, không reactive.
 * Phù hợp cho: POST/PUT/DELETE trong button click handlers.
 */
export const $api = <T>(request: string, opts?: any) => {
  return $fetch<T>(request, createApiOptions(request, opts))
}
