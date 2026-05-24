<script setup lang="ts">
import PurchasableDisplay from "@/components/shared/PurchasableDisplay.vue";
import PurchasableGrid from "@/components/shared/PurchasableGrid.vue";
import StyledButton from "@/components/shared/StyledButton.vue";
import {
    SpacetimePointMultUpgrade,
    SpacetimeUpgrades
} from "@/game/spacetime/spacetime-upgrades";
</script>

<template>
    <div id="spacetime-point-mult-upgrade">
        <StyledButton
            stylePreset="spacetime"
            style="padding: 10px"
            @click="SpacetimePointMultUpgrade.bulkPurchase()"
        >
            Buy max spacetime point multipliers
        </StyledButton>
        <PurchasableDisplay :purchasable="SpacetimePointMultUpgrade" />
    </div>
    <br />
    <PurchasableGrid :purchasableItems="SpacetimeUpgrades" />
</template>

<style scoped>
#spacetime-point-mult-upgrade {
    margin: auto;
    display: grid;
}

@media (max-width: 768px) {
    #spacetime-point-mult-upgrade {
        width: 100%;
    }
}

@media (min-width: 769px) {
    #spacetime-point-mult-upgrade {
        width: 35%;
    }
}
</style>
