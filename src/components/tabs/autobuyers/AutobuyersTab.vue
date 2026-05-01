<script setup lang="ts">
import { Autobuyers } from "@/game/autobuyers";

import AutobuyerDisplay from "./AutobuyerDisplay.vue";
</script>

<template>
    <div id="autobuyer-container">
        <AutobuyerDisplay
            :autobuyer
            v-for="(autobuyer, idx) in Autobuyers"
            :key="idx"
            v-show="autobuyer.unlocked"
        />
    </div>
</template>

<style scoped>
#autobuyer-container {
    display: grid;
}

@media (max-width: 768px) {
    #autobuyer-container {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (min-width: 769px) {
    #autobuyer-container {
        grid-template-columns: repeat(4, minmax(0, 1fr));
        margin: 0 15%;
    }
}
</style>
