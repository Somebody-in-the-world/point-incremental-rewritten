import "./css/main.css";
import { createApp } from "vue";

import GameUI from "./components/GameUI.vue";
import { Numeric } from "./game/core/numeric";
import { dev } from "./game/dev";
import { player } from "./game/player";
import { loadSave, saveGame } from "./game/saving/saving";
import { CurrentTheme } from "./game/themes";

export function init() {
    Object.defineProperty(window, "player", { value: player });
    Object.defineProperty(window, "Numeric", { value: Numeric });
    Object.defineProperty(window, "dev", { value: dev });
    loadSave();
    const app = createApp(GameUI);
    app.mount("#app");
    CurrentTheme.apply();
}

export function startSaving() {
    saveGame();
    setTimeout(startSaving, 15 * 1000);
}
