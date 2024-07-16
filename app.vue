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
  height: 98vh;
}

@media (max-width: 760px) {
  .app {
    flex-direction: column;
    height: 93vh;
    overflow: hidden;
  }
  .side_bar {
    width: 100%;
    min-height: 60vh;
    max-height: 60vh;
  }
}
</style>

<script>

export default {
  components: {
  }
};
</script>
