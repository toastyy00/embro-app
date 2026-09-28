<script setup>
import { computed, ref } from 'vue';
import { useAppStore } from '../stores/useAppStore.js';

const store = useAppStore();

const scheduleFilter = ref('all'); // 'all', 'acc', 'pending', 'completed'
const scheduleSearch = ref('');
const scheduleViewMode = ref('floppy'); // 'floppy' | 'flat'

const scheduleCounts = computed(() => {
  let total = store.cmts.length;
  let acc = 0;
  let pending = 0;
  let completed = 0;

  store.cmts.forEach((item) => {
    const isDone = store.isItemCompleted(item);
    const hasAcc = Object.keys(store.accMap[store.getItemKey(item)] || {}).length > 0;
    if (isDone) completed++;
    else if (hasAcc) acc++;
    else pending++;
  });

  return { total, acc, pending, completed };
});

const filteredScheduleList = computed(() => {
  const q = scheduleSearch.value.trim().toLowerCase();
  return store.cmts.filter((item) => {
    const isDone = store.isItemCompleted(item);
    const hasAcc = Object.keys(store.accMap[store.getItemKey(item)] || {}).length > 0;

    if (scheduleFilter.value === 'acc' && !hasAcc) return false;
    if (scheduleFilter.value === 'pending' && (hasAcc || isDone)) return false;
    if (scheduleFilter.value === 'completed' && !isDone) return false;

    if (q) {
      const match =
        String(item.cmt).toLowerCase().includes(q) ||
        String(item.flopy || '').toLowerCase().includes(q) ||
        String(item.variant || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
});
</script>

<template>
  <section class="space-y-4 no-print font-mono">
    <!-- Module Header Banner -->
    <div class="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3.5 sm:p-4 shadow-sm flex items-center justify-between gap-3 flex-wrap">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-lg bg-amber-950 border border-amber-800/80 flex items-center justify-center text-amber-400">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <div>
          <h2 class="text-sm font-bold text-white uppercase tracking-tight">Jadwal &amp; Estimator Mesin Bordir</h2>
          <p class="text-[11px] text-zinc-400 font-sans">2 Mesin • 24 Kepala Total • 800 SPM • Jeda Kertas Sobek &amp; Bidangan 4 Menit</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-[10px] px-2 py-0.5 rounded bg-white/10 border border-white/25 text-white font-bold uppercase tracking-wider">
          {{ scheduleCounts.acc }} Variasi ACC
        </span>
      </div>
    </div>

    <!-- Formula Callout -->
    <div class="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs space-y-1 text-zinc-300">
      <div class="text-[11px] text-amber-400 font-bold">⚙️ Parameter Operasional Pabrik Al-Raaz:</div>
      <div class="text-[10.5px] text-zinc-400 font-sans leading-relaxed">
        Estimasi waktu per angkatan = <span class="text-zinc-200 font-mono">(Tusukan / 800 SPM × 1,20 toleransi) + 4 menit</span> jeda ganti kertas sobek, bongkar bidangan, dan penanganan spul.
      </div>
    </div>

    <!-- Quick Stat Metrics Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
      <div class="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex flex-col justify-between">
        <div class="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Total CMT / Variasi</div>
        <div class="text-lg font-bold text-white mt-1">{{ scheduleCounts.total }} <span class="text-xs font-normal text-zinc-500">Item</span></div>
      </div>
      <div class="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex flex-col justify-between">
        <div class="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          <span>Siap Mesin (ACC)</span>
        </div>
        <div class="text-lg font-bold text-white mt-1">{{ scheduleCounts.acc }} <span class="text-xs font-normal text-zinc-500">Variasi</span></div>
      </div>
      <div class="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex flex-col justify-between">
        <div class="text-[10px] text-amber-400/90 uppercase tracking-wider font-semibold flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span>Menunggu Trial</span>
        </div>
        <div class="text-lg font-bold text-amber-400 mt-1">{{ scheduleCounts.pending }} <span class="text-xs font-normal text-zinc-500">WIP</span></div>
      </div>
      <div class="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex flex-col justify-between">
        <div class="text-[10px] text-emerald-400/90 uppercase tracking-wider font-semibold flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Selesai Bordir</span>
        </div>
        <div class="text-lg font-bold text-emerald-400 mt-1">{{ scheduleCounts.completed }} <span class="text-xs font-normal text-zinc-500">Selesai</span></div>
      </div>
    </div>

    <!-- Filter Bar & Search -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
      <div class="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-[11px]">
        <button
          @click="scheduleFilter = 'all'"
          :class="scheduleFilter === 'all' ? 'bg-zinc-800 text-white border-zinc-600 font-bold' : 'bg-zinc-900/60 text-zinc-400 border-zinc-850 hover:text-zinc-200'"
          class="px-2.5 py-1.5 rounded-lg border transition-colors whitespace-nowrap cursor-pointer"
        >
          Semua ({{ scheduleCounts.total }})
        </button>
        <button
          @click="scheduleFilter = 'acc'"
          :class="scheduleFilter === 'acc' ? 'bg-zinc-800 text-white border-white ring-1 ring-white/30 font-bold' : 'bg-zinc-900/60 text-zinc-400 border-zinc-850 hover:text-zinc-200'"
          class="px-2.5 py-1.5 rounded-lg border transition-colors whitespace-nowrap cursor-pointer"
        >
          Siap Mesin / ACC ({{ scheduleCounts.acc }})
        </button>
        <button
          @click="scheduleFilter = 'pending'"
          :class="scheduleFilter === 'pending' ? 'bg-amber-950/60 text-amber-300 border-amber-800/80 font-bold' : 'bg-zinc-900/60 text-zinc-400 border-zinc-850 hover:text-zinc-200'"
          class="px-2.5 py-1.5 rounded-lg border transition-colors whitespace-nowrap cursor-pointer"
        >
          Menunggu Trial ({{ scheduleCounts.pending }})
        </button>
        <button
          @click="scheduleFilter = 'completed'"
          :class="scheduleFilter === 'completed' ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80 font-bold' : 'bg-zinc-900/60 text-zinc-400 border-zinc-850 hover:text-zinc-200'"
          class="px-2.5 py-1.5 rounded-lg border transition-colors whitespace-nowrap cursor-pointer"
        >
          Selesai ({{ scheduleCounts.completed }})
        </button>
      </div>

      <div class="relative min-w-[170px] sm:w-56">
        <input
          v-model="scheduleSearch"
          type="text"
          placeholder="Cari CMT, variasi, floppy..."
          class="w-full h-8 pl-8 pr-7 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
        />
        <svg class="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
    </div>

    <!-- Cards List -->
    <div v-if="filteredScheduleList.length > 0" class="grid gap-3 sm:grid-cols-2">
      <div
        v-for="item in filteredScheduleList"
        :key="store.getItemKey(item)"
        class="p-3 rounded-xl border bg-zinc-950 border-zinc-800 hover:border-zinc-700 space-y-2.5 transition-colors"
      >
        <div class="flex items-center justify-between border-b border-zinc-850 pb-2">
          <div>
            <div class="font-bold text-white text-xs flex items-center gap-1.5">
              <span>CMT {{ item.cmt }}</span>
              <span v-if="item.flopy" class="text-zinc-500 font-normal">| {{ item.flopy }}</span>
            </div>
            <div class="text-[10px] text-zinc-400 mt-0.5">{{ item.variant }}</div>
          </div>
          <button
            @click="store.toggleItemComplete(item)"
            class="px-2 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer"
            :class="store.isItemCompleted(item) ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'"
          >
            {{ store.isItemCompleted(item) ? '✓ Selesai' : 'Tandai Selesai' }}
          </button>
        </div>

        <div class="flex flex-wrap gap-1.5">
          <div
            v-for="(th, tIdx) in item.threads"
            :key="tIdx"
            class="px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1.5 border border-zinc-800 bg-zinc-900"
          >
            <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: store.getThreadColor(th, store.colorMap) }"></span>
            <span>{{ th }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="p-8 text-center bg-zinc-950 border border-dashed border-zinc-850 rounded-xl text-xs text-zinc-500">
      Tidak ada variasi CMT yang sesuai dengan filter atau pencarian.
    </div>
  </section>
</template>
