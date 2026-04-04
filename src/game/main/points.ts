import { Achievements } from "../achievements";
import { player } from "../player";
import { Currency } from "../reusable/currency";
import { Numeric } from "../reusable/numeric";
//import { SpacetimeUpgrades } from "../spacetime/spacetime-upgrades";
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

    get gainAmount() {
        let pointGain = new Numeric(1);
        pointGain = pointGain.mul(PointUpgrade.effect);
        pointGain = pointGain.mul(CompressedPoints.effect);
        if (Achievements.getByID("a21").unlocked) pointGain = pointGain.mul(10);
        if (Achievements.getByID("a26").unlocked) {
            pointGain = pointGain.mul(
                Achievements.getByID("a26").rewardEffect!
            );
        }
        /*
        if (SpacetimeUpgrades[0].boughtAmount) {
            pointGain = pointGain.mul(SpacetimeUpgrades[0].effect);
        }
            */
        return pointGain;
    }

    get continuousGainAmount(): Numeric {
        return this.gainAmount.mul(AutomationPoints.effect);
    }
})();
