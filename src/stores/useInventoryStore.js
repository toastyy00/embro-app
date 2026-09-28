import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { THREAD_METADATA, getThreadColor } from '../utils/colorPalette.js';
import { useToastStore } from './useToastStore.js';

export const SAMPLE_INVENTORY = [
  { id: 'inv_1179', code: '1179', name: 'Hitam / Black', brand: 'Rayon Elephant 120g', cones: 12, minStock: 3, rack: 'Rak A-01', notes: 'Warna utama reguler' },
  { id: 'inv_1319', code: '1319', name: 'Putih / Pure White', brand: 'Rayon Elephant 120g', cones: 15, minStock: 4, rack: 'Rak A-02', notes: 'Stok utama bordir' },
  { id: 'inv_1320', code: '1320', name: 'Putih Tulang / Broken White', brand: 'Rayon Elephant 120g', cones: 8, minStock: 2, rack: 'Rak A-03', notes: 'Koko standar Al-Raaz' },
  { id: 'inv_2216', code: '2216', name: 'Gold Terang / Bright Gold', brand: 'Rayon Elephant 120g', cones: 5, minStock: 2, rack: 'Rak B-01', notes: 'Benang variasi bordir' },
  { id: 'inv_1135', code: '1135', name: 'Gold Tua / Antique Gold', brand: 'Rayon Elephant 120g', cones: 4, minStock: 2, rack: 'Rak B-02', notes: 'Kombinasi motif klasik' },
  { id: 'inv_1144', code: '1144', name: 'Coklat Tua / Dark Brown', brand: 'Rayon Elephant 120g', cones: 2, minStock: 2, rack: 'Rak B-03', notes: 'Perlu restock segera' },
  { id: 'inv_1184', code: '1184', name: 'Coklat Susu / Mocca', brand: 'Rayon Elephant 120g', cones: 6, minStock: 2, rack: 'Rak B-04', notes: 'Stok aman' },
  { id: 'inv_1070', code: '1070', name: 'Silver / Grey', brand: 'Rayon Elephant 120g', cones: 1, minStock: 2, rack: 'Rak C-01', notes: 'Menipis' },
  { id: 'inv_1175', code: '1175', name: 'Abu Tua / Charcoal', brand: 'Rayon Elephant 120g', cones: 3, minStock: 2, rack: 'Rak C-02', notes: 'Stok aman' },
];

