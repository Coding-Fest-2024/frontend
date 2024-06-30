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

@media (max-width: 768px) {
  .app {
    flex-direction: column;
  }
  .side_bar {
    width: 100%;
  }
}
</style>

<script>

export default {
  components: {
  }
};
</script>
