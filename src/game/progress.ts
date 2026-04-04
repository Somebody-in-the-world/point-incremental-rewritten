import { INFINITY } from "./constants";
import { DimensionalPrestige } from "./dimensional/dimensional";
import { CompressedPointsPrestige } from "./main/compressed-points";
import { PointUpgrade } from "./main/point-upgrade";
import { Points } from "./main/points";
import { SpacetimePrestige } from "./spacetime/spacetime-points";

export const Progress = new (class {
    get reachedPointUpgrades(): boolean {
        return (
            Points.gte(10) ||
            PointUpgrade.boughtAmount > 0 ||
            this.reachedPointCompression
        );
    }

    get reachedPointCompression() {
        return (
            CompressedPointsPrestige.prestigeCount > 0 ||
            Points.gte(100) ||
            this.reachedDimensional
        );
    }

    get reachedAutomationPoints() {
        return (
            CompressedPointsPrestige.prestigeCount > 0 ||
            this.reachedDimensional
        );
    }

    get reachedDimensional() {
        return DimensionalPrestige.prestigeCount > 0;
    }

    get reachedInfinitePoints() {
        return Points.gte(INFINITY);
    }

    get reachedSpacetime() {
        return SpacetimePrestige.prestigeCount > 0;
    }
})();
