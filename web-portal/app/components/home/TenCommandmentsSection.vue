<script setup lang="ts">
// 10 Điều Răn — phân nhóm theo bổn phận
const commandmentsLeft = [
  { roman: 'I',   text: 'Thờ phượng một Đức Chúa Trời và kính mến Người trên hết mọi sự.' },
  { roman: 'II',  text: 'Chớ kêu tên Đức Chúa Trời vô cớ.' },
  { roman: 'III', text: 'Giữ ngày Chúa Nhật.' },
]

const commandmentsRight = [
  { roman: 'IV',  text: 'Thảo kính cha mẹ.' },
  { roman: 'V',   text: 'Chớ giết người.' },
  { roman: 'VI',  text: 'Chớ làm sự dâm dục.' },
  { roman: 'VII', text: 'Chớ lấy của người.' },
  { roman: 'VIII',text: 'Chớ làm chứng dối.' },
  { roman: 'IX',  text: 'Chớ muốn vợ chồng người.' },
  { roman: 'X',   text: 'Chớ tham của người.' },
]
</script>

<template>
  <!-- ══════════════════════════════════════════════════════════════
       MƯỜI ĐIỀU RĂN — Premium Sacred Section
  ══════════════════════════════════════════════════════════════════ -->
  <div class="relative rounded-3xl overflow-hidden mb-12"
    style="
      background: linear-gradient(160deg, #faf8f3 0%, #f0ece0 50%, #faf8f3 100%);
      box-shadow: 0 8px 40px rgba(26,58,107,0.08);
      border: 1px solid rgba(201,169,110,0.2);
    "
  >
    <!-- Họa tiết watermark thánh giá chìm -->
    <div class="absolute inset-0 cross-pattern opacity-60 pointer-events-none" />

    <!-- Bokeh decorative -->
    <div class="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
      style="background: radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%);"
    />
    <div class="absolute bottom-0 left-0 w-56 h-56 rounded-full pointer-events-none"
      style="background: radial-gradient(circle, rgba(139,26,26,0.05) 0%, transparent 70%);"
    />

    <!-- Icon chìm góc trái -->
    <UIcon
      name="i-heroicons-book-open"
      class="w-52 h-52 absolute -bottom-12 -left-12 opacity-[0.04] select-none pointer-events-none"
      style="color: #1a3a6b;"
    />
    <!-- Icon chìm góc phải -->
    <UIcon
      name="i-heroicons-scale"
      class="w-52 h-52 absolute -top-12 -right-12 opacity-[0.04] select-none pointer-events-none"
      style="color: #8b1a1a;"
    />

    <!-- Content -->
    <div class="relative z-10 p-8 md:p-12">

      <!-- Section Title -->
      <div class="text-center mb-10">
        <!-- Gold pill -->
        <div class="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black tracking-[0.2em] uppercase mb-4"
          style="background: rgba(201,169,110,0.12); color: #a07840; border: 1px solid rgba(201,169,110,0.25);"
        >
          ✝ Luật Chúa
        </div>

        <h2 class="text-3xl md:text-4xl lg:text-5xl font-black font-serif mb-3"
          style="color: #1a3a6b;"
        >
          Mười Điều Răn
        </h2>

        <p class="italic text-stone-500 dark:text-stone-400 text-base">
          Luật Chúa ban cho Môsê trên núi Sinai
        </p>

        <!-- Sacred divider -->
        <div class="sacred-divider mt-6 max-w-xs mx-auto">
          <span class="text-lg" style="color: #c9a96e;">✦</span>
        </div>
      </div>

      <!-- Two columns -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-5xl mx-auto">

        <!-- ── Cột Trái: Bổn Phận Với Thiên Chúa ── -->
        <div class="flex flex-col gap-4">
          <!-- Column Label -->
          <div class="flex items-center justify-center gap-3 mb-2">
            <div class="h-px flex-1" style="background: linear-gradient(90deg, transparent, rgba(201,169,110,0.4));" />
            <span class="text-xs font-black tracking-[0.18em] uppercase px-3"
              style="color: #a07840;"
            >Bổn Phận Với Thiên Chúa</span>
            <div class="h-px flex-1" style="background: linear-gradient(90deg, rgba(201,169,110,0.4), transparent);" />
          </div>

          <div
            v-for="(cmd, index) in commandmentsLeft"
            :key="index"
            class="group relative rounded-2xl p-5 border transition-all duration-400 overflow-hidden cursor-default"
            style="
              background: rgba(255,255,255,0.85);
              border-color: rgba(201,169,110,0.15);
              box-shadow: 0 2px 12px rgba(26,58,107,0.05);
            "
          >
            <!-- Hover effect background -->
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl"
              style="background: linear-gradient(135deg, rgba(26,58,107,0.04), rgba(201,169,110,0.04));"
            />
            <!-- Border glow khi hover -->
            <div class="absolute inset-0 rounded-2xl border border-transparent group-hover:border-gold/30 transition-colors duration-400"
              style="border-color: rgba(201,169,110,0);"
            />

            <!-- Watermark Roman numeral -->
            <div class="absolute -right-2 -bottom-6 font-black font-serif select-none pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100"
              style="font-size: 5rem; color: rgba(26,58,107,0.06); line-height: 1;"
            >
              {{ cmd.roman }}
            </div>

            <!-- Content -->
            <div class="relative z-10 flex items-start gap-4">
              <!-- Roman numeral badge -->
              <div class="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-black font-serif text-sm shadow-sm"
                style="
                  background: linear-gradient(135deg, #1a3a6b, #2a5298);
                  color: #c9a96e;
                  min-width: 3rem;
                  box-shadow: 0 2px 8px rgba(26,58,107,0.25);
                "
              >
                {{ cmd.roman }}
              </div>
              <p class="font-semibold text-base text-stone-800 dark:text-stone-100 leading-relaxed pt-2">
                {{ cmd.text }}
              </p>
            </div>
          </div>
        </div>

        <!-- ── Cột Phải: Bổn Phận Với Tha Nhân ── -->
        <div class="flex flex-col gap-4">
          <!-- Column Label -->
          <div class="flex items-center justify-center gap-3 mb-2">
            <div class="h-px flex-1" style="background: linear-gradient(90deg, transparent, rgba(139,26,26,0.3));" />
            <span class="text-xs font-black tracking-[0.18em] uppercase px-3"
              style="color: #8b1a1a;"
            >Bổn Phận Với Tha Nhân</span>
            <div class="h-px flex-1" style="background: linear-gradient(90deg, rgba(139,26,26,0.3), transparent);" />
          </div>

          <div
            v-for="(cmd, index) in commandmentsRight"
            :key="index"
            class="group relative rounded-2xl p-5 border transition-all duration-400 overflow-hidden cursor-default"
            style="
              background: rgba(255,255,255,0.85);
              border-color: rgba(139,26,26,0.1);
              box-shadow: 0 2px 12px rgba(26,58,107,0.05);
            "
          >
            <!-- Hover effect -->
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl"
              style="background: linear-gradient(135deg, rgba(139,26,26,0.03), rgba(201,169,110,0.04));"
            />

            <!-- Watermark Roman numeral -->
            <div class="absolute -right-2 -bottom-6 font-black font-serif select-none pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100"
              style="font-size: 5rem; color: rgba(139,26,26,0.06); line-height: 1;"
            >
              {{ cmd.roman }}
            </div>

            <!-- Content -->
            <div class="relative z-10 flex items-start gap-4">
              <!-- Roman numeral badge — màu đỏ -->
              <div class="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-black font-serif text-sm shadow-sm"
                style="
                  background: linear-gradient(135deg, #8b1a1a, #b02a2a);
                  color: #e8c98a;
                  min-width: 3rem;
                  box-shadow: 0 2px 8px rgba(139,26,26,0.25);
                "
              >
                {{ cmd.roman }}
              </div>
              <p class="font-semibold text-base text-stone-800 dark:text-stone-100 leading-relaxed pt-2">
                {{ cmd.text }}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
