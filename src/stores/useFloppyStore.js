import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useToastStore } from './useToastStore.js';
import { compressImageBase64 } from '../utils/imageCompressor.js';

export const SAMPLE_FLOPPIES = [
  {
    id: 'flopy_b',
    name: 'Flopy B',
    garment: 'Kemeja Koko Al-Raaz',
    quantity: 1200,
    screenshot: '',
    notes: 'Kemeja Koko standar Al-Raaz. Gunakan kertas sobek 2 lapis. Jarum DBxK5 #11.',
    components: [
      { name: 'Plaket Depan', stitch: 8500, threadMeters: 28 },
      { name: 'Pocket / Saku', stitch: 3200, threadMeters: 11 },
      { name: 'Cuff / Manset', stitch: 4100, threadMeters: 14 },
      { name: 'Collar / Kerah', stitch: 2800, threadMeters: 9 },
    ],
  },
  {
    id: 'flopy_c',
    name: 'Flopy C',
    garment: 'Gamis Bordir Al-Raaz',
    quantity: 1200,
    screenshot: '',
    notes: 'Bordir dada lebar gamis. Pastikan tegangan benang stabil untuk bahan jatuh.',
    components: [
      { name: 'Dada & Leher', stitch: 14200, threadMeters: 48 },
      { name: 'Lengan Manset', stitch: 5300, threadMeters: 18 },
    ],
  },
];

