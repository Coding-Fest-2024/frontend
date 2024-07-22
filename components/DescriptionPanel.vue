<template>
    <div class="description-panel" :class="{ expanded: store.selectedItemId }" :style="{ backgroundColor: getSelectedColor() }">
        <div v-if="showContent">
          <div class="minimize-button" @click.stop="togglePanel">
            <span class="material-symbols-outlined">close</span>
          </div>
          <div class="panel-title">
            {{ selectedItem.id }}: {{ selectedItem.name }}
          </div>
          <div class="pn-content-tab">
            Prerequisites: <br> {{ selectedItem.P }}
          </div>
          <div class="pn-content-tab">
            Corequisites: <br> {{ selectedItem.C }}
          </div>
          <div class="pn-content-tab">
            Prohibitions: <br> {{ selectedItem.N }}
          </div>
          <div class="pn-content-tab">
            Settings:
          </div>
        </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, computed, ref } from 'vue';
  import { store } from '../store';

  function stringToColorCode(str) {
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
      const showContent = ref(false);
  
      const selectedItem = computed(() => {
        return store.items.find(item => item.id === store.selectedItemId);
      });
  
      const togglePanel = () => {
        if (store.selectedItemId) {
          store.selectedItemId = null;
        }
      };
  
      const getSelectedColor = () => {
        if (store.selectedItemId) {
          return stringToColorCode(store.selectedItemId);
        }
        return 'hsl(0, 0%, 0%, 0)';
      };
  
      watch(() => store.selectedItemId, (newVal, oldVal) => {
        if (newVal !== null) {
          setTimeout(() => {
            showContent.value = true;
          }, 300);
        } else {
          showContent.value = false;
        }
      });
  
      return {
        store,
        showContent,
        selectedItem,
        togglePanel,
        getSelectedColor
      };
    }
  });
  </script>
  
  <style scoped>

@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,500,0,0");
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap');
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,500,0,0");
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,500,0,0");
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,700,0,0");

.description-panel {
    position: fixed;
    right: -600px; /* Start off-screen */
    top: 0;
    width: 400px;
    height: 97.5vh;
    background-color: rgb(0, 0, 0);
    transition: right 0.5s ease;
    transition: 0.5s;
    overflow-y: auto;
    z-index: 1000;
    padding: 20px;
    border-radius: 30px;
    border: 5px solid #ffffff65;
    margin: 10px;
}
.description-panel.expanded {
  right: 0; /* Slide in */
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
}



.panel-title {
    font-family: "Roboto", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-optical-sizing: auto;
    font-weight: 700;
    font-style: normal;
    font-size: 28px;
    color: #ffffff;
    max-width: 100%;
    margin-bottom: 15px;
    margin-top: 15px;
}

.pn-content-tab {
    font-family: "Roboto", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-optical-sizing: auto;
    font-weight: 500;
    font-style: normal;
    font-size: 15px;
    border: 2px solid #f1f1f1af;
    background-color: #fffffff8;
    border-radius: 8px;
    min-height: 100%;
    overflow: hidden;
    padding: 12px;
    box-shadow: 0px 0px 8px 0.0px rgba(255, 255, 255, 0.2);
    margin-bottom:10px;
}


.description-panel .material-symbols-outlined{
    background: none;
    border: none;
    font-size: 22px;
    cursor: pointer;
    font-weight: bold;
    position: relative;
    font-variation-settings:
    'FILL' 0,
    'wght' 700,
    'GRAD' 0,
    'opsz' 24;
    transition: 0.2s;
    margin-left: 95%;
    margin-top: 0px;
    margin-bottom: -200px;
}

.minimize-button .material-symbols-outlined {
    color: rgb(255, 255, 255);
    transition: 0.2s;
}

.minimize-button:hover .material-symbols-outlined {
    color: rgba(252, 52, 52, 0.888);
    transition: 0.2s;
}

@media (max-width: 800px) {
    .description-panel {
        position: fixed;
        left: -100vw; /* Start off-screen */
        top: 0;
        width: 100%;
        height: 100vh;
        background-color: white;
        transition: left 0.3s ease;
        transition: 0.3s;
        overflow-y: auto;
        z-index: 1000;
        border-radius: 0px;
        border: none;
        margin: 0px;
    }
    .description-panel.expanded {
        left: 0;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
    }
    .description-panel .material-symbols-outlined{
        background: none;
        border: none;
        font-size: 22px;
        cursor: pointer;
        font-weight: bold;
        position: relative;
        font-variation-settings:
        'FILL' 0,
        'wght' 700,
        'GRAD' 0,
        'opsz' 24;
        transition: 0.2s;
        margin-left: 96%;
        margin-top: -3px;
        margin-bottom: -200px;
    }
}

  </style>
  