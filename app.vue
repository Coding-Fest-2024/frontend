<template>
  <div class="app">
    <Sidebar class="side_bar"/>
    <SemBoard />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: row;
  overflow: hidden;
  height: 98.5vh;
}

@media (max-width: 760px) {
  .app {
    flex-direction: column;
    /* height: 93vh; */
    overflow: auto;
    height:auto;
  }
  .side_bar {
    width: 100%;
    min-height: 90vh;
    max-height: 90vh;
  }
}
</style>

<script>

export default {
  components: {
  }
};
</script>
