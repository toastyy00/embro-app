<script setup>
import { useFloppyStore } from '../stores/useFloppyStore.js';

const floppy = useFloppyStore();
</script>

<template>
  <div class="space-y-4">
    <!-- 1. Header Toolbar -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl">
      <div class="flex items-center gap-2">
        <span class="text-xs font-mono font-bold text-white uppercase tracking-wider">
          Master Database Wilcom Floppy
        </span>
        <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-300 font-bold">
          {{ floppy.floppyList.length }} File
        </span>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="floppy.loadSample"
          class="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-850 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          Muat Sampel
        </button>
        <button
          @click="floppy.openAddModal"
          class="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-zinc-950 font-bold text-xs font-mono flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <span>+</span>
          <span>Tambah Floppy</span>
        </button>
      </div>
    </div>

    <!-- 2. Grid Kartu Floppy -->
    <div v-if="floppy.floppyList.length === 0" class="p-12 text-center bg-zinc-900/40 border border-dashed border-zinc-800 rounded-2xl">
      <div class="text-zinc-400 font-mono text-xs">Belum ada file Floppy Wilcom yang tersimpan.</div>
      <button
        @click="floppy.openAddModal"
        class="mt-3 px-4 py-2 bg-sky-600/20 border border-sky-500/30 text-sky-300 rounded-lg text-xs font-mono font-semibold hover:bg-sky-600/30 transition-colors"
      >
        + Daftarkan Floppy Pertama
      </button>
    </div>

    <div v-else class="grid gap-3 sm:grid-cols-2">
      <div
        v-for="fl in floppy.floppyList"
        :key="fl.id"
        class="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-3 hover:border-zinc-700 transition-colors"
      >
        <!-- Baris Atas: Nama & Tombol Aksi -->
        <div class="flex items-start justify-between gap-2">
          <div>
            <div class="font-bold font-mono text-white text-base flex items-center gap-2">
              <span>{{ fl.name }}</span>
              <span class="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-normal">
                {{ fl.garment || 'Kemeja' }}
              </span>
            </div>
            <div class="text-[11px] font-mono text-zinc-500 mt-0.5">
              Target Order: {{ fl.quantity || 1200 }} pcs
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="floppy.openEditModal(fl)"
              class="text-xs font-mono text-zinc-400 hover:text-white"
            >
              Edit
            </button>
            <span class="text-zinc-700">|</span>
            <button
              @click="floppy.deleteFloppy(fl)"
              class="text-xs font-mono text-rose-400 hover:text-rose-300"
            >
              Hapus
            </button>
          </div>
        </div>

        <!-- Thumbnail Screenshot jika ada -->
        <div v-if="fl.screenshot" class="relative rounded-lg overflow-hidden border border-zinc-800 max-h-36 bg-zinc-950">
          <img :src="fl.screenshot" alt="Wilcom Screenshot" class="w-full h-full object-cover" />
        </div>

        <!-- Komponen Jahitan & Stitches -->
        <div class="space-y-1.5 pt-2 border-t border-zinc-800/80">
          <div class="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Komponen Bordir:</div>
          <div class="grid grid-cols-2 gap-1.5">
            <div
              v-for="(c, cIdx) in fl.components"
              :key="cIdx"
              class="p-2 bg-zinc-950/60 border border-zinc-800/80 rounded-lg text-xs font-mono"
            >
              <div class="text-zinc-300 font-medium truncate">{{ c.name }}</div>
              <div class="text-[10px] text-zinc-500 mt-0.5 flex justify-between">
                <span>{{ (c.stitch || 0).toLocaleString() }} st</span>
                <span>{{ c.threadMeters || Math.round((c.stitch || 0) * 0.0033) }} m</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Catatan jika ada -->
        <div v-if="fl.notes" class="text-[11px] font-mono text-zinc-400 bg-zinc-950/40 p-2 rounded border border-zinc-850">
          {{ fl.notes }}
        </div>
      </div>
    </div>

    <!-- 3. Modal Tambah / Edit Floppy -->
    <div
      v-if="floppy.isFloppyModalOpen"
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div class="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-2xl space-y-4 my-8">
        <div class="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 class="font-bold text-white text-base font-mono">
            {{ floppy.isEditingFloppy ? 'Edit Master Floppy' : 'Daftarkan Master Floppy' }}
          </h3>
          <button @click="floppy.closeModal" class="text-zinc-500 hover:text-zinc-300 text-lg">✕</button>
        </div>

        <form @submit.prevent="floppy.saveFloppy" class="space-y-3 text-xs font-mono">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-zinc-400 mb-1">Nama Floppy / File *</label>
              <input
                v-model="floppy.floppyForm.name"
                type="text"
                required
                placeholder="Misal: Flopy B"
                class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <label class="block text-zinc-400 mb-1">Jenis Garment</label>
              <input
                v-model="floppy.floppyForm.garment"
                type="text"
                placeholder="Misal: Kemeja Koko"
                class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          <div>
            <label class="block text-zinc-400 mb-1">Target Jumlah Order (Pcs)</label>
            <input
              v-model.number="floppy.floppyForm.quantity"
              type="number"
              placeholder="1200"
              class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-zinc-600"
            />
          </div>

          <!-- Upload Screenshot Wilcom dengan kompresi WebP otomatis -->
          <div>
            <label class="block text-zinc-400 mb-1">Screenshot Wilcom (Otomatis Kompres WebP)</label>
            <input
              type="file"
              accept="image/*"
              @change="(e) => floppy.handleScreenshotFile(e.target.files[0])"
              class="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer"
            />
            <div v-if="floppy.previewScreenshotUrl" class="mt-2 rounded border border-zinc-800 overflow-hidden max-h-32">
              <img :src="floppy.previewScreenshotUrl" alt="Preview" class="w-full h-full object-cover" />
            </div>
          </div>

          <!-- Komponen Jahitan Dinamis -->
          <div class="space-y-2 pt-2 border-t border-zinc-800">
            <div class="flex items-center justify-between">
              <span class="text-zinc-400 font-bold uppercase text-[10px]">Rincian Komponen Stitches</span>
              <button
                type="button"
                @click="floppy.addComponent"
                class="text-sky-400 hover:text-sky-300 text-[11px]"
              >
                + Tambah Komponen
              </button>
            </div>

            <div
              v-for="(c, cIdx) in floppy.floppyForm.components"
              :key="cIdx"
              class="flex items-center gap-2"
            >
              <input
                v-model="c.name"
                type="text"
                placeholder="Nama Komponen"
                class="flex-1 bg-zinc-950 border border-zinc-800 rounded p-1.5 text-white"
              />
              <input
                v-model.number="c.stitch"
                type="number"
                placeholder="Stitches"
                class="w-24 bg-zinc-950 border border-zinc-800 rounded p-1.5 text-white text-right"
              />
              <button
                type="button"
                @click="floppy.removeComponent(cIdx)"
                class="text-zinc-500 hover:text-rose-400 px-1 text-sm"
              >
                ✕
              </button>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
            <button
              type="button"
              @click="floppy.closeModal"
              class="px-3.5 py-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-zinc-950 font-bold"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
