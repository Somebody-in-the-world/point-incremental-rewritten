import { Currency } from "@/game/core/currency";
import { withEffects } from "@/game/core/effect";
import { Numeric } from "@/game/core/numeric";

import { Achievements } from "../achievements";
import { DarkMatter } from "../dark-matter/dark-matter";
import { DimensionalPower } from "../dimensional/dimensional-power";
import { player } from "../player";
import { SpacetimeChallenges } from "../spacetime/spacetime-challenges";
import { SpacetimeUpgrades } from "../spacetime/spacetime-upgrades";
import { TearSpacetimeUpgrades } from "../spacetime/tear-spacetime";
import { AutomationPoints } from "./automation-points";
import { CompressedPoints } from "./compressed-points";
import { PointUpgrade } from "./point-upgrade";

export const Points = new (class extends Currency {
    name = "point";

    get value() {
        return player.points;
    }

    set value(value) {
        player.points = value;
    }

    get total() {
        return new Numeric(player.statistics.totalPoints);
    }

    set total(value) {
        player.statistics.totalPoints = value.toDecimal();
    }

    get gainAmount(): Numeric {
        let pointGain = new Numeric(1);
        if (SpacetimeChallenges.dimPowMult.running) {
            pointGain = pointGain.mul(
                Numeric.min(
                    DimensionalPower.amount.pow(0.5).add(1),
                    new Numeric("1e5000")
                )
            );
        }
        pointGain = withEffects(pointGain)
            .apply(PointUpgrade.effect)
            .apply(CompressedPoints.effect)
            .apply(SpacetimeUpgrades.timeMult.effect)
            .apply(SpacetimeUpgrades.pointSelfBoost.effect)
            .apply(Achievements.getByID("a21").rewardEffect)
            .apply(Achievements.getByID("a26").rewardEffect)
            .apply(Achievements.getByID("a42").rewardEffect)
            .apply(TearSpacetimeUpgrades.totalPointBoost.effect)
            .apply(TearSpacetimeUpgrades.spacetimePointBoost.effect)
            .apply(SpacetimeChallenges.pointGainSqrt.rewardEffect)
            .apply(SpacetimeChallenges.dimPowMult.rewardEffect)
            .apply(DarkMatter.effect).value;
        if (SpacetimeChallenges.pointGainSqrt.running) {
            pointGain = pointGain.sqrt();
        }
        return pointGain;
    }

    get continuousGainAmount(): Numeric {
        return this.gainAmount.mul(AutomationPoints.effect);
    }

    postGain(gainAmount: Numeric) {
        this.total = this.total.add(gainAmount);
    }

    postContinousGain(gainAmount: Numeric) {
        this.total = this.total.add(gainAmount);
    }
})();
