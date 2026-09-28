<script setup>
import { useAppStore } from '../stores/useAppStore.js';

const store = useAppStore();
</script>

<template>
  <section class="space-y-4 no-print font-mono">
    <!-- Module Header Banner -->
    <div class="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3.5 sm:p-4 shadow-sm flex items-center justify-between gap-3 flex-wrap">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-lg bg-sky-950 border border-sky-800/80 flex items-center justify-center text-sky-400">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg>
        </div>
        <div>
          <h2 class="text-sm font-bold text-white uppercase tracking-tight">Master Film &amp; Floppy Wilcom</h2>
          <p class="text-[11px] text-zinc-400 font-sans">Database desain bordir, komponen pakaian, screenshot Wilcom &amp; estimasi tusukan/benang</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-300 font-bold uppercase tracking-wider">{{ store.floppyListWithStats.length }} Floppy Terdaftar</span>
        <button
          v-if="store.floppyList.length > 0"
          @click="store.clearAllFloppies"
          class="h-7.5 px-2.5 rounded-lg bg-zinc-900 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400 border border-zinc-800 hover:border-rose-900/60 text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer"
          title="Hapus semua data floppy"
        >
          <span>Kosongkan</span>
        </button>
        <button
          @click="store.openAddFloppyModal"
          class="h-7.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold font-mono transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span>+ Tambah Floppy</span>
        </button>
      </div>
    </div>

    <!-- Floppy Cards List -->
    <div v-if="store.floppyListWithStats.length > 0" class="grid gap-3 sm:grid-cols-2">
      <div
        v-for="fl in store.floppyListWithStats"
        :key="fl.id || fl.name"
        class="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 space-y-3 shadow-sm hover:border-zinc-700 transition-colors flex flex-col justify-between"
      >
        <div class="space-y-3">
          <!-- Top Row: Name, Garment, Actions -->
          <div class="flex items-center justify-between border-b border-zinc-850 pb-2.5 gap-2">
            <div class="flex items-center gap-2 min-w-0">
              <div class="w-7 h-7 rounded bg-sky-950/80 border border-sky-800/80 text-sky-400 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg>
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="font-bold text-white text-sm truncate">{{ fl.name }}</span>
                  <span class="text-[9.5px] px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-750 text-zinc-300 truncate max-w-[150px] font-sans">{{ fl.garment }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-1.5 shrink-0">
              <button
                @click="store.openEditFloppyModal(fl)"
                title="Edit data Floppy ini"
                class="h-6 px-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-[10px] font-bold transition-colors cursor-pointer"
              >
                Edit
              </button>
              <button
                @click="store.deleteFloppy(fl)"
                title="Hapus Floppy"
                class="w-6 h-6 rounded bg-zinc-900 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400 border border-zinc-800 hover:border-rose-900/60 flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Wilcom Screenshot Preview Area -->
          <div v-if="fl.screenshot" class="relative group rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900/40">
            <img
              :src="fl.screenshot"
              @click="store.openScreenshotPreview(fl.screenshot)"
              class="w-full h-36 object-contain bg-zinc-950/80 cursor-pointer hover:opacity-90 transition-opacity"
              title="Klik untuk memperbesar screenshot Wilcom"
            />
            <button
              @click="store.openScreenshotPreview(fl.screenshot)"
              class="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-zinc-200 text-[10px] flex items-center gap-1 border border-zinc-700 pointer-events-none group-hover:bg-black/90 cursor-pointer"
            >
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              <span>Perbesar</span>
            </button>
          </div>

          <!-- Komponen Breakdown -->
          <div v-if="fl.components && fl.components.length > 0" class="space-y-1.5 text-[11px]">
            <div class="flex items-center justify-between text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
              <span>Rincian Komponen ({{ fl.components.length }} Bagian):</span>
              <span>Tusukan • Benang</span>
            </div>
            <div class="space-y-1">
              <div
                v-for="(comp, cIdx) in fl.components"
                :key="cIdx"
                class="flex items-center justify-between py-1 px-2 rounded bg-zinc-900/60 border border-zinc-850"
              >
                <span class="text-zinc-200 font-sans text-xs">{{ comp.name }}</span>
                <span class="text-zinc-400 font-mono text-[10.5px]">
                  {{ (Number(comp.stitch) || 0).toLocaleString() }} st • ~{{ comp.threadMeters || Math.round((Number(comp.stitch)||0)*0.0033) }}m
                </span>
              </div>
            </div>
          </div>

          <!-- Technical Calculations Grid -->
          <div class="grid grid-cols-2 gap-1.5 text-[10.5px] pt-1 border-t border-zinc-850">
            <div class="p-2 rounded bg-zinc-900/50 border border-zinc-850">
              <div class="text-[9.5px] text-zinc-500 uppercase">Total Tusukan / Pcs</div>
              <div class="font-bold text-white mt-0.5 text-xs">{{ (fl.totalStitches || 0).toLocaleString() }} st</div>
            </div>
            <div class="p-2 rounded bg-zinc-900/50 border border-zinc-850">
              <div class="text-[9.5px] text-zinc-500 uppercase">Panjang Benang / Pcs</div>
              <div class="font-bold text-sky-400 mt-0.5 text-xs">~{{ fl.totalMeters || 0 }} Meter</div>
            </div>
          </div>

          <!-- Notes if exists -->
          <div v-if="fl.notes" class="text-[10.5px] text-zinc-400 bg-zinc-900/30 p-2 rounded border border-zinc-850 font-sans italic">
            💬 {{ fl.notes }}
          </div>
        </div>

        <!-- Footer Card: Actions -->
        <div class="pt-2.5 border-t border-zinc-850 flex items-center justify-end text-xs gap-2 flex-wrap">
          <button
            @click="store.createCmtFromFloppy(fl)"
            class="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-750 text-white font-mono text-[10.5px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>+ Buat CMT</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State Floppy -->
    <div v-else class="bg-zinc-950 border border-dashed border-zinc-800 rounded-xl p-8 text-center space-y-3">
      <div class="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg>
      </div>
      <div class="space-y-1">
        <h3 class="text-sm font-bold text-zinc-200">Belum Ada Master Floppy Terdaftar</h3>
        <p class="text-xs text-zinc-400 font-sans max-w-md mx-auto">
          Database film bordir saat ini masih kosong. Klik tombol di bawah untuk mendaftarkan floppy baru.
        </p>
      </div>
      <div class="pt-1">
        <button
          @click="store.openAddFloppyModal"
          class="h-8 px-4 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold font-mono transition-colors inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span>+ Tambah Floppy Pertama</span>
        </button>
      </div>
    </div>
  </section>
</template>
