<template>
    <div class="description-panel" :class="{ expanded: store.selectedItemId }" :style="{ backgroundColor: getSelectedColor() }">
        <div v-if="showContent">
            <div class="minimize-button" @click.stop="togglePanel">
                <span class="material-symbols-outlined">close</span>
            </div>
            <a class="link-button" :href="`https://www.sydney.edu.au/units/${store.selectedItemId}`" target="_blank">
                <span class="material-symbols-outlined">link</span>
            </a>
            <div class="panel-title">
                {{ selectedItem.id }}: {{ selectedItem.name }}
            </div>
            <div class="pn-content-tab p" :class="{ warning: !selectedItem.pMet }">
                Prerequisites: <br> {{ selectedItem.P }}
            </div>
            <div class="pn-content-tab c" :class="{ warning: !selectedItem.cMet }">
                Corequisites: <br> {{ selectedItem.C }}
            </div>
            <div class="pn-content-tab n" :class="{ warning: !selectedItem.nMet }">
                Prohibitions: <br> {{ selectedItem.N }}
            </div>
            <div class="pn-content-tab s">
                Settings:
                <div class="ignore_warning_button" @click="switchWarning" :class="{ on: selectedItem.ignore_warning }">
                    Ignore warnings: {{ selectedItem.ignore_warning ? "On!" : 'Off' }} 
                </div>
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

      const switchWarning = () => {
        selectedItem.value.ignore_warning = !selectedItem.value.ignore_warning;
        localStorage.setItem('storedItems', JSON.stringify(store.items));
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
        getSelectedColor,
        switchWarning
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

.ignore_warning_button {
    background-color: #949494;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 10px;
    margin-bottom: 0px;
    transition: 0.2s;
    padding: 8px;
    font-size: 15px;
    border: rgba(79, 79, 79, 0.512) solid 2px;
    box-shadow: 0px 3px 5px 0.0px rgba(66, 66, 66, 0.3);
    user-select: none;
}

.ignore_warning_button.on {
    background-color: #13e213da;
    border: 2px solid #15c315da;
    color: rgb(21, 96, 38);
    box-shadow: 0px 0px 10px 0.0px rgb(187, 255, 0);
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
    margin-top: 30px;
}

.pn-content-tab {
    font-family: "Roboto", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-optical-sizing: auto;
    font-weight: 500;
    font-style: normal;
    font-size: 15px;
    border: 2px solid #f1f1f1af;
    background-color: #fffffff8;
    border-radius: 10px;
    min-height: 58px;
    overflow: hidden;
    padding: 12px;
    box-shadow: 0px 2px 8px 0.0px rgba(70, 70, 70, 0.364);
    margin-bottom:10px;
}

.pn-content-tab.warning {
    border: 2px solid #ff0000af;
    background-color: #ffccccf8;
}


.description-panel .material-symbols-outlined{
    background: none;
    border: none;
    font-size: 26px;
    cursor: pointer;
    font-weight: 600;
    transition: 0.1s;
    margin-left: 95%;
    margin-top: 0px;
}

.minimize-button {
    position: absolute;
    top: 12px;
    right: 41px;
}

.minimize-button .material-symbols-outlined {
    color: rgba(255, 255, 255, 0.555);
    transition: 0.2s;
    border-radius: 30%;
    padding:3px;
}

.minimize-button:hover .material-symbols-outlined {
    color: rgb(255, 255, 255);
    background-color: rgba(208, 27, 27, 0.826);
    transition: 0.2s;
    
}

.link-button .material-symbols-outlined {
    position: absolute;
    top: 12px;
    right: 48px;
    color: rgba(255, 255, 255, 0.464);
    transition: 0.1s;
    border-radius: 30%;
    padding:3px;
}

.link-button:hover .material-symbols-outlined {
    color: rgb(255, 255, 255);
    background-color: rgba(29, 26, 115, 0.759);
    transition: 0.1s;
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
}

  </style>
  