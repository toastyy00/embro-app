<script setup>
import { useAppStore } from '../../stores/useAppStore.js';

const store = useAppStore();
</script>

<template>
  <transition
    enter-active-class="transition duration-150 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-100 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="store.previewScreenshotUrl"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md select-none cursor-pointer"
      @click="store.closeScreenshotPreview"
    >
      <div class="relative max-w-4xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl p-2" @click.stop>
        <button
          @click="store.closeScreenshotPreview"
          class="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center border border-zinc-700 cursor-pointer z-10 transition-transform active:scale-95"
        >
          ✕
        </button>
        <img
          :src="store.previewScreenshotUrl"
          class="max-w-full max-h-[85vh] object-contain rounded-lg mx-auto"
        />
      </div>
    </div>
  </transition>
</template>
