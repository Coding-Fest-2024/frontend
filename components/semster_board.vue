<template>
    <div class="board">
        <div class="academic-year-container" 
             v-for="year in academicYears" :key="`year-${year}`">
            <div class="semester-container" v-for="semester in [1, 2]" :key="`year-${year}-semester-${semester}`">
                <h3 class="semester-label">
                    <span class="label-text">{{ `Semester ${semester}` }}</span>
                </h3>
                <div class="drop-zone-container">
                    <div v-for="index in 4" :key="`year-${year}-semester-${semester}-slot-${index}`" class="drop-zone"
                        @drop="onDrop($event, index, semester, year)"
                        @dragover.prevent
                        @dragenter.prevent>
                        <div v-for="item in getItems(index, semester, year)"
                             :key="item.id"
                             class="drag-el"
                             :class="{ 'selected': item.id === selectedItemId, animating: item.animating }"
                             :style="{ backgroundColor: item.color }"
                             draggable="true"
                             @click="selectItem(item)"
                             @dragstart="startDrag($event, item)">
                            {{ item.title }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>





<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup() {
        const academicYears = ref([1, 2, 3]); // Example: 2 academic years
        

        const selectedItemId = ref(null);
        const items = ref([
            // Example items
            { id: 0, title: 'INFO1110', slot: 1, semester: 1, year: 1, color: 'darkblue' },
            { id: 1, title: 'COMP2823', slot: 3, semester: 1, year: 2, color: 'orange' },
        ]);

        const selectItem = (item) => {
            selectedItemId.value = selectedItemId.value === item.id ? null : item.id;
        };

        const getItems = (slot, semester, year) => {
            return items.value.filter(item => item.slot === slot && item.semester === semester && item.year === year);
        };

        const startDrag = (event, item) => {
            event.dataTransfer.setData('item', JSON.stringify(item));
        };

        const onDrop = (event, slot, semester, year) => {
            const itemData = JSON.parse(event.dataTransfer.getData('item'));
            const fromItem = items.value.find(item => item.id === itemData.id);
            if (fromItem) {
                const targetItemIndex = items.value.findIndex(
                    item => item.slot === slot && item.semester === semester && item.year === year
                );
                fromItem.animating = true;
                if (targetItemIndex !== -1) {
                    const targetItem = items.value[targetItemIndex];

                    targetItem.animating = true;

                    [fromItem.slot, targetItem.slot] = [targetItem.slot, fromItem.slot];
                    [fromItem.semester, targetItem.semester] = [targetItem.semester, fromItem.semester];
                    [fromItem.year, targetItem.year] = [targetItem.year, fromItem.year];

                } else {
                    // Move the dragged item to the target slot
                    fromItem.slot = slot;
                    fromItem.semester = semester;
                    fromItem.year = year;
                }
                setTimeout(() => {
                    fromItem.animating = false;
                    if (targetItemIndex !== -1) {
                        items.value[targetItemIndex].animating = false;
                    }
                }, 500);
            }
        };


        return {
            academicYears,
            getItems,
            startDrag,
            onDrop,
            items,
            selectedItemId,
            selectItem,
        };
    }
});

</script>


<style scoped>

.board {
    display: flex;
    justify-content: center;
    flex-direction: column;
}

.semester-label {
    margin: -10px 0; /* Adjust if necessary */
    text-align: left;
    transform: translate(-180px, 69px);
    position: relative; /* Needed for proper positioning of the span */
    font-family: "Roboto Mono", monospace;
    font-optical-sizing: auto;
    font-weight: 200;
    font-style: normal;
    font-size: 1vw;
}

.label-text {
    background-color: #EAEAEA;
    color: grey; 
    padding: 5px; 
    border-radius: 5px; 
}

.academic-year-container {
    background-color: #EAEAEA;
    padding: 5px;
    border-radius: 34px;
    justify-content: center;
    width: auto; /* Adjust width to content or screen size */
    flex-wrap: wrap; /* Allow containers to wrap if needed */
    margin: 15px;
}


.drop-zone-container {
    display: flex; /* This makes the child elements align horizontally */
    justify-content: center; /* This centers the child elements horizontally in the container */
    gap: 13px; /* Adds some space between the drop zones */
    padding: 20px;
    border-radius: 34px;
}

.drop-zone {
    margin: 0; /* Adjust as needed, removed auto margin to allow flexbox centering */
    min-width: 23%; /* Adjust as needed */
    background-color: #E0E0E0;
    padding: 0px;
    border-radius: 16px;
    height: 6.4vw;
    pointer-events: auto;
    z-index: 1;
}

.drag-el {
    background-color: lightskyblue;
    color: white;
    text-align: center;
    padding: 0px;
    margin-bottom: 10px;
    border-radius: 16px;
    outline: none;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    height: 6.6vw;
    transform: translate(0%, -4%);
    z-index: inherit;
    font-family: "Roboto Mono", monospace;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    font-size: 1vw;
}

@keyframes swap-animation {
    0% {
        opacity: 0;
        transform: scale(1.1);
        transform: translate(0%, -7%);
        box-shadow: 0px 0px 8.8px 5px rgba(255,255,255, 0.0);
    }
    50% {
        opacity: 0.5;
        transform: scale(0.98);
        transform: translate(0%, -10%);
        box-shadow: 0px 0px 8.8px 5px rgba(255,255,255, 1);
    }
    100% {
        opacity: 1;
        transform: scale(1.0);
        transform: translate(0%, -4%);
        box-shadow: 0px 0px 8.8px 5px rgba(255,255,255, 0.0);
    }
}

@keyframes pulse-animation {
    0%, 100% {
        transform: scale(1.0) translate(0%, -4%);
        box-shadow: 0px 0px 10px 2px rgba(255, 255, 255, 0.7); /* Glowing effect */
        opacity: 1;
    }
    50% {
        transform: scale(1.01) translate(0%, -6%);
        box-shadow: 0px 0px 10px 13px rgb(255, 255, 255); /* More prominent glow */
        opacity: 0.9;
    }
}


.drag-el.animating {
    animation: swap-animation 0.5s ease-in-out;
}

.drag-el.selected {
    transform: translate(0%, -14%);
    box-shadow: 0px 0px 8.8px 8px rgba(255,255,255, 1);
    animation: pulse-animation 1.5s ease-in-out infinite;
}

/* Custom styling for the element when it is being dragged */
.drag-el:active,
.drag-el:focus {
    outline: none; /* Remove outline */
    box-shadow: 0px 0px 0px 0px rgba(255,255,255, 0);
    opacity: 0.6;
}


.drag-el:nth-last-of-type(1) {
    margin-bottom: 0;
}
</style>