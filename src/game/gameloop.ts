import { Achievements } from "./achievements";
import { runAutobuyers } from "./autobuyers";
import { INFINITY } from "./constants";
import { DarkMatter } from "./dark-matter/dark-matter";
import { DimensionalPoints } from "./dimensional/dimensional";
import { DimensionalPower } from "./dimensional/dimensional-power";
import { produceDimensions } from "./dimensional/dimensions";
import { AutomationPoints } from "./main/automation-points";
import { CompressedPoints } from "./main/compressed-points";
import { Points } from "./main/points";
import { SpacetimePoints, SpacetimePrestige } from "./spacetime/spacetime";
import { unlockSpacetimeChallenge } from "./spacetime/spacetime-challenges";
import { TearSpacetime } from "./spacetime/tear-spacetime";
import { Time } from "./time";

let lastTick = performance.now();

function gameLoop(deltaTime: number) {
    Points.continuousGain(deltaTime);
    AutomationPoints.continuousGain(deltaTime);
    CompressedPoints.continuousGain(deltaTime);
    DimensionalPower.continuousGain(deltaTime);
    produceDimensions(deltaTime);
    SpacetimePoints.calcPeak();
    unlockSpacetimeChallenge();
    DimensionalPoints.continuousGain(deltaTime);
    DarkMatter.continuousGain(deltaTime);
}

export function startGameLoop() {
    const now = performance.now();
    let deltaTime = (now - lastTick) / 1000;
    deltaTime *= Time.speed.toNumber();

    Time.timePlayed += deltaTime;
    SpacetimePrestige.timeSpent += deltaTime;

    Achievements.complete();
    if (Points.gte(INFINITY) && !TearSpacetime.tore) {
        Points.amount = INFINITY;
    } else {
        gameLoop(deltaTime);
    }
    runAutobuyers(deltaTime);
    lastTick = now;
    window.requestAnimationFrame(startGameLoop);
}
