import { Currency } from "@/game/reusable/currency";
import { withEffects } from "@/game/reusable/effect";
import { Numeric } from "@/game/reusable/numeric";

import { Achievements } from "../achievements";
import { player } from "../player";
import { SpacetimeUpgrades } from "../spacetime/spacetime-upgrades";
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

    get gainAmount(): Numeric {
        return withEffects(new Numeric(1))
            .apply(PointUpgrade.effect)
            .apply(CompressedPoints.effect)
            .apply(SpacetimeUpgrades.timeMult.effect)
            .apply(Achievements.getByID("a21").rewardEffect)
            .apply(Achievements.getByID("a26").rewardEffect).value;
    }

    get continuousGainAmount(): Numeric {
        return this.gainAmount.mul(AutomationPoints.effect);
    }
})();
