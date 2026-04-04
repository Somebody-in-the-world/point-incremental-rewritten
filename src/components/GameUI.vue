<script setup lang="ts">
import { Tabs } from "@/game/tabs";

import PointDisplay from "./tabs/PointDisplay.vue";
import TabSwitcher from "./tabs/TabSwitcher.vue";
</script>

<template>
    <PointDisplay />
    <TabSwitcher :tabs="Tabs" />
    <hr />
    <component :is="Tabs.currentTabComponent" />
</template>
