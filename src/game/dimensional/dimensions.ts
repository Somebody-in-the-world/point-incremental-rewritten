import type { ArrayLength, TupleOf } from "type-fest";

import { Numeric } from "@/game/core/numeric";
import { PurchasableConfigless } from "@/game/core/purchasable";

import { withEffects } from "../core/effect";
import { dimensionsData } from "../data/dimensions";
import { ordinalOf } from "../format";
import { player } from "../player";
import { Progress } from "../progress";
import { SpacetimeChallenges } from "../spacetime/spacetime-challenges";
import { SpacetimeUpgrades } from "../spacetime/spacetime-upgrades";
import { TearSpacetimeUpgrades } from "../spacetime/tear-spacetime";
import { DimensionalPoints } from "./dimensional";

export interface DimensionConfig {
    baseCost: Numeric;
    costMultiplier: Numeric;
}

export class Dimension extends PurchasableConfigless {
    constructor(
        public config: DimensionConfig,
        public readonly id: number
    ) {
        super();
    }

    get repeatable() {
        return true;
    }

    get currency() {
        return DimensionalPoints;
    }

    get boughtAmount() {
        const boughtAmount = player.dimensions.bought[this.id];
        if (boughtAmount === undefined)
            throw new ReferenceError(`Invalid ID: ${this.id}`);
        return boughtAmount;
    }

    set boughtAmount(value) {
        player.dimensions.bought[this.id] = value;
    }

    get generatedAmount() {
        const generatedAmount = player.dimensions.generated[this.id];
        if (generatedAmount === undefined)
            throw new ReferenceError(`Invalid ID: ${this.id}`);
        return new Numeric(generatedAmount);
    }

    set generatedAmount(value) {
        player.dimensions.generated[this.id] = value;
    }

    get totalAmount() {
        return this.generatedAmount.add(this.boughtAmount);
    }

    get production() {
        return this.totalAmount.mul(this.multiplier);
    }

    get description() {
        return `${ordinalOf(this.id + 1)} dimension`;
    }

    get baseCost() {
        return this.config.baseCost;
    }

    get costMultiplier() {
        return this.config.costMultiplier;
    }

    get multiplierPerPurchase() {
        if (SpacetimeChallenges.dimNoPerPurchase.running) return new Numeric(1);
        return withEffects(new Numeric(2)).apply(
            SpacetimeChallenges.dimNoPerPurchase.rewardEffect
        ).value;
    }

    get multiplier() {
        if (SpacetimeChallenges.noDimensions.running) return new Numeric(0);
        let multiplier = withEffects(
            this.multiplierPerPurchase.pow(this.boughtAmount)
        );
        if (this.id === 0) {
            multiplier = multiplier
                .apply(SpacetimeUpgrades.firstDimBoost.effect)
                .apply(SpacetimeUpgrades.dimPowBoost.effect);
        }
        multiplier = multiplier
            .apply(SpacetimeUpgrades.allDimBoost.effect)
            .apply(TearSpacetimeUpgrades.allDimBoost.effect);
        return multiplier.value;
    }

    calculateCost(boughtAmount: number) {
        return this.baseCost.mul(this.costMultiplier.pow(boughtAmount));
    }

    get unlocked() {
        if (Progress.reachedSpacetime) return true;
        if (this.id === 0) return true;
        const boughtAmount = Dimensions[this.id - 1]?.boughtAmount;
        if (boughtAmount === undefined)
            throw new ReferenceError(`Invalid ID: ${this.id}`);
        return Boolean(boughtAmount);
    }
}

export function produceDimensions(deltaTime: number) {
    for (let i = 0; i < Dimensions.length - 1; i++) {
        const dim = Dimensions[i]!;
        dim.generatedAmount = dim.generatedAmount.add(
            Dimensions[i + 1]!.production.mul(deltaTime)
        );
    }
}

export const Dimensions = dimensionsData.map(
    (config, id) => new Dimension(config, id)
) as TupleOf<ArrayLength<typeof dimensionsData>, Dimension>;
