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
        <t-button id="add-button" class="add-year-button" @click="addAcademicYear" size="large" shape="round" theme="default">
            +
        </t-button>
    </div>
</template>


<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup() {
        const academicYears = ref([1, 2, 3]); // Example: 3 academic years
        

        const selectedItemId = ref(null);
        const items = ref([]);

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
            const fromItemIndex = items.value.findIndex(item => item.id === itemData.id);
            const targetItemIndex = items.value.findIndex(item => item.slot === slot && item.semester === semester && item.year === year);

            if (fromItemIndex === -1 && targetItemIndex !== -1) {
                console.log("Drop cancelled: Slot is occupied.");
                return;
            }

            // const existingItem = items.value.find(item => item.id === itemData.id && item.semester === semester && item.year === year && item.slot === slot);
            if (!fromItem) {
                itemData.slot = slot;
                itemData.semester = semester;
                itemData.year = year;
                items.value.push(itemData);
                itemData.animating = true;
                setTimeout(() => {
                        itemData.animating = false;
                        if (targetItemIndex !== -1) {
                            items.value[targetItemIndex].animating = false;
                        }
                    }, 500);
            }
            if (fromItem) {
                // Find if the drop target is within the main board or sidebar
                const targetIsSidebar = event.currentTarget.classList.contains('side_bar');
                {
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
            }
        };

        const addAcademicYear = () => {
            const maxYear = Math.max(...academicYears.value);
            academicYears.value.push(maxYear + 1);
        };


        return {
            academicYears,
            getItems,
            startDrag,
            onDrop,
            items,
            selectedItemId,
            selectItem,
            addAcademicYear
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
    margin: -10px 0;
    text-align: left;
    transform: translate(-12.5vw, 4.8vw);
    position: relative;
    font-family: "Roboto Mono", monospace;
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
    font-family: "Roboto Mono", monospace;
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
}


.drop-zone-container {
    display: flex; 
    justify-content: center;
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
    cursor: grab;
    
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
    font-style: normal;
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
        transform: scale(1.0) translate(0%, -7%);
        box-shadow: 0px 4px 4px 2px rgba(255, 255, 255, 0.6); /* Glowing effect */
        opacity: 1;
        border: 1px solid #5c5c5cb7;
    }
    50% {
        transform: scale(1.001) translate(0%, -7%);
        box-shadow: 0px 0px 10px 7px rgb(255, 255, 255);
        opacity: 0.9;
        border: 1px solid #525252b7;
    }
}


.drag-el.animating {
    animation: swap-animation 0.5s ease-in-out;
}

.drag-el.selected {
    transform: translate(0%, -14%);
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