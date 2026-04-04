import { Achievements } from "./achievements";
import { INFINITY } from "./constants";
import { DimensionalPower } from "./dimensional/dimensional-power";
import { Dimensions } from "./dimensional/dimensions";
import { AutomationPoints } from "./main/automation-points";
import { CompressedPoints } from "./main/compressed-points";
import { Points } from "./main/points";
import { Time } from "./time";

let lastTick = performance.now();

export function startGameLoop() {
    const now = performance.now();
    let deltaTime = (now - lastTick) / 1000;
    deltaTime *= Time.speed.asNumber;
    Achievements.unlock();
    Points.continuousGain(deltaTime);
    AutomationPoints.continuousGain(deltaTime);
    CompressedPoints.continuousGain(deltaTime);
    DimensionalPower.continuousGain(deltaTime);
    Dimensions.gain(deltaTime);
    if (Points.gte(INFINITY)) {
        Points.amount = INFINITY;
    }
    lastTick = now;
    Time.timePlayed += deltaTime;
    window.requestAnimationFrame(startGameLoop);
}
