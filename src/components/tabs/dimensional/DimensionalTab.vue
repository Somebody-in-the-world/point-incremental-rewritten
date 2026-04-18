<script setup lang="ts">
import PrestigeLayerButton from "@/components/reusable/PrestigeButton.vue";
import {
    DimensionalPoints,
    DimensionalPrestige
} from "@/game/dimensional/dimensional";
import { DimensionalPower } from "@/game/dimensional/dimensional-power";
import { Dimensions } from "@/game/dimensional/dimensions";
import { format } from "@/game/format";
import { Progress } from "@/game/progress";

import DimensionDisplay from "./DimensionDisplay.vue";

function maxAllDims() {
    for (let i = 7; i >= 0; i--) {
        Dimensions[i]?.bulkPurchase();
    }
}
</script>

<template>
    <h3>You have {{ format(DimensionalPoints.amount) }} dimensional points</h3>
    <PrestigeLayerButton
        :prestigeLayer="DimensionalPrestige"
        #default="{ gainAmount, currencyName, nextRequirement }"
    >
        Convert your points into {{ format(gainAmount) }} {{ currencyName }}
        <span v-if="gainAmount.lt(100)">
            (Next at {{ format(nextRequirement) }} points)
        </span>
    </PrestigeLayerButton>
    <div v-if="Progress.reachedDimensional">
        <h3>
            You have {{ format(DimensionalPower.amount) }} dimensional power,
            adding a {{ format(DimensionalPower.effect.mul(100)) }}% multiplier
            to point upgrade
        </h3>
        <h4 style="margin-bottom: 2px">
            You are getting
            {{ format(DimensionalPower.continuousGainAmount) }} dimensional
            power per second
        </h4>
        <button
            style="display: table; margin: auto; margin-bottom: 10px"
            @click="maxAllDims"
        >
            Max all
        </button>
        <DimensionDisplay
            v-for="(dim, idx) in Dimensions"
            :dimension="dim"
            :key="idx"
            v-show="Dimensions[idx]?.unlocked || Progress.reachedSpacetime"
        />
    </div>
</template>
