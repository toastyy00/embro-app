<script setup>
import { useTrialStore } from '../stores/useTrialStore.js';
import ComboBadge from '../components/trial/ComboBadge.vue';
import { getThreadColor } from '../utils/colorPalette.js';

const trial = useTrialStore();

defineEmits(['switch-to-cmt']);
</script>

<template>
  <div class="space-y-4">
    <!-- 1. Header Pengaturan Kapasitas Mesin Bordir (Mesin 1 Kepala Trial) -->
    <div class="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
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
        <span class="text-xs font-mono text-zinc-400">Jarum Swap (Rotasi):</span>
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
          @click="$emit('switch-to-cmt')"
          class="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-xs font-mono font-medium text-zinc-200 flex items-center gap-1.5 transition-colors"
        >
          <svg class="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          <span>Kelola Data CMT ({{ trial.cmts.length }})</span>
        </button>
      </div>
    </div>

    <!-- 2. Tahapan Mesin (Stages) -->
    <div v-if="trial.stages.length === 0" class="p-12 text-center bg-zinc-900/40 border border-dashed border-zinc-800 rounded-2xl">
      <div class="text-zinc-400 font-mono text-xs">Belum ada variasi CMT bordir yang aktif.</div>
      <div class="text-zinc-600 font-mono text-[11px] mt-1">Buka menu "Data CMT" untuk menambahkan nomor CMT dan variasi benang.</div>
      <button
        @click="$emit('switch-to-cmt')"
        class="mt-3 px-4 py-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-mono font-semibold hover:bg-emerald-600/30 transition-colors"
      >
        + Buka Menu Data CMT
      </button>
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
            <span
              class="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase"
              :class="stage.isSwapStage ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'"
            >
              Tahap {{ sIdx + 1 }}
            </span>
            <span class="text-xs font-mono font-bold text-white">{{ stage.title }}</span>
          </div>

          <span class="text-[11px] font-mono text-zinc-400">{{ stage.items.length }} Film</span>
        </div>

        <!-- Instruksi Operator Mesin -->
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

            <!-- Tampilan Urutan Jarum & Badge Opsi Warna -->
            <div class="mt-2.5 pt-2 border-t border-zinc-850/80">
              <!-- KONDISI A: Mode Opsi Kombinasi Benang (Badge Sambung [J3|1171||J2|1070] dengan Checkmark Mandiri) -->
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
                    :class="trial.isThreadAcc(item, th) ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500/50' : 'border-zinc-800 bg-zinc-900'"
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
  </div>
</template>
