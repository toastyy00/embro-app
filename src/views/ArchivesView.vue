<script setup>
import { useAppStore } from '../stores/useAppStore.js';

const store = useAppStore();
</script>

<template>
  <section class="space-y-4 no-print font-mono">
    <!-- Module Header Banner -->
    <div class="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3.5 sm:p-4 shadow-sm flex items-center justify-between gap-3 flex-wrap">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-750 flex items-center justify-center text-zinc-300">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="21 8 21 21 3 21 3 8"></polyline>
            <rect x="1" y="3" width="22" height="5"></rect>
            <line x1="10" y1="12" x2="14" y2="12"></line>
          </svg>
        </div>
        <div>
          <h2 class="text-sm font-bold text-white uppercase tracking-tight">Arsip Sesi &amp; Cetak SPK A4</h2>
          <p class="text-[11px] text-zinc-400 font-sans">Kelola riwayat sesi yang tersimpan dan cetak lembar kerja resmi operator</p>
        </div>
      </div>
      <button
        @click="store.printWorksheet"
        class="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold border border-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <svg class="w-3.5 h-3.5 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 6 2 18 2 18 9"></polyline>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
          <rect x="6" y="14" width="12" height="8"></rect>
        </svg>
        <span>Cetak SPK A4</span>
      </button>
    </div>

    <!-- Saved Sessions List -->
    <div class="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 space-y-3 shadow-sm">
      <div class="flex items-center justify-between border-b border-zinc-850 pb-2">
        <span class="text-xs font-bold text-white uppercase">Daftar Arsip Sesi Tersimpan ({{ store.savedSessions.length }})</span>
        <button @click="store.activeModule = 'cmt'; store.cmtSubTab = 'cmt'" class="text-[11px] text-zinc-400 hover:text-white underline cursor-pointer">Simpan Sesi Baru</button>
      </div>

      <div v-if="store.savedSessions.length === 0" class="py-8 text-center text-xs text-zinc-500">
        Belum ada arsip sesi tersimpan.
      </div>

      <div v-else class="space-y-2">
        <div
          v-for="(sess, sIdx) in store.savedSessions"
          :key="sess.id"
          class="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-850 flex items-center justify-between gap-2"
          :class="store.activeSessionId === sess.id ? 'border-emerald-500/60 bg-emerald-950/20' : ''"
        >
          <div>
            <div class="font-bold text-white text-xs flex items-center gap-2">
              <span>{{ sess.name || `Sesi #${sIdx + 1}` }}</span>
              <span v-if="store.activeSessionId === sess.id" class="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">AKTIF</span>
            </div>
            <div class="text-[10px] text-zinc-400 mt-0.5">{{ sess.cmts ? sess.cmts.length : 0 }} Variasi • {{ sess.date ? sess.date.split('T')[0] : '' }}</div>
          </div>
          <div class="flex items-center gap-1.5">
            <button
              v-if="store.activeSessionId !== sess.id"
              @click="store.activateSession(sess)"
              class="h-6 px-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-bold border border-zinc-700 cursor-pointer"
            >
              Aktifkan
            </button>
            <button
              @click="store.copySessionLink(sess)"
              class="h-6 px-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-[10px] border border-zinc-700 cursor-pointer"
            >
              Link
            </button>
            <button
              @click="store.deleteSession(sIdx)"
              class="h-6 px-2 rounded bg-zinc-900 hover:bg-rose-950 text-zinc-500 hover:text-rose-400 text-[10px] border border-zinc-800 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
