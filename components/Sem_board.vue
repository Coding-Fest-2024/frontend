<template>
    <div class="board">
        <AcademicYear
            v-for="year in academicYears"
            :key="`year-${year}`"
            :year="year"
        />
        <div class="button-container">
            <button class="add-year-button" @click="addAcademicYear">
                <span class="material-symbols-outlined">add</span>
            </button>
            <button class="add-year-button" @click="minusAcademicYear">
                <span class="material-symbols-outlined">remove</span>
            </button>
            <button class="add-year-button" @click="cleanBoard">
                <span class="material-symbols-outlined">delete_sweep</span>
            </button>
        </div>
    </div>
</template>



<script>
import { defineComponent, ref } from 'vue';
import { store } from '../store';

export default defineComponent({
    setup() {
        const academicYears = ref([1, 2, 3]); // Example: 3 academic years
        const draggingItem = ref(null);
        
        const items = store.items;

        const selectItem = (item) => {
            store.selectedItemId = store.selectedItemId === item.id ? null : item.id;
        };

        const getItems = (slot, semester, year) => {
            return store.items.filter(item => item.slot === slot && item.semester === semester && item.year === year);
        };

        const startDrag = (event, item) => {
            draggingItem.value = item;
            event.dataTransfer.setData('item', JSON.stringify(item));
        };

        const onDrop = (event, slot, semester, year) => {
            const itemData = JSON.parse(event.dataTransfer.getData('item'));
            let fromItemIndex = store.items.findIndex(item => item.id === itemData.id);
            let fromItem = store.items[fromItemIndex];
            let targetItemIndex = store.items.findIndex(item => item.slot === slot && item.semester === semester && item.year === year);

            // if (fromItemIndex === -1 && targetItemIndex !== -1) {
            //     console.log("Drop cancelled: Slot is occupied.");
            //     return;
            // }

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
                // [fromItem.slot, targetItem.slot] = [targetItem.slot, fromItem.slot];
                // [fromItem.semester, targetItem.semester] = [targetItem.semester, fromItem.semester];
                // [fromItem.year, targetItem.year] = [targetItem.year, fromItem.year];
                // targetItem.animating = true;
                fromItem.slot = slot;
                fromItem.semester = semester;
                fromItem.year = year;

                const targetIndex = getItems(semester, year).length;
                fromItem.order = targetIndex;
                store.items.splice(fromItemIndex, 1); 
                store.items.push(fromItem); 

                fromItem.animating = true;
                setTimeout(() => fromItem.animating = false, 500);
            }
            // Moving to an empty slot within the board
            else
            if (targetItemIndex === -1) {
                fromItem.slot = slot;
                fromItem.semester = semester;
                fromItem.year = year;
            }

            // Handle animation for moving or swapping
            fromItem.animating = true;
            setTimeout(() => fromItem.animating = false, 500);
            if (targetItem.animating) {
                setTimeout(() => targetItem.animating = false, 500);
            }
            store.items.splice(fromItemIndex, 1, fromItem);
        };


        const addAcademicYear = () => {
            if (academicYears.value.length <= 0) {
                academicYears.value.push(1);
                return ;
            }
            const maxYear = Math.max(...academicYears.value);
            academicYears.value.push(maxYear + 1);
        };

        const minusAcademicYear = () => {
            if (academicYears.value.length > 0) {
                academicYears.value.pop();
            }
        };

        const cleanBoard = () => {
            store.items = [];
        }

        const deleteItem = (itemToDelete) => {
            const index = store.items.findIndex(item => item.id === itemToDelete.id);
            if (store.selectedItemId === itemToDelete.id) {
                store.selectedItemId = null;
            }
            if (index > -1) {
                store.items.splice(index, 1);
            }
        };

        const dropZoneCounts = ref({});

        academicYears.value.forEach(year => {
            [1, 2].forEach(semester => {
                const key = `year-${year}-semester-${semester}`;
                dropZoneCounts.value[key] = 4;
            });
        });

        const getDropZoneCount = (year, semester) => {
            const key = `year-${year}-semester-${semester}`;
            return dropZoneCounts.value[key] || 0;
        };

        const getItemWidth = (semester, year) => {
            const itemCount = getItems(semester, year).length;
            return itemCount > 0 ? 100 / itemCount : 100; // Prevent division by zero
        };

        return {
            academicYears,
            getItems,
            startDrag,
            onDrop,
            items,
            selectItem,
            addAcademicYear,
            minusAcademicYear,
            deleteItem,
            store,
            academicYears,
            dropZoneCounts,
            getDropZoneCount,
            academicYears,
            getItemWidth,
            cleanBoard
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
    flex-direction: column;
    width: 100%;
    overflow: auto;
    padding: 10px;
}

@media (max-width: 760px) {
    .board {
        padding: 0px;
        padding-top: 3px;
    }
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
    margin: 4px;
    height: 24px;
    width: 28px;
    
    overflow: hidden;
    transition: 0.2s;
}

.delete-button:hover {
    background-color: rgba(232, 66, 66, 0.888);
    transition: 0.2s;
}

.delete-button .material-symbols-outlined {
    color: rgba(255, 255, 255, 0.85);
    transform: translate(-0.0vw, 0.1vw);
    font-size: 16px;
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

.button-container {
    display: flex;
    width: 40%;
    max-height: 40px;
    margin-top: 8px;
    margin-left: 30%;
    /* border: black solid 2px; */
    align-content: space-around;
}

.add-year-button {
    font-size: 10px;
    color: rgba(216, 216, 216, 0.499);
    background-color: #ffffff;
    padding: 5px;
    border-radius: 10px;
    border: dashed 2px #d4d4d4;
    justify-content: center;
    cursor: pointer;
    width: 100%;
    margin: 2px;
    transition: 0.3s;
}  

.add-year-button:hover {
    border: solid 2px #ff4f04e8;
    transition: 0.3s;
    background-color: #ffbe9833;
}

.add-year-button:hover .material-symbols-outlined {
    color: rgba(255, 106, 0, 0.883);
    transition: 0.3s;
}

.add-year-button:active {
    border: solid 2px #ff7236;
    transition: 0.3s;
    background-color: #ffd5bdb7;
    transform: scale(0.95);
}

</style>
