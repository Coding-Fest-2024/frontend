import { reactive, watch } from 'vue';

export const store = reactive({
  items: loadItemsFromLocalStorage(),
  selectedItemId: null,
  saveToLocalStorage() {
    if (process.client) {
      localStorage.setItem('items', JSON.stringify(this.items));
    }
  },
});

function loadItemsFromLocalStorage() {
  if (process.client) {
    return JSON.parse(localStorage.getItem('items')) || [];
  }
  return [];
}

watch(
  () => store.items,
  (newVal) => {
    if (process.client) {
      store.saveToLocalStorage();
    }
  },
  { deep: true }
);
