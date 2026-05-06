<script setup lang="ts">
import { useTemplateRef } from "vue";

import InfoDisplay from "@/components/shared/InfoDisplay.vue";
import { getSavefile, importSavefile } from "@/game/saving/saving";
import { Themes, CurrentTheme } from "@/game/themes";

const savefileInput = useTemplateRef("savefile-textarea");

function importSave() {
    if (
        window.confirm(
            "Are you sure you really want to import the save? This will override existing data!"
        ) === false
    )
        return;
    try {
        importSavefile(savefileInput.value!.value);
    } catch (e) {
        window.alert(`Error while importing save: ${e}`);
    }
}

async function exportSave() {
    const savefile = getSavefile() ?? "";
    savefileInput.value!.value = savefile ?? "";
    await navigator.clipboard.writeText(savefile);
    window.alert("Successfully copied savefile to clipboard!");
}
</script>

<template>
    Theme:
    <select v-model="CurrentTheme.id">
        <option v-for="(theme, idx) in Themes" :key="idx" :value="idx">
            {{ theme.name }}
        </option>
    </select>
    <textarea
        placeholder="Enter your savefile here..."
        id="savefile-textarea"
        ref="savefile-textarea"
    ></textarea>
    <div id="savefile-grid">
        <button @click="importSave">Import save</button>
        <button @click="exportSave()">Export save</button>
    </div>
    <InfoDisplay>Point Incremental BETA v0.3.1</InfoDisplay>
</template>

<style scoped>
#savefile-textarea {
    width: 100%;
    height: 20vh;
    resize: vertical;
    margin-top: 8px;
    user-select: all;
}

#savefile-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
}

#savefile-grid > button {
    padding: 10px;
}
</style>
