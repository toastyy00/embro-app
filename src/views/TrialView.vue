<script setup>
import { useAppStore } from '../stores/useAppStore.js';

const store = useAppStore();
</script>

<template>
  <div class="space-y-3.5 font-mono">
    <!-- ================= TAB NAVIGATION (COMPACT) ================= -->
    <nav class="workspace-nav grid grid-cols-3 gap-1 bg-zinc-900 border border-zinc-800/80 p-1 rounded-lg mb-3 text-xs font-medium no-print">
      <button
        @click="store.activeTab = 'operator'"
        :class="store.activeTab === 'operator' ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/80 shadow-sm' : 'text-zinc-400 hover:text-zinc-200 border border-transparent'"
        class="h-8.5 py-1.5 rounded-md transition-all flex items-center justify-center gap-1 select-none text-[11px] cursor-pointer"
      >
        <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 11 12 14 22 4"></polyline>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
        </svg>
        <span>Trial</span>
      </button>

      <button
        @click="store.activeTab = 'rack'"
        :class="store.activeTab === 'rack' ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/80 shadow-sm' : 'text-zinc-400 hover:text-zinc-200 border border-transparent'"
        class="h-8.5 py-1.5 rounded-md transition-all flex items-center justify-center gap-1 select-none text-[11px] cursor-pointer"
      >
        <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="4" y1="21" x2="4" y2="14"></line>
          <line x1="4" y1="10" x2="4" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12" y2="3"></line>
          <line x1="20" y1="21" x2="20" y2="16"></line>
          <line x1="20" y1="12" x2="20" y2="3"></line>
        </svg>
        <span>Mesin</span>
      </button>

      <button
        @click="store.activeModule = 'cmt'"
        class="h-8.5 py-1.5 rounded-md transition-all flex items-center justify-center gap-1 select-none text-[11px] text-zinc-400 hover:text-cyan-300 hover:bg-zinc-850/60 border border-transparent cursor-pointer"
        title="Buka Pusat Data CMT untuk menambah atau mengedit CMT"
      >
        <svg class="w-3.5 h-3.5 shrink-0 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
          <path d="M6 6h10M6 10h10"></path>
        </svg>
        <span>Data CMT ↗</span>
      </button>
    </nav>

    <!-- ================= TAB 1: TRIAL BORDIR ================= -->
    <main v-if="store.activeTab === 'operator'" class="space-y-3.5">
      <!-- Empty state when no CMT exists -->
      <div v-if="store.cmts.length === 0" class="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-6 text-center font-mono">
        <div class="text-xs text-zinc-300 font-bold mb-1">Daftar Pengerjaan Kosong</div>
        <p class="text-[11px] text-zinc-500 font-sans">Silakan tambahkan data CMT melalui menu <button @click="store.activeModule = 'cmt'" class="text-cyan-300 underline font-semibold cursor-pointer">Data CMT</button> atau <button @click="store.loadSampleData" class="text-zinc-300 underline font-semibold cursor-pointer">muat sampel</button>.</p>
      </div>

      <!-- Stage Cards -->
      <div v-else class="space-y-3.5">
        <div
          v-for="(stage, idx) in store.calculation.stagesList"
          :key="idx"
          class="stage-panel border rounded-xl transition-all print-card overflow-hidden"
          :class="{
            'bg-zinc-950/40 border-zinc-850/80 opacity-50': store.getStageState(stage, idx) === 'completed',
            'bg-zinc-900 border-zinc-300 ring-1 ring-white/30 shadow-[0_0_24px_-4px_rgba(255,255,255,0.1)]': store.getStageState(stage, idx) === 'active' && stage.isSwapStage,
            'bg-zinc-900 border-zinc-600 shadow-sm ring-1 ring-zinc-600/50': store.getStageState(stage, idx) === 'active' && !stage.isSwapStage,
            'bg-zinc-950/60 border-zinc-800/80': store.getStageState(stage, idx) === 'upcoming'
          }"
        >
          <!-- Stage Card Header -->
          <div class="p-3 sm:px-4 flex items-center justify-between border-b border-zinc-800/70 bg-zinc-900/80">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs font-bold uppercase tracking-wider text-white">
                Tahap {{ idx + 1 }}
              </span>
              <span v-if="stage.isSwapStage" class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Rotasi Jarum {{ stage.swapNeedle || store.swapNeedle }}
              </span>
              <span v-else class="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                Jarum Standar
              </span>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-[10.5px] text-zinc-400 font-mono">
                {{ stage.items ? stage.items.length : 0 }} Desain
              </span>
            </div>
          </div>

          <!-- Stage Items Grid -->
          <div class="p-3 sm:p-4 grid gap-2.5 sm:grid-cols-2 stage-list">
            <div
              v-for="item in stage.items"
              :key="store.getItemKey(item)"
              class="work-item p-2.5 sm:p-3 rounded-lg border transition-all text-xs font-mono flex flex-col justify-between"
              :class="store.isItemCompleted(item) ? 'bg-zinc-950/60 border-zinc-850 opacity-60' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'"
            >
              <div>
                <!-- Top Row: CMT, Variant, Checkbox -->
                <div class="flex items-start justify-between gap-2 mb-2 pb-1.5 border-b border-zinc-850">
                  <div class="min-w-0">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="font-bold text-white text-xs">CMT {{ item.cmt }}</span>
                      <template v-if="item.flopy">
                        <span class="text-zinc-600 select-none text-[9px]">|</span>
                        <span class="text-zinc-400 text-[10px] font-medium truncate max-w-[120px]">{{ item.flopy }}</span>
                      </template>
                    </div>
                    <div v-if="item.variant && item.variant !== '-'" class="text-[10px] text-zinc-400 font-sans mt-0.5">
                      {{ item.variant }}
                    </div>
                  </div>

                  <button
                    @click="store.toggleItemComplete(item)"
                    type="button"
                    class="w-6 h-6 rounded flex items-center justify-center border transition-colors cursor-pointer shrink-0"
                    :class="store.isItemCompleted(item) ? 'bg-emerald-500 border-emerald-400 text-zinc-950' : 'bg-zinc-900 border-zinc-750 text-transparent hover:border-zinc-600'"
                    :title="store.isItemCompleted(item) ? 'Tandai belum selesai' : 'Tandai selesai'"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </button>
                </div>

                <!-- Combination Options Badge Sequence -->
                <div class="space-y-1.5 my-2">
                  <template v-if="store.hasItemCombinationOptions(item)">
                    <div class="flex flex-wrap items-center gap-1.5">
                      <div
                        v-for="(opt, optIdx) in item.threadOptions"
                        :key="optIdx"
                        @click.stop="store.toggleOptionAcc(item, optIdx)"
                        :title="store.isOptionAcc(item, optIdx) ? 'Klik untuk membatalkan ACC opsi ini' : 'Klik untuk menyetujui (ACC) opsi ini'"
                        class="inline-flex items-stretch rounded border overflow-hidden cursor-pointer select-none transition-all active:scale-95 shadow-sm text-left group"
                        :class="store.isOptionAcc(item, optIdx)
                          ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500/50'
                          : 'border-zinc-750 bg-zinc-900 hover:border-zinc-500 hover:bg-zinc-850'"
                      >
                        <div
                          v-if="store.isOptionAcc(item, optIdx)"
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
                            :class="store.isOptionAcc(item, optIdx) ? 'text-white font-bold' : 'text-zinc-300 group-hover:text-white'"
                          >
                            <!-- Needle Mapping Badge -->
                            <span v-if="stage.threadToNeedle && stage.threadToNeedle[th]" class="px-1 py-0.2 rounded bg-zinc-800 text-zinc-300 text-[9px] font-bold">
                              J{{ stage.threadToNeedle[th] }}
                            </span>
                            <span class="w-2 h-2 rounded-full border border-white/20 shrink-0" :style="{ backgroundColor: store.getThreadColor(th, store.colorMap) }"></span>
                            <span>{{ th }}</span>
                          </div>
                        </template>
                      </div>
                    </div>
                  </template>

                  <!-- Standard Single Threads Sequence -->
                  <template v-else>
                    <div class="flex flex-wrap items-center gap-1.5">
                      <button
                        v-for="(th, thIdx) in item.threads"
                        :key="thIdx"
                        type="button"
                        @click="store.toggleThreadAcc(item, th)"
                        :title="store.isThreadAcc(item, th) ? `Klik untuk membatalkan ACC benang ${th}` : `Klik untuk menyetujui (ACC) benang ${th}`"
                        :class="store.isThreadAcc(item, th)
                          ? 'bg-zinc-800 border-white text-white font-bold ring-1 ring-white/60 shadow-sm'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'"
                        class="inline-flex items-center gap-1.5 px-2 py-0.5 border rounded text-[10px] font-mono transition-all cursor-pointer active:scale-95"
                      >
                        <span v-if="stage.threadToNeedle && stage.threadToNeedle[th]" class="px-1 py-0.2 rounded bg-zinc-800 text-zinc-300 text-[9px] font-bold">
                          J{{ stage.threadToNeedle[th] }}
                        </span>
                        <span class="w-2 h-2 rounded-full border border-white/20 shrink-0" :style="{ backgroundColor: store.getThreadColor(th, store.colorMap) }"></span>
                        <span>{{ th }}</span>
                      </button>
                    </div>
                  </template>
                </div>
              </div>

              <!-- Machine Keycaps Input Strip (Bottom) -->
              <div v-if="item.threads && item.threads.length > 0" class="machine-input pt-2 border-t border-zinc-850/80 mt-2 flex items-center justify-between text-[10px] text-zinc-500">
                <span class="font-sans uppercase text-[9px] tracking-wider">Urutan Jarum:</span>
                <div class="flex items-center gap-1 flex-wrap">
                  <span
                    v-for="(th, thIdx) in item.threads"
                    :key="thIdx"
                    class="needle-keycap px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 font-mono font-bold text-[10px]"
                    :class="stage.threadToNeedle && stage.threadToNeedle[th] === (stage.swapNeedle || store.swapNeedle) ? 'border-amber-500/40 text-amber-300' : 'text-zinc-300'"
                  >
                    J{{ stage.threadToNeedle ? stage.threadToNeedle[th] || '?' : '?' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- ================= TAB 2: VISUAL RACK JARUM MESIN (1-15) ================= -->
    <section v-if="store.activeTab === 'rack'" class="space-y-3">
      <div class="bg-zinc-900/90 border border-zinc-800/90 rounded-xl p-3 sm:p-4 shadow-sm space-y-3.5">
        <!-- Unified Controls Console -->
        <div class="bg-zinc-950 border border-zinc-800 rounded-lg p-3 grid grid-cols-1 sm:grid-cols-2 gap-3 divide-y sm:divide-y-0 sm:divide-x divide-zinc-850">
          <!-- Control 1: Jumlah Jarum -->
          <div class="flex items-center justify-between gap-3 sm:pr-3">
            <div>
              <div class="text-[10.5px] font-mono uppercase tracking-wider text-zinc-300 font-semibold">Jumlah Jarum</div>
              <div class="text-[10px] text-zinc-500 font-mono mt-0.5">Total jarum mesin</div>
            </div>

            <div class="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-md p-0.5 shrink-0">
              <button
                @click="store.decrementCapacity"
                :disabled="store.needleCapacity <= 2"
                title="Kurangi 1 Jarum"
                class="w-7 h-7 rounded bg-zinc-850 hover:bg-zinc-750 active:bg-zinc-700 disabled:opacity-30 disabled:pointer-events-none text-zinc-200 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>

              <div class="w-10 text-center font-mono font-bold text-sm text-zinc-100 select-none">{{ store.needleCapacity }}J</div>

              <button
                @click="store.incrementCapacity"
                :disabled="store.needleCapacity >= 24"
                title="Tambah 1 Jarum"
                class="w-7 h-7 rounded bg-zinc-850 hover:bg-zinc-750 active:bg-zinc-700 disabled:opacity-30 disabled:pointer-events-none text-zinc-200 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>

          <!-- Control 2: Jarum Ganti -->
          <div class="flex items-center justify-between gap-3 pt-2.5 sm:pt-0 sm:pl-3">
            <div>
              <div class="text-[10.5px] font-mono uppercase tracking-wider text-zinc-300 font-semibold">Jarum Ganti</div>
              <div class="text-[10px] text-zinc-500 font-mono mt-0.5">Posisi rotasi benang</div>
            </div>

            <div class="relative shrink-0">
              <select
                v-model.number="store.swapNeedle"
                class="h-8 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 rounded-md pl-2.5 pr-7 text-xs font-mono font-bold text-white focus:outline-none focus:ring-1 focus:ring-zinc-400 cursor-pointer appearance-none transition-colors"
              >
                <option v-for="n in store.needleCapacity" :key="n" :value="n">Jarum {{ n }} (J{{ n }})</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Susunan Benang Rack Visual -->
        <div class="pt-3 border-t border-zinc-800/80">
          <div class="flex items-center gap-2 mb-2.5">
            <span class="w-1.5 h-1.5 rounded-sm bg-zinc-300"></span>
            <h3 class="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">SUSUNAN BENANG</h3>
          </div>

          <!-- Needle Rack Grid -->
          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2 sm:gap-2.5">
            <div
              v-for="needle in store.needleList"
              :key="needle.num"
              class="relative rounded-lg border overflow-hidden transition-all flex flex-col justify-between"
              :class="needle.isSwap 
                ? 'bg-zinc-900 border-zinc-400/80 shadow-[0_0_12px_-2px_rgba(255,255,255,0.08)] ring-1 ring-white/20' 
                : 'bg-zinc-950 border-zinc-800/90 hover:border-zinc-700'"
            >
              <div class="h-1 w-full shrink-0" :style="{ backgroundColor: store.getThreadColor(needle.rawCode, store.colorMap) }"></div>

              <div class="p-2 sm:p-2.5 flex flex-col items-center text-center">
                <div class="w-full flex items-center justify-between gap-1 mb-1.5">
                  <span class="font-mono font-bold text-[10px] px-1 py-0.5 rounded" :class="needle.isSwap ? 'bg-white/20 text-white font-bold' : 'bg-zinc-850 text-zinc-300'"> J{{ needle.num }} </span>
                  <span class="text-[8.5px] font-mono font-bold tracking-wider uppercase px-1 py-0.5 rounded" :class="needle.isSwap ? 'bg-white text-zinc-950 font-extrabold shadow-sm' : 'text-zinc-500'">
                    {{ needle.isSwap ? 'GANTI' : 'FIX' }}
                  </span>
                </div>

                <div class="flex flex-col items-center justify-center my-1 gap-1">
                  <span class="w-4 h-4 rounded-full border border-white/20 shadow-sm shrink-0" :style="{ backgroundColor: store.getThreadColor(needle.rawCode, store.colorMap) }"></span>
                  <span class="font-mono font-bold text-xs sm:text-sm tracking-tight" :class="needle.rawCode ? (needle.isSwap ? 'text-white font-bold' : 'text-zinc-100') : 'text-zinc-600'"> {{ needle.rawCode || '-' }} </span>
                </div>

                <span class="text-[9.5px] text-zinc-400 font-sans w-full mt-0.5 leading-tight line-clamp-2 min-h-[1.25rem] text-center" :title="needle.colorName || (needle.rawCode ? 'Warna Custom' : 'Kosong')">
                  {{ needle.colorName ? needle.colorName.split('/')[0].trim() : (needle.rawCode ? 'Warna Custom' : 'Kosong') }}
                </span>
              </div>
            </div>
          </div>

          <!-- Rotation Pipeline Section -->
          <div v-if="store.calculation.overflowThreads && store.calculation.overflowThreads.length > 0" class="mt-4 pt-3 border-t border-zinc-800/80">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-200">
                <svg class="w-3.5 h-3.5 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                </svg>
                <span>ROTASI JARUM {{ store.swapNeedle }}</span>
              </div>
              <span class="text-[10px] font-mono text-zinc-500"> {{ store.calculation.overflowThreads.length }} Kode </span>
            </div>

            <div class="flex items-center gap-2 overflow-x-auto lg:overflow-visible flex-nowrap lg:flex-wrap pb-1 pt-0.5">
              <template v-for="(code, rIdx) in store.calculation.overflowThreads" :key="code">
                <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700/80 text-xs font-mono shrink-0 shadow-sm">
                  <span class="text-[10px] text-zinc-400 font-bold"> T{{ String(rIdx + 1).padStart(2, '0') }}: </span>
                  <span class="w-3 h-3 rounded-full border border-white/20 shrink-0" :style="{ backgroundColor: store.getThreadColor(code, store.colorMap) }"></span>
                  <span class="font-bold text-zinc-100"> {{ code }} </span>
                  <span class="text-[10.5px] text-zinc-400 font-sans hidden sm:inline"> {{ store.THREAD_METADATA[code]?.name ? store.THREAD_METADATA[code].name.split('/')[0].trim() : '' }} </span>
                </div>

                <svg v-if="rIdx < store.calculation.overflowThreads.length - 1" class="w-3 h-3 text-zinc-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </template>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
