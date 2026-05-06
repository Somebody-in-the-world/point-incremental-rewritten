<script setup lang="ts">
import { computed } from "vue";

import {
    canUnlockNextDarkGenerator,
    getNextDarkGeneratorRequirement,
    getUnlockedDarkGenerators,
    unlockNextDarkGenerator
} from "@/game/dark-matter/dark-generator";
import { format } from "@/game/format";

import StyledButton from "../shared/StyledButton.vue";

const nextRequirement = computed(() => getNextDarkGeneratorRequirement());
</script>

<template>
    <StyledButton
        stylePreset="spacetime"
        :disabled="!canUnlockNextDarkGenerator()"
        @click="unlockNextDarkGenerator()"
    >
        <span v-if="nextRequirement">
            Reach {{ format(nextRequirement) }} points to unlock
            {{
                getUnlockedDarkGenerators() === 0
                    ? "dark matter"
                    : "a new dark generator"
            }}
        </span>
        <span v-else> You win! </span>
    </StyledButton>
</template>
