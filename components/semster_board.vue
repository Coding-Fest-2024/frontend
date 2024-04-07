<template>
    <div class="board">
        <div class="timeline">
        </div>
        <div class="academic-year-container" 
             v-for="year in academicYears" :key="`year-${year}`">
            <div class="semester-container" v-for="semester in [1, 2]" :key="`year-${year}-semester-${semester}`">
                <h3 class="semester-label">
                    <span class="label-text">{{ `Semester ${semester} >` }}</span>
                </h3>
                <div class="drop-zone-container">
                    <div v-for="index in 4" :key="`year-${year}-semester-${semester}-slot-${index}`" class="drop-zone"
                        @drop="onDrop($event, index, semester, year)"
                        @dragover.prevent
                        @dragenter.prevent>
                        <div v-for="item in getItems(index, semester, year)"
                            :key="item.id"
                            class="drag-el"
                            :class="{ 'selected': item.id === store.selectedItemId, animating: item.animating }"
                            :style="{ backgroundColor: item.color }"
                            draggable="true"
                            @click="selectItem(item)"
                            @dragstart="startDrag($event, item)">
                            <div class="text-container">{{ item.title }}</div> 
                            <button class="delete-button" @click.stop="deleteItem(item)">
                                <span class="material-symbols-outlined">delete</span>
                            </button>
                            <div class="inner-block">
                                {{ item.name }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <t-button id="add-button" class="add-year-button" @click="addAcademicYear" size="large" shape="round" theme="default">
            +
        </t-button>
    </div>
</template>


<script>
import { defineComponent, ref } from 'vue';
import { store } from '../store';

export default defineComponent({
    setup() {
        const academicYears = ref([1, 2, 3]); // Example: 3 academic years
        
        const items = store.items;

        const selectItem = (item) => {
            store.selectedItemId = store.selectedItemId === item.id ? null : item.id;
        };

        const getItems = (slot, semester, year) => {
            return store.items.filter(item => item.slot === slot && item.semester === semester && item.year === year);
        };

        const startDrag = (event, item) => {
            event.dataTransfer.setData('item', JSON.stringify(item));
        };

        const onDrop = (event, slot, semester, year) => {
            const itemData = JSON.parse(event.dataTransfer.getData('item'));
            let fromItemIndex = store.items.findIndex(item => item.id === itemData.id);
            let fromItem = store.items[fromItemIndex];
            let targetItemIndex = store.items.findIndex(item => item.slot === slot && item.semester === semester && item.year === year);

            if (fromItemIndex === -1 && targetItemIndex !== -1) {
                console.log("Drop cancelled: Slot is occupied.");
                return;
            }

            // Dragging from outside into the board
            if (fromItemIndex === -1) {
                const newItem = { ...itemData, slot, semester, year };
                store.items.push(newItem);
                // Handle animation or other state updates if necessary
                newItem.animating = true;
                setTimeout(() => newItem.animating = false, 500);
                return;
            }

            // If target slot is occupied and different from the fromItem's slot
            if (targetItemIndex !== -1 && fromItemIndex !== targetItemIndex) {
                const targetItem = store.items[targetItemIndex];

                // Swapping slots, semesters, and years
                [fromItem.slot, targetItem.slot] = [targetItem.slot, fromItem.slot];
                [fromItem.semester, targetItem.semester] = [targetItem.semester, fromItem.semester];
                [fromItem.year, targetItem.year] = [targetItem.year, fromItem.year];
            }
            // Moving to an empty slot within the board
            else if (targetItemIndex === -1) {
                fromItem.slot = slot;
                fromItem.semester = semester;
                fromItem.year = year;
            }

            // Handle animation for moving or swapping
            fromItem.animating = true;
            setTimeout(() => fromItem.animating = false, 500);
        };


        const addAcademicYear = () => {
            const maxYear = Math.max(...academicYears.value);
            academicYears.value.push(maxYear + 1);
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

        return {
            academicYears,
            getItems,
            startDrag,
            onDrop,
            items,
            selectItem,
            addAcademicYear,
            deleteItem,
            store
        };
    }
});

</script>


<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap');
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,500,0,0");

.board {
    display: flex;
    justify-content: center;
    flex-direction: column;
}

.semester-label {
    margin: -10px 0;
    text-align: left;
    transform: translate(-13vw, 4.8vw);
    position: relative;
    font-family: "Roboto Mono", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-optical-sizing: auto;
    font-weight: 200;
    font-style: normal;
    font-size: 1vw;
}

.label-text {
    background-color: None;
    color: #FF8C4B; 
    padding: 5px; 
    border-radius: 5px; 
    z-index: 10;
    font-family: "Roboto Mono", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 1vw;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
}

.academic-year-container {
    background-color: #EAEAEA;
    padding: 5px;
    border-radius: 34px;
    justify-content: center;
    width: auto;
    flex-wrap: wrap;
    margin: 15px;
    min-width: 48vw;
    max-width: 56vw;
    border: 2px solid #989898a8;
}


.drop-zone-container {
    display: flex; 
    justify-content: start;
    gap: 13px;
    padding-top: 15px;
    padding-bottom: 10px;
    padding-left: 20px;
    padding-right: 20px;
    border-radius: 34px;
    overflow-x: auto;
    overflow-y: hidden;
    margin-left: 0%;
}

.drop-zone {
    margin: 0.3vw;
    width: 11vw;
    background-color: #E0E0E0;
    padding: 0px;
    border-radius: 16px;
    height: 6.4vw;
    pointer-events: auto;
    z-index: 1;
    min-width: 9vw;
    flex-wrap: nowrap;
    display: inline-flex;
    align-items: start;
    border: 2px solid #bdbdbd2b;
}

.drag-el {
    
    align-items: center;
    background-color: lightskyblue;
    color: white;
    margin-bottom: 10px;
    border-radius: 16px;
    outline: none;
    filter: drop-shadow(0px 4px 2px rgba(45, 45, 45, 0.15));
    height: 6.6vw;
    transform: translate(-0.7%, -5%);
    z-index: inherit;
    font-family: "Roboto Mono", monospace;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    font-size: 1vw;
    min-width: 100%;
    cursor: grab;
    border: 2px solid #ffffff8f;
    transition: 0.2s;
    
}

.text-container {
    font-family: "Roboto Mono", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-optical-sizing: auto;
    font-weight: 600;
    font-style: normal;
    font-size: 0.9vw;
    transform: translate(7%, 40%);
    min-height: 18%;
    color: rgba(255, 255, 255, 0.90);
    margin-bottom: 0.75vw;
}

.inner-block {
    font-family: "Roboto", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 400;
    font-style: normal;
    padding: 10px;
    margin-left: 1.7%;
    margin-right: 0.2vw;
    margin-bottom: 0.2vw;
    border-radius: 12px; 
    background-color: rgba(255, 255, 255, 0.90);
    text-align: left;
    font-size: 0.89vw;
    line-height: normal;
    color: rgba(55, 55, 55, 0.851);
    width: 96.5%;
    overflow: hidden;
    word-wrap: break-word;
    height: 68%;
    min-height: 48%;
    box-sizing: border-box;
}
@keyframes swap-animation {
    0% {
        opacity: 0;
        transform: scale(1.1);
        transform: translate(-0.7%, -7%);
        box-shadow: 0px 0px 8.8px 5px rgba(255,255,255, 0.0);
    }
    50% {
        opacity: 0.5;
        transform: scale(0.98);
        transform: translate(-0.7%, -10%);
        box-shadow: 0px 0px 8.8px 5px rgba(255,255,255, 1);
    }
    100% {
        opacity: 1;
        transform: scale(1.0);
        transform: translate(-0.7%, -5%);
        box-shadow: 0px 0px 8.8px 5px rgba(255,255,255, 0.0);
    }
}

@keyframes pulse-animation {
    0%, 100% {
        transform: scale(1.0) translate(-0.7%, -6%);
        box-shadow: 0px 4px 4px 2px rgba(255, 255, 255, 0.6); /* Glowing effect */
        opacity: 1;
        border: 2px solid #5c5c5cb7;
    }
    50% {
        transform: scale(1) translate(-0.7%, -6%);
        box-shadow: 0px 0px 10px 7px rgb(255, 255, 255);
        opacity: 0.9;
        border: 2px solid #525252b7;
    }
}


.drag-el.animating {
    animation: swap-animation 0.5s ease-in-out;
}

.drag-el.selected {
    box-shadow: 0px 0px 8.8px 8px rgba(255,255,255, 1);
    animation: pulse-animation 1.5s ease-in-out infinite;
    cursor: grab;
}

/* Custom styling for the element when it is being dragged */
.drag-el:active,
.drag-el:focus {
    outline: none;
    box-shadow: 0px 0px 0px 0px rgba(255,255,255, 0);
    opacity: 0.6;
    transition: 0.2s;
}

.drag-el:hover {
    border: 2px solid #525252b7;
    box-shadow: 0px 0px 0px 1px rgba(255, 255, 255, 0.419);
    transition: 0.2s;
}


.delete-button {
    position: absolute;
    top: 0;
    right: 0;
    background-color: rgba(87, 87, 87, 0.274);
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    opacity: 0.0;
    margin: 2%;
    height: 22%;
    width: 17%;
    overflow: hidden;
    transition: 0.2s;
}

.delete-button:hover {
    background-color: rgba(232, 66, 66, 0.888);
    transition: 0.2s;
}

.delete-button .material-symbols-outlined {
    color: rgba(255, 255, 255, 0.85);
    font-size: 1vw;
    transform: translate(-0.0vw, 0.1vw);
}

.drag-el:hover .delete-button {
    opacity: 1;
}


.drag-el:nth-last-of-type(1) {
    margin-bottom: 0;
}

.timeline {
    border-radius: 0.15vw;
    position: absolute;
    left: -1vw;
    top: 0;
    bottom: 0;
    width: 0.3vw; 
    background-color: #FF8C4B;
    z-index: 0; 
}

#add-button {
    margin-top: 0.5vw;
    font-size: 1.8vw;
    color: rgba(0, 0, 0, 0.499);
    margin-left: 45%;
    padding: 5px;
    border-radius: 34px;
    justify-content: center;
    flex-wrap: wrap;
    margin: 15px;
    font-family: "Roboto Mono", monospace;
    font-weight: 500;
    cursor: pointer;
}  
</style>
