<template>
    <div class="academic-year-container">
        <div class="yr-tag">
            <span class="material-symbols-outlined" @click="showSettings">settings_applications</span>
            <div>Year{{ year }}</div>
        </div>
        <Semester
        v-for="semester in selectedSemesters"
        :key="`year-${year}-semester-${semester}`"
        :semester="semester"
        :year="year"
        />
        <Modal :isVisible="isModalVisible" @close="isModalVisible = false">
        <SettingsContent @update-semesters="updateSemesters" />
        </Modal>
    </div>
</template>


<script setup>
import { ref } from 'vue';
import { store } from '../store';

const props = defineProps({
  year: {
    type: Number,
    required: true
  }
});

const isModalVisible = ref(false);
const selectedSemesters = ref([1, 2]);

const showSettings = () => {
  isModalVisible.value = true;
};

const updateSemesters = (semesters) => {
  selectedSemesters.value = semesters;
};

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

}

</style>
  