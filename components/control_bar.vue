<template>
  <div class="control-bar">
    <div class="interaction-block-1">
      <div class="block-label">Year of Start</div>
      <t-date-picker id="degreeStartYear" mode="year" allowInput placeholder="Years"/>
    </div>
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
  </div>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';

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
      { content: 'CyberSecurity', value: 4, },
      { content: 'Information Systems', value: 5},
    ]);

    const clickHandler = (data: GroupItem) => {
      selectedDegree.value = data.content;
      MessagePlugin.success(`selected: ${data.content}`);
      buttonStyle.value.color = 'black';
    };

    const clickHandlerMajor1 = (data: GroupItem) => {
      selectedMajor1.value = data.content;
      MessagePlugin.success(`selected: ${data.content}`);
      buttonStyle.value.color = 'black';
    };

    const clickHandlerMajor2 = (data: GroupItem) => {
      selectedMajor2.value = data.content;
      MessagePlugin.success(`selected: ${data.content}`);
      buttonStyle.value.color = 'black';
    };
        
    return { selectedDegree, degreeOptions, clickHandler, clickHandlerMajor1, clickHandlerMajor2, buttonStyle, majorOptions, selectedMajor1, selectedMajor2};
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
    padding: 10px;
    background-color: #eaeaea;
    border-radius: 8px;
    /* Ensure the component itself has margins auto to center in its parent */
    transform: translate(0px, -80px);
    width: 58vw;
    min-height: 14vh;
    flex-shrink: 0;
    border-radius: 35px;
    box-sizing: border-box;

    /* Centering the element */
    position: relative;
    left: 50%;
    transform: translate(-65%);
    z-index: 1;
    margin-top: 5%;
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
}

.interaction-block-1:hover {
    background-color: #f8f8f858;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.interaction-block-2:hover {
    background-color: #f8f8f858;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.interaction-block-3:hover {
    background-color: #f8f8f858;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.interaction-block-4:hover {
    background-color: #f8f8f858;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
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
  