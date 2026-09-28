<script setup>
import { useAppStore } from '../../stores/useAppStore.js';

const store = useAppStore();
</script>

<template>
  <transition
    enter-active-class="transition duration-150 ease-out"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="store.toastMessage"
      class="fixed bottom-4 right-4 z-50 max-w-sm px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs font-mono shadow-2xl flex items-center gap-2 select-none"
    >
      <span class="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
      <span class="flex-1">{{ store.toastMessage }}</span>
    </div>
  </transition>
</template>
