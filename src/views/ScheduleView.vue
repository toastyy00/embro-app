<script setup>
import { computed, ref } from 'vue';
import { useTrialStore } from '../stores/useTrialStore.js';
import { getThreadColor } from '../utils/colorPalette.js';

const trial = useTrialStore();
const searchQuery = ref('');

// Filter daftar CMT yang sudah di-ACC
const accCmts = computed(() => {
  return trial.cmts.filter((c) => trial.isAcc(c));
});

const filteredCmts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return accCmts.value;
  return accCmts.value.filter((c) => {
    return (
      String(c.cmt).toLowerCase().includes(q) ||
      String(c.flopy || '').toLowerCase().includes(q) ||
      String(c.variant || '').toLowerCase().includes(q)
    );
  });
});
</script>

<template>
  <div class="space-y-4">
    <!-- Header Toolbar -->
    <div class="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <span class="text-xs font-mono font-bold text-white uppercase tracking-wider">
          Jadwal Mesin & Siap Produksi
        </span>
        <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold">
          {{ accCmts.length }} Variasi Siap
        </span>
      </div>

      <div class="max-w-xs w-full">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari No CMT / Floppy..."
          class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-zinc-600"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="accCmts.length === 0" class="p-12 text-center bg-zinc-900/40 border border-dashed border-zinc-800 rounded-2xl">
      <div class="text-zinc-400 font-mono text-xs">Belum ada variasi CMT yang disetujui (ACC).</div>
      <div class="text-zinc-600 font-mono text-[11px] mt-1">Buka tab "Trial Benang" dan klik badge opsi benang untuk menyetujui (ACC).</div>
    </div>

    <!-- Grid Kartu Jadwal Siap Mesin -->
    <div v-else class="grid gap-3 sm:grid-cols-2">
      <div
        v-for="item in filteredCmts"
        :key="item.cmt + '_' + item.variant"
        class="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2.5"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="font-bold text-white font-mono text-base">CMT {{ item.cmt }}</span>
            <span v-if="item.flopy" class="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
              {{ item.flopy }}
            </span>
            <span v-if="item.variant && item.variant !== '-'" class="text-[10px] font-mono text-zinc-400">
              ({{ item.variant }})
            </span>
          </div>

          <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            ✓ SIAP MESIN
          </span>
        </div>

        <div class="pt-2 border-t border-zinc-800/80">
          <div class="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">Benang Disetujui (ACC):</div>
          <div class="flex flex-wrap items-center gap-1.5">
            <span
              v-for="th in trial.getAccThreads(item)"
              :key="th"
              class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200"
            >
              <span
                class="w-2.5 h-2.5 rounded-full border border-white/20 shrink-0"
                :style="{ backgroundColor: getThreadColor(th) }"
              ></span>
              <span class="font-bold">{{ th }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
