<template>
    <div ref="sidebar" class="side_bar">
        <div class="major-panel" :class="{ view: viewMajor }">
            <transition name="fade">
                <div v-if="store.viewMajor">
                <div class="m-panel-title">
                    Majors:
                </div>
                <button class="minimize-button" @click.stop="toggleMajorPanel">
                    <span class="material-symbols-outlined">close</span>
                </button>
                <div class="pn-content-tab">
                    Major details or other related information
                </div>
                </div>
            </transition>
        </div>
        <div class="description-panel" 
        :class="{ expanded: store.selectedItemId }"
        :style="{ backgroundColor: backgroundColor }">
            <transition name="fade">
            <div v-if="showContent">
                <div class="panel-title">
                    {{ selectedItem.id }}
                </div>
                <div class="pn-unit-name"> {{ selectedItem.name }}
                </div>
                <button class="minimize-button" @click.stop="togglePanel">
                    <span class="material-symbols-outlined">close</span>
                </button>
                <div class="pn-content-tab">
                    Prerequisites: <br> {{ selectedItem.Prerequisites }}
                </div>
                <div class="pn-content-tab">
                    Corequisites: <br> {{ selectedItem.Corequisites }}
                </div>
                <div class="pn-content-tab">
                    Prohibitions: <br> {{ selectedItem.Prohibitions }}
                </div>
                <div class="pn-content-tab">
                    Settings:
                </div>
            </div>
            </transition>
        </div>
        <div class="interaction-block">
            <div class="search-container">
                <span class="material-symbols-outlined">search</span>
                <input
                    class="search-input"
                    type="search"
                    placeholder="search your unit ..."
                    v-model="searchQuery"
                />
                <button v-if="searchQuery" class="clear-button" @click="clearSearch">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
        </div>
        <div class="sb-zone-container">
            <div v-for="item in filtered_items"
                :key="item.id"
                class="sb-el"
                :style="{ backgroundColor: item.color }"
                draggable="true"
                @dragstart="startDrag($event, item)">
                <div class="sb-text-container">{{ item.id }}</div>
                <div class="sb-inner-block">
                    {{ item.name }}
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { defineComponent, ref } from 'vue';
import { store } from '../store';
import aggregatedUnits from '../aggregated_units.json';

