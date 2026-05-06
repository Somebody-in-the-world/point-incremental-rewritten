import { Effect, withEffects } from "@/game/core/effect";
import { Numeric } from "@/game/core/numeric";
import { PrestigeCurrency } from "@/game/core/prestige-currency";
import { PrestigeLayer } from "@/game/core/prestige-layer";

import { Achievements } from "../achievements";
import { player } from "../player";
import { SpacetimeChallenges } from "../spacetime/spacetime-challenges";
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
        return withEffects(new Numeric(1)).apply(
            Achievements.getByID("a33").rewardEffect
        ).value;
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
        let exponent = 0.75;
        if (SpacetimeChallenges.noCPAndAP.completed) exponent += 0.025;
        let effect = this.pow(exponent).add(1);
        if (SpacetimeChallenges.noCPAndAP.running) {
            effect = new Numeric(1);
        }
        return new Effect({ formula: () => effect, type: "mul" });
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

    get canPrestige() {
        return Points.gte(100);
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
