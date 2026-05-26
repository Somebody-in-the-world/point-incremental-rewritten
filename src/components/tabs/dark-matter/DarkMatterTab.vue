<script setup lang="ts">
import CurrencyDisplay from "@/components/shared/CurrencyDisplay.vue";
import EffectDisplay from "@/components/shared/EffectDisplay.vue";
import StyledButton from "@/components/shared/StyledButton.vue";
import { DarkGenerators } from "@/game/dark-matter/dark-generator";
import { DarkMatter } from "@/game/dark-matter/dark-matter";
import { format } from "@/game/format";

import DarkGeneratorDisplay from "./DarkGeneratorDisplay.vue";

function buyMaxDarkGenerators() {
    DarkGenerators.forEach((generator) => {
        if (generator.unlocked) generator.bulkPurchase();
    });
}
</script>

<template>
    <CurrencyDisplay :currency="DarkMatter" #default="{ currencyName, amount }">
        <h3>
            You have <span class="dark-matter">{{ format(amount) }}</span>
            {{ currencyName }}, increased by
            <span class="dark-matter">
                ^{{ format(DarkMatter.boostExponent) }}
            </span>
            to a
            <span class="dark-matter">
                <EffectDisplay :effect="DarkMatter.effect" />
            </span>
            boost to point gain
        </h3>
    </CurrencyDisplay>
    <StyledButton
        class="dark-generator"
        stylePreset="darkMatter"
        @click="buyMaxDarkGenerators()"
    >
        Buy max dark generators
    </StyledButton>
    <DarkGeneratorDisplay
        :darkGenerator
        v-for="(darkGenerator, idx) in DarkGenerators"
        :key="idx"
        class="dark-generator"
    />
</template>

<style scoped>
.dark-matter {
    font-size: 1.25em;
    text-shadow: 0px 5px 10px;
}

.dark-generator {
    margin: auto;
    display: block;
}

@media (max-width: 768px) {
    .dark-generator {
        width: 100%;
    }
}

@media (min-width: 769px) {
    .dark-generator {
        width: 70%;
    }
}
</style>
