<template>
    <div ref="sidebar" class="side_bar">
        <div class="description-panel" 
        :class="{ expanded: store.selectedItemId }"
        :style="{ backgroundColor: backgroundColor }">
            <transition name="fade">
            <div v-if="showContent">
                <button class="minimize-button" @click.stop="togglePanel">
                    <span class="material-symbols-outlined">close</span>
                </button>
                <div class="panel-title">
                    {{ selectedItem.id }}
                </div>
                <div class="pn-unit-name"> {{ selectedItem.name }}
                </div>
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
        <div class="db-panel">
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
            <div class="db-control-panel">
                <button class="button-browse"></button>
                <button class="button-filter"></button>
                <button class="button-bookmark"></button>
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
    </div>
</template>


<script>
import { defineComponent, ref } from 'vue';
import { store } from '../store';
import aggregatedUnits from '../aggregated_units.json';
import aggregatedCourses from '../aggregated_courses.json';

export default defineComponent({
    setup() {
        const sidebar = ref(null);
        const searchQuery = ref('');

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

        const advancedComputingCoreUnits = computed(() => {
            const coreIds = aggregatedCourses["Advanced Computing Degree Core"].Core;
            const advancedIds = aggregatedCourses["Advanced Computing Degree Core"].Advanced;
            const degreeUnitIds = coreIds.concat(advancedIds);

            return aggregatedUnits.filter(unit => degreeUnitIds.includes(unit.id));
        });

        const majorUnits1 = computed(() => {
            if (!store.selectedMajor[0]) return [];
            const unitIds = aggregatedCourses[store.selectedMajor[0]].Core.concat(aggregatedCourses[store.selectedMajor[0]].Advanced);
            return aggregatedUnits.filter(unit => unitIds.includes(unit.id));
        });

        const majorUnits2 = computed(() => {
            if (!store.selectedMajor[1]) return [];
            const unitIds = aggregatedCourses[store.selectedMajor[1]].Core.concat(aggregatedCourses[store.selectedMajor[1]].Advanced);
            return aggregatedUnits.filter(unit => unitIds.includes(unit.id));
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

        const MshowContent = ref(false);

        watch(() => store.viewMajor, (newVal, oldVal) => {
            if (newVal !== false && sidebar.value) {
                sidebar.value.scrollTop = 0;
                setTimeout(() => {
                    MshowContent.value = true;
                }, 300); 
            }
            else {
                MshowContent.value = false;
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
            return getTransparentColor(selectedItem.value?.color, 1);
        });

        const clearSearch = () => {
            searchQuery.value = '';
        };

        const viewMajor = computed(() => store.viewMajor);

        const toggleViewMajor = () => {
            store.viewMajor = !store.viewMajor;
        };


        const isDegreeExpanded = ref(false)
        const isMajorExpanded1 = ref(false); 
        const isMajorExpanded2 = ref(false); 

        const toggleDg = () => {
            isDegreeExpanded.value = !isDegreeExpanded.value;
        }

        const toggleMajor1 = () => {
            if (store.selectedMajor[0] != null) isMajorExpanded1.value = !isMajorExpanded1.value;
            console.log(isMajorExpanded1.value);
        }

        const toggleMajor2 = () => {
            if (store.selectedMajor[1] != null) isMajorExpanded2.value = !isMajorExpanded2.value;
            console.log(isMajorExpanded2.value);
        }

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
            MshowContent,
            toggleViewMajor,
            advancedComputingCoreUnits,
            majorUnits1,
            majorUnits2,
            toggleMajor1,
            toggleMajor2,
            isMajorExpanded1,
            isMajorExpanded2,
            toggleDg,
            isDegreeExpanded,
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

* {
  box-sizing: border-box;
}

.db-control-panel {
    display: flex;
    justify-content: space-around;
    margin-bottom: 0px;
    width: 97%;
    align-items: center;
}

.button-browse {
    border: none;
    border-radius: 10px;
    cursor: pointer;
    height: 30px;
    width: 33.3%;
    margin: 4px;
    background-color: #f3ba79;
    background-size: 100%;
    background-repeat: no-repeat;
    transition: 0.2s;
    box-shadow: 0px 6px 6px 0.0px rgba(133, 133, 133, 0.2);
    border: solid #ce671d49 3px;
}

.button-filter {
    border: none;
    border-radius: 10px;
    cursor: pointer;
    height: 30px;
    width: 33.33%;
    margin: 4px;
    background-color: #a3eb52;
    background-size: 100%;
    background-repeat: no-repeat;
    box-shadow: 0px 6px 6px 0.0px rgba(133, 133, 133, 0.2);
    border: solid #23b34268 3px;
}

.button-bookmark {
    border: none;
    border-radius: 10px;
    cursor: pointer;
    height: 30px;
    width: 33.33%;
    margin: 4px;
    background-color: #89ddeb;
    background-size: 100%;
    background-repeat: no-repeat;
    box-shadow: 0px 6px 6px 0.0px rgba(133, 133, 133, 0.2);
    border: solid #1d9cce68 3px;
}

.button-browse:hover {
    background-color: white;
    transition: 0.1s;
}

.search-input::-webkit-search-cancel-button {
    display: none;
}

.side_bar {
    width: 48%;
    height: 98%;
    background-color: #efeeee64;
    border-radius: 35px;
    z-index: 10;
    overflow: auto;
    overflow: hidden;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 10px;
    border: solid #989898 0px;
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

.db-panel {
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: hidden;
    padding: 18px;
    align-items: center;
    border: 8px solid #98989853;
    border-radius: 28px;
}

.sb-zone-container {
    margin-top: 10px;
    width: 100%;
    background-color: none;
    overflow-x: hidden;
    overflow-y: auto;
    padding:10px;
    padding-top: 10px;
    padding-bottom: 10px;
    box-sizing: border-box;
    box-shadow: inset 0px 0px 0px 0px rgba(133, 133, 133, 0.2);
    border-top: solid #9898988a 4px;
    border-bottom: solid #9898988a 4px;
    height: 83%;
}

.sb-el {
    align-content: space-around;
    background-color: lightskyblue;
    color: white;
    border-radius: 20px;
    filter: drop-shadow(0px 4px 2px rgba(124, 124, 124, 0.15));
    min-height: 90px;
    max-height: 90px;
    z-index: inherit;
    cursor: grab;
    border: 3px solid #ffffff8f;
    transition: 0.2s;
    padding-left: 4px;
    padding-right: 4px;
    padding-bottom: 4px;
    margin-bottom: 6px;
    outline: none;
    width: 100%;
    cursor: grab;
    transition: 0.14s;
    user-select: none;
    box-sizing: border-box;
}

.sb-el:active,
.sb-el:focus {
    outline: none;
    box-shadow: 0px 0px 0px 0px rgba(255,255,255, 0);
    opacity: 0.6;
    transition: 0.2s;
    transform: scale(0.98);
}

.sb-el:hover {
    border: 3px solid #2c2c2cb7;
    box-shadow: 0px 0px 0px 1px rgba(255, 255, 255, 0.419);
    transition: 0.2s;
    transform: scale(1.00);
}

.sb-text-container {
    font-family: "Roboto Mono", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-optical-sizing: auto;
    font-weight: 600;
    font-style: normal;
    font-size: 26px;
    margin-left: 10px;
    min-height: 18%;
    color: rgba(255, 255, 255, 0.90);
    box-sizing: border-box;
}

.sb-inner-block {
    font-family: "Roboto", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 700;
    font-style: normal;
    padding: 8px;
    border-radius: 15px;
    background-color: rgba(255, 255, 255, 0.90);
    text-align: left;
    font-size: 14px;
    line-height: normal;
    color: rgba(55, 55, 55, 0.851);
    width: 100%;
    overflow: hidden;
    word-wrap: break-word;
    height: 45.5px;
    box-sizing: border-box;
    box-sizing: border-box;
}

.search-container {
    display: flex;
    align-items: center;
    background-color: #fff; /* Or any color you prefer for the search bar */
    border-radius: 10px; /* Rounded corners for the search bar */
    padding: 5px;
    box-shadow: 0px 1.5px 2.5px rgba(172, 172, 172, 0.236);
    border: 3px solid #9a9a9ab7;
    min-width: 100%;
    box-sizing: border-box;
    margin-bottom: 10px;
}

.search-input {
    background-color: transparent;
    border: none;
    outline: none;
    color: #d5d5d5;
    font-size: 1rem;
    padding-right: 0px;
    min-width: 100%;
    box-sizing: border-box;
    height: 35px;
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

.description-panel {
    border: 5px solid #98989853;
    border-radius: 20px;
    width: 30%;
    min-height: 1px;
    margin-top: 0%;
    margin-bottom: 10px;
    transition: 0.3s;
    overflow: hidden;
    box-sizing: border-box;
}
.description-panel.expanded {
    border: 8px solid #9898985a;
    border-radius: 28px;
    min-width: 100%;
    /* display: flex; */
    min-height: 88.5%;
    transition: 0.4s;
    overflow-y: auto;
    box-shadow: 0px 6px 6px 0.0px rgba(133, 133, 133, 0.2);
}

@media (max-width: 760px) {
    .description-panel.expanded {
        border: 3px solid #989898;
        border-radius: 30px;
        min-width: 100%;
        /* display: flex; */
        min-height: 85.5%;
        transition: 0.4s;
        overflow-y: auto;
        box-shadow: 0px 6px 6px 0.0px rgba(133, 133, 133, 0.2);
    }
}

.panel-title {
    display: flex;
    font-family: "Roboto", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-optical-sizing: auto;
    font-weight: 700;
    font-style: normal;
    font-size: 16px;
    margin-left: 15px;
    margin-top: -20px;
    margin-right: 20px;
    color: #ffffff;
}
.pn-unit-name {
    display: flex;
    font-family: "Roboto", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-optical-sizing: auto;
    font-weight: 700;
    font-style: normal;
    font-size: 22.5px;
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
    font-size: 16px;
    border: 2px solid #f1f1f1af;
    background-color: #ffffffcf;
    border-radius: 8px;
    min-height: 100%;
    margin-left: 3%;
    margin-right: 3%;
    margin-bottom: 5px;
    margin-top: 10px;
    transition: 0.4s;
    overflow: hidden;
    padding: 4%;
    box-shadow: 0px 0px 8px 0.0px rgba(255, 255, 255, 0.2);
    transition: 0.2s;
}

.minimize-button {
    position:relative;
    margin-left: 88%;
    background-color: rgba(0, 0, 0, 0);
    color: rgba(29, 29, 29, 0.725);
    border: none;
    border-radius: 30px;
    cursor: pointer;
    opacity: 1;
    margin-top: 3%;
    height: 0px;
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
