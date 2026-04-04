<script setup lang="ts">
import { computed } from "vue";

import { pluralize } from "@/game/format";
import type { PrestigeLayerCounterless } from "@/game/reusable/prestige-layer";

interface Props {
    prestigeLayer: PrestigeLayerCounterless;
}

const { prestigeLayer } = defineProps<Props>();
const gainAmount = computed(() => prestigeLayer.currency.gainAmount);
const currencyName = computed(() =>
    pluralize(prestigeLayer.currency.name, gainAmount.value)
);
</script>

<template>
    <button :disabled="gainAmount.lte(0)" @click="prestigeLayer.prestige()">
        <slot
            :gainAmount
            :currencyName
            :nextRequirement="prestigeLayer.currency.nextRequirement"
        ></slot>
    </button>
</template>
