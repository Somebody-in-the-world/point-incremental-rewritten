<script setup lang="ts">
import { SpacetimePrestige } from "@/game/spacetime/spacetime";

import PrestigeLayerButton from "../reusable/PrestigeButton.vue";
</script>

<template>
    <h3 style="text-align: center">
        The points you produced overwhelmed the spacetime;
        <br />
        you must collapse it in order to create more points
    </h3>
    <PrestigeLayerButton
        :prestigeLayer="SpacetimePrestige"
        id="spacetime-button"
    >
        Collapse spacetime
    </PrestigeLayerButton>
</template>

<style scoped>
#spacetime-button {
    width: 80%;
    height: 20vh;
    margin: auto;
    display: block;
    font-size: 2.5em;
    border: 2px solid white;
    background-color: black;
    color: white;
    transition: all 0.5s;
    border-radius: 0;
    margin-bottom: 32px;
}

#spacetime-button:hover {
    background-color: white;
    color: black;
    border-color: black;
}
</style>
