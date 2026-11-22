// Thư mục layer không có node_modules riêng: package dưới đây do từng app cài,
// nên TypeScript đọc file trong layer không tự tìm thấy. Khai báo kiểu tối thiểu
// đúng phần layer dùng, để typecheck của app vẫn chạy được.
declare module 'isomorphic-dompurify' {
  interface Config {
    ALLOWED_TAGS?: string[]
    ALLOWED_ATTR?: string[]
    FORBID_TAGS?: string[]
    FORBID_ATTR?: string[]
    ADD_ATTR?: string[]
    ALLOW_DATA_ATTR?: boolean
    [option: string]: unknown
  }

  const DOMPurify: {
    sanitize: (dirty: string, config?: Config) => string
  }

  export default DOMPurify
}
