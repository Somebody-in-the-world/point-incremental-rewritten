<script setup lang="ts">
import { computed, ref } from "vue";

import { format, pluralize } from "@/game/format";
import type { Purchasable } from "@/game/reusable/purchasable";

import EffectDisplay from "./EffectDisplay.vue";

interface Props {
    purchasable: Purchasable;
    showEffect?: boolean;
    showNextEffect?: boolean;
}

const {
    purchasable,
    showEffect = true,
    showNextEffect = true
} = defineProps<Props>();

const effect = computed(() => purchasable.effectObject);
const boughtAmount = computed(() => purchasable.boughtAmount);
const requiredCurrencyName = computed(() =>
    pluralize(purchasable.currency.name, purchasable.cost)
);

const hovered = ref(false);

const style = computed(() => {
    const preset = purchasable.stylePreset;
    if (!purchasable.canPurchase) {
        return preset.unpurchasable;
    }

    if (purchasable.reachedCap) {
        return preset.purchased;
    }

    if (hovered.value) {
        return preset.hovered;
    }

    return preset.normal;
});
</script>

<template>
    <button
        :disabled="!purchasable.canPurchase"
        @click="purchasable.purchase()"
        :style
        @mouseenter="hovered = true"
        @mouseleave="hovered = false"
    >
        <slot
            :description="purchasable.description"
            :cost="purchasable.cost"
            :requiredCurrencyName
            :boughtAmount
            :effect
        >
            {{ purchasable.description }}
            <br />
            {{ purchasable.reduceCurrency ? "Cost" : "Requires" }}:
            {{ format(purchasable.cost) }} {{ requiredCurrencyName }}
            <div v-if="effect !== null">
                <div v-if="showEffect">
                    Currently:
                    <EffectDisplay :effect :boughtAmount />
                </div>
                <div v-if="showNextEffect">
                    Next:
                    <EffectDisplay :effect :boughtAmount="boughtAmount + 1" />
                </div>
            </div>
        </slot>
    </button>
</template>
