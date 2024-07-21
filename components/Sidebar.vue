<template>
    <div ref="sidebar" class="side_bar">
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
                <button :class="{ active: isBrowseActive }" class="button-browse" @click="toggleBrowse">
                    <span class="material-symbols-outlined">menu</span>
                </button>
                <button class="button-filter"></button>
                <button class="button-bookmark"></button>
            </div>
            <div class="sb-zone-container">
                <div v-if="isBrowseActive">
                    <div class="browse-content">
                        <div class="category">
                        <h3>Category 1</h3>
                        <p>Temporary content for category 1.</p>
                        </div>
                        <div class="category">
                        <h3>Category 2</h3>
                        <p>Temporary content for category 2.</p>
                        </div>
                        <div class="category">
                        <h3>Category 3</h3>
                        <p>Temporary content for category 3.</p>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div v-if="!searchQuery">
                        <div class="default_board">
                            <span class="material-symbols-outlined">manage_search</span>
                            Search
                            <div class="default_content">Search for every unit at USYD and view detailed information, or browse courses by expanding the browse option</div>
                        </div>
                        <div class="default_board">
                            <span class="material-symbols-outlined">arrow_right_alt</span>
                            Drag
                            <div class="default_content">Drag courses from this search area into the semester you want.</div>
                        </div>
                        <div class="default_board">
                            <span class="material-symbols-outlined">task</span>
                            Progress
                            <div class="default_content">Check your progress on the chosen majors</div>
                        </div>
                        <div class="default_board">
                            <span class="material-symbols-outlined">steppers</span>
                            More
                            <div class="default_content">Saving, sharing and bookmarks coming soon...</div>
                        </div>
                    </div>
                    <div v-else>
                        <div class="item_blk">
                            <div v-for="item in filtered_items"
                                :key="item.id"
                                class="sb-el"
                                :style="{ backgroundColor: getColorForCode(item.id) }"
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

            </div>
        </div>
    </div>
</template>


<script>
import { defineComponent, ref } from 'vue';
import { store } from '../store';
import aggregatedUnits from '../aggregated_units.json';
import aggregatedCourses from '../aggregated_courses.json';


