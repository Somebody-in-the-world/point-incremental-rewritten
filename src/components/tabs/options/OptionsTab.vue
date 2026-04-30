<script setup lang="ts">
import InfoDisplay from "@/components/reusable/InfoDisplay.vue";
import { Themes, CurrentTheme } from "@/game/themes";
</script>

<template>
    Theme:
    <select v-model="CurrentTheme.id">
        <option v-for="(theme, idx) in Themes" :key="idx" :value="idx">
            {{ theme.name }}
        </option>
    </select>
    <InfoDisplay>Point Incremental BETA v0.1.0</InfoDisplay>
</template>
