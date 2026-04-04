import { dimensionsData } from "../data/dimensions";
import { player } from "../player";
import { Numeric } from "../reusable/numeric";
// import { SpacetimeUpgrades } from "../spacetime/spacetime-upgrades";
import { DimensionalPoints } from "./dimensional";

export interface DimensionConfig {
    baseCost: Numeric;
    costMultiplier: Numeric;
}

export class Dimension {
    constructor(
        public config: DimensionConfig,
        public id: number
    ) {}

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
        player.dimensions.generated[this.id] = value.asDecimal;
    }

    get totalAmount() {
        return this.generatedAmount.add(this.boughtAmount);
    }

    get effect() {
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
        const multiplier = new Numeric(2).pow(this.boughtAmount);
        /*if (SpacetimeUpgrades[2].boughtAmount && this.id === 0) {
            multiplier = multiplier.mul(SpacetimeUpgrades[2].effect);
        }*/
        return multiplier;
    }

    get cost() {
        return this.baseCost.mul(this.costMultiplier.pow(this.boughtAmount));
    }

    get unlocked() {
        if (this.id === 0) return 1;
        const boughtAmount = Dimensions[this.id - 1]?.boughtAmount;
        if (boughtAmount === undefined)
            throw new ReferenceError(`Invalid ID: ${this.id}`);
        return boughtAmount;
    }
}
class DimensionArray extends Array<Dimension> {
    gain(deltaTime: number) {
        for (let i = 0; i < this.length - 1; i++) {
            const dim = this[i]!;
            dim.generatedAmount = dim.generatedAmount.add(
                this[i + 1]!.effect.mul(deltaTime)
            );
        }
    }
}

export const Dimensions = new DimensionArray(
    ...dimensionsData.map((config, id) => new Dimension(config, id))
);
