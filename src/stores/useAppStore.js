import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { calculateMachineStages } from '../utils/needleSolver.js';
import { THREAD_METADATA, DEFAULT_COLOR_MAP, getThreadColor } from '../utils/colorPalette.js';
import { SAMPLE_DATA } from './useTrialStore.js';
import { SAMPLE_FLOPPIES } from './useFloppyStore.js';
import { SAMPLE_INVENTORY } from './useInventoryStore.js';

export const useAppStore = defineStore('app', () => {
  // 1. Navigation & UI State
  const storedMod = typeof localStorage !== 'undefined' ? localStorage.getItem('embro_active_module') : null;
  const activeModule = ref(storedMod && ['cmt', 'trial', 'floppy', 'schedule', 'inventory', 'archives'].includes(storedMod) ? storedMod : 'cmt');
  const isSidebarOpen = ref(false);

  // Tab State
  const activeTab = ref('operator'); // 'operator' | 'rack' (for Trial)
  const cmtSubTab = ref('cmt'); // 'cmt' | 'colors' (for Data CMT)

  // 2. Machine & Needle Config
  const needleCapacity = ref(Number(localStorage.getItem('embro_needle_capacity')) || 11);
  const swapNeedle = ref(Number(localStorage.getItem('embro_swap_needle')) || 11);

  // 3. CMT & Order Data
  const loadStored = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  };

  const cmts = ref(loadStored('embro_active_cmts', []));
  const completedMap = ref(loadStored('embro_completed_map', {}));
  const accMap = ref(loadStored('embro_acc_map', {}));
  const colorMap = ref(loadStored('embro_custom_colors', {}));

  // Form State for CMT Input
  const newCmt = ref('');
  const newFlopy = ref('');
  const variantRows = ref([{ variant: '', options: [''] }]);

  // 4. Floppy, Inventory & Archive Data
  const floppyList = ref(loadStored('embro_floppy_list', []));
  const inventoryList = ref(loadStored('embro_inventory_list', []));
  const savedSessions = ref(loadStored('embro_saved_sessions', []));
  const sessionNote = ref('');
  const isSnapshotOpen = ref(true);
  const activeSessionId = ref(null);
  const activeSessionName = ref('');

  // 5. Cloud Room & Sync State
  const DEFAULT_FIREBASE_URL = 'https://embro-1e285-default-rtdb.asia-southeast1.firebasedatabase.app/';
  const currentRoomCode = ref(localStorage.getItem('embro_room_code') || 'EMBRO');
  const firebaseUrl = ref(localStorage.getItem('embro_firebase_url') || DEFAULT_FIREBASE_URL);
  const isSyncConnected = ref(false);
  const isFirebaseConnected = ref(false);
  let isRemoteUpdating = false;
  let broadcastChannel = null;

  // 6. Modal & Toast Notifications
  const toastMessage = ref('');
  let toastTimer = null;

  const showToast = (msg, duration = 3000) => {
    toastMessage.value = msg;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastMessage.value = '';
    }, duration);
  };

  const confirmModalState = ref({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Lanjutkan',
    cancelText: 'Batal',
    type: 'confirm',
    resolve: null,
  });

  const showConfirm = ({ title, message, confirmText = 'Lanjutkan', cancelText = 'Batal', type = 'confirm' }) => {
    return new Promise((resolve) => {
      confirmModalState.value = {
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText,
        type,
        resolve,
      };
    });
  };

  const handleConfirmResult = (result) => {
    if (confirmModalState.value.resolve) {
      confirmModalState.value.resolve(result);
    }
    confirmModalState.value.isOpen = false;
  };

  const isCloudSettingsOpen = ref(false);
  const tempRoomCode = ref('');
  const tempFirebaseUrl = ref('');

  const openCloudSettingsModal = () => {
    tempRoomCode.value = currentRoomCode.value;
    tempFirebaseUrl.value = firebaseUrl.value;
    isCloudSettingsOpen.value = true;
  };

  const saveCloudSettings = () => {
    const r = (tempRoomCode.value || '').trim().toUpperCase() || 'EMBRO';
    const u = (tempFirebaseUrl.value || '').trim() || DEFAULT_FIREBASE_URL;
    currentRoomCode.value = r;
    firebaseUrl.value = u;
    localStorage.setItem('embro_room_code', r);
    localStorage.setItem('embro_firebase_url', u);
    isCloudSettingsOpen.value = false;
    showToast(`Terhubung ke ruangan cloud: ${r}`);
  };

  // Master Floppy Modal
  const isFloppyModalOpen = ref(false);
  const isEditingFloppy = ref(false);
  const floppyForm = ref({
    id: '',
    name: '',
    garment: '',
    quantity: 1200,
    screenshot: '',
    notes: '',
    components: [{ name: '', stitch: 0, threadMeters: 0 }],
  });
  const previewScreenshotUrl = ref(null);

  // 7. Persistence Watchers
  watch(activeModule, (val) => localStorage.setItem('embro_active_module', val));
  watch(activeTab, (val) => localStorage.setItem('embro_active_tab', val));
  watch(needleCapacity, (val) => {
    localStorage.setItem('embro_needle_capacity', String(val));
    if (swapNeedle.value > val) swapNeedle.value = val;
  });
  watch(swapNeedle, (val) => localStorage.setItem('embro_swap_needle', String(val)));
  watch(cmts, (val) => {
    localStorage.setItem('embro_active_cmts', JSON.stringify(val));
    syncBroadcast();
  }, { deep: true });
  watch(completedMap, (val) => {
    localStorage.setItem('embro_completed_map', JSON.stringify(val));
    syncBroadcast();
  }, { deep: true });
  watch(accMap, (val) => {
    localStorage.setItem('embro_acc_map', JSON.stringify(val));
    syncBroadcast();
  }, { deep: true });
  watch(colorMap, (val) => {
    localStorage.setItem('embro_custom_colors', JSON.stringify(val));
    syncBroadcast();
  }, { deep: true });
  watch(floppyList, (val) => localStorage.setItem('embro_floppy_list', JSON.stringify(val)), { deep: true });
  watch(inventoryList, (val) => localStorage.setItem('embro_inventory_list', JSON.stringify(val)), { deep: true });
  watch(savedSessions, (val) => localStorage.setItem('embro_saved_sessions', JSON.stringify(val)), { deep: true });

  // BroadcastChannel Sync (Same browser tabs)
  const initBroadcast = () => {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        broadcastChannel = new BroadcastChannel(`embro_sync_${currentRoomCode.value}`);
        broadcastChannel.onmessage = (event) => {
          if (event.data && event.data.type === 'SYNC_STATE') {
            isRemoteUpdating = true;
            if (event.data.cmts) cmts.value = event.data.cmts;
            if (event.data.completedMap) completedMap.value = event.data.completedMap;
            if (event.data.accMap) accMap.value = event.data.accMap;
            if (event.data.colorMap) colorMap.value = event.data.colorMap;
            isRemoteUpdating = false;
          }
        };
        isSyncConnected.value = true;
      } catch (e) {
        console.warn('BroadcastChannel not supported', e);
      }
    }
  };
  initBroadcast();

  const syncBroadcast = () => {
    if (isRemoteUpdating || !broadcastChannel) return;
    broadcastChannel.postMessage({
      type: 'SYNC_STATE',
      cmts: cmts.value,
      completedMap: completedMap.value,
      accMap: accMap.value,
      colorMap: colorMap.value,
    });
  };

  // 8. Calculations & Solver
  const calculation = computed(() => {
    return calculateMachineStages(cmts.value, needleCapacity.value, swapNeedle.value);
  });

  const totalCmtCount = computed(() => cmts.value.length);
  const uniqueTotalCmts = computed(() => {
    const set = new Set();
    cmts.value.forEach((item) => {
      if (item && item.cmt) set.add(String(item.cmt).trim());
    });
    return set.size;
  });

  const completedCount = computed(() => {
    let count = 0;
    cmts.value.forEach((item) => {
      const key = `${item.flopy ? item.flopy + '_' : ''}${item.cmt}_${item.variant || '-'}`;
      const keyLegacy = `${item.cmt}_${item.variant || '-'}`;
      if (completedMap.value[key] || completedMap.value[keyLegacy]) count++;
    });
    return count;
  });

  const progressPercent = computed(() => {
    if (totalCmtCount.value === 0) return 0;
    return Math.round((completedCount.value / totalCmtCount.value) * 100);
  });

  const accCount = computed(() => {
    let count = 0;
    Object.values(accMap.value).forEach((val) => {
      if (typeof val === 'object') {
        const hasTrue = Object.values(val).some(Boolean);
        if (hasTrue) count++;
      } else if (val) {
        count++;
      }
    });
    return count;
  });

  const needleList = computed(() => {
    const list = [];
    const mapping = calculation.value.stage1NeedleUsage || {};
    const primarySwap = calculation.value.primarySwap || swapNeedle.value;

    for (let i = 1; i <= needleCapacity.value; i++) {
      const rawCode = mapping[i] || '';
      const meta = THREAD_METADATA[rawCode];
      list.push({
        num: i,
        isSwap: i === primarySwap,
        rawCode,
        colorName: meta ? meta.name : '',
      });
    }
    return list;
  });

  const activeColorMap = computed(() => {
    return { ...DEFAULT_COLOR_MAP, ...colorMap.value };
  });

  const currentDateString = computed(() => {
    const d = new Date();
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  });

  // Grouped CMTs for display
  const groupedCmts = computed(() => {
    const groups = [];
    const map = new Map();

    cmts.value.forEach((item, index) => {
      const cmtKey = String(item.cmt).trim();
      if (!map.has(cmtKey)) {
        const group = {
          cmt: cmtKey,
          flopy: item.flopy || '',
          variants: [],
          firstIndex: index,
        };
        map.set(cmtKey, group);
        groups.push(group);
      }
      map.get(cmtKey).variants.push({
        variant: item.variant || '-',
        threads: item.threads || [],
        itemRef: item,
        originalIndex: index,
      });
    });

    return groups;
  });

  // Master Floppy Stats
  const floppyListWithStats = computed(() => {
    return (floppyList.value || []).map((f) => {
      let totalStitches = 0;
      let totalMeters = 0;
      (f.components || []).forEach((c) => {
        totalStitches += Number(c.stitch) || 0;
        totalMeters += Number(c.threadMeters) || 0;
      });
      return {
        ...f,
        totalStitches,
        totalMeters,
      };
    });
  });

  // Inventory Stats & Filter
  const inventoryCounts = computed(() => {
    const list = inventoryList.value || [];
    let alertCount = 0;
    list.forEach((item) => {
      if ((item.cones || 0) <= (item.minStock || 0)) alertCount++;
    });
    return {
      total: list.length,
      alertCount,
    };
  });

  // 9. Methods: CMT & Variant Form
  const getVariantPlaceholder = (index) => {
    const baseNames = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'];
    return baseNames[index] || `C${index + 1}`;
  };

  const addOptionToRow = (rIdx) => {
    if (variantRows.value[rIdx]) {
      if (!Array.isArray(variantRows.value[rIdx].options)) {
        variantRows.value[rIdx].options = [];
      }
      if (variantRows.value[rIdx].options.length === 0) {
        variantRows.value[rIdx].options = ['', ''];
      } else {
        variantRows.value[rIdx].options.push('');
      }
    }
  };

  const removeOptionFromRow = (rIdx, optIdx) => {
    if (variantRows.value[rIdx] && Array.isArray(variantRows.value[rIdx].options)) {
      variantRows.value[rIdx].options.splice(optIdx, 1);
    }
  };

  const resetRowToSingleOption = (rIdx) => {
    if (variantRows.value[rIdx]) {
      const firstOpt = (variantRows.value[rIdx].options && variantRows.value[rIdx].options[0]) || '';
      variantRows.value[rIdx].options = [firstOpt];
    }
  };

  const addVariantRow = () => {
    if (variantRows.value.length === 1 && !variantRows.value[0].variant.trim()) {
      variantRows.value[0].variant = 'C1';
    }
    const nextName = getVariantPlaceholder(variantRows.value.length);
    variantRows.value.push({ variant: nextName, options: [''] });
  };

  const removeVariantRow = (index) => {
    if (variantRows.value.length > 1) {
      variantRows.value.splice(index, 1);
    }
  };

  const resetCmtForm = () => {
    newCmt.value = '';
    newFlopy.value = '';
    variantRows.value = [{ variant: '', options: [''] }];
  };

  const addCMT = () => {
    const cmtNum = (newCmt.value || '').trim();
    if (!cmtNum) {
      showToast('Harap masukkan nomor CMT terlebih dahulu!');
      return;
    }

    const rowsToInsert = [];
    variantRows.value.forEach((row, rIdx) => {
      const varName = (row.variant || '').trim() || (variantRows.value.length > 1 ? `C${rIdx + 1}` : '-');
      const validOptions = [];

      (row.options || []).forEach((optStr) => {
        const raw = (optStr || '').toString().trim();
        if (raw) {
          const codes = raw.split(/[\s,;]+/).map((s) => s.trim()).filter(Boolean);
          if (codes.length > 0) validOptions.push(codes);
        }
      });

      if (validOptions.length > 0) {
        const primaryThreads = validOptions[0];
        const itemObj = {
          cmt: cmtNum,
          flopy: (newFlopy.value || '').trim(),
          variant: varName,
          threads: primaryThreads,
          threadOptions: validOptions,
          key: `${(newFlopy.value || '').trim() ? (newFlopy.value || '').trim() + '_' : ''}${cmtNum}_${varName}`,
        };
        rowsToInsert.push(itemObj);
      }
    });

    if (rowsToInsert.length === 0) {
      showToast('Harap isi minimal 1 kode benang untuk variasi!');
      return;
    }

    rowsToInsert.forEach((item) => cmts.value.push(item));
    resetCmtForm();
    showToast(`✓ CMT ${cmtNum} berhasil disimpan (${rowsToInsert.length} variasi)!`);
  };

  const removeCMTGroup = async (group) => {
    const ok = await showConfirm({
      title: 'Hapus Seluruh CMT',
      message: `Hapus seluruh data CMT ${group.cmt} (${group.variants.length} variasi)?`,
      confirmText: 'Hapus CMT',
      cancelText: 'Batal',
      type: 'danger',
    });
    if (ok) {
      const cmtKey = String(group.cmt).trim();
      cmts.value = cmts.value.filter((item) => String(item.cmt).trim() !== cmtKey);
      showToast(`CMT ${group.cmt} telah dihapus.`);
    }
  };

  const removeCMTVariant = (itemRef) => {
    const idx = cmts.value.indexOf(itemRef);
    if (idx !== -1) {
      cmts.value.splice(idx, 1);
      showToast(`Variasi telah dihapus.`);
    }
  };

  const clearAllCMTs = async () => {
    const ok = await showConfirm({
      title: 'Kosongkan Seluruh CMT',
      message: 'Apakah Anda yakin ingin menghapus semua daftar CMT aktif saat ini?',
      confirmText: 'Kosongkan Semua',
      cancelText: 'Batal',
      type: 'danger',
    });
    if (ok) {
      cmts.value = [];
      completedMap.value = {};
      accMap.value = {};
      showToast('Seluruh daftar CMT berhasil dikosongkan.');
    }
  };

  // 10. ACC Logic (Isolation per item & option)
  const getItemKey = (item) => {
    if (!item) return '';
    if (item.key) return item.key;
    return `${item.flopy ? item.flopy + '_' : ''}${item.cmt}_${item.variant || '-'}`;
  };

  const hasItemCombinationOptions = (item) => {
    if (!item) return false;
    return Array.isArray(item.threadOptions) && item.threadOptions.length > 0;
  };

  const isOptionAcc = (item, optIdx) => {
    if (!item) return false;
    const key = getItemKey(item);
    const itemAcc = accMap.value[key];
    if (!itemAcc || typeof itemAcc !== 'object') return false;
    return !!itemAcc[`opt_${optIdx}`];
  };

  const toggleOptionAcc = (item, optIdx) => {
    if (!item) return;
    const key = getItemKey(item);
    if (!accMap.value[key] || typeof accMap.value[key] !== 'object') {
      accMap.value[key] = {};
    }
    const optKey = `opt_${optIdx}`;
    const current = !!accMap.value[key][optKey];
    if (current) {
      delete accMap.value[key][optKey];
    } else {
      accMap.value[key][optKey] = true;
    }
    accMap.value = { ...accMap.value };
  };

  const isThreadAcc = (item, th) => {
    if (!item || !th) return false;
    const key = getItemKey(item);
    const itemAcc = accMap.value[key];
    if (!itemAcc || typeof itemAcc !== 'object') return false;
    return !!itemAcc[th];
  };

  const toggleThreadAcc = (item, th) => {
    if (!item || !th) return;
    const key = getItemKey(item);
    if (!accMap.value[key] || typeof accMap.value[key] !== 'object') {
      accMap.value[key] = {};
    }
    accMap.value[key][th] = !accMap.value[key][th];
    accMap.value = { ...accMap.value };
  };

  const isItemCompleted = (item) => {
    if (!item) return false;
    const key = getItemKey(item);
    return !!completedMap.value[key];
  };

  const toggleItemComplete = (item) => {
    if (!item) return;
    const key = getItemKey(item);
    if (completedMap.value[key]) {
      delete completedMap.value[key];
    } else {
      completedMap.value[key] = true;
    }
    completedMap.value = { ...completedMap.value };
  };

  const confirmResetCompleted = async () => {
    const ok = await showConfirm({
      title: 'Reset Ceklis Variasi',
      message: 'Reset semua status pengerjaan variasi menjadi belum selesai?',
      confirmText: 'Reset',
      cancelText: 'Batal',
    });
    if (ok) {
      completedMap.value = {};
      showToast('Semua status pengerjaan telah direset.');
    }
  };

  const getStageState = (stage, idx) => {
    const items = stage.items || [];
    if (items.length === 0) return 'upcoming';
    const allDone = items.every((it) => isItemCompleted(it));
    if (allDone) return 'completed';
    return 'active';
  };

  const isStageCompleted = (stage) => {
    const items = stage.items || [];
    return items.length > 0 && items.every((it) => isItemCompleted(it));
  };

  // 11. Needle Controls
  const decrementCapacity = () => {
    if (needleCapacity.value > 2) needleCapacity.value--;
  };

  const incrementCapacity = () => {
    if (needleCapacity.value < 24) needleCapacity.value++;
  };

  const resetColors = () => {
    colorMap.value = {};
    showToast('Warna telah direset ke standar Star Elephant.');
  };

  // 12. Sessions & Samples
  const saveCurrentSession = () => {
    const name = (sessionNote.value || '').trim() || `Sesi ${currentDateString.value}`;
    const payload = {
      id: 'sess_' + Date.now(),
      name,
      date: new Date().toISOString(),
      cmts: JSON.parse(JSON.stringify(cmts.value)),
      needleCapacity: needleCapacity.value,
      swapNeedle: swapNeedle.value,
      completedMap: JSON.parse(JSON.stringify(completedMap.value)),
      accMap: JSON.parse(JSON.stringify(accMap.value)),
    };
    savedSessions.value.unshift(payload);
    sessionNote.value = '';
    showToast(`✓ Sesi "${name}" berhasil diarsipkan!`);
  };

  const activateSession = (sess) => {
    if (!sess) return;
    cmts.value = JSON.parse(JSON.stringify(sess.cmts || []));
    if (sess.needleCapacity) needleCapacity.value = sess.needleCapacity;
    if (sess.swapNeedle) swapNeedle.value = sess.swapNeedle;
    if (sess.completedMap) completedMap.value = JSON.parse(JSON.stringify(sess.completedMap));
    if (sess.accMap) accMap.value = JSON.parse(JSON.stringify(sess.accMap));
    activeSessionId.value = sess.id;
    activeSessionName.value = sess.name;
    showToast(`Sesi "${sess.name}" kini aktif.`);
  };

  const deleteSession = async (idx) => {
    const sess = savedSessions.value[idx];
    if (!sess) return;
    const ok = await showConfirm({
      title: 'Hapus Arsip Sesi',
      message: `Hapus arsip "${sess.name}"?`,
      confirmText: 'Hapus',
      cancelText: 'Batal',
      type: 'danger',
    });
    if (ok) {
      savedSessions.value.splice(idx, 1);
      showToast('Arsip sesi telah dihapus.');
    }
  };

  const loadSampleData = async () => {
    if (cmts.value.length > 0) {
      const ok = await showConfirm({
        title: 'Muat Data Sampel',
        message: 'Memuat data sampel akan menimpa daftar CMT aktif saat ini. Lanjutkan?',
        confirmText: 'Timpa Data',
        cancelText: 'Batal',
        type: 'danger',
      });
      if (!ok) return;
    }
    cmts.value = JSON.parse(JSON.stringify(SAMPLE_DATA));
    if (!floppyList.value || floppyList.value.length === 0) {
      floppyList.value = JSON.parse(JSON.stringify(SAMPLE_FLOPPIES));
    }
    needleCapacity.value = 11;
    swapNeedle.value = 11;
    completedMap.value = {};
    accMap.value = {};
    activeSessionName.value = 'Data Sampel Bawaan';
    showToast('Data sampel bawaan pabrik berhasil dimuat.');
  };

  const copyCurrentActiveShareLink = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url);
    showToast('Sharelink sesi berhasil disalin ke clipboard!');
  };

  const copySessionLink = (sess) => {
    const url = window.location.origin + window.location.pathname + '?session=' + sess.id;
    navigator.clipboard?.writeText(url);
    showToast(`Sharelink sesi "${sess.name}" berhasil disalin!`);
  };

  // 13. Floppy Actions
  const openAddFloppyModal = () => {
    isEditingFloppy.value = false;
    floppyForm.value = {
      id: 'fl_' + Date.now(),
      name: '',
      garment: '',
      quantity: 1200,
      screenshot: '',
      notes: '',
      components: [{ name: '', stitch: 0, threadMeters: 0 }],
    };
    isFloppyModalOpen.value = true;
  };

  const openEditFloppyModal = (fl) => {
    isEditingFloppy.value = true;
    floppyForm.value = JSON.parse(JSON.stringify(fl));
    isFloppyModalOpen.value = true;
  };

  const saveFloppy = () => {
    const name = (floppyForm.value.name || '').trim();
    if (!name) {
      showToast('Nama Floppy wajib diisi!');
      return;
    }
    if (isEditingFloppy.value) {
      const idx = floppyList.value.findIndex((f) => f.id === floppyForm.value.id);
      if (idx !== -1) floppyList.value[idx] = { ...floppyForm.value };
      showToast(`Floppy "${name}" berhasil diperbarui!`);
    } else {
      floppyList.value.push({ ...floppyForm.value });
      showToast(`Floppy "${name}" berhasil ditambahkan!`);
    }
    isFloppyModalOpen.value = false;
  };

  const deleteFloppy = async (fl) => {
    const ok = await showConfirm({
      title: 'Hapus Floppy',
      message: `Hapus master Floppy "${fl.name}"?`,
      confirmText: 'Hapus',
      cancelText: 'Batal',
      type: 'danger',
    });
    if (ok) {
      floppyList.value = floppyList.value.filter((f) => f.id !== fl.id);
      showToast(`Floppy "${fl.name}" telah dihapus.`);
    }
  };

  const clearAllFloppies = async () => {
    const ok = await showConfirm({
      title: 'Kosongkan Master Floppy',
      message: 'Hapus seluruh data floppy yang tersimpan?',
      confirmText: 'Kosongkan',
      cancelText: 'Batal',
      type: 'danger',
    });
    if (ok) {
      floppyList.value = [];
      showToast('Seluruh master floppy berhasil dikosongkan.');
    }
  };

  const createCmtFromFloppy = (fl) => {
    newFlopy.value = fl.name;
    activeModule.value = 'cmt';
    cmtSubTab.value = 'cmt';
    showToast(`Floppy "${fl.name}" dipilih. Silakan masukkan nomor CMT.`);
  };

  const openScreenshotPreview = (imgUrl) => {
    previewScreenshotUrl.value = imgUrl;
  };

  const closeScreenshotPreview = () => {
    previewScreenshotUrl.value = null;
  };

  const printWorksheet = () => {
    window.print();
  };

  return {
    // Nav & Tabs
    activeModule,
    isSidebarOpen,
    activeTab,
    cmtSubTab,

    // Machine & Needle
    needleCapacity,
    swapNeedle,
    decrementCapacity,
    incrementCapacity,
    calculation,
    needleList,

    // CMT & Form
    cmts,
    newCmt,
    newFlopy,
    variantRows,
    getVariantPlaceholder,
    addVariantRow,
    removeVariantRow,
    addOptionToRow,
    removeOptionFromRow,
    resetRowToSingleOption,
    addCMT,
    resetCmtForm,
    removeCMTGroup,
    removeCMTVariant,
    clearAllCMTs,
    groupedCmts,
    uniqueTotalCmts,
    totalCmtCount,

    // ACC & Progress
    completedMap,
    accMap,
    completedCount,
    progressPercent,
    accCount,
    getItemKey,
    hasItemCombinationOptions,
    isOptionAcc,
    toggleOptionAcc,
    isThreadAcc,
    toggleThreadAcc,
    isItemCompleted,
    toggleItemComplete,
    confirmResetCompleted,
    getStageState,
    isStageCompleted,

    // Color & Palette
    colorMap,
    activeColorMap,
    resetColors,
    getThreadColor,
    THREAD_METADATA,

    // Floppy
    floppyList,
    floppyListWithStats,
    isFloppyModalOpen,
    isEditingFloppy,
    floppyForm,
    openAddFloppyModal,
    openEditFloppyModal,
    saveFloppy,
    deleteFloppy,
    clearAllFloppies,
    createCmtFromFloppy,
    previewScreenshotUrl,
    openScreenshotPreview,
    closeScreenshotPreview,

    // Inventory
    inventoryList,
    inventoryCounts,

    // Sessions & Archives
    savedSessions,
    sessionNote,
    isSnapshotOpen,
    activeSessionId,
    activeSessionName,
    saveCurrentSession,
    activateSession,
    deleteSession,
    loadSampleData,
    copyCurrentActiveShareLink,
    copySessionLink,
    currentDateString,

    // Cloud & Sync
    currentRoomCode,
    firebaseUrl,
    isSyncConnected,
    isCloudSettingsOpen,
    tempRoomCode,
    tempFirebaseUrl,
    openCloudSettingsModal,
    saveCloudSettings,

    // Modals & Toasts
    toastMessage,
    showToast,
    confirmModalState,
    showConfirm,
    handleConfirmResult,
    printWorksheet,
  };
});
