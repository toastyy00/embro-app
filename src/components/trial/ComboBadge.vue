<script setup>
import { getThreadColor } from '../../utils/colorPalette.js';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  option: {
    type: Object,
    required: true,
  },
  isAcc: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['toggle-acc']);
</script>

<template>
  <div
    @click.stop="$emit('toggle-acc', item, option)"
    :title="isAcc ? 'Klik untuk membatalkan ACC opsi ini' : 'Klik untuk menyetujui (ACC) opsi ini'"
    class="inline-flex items-stretch rounded-md overflow-hidden border shadow-sm cursor-pointer select-none transition-all active:scale-95 text-left group print:border-black"
    :class="isAcc
      ? 'border-emerald-500 bg-emerald-950/20 ring-2 ring-emerald-500/50 shadow-md shadow-emerald-500/10'
      : 'border-zinc-750 bg-zinc-900/90 hover:border-zinc-500 hover:bg-zinc-850'"
  >
    <!-- Indikator Checkmark Hijau jika Opsi ini Terpilih / di-ACC -->
    <div
      v-if="isAcc"
      class="px-2 py-0.5 bg-emerald-500 text-zinc-950 flex items-center justify-center border-r border-emerald-400"
      title="Opsi kombinasi ini telah di-ACC"
    >
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>

    <template v-for="(th, tIdx) in option.threads" :key="tIdx">
      <!-- Divider || antara benang dalam 1 opsi kombinasi -->
      <div
        v-if="tIdx > 0"
        class="w-2.5 bg-zinc-950 flex items-center justify-center border-x border-zinc-700/80 select-none shrink-0"
        title="Kombinasi benang dalam 1 opsi"
      >
        <div class="flex items-center gap-[2px]">
          <span class="w-[1px] h-3.5 bg-zinc-500 rounded-full"></span>
          <span class="w-[1px] h-3.5 bg-zinc-500 rounded-full"></span>
        </div>
      </div>

      <!-- Segment Benang: Jarum + Kode Benang -->
      <div class="inline-flex items-stretch">
        <!-- Needle Segment -->
        <div
          v-if="th.needle"
          class="px-2 py-0.5 font-bold tracking-tight border-r flex items-center justify-center text-[11px] font-mono shrink-0 transition-colors"
          :class="isAcc
            ? 'bg-zinc-800 text-emerald-300 border-zinc-700 font-extrabold'
            : 'bg-zinc-850 border-zinc-750 text-zinc-200 group-hover:bg-zinc-800'"
        >
          {{ th.needle }}
        </div>

        <!-- Thread Code & Swatch -->
        <div
          class="px-2.5 py-0.5 flex items-center gap-1.5 text-[11px] font-mono shrink-0 transition-colors"
          :class="isAcc ? 'text-white font-bold' : 'text-zinc-300 group-hover:text-white'"
        >
          <span
            class="w-2.5 h-2.5 rounded-full border border-white/20 shadow-sm shrink-0"
            :style="{ backgroundColor: getThreadColor(th.code || th) }"
          ></span>
          <span class="font-medium">{{ th.code || th }}</span>
        </div>
      </div>
    </template>
  </div>
</template>
