<script setup lang="ts">
import { computed } from "vue";

import { pluralize } from "@/game/format";
import type { Currency } from "@/game/reusable/currency";

interface Props {
    currency: Currency;
}

const { currency } = defineProps<Props>();

const currencyName = computed(() => pluralize(currency.name, currency.amount));
</script>

<template>
    <slot :amount="currency.amount" :currencyName></slot>
</template>
