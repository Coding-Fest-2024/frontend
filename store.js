import { reactive } from 'vue';

export const store = reactive({
  items: [],
  selectedItemId: null,
  viewMajor: false,
  selectedMajor: [],
  
  saveToLocalStorage() {
    localStorage.setItem('storedItems', JSON.stringify(this.items));
  },

  loadFromLocalStorage() {
    const storedItems = localStorage.getItem('storedItems');
    if (storedItems) {
      this.items = JSON.parse(storedItems);
    }
  }
});
