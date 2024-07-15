<template>
    <div class="settings-content">
        <div class="settings-title">
            Settings
        </div>
        <div class="content">
            <div class="sem-control">
                <p>Select the semesters to display:</p>
                <div>
                <label>
                    <input type="checkbox" v-model="selectedSemesters" :value="1" /> Semester 1
                </label>
                </div>
                <div>
                <label>
                    <input type="checkbox" v-model="selectedSemesters" :value="2" /> Semester 2
                </label>
                </div>
                <div>
                <label>
                    <input type="checkbox" v-model="selectedSemesters" :value="3" /> Intensive Units
                </label>
                </div>
                <button @click="applySettings">Apply</button>
            </div>
        </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    name: 'SettingsContent',
    emits: ['update-semesters'],
    setup(props, { emit }) {
      const selectedSemesters = ref([1, 2]);
  
      const applySettings = () => {
        emit('update-semesters', selectedSemesters.value);
      };
  
      return {
        selectedSemesters,
        applySettings,
      };
    }
  };
  </script>
  
  <style scoped>

    @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap');
    @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,500,0,0");

  .settings-title {
    font-family: "Roboto", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 30px;
    font-style: normal;
    font-size: 30px;
    font-weight: 700;
    margin-bottom: -10px;
    margin-left: 4px;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    min-width: 300px;
    border: 0px grey solid;
    background-color: rgba(187, 187, 187, 0.569);
    min-height: 500px;
    border-radius: 18px;
  }
  </style>
  