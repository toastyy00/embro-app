<script setup>
import { ref } from 'vue';
import { useTrialStore } from '../stores/useTrialStore.js';
import ComboBadge from '../components/trial/ComboBadge.vue';
import { getThreadColor } from '../utils/colorPalette.js';

const trial = useTrialStore();

// Form Input CMT Baru
const newCmt = ref({
  flopy: '',
  cmt: '',
  variant: '',
  threadsInput: '',
});

function addSingleCmt() {
  const cmtNum = (newCmt.value.cmt || '').trim();
  const rawThreads = (newCmt.value.threadsInput || '').trim();

  if (!cmtNum || !rawThreads) {
    alert('Nomor CMT dan Kode Benang wajib diisi.');
    return;
  }

  // Parse benang (dipisahkan spasi atau koma)
  const threadList = rawThreads.split(/[\s,]+/).filter(Boolean);

  trial.cmts.push({
    flopy: (newCmt.value.flopy || '').trim() || 'Flopy A',
    cmt: cmtNum,
    variant: (newCmt.value.variant || '-').trim(),
    threads: threadList,
    threadOptions: [threadList],
    isCombination: false,
  });

  newCmt.value.cmt = '';
  newCmt.value.variant = '';
  newCmt.value.threadsInput = '';
}

function removeCmtItem(idx) {
  trial.cmts.splice(idx, 1);
}
</script>

