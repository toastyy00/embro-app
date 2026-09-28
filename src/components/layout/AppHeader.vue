<script setup>
import { useAppStore } from '../../stores/useAppStore.js';

const store = useAppStore();
</script>

<template>
  <header class="app-header pb-2 mb-3 border-b border-zinc-800/80">
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <!-- Mobile Sidebar Hamburger Button -->
        <button
          @click="store.isSidebarOpen = true"
          type="button"
          title="Buka Menu Sidebar"
          class="lg:hidden w-7 h-7 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 flex items-center justify-center transition-colors cursor-pointer shrink-0 mr-0.5"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <!-- Brand Mark & Title -->
        <div class="brand-mark w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
          <svg class="w-3.5 h-3.5 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v20"></path>
            <path d="M9 5h6"></path>
            <path d="M10 9h4"></path>
            <circle cx="12" cy="18" r="1.5"></circle>
          </svg>
        </div>
        <div>
          <h1 class="brand-name text-sm font-mono font-bold tracking-tight text-zinc-100 uppercase">EMBRO-AR APP</h1>
          <p class="text-[10px] text-zinc-400 font-mono tracking-tight hidden sm:block">DIVISI EMBROIDERY AL-RAAZ • SISTEM PRODUKSI &amp; ALOKASI BENANG</p>
        </div>
      </div>

      <!-- Header Actions -->
      <div class="flex items-center gap-1.5 no-print">
        <button
          @click="store.openCloudSettingsModal"
          :title="'Terhubung ke Ruangan Cloud: ' + store.currentRoomCode + ' (Klik untuk ganti ruangan)'"
          type="button"
          class="h-7 px-2 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[10.5px] font-mono border border-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span class="w-1.5 h-1.5 rounded-full" :class="store.isSyncConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'"></span>
          <span class="font-bold uppercase tracking-wider text-zinc-200">{{ store.currentRoomCode }}</span>
        </button>

        <button
          @click="store.printWorksheet"
          title="Cetak SPK Lembar Kerja (A4)"
          class="h-7 px-2.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] font-mono font-medium border border-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <svg class="w-3 h-3 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          <span class="hidden sm:inline">Cetak SPK</span>
        </button>
      </div>
    </div>

    <!-- Industrial HUD Status Strip (Hanya Tampil di Menu Trial Benang) -->
    <div v-if="store.activeModule === 'trial'" class="status-strip mt-2.5 bg-zinc-900/80 border border-zinc-800/80 rounded-lg p-2 sm:px-3 sm:py-2 font-mono text-[11px] space-y-1.5">
      <!-- Baris 1: Sesi Aktif & Tombol Salin Link -->
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-1.5 min-w-0 flex-1">
          <span class="text-zinc-500 text-[10px] uppercase tracking-wider font-semibold shrink-0">SESI:</span>
          <span class="font-bold text-zinc-100 truncate text-xs" :title="store.activeSessionName || 'Standar'"> {{ store.activeSessionName || 'Standar' }} </span>
        </div>

        <button
          @click="store.copyCurrentActiveShareLink"
          title="Salin Sharelink sesi aktif untuk dibagikan"
          type="button"
          class="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-750 active:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 flex items-center justify-center transition-colors cursor-pointer shrink-0 no-print shadow-sm"
        >
          <svg class="w-3 h-3 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </button>
      </div>

      <!-- Baris 2: Alur Tahap & Progres CMT -->
      <div class="flex items-center justify-between gap-2 pt-1 border-t border-zinc-800/50 text-[10.5px]">
        <!-- Alur Kerja -->
        <div class="flex items-center gap-1.5 shrink-0">
          <span class="text-zinc-500 text-[10px] uppercase tracking-wider font-semibold">ALUR:</span>
          <span class="font-bold text-zinc-200">{{ store.calculation.stagesList ? store.calculation.stagesList.length : 0 }} Tahap</span>
        </div>

        <!-- Progres CMT & Reset -->
        <div class="flex items-center gap-2 no-print shrink-0">
          <div class="flex items-center gap-1.5">
            <span class="text-emerald-400 font-bold">{{ store.completedCount }}</span>
            <span class="text-zinc-400 font-medium">/{{ store.totalCmtCount }} Variasi</span>
            <div class="w-12 sm:w-16 h-1 bg-zinc-800 rounded-full overflow-hidden shrink-0 ml-0.5">
              <div class="h-full bg-emerald-500 transition-all duration-300" :style="{ width: store.progressPercent + '%' }"></div>
            </div>
          </div>

          <button v-if="store.completedCount > 0" @click="store.confirmResetCompleted" title="Reset semua status ceklis" class="text-[10px] text-zinc-500 hover:text-zinc-300 underline ml-0.5 cursor-pointer">Reset</button>
        </div>
      </div>
    </div>
  </header>
</template>
