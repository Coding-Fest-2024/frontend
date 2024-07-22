<template>
  <div class="settings-content">
    <div class="settings-title">Settings</div>
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
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';

export default {
  name: 'SettingsContent',
  props: {
    year: {
      type: Number,
      required: true
    }
  },
  emits: ['update-semesters'],
  setup(props, { emit }) {
    const selectedSemesters = ref(loadSemesterSettings(props.year));

    watch(selectedSemesters, (newVal) => {
      emit('update-semesters', newVal);
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

    return {
      selectedSemesters
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
  font-style: normal;
  font-size: 30px;
  font-weight: 700;
  margin-bottom: -10px;
  margin-left: 4px;
}

.content {
  font-family: "Roboto", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-style: normal;
  font-size: 20px;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  min-width: 600px;
  border: 0px grey solid;
  background-color: rgba(210, 210, 210, 0.253);
  min-height: 500px;
  border-radius: 12px;
  padding-top: 20px;
}

@media (max-width: 800px) {
  .content {
    min-width: 300px;
    font-size: medium;
  }
}
</style>
