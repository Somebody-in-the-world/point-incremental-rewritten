<script setup lang="ts">
import MilestoneDisplay from "@/components/reusable/MilestoneDisplay.vue";
import { format } from "@/game/format";
import { SpacetimePrestige } from "@/game/spacetime/spacetime";
import { SpacetimeMilestones } from "@/game/spacetime/spacetime-milestones";
</script>

<template>
    <h3>
        You have spacetimed
        {{
            format(SpacetimePrestige.prestigeCount, { digitsBelowThousand: 0 })
        }}
        times
    </h3>
    <MilestoneDisplay
        v-for="(milestone, idx) in SpacetimeMilestones"
        :key="idx"
        :milestone
    />
</template>
