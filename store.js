import { reactive } from 'vue';

export const store = reactive({
    selectedItemId: null,
    items: []
});