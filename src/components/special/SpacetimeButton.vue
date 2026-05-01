<script setup lang="ts">
import { INFINITY } from "@/game/constants";
import { format } from "@/game/format";
import { SpacetimePoints, SpacetimePrestige } from "@/game/spacetime/spacetime";

import PrestigeButton from "../reusable/PrestigeButton.vue";
</script>

<template>
    <PrestigeButton
        :prestigeLayer="SpacetimePrestige"
        #default="{ currencyName, gainAmount }"
        id="spacetime-button"
    >
        <span v-show="SpacetimePrestige.canPrestige">
            Spacetime for {{ format(gainAmount) }} {{ currencyName }}
            <br />
            <span style="font-size: 0.8em">
                ({{ format(SpacetimePoints.gainPerMinute) }} SP/min, peak
                {{ format(SpacetimePoints.peakPerMinute) }} SP/min at
                {{ format(SpacetimePoints.gainAtPeakPerMinute) }} SP)
            </span>
        </span>
        <span v-show="!SpacetimePrestige.canPrestige">
            Get {{ format(INFINITY) }} points to spacetime
        </span>
    </PrestigeButton>
</template>

<style scoped>
#spacetime-button {
    min-height: 10vh;
}
</style>
