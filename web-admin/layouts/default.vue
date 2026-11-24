<template>
  <!--
    Khung công khai tối giản của web-admin. Các trang công khai dùng chung từ layer
    (tin tức, thông báo, thư viện, lịch phụng vụ, xác thực chứng chỉ…) không thuộc
    khu vực quản trị nên không dùng sidebar admin, nhưng vẫn cần đầu trang/liên kết.
  -->
  <div class="flex min-h-screen flex-col bg-stone-50 text-stone-900">
    <header class="border-b border-stone-200 bg-white">
      <div class="h-1 bg-gradient-to-r from-marian-800 via-vatican-500 to-marian-800" />
      <div class="mx-auto flex h-16 max-w-6xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6">
        <NuxtLink to="/" class="flex items-center gap-3">
          <span class="grid size-10 place-items-center rounded-lg bg-marian-800 text-lg text-vatican-300">✝</span>
          <span class="leading-tight">
            <span class="block font-display text-lg font-bold text-marian-800">Giáo Lý Giáo Xứ</span>
            <span class="block text-[11px] font-semibold uppercase tracking-wider text-vatican-600">Cổng thông tin</span>
          </span>
        </NuxtLink>

        <nav class="flex flex-wrap items-center gap-1 text-sm">
          <NuxtLink to="/" class="rounded-md px-3 py-1.5 font-medium text-stone-700 hover:bg-stone-100">
            Trang chủ
          </NuxtLink>
          <NuxtLink to="/tin-tuc" class="rounded-md px-3 py-1.5 font-medium text-stone-700 hover:bg-stone-100">
            Tin tức
          </NuxtLink>
          <NuxtLink to="/lich-phung-vu" class="rounded-md px-3 py-1.5 font-medium text-stone-700 hover:bg-stone-100">
            Lịch phụng vụ
          </NuxtLink>
          <NuxtLink to="/xac-thuc-chung-chi" class="rounded-md px-3 py-1.5 font-medium text-stone-700 hover:bg-stone-100">
            Tra cứu chứng chỉ
          </NuxtLink>
          <NuxtLink
            to="/dang-nhap"
            class="rounded-md bg-marian-800 px-3 py-1.5 font-semibold text-white hover:bg-marian-700"
          >
            Đăng nhập
          </NuxtLink>
        </nav>
      </div>
    </header>

    <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <slot />
    </main>

    <footer class="border-t border-stone-200 bg-white py-6 text-center text-xs text-stone-500">
      © 2026 Quản lý Giáo lý Giáo xứ
    </footer>
  </div>
</template>
