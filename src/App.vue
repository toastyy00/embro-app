<script setup>
import { ref } from 'vue';
import AppNavigation from './components/common/AppNavigation.vue';
import ToastContainer from './components/common/ToastContainer.vue';
import CmtDataView from './views/CmtDataView.vue';
import TrialView from './views/TrialView.vue';
import ScheduleView from './views/ScheduleView.vue';
import InventoryView from './views/InventoryView.vue';
import FloppyView from './views/FloppyView.vue';

const activeTab = ref('cmt');
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
    <!-- Top Header -->
    <header class="border-b border-zinc-850 bg-zinc-900/60 backdrop-blur-md sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-mono text-sm shadow-sm">
            E
          </div>
          <div>
            <h1 class="font-bold font-mono text-sm text-white tracking-wide">
              EMBRO OPTIMIZER
            </h1>
            <p class="text-[10px] font-mono text-zinc-500">
              Sistem Urutan Mesin & Stok Bordir Komputer
            </p>
          </div>
        </div>

        <!-- Status Tag -->
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-zinc-900 border border-zinc-800 text-zinc-400">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Vite Modular v2.0</span>
          </span>
        </div>
      </div>
    </header>

    <!-- Main Container -->
    <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-4">
      <!-- Navigation Tabs -->
      <AppNavigation
        :active-tab="activeTab"
        @change-tab="(tab) => activeTab = tab"
      />

      <!-- Dynamic Active Tab View -->
      <transition mode="out-in" enter-active-class="transition duration-150 ease-out" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div :key="activeTab">
          <CmtDataView v-if="activeTab === 'cmt'" />
          <TrialView v-else-if="activeTab === 'trial'" @switch-to-cmt="activeTab = 'cmt'" />
          <ScheduleView v-else-if="activeTab === 'schedule'" />
          <InventoryView v-else-if="activeTab === 'inventory'" />
          <FloppyView v-else-if="activeTab === 'floppy'" />
        </div>
      </transition>
    </main>

    <!-- Floating Toast Notification Container -->
    <ToastContainer />
  </div>
</template>
