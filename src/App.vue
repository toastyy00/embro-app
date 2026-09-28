<script setup>
import { useAppStore } from './stores/useAppStore.js';
import AppSidebar from './components/layout/AppSidebar.vue';
import AppMobileDrawer from './components/layout/AppMobileDrawer.vue';
import AppHeader from './components/layout/AppHeader.vue';
import CmtDataView from './views/CmtDataView.vue';
import TrialView from './views/TrialView.vue';
import FloppyView from './views/FloppyView.vue';
import ScheduleView from './views/ScheduleView.vue';
import InventoryView from './views/InventoryView.vue';
import ArchivesView from './views/ArchivesView.vue';
import ConfirmModal from './components/common/ConfirmModal.vue';
import ToastContainer from './components/common/ToastContainer.vue';
import CloudSettingsModal from './components/common/CloudSettingsModal.vue';
import FloppyModal from './components/common/FloppyModal.vue';
import ScreenshotPreviewModal from './components/common/ScreenshotPreviewModal.vue';

const store = useAppStore();
</script>

<template>
  <div class="app-shell max-w-3xl lg:max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pt-3 sm:pt-5 transition-all duration-200">
    <!-- Dedicated Print Header (A4) -->
    <div class="hidden print:block mb-3 pb-2 border-b-2 border-black font-mono">
      <div class="flex justify-between items-baseline">
        <h1 class="text-sm font-bold uppercase tracking-tight text-black">EMBRO-AR — SPK BORDIR &amp; LEMBAR KERJA OPERATOR</h1>
        <span class="text-xs text-black">{{ store.currentDateString }}</span>
      </div>
      <div class="text-[11px] text-zinc-800 mt-0.5">
        EMBRO-AR APP • Divisi Embroidery Al-Raaz • Setup: {{ store.needleCapacity }} Jarum • Slot Swap: Jarum {{ store.swapNeedle }} (J{{ store.swapNeedle }})
      </div>
    </div>

    <!-- MAIN CONTAINER: SIDEBAR + CONTENT -->
    <div class="lg:flex lg:gap-5 lg:items-start">
      <!-- Desktop Sidebar -->
      <AppSidebar />

      <!-- Right Content Area -->
      <div class="flex-1 min-w-0">
        <!-- Header Section (Status Strip & Actions) -->
        <AppHeader />

        <!-- Dynamic Views -->
        <CmtDataView v-if="store.activeModule === 'cmt'" />
        <TrialView v-else-if="store.activeModule === 'trial'" />
        <FloppyView v-else-if="store.activeModule === 'floppy'" />
        <ScheduleView v-else-if="store.activeModule === 'schedule'" />
        <InventoryView v-else-if="store.activeModule === 'inventory'" />
        <ArchivesView v-else-if="store.activeModule === 'archives'" />
      </div>
    </div>

    <!-- Mobile Drawer -->
    <AppMobileDrawer />

    <!-- Modals & Notifications -->
    <ConfirmModal />
    <ToastContainer />
    <CloudSettingsModal />
    <FloppyModal />
    <ScreenshotPreviewModal />
  </div>
</template>
