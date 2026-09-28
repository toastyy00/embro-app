<script setup>
defineProps({
  activeTab: {
    type: String,
    required: true,
  },
});

defineEmits(['change-tab']);
</script>

<template>
  <nav class="flex items-center gap-1.5 p-1.5 bg-zinc-900/90 border border-zinc-800 rounded-xl overflow-x-auto select-none">
    <button
      @click="$emit('change-tab', 'trial')"
      class="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer shrink-0"
      :class="activeTab === 'trial' ? 'bg-zinc-800 text-white font-bold shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/60'"
    >
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      <span>Trial Benang</span>
    </button>

    <button
      @click="$emit('change-tab', 'schedule')"
      class="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer shrink-0"
      :class="activeTab === 'schedule' ? 'bg-zinc-800 text-white font-bold shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/60'"
    >
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
      <span>Jadwal Mesin</span>
    </button>

    <button
      @click="$emit('change-tab', 'inventory')"
      class="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer shrink-0"
      :class="activeTab === 'inventory' ? 'bg-zinc-800 text-white font-bold shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/60'"
    >
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
      <span>Inventory Benang</span>
    </button>

    <button
      @click="$emit('change-tab', 'floppy')"
      class="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer shrink-0"
      :class="activeTab === 'floppy' ? 'bg-zinc-800 text-white font-bold shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/60'"
    >
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <polyline points="17 21 17 13 7 13 7 21"></polyline>
        <polyline points="7 3 7 8 15 8"></polyline>
      </svg>
      <span>Master Film</span>
    </button>
  </nav>
</template>
