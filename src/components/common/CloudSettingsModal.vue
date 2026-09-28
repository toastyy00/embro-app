<script setup>
import { useAppStore } from '../../stores/useAppStore.js';

const store = useAppStore();
</script>

<template>
  <transition
    enter-active-class="transition duration-150 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-100 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="store.isCloudSettingsOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
      @click.self="store.isCloudSettingsOpen = false"
    >
      <div class="w-full max-w-sm bg-zinc-900 border border-zinc-700/90 rounded-xl shadow-2xl overflow-hidden font-mono p-4 sm:p-5 space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-zinc-800">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <h3 class="text-xs font-bold text-white uppercase tracking-wider">Pengaturan Ruangan</h3>
          </div>
          <button @click="store.isCloudSettingsOpen = false" class="text-zinc-500 hover:text-white text-sm cursor-pointer">✕</button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-[10.5px] uppercase tracking-wider text-zinc-400 font-semibold mb-1"> Kode Ruangan (Room ID) </label>
            <input
              v-model="store.tempRoomCode"
              placeholder="cth: EMBRO atau LINE-A"
              class="w-full h-9 bg-zinc-950 border border-zinc-750 focus:border-white focus:ring-1 focus:ring-white/30 rounded-md px-3 text-xs text-zinc-100 font-mono uppercase focus:outline-none"
            />
            <p class="text-[10px] text-zinc-500 mt-1 leading-normal font-sans">Perangkat yang membuka Ruangan yang sama akan otomatis saling berbagi data sesi dan progres ceklis secara real-time.</p>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
          <button @click="store.isCloudSettingsOpen = false" type="button" class="h-8 px-3 rounded-md bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-xs font-semibold cursor-pointer border border-zinc-700">Batal</button>
          <button
            @click="store.saveCloudSettings"
            type="button"
            style="background-color: #ffffff !important; color: #09090b !important; color-scheme: only light !important"
            class="btn-white-solid h-8 px-4 rounded-md bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-bold cursor-pointer shadow-sm"
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
