<script setup lang="ts">
import { format } from "@/game/format";
import { Progress } from "@/game/progress";
import { SpacetimePoints } from "@/game/spacetime/spacetime";

import CurrencyDisplay from "../reusable/CurrencyDisplay.vue";
</script>

<template>
    <CurrencyDisplay
        :currency="SpacetimePoints"
        #default="{ amount, currencyName }"
        v-if="Progress.reachedSpacetime"
    >
        You have <span style="font-size: 1.25rem">{{ format(amount) }}</span>
        {{ currencyName }}
    </CurrencyDisplay>
</template>
