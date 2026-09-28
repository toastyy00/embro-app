<script setup>
import { useToastStore } from '../../stores/useToastStore.js';

const toast = useToastStore();
</script>

<template>
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="transform translate-y-4 opacity-0 scale-95"
    enter-to-class="transform translate-y-0 opacity-100 scale-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="transform translate-y-0 opacity-100 scale-100"
    leave-to-class="transform translate-y-4 opacity-0 scale-95"
  >
    <div
      v-if="toast.isVisible"
      class="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-2xl text-zinc-100 font-mono text-xs max-w-md backdrop-blur-md"
    >
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      <span class="flex-1">{{ toast.message }}</span>
      <button
        @click="toast.hideToast"
        class="text-zinc-500 hover:text-zinc-300 ml-2 text-sm leading-none"
      >
        ✕
      </button>
    </div>
  </transition>
</template>
