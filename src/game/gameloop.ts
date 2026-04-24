import { Achievements } from "./achievements";
import { runAutobuyers } from "./autobuyers";
import { INFINITY } from "./constants";
import { DimensionalPower } from "./dimensional/dimensional-power";
import { Dimensions } from "./dimensional/dimensions";
import { AutomationPoints } from "./main/automation-points";
import { CompressedPoints } from "./main/compressed-points";
import { Points } from "./main/points";
import { SpacetimePrestige } from "./spacetime/spacetime";
import { Time } from "./time";

let lastTick = performance.now();

function gameLoop(deltaTime: number) {
    Points.continuousGain(deltaTime);
    AutomationPoints.continuousGain(deltaTime);
    CompressedPoints.continuousGain(deltaTime);
    DimensionalPower.continuousGain(deltaTime);
    Dimensions.gain(deltaTime);
    SpacetimePrestige.timeSpent += deltaTime;
}

export function startGameLoop() {
    const now = performance.now();
    let deltaTime = (now - lastTick) / 1000;
    deltaTime *= Time.speed.asNumber;
    Achievements.complete();
    if (Points.gte(INFINITY)) {
        Points.amount = INFINITY;
    } else {
        gameLoop(deltaTime);
    }
    runAutobuyers(deltaTime);
    lastTick = now;
    Time.timePlayed += deltaTime;
    window.requestAnimationFrame(startGameLoop);
}