export default defineComponent({
    setup() {
        const sidebar = ref(null);
        const searchQuery = ref('');
        // const items = ref([
        //     // Example items
        //     { id: 'INFO1110', name: 'Introduction to Programming', slot: 1, semester: 1, year: 1, color: '#BBDA62' },
        //     { id: 'INFO1113', name: 'Object-oriented Programming', slot: 1, semester: 2, year: 1, color: '#BBDA62' },
        //     { id: 'INFO1111', name: 'Computing 1A Professionalism', slot: 4, semester: 1, year: 1, color: '#6ED4FF' },
        //     { id: 'DATA1001', name: 'Foundations of Data Science', slot: 4, semester: 1, year: 1, color: '#F2A2FF' },
        //     { id: 'ELEC1601', name: 'Introduction to Computer Systems', slot: 4, semester: 1, year: 1, color: '#FF9D9D' },
        //     { id: 'MATH1061', name: 'Mathematics 1A', slot: 4, semester: 1, year: 1, color: '#84C5C1' },
        //     { id: 'MATH1064', name: 'Discrete Mathematics for Computation', slot: 4, semester: 1, year: 1, color: '#84C5C1' },
        //     { id: 'INFO1112', name: 'Computing 1B OS and Network Platforms', slot: 4, semester: 2, year: 1, color: '#6ED4FF' },
        //     { id: 'INFO2222', name: 'Computing 2 Usability and Security', slot: 4, semester: 1, year: 2, color: '#6ED4FF' },
        //     { id: 'COMP2123', name: 'Data Structures and Algorithms', slot: 2, semester: 1, year: 2, color: '#F38968' },
        //     { id: 'COMP2823', name: 'Data Structures and Algorithms (Adv)', slot: 2, semester: 1, year: 2, color: '#F38968' },
        //     { id: 'COMP2017', name: 'System Programming', slot: 1, semester: 1, year: 2, color: '#F3D568' },
        // ]);

        const items = ref(aggregatedUnits);

        const filtered_items = computed(() => {
            if (!searchQuery.value) {
                return items.value;
            }
            const query = searchQuery.value.toLowerCase();
            return items.value.filter(item =>
                item.name.toLowerCase().includes(query) || item.id.toLowerCase().includes(query)
            );
        });

        const hasSelectedItem = computed(() => store.selectedItemId !== null);

        const selectedItem = computed(() => {
            return store.items.find(item => item.id === store.selectedItemId);
        });

        const startDrag = (event, item) => {
            event.dataTransfer.setData('item', JSON.stringify(item));
        };

        const togglePanel = () => {
            if (store.selectedItemId) {
                store.selectedItemId = null;
            }
        };
        

        const showContent = ref(false); 

        watch(() => store.selectedItemId, (newVal, oldVal) => {
            if (newVal !== null && sidebar.value) {
                sidebar.value.scrollTop = 0;
                setTimeout(() => {
                    showContent.value = true;
                }, 300); 
            }
            else {
                showContent.value = false;
            }
        });

        const getTransparentColor = (hexColor, opacity) => {
            if (!hexColor) return 'rgba(0, 0, 0, 0)'; // Fallback in case of no color
            let r = parseInt(hexColor.slice(1, 3), 16);
            let g = parseInt(hexColor.slice(3, 5), 16);
            let b = parseInt(hexColor.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        };

        const backgroundColor = computed(() => {
            return getTransparentColor(selectedItem.value?.color, 0.75);
        });

        const clearSearch = () => {
            searchQuery.value = '';
        };

        const viewMajor = computed(() => store.viewMajor);


        return {
            sidebar,
            filtered_items,
            startDrag,
            hasSelectedItem,
            store,
            togglePanel,
            selectedItem,
            showContent,
            backgroundColor,
            searchQuery,
            clearSearch,
            viewMajor,
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
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,700,0,0");

import 

.search-input::-webkit-search-cancel-button {
    display: none;
}

.side_bar {
    display: flex; /* Use flexbox layout */
    flex-direction: column; /* Stack children vertically */
    align-items: center; /* Center children horizontally */
    justify-content: flex-start; /* Align content to the top */
    width: 25vw;
    height: 85vh;
    background-color: #f6f6f6;
    border-radius: 35px;
    padding: 30px;
    position: fixed;
    left: 50%;
    margin-top: 5vh;
    transform: translate(87%, -15vw);
    z-index: 10;
    overflow-y: auto; /* Allows scrolling for overflow content */
    box-sizing: border-box; /* Includes padding and border in the element's total width and height */
    overflow-x:hidden; /* Allows scrolling for overflow content */
}

.tag-lab {
    border: 2px solid #989898;
    border-radius: 20px;
    min-width: 100%;
    min-height: 20%;
    /* display: flex; */
    max-height: 100%;
    margin-top: 5px;
    margin-bottom: 5px;
    transition: 0.4s;
    overflow-y: auto;
    box-shadow: 0px 6px 6px 0.0px rgba(133, 133, 133, 0.2);
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
    border: 2px solid #989898;
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
    transition: 0.2s;
}

.sb-el:active,
.sb-el:focus {
    outline: none;
    box-shadow: 0px 0px 0px 0px rgba(255,255,255, 0);
    opacity: 0.6;
    transition: 0.2s;
}

.sb-el:hover {
    border: 2.0px solid #525252b7;
    box-shadow: 0px 0px 0px 1px rgba(255, 255, 255, 0.419);
    transition: 0.2s;
}

.sb-text-container {
    font-family: "Roboto Mono", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-optical-sizing: auto;
    font-weight: 700;
    font-style: normal;
    font-size: 0.85vw;
    transform: translate(10%, 40%);
    min-height: 18%;
    color: rgba(255, 255, 255, 0.90);
    margin-bottom: 0.79vw;
}

.sb-inner-block {
    font-family: "Roboto", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 400;
    font-style: normal;
    padding: 10px;
    margin-left: 1.9%;
    margin-right: 0.2vw;
    margin-bottom: 0.2vw;
    border-radius: 12px; 
    background-color: rgba(255, 255, 255, 0.90);
    text-align: left;
    font-size: 0.75vw;
    color: rgb(55, 55, 55);
    width: 96%;
    overflow: hidden;
    word-wrap: break-word;
    height: 65%;
    min-height: 48%;
    box-sizing: border-box;
}

.search-container {
    position: relative;
    display: flex;
    align-items: center;
    background-color: #fff; /* Or any color you prefer for the search bar */
    border-radius: 50px; /* Rounded corners for the search bar */
    padding: 5px;
    box-shadow: 0px 1.5px 2.5px rgba(172, 172, 172, 0.236);
    border: 1.8px solid #9a9a9ab7;
}

.search-input {
    flex: 1;
    background-color: transparent;
    border: none;
    outline: none;
    padding-left: 10px; /* Give some space between the icon and the text */
    color: #b8b8b8;
    font-size: 1rem;
    padding-right: 20px;
    max-width: 83%;
    min-width: 30%;
}

.clear-button {
    position: absolute;
    right: 0%;
    border: none;
    background: transparent;
    cursor: pointer;
    text-align: center;
    margin-top: 2.0%;
    margin-left: -10px;
}

.clear-button:hover .material-symbols-outlined {
    color: rgba(252, 52, 52, 0.888);
    transition: 0.2s;
}

.material-symbols-outlined {
    margin-right: 0px;
    color: rgba(122, 122, 122, 0.747);
    margin-left: 0px;
}


.interaction-block {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 45px;
    max-height: 45px;
    border-radius: 50px;
    flex-direction: row;
    border: 1px solid #989898;
    flex-wrap: wrap;
    justify-content: space-around; 
    width: 100%;
    background-color: #b1b1b156;
    padding: 5px;
    margin: 5px;
    border: 2px solid #989898;
    box-shadow: 0px 6px 6px 0.0px rgba(167, 167, 167, 0.2);
    background-color: none;
}

.interaction-block:hover {
    box-shadow: 0 4px 8px rgba(93, 93, 93, 0.2);
}

.major-panel {
    border: 2px solid #989898;
    border-radius: 20px;
    min-width: 30%;
    min-height: 0px;
    margin-top: -3px;
    margin-bottom: 0px;
    transition: 0.3s;
    overflow: hidden;
    opacity: 0;
}
.major-panel.view {
    border: 2px solid #989898;
    border-radius: 20px;
    min-width: 100%;
    min-height: 70%;
    /* display: flex; */
    max-height: 100%;
    margin-top: -3px;
    margin-bottom: 25px;
    transition: 0.4s;
    overflow-y: auto;
    box-shadow: 0px 6px 6px 0.0px rgba(133, 133, 133, 0.2);
    opacity: 1;
}


.description-panel {
    border: 2px solid #989898;
    border-radius: 20px;
    min-width: 30%;
    min-height: 0px;
    margin-top: -12px;
    margin-bottom: 5px;
    transition: 0.3s;
    overflow: hidden;
}
.description-panel.expanded {
    border: 2px solid #989898;
    border-radius: 20px;
    min-width: 100%;
    min-height: 70%;
    /* display: flex; */
    max-height: 100%;
    margin-top: -3px;
    margin-bottom: 5px;
    transition: 0.4s;
    overflow-y: auto;
    box-shadow: 0px 6px 6px 0.0px rgba(133, 133, 133, 0.2);
}

.m-panel-title {
    display: flex;
    font-family: "Roboto", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-optical-sizing: auto;
    font-weight: 700;
    font-style: normal;
    font-size: 2.0vw;
    margin-left: 15px;
    margin-top: 10px;
    margin-right: 20px;
    color: #ffffff;
}

.panel-title {
    display: flex;
    font-family: "Roboto", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-optical-sizing: auto;
    font-weight: 700;
    font-style: normal;
    font-size: 2.0vw;
    margin-left: 15px;
    margin-top: 10px;
    margin-right: 20px;
    color: #ffffff;
}
.pn-unit-name {
    display: flex;
    font-family: "Roboto", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-optical-sizing: auto;
    font-weight: 700;
    font-style: normal;
    font-size: 2.0vw;
    margin-left: 15px;
    margin-top: 3px;
    margin-right: 20px;
    margin-bottom: 18px;
    color: #ffffff;
}

.pn-content-tab {
    display: flex;
    font-family: "Roboto", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-optical-sizing: auto;
    font-weight: 500;
    font-style: normal;
    font-size: 1vw;
    border: 2px solid #989898;
    background-color: #ffffffcf;
    border-radius: 20px;
    min-height: 100%;
    margin-left: 3%;
    margin-right: 3%;
    margin-bottom: 5px;
    margin-top: 10px;
    transition: 0.4s;
    overflow: hidden;
    padding: 4%;
    box-shadow: 0px 6px 6px 0.0px rgba(133, 133, 133, 0.2);
    transition: 0.2s;
}

.minimize-button {
    position: absolute;
    top: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0);
    color: rgba(29, 29, 29, 0.725);
    border: none;
    border-radius: 30px;
    cursor: pointer;
    opacity: 1;
    margin-right: 33px;
    margin-top: 34px;
    height: 5%;
    width: 10%;
    overflow: visible;
    transition: 0.2s;
}

.minimize-button:hover .material-symbols-outlined {
    color: rgba(252, 52, 52, 0.888);
    transition: 0.2s;
}

.fade-enter-active {
    transition: 0.25s ease;
}
.fade-leave-active {
    transition: 0.01s ease;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
.fade-enter-to, .fade-leave-from {
    opacity: 1;
}


</style>
