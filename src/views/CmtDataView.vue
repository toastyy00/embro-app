<script setup>
import { ref, computed } from 'vue';
import { useTrialStore } from '../stores/useTrialStore.js';
import { useFloppyStore } from '../stores/useFloppyStore.js';
import { useToastStore } from '../stores/useToastStore.js';
import { getThreadColor } from '../utils/colorPalette.js';

const trial = useTrialStore();
const floppy = useFloppyStore();
const toast = useToastStore();

// Form Input State
const cmtNumber = ref('');
const selectedFloppy = ref('');
const variantRows = ref([
  {
    variant: 'C1',
    isCombination: false,
    options: [''],
  },
]);

// Helper untuk placeholder variasi (C1, C2, C3, dst.)
const getVariantPlaceholder = (index) => {
  return `C${index + 1}`;
};

function addVariantRow() {
  const nextIdx = variantRows.value.length;
  variantRows.value.push({
    variant: getVariantPlaceholder(nextIdx),
    isCombination: false,
    options: [''],
  });
}

function removeVariantRow(index) {
  if (variantRows.value.length > 1) {
    variantRows.value.splice(index, 1);
  }
}

function enableCombinationMode(rowIndex) {
  const row = variantRows.value[rowIndex];
  row.isCombination = true;
  if (row.options.length <= 1) {
    const existing = row.options[0] || '';
    row.options = existing ? [existing, ''] : ['', ''];
  }
}

function resetRowToSingleOption(rowIndex) {
  const row = variantRows.value[rowIndex];
  row.isCombination = false;
  row.options = [row.options[0] || ''];
}

function addOptionToRow(rowIndex) {
  enableCombinationMode(rowIndex);
  variantRows.value[rowIndex].options.push('');
}

function removeOptionFromRow(rowIndex, optionIndex) {
  const row = variantRows.value[rowIndex];
  if (row.options.length > 1) {
    row.options.splice(optionIndex, 1);
  }
}

// Simpan Data CMT
function saveCMT() {
  const cmt = cmtNumber.value.trim();
  if (!cmt) {
    alert('Nomor CMT wajib diisi (misal: 620).');
    return;
  }

  const flopyName = selectedFloppy.value.trim() || 'Flopy A';
  const newItems = [];

  for (let i = 0; i < variantRows.value.length; i++) {
    const row = variantRows.value[i];
    const varLabel = (row.variant || getVariantPlaceholder(i)).trim();

    if (row.isCombination) {
      // Mode Kombinasi: tiap opsi bisa berisi 2+ warna benang
      const parsedOptions = [];
      const allThreads = [];

      row.options.forEach((optStr) => {
        const cleaned = (optStr || '').trim();
        if (cleaned) {
          const colors = cleaned.split(/[\s,]+/).filter(Boolean);
          if (colors.length > 0) {
            parsedOptions.push(colors);
            colors.forEach((c) => allThreads.push(c));
          }
        }
      });

      if (parsedOptions.length === 0) {
        alert(`Variasi ${varLabel} belum memiliki opsi benang.`);
        return;
      }

      newItems.push({
        flopy: flopyName,
        cmt,
        variant: varLabel,
        threads: allThreads,
        threadOptions: parsedOptions,
        isCombination: true,
      });
    } else {
      // Mode 1 Warna: satu deretan kode benang
      const rawText = (row.options[0] || '').trim();
      if (!rawText) {
        alert(`Variasi ${varLabel} belum memiliki kode benang.`);
        return;
      }

      const colors = rawText.split(/[\s,]+/).filter(Boolean);
      newItems.push({
        flopy: flopyName,
        cmt,
        variant: varLabel,
        threads: colors,
        threadOptions: colors.map((c) => [c]),
        isCombination: false,
      });
    }
  }

  // Tambahkan ke store cmts
  trial.cmts.push(...newItems);
  toast.showToast(`CMT ${cmt} (${newItems.length} variasi) berhasil ditambahkan!`);

  // Reset form
  cmtNumber.value = '';
  variantRows.value = [
    {
      variant: 'C1',
      isCombination: false,
      options: [''],
    },
  ];
}

