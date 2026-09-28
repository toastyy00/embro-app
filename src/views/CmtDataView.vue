<script setup>
import { useAppStore } from '../stores/useAppStore.js';

const store = useAppStore();
</script>

<template>
  <section class="space-y-3.5 no-print font-mono">
    <!-- Module Header Banner -->
    <div class="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3.5 sm:p-4 shadow-sm flex items-center justify-between gap-3 flex-wrap">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400 shrink-0">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
            <path d="M6 6h10M6 10h10"></path>
          </svg>
        </div>
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h2 class="text-sm font-bold text-white uppercase tracking-tight">Pusat Data CMT &amp; Order Produksi</h2>
            <span class="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold uppercase tracking-wider">Hub Data Utama</span>
          </div>
          <p class="text-[11px] text-zinc-400 font-sans">Input No CMT, Nama Floppy, variasi, dan opsi warna sebelum dialokasikan ke mesin</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-[10.5px] px-2.5 py-1 rounded bg-zinc-900 border border-zinc-750 text-zinc-300 font-semibold">
          <strong class="text-cyan-400 font-bold">{{ store.uniqueTotalCmts }}</strong> CMT ({{ store.totalCmtCount }} Variasi)
        </span>
        <button
          @click="store.activeModule = 'trial'; store.activeTab = 'operator'"
          class="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          title="Buka simulasi urutan jarum &amp; ACC operator"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v20M9 5h6M10 9h4"></path>
          </svg>
          <span>Trial Benang 🪡</span>
        </button>
      </div>
    </div>

    <!-- Sub Tabs: CMT vs Kamus Warna -->
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-sm bg-cyan-400"></span>
        <h2 class="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
          {{ store.cmtSubTab === 'colors' ? 'Kamus Warna Benang' : 'Form Input &amp; Daftar CMT' }}
        </h2>
      </div>
      <div class="data-switch">
        <button :class="{ 'is-active': store.cmtSubTab === 'cmt' }" @click="store.cmtSubTab = 'cmt'">Data CMT</button>
        <button :class="{ 'is-active': store.cmtSubTab === 'colors' }" @click="store.cmtSubTab = 'colors'">Kamus Warna</button>
      </div>
    </div>

    <!-- VIEW A: Kamus Warna (Star Elephant Rayon) -->
    <div v-show="store.cmtSubTab === 'colors'" class="bg-zinc-900/90 border border-zinc-800/90 rounded-lg p-3 sm:p-4 shadow-sm">
      <div class="flex items-center justify-between mb-1">
        <h3 class="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">KAMUS WARNA BENANG (STAR ELEPHANT RAYON)</h3>
        <span class="text-[10px] font-mono text-zinc-500">PT ANTELAS / 120D</span>
      </div>
      <p class="text-[11px] text-zinc-400 font-sans mb-3">Warna standar katalog rayon garmen lokal. Klik kotak warna jika perlu penyesuaian:</p>

      <!-- Color Grid (Compact) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
        <div v-for="(hex, code) in store.activeColorMap" :key="code" class="flex items-center justify-between bg-zinc-950 px-2.5 py-1.5 rounded-lg border border-zinc-800">
          <div class="flex items-center gap-2">
            <label class="relative cursor-pointer shrink-0">
              <input type="color" v-model="store.colorMap[code]" class="w-6 h-6 rounded border border-zinc-700 bg-transparent cursor-pointer p-0 overflow-hidden" />
            </label>

            <div>
              <div class="flex items-center gap-1">
                <span class="font-mono font-bold text-zinc-100 text-xs">{{ code }}</span>
                <span v-if="store.THREAD_METADATA[code]" class="text-[10px] text-zinc-400 font-sans truncate max-w-[130px]"> • {{ store.THREAD_METADATA[code].name }} </span>
              </div>
              <span class="text-[10px] text-zinc-500 font-mono"> {{ store.colorMap[code] || hex }} </span>
            </div>
          </div>

          <span
            class="px-2 py-0.5 rounded text-[10px] font-mono font-bold border border-zinc-700"
            :style="{ 
              backgroundColor: store.getThreadColor(code, store.colorMap), 
              color: '#ffffff'
            }"
          >
            {{ code }}
          </span>
        </div>
      </div>

      <button
        @click="store.resetColors"
        class="w-full h-8.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-mono font-medium rounded-lg border border-zinc-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <svg class="w-3.5 h-3.5 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="1 4 1 10 7 10"></polyline>
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
        </svg>
        Reset Warna ke Standar Star Elephant
      </button>
    </div>

    <!-- VIEW B: Form Tambah CMT, Daftar CMT Aktif & Arsip Sesi -->
    <div v-show="store.cmtSubTab === 'cmt'" class="space-y-3.5">
      <!-- 1. Form Tambah Data CMT (Parent-Child Multi-Variasi Repeater) -->
      <div class="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 sm:p-4 shadow-sm space-y-3.5">
        <!-- Card Header -->
        <div class="flex items-center justify-between pb-2.5 border-b border-zinc-800/80">
          <div class="flex items-center gap-2">
            <h3 class="text-xs font-mono font-bold text-zinc-100 uppercase tracking-wider">TAMBAH CMT BARU</h3>
            <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-750 font-semibold"> {{ store.variantRows.length }} Variasi </span>
          </div>
          <span class="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold">INPUT PANEL</span>
        </div>

        <div class="space-y-3">
          <!-- Section 1: Identitas CMT (No. CMT & Nama Film/Floppy Satu Baris) -->
          <div class="flex items-center gap-2.5">
            <!-- No. CMT -->
            <div class="w-24 sm:w-28 shrink-0">
              <label class="block text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-1.5 truncate"> No. CMT <span class="text-rose-400 font-bold">*</span> </label>
              <input
                v-model="store.newCmt"
                placeholder="620"
                class="w-full h-10 bg-zinc-900 border border-zinc-750 focus:border-white focus:ring-1 focus:ring-white/30 rounded-md px-3 text-xs sm:text-sm font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition-all"
              />
            </div>
            <!-- Nama Film/Floppy -->
            <div class="flex-1 min-w-0">
              <label class="block text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-1.5 truncate"> Nama Film/Floppy </label>
              <input
                v-model="store.newFlopy"
                placeholder="Flopy B / Film 01"
                class="w-full h-10 bg-zinc-900 border border-zinc-750 focus:border-white focus:ring-1 focus:ring-white/30 rounded-md px-3 text-xs sm:text-sm font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition-all"
              />
            </div>
          </div>

          <!-- Section 2: Variasi & Kode Benang -->
          <div class="space-y-2.5 pt-1">
            <div class="flex items-center justify-between text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 font-semibold px-0.5">
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-sm bg-zinc-300"></span>
                <span>Variasi &amp; Kode Benang</span>
              </div>
              <span class="text-[10px] text-zinc-500 font-normal">Klik <strong class="text-zinc-300">+ OPSI</strong> jika film memiliki 2+ warna</span>
            </div>

            <!-- List Variasi Rows -->
            <div class="space-y-2.5">
              <div v-for="(row, rIdx) in store.variantRows" :key="rIdx">
                <!-- KONDISI A: Default Mode 1 Warna (Single Input Field) -->
                <div v-if="!row.options || row.options.length <= 1" class="flex items-center gap-2">
                  <input
                    v-model="row.variant"
                    :placeholder="store.getVariantPlaceholder(rIdx)"
                    title="Nama variasi (cth: C1)"
                    class="w-24 sm:w-28 h-10 bg-zinc-900 border border-zinc-750 focus:border-white focus:ring-1 focus:ring-white/30 rounded-md px-3 text-xs sm:text-sm font-mono font-bold text-zinc-100 placeholder:text-zinc-600 focus:outline-none uppercase shrink-0 transition-all"
                  />

                  <div class="flex-1 min-w-0">
                    <input
                      v-model="row.options[0]"
                      placeholder="cth: 1139, 1070, 1320, 1175 (langsung 4 opsi)"
                      class="w-full h-10 bg-zinc-900 border border-zinc-750 focus:border-white focus:ring-1 focus:ring-white/30 rounded-md px-3 text-xs sm:text-sm font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition-all"
                      @keyup.enter="rIdx === store.variantRows.length - 1 ? store.addCMT() : null"
                    />
                  </div>

                  <button
                    @click="store.addOptionToRow(rIdx)"
                    type="button"
                    title="Klik jika desain floppy memiliki 2 warna atau lebih (kombinasi)"
                    class="h-10 px-2.5 sm:px-3 rounded-md border border-dashed border-zinc-700 hover:border-zinc-500 bg-zinc-900/60 hover:bg-zinc-850 text-zinc-300 hover:text-white font-mono text-xs font-semibold flex items-center gap-1 shrink-0 transition-all select-none cursor-pointer"
                  >
                    <span class="text-sm font-bold leading-none">+</span>
                    <span class="text-[11px]">OPSI</span>
                  </button>

                  <button
                    v-if="store.variantRows.length > 1"
                    @click="store.removeVariantRow(rIdx)"
                    type="button"
                    title="Hapus variasi ini"
                    class="w-10 h-10 flex items-center justify-center shrink-0 rounded-md border border-zinc-750 bg-zinc-900 hover:bg-rose-500/15 hover:border-rose-500/40 text-zinc-400 hover:text-rose-300 transition-all cursor-pointer"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                <!-- KONDISI B: Mode Multi-Warna Kombinasi -->
                <div v-else class="bg-zinc-950/80 border border-zinc-800 hover:border-zinc-750 rounded-lg p-2.5 sm:p-3 space-y-2.5 transition-all shadow-sm">
                  <div class="flex items-center justify-between gap-2 pb-1.5 border-b border-zinc-850">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="w-5 h-5 rounded bg-zinc-850 text-zinc-300 text-[10px] font-bold flex items-center justify-center font-mono border border-zinc-750">
                        {{ rIdx + 1 }}
                      </span>
                      <span class="text-[11px] font-mono uppercase font-bold text-zinc-300">Variasi:</span>
                      <input
                        v-model="row.variant"
                        :placeholder="store.getVariantPlaceholder(rIdx)"
                        class="w-24 sm:w-28 h-7 bg-zinc-900 border border-zinc-750 focus:border-white focus:ring-1 focus:ring-white/30 rounded px-2 text-xs font-mono font-bold text-zinc-100 placeholder:text-zinc-600 focus:outline-none uppercase transition-all"
                        title="Nama variasi (cth: C1)"
                      />
                      <span class="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold">
                        Mode Kombinasi ({{ row.options.length }} Opsi)
                      </span>
                    </div>

                    <div class="flex items-center gap-1.5">
                      <button
                        @click="store.resetRowToSingleOption(rIdx)"
                        type="button"
                        title="Kembalikan ke satu input field (mode 1 warna)"
                        class="h-6 px-2 rounded text-[10px] font-mono text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
                      >
                        ↺ Mode 1 Warna
                      </button>

                      <button
                        v-if="store.variantRows.length > 1"
                        @click="store.removeVariantRow(rIdx)"
                        type="button"
                        title="Hapus variasi ini"
                        class="w-6 h-6 rounded flex items-center justify-center text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Wadah Opsi Warna Memanjang ke Samping -->
                  <div>
                    <div class="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1.5 px-0.5">
                      <span class="uppercase tracking-wider font-semibold">Opsi Kode Benang (Geser ke samping):</span>
                      <span class="text-[9.5px] text-zinc-500 lowercase">(1 input = 1 opsi kombinasi)</span>
                    </div>

                    <div class="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin -mx-1 px-1">
                      <div
                        v-for="(opt, optIdx) in row.options"
                        :key="optIdx"
                        class="shrink-0 w-36 sm:w-44 bg-zinc-900 border border-zinc-750 hover:border-zinc-650 rounded-lg p-2 space-y-1.5 transition-all shadow-sm"
                      >
                        <div class="flex items-center justify-between pb-1 border-b border-zinc-800">
                          <span class="text-[10px] font-mono font-bold text-zinc-300 uppercase">
                            Opsi {{ optIdx + 1 }}
                          </span>
                          <button
                            @click="store.removeOptionFromRow(rIdx, optIdx)"
                            type="button"
                            title="Hapus opsi ini"
                            class="w-4 h-4 rounded flex items-center justify-center text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer transition-colors text-[10px]"
                          >
                            ✕
                          </button>
                        </div>

                        <div>
                          <input
                            v-model="row.options[optIdx]"
                            placeholder="cth: 1171 1070"
                            class="w-full h-8 bg-zinc-950 border border-zinc-750 focus:border-white focus:ring-1 focus:ring-white/30 rounded px-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition-all"
                            @keyup.enter="rIdx === store.variantRows.length - 1 && optIdx === row.options.length - 1 ? store.addCMT() : null"
                          />
                        </div>
                      </div>

                      <button
                        @click="store.addOptionToRow(rIdx)"
                        type="button"
                        title="Tambah Opsi Warna Baru ke Samping"
                        class="shrink-0 w-24 sm:w-28 h-[60px] rounded-lg border border-dashed border-zinc-750 hover:border-zinc-500 bg-zinc-900/40 hover:bg-zinc-850 text-zinc-400 hover:text-white font-mono text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all select-none cursor-pointer p-1.5"
                      >
                        <span class="text-sm font-bold leading-none">+</span>
                        <span class="text-[10px] font-medium">+ Opsi</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tombol Tambah Variasi Baru -->
            <button
              @click="store.addVariantRow"
              type="button"
              class="w-full h-9 rounded-md border border-dashed border-zinc-700 hover:border-zinc-500 bg-zinc-900/60 hover:bg-zinc-850 text-zinc-300 hover:text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all select-none cursor-pointer"
            >
              <svg class="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>+ Tambah Variasi Baru {{ store.getVariantPlaceholder(store.variantRows.length) ? `(${store.getVariantPlaceholder(store.variantRows.length)})` : '' }}</span>
            </button>
          </div>

          <!-- Section 3: Tombol Simpan CMT -->
          <div class="pt-1.5 border-t border-zinc-800/80">
            <button
              @click="store.addCMT"
              style="background-color: #ffffff !important; color: #09090b !important; color-scheme: only light !important"
              class="btn-white-solid w-full h-10 rounded-md bg-white hover:bg-zinc-200 active:bg-zinc-300 text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-sm cursor-pointer select-none"
            >
              <svg class="w-4 h-4" style="color: #09090b !important; stroke: #09090b !important" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span style="color: #09090b !important">Simpan CMT {{ store.variantRows.length > 1 ? `(${store.variantRows.length} Variasi)` : '' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 2. Daftar CMT Aktif -->
      <div class="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 sm:p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800/70">
          <div class="flex items-center gap-2">
            <h3 class="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">DAFTAR CMT AKTIF</h3>
            <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-semibold"> {{ store.uniqueTotalCmts }} CMT </span>
          </div>

          <div class="flex items-center gap-2 text-xs font-mono">
            <button v-if="store.cmts.length > 0" @click="store.clearAllCMTs" title="Kosongkan seluruh daftar CMT" class="text-[11px] font-mono text-zinc-500 hover:text-rose-400 transition-colors py-0.5 px-1.5 rounded hover:bg-rose-500/10 cursor-pointer">
              Kosongkan
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="store.cmts.length === 0" class="text-center py-6 px-4 rounded-lg border border-dashed border-zinc-800 bg-zinc-950/40">
          <div class="text-xs font-mono font-medium text-zinc-400 mb-1">Daftar CMT masih kosong</div>
          <div class="text-[11px] text-zinc-500 font-mono">Input data di atas atau <button @click="store.loadSampleData" class="text-zinc-300 underline hover:text-white cursor-pointer">muat sampel</button>.</div>
        </div>

        <!-- CMT Cards List (Grouped by CMT) -->
        <div v-else class="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          <div v-for="group in store.groupedCmts" :key="group.cmt" class="bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700/80 rounded-lg p-2.5 sm:p-3 transition-colors text-xs font-mono shadow-sm space-y-2">
            <!-- Card Header: CMT ID, Floppy, Badge Variasi, dan Tombol Hapus Seluruh CMT -->
            <div class="flex items-center justify-between gap-2 pb-1.5 border-b border-zinc-850/80">
              <div class="flex items-center gap-1.5 text-[11px] font-mono min-w-0 flex-wrap leading-tight">
                <span class="font-bold text-white tracking-tight text-[11.5px]"> CMT {{ group.cmt }} </span>

                <template v-if="group.flopy">
                  <span class="text-zinc-600 select-none text-[9px]">|</span>
                  <span class="text-zinc-400 font-medium text-[10px]"> {{ group.flopy }} </span>
                </template>

                <span v-if="group.variants.length > 1" class="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-750 text-amber-300 font-semibold"> {{ group.variants.length }} Variasi </span>
              </div>

              <button
                @click="store.removeCMTGroup(group)"
                :title="group.variants.length > 1 ? `Hapus seluruh CMT ${group.cmt} (${group.variants.length} variasi)` : `Hapus CMT ${group.cmt}`"
                class="w-6 h-6 rounded flex items-center justify-center text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <!-- List Variasi dalam Kartu yang Sama -->
            <!-- Kondisi A: Lebih dari 1 Variasi -->
            <div v-if="group.variants.length > 1" class="space-y-1.5">
              <div v-for="(v, vIdx) in group.variants" :key="vIdx" class="bg-zinc-900/60 border border-zinc-850/80 hover:border-zinc-750/70 rounded p-2 transition-colors space-y-1.5">
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="text-[11px] font-mono font-bold text-zinc-200"> {{ v.variant && v.variant !== '-' ? v.variant : `Variasi ${vIdx + 1}` }} </span>
                    <span class="text-[9.5px] font-mono text-zinc-500"> • {{ v.threads.length }} warna </span>
                  </div>

                  <button
                    @click="store.removeCMTVariant(v.itemRef)"
                    :title="`Hapus variasi ${v.variant || (vIdx + 1)}`"
                    class="w-5 h-5 rounded flex items-center justify-center text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
                  >
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                <!-- Urutan Benang Variasi -->
                <div class="flex flex-wrap items-center gap-1.5">
                  <template v-if="store.hasItemCombinationOptions(v.itemRef)">
                    <div
                      v-for="(opt, optIdx) in v.itemRef.threadOptions"
                      :key="optIdx"
                      @click.stop="store.toggleOptionAcc(v.itemRef, optIdx)"
                      :title="store.isOptionAcc(v.itemRef, optIdx) ? 'Klik untuk membatalkan ACC opsi ini' : 'Klik untuk menyetujui (ACC) opsi ini'"
                      class="inline-flex items-stretch rounded border overflow-hidden cursor-pointer select-none transition-all active:scale-95 shadow-sm text-left group"
                      :class="store.isOptionAcc(v.itemRef, optIdx)
                        ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500/50'
                        : 'border-zinc-750 bg-zinc-900 hover:border-zinc-500 hover:bg-zinc-850'"
                    >
                      <div
                        v-if="store.isOptionAcc(v.itemRef, optIdx)"
                        class="px-1.5 py-0.5 bg-emerald-500 text-zinc-950 flex items-center justify-center border-r border-emerald-400"
                        title="Opsi kombinasi ini telah di-ACC"
                      >
                        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>

                      <template v-for="(th, tIdx) in (Array.isArray(opt) ? opt : [opt])" :key="tIdx">
                        <div
                          v-if="tIdx > 0"
                          class="w-2 bg-zinc-950 flex items-center justify-center border-x border-zinc-700/80 select-none shrink-0"
                        >
                          <div class="flex items-center gap-[1px]">
                            <span class="w-[1px] h-3 bg-zinc-500 rounded-full"></span>
                            <span class="w-[1px] h-3 bg-zinc-500 rounded-full"></span>
                          </div>
                        </div>

                        <div
                          class="px-2 py-0.5 flex items-center gap-1.5 text-[10px] font-mono shrink-0 transition-colors"
                          :class="store.isOptionAcc(v.itemRef, optIdx) ? 'text-white font-bold' : 'text-zinc-300 group-hover:text-white'"
                        >
                          <span class="w-2 h-2 rounded-full border border-white/20 shrink-0" :style="{ backgroundColor: store.getThreadColor(th, store.colorMap) }"></span>
                          <span>{{ th }}</span>
                        </div>
                      </template>
                    </div>
                  </template>
                  <template v-else>
                    <span class="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mr-0.5">Benang:</span>
                    <button
                      v-for="(th, thIdx) in v.threads"
                      :key="thIdx"
                      type="button"
                      @click="store.toggleThreadAcc(v.itemRef, th)"
                      :title="store.isThreadAcc(v.itemRef, th) ? `Klik untuk membatalkan ACC benang ${th}` : `Klik untuk menyetujui (ACC) benang ${th}`"
                      :class="store.isThreadAcc(v.itemRef, th)
                        ? 'bg-zinc-800 border-white text-white font-bold ring-1 ring-white/60 shadow-sm'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'"
                      class="inline-flex items-center gap-1.5 px-2 py-0.5 border rounded text-[10px] font-mono transition-all cursor-pointer active:scale-95"
                    >
                      <span class="w-2 h-2 rounded-full border border-white/20 shrink-0" :style="{ backgroundColor: store.getThreadColor(th, store.colorMap) }"></span>
                      <span>{{ th }}</span>
                    </button>
                  </template>
                </div>
              </div>
            </div>

            <!-- Kondisi B: Hanya 1 Variasi -->
            <div v-else class="space-y-1.5">
              <div v-if="group.variants[0].variant && group.variants[0].variant !== '-'" class="flex items-center gap-1.5">
                <span class="text-[10.5px] font-mono font-medium text-zinc-300">{{ group.variants[0].variant }}</span>
              </div>
              <div class="flex flex-wrap items-center gap-1.5">
                <template v-if="store.hasItemCombinationOptions(group.variants[0].itemRef)">
                  <div
                    v-for="(opt, optIdx) in group.variants[0].itemRef.threadOptions"
                    :key="optIdx"
                    @click.stop="store.toggleOptionAcc(group.variants[0].itemRef, optIdx)"
                    :title="store.isOptionAcc(group.variants[0].itemRef, optIdx) ? 'Klik untuk membatalkan ACC opsi ini' : 'Klik untuk menyetujui (ACC) opsi ini'"
                    class="inline-flex items-stretch rounded border overflow-hidden cursor-pointer select-none transition-all active:scale-95 shadow-sm text-left group"
                    :class="store.isOptionAcc(group.variants[0].itemRef, optIdx)
                      ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500/50'
                      : 'border-zinc-750 bg-zinc-900 hover:border-zinc-500 hover:bg-zinc-850'"
                  >
                    <div
                      v-if="store.isOptionAcc(group.variants[0].itemRef, optIdx)"
                      class="px-1.5 py-0.5 bg-emerald-500 text-zinc-950 flex items-center justify-center border-r border-emerald-400"
                      title="Opsi kombinasi ini telah di-ACC"
                    >
                      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>

                    <template v-for="(th, tIdx) in (Array.isArray(opt) ? opt : [opt])" :key="tIdx">
                      <div
                        v-if="tIdx > 0"
                        class="w-2 bg-zinc-950 flex items-center justify-center border-x border-zinc-700/80 select-none shrink-0"
                      >
                        <div class="flex items-center gap-[1px]">
                          <span class="w-[1px] h-3 bg-zinc-500 rounded-full"></span>
                          <span class="w-[1px] h-3 bg-zinc-500 rounded-full"></span>
                        </div>
                      </div>

                      <div
                        class="px-2 py-0.5 flex items-center gap-1.5 text-[10px] font-mono shrink-0 transition-colors"
                        :class="store.isOptionAcc(group.variants[0].itemRef, optIdx) ? 'text-white font-bold' : 'text-zinc-300 group-hover:text-white'"
                      >
                        <span class="w-2 h-2 rounded-full border border-white/20 shrink-0" :style="{ backgroundColor: store.getThreadColor(th, store.colorMap) }"></span>
                        <span>{{ th }}</span>
                      </div>
                    </template>
                  </div>
                </template>
                <template v-else>
                  <span class="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mr-0.5">Benang:</span>
                  <button
                    v-for="(th, thIdx) in group.variants[0].threads"
                    :key="thIdx"
                    type="button"
                    @click="store.toggleThreadAcc(group.variants[0].itemRef, th)"
                    :title="store.isThreadAcc(group.variants[0].itemRef, th) ? `Klik untuk membatalkan ACC benang ${th}` : `Klik untuk menyetujui (ACC) benang ${th}`"
                    :class="store.isThreadAcc(group.variants[0].itemRef, th)
                      ? 'bg-zinc-800 border-white text-white font-bold ring-1 ring-white/60 shadow-sm'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'"
                    class="inline-flex items-center gap-1.5 px-2 py-0.5 border rounded text-[10px] font-mono transition-all cursor-pointer active:scale-95"
                  >
                    <span class="w-2 h-2 rounded-full border border-white/20 shrink-0" :style="{ backgroundColor: store.getThreadColor(th, store.colorMap) }"></span>
                    <span>{{ th }}</span>
                  </button>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Arsip Sesi / Snapshot (Collapsible & Compact) -->
      <div class="bg-zinc-900/60 border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm transition-all">
        <button type="button" @click="store.isSnapshotOpen = !store.isSnapshotOpen" class="w-full flex items-center justify-between p-2.5 sm:px-3 hover:bg-zinc-850/40 transition-colors select-none text-left cursor-pointer">
          <div class="flex items-center gap-2 font-mono text-[11px] font-semibold text-zinc-400">
            <svg class="w-3.5 h-3.5 text-zinc-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="21 8 21 21 3 21 3 8"></polyline>
              <rect x="1" y="3" width="22" height="5"></rect>
              <line x1="10" y1="12" x2="14" y2="12"></line>
            </svg>
            <span class="tracking-wider uppercase text-zinc-300">Arsip Sesi</span>
            <span class="px-1.5 py-0.2 rounded text-[10px] font-mono border" :class="store.savedSessions.length > 0 ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-zinc-950/80 border-zinc-850 text-zinc-600'">
              {{ store.savedSessions.length }}
            </span>
          </div>

          <svg
            class="w-3.5 h-3.5 text-zinc-400 transition-transform duration-200"
            :class="{ 'rotate-180': store.isSnapshotOpen }"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        <div v-show="store.isSnapshotOpen" class="p-2.5 sm:p-3 pt-0 border-t border-zinc-800/60 space-y-2.5 mt-1 font-mono">
          <div class="flex items-center justify-between pb-1.5 border-b border-zinc-850/80 text-[10.5px]">
            <div class="flex items-center gap-1.5 text-zinc-400">
              <span class="w-2 h-2 rounded-full" :class="store.isSyncConnected ? 'bg-emerald-400' : 'bg-amber-400'"></span>
              <span>Ruangan Cloud: <strong class="text-zinc-200">{{ store.currentRoomCode }}</strong></span>
            </div>
            <button @click="store.openCloudSettingsModal" type="button" class="text-zinc-400 hover:text-zinc-200 underline text-[10.5px] cursor-pointer">Ganti Ruangan</button>
          </div>

          <div class="flex gap-2">
            <input
              v-model="store.sessionNote"
              placeholder="Nama arsip (cth: Shift Pagi 28 Sep - CMT 620)..."
              class="flex-1 h-9 bg-zinc-950 border border-zinc-800 focus:border-white focus:ring-1 focus:ring-white/30 rounded-md px-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none transition-all"
              @keyup.enter="store.saveCurrentSession"
            />
            <button
              @click="store.saveCurrentSession"
              type="button"
              style="background-color: #ffffff !important; color: #09090b !important; color-scheme: only light !important"
              class="btn-white-solid h-9 px-3.5 rounded-md bg-white hover:bg-zinc-200 active:bg-zinc-300 text-zinc-950 font-bold text-xs transition-colors shrink-0 cursor-pointer shadow-sm"
            >
              Simpan Sesi
            </button>
          </div>

          <div v-if="store.savedSessions.length === 0" class="text-center py-3 px-2 text-[10.5px] text-zinc-600 bg-zinc-950/60 rounded-lg border border-zinc-850/80">Belum ada arsip sesi tersimpan.</div>
          <div v-else class="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            <div
              v-for="(sess, sIdx) in store.savedSessions"
              :key="sess.id"
              class="bg-zinc-950/80 p-2 sm:px-2.5 rounded-lg border transition-all text-xs space-y-1"
              :class="store.activeSessionId === sess.id ? 'border-emerald-500/60 bg-emerald-950/10 shadow-sm' : 'border-zinc-850 hover:border-zinc-750'"
            >
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-1.5 min-w-0 flex-1">
                  <span class="font-bold text-[11px] truncate" :class="store.activeSessionId === sess.id ? 'text-emerald-300' : 'text-white'"> {{ sess.name || `Sesi #${sIdx + 1}` }} </span>
                </div>

                <div class="flex items-center gap-1 shrink-0">
                  <button
                    v-if="store.activeSessionId !== sess.id"
                    @click="store.activateSession(sess)"
                    type="button"
                    title="Aktifkan sesi ini untuk pengerjaan trial"
                    class="h-5 px-2 rounded bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-750 text-[10px] font-medium transition-colors cursor-pointer"
                  >
                    Aktifkan
                  </button>

                  <button
                    @click="store.copySessionLink(sess)"
                    type="button"
                    title="Salin Sharelink sesi ini"
                    class="w-5 h-5 rounded bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-750 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                  </button>

                  <button
                    @click="store.deleteSession(sIdx)"
                    type="button"
                    title="Hapus arsip ini"
                    class="w-5 h-5 rounded hover:bg-rose-500/10 text-zinc-600 hover:text-rose-400 flex items-center justify-center transition-colors text-[11px] cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between gap-2 text-[10px] text-zinc-500">
                <span class="truncate"> {{ sess.cmts ? sess.cmts.length : 0 }} Variasi </span>
                <span class="text-zinc-400 shrink-0 font-mono">{{ sess.date ? sess.date.split('T')[0] : '' }}</span>
              </div>
            </div>
          </div>

          <div class="pt-2 border-t border-zinc-800/50 flex items-center justify-between text-[10px] text-zinc-500">
            <span>Sampel bawaan pabrik:</span>
            <button @click="store.loadSampleData" type="button" title="Muat dataset sampel bawaan (akan meminta konfirmasi)" class="text-zinc-400 hover:text-zinc-200 underline transition-colors cursor-pointer">Muat Sampel</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