<template>
  <div class="space-y-4">
    <!-- 1. Pengaturan Kapasitas Mesin Bordir -->
    <div class="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-xl flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <span class="text-xs font-mono font-bold text-white uppercase tracking-wider">Kapasitas Jarum:</span>
        <div class="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
          <button
            v-for="cap in [6, 9, 11, 12, 15]"
            :key="cap"
            @click="trial.needleCapacity = cap"
            class="px-2.5 py-1 rounded text-xs font-mono transition-colors"
            :class="trial.needleCapacity === cap ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'"
          >
            {{ cap }} J
          </button>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs font-mono text-zinc-400">Jarum Swap:</span>
        <select
          v-model.number="trial.swapNeedle"
          class="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs font-mono text-white focus:outline-none focus:border-zinc-600"
        >
          <option v-for="n in trial.needleCapacity" :key="n" :value="n">
            Jarum {{ n }}
          </option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="trial.loadSample"
          class="px-3 py-1 rounded border border-zinc-800 bg-zinc-950 hover:bg-zinc-850 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          Muat Sampel
        </button>
        <button
          @click="trial.clearAllCmts"
          class="px-3 py-1 rounded border border-zinc-800 bg-zinc-950 hover:bg-zinc-850 text-xs font-mono text-rose-400 hover:text-rose-300 transition-colors"
        >
          Kosongkan
        </button>
      </div>
    </div>

    <!-- 2. Tahapan Mesin (Stages) -->
    <div v-if="trial.stages.length === 0" class="p-12 text-center bg-zinc-900/40 border border-dashed border-zinc-800 rounded-2xl">
      <div class="text-zinc-400 font-mono text-xs">Belum ada variasi CMT bordir yang aktif.</div>
      <div class="text-zinc-600 font-mono text-[11px] mt-1">Masukkan data CMT di formulir bawah atau klik "Muat Sampel".</div>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="(stage, sIdx) in trial.stages"
        :key="sIdx"
        class="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden shadow-sm"
      >
        <!-- Header Tahap -->
        <div class="p-3 bg-zinc-950/70 border-b border-zinc-800 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase" :class="stage.isSwapStage ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'">
              Tahap {{ sIdx + 1 }}
            </span>
            <span class="text-xs font-mono font-bold text-white">{{ stage.title }}</span>
          </div>

          <span class="text-[11px] font-mono text-zinc-400">{{ stage.items.length }} Film</span>
        </div>

        <!-- Instruksi Operator -->
        <div v-if="stage.instruction" class="px-4 py-2 bg-zinc-950/30 text-[11px] font-mono text-zinc-300 border-b border-zinc-850">
          💡 {{ stage.instruction }}
        </div>

        <!-- Kartu-Kartu Film Operator di Tahap Ini -->
        <div class="p-3 grid gap-3 sm:grid-cols-2">
          <div
            v-for="(item, itIdx) in stage.items"
            :key="itIdx"
            class="p-3 rounded-lg border transition-all"
            :class="trial.isCompleted(item.key) ? 'bg-zinc-950/60 border-zinc-800 opacity-60' : 'bg-zinc-950/90 border-zinc-800 hover:border-zinc-700'"
          >
            <!-- Header Kartu: CMT, Flopy, Variant -->
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="font-mono font-bold text-sm text-white">CMT {{ item.cmt }}</span>
                <span v-if="item.flopy" class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-850 text-zinc-400">
                  {{ item.flopy }}
                </span>
                <span v-if="item.variant && item.variant !== '-'" class="text-[10px] font-mono text-zinc-300">
                  ({{ item.variant }})
                </span>
              </div>

              <!-- Checkbox Selesai -->
              <button
                @click="trial.toggleComplete(item.key)"
                class="px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer"
                :class="trial.isCompleted(item.key) ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-850 hover:bg-zinc-750 text-zinc-400'"
              >
                {{ trial.isCompleted(item.key) ? '✓ Selesai' : 'Tandai' }}
              </button>
            </div>

            <!-- Tampilan Urutan Jarum / Opsi Warna -->
            <div class="mt-2.5 pt-2 border-t border-zinc-850/80">
              <!-- KONDISI A: Mode Opsi Kombinasi Benang -->
              <div v-if="item.hasCombinationOptions" class="flex flex-wrap items-center gap-2">
                <ComboBadge
                  v-for="opt in item.combinationOptions"
                  :key="opt.optIdx"
                  :item="item"
                  :option="opt"
                  :is-acc="trial.isOptionAcc(item, opt)"
                  @toggle-acc="trial.toggleOptionAcc"
                />
              </div>

              <!-- KONDISI B: Mode 1 Warna Biasa -->
              <div v-else class="flex flex-wrap items-center gap-1.5">
                <template v-for="(th, nIdx) in item.threads" :key="nIdx">
                  <span v-if="nIdx > 0" class="text-zinc-600 text-xs">→</span>
                  <div
                    @click="trial.toggleThreadAcc(item, th)"
                    :title="trial.isThreadAcc(item, th) ? `Batal ACC benang ${th}` : `ACC benang ${th}`"
                    class="inline-flex items-stretch rounded border overflow-hidden cursor-pointer select-none text-[11px] font-mono transition-all"
                    :class="trial.isThreadAcc(item, th) ? 'border-emerald-500 bg-emerald-950/20' : 'border-zinc-800 bg-zinc-900'"
                  >
                    <span class="px-1.5 py-0.5 bg-zinc-850 text-zinc-300 border-r border-zinc-800 font-bold">
                      {{ item.needleSequence[nIdx] || 'J?' }}
                    </span>
                    <span class="px-2 py-0.5 flex items-center gap-1 text-zinc-200">
                      <span
                        class="w-2 h-2 rounded-full border border-white/20 shrink-0"
                        :style="{ backgroundColor: getThreadColor(th) }"
                      ></span>
                      <span>{{ th }}</span>
                    </span>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Form Input Cepat CMT di Bawah -->
    <div class="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-3">
      <div class="text-xs font-mono font-bold text-white uppercase tracking-wider">
        + Input Cepat Variasi CMT Bordir
      </div>

      <form @submit.prevent="addSingleCmt" class="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs font-mono">
        <div>
          <input
            v-model="newCmt.flopy"
            type="text"
            placeholder="Flopy (Misal: Flopy B)"
            class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-zinc-600"
          />
        </div>
        <div>
          <input
            v-model="newCmt.cmt"
            type="text"
            required
            placeholder="No CMT (Misal: 620)"
            class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-zinc-600"
          />
        </div>
        <div>
          <input
            v-model="newCmt.variant"
            type="text"
            placeholder="Variasi (Misal: C1 Navy)"
            class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-zinc-600"
          />
        </div>
        <div>
          <input
            v-model="newCmt.threadsInput"
            type="text"
            required
            placeholder="Benang (Misal: 1179 1319 2216)"
            class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-zinc-600"
          />
        </div>

        <div class="sm:col-span-4 flex justify-end">
          <button
            type="submit"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold rounded-lg text-xs font-mono transition-colors shadow-sm"
          >
            + Tambahkan Variasi CMT
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
