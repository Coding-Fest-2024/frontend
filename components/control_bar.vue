<template>
  <div class="control-bar">
    <!-- <div class="interaction-block-1">
      <div class="block-label">Year of Start</div>
      <t-date-picker id="degreeStartYear" mode="year" allowInput placeholder="Years"/>
    </div> -->
    <div class="interaction-block-2">
      <div class="block-label">Your Degree</div>
      <t-dropdown
        id="degree"
        minColumnWidth="230px"
        :options="degreeOptions"
        hideAfterItemClick
        trigger="click"
        @click="clickHandler"
      >
      <t-button id="degree_button" variant="outline" theme="default" :style="buttonStyle">{{ selectedDegree }}</t-button>
      </t-dropdown>
    </div>
    <div class="interaction-block-3">
      <div class="block-label">Major 1</div>
      <t-dropdown
        id="degree"
        minColumnWidth="190px"
        :options="majorOptions"
        hideAfterItemClick
        trigger="click"
        @click="clickHandlerMajor1"
      >
      <t-button id="major_button" variant="outline" theme="default" :style="buttonStyle">{{ selectedMajor1 }}</t-button>
      </t-dropdown>
    </div>
    <div class="interaction-block-4">
      <div class="block-label">Major 2</div>
      <t-dropdown
        id="degree"
        minColumnWidth="190px"
        :options="majorOptions"
        hideAfterItemClick
        trigger="click"
        @click="clickHandlerMajor2"
      >
      <t-button id="major_button" variant="outline" theme="default" :style="buttonStyle">{{ selectedMajor2 }}</t-button>
      </t-dropdown>
    </div>
    <div class="viewMajor_button" :class="{ 'displayMP': viewMajor }" @click="toggleViewMajor"> <span class="material-symbols-outlined"> list </span> </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { store } from '../store';

interface GroupItem {
  content: string;
  value: number;
}

export default defineComponent({
  name: 'ControlBar',
  setup() {
    const selectedDegree = ref<string>('Select Degree');
    const selectedMajor1 = ref<string>('Select Major');
    const selectedMajor2 = ref<string>('Select Major');
    const buttonStyle = ref({ color: '#8b8b8b'});

    const degreeOptions = ref<GroupItem[]>([
      { content: 'Bachelor of Science', value: 1, },
      { content: 'Bachelor of Advanced Computing', value: 2, }
    ]);

    const majorOptions = ref<GroupItem[]>([
      { content: 'Computer Science', value: 1, },
      { content: 'Software Development', value: 2, },
      { content: 'Computational Data Science', value: 3, },
      { content: 'Cyber Security', value: 4, },
      { content: 'Information Systems', value: 5},
    ]);

    const clickHandler = (data: GroupItem) => {
      selectedDegree.value = data.content;
      store.degree = data.content;
      MessagePlugin.success(`selected: ${store.degree}`);
    };

    const clickHandlerMajor1 = (data: GroupItem) => {
      if (data.content == store.selectedMajor[1] && data.content != null) {
        store.selectedMajor[1] = store.selectedMajor[0];
        store.selectedMajor[0] = data.content
        selectedMajor2.value = selectedMajor1.value;
        selectedMajor1.value = data.content;
        return;
      }
      selectedMajor1.value = data.content;
      store.selectedMajor[0] = data.content;
      MessagePlugin.success(`selected: ${store.selectedMajor[0]}`);
    };

    const clickHandlerMajor2 = (data: GroupItem) => {
      if (data.content == store.selectedMajor[0] && data.content != null) {
        store.selectedMajor[1] = store.selectedMajor[0];
        store.selectedMajor[0] = data.content
        selectedMajor1.value = selectedMajor2.value;
        selectedMajor2.value = data.content;
      }
      selectedMajor2.value = data.content;
      store.selectedMajor[1] = data.content;
      MessagePlugin.success(`selected: ${store.selectedMajor[1]}`);
    };

    const toggleViewMajor = () => {
      store.viewMajor = !store.viewMajor;
    };

    const viewMajor = computed(() => store.viewMajor);
        
    return { selectedDegree, degreeOptions, clickHandler, clickHandlerMajor1, clickHandlerMajor2, buttonStyle, majorOptions, 
      selectedMajor1, selectedMajor2, toggleViewMajor, viewMajor};
  }
});
</script>

  
<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap');


