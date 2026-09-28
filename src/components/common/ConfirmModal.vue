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
      v-if="store.confirmModalState.isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
      @click.self="store.handleConfirmResult(false)"
    >
      <div class="w-full max-w-sm bg-zinc-900 border border-zinc-700/90 rounded-xl shadow-2xl overflow-hidden font-mono p-4 sm:p-5 space-y-3.5">
        <div class="flex items-start gap-3">
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
            :class="{
              'bg-rose-500/10 border-rose-500/30 text-rose-400': store.confirmModalState.type === 'danger',
              'bg-amber-500/10 border-amber-500/30 text-amber-400': store.confirmModalState.type === 'warning',
              'bg-white/10 border-white/20 text-white': store.confirmModalState.type === 'confirm'
            }"
          >
            <svg
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <div class="space-y-1">
            <h3 class="text-sm font-bold text-white tracking-tight uppercase">{{ store.confirmModalState.title }}</h3>
            <p class="text-xs text-zinc-300 font-sans leading-relaxed whitespace-pre-line">{{ store.confirmModalState.message }}</p>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2.5 border-t border-zinc-800/80">
          <button
            v-if="store.confirmModalState.cancelText"
            @click="store.handleConfirmResult(false)"
            class="h-8 px-3 rounded-md bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
          >
            {{ store.confirmModalState.cancelText }}
          </button>
          <button
            @click="store.handleConfirmResult(true)"
            class="h-8 px-3.5 rounded-md text-xs font-bold transition-all shadow-sm flex items-center justify-center cursor-pointer"
            :class="{
              'bg-rose-600 hover:bg-rose-500 text-white': store.confirmModalState.type === 'danger',
              'btn-white-solid bg-white text-zinc-950 hover:bg-zinc-200': store.confirmModalState.type !== 'danger'
            }"
          >
            {{ store.confirmModalState.confirmText }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
