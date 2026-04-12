<script setup lang="ts">
import { computed } from "vue";

import EffectDisplay from "@/components/reusable/EffectDisplay.vue";
import type { Achievement } from "@/game/achievements";

interface Props {
    achievement: Achievement;
}

const { achievement } = defineProps<Props>();

const style = computed(() =>
    achievement.completed
        ? achievement.stylePreset.completed
        : achievement.stylePreset.normal
);
</script>

<template>
    <div id="achievement" :style>
        {{ achievement.name }}
        <div id="achievement-description">
            <div style="">
                <strong style="">{{ achievement.name }}</strong>
                ({{ achievement.displayedID }})
            </div>
            {{ achievement.description }}
            <div v-if="achievement.rewardDescription != null" style="">
                Reward: {{ achievement.rewardDescription }}
            </div>
            <div v-if="achievement.rewardEffectObject != null" style="">
                Currently:
                <EffectDisplay :effect="achievement.rewardEffectObject" />
            </div>
        </div>
    </div>
</template>

<style scoped>
@media (min-width: 769px) {
    #achievement {
        width: 7.5vw;
        padding: 10px;
        font-size: 0.75rem;
    }

    #achievement-description {
        padding: 10px;
        font-size: 0.9em;
    }
}

@media (max-width: 768px) {
    #achievement {
        width: 12.5vw;
        font-size: 1.5vw;
    }

    #achievement-description {
        padding: 5px;
        font-size: 1em;
    }
}

#achievement {
    position: relative;
    border: 1px solid;
    aspect-ratio: 1 / 1;
    border-radius: 2px;
    text-align: center;
    padding: 5px;
    width: 100%;
    height: 100%;
}

#achievement-description {
    position: absolute;
    width: 150%;
    background-color: #555555;
    opacity: 0;
    color: white;
    border: none;
    border-radius: 10px;
    right: 25%;
    left: -25%;
    margin: auto;
    transition: all 0.25s;
    z-index: 1;
    pointer-events: none;
    bottom: 75%;
}

#achievement:hover > #achievement-description {
    opacity: 0.8;
}
</style>
