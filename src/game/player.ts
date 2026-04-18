import Decimal from "break_eternity.js";
import { reactive } from "vue";

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
    autobuyers: {} as Record<string, { enabled: boolean } | undefined>,
    achievements: Array.from({ length: 100 }, () => false),
    statistics: {
        pointCompressionCount: 0,
        dimensionalCount: 0,
        spacetimeCount: 0,
        timeInCurrentSpacetime: 0,
        fastestSpacetime: null as number | null,
        timePlayed: 0
    },
    options: { theme: "dark" as keyof typeof themesData }
});
