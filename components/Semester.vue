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
    } else if (targetItemIndex === -1) {
      fromItem.semester = semester;
      fromItem.year = year;
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
  </script>
  
<style scoped>


.drop-zone-container {
    display: flex;
    padding-top: 12px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 12px;
    border-radius: 22px;
    z-index: 3;
    background-color: #fafafa9c;
    border-radius: 20px;
    margin-top: 10px;
    border: 2.5px solid #bababa;
    box-shadow: 0px 6px 6px 0.0px rgba(133, 133, 133, 0.2);
    background-color: none;
    min-width: 100%;
    min-height: 55px;
}

@media (max-width: 760px) {
.drop-zone-container {
    padding-top: 8px;
    padding-left: 5px;
    padding-right: 5px;
    padding-bottom: 8px;
    border-radius: 22px;
    background-color: #fafafa9c;
    border-radius: 24px;
    margin: 5px;
    border: 2.5px solid #bababa;
    box-shadow: 0px 6px 6px 0.0px rgba(133, 133, 133, 0.2);
    background-color: none;
    min-height: 40px;
}
}

</style>
  