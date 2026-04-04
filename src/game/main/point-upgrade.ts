import { format } from "@/game/format";
import { Effect } from "@/game/reusable/effect";

import { DimensionalPower } from "../dimensional/dimensional-power";
// import { SpacetimeUpgrades } from "../spacetime/spacetime-upgrades";
import { player } from "../player";
import { Progress } from "../progress";
import { Numeric } from "../reusable/numeric";
import { Purchasable } from "../reusable/purchasable";
import { Points } from "./points";

export const PointUpgrade = new (class extends Purchasable {
    get repeatable() {
        return true;
    }

    get currency() {
        return Points;
    }

    get unlocked() {
        return Progress.reachedPointUpgrades;
    }

    get cost() {
        const costScalingStart = 30;
        const costScalingEffect = 0.04;
        let costBase = 3;
        if (this.boughtAmount >= costScalingStart) {
            costBase +=
                (this.boughtAmount - costScalingStart) * costScalingEffect;
        }
        return new Numeric(10).mul(
            new Numeric(costBase).pow(this.boughtAmount)
        );
    }

    get singularEffect() {
        let singularEffect = new Numeric(2);
        singularEffect = singularEffect.add(DimensionalPower.effect);
        /*if (SpacetimeUpgrades[1].boughtAmount) {
            singularEffect = singularEffect.add(0.2);
        }*/
        return singularEffect;
    }

    get description() {
        return `get ${format(this.singularEffect)}x points`;
    }

    get boughtAmount() {
        return player.pointUpgrades;
    }

    set boughtAmount(value) {
        player.pointUpgrades = value;
    }

    get effectObject() {
        return new Effect(
            (boughtAmount = 0) => this.singularEffect.pow(boughtAmount),
            Effect.MULTIPLY
        );
    }
})();
