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
                            <div class="text-container">{{ item.title }}</div>
                            <div class="inner-block">
                                {{ item.name }}
                            </div>
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
        const academicYears = ref([1, 2, 3]); // Example: 3 academic years
        

        const selectedItemId = ref(null);
        const items = ref([
            // Example items
            { id: 1110, title: 'INFO1110', name: 'Introduction to Programming', slot: 1, semester: 1, year: 1, color: '#BBDA62' },
            { id: 1113, title: 'INFO1113', name: 'Object-oriented Programming', slot: 1, semester: 2, year: 1, color: '#BBDA62' },
            { id: 1111, title: 'INFO1111', name: 'Computing 1A Professionalism', slot: 4, semester: 1, year: 1, color: '#6ED4FF' },
            { id: 1112, title: 'INFO1112', name: 'Computing 1B OS and Network Platforms', slot: 4, semester: 2, year: 1, color: '#6ED4FF' },
            { id: 2222, title: 'INFO2222', name: 'Computing 2 Usability and Security', slot: 4, semester: 1, year: 2, color: '#6ED4FF' },
            { id: 2823, title: 'COMP2823', name: 'Data Structures and Algorithms (Adv)', slot: 2, semester: 1, year: 2, color: '#F38968' },
            { id: 2017, title: 'COMP2017', name: 'System Programming', slot: 1, semester: 1, year: 2, color: '#F3D568' },
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
    transform: translate(-12.5vw, 4.8vw);
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
    z-index: 10;
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
}


.drop-zone-container {
    display: flex; /* This makes the child elements align horizontally */
    justify-content: center; /* This centers the child elements horizontally in the container */
    gap: 13px;
    padding: 20px;
    border-radius: 34px;
}

.drop-zone {
    margin: 0;
    width: 11vw;
    background-color: #E0E0E0;
    padding: 0px;
    border-radius: 16px;
    height: 6.4vw;
    pointer-events: auto;
    z-index: 1;
    min-width: 11vw;
}

.drag-el {
    align-items: center;
    background-color: lightskyblue;
    color: white;
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
    min-width: 100%;
    
}

.text-container {
    font-family: "Roboto Mono", monospace;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    font-size: 0.9vw;
    transform: translate(7%, 40%);
    min-height: 18%;
    color: rgba(255, 255, 255, 0.90);
    margin-bottom: 0.7vw;
}

.inner-block {
    font-family: "Roboto Mono", monospace;
    font-weight: 300;
    font-style: italic;
    padding: 10px;
    margin-left: 0.2vw;
    margin-right: 0.2vw;
    margin-bottom: 0.2vw;
    margin-bottom: 0.2vw;
    border-radius: 14px; 
    background-color: rgba(255, 255, 255, 0.90);
    text-align: left;
    font-size: 0.8vw;
    color: rgb(55, 55, 55);
    width: 10.6vw;
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
        transform: scale(1.0) translate(0%, -4.5%);
        box-shadow: 0px 0px 10px 2px rgba(255, 255, 255, 0.7); /* Glowing effect */
        opacity: 1;
    }
    50% {
        transform: scale(1.001) translate(0%, -10%);
        box-shadow: 0px 0px 10px 10px rgb(255, 255, 255); /* More prominent glow */
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