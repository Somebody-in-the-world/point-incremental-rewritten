<script setup lang="ts">
import InfoDisplay from "@/components/reusable/InfoDisplay.vue";
import PurchasableGrid from "@/components/reusable/PurchasableGrid.vue";
import StyledButton from "@/components/reusable/StyledButton.vue";
import { format } from "@/game/format";
import {
    TearSpacetime,
    TearSpacetimeUpgrades
} from "@/game/spacetime/tear-spacetime";
import { CurrentTheme } from "@/game/themes";
</script>

<template>
    <InfoDisplay v-if="!TearSpacetime.canTear && !TearSpacetime.tore">
        You must have {{ format(TearSpacetime.requirement) }} spacetime points
        before you can tear spacetime
    </InfoDisplay>
    <StyledButton
        @click="TearSpacetime.tear()"
        :stylePreset="CurrentTheme.buttons('spacetime')"
        id="tear-spacetime-btn"
        :disabled="TearSpacetime.tore"
        v-else
    >
        {{ TearSpacetime.tore ? "Spacetime tore" : "Tear spacetime" }}
    </StyledButton>
    <PurchasableGrid
        :purchasableItems="TearSpacetimeUpgrades"
        v-if="TearSpacetime.tore"
    />
</template>

<style scoped>
#tear-spacetime-btn {
    width: 80%;
    height: 20vh;
    margin: auto;
    display: block;
    font-size: 2.5em;
    border: 2px solid;
    transition: all 1s;
    border-radius: 0;
    margin-bottom: 32px;
}
</style>
