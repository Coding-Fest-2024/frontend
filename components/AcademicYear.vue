<template>
    <div class="academic-year-container">
        <div class="yr-tag"> Year-{{ year }} </div>
        <Semester
        v-for="semester in [1, 2]"
        :key="`year-${year}-semester-${semester}`"
        :semester="semester"
        :year="year"
        />
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { store } from '../store';

    const props = defineProps({
    year: {
        type: Number,
        required: true
    }
    });

    const getItems = (slot, semester, year) => {
        return store.items.filter(item => item.slot === slot && item.semester === semester && item.year === year);
    };

    const selectItem = (item) => {
        store.selectedItemId = store.selectedItemId === item.id ? null : item.id;
    };

    const startDrag = (event, item) => {
    event.dataTransfer.setData('item', JSON.stringify(item));
    };

    const onDrop = (event, slot, semester, year) => {
    const itemData = JSON.parse(event.dataTransfer.getData('item'));
    let fromItemIndex = store.items.findIndex(item => item.id === itemData.id);
    let fromItem = store.items[fromItemIndex];
    let targetItemIndex = store.items.findIndex(item => item.slot === slot && item.semester === semester && item.year === year);

    if (fromItemIndex === -1) {
        const newItem = { ...itemData, slot, semester, year };
        store.items.push(newItem);
        newItem.animating = true;
        setTimeout(() => newItem.animating = false, 500);
        return;
    }

    if (targetItemIndex !== -1 && fromItemIndex !== targetItemIndex) {
        const targetItem = store.items[targetItemIndex];
        fromItem.slot = slot;
        fromItem.semester = semester;
        fromItem.year = year;
        const targetIndex = getItems(semester, year).length;
        fromItem.order = targetIndex;
        store.items.splice(fromItemIndex, 1); 
        store.items.push(fromItem); 
        fromItem.animating = true;
        setTimeout(() => fromItem.animating = false, 500);
    } else if (targetItemIndex === -1) {
        fromItem.slot = slot;
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

    const deleteItem = (itemToDelete) => {
        const index = store.items.findIndex(item => item.id === itemToDelete.id);
        if (store.selectedItemId === itemToDelete.id) {
            store.selectedItemId = null;
        }
        if (index > -1) {
            store.items.splice(index, 1);
        }
    };

    const getItemWidth = (semester, year) => {
    const itemCount = getItems(semester, year).length;
    return itemCount > 0 ? 100 / itemCount : 100;
    };
</script>
  

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap');
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,500,0,0");



.academic-year-container {
    background-color: #EAEAEA;
    border-radius: 30px;
    justify-content: center;
    width: auto;
    flex-wrap: wrap;
    margin: 5px;
    border: 2px solid #989898a8;
    transition: 0.2s;
}

.yr-tag {
    display: flex; 
    justify-content: start;
    min-height: 40px;
    max-height: 40px;
    padding-top: 0px;
    padding-left: 0px;
    padding-right: 0px;
    padding-bottom: 0px;
    overflow-x: auto;
    overflow-y: auto;
    width: 90%;
    flex-wrap:nowrap;
    z-index: -1;
    /* background-color: #b1b1b156; */
    border-radius: 10px 10px 0px 0px;
    margin: 1%;
    margin-top: 1%;
    margin-bottom: 1%;
    margin-left: 5%;
    /* border: 2px solid #989898; */
    border-bottom: 2px dashed #9898985b;
    background-color: none;
    font-family: "Roboto Mono", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 30px;
    font-style: normal;
    font-weight: 700;
    color: #9898989e;
    line-height: normal;
}


</style>
  