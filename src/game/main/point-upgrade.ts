import { format } from "@/game/format";
import { Effect, withEffects } from "@/game/reusable/effect";
import { Numeric } from "@/game/reusable/numeric";
import { PurchasableConfigless } from "@/game/reusable/purchasable";

import { INFINITY } from "../constants";
import { DimensionalPower } from "../dimensional/dimensional-power";
import { player } from "../player";
import { Progress } from "../progress";
import { SpacetimeUpgrades } from "../spacetime/spacetime-upgrades";
import { TearSpacetimeUpgrades } from "../spacetime/tear-spacetime";
import { Points } from "./points";

export const PointUpgrade = new (class extends PurchasableConfigless {
    private _cachedInfinityThreshold?: number;

    get repeatable() {
        return true;
    }

    get currency() {
        return Points;
    }

    get unlocked() {
        return Progress.reachedPointUpgrades;
    }

    private _calcPreInfinityCost(boughtAmount: number) {
        const costScalingStart = withEffects(new Numeric(30))
            .apply(SpacetimeUpgrades.pointUpgradeCostDelay.effect)
            .value.toNumber();
        const costScalingEffect = 0.04;
        let costBase = 3;
        if (boughtAmount >= costScalingStart) {
            costBase += (boughtAmount - costScalingStart) * costScalingEffect;
        }
        const cost = new Numeric(10).mul(
            new Numeric(costBase).pow(boughtAmount)
        );
        return cost;
    }

    private get preInfinityCost() {
        return this._calcPreInfinityCost(this.boughtAmount);
    }

    private get infinityThreshold() {
        if (this._cachedInfinityThreshold) return this._cachedInfinityThreshold;
        let low = 1;
        let high = 1;
        let ans = 0;
        while (this._calcPreInfinityCost(high).lte(INFINITY)) high *= 2;
        while (low <= high) {
            const mid = low + Math.floor((high - low) / 2);
            if (this._calcPreInfinityCost(mid).gte(INFINITY)) {
                ans = mid;
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        this._cachedInfinityThreshold = ans;
        return ans;
    }

    private get postInfCostMultIncrease() {
        return withEffects(new Numeric(10)).apply(
            TearSpacetimeUpgrades.pointUpgradeCostMultiReduction.effect
        ).value;
    }

    get cost() {
        let cost: Numeric;
        const infThreshold = this.infinityThreshold;
        if (this.boughtAmount >= infThreshold) {
            cost = new Numeric("1e310").mul(
                new Numeric(10).pow(
                    ((this.boughtAmount - infThreshold) *
                        (6 +
                            (this.boughtAmount - infThreshold - 1) *
                                this.postInfCostMultIncrease
                                    .log10()
                                    .toNumber())) /
                        2
                )
            );
        } else {
            cost = this.preInfinityCost;
        }
        return cost;
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

    get freeAmount() {
        return withEffects(new Numeric(0))
            .apply(TearSpacetimeUpgrades.freePointUpgrades.effect)
            .value.toNumber();
    }

    get effectObject() {
        return new Effect({
            formula: (boughtAmount) =>
                this.singularEffect.pow(boughtAmount + this.freeAmount),
            type: "mul"
        });
    }
})();
