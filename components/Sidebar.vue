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
                <!-- <button class="button-filter"></button> -->
                <button class="button-bookmark"></button>
            </div>
            <div class="filter-container" v-if="selectedTable" :style="{ backgroundColor: getColorForTable(selectedTable) }">
                <span>{{ selectedTable.replace(/_/g, ' ') }}</span>
                <button class="material-symbols-outlined" @click="clearFilter">clear</button>
            </div>
            <div class="sb-zone-container">
                <div v-if="isBrowseActive">
                    <div class="browse-content">
                        <div v-for="i in tables" :key="i" class="table-item" :style="{ backgroundColor: getColorForTable(i) }" @click="selectTable(i)">
                            {{ i.replace(/_/g, ' ') }}
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div v-if="searchQuery===``&&selectedTable===``">
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
                                :class="{ inplan: isInPlan(item.id) }"
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
import tableData from '../tables.json';


function stringToColorCode(str) {

    if (!str) return 'hsl(0, 0%, 0%)';

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

function stringToColorCodeTV(str) {

    if (!str) return 'hsl(0, 0%, 0%)';

    let hash = 0;
    for (let i = 0; i < 4; i++) {
    hash = (str.charCodeAt(i)) * 47 + ((hash << 3) - hash);
    }
    const hue = hash % 360;

    let lightness = 80; // Default lightness
    let saturation = 60; // Default saturation


    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export default defineComponent({
    setup() {
        const sidebar = ref(null);
        const searchQuery = ref('');
        const isBrowseActive = ref(false);
        const selectedTable = ref('');

        const items = ref(aggregatedUnits);
        const tables = ref(tableData);
        
        const filtered_items = computed(() => {
            let result = items.value;
            if (searchQuery.value) {
                const query = searchQuery.value.toLowerCase();
                result = result.filter(item =>
                    item.name.toLowerCase().includes(query) || item.id.toLowerCase().includes(query)
                );
            }
            if (selectedTable.value) {
                result = result.filter(item => item.Belonging.includes(selectedTable.value));
            }
            return result.sort((a, b) => a.id[4].localeCompare(b.id[4]));
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
            if (!isInPlan(code))
                return stringToColorCode(code);
        };

        const getColorForTable = (code) => {
            return stringToColorCodeTV(code);
        };

        const getSelectedColor = () => {
            if (store.selectedItemId) {
                return stringToColorCode(store.selectedItemId);
            }
            return 'hsl(0, 0%, 0%, 0)';
        };

        const isInPlan = (id) => {
            for (let i = 0; i < store.items.length; i++) {
                if (store.items[i].id === id) {
                    // console.log(store.items[i].id);
                    return true;
                }
            }
            return false;
        };

        const selectTable = (table) => {
            selectedTable.value = table;
            isBrowseActive.value = false;
        };

        const clearFilter = () => {
            selectedTable.value = '';
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
            toggleBrowse,
            isBrowseActive,
            isInPlan,
            getColorForCode,
            getColorForTable,
            getSelectedColor,
            tables,
            selectedTable,
            selectTable,
            clearFilter
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
    font-size: 20px;
    color: #121212a8;
    /* border: 3px solid #989898a8; */
    padding-left: 10px;
    padding-right: 10px;
    margin: 0px;
    text-align: center;
    margin-top:20px;
    margin-bottom: 30px;
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
    font-weight:100;
    font-size: 30px;
    color: #363636a8;
    margin-top: 5px;
    margin-bottom: 5px;
}

.table-item {
    font-family: "Roboto", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 500;
    font-style: normal;
    font-size: 14.2px;
    overflow: hidden;
    color: #1f1f1fcd;
    border: 2px solid #262626ac;
    border-radius: 20px;
    padding: 15px;
    width: 100%;
    min-height: 50px;
    margin-top: 8px;
    margin-bottom: 8px;
    box-shadow: 0px 6px 4px 0.0px rgba(133, 133, 133, 0.15);
    transition: 0.2s;
    cursor: pointer;
    user-select: none;
}

.table-item:hover {
    box-shadow: 0px 6px 8px 0.0px rgba(133, 133, 133, 0.8);
    transition: 0.2s;
}

.filter-container {
    font-family: "Roboto", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 500;
    font-style: normal;
    font-size: 14.2px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
    margin-bottom: 2px;
    padding: 5px;
    padding-left: 15px;
    border: 2px solid #262626ac;
    border-radius: 20px;
    background-color: #f7f7f7;
    width: 100%;
    font-size: 14px;
    color: #1f1f1fcd;
    box-shadow: 0px 6px 4px 0.0px rgba(133, 133, 133, 0.2);
}

.filter-container:hover {
    box-shadow: 0px 6px 8px 0.0px rgba(133, 133, 133, 0.8);
    transition: 0.2s;
}

.filter-container button {
    border: none;
    background-color: #ffffff00;
    color: rgb(56, 56, 56);
    border-radius: 14px;
    padding: 2px;
    cursor: pointer;
    transition: 0.2s;
}

.filter-container button:hover {
    background-color: #ff4f4f;
    color: white;
    transition: 0.2s;
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
    width: 100%;
    align-items: center;
    padding-top: 4px;
    border-top: solid #9898988a 3px;
}

.button-browse {
    border: none;
    border-radius: 10px;
    cursor: pointer;
    height: 32px;
    width: 50%;
    margin: 2px;
    background-color: #e6e6e6;
    background-size: 100%;
    background-repeat: no-repeat;
    transition: 0.2s;
    box-shadow: 0px 4px 6px 0.0px rgba(133, 133, 133, 0.2);
    border: solid #787878 2.5px;
}

.button-browse .material-symbols-outlined {
    font-size: 26px;
    margin-top: 0px;
    margin-bottom: 0px;
    margin-left: 0px;
    margin-right: 0px;
    padding: 0px;
    color: #787878;
}


.button-bookmark {
    border: none;
    border-radius: 10px;
    cursor: pointer;
    height: 32px;
    width: 50%;
    margin: 3px;
    background-color: #e6e6e6;
    background-size: 100%;
    background-repeat: no-repeat;
    box-shadow: 0px 4px 6px 0.0px rgba(133, 133, 133, 0.2);
    border: solid #d1d1d1 2.5px;
}


.button-browse:hover {
    background-color: white;
    transition: 0.1s;
    box-shadow: 0px 4px 6px 0.0px rgba(68, 68, 68, 0.4);
}

.button-browse.active {
    background-color: rgba(198, 255, 128, 0.687);
    transition: 0.1s;
}

.search-input::-webkit-search-cancel-button {
    display: none;
}

.side_bar {
    width: 45%;
    max-width: 410px;
    height: 100%;
    background-color: #efeeee64;
    border-radius: 28px;
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
    border: 6px solid #98989853;
    border-radius: 28px;
}

.sb-zone-container {
    margin-top: 5.5px;
    width: 100%;
    background-color: none;
    overflow-x: hidden;
    overflow-y: auto;
    padding:10px;
    padding-top: 10px;
    padding-bottom: 10px;
    box-sizing: border-box;
    box-shadow: inset 0px 0px 0px 0px rgba(133, 133, 133, 0.2);
    border-top: solid #9898988a 3px;
    border-bottom: solid #9898988a 3px;
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
    width: 25vw;
    max-width: 350px;
}

@media (max-width: 800px) {
    .item_blk {
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 5px;
        padding-bottom: 5px;
        width: 80vw;
        max-width: 350px;
    }
    .db-panel {
        border: 4px solid #98989853;
        border-radius: 20px;
    }
    .side_bar {
        padding:0px;
        border-radius: 20px;
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

.sb-el.inplan {
    background-color: #868686;
    transition: 0.15s;
}

.sb-el.inplan .sb-inner-block {
    background-color: #c5c5c5;
    color: rgba(55, 55, 55, 0.545);
}

.search-container {
    display: flex;
    align-items: center;
    background-color: #fff; /* Or any color you prefer for the search bar */
    border-radius: 10px; /* Rounded corners for the search bar */
    padding: 5px;
    box-shadow: 0px 1.5px 2.5px rgba(172, 172, 172, 0.236);
    border: 2.5px solid #000000b7;
    min-width: 100%;
    box-sizing: border-box;
    margin-bottom: 10px;
}

.search-input {
    background-color: transparent;
    border: none;
    outline: none;
    color: #242424;
    font-size: 1rem;
    padding-right: 0px;
    min-width: 97%;
    box-sizing: border-box;
    height: 35px;
    margin-left: 10px;
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
    color: rgb(0, 0, 0);
}

.clear-button:hover .material-symbols-outlined {
    color: rgba(252, 52, 52, 0.888);
    transition: 0.2s;
}


</style>
