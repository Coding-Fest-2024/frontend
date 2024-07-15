<template>
    <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <span class="material-symbols-outlined" @click="closeModal">close</span>
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isVisible: {
        type: Boolean,
        required: true
      }
    },
    methods: {
      closeModal() {
        this.$emit('close');
      }
    }
  };
  </script>
  
  <style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(117, 117, 117, 0.5); /* Change to red for visibility */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
  
  .modal-content {
    background: rgb(255, 255, 255);
    padding: 15px;
    border-radius: 30px;
    position: relative;
    border: 5px solid #181818ef;
  }

  .material-symbols-outlined {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 22px;
    cursor: pointer;
    font-weight: bold;
    font-variation-settings:
    'FILL' 0,
    'wght' 700,
    'GRAD' 0,
    'opsz' 24
}
  </style>
  