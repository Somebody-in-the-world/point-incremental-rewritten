import { reactive } from "vue";

import { Numeric } from "@/game/core/numeric";

import type { PlayerAutobuyerConfig } from "./autobuyers";
import type { themesData } from "./data/themes";

// hack to make reactive not destroy types
function _reactive<T extends object>(val: T): T {
    return reactive(val) as T;
}

export const player = _reactive({
    points: new Numeric(0),
    pointUpgrades: 0,
    compressedPoints: new Numeric(0),
    automationPointsUnlocked: 0,
    automationPoints: new Numeric(0),
    dimensionalPoints: new Numeric(0),
    dimensionalPower: new Numeric(0),
    dimensions: {
        bought: Array.from({ length: 8 }, () => 0),
        generated: Array.from({ length: 8 }, () => new Numeric(0))
    },
    spacetimePoints: new Numeric(0),
    spacetimeUpgrades: {},
    spacetimePointMultUpgrade: 0,
    spacetimeTore: false,
    tearSpacetimeUpgrades: {},
    spacetimeChallenges: {},
    unlockedSpacetimeChallenges: 0,
    darkMatter: new Numeric(0),
    darkGenerators: Array.from({ length: 6 }, () => 0),
    unlockedDarkGenerators: 0,
    autobuyers: {} as PlayerAutobuyerConfig,
    achievements: Array.from({ length: 100 }, () => false),
    statistics: {
        pointCompressionCount: 0,
        dimensionalCount: 0,
        spacetimeCount: 0,
        timeInCurrentSpacetime: 0,
        fastestSpacetime: null as number | null,
        peakSPPerMinute: new Numeric(0),
        SPGainAtPeakPerMin: new Numeric(0),
        timePlayed: 0,
        totalPoints: new Numeric(0)
    },
    options: { theme: "dark" as keyof typeof themesData }
});
