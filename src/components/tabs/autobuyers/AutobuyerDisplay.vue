<script setup lang="ts">
import type { Autobuyer, AutobuyerConfig } from "@/game/autobuyers";

interface Props {
    autobuyer: Autobuyer;
}

const { autobuyer } = defineProps<Props>();
</script>

<template>
    <div id="autobuyer-display">
        <strong>{{ autobuyer.name }}</strong>
        <br />
        <div
            v-for="(input, idx) in (autobuyer.config as AutobuyerConfig).inputs"
            :key="idx"
            v-show="autobuyer.inputUnlocked(idx)"
        >
            {{ input.description }}
            <input
                type="text"
                class="autobuyer-input"
                v-model.lazy="
                    autobuyer.playerConfig.inputs[
                        idx as keyof typeof autobuyer.playerConfig.inputs
                    ]
                "
            />
        </div>
        <br />
        Enabled: <input type="checkbox" v-model="autobuyer.enabled" />
    </div>
</template>

<style scoped>
#autobuyer-display {
    padding: 12.5px;
    margin: 2.5px;
    border: 2px solid;
    border-radius: 5px;
    text-align: center;
    display: inline-block;
}

.autobuyer-input {
    width: 100%;
}
</style>
