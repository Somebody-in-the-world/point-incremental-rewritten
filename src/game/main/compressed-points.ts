import { Effect } from "@/game/reusable/effect";
import { Numeric } from "@/game/reusable/numeric";
import { PrestigeCurrency } from "@/game/reusable/prestige-currency";
import { PrestigeLayer } from "@/game/reusable/prestige-layer";

import { Achievements } from "../achievements";
import { player } from "../player";
import { SpacetimeMilestones } from "../spacetime/spacetime-milestones";
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

    get gainMultiplier() {
        let multiplier = new Numeric(1);
        if (Achievements.getByID("a33").completed) {
            multiplier = multiplier.mul(10);
        }
        return multiplier;
    }

    get gainAmount(): Numeric {
        if (Points.lt(100)) return new Numeric(0);
        return Points.div(100).pow(0.4).mul(this.gainMultiplier).floor();
    }

    get nextRequirement(): Numeric {
        return this.gainAmount
            .add(1)
            .div(this.gainMultiplier)
            .pow(1 / 0.4)
            .mul(100);
    }

    get effect() {
        return new Effect({
            formula: () => this.pow(0.75).add(1),
            type: "mul"
        });
    }

    get continuousGainAmount() {
        if (!SpacetimeMilestones.autoCompressedPoints.completed)
            return new Numeric(0);
        return this.gainAmount.div(10);
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
        if (!Achievements.getByID("a25").completed) {
            PointUpgrade.boughtAmount = 0;
        }
    }
})();
