<script setup lang="ts">
import CurrencyDisplay from "@/components/reusable/CurrencyDisplay.vue";
import PrestigeLayerButton from "@/components/reusable/PrestigeLayerButton.vue";
import PurchasableDisplay from "@/components/reusable/PurchasableDisplay.vue";
import { format } from "@/game/format";
import {
    AutomationPoints,
    AutomationPointsSacrifice,
    AutomationPointsUnlock
} from "@/game/main/automation-points";
import {
    CompressedPoints,
    CompressedPointsPrestige
} from "@/game/main/compressed-points";
import { PointUpgrade } from "@/game/main/point-upgrade";
import { Points } from "@/game/main/points";
import { Progress } from "@/game/progress";
</script>

<template>
    <button @click="Points.gain()">
        get {{ format(Points.gainAmount) }} points
    </button>
    <br />
    <PurchasableDisplay
        :purchasable="PointUpgrade"
        :showEffect="false"
        :showNextEffect="false"
        v-if="Progress.reachedPointUpgrades"
    />
    <div v-if="Progress.reachedPointCompression">
        <hr />
        <CurrencyDisplay
            :currency="CompressedPoints"
            #default="{ currencyName, amount }"
        >
            <h3>
                You have {{ format(amount) }} {{ currencyName }}, giving a
                {{ format(CompressedPoints.effect) }}x multiplier to point gain
            </h3>
        </CurrencyDisplay>
        <PrestigeLayerButton
            :prestigeLayer="CompressedPointsPrestige"
            #default="{ gainAmount, currencyName, nextRequirement }"
        >
            Compress your points to get {{ format(gainAmount) }}
            {{ currencyName }}
            <span v-if="gainAmount.lt(100)"
                >(Next at {{ format(nextRequirement) }} points)</span
            >
        </PrestigeLayerButton>
    </div>
    <div v-if="Progress.reachedAutomationPoints">
        <hr />
        <div v-if="AutomationPointsUnlock.boughtAmount">
            <CurrencyDisplay
                :currency="AutomationPoints"
                #default="{ amount, currencyName }"
            >
                <h3>
                    You have {{ format(amount) }} {{ currencyName }}, giving you
                    {{ format(AutomationPoints.effect.mul(100)) }}% of your
                    point gain per second
                </h3>
            </CurrencyDisplay>
            <PrestigeLayerButton
                :prestigeLayer="AutomationPointsSacrifice"
                #default="{ gainAmount, currencyName }"
            >
                Sacrifice your compressed points to gain
                {{ format(gainAmount) }}
                {{ currencyName }}
            </PrestigeLayerButton>
        </div>
        <PurchasableDisplay :purchasable="AutomationPointsUnlock" v-else />
    </div>
</template>
