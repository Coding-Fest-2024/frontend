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
    height: 98.0vh;
    overflow: hidden;
  }
  .side_bar {
    width: 100%;
    height: 150%;
  }
}
</style>

<script>

export default {
  components: {
  }
};
</script>
