<template>
    <div class="academic-year-container">
      <div class="yr-tag">
        <span class="material-symbols-outlined" @click="showSettings">settings_applications</span>
        <div>Year#{{ year }}</div>
      </div>
      <Semester
        v-for="semester in sortedSemesters"
        :key="`year-${year}-semester-${semester}`"
        :semester="semester"
        :year="year"
      />
      <Modal :isVisible="isModalVisible" @close="isModalVisible = false">
        <SettingsContent :year="year" @update-semesters="updateSemesters" />
      </Modal>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue';
  import { store } from '../store';
  import SettingsContent from './SettingsContent.vue';
  import Semester from './Semester.vue';
  import Modal from './Modal.vue';
  
  const props = defineProps({
    year: {
      type: Number,
      required: true
    }
  });
  
  const isModalVisible = ref(false);
  const selectedSemesters = ref(loadSemesterSettings(props.year));
  
  const showSettings = () => {
    isModalVisible.value = true;
  };
  
  const updateSemesters = (semesters) => {
    selectedSemesters.value = semesters;
    saveSemesterSettings(props.year, semesters);
  };
    
  watch(selectedSemesters, (newVal) => {
    saveSemesterSettings(props.year, newVal);
  });
  
  function loadSemesterSettings(year) {
    if (process.client) {
      const settings = localStorage.getItem(`semesters-year-${year}`);
      return settings ? JSON.parse(settings) : [1, 2];
    }
    return [1, 2]; // Default semesters if not in client
  }
  
  function saveSemesterSettings(year, semesters) {
    if (process.client) {
      localStorage.setItem(`semesters-year-${year}`, JSON.stringify(semesters));
    }
  }

  const sortedSemesters = computed(() => {
    return selectedSemesters.value.slice().sort((a, b) => a - b);
  });
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap');
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,500,0,0");



.academic-year-container {
    background-color: #eaeaea;
    border-radius: 40px;
    width: auto;
    display: flex;
    flex-direction: column;
    margin: 6px;
    margin-left: 3px;
    margin-right: 3px;
    border: 3px solid #747474a8;
    transition: 0.2s;
    align-items: center;
    padding: 10px;
    box-shadow: 0px 5px 8px 0px rgba(0, 0, 0, 0.2);
    user-select: none;
}

.yr-tag {
    width: 95%;
    border-radius: 10px 10px 0px 0px;
    border-bottom: 2px dashed #9898985b;
    background-color: none;
    font-family: "Roboto Mono", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 30px;
    font-style: normal;
    font-weight: 700;
    color: #9898989e;
    display: flex;
}

.material-symbols-outlined {
    color: #9898989e;
    margin-right: 0px;
    margin-top: 0px;
    padding: 0px;
    font-size: 40px;
    font-weight: 100;
    cursor: pointer;
    transition: 0.2s;
    width:min-content;
    height:min-content;
    font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
    transition: 0.3s;
}

.material-symbols-outlined:hover {
    color: #484848;
    transition: 0.2s;
}


@media (max-width: 800px) {

.yr-tag {
    font-size: 20px;
    min-height: 30px;
    max-height: 30px;
}

.material-symbols-outlined {
    font-size: 28px;
}

.academic-year-container {
    background-color: #eaeaea;
    border-radius: 40px;
    width: auto;
    display: flex;
    flex-direction: column;
    margin: 6px;
    margin-left: 3px;
    margin-right: 3px;
    border: 3px solid #747474a8;
    transition: 0.2s;
    align-items: center;
    padding:10px;
    padding-bottom: 5px;
    box-shadow: 0px 5px 8px 0px rgba(0, 0, 0, 0.2);
}

}

</style>
  