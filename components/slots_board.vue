<template>
    
    <div class="background-rectangle">
        <SemsterBoard></SemsterBoard>
    </div>
</template>

<script lang="ts">
import type { ControlBar } from '#build/components';

</script>

<style>
.background-rectangle {
    width: 58vw;
    min-height: 100vh;
    flex-shrink: 0;
    background-color: #F6F6F6;
    border-radius: 35px;
    box-sizing: border-box;
    padding: 35px;

    /* Centering the element */
    position: relative;
    left: 50%;
    transform: translate(-65%);
    z-index: 0;
    margin-top: 1%;
    align-items: center;
}





</style>