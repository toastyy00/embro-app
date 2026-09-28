<script setup>
import { useAppStore } from '../../stores/useAppStore.js';

const store = useAppStore();

const addFloppyComponent = () => {
  store.floppyForm.components.push({ name: '', stitch: 0, threadMeters: 0 });
};

const removeFloppyComponent = (idx) => {
  if (store.floppyForm.components.length > 1) {
    store.floppyForm.components.splice(idx, 1);
  }
};

const handleScreenshotUpload = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    store.floppyForm.screenshot = event.target.result;
  };
  reader.readAsDataURL(file);
};

const handleScreenshotPaste = (e) => {
  const items = e.clipboardData?.items;
  if (!items) return;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      const blob = items[i].getAsFile();
      const reader = new FileReader();
      reader.onload = (event) => {
        store.floppyForm.screenshot = event.target.result;
        store.showToast('Screenshot Wilcom berhasil ditempel!');
      };
      reader.readAsDataURL(blob);
      break;
    }
  }
};
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
      v-if="store.isFloppyModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto select-none"
      @click.self="store.isFloppyModalOpen = false"
      @paste="handleScreenshotPaste"
    >
      <div class="w-full max-w-2xl bg-zinc-900 border border-zinc-700/90 rounded-xl shadow-2xl overflow-hidden font-mono p-4 sm:p-5 space-y-4 my-auto max-h-[90vh] flex flex-col">
        <!-- Header Modal -->
        <div class="flex items-center justify-between pb-3 border-b border-zinc-800 shrink-0">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <h3 class="text-xs font-bold text-white uppercase tracking-wider">
              {{ store.isEditingFloppy ? 'Edit Master Floppy Wilcom' : 'Tambah Master Floppy Wilcom Baru' }}
            </h3>
          </div>
          <button @click="store.isFloppyModalOpen = false" class="text-zinc-500 hover:text-white text-sm cursor-pointer p-1">✕</button>
        </div>

        <!-- Body Modal -->
        <div class="space-y-4 text-xs overflow-y-auto pr-1">
          <!-- Grid Input Utama -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="sm:col-span-1">
              <label class="block text-[10.5px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                Nama Floppy / File *
              </label>
              <input
                v-model="store.floppyForm.name"
                placeholder="cth: Flopy B atau FLOPY-01"
                class="w-full h-9 bg-zinc-950 border border-zinc-750 focus:border-white focus:ring-1 focus:ring-white/30 rounded-md px-3 text-xs text-zinc-100 font-mono focus:outline-none uppercase"
              />
            </div>
            <div class="sm:col-span-1">
              <label class="block text-[10.5px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                Model / Item Pakaian
              </label>
              <input
                v-model="store.floppyForm.garment"
                placeholder="cth: Kemeja Koko Al-Raaz"
                class="w-full h-9 bg-zinc-950 border border-zinc-750 focus:border-white focus:ring-1 focus:ring-white/30 rounded-md px-3 text-xs text-zinc-100 font-mono focus:outline-none"
              />
            </div>
            <div class="sm:col-span-1">
              <label class="block text-[10.5px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                Quantity Order (Pcs)
              </label>
              <input
                v-model.number="store.floppyForm.quantity"
                type="number"
                min="1"
                placeholder="1200"
                class="w-full h-9 bg-zinc-950 border border-zinc-750 focus:border-white focus:ring-1 focus:ring-white/30 rounded-md px-3 text-xs text-zinc-100 font-mono focus:outline-none"
              />
            </div>
          </div>

          <!-- Upload & Paste Screenshot Wilcom -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="text-[10.5px] uppercase tracking-wider text-zinc-400 font-semibold">
                Screenshot Wilcom / Lembar Kerja
              </label>
              <span class="text-[10px] text-zinc-500">Mendukung Paste (Ctrl+V) langsung</span>
            </div>

            <div v-if="store.floppyForm.screenshot" class="relative group rounded-lg overflow-hidden border border-zinc-700 bg-zinc-950/60 p-2 flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 overflow-hidden">
                <img
                  :src="store.floppyForm.screenshot"
                  alt="Wilcom Screenshot"
                  class="w-20 h-14 object-cover rounded border border-zinc-750 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                  @click="store.openScreenshotPreview(store.floppyForm.screenshot)"
                />
                <div class="truncate">
                  <p class="text-xs text-zinc-200 font-bold truncate">Screenshot Wilcom Terlampir</p>
                  <button
                    @click="store.openScreenshotPreview(store.floppyForm.screenshot)"
                    type="button"
                    class="text-[11px] text-cyan-400 hover:text-cyan-300 underline mt-0.5 cursor-pointer"
                  >
                    Lihat Gambar Penuh
                  </button>
                </div>
              </div>
              <button
                @click="store.floppyForm.screenshot = ''"
                type="button"
                class="px-2.5 py-1.5 rounded bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-zinc-700 text-xs transition-colors shrink-0 cursor-pointer"
              >
                Hapus
              </button>
            </div>

            <div
              v-else
              class="border-2 border-dashed border-zinc-750 hover:border-zinc-500 rounded-lg p-3 text-center bg-zinc-950/40 hover:bg-zinc-950 transition-colors"
            >
              <div class="flex flex-col items-center justify-center gap-1.5">
                <span class="text-zinc-400 text-base">📸</span>
                <p class="text-zinc-300 text-xs font-semibold">
                  Tempel (Ctrl+V) screenshot Wilcom atau pilih file
                </p>
                <label class="inline-block mt-1 px-3 py-1 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-[11px] font-semibold rounded cursor-pointer border border-zinc-700 transition-colors">
                  Pilih Gambar
                  <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleScreenshotUpload"
                  />
                </label>
              </div>
            </div>
          </div>

          <!-- Rincian Komponen Bordir -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-[10.5px] uppercase tracking-wider text-zinc-400 font-semibold">
                Rincian Komponen Bordir (Wilcom)
              </label>
              <button
                @click="addFloppyComponent"
                type="button"
                class="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>+ Tambah Komponen</span>
              </button>
            </div>

            <div class="border border-zinc-800 rounded-lg overflow-hidden">
              <div class="grid grid-cols-12 gap-2 bg-zinc-950 px-3 py-2 text-[10px] uppercase tracking-wider text-zinc-500 font-bold border-b border-zinc-800">
                <div class="col-span-5">Komponen</div>
                <div class="col-span-3 text-right">Tusukan (Stitch)</div>
                <div class="col-span-3 text-right">Benang (Meter)</div>
                <div class="col-span-1 text-center">Aksi</div>
              </div>

              <div class="divide-y divide-zinc-800/60 max-h-48 overflow-y-auto">
                <div
                  v-for="(comp, idx) in store.floppyForm.components"
                  :key="idx"
                  class="grid grid-cols-12 gap-2 p-2.5 items-center hover:bg-zinc-850/40"
                >
                  <div class="col-span-5">
                    <input
                      v-model="comp.name"
                      placeholder="cth: Plaket Depan"
                      class="w-full h-8 bg-zinc-950 border border-zinc-750 rounded px-2 text-xs text-white font-sans focus:outline-none"
                    />
                  </div>
                  <div class="col-span-3">
                    <input
                      v-model.number="comp.stitch"
                      type="number"
                      placeholder="8500"
                      class="w-full h-8 bg-zinc-950 border border-zinc-750 rounded px-2 text-xs text-white font-mono text-right focus:outline-none"
                    />
                  </div>
                  <div class="col-span-3">
                    <input
                      v-model.number="comp.threadMeters"
                      type="number"
                      placeholder="28"
                      class="w-full h-8 bg-zinc-950 border border-zinc-750 rounded px-2 text-xs text-white font-mono text-right focus:outline-none"
                    />
                  </div>
                  <div class="col-span-1 text-center">
                    <button
                      v-if="store.floppyForm.components.length > 1"
                      @click="removeFloppyComponent(idx)"
                      type="button"
                      class="w-6 h-6 rounded flex items-center justify-center text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer mx-auto"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Modal -->
        <div class="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800 shrink-0">
          <button
            @click="store.isFloppyModalOpen = false"
            type="button"
            class="h-8 px-3 rounded-md bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-xs font-semibold border border-zinc-700 cursor-pointer"
          >
            Batal
          </button>
          <button
            @click="store.saveFloppy"
            type="button"
            style="background-color: #ffffff !important; color: #09090b !important; color-scheme: only light !important"
            class="btn-white-solid h-8 px-4 rounded-md bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-bold cursor-pointer shadow-sm"
          >
            Simpan Floppy
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
