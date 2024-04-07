<template>
    <div ref="sidebar" class="side_bar">
        <div class="description-panel"></div>
        <div class="interaction-block">
            <span class="material-symbols-outlined">
                search
            </span>
            <t-input
                id="SearchBar"
                clearable
                size="medium"
                placeholder="search your unit"
                align="left"
                variant="outline" theme="default"
                type="search"
            />
        </div>
        <div class="sb-zone-container">
            <div v-for="item in items"
                :key="item.id"
                class="sb-el"
                :style="{ backgroundColor: item.color }"
                draggable="true"
                @dragstart="startDrag($event, item)">
                <div class="sb-text-container">{{ item.title }}</div>
                <div class="sb-inner-block">
                    {{ item.name }}
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { defineComponent, ref } from 'vue';


export default defineComponent({
    setup() {
        const academicYears = ref([1]); // Example: 3 academic years
        

        const items = ref([
            // Example items
            { id: 1110, title: 'INFO1110', name: 'Introduction to Programming', slot: 1, semester: 1, year: 1, color: '#BBDA62' },
            { id: 1113, title: 'INFO1113', name: 'Object-oriented Programming', slot: 1, semester: 2, year: 1, color: '#BBDA62' },
            { id: 1111, title: 'INFO1111', name: 'Computing 1A Professionalism', slot: 4, semester: 1, year: 1, color: '#6ED4FF' },
            { id: 1001, title: 'DATA1001', name: 'Foundations of Data Science', slot: 4, semester: 1, year: 1, color: '#F2A2FF' },
            { id: 1601, title: 'ELEC1601', name: 'Introduction to Computer Systems', slot: 4, semester: 1, year: 1, color: '#FF9D9D' },
            { id: 1061, title: 'MATH1061', name: 'Mathematics 1A', slot: 4, semester: 1, year: 1, color: '#84C5C1' },
            { id: 1064, title: 'MATH1064', name: 'Discrete Mathematics for Computation', slot: 4, semester: 1, year: 1, color: '#84C5C1' },
            { id: 1112, title: 'INFO1112', name: 'Computing 1B OS and Network Platforms', slot: 4, semester: 2, year: 1, color: '#6ED4FF' },
            { id: 2222, title: 'INFO2222', name: 'Computing 2 Usability and Security', slot: 4, semester: 1, year: 2, color: '#6ED4FF' },
            { id: 2123, title: 'COMP2123', name: 'Data Structures and Algorithms', slot: 2, semester: 1, year: 2, color: '#F38968' },
            { id: 2823, title: 'COMP2823', name: 'Data Structures and Algorithms (Adv)', slot: 2, semester: 1, year: 2, color: '#F38968' },
            { id: 2017, title: 'COMP2017', name: 'System Programming', slot: 1, semester: 1, year: 2, color: '#F3D568' },
        ]);


        const startDrag = (event, item) => {
            event.dataTransfer.setData('item', JSON.stringify(item));
        };

        return {
            items,
            startDrag
        };
    }
});

</script>


<style>

@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,500,0,0");
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap');
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,500,0,0");
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,500,0,0");


.side_bar {
    display: flex; /* Use flexbox layout */
    flex-direction: column; /* Stack children vertically */
    align-items: center; /* Center children horizontally */
    justify-content: flex-start; /* Align content to the top */
    width: 25vw;
    height: 47vw;
    background-color: #f6f6f6;
    border-radius: 35px;
    padding: 30px;
    position: fixed;
    left: 50%;
    transform: translate(87%, -18%);
    z-index: 0;
    overflow-y: auto; /* Allows scrolling for overflow content */
    box-sizing: border-box; /* Includes padding and border in the element's total width and height */
    overflow-x:hidden; /* Allows scrolling for overflow content */
}

.sb-zone-container {
    display:ruby;
    flex-wrap: wrap;
    justify-content: space-around; 
    gap: 5px; 
    width: 100%;
    background-color: #b1b1b156;
    padding: 5px;
    border-radius: 28px;
    margin: 5px;
    border: 1px solid #989898;
    box-shadow: 0px 6px 6px 0.0px rgba(133, 133, 133, 0.2);
    background-color: none;
    padding-top: 1.2vw;
    padding-bottom: 1.2vw;
}
.sb-zone-container:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.sb-el {
    align-items: center;
    background-color: lightskyblue;
    color: white;
    margin: 10px;
    border-radius: 16px;
    outline: none;
    filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1));
    height: 5.9vw;
    transform: translate(0%, -0%);
    z-index: inherit;
    font-family: "Roboto Mono", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    font-size: 1vw;
    min-width: 8vw;
    max-width: 8vw;
    cursor: grab;
    border: 2px solid #ffffff8f;
}

.sb-el:active,
.sb-el:focus {
    outline: none;
    box-shadow: 0px 0px 0px 0px rgba(255,255,255, 0);
    opacity: 0.6;
}

.sb-el:hover {
    border: 2.5px solid #525252b7;
    box-shadow: 0px 0px 0px 1px rgba(255, 255, 255, 0.419);
}

.sb-text-container {
    font-family: "Roboto Mono", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-optical-sizing: auto;
    font-weight: 700;
    font-style: normal;
    font-size: 0.9vw;
    transform: translate(10%, 40%);
    min-height: 18%;
    color: rgba(255, 255, 255, 0.90);
    margin-bottom: 0.7vw;
}

.sb-inner-block {
    font-family: "Roboto", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 400;
    font-style: normal;
    padding: 10px;
    margin-left: 0.2vw;
    margin-right: 0.2vw;
    margin-bottom: 0.2vw;
    margin-bottom: 0.2vw;
    border-radius: 14px; 
    background-color: rgba(255, 255, 255, 0.90);
    text-align: left;
    font-size: 0.75vw;
    color: rgb(55, 55, 55);
    width: 7.57vw;
    overflow: hidden;
    word-wrap: break-word;
    height: 65%;
    min-height: 48%;
    box-sizing: border-box;
}

#SearchBar {
    width: 55%;
    font-family: "Roboto Mono", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-optical-sizing: auto;
    font-weight: 700;

}

.interaction-block {
    display: flex;
    align-items: start;
    width: 100%;
    min-height: 45px;
    border-radius: 50px;
    flex-direction: column; /* Stack elements vertically */
    border: 1px solid #989898;
    flex-wrap: wrap;
    justify-content: space-around; 
    width: 100%;
    background-color: #b1b1b156;
    padding: 5px;
    margin: 5px;
    border: 1px solid #989898;
    box-shadow: 0px 6px 6px 0.0px rgba(167, 167, 167, 0.2);
    background-color: none;
}

.interaction-block:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.interaction-block .material-symbols-outlined {
    color: rgb(122, 122, 122);
    margin-left: 15%;
    margin-right: -18%;
}

.description-panel {
    border: 1px solid #989898;
    border-radius: 20px;
    min-width: 90%;
    min-height: 1.5px;
    margin-top: -0px;
    margin-bottom: 5px;
    transition: 0.2s;
}
.description-panel:hover{
    border: 1px solid #989898;
    border-radius: 20px;
    min-width: 100%;
    min-height: 100%;
    margin-top: 0px;
    margin-bottom: 5px;
    transition: 0.3s;
}
</style>
