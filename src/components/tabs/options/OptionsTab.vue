<script setup lang="ts">
import { Themes, CurrentTheme } from "@/game/themes";
</script>

<template>
    Theme:
    <select v-model="CurrentTheme.id">
        <option v-for="(theme, idx) in Themes" :key="idx" :value="idx">
            {{ theme.name }}
        </option>
    </select>
</template>
