<template>
  
<div class="container">
  <SideBar></SideBar>
  <div class="page-container">
    <ControlBar></ControlBar>
    <SlotsBoard></SlotsBoard>
  </div>
</div>
  
</template>

<script>
import { onMounted } from 'vue';

export default {
    setup() {
        onMounted(() => {
            const pageContainer = document.querySelector('#page-container');
            
            function adjustScale() {
                const screenWidth = window.innerWidth;
                let scale = 1;

                if (screenWidth < 1100) {
                    scale = screenWidth / (1100);
                }

                if (pageContainer) {
                    pageContainer.style.transform = `scale(${scale})`;
                    pageContainer.style.transformOrigin = 'center';
                }
            }

            window.addEventListener('resize', adjustScale);
            adjustScale();
        });
    }
};
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

::-webkit-scrollbar {
    display: none;
}

.container {
  display: flex;
  /* justify-content: center; */
  /* align-items: center;  */
  min-height: 100vh; 
  height: 100vh;
  max-height: 100vh;
  overflow: hidden; 
  z-index: 0;
}

.page-container {
  position: absolute;
  width: 100%;
  overflow: auto;
  transform-origin: top left;
  z-index:1;
  height: 100vh;
  padding-bottom: 10vh;
  padding-top: 5vh;
}

</style>