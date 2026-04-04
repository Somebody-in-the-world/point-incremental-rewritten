<script setup lang="ts">
import { SubTabArray, type TabArray } from "@/game/tabs";

interface Props {
    tabs: TabArray | SubTabArray;
}

const { tabs } = defineProps<Props>();
</script>

<template>
    <button
        v-for="(tab, idx) in tabs"
        :key="idx"
        :disabled="tab.isCurrentTab"
        @click="tab.enter()"
    >
        {{ tab.name }}
    </button>
    <div v-if="tabs.current.subtabs.length > 0">
        <hr />
        <TabSwitcher :tabs="tabs.current.subtabs" />
    </div>
</template>
