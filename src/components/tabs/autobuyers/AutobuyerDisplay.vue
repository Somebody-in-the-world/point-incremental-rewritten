<script setup lang="ts">
import type { Autobuyer } from "@/game/autobuyers";

interface Props {
    autobuyer: Autobuyer;
}

const { autobuyer } = defineProps<Props>();
</script>

<template>
    <div id="autobuyer-display">
        <strong>{{ autobuyer.name }}</strong>
        <br />
        <br />
        Enabled: <input type="checkbox" v-model="autobuyer.enabled" />
    </div>
</template>

<style scoped>
#autobuyer-display {
    padding: 12.5px;
    margin: 2.5px;
    border: 2px solid;
    border-radius: 5px;
    text-align: center;
    display: inline-block;
}
</style>
