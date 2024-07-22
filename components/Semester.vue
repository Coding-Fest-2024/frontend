<template>
    <div class="drop-zone-container"
       @drop="onDrop($event, semester, year)"
       @dragover.prevent
       @dragenter.prevent>
        <UnitBlock
        v-for="item in getItems(semester, year)"
        :key="item.id"
        :item="item"
        :semester="semester"
        :year="year"
        :getItemWidth="getItemWidth"
        />
    </div>
</template>
  
<script setup>
  import { store } from '../store';
  
  const props = defineProps({
    semester: {
      type: Number,
      required: true
    },
    year: {
      type: Number,
      required: true
    }
  });
  
  
const getItems = (semester, year) => {
  return store.items.filter(item => item.semester === semester && item.year === year);
};

const onDrop = (event, semester, year) => {
  const itemData = JSON.parse(event.dataTransfer.getData('item'));
  let fromItemIndex = store.items.findIndex(item => item.id === itemData.id);
  let fromItem = store.items[fromItemIndex];
  let targetItemIndex = store.items.findIndex(item => item.semester === semester && item.year === year);

  if (fromItemIndex === -1) {
    const newItem = { ...itemData, semester, year };
    store.items.push(newItem);
    newItem.animating = true;
    setTimeout(() => newItem.animating = false, 500);
    saveToLocalStorage();
    return;
  }

  if (targetItemIndex !== -1 && fromItemIndex !== targetItemIndex) {
    const targetItem = store.items[targetItemIndex];
    fromItem.semester = semester;
    fromItem.year = year;
    const targetIndex = getItems(semester, year).length;
    fromItem.order = targetIndex;
    store.items.splice(fromItemIndex, 1);
    store.items.push(fromItem);
    fromItem.animating = true;
    setTimeout(() => fromItem.animating = false, 500);
    saveToLocalStorage();
  } else if (targetItemIndex === -1) {
    fromItem.semester = semester;
    fromItem.year = year;
    saveToLocalStorage();
  }
  fromItem.animating = true;
  setTimeout(() => fromItem.animating = false, 500);
  if (targetItem.animating) {
    setTimeout(() => targetItem.animating = false, 500);
  }
  store.items.splice(fromItemIndex, 1, fromItem);
};

const getItemWidth = (semester, year) => {
  const itemCount = getItems(semester, year).length;
  return itemCount > 0 ? 120 / itemCount : 120;
};

const saveToLocalStorage = () => {
  localStorage.setItem('storedItems', JSON.stringify(store.items));
};

const loadFromLocalStorage = () => {
  const storedItems = localStorage.getItem('storedItems');
  if (storedItems) {
    store.items = JSON.parse(storedItems);
  }
};

onMounted(() => {
  loadFromLocalStorage();
});

watch(store.items, () => {
  saveToLocalStorage();
}, { deep: true });
</script>
  
<style scoped>


.drop-zone-container {
    display: flex;
    padding-top: 12px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 12px;
    z-index: 3;
    background-color: #ffffffa6;
    border-radius: 28px;
    margin-top: 10px;
    border: 2.5px solid #aeaeae;
    /* box-shadow: 0px 6px 4px 0.0px rgba(133, 133, 133, 0.2); */
    background-color: none;
    min-width: 100%;
    max-width: 100%;
    min-height: 72px;
}

@media (max-width: 800px) {
.drop-zone-container {
  display: flex;
  flex-direction: column;
  background-color: #fafafa9c;
  margin: 5px;
  border: 2.5px solid #bababa;
  background-color: none;
  min-width: 100%;
  max-width: 100%;
}
}

</style>
  