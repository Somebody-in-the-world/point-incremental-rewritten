import { Currency } from "@/game/reusable/currency";
import { withEffects } from "@/game/reusable/effect";
import { Numeric } from "@/game/reusable/numeric";

import { Achievements } from "../achievements";
import { player } from "../player";
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
        return withEffects(new Numeric(1))
            .apply(PointUpgrade.effect)
            .apply(CompressedPoints.effect)
            .apply(SpacetimeUpgrades.timeMult.effect)
            .apply(SpacetimeUpgrades.pointSelfBoost.effect)
            .apply(Achievements.getByID("a21").rewardEffect)
            .apply(Achievements.getByID("a26").rewardEffect)
            .apply(Achievements.getByID("a42").rewardEffect)
            .apply(TearSpacetimeUpgrades.totalPointBoost.effect)
            .apply(TearSpacetimeUpgrades.currentPointBoost.effect).value;
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
