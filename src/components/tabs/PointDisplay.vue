<script setup lang="ts">
import CurrencyDisplay from "@/components/reusable/CurrencyDisplay.vue";
import { format } from "@/game/format";
import { Points } from "@/game/main/points";
</script>

<template>
    <CurrencyDisplay :currency="Points" #default="{ amount, currencyName }">
        <h2>You have {{ format(amount) }} {{ currencyName }}</h2>
    </CurrencyDisplay>
</template>
