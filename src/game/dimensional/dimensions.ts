import type { TupleOf } from "type-fest";

import { Numeric } from "@/game/reusable/numeric";
import { PurchasableConfigless } from "@/game/reusable/purchasable";

import { dimensionsData } from "../data/dimensions";
import { player } from "../player";
import { withEffects } from "../reusable/effect";
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
        player.dimensions.generated[this.id] = value.toDecimal();
    }

    get totalAmount() {
        return this.generatedAmount.add(this.boughtAmount);
    }

    get generationEffect() {
        return this.totalAmount.mul(this.multiplier);
    }

    get description() {
        let suffix = "th";
        if (Math.floor(((this.id + 1) % 100) / 10) !== 2) {
            switch (this.id + 1) {
                case 1:
                    suffix = "st";
                    break;
                case 2:
                    suffix = "nd";
                    break;
                case 3:
                    suffix = "rd";
                    break;
            }
        }
        return `${this.id + 1}${suffix} Dimension`;
    }

    get baseCost() {
        return this.config.baseCost;
    }

    get costMultiplier() {
        return this.config.costMultiplier;
    }

    get multiplier() {
        let multiplier = withEffects(new Numeric(2).pow(this.boughtAmount));
        if (this.id === 0) {
            multiplier = multiplier
                .apply(SpacetimeUpgrades.firstDimBoost.effect)
                .apply(SpacetimeUpgrades.dimPowBoost.effect);
        }
        if (this.id === 2) {
            multiplier = multiplier.apply(
                TearSpacetimeUpgrades.dim3Boost.effect
            );
        }
        multiplier = multiplier.apply(SpacetimeUpgrades.allDimBoost.effect);
        return multiplier.value;
    }

    get cost() {
        return this.baseCost.mul(this.costMultiplier.pow(this.boughtAmount));
    }

    get unlocked() {
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
            Dimensions[i + 1]!.generationEffect.mul(deltaTime)
        );
    }
}

export const Dimensions = dimensionsData.map(
    (config, id) => new Dimension(config, id)
) as TupleOf<8, Dimension>;
