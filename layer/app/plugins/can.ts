import type { DirectiveBinding } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
  function apply(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    // Lấy store bên trong hook (không phải lúc plugin khởi tạo) để không phụ thuộc
    // thứ tự đăng ký plugin của Pinia.
    const session = useSessionStore()
    const needed = Array.isArray(binding.value) ? binding.value : [binding.value]
    const allowed = needed.some(code => session.can(code))
    el.style.display = allowed ? '' : 'none'
  }

  nuxtApp.vueApp.directive('can', {
    mounted: apply,
    updated: apply
  })
})
