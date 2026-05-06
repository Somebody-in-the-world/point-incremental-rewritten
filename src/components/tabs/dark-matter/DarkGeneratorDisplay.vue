<script setup lang="ts">
import PurchasableDisplay from "@/components/shared/PurchasableDisplay.vue";
import type { DarkGenerator } from "@/game/dark-matter/dark-generator";
import { format } from "@/game/format";

interface Props {
    darkGenerator: DarkGenerator;
}

const { darkGenerator } = defineProps<Props>();
</script>

<template>
    <PurchasableDisplay
        :purchasable="darkGenerator"
        v-slot="{ requiredCurrencyName, boughtAmount, cost, description }"
    >
        <strong>{{ description }}</strong> ({{ boughtAmount }})
        <br />
        <span v-if="darkGenerator.id === 0">
            Generating
            {{ format(darkGenerator.production) }} dark matter per second
        </span>
        <span v-else>
            Multiplying tier {{ darkGenerator.id }} dark generators' production
            by {{ format(darkGenerator.production) }}x
        </span>
        <br />
        Cost: {{ format(cost) }} {{ requiredCurrencyName }}
    </PurchasableDisplay>
</template>
