<template>
  <div class="app">
    <Sidebar class="side_bar"/>
    <SemBoard />
    <DescriptionPanel />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: row;
  overflow: hidden;
  height: 98.5vh;
}

@media (max-width: 800px) {
  .app {
    flex-direction: column;
    /* height: 93vh; */
    overflow: auto;
    height:auto;
  }
  .side_bar {
    width: 100%;
    max-width: 100%;
    height: 60vh;
  }
}
</style>

<script>

export default {
  components: {
  }
};
</script>
