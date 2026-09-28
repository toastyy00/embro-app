import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { calculateMachineStages } from '../utils/needleSolver.js';
import { useToastStore } from './useToastStore.js';

export const SAMPLE_DATA = [
  { flopy: 'Flopy B', cmt: '617', variant: '-', threads: ['1179', '1164', '1319'] },
  { flopy: 'Flopy B', cmt: '618', variant: '-', threads: ['2216', '1184', '1135'] },
  { flopy: 'Flopy B', cmt: '619', variant: 'C1 (Navy)', threads: ['1319', '1070', '1320', '1175'] },
  { flopy: 'Flopy B', cmt: '620', variant: 'C2 (Maroon)', threads: ['1304', '2216', '1135', '1304'] },
  { flopy: 'Flopy B', cmt: '620', variant: 'C3 (Beige)', threads: ['1144', '2216', '2216', '1320'] },
  { flopy: 'Flopy B', cmt: '614', variant: '-', threads: ['2216', '1135', '1144', '1184'] },
  { flopy: 'Flopy B', cmt: '613', variant: '-', threads: ['1179', '1320', '1319', '1174'] },
  { flopy: 'Flopy B', cmt: '619', variant: 'C4 (Grey)', threads: ['1319', '1320', '1175', '1174'] },
  { flopy: 'Flopy B', cmt: '619', variant: 'C2 (Coklat)', threads: ['1144', '2212', '2216'] },
  { flopy: 'Flopy B', cmt: '619', variant: 'C3 (Maroon)', threads: ['1304', '2212', '2216', '1144'] },
  { flopy: 'Flopy B', cmt: '620', variant: 'C1 (Navy)', threads: ['1070', '1323', '1319', '1320'] },
  { flopy: 'Flopy C', cmt: '657', variant: 'C1 Navy', threads: ['1178', '1172', '7723'] },
];

