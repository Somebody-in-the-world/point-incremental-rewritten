import Decimal from "break_eternity.js";
import { reactive } from "vue";

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
    spacetimeUpgrades: Array.from({ length: 8 }, () => false),
    achievements: Array.from({ length: 100 }, () => false),
    statistics: {
        pointCompressionCount: 0,
        dimensionalCount: 0,
        spacetimeCount: 0,
        timePlayed: 0
    }
});
