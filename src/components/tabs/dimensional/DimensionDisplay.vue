<script setup lang="ts">
import PurchasableDisplay from "@/components/reusable/PurchasableDisplay.vue";
import type { Dimension } from "@/game/dimensional/dimensions";
import { format } from "@/game/format";

interface Props {
    dimension: Dimension;
}

const { dimension } = defineProps<Props>();
</script>

<template>
    <div id="dimension-container">
        <span>
            {{ dimension.description }} ({{ format(dimension.multiplier) }}x)
        </span>
        <span>
            {{ format(dimension.totalAmount) }} ({{
                format(dimension.boughtAmount, { digitsBelowThousand: 0 })
            }})
        </span>
        <PurchasableDisplay :purchasable="dimension" #default="{ cost }">
            Cost: {{ format(cost) }} DP
        </PurchasableDisplay>
    </div>
</template>

<style scoped>
#dimension-container {
    display: flex;
    justify-content: space-between;
}
</style>