// Pengelompokan CMT yang tersimpan untuk tampilan ringkas
const groupedCmts = computed(() => {
  const groups = {};
  trial.cmts.forEach((item, index) => {
    const groupKey = `${item.flopy || 'Flopy'}_${item.cmt}`;
    if (!groups[groupKey]) {
      groups[groupKey] = {
        flopy: item.flopy || '-',
        cmt: item.cmt,
        variants: [],
      };
    }
    groups[groupKey].variants.push({
      itemRef: item,
      index,
      variant: item.variant || '-',
      threads: item.threads || [],
      threadOptions: item.threadOptions || [],
      isCombination: item.isCombination || false,
    });
  });
  return Object.values(groups);
});

function removeSingleVariant(index) {
  trial.cmts.splice(index, 1);
  toast.showToast('Variasi berhasil dihapus.');
}

function removeCmtGroup(cmtNum, flopyName) {
  if (!confirm(`Hapus seluruh variasi untuk CMT ${cmtNum}?`)) return;
  trial.cmts = trial.cmts.filter(
    (c) => !(c.cmt === cmtNum && (c.flopy || '') === (flopyName || ''))
  );
  toast.showToast(`Seluruh variasi CMT ${cmtNum} telah dihapus.`);
}
</script>

<template>
  <div class="space-y-4">
    <!-- 1. Header Toolbar -->
    <div class="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <span class="text-xs font-mono font-bold text-white uppercase tracking-wider">
          Pusat Data CMT (Order Operasional)
        </span>
        <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold">
          {{ trial.cmts.length }} Variasi Aktif
        </span>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="trial.loadSample"
          class="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-850 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          Muat Sampel
        </button>
        <button
          @click="trial.clearAllCmts"
          class="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-850 text-xs font-mono text-rose-400 hover:text-rose-300 transition-colors"
        >
          Kosongkan
        </button>
      </div>
    </div>

    <!-- 2. Formulir Input CMT Baru (Lengkap & Terorganisir) -->
    <div class="p-4 sm:p-5 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-4 shadow-sm">
      <div class="flex items-center justify-between pb-2 border-b border-zinc-800">
        <h3 class="font-bold text-sm text-white font-mono flex items-center gap-2">
          <span>+ Tambah Order CMT Baru</span>
        </h3>
        <span class="text-[11px] font-mono text-zinc-500">Mendukung mode 1 warna dan multi-warna kombinasi</span>
      </div>

      <form @submit.prevent="saveCMT" class="space-y-4 text-xs font-mono">
        <!-- Baris 1: No CMT & Nama Floppy -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-zinc-400 mb-1 font-semibold uppercase text-[10px] tracking-wider">Nomor CMT *</label>
            <input
              v-model="cmtNumber"
              type="text"
              required
              placeholder="Contoh: 620, 626"
              class="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 font-mono font-bold text-sm"
            />
          </div>

          <div>
            <label class="block text-zinc-400 mb-1 font-semibold uppercase text-[10px] tracking-wider">Nama Floppy Wilcom</label>
            <input
              v-model="selectedFloppy"
              type="text"
              list="floppy-options"
              placeholder="Pilih atau ketik (Contoh: Flopy B)"
              class="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 font-mono"
            />
            <datalist id="floppy-options">
              <option v-for="fl in floppy.floppyList" :key="fl.id" :value="fl.name" />
            </datalist>
          </div>
        </div>

        <!-- Baris Variasi & Opsi Benang -->
        <div class="space-y-3 pt-2 border-t border-zinc-800/80">
          <div class="flex items-center justify-between">
            <span class="text-zinc-400 uppercase font-semibold text-[10px] tracking-wider">
              Variasi & Opsi Kode Benang:
            </span>
            <span class="text-[10px] text-zinc-500">
              Gunakan tombol "+ Opsi" jika satu film memiliki 2 warna atau lebih
            </span>
          </div>

          <!-- Loop Tiap Baris Variasi -->
          <div
            v-for="(row, rIdx) in variantRows"
            :key="rIdx"
            class="p-3 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-2.5"
          >
            <!-- Header Variasi: Label & Toggle Mode -->
            <div class="flex items-center justify-between gap-2 flex-wrap pb-1.5 border-b border-zinc-850">
              <div class="flex items-center gap-2">
                <span class="w-5 h-5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-bold flex items-center justify-center font-mono">
                  {{ rIdx + 1 }}
                </span>
                <span class="text-zinc-400 font-bold uppercase text-[11px]">Variasi:</span>
                <input
                  v-model="row.variant"
                  :placeholder="getVariantPlaceholder(rIdx)"
                  class="w-24 h-7 bg-zinc-900 border border-zinc-750 rounded px-2 text-xs font-mono font-bold text-white uppercase focus:outline-none focus:border-zinc-500"
                />
                <span
                  class="px-2 py-0.5 rounded text-[10px] font-semibold"
                  :class="row.isCombination ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' : 'bg-zinc-800 text-zinc-400'"
                >
                  {{ row.isCombination ? `Mode Kombinasi (${row.options.length} Opsi)` : 'Mode 1 Warna' }}
                </span>
              </div>

              <div class="flex items-center gap-1.5">
                <button
                  v-if="row.isCombination"
                  type="button"
                  @click="resetRowToSingleOption(rIdx)"
                  class="px-2 py-1 rounded text-[10px] font-mono text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  ↺ Ubah ke 1 Warna
                </button>
                <button
                  v-else
                  type="button"
                  @click="enableCombinationMode(rIdx)"
                  class="px-2 py-1 rounded text-[10px] font-mono text-amber-300 bg-amber-950/40 border border-amber-500/30 hover:bg-amber-900/40"
                >
                  + Mode Kombinasi
                </button>

                <button
                  v-if="variantRows.length > 1"
                  type="button"
                  @click="removeVariantRow(rIdx)"
                  title="Hapus variasi ini"
                  class="w-6 h-6 rounded flex items-center justify-center text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10"
                >
                  ✕
                </button>
              </div>
            </div>

            <!-- Wadah Input Benang -->
            <!-- KONDISI A: Mode 1 Warna -->
            <div v-if="!row.isCombination" class="flex items-center gap-2">
              <input
                v-model="row.options[0]"
                placeholder="Contoh: 1179 1164 1319 (pisahkan spasi)"
                class="flex-1 h-9 bg-zinc-900 border border-zinc-750 rounded-lg px-3 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <!-- KONDISI B: Mode Kombinasi Multi-Warna (Horizontal Scrollable) -->
            <div v-else class="space-y-1">
              <div class="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
                <div
                  v-for="(opt, oIdx) in row.options"
                  :key="oIdx"
                  class="shrink-0 w-36 sm:w-44 bg-zinc-900 border border-zinc-750 rounded-lg p-2 space-y-1"
                >
                  <div class="flex items-center justify-between text-[10px] font-bold text-zinc-400">
                    <span>OPSI {{ oIdx + 1 }}</span>
                    <button
                      v-if="row.options.length > 1"
                      type="button"
                      @click="removeOptionFromRow(rIdx, oIdx)"
                      class="text-zinc-500 hover:text-rose-400 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <input
                    v-model="row.options[oIdx]"
                    placeholder="Contoh: 1171 1070"
                    class="w-full h-8 bg-zinc-950 border border-zinc-750 rounded px-2 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <!-- Tombol Tambah Opsi ke Samping (+) -->
                <button
                  type="button"
                  @click="addOptionToRow(rIdx)"
                  class="shrink-0 w-24 h-[62px] rounded-lg border border-dashed border-zinc-750 hover:border-zinc-500 bg-zinc-900/40 text-zinc-400 hover:text-white font-mono text-xs flex flex-col items-center justify-center gap-0.5 transition-colors"
                >
                  <span class="text-base font-bold leading-none">+</span>
                  <span class="text-[10px]">Opsi</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Tombol Tambah Variasi Baru -->
          <button
            type="button"
            @click="addVariantRow"
            class="w-full py-2 rounded-lg border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs font-mono font-medium transition-colors"
          >
            + Tambah Variasi Baru ({{ getVariantPlaceholder(variantRows.length) }})
          </button>
        </div>

        <!-- Tombol Submit -->
        <div class="flex justify-end pt-2 border-t border-zinc-800">
          <button
            type="submit"
            class="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs font-mono transition-colors shadow-sm"
          >
            ✓ Simpan Data CMT
          </button>
        </div>
      </form>
    </div>

    <!-- 3. Daftar Data CMT yang Sudah Tersimpan (Organized by CMT) -->
    <div class="space-y-3">
      <div class="flex items-center justify-between px-1">
        <h4 class="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
          Daftar Order CMT yang Aktif:
        </h4>
        <span class="text-[11px] font-mono text-zinc-500">{{ groupedCmts.length }} Nomor CMT</span>
      </div>

      <div v-if="groupedCmts.length === 0" class="p-8 text-center bg-zinc-900/30 border border-dashed border-zinc-800 rounded-xl">
        <div class="text-zinc-500 font-mono text-xs">Belum ada order CMT yang terdaftar.</div>
      </div>

      <div
        v-for="group in groupedCmts"
        :key="group.flopy + '_' + group.cmt"
        class="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-3"
      >
        <!-- Header Group: No CMT, Floppy, Tombol Hapus Grup -->
        <div class="flex items-center justify-between pb-2 border-b border-zinc-850">
          <div class="flex items-center gap-2.5">
            <span class="font-bold font-mono text-white text-base">CMT {{ group.cmt }}</span>
            <span class="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
              {{ group.flopy }}
            </span>
            <span class="text-[11px] font-mono text-zinc-500">
              ({{ group.variants.length }} Variasi)
            </span>
          </div>

          <button
            @click="removeCmtGroup(group.cmt, group.flopy)"
            class="text-xs font-mono text-rose-400 hover:text-rose-300 hover:underline"
          >
            Hapus CMT Ini
          </button>
        </div>

        <!-- List Variasi dalam CMT ini -->
        <div class="grid gap-2 sm:grid-cols-2">
          <div
            v-for="v in group.variants"
            :key="v.index"
            class="p-2.5 bg-zinc-950/70 border border-zinc-800/80 rounded-lg flex items-start justify-between gap-2"
          >
            <div class="space-y-1.5 flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="font-bold text-xs font-mono text-zinc-200">
                  {{ v.variant !== '-' ? v.variant : 'Variasi Utama' }}
                </span>
                <span
                  v-if="trial.isAcc(v.itemRef)"
                  class="px-1.5 py-0.2 rounded text-[9.5px] font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                >
                  ✓ ACC
                </span>
              </div>

              <!-- Tampilan Opsi Benang -->
              <!-- Mode Kombinasi -->
              <div v-if="v.isCombination" class="flex flex-wrap items-center gap-1.5">
                <div
                  v-for="(opt, optIdx) in v.threadOptions"
                  :key="optIdx"
                  class="inline-flex items-center rounded border border-zinc-750 bg-zinc-900 overflow-hidden text-[10px] font-mono"
                  :class="trial.isOptionAcc(v.itemRef, optIdx) ? 'border-emerald-500 bg-emerald-950/20 text-white' : 'text-zinc-300'"
                >
                  <span v-if="trial.isOptionAcc(v.itemRef, optIdx)" class="px-1 bg-emerald-500 text-zinc-950 font-bold">✓</span>
                  <template v-for="(code, cIdx) in opt" :key="cIdx">
                    <span v-if="cIdx > 0" class="px-0.5 text-zinc-600">||</span>
                    <span class="px-1.5 py-0.5 flex items-center gap-1">
                      <span class="w-2 h-2 rounded-full border border-white/20 shrink-0" :style="{ backgroundColor: getThreadColor(code) }"></span>
                      <span>{{ code }}</span>
                    </span>
                  </template>
                </div>
              </div>

              <!-- Mode 1 Warna -->
              <div v-else class="flex flex-wrap items-center gap-1">
                <span
                  v-for="code in v.threads"
                  :key="code"
                  class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300"
                >
                  <span class="w-2 h-2 rounded-full border border-white/20 shrink-0" :style="{ backgroundColor: getThreadColor(code) }"></span>
                  <span>{{ code }}</span>
                </span>
              </div>
            </div>

            <!-- Tombol Hapus Variasi -->
            <button
              @click="removeSingleVariant(v.index)"
              title="Hapus variasi ini"
              class="text-zinc-500 hover:text-rose-400 text-xs px-1"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
