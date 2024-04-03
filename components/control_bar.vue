<template>
  <div class="control-bar">
    <div v-for="dropdown in dropdowns" :key="dropdown.id" class="dropdown">
      <button @click="toggleDropdown(dropdown.id)">
        {{ dropdown.name }}
      </button>
      <div v-show="dropdown.id === activeDropdown" class="dropdown-content">
        <a href="#" v-for="item in dropdown.items" :key="item" class="dropdown-item">
          {{ item }}
        </a>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ControlBar',
  setup() {
    const activeDropdown = ref<number | null>(null);  // Specify the type as number or null

    const dropdowns = ref([
      { id: 1, name: 'Degree', items: ['Bachelor of Science', 'Advanced Computing'] },
      { id: 2, name: 'Dropdown 2', items: ['Item 3', 'Item 4'] },
      { id: 3, name: 'Dropdown 3', items: ['Item 5', 'Item 6'] },
      { id: 4, name: 'Dropdown 4', items: ['Item 7', 'Item 8'] },
    ]);

    // Specify the type of the parameter `id`
    const toggleDropdown = (id: number) => {
      if (activeDropdown.value === id) {
        activeDropdown.value = null;
      } else {
        activeDropdown.value = id;
      }
    };

    return { dropdowns, activeDropdown, toggleDropdown };
  }
});
</script>

  
<style scoped>

.control-bar {
    display: flex;
    justify-content: center; /* Center children horizontally */
    align-items: center; /* Center children vertically */
    padding: 10px;
    background-color: #eee;
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

.dropdown {
    position: relative;
    margin: 0 10px;
    
}

.dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    padding: 12px 16px;
    z-index: 10;
}

.dropdown-content a {
    padding: 12px 16px;
    display: block;
}

.dropdown-content a:hover {
    background-color: #f1f1f1;
}

.dropdown:hover .dropdown-content {
    display: block;
}

</style>
  