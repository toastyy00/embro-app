<script setup>
import { useAppStore } from '../../stores/useAppStore.js';

const store = useAppStore();
</script>

<template>
  <aside class="hidden lg:flex flex-col w-52 xl:w-56 shrink-0 bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-3 space-y-3.5 font-mono sticky top-4 no-print shadow-sm">
    <!-- Brand Logo & Name -->
    <div class="flex items-center gap-2.5 pb-2.5 border-b border-zinc-800/70">
      <div class="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 shadow-inner">
        <svg class="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v20"></path>
          <path d="M9 5h6"></path>
          <path d="M10 9h4"></path>
          <circle cx="12" cy="18" r="1.5"></circle>
        </svg>
      </div>
      <div class="min-w-0">
        <div class="font-bold text-xs tracking-tight text-white uppercase leading-none">EMBRO-AR</div>
        <div class="text-[9.5px] text-zinc-500 font-sans tracking-tight mt-0.5 truncate">Al-Raaz Embroidery</div>
      </div>
    </div>

    <!-- Nav Items -->
    <nav class="space-y-1 text-xs">
      <!-- 0. Data CMT -->
      <button
        @click="store.activeModule = 'cmt'"
        :class="store.activeModule === 'cmt' ? 'bg-zinc-800 text-white border-zinc-700 font-bold shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/60 border-transparent'"
        class="w-full flex items-center justify-between px-2.5 py-2 rounded-lg border transition-all text-left group cursor-pointer"
      >
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
            <path d="M6 6h10M6 10h10"></path>
          </svg>
          <span>Data CMT</span>
        </div>
        <span v-if="store.uniqueTotalCmts > 0" class="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 font-semibold">{{ store.uniqueTotalCmts }} CMT</span>
        <span v-else class="text-[9px] px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-750 text-zinc-400 font-medium">Pusat Data</span>
      </button>

      <!-- 1. Trial Benang -->
      <button
        @click="store.activeModule = 'trial'"
        :class="store.activeModule === 'trial' ? 'bg-zinc-800 text-white border-zinc-700 font-bold shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/60 border-transparent'"
        class="w-full flex items-center justify-between px-2.5 py-2 rounded-lg border transition-all text-left group cursor-pointer"
      >
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v20M9 5h6M10 9h4" />
          </svg>
          <span>Trial Benang</span>
        </div>
        <span v-if="store.calculation.stagesList && store.calculation.stagesList.length > 0" class="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 font-semibold">{{ store.calculation.stagesList.length }} Tahap</span>
        <span v-else class="text-[9px] px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-750 text-zinc-400 font-medium">Simulasi</span>
      </button>

      <!-- 2. Master Floppy -->
      <button
        @click="store.activeModule = 'floppy'"
        :class="store.activeModule === 'floppy' ? 'bg-zinc-800 text-white border-zinc-700 font-bold shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/60 border-transparent'"
        class="w-full flex items-center justify-between px-2.5 py-2 rounded-lg border transition-all text-left group cursor-pointer"
      >
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
          </svg>
          <span>Master Floppy</span>
        </div>
        <span class="text-[9px] px-1.5 py-0.2 rounded bg-sky-950/80 border border-sky-800/80 text-sky-300 font-medium">Phase 2</span>
      </button>

      <!-- 3. Jadwal Mesin -->
      <button
        @click="store.activeModule = 'schedule'"
        :class="store.activeModule === 'schedule' ? 'bg-zinc-800 text-white border-zinc-700 font-bold shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/60 border-transparent'"
        class="w-full flex items-center justify-between px-2.5 py-2 rounded-lg border transition-all text-left group cursor-pointer"
      >
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>Jadwal Mesin</span>
        </div>
        <span v-if="store.accCount > 0" class="text-[9.5px] px-1.5 py-0.2 rounded bg-white/10 border border-white/20 text-white font-bold">{{ store.accCount }} ACC</span>
        <span v-else class="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-800/80 text-amber-300 font-medium">Phase 3</span>
      </button>

      <!-- 4. Stok Benang -->
      <button
        @click="store.activeModule = 'inventory'"
        :class="store.activeModule === 'inventory' ? 'bg-zinc-800 text-white border-zinc-700 font-bold shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/60 border-transparent'"
        class="w-full flex items-center justify-between px-2.5 py-2 rounded-lg border transition-all text-left group cursor-pointer"
      >
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
          </svg>
          <span>Stok Benang</span>
        </div>
        <span v-if="store.inventoryCounts.alertCount > 0" class="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-800/80 text-amber-300 font-bold animate-pulse">{{ store.inventoryCounts.alertCount }} Restock</span>
        <span v-else-if="store.inventoryCounts.total > 0" class="text-[9.5px] px-1.5 py-0.2 rounded bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 font-medium">{{ store.inventoryCounts.total }} Warna</span>
        <span v-else class="text-[9px] px-1.5 py-0.2 rounded bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 font-medium">Gudang</span>
      </button>

      <!-- 5. Arsip & SPK -->
      <button
        @click="store.activeModule = 'archives'"
        :class="store.activeModule === 'archives' ? 'bg-zinc-800 text-white border-zinc-700 font-bold shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/60 border-transparent'"
        class="w-full flex items-center justify-between px-2.5 py-2 rounded-lg border transition-all text-left group cursor-pointer"
      >
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="21 8 21 21 3 21 3 8"></polyline>
            <rect x="1" y="3" width="22" height="5"></rect>
            <line x1="10" y1="12" x2="14" y2="12"></line>
          </svg>
          <span>Arsip &amp; SPK</span>
        </div>
        <span v-if="store.savedSessions.length > 0" class="text-[10px] px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-750 text-zinc-300 font-semibold">{{ store.savedSessions.length }}</span>
      </button>
    </nav>

    <!-- Bottom Status / Room Indicator -->
    <div class="pt-2 border-t border-zinc-800/60 text-[10px] space-y-1">
      <div class="text-zinc-500 uppercase tracking-widest font-sans text-[9px]">Ruangan Cloud</div>
      <button
        @click="store.openCloudSettingsModal"
        class="w-full bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 rounded-lg p-1.5 flex items-center justify-between transition-colors text-left cursor-pointer"
        :title="'Terhubung ke Ruangan: ' + store.currentRoomCode + ' (Klik untuk ganti)'"
      >
        <div class="flex items-center gap-1.5 min-w-0">
          <span class="w-2 h-2 rounded-full shrink-0" :class="store.isSyncConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'"></span>
          <span class="font-bold truncate text-[11px]">{{ store.currentRoomCode }}</span>
        </div>
        <span class="text-[9px] text-zinc-500 uppercase font-sans">Ganti</span>
      </button>
    </div>
  </aside>
</template>
