import { ERROR_MESSAGES, DEFAULT_ERROR } from '../shared/errors'

interface ProblemDetails {
  status?: number
  code?: string
  title?: string
  detail?: string
  errors?: Record<string, string[]>
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fieldErrors: Record<string, string[]> = {},
    public retryAfter?: number,
    /** Thông điệp chi tiết từ server (ProblemDetails.detail), nếu có. */
    public detail?: string
  ) {
    super(message)
  }
}

export function toApiError(error: unknown): ApiError {
  const e = error as { data?: ProblemDetails, statusCode?: number, status?: number, response?: { headers?: Headers } }
  const data = e?.data ?? {}
  const status = e?.statusCode ?? e?.status ?? data.status ?? 0
  const fallback: Record<number, string> = { 401: 'AUTH_TOKEN_REVOKED', 403: 'FORBIDDEN', 404: 'NOT_FOUND', 409: 'CONFLICT_DUPLICATE', 429: 'RATE_LIMITED' }
  const code = data.code ?? fallback[status] ?? 'UNKNOWN'
  const retry = Number(e?.response?.headers?.get?.('retry-after')) || undefined
  return new ApiError(status, code, ERROR_MESSAGES[code] ?? data.detail ?? DEFAULT_ERROR, data.errors ?? {}, retry, data.detail)
}

export function useApi() {
  const config = useRuntimeConfig()
  const session = useSessionStore()

  async function request<T>(path: string, options: Record<string, unknown> = {}, retried = false): Promise<T> {
    try {
      return await $fetch<T>(`/api/v1${path}`, {
        baseURL: config.public.apiBase,
        credentials: 'include',
        ...options,
        headers: {
          ...((options.headers as Record<string, string>) ?? {}),
          ...(session.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {})
        }
      })
    } catch (raw) {
      const error = toApiError(raw)
      if (error.status === 401 && !retried && !path.startsWith('/auth/')) {
        let refreshed = false
        try {
          refreshed = await session.refresh()
        } catch (refreshError) {
          // Refresh hỏng vì lý do tạm thời (429, 5xx, mạng): giữ nguyên phiên và trả
          // lỗi thật cho trang, không xoá token rồi đá người dùng về đăng nhập.
          throw toApiError(refreshError)
        }

        if (refreshed) {
          // Refresh chỉ trả access token mới; nếu phiên chưa có hồ sơ (ví dụ vừa bị clear)
          // thì nạp lại để quyền và mustChangePassword đúng với token mới.
          if (!session.me) {
            try { await session.loadMe() } catch { /* giữ phiên hiện tại */ }
          }
          return request<T>(path, options, true)
        }
        session.clear()
        await navigateTo('/dang-nhap')
      }
      throw error
    }
  }

  return {
    get: <T>(path: string, query?: Record<string, unknown>) => request<T>(path, { method: 'GET', query }),
    post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
    put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
    patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
    del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
    // Nhiều trang gọi `api.delete(...)`; giữ cả hai tên để không phải sửa từng trang.
    delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),

    /**
     * Tải file (Excel/PDF) — dùng chung đường 401 → refresh → thử lại như các request khác.
     * Các trang download trước đây gọi $fetch trực tiếp nên access token hết hạn là hỏng tải.
     */
    download: <T = Blob>(path: string, options: Record<string, unknown> = {}) =>
      request<T>(path, { ...options, responseType: 'blob' })
  }
}