export const useFloppyStore = defineStore('floppy', () => {
  const toast = useToastStore();

  let initialFloppies = [];
  try {
    const raw = localStorage.getItem('embro_floppy_list');
    if (raw) initialFloppies = JSON.parse(raw);
  } catch (e) {
    initialFloppies = [];
  }

  const floppyList = ref(initialFloppies);

  watch(
    floppyList,
    (val) => {
      localStorage.setItem('embro_floppy_list', JSON.stringify(val));
    },
    { deep: true }
  );

  const getFloppyInfo = (flopyName) => {
    const raw = (flopyName || '').toString().trim();
    const key = raw.toUpperCase();

    const found = (floppyList.value || []).find(
      (f) => (f.name || '').trim().toUpperCase() === key || f.id === key
    );

    if (found) {
      const totalStitches = (found.components || []).reduce((acc, c) => acc + (Number(c.stitch) || 0), 0);
      const totalMeters =
        (found.components || []).reduce((acc, c) => acc + (Number(c.threadMeters) || 0), 0) ||
        (totalStitches > 0 ? Math.round(totalStitches * 0.0033) : 0);

      return {
        ...found,
        totalStitches,
        totalMeters,
      };
    }

    return {
      id: 'unknown_' + (key || 'empty'),
      name: raw || '-',
      garment: '-',
      quantity: 0,
      screenshot: '',
      notes: '',
      components: [],
      totalStitches: 0,
      totalMeters: 0,
    };
  };

  const isFloppyModalOpen = ref(false);
  const isEditingFloppy = ref(false);
  const editingFloppyId = ref(null);
  const previewScreenshotUrl = ref(null);

  const floppyForm = ref({
    id: '',
    name: '',
    garment: '',
    quantity: 1200,
    screenshot: '',
    notes: '',
    components: [
      { name: 'Plaket Depan', stitch: 8500, threadMeters: 28 },
      { name: 'Pocket / Saku', stitch: 3200, threadMeters: 11 },
    ],
  });

  function openAddModal() {
    isEditingFloppy.value = false;
    editingFloppyId.value = null;
    previewScreenshotUrl.value = null;
    floppyForm.value = {
      id: '',
      name: '',
      garment: '',
      quantity: 1200,
      screenshot: '',
      notes: '',
      components: [
        { name: 'Plaket Depan', stitch: 8500, threadMeters: 28 },
        { name: 'Pocket / Saku', stitch: 3200, threadMeters: 11 },
      ],
    };
    isFloppyModalOpen.value = true;
  }

  function openEditModal(floppy) {
    isEditingFloppy.value = true;
    editingFloppyId.value = floppy.id;
    previewScreenshotUrl.value = floppy.screenshot || null;
    floppyForm.value = {
      id: floppy.id,
      name: floppy.name,
      garment: floppy.garment || '',
      quantity: floppy.quantity || 1200,
      screenshot: floppy.screenshot || '',
      notes: floppy.notes || '',
      components: (floppy.components || []).map((c) => ({ ...c })),
    };
    isFloppyModalOpen.value = true;
  }

  function closeModal() {
    isFloppyModalOpen.value = false;
  }

  function addComponent() {
    floppyForm.value.components.push({ name: '', stitch: null, threadMeters: null });
  }

  function removeComponent(idx) {
    if (floppyForm.value.components.length > 1) {
      floppyForm.value.components.splice(idx, 1);
    }
  }

  async function handleScreenshotFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const compressed = await compressImageBase64(e.target.result, 1280, 0.82);
      floppyForm.value.screenshot = compressed.dataUrl;
      previewScreenshotUrl.value = compressed.dataUrl;
      toast.showToast(`Screenshot dikompresi ke WebP (${compressed.sizeKb} KB)`);
    };
    reader.readAsDataURL(file);
  }

  function saveFloppy() {
    const name = (floppyForm.value.name || '').trim();
    if (!name) {
      alert('Nama Floppy / File Desain wajib diisi.');
      return;
    }

    const validComponents = (floppyForm.value.components || [])
      .filter((c) => (c.name || '').trim() || (Number(c.stitch) || 0) > 0)
      .map((c) => ({
        name: (c.name || 'Komponen').trim(),
        stitch: Number(c.stitch) || 0,
        threadMeters: Number(c.threadMeters) || Math.round((Number(c.stitch) || 0) * 0.0033),
      }));

    const payload = {
      id: isEditingFloppy.value && editingFloppyId.value ? editingFloppyId.value : 'floppy_' + Date.now().toString(36),
      name,
      garment: (floppyForm.value.garment || '').trim() || 'Komponen Bordir',
      quantity: Number(floppyForm.value.quantity) || 1200,
      screenshot: floppyForm.value.screenshot || '',
      notes: (floppyForm.value.notes || '').trim(),
      components: validComponents.length > 0 ? validComponents : [{ name: 'Komponen Utama', stitch: 16000, threadMeters: 53 }],
    };

    if (isEditingFloppy.value) {
      const idx = floppyList.value.findIndex(
        (f) => f.id === editingFloppyId.value || f.name.toUpperCase() === name.toUpperCase()
      );
      if (idx !== -1) {
        floppyList.value[idx] = payload;
      } else {
        floppyList.value.push(payload);
      }
      toast.showToast(`Floppy "${name}" berhasil diperbarui!`);
    } else {
      floppyList.value.push(payload);
      toast.showToast(`Floppy "${name}" berhasil ditambahkan!`);
    }

    persist();
    isFloppyModalOpen.value = false;
  }

  function deleteFloppy(floppy) {
    if (!confirm(`Hapus Floppy "${floppy.name}" dari database?`)) return;
    floppyList.value = floppyList.value.filter((f) => f.id !== floppy.id);
    persist();
    toast.showToast(`Floppy "${floppy.name}" telah dihapus.`);
  }

  function clearAll() {
    if (!confirm('Apakah Anda yakin ingin menghapus seluruh data master floppy?')) return;
    floppyList.value = [];
    persist();
    toast.showToast('Seluruh master floppy berhasil dikosongkan.');
  }

  function loadSample() {
    floppyList.value = JSON.parse(JSON.stringify(SAMPLE_FLOPPIES));
    persist();
    toast.showToast('Sampel master floppy berhasil dimuat.');
  }

  function persist() {
    localStorage.setItem('embro_floppy_list', JSON.stringify(floppyList.value));
  }

  return {
    floppyList,
    getFloppyInfo,
    isFloppyModalOpen,
    isEditingFloppy,
    editingFloppyId,
    previewScreenshotUrl,
    floppyForm,
    openAddModal,
    openEditModal,
    closeModal,
    addComponent,
    removeComponent,
    handleScreenshotFile,
    saveFloppy,
    deleteFloppy,
    clearAll,
    loadSample,
    persist,
  };
});
