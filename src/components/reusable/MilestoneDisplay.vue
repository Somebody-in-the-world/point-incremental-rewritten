<script setup lang="ts">
import { computed } from "vue";

import { shouldDisplayEffect } from "@/game/reusable/effect";
import type { MilestoneConfigless } from "@/game/reusable/milestone";

import EffectDisplay from "./EffectDisplay.vue";

interface Props {
    milestone: MilestoneConfigless;
}

const { milestone } = defineProps<Props>();

const style = computed(() =>
    milestone.completed
        ? milestone.stylePreset.completed
        : milestone.stylePreset.normal
);
</script>

<template>
    <div id="milestone-container" :style>
        <strong>{{ milestone.name }}</strong>
        {{ milestone.description }}
        <div v-if="milestone.rewardDescription">
            {{ milestone.rewardDescription }}
        </div>
        <div v-if="shouldDisplayEffect(milestone.rewardEffectObject)">
            Currently: <EffectDisplay :effect="milestone.rewardEffect" />
        </div>
    </div>
</template>

<style scoped>
#milestone-container {
    text-align: center;
    padding: 10px;
    border: 1px solid;
    margin: auto;
}

@media (max-width: 768px) {
    #milestone-container {
        width: 100%;
    }
}

@media (min-width: 769px) {
    #milestone-container {
        width: 65%;
    }
}
</style>
