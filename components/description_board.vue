<template>
    <div ref="sidebar" class="side_bar">
        
    </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

export default {
    setup() {
        const sidebar: Ref<HTMLElement | null> = ref(null);

        const updateSidebarPosition = () => {
            if (sidebar.value) {
                const scrollAmount = window.scrollY;
                const offset = scrollAmount * 0.1;
                sidebar.value.style.transform = `translate3d(87%, -50%, 0)`;
            }
        };

        return {
            sidebar
        };
  },
};
</script>

<style>
.side_bar {
    width: 25vw;
    height: 105vh;
    flex-shrink: 0;
    background-color: #E1E1E1;
    border-radius: 35px;
    box-sizing: border-box;
    padding: 35px;
    /* Centering the element */
    position: fixed;
    /* margin-top: 20%; */
    left: 50%;
    transform: translate(87%, -13%);
    z-index: 2;
}
</style>