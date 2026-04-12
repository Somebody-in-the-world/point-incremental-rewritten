<script setup lang="ts">
import { computed } from "vue";

import { Achievements } from "@/game/achievements";

import AchievementDisplay from "./AchievementDisplay.vue";

const totalCompleted = computed(() => Achievements.totalCompleted);
</script>

<template>
    <h3>
        You completed {{ totalCompleted }}/{{ Achievements.length }}
        achievements
    </h3>
    <div id="achievement-container">
        <AchievementDisplay
            v-for="(ach, idx) in Achievements"
            :key="idx"
            :achievement="ach"
        />
    </div>
</template>

<style scoped>
#achievement-container {
    display: grid;
    grid-template-columns: repeat(8, 12.5%);
}

@media (min-width: 769px) {
    #achievement-container {
        margin: 0 15%;
    }
}
</style>
