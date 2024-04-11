<template>
  
<div class="container">
  <div class="page-container">
    <SlotsBoard></SlotsBoard>
  </div>
  <div class="sb-container">
    <ControlBar></ControlBar>
    <SideBar></SideBar>
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

::-webkit-scrollbar {
    display: none;
}

.container {
  display: flex;
  /* justify-content: center;
  align-items: center;  */
  height: 98vh; 
  overflow: hidden; 
  z-index: 0;
  width: 100%;
  /* border: 2px solid #2c3e50; */
  /* margin-top: 3%; */
}

.page-container {
  position:static;
  width: 68%;
  overflow: auto;
  transform-origin: top left;
  z-index:1;
  /* margin-left: 1%; */
  padding: 1%;
}

.sb-container {
  width: 31%;
  padding: 1%;
}

/* test borders */
.sb-container, .page-container {
  border: 2px solid #2c3e50;
}


</style>