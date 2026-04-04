import { Achievements } from "../achievements";
import { player } from "../player";
import { Numeric } from "../reusable/numeric";
import { PrestigeCurrency } from "../reusable/prestige-currency";
import { PrestigeLayer } from "../reusable/prestige-layer";
// import { SpacetimeMilestones } from "../spacetime/spacetime-milestones";
import { PointUpgrade } from "./point-upgrade";
import { Points } from "./points";

export const CompressedPoints = new (class extends PrestigeCurrency {
    name = "compressed point";

    get value() {
        return player.compressedPoints;
    }

    set value(value) {
        player.compressedPoints = value;
    }

    get gainAmount() {
        if (Points.lt(100)) return new Numeric(0);
        return Points.div(250).pow(0.4).floor();
    }

    get nextRequirement(): Numeric {
        return this.gainAmount
            .add(1)
            .pow(1 / 0.4)
            .mul(250);
    }

    get effect() {
        return this.pow(0.75).add(1);
    }

    get continuousGainAmount() {
        /* if (!SpacetimeMilestones[3].unlocked) */ return new Numeric(0);
        // return this.gainAmount.div(10);
    }
})();

export const CompressedPointsPrestige = new (class extends PrestigeLayer {
    currency = CompressedPoints;

    get requiredCurrency() {
        return Points;
    }

    get prestigeCount() {
        return player.statistics.pointCompressionCount;
    }

    set prestigeCount(value) {
        player.statistics.pointCompressionCount = value;
    }

    reset() {
        Points.amount = new Numeric(0);
        if (!Achievements.getByID("a25").unlocked) {
            PointUpgrade.boughtAmount = 0;
        }
    }
})();
