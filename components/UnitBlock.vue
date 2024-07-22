<template>
  <div class="drag-el"
       :class="{ 'selected': item.id === store.selectedItemId, animating: item.animating, warning: checkForConflict(item) }"
       :style="{ backgroundColor: stringToColorCode(item.id), width: getItemWidth(semester, year) + '%' }"
       draggable="true"
       @click="selectItem(item)"
       @dragstart="startDrag($event, item)">
    <div class="text-container">{{ item.id }}</div>
    <span class="material-symbols-outlined delete-button" @click.stop="deleteItem(item)">delete</span>
    <div class="inner-block">
      {{ item.name }}
    </div>
    <span v-if="checkForConflict(item)" class="material-symbols-outlined warning-icon">error</span>
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

  const saveToLocalStorage = () => {
    localStorage.setItem('storedItems', JSON.stringify(store.items));
  };
  
  const selectItem = (item) => {
    store.selectedItemId = store.selectedItemId === item.id ? null : item.id;
  };
  
  const startDrag = (event, item) => {
    event.dataTransfer.setData('item', JSON.stringify(item));
    saveToLocalStorage();
  };
  
  const deleteItem = (itemToDelete) => {
    const index = store.items.findIndex(item => item.id === itemToDelete.id);
    if (store.selectedItemId === itemToDelete.id) {
      store.selectedItemId = null;
    }
    if (index > -1) {
      store.items.splice(index, 1);
    }
    saveToLocalStorage();
  };

  const expandWildcards = (code) => {
    const expandCode = (code, index) => {
      const results = [];
      const charArray = code.split('');
      
      if (index >= charArray.length) {
        return [charArray.join('')];
      }

      if (charArray[index] === 'X') {
        for (let i = 0; i <= 9; i++) {
          charArray[index] = i.toString();
          results.push(...expandCode(charArray.join(''), index + 1));
        }
      } else {
        results.push(...expandCode(charArray.join(''), index + 1));
      }
      
      return results;
    };
    
    return expandCode(code, 0);
  };


  const buildLogicalExpression = (reqString) => {
    let expression = reqString;

    const wildcardPattern = /\b(\w{4}\d*X\d*)\b/g;
    expression = expression.replace(wildcardPattern, (match) => {
      const expandedCodes = expandWildcards(match);
      return `(${expandedCodes.map(code => `(${code})`).join(' || ')})`;
    });

    // Replace AND/OR with JavaScript logical operators, considering extra spaces for safety
    expression = expression.replace(/\band\b/g, '&&').replace(/\bor\b/g, '||');
    // Replace brackets for logical grouping
    expression = expression.replace(/\[/g, '(').replace(/\]/g, ')');
    expression = expression.replace(/\{/g, '(').replace(/\}/g, ')');

    // do the invalid checking before wrapping
    const invalidPattern = /\b(?!(&&|\|\||\(|\)|\b\w{4}\d{4}\b)\b)\b\w+\b/g;
    expression = expression.replace(invalidPattern, 'false ||');

    const codePattern = /\b(\w{4}\d{4})\b/g;
    expression = expression.replace(codePattern, (match) => {
      return `completedUnits.includes("${match}")`;
    });

    return expression;
  };

  const completedUnits = [];

  const checkForConflict = (item) => {

    completedUnits = store.items.map(item => item.id);

    if (!item.P && !item.C && !item.N) {
      return false;
    }

    const isCompletedBefore = (unitId, currentYear, currentSemester) => {
      return store.items.some(planItem => planItem.id === unitId && (
        planItem.year < currentYear || (planItem.year === currentYear && planItem.semester < currentSemester)
      ));
    };

    const isCompletedBeforeOrSame = (unitId, currentYear, currentSemester) => {
      return store.items.some(planItem => planItem.id === unitId && (
        planItem.year < currentYear || (planItem.year === currentYear && planItem.semester <= currentSemester)
      ));
    };

    let prerequisites = item.P ? buildLogicalExpression(item.P) : '';
    let corequisites = item.C ? buildLogicalExpression(item.C) : '';
    let prohibitions = item.N ? buildLogicalExpression(item.N) : '';

    const evalWithReplacements = (expression, isCompletedFn) => {

      const exp = expression.replace(/completedUnits\.includes\("(\w{4}\d{4})"\)/g, (match, p1) => isCompletedFn(p1, item.year, item.semester))

      try {
          return eval(exp);
      } catch (error) {
        console.error('Error evaluating expression:', expression, error);
        return false;
      }
    };

    let prereqMet = prerequisites ? evalWithReplacements(prerequisites, isCompletedBefore) : true;
    let coreqMet = corequisites ? evalWithReplacements(corequisites, isCompletedBeforeOrSame) : true;
    let prohibitionMet = prohibitions ? !eval(prohibitions) : true;

    return !(prereqMet && coreqMet && prohibitionMet);
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
      transition: 0.18s;
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
      border: 3px solid #282828;
      box-shadow: 0px 6px 6px 0.0px rgba(133, 133, 133, 0.5);
      transition: 0.15s;
      transform: scale(1.0) translate(0%, -0%);
  }

  .warning-icon {
    position: absolute;
    bottom: 0px;
    right: 0%;
    color: #ffffff;
    font-size: 30px;
    padding: 2px;
    padding-bottom: 0px;
    padding-right: 0px;
    background-color: rgba(248, 80, 13, 0.894);
    border-top-left-radius: 18px;
    border-bottom-right-radius: 12px;
    font-weight: 500;
  }

  .drag-el.warning {
    border: 3px solid rgba(248, 80, 13, 0.894);
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
      height: 65px;
      z-index: inherit;
      cursor: grab;
      border: 3px solid #ffffff8f;
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
      animation: swap-animation 0.3s ease-in-out;
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
    padding:2px;
    padding-left: 5px;
    padding-right: 5px;
    overflow: hidden;
    transition: 0.2s;
    display: flex;
    font-size: 20px;
    position: absolute;
    font-weight: 300;
  }
  
  .delete-button:hover {
      background-color: rgba(232, 66, 66, 0.888);
      transition: 0.2s;
  }
  
  
  @keyframes swap-animation {
      0% {
          opacity: 0;
          transform: scale(0.7) translate(-0.0%, -10%);
          box-shadow: 0px 0px 8.8px 5px rgba(255,255,255, 0.0);
      }
      50% {
          opacity: 0.5;
          transform: scale(1.02) translate(-0.0%, -8%);
          box-shadow: 0px 0px 8.8px 5px rgba(255,255,255, 1);
      }
      100% {
          opacity: 1;
          transform: scale(1) translate(-0.0%, 0%);
          box-shadow: 0px 0px 8.8px 5px rgba(255,255,255, 0.0);
      }
  }


  </style>
  