export const useInventoryStore = defineStore('inventory', () => {
  const toast = useToastStore();

  let initialInventory = [];
  try {
    const raw = localStorage.getItem('embro_inventory_list');
    if (raw) initialInventory = JSON.parse(raw);
  } catch (e) {
    initialInventory = [];
  }

  const inventoryList = ref(initialInventory);
  const inventorySearch = ref('');
  const inventoryFilter = ref('all'); // 'all', 'safe', 'low', 'out'
  const isInventoryModalOpen = ref(false);
  const isEditingInventory = ref(false);
  const editingInventoryId = ref(null);

  const inventoryForm = ref({
    id: '',
    code: '',
    name: '',
    brand: 'Rayon Elephant 120g',
    cones: 1,
    minStock: 2,
    rack: '',
    notes: '',
  });

  const onInventoryCodeInput = () => {
    const code = (inventoryForm.value.code || '').toString().trim();
    if (THREAD_METADATA[code] && !inventoryForm.value.name) {
      inventoryForm.value.name = THREAD_METADATA[code].name;
    }
  };

  const inventoryCounts = computed(() => {
    const list = inventoryList.value || [];
    let totalCones = 0;
    let safeCount = 0;
    let lowCount = 0;
    let outCount = 0;

    list.forEach((item) => {
      const cones = Number(item.cones) || 0;
      const min = Number(item.minStock) || 2;
      totalCones += cones;

      if (cones === 0) {
        outCount++;
      } else if (cones <= min) {
        lowCount++;
      } else {
        safeCount++;
      }
    });

    return {
      total: list.length,
      totalCones,
      safeCount,
      lowCount,
      outCount,
      alertCount: lowCount + outCount,
    };
  });

  const filteredInventoryList = computed(() => {
    const query = (inventorySearch.value || '').trim().toLowerCase();
    const filter = inventoryFilter.value;

    return (inventoryList.value || [])
      .map((item) => {
        const cones = Number(item.cones) || 0;
        const min = Number(item.minStock) || 2;
        let status = 'safe';
        let statusLabel = 'Aman';

        if (cones === 0) {
          status = 'out';
          statusLabel = 'Habis';
        } else if (cones <= min) {
          status = 'low';
          statusLabel = 'Menipis';
        } else {
          status = 'safe';
          statusLabel = 'Aman';
        }

        const colorHex = getThreadColor(item.code);

        return {
          ...item,
          cones,
          minStock: min,
          status,
          statusLabel,
          colorHex,
        };
      })
      .filter((item) => {
        if (filter === 'safe' && item.status !== 'safe') return false;
        if (filter === 'low' && item.status !== 'low') return false;
        if (filter === 'out' && item.status !== 'out') return false;

        if (query) {
          const matchCode = String(item.code || '').toLowerCase().includes(query);
          const matchName = String(item.name || '').toLowerCase().includes(query);
          const matchBrand = String(item.brand || '').toLowerCase().includes(query);
          const matchRack = String(item.rack || '').toLowerCase().includes(query);
          const matchNotes = String(item.notes || '').toLowerCase().includes(query);
          if (!matchCode && !matchName && !matchBrand && !matchRack && !matchNotes) return false;
        }

        return true;
      });
  });

  function openAddModal() {
    isEditingInventory.value = false;
    editingInventoryId.value = null;
    inventoryForm.value = {
      id: '',
      code: '',
      name: '',
      brand: 'Rayon Elephant 120g',
      cones: 1,
      minStock: 2,
      rack: '',
      notes: '',
    };
    isInventoryModalOpen.value = true;
  }

  function openEditModal(item) {
    isEditingInventory.value = true;
    editingInventoryId.value = item.id;
    inventoryForm.value = {
      id: item.id,
      code: item.code,
      name: item.name || '',
      brand: item.brand || 'Rayon Elephant 120g',
      cones: Number(item.cones) || 0,
      minStock: Number(item.minStock) || 2,
      rack: item.rack || '',
      notes: item.notes || '',
    };
    isInventoryModalOpen.value = true;
  }

  function closeModal() {
    isInventoryModalOpen.value = false;
  }

  function saveItem() {
    const code = (inventoryForm.value.code || '').toString().trim();
    if (!code) {
      alert('Kode benang wajib diisi.');
      return;
    }

    const itemData = {
      id: isEditingInventory.value && editingInventoryId.value ? editingInventoryId.value : 'inv_' + Date.now(),
      code,
      name: (inventoryForm.value.name || '').trim() || (THREAD_METADATA[code]?.name || 'Warna ' + code),
      brand: (inventoryForm.value.brand || '').trim() || 'Rayon Elephant 120g',
      cones: Math.max(0, parseInt(inventoryForm.value.cones, 10) || 0),
      minStock: Math.max(0, parseInt(inventoryForm.value.minStock, 10) || 2),
      rack: (inventoryForm.value.rack || '').trim(),
      notes: (inventoryForm.value.notes || '').trim(),
      updatedAt: new Date().toISOString(),
    };

    if (isEditingInventory.value && editingInventoryId.value) {
      const idx = inventoryList.value.findIndex((it) => it.id === editingInventoryId.value);
      if (idx !== -1) {
        inventoryList.value[idx] = itemData;
      } else {
        inventoryList.value.push(itemData);
      }
      toast.showToast(`Stok benang #${code} berhasil diperbarui.`);
    } else {
      const existingIdx = inventoryList.value.findIndex((it) => it.code.trim().toUpperCase() === code.toUpperCase());
      if (existingIdx !== -1) {
        inventoryList.value[existingIdx] = {
          ...inventoryList.value[existingIdx],
          ...itemData,
        };
        toast.showToast(`Stok benang #${code} sudah ada dan telah diperbarui.`);
      } else {
        inventoryList.value.unshift(itemData);
        toast.showToast(`Benang #${code} berhasil ditambahkan ke inventory.`);
      }
    }

    persist();
    isInventoryModalOpen.value = false;
  }

  function deleteItem(item) {
    if (!confirm(`Hapus benang #${item.code} (${item.name}) dari daftar inventory gudang?`)) return;
    inventoryList.value = inventoryList.value.filter((it) => it.id !== item.id);
    persist();
    toast.showToast(`Benang #${item.code} telah dihapus dari inventory.`);
  }

  function quickAdjustCones(target, delta) {
    const targetId = target?.id;
    const targetCode = target?.code;
    const realItem = (inventoryList.value || []).find(
      (it) => (targetId && it.id === targetId) || (it.code && it.code === targetCode)
    );
    if (realItem) {
      const current = Number(realItem.cones) || 0;
      realItem.cones = Math.max(0, current + delta);
      if (target) target.cones = realItem.cones;
    } else if (target) {
      target.cones = Math.max(0, (Number(target.cones) || 0) + delta);
    }
    persist();
  }

  function clearAll() {
    if (!confirm('Apakah Anda yakin ingin menghapus seluruh data inventory benang di gudang?')) return;
    inventoryList.value = [];
    persist();
    toast.showToast('Seluruh stok benang inventory berhasil dikosongkan.');
  }

  function loadSample() {
    inventoryList.value = JSON.parse(JSON.stringify(SAMPLE_INVENTORY));
    persist();
    toast.showToast('Katalog sampel benang berhasil dimuat.');
  }

  function persist() {
    localStorage.setItem('embro_inventory_list', JSON.stringify(inventoryList.value));
  }

  return {
    inventoryList,
    inventorySearch,
    inventoryFilter,
    isInventoryModalOpen,
    isEditingInventory,
    editingInventoryId,
    inventoryForm,
    inventoryCounts,
    filteredInventoryList,
    onInventoryCodeInput,
    openAddModal,
    openEditModal,
    closeModal,
    saveItem,
    deleteItem,
    quickAdjustCones,
    clearAll,
    loadSample,
    persist,
  };
});