export const useTrialStore = defineStore('trial', () => {
  const toast = useToastStore();

  // Load Initial Local Storage
  const loadStored = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  };

  const needleCapacity = ref(Number(localStorage.getItem('needle_cap')) || 11);
  const swapNeedle = ref(Number(localStorage.getItem('needle_swap')) || 11);
  const cmts = ref(loadStored('cmts', []));
  const completedMap = ref(loadStored('completed_cmts', {}));
  const accMap = ref(loadStored('embro_acc_map', {}));
  const colorMap = ref(loadStored('embro_custom_colors', {}));
  const activeStageIndex = ref(0);

  // Watchers to persist state
  watch(needleCapacity, (v) => localStorage.setItem('needle_cap', String(v)));
  watch(swapNeedle, (v) => localStorage.setItem('needle_swap', String(v)));
  watch(cmts, (v) => localStorage.setItem('cmts', JSON.stringify(v)), { deep: true });
  watch(completedMap, (v) => localStorage.setItem('completed_cmts', JSON.stringify(v)), { deep: true });
  watch(accMap, (v) => localStorage.setItem('embro_acc_map', JSON.stringify(v)), { deep: true });
  watch(colorMap, (v) => localStorage.setItem('embro_custom_colors', JSON.stringify(v)), { deep: true });

  // Core Algoritma Perhitungan Jarum
  const calculation = computed(() => {
    return calculateMachineStages(cmts.value, needleCapacity.value, swapNeedle.value);
  });

  const stages = computed(() => calculation.value.stagesList || []);

  // Manajemen ACC
  const getAccThreads = (keyOrItem) => {
    if (!keyOrItem) return [];
    const key = typeof keyOrItem === 'string' ? keyOrItem : (keyOrItem.key || `${keyOrItem.flopy ? keyOrItem.flopy + '_' : ''}${keyOrItem.cmt}_${keyOrItem.variant || '-'}`);
    let val = accMap.value[key];

    if (!val && typeof keyOrItem === 'object') {
      const keyLegacy = `${keyOrItem.cmt}_${keyOrItem.variant || '-'}`;
      val = accMap.value[keyLegacy];
    }

    if (!val) return [];

    if (typeof val === 'object') {
      const keys = Object.keys(val).filter((k) => !!val[k]);
      const result = [];
      keys.forEach((k) => {
        if (k.startsWith('opt_')) {
          const optIdx = parseInt(k.replace('opt_', ''), 10);
          if (typeof keyOrItem === 'object' && Array.isArray(keyOrItem.threadOptions) && keyOrItem.threadOptions[optIdx]) {
            const optThreads = keyOrItem.threadOptions[optIdx];
            (Array.isArray(optThreads) ? optThreads : [optThreads]).forEach((t) => {
              const c = String(t).trim();
              if (c && !result.includes(c)) result.push(c);
            });
          } else if (typeof keyOrItem === 'object' && Array.isArray(keyOrItem.combinationOptions) && keyOrItem.combinationOptions[optIdx]) {
            const optObj = keyOrItem.combinationOptions[optIdx];
            (optObj.threads || []).forEach((th) => {
              const c = String(th.code || th).trim();
              if (c && !result.includes(c)) result.push(c);
            });
          } else {
            result.push(k);
          }
        } else {
          if (!result.includes(k)) result.push(k);
        }
      });
      return result;
    }

    if (val === true) {
      if (typeof keyOrItem === 'object' && Array.isArray(keyOrItem.threads) && keyOrItem.threads.length > 0) {
        return keyOrItem.threads;
      }
      return ['ACC'];
    }

    return [];
  };

  const isThreadAcc = (keyOrItem, threadCode) => {
    if (!threadCode) return false;
    const approvedList = getAccThreads(keyOrItem);
    return approvedList.includes(String(threadCode).trim());
  };

  const isAcc = (keyOrItem) => {
    return getAccThreads(keyOrItem).length > 0;
  };

  const toggleThreadAcc = (item, threadCode) => {
    if (!item || !threadCode) return;
    const key = item.key || `${item.flopy ? item.flopy + '_' : ''}${item.cmt}_${item.variant || '-'}`;
    const th = String(threadCode).trim();
    if (!accMap.value[key] || typeof accMap.value[key] !== 'object') {
      accMap.value[key] = {};
    }
    const isCurrentlyAcc = !!accMap.value[key][th];
    if (isCurrentlyAcc) {
      delete accMap.value[key][th];
      if (Object.keys(accMap.value[key]).length === 0) {
        delete accMap.value[key];
      }
      toast.showToast(`Batal ACC benang ${th} untuk CMT ${item.cmt}`);
    } else {
      accMap.value[key][th] = true;
      const varTxt = item.variant && item.variant !== '-' ? ` (${item.variant})` : '';
      toast.showToast(`Benang ${th} di-ACC untuk CMT ${item.cmt}${varTxt}`);
    }
  };

  const isOptionAcc = (item, optOrIdx) => {
    if (!item || optOrIdx === undefined || optOrIdx === null) return false;
    const optIdx = typeof optOrIdx === 'object' ? optOrIdx.optIdx : optOrIdx;
    const key = item.key || `${item.flopy ? item.flopy + '_' : ''}${item.cmt}_${item.variant || '-'}`;
    const map = accMap.value[key];
    if (!map || typeof map !== 'object') return false;
    return !!map[`opt_${optIdx}`];
  };

  const toggleOptionAcc = (item, optOrIdx) => {
    if (!item || optOrIdx === undefined || optOrIdx === null) return;
    const optIdx = typeof optOrIdx === 'object' ? optOrIdx.optIdx : optOrIdx;
    const key = item.key || `${item.flopy ? item.flopy + '_' : ''}${item.cmt}_${item.variant || '-'}`;
    if (!accMap.value[key] || typeof accMap.value[key] !== 'object') {
      accMap.value[key] = {};
    }
    const optKey = `opt_${optIdx}`;
    const isCurrentlyAcc = !!accMap.value[key][optKey];

    let threadLabels = '';
    if (typeof optOrIdx === 'object' && Array.isArray(optOrIdx.threads)) {
      threadLabels = optOrIdx.threads.map((t) => t.code || t).join(' ');
    } else if (Array.isArray(item.threadOptions) && item.threadOptions[optIdx]) {
      const ths = item.threadOptions[optIdx];
      threadLabels = (Array.isArray(ths) ? ths : [ths]).join(' ');
    }

    if (isCurrentlyAcc) {
      delete accMap.value[key][optKey];
      if (Object.keys(accMap.value[key]).length === 0) {
        delete accMap.value[key];
      }
      toast.showToast(`Batal ACC [${threadLabels}] untuk CMT ${item.cmt}`);
    } else {
      Object.keys(accMap.value[key]).forEach((k) => {
        delete accMap.value[key][k];
      });
      accMap.value[key][optKey] = true;
      const varTxt = item.variant && item.variant !== '-' ? ` (${item.variant})` : '';
      toast.showToast(`✓ ACC [${threadLabels}] untuk CMT ${item.cmt}${varTxt}`);
    }
  };

  const hasItemCombinationOptions = (item) => {
    if (!item || !Array.isArray(item.threadOptions)) return false;
    const rawOpts = item.threadOptions;
    return (
      (item.isCombination && rawOpts.some((opt) => Array.isArray(opt) && opt.length >= 2)) ||
      (rawOpts.length > 1 && rawOpts.some((opt) => Array.isArray(opt) && opt.length >= 2))
    );
  };

  const toggleComplete = (key) => {
    completedMap.value[key] = !completedMap.value[key];
  };

  const isCompleted = (key) => !!completedMap.value[key];

  function clearAllCmts() {
    if (!confirm('Kosongkan semua daftar variasi CMT bordir?')) return;
    cmts.value = [];
    completedMap.value = {};
    accMap.value = {};
    toast.showToast('Semua variasi CMT berhasil dikosongkan.');
  }

  function loadSample() {
    cmts.value = JSON.parse(JSON.stringify(SAMPLE_DATA));
    toast.showToast('Data sampel CMT bordir berhasil dimuat.');
  }

  return {
    needleCapacity,
    swapNeedle,
    cmts,
    completedMap,
    accMap,
    colorMap,
    activeStageIndex,
    calculation,
    stages,
    getAccThreads,
    isThreadAcc,
    isAcc,
    toggleThreadAcc,
    isOptionAcc,
    toggleOptionAcc,
    hasItemCombinationOptions,
    toggleComplete,
    isCompleted,
    clearAllCmts,
    loadSample,
  };
});