function stringToColorCode(str) {

    if (!str) return 'hsl(0, 0%, 0%)'; // Fallback in case of no string

    let hash = 0;
    for (let i = 0; i < 6; i++) {
      hash = (str.charCodeAt(i) + 1) * 46 + ((hash << 5) - hash);
    }
    const hue = hash % 360; // Ensure the hue is between 0 and 360
    
    // Adjust lightness for yellow hue range (50 to 70 degrees)
    let lightness = 60; // Default lightness
    let saturation = 65; // Default saturation
    
    if (hue >= 50 && hue <= 70) {
      // Adjust yellow to avoid undesirable color
      lightness = 50; 
      saturation = 75;
    } else if ((hue >= 280 && hue <= 320) || (hue >= 330 && hue <= 360)) {
      // Adjust purple and very bright colors to avoid undesirable color
      lightness = 60; 
      saturation = 60;
    }

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export default defineComponent({
    setup() {
        const sidebar = ref(null);
        const searchQuery = ref('');
        const isBrowseActive = ref(false);

        const items = ref(aggregatedUnits);

        const filtered_items = computed(() => {
            if (!searchQuery.value) {
                return items.value.includes("");
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

        const toggleBrowse = () => {
            isBrowseActive.value = !isBrowseActive.value;
        };

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

        const getColorForCode = (code) => {
            return stringToColorCode(code);
        };

        const getSelectedColor = () => {
            if (store.selectedItemId) {
                return stringToColorCode(store.selectedItemId);
            }
            return 'hsl(0, 0%, 0%, 0)';
        };

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
            advancedComputingCoreUnits,
            majorUnits1,
            majorUnits2,
            toggleBrowse,
            isBrowseActive,
            getColorForCode,
            getSelectedColor,
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

.default_board {
    display: flex;
    flex-direction: column;
    font-family: "Roboto", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 600;
    font-style: normal;
    font-size: 24px;
    color: #363636a8;
    background-color: #f7f7f7;
    /* border: 3px solid #989898a8; */
    border-radius: 20px;
    padding-left: 10px;
    padding-right: 10px;
    margin: 0px;
    margin-bottom: 24px;
    text-align: center;
    margin-top: 24px;
    /* box-shadow: 0px 6px 6px 0.0px rgba(133, 133, 133, 0.2); */
}

.default_content {
    font-family: "Roboto", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    margin-top: 5px;
}


.default_board .material-symbols-outlined {
    font-size: 38px;
    color: #363636a8;
    margin-top: 5px;
    margin-bottom: 5px;
}

@media (max-width: 800px) {
  
    .default_board {
        display: flex;
        flex-direction: column;
        font-family: "Roboto", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        font-weight: 600;
        font-style: normal;
        font-size: 20px;
        color: #363636a8;
        background-color: #f7f7f7;
        /* border: 3px solid #989898a8; */
        border-radius: 20px;
        padding:0px;
        margin: 3px;
        margin-bottom: 12px;
        text-align: center;
        /* box-shadow: 0px 6px 6px 0.0px rgba(133, 133, 133, 0.2); */
    }

    .default_content {
        font-family: "Roboto", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        font-weight: 400;
        font-style: normal;
        font-size: 12px;
        margin-top: 2px;
    }


    .default_board .material-symbols-outlined {
        font-size: 38px;
        color: #363636a8;
        margin-top: 5px;
        margin-bottom: 5px;
    }
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
    height: 38px;
    width: 33.3%;
    margin: 4px;
    background-color: #e6e6e6;
    background-size: 100%;
    background-repeat: no-repeat;
    transition: 0.2s;
    box-shadow: 0px 6px 6px 0.0px rgba(133, 133, 133, 0.2);
    border: solid #787878 3px;
}

.button-browse .material-symbols-outlined {
    font-size: 30px;
    margin-top: 0px;
    margin-bottom: 0px;
    margin-left: 0px;
    margin-right: 0px;
    padding: 0px;
    color: #787878;
}

.button-filter {
    border: none;
    border-radius: 10px;
    cursor: pointer;
    height: 38px;
    width: 33.33%;
    margin: 4px;
    background-color: #e6e6e6;
    background-size: 100%;
    background-repeat: no-repeat;
    box-shadow: 0px 6px 6px 0.0px rgba(133, 133, 133, 0.2);
    border: solid #d1d1d1 3px;
}

.button-bookmark {
    border: none;
    border-radius: 10px;
    cursor: pointer;
    height: 38px;
    width: 33.33%;
    margin: 4px;
    background-color: #e6e6e6;
    background-size: 100%;
    background-repeat: no-repeat;
    box-shadow: 0px 6px 6px 0.0px rgba(133, 133, 133, 0.2);
    border: solid #d1d1d1 3px;
}


.button-browse:hover {
    background-color: white;
    transition: 0.1s;
    box-shadow: 0px 6px 6px 0.0px rgba(133, 133, 133, 0.4);
}

.button-browse.active {
    background-color: rgba(204, 255, 143, 0.733);
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
    height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.item_blk {
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
    min-width: 25vw;
    max-width: 25vw;
}

@media (max-width: 800px) {
    .item_blk {
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 5px;
        padding-bottom: 5px;
        min-width: 80vw;
        max-width: 80vw;
    }
}

.sb-el {
    align-content: space-around;
    background-color: lightskyblue;
    color: white;
    border-radius: 20px;
    filter: drop-shadow(0px 4px 2px rgba(124, 124, 124, 0.15));
    min-height: 94px;
    max-height: 94px;
    z-index: inherit;
    cursor: grab;
    border: 3px solid #ffffff8f;
    transition: 0.2s;
    padding-left: 4px;
    padding-right: 4px;
    padding-bottom: 4px;
    margin-bottom: 6px;
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
    font-size: 22px;
    margin-left: 10px;
    min-height: 18%;
    color: rgba(255, 255, 255, 0.90);
}

.sb-inner-block {
    font-family: "Roboto", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 700;
    font-style: normal;
    padding: 8px;
    border-radius: 14px;
    background-color: rgba(255, 255, 255, 0.90);
    text-align: left;
    font-size: 16px;
    line-height: normal;
    color: rgba(55, 55, 55, 0.851);
    width: 100%;
    overflow: hidden;
    word-wrap: break-word;
    height: 54px;
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
    position: relative;
    border: none;
    background: transparent;
    cursor: pointer;
    text-align: center;
    right:1px;
    margin-top: 3px;
    margin-left: -55px;
}

.clear-button .material-symbols-outlined {
    color: rgb(126, 126, 126);
}

.clear-button:hover .material-symbols-outlined {
    color: rgba(252, 52, 52, 0.888);
    transition: 0.2s;
}


</style>
