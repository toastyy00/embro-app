import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useToastStore = defineStore('toast', () => {
  const message = ref('');
  const isVisible = ref(false);
  let timer = null;

  function showToast(msg, duration = 2800) {
    if (!msg) return;
    message.value = msg;
    isVisible.value = true;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      isVisible.value = false;
      message.value = '';
    }, duration);
  }

  function hideToast() {
    isVisible.value = false;
    message.value = '';
    if (timer) clearTimeout(timer);
  }

  return {
    message,
    isVisible,
    showToast,
    hideToast,
  };
});
