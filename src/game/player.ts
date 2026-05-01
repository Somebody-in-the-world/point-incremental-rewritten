import Decimal from "break_eternity.js";
import { reactive } from "vue";

import type { PlayerAutobuyerConfig } from "./autobuyers";
import type { themesData } from "./data/themes";

export const player = reactive({
    points: new Decimal(0),
    pointUpgrades: 0,
    compressedPoints: new Decimal(0),
    automationPointsUnlocked: 0,
    automationPoints: new Decimal(0),
    dimensionalPoints: new Decimal(0),
    dimensionalPower: new Decimal(0),
    dimensions: {
        bought: Array.from({ length: 8 }, () => 0),
        generated: Array.from({ length: 8 }, () => new Decimal(0))
    },
    spacetimePoints: new Decimal(0),
    spacetimeUpgrades: {},
    spacetimePointMultUpgrade: 0,
    spacetimeTore: false,
    tearSpacetimeUpgrades: {},
    autobuyers: {} as PlayerAutobuyerConfig,
    achievements: Array.from({ length: 100 }, () => false),
    statistics: {
        pointCompressionCount: 0,
        dimensionalCount: 0,
        spacetimeCount: 0,
        timeInCurrentSpacetime: 0,
        fastestSpacetime: null as number | null,
        peakSPPerMinute: new Decimal(0),
        SPGainAtPeakPerMin: new Decimal(0),
        timePlayed: 0,
        totalPoints: new Decimal(0)
    },
    options: { theme: "dark" as keyof typeof themesData }
});
