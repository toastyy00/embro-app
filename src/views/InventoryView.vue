<script setup>
import { useInventoryStore } from '../stores/useInventoryStore.js';
import { getThreadColor } from '../utils/colorPalette.js';

const inv = useInventoryStore();
</script>

<template>
  <div class="space-y-4">
    <!-- 1. Statistik Bar / Summary -->
    <div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
      <div class="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl">
        <div class="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Total Warna</div>
        <div class="text-xl font-bold font-mono text-white mt-1">{{ inv.inventoryCounts.total }}</div>
      </div>
      <div class="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl">
        <div class="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Total Cones</div>
        <div class="text-xl font-bold font-mono text-white mt-1">{{ inv.inventoryCounts.totalCones }}</div>
      </div>
      <div class="p-3 bg-emerald-950/20 border border-emerald-900/50 rounded-xl">
        <div class="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Stok Aman</div>
        <div class="text-xl font-bold font-mono text-emerald-300 mt-1">{{ inv.inventoryCounts.safeCount }}</div>
      </div>
      <div class="p-3 bg-amber-950/20 border border-amber-900/50 rounded-xl">
        <div class="text-[10px] font-mono text-amber-400 uppercase tracking-wider">Menipis</div>
        <div class="text-xl font-bold font-mono text-amber-300 mt-1">{{ inv.inventoryCounts.lowCount }}</div>
      </div>
      <div class="p-3 bg-rose-950/20 border border-rose-900/50 rounded-xl col-span-2 sm:col-span-1">
        <div class="text-[10px] font-mono text-rose-400 uppercase tracking-wider">Habis (0)</div>
        <div class="text-xl font-bold font-mono text-rose-300 mt-1">{{ inv.inventoryCounts.outCount }}</div>
      </div>
    </div>

    <!-- 2. Toolbar & Pencarian -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl">
      <div class="flex items-center gap-2 flex-1">
        <div class="relative flex-1 max-w-md">
          <input
            v-model="inv.inventorySearch"
            type="text"
            placeholder="Cari kode benang, warna, atau lokasi rak..."
            class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 font-mono"
          />
        </div>

        <!-- Filter Tab -->
        <div class="flex items-center gap-1 bg-zinc-950 border border-zinc-800 p-0.5 rounded-lg text-[11px] font-mono">
          <button
            @click="inv.inventoryFilter = 'all'"
            class="px-2.5 py-1 rounded transition-colors"
            :class="inv.inventoryFilter === 'all' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'"
          >
            Semua
          </button>
          <button
            @click="inv.inventoryFilter = 'low'"
            class="px-2.5 py-1 rounded transition-colors"
            :class="inv.inventoryFilter === 'low' ? 'bg-amber-950/60 text-amber-300 font-bold' : 'text-zinc-400 hover:text-zinc-200'"
          >
            Menipis
          </button>
          <button
            @click="inv.inventoryFilter = 'out'"
            class="px-2.5 py-1 rounded transition-colors"
            :class="inv.inventoryFilter === 'out' ? 'bg-rose-950/60 text-rose-300 font-bold' : 'text-zinc-400 hover:text-zinc-200'"
          >
            Habis
          </button>
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <button
          @click="inv.loadSample"
          class="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-850 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          Muat Sampel
        </button>
        <button
          @click="inv.openAddModal"
          class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs font-mono flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <span>+</span>
          <span>Tambah Benang</span>
        </button>
      </div>
    </div>

    <!-- 3. Tabel Stok Benang -->
    <div class="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs font-mono">
          <thead class="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800 uppercase text-[10px] tracking-wider select-none">
            <tr>
              <th class="py-2.5 px-3">Kode & Warna</th>
              <th class="py-2.5 px-3">Nama Katalog</th>
              <th class="py-2.5 px-3 text-center">Stok Cones</th>
              <th class="py-2.5 px-3">Lokasi Rak</th>
              <th class="py-2.5 px-3">Status</th>
              <th class="py-2.5 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800/60 text-zinc-300">
            <tr v-if="inv.filteredInventoryList.length === 0">
              <td colspan="6" class="text-center py-8 text-zinc-500 font-mono">
                Tidak ada data benang yang cocok.
              </td>
            </tr>
            <tr
              v-for="item in inv.filteredInventoryList"
              :key="item.id"
              class="hover:bg-zinc-850/40 transition-colors"
            >
              <!-- Kode Benang + Swatch Bulat -->
              <td class="py-2.5 px-3">
                <div class="flex items-center gap-2">
                  <span
                    class="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm shrink-0"
                    :style="{ backgroundColor: getThreadColor(item.code) }"
                  ></span>
                  <span class="font-bold text-white text-sm">{{ item.code }}</span>
                </div>
              </td>

              <!-- Nama Katalog & Brand -->
              <td class="py-2.5 px-3">
                <div class="font-medium text-zinc-200">{{ item.name || '-' }}</div>
                <div class="text-[10px] text-zinc-500">{{ item.brand || 'Rayon 120g' }}</div>
              </td>

              <!-- Tombol Cepat [-] Stok [+] -->
              <td class="py-2.5 px-3 text-center">
                <div class="inline-flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
                  <button
                    @click="inv.quickAdjustCones(item, -1)"
                    title="Kurangi 1 cone"
                    class="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span class="w-8 font-bold text-center text-white text-sm">
                    {{ item.cones }}
                  </span>
                  <button
                    @click="inv.quickAdjustCones(item, 1)"
                    title="Tambah 1 cone"
                    class="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </td>

              <!-- Lokasi Rak -->
              <td class="py-2.5 px-3">
                <span class="text-zinc-300">{{ item.rack || '-' }}</span>
              </td>

              <!-- Status Badge -->
              <td class="py-2.5 px-3">
                <span
                  class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight"
                  :class="{
                    'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400': item.status === 'safe',
                    'bg-amber-500/10 border border-amber-500/30 text-amber-400': item.status === 'low',
                    'bg-rose-500/10 border border-rose-500/30 text-rose-400': item.status === 'out',
                  }"
                >
                  {{ item.statusLabel }}
                </span>
              </td>

              <!-- Aksi -->
              <td class="py-2.5 px-3 text-right">
                <div class="inline-flex items-center gap-1.5">
                  <button
                    @click="inv.openEditModal(item)"
                    class="text-zinc-400 hover:text-zinc-200 text-xs hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                  <span class="text-zinc-700">|</span>
                  <button
                    @click="inv.deleteItem(item)"
                    class="text-rose-400 hover:text-rose-300 text-xs hover:underline cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 4. Modal Tambah / Edit Benang -->
    <div
      v-if="inv.isInventoryModalOpen"
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div class="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 class="font-bold text-white text-base font-mono">
            {{ inv.isEditingInventory ? 'Edit Benang Gudang' : 'Tambah Benang Baru' }}
          </h3>
          <button @click="inv.closeModal" class="text-zinc-500 hover:text-zinc-300 text-lg">✕</button>
        </div>

        <form @submit.prevent="inv.saveItem" class="space-y-3 text-xs font-mono">
          <div>
            <label class="block text-zinc-400 mb-1">Kode Benang *</label>
            <input
              v-model="inv.inventoryForm.code"
              @input="inv.onInventoryCodeInput"
              type="text"
              required
              placeholder="Contoh: 1179, 1319"
              class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-zinc-600 uppercase"
            />
          </div>

          <div>
            <label class="block text-zinc-400 mb-1">Nama / Deskripsi Warna</label>
            <input
              v-model="inv.inventoryForm.name"
              type="text"
              placeholder="Contoh: Putih Solid (Bleach White)"
              class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-zinc-400 mb-1">Stok Cones</label>
              <input
                v-model.number="inv.inventoryForm.cones"
                type="number"
                min="0"
                class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <label class="block text-zinc-400 mb-1">Batas Minimum (Peringatan)</label>
              <input
                v-model.number="inv.inventoryForm.minStock"
                type="number"
                min="0"
                class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          <div>
            <label class="block text-zinc-400 mb-1">Lokasi Rak / Box</label>
            <input
              v-model="inv.inventoryForm.rack"
              type="text"
              placeholder="Contoh: Rak A-02, Box C"
              class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
            <button
              type="button"
              @click="inv.closeModal"
              class="px-3.5 py-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
