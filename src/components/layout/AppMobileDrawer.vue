<script setup>
import { useAppStore } from '../../stores/useAppStore.js';

const store = useAppStore();
</script>

<template>
  <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div v-if="store.isSidebarOpen" @click="store.isSidebarOpen = false" class="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex no-print">
      <div @click.stop class="w-64 max-w-[80vw] h-full bg-zinc-950 border-r border-zinc-800 p-4 flex flex-col justify-between font-mono shadow-2xl">
        <div class="space-y-4">
          <!-- Drawer Header -->
          <div class="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M9 5h6M10 9h4"/></svg>
              </div>
              <div>
                <div class="font-bold text-xs text-white uppercase leading-none">EMBRO-AR</div>
                <div class="text-[9.5px] text-zinc-500 font-sans mt-0.5">Al-Raaz Embroidery</div>
              </div>
            </div>
            <button @click="store.isSidebarOpen = false" class="w-7 h-7 rounded-md bg-zinc-900 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer">✕</button>
          </div>

          <!-- Drawer Nav Items -->
          <nav class="space-y-1 text-xs">
            <button
              @click="store.activeModule = 'cmt'; store.isSidebarOpen = false"
              :class="store.activeModule === 'cmt' ? 'bg-zinc-850 text-white border-zinc-700 font-bold shadow-sm' : 'text-zinc-400 border-transparent'"
              class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-colors cursor-pointer"
            >
              <div class="flex items-center gap-2.5">
                <span class="text-base">📋</span>
                <span>Data CMT</span>
              </div>
              <span v-if="store.uniqueTotalCmts > 0" class="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-semibold">{{ store.uniqueTotalCmts }} CMT</span>
              <span v-else class="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">Pusat Data</span>
            </button>

            <button
              @click="store.activeModule = 'trial'; store.isSidebarOpen = false"
              :class="store.activeModule === 'trial' ? 'bg-zinc-850 text-white border-zinc-700 font-bold shadow-sm' : 'text-zinc-400 border-transparent'"
              class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-colors cursor-pointer"
            >
              <div class="flex items-center gap-2.5">
                <span class="text-base">🪡</span>
                <span>Trial Benang</span>
              </div>
              <span v-if="store.calculation.stagesList && store.calculation.stagesList.length > 0" class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-semibold">{{ store.calculation.stagesList.length }} Tahap</span>
              <span v-else class="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">Simulasi</span>
            </button>

            <button
              @click="store.activeModule = 'floppy'; store.isSidebarOpen = false"
              :class="store.activeModule === 'floppy' ? 'bg-zinc-850 text-white border-zinc-700 font-bold shadow-sm' : 'text-zinc-400 border-transparent'"
              class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-colors cursor-pointer"
            >
              <div class="flex items-center gap-2.5">
                <span class="text-base">📁</span>
                <span>Master Floppy</span>
              </div>
              <span class="text-[9px] px-1.5 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-300">Phase 2</span>
            </button>

            <button
              @click="store.activeModule = 'schedule'; store.isSidebarOpen = false"
              :class="store.activeModule === 'schedule' ? 'bg-zinc-850 text-white border-zinc-700 font-bold shadow-sm' : 'text-zinc-400 border-transparent'"
              class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-colors cursor-pointer"
            >
              <div class="flex items-center gap-2.5">
                <span class="text-base">⏱️</span>
                <span>Jadwal Mesin</span>
              </div>
              <span v-if="store.accCount > 0" class="text-[9.5px] px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white font-bold">{{ store.accCount }} ACC</span>
              <span v-else class="text-[9px] px-1.5 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300">Phase 3</span>
            </button>

            <button
              @click="store.activeModule = 'inventory'; store.isSidebarOpen = false"
              :class="store.activeModule === 'inventory' ? 'bg-zinc-850 text-white border-zinc-700 font-bold shadow-sm' : 'text-zinc-400 border-transparent'"
              class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-colors cursor-pointer"
            >
              <div class="flex items-center gap-2.5">
                <span class="text-base">📦</span>
                <span>Stok Benang</span>
              </div>
              <span v-if="store.inventoryCounts.alertCount > 0" class="text-[9px] px-1.5 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 font-bold">{{ store.inventoryCounts.alertCount }} Restock</span>
              <span v-else-if="store.inventoryCounts.total > 0" class="text-[9.5px] px-1.5 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300">{{ store.inventoryCounts.total }}</span>
              <span v-else class="text-[9px] px-1.5 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300">Gudang</span>
            </button>

            <button
              @click="store.activeModule = 'archives'; store.isSidebarOpen = false"
              :class="store.activeModule === 'archives' ? 'bg-zinc-850 text-white border-zinc-700 font-bold shadow-sm' : 'text-zinc-400 border-transparent'"
              class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-colors cursor-pointer"
            >
              <div class="flex items-center gap-2.5">
                <span class="text-base">📄</span>
                <span>Arsip &amp; SPK</span>
              </div>
              <span v-if="store.savedSessions.length > 0" class="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">{{ store.savedSessions.length }}</span>
            </button>
          </nav>
        </div>

        <!-- Drawer Footer Room Pill -->
        <div class="pt-4 border-t border-zinc-850 space-y-2">
          <div class="text-[9.5px] text-zinc-500 uppercase tracking-widest font-sans">Ruangan Cloud Aktif</div>
          <button
            @click="store.openCloudSettingsModal(); store.isSidebarOpen = false"
            class="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs"
          >
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full" :class="store.isSyncConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'"></span>
              <span class="font-bold text-white">{{ store.currentRoomCode }}</span>
            </div>
            <span class="text-[10px] text-zinc-400 underline">Ganti</span>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
