import { format } from "@/game/format";
import { Effect, withEffects } from "@/game/reusable/effect";
import { Numeric } from "@/game/reusable/numeric";
import { PurchasableConfigless } from "@/game/reusable/purchasable";

import { DimensionalPower } from "../dimensional/dimensional-power";
import { player } from "../player";
import { Progress } from "../progress";
import { SpacetimeUpgrades } from "../spacetime/spacetime-upgrades";
import { Points } from "./points";

export const PointUpgrade = new (class extends PurchasableConfigless {
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
        const costScalingStart = withEffects(new Numeric(30)).apply(
            SpacetimeUpgrades.pointUpgradeCostDelay.effect
        ).value.asNumber;
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
        if (SpacetimeUpgrades.baseIncrease.boughtAmount) {
            singularEffect = singularEffect.add(0.2);
        }
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
        return new Effect({
            formula: (boughtAmount = 0) =>
                this.singularEffect.pow(boughtAmount),
            type: "mul"
        });
    }
})();
