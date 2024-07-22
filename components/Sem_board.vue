<template>
    <div class="mainbody">
      <div class="button-container">
        <button class="add-year-button" @click="addAcademicYear">
          <span class="material-symbols-outlined">add</span>
        </button>
        <button class="add-year-button" @click="minusAcademicYear">
          <span class="material-symbols-outlined">remove</span>
        </button>
        <button class="add-year-button" @click="cleanBoard">
          <span class="material-symbols-outlined">delete_sweep</span>
        </button>
      </div>
      <div class="board">
        <AcademicYear
          v-for="year in academicYears"
          :key="`year-${year}`"
          :year="year"
        />
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, watch, onMounted } from 'vue';
  import { store } from '../store';
  
  export default defineComponent({
    setup() {
    const academicYears = ref(loadAcademicYears());

    onMounted(() => {
    // Initial load of academic years from local storage
    academicYears.value = loadAcademicYears();
    });

    const saveToLocalStorage = () => {
        localStorage.setItem('storedItems', JSON.stringify(store.items));
    };


    watch(academicYears, (newVal) => {
    saveAcademicYears(newVal);
    }, { deep: true });

    const addAcademicYear = () => {
        if (academicYears.value.length <= 0) {
            academicYears.value.push(1);
            return;
        }
        const maxYear = Math.max(...academicYears.value);
        academicYears.value.push(maxYear + 1);
    };

    const minusAcademicYear = () => {
        if (academicYears.value.length > 0) {
            academicYears.value.pop();
        }
    };

    const cleanBoard = () => {
        store.items = [];
        store.selectedItemId = null;
        localStorage.clear();
        academicYears.value = loadAcademicYears();
        saveToLocalStorage();
    };

    function loadAcademicYears() {
        if (process.client) {
            return JSON.parse(localStorage.getItem('academicYears')) || [1, 2, 3];
        }
        return [1, 2, 3]; // Default years if not in client
    }

    function saveAcademicYears(years) {
        if (process.client) {
            localStorage.setItem('academicYears', JSON.stringify(years));
        }
    }
  
      return {
        academicYears,
        addAcademicYear,
        minusAcademicYear,
        cleanBoard,
      };
    }
  });
</script>
  


<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap');
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,500,0,0");

.board {
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: auto;
    padding: 10px;
    border-top: solid #747474 2px;
    border-bottom: solid #747474 2px;
}

.mainbody {
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: auto;
    padding: 10px;
}

@media (max-width: 800px) {
    .board {
        padding: 0px;
        padding-top: 3px;
    }
}

.delete-button {
    position: absolute;
    top: 0;
    right: 0;
    background-color: rgba(87, 87, 87, 0.274);
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    opacity: 0.0;
    margin: 4px;
    height: 24px;
    width: 28px;
    
    overflow: hidden;
    transition: 0.2s;
}

.delete-button:hover {
    background-color: rgba(232, 66, 66, 0.888);
    transition: 0.2s;
}

.delete-button .material-symbols-outlined {
    color: rgba(255, 255, 255, 0.85);
    transform: translate(-0.0vw, 0.1vw);
    font-size: 16px;
}

.drag-el:hover .delete-button {
    opacity: 1;
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

.button-container {
    display: flex;
    width: 40%;
    max-height: 40px;
    margin-top: 2px;
    margin-bottom: 10px;
    margin-left: 29.55%;
    /* border: black solid 2px; */
    align-content: space-around;
}

.add-year-button {
    font-size: 10px;
    background-color: #ffffff;
    padding: 5px;
    border-radius: 10px;
    border: solid 2px #2e2e2e;
    justify-content: center;
    cursor: pointer;
    width: 100%;
    margin: 2px;
    transition: 0.3s;
}  

.add-year-button .material-symbols-outlined {
    color: #373737e8;
    transition: 0.3s;
}

.add-year-button:hover {
    border: solid 2px #ff4f04e8;
    transition: 0.3s;
    background-color: #ffbe9833;
}

.add-year-button:hover .material-symbols-outlined {
    color: rgba(255, 64, 0, 0.883);
    transition: 0.3s;
}

.add-year-button:active {
    border: solid 2px #ff7236;
    transition: 0.3s;
    background-color: #ff7d1276;
    transform: scale(0.95);
}

@media (max-width: 800px) {
    .button-container {
        width: 100%;
        margin-left: 0%;
    }
}

</style>
