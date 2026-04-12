<script setup lang="ts">
import { computed } from "vue";

import { Progress } from "@/game/progress";
import { Tabs } from "@/game/tabs";

import PointDisplay from "./special/PointDisplay.vue";
import SpacetimeButton from "./special/SpacetimeButton.vue";
import SpacetimePointsDisplay from "./special/SpacetimePointsDisplay.vue";
import TabSwitcher from "./tabs/TabSwitcher.vue";

const forceSpacetime = computed(() => Progress.reachedInfinitePoints);
</script>

<template>
    <SpacetimePointsDisplay />
    <PointDisplay />
    <SpacetimeButton v-if="forceSpacetime" />
    <div v-if="!forceSpacetime">
        <!-- TODO: fix this -->
        <TabSwitcher
            :tabs="Tabs.tabs as any"
            :currentTab="Tabs.current as any"
        />
        <hr />
        <component :is="Tabs.currentTabComponent" />
    </div>
</template>
