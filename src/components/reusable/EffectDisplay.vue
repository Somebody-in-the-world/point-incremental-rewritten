<script setup lang="ts">
import { computed } from "vue";

import type { Effect } from "@/game/reusable/effect";

interface Props {
    effect: Effect;
    boughtAmount: number;
}

const { effect, boughtAmount } = defineProps<Props>();

const formattedEffect = computed(() =>
    effect.formatter(effect.formula(boughtAmount))
);
</script>

<template>
    {{ formattedEffect }}
</template>
