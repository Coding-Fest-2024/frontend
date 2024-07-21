<template>
    <div class="drag-el"
         :class="{ 'selected': item.id === store.selectedItemId, animating: item.animating }"
         :style="{ backgroundColor: stringToColorCode(item.id), width: getItemWidth(semester, year) + '%' }"
         draggable="true"
         @click="selectItem(item)"
         @dragstart="startDrag($event, item)">
      <div class="text-container">{{ item.id }}</div>
      <button class="delete-button" @click.stop="deleteItem(item)">
        <span class="material-symbols-outlined">delete</span>
      </button>
      <div class="inner-block">
        {{ item.name }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { store } from '../store';
  
  const props = defineProps({
    item: {
      type: Object,
      required: true
    },
    semester: {
      type: Number,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    getItemWidth: {
      type: Function,
      required: true
    }
  });
  
  const selectItem = (item) => {
    store.selectedItemId = store.selectedItemId === item.id ? null : item.id;
  };
  
  const startDrag = (event, item) => {
    event.dataTransfer.setData('item', JSON.stringify(item));
    store.saveToLocalStorage();
  };
  
  const deleteItem = (itemToDelete) => {
    const index = store.items.findIndex(item => item.id === itemToDelete.id);
    if (store.selectedItemId === itemToDelete.id) {
      store.selectedItemId = null;
    }
    if (index > -1) {
      store.items.splice(index, 1);
    }
    store.saveToLocalStorage();
  };
  
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

  watch(store.items, () => {
    store.saveToLocalStorage();
  }, { deep: true });

  </script>
  
  <style scoped>
  .drag-el {
      align-content: space-around;
      background-color: lightskyblue;
      color: white;
      border-radius: 16px;
      filter: drop-shadow(0px 4px 2px rgba(124, 124, 124, 0.15));
      height:110px;
      z-index: inherit;
      cursor: grab;
      border: 2px solid #ffffff8f;
      transition: 0.2s;
      margin-left: 2px;
      margin-right: 2px;
      border-radius: 16px;
      padding: 4px;
      outline: none;
      min-width: 12%;
      max-width: 24.5%;
      cursor: grab;
      border: 3px solid #ffffff8f;
      transition: 0.14s;
  }
  
  .text-container {
      font-family: "Roboto Mono", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      font-optical-sizing: auto;
      font-weight: 600;
      font-style: normal;
      font-size: 18px;
      margin-left: 7.6px;
      margin-bottom: 3.5px;
      transform: translate(0%, 0%);
      min-height: 18%;
      color: rgba(255, 255, 255, 0.90);
  }
  
  .inner-block {
      font-family: "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      font-weight: 700;
      font-style: normal;
      padding: 8px;
      border-radius: 10px; 
      background-color: rgba(255, 255, 255, 0.90);
      text-align: left;
      font-size: 14px;
      line-height: normal;
      color: rgba(55, 55, 55, 0.851);
      width: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      word-wrap: break-word;
      height: 68px;
      box-sizing: border-box;
  }

  .drag-el:hover {
      border: 3px solid #1d1d1d93;
      box-shadow: 0px 6px 6px 0.0px rgba(133, 133, 133, 0.5);
      transition: 0.15s;
      transform: scale(1.0) translate(0%, -0%);
  }

  @media (max-width: 800px) {
    .text-container {
        margin-left: 8px;
        font-size: 18px;
        margin-bottom: 1px;
    }
    .drag-el {
      background-color: lightskyblue;
      border-radius: 16px;
      filter: drop-shadow(0px 4px 2px rgba(124, 124, 124, 0.15));
      height: 63px;
      z-index: inherit;
      cursor: grab;
      border: 2px solid #ffffff8f;
      transition: 0.2s;
      margin-left: 0px;
      margin-right: 0px;
      margin-top: 0px;
      margin-bottom: 6px;
      border-radius: 16px;
      padding: 4px;
      padding-top: 0px;
      outline: none;
      min-width: 100%;
      max-width: 100%;
      cursor: grab;
      transition: 0.14s;
    }
    .drag-el:hover {
        border: 1.5px solid #000000bf;
    }
    .inner-block {
      font-family: "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      font-weight: 700;
      font-style: normal;
      padding: 8px;
      border-radius: 10px; 
      background-color: rgba(255, 255, 255, 0.90);
      text-align: left;
      font-size: 12px;
      line-height: normal;
      color: rgba(55, 55, 55, 0.851);
      width: 100%;
      overflow: hidden;
      word-wrap:normal;
      height: 30px;
      box-sizing: border-box;
    }
    
}

  
  .drag-el.animating {
      animation: swap-animation 0.5s ease-in-out;
  }
  
  .drag-el.selected {
    box-shadow: 0px 4px 6px 0.0px rgba(133, 133, 133, 0.5);
    cursor: grab;
    transform: scale(1.02);
    transition: 0.1s;
  }
  
  .drag-el:active {
      outline: none;
      box-shadow: 0px 0px 0px 0px rgba(255,255,255, 0);
      opacity: 0.8;
      transition: 0.15s;
      transform: scale(1) translate(-0.0%, -0%);
  }
  
  .drag-el:focus {
      outline: none;
      box-shadow: 0px 0px 0px 0px rgba(255,255,255, 0);
      opacity: 0.8;
      transition: 0.15s;
      transform: scale(1) translate(-0.0%, -0%);
  }
  

  
  .drag-el:hover .delete-button {
      opacity: 1;
  }
  
  .drag-el:nth-last-of-type(1) {
      margin-bottom: 0;
  }
  
  .delete-button {
      position: absolute;
      top: 0;
      right: 0;
      background-color: rgba(73, 70, 70, 0.5);
      color: white;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      opacity: 0.0;
      margin: 4px;
      height: 18px;
      width: 26px;
      overflow: hidden;
      transition: 0.2s;
      display: flex;
  }
  
  .delete-button:hover {
      background-color: rgba(232, 66, 66, 0.888);
      transition: 0.2s;
  }
  
  .delete-button .material-symbols-outlined {
      color: rgba(255, 255, 255, 0.85);
      transform: translate(-0.0vw, 0.1vw);
      font-size: 14px;
  }
  
  @keyframes swap-animation {
      0% {
          opacity: 0;
          transform: scale(0.7) translate(-0.0%, -7%);
          box-shadow: 0px 0px 8.8px 5px rgba(255,255,255, 0.0);
      }
      50% {
          opacity: 0.5;
          transform: scale(1.02) translate(-0.0%, -10%);
          box-shadow: 0px 0px 8.8px 5px rgba(255,255,255, 1);
      }
      100% {
          opacity: 1;
          transform: scale(1) translate(-0.0%, 0%);
          box-shadow: 0px 0px 8.8px 5px rgba(255,255,255, 0.0);
      }
  }


  </style>
  