.control-bar {
    display: flex;
    justify-content: center; /* Center children horizontally */
    align-items: center; /* Center children vertically */
    background-color: #eaeaea;
    /* Ensure the component itself has margins auto to center in its parent */
    width: 58vw;
    min-height: 7vw;
    flex-shrink: 0;
    border-radius: 80px;
    box-sizing: border-box;
    margin-left: 12.5%;
    /* Centering the element */
    position: relative;
}

.interaction-block-1 {
    width: 12%;
    min-height: 45px;
    padding: 15px;
    border-radius: 20px;
    margin: 5px;
    cursor: pointer;
    flex-direction: column; /* Stack elements vertically */
    border: 2px solid #989898;
    box-shadow: 0px 6px 6px 0.0px rgba(133, 133, 133, 0.2);
    background-color: none;
    transition: 0.2s;
}

.interaction-block-2 {
    width: 26%;
    min-height: 45px;
    padding: 15px;
    border-radius: 20px;
    margin: 5px;
    cursor: pointer;
    flex-direction: column; /* Stack elements vertically */
    border: 2px solid #989898;
    box-shadow: 0px 4px 4px 0.0px rgba(133, 133, 133, 0.2);
    transition: 0.2s;
}

.interaction-block-3 {
    width: 20%;
    min-height: 45px;
    padding: 15px;
    border-radius: 20px;
    margin: 5px;
    cursor: pointer;
    flex-direction: column; /* Stack elements vertically */
    border: 2px solid #989898;
    box-shadow: 0px 4px 4px 0.0px rgba(133, 133, 133, 0.2);
    transition: 0.2s;
}

.interaction-block-4 {
    width: 20%;
    min-height: 45px;
    padding: 15px;
    border-radius: 20px;
    margin: 5px;
    cursor: pointer;
    flex-direction: column; /* Stack elements vertically */
    border: 2px solid #989898;
    box-shadow: 0px 4px 4px 0.0px rgba(133, 133, 133, 0.2);
    transition: 0.2s;
}
.viewMajor_button .material-symbols-outlined {
    width: 24px;
    min-height: 24px;
    padding: 15px;
    border-radius: 20px;
    margin: 5px;
    cursor: pointer;
    flex-direction: column; /* Stack elements vertically */
    border: 2px solid #989898;
    box-shadow: 0px 4px 4px 0.0px rgba(133, 133, 133, 0.2);
    transition: 0.2s;
}


.interaction-block-1:hover {
    background-color: #f8f8f858;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    transition: 0.2s;
}
.interaction-block-2:hover {
    background-color: #f8f8f858;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    transition: 0.2s;
}
.interaction-block-3:hover {
    background-color: #f8f8f858;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    transition: 0.2s;
}
.interaction-block-4:hover {
    background-color: #f8f8f858;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    transition: 0.2s;
}
.viewMajor_button .material-symbols-outlined:hover{
    background-color: rgba(255, 94, 0, 0.9);
    box-shadow: 0px 0px 8px rgba(255, 102, 0, 0.885);
    color: rgb(244, 244, 244);
    border: 2px solid #ffffff00;
    transition: 0.2s;
    transform: scale(1.05);
}

.viewMajor_button .material-symbols-outlined:active{
    background-color: rgb(255, 102, 0);
    box-shadow: 0px 0px 12px rgba(255, 102, 0, 0.885);
    color: rgb(244, 244, 244);
    transition: 0.2s;
    transform: scale(0.98);
}


.block-label {
  margin-bottom: 5px;
  font-family: "Roboto Mono", monospace;
  font-optical-sizing: auto;
  font-weight: 550;
  font-style: normal;
  font-size: 0.82vw;
}

#degreeStartYear {
    width: 100%; /* Adjust the width as needed */
}

#degree_button {
    width: 100%;
    font-family: "Roboto Mono", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    color: #8b8b8b;
    font-style: italic;
    font-size: 0.78vw;
}

#major_button {
    width: 100%;
    font-family: "Roboto Mono", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    /* font-optical-sizing: auto; */
    font-weight: 400;
    color: #d4d4d4;
    font-style: italic;
    font-size: 0.70vw;
}

</style>
  