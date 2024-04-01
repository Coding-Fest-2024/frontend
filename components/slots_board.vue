<template>
    <div class="background-rectangle">
    
    </div>
</template>

<script lang="ts">
</script>

<style>
.background-rectangle {
    width: 50vw;
    height: 100vh;
    flex-shrink: 0;
    background-color: #F6F6F6;
    border-radius: 35px;
    box-sizing: border-box;
    padding: 35px;

    /* Centering the element */
    position: relative;
    top: 50%; 
    left: 50%;
    transform: translate(-60%, 10%);
    z-index: 1;
}
</style>